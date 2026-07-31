#!/usr/bin/env node
// variants-bench.mjs: time the MECHANICAL parts of a hallmark variants run that
// we can measure WITHOUT an agent in the loop - server cold-start, picker
// first-paint, and thumbnail generation for N pages. Prints a small table.
//
// This is the "measurable-here" half of eval/variants-bench.md. The other half
// (time-to-first-direction, time-to-all-ready, output tokens) needs a live
// authenticated agent and is measured by hand per the doc; nothing here calls a
// model or the network beyond loopback.
//
// Usage:
//   node eval/variants-bench.mjs [--n 3] [--keep] [--json]
//     --n     how many greenfield pages to stand up and thumbnail (default 3)
//     --keep  leave the temp run dir on disk and the picker running (for poking)
//     --json  emit the results as one JSON object instead of the table
//
// Zero npm dependencies. Spins a throwaway run dir in the OS temp dir, drives
// the real scripts/variants/{start,thumbs,await}.mjs, then tears everything
// down. Thumbnail timing is skipped cleanly when thumbs.mjs is absent (it is a
// v2 addition) or when no screenshot engine is installed.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VARIANTS = path.resolve(HERE, "..", "skills", "hallmark", "scripts", "variants");
const START = path.join(VARIANTS, "start.mjs");
const THUMBS = path.join(VARIANTS, "thumbs.mjs");
const AWAIT = path.join(VARIANTS, "await.mjs");

// ---------------------------------------------------------------------------
// args

function parseArgs(argv) {
  const out = { n: 3, keep: false, json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--n") out.n = Math.max(1, Math.min(9, parseInt(argv[++i], 10) || 3));
    else if (a === "--keep") out.keep = true;
    else if (a === "--json") out.json = true;
    else if (a === "--help" || a === "-h") {
      console.log("usage: node eval/variants-bench.mjs [--n 3] [--keep] [--json]");
      process.exit(0);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// timing helpers

function now() { return Number(process.hrtime.bigint() / 1000n) / 1000; } // ms, sub-ms resolution

function median(nums) {
  if (!nums.length) return null;
  const s = nums.slice().sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** One raw GET against loopback; resolves { ms, code, bytes } or { error }. */
function timedGet(port, pathname, timeoutMs = 4000) {
  return new Promise((resolve) => {
    const t0 = now();
    const req = http.get({ host: "127.0.0.1", port, path: pathname, timeout: timeoutMs }, (res) => {
      let bytes = 0;
      res.on("data", (c) => (bytes += c.length));
      res.on("end", () => resolve({ ms: now() - t0, code: res.statusCode, bytes }));
    });
    req.on("error", (e) => resolve({ error: String(e.message || e) }));
    req.on("timeout", () => { req.destroy(); resolve({ error: "timeout" }); });
  });
}

// ---------------------------------------------------------------------------
// a throwaway greenfield run: N tiny self-contained pages + a ready manifest

const HUES = [210, 28, 152, 320, 48, 265, 0, 180, 96];

function mockPage(n) {
  const hue = HUES[(n - 1) % HUES.length];
  // Deliberately trivial but distinct per n, so thumbnails differ and render fast.
  return "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\">" +
    "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">" +
    "<title>bench direction " + n + "</title><style>" +
    "html,body{margin:0;height:100%}" +
    "body{display:grid;place-items:center;font-family:system-ui,sans-serif;" +
    "background:hsl(" + hue + " 70% 96%);color:hsl(" + hue + " 60% 22%)}" +
    ".b{text-align:center}.b h1{font-size:64px;margin:0 0 12px;letter-spacing:-.02em}" +
    ".b p{font:14px ui-monospace,monospace;color:hsl(" + hue + " 30% 45%)}" +
    ".bar{height:8px;width:220px;margin:20px auto 0;border-radius:99px;background:hsl(" + hue + " 70% 50%)}" +
    "</style></head><body><div class=\"b\"><h1>Direction " + n + "</h1>" +
    "<p>variants-bench synthetic page</p><div class=\"bar\"></div></div></body></html>\n";
}

function scaffold(n) {
  const base = fs.mkdtempSync(path.join(os.tmpdir(), "hm-variants-bench-"));
  const RUN = path.join(base, "2026-bench-a");
  const directions = [];
  for (let i = 1; i <= n; i++) {
    fs.mkdirSync(path.join(RUN, "v" + i), { recursive: true });
    fs.writeFileSync(path.join(RUN, "v" + i, "index.html"), mockPage(i));
    directions.push({
      n: i, title: "Bench " + i, macrostructure: "Synthetic", theme: "Hue " + HUES[(i - 1) % HUES.length],
      nav: "N0", footer: "Ft0", axes: "bench", url: "/frame/" + i + "/", status: "ready",
    });
  }
  fs.mkdirSync(path.join(RUN, "requests", "done"), { recursive: true });
  fs.writeFileSync(
    path.join(RUN, "manifest.json"),
    JSON.stringify({ run: "2026-bench-a", mode: "greenfield", brief: "variants-bench", devServer: null, directions, picked: null }, null, 2) + "\n",
  );
  return { base, RUN };
}

// ---------------------------------------------------------------------------
// steps

/** Cold-start the picker via start.mjs; returns { ms, port } or { ms, error }. */
function coldStart(RUN) {
  const t0 = now();
  const r = spawnSync(process.execPath, [START, "--run", RUN], { encoding: "utf8", timeout: 20000 });
  const ms = now() - t0;
  const line = String(r.stdout || "").split("\n").find((l) => l.startsWith("PICKER"));
  const port = line && line.match(/127\.0\.0\.1:(\d+)/)?.[1];
  if (!port) return { ms, error: (r.stderr || r.stdout || "no PICKER line").trim().slice(0, 160) };
  return { ms, port: Number(port) };
}

async function firstPaint(port, pathname, samples = 5) {
  const runs = [];
  let code = null, err = null;
  for (let i = 0; i < samples; i++) {
    const r = await timedGet(port, pathname);
    if (r.error) { err = r.error; break; }
    code = r.code; runs.push(r.ms);
  }
  return { ms: median(runs), samples: runs.length, code, error: err };
}

/** Time thumbs.mjs over the run; returns a status object. Never throws. */
function thumbnails(RUN, n) {
  if (!fs.existsSync(THUMBS)) return { state: "pending", note: "thumbs.mjs not present yet (v2 addition)" };
  const t0 = now();
  const r = spawnSync(process.execPath, [THUMBS, "--run", RUN], { encoding: "utf8", timeout: 120000 });
  const ms = now() - t0;
  let made = 0;
  try { made = fs.readdirSync(path.join(RUN, "thumbs")).filter((f) => f.endsWith(".png")).length; } catch { /* none */ }
  if (made === 0) {
    const why = (r.stderr || r.stdout || "no thumbs written").toString().trim().slice(0, 160);
    return { state: "unavailable", ms, note: why || "no screenshot engine (install Chrome or puppeteer-core)" };
  }
  return { state: "ok", ms, made, perThumb: made ? ms / made : null, wanted: n };
}

function stopServer(RUN) {
  try { spawnSync(process.execPath, [AWAIT, "--run", RUN, "--stop"], { encoding: "utf8", timeout: 6000 }); } catch { /* best effort */ }
}

// ---------------------------------------------------------------------------
// output

function fmtMs(ms) { return ms == null ? "-" : (ms >= 1000 ? (ms / 1000).toFixed(2) + " s" : ms.toFixed(1) + " ms"); }

function printTable(rows) {
  const wLabel = Math.max(...rows.map((r) => r[0].length), 5);
  const wVal = Math.max(...rows.map((r) => r[1].length), 5);
  const line = "  " + "-".repeat(wLabel) + "  " + "-".repeat(wVal) + "  " + "-".repeat(28);
  console.log(line);
  for (const [label, val, note] of rows) {
    console.log("  " + label.padEnd(wLabel) + "  " + val.padEnd(wVal) + "  " + (note || ""));
  }
  console.log(line);
}

// ---------------------------------------------------------------------------
// main

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const engines = { chrome: fs.existsSync(process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome") };

  const { base, RUN } = scaffold(args.n);
  const result = { n: args.n, coldStartMs: null, port: null, pickerPaintMs: null, statePaintMs: null, thumbs: null };

  let cs;
  try {
    cs = coldStart(RUN);
    result.coldStartMs = cs.ms;
    if (cs.error) {
      result.error = cs.error;
    } else {
      result.port = cs.port;
      const picker = await firstPaint(cs.port, "/");
      const state = await firstPaint(cs.port, "/api/state");
      result.pickerPaintMs = picker.ms;
      result.statePaintMs = state.ms;
      result.thumbs = thumbnails(RUN, args.n);
    }
  } finally {
    if (!args.keep) {
      stopServer(RUN);
      try { fs.rmSync(base, { recursive: true, force: true }); } catch { /* ignore */ }
    }
  }

  if (args.json) { console.log(JSON.stringify(result, null, 2)); return; }

  console.log("");
  console.log("hallmark variants - mechanical bench   (n=" + args.n + " greenfield pages)");
  console.log("");
  if (result.error) {
    console.log("  cold-start FAILED: " + result.error);
    console.log("  (nothing else could run; check the variants scripts)");
    return;
  }
  const t = result.thumbs || {};
  const rows = [
    ["step", "wall-clock", "detail"],
    ["server cold-start", fmtMs(result.coldStartMs), "start.mjs -> serve.mjs listening + PICKER"],
    ["picker first-paint", fmtMs(result.pickerPaintMs), "GET / (static shell, median of 5)"],
    ["state read", fmtMs(result.statePaintMs), "GET /api/state (manifest reread, median of 5)"],
  ];
  if (t.state === "ok") {
    rows.push(["thumbnails (" + t.made + "/" + t.wanted + ")", fmtMs(t.ms), "thumbs.mjs, all ready pages"]);
    rows.push(["per-thumbnail", fmtMs(t.perThumb), "avg over " + t.made + " pages"]);
  } else if (t.state === "unavailable") {
    rows.push(["thumbnails", "n/a", t.note]);
  } else {
    rows.push(["thumbnails", "pending", t.note]);
  }
  printTable(rows.slice(1)); // header row handled by columns themselves
  console.log("");
  console.log("  port " + result.port + " · picker paints before any direction exists (progressive-first).");
  console.log("  This measures the plumbing only. Agent-side timings live in eval/variants-bench.md.");
  if (!engines.chrome && (!t || t.state !== "ok")) {
    console.log("  Note: no Chrome at the default path; set CHROME_PATH to enable thumbnail timing.");
  }
  console.log("");
}

main().catch((e) => { console.error(e); process.exit(1); });
