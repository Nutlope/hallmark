#!/usr/bin/env node
// Hallmark · the draw. Deterministic outside pick for the custom ritual.
// The model lists ~7 grounded directions (the slate) but its own favourite is
// deterministic, so this script assigns WHICH entry gets built. Same brief,
// same day, same reroll count -> same draw. Usage:
//
//   node seed.mjs "<brief-slug>" [--n 7] [--reroll 0] [--wild 2] [--atlas <path>]
//
// Prints one line the model pastes into the Picks block, e.g.:
//   draw: 4/7 (seed coffeebox-subscription·2026-07-23·r0) · wildcards: Airline timetable, Herbarium sheet
//
// No dependencies. Node 18+.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

const args = process.argv.slice(2);
if (args.length === 0 || args[0].startsWith('--')) {
  console.error('usage: node seed.mjs "<brief-slug>" [--n 7] [--reroll 0] [--wild 2] [--atlas <path>]');
  process.exit(2);
}

const slug = args[0].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const flag = (name, dflt) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] !== undefined ? args[i + 1] : dflt;
};

const n = Math.max(2, parseInt(flag('n', '7'), 10) || 7);
const reroll = Math.max(0, parseInt(flag('reroll', '0'), 10) || 0);
const wild = Math.max(0, parseInt(flag('wild', '2'), 10) || 0);
const date = new Date().toISOString().slice(0, 10);

const seedKey = `${slug}·${date}·r${reroll}`;
const hash = fnv1a(seedKey);
const index = (hash % n) + 1; // 1-based slate index

let wildcards = [];
if (wild > 0) {
  const atlasPath = flag('atlas', join(dirname(fileURLToPath(import.meta.url)), '..', 'references', 'direction-atlas.json'));
  try {
    const atlas = JSON.parse(readFileSync(atlasPath, 'utf8'));
    const picked = new Set();
    let salt = 0;
    while (picked.size < Math.min(wild, atlas.length)) {
      const j = fnv1a(`${seedKey}·w${picked.size}·s${salt}`) % atlas.length;
      if (picked.has(j)) { salt++; continue; }
      picked.add(j);
      salt = 0;
    }
    wildcards = [...picked].map((j) => atlas[j]);
  } catch (e) {
    console.error(`(atlas unavailable at ${atlasPath}; drawing without wildcards)`);
  }
}

let line = `draw: ${index}/${n} (seed ${seedKey})`;
if (wildcards.length) line += ` · wildcards: ${wildcards.map((w) => w.name).join(', ')}`;
console.log(line);

for (const w of wildcards) {
  console.log(`  wildcard · ${w.name} · lineage: ${w.lineage}`);
  console.log(`    grammar: ${w.grammar}`);
  console.log(`    fits: ${w.fits.join(', ')}`);
}
