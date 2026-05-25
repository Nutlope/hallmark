// Non-mutating CI/local check for the Hallmark eval harness.
//
// Scores the configured fixtures through the same path as run.mjs, but never
// writes result snapshots, history files, or audit caches. Fails if detector
// rules regress, if the v2 structure order parameter regresses, or if the
// aggregate score falls below the configured threshold.
//
// Usage:
//   node evals/check.mjs                 # check every eval version, min score 95
//   node evals/check.mjs --eval v2       # check one eval version
//   node evals/check.mjs --min-score 98  # tighten the score floor
//   node evals/check.mjs --json          # machine-readable summary

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { detectorFailures, evaluateCycle } from './core.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));

function arg(name, def) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : def;
}

function evalVersions() {
  const requested = arg('eval', 'all');
  if (requested !== 'all') return [requested];
  const config = JSON.parse(fs.readFileSync(path.join(HERE, 'config.json'), 'utf8'));
  return Object.keys(config.evals);
}

const minScore = Number(arg('min-score', '95'));
const asJson = process.argv.includes('--json');
const rows = [];
let failed = false;

for (const evalVersion of evalVersions()) {
  const { snapshot, perFixture, structureScore } = evaluateCycle({ evalVersion, label: 'non-mutating check', timestamp: 'check' });
  const failures = detectorFailures(perFixture);
  const structureFailure = evalVersion === 'v2' && structureScore < 5;
  const scoreFailure = snapshot.cycleScore < minScore;

  rows.push({
    evalVersion,
    score: snapshot.cycleScore,
    minScore,
    ruleCount: snapshot.ruleCount,
    fixtureCount: snapshot.fixtureCount,
    structureScore: evalVersion === 'v2' ? structureScore : undefined,
    detectorFailureCount: failures.length,
    failures,
    passed: failures.length === 0 && !structureFailure && !scoreFailure,
  });

  if (failures.length || structureFailure || scoreFailure) failed = true;
}

if (asJson) {
  console.log(JSON.stringify({ passed: !failed, checks: rows }, null, 2));
} else {
  console.log('\nHallmark eval check (non-mutating)\n');
  for (const row of rows) {
    const structure = row.structureScore == null ? '' : `   structure ${row.structureScore.toFixed(2)}/5`;
    const status = row.passed ? 'PASS' : 'FAIL';
    console.log(`${status} ${row.evalVersion}: ${row.score.toFixed(1)}/100   rules ${row.ruleCount}   fixtures ${row.fixtureCount}${structure}`);

    if (row.score < row.minScore) {
      console.log(`  ✗ score below floor: ${row.score.toFixed(1)} < ${row.minScore}`);
    }
    if (row.structureScore != null && row.structureScore < 5) {
      console.log(`  ✗ structure order parameter below 5/5: ${row.structureScore.toFixed(2)}`);
    }
    for (const f of row.failures) {
      console.log(`  ✗ ${f.file} [${f.dim}] ${f.id} — ${f.note}`);
    }
  }
}

process.exitCode = failed ? 1 : 0;
