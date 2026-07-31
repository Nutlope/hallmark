#!/usr/bin/env node
// hallmark variants picker server. Zero dependencies, binds 127.0.0.1 only.
// Internal: start.mjs spawns this detached; run it by hand only to debug.
//
//   node serve.mjs --run <run-dir> [--port 4180]
//
// Serves the picker page at /, the run's greenfield direction folders at
// /frame/<n>/, the overlay chip at /chip.js (CORS *, so routes-mode pages on
// the user's dev server can load it), and a tiny queue API: POST /api/pick
// writes requests/NNNN-<action>.json which the agent claims via await.mjs.
// The manifest is re-read from disk on every request, so agent edits show up
// on the picker's next 2s poll with no restart.
//
// Port: tries 4180, walks up to 4189 on EADDRINUSE. Writes
// .hallmark/variants/server.json ({port, pid, run, startedAt}) next to the
// run dir on listen. Self-shuts-down after 30 min without /api/state polls.

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import {
  parseArgs, runPaths, readJsonSafe, atomicWrite, nowIso, defaultManifest,
  nextRequestId, MIME, buildPickerPage, buildChipJs, buildInjectJs,
} from "./core.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.run || args.run === true) { console.error("serve.mjs: --run <run-dir> is required"); process.exit(1); }
const P = runPaths(args.run);
const PORT_WANTED = Number(args.port ?? 4180);
const PORT_MAX = 4189;
const IDLE_MS = 30 * 60 * 1000;

fs.mkdirSync(P.REQ_DONE, { recursive: true });

const PICKER_HTML = buildPickerPage();
const CHIP_JS = buildChipJs();

let boundPort = null;
let lastPoll = Date.now();

// ---------------------------------------------------------------------------
// manifest: always fresh from disk (the agent edits it between polls)

function readManifest() {
  const { json } = readJsonSafe(P.MANIFEST);
  return json && typeof json === "object" && !Array.isArray(json) ? json : defaultManifest(P.RUN_ID);
}

// ---------------------------------------------------------------------------
// queue

function createRequest(action, fields) {
  const id = nextRequestId(P);
  const req = { id, action, ...fields, createdAt: nowIso() };
  atomicWrite(path.join(P.REQ, `${id}-${action}.json`), JSON.stringify(req, null, 2) + "\n");
  console.log(`[${nowIso()}] queued ${id}-${action}.json`);
  return id;
}

// ---------------------------------------------------------------------------
// http plumbing

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function send(res, code, body, headers = {}) {
  res.writeHead(code, { "Cache-Control": "no-store", ...headers });
  res.end(body);
}

function sendJson(res, code, obj, headers = {}) {
  send(res, code, JSON.stringify(obj), { "Content-Type": "application/json", ...headers });
}

async function readBody(req) {
  let buf = "";
  for await (const chunk of req) {
    buf += chunk;
    if (buf.length > 1_000_000) throw new Error("body too large");
  }
  return buf ? JSON.parse(buf) : {};
}

// ---------------------------------------------------------------------------
// /frame/<n>/* : static-serve v<n>/ from the run dir (greenfield mode only)

function serveFrame(res, pathname) {
  const manifest = readManifest();
  if (manifest.mode !== "greenfield") return send(res, 404, "frames are greenfield-only; this run previews routes on the dev server");
  const rest = pathname.slice("/frame/".length);
  const slash = rest.indexOf("/");
  const n = Number(slash === -1 ? rest : rest.slice(0, slash));
  if (!Number.isInteger(n) || n < 1 || n > 99) return send(res, 404, "expected /frame/<n>/");
  if (slash === -1) return send(res, 302, "", { Location: `/frame/${n}/` });
  let rel;
  try { rel = decodeURIComponent(rest.slice(slash + 1)); } catch { return send(res, 400, "bad path"); }
  const dir = path.join(P.RUN, "v" + n);
  let file = path.normalize(path.join(dir, rel));
  if (file !== dir && !file.startsWith(dir + path.sep)) return send(res, 403, "no");
  let stat = null;
  try { stat = fs.statSync(file); } catch { /* fall through */ }
  if (stat?.isDirectory()) { file = path.join(file, "index.html"); stat = null; }
  if (rel === "" || rel.endsWith("/")) file = path.normalize(path.join(dir, rel, "index.html"));
  let body;
  try { body = fs.readFileSync(file); } catch { return send(res, 404, "not found"); }
  return send(res, 200, body, { "Content-Type": MIME[path.extname(file).toLowerCase()] ?? "application/octet-stream" });
}

// ---------------------------------------------------------------------------
// /thumb/<n>.png : the pre-rendered thumbnail thumbs.mjs wrote to
// <RUN>/thumbs/<n>.png. 200 image/png, or 404 before thumbs has run.

function serveThumb(res, pathname) {
  const m = pathname.match(/^\/thumb\/(\d+)\.png$/);
  if (!m) return send(res, 404, "expected /thumb/<n>.png");
  const n = Number(m[1]);
  if (!Number.isInteger(n) || n < 1 || n > 99) return send(res, 404, "not found");
  const file = path.join(P.RUN, "thumbs", n + ".png");
  let body;
  try { body = fs.readFileSync(file); } catch { return send(res, 404, "not found"); }
  return send(res, 200, body, { "Content-Type": MIME[".png"] });
}

// ---------------------------------------------------------------------------
// /inject/<n>.js : the scoped-preview overlay script (core.buildInjectJs). The
// direction total is read fresh so a riff's later directions flip correctly.

function serveInject(res, pathname) {
  const m = pathname.match(/^\/inject\/(\d+)\.js$/);
  if (!m) return send(res, 404, "expected /inject/<n>.js");
  const n = Number(m[1]);
  if (!Number.isInteger(n) || n < 1 || n > 99) return send(res, 404, "not found");
  const manifest = readManifest();
  const total = Math.max(n, (manifest.directions ?? []).length || n);
  const js = buildInjectJs(n, total, boundPort ?? PORT_WANTED);
  return send(res, 200, js, { "Content-Type": MIME[".js"], "Access-Control-Allow-Origin": "*" });
}

// ---------------------------------------------------------------------------
// server

const server = http.createServer(async (req, res) => {
  const host = (req.headers.host ?? "").split(":")[0];
  if (host !== "127.0.0.1" && host !== "localhost") return send(res, 403, "local only");
  const url = new URL(req.url, "http://127.0.0.1");
  const p = url.pathname;

  try {
    if (req.method === "OPTIONS") {
      if (p === "/api/pick") return send(res, 204, "", CORS);
      return send(res, 404, "not found");
    }

    if (req.method === "GET") {
      if (p === "/") return send(res, 200, PICKER_HTML, { "Content-Type": MIME[".html"] });
      if (p === "/favicon.ico") return send(res, 204, "");
      if (p === "/api/state") {
        lastPoll = Date.now();
        const manifest = readManifest();
        // CORS *: the chip on a routes-mode page (user's dev-server origin)
        // reads state to learn titles + the live direction count.
        return sendJson(res, 200, { run: P.RUN_ID, runDir: P.RUN, mode: manifest.mode, port: boundPort, manifest }, { "Access-Control-Allow-Origin": "*" });
      }
      if (p === "/chip.js") {
        return send(res, 200, CHIP_JS, { "Content-Type": MIME[".js"], "Access-Control-Allow-Origin": "*" });
      }
      if (p.startsWith("/frame/")) return serveFrame(res, p);
      if (p.startsWith("/thumb/")) return serveThumb(res, p);
      if (p.startsWith("/inject/")) return serveInject(res, p);
      return send(res, 404, "not found");
    }

    if (req.method === "POST") {
      if (p === "/api/pick") {
        const body = await readBody(req);
        const action = body?.action;
        if (action !== "pick" && action !== "riff" && action !== "graft") {
          return sendJson(res, 400, { error: 'action must be "pick", "riff", or "graft"' }, CORS);
        }
        const fields = {};
        if (action === "pick") {
          const choice = Number(body.choice);
          if (!Number.isInteger(choice) || choice < 1) return sendJson(res, 400, { error: "pick needs a direction number in choice" }, CORS);
          fields.choice = choice;
        } else if (action === "graft") {
          const choice = Number(body.choice);
          const from = Number(body.from);
          const section = String(body.section ?? "").trim().slice(0, 120);
          if (!Number.isInteger(choice) || choice < 1) return sendJson(res, 400, { error: "graft needs the winner direction number in choice" }, CORS);
          if (!Number.isInteger(from) || from < 1) return sendJson(res, 400, { error: "graft needs the source direction number in from" }, CORS);
          if (!section) return sendJson(res, 400, { error: "graft needs a section name" }, CORS);
          fields.choice = choice;
          fields.from = from;
          fields.section = section;
        } else {
          if (body.choice != null && Number.isInteger(Number(body.choice))) fields.choice = Number(body.choice);
          fields.steer = String(body.steer ?? "").slice(0, 500);
        }
        const id = createRequest(action, fields);
        return sendJson(res, 200, { ok: true, id }, CORS);
      }
      if (p === "/api/shutdown") {
        sendJson(res, 200, { ok: true });
        console.log(`[${nowIso()}] shutdown requested`);
        setTimeout(shutdown, 50);
        return;
      }
      return send(res, 404, "not found");
    }

    return send(res, 405, "method not allowed");
  } catch (e) {
    return sendJson(res, 500, { error: String(e?.message ?? e) });
  }
});

function cleanup() {
  const { json } = readJsonSafe(P.SERVER_JSON);
  if (json?.pid === process.pid) {
    try { fs.rmSync(P.SERVER_JSON, { force: true }); } catch { /* ignore */ }
  }
}

function shutdown(code = 0) {
  cleanup();
  try { server.close(); } catch { /* ignore */ }
  process.exit(code);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

setInterval(() => {
  if (Date.now() - lastPoll > IDLE_MS) {
    console.log(`[${nowIso()}] idle for 30 min, shutting down`);
    shutdown(0);
  }
}, 60_000);

function listen(port) {
  server.once("error", (e) => {
    if (e.code === "EADDRINUSE" && port < PORT_MAX) listen(port + 1);
    else { console.error("listen failed:", e.message); process.exit(1); }
  });
  server.listen(port, "127.0.0.1", () => {
    boundPort = port;
    atomicWrite(P.SERVER_JSON, JSON.stringify({ port, pid: process.pid, run: P.RUN_ID, startedAt: Date.now() }, null, 2) + "\n");
    console.log(`[${nowIso()}] hallmark variants picker on http://127.0.0.1:${port}  run=${P.RUN}`);
  });
}

listen(PORT_WANTED);
