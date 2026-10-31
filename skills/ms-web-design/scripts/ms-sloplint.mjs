#!/usr/bin/env node
// ms-web-design: runs Hallmark's sloplint unchanged, then applies the client-brand override.
// A client's design.md / DESIGN.md / .hallmark/brand-spec.md may decide style on a few Floor gates.
// Each override is declared in the CSS, after the stamp, with its written source:
//   /* ms · marca · <gate> · <file:line that specifies the treatment> */
// Only the gates in BRAND_GATES can be overridden; every other Floor finding stays a FAIL.
// Usage: same arguments as sloplint.mjs (do not pass --json; this script adds it).

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
// Floor 3 -> 38i · Floor 9 -> 54, 67 · Floor 10 -> 63 · Floor 11 (purple-to-blue gradient only) -> 2a
const BRAND_GATES = new Set(['38i', '54', '67', '63', '2a']);
const BRAND_FILES = ['design.md', 'DESIGN.md', '.hallmark/brand-spec.md'];

const args = process.argv.slice(2).filter((a) => a !== '--json');
const run = spawnSync(process.execPath, [join(HERE, 'sloplint.mjs'), ...args, '--json'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
if (run.stderr) process.stderr.write(run.stderr);
let report;
try { report = JSON.parse(run.stdout); } catch {
  process.stdout.write(run.stdout || '');
  process.exit(run.status ?? 1);
}

// Collect the CSS and HTML the user pointed at, to read the override lines.
const texts = [];
const walk = (p, depth = 0) => {
  if (!existsSync(p) || depth > 6) return;
  const s = statSync(p);
  if (s.isDirectory()) {
    for (const n of readdirSync(p)) if (!['node_modules', '.git', '.hallmark', 'dist', 'build'].includes(n)) walk(join(p, n), depth + 1);
  } else if (['.css', '.html', '.htm', '.scss'].includes(extname(p).toLowerCase())) {
    texts.push(readFileSync(p, 'utf8'));
  }
};
for (const a of args) if (!a.startsWith('--') && !/^https?:/.test(a)) walk(resolve(a));

const brandSource = BRAND_FILES.find((f) => existsSync(resolve(f)));
const declared = new Map();
const rejected = [];
const re = /\/\*\s*ms\s*·\s*marca\s*·\s*([0-9]{1,2}[a-z]{0,3})\s*·\s*([^*]+?)\s*\*\//gi;
for (const t of texts) for (const m of t.matchAll(re)) {
  const gate = m[1].toLowerCase();
  if (!BRAND_GATES.has(gate)) rejected.push(`${gate}: not a brand gate (only ${[...BRAND_GATES].join(', ')})`);
  else if (!brandSource) rejected.push(`${gate}: no design.md, DESIGN.md or .hallmark/brand-spec.md in this project`);
  else declared.set(gate, m[2].trim());
}

let fails = 0, reflex = 0;
const lines = [];
for (const f of report.findings || []) {
  const g = String(f.gate).toLowerCase();
  if (f.grade === 'FAIL' && declared.has(g)) f.grade = 'MARCA';
  if (f.grade === 'FAIL') fails++;
  if (f.grade === 'REFLEX') reflex++;
  lines.push(`  ${f.grade} ${f.gate} ${f.file}:${f.line} ${f.evidence}${f.grade === 'FAIL' || f.grade === 'REFLEX' ? ` | fix: ${f.fix}` : ''}`);
}
for (const l of lines) console.log(l);
for (const [g, src] of declared) console.log(`  MARCA ${g}: overridden by the client brand (${src}; ${brandSource})`);
for (const r of rejected) console.log(`  MARCA REJECTED ${r}`);
const s = report.summary || {};
console.log(`ms-sloplint: ${fails} FAIL, ${reflex} REFLEX, ${s.warns ?? 0} WARN, ${declared.size} brand override(s). render: ${s.render ?? 'off'}`);
process.exit(fails > 0 || reflex > 0 ? 1 : 0);
