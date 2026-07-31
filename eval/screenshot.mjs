#!/usr/bin/env node
// screenshot.mjs: capture hero/full/mobile shots for every eval run artifact.
//
// For each eval/runs/<briefId>/<armId>-<pack>/index.html with no existing
// shots (or with --force), writes:
//   eval/_shots/<briefId>-<armId>-<pack>-hero.png    1280x800 viewport
//   eval/_shots/<briefId>-<armId>-<pack>-full.png    full page at 1280 wide
//   eval/_shots/<briefId>-<armId>-<pack>-mobile.png  375x812 full page
//
// Engine: puppeteer-core driving the installed Chrome when the package is
// available; otherwise falls back to spawning the Chrome binary headless with
// --screenshot per shot (full page approximated by a tall window).
//
// Usage:
//   node eval/screenshot.mjs [--brief b1] [--arm fable-baseline] [--force] [--dry-run]
//
// Zero npm dependencies required. CHROME_PATH overrides the Chrome binary.

import { existsSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const RUNS = path.join(ROOT, "runs");
const SHOTS = path.join(ROOT, "_shots");

const DEFAULT_CHROME =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CHROME = process.env.CHROME_PATH || DEFAULT_CHROME;

const SHOT_SPECS = [
  { suffix: "hero", width: 1280, height: 800, fullPage: false },
  { suffix: "full", width: 1280, height: 800, fullPage: true, fallbackHeight: 4000 },
  { suffix: "mobile", width: 375, height: 812, fullPage: true, fallbackHeight: 3000 },
];

function parseArgs(argv) {
  const args = { brief: null, arm: null, force: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--brief") args.brief = argv[++i];
    else if (a === "--arm") args.arm = argv[++i];
    else if (a === "--force") args.force = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--help" || a === "-h") {
      console.log("usage: node screenshot.mjs [--brief id] [--arm id] [--force] [--dry-run]");
      process.exit(0);
    }
  }
  return args;
}

function listRuns(filter) {
  const out = [];
  if (!existsSync(RUNS)) return out;
  for (const briefId of readdirSync(RUNS).sort()) {
    const briefDir = path.join(RUNS, briefId);
    if (!statSync(briefDir).isDirectory()) continue;
    if (filter.brief && briefId !== filter.brief) continue;
    for (const cell of readdirSync(briefDir).sort()) {
      const runDir = path.join(briefDir, cell);
      if (!statSync(runDir).isDirectory()) continue;
      if (filter.arm && !cell.startsWith(filter.arm)) continue;
      const html = path.join(runDir, "index.html");
      if (!existsSync(html)) continue;
      out.push({ briefId, cell, runDir, html, base: `${briefId}-${cell}` });
    }
  }
  return out;
}

function pendingSpecs(base, force) {
  if (force) return SHOT_SPECS;
  return SHOT_SPECS.filter(
    (s) => !existsSync(path.join(SHOTS, `${base}-${s.suffix}.png`))
  );
}

async function tryPuppeteer() {
  try {
    const mod = await import("puppeteer-core");
    return mod.default ?? mod;
  } catch {
    return null;
  }
}

async function shootWithPuppeteer(puppeteer, jobs) {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1"],
  });
  try {
    const page = await browser.newPage();
    for (const job of jobs) {
      for (const spec of job.specs) {
        const out = path.join(SHOTS, `${job.base}-${spec.suffix}.png`);
        try {
          await page.setViewport({ width: spec.width, height: spec.height });
          await page.goto(pathToFileURL(job.html).href, {
            waitUntil: "networkidle0",
            timeout: 30000,
          });
          await new Promise((r) => setTimeout(r, 400));
          await page.screenshot({ path: out, fullPage: !!spec.fullPage });
          console.log(`shot  ${path.relative(ROOT, out)}`);
        } catch (err) {
          console.error(`FAIL  ${job.base}-${spec.suffix}: ${err.message}`);
        }
      }
    }
  } finally {
    await browser.close();
  }
}

function shootWithChromeBinary(jobs) {
  if (!existsSync(CHROME)) {
    console.error(`Chrome binary not found at ${CHROME}; set CHROME_PATH.`);
    process.exit(1);
  }
  for (const job of jobs) {
    for (const spec of job.specs) {
      const out = path.join(SHOTS, `${job.base}-${spec.suffix}.png`);
      const height = spec.fullPage ? spec.fallbackHeight || spec.height : spec.height;
      const res = spawnSync(
        CHROME,
        [
          "--headless=new",
          "--disable-gpu",
          "--hide-scrollbars",
          "--force-device-scale-factor=1",
          `--window-size=${spec.width},${height}`,
          `--screenshot=${out}`,
          "--virtual-time-budget=4000",
          pathToFileURL(job.html).href,
        ],
        { stdio: "ignore", timeout: 60000 }
      );
      if (res.status === 0 && existsSync(out)) {
        console.log(`shot  ${path.relative(ROOT, out)} (chrome fallback)`);
      } else {
        console.error(`FAIL  ${job.base}-${spec.suffix} (chrome fallback, exit ${res.status})`);
      }
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  mkdirSync(SHOTS, { recursive: true });

  const runs = listRuns(args);
  const jobs = runs
    .map((r) => ({ ...r, specs: pendingSpecs(r.base, args.force) }))
    .filter((j) => j.specs.length > 0);

  if (jobs.length === 0) {
    console.log("nothing to shoot (all shots exist; use --force to redo)");
    return;
  }
  if (args.dryRun) {
    for (const j of jobs)
      console.log(`would shoot ${j.base}: ${j.specs.map((s) => s.suffix).join(", ")}`);
    return;
  }

  const puppeteer = await tryPuppeteer();
  if (puppeteer) {
    console.log("engine: puppeteer-core");
    await shootWithPuppeteer(puppeteer, jobs);
  } else {
    console.log("engine: chrome --screenshot fallback (puppeteer-core not installed)");
    shootWithChromeBinary(jobs);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
