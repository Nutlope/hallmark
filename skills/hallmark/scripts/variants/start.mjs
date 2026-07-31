#!/usr/bin/env node
// Boot the hallmark variants picker: ensure the run skeleton, start (or
// reuse) the detached server, print the picker URL and the exact next
// commands. Safe to run any number of times.
//
//   node start.mjs --run <run-dir> [--static]
//
// Prints exactly:
//   PICKER http://127.0.0.1:<port>
//   AWAIT  node <abs>/await.mjs --run <run-dir> --timeout 540
//   DRAIN  node <abs>/await.mjs --run <run-dir> --drain
//
// --static: no server. Writes compare.html into the run dir (srcdoc-inlined
// v1..v3 with local CSS folded in and the chip script stripped) and prints
// its absolute path instead.

import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  parseArgs, runPaths, readJsonSafe, readSafe, defaultManifest,
  buildComparePage, httpGetJson, httpPostJson,
} from "./core.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.run || args.run === true) { console.error("start.mjs: --run <run-dir> is required"); process.exit(1); }
const HERE = path.dirname(fileURLToPath(import.meta.url));
const P = runPaths(args.run);

// ---- run skeleton -----------------------------------------------------------
for (const d of ["v1", "v2", "v3", "requests/done"]) fs.mkdirSync(path.join(P.RUN, d), { recursive: true });
if (!fs.existsSync(P.MANIFEST)) {
  fs.writeFileSync(P.MANIFEST, JSON.stringify(defaultManifest(P.RUN_ID), null, 2) + "\n");
}

// ---- --static: a serverless compare page ------------------------------------
if (args.static) {
  const manifest = readJsonSafe(P.MANIFEST).json ?? defaultManifest(P.RUN_ID);
  const ns = manifest.directions?.length ? manifest.directions.map((d) => d.n) : [1, 2, 3];
  const items = [];
  for (const n of ns) {
    const dir = path.join(P.RUN, "v" + n);
    let doc = readSafe(path.join(dir, "index.html"));
    if (doc == null) continue;
    doc = inlineLocalCss(doc, dir)
      .replace(/<script\b[^>]*src=["'][^"']*\/chip\.js[^"']*["'][^>]*>\s*<\/script>/gi, "");
    const d = manifest.directions?.find((x) => x.n === n);
    items.push({
      n,
      title: d?.title ?? "Direction " + n,
      meta: d ? [d.macrostructure, d.theme, d.nav, d.footer].filter(Boolean).join(" · ") : "",
      doc,
    });
  }
  if (!items.length) { console.error(`start.mjs: no v<n>/index.html found under ${P.RUN}`); process.exit(1); }
  const out = path.join(P.RUN, "compare.html");
  fs.writeFileSync(out, buildComparePage({ runId: P.RUN_ID, brief: manifest.brief ?? "", items }));
  console.log(out);
  process.exit(0);
}

/** Fold <link rel="stylesheet"> files that live inside the direction folder
 *  into <style> blocks so the srcdoc is self-contained. */
function inlineLocalCss(html, dir) {
  return html.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, (tag) => {
    const href = tag.match(/href=["']([^"']+)["']/i)?.[1];
    if (!href || /^(https?:)?\/\//i.test(href)) return tag;
    const file = path.normalize(path.join(dir, href.split("?")[0]));
    if (file !== dir && !file.startsWith(dir + path.sep)) return tag;
    const css = readSafe(file);
    return css == null ? tag : "<style>\n" + css + "\n</style>";
  });
}

// ---- server: reuse a live one whose identity matches this run ---------------
const existing = readJsonSafe(P.SERVER_JSON).json;
let live = null;
if (existing?.port) {
  const st = await httpGetJson(existing.port, "/api/state");
  if (st && st.run === P.RUN_ID && path.resolve(st.runDir ?? "") === P.RUN) {
    live = { port: existing.port };
  } else {
    // A server for another run of THIS project is superseded; a stranger
    // (another project's server squatting the port after a stale file) is
    // left alone and we simply walk to the next port.
    const ours = st?.runDir && path.dirname(path.resolve(st.runDir)) === path.dirname(P.RUN);
    if (st && ours) await httpPostJson(existing.port, "/api/shutdown");
    try { fs.rmSync(P.SERVER_JSON, { force: true }); } catch { /* ignore */ }
  }
}

if (!live) {
  const logFd = fs.openSync(P.LOG, "a");
  const child = spawn(process.execPath, [path.join(HERE, "serve.mjs"), "--run", P.RUN], {
    detached: true,
    stdio: ["ignore", logFd, logFd],
  });
  child.unref();
  const deadline = Date.now() + 8000;
  while (Date.now() < deadline && !live) {
    await new Promise((r) => setTimeout(r, 250));
    const sj = readJsonSafe(P.SERVER_JSON).json;
    if (sj?.port) {
      const st = await httpGetJson(sj.port, "/api/state");
      if (st && st.run === P.RUN_ID && path.resolve(st.runDir ?? "") === P.RUN) live = { port: sj.port };
    }
  }
  if (!live) {
    console.error(`variants: server did not come up; check ${P.LOG}`);
    process.exit(1);
  }
}

const awaitPath = path.join(HERE, "await.mjs");
console.log(`PICKER http://127.0.0.1:${live.port}`);
console.log(`AWAIT  node ${awaitPath} --run ${P.RUN} --timeout 540`);
console.log(`DRAIN  node ${awaitPath} --run ${P.RUN} --drain`);
