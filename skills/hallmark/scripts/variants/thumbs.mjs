#!/usr/bin/env node
// hallmark variants thumbnailer. Zero npm dependencies. For each ready
// direction in the run manifest it screenshots the direction to
// <RUN>/thumbs/<n>.png at 1280x800 and flips thumb:true on that direction in
// the manifest (atomic write). The picker then swaps its scaled live iframe for
// a static <img>, which is lighter and also survives iframe-blocked
// (X-Frame-Options / CSP frame-ancestors) routes-mode dev servers.
//
//   node thumbs.mjs --run <run-dir> [--port 4180] [--force] [--n 2]
//
// Engine: puppeteer-core driving the installed Chrome when the package is
// available; otherwise spawns the Chrome binary headless with --screenshot
// (the same dual-engine pattern as eval/screenshot.mjs). CHROME_PATH overrides
// the Chrome binary.
//
// URL per direction: an absolute http(s) url (routes mode) is shot as-is;
// anything else (greenfield /frame/<n>/) is shot from the local v<n>/index.html
// file, or from the picker server when --port is given.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";
import { parseArgs, runPaths, readJsonSafe, atomicWrite, defaultManifest } from "./core.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.run || args.run === true) { console.error("thumbs.mjs: --run <run-dir> is required"); process.exit(1); }
const P = runPaths(args.run);
const THUMBS = path.join(P.RUN, "thumbs");
const PORT = args.port && args.port !== true ? Number(args.port) : null;
const ONLY_N = args.n && args.n !== true ? Number(args.n) : null;
const FORCE = !!args.force;

const DEFAULT_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CHROME = process.env.CHROME_PATH || DEFAULT_CHROME;
const WIDTH = 1280, HEIGHT = 800;

fs.mkdirSync(THUMBS, { recursive: true });

function readManifest() {
  const { json } = readJsonSafe(P.MANIFEST);
  return json && typeof json === "object" && !Array.isArray(json) ? json : defaultManifest(P.RUN_ID);
}

/** Where to point the browser for direction d: absolute url as-is; a relative
 *  greenfield url against the picker port when --port is set; else the local
 *  v<n>/index.html file. Returns null when nothing shootable exists. */
function shootUrl(d) {
  const u = String(d.url ?? "");
  if (/^https?:\/\//i.test(u)) return u;
  if (PORT) return `http://127.0.0.1:${PORT}` + (u.startsWith("/") ? u : `/frame/${d.n}/`);
  const file = path.join(P.RUN, "v" + d.n, "index.html");
  return fs.existsSync(file) ? pathToFileURL(file).href : null;
}

/** Re-read the manifest fresh (the agent may edit it between shots) and flip
 *  thumb:true on direction n, then atomic-write. */
function markThumb(n) {
  const manifest = readManifest();
  const dir = (manifest.directions ?? []).find((x) => x.n === n);
  if (!dir) return;
  dir.thumb = true;
  atomicWrite(P.MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
}

function planJobs() {
  const manifest = readManifest();
  const jobs = [];
  for (const d of manifest.directions ?? []) {
    if (ONLY_N != null && d.n !== ONLY_N) continue;
    if (d.status && d.status !== "ready") continue; // only ready directions
    const out = path.join(THUMBS, d.n + ".png");
    if (!FORCE && fs.existsSync(out)) continue;
    const url = shootUrl(d);
    if (!url) { console.error(`skip  direction ${d.n}: no shootable url or v${d.n}/index.html`); continue; }
    jobs.push({ n: d.n, url, out });
  }
  return jobs;
}

async function tryPuppeteer() {
  try { const mod = await import("puppeteer-core"); return mod.default ?? mod; }
  catch { return null; }
}

async function shootWithPuppeteer(puppeteer, jobs) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1"],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT });
    for (const job of jobs) {
      try {
        await page.goto(job.url, { waitUntil: "networkidle0", timeout: 30000 });
        await new Promise((r) => setTimeout(r, 400));
        await page.screenshot({ path: job.out, fullPage: false });
        markThumb(job.n);
        console.log(`thumb ${path.relative(P.RUN, job.out)}`);
      } catch (err) {
        console.error(`FAIL  direction ${job.n}: ${err.message}`);
      }
    }
  } finally {
    await browser.close();
  }
}

function shootWithChromeBinary(jobs) {
  if (!fs.existsSync(CHROME)) {
    console.error(`Chrome binary not found at ${CHROME}; set CHROME_PATH.`);
    process.exit(1);
  }
  for (const job of jobs) {
    const res = spawnSync(
      CHROME,
      [
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--force-device-scale-factor=1",
        `--window-size=${WIDTH},${HEIGHT}`,
        `--screenshot=${job.out}`,
        "--virtual-time-budget=4000",
        job.url,
      ],
      { stdio: "ignore", timeout: 60000 },
    );
    if (res.status === 0 && fs.existsSync(job.out)) {
      markThumb(job.n);
      console.log(`thumb ${path.relative(P.RUN, job.out)} (chrome fallback)`);
    } else {
      console.error(`FAIL  direction ${job.n} (chrome fallback, exit ${res.status})`);
    }
  }
}

async function main() {
  const jobs = planJobs();
  if (!jobs.length) { console.log("nothing to shoot (all thumbs exist; use --force to redo)"); return; }
  const puppeteer = await tryPuppeteer();
  if (puppeteer) {
    console.log("engine: puppeteer-core");
    await shootWithPuppeteer(puppeteer, jobs);
  } else {
    console.log("engine: chrome --screenshot fallback (puppeteer-core not installed)");
    shootWithChromeBinary(jobs);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
