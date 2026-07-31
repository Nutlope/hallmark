#!/usr/bin/env node
// The agent's side of the hallmark variants bridge. Filesystem queue plus one
// loopback POST for --stop.
//
//   node await.mjs --run <run-dir> [--timeout 540]
//     Blocks until the picker queues a request (a pick or a riff), claims it
//     by atomic rename to .working, prints its JSON to stdout, exits 0.
//     Exit 2 = idle timeout (just re-run). Exit 1 = hard error (stderr).
//
//   node await.mjs --run <run-dir> --drain
//     Claims EVERYTHING queued right now and prints a JSON array, never
//     blocks. Exit 2 = nothing waiting.
//
//   node await.mjs --run <run-dir> --ack <id> [--note "<line>"]
//     Closes a previously claimed request: moves its .working file to
//     requests/done/ (with ackedAt and the optional note). Combinable with
//     a blocking or --drain call in the same invocation.
//
//   node await.mjs --run <run-dir> --stop
//     POSTs /api/shutdown to the server recorded in server.json, then
//     clears server.json.
//
// A .working file older than 5 minutes is an orphan (crashed agent) and is
// redelivered with "redelivered": true before anything new. Claiming touches
// the file's mtime so the 5-minute clock starts at the claim.

import fs from "node:fs";
import path from "node:path";
import { parseArgs, runPaths, readJsonSafe, statMtime, httpPostJson, nowIso } from "./core.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.run || args.run === true) { console.error("await.mjs: --run <run-dir> is required"); process.exit(1); }
const P = runPaths(args.run);
const TIMEOUT_MS = Math.max(2, Number(args.timeout ?? 540)) * 1000;
const ORPHAN_MS = 5 * 60 * 1000;

function out(obj, code) {
  process.stdout.write(JSON.stringify(obj) + "\n", () => process.exit(code));
}

function listQueued() {
  try { return fs.readdirSync(P.REQ).filter((f) => f.endsWith(".json")).sort(); } catch { return []; }
}
function listWorking() {
  try { return fs.readdirSync(P.REQ).filter((f) => f.endsWith(".json.working")).sort(); } catch { return []; }
}
function readJson(p) {
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return null; }
}
function touch(p) {
  try { const now = new Date(); fs.utimesSync(p, now, now); } catch { /* ignore */ }
}
function isOrphan(f) {
  const m = statMtime(path.join(P.REQ, f));
  return m != null && Date.now() - m >= ORPHAN_MS;
}

// ---- --stop: shut the server down and clear server.json ---------------------
if (args.stop) {
  const sj = readJsonSafe(P.SERVER_JSON).json;
  let stopped = false;
  if (sj?.port) stopped = (await httpPostJson(sj.port, "/api/shutdown"))?.ok === true;
  try { fs.rmSync(P.SERVER_JSON, { force: true }); } catch { /* ignore */ }
  out({ stopped, port: sj?.port ?? null }, 0);
  await new Promise(() => {}); // park until the exit callback fires
}

if (!fs.existsSync(P.REQ)) { console.error(`await.mjs: no requests/ under ${P.RUN}. Run start.mjs first.`); process.exit(1); }
fs.mkdirSync(P.REQ_DONE, { recursive: true });

// ---- fold in the previous ack ----------------------------------------------
if (args.ack) {
  const id = String(args.ack);
  const working = listWorking().find((f) => f.startsWith(id + "-"));
  if (working) {
    const p = path.join(P.REQ, working);
    const json = readJson(p) ?? { id };
    json.ackedAt = nowIso();
    if (args.note) json.note = String(args.note).slice(0, 300);
    fs.writeFileSync(path.join(P.REQ_DONE, working.replace(/\.working$/, "")), JSON.stringify(json, null, 2) + "\n");
    fs.rmSync(p, { force: true });
  } else {
    // Idempotent: acking something already closed is a warning, not an error.
    console.error(`await.mjs: nothing claimed under id ${id} (already acked?)`);
  }
  if (!args.drain && args.timeout == null) process.exit(0); // pure ack call
}

function claimFile(f) {
  const from = path.join(P.REQ, f);
  const to = from + ".working";
  try { fs.renameSync(from, to); } catch { return null; } // loser of a race
  touch(to);
  return readJson(to);
}

// ---- drain: claim everything queued, print an array, never block ------------
if (args.drain) {
  const batch = [];
  for (const w of listWorking()) {
    if (!isOrphan(w)) continue;
    const p = path.join(P.REQ, w);
    const j = readJson(p);
    if (j) { j.redelivered = true; touch(p); batch.push(j); }
  }
  for (const f of listQueued()) {
    const j = claimFile(f);
    if (j) batch.push(j);
  }
  out(batch, batch.length ? 0 : 2);
} else {
  mainBlocking();
}

// ---- blocking: orphan first, then oldest queued, then wait ------------------
function redeliverOrphan() {
  const w = listWorking().find(isOrphan);
  if (!w) return false;
  const p = path.join(P.REQ, w);
  const json = readJson(p);
  if (!json) return false;
  json.redelivered = true;
  touch(p);
  out(json, 0);
  return true;
}

function claimOne() {
  for (const f of listQueued()) {
    const json = claimFile(f);
    if (!json) continue;
    out(json, 0);
    return true;
  }
  return false;
}

function mainBlocking() {
  if (redeliverOrphan() || claimOne()) return;
  const deadline = Date.now() + TIMEOUT_MS;
  let watcher = null;
  try { watcher = fs.watch(P.REQ, () => attempt()); } catch { /* poll only */ }
  const pollTimer = setInterval(attempt, 2000);

  function attempt() {
    if (claimOne()) { cleanup(); return; }
    if (Date.now() >= deadline) {
      cleanup();
      out({ type: "idle", waitedMs: TIMEOUT_MS, queued: 0 }, 2);
    }
  }
  function cleanup() {
    clearInterval(pollTimer);
    try { watcher?.close(); } catch { /* ignore */ }
  }
}
