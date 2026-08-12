#!/usr/bin/env node
/**
 * counts.mjs — one source of truth for every countable claim in the repo.
 *
 * Prose that counts things drifts silently: a theme gets added by PR and the
 * gate that enumerates themes is never updated, so the gate stops firing on the
 * exact case it was written for. This derives the real numbers from the
 * artifacts and asserts the prose agrees.
 *
 * Derived, never hand-written:
 *   themes — from references/themes/tokens/*.css, falling back to the
 *            [data-theme] blocks in site/css/tokens.css before those exist
 *   gates  — from the numbered items in references/slop-test.md
 *
 * Exits 1 on any disagreement.
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const read = (p) => readFileSync(path.join(ROOT, p), 'utf8').replace(/\r\n/g, '\n');

const SKILL = 'skills/hallmark/SKILL.md';
const SLOP = 'skills/hallmark/references/slop-test.md';
const TOKENS_DIR = 'skills/hallmark/references/themes/tokens';
const SITE_TOKENS = 'site/css/tokens.css';

const NUMBER_WORDS = {
  forty: 40, 'forty-one': 41, 'forty-two': 42, 'forty-three': 43, 'forty-four': 44,
  'forty-five': 45, 'forty-six': 46, 'forty-seven': 47, 'forty-eight': 48, 'forty-nine': 49,
  fifty: 50, 'fifty-one': 51, 'fifty-two': 52, 'fifty-three': 53, 'fifty-four': 54,
  'fifty-five': 55, 'fifty-six': 56, 'fifty-seven': 57, 'fifty-eight': 58, 'fifty-nine': 59,
  sixty: 60, 'sixty-one': 61, 'sixty-two': 62, 'sixty-three': 63, 'sixty-four': 64,
  'sixty-five': 65, 'sixty-six': 66, 'sixty-seven': 67, 'sixty-eight': 68, 'sixty-nine': 69,
  nineteen: 19, twenty: 20, 'twenty-one': 21, 'twenty-two': 22, 'twenty-three': 23,
};

const failures = [];
const fail = (what, detail) => failures.push({ what, detail });

// ── Derive the canonical theme list ──────────────────────────────────────────
let themes;
let themeSource;
if (existsSync(path.join(ROOT, TOKENS_DIR))) {
  themes = readdirSync(path.join(ROOT, TOKENS_DIR))
    .filter((f) => f.endsWith('.css'))
    .map((f) => f.replace(/\.css$/, ''))
    .sort();
  themeSource = `${TOKENS_DIR}/*.css`;
} else {
  themes = [...new Set([...read(SITE_TOKENS).matchAll(/\[data-theme="([a-z0-9-]+)"\]/g)].map((m) => m[1]))].sort();
  themeSource = SITE_TOKENS;
}

// ── Derive the gate list ─────────────────────────────────────────────────────
// Gates are ordered-list items: "12. Is ..." — some carry a letter suffix
// ("38a.") as a sub-gate, which counts toward the total.
const slop = read(SLOP);
const gateIds = [...new Set([...slop.matchAll(/^\*{0,2}(\d{1,2}[a-z]?)\./gm)].map((m) => m[1]))];
const numeric = gateIds.filter((g) => /^\d+$/.test(g)).map(Number).sort((a, b) => a - b);
const lettered = gateIds.filter((g) => /[a-z]$/.test(g));
const gateCount = gateIds.length;

console.log(`counts: ${themes.length} themes (from ${themeSource})`);
console.log(`counts: ${gateCount} gates (${numeric.length} numbered + ${lettered.length} sub-gate${lettered.length === 1 ? '' : 's'}: ${lettered.join(', ') || 'none'})`);

// Numbered gates must be a contiguous run from 1 — a hole means a gate was
// deleted without renumbering, and every cross-reference after it now lies.
const holes = [];
for (let n = 1; n <= Math.max(...numeric); n++) if (!numeric.includes(n)) holes.push(n);
if (holes.length) fail('gate numbering', `gaps in the numbered run: ${holes.join(', ')}`);

// ── Claim: gate totals in prose ──────────────────────────────────────────────
const claimPattern = /(\b\d{2}\b|[a-z]+(?:-[a-z]+)?)\s+(?:slop-test\s+)?gates\b/gi;
for (const file of ['README.md', SKILL, SLOP]) {
  const text = read(file);
  for (const m of text.matchAll(claimPattern)) {
    const raw = m[1].toLowerCase();
    const claimed = /^\d+$/.test(raw) ? Number(raw) : NUMBER_WORDS[raw];
    if (claimed === undefined) continue; // "the gates", "these gates" — not a count
    if (claimed !== gateCount) {
      fail(`gate count in ${file}`, `claims ${m[1]} gates, artifact has ${gateCount}`);
    }
  }
}

// ── Claim: theme totals in prose ─────────────────────────────────────────────
const themeClaim = /(\b\d{2}\b|[a-z]+(?:-[a-z]+)?)\s+(?:named\s+)?themes\b/gi;
for (const file of ['README.md', SKILL]) {
  const text = read(file);
  for (const m of text.matchAll(themeClaim)) {
    const raw = m[1].toLowerCase();
    const claimed = /^\d+$/.test(raw) ? Number(raw) : NUMBER_WORDS[raw];
    if (claimed === undefined) continue;
    if (claimed !== themes.length) {
      fail(`theme count in ${file}`, `claims ${m[1]} themes, artifact has ${themes.length}`);
    }
  }
}

// ── Claim: every gate that enumerates themes lists all of them ───────────────
// Gate 57 names the catalog inline to detect studied-DNA drift. A theme missing
// from that list is a theme the gate cannot catch.
// Distinguishing an allowlist from a passing mention matters: gates 38a and 55
// name three themes as examples ("Studio / Garden / Sport"), which is not a list
// the gate tests against. An allowlist reads as a comma-separated run, so that
// is what we look for — a run of this many or more theme names joined by commas.
const ALLOWLIST_RUN = 5;
const themeAlt = themes.join('|');
const RUN = new RegExp(`\\b(?:${themeAlt})\\b(?:\\s*,\\s*(?:and\\s+)?\\b(?:${themeAlt})\\b)+`, 'gi');

const gateBlocks = slop.split(/^(?=\*{0,2}\d{1,2}[a-z]?\.)/m);
const audited = [];
for (const block of gateBlocks) {
  const id = block.match(/^\*{0,2}(\d{1,2}[a-z]?)\./)?.[1];
  if (!id) continue;

  const runs = [...block.matchAll(RUN)].map((m) => m[0].split(/\s*,\s*/).map((s) => s.replace(/^and\s+/i, '').toLowerCase()));
  const longest = runs.sort((a, b) => b.length - a.length)[0] ?? [];
  if (longest.length < ALLOWLIST_RUN) continue;

  audited.push(`${id} (${longest.length} named)`);
  const missing = themes.filter((t) => !longest.includes(t));
  if (missing.length) {
    fail(`gate ${id} theme allowlist`, `omits ${missing.join(', ')} — the gate cannot fire for ${missing.length === 1 ? 'that theme' : 'those themes'}`);
  }
}
console.log(`counts: theme allowlists audited in gate${audited.length === 1 ? '' : 's'} ${audited.join(', ') || '(none found)'}`);

// ── Claim: version is single-sourced ─────────────────────────────────────────
const pkgVersion = JSON.parse(read('package.json')).version;
const skillVersion = read(SKILL).match(/^version:\s*(.+)$/m)?.[1]?.trim();
if (pkgVersion !== skillVersion) {
  fail('version drift', `package.json ${pkgVersion} vs ${SKILL} frontmatter ${skillVersion}`);
}

// ── Report ───────────────────────────────────────────────────────────────────
if (failures.length === 0) {
  console.log('counts: OK — every counted claim matches the artifact');
  process.exit(0);
}
console.error(`\ncounts: FAIL — ${failures.length} claim${failures.length === 1 ? '' : 's'} disagree with the artifact\n`);
for (const { what, detail } of failures) console.error(`  ${what}\n      ${detail}`);
process.exit(1);
