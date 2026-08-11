#!/usr/bin/env node
/**
 * worklist.mjs — machine-readable hard-gate findings per example page.
 * Feeds the ratchet workflow; same resolution logic as gates.mjs.
 *
 *   node tools/verify/worklist.mjs site/examples > worklist.json
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseCss, extractStyleBlocks } from './lib/css.mjs';
import { GATES } from './lib/slop-gates.mjs';

const root = process.argv[2] ?? 'site/examples';
const out = [];

for (const entry of readdirSync(root)) {
  const dir = path.join(root, entry);
  if (!statSync(dir).isDirectory()) continue;
  const files = readdirSync(dir);
  const html = files.filter((f) => f.endsWith('.html')).map((f) => path.join(dir, f));
  const css = files.filter((f) => f.endsWith('.css')).map((f) => path.join(dir, f));
  if (!html.length) continue;

  const htmlText = html.map((f) => readFileSync(f, 'utf8').replace(/\r\n/g, '\n')).join('\n');
  const inline = extractStyleBlocks(htmlText).map((b) => b.css).join('\n');
  const rawCss = css.map((f) => readFileSync(f, 'utf8').replace(/\r\n/g, '\n')).join('\n') + '\n' + inline;
  const rules = parseCss(rawCss);

  const appliesToDocument = (sel) => {
    for (const [, attr, val] of sel.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)) {
      if (!htmlText.includes(val === undefined ? attr : `${attr}="${val}"`)) return false;
    }
    const cls = sel.match(/^\.([\w-]+)/)?.[1];
    if (cls && !new RegExp(`class="[^"]*\\b${cls}\\b`).test(htmlText)) return false;
    return true;
  };

  const customProps = new Map();
  for (const r of rules) {
    if (!r.selectors.some(appliesToDocument)) continue;
    for (const d of r.decls) if (d.prop.startsWith('--')) customProps.set(d.prop, d.value);
  }
  const classNames = new Set();
  for (const m of htmlText.matchAll(/class="([^"]*)"/g)) for (const c of m[1].split(/\s+/)) if (c) classNames.add(c);
  const genre = rawCss.match(/genre:\s*([a-z-]+)/i)?.[1]?.toLowerCase() ?? null;

  const ctx = { rules, rawCss, htmlText, classNames, customProps, genre };
  const findings = [];
  for (const g of GATES) {
    if (g.tier !== 'hard') continue;
    if (g.skipWhen?.(ctx)) continue;
    const f = g.check(ctx);
    if (f.length) {
      findings.push({ gate: g.id, name: g.name, count: f.length, items: f.map((x) => ({ line: x.line, detail: x.detail.slice(0, 160) })) });
    }
  }
  if (findings.length) {
    out.push({ dir: dir.split(path.sep).join('/'), files: [...html, ...css].map((p) => p.split(path.sep).join('/')), hard: findings.reduce((a, f) => a + f.count, 0), genre, findings });
  }
}

process.stdout.write(JSON.stringify(out, null, 1));
console.error(`pages: ${out.length} | hard: ${out.reduce((a, p) => a + p.hard, 0)}`);
for (const p of out) console.error(`  ${p.dir.padEnd(36)} ${String(p.hard).padStart(3)}  ${p.findings.map((f) => `${f.gate}×${f.count}`).join(' ')}  genre:${p.genre ?? '—'}`);
