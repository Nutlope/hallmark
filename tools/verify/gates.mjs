#!/usr/bin/env node
/**
 * gates.mjs — run the mechanizable slop-test gates over emitted HTML/CSS.
 *
 *   node tools/verify/gates.mjs site/examples/hum-07
 *   node tools/verify/gates.mjs site/examples site/_tests   # recurses
 *   node tools/verify/gates.mjs --strict <targets>          # advisories fail too
 *
 * A target is a page: an .html file plus any .css it sits beside. Directories
 * are walked; each directory containing an index.html (or any .html) is one page.
 *
 * Exit 1 when any hard gate fails (or any gate at all under --strict).
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { parseCss, extractStyleBlocks } from './lib/css.mjs';
import { GATES } from './lib/slop-gates.mjs';

const args = process.argv.slice(2);
const strict = args.includes('--strict');
const targets = args.filter((a) => !a.startsWith('--'));
if (targets.length === 0) {
  console.error('usage: node tools/verify/gates.mjs [--strict] <file-or-dir> [...]');
  process.exit(2);
}

/** Collect pages: each html file with the css files in its own directory. */
function collectPages(target, pages = new Map()) {
  const st = statSync(target);
  if (st.isFile()) {
    const dir = path.dirname(target);
    if (!pages.has(dir)) pages.set(dir, { html: [], css: [] });
    if (target.endsWith('.html')) pages.get(dir).html.push(target);
    if (target.endsWith('.css')) pages.get(dir).css.push(target);
    return pages;
  }
  for (const entry of readdirSync(target)) {
    if (entry.startsWith('.') || entry === 'node_modules') continue;
    collectPages(path.join(target, entry), pages);
  }
  return pages;
}

const pages = new Map();
for (const t of targets) collectPages(t, pages);

let hardTotal = 0;
let advisoryTotal = 0;
let pagesChecked = 0;

for (const [dir, { html, css }] of [...pages].sort()) {
  if (html.length === 0) continue;
  pagesChecked++;

  const htmlText = html.map((f) => readFileSync(f, 'utf8').replace(/\r\n/g, '\n')).join('\n');
  const inlineCss = extractStyleBlocks(htmlText).map((b) => b.css).join('\n');
  const rawCss = css.map((f) => readFileSync(f, 'utf8').replace(/\r\n/g, '\n')).join('\n') + '\n' + inlineCss;
  const rules = parseCss(rawCss);

  // Custom properties defined anywhere in the page, for one-level var() resolution.
  const customProps = new Map();
  for (const rule of rules) for (const d of rule.decls) if (d.prop.startsWith('--')) customProps.set(d.prop, d.value);

  const classNames = new Set();
  for (const m of htmlText.matchAll(/class="([^"]*)"/g)) for (const c of m[1].split(/\s+/)) if (c) classNames.add(c);

  // The CSS stamp names the genre, which some gates exempt.
  const genre = rawCss.match(/genre:\s*([a-z-]+)/i)?.[1]?.toLowerCase() ?? null;

  const ctx = { rules, rawCss, htmlText, classNames, customProps, genre };
  const pageFindings = [];

  for (const gate of GATES) {
    if (gate.skipWhen?.(ctx)) continue;
    const found = gate.check(ctx);
    if (found.length === 0) continue;
    if (gate.tier === 'hard') hardTotal += found.length;
    else advisoryTotal += found.length;
    pageFindings.push({ gate, found });
  }

  if (pageFindings.length) {
    console.log(`\n${dir.split(path.sep).join('/')}`);
    for (const { gate, found } of pageFindings) {
      const label = gate.tier === 'hard' ? 'FAIL' : 'warn';
      console.log(`  [${label}] gate ${gate.id} — ${gate.name} (${found.length})`);
      for (const f of found.slice(0, 5)) {
        console.log(`         ${f.line ? `L${f.line}  ` : ''}${f.detail}`);
      }
      if (found.length > 5) console.log(`         … and ${found.length - 5} more`);
    }
  }
}

console.log(`\ngates: ${pagesChecked} pages · ${hardTotal} hard failure${hardTotal === 1 ? '' : 's'} · ${advisoryTotal} advisor${advisoryTotal === 1 ? 'y' : 'ies'}${strict ? ' (strict: advisories fail)' : ''}`);

if (hardTotal > 0 || (strict && advisoryTotal > 0)) process.exit(1);
console.log('gates: OK');
