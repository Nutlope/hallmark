// Hallmark eval runner.
//
// Combines the deterministic detector (8 Impeccable dimensions) with an
// LLM-judge sidecar (Hallmark's 6 craft axes + honesty) for each fixture,
// aggregates a cycle score, snapshots evals/results/cycle-NN.json, and
// rebuilds evals/results/history.md.
//
// Usage: node run.mjs --cycle <N> --eval v1|v2 --label "what changed"

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyze } from './detector.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RESULTS = path.join(HERE, 'results');
const CRAFT_AXES = ['philosophy', 'hierarchy', 'execution', 'specificity', 'restraint', 'variety', 'honesty'];

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : def;
}

const cycle = +arg('cycle', '0');
const evalVersion = arg('eval', 'v1');
const label = arg('label', '');

const config = JSON.parse(fs.readFileSync(path.join(HERE, 'config.json'), 'utf8'));
const fixtures = config.evals[evalVersion].fixtures;

// --- order parameter (blog: monitor cross-eval correlation, not just per-item)
// Structural-fingerprint reuse: two fixtures sharing a macrostructure is the
// "colour-swap of one template" failure that per-page checks cannot see.
function macrostructureOf(file) {
  const src = fs.readFileSync(path.join(HERE, file), 'utf8');
  return (src.match(/macrostructure:\s*([a-z0-9-]+)/i) || [])[1] || 'unstamped';
}
const macros = fixtures.map((fx) => macrostructureOf(fx.file));
const counts = macros.reduce((m, k) => ((m[k] = (m[k] || 0) + 1), m), {});
const collisions = Object.values(counts).reduce((a, n) => a + (n - 1), 0);
const unstamped = macros.filter((k) => k === 'unstamped').length;
const structureScore = +Math.max(0, 5 - 2.5 * collisions - 2.5 * unstamped).toFixed(3);

const perFixture = [];
for (const fx of fixtures) {
  const det = analyze(path.join(HERE, fx.file), evalVersion);
  const judgePath = path.join(HERE, fx.judge);
  const judge = JSON.parse(fs.readFileSync(judgePath, 'utf8'));
  const craftVals = CRAFT_AXES.map((a) => judge[a]);
  const craft = +(craftVals.reduce((a, b) => a + b, 0) / craftVals.length).toFixed(3);

  const dimScores = { ...Object.fromEntries(Object.entries(det.dims).map(([k, v]) => [k, v.score])), craft };
  // the order parameter is a property of the whole eval set; v2 folds it in
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

// aggregate dimensions across fixtures
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
  timestamp: new Date().toISOString(),
};

const tag = `${String(cycle).padStart(2, '0')}-${evalVersion}`;
fs.writeFileSync(path.join(RESULTS, `cycle-${tag}.json`), JSON.stringify(snapshot, null, 2));

// rebuild history.md from every snapshot
const snaps = fs.readdirSync(RESULTS)
  .filter((f) => /^cycle-.*\.json$/.test(f))
  .map((f) => JSON.parse(fs.readFileSync(path.join(RESULTS, f), 'utf8')))
  .sort((a, b) => (a.cycle - b.cycle) || a.evalVersion.localeCompare(b.evalVersion));

const dimOrder = ['visual', 'typography', 'color', 'layout', 'motion', 'interaction', 'responsive', 'general', 'craft', 'structure'];
let md = '# Eval history — Hallmark anti-slop hillclimb\n\n';
md += 'Score = mean of nine dimensions × 20 (0–100). Dimensions 1–8 are the\n';
md += 'deterministic Impeccable detector; `craft` is the LLM-judge mean of\n';
md += "Hallmark's six axes + honesty.\n\n";
md += '| Cycle | Eval | Rules | Score | ' + dimOrder.map((d) => d.slice(0, 5)).join(' | ') + ' | Change |\n';
md += '|---|---|---|---|' + dimOrder.map(() => '---').join('|') + '|---|\n';
let prev = null;
for (const s of snaps) {
  const delta = prev == null ? '—' : (s.cycleScore - prev >= 0 ? `+${(s.cycleScore - prev).toFixed(1)}` : (s.cycleScore - prev).toFixed(1));
  md += `| ${s.cycle} | ${s.evalVersion} | ${s.ruleCount} | **${s.cycleScore.toFixed(1)}** | `
    + dimOrder.map((d) => (s.aggDims[d] != null ? s.aggDims[d].toFixed(2) : '—')).join(' | ')
    + ` | ${delta} |\n`;
  prev = s.cycleScore;
}
md += '\n## Notes per cycle\n\n';
for (const s of snaps) md += `- **Cycle ${s.cycle} (${s.evalVersion})** — ${s.label || '—'}\n`;
fs.writeFileSync(path.join(RESULTS, 'history.md'), md);

// console summary
console.log(`\nCycle ${cycle} (${evalVersion}) — ${label}`);
console.log(`  rules: ${snapshot.ruleCount}   fixtures: ${snapshot.fixtureCount}   SCORE: ${cycleScore}/100`);
for (const d of dimOrder) if (aggDims[d] != null) console.log(`    ${d.padEnd(12)} ${aggDims[d].toFixed(2)}/5`);
for (const f of perFixture) console.log(`  · ${f.name.padEnd(16)} ${f.score100}/100`);
