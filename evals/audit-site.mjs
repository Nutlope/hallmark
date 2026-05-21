// Audit real, in-repo Hallmark output with the detector.
//
// The detector reads inline CSS only; the shipped pages link external
// stylesheets. This adapter inlines local <link rel="stylesheet"> files into
// a self-contained snapshot, then scores it under both eval versions so we can
// see what the current skill's gates (v2) catch that the initial skill's
// gates (v1) did not — on artifacts the eval author did not write.
//
// Usage: node audit-site.mjs <page.html> [<page.html> ...]

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { analyze } from './detector.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const CACHE = path.join(HERE, '.site-cache');
fs.mkdirSync(CACHE, { recursive: true });

function inlinePage(htmlPath) {
  const abs = path.resolve(ROOT, htmlPath);
  const dir = path.dirname(abs);
  let html = fs.readFileSync(abs, 'utf8');
  const links = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi)].map((m) => m[0]);
  const blocks = [];
  for (const link of links) {
    const href = (link.match(/href=["']([^"']+)["']/i) || [])[1];
    if (!href || /^https?:|^\/\//i.test(href)) continue; // skip remote (e.g. Google Fonts)
    const cssPath = path.resolve(dir, href.split(/[?#]/)[0]);
    if (fs.existsSync(cssPath)) blocks.push(`/* ${href} */\n${fs.readFileSync(cssPath, 'utf8')}`);
  }
  if (blocks.length) {
    const styleTag = `\n<style data-inlined>\n${blocks.join('\n')}\n</style>\n`;
    html = html.replace(/<\/head>/i, `${styleTag}</head>`);
  }
  const out = path.join(CACHE, htmlPath.replace(/[\/]/g, '__'));
  fs.writeFileSync(out, html);
  return out;
}

const pages = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const rows = [];
for (const p of pages) {
  let snap;
  try { snap = inlinePage(p); } catch (e) { console.error(`skip ${p}: ${e.message}`); continue; }
  const v1 = analyze(snap, 'v1');
  const v2 = analyze(snap, 'v2');
  const v2fails = Object.values(v2.dims).flatMap((d) => d.rules).filter((r) => !r.pass);
  rows.push({ page: p, v1: v1.overall, v2: v2.overall, fails: v2fails, multiTheme: v2.multiTheme, themeCount: v2.themeCount });
}

const name = (p) => p.replace(/^site\//, '').replace(/\/index\.html$/, '/').replace(/index\.html$/, '');
console.log('\nReal Hallmark corpus — detector audit (overall /5)\n');
console.log(`${'page'.padEnd(34)} ${'v1'.padStart(6)} ${'v2'.padStart(6)}   v2 findings`);
console.log('-'.repeat(72));
for (const r of rows) {
  const f = r.fails.length ? r.fails.map((x) => x.id.replace(/^v2-/, '')).join(', ') : '—';
  const tag = r.multiTheme ? ` [multi-theme:${r.themeCount}, low-confidence]` : '';
  console.log(`${name(r.page).padEnd(34)} ${r.v1.toFixed(2).padStart(6)} ${r.v2.toFixed(2).padStart(6)}   ${f}${tag}`);
}
const avg = (k) => (rows.reduce((a, r) => a + r[k], 0) / rows.length).toFixed(2);
console.log('-'.repeat(72));
console.log(`${'CORPUS MEAN'.padEnd(34)} ${avg('v1').padStart(6)} ${avg('v2').padStart(6)}`);
