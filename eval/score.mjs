#!/usr/bin/env node
// score.mjs: run the Hallmark sloplint gate checker over every eval artifact.
//
// For each eval/runs/<briefId>/<armId>-<pack>/index.html, runs:
//   node skills/hallmark/scripts/sloplint.mjs <index.html> --json [--scope component]
// and writes score.json next to the artifact:
//   { generatedAt, scope, findings, summary: {fails, warns}, floorClean }
//
// The component scope is applied to any brief whose expect.scope is
// "component" in eval/briefs.json (b5 today).
//
// floorClean is the floor-subset pass: zero FAIL findings among gates
// 1, 10, 14, 20, 26, 27, 34, 38a, 48, 54.
//
// If sloplint.mjs is absent or errors, score.json is {unavailable: true, ...}
// and the loop continues; this script never hard-fails the pipeline.
//
// Usage:
//   node eval/score.mjs [--brief b1] [--arm fable-baseline] [--force] [--dry-run]

import { existsSync, readdirSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const RUNS = path.join(ROOT, "runs");
const SLOPLINT = path.resolve(ROOT, "..", "skills", "hallmark", "scripts", "sloplint.mjs");
const BRIEFS_PATH = path.join(ROOT, "briefs.json");

const FLOOR_GATES = new Set(["1", "10", "14", "20", "26", "27", "34", "38a", "48", "54"]);

function parseArgs(argv) {
  const args = { brief: null, arm: null, force: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--brief") args.brief = argv[++i];
    else if (a === "--arm") args.arm = argv[++i];
    else if (a === "--force") args.force = true;
    else if (a === "--dry-run") args.dryRun = true;
    else if (a === "--help" || a === "-h") {
      console.log("usage: node score.mjs [--brief id] [--arm id] [--force] [--dry-run]");
      process.exit(0);
    }
  }
  return args;
}

function loadComponentBriefs() {
  try {
    const briefs = JSON.parse(readFileSync(BRIEFS_PATH, "utf8"));
    return new Set(
      briefs.filter((b) => b?.expect?.scope === "component").map((b) => b.id)
    );
  } catch {
    return new Set(["b5"]);
  }
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
      out.push({ briefId, cell, runDir, html });
    }
  }
  return out;
}

function computeFloorClean(findings) {
  if (!Array.isArray(findings)) return null;
  for (const f of findings) {
    if (!f) continue;
    const grade = String(f.grade || "").toUpperCase();
    const gate = String(f.gate ?? "");
    if (grade === "FAIL" && FLOOR_GATES.has(gate)) return false;
  }
  return true;
}

function scoreOne(run, scope) {
  if (!existsSync(SLOPLINT)) {
    return { unavailable: true, reason: `sloplint.mjs not found at ${SLOPLINT}` };
  }
  const cliArgs = [SLOPLINT, run.html, "--json"];
  if (scope === "component") cliArgs.push("--scope", "component");
  const res = spawnSync(process.execPath, cliArgs, {
    encoding: "utf8",
    timeout: 120000,
  });
  if (res.error) {
    return { unavailable: true, reason: `sloplint spawn error: ${res.error.message}` };
  }
  let parsed;
  try {
    // sloplint may print a preamble; grab the outermost JSON object.
    const out = res.stdout || "";
    const start = out.indexOf("{");
    const end = out.lastIndexOf("}");
    if (start === -1 || end === -1) throw new Error("no JSON object in output");
    parsed = JSON.parse(out.slice(start, end + 1));
  } catch (err) {
    return {
      unavailable: true,
      reason: `sloplint output not parseable: ${err.message}`,
      exitCode: res.status,
      stderr: (res.stderr || "").slice(0, 2000),
    };
  }
  const findings = Array.isArray(parsed.findings) ? parsed.findings : [];
  const summary =
    parsed.summary && typeof parsed.summary === "object"
      ? parsed.summary
      : {
          fails: findings.filter((f) => String(f?.grade).toUpperCase() === "FAIL").length,
          warns: findings.filter((f) => String(f?.grade).toUpperCase() === "WARN").length,
        };
  return {
    scope,
    findings,
    summary,
    floorClean: computeFloorClean(findings),
    exitCode: res.status,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const componentBriefs = loadComponentBriefs();
  const runs = listRuns(args);
  if (runs.length === 0) {
    console.log("no runs found under eval/runs/");
    return;
  }
  if (!existsSync(SLOPLINT)) {
    console.log(`note: sloplint.mjs not present yet (${SLOPLINT}); writing unavailable scores`);
  }

  let scored = 0;
  for (const run of runs) {
    const scorePath = path.join(run.runDir, "score.json");
    if (existsSync(scorePath) && !args.force) {
      console.log(`skip  ${run.briefId}/${run.cell} (score.json exists)`);
      continue;
    }
    const scope = componentBriefs.has(run.briefId) ? "component" : "page";
    if (args.dryRun) {
      console.log(`would score ${run.briefId}/${run.cell} (scope ${scope})`);
      continue;
    }
    const result = scoreOne(run, scope);
    result.generatedAt = new Date().toISOString();
    writeFileSync(scorePath, JSON.stringify(result, null, 2) + "\n");
    scored++;
    if (result.unavailable) {
      console.log(`score ${run.briefId}/${run.cell}: unavailable (${result.reason})`);
    } else {
      console.log(
        `score ${run.briefId}/${run.cell}: ${result.summary.fails} FAIL / ${result.summary.warns} WARN, floorClean=${result.floorClean}`
      );
    }
  }
  console.log(`done: ${scored} scored, ${runs.length - scored} skipped`);
}

main();
