// Hallmark eval runner.
//
// Combines the deterministic detector (8 Impeccable dimensions) with an
// LLM-judge sidecar (Hallmark's 6 craft axes + honesty) for each fixture,
// aggregates a cycle score, snapshots evals/results/cycle-NN.json, and
// rebuilds evals/results/history.md.
//
// Usage: node run.mjs --cycle <N> --eval v1|v2 --label "what changed"

import { DIM_ORDER, evaluateCycle, rebuildHistory, writeSnapshot } from './core.mjs';

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : def;
}

const cycle = +arg('cycle', '0');
const evalVersion = arg('eval', 'v1');
const label = arg('label', '');

const { snapshot, perFixture } = evaluateCycle({ cycle, evalVersion, label });
writeSnapshot(snapshot);
rebuildHistory();

// console summary
console.log(`\nCycle ${cycle} (${evalVersion}) — ${label}`);
console.log(`  rules: ${snapshot.ruleCount}   fixtures: ${snapshot.fixtureCount}   SCORE: ${snapshot.cycleScore}/100`);
for (const d of DIM_ORDER) if (snapshot.aggDims[d] != null) console.log(`    ${d.padEnd(12)} ${snapshot.aggDims[d].toFixed(2)}/5`);
for (const f of perFixture) console.log(`  · ${f.name.padEnd(16)} ${f.score100}/100`);
