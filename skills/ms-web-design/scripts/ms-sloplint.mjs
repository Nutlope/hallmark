#!/usr/bin/env node
// ms-web-design: runs Hallmark's sloplint unchanged, then adds what is ours.
//
// 1. Client-brand override. A client's design.md / DESIGN.md / .hallmark/brand-spec.md may decide style
//    on a few Floor gates. Each override is declared in the CSS, after the stamp, with its written source:
//      /* ms · marca · <gate> · <file:line that specifies the treatment> */
//    Only the gates in BRAND_GATES can be overridden; every other Floor finding stays a FAIL.
//    A design.md written by ms-arte.md carries an "Origen: ms-web-design" line: it grants no override
//    unless it has a "## Marca del cliente" section citing the client's own source.
// 2. Motion posture. "Motion: protagonista" in design.md, or "motion: protagonista" in the stamp, turns
//    F8 (more than one scroll pattern) into a note (references/ms-movimiento.md).
// 3. ms checks, all Reflex, on the CSS and HTML the user pointed at:
//      ms-hover   content revealed only on :hover, with no focus or touch equivalent
//      ms-cursor  the pointer hidden or replaced by a custom image
//      ms-scroll  scrolling taken over: mandatory snap or overflow hidden on the page, a wheel handler
//                 that prevents default
//      ms-intro   a full-screen loader or intro in front of the content
//    Waive one on the record with a real reason: /* ms · waive · <ms-gate> · <reason> */
// Usage: same arguments as sloplint.mjs (do not pass --json; this script adds it).

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
// Floor 3 -> 38i · Floor 9 -> 54, 67 · Floor 10 -> 63 · Floor 11 (purple-to-blue gradient only) -> 2a
const BRAND_GATES = new Set(['38i', '54', '67', '63', '2a']);
const BRAND_FILES = ['design.md', 'DESIGN.md', '.hallmark/brand-spec.md'];
const MS_GATES = {
  'ms-hover': 'Give the hidden content a :focus-within state and show it under @media (hover: none), or show it at rest',
  'ms-cursor': 'Keep the system pointer; signal state on the element itself',
  'ms-scroll': 'Let the page scroll natively: proximity snap at most, no overflow hidden on html or body, no prevented wheel',
  'ms-intro': 'Show the content at once; a loader belongs inside the one slot that is still loading',
};

const args = process.argv.slice(2).filter((a) => a !== '--json');
const run = spawnSync(process.execPath, [join(HERE, 'sloplint.mjs'), ...args, '--json'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
if (run.stderr) process.stderr.write(run.stderr);
let report;
try { report = JSON.parse(run.stdout); } catch {
  process.stdout.write(run.stdout || '');
  process.exit(run.status ?? 1);
}

// The CSS and HTML the user pointed at.
const docs = [];
const walk = (p, depth = 0) => {
  if (!existsSync(p) || depth > 6) return;
  const s = statSync(p);
  if (s.isDirectory()) {
    for (const n of readdirSync(p)) if (!['node_modules', '.git', '.hallmark', 'dist', 'build'].includes(n)) walk(join(p, n), depth + 1);
  } else if (['.css', '.html', '.htm', '.scss'].includes(extname(p).toLowerCase())) {
    docs.push({ file: relative(process.cwd(), p) || p, text: readFileSync(p, 'utf8') });
  }
};
const VALUED = new Set(['--genre', '--scope', '--url', '--stage', '--theme']);
args.forEach((a, i) => { if (!a.startsWith('--') && !/^https?:/.test(a) && !VALUED.has(args[i - 1])) walk(resolve(a)); });
const allText = docs.map((d) => d.text).join('\n');

// 1. Brand.
const brandSource = BRAND_FILES.find((f) => existsSync(resolve(f)));
const brandText = brandSource ? readFileSync(resolve(brandSource), 'utf8') : '';
const ours = /^Origen:\s*ms-web-design/m.test(brandText);
const clientSection = /^##\s+Marca del cliente\b/m.test(brandText);
const declared = new Map();
const rejected = [];
const re = /\/\*\s*ms\s*·\s*marca\s*·\s*([0-9]{1,2}[a-z]{0,3})\s*·\s*([^*]+?)\s*\*\//gi;
for (const m of allText.matchAll(re)) {
  const gate = m[1].toLowerCase();
  if (!BRAND_GATES.has(gate)) rejected.push(`${gate}: not a brand gate (only ${[...BRAND_GATES].join(', ')})`);
  else if (!brandSource) rejected.push(`${gate}: no design.md, DESIGN.md or .hallmark/brand-spec.md in this project`);
  else if (ours && !clientSection) rejected.push(`${gate}: ${brandSource} was written by ms-web-design (Origen line) and has no "## Marca del cliente" section`);
  else declared.set(gate, m[2].trim());
}

// 2. Motion posture.
const protagonista = /^\s*-?\s*Motion:\s*protagonista\b/im.test(brandText) || /motion:\s*protagonista\b/i.test(allText);

// 3. ms checks.
const lineAt = (src, i) => src.slice(0, i).split('\n').length;
function cssOf(doc) {
  if (/\.(css|scss)$/i.test(doc.file)) return [{ css: doc.text, offset: 0 }];
  return [...doc.text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => ({ css: m[1], offset: m.index + m[0].indexOf(m[1]) }));
}
function rulesOf(doc) {
  const out = [];
  for (const { css, offset } of cssOf(doc)) {
    const src = css.replace(/\/\*[\s\S]*?\*\//g, (c) => ' '.repeat(c.length));
    const stack = [];
    let start = 0;
    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      if (ch === '{') {
        const head = src.slice(start, i).trim();
        stack.push({ head, at: i });
        start = i + 1;
      } else if (ch === '}') {
        const open = stack.pop();
        if (!open) { start = i + 1; continue; }
        const body = src.slice(open.at + 1, i);
        if (!open.head.startsWith('@') && !body.includes('{')) {
          const decls = body.split(';').map((d) => d.trim()).filter(Boolean).map((d) => {
            const k = d.indexOf(':');
            return k < 0 ? null : { prop: d.slice(0, k).trim().toLowerCase(), value: d.slice(k + 1).trim().toLowerCase() };
          }).filter(Boolean);
          const media = stack.filter((s) => s.head.startsWith('@')).map((s) => s.head).join(' ');
          out.push({ selector: open.head.replace(/\s+/g, ' '), decls, media, file: doc.file, line: lineAt(doc.text, offset + open.at - open.head.length) });
        }
        start = i + 1;
      }
    }
  }
  return out;
}
const rules = docs.flatMap(rulesOf);
const msFindings = [];
const flag = (gate, r, evidence) => msFindings.push({ gate, file: r.file, line: r.line, evidence });
const val = (r, prop) => { const d = r.decls.filter((x) => x.prop === prop).pop(); return d ? d.value : null; };
const parts = (sel) => sel.split(',').map((s) => s.trim()).filter(Boolean);
const STATEFUL = /:hover|:focus|:active|:checked|:target|:disabled|\[open|\[aria-|\.is-|\.js|\.no-js|\[data-state/i;

// ms-hover
const hides = (r) => val(r, 'opacity') === '0' || val(r, 'visibility') === 'hidden' || val(r, 'display') === 'none';
const shows = (r) => { const o = val(r, 'opacity'); const v = val(r, 'visibility'); const d = val(r, 'display');
  return (o !== null && parseFloat(o) > 0.5) || v === 'visible' || (d !== null && d !== 'none'); };
const tailAfter = (part, pseudo) => part.split(pseudo).slice(1).join(pseudo).replace(/^[^\s>+~]*/, '').replace(/^[\s>+~]+/, '').trim();
const touchFallback = rules.some((r) => /\(\s*(any-)?hover\s*:\s*none\s*\)|\(\s*(any-)?pointer\s*:\s*coarse\s*\)/.test(r.media));
const focusTails = new Set();
for (const r of rules) for (const p of parts(r.selector)) for (const ps of [':focus-within', ':focus-visible', ':focus']) if (p.includes(ps)) { const t = tailAfter(p, ps); if (t) focusTails.add(t); }
const hiddenTails = new Set();
for (const r of rules) if (hides(r)) for (const p of parts(r.selector)) if (!STATEFUL.test(p)) hiddenTails.add(p.split(/[\s>+~]+/).pop());
const seenHover = new Set();
for (const r of rules) {
  if (!shows(r)) continue;
  for (const p of parts(r.selector)) {
    if (!p.includes(':hover')) continue;
    const tail = tailAfter(p, ':hover');
    if (!tail) continue;
    const last = tail.split(/[\s>+~]+/).pop();
    if (!hiddenTails.has(last) || focusTails.has(tail) || touchFallback || seenHover.has(tail)) continue;
    seenHover.add(tail);
    flag('ms-hover', r, `${tail} is hidden at rest and shown only on ${p}`);
  }
}

// ms-cursor
for (const r of rules) {
  const c = val(r, 'cursor');
  if (!c || /:disabled|\[disabled|\[aria-disabled/.test(r.selector)) continue;
  if (c === 'none' || c.startsWith('url(')) flag('ms-cursor', r, `cursor: ${c} on ${r.selector}`);
}

// ms-scroll
const PAGE = /^(html|body|:root|main)$/;
for (const r of rules) {
  if (!parts(r.selector).some((p) => PAGE.test(p))) continue;
  const snap = val(r, 'scroll-snap-type');
  if (snap && /mandatory/.test(snap)) flag('ms-scroll', r, `scroll-snap-type: ${snap} on ${r.selector}`);
  for (const prop of ['overflow', 'overflow-y']) {
    const o = val(r, prop);
    if (!o) continue;
    const [x, y = x] = o.split(/\s+/);
    const blocked = prop === 'overflow-y' ? /^(hidden|clip)$/.test(x) : /^(hidden|clip)$/.test(y);
    if (blocked) flag('ms-scroll', r, `${prop}: ${o} on ${r.selector} at rest`);
  }
}
for (const d of docs) {
  if (!/\.html?$/i.test(d.file)) continue;
  for (const m of d.text.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
    const js = m[1];
    const w = /addEventListener\(\s*['"](wheel|mousewheel|touchmove)['"]/.exec(js);
    if (w && /preventDefault\s*\(/.test(js)) msFindings.push({ gate: 'ms-scroll', file: d.file, line: lineAt(d.text, m.index + m[0].indexOf(js) + w.index), evidence: `a ${w[1]} handler that calls preventDefault` });
  }
}

// ms-intro
const FULL = (r) => val(r, 'inset') === '0' || val(r, 'inset') === '0px'
  || ((val(r, 'top') === '0' || val(r, 'top') === '0px') && (val(r, 'left') === '0' || val(r, 'left') === '0px') && /^(100%|100[dsl]?v[wh])$/.test(val(r, 'width') || val(r, 'height') || ''));
for (const r of rules) {
  if (!/(pre)?loader|splash|intro-?screen|page-?intro|curtain|loading-?screen/i.test(r.selector)) continue;
  if (val(r, 'position') === 'fixed' && FULL(r)) flag('ms-intro', r, `${r.selector} covers the screen (position: fixed, full size)`);
}

// Waivers for ms gates.
const msWaived = new Map();
const msRejected = [];
for (const m of allText.matchAll(/\/\*\s*ms\s*·\s*waive\s*·\s*(ms-[a-z]+)\s*·\s*([^*]*?)\s*\*\//gi)) {
  const g = m[1].toLowerCase(); const why = m[2].trim();
  if (!MS_GATES[g]) msRejected.push(`${g}: not an ms gate (${Object.keys(MS_GATES).join(', ')})`);
  else if (why.length < 12) msRejected.push(`${g}: the reason is missing or too short`);
  else msWaived.set(g, why);
}

// Report.
let fails = 0, reflex = 0, notes = 0;
const lines = [];
for (const f of report.findings || []) {
  const g = String(f.gate).toLowerCase();
  if (f.grade === 'FAIL' && declared.has(g)) f.grade = 'MARCA';
  if (protagonista && f.gate === 'F8') { f.grade = 'MOVIMIENTO'; notes++; }
  if (f.grade === 'FAIL') fails++;
  if (f.grade === 'REFLEX') reflex++;
  lines.push(`  ${f.grade} ${f.gate} ${f.file}:${f.line} ${f.evidence}${f.grade === 'FAIL' || f.grade === 'REFLEX' ? ` | fix: ${f.fix}` : ''}`);
}
for (const f of msFindings) {
  const grade = msWaived.has(f.gate) ? 'WAIVED' : 'REFLEX';
  if (grade === 'REFLEX') reflex++;
  lines.push(`  ${grade} ${f.gate} ${f.file}:${f.line} ${f.evidence}${grade === 'REFLEX' ? ` | fix: ${MS_GATES[f.gate]}` : ` | waived: ${msWaived.get(f.gate)}`}`);
}
for (const l of lines) console.log(l);
for (const [g, src] of declared) console.log(`  MARCA ${g}: overridden by the client brand (${src}; ${brandSource})`);
for (const r of rejected) console.log(`  MARCA REJECTED ${r}`);
for (const r of msRejected) console.log(`  WAIVE REJECTED ${r}`);
if (protagonista) console.log('  MOVIMIENTO posture: protagonista (references/ms-movimiento.md); F8 reported as a note');
const s = report.summary || {};
console.log(`ms-sloplint: ${fails} FAIL, ${reflex} REFLEX, ${s.warns ?? 0} WARN, ${declared.size} brand override(s), ${msFindings.length} ms finding(s)${notes ? `, ${notes} motion note(s)` : ''}. render: ${s.render ?? 'off'}`);
process.exit(fails > 0 || reflex > 0 ? 1 : 0);
