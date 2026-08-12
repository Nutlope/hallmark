#!/usr/bin/env node
/**
 * links.mjs — resolve every relative markdown link in the repo.
 *
 * The skill's whole runtime behaviour is "read the slim index, then load only the
 * picks". A link that doesn't resolve is a failed file read mid-build, so the link
 * graph is load-bearing, not cosmetic.
 *
 * Exits 1 if any relative link fails to resolve. External links, anchors and
 * mailto/tel/data URIs are out of scope — this checks the tree, not the web.
 *
 *   node tools/verify/links.mjs            # whole repo
 *   node tools/verify/links.mjs --runtime  # only skills/, which is what agents follow
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', 'build', '.cache', '.vercel']);
const EXTERNAL = /^(https?:|mailto:|tel:|data:|ftp:|#)/;

// [text](target) and [text](target#anchor) — the anchor is stripped, not validated.
const LINK = /\]\(\s*<?([^)>\s#]+)(?:#[^)>]*)?>?\s*\)/g;

const runtimeOnly = process.argv.includes('--runtime');

/** Every path in the tree, repo-relative with forward slashes. */
function walk(dir, out = new Set()) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const abs = path.join(dir, entry);
    const rel = path.relative(ROOT, abs).split(path.sep).join('/');
    out.add(rel);
    if (statSync(abs).isDirectory()) walk(abs, out);
  }
  return out;
}

const tree = walk(ROOT);
const markdown = [...tree]
  .filter((p) => p.endsWith('.md'))
  .filter((p) => !runtimeOnly || p.startsWith('skills/'))
  .sort();

let checked = 0;
const broken = [];

for (const file of markdown) {
  // Normalise CRLF: a \r trapped inside a link target silently breaks resolution
  // on Windows checkouts, where git converts line endings on the way in.
  const text = readFileSync(path.join(ROOT, file), 'utf8').replace(/\r\n/g, '\n');
  const dir = path.posix.dirname(file);

  for (const [, rawTarget] of text.matchAll(LINK)) {
    if (EXTERNAL.test(rawTarget)) continue;
    checked++;

    const target = decodeURIComponent(rawTarget);
    const resolved = path.posix.normalize(path.posix.join(dir, target));

    // A link may point at a file or at a directory (e.g. `references/`).
    const trimmed = resolved.replace(/\/$/, '');
    if (tree.has(resolved) || tree.has(trimmed)) continue;
    if (existsSync(path.join(ROOT, trimmed))) continue;

    broken.push({ file, target: rawTarget, resolved });
  }
}

const scope = runtimeOnly ? 'skills/ only' : 'whole repo';
console.log(`links: checked ${checked} relative links across ${markdown.length} markdown files (${scope})`);

if (broken.length === 0) {
  console.log('links: OK — every relative link resolves');
  process.exit(0);
}

// Group by source file so a single mis-typed prefix reads as one problem, not twelve.
const byFile = new Map();
for (const b of broken) {
  if (!byFile.has(b.file)) byFile.set(b.file, []);
  byFile.get(b.file).push(b);
}

// Instances vs unique pairs differ whenever a file repeats the same bad target,
// so report both — one mis-typed prefix is one fix, however many times it appears.
const uniquePairs = new Set(broken.map((b) => `${b.file}|${b.target}`)).size;
console.error(
  `\nlinks: FAIL — ${broken.length} broken instance${broken.length === 1 ? '' : 's'}` +
    ` (${uniquePairs} unique file→target pair${uniquePairs === 1 ? '' : 's'})` +
    ` in ${byFile.size} file${byFile.size === 1 ? '' : 's'}\n`
);
for (const [file, items] of [...byFile].sort()) {
  console.error(`  ${file}`);
  for (const { target, resolved } of items) {
    console.error(`      ${target}\n          → ${resolved}  (does not exist)`);
  }
}
process.exit(1);
