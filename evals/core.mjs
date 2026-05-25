// Shared scoring primitives for the Hallmark eval harness.
//
// `run.mjs` uses these helpers to write result snapshots. `check.mjs` uses the
// same path to validate the current fixtures without mutating the working tree.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyze } from './detector.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RESULTS = path.join(HERE, 'results');
const CRAFT_AXES = ['philosophy', 'hierarchy', 'execution', 'specificity', 'restraint', 'variety', 'honesty'];
const DIM_ORDER = ['visual', 'typography', 'color', 'layout', 'motion', 'interaction', 'responsive', 'general', 'craft', 'structure'];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function macrostructureOf(file) {
  const src = fs.readFileSync(path.join(HERE, file), 'utf8');
  return (src.match(/macrostructure:\s*([a-z0-9-]+)/i) || [])[1] || 'unstamped';
}

function structureScoreFor(fixtures) {
  const macros = fixtures.map((fx) => macrostructureOf(fx.file));
  const counts = macros.reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {});
  const collisions = Object.values(counts).reduce((a, n) => a + (n - 1), 0);
  const unstamped = macros.filter((k) => k === 'unstamped').length;
  return +Math.max(0, 5 - 2.5 * collisions - 2.5 * unstamped).toFixed(3);
}

function loadConfig() {
  return readJson(path.join(HERE, 'config.json'));
}

function evaluateCycle({ cycle = 0, evalVersion = 'v1', label = '', timestamp = new Date().toISOString() } = {}) {
  const config = loadConfig();
  const evalConfig = config.evals[evalVersion];
  if (!evalConfig) throw new Error(`Unknown eval version: ${evalVersion}`);

  const fixtures = evalConfig.fixtures;
  const structureScore = structureScoreFor(fixtures);
  const perFixture = [];

  for (const fx of fixtures) {
    const det = analyze(path.join(HERE, fx.file), evalVersion);
    const judge = readJson(path.join(HERE, fx.judge));
    const craftVals = CRAFT_AXES.map((a) => judge[a]);
    const craft = +(craftVals.reduce((a, b) => a + b, 0) / craftVals.length).toFixed(3);

    const dimScores = { ...Object.fromEntries(Object.entries(det.dims).map(([k, v]) => [k, v.score])), craft };
    // The order parameter is a property of the whole eval set; v2 folds it in.
    if (evalVersion === 'v2') dimScores.structure = structureScore;
    const overall5 = +(Object.values(dimScores).reduce((a, b) => a + b, 0) / Object.values(dimScores).length).toFixed(3);

    perFixture.push({
      name: fx.name,
      file: fx.file,
      macrostructure: macrostructureOf(fx.file),
      detector: det,
      judge,
      dimScores,
      score100: +(overall5 * 20).toFixed(1),
    });
  }

  const allDims = [...new Set(perFixture.flatMap((f) => Object.keys(f.dimScores)))];
  const aggDims = {};
  for (const d of allDims) {
    const vals = perFixture.map((f) => f.dimScores[d]).filter((v) => v != null);
    aggDims[d] = +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(3);
  }
  const cycleScore = +(perFixture.reduce((a, f) => a + f.score100, 0) / perFixture.length).toFixed(1);

  const snapshot = {
    cycle, evalVersion, label,
    ruleCount: perFixture[0]?.detector.ruleCount ?? 0,
    fixtureCount: perFixture.length,
    cycleScore,
    aggDims,
    fixtures: perFixture.map((f) => ({ name: f.name, score100: f.score100, dimScores: f.dimScores })),
    timestamp,
  };

  return { snapshot, perFixture, structureScore };
}

function writeSnapshot(snapshot) {
  fs.mkdirSync(RESULTS, { recursive: true });
  const tag = `${String(snapshot.cycle).padStart(2, '0')}-${snapshot.evalVersion}`;
  fs.writeFileSync(path.join(RESULTS, `cycle-${tag}.json`), JSON.stringify(snapshot, null, 2));
}

function readSnapshots() {
  if (!fs.existsSync(RESULTS)) return [];
  return fs.readdirSync(RESULTS)
    .filter((f) => /^cycle-.*\.json$/.test(f))
    .map((f) => readJson(path.join(RESULTS, f)))
    .sort((a, b) => (a.cycle - b.cycle) || a.evalVersion.localeCompare(b.evalVersion));
}

function buildHistoryMarkdown(snaps) {
  let md = '# Eval history — Hallmark anti-slop hillclimb\n\n';
  md += 'Score = mean of detector dimensions plus craft, × 20 (0–100). v2 also\n';
  md += 'folds in the cross-fixture `structure` order parameter. Dimensions 1–8\n';
  md += 'are the deterministic Impeccable detector; `craft` is the LLM-judge mean\n';
  md += "of Hallmark's six axes + honesty.\n\n";
  md += '| Cycle | Eval | Rules | Score | ' + DIM_ORDER.map((d) => d.slice(0, 5)).join(' | ') + ' | Change |\n';
  md += '|---|---|---|---|' + DIM_ORDER.map(() => '---').join('|') + '|---|\n';
  let prev = null;
  for (const s of snaps) {
    const delta = prev == null ? '—' : (s.cycleScore - prev >= 0 ? `+${(s.cycleScore - prev).toFixed(1)}` : (s.cycleScore - prev).toFixed(1));
    md += `| ${s.cycle} | ${s.evalVersion} | ${s.ruleCount} | **${s.cycleScore.toFixed(1)}** | `
      + DIM_ORDER.map((d) => (s.aggDims[d] != null ? s.aggDims[d].toFixed(2) : '—')).join(' | ')
      + ` | ${delta} |\n`;
    prev = s.cycleScore;
  }
  md += '\n## Notes per cycle\n\n';
  for (const s of snaps) md += `- **Cycle ${s.cycle} (${s.evalVersion})** — ${s.label || '—'}\n`;
  return md;
}

function rebuildHistory() {
  fs.mkdirSync(RESULTS, { recursive: true });
  fs.writeFileSync(path.join(RESULTS, 'history.md'), buildHistoryMarkdown(readSnapshots()));
}

function detectorFailures(perFixture) {
  return perFixture.flatMap((fixture) => Object.entries(fixture.detector.dims).flatMap(([dim, d]) => (
    d.rules.filter((r) => !r.pass).map((rule) => ({ fixture: fixture.name, file: fixture.file, dim, ...rule }))
  )));
}

export {
  CRAFT_AXES,
  DIM_ORDER,
  evaluateCycle,
  writeSnapshot,
  readSnapshots,
  buildHistoryMarkdown,
  rebuildHistory,
  detectorFailures,
};
