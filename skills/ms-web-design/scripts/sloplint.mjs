#!/usr/bin/env node
/* sloplint: Hallmark's mechanical gate checker. Zero dependencies, Node 18+. Gate ids and tiers: references/gates.md. */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync, realpathSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, extname, dirname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const GENRES = ['editorial', 'modern-minimal', 'atmospheric', 'playful'];
const args = process.argv.slice(2);
const opts = { genre: null, scope: 'page', json: false, render: false, tier: null, stage: 'page', before: false, kept: false, urls: [], paths: [] };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--genre') { opts.genre = args[++i]; }
  else if (a === '--scope') { opts.scope = args[++i]; }
  else if (a === '--json') { opts.json = true; }
  else if (a === '--render') { opts.render = true; }
  else if (a === '--before') { opts.before = true; }
  else if (a === '--kept') { opts.kept = true; }
  else if (a === '--tier') { opts.tier = args[++i]; }
  else if (a === '--stage') { opts.stage = args[++i]; }
  else if (a === '--url') { opts.urls.push(args[++i]); opts.render = true; }
  else if (a === '--help' || a === '-h') { usage(); process.exit(0); }
  else if (a.startsWith('--')) { console.error(`unknown flag ${a}`); usage(); process.exit(2); }
  else opts.paths.push(a);
}
function usage() {
  console.error('usage: node sloplint.mjs <file-or-dir ...> [--genre editorial|modern-minimal|atmospheric|playful] [--scope page|component|app] [--stage hero|page] [--json] [--render] [--url http://localhost:3000] [--tier floor] [--before | --kept]');
  console.error('--before records what the target says and does (.hallmark/before.json, screenshots in .hallmark/before); --kept checks a redesign against that record');
  console.error('reads .html and .css, plus .jsx .tsx .vue .svelte .astro (Tailwind class strings, cn/clsx/cva calls); skips node_modules, dist, build, coverage and dot folders');
}
if (!opts.paths.length && !opts.urls.length) { usage(); process.exit(2); }
if (!['hero', 'page'].includes(opts.stage)) { console.error('--stage must be hero or page'); process.exit(2); }
if (opts.urls.some((u) => !/^https?:\/\//.test(u || ''))) { console.error('--url takes an http or https address'); process.exit(2); }
if (opts.genre && !GENRES.includes(opts.genre)) {
  console.error(`--genre must be one of: ${GENRES.join(', ')}`); process.exit(2);
}
if (!['page', 'component', 'app'].includes(opts.scope)) {
  console.error('--scope must be page, component or app'); process.exit(2);
}
if (opts.before && opts.kept) { console.error('--before records and --kept compares; pass one'); process.exit(2); }

const DOC_EXT = new Set(['.html', '.jsx', '.tsx', '.vue', '.svelte', '.astro']);
const BUILD_DIRS = new Set(['dist', 'build', 'coverage']);
function collectFiles(paths) {
  const files = [];
  const seen = new Set();
  const visit = (p, top) => {
    const abs = resolve(p);
    let st;
    let real;
    try { st = statSync(abs); real = realpathSync(abs); } catch { console.error(`sloplint: cannot read ${p}`); if (top) process.exit(2); return; }
    if (seen.has(real)) return;
    seen.add(real);
    if (st.isDirectory()) {
      const base = basename(abs);
      if (base === 'node_modules' || base.startsWith('.') || (!top && BUILD_DIRS.has(base))) return;
      for (const e of readdirSync(abs)) visit(join(abs, e), false);
    } else {
      const ext = extname(abs).toLowerCase();
      if (ext === '.css' || DOC_EXT.has(ext)) files.push(abs);
    }
  };
  for (const p of paths) visit(p, true);
  return files;
}

function stripComments(src) {
  let out = '';
  let i = 0;
  while (i < src.length) {
    if (src[i] === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      const stop = end === -1 ? src.length : end + 2;
      out += src.slice(i, stop).replace(/[^\n]/g, ' ');
      i = stop;
    } else if (src[i] === '"' || src[i] === "'") {
      const q = src[i]; let j = i + 1;
      while (j < src.length && src[j] !== q) { if (src[j] === '\\') j++; j++; }
      out += src.slice(i, Math.min(j + 1, src.length)); i = j + 1;
    } else { out += src[i]; i++; }
  }
  return out;
}

function parseCss(source, file, lineOffset = 0) {
  const src = stripComments(source);
  const nl = [];
  for (let i = 0; i < src.length; i++) if (src[i] === '\n') nl.push(i);
  const lineOf = (pos) => {
    let lo = 0, hi = nl.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (nl[mid] < pos) lo = mid + 1; else hi = mid; }
    return lo + 1 + lineOffset;
  };
  const rules = [];
  const flatBody = (s, e) => {
    const out = src.slice(s, e).split('');
    let depth = 0, edge = -1;
    for (let i = 0; i < out.length; i++) {
      const c = out[i];
      if (c === '{') {
        if (depth === 0) for (let k = edge + 1; k < i; k++) if (out[k] !== '\n') out[k] = ' ';
        depth++; out[i] = ' ';
      } else if (c === '}') {
        depth = Math.max(0, depth - 1); out[i] = ' ';
        if (depth === 0) edge = i;
      } else if (depth > 0) { if (c !== '\n') out[i] = ' '; }
      else if (c === ';') edge = i;
    }
    return out.join('');
  };
  const nestSel = (sel, parent) => {
    const p = parent.includes(',') ? `:is(${parent})` : parent;
    return sel.split(/,(?![^(]*\))/).map((part) => part.includes('&') ? part.trim().replace(/&/g, p) : `${p} ${part.trim()}`).join(', ');
  };
  const makeRule = (selector, s, e, media, keyframes) => {
    const body = flatBody(s, e);
    const decls = [];
    let off = 0;
    for (const part of body.split(';')) {
      const idx = part.indexOf(':');
      if (idx > 0) {
        const prop = part.slice(0, idx).trim().toLowerCase();
        const value = part.slice(idx + 1).trim().replace(/!important\s*$/i, '').trim();
        if (prop && value && /^-{0,2}[a-z]/.test(prop) && !/[{}]/.test(prop)) {
          decls.push({ prop, value, line: lineOf(s + off + idx) });
        }
      }
      off += part.length + 1;
    }
    return { selector, decls, media: media || null, keyframes: keyframes || null, file, line: lineOf(s) };
  };
  const walk = (start, end, media, keyframes, parent = null) => {
    let i = start;
    while (i < end) {
      while (i < end && /[\s;]/.test(src[i])) i++;
      if (i >= end) break;
      let j = i;
      while (j < end && src[j] !== '{' && src[j] !== '}' && src[j] !== ';') j++;
      if (j >= end) break;
      if (src[j] === '}' || src[j] === ';') { i = j + 1; continue; }
      const selector = src.slice(i, j).trim().replace(/\s+/g, ' ');
      const blockStart = j + 1;
      let depth = 1, k = blockStart;
      while (k < end && depth > 0) {
        if (src[k] === '{') depth++;
        else if (src[k] === '}') depth--;
        k++;
      }
      const blockEnd = Math.max(blockStart, k - 1);
      if (selector.startsWith('@')) {
        if (/^@(media|supports|layer|container|scope)/i.test(selector)) {
          const q = /^@media/i.test(selector) ? selector.replace(/^@media/i, '').trim() : media;
          if (parent) rules.push(makeRule(parent, blockStart, blockEnd, q, keyframes));
          walk(blockStart, blockEnd, q, keyframes, parent);
        } else if (/^@(-webkit-)?keyframes/i.test(selector)) {
          const name = selector.replace(/^@(-webkit-)?keyframes/i, '').trim();
          walk(blockStart, blockEnd, media, name || 'anon');
        } else if (/^@font-face/i.test(selector)) {
          rules.push(makeRule('@font-face', blockStart, blockEnd, media, null));
        } else if (/^@theme\b/i.test(selector)) {
          rules.push(makeRule('@theme', blockStart, blockEnd, media, null));
          walk(blockStart, blockEnd, media, keyframes);
        }
      } else {
        const sel = parent && !keyframes ? nestSel(selector, parent) : selector;
        rules.push(makeRule(sel, blockStart, blockEnd, media, keyframes));
        if (!keyframes && src.slice(blockStart, blockEnd).includes('{')) walk(blockStart, blockEnd, media, keyframes, sel);
      }
      i = k;
    }
  };
  walk(0, src.length, null, null);
  return rules;
}

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const HTML_NAMES = new Set(('a abbr address area article aside audio b base bdi bdo blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd label legend li link main map mark menu meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script search section select slot small source span strong style sub summary sup svg table tbody td template textarea tfoot th thead time title tr track u ul var video wbr').split(' '));

function parseHtml(file, src, kind = 'html') {
  const nl = [];
  for (let i = 0; i < src.length; i++) if (src[i] === '\n') nl.push(i);
  const lineOf = (pos) => {
    let lo = 0, hi = nl.length;
    while (lo < hi) { const mid = (lo + hi) >> 1; if (nl[mid] < pos) lo = mid + 1; else hi = mid; }
    return lo + 1;
  };
  const styles = [];
  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  let m;
  while ((m = styleRe.exec(src))) {
    styles.push({ css: m[1], lineOffset: lineOf(m.index) - 1 });
  }
  let scripts = '';
  const scriptRe = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  while ((m = scriptRe.exec(src))) scripts += m[1] + '\n';

  const pad = (t) => t.replace(/[^\n]/g, ' ');
  const masked = src
    .replace(/<!--[\s\S]*?-->/g, pad)
    .replace(/(<(script|style)\b[^>]*>)([\s\S]*?)(<\/\2\s*>)/gi, (m0, open, tag, body, close) => open + pad(body) + close);
  const tags = [];
  const comps = [];
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
  while ((m = tagRe.exec(masked))) {
    if (kind !== 'html' && !HTML_NAMES.has(m[2])) {
      comps.push({ close: m[1] === '/', name: m[2], attrs: m[3] || '', pos: m.index, end: m.index + m[0].length, selfClosing: /\/\s*$/.test(m[3] || ''), line: lineOf(m.index) });
      continue;
    }
    tags.push({
      close: m[1] === '/', name: m[2].toLowerCase(), attrs: m[3] || '',
      pos: m.index, end: m.index + m[0].length,
      selfClosing: /\/\s*$/.test(m[3] || '') || VOID_TAGS.has(m[2].toLowerCase()),
      line: lineOf(m.index),
    });
  }
  const noScript = src.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const text = noScript.replace(/<[^>]*>/g, ' ')
    .replace(/&quot;|&#0?34;/g, '"').replace(/&#0?39;|&apos;/g, "'")
    .replace(/&hellip;|&#8230;/g, '\u2026').replace(/&mdash;|&#8212;|&#x2014;/gi, '\u2014').replace(/&ndash;|&#8211;|&#x2013;/gi, '\u2013')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/[ \t]+/g, ' ');
  return { file, src, masked, styles, scripts, tags, text, lineOf, kind, comps };
}

function braceEnd(s, j) {
  let depth = 0;
  for (let i = j; i < s.length; i++) {
    const c = s[i];
    if (c === '"' || c === "'" || c === '`') {
      i++;
      while (i < s.length && s[i] !== c) { if (s[i] === '\\') i++; i++; }
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return i;
  }
  return s.length;
}

const FRONTMATTER = /^\s*---[^\n]*\n[\s\S]*?\n---/;
function templateMask(src, kind) {
  const n = src.length;
  let out = null;
  const put = (k, ch) => { if (!out) out = src.split(''); out[k] = ch; };
  const blank = (a, b) => { for (let k = a; k < b; k++) if (src[k] !== '\n' && src[k] !== ' ') put(k, ' '); };
  const lower = src.toLowerCase();
  const braces = kind === 'svelte' || kind === 'astro';
  let i = 0;
  if (kind === 'astro') {
    const fm = FRONTMATTER.exec(src);
    if (fm) { blank(0, fm[0].length); i = fm[0].length; }
  }
  while (i < n) {
    const lt = src.indexOf('<', i);
    if (lt < 0) break;
    if (src.startsWith('<!--', lt)) { const e = src.indexOf('-->', lt + 4); i = e < 0 ? n : e + 3; continue; }
    if (!/[A-Za-z]/.test(src[lt + 1] || '')) { i = lt + 1; continue; }
    let j = lt + 1;
    while (j < n && /[\w:.-]/.test(src[j])) j++;
    const name = lower.slice(lt + 1, j);
    while (j < n && src[j] !== '>') {
      const c = src[j];
      if (c === '"' || c === "'") {
        let e = src.indexOf(c, j + 1);
        if (e < 0) e = n;
        for (let k = j + 1; k < e; k++) if (src[k] === '<' || src[k] === '>') put(k, ' ');
        j = e + 1;
        continue;
      }
      if (c === '{' && braces) { const e = braceEnd(src, j); blank(j + 1, e); j = e + 1; continue; }
      j++;
    }
    i = j + 1;
    if (name === 'script' || name === 'style' || name === 'textarea') {
      const e = lower.indexOf('</' + name, i);
      i = e < 0 ? n : e;
    }
  }
  return out ? out.join('') : src;
}

const cutGlued = (seg, after, before) => {
  let s = seg;
  if (after) s = s.replace(/^\S+/, '');
  if (before) s = s.replace(/\S+$/, '');
  return s;
};
function clsLits(s, level = 0) {
  if (level > 20) return [];
  const parts = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === '/' && s[i + 1] === '/') { const e = s.indexOf('\n', i); i = e < 0 ? s.length : e; continue; }
    if (c === '/' && s[i + 1] === '*') { const e = s.indexOf('*/', i + 2); i = e < 0 ? s.length : e + 2; continue; }
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < s.length && s[j] !== c && s[j] !== '\n') { if (s[j] === '\\') j++; j++; }
      parts.push(s.slice(i + 1, j));
      i = j + 1;
      continue;
    }
    if (c === '`') {
      let j = i + 1, seg = '', after = false;
      while (j < s.length && s[j] !== '`') {
        if (s[j] === '\\') { seg += s[j + 1] || ''; j += 2; continue; }
        if (s[j] === '$' && s[j + 1] === '{') {
          parts.push(cutGlued(seg, after, true));
          const e = braceEnd(s, j + 1);
          parts.push(clsLits(s.slice(j + 2, e), level + 1).join(' '));
          j = e + 1; seg = ''; after = true;
          continue;
        }
        seg += s[j]; j++;
      }
      parts.push(cutGlued(seg, after, false));
      i = j + 1;
      continue;
    }
    i++;
  }
  return parts.join(' ').split(/\s+/).filter(Boolean);
}

const JS_EXPR_KW = new Set(['return', 'yield', 'await', 'case', 'default', 'else', 'do', 'throw', 'typeof', 'void', 'delete', 'in', 'of', 'new', 'instanceof']);
const CLASS_FNS = new Set(['cn', 'clsx', 'classNames', 'classnames', 'twMerge', 'twJoin', 'cva', 'cx', 'tv']);
function jsxPseudo(src) {
  const n = src.length;
  const out = new Array(n);
  for (let k = 0; k < n; k++) out[k] = src[k] === '\n' ? '\n' : ' ';
  const classes = [];
  const calls = [];
  let hi = 0, fails = 0, inClass = 0, depth = 0;
  const blank = (a, b) => { for (let k = a; k < b && k < n; k++) out[k] = src[k] === '\n' ? '\n' : ' '; };
  const paint = (a, b) => { for (let k = a; k < b && k < n; k++) out[k] = src[k]; if (b > hi) hi = b; };
  const write = (a, b, text) => {
    blank(a, b);
    let k = a;
    for (const ch of text) { while (k < b && src[k] === '\n') k++; if (k >= b) break; out[k++] = ch; }
    if (b > hi) hi = b;
  };
  const ws = (i) => { while (i < n && /\s/.test(src[i])) i++; return i; };
  const gap = (i) => {
    for (;;) {
      i = ws(i);
      if (src[i] === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); if (e < 0) return n; i = e + 2; continue; }
      if (src[i] === '/' && src[i + 1] === '/') { const e = src.indexOf('\n', i); if (e < 0) return n; i = e; continue; }
      return i;
    }
  };
  const strEnd = (i) => {
    const q = src[i];
    let j = i + 1;
    while (j < n && src[j] !== q && src[j] !== '\n') { if (src[j] === '\\') j++; j++; }
    return Math.min(j + 1, n);
  };
  const tplEnd = (i) => {
    let j = i + 1;
    while (j < n && src[j] !== '`') {
      if (src[j] === '\\') { j += 2; continue; }
      if (src[j] === '$' && src[j + 1] === '{') { j = js(j + 2, true) + 1; continue; }
      j++;
    }
    return Math.min(j + 1, n);
  };
  const reEnd = (i) => {
    let j = i + 1, set = false;
    while (j < n && src[j] !== '\n') {
      const c = src[j];
      if (c === '\\') { j += 2; continue; }
      if (c === '[') set = true;
      else if (c === ']') set = false;
      else if (c === '/' && !set) { j++; while (j < n && /[a-z]/i.test(src[j])) j++; return j; }
      j++;
    }
    return -1;
  };
  function js(i, stop) {
    if (depth > 200) return stop ? Math.min(braceEnd(src, i - 1), n) : n;
    depth++;
    const r = jsScan(i, stop);
    depth--;
    return r;
  }
  function jsScan(i, stop) {
    let level = 0, val = false;
    while (i < n) {
      const c = src[i];
      if (c === ' ' || c === '\n' || c === '\t' || c === '\r') { i++; continue; }
      if (c === '/' && src[i + 1] === '/') { const e = src.indexOf('\n', i); i = e < 0 ? n : e; continue; }
      if (c === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); i = e < 0 ? n : e + 2; continue; }
      if (c === '"' || c === "'") { i = strEnd(i); val = true; continue; }
      if (c === '`') { i = tplEnd(i); val = true; continue; }
      if (c === '{') { level++; i++; val = false; continue; }
      if (c === '}') { if (stop && level === 0) return i; level--; i++; val = true; continue; }
      if (c === ')' || c === ']') { i++; val = true; continue; }
      if (c === '<' && !val && fails < 500 && /[A-Za-z_$>]/.test(src[i + 1] || '')) {
        const e = el(i);
        if (e > 0) { i = e; val = true; continue; }
        fails++;
      }
      if (c === '/' && !val) { const e = reEnd(i); if (e > 0) { i = e; val = true; continue; } }
      if (/[A-Za-z_$]/.test(c)) {
        let j = i + 1;
        while (j < n && /[\w$]/.test(src[j])) j++;
        const w = src.slice(i, j);
        val = !JS_EXPR_KW.has(w);
        if (!inClass && CLASS_FNS.has(w) && src[i - 1] !== '.' && src[ws(j)] === '(') calls.push(i);
        i = j;
        continue;
      }
      if (c >= '0' && c <= '9') { let j = i + 1; while (j < n && /[\w.]/.test(src[j])) j++; i = j; val = true; continue; }
      i++;
      val = false;
    }
    return n;
  }
  function el(start) {
    if (depth > 200) return -1;
    const mc = classes.length, mk = calls.length;
    depth++;
    const e = tag(start);
    depth--;
    if (e < 0) { blank(start, Math.max(hi, start + 1)); hi = start; classes.length = mc; calls.length = mk; }
    return e;
  }
  function tag(start) {
    let i = start + 1;
    if (src[i] === '>') return kids(i + 1, '');
    let j = i;
    while (j < n && /[\w$.:-]/.test(src[j])) j++;
    const name = src.slice(i, j);
    paint(start, j);
    i = j;
    let cls = null;
    for (;;) {
      i = gap(i);
      if (i >= n) return -1;
      const c = src[i];
      if (c === '/' && src[i + 1] === '>') { paint(i, i + 2); if (cls) classes.push([start, cls]); return i + 2; }
      if (c === '>') { paint(i, i + 1); i++; break; }
      if (c === '{') { const e = js(i + 1, true); if (e >= n) return -1; blank(i, e + 1); i = e + 1; continue; }
      if (!/[A-Za-z_$]/.test(c)) return -1;
      let k = i + 1;
      while (k < n && /[\w$:.-]/.test(src[k])) k++;
      const attr = src.slice(i, k);
      let v = ws(k);
      if (src[v] !== '=') { paint(i, k); i = k; continue; }
      v = ws(v + 1);
      const q = src[v];
      const isCls = attr === 'className' || attr === 'class';
      let e;
      if (q === '"' || q === "'") {
        e = src.indexOf(q, v + 1);
        if (e < 0) return -1;
        if (isCls) cls = (cls || []).concat(src.slice(v + 1, e).split(/\s+/).filter(Boolean));
        else paint(i, e + 1);
      } else if (q === '{') {
        if (isCls) inClass++;
        e = js(v + 1, true);
        if (isCls) inClass--;
        if (e >= n) return -1;
        if (isCls) cls = (cls || []).concat(clsLits(src.slice(v + 1, e)));
        else { paint(i, v); write(v, e + 1, '"' + src.slice(v + 1, e).replace(/[^\w$.\-/:#@]+/g, ' ') + '"'); }
      } else if (q === '<') {
        e = el(v) - 1;
        if (e < 0) return -1;
        blank(i, e + 1);
      } else return -1;
      if (isCls && cls) write(i, e + 1, 'class="' + cls.join(' ').replace(/"/g, "'").replace(/[<>]/g, ' ') + '"');
      i = e + 1;
    }
    if (cls) classes.push([start, cls]);
    return kids(i, name);
  }
  function kids(i, name) {
    while (i < n) {
      const c = src[i];
      if (c === '{') { const e = js(i + 1, true); if (e >= n) return -1; i = e + 1; continue; }
      if (c === '<') {
        if (src[i + 1] === '/') {
          const k = ws(i + 2);
          let j = k;
          while (j < n && /[\w$.:-]/.test(src[j])) j++;
          const e = ws(j);
          if (src[e] !== '>' || src.slice(k, j) !== name) return -1;
          if (name) paint(i, e + 1);
          return e + 1;
        }
        if (/[A-Za-z_$>]/.test(src[i + 1] || '')) { const e = el(i); if (e > 0) { i = e; continue; } }
        i++;
        continue;
      }
      out[i] = c;
      if (i >= hi) hi = i + 1;
      i++;
    }
    return -1;
  }
  js(0, false);
  return { pseudo: out.join(''), classAt: new Map(classes), calls };
}

function classCalls(src, sites) {
  const out = [];
  let last = -1;
  for (const pos of [...sites].sort((a, b) => a - b)) {
    if (pos < last) continue;
    const open = src.indexOf('(', pos);
    if (open < 0) continue;
    let depth = 0, i = open;
    for (; i < src.length; i++) {
      const c = src[i];
      if (c === '/' && src[i + 1] === '/') { const e = src.indexOf('\n', i); i = e < 0 ? src.length : e; continue; }
      if (c === '/' && src[i + 1] === '*') { const e = src.indexOf('*/', i + 2); i = e < 0 ? src.length : e + 1; continue; }
      if (c === '"' || c === "'" || c === '`') { i++; while (i < src.length && src[i] !== c) { if (src[i] === '\\') i++; i++; } continue; }
      if (c === '(') depth++;
      else if (c === ')' && --depth === 0) break;
    }
    last = i;
    const toks = clsLits(src.slice(open + 1, i));
    if (toks.length) out.push({ pos, name: /^[\w$]+/.exec(src.slice(pos))[0], toks });
  }
  return out;
}

function scriptSites(src, kind) {
  const ranges = [];
  for (const m of src.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) ranges.push([m.index + m[0].length - m[1].length - 9, m.index + m[0].length - 9]);
  const fm = kind === 'astro' ? FRONTMATTER.exec(src) : null;
  if (fm) ranges.push([0, fm[0].length]);
  const sites = [];
  for (const [a, b] of ranges) {
    for (const m of src.slice(a, b).matchAll(/(?<![\w$.])(?:cn|clsx|classNames|classnames|twMerge|twJoin|cva|cx|tv)\s*\(/g)) sites.push(a + m.index);
  }
  return sites;
}

function parseDoc(file, raw) {
  const ext = extname(file).toLowerCase();
  if (ext === '.jsx' || ext === '.tsx') {
    const j = jsxPseudo(raw);
    const doc = parseHtml(file, j.pseudo, 'jsx');
    doc.styles = [];
    doc.scripts = raw;
    doc.classAt = j.classAt;
    doc.virtuals = classCalls(raw, j.calls);
    doc.raw = raw;
    return doc;
  }
  const kind = ext === '.html' ? 'html' : ext.slice(1);
  const doc = parseHtml(file, templateMask(raw, kind), kind);
  doc.raw = raw;
  doc.virtuals = kind === 'html' ? [] : classCalls(raw, scriptSites(raw, kind));
  return doc;
}

function getAttr(attrStr, name) {
  const re = new RegExp(`(?:^|\\s)${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>/]+))`, 'i');
  const m = re.exec(attrStr);
  if (!m) return null;
  return m[2] ?? m[3] ?? m[4] ?? '';
}
function hasAttr(attrStr, name) {
  return new RegExp(`(?:^|\\s)${name}(?=[\\s=/]|$)`, 'i').test(attrStr);
}

function directChildren(doc, idx) {
  const open = doc.tags[idx];
  if (open.close || open.selfClosing) return [];
  const children = [];
  let depth = 1;
  let childStart = -1, childOpen = null, childIdx = -1;
  for (let i = idx + 1; i < doc.tags.length; i++) {
    const t = doc.tags[i];
    if (t.close) {
      depth--;
      if (depth === 0) break;
      if (depth === 1 && childOpen) {
        children.push({ name: childOpen.name, open: doc.src.slice(childOpen.pos, childOpen.end), html: doc.src.slice(childStart, t.end), idx: childIdx });
        childOpen = null;
      }
      continue;
    }
    if (depth === 1) {
      if (t.selfClosing) {
        children.push({ name: t.name, open: doc.src.slice(t.pos, t.end), html: doc.src.slice(t.pos, t.end), idx: i });
      } else {
        childStart = t.pos; childOpen = t; childIdx = i;
      }
    }
    if (!t.selfClosing) depth++;
  }
  return children;
}

function ancestorMap(doc) {
  if (doc._anc) return doc._anc;
  const map = new Map();
  const stack = [];
  for (let i = 0; i < doc.tags.length; i++) {
    const t = doc.tags[i];
    if (t.close) { stack.pop(); continue; }
    map.set(i, stack.slice());
    if (!t.selfClosing) stack.push(t.name);
  }
  doc._anc = map;
  return map;
}

function plainText(html) {
  return html.replace(/<[^>]*>/g, ' ')
    .replace(/&middot;|&#0?183;|&#x0?b7;/gi, '·').replace(/&bull;|&#8226;|&#x2022;/gi, '•').replace(/&mdash;|&#8212;|&#x2014;/gi, '\u2014').replace(/&ndash;|&#8211;|&#x2013;/gi, '\u2013')
    .replace(/&rarr;|&#8594;|&#x2192;|&xrarr;|&#10230;/gi, '\u2192').replace(/&raquo;|&#187;|&#xbb;/gi, '\u00bb').replace(/&rsaquo;|&#8250;|&#x203a;/gi, '\u203a')
    .replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&rsquo;|&lsquo;|&#8217;|&#8216;|&#x2019;|&#x2018;/gi, '\u2019').replace(/&rdquo;|&ldquo;|&#8220;|&#8221;/gi, '"')
    .replace(/&#\d+;|&[a-z]+;/gi, ' ')
    .replace(/\s+/g, ' ').trim();
}

function innerOf(doc, idx) {
  const open = doc.tags[idx];
  if (open.close || open.selfClosing) return null;
  let depth = 1;
  for (let i = idx + 1; i < doc.tags.length; i++) {
    const t = doc.tags[i];
    if (t.selfClosing) continue;
    if (t.close) { depth--; if (depth === 0) return { inner: doc.src.slice(open.end, t.pos), endPos: t.pos }; }
    else depth++;
  }
  return { inner: doc.src.slice(open.end), endPos: doc.src.length };
}

function parseNum(s) { const v = parseFloat(s); return Number.isNaN(v) ? null : v; }

function parseColor(raw) {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  if (v === 'white') return { r: 1, g: 1, b: 1, alpha: 1 };
  if (v === 'black') return { r: 0, g: 0, b: 0, alpha: 1 };
  if (v === 'transparent') return { r: 0, g: 0, b: 0, alpha: 0 };
  let m;
  if ((m = /^#([0-9a-f]{3,8})$/.exec(v))) {
    const h = m[1];
    if (h.length === 3 || h.length === 4) {
      const r = parseInt(h[0] + h[0], 16) / 255, g = parseInt(h[1] + h[1], 16) / 255, b = parseInt(h[2] + h[2], 16) / 255;
      const a = h.length === 4 ? parseInt(h[3] + h[3], 16) / 255 : 1;
      return { r, g, b, alpha: a };
    }
    if (h.length === 6 || h.length === 8) {
      const r = parseInt(h.slice(0, 2), 16) / 255, g = parseInt(h.slice(2, 4), 16) / 255, b = parseInt(h.slice(4, 6), 16) / 255;
      const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
      return { r, g, b, alpha: a };
    }
    return null;
  }
  if ((m = /^rgba?\(([^)]+)\)$/.exec(v))) {
    const parts = m[1].split('/');
    const nums = parts[0].split(/[\s,]+/).filter(Boolean);
    if (nums.length < 3) return null;
    const chan = (s) => s.endsWith('%') ? parseNum(s) / 100 : parseNum(s) / 255;
    let alpha = 1;
    if (parts[1] != null) alpha = parts[1].trim().endsWith('%') ? parseNum(parts[1]) / 100 : parseNum(parts[1]);
    else if (nums.length === 4) alpha = nums[3].endsWith('%') ? parseNum(nums[3]) / 100 : parseNum(nums[3]);
    const [r, g, b] = nums.slice(0, 3).map(chan);
    if ([r, g, b].some((x) => x == null)) return null;
    return { r, g, b, alpha: alpha ?? 1 };
  }
  if ((m = /^hsla?\(([^)]+)\)$/.exec(v))) {
    const parts = m[1].split('/');
    const nums = parts[0].split(/[\s,]+/).filter(Boolean);
    if (nums.length < 3) return null;
    const h = parseNum(nums[0]);
    const s = parseNum(nums[1]) / 100, l = parseNum(nums[2]) / 100;
    let alpha = 1;
    if (parts[1] != null) alpha = parts[1].trim().endsWith('%') ? parseNum(parts[1]) / 100 : parseNum(parts[1]);
    else if (nums.length === 4) alpha = nums[3].endsWith('%') ? parseNum(nums[3]) / 100 : parseNum(nums[3]);
    if ([h, s, l].some((x) => x == null)) return null;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const hp = ((h % 360) + 360) % 360 / 60;
    const x = c * (1 - Math.abs((hp % 2) - 1));
    let rgb = [0, 0, 0];
    if (hp < 1) rgb = [c, x, 0]; else if (hp < 2) rgb = [x, c, 0];
    else if (hp < 3) rgb = [0, c, x]; else if (hp < 4) rgb = [0, x, c];
    else if (hp < 5) rgb = [x, 0, c]; else rgb = [c, 0, x];
    const mAdd = l - c / 2;
    return { r: rgb[0] + mAdd, g: rgb[1] + mAdd, b: rgb[2] + mAdd, alpha: alpha ?? 1 };
  }
  if ((m = /^oklch\(([^)]+)\)$/.exec(v))) {
    const parts = m[1].split('/');
    const nums = parts[0].split(/\s+/).filter(Boolean);
    if (nums.length < 3) return null;
    let L = parseNum(nums[0]);
    if (nums[0].endsWith('%')) L = L / 100;
    const C = parseNum(nums[1]);
    let H = nums[2] === 'none' ? 0 : parseNum(nums[2]);
    let alpha = 1;
    if (parts[1] != null) alpha = parts[1].trim().endsWith('%') ? parseNum(parts[1]) / 100 : parseNum(parts[1]);
    if (L == null || C == null || H == null) return null;
    const rgb = oklchToSrgb(L, C, H);
    return { ...rgb, alpha: alpha ?? 1, okl: { L, C, H } };
  }
  return null;
}

function oklchToSrgb(L, C, H) {
  const hr = (H * Math.PI) / 180;
  const a = C * Math.cos(hr), b = C * Math.sin(hr);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  const l = l_ ** 3, mm = m_ ** 3, s = s_ ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * mm + 1.7076147010 * s,
  ].map((c) => Math.min(1, Math.max(0, c)));
  const enc = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
  return { r: enc(lin[0]), g: enc(lin[1]), b: enc(lin[2]) };
}

function srgbToOklch(col) {
  const dec = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const r = dec(col.r), g = dec(col.g), b = dec(col.b);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const b2 = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  const C = Math.sqrt(a * a + b2 * b2);
  let H = (Math.atan2(b2, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

function luminance(col) {
  const dec = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * dec(col.r) + 0.7152 * dec(col.g) + 0.0722 * dec(col.b);
}
function contrastRatio(a, b) {
  const la = luminance(a), lb = luminance(b);
  const hi = Math.max(la, lb), lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

const TOKEN_SEL = /^(?:html|:root)?(?:\[data-(?:theme|mode|scheme)[^\]]*\]|:root|:not\([^)]*\))*$/i;
function isTokenRule(rule) {
  if (rule.selector === '@font-face' || rule.selector === '@theme' || basename(rule.file).toLowerCase() === 'tokens.css') return true;
  return rule.selector.split(',').every((p) => { const t = p.trim(); return t && TOKEN_SEL.test(t); });
}

function buildTokens(rules) {
  const tokens = {};
  for (const r of rules) {
    if (!isTokenRule(r)) continue;
    for (const d of r.decls) if (d.prop.startsWith('--')) tokens[d.prop] = d.value;
  }
  return tokens;
}

function resolveVars(value, tokens, local = null, depth = 0) {
  if (!value || depth > 5 || !value.includes('var(')) return value;
  const out = value.replace(/var\(\s*(--[\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\)[^()]*)*))?\)/g, (m0, name, fb) => {
    const v = (local && local[name] != null) ? local[name] : tokens[name];
    if (v != null) return v;
    if (fb != null) return fb.trim();
    return m0;
  });
  if (out === value) return out;
  return resolveVars(out, tokens, local, depth + 1);
}

// A family's identity ignores spaces, hyphens and underscores, so "GeistSans" and "Geist Sans" are one face
const famKey = (f) => String(f || '').replace(/[\s_-]+/g, '');
function firstFamily(value) {
  const first = value.split(',')[0].trim().replace(/^['"]|['"]$/g, '').toLowerCase();
  return first;
}

function pxOf(value) {
  const m = /^(-?\d+(?:\.\d+)?)(px|rem|em)$/.exec(value.trim());
  if (!m) return null;
  const n = parseFloat(m[1]);
  return m[2] === 'px' ? n : n * 16;
}

const rel = (f) => f.startsWith(process.cwd()) ? f.slice(process.cwd().length + 1) : f;
const trunc = (s, n = 72) => (s.length > n ? s.slice(0, n - 1) + '…' : s);

const PAGE_ONLY = new Set(['3', '8', '9', '25', '28', '32', '34', '42', '44', '46b', '47b', '47c', '49', '50', '54', '55', '56', '58', '59', '65', '66', '68', '69', '71', '77', '78', '79', '80', '81', '82', '83', 'F7', 'F8', 'F15', 'F16', 'F20']);
const gateNumber = (id) => (/^(\d{1,2})/.exec(String(id)) || [])[1] || null;
const pageOnly = (id) => PAGE_ONLY.has(String(id)) || PAGE_ONLY.has(gateNumber(id));
const APP_SKIP = new Set(['1', '6', '8', '9', '32', '42', '44', '46b', '58', '59', '66', '68', '77', '78', '79', '81', '82', '83', '85', 'F8', 'F15', 'F20']);
const appSkip = (id) => APP_SKIP.has(String(id)) || APP_SKIP.has(gateNumber(id));

const TIERS = new Map(Object.entries({
  '2': 'floor', '4': 'floor', '10': 'floor', '15': 'floor', '17': 'floor', '18': 'floor', '19': 'floor',
  '20': 'floor', '26': 'floor', '27': 'floor', '28': 'floor', '30': 'floor', '33': 'floor', '34': 'floor',
  '39': 'floor', '40': 'floor', '41': 'floor', '46': 'floor', '48': 'floor', '49': 'floor', '50': 'floor',
  '53': 'floor', '54': 'floor', '56': 'floor', '58': 'floor', '62': 'floor', '63': 'floor', '67': 'floor', '70': 'floor',
  '1': 'reflex', '3': 'reflex', '6': 'reflex', '7': 'reflex', '8': 'reflex', '9': 'reflex', '11': 'reflex',
  '12': 'reflex', '16': 'reflex', '22': 'reflex', '23': 'reflex', '24': 'reflex', '25': 'reflex', '29': 'reflex',
  '37': 'reflex', '38': 'reflex', '42': 'reflex', '44': 'reflex', '47': 'reflex', '55': 'reflex', '59': 'reflex',
  '64': 'reflex', '65': 'reflex', '66': 'reflex', '68': 'reflex', '69': 'reflex',
  '32': 'ledger',
  '2a': 'floor', '2b': 'reflex', '6a': 'floor', '6b': 'reflex', '7a': 'floor', '7b': 'reflex',
  '10a': 'floor', '10b': 'reflex', '24a': 'floor', '24b': 'reflex', '26a': 'floor', '26b': 'reflex',
  '28a': 'floor', '28b': 'reflex', '30a': 'floor', '30b': 'reflex', '38i': 'floor', '38ii': 'reflex', '38iii': 'reflex',
  '39a': 'floor', '39b': 'reflex', '44a': 'reflex', '44b': 'floor', '44c': 'reflex', '44d': 'floor',
  '46a': 'floor', '46b': 'reflex', '47a': 'floor', '47b': 'reflex', '47c': 'reflex', '49a': 'floor', '49b': 'reflex',
  '55a': 'floor', '55b': 'reflex', '71': 'reflex', '72': 'reflex', '73': 'floor', '74': 'reflex', '75': 'reflex', '76': 'floor',
  '77': 'reflex', '78': 'reflex', '79': 'reflex', '80': 'reflex', '81': 'reflex', '82': 'reflex', '83': 'reflex', '84': 'reflex', '85': 'reflex',
}));

const HERO_SKIP = new Set(['8', '9', '32', '59', '76', '77', '78', 'F8', 'F15']);
function baseGate(id) {
  const s = String(id).trim();
  if (/^F\d+$/i.test(s)) return s.toUpperCase();
  const m = /^(\d{1,2}(?:i{1,3}|[a-z])?)/.exec(s);
  return m ? m[1] : s;
}
function tierOf(gate) {
  const exact = TIERS.get(String(gate).trim());
  if (exact) return exact;
  const b = baseGate(gate);
  if (/^F\d+$/.test(b)) return 'finish';
  return TIERS.get(b) || 'floor';
}

function fontFamilyCount(ctx) {
  const fams = new Set();
  for (const [prop, val] of Object.entries(ctx.tokens || {})) {
    if (/^--font-/.test(prop)) fams.add(famKey(firstFamily(resolveVars(val, ctx.tokens))));
  }
  return fams.size;
}
const GUARDS = {
  '1': (ctx) => fontFamilyCount(ctx) >= 2 || 'fewer than two font families are declared',
  '2b': (ctx) => {
    for (const { r, grad } of gradientTextRules(ctx)) {
      if (!grad) return `${r.selector} clips text to a background that is not a gradient ramp`;
      if (/#[0-9a-f]{3,8}\b|oklch\(|rgba?\(|hsla?\(/i.test(grad.value)) return `${r.selector}: the ramp stops are literals, not tokens`;
      const hues = gradientHues(grad.value, ctx);
      if (hues.length >= 2 && Math.max(...hues) - Math.min(...hues) > 40) return `${r.selector}: ramp spans ${Math.round(Math.max(...hues) - Math.min(...hues))} degrees of hue`;
    }
    for (const it of twGroup(ctx).items) {
      const g = twGradient(ctx, it.info);
      if (!g || !g.text) continue;
      if (it.info.stops.some((s) => s.kind !== 'token')) return `${twWhere(it)}: the ramp stops are palette or literal classes, not tokens`;
      const hues = it.info.stops.map((s) => s.hue).filter((h) => h != null);
      if (hues.length >= 2 && Math.max(...hues) - Math.min(...hues) > 40) return `${twWhere(it)}: ramp spans ${Math.round(Math.max(...hues) - Math.min(...hues))} degrees of hue`;
    }
    return true;
  },
  '7': (ctx) => /surface:\s*absolute/i.test(ctx.stampText) || 'the stamp does not declare surface: absolute',
  '23': (ctx) => /posture:\s*(restrained|committed|full-palette|drenched)/i.test(ctx.stampText)
    || 'the stamp declares no colour posture',
  '37': (ctx) => fontFamilyCount(ctx) <= 4 || 'five or more families is past the backstop',
  '26b': (ctx) => !ctx.docs.some((d) => d.tags.some((t) => !t.close && /aria-disabled/i.test(t.attrs))) || 'aria-disabled appears in the markup',
  '38': () => 'name the clause: 38ii (italic display) or 38iii (accented word)',
  '38ii': (ctx) => /font-synthesis\s*:\s*none/i.test(ctx.allCss) || 'font-synthesis: none is not declared',
  '38iii': (ctx) => accentedWordInHero(ctx),
  '42': (ctx) => (/(^|[·*])\s*nav:\s*\S/im.test(ctx.stampText) && /(^|[·*])\s*footer:\s*\S/im.test(ctx.stampText)) || 'the stamp has no nav: and footer: fields naming the chrome',
  '64': (ctx) => monoIsMaterial(ctx) || 'none of --font-display, --font-body or --font-outlier is a monospace face',
  '65': (ctx) => /by request|pinned|user named/i.test(ctx.stampText) || 'the stamp does not say the theme was asked for by name',
  '44': (ctx) => /(^|[·*])\s*hero:\s*\S/im.test(ctx.stampText) || 'the stamp names no hero: posture',
};

const WAIVER_MAX = 3;

const WAIVER_FILLER = /\b(a|an|the|is|it|this|that|was|are|and|but|so|very|just|really|here|quite|more|most)\b/gi;
const WAIVER_BOILERPLATE_PHRASES = [
  'design choice', 'design decision', 'intentionally', 'intentional', 'by design',
  'looks better', 'for the aesthetic', 'aesthetic', 'necessary here', 'necessary',
  'the prompt requires it', 'prompt requires', 'the brief requires it', 'brief requires', 'on purpose', 'deliberate', 'deliberately',
  'it works', 'works better', 'needed', 'required', 'fine', 'ok', 'okay',
];
function reasonIsBoilerplate(reason) {
  let r = reason.toLowerCase();
  for (const p of WAIVER_BOILERPLATE_PHRASES) r = r.split(p).join(' ');
  r = r.replace(WAIVER_FILLER, ' ').replace(/[^a-z0-9]+/g, ' ').trim();
  return r.length < 12;
}

let WAIVED = new Set();
let ANSWERED = new Set();
let DISMISSED = new Set();
let VERBATIM = false;
let APPSCREEN = false;
let LAYOUT_KEPT = false;
const STRUCTURAL = new Set(['6b', '8', '9', '32', '42', '44a', '44c', '58', '77', '79']);
const SPACING = new Set(['24b', '59', '78']);
const COPY_GATES = new Set(['19', '58', '69']);

const findings = [];
function report(gate, grade, file, line, evidence, fix) {
  const g = String(gate);
  if (opts.before && g === '20') return;
  if (opts.scope === 'component' && pageOnly(g)) return;
  if ((opts.scope === 'app' || APPSCREEN) && appSkip(g)) return;
  if (opts.stage === 'hero' && HERO_SKIP.has(String(g))) return;
  const tier = tierOf(g);
  const b = baseGate(g);
  const waived = WAIVED.has(b) || WAIVED.has(gateNumber(b));
  if (VERBATIM && COPY_GATES.has(gateNumber(b)) && (grade === 'FAIL' || grade === 'WARN')) grade = 'NOTE';
  const owned = LAYOUT_KEPT === 'full' ? gateNumber(b) === '58' : STRUCTURAL.has(b) || STRUCTURAL.has(gateNumber(b)) || (LAYOUT_KEPT === 'polish' && SPACING.has(b));
  if (LAYOUT_KEPT && owned && grade !== 'NOTE') grade = 'NOTE';
  if (grade === 'FAIL') {
    if (tier === 'ledger') grade = 'NOTE';
    else if (tier === 'reflex') grade = waived ? 'WAIVED' : 'REFLEX';
  }
  if (tier === 'finish' && grade !== 'FAIL' && ANSWERED.has(b)) grade = 'ANSWERED';
  if (grade === 'WARN' && (DISMISSED.has(b) || DISMISSED.has(gateNumber(b)))) grade = 'DISMISSED';
  if (grade === 'WARN' && tier === 'reflex' && waived) grade = 'WAIVED';
  findings.push({ gate: g, grade, tier, file: rel(file), line: line || 1, evidence: trunc(String(evidence), g === 'kept' ? 400 : 120), fix });
}

function applyWaivers(ctx, dir) {
  WAIVED = new Set(); ANSWERED = new Set(); DISMISSED = new Set();
  VERBATIM = /\bcopy:\s*verbatim\b/i.test(ctx.stampText);
  APPSCREEN = /\bshape:\s*app screen\b/i.test(ctx.stampText);
  LAYOUT_KEPT = (/\bredesign:\s*(polish|restyle|full)\b/i.exec(ctx.stampText) || [])[1]?.toLowerCase() || false;
  const re = /\/\*\s*Hallmark\s*·\s*waive\s+(\d{1,2}[a-z]{0,3}|F\d+)\s*·\s*([^·*]+?)\s*·\s*([^*]+?)\s*\*\//gi;
  const claims = [...ctx.stampText.matchAll(re)].map((m) => ({
    id: m[1], evidence: m[2].trim(), reason: m[3].trim(), raw: m[0],
  }));

  const wellFormed = new Set(claims.map((c) => c.raw));
  const malformed = [...ctx.stampText.matchAll(/\/\*[^*]*Hallmark[^*]*·\s*waive\b[^*]*\*\//gi)]
    .map((m) => m[0]).filter((raw) => !wellFormed.has(raw));
  const reasons = new Map();
  for (const c of claims) {
    const key = c.reason.toLowerCase();
    reasons.set(key, (reasons.get(key) || 0) + 1);
  }

  const pageWords = new Set(
    (ctx.stampText.replace(/\/\*\s*Hallmark\s*·\s*(?:waive|answered|dismissed)\b[^*]*\*\//gi, ' ') + ' ' + ctx.docs.map((d) => d.text).join(' '))
      .toLowerCase().match(/[a-z]{4,}/g) || []
  );
  const file = ctx.cssFiles[0]?.file || ctx.docs[0]?.file || dir;
  const rejectAt = (c, why) =>
    findings.push({
      gate: baseGate(c.id), grade: 'WAIVER', tier: tierOf(c.id), file: rel(file), line: 1,
      evidence: trunc(`waiver on ${c.id} REJECTED (${why})`),
      fix: 'Fix the gate, or satisfy the guard and say why in the page\'s own words',
    });

  for (const raw of malformed) {
    findings.push({
      gate: 'waive', grade: 'WAIVER', tier: 'reflex', file: rel(file), line: 1,
      evidence: trunc(`malformed waiver, ignored: ${raw.replace(/\s+/g, ' ')}`),
      fix: 'Three · -separated fields: /* Hallmark · waive <gate> · <guard evidence> · <reason> */',
    });
  }
  for (const c of claims) {
    const b = baseGate(c.id);
    const tier = tierOf(c.id);
    if (tier !== 'reflex') {
      rejectAt(c, tier === 'ledger' ? 'a Ledger note is bookkeeping, nothing to waive'
        : tier === 'finish' ? 'Finish findings are answered, not waived'
        : 'Floor is never waivable');
      continue;
    }
    if (/^\d+$/.test(c.id) && [...TIERS.keys()].some((k) => k !== c.id && gateNumber(k) === c.id)) { rejectAt(c, `name the clause (${[...TIERS.keys()].filter((k) => k !== c.id && gateNumber(k) === c.id).join(' or ')})`); continue; }
    if (WAIVED.has(b)) { rejectAt(c, 'one waiver per gate'); continue; }
    if (c.reason.length < 24) { rejectAt(c, 'reason under 24 characters'); continue; }
    if (reasonIsBoilerplate(c.reason)) { rejectAt(c, 'boilerplate reason'); continue; }
    if (reasons.get(c.reason.toLowerCase()) > 1) { rejectAt(c, 'reason reused on another waiver'); continue; }
    const words = c.reason.toLowerCase().match(/[a-z]{4,}/g) || [];
    if (!words.some((w) => pageWords.has(w))) { rejectAt(c, 'reason shares no word with the page'); continue; }
    const guard = GUARDS[b] || GUARDS[gateNumber(b)];
    const verdict = guard ? guard(ctx) : true;
    if (verdict !== true) { rejectAt(c, `guard: ${verdict}`); continue; }
    WAIVED.add(b);
  }

  if (WAIVED.size > WAIVER_MAX) {
    findings.push({
      gate: 'waive', grade: 'NOTE', tier: 'ledger', file: rel(file), line: 1,
      evidence: trunc(`${WAIVED.size} reflex gates waived (${[...WAIVED].join(', ')}): that is a house style, not a set of exceptions`),
      fix: 'Lock it into a design.md so later pages inherit it instead of re-arguing it',
    });
  }

  const ansRe = /\/\*\s*Hallmark\s*·\s*answered\s+(\d{1,2}[a-z]{0,3}|F\d+)\s*·\s*([^*]+?)\s*\*\//gi;
  for (const m of ctx.stampText.matchAll(ansRe)) {
    const id = baseGate(m[1]);
    const reason = m[2].trim();
    const bad = tierOf(id) !== 'finish' ? 'only Finish findings are answered; Reflex is waived and Floor is fixed'
      : reason.length < 24 ? 'reason under 24 characters'
      : reasonIsBoilerplate(reason) ? 'boilerplate reason' : null;
    if (bad) {
      findings.push({
        gate: id, grade: 'WAIVER', tier: tierOf(id), file: rel(file), line: 1,
        evidence: trunc(`answer on ${m[1]} REJECTED (${bad})`),
        fix: 'Two · -separated fields: /* Hallmark · answered <check> · <reason> */',
      });
      continue;
    }
    ANSWERED.add(id);
  }

  const disRe = /\/\*\s*Hallmark\s*·\s*dismissed\s+(\d{1,2}[a-z]{0,3}|F\d+)\s*·\s*([^*]+?)\s*\*\//gi;
  for (const m of ctx.stampText.matchAll(disRe)) {
    const reason = m[2].trim();
    const bad = reason.length < 24 ? 'reason under 24 characters' : reasonIsBoilerplate(reason) ? 'boilerplate reason' : null;
    if (bad) {
      findings.push({ gate: baseGate(m[1]), grade: 'WAIVER', tier: tierOf(m[1]), file: rel(file), line: 1, evidence: trunc(`dismissal of ${m[1]} REJECTED (${bad})`), fix: 'Two · -separated fields: /* Hallmark · dismissed <gate> · <what you checked and why the warning is wrong here> */' });
      continue;
    }
    DISMISSED.add(baseGate(m[1]));
  }
}

const GRADE_RANK = { FAIL: 0, REFLEX: 1, WAIVER: 2, WARN: 3, WAIVED: 4, ANSWERED: 5, DISMISSED: 6, NOTE: 7 };

function gateSortKey(g) {
  const f = /^F(\d+)$/.exec(g);
  if (f) return 900 + Number(f[1]);
  const n = parseFloat(g);
  return Number.isNaN(n) ? 999 : n;
}

function selectorIsInteractive(sel) {
  return /(^|[\s,>+~(])(a|button|input|select|textarea|summary)\b|\.(btn|button|cta|link|tab|chip|control)/i.test(sel);
}
const HEADING_SEL = /(^|[\s,>+~(])h[1-6]\b|__title|__display|__headline|hero__(title|display|headline|h\d)|wordmark|masthead|display/i;
const GENERIC_FAMILIES = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-monospace', 'ui-serif', 'ui-sans-serif', 'ui-rounded', 'math', 'emoji', 'fangsong', 'inherit', 'initial', 'unset']);

function mergedDeclsBySelector(ctx) {
  if (ctx._merged) return ctx._merged;
  const map = new Map();
  for (const r of ctx.rules) {
    if (r.keyframes || r.selector === '@font-face') continue;
    const key = r.selector + '@@' + (r.media || '');
    if (!map.has(key)) map.set(key, { selector: r.selector, media: r.media, decls: [], file: r.file, line: r.line });
    map.get(key).decls.push(...r.decls);
  }
  ctx._merged = [...map.values()];
  return ctx._merged;
}

function styleIndex(ctx) {
  if (ctx._styleIdx) return ctx._styleIdx;
  const entries = [];
  for (const r of ctx.rules) {
    if (r.keyframes || r.selector === '@font-face') continue;
    if (r.media && /max-width/i.test(r.media)) continue;
    for (const part of r.selector.split(',')) {
      const compound = part.trim().split(/[\s>+~]+/).filter(Boolean).pop();
      if (!compound) continue;
      const cleaned = compound.replace(/::?[a-z-]+(\([^)]*\))?/gi, '').replace(/\[[^\]]*\]/g, '');
      const classes = (cleaned.match(/\.[a-zA-Z_][\w-]*/g) || []).map((c) => c.slice(1));
      const tagM = /^([a-zA-Z][\w-]*)/.exec(cleaned);
      const tag = tagM ? tagM[1].toLowerCase() : null;
      if (!classes.length && !tag) continue;
      entries.push({ classes, tag, decls: r.decls, state: /:(hover|active|focus|focus-visible|focus-within|disabled|checked|visited|target)\b|::?(before|after|marker|placeholder|selection|backdrop)\b/i.test(compound) });
    }
  }
  ctx._styleIdx = entries;
  return entries;
}

function styleFor(ctx, classAttr, tagName, restingOnly = false) {
  const have = new Set(String(classAttr || '').split(/\s+/).filter(Boolean));
  const decls = [];
  for (const e of styleIndex(ctx)) {
    if (restingOnly && e.state) continue;
    if (e.tag && e.tag !== tagName) continue;
    if (!e.classes.every((c) => have.has(c))) continue;
    decls.push(...e.decls);
  }
  return decls;
}

function declValue(ctx, decls, prop) {
  let v = null;
  for (const d of decls) if (d.prop === prop) v = d.value;
  return v == null ? null : resolveVars(v, ctx.tokens);
}

function fontPxOf(ctx, decls) {
  const v = declValue(ctx, decls, 'font-size');
  if (!v) return null;
  const clamped = /clamp\(\s*([^,]+),/.exec(v);
  return pxOf(clamped ? clamped[1].trim() : v);
}

function trackingEmOf(ctx, decls, fontPx) {
  const v = declValue(ctx, decls, 'letter-spacing');
  if (!v) return null;
  const m = /^(-?\d*\.?\d+)em$/.exec(v.trim());
  if (m) return parseFloat(m[1]);
  const px = pxOf(v);
  if (px == null || !fontPx) return null;
  return px / fontPx;
}

function check1(ctx) {
  const banned = new Set(['inter', 'roboto', 'open sans', 'poppins', 'lato', 'system-ui', '-apple-system', 'arial', 'helvetica', 'helvetica neue', 'segoe ui']);
  const seen = new Set();
  const flag = (fam, file, line, where) => {
    if ([...banned].some((b) => famKey(b) === famKey(fam)) && !seen.has(fam + where)) {
      seen.add(fam + where);
      report(1, 'FAIL', file, line, `display font "${fam}" (${where})`, 'Pick a display face from the typography catalog');
    }
  };
  for (const [prop, val] of Object.entries(ctx.tokens)) {
    if (/^--font-(display|heading|title|hero)/.test(prop)) {
      const tr = ctx.rules.find((r) => isTokenRule(r) && r.decls.some((d) => d.prop === prop));
      flag(firstFamily(resolveVars(val, ctx.tokens)), tr ? tr.file : ctx.rules[0]?.file || '?', tr ? tr.decls.find((d) => d.prop === prop)?.line : 1, prop);
    }
  }
  for (const r of ctx.rules) {
    if (isTokenRule(r) || !HEADING_SEL.test(r.selector)) continue;
    for (const d of r.decls) {
      if (d.prop === 'font-family') flag(firstFamily(resolveVars(d.value, ctx.tokens)), r.file, d.line, r.selector);
    }
  }
}

const hueIn = (h, lo, hi) => (lo <= hi ? h >= lo && h <= hi : h >= lo || h <= hi);
function gradientHues(value, ctx) {
  const resolved = resolveVars(value, ctx.tokens);
  const stops = [];
  const colRe = /#[0-9a-fA-F]{3,8}\b|oklch\([^)]*\)|rgba?\([^)]*\)|hsla?\([^)]*\)/g;
  let cm;
  while ((cm = colRe.exec(resolved))) {
    const c = parseColor(cm[0]);
    if (c && c.alpha > 0.05) {
      const ok = c.okl || srgbToOklch(c);
      if (ok.C > 0.04) stops.push(ok.H);
    }
  }
  return stops;
}
function paperIsDark(ctx) {
  const p = parseColor(resolveVars(ctx.tokens['--color-paper'] || '', ctx.tokens));
  return !!p && (p.okl || srgbToOklch(p)).L < 0.4;
}
function bannedGradient(stops, ctx) {
  const purple = stops.some((h) => hueIn(h, 265, 330));
  const blue = stops.some((h) => hueIn(h, 200, 264));
  const pink = stops.some((h) => hueIn(h, 331, 25));
  const cyan = stops.some((h) => hueIn(h, 170, 230));
  if (purple && blue) return 'purple-to-blue';
  if (purple && pink) return 'purple-to-pink';
  if (cyan && paperIsDark(ctx)) return 'cyan-on-dark';
  return null;
}
function gradientTextRules(ctx) {
  const out = [];
  for (const r of mergedDeclsBySelector(ctx)) {
    const clip = r.decls.find((d) => /background-clip/.test(d.prop) && /\btext\b/i.test(d.value));
    if (!clip) continue;
    const grad = r.decls.find((d) => /^background(-image)?$/.test(d.prop) && /gradient\(/i.test(d.value));
    const transparent = r.decls.find((d) => (d.prop === 'color' || d.prop === '-webkit-text-fill-color') && /transparent/i.test(d.value));
    if (grad || transparent) out.push({ r, clip, grad });
  }
  return out;
}
function withoutPatterns(value) {
  let out = '', i = 0;
  const re = /repeating-(?:linear|radial|conic)-gradient\(/gi;
  let m;
  while ((m = re.exec(value))) {
    out += value.slice(i, m.index);
    let depth = 1, k = m.index + m[0].length;
    while (k < value.length && depth > 0) { if (value[k] === '(') depth++; else if (value[k] === ')') depth--; k++; }
    i = k; re.lastIndex = k;
  }
  return out + value.slice(i);
}

function check2(ctx) {
  const textRules = new Set();
  for (const { r, clip, grad } of gradientTextRules(ctx)) {
    textRules.add(r.selector);
    const banned = grad ? bannedGradient(gradientHues(grad.value, ctx), ctx) : null;
    if (banned) report('2a', 'FAIL', r.file, clip.line, `${banned} gradient text on ${r.selector}`, 'One anchor hue, solid ink');
    else report('2b', 'FAIL', r.file, clip.line, `gradient text on ${r.selector}`, 'Solid ink; weight or a display face. Guard: a single-hue ramp from two tokens with 40 and 41 passing');
  }
  for (const r of ctx.rules) {
    if (textRules.has(r.selector)) continue;
    for (const d of r.decls) {
      if (!/gradient\(/i.test(d.value)) continue;
      const washes = withoutPatterns(d.value);
      if (!/gradient\(/i.test(washes)) continue;
      const banned = bannedGradient(gradientHues(washes, ctx), ctx);
      if (banned) report('2a', 'FAIL', r.file, d.line, `${banned} gradient on ${r.selector}`, 'One anchor hue; drop the gradient');
    }
  }
}

function check3(ctx) {
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (d.prop !== 'grid-template-columns') continue;
      const v = resolveVars(d.value, ctx.tokens).trim();
      if (/^repeat\(\s*3\s*,\s*(minmax\(\s*0(px)?\s*,\s*1fr\s*\)|1fr)\s*\)$/.test(v)
        || /^(1fr|minmax\(\s*0(px)?\s*,\s*1fr\s*\))(\s+(1fr|minmax\(\s*0(px)?\s*,\s*1fr\s*\))){2}$/.test(v)) {

        const classes = (r.selector.match(/\.[a-zA-Z][\w-]*/g) || []).map((c) => c.slice(1));
        let iconTiles = !ctx.docs.length && !classes.length;
        for (const doc of ctx.docs) {
          for (let i = 0; i < doc.tags.length; i++) {
            const t = doc.tags[i];
            if (t.close || t.selfClosing) continue;
            const cls = getAttr(t.attrs, 'class') || '';
            if (!classes.some((c) => cls.split(/\s+/).includes(c))) continue;
            const inner = innerOf(doc, i);
            if (inner && (/class\s*=\s*["'][^"']*icon/i.test(inner.inner) || /<svg\b/i.test(inner.inner)) && /<h[2-6]\b/i.test(inner.inner)) {
              iconTiles = true;
            }
          }
        }
        if (iconTiles) {
          report(3, 'WARN', r.file, d.line, `3 equal icon-tile columns on ${r.selector}`, 'Vary column widths or drop the icon tiles');
        }
      }
    }
  }
}

function check4(ctx) {

  const cardWord = /(^|-)card(--[\w-]+)?$/i;
  const containerish = /(grid|list|rail|row|wrap|deck|group|stack|container|section|scroller|track)/i;
  for (const doc of ctx.docs) {
    const stack = [];
    for (const t of doc.tags) {
      if (t.close) {
        for (let i = stack.length - 1; i >= 0; i--) {
          if (stack[i].name === t.name) { stack.splice(i); break; }
        }
        continue;
      }
      if (t.selfClosing) continue;
      const cls = getAttr(t.attrs, 'class') || '';
      const isCard = cls.split(/\s+/).some((c) => { const base = c.split('--')[0]; return base && cardWord.test(base) && !containerish.test(base); });
      if (isCard && stack.some((s) => s.isCard)) {
        report(4, 'FAIL', doc.file, t.line, `card nested in card: class="${trunc(cls, 40)}"`, 'Keep one containment layer');
      }
      stack.push({ name: t.name, isCard });
    }
  }
}

function check3Stripe(ctx) {
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (!/^border-(left|right|inline-start|inline-end)$/.test(d.prop)) continue;
      const m = /(\d+(?:\.\d+)?)px/.exec(d.value);
      if (m && parseFloat(m[1]) >= 3 && !/transparent|none/i.test(d.value)) {
        report(3, 'WARN', r.file, d.line, `side stripe ${d.prop}: ${trunc(d.value, 32)} on ${r.selector}`, 'Hairline all round, none, or an accent square');
      }
    }
  }
}

function heroClasses(ctx) {
  const out = new Set();
  for (const doc of ctx.docs) {
    const h1 = doc.tags.findIndex((t) => !t.close && t.name === 'h1');
    if (h1 < 0) continue;
    for (let i = h1 - 1; i >= 0; i--) {
      const t = doc.tags[i];
      if (t.close || !/^(section|header)$/.test(t.name)) continue;
      for (const c of (getAttr(t.attrs, 'class') || '').split(/\s+/)) if (c) out.add(c);
      break;
    }
  }
  return out;
}
function check6a(ctx) {
  const heroCls = heroClasses(ctx);
  const isHero = (sel) => /hero/i.test(sel) || [...heroCls].some((c) => sel.includes('.' + c));
  const seen = new Set();
  for (const r of ctx.rules) {
    if (r.keyframes || isTokenRule(r) || !isHero(r.selector)) continue;
    for (const d of r.decls) {
      if (!/^(min-)?height$/.test(d.prop)) continue;
      const v = resolveVars(d.value, ctx.tokens);
      if (!/\d\s*vh\b/i.test(v) || seen.has(r.selector)) continue;
      seen.add(r.selector);
      report('6a', 'FAIL', r.file, d.line, `hero sized in vh: ${d.prop}: ${trunc(v, 24)} on ${r.selector}`, 'dvh or svh');
    }
  }
}

function check7(ctx) {
  const props = /^(color|background|background-color|border-color|outline-color)$|^--color-/;
  for (const r of ctx.rules) {
    if (r.selector === '@font-face') continue;
    for (const d of r.decls) {
      if (!props.test(d.prop)) continue;
      const resolved = resolveVars(d.value, ctx.tokens).trim();
      const c = parseColor(resolved);
      if (!c || c.alpha < 1) continue;
      const isWhite = c.r > 0.999 && c.g > 0.999 && c.b > 0.999;
      const isBlack = c.r < 0.001 && c.g < 0.001 && c.b < 0.001;
      if (isWhite && ctx.genre === 'modern-minimal') continue;
      if (isWhite || isBlack) {

        const viaToken = d.prop.startsWith('--') || /var\(/.test(d.value);
        report(viaToken ? '7b' : '7a', 'FAIL', r.file, d.line, `pure ${isBlack ? '#000' : '#fff'}: ${d.prop}: ${trunc(d.value, 28)} (${r.selector})`, 'Tint the base toward the anchor hue');
      }
    }
  }
}

function check10(ctx) {
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (d.prop === 'transition' && /(^|,)\s*all[\s,]|^all$|^all\s/.test(d.value.trim())) {
        report('10a', 'FAIL', r.file, d.line, `transition: all on ${r.selector}`, 'List the transitioned properties explicitly');
      }
      if (d.prop === 'transition-property' && /\ball\b/.test(d.value)) {
        report('10a', 'FAIL', r.file, d.line, `transition-property: all on ${r.selector}`, 'List the transitioned properties explicitly');
      }
    }
  }
}

function check11(ctx) {
  const byScale = new Map();
  for (const r of ctx.rules) {
    if (!/:hover/.test(r.selector)) continue;
    for (const d of r.decls) {
      if (d.prop !== 'transform') continue;
      const m = /scale\(\s*([\d.]+)\s*\)/.exec(d.value);
      if (m && parseFloat(m[1]) !== 1) {
        const k = m[1];
        if (!byScale.has(k)) byScale.set(k, []);
        byScale.get(k).push({ sel: r.selector, file: r.file, line: d.line });
      }
    }
  }
  for (const [k, list] of byScale) {
    const distinct = new Set(list.map((x) => x.sel));
    if (distinct.size >= 2) {
      report(11, 'WARN', list[0].file, list[0].line, `hover scale(${k}) on ${distinct.size} selectors`, 'One hover signal per element');
    }
  }
  for (const r of ctx.rules) {
    if (!/:hover/.test(r.selector) || !/(^|[\s>+~,])(img|picture|figure|video)\b|__(img|image|photo|thumb|cover)\b|\.(img|image|photo|thumb|cover)\b/i.test(r.selector)) continue;
    const t = r.decls.find((d) => d.prop === 'transform' && /scale|rotate/.test(d.value));
    if (t) report(11, 'WARN', r.file, t.line, `image transforms on hover (${r.selector})`, 'Imagery sits still; give the container the feedback');
  }
}

function check12(ctx) {
  const uiSel = /:hover|:active|:focus|\b(btn|button|modal|dialog|tooltip|dropdown|menu|popover|toast|tab|input|select|switch|toggle|accordion)\b/i;
  const playful = ctx.genre === 'playful' || /genre:\s*playful/.test(ctx.stampText || '');
  const declared = playful && /--ease-spring/.test(Object.keys(ctx.tokens).join(' '));
  const springHome = (r) => /primary|cta|press|character|mascot|hero__btn|btn--solid|btn--main/i.test(r.selector);
  const springSels = new Set();
  for (const r of ctx.rules) {
    if (!uiSel.test(r.selector)) continue;
    for (const d of r.decls) {
      if (!/transition|animation/.test(d.prop)) continue;
      if (declared && /var\(--ease-spring\)/.test(d.value) && springHome(r) && (springSels.add(baseSelector(r.selector).split(':')[0]), springSels.size <= 2)) continue;
      const re = /cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)/g;
      let m;
      while ((m = re.exec(resolveVars(d.value, ctx.tokens)))) {
        const y1 = parseFloat(m[2]), y2 = parseFloat(m[4]);
        if (y1 > 1.05 || y2 > 1.05 || y1 < -0.05 || y2 < -0.05) {
          report(12, 'FAIL', r.file, d.line, `overshoot easing ${m[0]} on ${r.selector}`, 'Use exponential ease-out on UI state changes');
        }
      }
    }
  }
}

function check10Motion(ctx) {
  const hardRe = /(?<![\w-])(width|height|top|left|right|bottom|inset(?:-[a-z-]+)?|flex-basis|grid-template-columns)(?![\w-])/;
  const softRe = /(?<![\w-])(margin(?:-[a-z]+)?|padding(?:-[a-z]+)?)(?![\w-])/;
  const a11ySel = /skip|sr-only|visually-hidden/i;
  for (const r of ctx.rules) {
    if (a11ySel.test(r.selector)) continue;
    if (r.keyframes) {
      for (const d of r.decls) {
        if (/^(min|max)-/.test(d.prop)) continue;
        if (hardRe.test(d.prop)) {
          report('10a', 'FAIL', r.file, d.line, `@keyframes ${r.keyframes} animates ${d.prop}`, 'Animate transform or opacity instead');
        } else if (softRe.test(d.prop)) {
          report('10b', 'WARN', r.file, d.line, `@keyframes ${r.keyframes} animates ${d.prop}`, 'Animate transform or opacity instead');
        }
      }
      continue;
    }
    for (const d of r.decls) {
      if (d.prop === 'transition' || d.prop === 'transition-property') {
        const hard = hardRe.exec(d.value);
        const soft = softRe.exec(d.value);
        if (hard) {
          report('10a', 'FAIL', r.file, d.line, `transitioning ${hard[1]} on ${r.selector}`, 'Animate transform or opacity instead');
        } else if (soft) {
          report('10b', 'WARN', r.file, d.line, `transitioning ${soft[1]} on ${r.selector}`, 'Animate transform or opacity instead');
        }
      }
    }
  }
}

function check15(ctx) {
  for (const r of ctx.rules) {
    if (!/:focus(-visible|-within)?\b/.test(r.selector)) continue;
    const withinOnly = !/:focus(-visible)?(?![\w-])/.test(r.selector);
    for (const d of r.decls) {
      if (d.prop === 'transition' && (withinOnly ? /outline|box-shadow|\ball\b/ : /outline|box-shadow|opacity|\ball\b/).test(d.value)) {
        report(15, 'FAIL', r.file, d.line, `focus ring transition on ${r.selector}`, 'Remove the transition; rings appear instantly');
      }
    }
  }
}

function check17(ctx) {
  const tips = ctx.rules.filter((r) => /tooltip|tip\b/i.test(r.selector));
  const delayed = (r) => r.decls.find((d) => /^transition(-delay)?$/.test(d.prop) && /(\d{3,})ms|([1-9][\d.]*)s\b/.test(d.value));
  const hover = tips.filter((r) => /:hover/.test(r.selector)).map(delayed).find(Boolean);
  const focus = tips.filter((r) => /:focus/.test(r.selector)).map(delayed).find(Boolean);
  if (hover && focus) {
    report(17, 'WARN', tips[0].file, focus.line, 'tooltip focus delay matches hover delay', 'Hover delay 800-1000ms; focus delay 0');
  }
}

function check18(ctx) {
  const autoish = /carousel|marquee|ticker|rotate|slider|scroll|auto/i;
  const paused = ctx.rules.some((r) => /:hover|:focus|\[data-loop\]/.test(r.selector) && r.decls.some((d) => d.prop === 'animation-play-state' && /paused/.test(d.value)));
  for (const r of ctx.rules) {
    if (r.keyframes || !autoish.test(r.selector)) continue;
    for (const d of r.decls) {
      if (/^animation(-iteration-count)?$/.test(d.prop) && /\binfinite\b/.test(d.value) && !paused) {
        report(18, 'WARN', r.file, d.line, `infinite animation on ${r.selector} with no pause state`, 'Pause on hover and focus');
      }
    }
  }
}

function check19(ctx) {
  for (const doc of ctx.docs) {
    const t = maskedProse(doc);
    const patterns = [
      [/\b(jane doe|john smith|john doe|example user)\b/i, 'placeholder name'],
      [/\bAcme\b/, 'startup cliche name'],
      [/\bNexus\b/, 'startup cliche name'],
    ];
    const title = (/<title\b[^>]*>([^<]*)<\/title>/i.exec(doc.src) || [])[1] || '';
    for (const [re, label] of patterns) {
      const m = re.exec(t);
      if (!m) continue;
      if (label === 'startup cliche name' && (re.test(title) || (t.match(new RegExp(re.source, 'g')) || []).length >= 3)) continue;
      report(19, 'FAIL', doc.file, doc.lineOf(m.index), `${label}: "${m[0]}"`, 'Use plausible audience-fitting names');
    }
  }
}

function check20(ctx) {
  if (ctx.tokensOnly) return;
  const stamped = (src) => {
    const lines = src.split('\n').map((l) => l.trim()).filter(Boolean);
    let i = 0;
    while (i < lines.length && /^@charset\b/i.test(lines[i])) i++;
    return i < lines.length && /^\/\*\s*Hallmark/.test(lines[i]);
  };
  let ok = false;
  const cssSources = [];
  for (const f of ctx.cssFiles) cssSources.push(f.raw);
  for (const doc of ctx.docs) for (const s of doc.styles) cssSources.push(s.css);
  for (const s of cssSources) if (stamped(s)) { ok = true; break; }
  const pageCss = ctx.cssFiles.length || ctx.docs.some((d) => d.kind === 'html' && d.styles.length);
  if (!ok && cssSources.length && pageCss) {
    const where = ctx.cssFiles[0]?.file || ctx.docs[0]?.file;
    report(20, 'FAIL', where, 1, 'no Hallmark stamp on the first non-empty line of any CSS', 'The stamp comment is line 1 of the CSS; only @charset may precede it');
  }
}

function check22(ctx) {
  if (ctx.genre === 'modern-minimal') return;
  const MASK_PROPS = /(^|-)mask(-image|-composite|-mode)?$|^filter$|^backdrop-filter$/;
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (MASK_PROPS.test(d.prop)) continue;
      const re = /oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+[\d.]+(?:deg)?\s*(?:\/\s*([\d.]+%?))?\s*\)/g;
      let m;
      while ((m = re.exec(d.value))) {
        const chroma = parseFloat(m[2]);
        const alpha = m[3] ? (m[3].endsWith('%') ? parseFloat(m[3]) / 100 : parseFloat(m[3])) : 1;
        if (chroma === 0 && alpha >= 1) {
          report(22, 'FAIL', r.file, d.line, `zero-chroma ${m[0]} (${d.prop} on ${r.selector})`, 'Give neutrals at least 0.005 chroma');
        }
      }
    }
  }
}

function check23(ctx) {
  if (ctx.posture === 'drenched') return;
  const ACC = /var\(\s*--color-accent(?:-2)?\s*[,)]/;
  const SURFACE = /(^|[\s,>~+])(body|html|main|section|header|footer|aside)(\b|$)|\bhero\b|__hero|banner|\bstrip\b|\bband\b/i;
  const big = (r) => r.decls.some((d) =>
    (/^(min-)?height$/.test(d.prop) && (parseFloat((/([\d.]+)\s*(vh|dvh|svh)/.exec(d.value) || [])[1] || 0) >= 40 || (pxOf(d.value) ?? 0) >= 320)) ||
    (d.prop === 'inset' && /^0(px)?(\s|$)/.test(d.value.trim())));
  for (const r of ctx.rules) {
    if (isTokenRule(r) || r.keyframes) continue;
    for (const d of r.decls) {
      if (!/^background(-color|-image)?$/.test(d.prop) || !ACC.test(d.value)) continue;
      if (/\/\s*0?\.[0-2]\d*/.test(d.value)) continue;
      if (ctx.genre === 'atmospheric' && /radial-gradient/i.test(d.value)) continue;
      if (SURFACE.test(r.selector) || big(r)) {
        report(23, 'WARN', r.file, d.line,
          `accent background on viewport-scale rule "${trunc(r.selector, 44)}"`,
          'Accent stays <= 5% of a viewport; large fills belong to paper/field tokens or a declared posture in the stamp');
      }
    }
    const col = r.decls.find((d) => d.prop === 'color' && ACC.test(d.value));
    const fsDecl = r.decls.find((d) => d.prop === 'font-size');
    if (col && fsDecl) {
      const rv = resolveVars(fsDecl.value, ctx.tokens);
      const clampMax = /,\s*([^,()]+)\)\s*$/.exec(rv);
      const maxPx = pxOf(rv) ?? (clampMax ? pxOf(clampMax[1].trim()) : null);
      if ((maxPx != null && maxPx >= 48) || /--text-display\b/.test(fsDecl.value)) {
        report(23, 'WARN', r.file, col.line,
          `display-size text set in accent on "${trunc(r.selector, 44)}"`,
          'Accent marks emphasis; set display type in ink and keep accent for small signals');
      }
    }
  }
}

function check24(ctx) {
  const props = /^(padding|margin|gap|row-gap|column-gap)(-[a-z]+)?$/;
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (!props.test(d.prop)) continue;
      const re = /(-?\d+(?:\.\d+)?)px/g;
      let m;
      while ((m = re.exec(d.value))) {
        const v = Math.abs(parseFloat(m[1]));
        if (v > 2 && (v % 4 !== 0 || !Number.isInteger(v))) {
          report('24b', 'FAIL', r.file, d.line, `${d.prop}: ${trunc(d.value, 28)} (off the 4px scale) on ${r.selector}`, 'Use the 4px spacing scale');
        }
      }
    }
  }
}

function check24a(ctx) {
  const spaceVals = new Map();
  for (const [k, v] of Object.entries(ctx.tokens)) {
    if (!/^--space-/.test(k)) continue;
    const px = pxOf(resolveVars(v, ctx.tokens));
    if (px != null && px > 0) spaceVals.set(px, k);
  }
  if (!spaceVals.size) return;
  const props = /^(padding|margin|gap|row-gap|column-gap)(-[a-z]+)?$/;
  const counts = new Map();
  for (const r of ctx.rules) {
    if (r.keyframes || isTokenRule(r)) continue;
    for (const d of r.decls) {
      if (!props.test(d.prop)) continue;
      const raw = d.value.replace(/var\([^)]*\)/g, ' ');
      for (const m of raw.matchAll(/(?<![\w.-])(-?\d+(?:\.\d+)?)(px|rem)\b/g)) {
        const px = Math.abs(pxOf(m[1] + m[2]) ?? 0);
        if (!px || !spaceVals.has(px)) continue;
        const n = (counts.get(r.file) || 0) + 1;
        counts.set(r.file, n);
        if (n <= 8) report('24a', 'FAIL', r.file, d.line, `${d.prop}: ${trunc(d.value, 28)} on ${trunc(r.selector, 32)} where ${spaceVals.get(px)} exists`, `Use var(${spaceVals.get(px)})`);
        break;
      }
    }
  }
  for (const [file, n] of counts) if (n > 8) report('24a', 'FAIL', file, 1, `+${n - 8} more raw spacing lengths with a matching --space-* token in this file`, 'Use the tokens');
}

function shortProse(ctx, sel) {
  const cls = [...sel.matchAll(/\.([\w-]+)/g)].map((m) => m[1]).pop();
  if (!cls) return false;
  const texts = [];
  for (const doc of ctx.docs) for (const m of doc.src.matchAll(new RegExp(`<(\\w+)[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]*?)</\\1>`, 'g'))) {
    for (const p of (/^p$/i.test(m[1]) ? [m[2]] : m[2].match(/<p\b[^>]*>[\s\S]*?<\/p>/g) || [])) texts.push(p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }
  return texts.length > 0 && texts.every((t) => t.length <= 200 && (t.match(/[.!?](?:\s|$)/g) || []).length <= 2);
}

function check25(ctx) {
  const proseish = /(^|[\s,>+~(])p\b|lede|prose|copy|__body|__text|__desc|paragraph/i;
  for (const r of ctx.rules) {
    if (!proseish.test(r.selector) || HEADING_SEL.test(r.selector)) continue;
    for (const d of r.decls) {
      if (d.prop !== 'max-width') continue;
      const m = /^([\d.]+)ch$/.exec(resolveVars(d.value, ctx.tokens).trim());
      if (m) {
        const ch = parseFloat(m[1]);
        const floor = /lede|hero|caption|figcaption|__line|__sub|subhead|tagline/i.test(r.selector) || shortProse(ctx, r.selector) ? 28 : 45;
        if (ch < floor || ch > 75) {
          report(25, 'WARN', r.file, d.line, `measure ${ch}ch on ${r.selector} (${floor}-75ch range)`, 'Set prose measure between 45 and 75ch; a one-sentence lede or caption from 28ch');
        }
      }
    }
  }
}

function check26(ctx) {
  const hasInteractive = ctx.docs.some((doc) => /<(a|button|input|select|textarea)\b|role\s*=\s*["']button/i.test(doc.src))
    || ctx.rules.some((r) => selectorIsInteractive(r.selector));
  if (!hasInteractive) return;
  const has = (pseudo) => ctx.rules.some((r) => r.selector.includes(pseudo));
  const tv = twGroup(ctx).variants;
  const shared = ctx.shared || {};
  const once = (key) => !shared.once || (!shared.once.has(key) && !!shared.once.add(key));
  const file = ctx.cssFiles[0]?.file || ctx.docs[0]?.file || '?';
  if (!has(':focus-visible') && !has(':focus') && !shared.focus && ![...tv].some((v) => /^focus(?:-visible|-within)?$/.test(v)) && once('26a')) {
    report('26a', 'FAIL', file, 1, 'no :focus-visible styling anywhere', 'A focus ring at 3:1 or better, instant');
  }
  if (!has(':active') && !shared.active && !tv.has('active') && once('26b:active')) {
    report('26b', 'FAIL', file, 1, 'no :active styling anywhere', 'All eight states; guard: not a form control, no aria-disabled anywhere');
  }
  const hasFormish = ctx.docs.some((doc) => /<(button|input|select|textarea)\b/i.test(doc.src));
  if (hasFormish && !has(':disabled') && !shared.disabled && !tv.has('disabled') && !tv.has('aria-disabled') && !ctx.rules.some((r) => /\[disabled\]|aria-disabled/.test(r.selector)) && once('26b:disabled')) {
    report('26b', 'FAIL', file, 1, 'no :disabled styling anywhere', 'All eight states; guard: not a form control, no aria-disabled anywhere');
  }
}

function check27(ctx) {
  const tw = twGroup(ctx);
  const moves = (r) => r.decls.some((d) => /^(transform|translate|scale|rotate)$/.test(d.prop) && !/^none\b/.test(d.value.trim()));
  const hasMotion = ctx.rules.some((r) => r.keyframes)
    || ctx.rules.some((r) => r.decls.some((d) => /^transition/.test(d.prop) && /transform/.test(d.value)))
    || (ctx.rules.some((r) => r.decls.some((d) => /^transition/.test(d.prop) && /(^|[\s,])all\b/.test(d.value))) && ctx.rules.some((r) => /:(hover|active|focus)/.test(r.selector) && moves(r)));
  if (!hasMotion && !tw.motion) return;
  const hasPRM = ctx.rules.some((r) => r.media && /prefers-reduced-motion/i.test(r.media))
    || ctx.cssFiles.some((f) => /prefers-reduced-motion/i.test(stripComments(f.raw)))
    || ctx.docs.some((doc) => doc.styles.some((s) => /prefers-reduced-motion/i.test(stripComments(s.css))))
    || tw.variants.has('motion-reduce') || tw.variants.has('motion-safe') || !!ctx.shared?.prm;
  if (!hasPRM && ctx.shared) {
    if (ctx.shared.once.has('27')) return;
    ctx.shared.once.add('27');
  }
  if (!hasPRM && !hasMotion) {
    const m = tw.motion;
    report(27, 'FAIL', m.doc.file, m.line, `motion utilities (${m.info.animate || 'a transition on a transform'}) with no motion-reduce: or motion-safe: variant anywhere`, 'Add motion-reduce: fallbacks, or put the motion behind motion-safe:');
  } else if (!hasPRM) {
    const kf = ctx.rules.find((r) => r.keyframes);
    const file = kf ? kf.file : (ctx.cssFiles[0]?.file || ctx.docs[0]?.file || '?');
    report(27, 'FAIL', file, kf ? kf.line : 1, 'motion present, no prefers-reduced-motion block', 'Add a prefers-reduced-motion fallback');
  }
}

function check28(ctx) {
  for (const doc of ctx.docs) {
    let firstMedia = true, seenH1 = false, heroPassed = false;
    for (const t of doc.tags) {
      if (t.close) { if (seenH1 && (t.name === 'section' || t.name === 'header')) heroPassed = true; continue; }
      if (t.name === 'h1') seenH1 = true;
      if (t.name === 'video') {
        if (hasAttr(t.attrs, 'autoplay') && !hasAttr(t.attrs, 'muted')) {
          report('28a', 'FAIL', doc.file, t.line, 'autoplay video without muted', 'autoplay muted loop playsinline, with poster');
        }
        if (!getAttr(t.attrs, 'poster')) {
          report('28b', 'FAIL', doc.file, t.line, 'video without poster', 'Add a poster frame; guard: below the fold and not the LCP');
        }
        if ((getAttr(t.attrs, 'loading') || '').toLowerCase() === 'lazy' && firstMedia) {
          report('28a', 'WARN', doc.file, t.line, 'lazy-loaded hero video', 'Never lazy on the LCP video; preload its poster with fetchpriority=high');
        }
        firstMedia = false;
      }
      if (t.name === 'img') {
        if (firstMedia && !heroPassed && (getAttr(t.attrs, 'loading') || '').toLowerCase() === 'lazy') {
          report('28a', 'WARN', doc.file, t.line, 'lazy-loaded first image (likely LCP)', 'fetchpriority=high on the LCP element');
        }
        firstMedia = false;
      }
    }
  }
}

function check30(ctx) {
  const EMOJI = /(?![©®™‼⁉←-⇿])\p{Extended_Pictographic}/u;
  const GLYPH = /(?![©®™‼⁉←-⇿✓-✖])(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}️)/u;
  for (const doc of ctx.docs) {
    const lines = new Set();
    let n = 0;
    const flag = (line, what) => { if (lines.has(line) || n >= 8) return; lines.add(line); n++; report('30a', 'FAIL', doc.file, line, what, 'One icon library, a custom SVG, or the word alone'); };
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || t.selfClosing) continue;
      const cls = getAttr(t.attrs, 'class') || '';
      const iconish = /icon|card|step|tier|feature|value|prop|badge/i.test(cls);
      const inner = innerOf(doc, i);
      if (!inner) continue;
      const content = inner.inner.replace(/<[^>]*>/g, '').trim();
      if (content && content.length <= 4 && EMOJI.test(content) && (iconish || !/<[a-z]/.test(inner.inner))) {
        lines.add(doc.lineOf(t.end + inner.inner.search(EMOJI)));
        report('30a', 'FAIL', doc.file, t.line, `emoji icon "${content}" in <${t.name} class="${trunc(cls, 28)}">`, 'One icon library or custom SVG');
        continue;
      }
      if (!/^(h[1-6]|button|a|label|th|summary|option|legend|dt)$/.test(t.name) || /<(p|div|ul|ol|table|section)\b/i.test(inner.inner)) continue;
      const text = plainText(inner.inner);
      const at = inner.inner.search(GLYPH);
      if (!text || at < 0) continue;
      const line = doc.lineOf(t.end + at);
      flag(line, `emoji in <${t.name}> "${trunc(text, 32)}"`);
    }
    const raw = doc.raw || doc.src;
    const body = doc.kind === 'html' ? doc.masked : raw;
    const lineAt = (text, pos) => text.slice(0, pos).split('\n').length;
    for (const m of body.matchAll(/>\s*((?:\p{Emoji_Presentation}|\p{Extended_Pictographic}️)[^<>{}\n]{0,40})/gu)) flag(lineAt(body, m.index + m[0].length - m[1].length), `text opens with an emoji: "${trunc(m[1].trim(), 32)}"`);
    for (const m of raw.matchAll(/placeholder\s*=\s*["']([^"']*)["']/g)) if (GLYPH.test(m[1])) flag(lineAt(raw, m.index), `emoji in a placeholder "${trunc(m[1], 28)}"`);
    if (doc.kind !== 'html') for (const m of raw.matchAll(/(["'`])\s*((?:(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}️?)‍?){1,3})\s*\1/gu)) flag(lineAt(raw, m.index), `emoji passed as an icon: ${m[2]}`);
  }
  const libs = new Map([
    ['material', /material-icons|material-symbols/i],
    ['heroicons', /heroicon/i],
    ['lucide', /lucide/i],
    ['phosphor', /phosphor|\bph-(?:bold|fill|light|duotone|[a-z]+-[a-z]+)/i],
    ['font-awesome', /font-?awesome|\bfa-(solid|regular|brands|light)\b/i],
    ['feather', /feather-icons|\bfeather\b/i],
    ['tabler', /tabler-icons/i],
    ['bootstrap-icons', /bootstrap-icons|\bbi-[a-z]/i],
  ]);
  const found = new Set();
  const hay = ctx.docs.map((d) => d.src).join('\n') + ctx.cssFiles.map((f) => f.raw).join('\n');
  for (const [name, re] of libs) if (re.test(hay)) found.add(name);
  if (found.size >= 2) {
    report('30b', 'WARN', ctx.docs[0]?.file || ctx.cssFiles[0]?.file, 1, `icon libraries mixed: ${[...found].join(' + ')}`, 'One icon library per page; guard: the second is a brand mark in at most two slots');
  }
}

function check33(ctx) {
  const labeledAttrs = (a) => hasAttr(a, 'aria-hidden') || getAttr(a, 'aria-label') != null
    || getAttr(a, 'aria-labelledby') != null
    || ['img', 'presentation', 'none'].includes((getAttr(a, 'role') || '').toLowerCase());
  for (const doc of ctx.docs) {
    const stack = [];
    for (const t of doc.tags) {
      if (t.close) {
        for (let i = stack.length - 1; i >= 0; i--) {
          if (stack[i].name === t.name) { stack.splice(i); break; }
        }
        continue;
      }
      if (t.name === 'svg' || t.name === 'canvas') {
        const ancestorLabeled = stack.some((s) => s.labeled);
        const titled = t.name === 'svg' && !t.selfClosing && /<title\b[^>]*>\s*\S/i.test(innerOf(doc, doc.tags.indexOf(t))?.inner || '');
        if (!labeledAttrs(t.attrs) && !ancestorLabeled && !titled) {
          report(33, 'FAIL', doc.file, t.line, `<${t.name}> without aria-hidden or aria-label`, 'Add aria-hidden or an aria-label');
        }
      }
      if (!t.selfClosing) stack.push({ name: t.name, labeled: labeledAttrs(t.attrs) });
    }
  }
}

function check34(ctx) {
  const clipped = new Set();
  let hidden = null;
  for (const r of ctx.rules) {
    if (!/(^|[\s,])(html|body)\b/.test(r.selector)) continue;
    const targets = r.selector.split(',').map((p) => (/^\s*(html|body)\s*$/.exec(p) || [])[1]).filter(Boolean);
    for (const d of r.decls) {
      if (d.prop === 'overflow-x' || d.prop === 'overflow') {
        if (/\bclip\b/.test(d.value)) for (const t of targets) clipped.add(t);
        else if (/\bhidden\b/.test(d.value)) hidden = { file: r.file, line: d.line, sel: r.selector };
      }
    }
  }
  const hiddenUtil = [];
  for (const it of twGroup(ctx).items) {
    if (it.idx < 0 || !/^(html|body)$/.test(it.name)) continue;
    if (it.info.oxClip) clipped.add(it.name);
    if (it.info.oxHidden) hiddenUtil.push(it);
  }
  for (const it of hiddenUtil) report(34, 'FAIL', it.doc.file, it.line, `${it.info.oxHidden} on <${it.name}> (breaks sticky)`, 'overflow-x-clip on both html and body, never hidden');
  const shell = (d) => d.kind === 'html' && !d.styles.length && /<script\b[^>]*type\s*=\s*["']module["'][^>]*\bsrc\s*=\s*["'][^"']+\.(?:tsx?|jsx?|mjs|vue|svelte)["']/i.test(d.raw || d.src) && ![...(d.raw || d.src).matchAll(/<link\b[^>]*>/gi)].some((m) => /rel\s*=\s*["']stylesheet/i.test(m[0]) && !/href\s*=\s*["']https?:/i.test(m[0]));
  const pageish = ctx.docs.some((d) => (d.kind === 'html' && !shell(d)) || (d.kind !== 'html' && d.tags.some((t) => !t.close && (t.name === 'html' || t.name === 'body'))));
  const file = ctx.cssFiles[0]?.file || ctx.docs[0]?.file;
  const both = clipped.has('html') && clipped.has('body');
  if (!both && hidden) {
    report(34, 'FAIL', hidden.file, hidden.line, `overflow-x: hidden on ${hidden.sel} (breaks sticky)`, 'Use overflow-x: clip on both html and body, never hidden');
  } else if (!both && file && ctx.docs.length && pageish && !hiddenUtil.length) {
    const where = clipped.size ? `overflow-x: clip on ${[...clipped][0]} only` : 'no overflow-x: clip on html and body';
    report(34, 'FAIL', file, 1, where, 'overflow-x: clip on both html and body');
  }
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (/^(width|min-width)$/.test(d.prop) && /(^|[^\w.-])100vw\b/.test(d.value)) {
        report(34, 'FAIL', r.file, d.line, `${d.prop}: ${trunc(d.value, 28)} on ${r.selector} (scrollbar overflow)`, 'width: 100% with container padding');
      }
    }
  }
}

function check37(ctx) {
  const families = new Map();
  const generic = GENERIC_FAMILIES;
  for (const r of ctx.rules) {
    if (r.selector === '@font-face') continue;
    for (const d of r.decls) {
      if (d.prop !== 'font-family' && !/^--font-/.test(d.prop)) continue;
      if (/^--font-/.test(d.prop) && !isTokenRule(r)) continue;
      const fam = firstFamily(resolveVars(d.value, ctx.tokens));
      if (!fam || generic.has(fam) || fam.startsWith('var(')) continue;
      if (![...families.keys()].some((k) => famKey(k) === famKey(fam))) families.set(fam, { file: r.file, line: d.line });
    }
  }
  if (families.size > 3) {
    const list = [...families.keys()].join(', ');
    const first = [...families.values()][3];
    report(37, 'FAIL', first.file, first.line, `${families.size} font families: ${trunc(list, 56)}`, 'Drop the extra family; three is the ceiling');
  }
}

function check38a(ctx) {
  for (const r of ctx.rules) {
    if (!HEADING_SEL.test(r.selector)) continue;
    for (const d of r.decls) {
      if (d.prop === 'font-style' && /italic|oblique/.test(d.value)) {
        report('38ii', 'FAIL', r.file, d.line, `italic display type on ${r.selector}`, 'Roman headers; emphasis via weight or accent');
      }
    }
  }

  const normSel = ctx.rules.filter((r) => /(^|[\s,>+~])(em|i)\b/.test(r.selector)
    && r.decls.some((d) => d.prop === 'font-style' && /normal/.test(d.value))).flatMap((r) => r.selector.split(',').map((x) => x.trim()));
  const normalised = (level, classes) => normSel.some((sel) => /^(em|i)$/.test(sel) || new RegExp(`(^|[\\s,>+~])h${level}\\b`).test(sel) || classes.some((c) => sel.includes('.' + c)));
  for (const doc of ctx.docs) {
    const re = /<h([1-6])\b([^>]*)>([\s\S]*?)<\/h\1>/gi;
    let m;
    while ((m = re.exec(doc.src))) {
      const classes = ((/class\s*=\s*["']([^"']*)["']/i.exec(m[2]) || [])[1] || '').split(/\s+/).filter(Boolean);
      if (/<(em|i)\b/i.test(m[3]) && !normalised(m[1], classes)) {
        report('38i', 'FAIL', doc.file, doc.lineOf(m.index), `<em>/<i> inside <h${m[1]}>`, 'Roman headers; emphasis via weight or accent');
      }
    }
  }
}

function check39(ctx) {
  const hasInputs = ctx.docs.some((doc) => /<(input|textarea|select)\b/i.test(doc.src))
    || ctx.rules.some((r) => /(^|[\s,>+~])(input|textarea|select)\b/.test(r.selector));
  if (!hasInputs) return;
  const inputSel = /(^|[\s,>+~])(input|textarea|select)\b|__input|__field|\.(input|field)\b/;
  const widthOf = (v) => { const m = /(\d+(?:\.\d+)?)px/.exec(v); return m ? parseFloat(m[1]) : null; };
  let baseW = null, baseWhere = null;
  for (const r of ctx.rules) {
    if (!inputSel.test(r.selector) || /:hover|:focus|:active|:disabled|\[|:checked/.test(r.selector)) {
      continue;
    }
    for (const d of r.decls) {
      if (d.prop === 'border' || d.prop === 'border-width') {
        const w = widthOf(d.value);
        if (w != null && baseW == null) { baseW = w; baseWhere = { file: r.file, line: d.line }; }
      }
    }
  }
  for (const r of ctx.rules) {
    if (!inputSel.test(r.selector)) continue;
    const stateful = /:hover|:focus|\.is-error|\[aria-invalid/.test(r.selector);
    if (!stateful) continue;
    for (const d of r.decls) {
      if (d.prop === 'border' || d.prop === 'border-width') {
        const w = widthOf(d.value);
        if (w != null && baseW != null && w !== baseW) {
          report('39a', 'FAIL', r.file, d.line, `border-width ${baseW}px -> ${w}px on ${r.selector} (layout shift)`, 'Keep border-width constant; move state to outline');
        }
      }
    }
    if (/:focus/.test(r.selector)) {
      const setsBorder = r.decls.some((d) => /^border(-color)?$/.test(d.prop));
      const setsOutline = r.decls.some((d) => /^outline/.test(d.prop));
      if (setsBorder && !setsOutline) {
        report('39a', 'FAIL', r.file, r.line, `focus state via border on ${r.selector}`, 'Focus ring via outline, not border');
      }
    }
  }
  for (const r of ctx.rules) {
    if (!/:disabled|\[disabled\]/.test(r.selector)) continue;
    const hasOpacity = r.decls.some((d) => d.prop === 'opacity');
    const hasCursor = r.decls.some((d) => d.prop === 'cursor' && /not-allowed/.test(d.value));
    if (hasOpacity && !hasCursor) {
      report('39a', 'FAIL', r.file, r.line, `disabled via opacity alone on ${r.selector}`, 'Three disabled channels: fill, ink and cursor, plus the disabled attribute');
    }
  }
}

function check40_41(ctx) {
  const bySel = mergedDeclsBySelector(ctx);
  const resolveColor = (value, local) => {
    const resolved = resolveVars(value, ctx.tokens, local).trim();
    return parseColor(resolved);
  };
  for (const r of bySel) {
    const local = {};
    for (const d of r.decls) if (d.prop.startsWith('--')) local[d.prop] = d.value;
    const colorD = r.decls.find((d) => d.prop === 'color');
    const bgD = r.decls.find((d) => d.prop === 'background-color')
      || r.decls.find((d) => d.prop === 'background' && !/gradient|url\(/i.test(d.value));
    if (colorD && bgD && !/::selection|::placeholder|::-moz/.test(r.selector)) {
      const fg = resolveColor(colorD.value, local);
      const bg = resolveColor(bgD.value, local);
      if (fg && bg && fg.alpha >= 1 && bg.alpha >= 1) {
        const sizeD = r.decls.find((d) => d.prop === 'font-size');
        const weightD = r.decls.find((d) => d.prop === 'font-weight');
        const sizePx = sizeD ? pxOf(resolveVars(sizeD.value, ctx.tokens, local)) : null;
        const weight = weightD ? parseInt(weightD.value, 10) || 400 : 400;
        const large = (sizePx != null && sizePx >= 24) || (sizePx != null && sizePx >= 18 && weight >= 700);
        const threshold = large ? 3.0 : 4.5;
        const ratio = contrastRatio(fg, bg);
        if (ratio < threshold - 0.05) {
          report(40, 'WARN', r.file, colorD.line, `${ratio.toFixed(2)}:1 < ${threshold}:1 on ${r.selector}`, 'Raise the contrast to threshold');
        }
        const okFg = srgbToOklch(fg), okBg = srgbToOklch(bg);
        const btnish = /btn|button|cta|pill|chip/i.test(r.selector);
        if (btnish && Math.abs(okFg.L - okBg.L) < 0.05 && Math.abs(okFg.C - okBg.C) < 0.05) {
          report(41, 'WARN', r.file, colorD.line, `button text ~ button fill on ${r.selector} (dL ${Math.abs(okFg.L - okBg.L).toFixed(3)})`, 'Use accent-ink or paper for the label');
        }
      }
    }
    const faceProp = Object.keys(local).find((k) => /(face|fill|bg)$/.test(k));
    const inkProp = Object.keys(local).find((k) => /(ink|text)$/.test(k));
    if (faceProp && inkProp) {
      const face = resolveColor(local[faceProp], local);
      const ink = resolveColor(local[inkProp], local);
      if (face && ink && face.alpha >= 1 && ink.alpha >= 1) {
        const a = srgbToOklch(face), b = srgbToOklch(ink);
        if (Math.abs(a.L - b.L) < 0.05 && Math.abs(a.C - b.C) < 0.05) {
          report(41, 'WARN', r.file, r.line, `${inkProp} ~ ${faceProp} on ${r.selector}`, 'Use accent-ink or paper for the label');
        }
      }
    }
  }
  if (ctx.tokens['--color-accent'] && !ctx.tokens['--color-accent-ink']) {
    const used = ctx.rules.some((r) => !isTokenRule(r) && r.decls.some((d) =>
      /^background(-color)?$/.test(d.prop) && /var\(\s*--color-accent\s*[),]/.test(d.value)));
    if (used) {
      const file = ctx.cssFiles[0]?.file || ctx.docs[0]?.file;
      report(41, 'WARN', file, 1, 'accent fills a surface but --color-accent-ink is undefined', 'Define and apply --color-accent-ink');
    }
  } else if (ctx.tokens['--color-accent'] && ctx.tokens['--color-accent-ink']) {
    const a = parseColor(resolveVars(ctx.tokens['--color-accent'], ctx.tokens));
    const i = parseColor(resolveVars(ctx.tokens['--color-accent-ink'], ctx.tokens));
    if (a && i && contrastRatio(a, i) < 4.45) {
      const file = ctx.cssFiles[0]?.file || ctx.docs[0]?.file;
      report(41, 'WARN', file, 1, `accent-ink vs accent only ${contrastRatio(a, i).toFixed(2)}:1`, 'Accent-ink needs 4.5:1 against accent');
    }
  }
  const sectionish = /section|panel|hero|footer|band|block|col\b|__col|card|cta|dark|invert/i;
  for (const r of bySel) {
    if (!sectionish.test(r.selector) || /:hover|:focus|:active|::|@font-face/.test(r.selector)) continue;
    const local = {};
    for (const d of r.decls) if (d.prop.startsWith('--')) local[d.prop] = d.value;
    const bgD = r.decls.find((d) => d.prop === 'background-color')
      || r.decls.find((d) => d.prop === 'background' && !/gradient|url\(/i.test(d.value));
    if (!bgD) continue;
    const bg = resolveColor(bgD.value, local);
    if (!bg || bg.alpha < 1) continue;
    const okl = srgbToOklch(bg);
    if (okl.L < 0.5) {
      const hasColor = r.decls.some((d) => d.prop === 'color');
      if (!hasColor) {
        report(41, 'WARN', r.file, bgD.line, `dark surface (L ${(okl.L * 100).toFixed(0)}%) on ${r.selector} sets no text colour`, 'Swap text to paper in the same rule');
      }
    }
  }
}

function check42(ctx) {
  for (const doc of ctx.docs) {
    const navIdx = doc.tags.findIndex((t) => !t.close && (t.name === 'nav' || (t.name === 'header' && /banner|nav/i.test(t.attrs))));
    if (navIdx === -1) continue;
    const inner = innerOf(doc, navIdx);
    if (!inner) continue;
    const links = (inner.inner.match(/<a\b/gi) || []).length;
    const navTag = doc.tags[navIdx];
    const navCls = (getAttr(navTag.attrs, 'class') || '').split(/\s+/)[0];
    const hairline = ctx.rules.some((r) => (navCls && r.selector.includes(navCls) || /(^|[\s,])(nav|header)\b/.test(r.selector))
      && r.decls.some((d) => /^border(-bottom)?$/.test(d.prop) && /\b1px\b/.test(d.value)));
    const hasCta = /btn|cta|button/i.test(inner.inner);
    if (links >= 4 && links <= 6 && hairline && hasCta) {
      report(42, 'WARN', doc.file, navTag.line, `default nav shape: ${links} links + CTA + 1px hairline`, 'Give the nav a shape of its own (layout.md, navs)');
    }
  }
}

function check42Footer(ctx) {
  for (const doc of ctx.docs) {
    const idx = doc.tags.findIndex((t) => !t.close && t.name === 'footer');
    if (idx === -1) continue;
    const inner = innerOf(doc, idx);
    if (!inner) continue;
    const uls = (inner.inner.match(/<ul\b/gi) || []).length;

    const fourEqualCol = ctx.rules.some((r) => /footer/i.test(r.selector) && r.decls.some((d) =>
      d.prop === 'grid-template-columns'
      && (/repeat\(\s*4\s*,/.test(d.value)
        || /^(1fr|minmax\([^)]*\))(\s+(1fr|minmax\([^)]*\))){3,}$/.test(d.value.trim()))));

    let linkGroups = 0;
    const colRe = /<(ul|div|p|nav)\b[^>]*class\s*=\s*"[^"]*(col|column|links|group)[^"]*"[^>]*>([\s\S]*?)<\/\1>/gi;
    let cm;
    while ((cm = colRe.exec(inner.inner))) {
      if ((cm[3].match(/<a\b/gi) || []).length >= 3) linkGroups++;
    }
    for (const um of inner.inner.matchAll(/<ul\b[^>]*>([\s\S]*?)<\/ul>/gi)) {
      if ((um[1].match(/<a\b/gi) || []).length >= 3) linkGroups++;
    }
    if (uls >= 4 || (fourEqualCol && linkGroups >= 3)) {
      report(42, 'WARN', doc.file, doc.tags[idx].line, `default footer shape: ${uls >= 4 ? uls + ' link columns' : '4 equal columns of links'}`, 'Decide the footer and name it in the stamp, or build another shape');
    }
  }
}

function check46(ctx) {
  const shapes = [
    /\b\d+(\.\d+)?\s*[x×]\s*faster\b/i,
    /trusted by [\d,.]+\s*\+?/i,
    /\b99\.9+\s*%/,
    /\b[\d,]{4,}\s*\+\s*(teams|users|customers|developers|companies|creators)\b/i,
    /\b\d+(\.\d+)?\s*%\s*(faster|uptime|conversion|accuracy|retention|growth|fewer|less|more)\b/i,
    /\+\s*\d+(\.\d+)?\s*%\s*(conversion|growth|revenue|retention)\b/i,
    /\bsaves?\s+\d+\s+hours?\b/i,
  ];
  for (const doc of ctx.docs) {
    const prose = maskedProse(doc);
    const lines = new Set();
    for (const re of shapes) {
      const m = re.exec(prose);
      if (!m) continue;
      const line = doc.lineOf(m.index);
      if (lines.has(line)) continue;
      lines.add(line);
      report('46a', 'WARN', doc.file, line, `metric "${m[0].trim()}": verify the user supplied this number`, 'Confirm the metric or drop the slot');
    }
  }
}

const CHROME_47 = [
  ['47a', /(browser|window|mac|osx)[-_]?(bar|chrome|dots|controls)|traffic[-_]?light|title[-_]?bar|window[-_]?(dots|buttons)|url[-_]?(bar|pill)/i],
  ['47b', /phone[-_]?(frame|mock(up)?)|device[-_]?frame|\bnotch\b|terminal[-_]?(chrome|frame|bar|dots|header)|(ide|editor)[-_]?(chrome|frame)|(browser|window)[-_]?frame/i],
];
function check47(ctx) {
  for (const [gate, re] of CHROME_47) {
    for (const doc of ctx.docs) {
      for (const t of doc.tags) {
        if (t.close) continue;
        const cls = getAttr(t.attrs, 'class');
        const m = cls ? re.exec(cls) : null;
        if (m) { report(gate, 'FAIL', doc.file, t.line, `re-drawn chrome class "${m[0]}" (class="${trunc(cls, 32)}")`, 'Use a real screenshot in a figure'); break; }
      }
    }
    for (const r of ctx.rules) {
      const m = re.exec(r.selector);
      if (m) {
        report(gate, 'FAIL', r.file, r.line, `re-drawn chrome selector ${r.selector}`, 'Use a real screenshot in a figure');
        break;
      }
    }
  }
}

function check48(ctx) {
  const colorLit = /#[0-9a-fA-F]{3,8}\b|(?<![\w-])rgba?\(|(?<![\w-])hsla?\(|(?<![\w-])oklch\(/;
  for (const [prop, val] of Object.entries(ctx.tokens)) {
    if (/^--(font|color)-/.test(prop) && /FILL ME/i.test(val)) {
      const tr = ctx.rules.find((r) => isTokenRule(r) && r.decls.some((d) => d.prop === prop));
      report(48, 'FAIL', tr ? tr.file : ctx.cssFiles[0]?.file || ctx.docs[0]?.file, tr ? tr.decls.find((d) => d.prop === prop)?.line : 1, `${prop} is still the scaffold placeholder "FILL ME"`, /^--font-/.test(prop) ? 'Fill the face from the theme tokens (scaffold) or fonts.md on a custom run before building' : 'Fill the colour from the theme tokens (scaffold) or direction.md on a custom run before building');
    }
  }
  for (const r of ctx.rules) {
    if (isTokenRule(r)) continue;
    for (const d of r.decls) {
      if (d.prop === 'font-family') {
        const v = d.value;
        if (/FILL ME/i.test(resolveVars(v, ctx.tokens))) {
          report(48, 'FAIL', r.file, d.line, `font-family on ${r.selector} resolves to the placeholder "FILL ME"`, 'Fill the face from the theme tokens (scaffold) or fonts.md on a custom run before building');
          continue;
        }
        if (!v.includes('var(')) {
          const fam = firstFamily(v);
          if (!GENERIC_FAMILIES.has(fam)) {
            report(48, 'FAIL', r.file, d.line, `font-family literal "${trunc(v, 36)}" on ${r.selector}`, 'Lift the value into the token block');
          }
        }
        continue;
      }
      if (!colorLit.test(d.value)) continue;
      const re = /#[0-9a-fA-F]{3,8}\b|oklch\([^)]*\)|rgba?\([^)]*\)|hsla?\([^)]*\)/g;
      let m;
      while ((m = re.exec(d.value))) {
        const c = parseColor(m[0]);
        if (!c) continue;
        if (c.alpha === 0) continue;
        const isOklch = m[0].toLowerCase().startsWith('oklch');
        const ev = `${isOklch ? 'oklch' : 'colour'} literal ${trunc(m[0], 30)} outside tokens (${d.prop} on ${trunc(r.selector, 30)})`;
        report(48, 'FAIL', r.file, d.line, ev, 'Lift the value into the token block');
      }
    }
  }
  for (const doc of ctx.docs) {
    const re = /style\s*=\s*"([^"]*)"/gi;
    let m;
    while ((m = re.exec(doc.src))) {
      const lit = /#[0-9a-fA-F]{3,8}\b|oklch\([^)]*\)|rgba?\([^)]*\)|hsla?\([^)]*\)/.exec(m[1]);
      if (lit && parseColor(lit[0])) {
        const isOklch = lit[0].toLowerCase().startsWith('oklch');
        const ev = `inline-style colour literal ${trunc(lit[0], 30)}`;
        report(48, 'FAIL', doc.file, doc.lineOf(m.index), ev, 'Lift the value into the token block');
      }
    }
  }
}

function check49(ctx) {
  const nowrapSelectors = ctx.rules.filter((r) => r.decls.some((d) => d.prop === 'white-space' && /nowrap/.test(d.value)));
  const covered = (cls, tag) => nowrapSelectors.some((r) =>
    (cls && cls.split(/\s+/).some((c) => c && r.selector.includes('.' + c))) || new RegExp(`(^|[\\s,>+~])${tag}\\b`).test(r.selector));
  for (const doc of ctx.docs) {
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || t.selfClosing) continue;
      const cls = getAttr(t.attrs, 'class') || '';
      const clickable = t.name === 'button' || (t.name === 'a' && /btn|cta|button|nav/i.test(cls))
        || (/(^|\s)(btn|button)(\s|$|__|--)/i.test(cls) && !/^(section|header|footer|main|article|aside|nav|form|ul|ol)$/.test(t.name));
      if (!clickable) continue;
      const inner = innerOf(doc, i);
      if (!inner) continue;
      const label = inner.inner.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      if (label.length > 24 && !covered(cls, t.name)) {
        report(49, 'WARN', doc.file, t.line, `long clickable label "${trunc(label, 36)}" without nowrap`, 'Shorten the label or set nowrap');
      }
    }
  }
}

function check50(ctx) {
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (d.prop !== 'grid-template-columns') continue;
      let flat = resolveVars(d.value, ctx.tokens);
      for (let k = 0; k < 4 && /\((?:[^()]*)\)/.test(flat); k++) flat = flat.replace(/(calc|min|max|clamp|var|fit-content)\(([^()]*)\)/g, 'X');
      flat = flat.replace(/minmax\([^()]*\)/g, 'MM');
      const bare = /(?<![\w.-])\d*\.?\d+fr\b/.exec(flat);
      if (!bare) continue;
      const classes = (r.selector.match(/\.[a-zA-Z][\w-]*/g) || []).map((c) => c.slice(1));
      let hit = null;
      for (const doc of ctx.docs) {
        for (let i = 0; i < doc.tags.length; i++) {
          const t = doc.tags[i];
          if (t.close || t.selfClosing) continue;
          const cls = getAttr(t.attrs, 'class') || '';
          if (!classes.some((c) => cls.split(/\s+/).includes(c))) continue;
          const inner = innerOf(doc, i);
          if (inner && /<(img|picture|video)\b/i.test(inner.inner)) { hit = { doc, t }; break; }
        }
        if (hit) break;
      }
      if (hit) {
        report(50, 'FAIL', r.file, d.line, `bare ${bare[0]} track holds images (${r.selector})`, 'Use minmax(0, 1fr) for image tracks');
      }
    }
  }
}

function check50Wrap(ctx) {
  const wrapCovered = (cls, tag) => ctx.rules.some((r) => {
    const has = r.decls.some((d) =>
      (d.prop === 'overflow-wrap' && /anywhere|break-word/.test(d.value))
      || (d.prop === 'word-break' && /break-word|break-all/.test(d.value))
      || (d.prop === 'hyphens' && /auto/.test(d.value)));
    if (!has) return false;
    if (/^\*|:where\(|html|body/.test(r.selector)) return true;
    return (cls && cls.split(/\s+/).some((c) => c && r.selector.includes('.' + c)))
      || new RegExp(`(^|[\\s,>+~])${tag}\\b`).test(r.selector);
  });
  for (const doc of ctx.docs) {
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || t.selfClosing) continue;
      const cls = getAttr(t.attrs, 'class') || '';
      const displayish = /^h[12]$/.test(t.name) || /hero__(title|display)|section__title|__display/.test(cls);
      if (!displayish) continue;
      const inner = innerOf(doc, i);
      if (!inner) continue;
      const textContent = inner.inner.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      let risky = null;
      for (const word of textContent.split(' ')) {
        for (const seg of word.split('-')) {
          if (seg.replace(/[^\w]/g, '').length >= 16) { risky = word; break; }
        }
        if (risky) break;
      }
      if (risky && !wrapCovered(cls, t.name)) {
        report(50, 'FAIL', doc.file, t.line, `display header word "${trunc(risky, 30)}" with no overflow-wrap`, 'Add overflow-wrap: break-word and min-width: 0');
      }
    }
  }
}

function check53(ctx) {
  const radios = ctx.rules.filter((r) => /input\[type=["']?radio["']?\]|\.(radio|tab-input|tab-radio)\b/i.test(r.selector));
  for (const r of radios) {
    const abs = r.decls.some((d) => d.prop === 'position' && /absolute|fixed/.test(d.value));
    const topZero = r.decls.some((d) => d.prop === 'top' && /^0(px|rem)?$/.test(d.value.trim()));
    if (abs && topZero) {
      const guarded = ctx.docs.some((doc) => /preventScroll/.test(doc.scripts));
      if (!guarded) {
        report(53, 'FAIL', r.file, r.line, `radio tabs at position:absolute top:0 (${r.selector}), no JS guard`, 'Keep radios in flow or add a JS guard');
      }
    }
  }
}

const EYEBROW_CONTAINER = /^(div|header|footer|section|article|aside|hgroup|li|main|figure|a|body|blockquote)$/;

const EYEBROW_SKIP_TAGS = /^(figcaption|label|legend|caption|th|dt|summary|option|code|kbd|button|select|nav|time)$/;
const EYEBROW_ANCESTOR_SKIP = /^(form|fieldset|table|thead|tbody|nav|menu|dl|select|figcaption|label|button)$/;

const EYEBROW_BLOCKY = /<(p|ul|ol|hr|h[1-6]|img|table|figure|section|article|blockquote|form|dl)\b/i;
const EYEBROW_CLASS = /\b(eyebrow|kicker|overline|superhead|suphead|rubric|strap(line)?|pre-?(title|head(ing)?)|section-?label|num-?label|chapter|ordinal|topic|category|dept)\b|__(num|label|tag|kicker|chip|badge|meta|index|caps|micro)\b|\b(tag|chip|badge|meta|caps|micro|label|index)\b/i;
const EYEBROW_ANNOUNCE = /^(features?|benefits?|introducing|new|how it works?|the (process|tour)|our (process|story|work|team|approach|values?)|why (us|choose|we)|pricing|plans?|faq|questions?|testimonials?|reviews?|trusted by|as seen in|what we do|about( us)?|services?|solutions?|use cases?|get started|contact|team|work|projects?|gallery|blog|news|resources?|examples?|overview)$/i;

function capsRatio(s) {
  const letters = s.replace(/[^A-Za-z]/g, '');
  if (!letters) return 0;
  return (letters.match(/[A-Z]/g) || []).length / letters.length;
}

function eyebrowHeadingBearing(ctx, B, aPx) {
  if (/^h[1-6]$/.test(B.name)) return true;
  if (/<h[1-6][\s>]/i.test(B.html)) return true;

  const cls = getAttr(B.open, 'class') || '';
  if (!/__(title|display|head(line)?|h\d)\b|hero__/i.test(cls)) return false;
  const bPx = fontPxOf(ctx, styleFor(ctx, cls, B.name));
  return bPx != null && aPx != null && bPx >= 1.5 * aPx;
}

function eyebrowHit(ctx, A, B, inOrderedList) {
  if (EYEBROW_SKIP_TAGS.test(A.name)) return null;
  if (/(^|\s)for\s*=/i.test(A.open)) return null;
  if (/role\s*=\s*["']status|aria-live|aria-current|aria-hidden\s*=\s*["']true/i.test(A.open)) return null;
  const inner = A.html.slice(A.open.length);
  if (EYEBROW_BLOCKY.test(inner) || /<br\b/i.test(inner)) return null;
  if (/<time\b[^>]*\sdatetime\s*=/i.test(A.html)) return null;
  if (/<img\b[^>]*\salt\s*=\s*["'][^"']+/i.test(A.html)) return null;

  const ownHref = A.name === 'a' ? getAttr(A.open, 'href') : null;
  if (ownHref && !/^#?$/.test(ownHref.trim())) return null;
  const innerHref = /<a\b[^>]*\shref\s*=\s*["']([^"']*)["']/i.exec(inner);
  if (innerHref && !/^#?$/.test(innerHref[1].trim())) return null;

  const text = plainText(A.html);
  if (!text) return null;
  const words = text.split(/[\s·/|\u2014\u2013]+/).filter(Boolean);
  if (words.length > 7 || text.length > 56) return null;
  if (/[\w/-]+\.[a-z]{1,4}$/i.test(text)) return null;

  if (/^[\d.,]+\s*(?:[%°+]|[a-z]{1,3})$/i.test(text)) return null;
  const stripped = text.replace(/^\s*(?:no\.?\s*)?\d{1,3}(?:\s*[·./\u2014\u2013-]\s*|\s+|$)/i, '').trim();
  if ((stripped.match(/\d/g) || []).length >= 2) return null;

  if (inOrderedList && stripped && !EYEBROW_ANNOUNCE.test(stripped)) return null;

  const cls = getAttr(A.open, 'class') || '';
  const aDecls = styleFor(ctx, cls, A.name);

  const pos = declValue(ctx, aDecls, 'position');
  if (pos && /absolute|fixed/.test(pos)) return null;
  const aPx = fontPxOf(ctx, aDecls);
  if (!eyebrowHeadingBearing(ctx, B, aPx)) return null;

  if (EYEBROW_CLASS.test(cls)) return { text };
  let signals = 0;
  const tt = declValue(ctx, aDecls, 'text-transform');
  if ((tt && /uppercase/.test(tt)) || (capsRatio(text) >= 0.6 && /[A-Z]/.test(text))) signals++;
  const tr = trackingEmOf(ctx, aDecls, aPx || 16);
  if (tr != null && tr >= 0.04) signals++;
  if (aPx != null && aPx <= 15) signals++;
  const ff = declValue(ctx, aDecls, 'font-family');
  if (ff && /mono|--font-label/i.test(ff)) signals++;
  const fv = declValue(ctx, aDecls, 'font-variant-caps');
  if (fv && /small-caps/.test(fv)) signals++;
  if (signals >= 2) return { text };
  if (EYEBROW_ANNOUNCE.test(stripped)) return { text };
  return null;
}

function check54(ctx) {
  for (const doc of ctx.docs) {
    const anc = ancestorMap(doc);
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || t.selfClosing || !EYEBROW_CONTAINER.test(t.name)) continue;
      const ancestors = anc.get(i) || [];
      if (ancestors.some((n) => EYEBROW_ANCESTOR_SKIP.test(n))) continue;
      const inOl = ancestors.includes('ol');
      const kids = directChildren(doc, i);
      for (let k = 0; k < kids.length - 1; k++) {
        const A = kids[k];
        let B = null;
        for (let j = k + 1; j < Math.min(kids.length, k + 3); j++) {
          const c = kids[j];
          if (c.name === 'hr' || /aria-hidden\s*=\s*["']true/i.test(c.open)) continue;
          B = c; break;
        }
        if (!B) continue;
        const hit = eyebrowHit(ctx, A, B, inOl);
        if (hit) {
          report(54, 'FAIL', doc.file, doc.tags[A.idx]?.line || t.line,
            `eyebrow "${trunc(hit.text, 32)}" before <${B.name}>`,
            'Cut it; the heading already says this (craft.md § 7 has twelve other openings)');
          break;
        }
      }
    }
  }
  check54Unheaded(ctx);
}

function check54Unheaded(ctx) {
  for (const doc of ctx.docs) {
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || t.selfClosing || !/^(section|article)$/.test(t.name)) continue;
      const labelledBy = getAttr(t.attrs, 'aria-labelledby');
      if (!labelledBy) continue;
      const body = innerOf(doc, i);
      if (!body || /<h[1-6][\s>]/i.test(body.inner)) continue;
      const idRe = new RegExp(`<([a-z][\\w-]*)\\b[^>]*\\sid\\s*=\\s*["']${labelledBy.split(/\s+/)[0]}["'][^>]*>`, 'i');
      const m = idRe.exec(body.inner);
      if (!m || /^h[1-6]$/i.test(m[1])) continue;
      report(54, 'WARN', doc.file, doc.lineOf(body.endPos - body.inner.length + m.index),
        `section labelled by <${m[1].toLowerCase()}> with no heading element`,
        'Promote it to <h2>; a label doing heading duty should be a heading');
    }
  }
}

function check55(ctx) {
  const bySel = mergedDeclsBySelector(ctx);
  for (const r of bySel) {
    const upper = r.decls.find((d) => d.prop === 'text-transform' && /uppercase/.test(d.value));
    if (!upper) continue;
    const displayish = HEADING_SEL.test(r.selector);
    const lhD = r.decls.find((d) => d.prop === 'line-height');
    if (!lhD) continue;
    const lh = parseFloat(resolveVars(lhD.value, ctx.tokens));
    if (Number.isNaN(lh) || lh >= 1.02) continue;
    const bigType = r.decls.some((d) => d.prop === 'font-size' && (pxOf(resolveVars(d.value, ctx.tokens)) ?? 0) >= 28);
    if (!displayish && !bigType) continue;
    const nowrap = r.decls.some((d) => d.prop === 'white-space' && /nowrap/.test(d.value));
    if (!nowrap && lh >= 1.0) continue;
    report(nowrap ? '55b' : '55a', 'FAIL', r.file, lhD.line, `uppercase + line-height ${lh} on ${r.selector} (cap collision)`, nowrap ? 'A single-line caps lockup holds 1.02 or more' : 'Line-height 1.0 minimum for caps heads that can wrap');
  }
}

function check56(ctx) {
  const bySel = mergedDeclsBySelector(ctx);
  const sticky = [];
  for (const r of bySel) {
    const isSticky = r.decls.some((d) => d.prop === 'position' && /sticky/.test(d.value));
    const topZero = r.decls.some((d) => d.prop === 'top' && /^(0|0px|0rem|-1px)$/.test(resolveVars(d.value, ctx.tokens).trim()));
    if (isSticky && topZero) sticky.push(r);
  }
  if (sticky.length >= 2) {
    const sels = sticky.map((r) => r.selector).join(' + ');
    report(56, 'FAIL', sticky[1].file, sticky[1].line, `two sticky top:0 elements: ${trunc(sels, 52)}`, 'Offset the second sticky by banner height');
  }
}

function checkCopyTell(ctx) {
  for (const doc of ctx.docs) {
    const prose = maskedProse(doc);
    const m = /\w\s--\s\w|[\u2014\u2013]|&mdash;|&ndash;|&#8212;|&#8211;/.exec(prose);
    if (m) report(19, 'FAIL', doc.file, doc.lineOf(m.index), `dash "${m[0]}" in copy`, 'A comma, a colon, a full stop or parentheses; never a dash');
    const seenBuzz = new Set();
    for (const buzz of prose.matchAll(new RegExp(/\b(seamless(ly)?|robust|empower(s|ing)?|supercharge[sd]?|best[- ]in[- ]class|industry[- ]leading|mission[- ]critical|future[- ]proof(ed)?|unleash(es|ed|ing)?|elevate[sd]?|effortless(ly)?|unlock(s|ing)?|next[- ]generation|world[- ]class|cutting[- ]edge|streamline[sd]?|revolutioni[sz]e[sd]?|game[- ]chang(er|ing)|enterprise[- ]grade|quietly (trusted|in use)|built for the modern|in today's)\b/.source, 'gi'))) {
      const word = buzz[0].toLowerCase();
      if (seenBuzz.has(word) || seenBuzz.size >= 8) continue;
      seenBuzz.add(word);
      report(19, 'FAIL', doc.file, doc.lineOf(buzz.index), `buzzword "${buzz[0]}"`, 'Say what the product does, in its own nouns');
    }
    const cadence = prose.match(/(^|[.!?]\s+)(not|no)\s+[a-z][^.!?\n]{0,40}[.]\s+(just|only|a|an)?\s*[a-z][^.!?\n]{0,40}[.]/gi) || [];
    if (cadence.length >= 3) report(19, 'FAIL', doc.file, doc.lineOf(prose.indexOf(cadence[0].trim()) || 0), `rebuttal cadence repeated ${cadence.length} times ("${trunc(cadence[0].trim(), 40)}")`, 'Once is voice; three times is a tic');
  }
}

function monoIsMaterial(ctx) {
  const mono = (v) => v && /mono|code|courier|silkscreen|jetbrains|plex mono|geist mono|commit|fira code|space mono|dm mono|roboto mono|source code|ibm plex mono|press start|vt323|share tech/i.test(firstFamily(resolveVars(v, ctx.tokens)));
  return mono(ctx.tokens['--font-display']) || mono(ctx.tokens['--font-body']) || mono(ctx.tokens['--font-outlier']);
}

const HIDE_OK = /tooltip|popover|menu|dropdown|modal|dialog|toast|overlay|backdrop|sheet|drawer|panel|:hover|:focus|:checked|:target|\[open|\[aria-(?:expanded|selected|current|pressed)|::before|::after|\.is-|\[hidden|\[aria-hidden|sr-only|visually-hidden|skip|placeholder|::marker|\[data-slot/i;
function startingStyleText(css) {
  let out = '';
  for (const m of css.matchAll(/@starting-style\s*\{/gi)) {
    let depth = 1, k = m.index + m[0].length;
    while (k < css.length && depth > 0) { if (css[k] === '{') depth++; else if (css[k] === '}') depth--; k++; }
    out += css.slice(m.index, k) + ' ';
    const open = css.lastIndexOf('{', m.index - 1), close = css.lastIndexOf('}', m.index - 1);
    if (open > close) out += css.slice(Math.max(close + 1, 0), open) + ' ';
  }
  return out;
}
function check62(ctx) {
  const starting = startingStyleText(ctx.allCss);
  const jsScoped = (sel) => /(^|[\s,])(html|body)?\.js\b|\[data-js|\.no-js|html\.has-js/i.test(sel);
  const animatedNames = new Map();
  for (const r of ctx.rules) if (r.keyframes) {
    const arr = animatedNames.get(r.keyframes) || [];
    arr.push(r); animatedNames.set(r.keyframes, arr);
  }
  const animatesVisible = (name) => (animatedNames.get(name) || []).some((r) => /to|100%/.test(r.selector) && r.decls.some((d) => d.prop === 'opacity' && parseFloat(d.value) === 1));
  const seen = new Set();
  for (const r of ctx.rules) {
    if (r.keyframes || (r.media && /\bprint\b/i.test(r.media)) || r.selector === '@font-face') continue;
    const hidden = r.decls.find((d) => (d.prop === 'opacity' && parseFloat(resolveVars(d.value, ctx.tokens)) === 0) || (d.prop === 'visibility' && /hidden/.test(d.value)));
    if (!hidden) continue;
    if (HIDE_OK.test(r.selector.replace(/:not\([^)]*\)/g, '')) || jsScoped(r.selector) || (starting && starting.includes(r.selector))) continue;
    const revealish = /reveal|fade|animate|aos|in-view|inview|appear|enter|rise|slide|stagger|observe|lazy/i.test(r.selector) || r.decls.some((d) => d.prop === 'transform' && /translate|scale/.test(d.value));
    if (!revealish) continue;
    const anim = r.decls.find((d) => d.prop === 'animation' || d.prop === 'animation-name');
    const animName = anim ? anim.value.split(/\s+/).find((w) => animatedNames.has(w)) : null;
    if (animName && animatesVisible(animName)) continue;
    const key = r.selector;
    if (seen.has(key)) continue; seen.add(key);
    report(62, 'FAIL', r.file, hidden.line, `${r.selector} is hidden at rest (${hidden.prop}: ${hidden.value}) and depends on a script to appear`, 'Visible by default: scope the hidden state under a .js class the script adds, or animate from visible with @starting-style');
  }
}

const TEXT_TAGS = new Set(['p', 'span', 'li', 'small', 'a', 'div', 'figcaption', 'td', 'th', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'time', 'dd', 'dt', 'cite', 'strong', 'em', 'b', 'label', 'button', 'summary']);
function check63(ctx) {
  for (const doc of ctx.docs) {
    const dotLines = new Set(); const arrowLines = new Set(); let dotCount = 0;
    const tickerRanges = [];
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || t.selfClosing || !/marquee|ticker|tape|crawl/i.test(getAttr(t.attrs, 'class') || '')) continue;
      const inner = innerOf(doc, i);
      if (inner) tickerRanges.push([t.pos, inner.endPos]);
    }
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || t.selfClosing || !TEXT_TAGS.has(t.name)) continue;
      const cls = getAttr(t.attrs, 'class') || '';
      if (/marquee|ticker|tape|crawl/i.test(cls) || tickerRanges.some(([a, b]) => t.pos > a && t.pos < b)) continue;
      const inner = innerOf(doc, i);
      if (!inner) continue;
      if (/<(p|div|li|section|article|ul|ol|table)\b/i.test(inner.inner)) continue;
      const text = plainText(inner.inner);
      if (!text) continue;
      const dots = (text.match(/\s[·•]\s/g) || []).length;
      if (dots >= 2 && !dotLines.has(t.line)) { dotLines.add(t.line); report(63, 'FAIL', doc.file, t.line, `middle-dot meta string "${trunc(text, 50)}"`, 'Line breaks, columns or hairlines; one dot in a byline at most'); }
      if ((t.name === 'a' || t.name === 'button') && /(\u2192|->|\u203a|\u00bb|\u27f6)\s*$/.test(text) && !arrowLines.has(t.line)) { arrowLines.add(t.line); report(63, 'FAIL', doc.file, t.line, `arrow glued to the label "${trunc(text, 40)}"`, 'A verb as the label; the link already says it goes somewhere'); }
      if (/^[A-Z]{3,}\s+-\s+\S/.test(text) && text.length < 60) report(63, 'FAIL', doc.file, t.line, `WORD - fragment label "${trunc(text, 40)}"`, 'Say the thing as a sentence or a heading');
    }
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || !/^(span|i|b|em|s)$/.test(t.name)) continue;
      const cls = getAttr(t.attrs, 'class') || '';
      if (!/(^|\s)(dot|status-dot|indicator|bullet|pip|blip)(\s|$|__|-)/i.test(cls)) continue;
      if (/aria-live|role\s*=\s*"status"/i.test(t.attrs)) continue;
      const inner = innerOf(doc, i);
      if (inner && plainText(inner.inner)) continue;
      dotCount++;
      if (dotCount === 3) report(63, 'FAIL', doc.file, t.line, `decorative status dots (${cls.trim()}) repeated across the page`, 'Delete them; a dot means live state, and only where it is one');
    }
  }
}

function check64(ctx) {
  if (monoIsMaterial(ctx)) return;
  const monoFam = (v) => /mono|courier|jetbrains|plex mono|geist mono|commit|fira code|space mono|dm mono|roboto mono|source code|silkscreen/i.test(firstFamily(resolveVars(v, ctx.tokens)));
  const LABELISH = /label|caption|meta|eyebrow|kicker|tag\b|badge|chip|small|folio|footnote|legend|\bth\b|thead|figcaption|overline|dateline|byline|credit|note\b/i;
  const DATAISH = /code|pre\b|kbd|samp|num|figure|stat|price|value|data|tabular|counter|timer|clock|coord|amount|total|score|version|hash|\bid\b|sku|time|date|hour|utc|eta|lot\b|edition|ref\b|dimension|measure|reading|plate-?no|tag-?no|url|uri\b|path|endpoint|command|cmd|snippet|install/i;
  const seen = new Set();
  for (const r of ctx.rules) {
    if (r.keyframes || r.selector === '@font-face' || isTokenRule(r)) continue;
    if (!LABELISH.test(r.selector) || DATAISH.test(r.selector)) continue;
    const fam = r.decls.find((d) => d.prop === 'font-family' || (d.prop === 'font' && /var\(--font|mono/i.test(d.value)));
    if (!fam) continue;
    const raw = fam.prop === 'font' ? (/var\(--font-[\w-]+\)/.exec(fam.value) || [fam.value])[0] : fam.value;
    if (!monoFam(raw)) continue;
    const key = baseSelector(r.selector);
    if (seen.has(key)) continue; seen.add(key);
    report(64, 'FAIL', r.file, fam.line, `monospace label voice on ${r.selector}`, 'Labels in the body face, a step smaller, sentence case; mono only for code and figures');
  }
}

function check65(ctx) {
  const paper = parseColor(resolveVars(ctx.tokens['--color-paper'] || '', ctx.tokens));
  const accent = parseColor(resolveVars(ctx.tokens['--color-accent'] || '', ctx.tokens));
  if (!paper || !accent) return;
  const p = paper.okl || srgbToOklch(paper); const a = accent.okl || srgbToOklch(accent);
  const cream = p.L >= 0.9 && p.C >= 0.006 && p.H >= 55 && p.H <= 105;
  const clay = a.C >= 0.08 && a.H >= 15 && a.H <= 55;
  const disp = firstFamily(resolveVars(ctx.tokens['--font-display'] || '', ctx.tokens));
  const hcSerif = /bodoni|didot|didone|playfair|fraunces|instrument serif|cormorant|dm serif|libre caslon display|abril|prata|gloock|newsreader|editorial new|gt sectra|canela|freight|yeseva|rozha|boska|melodrama/i.test(disp);
  const catalogTheme = /theme:\s*(?!custom\b)[A-Z][\w-]*\s*\((?:deal|by request)/.test(ctx.stampText);
  if (cream && clay && hcSerif && !catalogTheme) report(65, 'FAIL', ctx.cssFiles[0]?.file || ctx.docs[0]?.file, 1, `the named look: cream paper (L ${Math.round(p.L * 100)}%, hue ${Math.round(p.H)}) + ${disp} + a clay accent (hue ${Math.round(a.H)})`, 'Move one axis, the accent first; or stamp the theme as asked for by name');
}

function checkF15(ctx) {
  const widths = new Map();
  for (const r of ctx.rules) {
    if (r.keyframes || r.media || !/container|wrap|inner|shell|content|section|page|main/i.test(r.selector)) continue;
    for (const d of r.decls) if (d.prop === 'max-width') { const px = maxPxIn(resolveVars(d.value, ctx.tokens)); if (px && px >= 900) widths.set(px, r.selector); }
  }
  if (widths.size > 1) report('F15', 'WARN', ctx.cssFiles[0]?.file || ctx.docs[0]?.file, 1, `${widths.size} container widths on one page (${[...widths.keys()].join(', ')}px)`, 'One container width, applied by the same two-element pattern in every section');
  const gaps = new Map();
  for (const r of ctx.rules) {
    if (r.keyframes || r.media || /hero|masthead|fold|\b(?:app|ui|demo|sample|screen|product|mock|device|console|editor|window)(?:\b|__|--)|\[data-slot/i.test(r.selector)) continue;
    const cols = r.decls.find((d) => d.prop === 'grid-template-columns' && trackCount(d.value) > 1 && !/^repeat\(\s*auto/.test(d.value.trim()));
    if (!cols) continue;
    const gap = r.decls.find((d) => /^(gap|column-gap)$/.test(d.prop));
    if (gap) { const v = resolveVars(gap.value, ctx.tokens).split(/\s+/).pop(); const px = maxPxIn(v); if (px != null && px >= 24) gaps.set(v, r.selector); }
  }
  if (gaps.size > 2) report('F15', 'WARN', ctx.cssFiles[0]?.file || ctx.docs[0]?.file, 1, `${gaps.size} different column gaps across multi-column sections (${[...gaps.keys()].join(', ')})`, 'One column gap for every multi-column section');
}

function trackCount(v) {
  const t = v.replace(/\[[^\]]*\]/g, ' ').trim();
  const rep = /^repeat\(\s*(\d+)/.exec(t);
  if (rep) return Number(rep[1]);
  let depth = 0, n = 0, inTok = false;
  for (const ch of t) {
    if (ch === '(') depth++;
    else if (ch === ')') depth--;
    if (depth === 0 && /\s/.test(ch)) inTok = false;
    else if (!inTok) { inTok = true; n++; }
  }
  return n;
}

function checkF16(ctx) {
  if (ctx.tokensOnly || !ctx.tokens['--color-accent']) return;
  const tw = twGroup(ctx);
  const missing = [];
  if (!/::selection/.test(ctx.allCss) && !tw.variants.has('selection')) missing.push('::selection');
  if (!/scrollbar-color|::-webkit-scrollbar/.test(ctx.allCss) && !tw.scrollbar) missing.push('scrollbar-color');
  const hasInputs = ctx.docs.some((d) => /<(input|textarea)\b/i.test(d.src));
  if (hasInputs && !/caret-color/.test(ctx.allCss) && !tw.caret) missing.push('caret-color');
  if (missing.length) report('F16', 'WARN', ctx.cssFiles[0]?.file || ctx.docs[0]?.file, 1, `browser surfaces unthemed: ${missing.join(', ')}`, 'Theme the parts you did not draw from the palette');
}

const proseRun = (run, pad) => {
  let r = run;
  for (let k = 0; k < 3 && /\{[^{}]*\}/.test(r); k++) r = r.replace(/\{[^{}]*\}/g, pad);
  return /[;=(){}]|\breturn\b/.test(r) ? pad(r) : r;
};
function maskedProse(doc) {
  if (doc._prose == null) {
    const pad = (m) => m.replace(/[^\n]/g, ' ');
    const src = doc.kind && doc.kind !== 'html' ? doc.src.replace(/(^|>)([^<>]*)(?=<|$)/g, (m0, a, run) => a + proseRun(run, pad)) : doc.src;
    doc._prose = src
      .replace(/<(script|style|pre|code|kbd|samp|textarea)\b[^>]*>[\s\S]*?<\/\1>/gi, pad)
      .replace(/<!--[\s\S]*?-->/g, pad)
      .replace(/<[^>]*>/g, pad);
  }
  return doc._prose;
}

function maxPxIn(value) {
  let best = null;
  for (const m of String(value).matchAll(/(-?\d+(?:\.\d+)?)(px|rem|em)/g)) {
    const px = m[2] === 'px' ? parseFloat(m[1]) : parseFloat(m[1]) * 16;
    if (best == null || px > best) best = px;
  }
  return best;
}

function baseSelector(sel) {
  return sel.replace(/::?[a-z-]+(\([^)]*\))?/gi, '').replace(/\s+/g, ' ').trim();
}

function checkF1(ctx) {
  const dq = /(?:"|&quot;|&#0?34;)(?=[A-Za-z])|[A-Za-z](?:"|&quot;|&#0?34;)/g;
  const ap = /[A-Za-z](?:'|&#0?39;|&apos;)(?=[A-Za-z])/g;
  for (const doc of ctx.docs) {
    const prose = maskedProse(doc);
    const hits = [...prose.matchAll(dq), ...prose.matchAll(ap)].sort((a, b) => a.index - b.index);
    if (!hits.length) continue;
    const around = prose.slice(Math.max(0, hits[0].index - 16), hits[0].index + 16).replace(/\s+/g, ' ').trim();
    report('F1', 'WARN', doc.file, doc.lineOf(hits[0].index),
      `straight quote in prose x${hits.length} (first: ${trunc(around, 40)})`, 'Use typographic quotes: \u201C \u201D \u2019');
  }
}

function checkF2(ctx) {
  for (const doc of ctx.docs) {
    const prose = maskedProse(doc);
    const hits = [...prose.matchAll(/\.{3,}/g)];
    if (!hits.length) continue;
    report('F2', 'WARN', doc.file, doc.lineOf(hits[0].index),
      `three-period ellipsis in prose x${hits.length}`, 'Use a true ellipsis character (\u2026)');
  }
}

function checkF3(ctx) {
  const H12 = /(^|[\s,>+~(])h[12]\b/i;
  const targets = [];
  let satisfied = false;
  for (const r of mergedDeclsBySelector(ctx)) {
    const isH12 = H12.test(r.selector);
    const isDisplayClass = HEADING_SEL.test(r.selector)
      && r.decls.some((d) => d.prop === 'font-size' && (maxPxIn(resolveVars(d.value, ctx.tokens)) ?? 0) >= 40);
    if (!isH12 && !isDisplayClass) continue;
    targets.push(r);
    if (r.decls.some((d) => /^text-wrap(-style)?$/.test(d.prop) && /balance/.test(d.value))) satisfied = true;
  }
  if (targets.length && !satisfied) {
    report('F3', 'WARN', targets[0].file, targets[0].line,
      `no text-wrap: balance on any display head (${targets.length} head rule(s), e.g. ${trunc(targets[0].selector, 32)})`,
      'Add text-wrap: balance to h1/h2-level heads');
  }
}

function checkF4(ctx) {
  const BTN = /\b(btn|button|cta)\b|__(btn|button|cta)\b/i;
  const filled = new Map();
  for (const r of mergedDeclsBySelector(ctx)) {
    if (isTokenRule(r) || /:hover|:active|:focus|:disabled|\.is-|\[disabled/i.test(r.selector)) continue;
    const first = baseSelector(r.selector.split(',')[0]);
    if (!BTN.test(first)) continue;
    for (const d of r.decls) {
      if (!/^background(-color)?$/.test(d.prop)) continue;
      const rv = resolveVars(d.value, ctx.tokens);
      if (/transparent|none/i.test(rv)) continue;
      if (/var\(\s*--color-(?!paper|rule|muted|focus)[\w-]+/.test(d.value) && !filled.has(first)) filled.set(first, { r, d });
    }
  }
  if (filled.size >= 2) {
    const sels = [...filled.keys()];
    const second = filled.get(sels[1]);
    report('F4', 'WARN', second.r.file, second.d.line,
      `${filled.size} filled primary-button recipes: ${trunc(sels.join(' + '), 52)}`,
      'One filled primary per page; demote the rest to outline/quiet variants');
  }
}

function checkF5(ctx) {
  for (const r of mergedDeclsBySelector(ctx)) {
    if (isTokenRule(r) || !/icon|\bico\b/i.test(r.selector)) continue;
    const radius = r.decls.find((d) => d.prop === 'border-radius');
    if (!radius) continue;
    const rv = resolveVars(radius.value, ctx.tokens);
    const pct = /(\d+(?:\.\d+)?)%/.exec(rv);
    const round = (pct && parseFloat(pct[1]) >= 50) || ((maxPxIn(rv) ?? 0) >= 999);
    if (!round) continue;
    const bg = r.decls.find((d) => /^background(-color)?$/.test(d.prop)
      && !/^(none|transparent)$/i.test(resolveVars(d.value, ctx.tokens).trim()));
    if (!bg) continue;
    const small = r.decls.some((d) => (d.prop === 'width' || d.prop === 'height')
      && (pxOf(resolveVars(d.value, ctx.tokens)) ?? 999) <= 64);
    if (small) {
      report('F5', 'WARN', r.file, bg.line, `icon-in-coloured-circle coin: ${trunc(r.selector, 40)}`,
        'Drop the tinted coin; set the icon at text size in currentColor');
    }
  }
}

function checkF6(ctx) {
  const NUM_SEL = /\b(stat(?!ement)|price|table|figure|count|num)[\w-]*/i;
  const hasTnum = (r) => r.decls.some((d) => d.prop === 'font-variant-numeric'
    || (d.prop === 'font-feature-settings' && /tnum/.test(d.value)));
  if (ctx.rules.some((r) => /^(html|body|:root)\b/i.test(r.selector.trim()) && hasTnum(r))) return;
  const bySel = mergedDeclsBySelector(ctx);
  const covered = new Set(bySel.filter(hasTnum).map((r) => baseSelector(r.selector)));
  const warned = new Set();
  for (const r of bySel) {
    if (isTokenRule(r) || !NUM_SEL.test(r.selector)) continue;
    const base = baseSelector(r.selector);
    if (warned.has(base) || covered.has(base)) continue;
    const fs2 = r.decls.find((d) => d.prop === 'font-size');
    if (!fs2 || (maxPxIn(resolveVars(fs2.value, ctx.tokens)) ?? 0) < 24) continue;
    warned.add(base);
    report('F6', 'WARN', r.file, fs2.line,
      `numeric selector ${trunc(base, 36)} at display size without tabular figures`,
      'Add font-variant-numeric: tabular-nums');
  }
}

function checkF7(ctx) {
  const byKey = new Map();
  for (const r of mergedDeclsBySelector(ctx)) {
    if (isTokenRule(r) || /::(before|after)/.test(r.selector)) continue;
    const get = (re) => {
      const d = r.decls.filter((x) => re.test(x.prop)).pop();
      return d ? resolveVars(d.value, ctx.tokens).replace(/\s+/g, ' ').trim() : '';
    };
    const border = get(/^border$/)
      || [get(/^border-width$/), get(/^border-style$/), get(/^border-color$/)].filter(Boolean).join(' ');
    const radius = get(/^border-radius$/);
    const surface = get(/^background(-color)?$/) || '';
    const shadow = get(/^box-shadow$/);
    if (!radius || (!border && !surface && !shadow)) continue;
    const key = [border, radius, surface, shadow].join(' | ');
    if (!byKey.has(key)) byKey.set(key, { sels: new Set(), r });
    for (const part of r.selector.split(',')) byKey.get(key).sels.add(baseSelector(part));
  }
  for (const v of byKey.values()) {
    if (v.sels.size >= 6) {
      report('F7', 'WARN', v.r.file, v.r.line,
        `same container recipe on ${v.sels.size} selectors (${trunc([...v.sels].slice(0, 4).join(', '), 48)}...)`,
        'Vary weight, radius, or fill by role; not every box is the same box');
    }
  }
}

function checkF8(ctx) {
  const famOf = (sel) => {
    const m = /\.([a-z][\w-]*)/i.exec(sel) || /(^|[\s>+~])([a-z][\w-]*)/i.exec(sel);
    const name = m ? (m[1] || m[2]) : sel;
    return name.split('__')[0].split('--')[0].toLowerCase();
  };
  const NAVISH = /^(nav|header|topbar|masthead|banner)$/;
  const timeline = new Map(), sticky = new Map(), animated = new Set();
  for (const r of ctx.rules) {
    if (r.keyframes || isTokenRule(r)) continue;
    for (const d of r.decls) {
      if (d.prop === 'animation-timeline' && !/^(none|auto)$/i.test(d.value.trim())
        && !timeline.has(famOf(r.selector))) timeline.set(famOf(r.selector), { r, d });
      if (d.prop === 'animation' || d.prop === 'animation-name') animated.add(famOf(r.selector));
      if (d.prop === 'position' && /sticky/i.test(d.value)) sticky.set(famOf(r.selector), { r, d });
    }
  }
  const families = new Map(timeline);
  for (const [fam, v] of sticky) {
    if (!families.has(fam) && animated.has(fam) && !NAVISH.test(fam)) families.set(fam, v);
  }
  if (families.size > 1) {
    const names = [...families.keys()];
    const second = families.get(names[1]);
    report('F8', 'WARN', second.r.file, second.d.line,
      `${families.size} scroll-choreography patterns on one page (${trunc(names.join(', '), 44)})`,
      'Budget is one scroll pattern per page (scroll-choreography.md); cut the rest');
  }
}

function checkF9(ctx) {
  const FAKE = /(i\.pravatar\.cc|pravatar\.cc|api\.dicebear\.com|dicebear\.com|randomuser\.me|thispersondoesnotexist\.com|ui-avatars\.com)/i;
  const UNSPLASH = /https?:\/\/[^"'()\s]*unsplash\.com[^"'()\s]*/gi;
  const PERSONY = /person|face|portrait|people|headshot/i;
  const scan = (text, file, lineAt) => {
    const f = FAKE.exec(text);
    if (f) report('F9', 'FAIL', file, lineAt(f.index), `fake-human avatar service ${f[1]}`,
      'Drop the face, or use the real person\'s own photo; a generated stranger is fabricated social proof');
    for (const m of text.matchAll(UNSPLASH)) {
      if (PERSONY.test(m[0])) report('F9', 'WARN', file, lineAt(m.index),
        `stock person-keyword URL ${trunc(m[0], 44)}`,
        'Faces as social proof need real people; a stock face is a stranger');
    }
  };
  for (const doc of ctx.docs) scan(doc.src, doc.file, (i) => doc.lineOf(i));
  for (const c of ctx.cssFiles) scan(c.raw, c.file, (i) => c.raw.slice(0, i).split('\n').length);
}

function fontSizePxOf(r, ctx) {
  const fs = r.decls.find((d) => d.prop === 'font-size');
  if (fs) return pxOf(resolveVars(fs.value, ctx.tokens));
  const f = r.decls.find((d) => d.prop === 'font');
  if (!f) return null;
  const m = /(?:^|\s)(\d+(?:\.\d+)?(?:px|rem|em))(?:\/[\d.]+(?:px|rem|em)?)?\s/.exec(resolveVars(f.value, ctx.tokens) + ' ');
  return m ? pxOf(m[1]) : null;
}

const LABEL67 = /label|caption|meta|eyebrow|kicker|tag\b|badge|chip|small|folio|footnote|legend|\bth\b|thead|figcaption|overline|dateline|byline|credit|note\b|\bnav\b|menu|link|pill|status|unit|smallcaps|count|placard/i;
const CONTROL67 = /btn|button|cta|\.sign\b|plate|control/i;
const EXEMPT67_NAME = /^(wordmark|marquee|ticker|logo|brand|abbr|logo-?(mark|type|text)|brand-?(mark|name|type))$/i;
const EXEMPT67_PART = /(^|[-_])(wordmark|marquee|ticker|logotype|logo|brand)([-_]|$)|(^|[-_])(slab|nav|site|head|header|masthead|bar)[-_]+mark([-_]|$)/i;
const exemptName67 = (n) => !!n && (EXEMPT67_NAME.test(n.split('--')[0].split('__').pop()) || EXEMPT67_PART.test(n));
const SCROLLER67 = /(^|[-_])(marquee|ticker)([-_]|$)/i;
function exempt67(sel) {
  return sel.split(',').some((part) => {
    const comps = baseSelector(part).split(/[\s>+~]+/).filter(Boolean);
    const comp = comps[comps.length - 1] || '';
    const names = (comp.match(/\.[a-zA-Z_][\w-]*/g) || []).map((c) => c.slice(1));
    names.push((/^[a-zA-Z][\w-]*/.exec(comp) || [''])[0]);
    if (names.some(exemptName67)) return true;
    return comps.slice(0, -1).some((c) => (c.match(/\.[a-zA-Z_][\w-]*/g) || []).some((x) => SCROLLER67.test(x.slice(1))));
  });
}
function inherited67(bySel, sel, prop) {
  const base = baseSelector(sel);
  let best = null, bestLen = 0;
  for (const o of bySel) {
    if (/:hover|:focus|:active/.test(o.selector) || (o.media && /max-width/i.test(o.media))) continue;
    for (const part of o.selector.split(',')) {
      const ob = baseSelector(part);
      if (!ob || ob === base || ob.length <= bestLen || !base.startsWith(ob) || !/[\s>+~]/.test(base[ob.length] || '')) continue;
      const d = o.decls.filter((x) => x.prop === prop).pop();
      if (d) { best = d.value; bestLen = ob.length; }
    }
  }
  return best;
}
const isSmallCaps67 = (prop, v) => (/^font-variant(-caps)?$/.test(prop) && /\b(all-)?(small|petite)-caps\b/.test(v))
  || (prop === 'font-feature-settings' && /\b(smcp|c2sc)\b/.test(v));
function check67(ctx) {
  const bySel = mergedDeclsBySelector(ctx);
  const displayish = (r) => HEADING_SEL.test(r.selector) || /display|title|headline|bill|poster|banner/i.test(r.selector) || r.decls.some((d) => (d.prop === 'font-family' || d.prop === 'font') && /--font-display/.test(d.value)) || (fontSizePxOf(r, ctx) || 0) >= 28;
  const upperDisplay = bySel.some((r) => displayish(r) && !LABEL67.test(r.selector) && r.decls.some((d) => d.prop === 'text-transform' && /uppercase/.test(d.value)));
  const isUpper = (v) => v != null && /uppercase/.test(resolveVars(v, ctx.tokens));
  const seen = new Set();
  for (const r of bySel) {
    if (isTokenRule(r) || exempt67(r.selector) || /::first-letter\s*(,|$)/.test(r.selector)) continue;
    const ownTT = r.decls.filter((d) => d.prop === 'text-transform').pop();
    const ownUpper = ownTT ? isUpper(ownTT.value) : null;
    const ownSmallCaps = r.decls.some((d) => isSmallCaps67(d.prop, resolveVars(d.value, ctx.tokens)));
    const px = fontSizePxOf(r, ctx);
    const ownEm = trackingEmOf(ctx, r.decls, px || 16);
    const ownSignal = ownUpper === true || ownSmallCaps || (ownEm != null && ownEm > 0.03);
    if (!ownSignal) continue;
    const upper = ownUpper != null ? ownUpper : isUpper(inherited67(bySel, r.selector, 'text-transform'));
    const smallCaps = ownSmallCaps || ['font-variant', 'font-variant-caps', 'font-feature-settings'].some((prop) => {
      const v = inherited67(bySel, r.selector, prop);
      return v != null && isSmallCaps67(prop, resolveVars(v, ctx.tokens));
    });
    let em = ownEm;
    if (em == null) {
      const v = inherited67(bySel, r.selector, 'letter-spacing');
      if (v != null) em = trackingEmOf(ctx, [{ prop: 'letter-spacing', value: v }], px || 16);
    }
    const tracked = em != null && em > 0.03;
    const subject = r.selector.split(',').map((p) => baseSelector(p).split(/[\s>+~]+/).filter(Boolean).pop() || '');
    const bigToken = r.decls.some((d) => d.prop === 'font-size' && /--text-(display|section|title)|clamp\(\s*(?:[2-9]|\d{2,})(?:\.\d+)?rem/.test(d.value));
    const labelish = subject.some((s) => LABEL67.test(s)) ? !((px != null && px >= 28) || bigToken)
      : LABEL67.test(r.selector) && !subject.every((s) => /^h[1-6]\b/i.test(s)) && (px == null || px < 20);
    const control = CONTROL67.test(r.selector);
    const heading = HEADING_SEL.test(r.selector) && !labelish;
    if (heading && !control) continue;
    const key = baseSelector(r.selector);
    if (seen.has(key)) continue;
    const small = px != null && px <= 15;
    if (control && !labelish) {
      if (!upper && !smallCaps) { if (!(tracked && small)) continue; }
      else if (upperDisplay && (em == null || em <= 0.045)) continue;
      seen.add(key);
      report(67, 'FAIL', r.file, r.line, upperDisplay ? `${r.selector}: uppercase control tracked ${em}em` : `${r.selector}: uppercase control on a page whose display is not uppercase`, 'Controls follow the display voice: sentence case here, or tracking 0.04em at most where the display itself is uppercase');
      continue;
    }
    const caps = upper || smallCaps;
    if ((caps && (labelish || smallCaps || tracked || small)) || (tracked && (labelish || small))) {
      seen.add(key);
      const what = smallCaps ? 'small caps' : upper ? 'uppercase' : 'letter-spaced';
      report(67, 'FAIL', r.file, r.line, `${r.selector}: ${what}${tracked ? ` tracked ${em}em` : ''}${px != null ? ` at ${Math.round(px)}px` : ''} in a label role`, 'Labels, captions, table heads, nav links and meta are the body face (or the theme\'s label face), a step smaller, sentence case, untracked');
    }
  }
  check67Html(ctx);
}

const CAPS_TAGS = /^(p|span|small|a|li|div|figcaption|td|th|dt|dd|label|time|cite|strong|b|em|button|summary)$/;
function check67Html(ctx) {
  for (const doc of ctx.docs) {
    const anc = ancestorMap(doc);
    const seen = new Set();
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || t.selfClosing || !CAPS_TAGS.test(t.name)) continue;
      const cls = getAttr(t.attrs, 'class') || '';
      if (cls.split(/\s+/).some(exemptName67)) continue;
      if ((anc.get(i) || []).some((n) => /^(svg|pre|code|abbr|kbd|samp)$/.test(n))) continue;
      const inner = innerOf(doc, i);
      if (!inner || /<(p|div|ul|ol|h[1-6]|table|section|article|svg|img|abbr|code|kbd)\b/i.test(inner.inner)) continue;
      const text = plainText(inner.inner);
      const letters = text.replace(/[^A-Za-z]/g, '');
      if (letters.length < 5 || capsRatio(text) < 0.95 || /^[A-Z]{2,5}$/.test(text) || /^\(?\s*(CC0|CC BY(-SA|-NC|-ND)*( [0-9.]+)?|PD|GFDL)\b/.test(text)) continue;
      const decls = styleFor(ctx, cls, t.name);
      const px = fontPxOf(ctx, decls);
      const em = trackingEmOf(ctx, decls, px || 16);
      const tracked = em != null && em > 0.03;
      if (!((px != null && px <= 15) || tracked)) continue;
      const key = cls || t.name;
      if (seen.has(key)) continue;
      seen.add(key);
      report(67, 'FAIL', doc.file, t.line, `"${trunc(text, 32)}" typed in capitals${px != null ? ` at ${Math.round(px)}px` : ''}${tracked ? ` tracked ${em}em` : ''} (<${t.name}${cls ? ` class="${trunc(cls, 24)}"` : ''}>)`, 'Sentence case in the body face; capitals survive only as a wordmark or as the display voice');
    }
  }
}

const ACCENT38 = /(?:^|[\s,])((?:h[1-3]|\.display|\.headline|\.title|[.\w-]*__(?:title|display|headline))[^\s,>+~]*)\s*(?:>|\s)\s*(em|i|b|strong|span|mark|\.[\w-]+)(?::nth-child\([^)]*\))?(?:::?[\w-]+)?\s*$/i;
const INHERITED38 = /^(inherit|currentcolor|unset|initial|normal)$/i;
function accentedHeads(ctx) {
  if (ctx._acc38) return ctx._acc38;
  const out = [];
  const seen = new Set();
  for (const r of ctx.rules) {
    if (r.keyframes || isTokenRule(r)) continue;
    const m = ACCENT38.exec(r.selector);
    if (!m) continue;
    const marked = r.decls.some((d) =>
      (/^(color|background|background-color|-webkit-text-stroke|font-weight|text-decoration|text-decoration-color|border-bottom|box-shadow)$/.test(d.prop) && !INHERITED38.test(d.value.trim()))
      || (d.prop === 'font-style' && !INHERITED38.test(d.value.trim())));
    if (!marked || seen.has(r.selector)) continue;
    seen.add(r.selector);
    out.push({ r, head: m[1] });
  }
  const marks = (r) => r.decls.some((d) => (/^(color|background|background-color|-webkit-text-stroke|font-weight|text-decoration|text-decoration-color|border-bottom|box-shadow|font-style)$/.test(d.prop) && !INHERITED38.test(d.value.trim())));
  for (const doc of ctx.docs) {
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || !/^h[1-3]$/.test(t.name)) continue;
      const inner = innerOf(doc, i);
      if (!inner) continue;
      const headLen = plainText(inner.inner).replace(/\s+/g, '').length || 1;
      const spans = [...inner.inner.matchAll(/<(span|em|strong|b|i|mark)\b[^>]*\bclass\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/\1>/gi)];
      const cover = (cls) => spans.filter((x) => x[2].split(/\s+/).includes(cls)).reduce((n, x) => n + plainText(x[3]).replace(/\s+/g, '').length, 0) / headLen;
      for (const m of spans) {
        if (!/[A-Za-z0-9]/.test(plainText(m[3]))) continue;
        for (const cls of m[2].split(/\s+/).filter(Boolean)) {
          if (cover(cls) >= 0.8) continue;
          for (const r of ctx.rules) {
            if (r.keyframes || isTokenRule(r) || seen.has(r.selector)) continue;
            if (!r.selector.split(',').some((part) => !/::?(before|after)\b/.test(part) && baseSelector(part).trim() === `.${cls}`)) continue;
            if (r.decls.some((d) => (d.prop === 'display' && /^(block|flex|grid|table)/.test(d.value.trim())) || (d.prop === 'position' && /absolute|fixed/.test(d.value)))) continue;
            if (!marks(r)) continue;
            const headDecls = styleFor(ctx, getAttr(t.attrs, 'class'), t.name, true);
            const norm = (v) => String(v || '').replace(/\s+/g, ' ').trim().toLowerCase();
            const own = (prop) => declValue(ctx, headDecls, prop) ?? (prop === 'color' ? resolveVars('var(--color-ink)', ctx.tokens) : null);
            const marking = r.decls.filter((d) => /^(color|background|background-color|-webkit-text-stroke|font-weight|text-decoration|text-decoration-color|border-bottom|box-shadow|font-style)$/.test(d.prop) && !INHERITED38.test(d.value.trim()));
            if (marking.length && marking.every((d) => /^(color|font-weight)$/.test(d.prop) && own(d.prop) != null && norm(resolveVars(d.value, ctx.tokens)) === norm(own(d.prop)))) continue;
            seen.add(r.selector);
            out.push({ r, head: t.name });
          }
        }
      }
    }
  }
  ctx._acc38 = out;
  return out;
}
function accentedWordInHero(ctx) {
  const heads = accentedHeads(ctx);
  if (!heads.length) return true;
  const sels = new Set(heads.map((h) => baseSelector(h.r.selector)));
  if (sels.size > 1) return `the accented word sits on ${sels.size} selectors (${trunc([...sels].join(', '), 48)}); the signature appears once`;
  const { r, head } = heads[0];
  if (/hero/i.test(r.selector) || /^h1\b/i.test(head)) return true;
  const cls = (/\.([\w-]+)/.exec(head) || [])[1];
  if (!cls || !ctx.docs.length) return true;
  let count = 0, aboveFirstH2 = false;
  for (const doc of ctx.docs) {
    let h2Seen = false;
    for (const t of doc.tags) {
      if (t.close) continue;
      if (t.name === 'h2') h2Seen = true;
      if ((getAttr(t.attrs, 'class') || '').split(/\s+/).includes(cls)) { count++; if (!h2Seen) aboveFirstH2 = true; }
    }
  }
  if (count === 1 && aboveFirstH2) return true;
  return count !== 1 ? `.${cls} appears ${count} times in the markup; the signature appears once, in the hero` : `.${cls} sits below the first h2, outside the hero`;
}
function check38c(ctx) {
  for (const { r } of accentedHeads(ctx)) {
    report('38iii', 'FAIL', r.file, r.line, `accented word inside a heading (${r.selector})`, 'Set the whole head one way: a line break, a second line at a second size, or the whole head in the accent. Guard: the theme names the coloured word as its signature and it appears once on the page, in the hero');
  }
}

function heroIndexOf(doc, h1Idx) {
  for (let i = h1Idx - 1; i >= 0; i--) {
    const t = doc.tags[i];
    if (t.close || !/^(section|header)$/.test(t.name)) continue;
    const inner = innerOf(doc, i);
    if (inner && inner.endPos > doc.tags[h1Idx].pos) return i;
  }
  return -1;
}
const wordsOf = (t) => plainText(t).split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w));

const TELLS19 = [
  [/\bwhether you'?re\b/i, 'filler opener'],
  [/\bwe'?ve got you covered\b/i, 'cliche'],
  [/\bsay goodbye to\b/i, 'cliche'],
  [/\bno credit card required\b/i, 'template line'],
  [/\beverything you need to\b/i, 'cliche'],
  [/\ball in one place\b/i, 'cliche'],
  [/\blorem ipsum\b/i, 'placeholder text'],
  [/\ball rights reserved\b/i, 'template footer line'],
  [/\bmade with\s*(?:♥|❤|\u{1f9e1}|\u{1f49b}|\u{1f49a}|\u{1f499}|\u{1f49c}|\u{1f5a4}|\u{1f90d}|&hearts;|&#9829;|&#10084;|<3)/iu, 'made with a heart'],
];
function check19Tells(ctx) {
  for (const doc of ctx.docs) {
    const prose = maskedProse(doc);
    const lines = new Set();
    const tell = (idx, what, text) => {
      const line = doc.lineOf(idx);
      if (lines.has(line)) return;
      lines.add(line);
      report(19, what === 'template footer line' ? 'WARN' : 'FAIL', doc.file, line, `${what}: "${trunc(text, 40)}"`, what === 'template footer line' ? 'A stock line with no legal effect; cut it unless the owner wants it' : 'Say what the product does, in its own nouns');
    };
    for (const [re, what] of TELLS19) {
      const m = re.exec(prose);
      if (m) tell(m.index, what, m[0]);
    }
    const stock = [];
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || t.name !== 'a') continue;
      const label = plainText(innerOf(doc, i)?.inner || '').replace(/[\u2192\u203a\u00bb]|->/g, '').trim();
      if (/^(learn more|read more|find out more|click here|more info|see more)$/i.test(label)) stock.push({ t, label });
    }
    if (stock.length >= 2) report(19, 'WARN', doc.file, stock[0].t.line, `stock link label "${stock[0].label}" x${stock.length}`, 'Say where each link goes: the thing it opens, in its own noun');
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || !/^h[1-6]$/.test(t.name)) continue;
      const text = plainText(innerOf(doc, i)?.inner || '');
      if (/^Meet\s+[A-Z][\w-]*[.!]?$/.test(text)) tell(t.pos, 'the "Meet <Name>" heading', text);
      else if (/^[A-Z][a-z]+\.\s+[A-Z][a-z]+\.\s+[A-Z][a-z]+\.$/.test(text)) tell(t.pos, 'the three-word triad heading', text);
    }
  }
}

function check58Static(ctx) {
  for (const doc of ctx.docs) {
    const h1 = doc.tags.findIndex((t) => !t.close && t.name === 'h1');
    if (h1 >= 0) {
      const words = wordsOf(innerOf(doc, h1)?.inner || '');
      if (words.length > 7) report(58, 'WARN', doc.file, doc.tags[h1].line, `h1 runs ${words.length} words ("${trunc(words.join(' '), 40)}")`, 'Seven words or fewer, 50 characters or fewer');
      const heroIdx = heroIndexOf(doc, h1);
      const hero = heroIdx >= 0 ? innerOf(doc, heroIdx) : null;
      if (hero) {
        for (let i = h1 + 1; i < doc.tags.length && doc.tags[i].pos < hero.endPos; i++) {
          const t = doc.tags[i];
          if (t.close || t.name !== 'p') continue;
          const pw = wordsOf(innerOf(doc, i)?.inner || '');
          if (pw.length > 12) report(58, 'WARN', doc.file, t.line, `hero paragraph runs ${pw.length} words`, 'One sentence, twelve words or fewer');
          break;
        }
      }
    }
    const sections = doc.tags.filter((t) => !t.close && t.name === 'section').length;
    const fullPage = sections >= 5 || doc.tags.some((t) => !t.close && t.name === 'footer');
    if (!fullPage || doc.kind !== 'html') continue;
    const countWords = (t) => t.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
    let hiddenWords = 0, hiddenEnd = -1;
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || t.selfClosing || t.pos < hiddenEnd) continue;
      const cls = getAttr(t.attrs, 'class') || '';
      if (!(/(^|\s)(sr-only|visually-hidden|screen-reader-text|skip|skip-link)(\s|$)/i.test(cls) || /aria-hidden\s*=\s*["']?true/i.test(t.attrs) || /(^|\s)hidden(\s|=|$)/i.test(t.attrs) || /(^|\s)data-credits(\s|=|$)/i.test(t.attrs))) continue;
      const inner = innerOf(doc, i);
      if (!inner) continue;
      hiddenWords += countWords(plainText(inner.inner));
      hiddenEnd = inner.endPos;
    }
    const total = countWords(doc.text) - hiddenWords;
    if (total > 450) report(58, 'WARN', doc.file, 1, `${total} visible words on the page (450 at most)`, 'Cut copy: one idea per screen, sections become objects');
  }
}

const SECOND_CTA = /^(learn more|see how it works|watch (the )?demo|get started|book a demo)$/i;
function check42TwoButton(ctx) {
  for (const doc of ctx.docs) {
    const h1 = doc.tags.findIndex((t) => !t.close && t.name === 'h1');
    if (h1 < 0) continue;
    const heroIdx = heroIndexOf(doc, h1);
    const hero = heroIdx >= 0 ? innerOf(doc, heroIdx) : null;
    if (!hero) continue;
    const anc = ancestorMap(doc);
    const controls = [];
    for (let i = heroIdx + 1; i < doc.tags.length && doc.tags[i].pos < hero.endPos; i++) {
      const t = doc.tags[i];
      if (t.close || t.selfClosing || !(t.name === 'button' || t.name === 'a')) continue;
      const cls = getAttr(t.attrs, 'class') || '';
      if (t.name === 'a' && !/btn|cta|button/i.test(cls)) continue;
      if ((anc.get(i) || []).includes('nav')) continue;
      controls.push({ t, cls, label: plainText(innerOf(doc, i)?.inner || '').trim() });
    }
    if (controls.length < 2) continue;
    const fillOf = (c) => { const decls = styleFor(ctx, c.cls, c.t.name, true); let raw = null; for (const d of decls) if (d.prop === 'background-color' || d.prop === 'background') raw = d.value; if (!raw || /--color-paper\b/.test(raw)) return false; const bg = resolveVars(raw, ctx.tokens); return !/^(none|transparent|inherit|initial|unset)$/i.test(bg.trim()) && !/transparent/i.test(bg) && !/var\(--color-paper/.test(raw); };
    const firstFilled = fillOf(controls[0]);
    if (firstFilled && fillOf(controls[1])) { report('F4', 'WARN', doc.file, controls[1].t.line, `two filled buttons side by side in the hero: "${trunc(controls[0].label, 20)}" and "${trunc(controls[1].label, 20)}"`, 'One filled primary per screen; the second action is outlined or a typographic link'); continue; }
    if (!SECOND_CTA.test(controls[1].label) || !firstFilled) continue;
    report(19, 'WARN', doc.file, controls[1].t.line, `the stock second action in the hero: "${trunc(controls[0].label, 20)}" then "${controls[1].label}"`, 'One action in the hero; the second button is the template speaking');
  }
}

const PLACEHOLDER_IMG = /placehold\.co|via\.placeholder\.com|source\.unsplash\.com\/random|dummyimage\.com/i;
function check68(ctx) {
  for (const doc of ctx.docs) {
    if (doc.kind !== 'html') continue;
    const slots = [];
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || !/\bdata-slot\s*=/.test(t.attrs)) continue;
      const inner = t.selfClosing ? null : innerOf(doc, i);
      if (inner && /<img\b[^>]*\bsrc\s*=\s*["'][^"']+["']/i.test(inner.inner)) continue;
      if (inner && (inner.inner.match(/<[a-z][\w-]*\b[^>]*>\s*[^<\s]/gi) || []).length >= 6) continue;
      let hiddenUp = false;
      for (let k = i - 1, d = 0; k >= 0 && !hiddenUp; k--) { const u = doc.tags[k]; if (u.selfClosing) continue; if (u.close) { d++; continue; } if (d > 0) { d--; continue; } if (/(?:^|\s)hidden(?:\s|=|$)/.test(u.attrs)) hiddenUp = true; }
      if (hiddenUp) continue;
      slots.push({ i, t });
    }
    if (slots.length && !ctx.docs.some((d) => d.kind !== 'html') && !/hallmarkSlots/.test(doc.src) && !ctx.docs.some((d) => d !== doc && /hallmarkSlots/.test(d.src))) report('F18', 'WARN', doc.file, slots[0].t.line, `${slots.length} slot${slots.length > 1 ? 's' : ''} and no slot script`, 'Paste the hallmarkSlots script the scaffold printed before </body>, so the user\'s images drop in (imagery.md § 3)');
    if (slots.length > 5) report(68, 'FAIL', doc.file, slots[5].t.line, `${slots.length} empty slots on one page`, 'Two to four slots carry a page; set the rest in type, names and facts in a list or table');
    const byRun = new Map();
    for (const sl of slots) {
      let depth = 0, parentIdx = -1;
      for (let k = sl.i - 1; k >= 0; k--) { const t = doc.tags[k]; if (t.selfClosing) continue; if (t.close) depth++; else if (depth === 0) { parentIdx = k; break; } else depth--; }
      const up = (from) => { let d = 0; for (let k = from - 1; k >= 0; k--) { const t = doc.tags[k]; if (t.selfClosing) continue; if (t.close) d++; else if (d === 0) return k; else d--; } return -1; };
      const gp = parentIdx >= 0 ? up(parentIdx) : -1;
      const ggp = gp >= 0 ? up(gp) : -1;
      for (const key of new Set([parentIdx, gp, ggp])) { if (key < 0) continue; byRun.set(key, (byRun.get(key) || 0) + 1); }
    }
    for (const [key, n] of byRun) if (n >= 4) { report(68, 'FAIL', doc.file, doc.tags[key].line, `${n} empty slots in one row or grid`, 'A set the page has no pictures of is set in type with one slot at most'); break; }
  }
}

const FACT69 = /(?:[£$€¥]\s?\d[\d,.]*|\d[\d,.]*\s?(?:pm|am|MAD|kg|g|ml|km|mi|miles|%)\b|\b\d{1,2}:\d{2}\b)/gi;
const REGION69 = /^(section|header|footer|article|aside|nav|form|dialog)$/;
function check69(ctx) {
  for (const doc of ctx.docs) {
    if (doc.kind !== 'html') continue;
    const bodyAt = doc.tags.findIndex((t) => !t.close && t.name === 'body');
    const stack = [];
    const seen = new Map();
    let uid = 0;
    const regionOf = () => {
      const r = stack.find((e) => REGION69.test(e.name));
      if (r) return r.id;
      const band = stack.find((e, i) => i > 0 && (stack[i - 1].name === 'body' || stack[i - 1].name === 'main') && e.name !== 'main');
      return band ? band.id : 'root';
    };
    for (let i = Math.max(bodyAt, 0); i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close) { const at = stack.map((e) => e.name).lastIndexOf(t.name); if (at >= 0) stack.length = at; }
      else if (!t.selfClosing) stack.push({ name: t.name, id: uid++ });
      const next = doc.tags[i + 1];
      if (/^(script|style|template|noscript)$/.test(t.name) && !t.close) continue;
      const chunk = doc.masked.slice(t.end, next ? next.pos : doc.masked.length)
        .replace(/&pound;/g, '£').replace(/&euro;/g, '€').replace(/&nbsp;|&#160;/g, ' ');
      if (!chunk.trim()) continue;
      const region = regionOf();
      for (const f of chunk.match(FACT69) || []) {
        const k = f.replace(/\s+/g, '').toLowerCase();
        if (!seen.has(k)) seen.set(k, new Set());
        seen.get(k).add(region);
      }
    }
    const loud = [...seen].map(([k, s]) => [k, s.size]).filter(([, n]) => n >= 4).sort((a, b) => b[1] - a[1]);
    if (loud.length) report(69, 'WARN', doc.file, 1, `the same fact printed in ${loud[0][1]} sections: ${loud.slice(0, 3).map(([k, n]) => `${k} (${n})`).join(', ')}`, 'Say each fact once, where it does work; cut the restatements');
  }
}

function check70(ctx) {
  const SUCCESS = /\b(sent|thanks|thank you|reserved|booked|on the list|subscribed|in touch|received|confirmed|ordered|chosen|on its way|signed up|all set|you're in|you are in|done)\b/i;
  const NEG = /\b(not|nothing|no|never|isn't|wasn't|didn't|cannot|can't|failed|try again|soon)\b/i;
  for (const doc of ctx.docs) {
    const js = (doc.scripts && typeof doc.scripts === 'string') ? doc.scripts : (doc.src.match(/<script\b[^>]*>([\s\S]*?)<\/script>/gi) || []).join('\n');
    if (!/<form\b|type\s*=\s*["']submit/i.test(doc.src) || !js) continue;
    let m = null;
    for (const x of js.matchAll(/(["'`])((?:(?!\1)[^\\\n]|\\.){4,140})\1/g)) {
      const str = x[2];
      const head = str.trim().split(/\s+/).slice(0, 4).join(' ');
      if (str.trim().split(/\s+/).length >= 2 && SUCCESS.test(head) && !NEG.test(str)) { m = [x[0]]; break; }
    }
    if (!m) continue;
    if (/\bfetch\s*\(|XMLHttpRequest|navigator\.sendBeacon|\.submit\s*\(\s*\)|axios|\$\.ajax/.test(js)) continue;
    report(70, 'WARN', doc.file, doc.lineOf ? doc.lineOf(doc.src.indexOf(m[0]) >= 0 ? doc.src.indexOf(m[0]) : 0) : 1, `a script prints success ("${trunc(m[0].replace(/["'`]/g, ''), 30)}") with no request behind it`, 'No success state until the form posts somewhere; an empty data-endpoint and a handoff note');
  }
}

function check47Placeholders(ctx) {
  for (const doc of ctx.docs) {
    const m = PLACEHOLDER_IMG.exec(doc.src);
    if (m) report('47c', 'WARN', doc.file, doc.lineOf(m.index), `placeholder image service ${m[0]}`, 'A labelled data-slot in the theme colours, or a real asset');
  }
  for (const c of ctx.cssFiles) {
    const m = PLACEHOLDER_IMG.exec(c.raw);
    if (m) report('47c', 'WARN', c.file, c.raw.slice(0, m.index).split('\n').length, `placeholder image service ${m[0]}`, 'A labelled data-slot in the theme colours, or a real asset');
  }
}

const TAILWIND_HEX = /#(0f172a|1e293b|6366f1|8b5cf6|3b82f6|f8fafc|64748b)\b/i;
function check65Tailwind(ctx) {
  for (const r of ctx.rules) {
    if (!isTokenRule(r) || r.selector === '@font-face') continue;
    for (const d of r.decls) {
      const m = TAILWIND_HEX.exec(d.value);
      if (m) report(74, 'WARN', r.file, d.line, `default Tailwind palette ${m[0]} on ${d.prop}`, 'Mix the colour for this page in OKLCH; a stock swatch is the AI look');
    }
  }
}

function splitTop(v) {
  const out = [];
  let depth = 0, cur = '';
  for (const ch of v) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur);
  return out;
}
const COLOR_RE = /#[0-9a-fA-F]{3,8}\b|oklch\([^)]*\)|rgba?\([^)]*\)|hsla?\([^)]*\)|color-mix\((?:[^()]|\([^()]*\))*\)|\b(white|black|transparent)\b/i;
const lengthPx = (x) => (x === '0' ? 0 : pxOf(x));
function check29Glow(ctx) {
  const seen = new Set();
  const once = (key, file, line, ev, fix) => { if (seen.has(key)) return; seen.add(key); report(29, 'WARN', file, line, ev, fix); };
  for (const r of mergedDeclsBySelector(ctx)) {
    if (isTokenRule(r)) continue;
    const local = {};
    for (const d of r.decls) if (d.prop.startsWith('--')) local[d.prop] = d.value;
    const bf = r.decls.find((d) => /^(-webkit-)?backdrop-filter$/.test(d.prop) && /blur\(/i.test(d.value));
    if (bf) {
      const bgD = r.decls.filter((d) => /^background(-color)?$/.test(d.prop)).pop();
      const rv = bgD ? resolveVars(bgD.value, ctx.tokens, local).trim() : '';
      const c = parseColor(rv);
      const mixed = /color-mix\([^)]*\b(white|black|--color-(paper|ink))\b[^)]*\btransparent\b/i.test(rv);
      const nearWhite = c && c.r > 0.85 && c.g > 0.85 && c.b > 0.85;
      const nearBlack = c && c.r < 0.15 && c.g < 0.15 && c.b < 0.15;
      if ((c && c.alpha < 0.95 && (nearWhite || nearBlack)) || (!c && mixed)) {
        once('glass:' + r.selector, r.file, bf.line, `glass panel: backdrop-filter blur over a translucent ${nearBlack ? 'black' : 'white'} on ${trunc(r.selector, 36)}`, 'Solid or grained surface; elevation by lightness');
      }
    }
    for (const d of r.decls) {
      if (d.prop !== 'box-shadow') continue;
      for (const part of splitTop(resolveVars(d.value, ctx.tokens, local))) {
        const cm = COLOR_RE.exec(part);
        if (!cm) continue;
        const c = parseColor(cm[0]);
        if (!c || c.alpha <= 0.05) continue;
        const ok = c.okl || srgbToOklch(c);
        if (ok.C <= 0.04) continue;
        const lens = part.replace(cm[0], ' ').replace(/\binset\b/, ' ').trim().split(/\s+/).filter(Boolean).map(lengthPx);
        if (lens.length >= 3 && lens[0] === 0 && lens[1] === 0 && lens[2] != null && lens[2] > 20) {
          once('glow:' + r.selector, r.file, d.line, `chromatic zero-offset glow (blur ${Math.round(lens[2])}px) on ${trunc(r.selector, 36)}`, 'Shadows carry offset and blur in a neutral; colour is not depth');
          break;
        }
      }
    }
    if (/::(before|after)/.test(r.selector) && r.decls.some((d) => d.prop === 'position' && /absolute|fixed/.test(d.value))) {
      const f = r.decls.find((d) => d.prop === 'filter' && /blur\(\s*(\d+(?:\.\d+)?)px/i.test(d.value));
      const n = f ? parseFloat(/blur\(\s*(\d+(?:\.\d+)?)px/i.exec(f.value)[1]) : 0;
      if (n > 40) once('orb:' + r.selector, r.file, f.line, `blurred orb: filter blur(${n}px) on the positioned ${trunc(r.selector, 36)}`, 'Delete the wash; a surface is paper or ground, not a light show');
    }
  }
}

function check11Lift(ctx) {
  const lifts = new Map();
  for (const r of mergedDeclsBySelector(ctx)) {
    if (!/:hover/.test(r.selector)) continue;
    const t = r.decls.find((d) => (d.prop === 'transform' && /translateY\(\s*-\s*\d/.test(resolveVars(d.value, ctx.tokens))) || (d.prop === 'translate' && /^0(px)?\s+-\d/.test(resolveVars(d.value, ctx.tokens))));
    const sh = r.decls.find((d) => d.prop === 'box-shadow');
    if (t && sh) for (const part of r.selector.split(',')) lifts.set(baseSelector(part), { r, t });
  }
  if (lifts.size < 3) return;
  const third = [...lifts.values()][2];
  report(11, 'WARN', third.r.file, third.t.line, `the hover lift (translateY plus shadow) on ${lifts.size} selectors (${trunc([...lifts.keys()].slice(0, 3).join(', '), 44)})`, 'One signal per element; the same lift on every card is the template');
}

function check15Fade(ctx) {
  const focusProps = new Map();
  for (const r of ctx.rules) {
    if (!/:focus-visible/.test(r.selector)) continue;
    for (const part of r.selector.split(',')) {
      if (!/:focus-visible/.test(part)) continue;
      const base = baseSelector(part).replace(/^\*$/, '');
      const set = focusProps.get(base) || new Set();
      for (const d of r.decls) {
        if (d.prop === 'box-shadow') set.add('box-shadow');
        if (/^outline/.test(d.prop)) set.add('outline');
      }
      focusProps.set(base, set);
    }
  }
  if (!focusProps.size) return;
  const global = focusProps.get('') || new Set();
  for (const r of ctx.rules) {
    if (r.keyframes || /:focus|:hover|:active/.test(r.selector)) continue;
    for (const d of r.decls) {
      if (d.prop !== 'transition' && d.prop !== 'transition-property') continue;
      for (const prop of ['box-shadow', 'outline']) {
        if (!new RegExp(`(^|[\\s,])${prop}(-[a-z]+)?\\b`).test(d.value)) continue;
        const own = r.selector.split(',').some((p) => (focusProps.get(baseSelector(p)) || new Set()).has(prop));
        if (global.has(prop) || own) {
          report(15, 'FAIL', r.file, d.line, `${trunc(r.selector, 32)} transitions ${prop} while :focus-visible sets it (the ring fades in)`, 'Rings appear instantly: transition the hover property only, or draw the ring with a property that is not transitioned');
          break;
        }
      }
    }
  }
}

function checkF7Pills(ctx) {
  const CONTROLISH = /btn|button|cta|input|select|textarea|switch|toggle|control|chip|pill|tag|badge|status/i;
  const sels = new Set();
  let where = null;
  for (const r of mergedDeclsBySelector(ctx)) {
    if (isTokenRule(r)) continue;
    const d = r.decls.filter((x) => x.prop === 'border-radius').pop();
    if (!d) continue;
    if (!/^(9999px|999px|50rem)$/.test(resolveVars(d.value, ctx.tokens).trim())) continue;
    for (const part of r.selector.split(',')) {
      const b = baseSelector(part);
      if (!b || CONTROLISH.test(b)) continue;
      sels.add(b);
      where = where || { r, d };
    }
  }
  if (sels.size >= 5) report('F7', 'WARN', where.r.file, where.d.line, `the pill radius on ${sels.size} non-control selectors (${trunc([...sels].slice(0, 4).join(', '), 48)})`, 'Pills are for controls; boxes and media take the card radius');
}

const TW_SIZE = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20, '2xl': 24, '3xl': 30, '4xl': 36, '5xl': 48, '6xl': 60, '7xl': 72, '8xl': 96, '9xl': 128 };
const TW_TRACK = { tighter: -0.05, tight: -0.025, normal: 0, wide: 0.025, wider: 0.05, widest: 0.1 };
const TW_HUE = { red: 25, orange: 47, amber: 70, yellow: 86, lime: 131, green: 150, emerald: 163, teal: 183, cyan: 215, sky: 237, blue: 260, indigo: 277, violet: 293, purple: 304, fuchsia: 322, pink: 354, rose: 16 };
const TW_COLOURS = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const TW_PAL = new RegExp(`^(?:bg|text|border(?:-[xytrblse])?|ring(?:-offset)?|outline|decoration|divide|from|via|to|fill|stroke|shadow|accent|caret|placeholder|inset-shadow|inset-ring|drop-shadow)-(?:${TW_COLOURS})-(?:50|[1-9]00|950)(?:\\/(?:\\d{1,3}|\\[[^\\]]*\\]))?$`);
const TW_SHADE = new RegExp(`^(${TW_COLOURS})-(?:50|[1-9]00|950)(?:\\/\\S*)?$`);
const TW_ACCENT = /^text-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:500|600|700)(?:\/\S*)?$/;
const TW_PURPLE = /^(?:purple|violet|fuchsia|indigo)$/;
const TW_BLUE = /^(?:blue|sky|cyan|indigo)$/;
const TW_PINK = /^(?:pink|rose)$/;
const TW_GREY = /^(?:slate|gray|zinc|neutral|stone)$/;
const TW_NONFILL = /^bg-(?:none|transparent|inherit|current|fixed|local|scroll|cover|contain|auto|center|top|bottom|left|right|no-repeat|repeat(?:-[\w-]+)?|(?:left|right|top|bottom)-(?:top|bottom|left|right)|clip-[\w-]+|origin-[\w-]+|blend-[\w-]+|gradient-to-[\w-]+|(?:linear|radial|conic)(?:-.*)?|size-.*|position-.*|\[(?:url|length|position|size|image|(?:repeating-)?(?:linear|radial|conic)-gradient)[^\]]*\].*)$/;
const TW_GLASS = /^bg-(?:white|black|(?:slate|gray|zinc|neutral|stone)-(?:50|100|900|950)|paper|ink|background|foreground)\/(\d{1,2}|\[(?:0?\.\d+|\d{1,2}%)\])$/;
const TW_MONO = /mono|courier|jetbrains|plex mono|geist mono|commit|fira code|space mono|dm mono|roboto mono|source code|silkscreen/i;
const TW_LOGO = /logo|brand|wordmark/i;
const TW_ROOT = { size: null, em: null, upper: false, caps: false, noLabel: false, code: false, eyeSkip: false, inOl: false, logo: false, logoSelf: false };
const TW_PARSED = new Map();

function twParse(tok) {
  let p = TW_PARSED.get(tok);
  if (p) return p;
  const variants = [];
  let depth = 0, cur = '';
  for (const ch of tok) {
    if (ch === '[' || ch === '(') depth++;
    else if ((ch === ']' || ch === ')') && depth > 0) depth--;
    if (ch === ':' && depth === 0) { variants.push(cur); cur = ''; } else cur += ch;
  }
  let base = cur;
  if (base.startsWith('!')) base = base.slice(1);
  if (base.endsWith('!')) base = base.slice(0, -1);
  const neg = base.length > 1 && base.startsWith('-');
  if (neg) base = base.slice(1);
  p = { variants: variants.map((v) => v.replace(/^(?:group|peer)-/, '').replace(/\/[\w-]+$/, '')), base, neg };
  TW_PARSED.set(tok, p);
  return p;
}

const twTokens = (ctx) => ctx.twTok || ctx.tokens;
const twValue = (tok, v) => resolveVars(v, tok).trim().replace(/^(-?)\./, '$10.');

function twSize(ctx, b) {
  const tok = twTokens(ctx);
  let m = /^text-(xs|sm|base|lg|[2-9]?xl)(?:\/\S+)?$/.exec(b);
  if (m) return TW_SIZE[m[1]];
  m = /^text-(?:\[(?:length:)?([^\]]+)\]|\((?:length:)?(--[\w-]+)\))(?:\/\S+)?$/.exec(b);
  let v = m ? (m[1] ? m[1].replace(/_/g, ' ') : `var(${m[2]})`) : null;
  if (!m) {
    m = /^text-([a-z][\w-]*?)(?:\/\S+)?$/.exec(b);
    v = m && tok[`--text-${m[1]}`];
  }
  if (!v) return null;
  const r = twValue(tok, v);
  const cl = /^clamp\(\s*([^,]+),/.exec(r);
  return pxOf(cl ? twValue(tok, cl[1]) : r);
}

function twTrack(ctx, b, neg) {
  const tok = twTokens(ctx);
  let m = /^tracking-(tighter|tight|normal|wide|wider|widest)$/.exec(b);
  let v = null;
  if (m) v = `${TW_TRACK[m[1]]}em`;
  else if ((m = /^tracking-(?:\[([^\]]+)\]|\((--[\w-]+)\))$/.exec(b))) v = m[1] ? m[1].replace(/_/g, ' ') : `var(${m[2]})`;
  else if ((m = /^tracking-([a-z][\w-]*)$/.exec(b)) && tok[`--tracking-${m[1]}`]) v = tok[`--tracking-${m[1]}`];
  if (v == null) return null;
  const r = twValue(tok, v);
  const e = /^(-?\d*\.?\d+)em$/.exec(r);
  const px = e ? null : pxOf(r);
  if (!e && px == null) return null;
  const out = e ? parseFloat(e[1]) : px;
  return e ? { em: neg ? -out : out } : { px: neg ? -out : out };
}

const twHue = (c) => {
  if (!c || c.alpha <= 0.05) return null;
  const ok = c.okl || srgbToOklch(c);
  return ok.C > 0.04 ? ok.H : null;
};
function twStop(ctx, v, tok) {
  if (/^\[?-?\d*\.?\d+%\]?$/.test(v)) return null;
  const tokens = twTokens(ctx);
  const pm = TW_SHADE.exec(v);
  if (pm) return { tok, kind: 'palette', pal: pm[1], hue: TW_GREY.test(pm[1]) ? null : TW_HUE[pm[1]] };
  if (/^(?:white|black|transparent|current|inherit)(?:\/\S*)?$/.test(v)) return { tok, kind: 'plain', hue: null };
  if (v.startsWith('(')) return { tok, kind: 'token', hue: twHue(parseColor(twValue(tokens, `var${v.replace(/\/\S*$/, '').replace(/^\((?:color:)?/, '(')}`))) };
  if (v.startsWith('[')) {
    const inner = v.slice(1, v.lastIndexOf(']')).replace(/_/g, ' ');
    return { tok, kind: /var\(/.test(inner) ? 'token' : 'literal', hue: twHue(parseColor(twValue(tokens, inner))) };
  }
  const tv = tokens[`--color-${v.replace(/\/\S*$/, '')}`];
  return { tok, kind: 'token', hue: tv ? twHue(parseColor(twValue(tokens, tv))) : null };
}

function twFamily(v) {
  if (/var\(/.test(v)) return null;
  const named = v.replace(/^family-name:/, '');
  if (named === v && !/^['"]/.test(v) && /^(?:\d|weight:|number:)/.test(v)) return null;
  const fam = firstFamily(named.replace(/_/g, ' '));
  return !fam || GENERIC_FAMILIES.has(fam) ? null : fam;
}

function twLiterals(b, tok, f) {
  for (const m of b.matchAll(/\[([^\]]+)\]/g)) {
    const v = m[1].replace(/url\([^)]*\)/gi, ' ').replace(/_/g, ' ');
    const fam = /^font-family:(.+)$/.exec(v);
    if (fam && !/var\(/.test(fam[1]) && !GENERIC_FAMILIES.has(firstFamily(fam[1]))) f.font = f.font || tok;
    for (const c of v.matchAll(TW_COLOR_LIT)) {
      const col = parseColor(c[0]);
      if (col && col.alpha > 0) f.colours.push({ tok, oklch: /^oklch/i.test(c[0]) });
    }
  }
}
const TW_COLOR_LIT = /#[0-9a-fA-F]{3,8}\b|oklch\([^)]*\)|rgba?\([^)]*\)|hsla?\([^)]*\)/g;

function twInfo(ctx, toks, tw) {
  const f = {
    upper: false, normalCase: false, caps: false, size: null, em: null, mono: false, accent: null,
    tAll: null, bounce: null, overshoot: null, hScale: null, hRotate: null, grad: false, stops: [], clip: false, clear: false,
    bblur: null, glass: null, blur: 0, blurTok: null, pos: null, fill: false, shadows: [], shadowCol: null, vh: null,
    oxHidden: null, oxClip: false, colours: [], font: null, pal: [], rounded: false, cols3: false, animate: null,
    transform: false, transition: false, caret: false, scrollbar: false, hero: false, padded: false,
  };
  let sizeV = null;
  const tracks = [];
  for (const tok of toks) {
    if (tok.includes('__')) continue;
    const p = twParse(tok);
    const b = p.base;
    if (!b) continue;
    const plain = !p.variants.length;
    for (const v of p.variants) tw.variants.add(v);
    const hover = p.variants.includes('hover');
    if (TW_PAL.test(b)) f.pal.push(b.replace(/\/.*$/, ''));
    if (b.includes('[')) twLiterals(b, tok, f);
    if (/hero/i.test(b)) f.hero = true;
    if (b === 'uppercase') { f.upper = true; continue; }
    if (b === 'normal-case') { if (plain) f.normalCase = true; continue; }
    if (b === 'small-caps' || /^\[font-variant(?:-caps)?:[^\]]*(?:small|petite)-caps/.test(b) || /^\[font-feature-settings:[^\]]*(?:smcp|c2sc)/.test(b)) { f.caps = true; continue; }
    if (b.startsWith('text-')) {
      const px = twSize(ctx, b);
      if (px != null) {
        if (plain) f.size = px; else sizeV = sizeV == null ? px : Math.min(sizeV, px);
        continue;
      }
      if (b === 'text-transparent') { f.clear = true; continue; }
      if (TW_ACCENT.test(b)) f.accent = f.accent || tok;
      continue;
    }
    if (b.startsWith('tracking-')) {
      const r = twTrack(ctx, b, p.neg);
      if (r) tracks.push({ r, plain });
      continue;
    }
    if (b === 'font-mono') { f.mono = true; continue; }
    if (b.startsWith('font-')) {
      const arb = /^font-\[(.+)\]$/.exec(b);
      const fam = arb ? twFamily(arb[1]) : null;
      if (fam) { f.font = f.font || tok; if (TW_MONO.test(fam)) f.mono = true; }
      const named = !arb && /^font-([a-z][\w-]*)$/.exec(b);
      const tv = named && twTokens(ctx)[`--font-${named[1]}`];
      if (tv && /mono|courier|code/i.test(firstFamily(resolveVars(tv, twTokens(ctx))))) f.mono = true;
      continue;
    }
    if (b === 'transition-all' || /^transition-\[[^\]]*\b(?:all|width|height|top|left|right|bottom|inset)\b/.test(b) || /^\[transition(?:-property)?:[^\]]*\b(?:all|width|height|top|left)\b/.test(b)) {
      f.tAll = f.tAll || tok; f.transition = true;
      continue;
    }
    if (/^transition(?:-transform)?$/.test(b)) { f.transition = true; if (b !== 'transition') f.transform = true; continue; }
    if (b.startsWith('animate-')) {
      if (b !== 'animate-none') f.animate = f.animate || tok;
      if (b === 'animate-bounce') f.bounce = f.bounce || tok;
      continue;
    }
    const ez = /^ease-\[cubic-bezier\(([^)]*)\)\]$/.exec(b);
    if (ez) {
      const n = ez[1].split(/[,_\s]+/).filter(Boolean).map(Number);
      if (n.length === 4 && [n[1], n[3]].some((y) => y > 1.05 || y < -0.05)) f.overshoot = f.overshoot || tok;
      continue;
    }
    if (/^(?:scale|translate|rotate|skew)-/.test(b)) {
      f.transform = true;
      if (hover && /^scale-/.test(b) && !/^scale-(?:[xy]-)?100$/.test(b)) f.hScale = f.hScale || tok;
      if (hover && /^rotate-/.test(b) && b !== 'rotate-0') f.hRotate = f.hRotate || tok;
      continue;
    }
    if (/^bg-(?:gradient-to-|linear-|radial|conic)|^bg-\[(?:repeating-)?(?:linear|radial|conic)-gradient/.test(b) || /^\[background(?:-image)?:[^\]]*gradient\(/.test(b)) f.grad = true;
    const st = /^(?:from|via|to)-(.+)$/.exec(b);
    if (st) { const s = twStop(ctx, st[1], tok); if (s) f.stops.push(s); continue; }
    if (b === 'bg-clip-text' || /^\[(?:-webkit-)?background-clip:text\]$/.test(b)) { f.clip = true; continue; }
    if (b === '[-webkit-text-fill-color:transparent]') { f.clear = true; continue; }
    if (/^backdrop-blur(?:-|$)/.test(b) || /^\[(?:-webkit-)?backdrop-filter:[^\]]*blur/.test(b)) { f.bblur = f.bblur || tok; continue; }
    const bl = /^blur-(?:(2xl|3xl)|\[(\d*\.?\d+)(px|rem)\])$/.exec(b);
    if (bl) {
      const px = bl[1] ? (bl[1] === '2xl' ? 40 : 64) : parseFloat(bl[2]) * (bl[3] === 'rem' ? 16 : 1);
      if (px > f.blur) { f.blur = px; f.blurTok = tok; }
      continue;
    }
    if (b === 'absolute' || b === 'fixed') { f.pos = f.pos || b; continue; }
    if (b.startsWith('bg-')) {
      const gm = TW_GLASS.exec(b);
      if (gm) {
        const v = gm[1].replace(/^\[|\]$/g, '');
        const a = v.endsWith('%') ? parseFloat(v) / 100 : v.includes('.') ? parseFloat(v) : parseFloat(v) / 100;
        if (a < 0.95) f.glass = f.glass || tok;
      }
      if (!TW_NONFILL.test(b)) f.fill = true;
      continue;
    }
    if (b.startsWith('shadow-')) {
      const sm = /^shadow-\[(.+)\]$/.exec(b);
      if (sm) f.shadows.push({ v: sm[1], tok });
      else if (!/^shadow-(?:2xs|xs|sm|md|lg|xl|2xl|inner|none)$/.test(b)) f.shadowCol = f.shadowCol || b.slice(7);
      continue;
    }
    if (/^(?:min-)?h-(?:screen|\[[^\]]*\d\s*vh[^\]]*\])$/.test(b)) { f.vh = f.vh || tok; continue; }
    if (b === 'overflow-x-hidden') { f.oxHidden = f.oxHidden || tok; continue; }
    if (b === 'overflow-x-clip' || b === 'overflow-clip') { f.oxClip = true; continue; }
    if (/^rounded(?:-|$)/.test(b)) { if (b !== 'rounded-none') f.rounded = true; continue; }
    if (b === 'grid-cols-3') { f.cols3 = true; continue; }
    if (/^p[xytrblse]?-/.test(b)) { f.padded = true; continue; }
    if (b.startsWith('caret-')) { f.caret = true; continue; }
    if (b.startsWith('scrollbar') || b.startsWith('[scrollbar-')) f.scrollbar = true;
  }
  if (f.size == null) f.size = sizeV;
  let emV = null;
  for (const { r, plain } of tracks) {
    const em = r.em != null ? r.em : r.px / (f.size || 16);
    if (plain) f.em = em; else emV = emV == null ? em : Math.max(emV, em);
  }
  if (f.em == null) f.em = emV;
  return f;
}

const TW_CLASS_ATTR = /(?:^|\s)(class|className|:class|v-bind:class|x-bind:class|class:list)\s*=\s*/g;
function twInterp(val) {
  const parts = [];
  let i = 0, seg = '', after = false;
  while (i < val.length) {
    if (val[i] === '{') {
      parts.push(cutGlued(seg, after, true));
      const e = braceEnd(val, i);
      parts.push(clsLits(val.slice(i + 1, e)).join(' '));
      i = e + 1; seg = ''; after = true;
      continue;
    }
    seg += val[i++];
  }
  parts.push(cutGlued(seg, after, false));
  return parts.join(' ').split(/\s+/).filter(Boolean);
}
function twTokensOf(doc, t) {
  if (doc.classAt) return doc.classAt.get(t.pos) || [];
  const tag = (doc.raw || doc.src).slice(t.pos, t.end);
  if (!tag.includes('class')) return [];
  const out = [];
  for (const m of tag.matchAll(TW_CLASS_ATTR)) {
    const i = m.index + m[0].length;
    const q = tag[i];
    let val, dyn = m[1] !== 'class' && m[1] !== 'className';
    if (q === '"' || q === "'") { const e = tag.indexOf(q, i + 1); val = tag.slice(i + 1, e < 0 ? tag.length : e); }
    else if (q === '{') { val = tag.slice(i + 1, braceEnd(tag, i)); dyn = true; }
    else val = (/^[^\s>]*/.exec(tag.slice(i)) || [''])[0];
    if (dyn) out.push(...clsLits(val));
    else if (val.includes('{')) out.push(...twInterp(val));
    else out.push(...val.split(/\s+/));
  }
  for (const d of tag.matchAll(/(?:^|\s)class:(?!list\b)([\w-]+)/g)) out.push(d[1]);
  return out.filter(Boolean);
}

function twFrame(parent, t, f, toks) {
  const logo = toks.some((x) => TW_LOGO.test(x)) || TW_LOGO.test(getAttr(t.attrs, 'aria-label') || '');
  return {
    size: f && f.size != null ? f.size : parent.size,
    em: f && f.em != null ? f.em : parent.em,
    upper: f ? f.upper || (!f.normalCase && parent.upper) : parent.upper,
    caps: (f && f.caps) || parent.caps,
    noLabel: parent.noLabel || /^(?:svg|pre|code|abbr|kbd|samp)$/.test(t.name),
    code: parent.code || /^(?:pre|code|kbd|samp)$/.test(t.name),
    eyeSkip: parent.eyeSkip || EYEBROW_ANCESTOR_SKIP.test(t.name),
    inOl: parent.inOl || t.name === 'ol',
    logo: parent.logo || (t.name === 'a' && logo),
    logoSelf: logo,
  };
}

function twGroup(ctx) {
  if (ctx._tw) return ctx._tw;
  const tw = { items: [], variants: new Set(), caret: false, scrollbar: false, motion: null, upperDisplay: false };
  ctx._tw = tw;
  const add = (it) => {
    const f = it.info;
    tw.items.push(it);
    if (f.caret) tw.caret = true;
    if (f.scrollbar) tw.scrollbar = true;
    if (!tw.motion && (f.animate || (f.transition && f.transform))) tw.motion = it;
    if (/^h[12]$/.test(it.name) && f.upper) tw.upperDisplay = true;
  };
  for (const doc of ctx.docs) {
    const stack = [];
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close) { stack.pop(); continue; }
      const parent = stack.length ? stack[stack.length - 1] : TW_ROOT;
      const toks = twTokensOf(doc, t);
      const info = toks.length ? twInfo(ctx, toks, tw) : null;
      const frame = twFrame(parent, t, info, toks);
      if (info) add({ doc, idx: i, name: t.name, attrs: t.attrs, line: t.line, toks, info, frame });
      if (!t.selfClosing) stack.push(frame);
    }
    for (let c = 0; c < doc.comps.length; c++) {
      const t = doc.comps[c];
      if (t.close) continue;
      const toks = twTokensOf(doc, t);
      if (!toks.length) continue;
      const info = twInfo(ctx, toks, tw);
      add({ doc, idx: -1, comp: c, name: t.name, attrs: t.attrs, line: t.line, toks, info, frame: twFrame(TW_ROOT, t, info, toks) });
    }
    for (const v of doc.virtuals || []) {
      const info = twInfo(ctx, v.toks, tw);
      add({ doc, idx: -1, virtual: true, name: v.name, attrs: '', line: doc.lineOf(v.pos), toks: v.toks, info, frame: twFrame(TW_ROOT, { name: v.name, attrs: '' }, info, v.toks) });
    }
  }
  return tw;
}

function twWhere(it) {
  return it.virtual ? `${it.name}() class string` : `<${it.name} class="${trunc(it.toks.join(' '), 32)}">`;
}

function compInner(doc, c) {
  const open = doc.comps[c];
  if (open.selfClosing) return '';
  let depth = 1;
  for (let i = c + 1; i < doc.comps.length; i++) {
    const t = doc.comps[i];
    if (t.name !== open.name || t.selfClosing) continue;
    if (!t.close) depth++;
    else if (--depth === 0) return doc.src.slice(open.end, t.pos);
  }
  return '';
}

function twPlain(doc, html) {
  let s = html;
  if (doc.kind !== 'html' && doc.kind !== 'jsx') for (let k = 0; k < 3 && /\{[^{}]*\}/.test(s); k++) s = s.replace(/\{[^{}]*\}/g, ' ');
  return plainText(s);
}

function twText(it) {
  if (it.text == null) {
    let inner = '';
    if (it.idx >= 0) inner = innerOf(it.doc, it.idx)?.inner || '';
    else if (it.comp != null) inner = compInner(it.doc, it.comp);
    it.text = twPlain(it.doc, inner);
  }
  return it.text;
}

function closeIndex(doc, idx) {
  if (doc.tags[idx].selfClosing) return idx;
  let depth = 1;
  for (let i = idx + 1; i < doc.tags.length; i++) {
    const t = doc.tags[i];
    if (t.selfClosing) continue;
    if (!t.close) depth++;
    else if (--depth === 0) return i;
  }
  return doc.tags.length - 1;
}

function twGradient(ctx, f) {
  if (!f.stops.length || (!f.grad && f.stops.length < 2)) return null;
  const names = f.stops.filter((s) => s.pal).map((s) => s.pal);
  let banned = null;
  for (const a of names) {
    if (!TW_PURPLE.test(a)) continue;
    if (names.some((x) => x !== a && TW_BLUE.test(x))) { banned = 'purple-to-blue'; break; }
    if (names.some((x) => x !== a && TW_PINK.test(x))) { banned = 'purple-to-pink'; break; }
  }
  if (!banned) banned = bannedGradient(f.stops.map((s) => s.hue).filter((h) => h != null), { tokens: twTokens(ctx) });
  return { banned, text: f.clip && f.clear, list: f.stops.map((s) => s.tok).join(' ') };
}

function twGlow(ctx, f) {
  const tokens = twTokens(ctx);
  for (const s of f.shadows) {
    for (const part of splitTop(resolveVars(s.v.replace(/_/g, ' '), tokens))) {
      const cm = COLOR_RE.exec(part);
      const lens = (cm ? part.replace(cm[0], ' ') : part).replace(/\binset\b/, ' ').trim().split(/\s+/).filter(Boolean).map(lengthPx);
      if (lens.length < 3 || lens[0] !== 0 || lens[1] !== 0 || lens[2] == null || lens[2] < 8) continue;
      let chroma = 0;
      if (cm) {
        const c = parseColor(cm[0]);
        if (c && c.alpha > 0.05) chroma = (c.okl || srgbToOklch(c)).C;
      } else if (f.shadowCol) {
        const name = f.shadowCol.replace(/\/\S*$/, '');
        const pm = TW_SHADE.exec(name);
        const tv = tokens[`--color-${name}`];
        chroma = pm ? (TW_GREY.test(pm[1]) ? 0 : 0.2) : tv ? (twHue(parseColor(resolveVars(tv, tokens).trim())) != null ? 0.2 : 0) : 0;
      }
      if (chroma > 0.04) return `glow: ${s.tok}${cm ? '' : ` with shadow-${f.shadowCol}`}`;
    }
  }
  return null;
}

function twDataText(s) {
  const t = s.trim();
  const letters = (t.match(/[A-Za-z]/g) || []).length;
  const digits = (t.match(/\d/g) || []).length;
  if (digits >= letters) return true;
  if (/^v?\d+(?:\.\d+)+/.test(t) || /[⌘⌥⇧⌃⎋↵]|^(?:ctrl|cmd|alt|shift|option)\s*[+-]/i.test(t)) return true;
  if (/[{}();=<>]|^\$\s|^(?:npm|npx|pnpm|yarn|bun|git|curl|cd|ls|brew|pip|docker|node) |^--?[a-z]|[\w-]+\.[a-z][a-z0-9]{0,3}$|^[#.]?[a-z]+(?:[-_][a-z0-9]+)+$|^[a-z]+[A-Z]\w*$|^\/[\w/.-]*$|^https?:/.test(t)) return true;
  return digits > 0 && /^(?:\d{1,2}:\d{2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d)/i.test(t);
}

function tw67(it, tw) {
  const f = it.info, fr = it.frame;
  if (!(f.upper || f.caps || (f.em != null && f.em > 0.03))) return null;
  if (fr.logo || fr.logoSelf || fr.noLabel) return null;
  const size = fr.size, em = fr.em;
  if ((size != null && size >= 24) || (size == null && /^h[1-6]$/.test(it.name))) return null;
  const caps = fr.upper || fr.caps;
  const small = size != null && size <= 15;
  const tracked = em != null && em > 0.03;
  const control = /^(?:button|input)$/.test(it.name) || /(?:button|btn|cta)$/i.test(it.name) || (it.name === 'a' && f.fill && f.padded) || /role\s*=\s*["']?button/i.test(it.attrs);
  if (tw.upperDisplay && control && (em == null || em <= 0.04)) return null;
  if (!((caps && (small || tracked)) || (tracked && small))) return null;
  return { what: fr.caps ? 'small caps' : fr.upper ? 'uppercase' : 'letter-spaced', size, em: tracked ? Math.round(em * 1000) / 1000 : null };
}

function tw54(it) {
  const f = it.info, fr = it.frame, doc = it.doc;
  if (it.idx < 0 || !/^(?:p|span|div|small)$/.test(it.name) || fr.eyeSkip) return null;
  if (!(f.upper || (f.em != null && f.em > 0.03) || f.accent)) return null;
  if (fr.size == null || fr.size > 14) return null;
  const t = doc.tags[it.idx];
  if (/role\s*=\s*["']?status|aria-live|aria-current|aria-hidden\s*=\s*["']?true/i.test(t.attrs)) return null;
  const c = closeIndex(doc, it.idx);
  const nx = doc.tags[c + 1];
  if (!nx || nx.close || !/^h[1-3]$/.test(nx.name)) return null;
  const inner = c > it.idx ? doc.src.slice(t.end, doc.tags[c].pos) : '';
  if (EYEBROW_BLOCKY.test(inner) || /<br\b|<time\b/i.test(inner)) return null;
  const href = /<a\b[^>]*\shref\s*=\s*["']([^"']*)["']/i.exec(inner);
  if (href && !/^#?$/.test(href[1].trim())) return null;
  const text = twPlain(doc, inner);
  const signal =[f.upper ? 'uppercase' : null, f.em != null && f.em > 0.03 ? `tracked ${Math.round(f.em * 1000) / 1000}em` : null, f.accent].filter(Boolean).join(', ');
  if (!text) return doc.kind !== 'html' && c > it.idx && (doc.raw || '').slice(t.end, doc.tags[c].pos).includes('{') ? { text: '', next: nx.name, signal } : null;
  const words = text.split(/[\s·/|\u2014\u2013]+/).filter(Boolean);
  if (words.length > 7 || text.length > 56 || /[\w/-]+\.[a-z]{1,4}$/i.test(text)) return null;
  const stripped = text.replace(/^\s*(?:no\.?\s*)?\d{1,3}(?:\s*[·./\u2014\u2013-]\s*|\s+|$)/i, '').trim();
  if ((stripped.match(/\d/g) || []).length >= 2) return null;
  if (fr.inOl && stripped && !EYEBROW_ANNOUNCE.test(stripped)) return null;
  return { text, next: nx.name, signal };
}

function twTiles(it, byIdx) {
  const doc = it.doc;
  let tiles = 0;
  for (const k of directChildren(doc, it.idx)) {
    if (!/<h3\b/i.test(k.html)) continue;
    const end = closeIndex(doc, k.idx);
    for (let j = k.idx + 1; j < end; j++) {
      const t = doc.tags[j];
      if (t.close) continue;
      if (/^h[1-6]$/.test(t.name)) break;
      const ti = byIdx.get(j);
      if (!ti || !ti.info.rounded || !ti.info.fill) continue;
      const inner = innerOf(doc, j);
      if (inner && /<svg\b|<[A-Z][\w.]*Icon\b|<Icon\b|<i\b[^>]*class/.test(inner.inner) && !twPlain(doc, inner.inner)) { tiles++; break; }
    }
  }
  return tiles;
}

function checkTailwind(ctx) {
  const tw = twGroup(ctx);
  if (!tw.items.length) return;
  const had = (gate, doc, line) => findings.some((x) => x.gate === gate && x.file === rel(doc.file) && x.line === line);
  const monoOk = monoIsMaterial({ tokens: twTokens(ctx) });
  const byDoc = new Map();
  for (const it of tw.items) {
    if (!byDoc.has(it.doc)) byDoc.set(it.doc, []);
    byDoc.get(it.doc).push(it);
    const { doc, info: f } = it;
    const at = (gate, grade, ev, fix) => report(gate, grade, doc.file, it.line, ev, fix);
    const where = twWhere(it);
    if (f.tAll) at('10a', 'FAIL', `${f.tAll} on ${where}`, 'Name the properties: transition-colors, transition-opacity or transition-transform');
    if (f.bounce || f.overshoot) at(12, 'FAIL', `${f.bounce ? 'bounce' : 'overshoot easing'} ${f.bounce || f.overshoot} on ${where}`, 'Exponential ease-out on UI state; no bounce or overshoot');
    const g = twGradient(ctx, f);
    if (g && g.banned) at('2a', 'FAIL', `${g.banned} gradient${g.text ? ' text' : ''} (${g.list}) on ${where}`, 'One anchor hue, solid ink');
    else if (g && g.text) at('2b', 'FAIL', `gradient text (${g.list}) on ${where}`, 'Solid ink; weight or a display face. Guard: a single-hue ramp from two tokens with 40 and 41 passing');
    const g29 = f.bblur && f.glass ? `glass: ${f.bblur} over ${f.glass}`
      : f.blur >= 40 && f.pos && (f.fill || f.grad || f.stops.length) ? `blurred orb: ${f.blurTok} on a filled ${f.pos} element`
        : twGlow(ctx, f);
    if (g29) at(29, 'WARN', `${g29} on ${where}`, 'Solid or grained surface; elevation by lightness, shadows with offset and blur');
    if (f.colours.length || f.font) {
      const what = [f.colours.length ? `colour literal ${f.colours[0].tok}` : null, f.font ? `font-family literal ${f.font}` : null].filter(Boolean).join(' and ');
      at(48, f.font || f.colours.some((c) => !c.oklch) ? 'FAIL' : 'WARN', `${what} in a class on ${where}`, 'Lift the value into the token block (@theme or :root) and use its utility name');
    }
    if ((f.hScale || f.hRotate) && /^(?:img|picture|image)$/i.test(it.name)) at(11, 'WARN', `${f.hScale || f.hRotate} on ${where}: the image moves on hover`, 'Imagery sits still; give the container the feedback');
    const t67 = tw67(it, tw);
    if (t67 && !had('67', doc, it.line)) {
      const text = it.virtual ? '' : twText(it);
      at(67, 'FAIL', `${text ? `"${trunc(text, 24)}" ` : ''}${t67.what}${t67.size != null ? ` at ${t67.size}px` : ''}${t67.em != null ? ` tracked ${t67.em}em` : ''} on ${where}`, 'Sentence case in the body face, a step smaller, untracked: drop uppercase and the tracking-* class');
    }
    const e54 = tw54(it);
    if (e54 && !had('54', doc, it.line)) {
      at(54, 'FAIL', `eyebrow ${e54.text ? `"${trunc(e54.text, 24)}" ` : ''}before <${e54.next}> (${e54.signal} at ${it.frame.size}px)`, 'Cut it; open the section another way (craft.md, Opening a section)');
    }
    if (!monoOk && f.mono && !it.virtual && !it.frame.code && !/^(?:code|pre|kbd|samp|time|var)$/.test(it.name) && it.frame.size != null && it.frame.size <= 14) {
      const text = twText(it);
      if (/[A-Za-z]/.test(text) && !twDataText(text)) at(64, 'FAIL', `font-mono on "${trunc(text, 24)}" at ${it.frame.size}px (${where})`, 'Labels in the body face at a smaller size and normal case; font-mono only for code and figures');
    }
  }
  for (const [doc, list] of byDoc) {
    const pal = new Map();
    let palAt = null;
    for (const it of list) for (const p of it.info.pal) if (!pal.has(p)) { pal.set(p, it); if (pal.size === 5) palAt = it; }
    if (palAt) report(74, 'WARN', doc.file, palAt.line, `default palette instead of theme tokens: ${pal.size} distinct palette classes (${[...pal.keys()].slice(0, 4).join(' ')})`, 'Extend the Tailwind theme with the Hallmark tokens and use those names');
    const scaled = list.filter((it) => it.info.hScale);
    if (scaled.length >= 3) report(11, 'WARN', doc.file, scaled[2].line, `hover scale on ${scaled.length} elements in this file (${scaled.slice(0, 3).map((it) => it.info.hScale).join(', ')})`, 'One hover signal per element; not every card grows');
    const first = new Set(['section', 'header'].map((n) => doc.tags.findIndex((t) => !t.close && t.name === n)).filter((x) => x >= 0));
    const byIdx = new Map();
    for (const it of list) if (it.idx >= 0) byIdx.set(it.idx, it);
    for (const it of list) {
      if (it.info.vh && !it.virtual && (first.has(it.idx) || it.info.hero)) report('6a', 'FAIL', doc.file, it.line, `hero sized in vh: ${it.info.vh} on ${twWhere(it)}`, 'min-h-dvh or min-h-svh');
      if (it.info.cols3 && it.idx >= 0) {
        const n = twTiles(it, byIdx);
        if (n >= 3) report(3, 'WARN', doc.file, it.line, `icon-tile row: ${n} children of ${twWhere(it)} open on an icon in a rounded filled tile above an h3`, 'Vary column widths or drop the icon tiles');
      }
    }
  }
}

const EMOJI_ICON = /(?![©®™‼⁉←-⇿])\p{Extended_Pictographic}/u;
function checkComponentText(ctx) {
  for (const doc of ctx.docs) {
    for (let c = 0; c < doc.comps.length; c++) {
      const t = doc.comps[c];
      if (t.close || t.selfClosing) continue;
      const inner = compInner(doc, c);
      if (!inner || /<(?:p|div|li|section|article|ul|ol|table)\b/i.test(inner)) continue;
      const text = twPlain(doc, inner);
      if (!text) continue;
      if (/(?:link|button|btn|cta)$/i.test(t.name) && /(→|->|›|»|⟶)\s*$/.test(text)) report(63, 'FAIL', doc.file, t.line, `arrow glued to the label "${trunc(text, 40)}" (<${t.name}>)`, 'A verb as the label; the link already says it goes somewhere');
      if ((text.match(/\s[·•]\s/g) || []).length >= 2) report(63, 'FAIL', doc.file, t.line, `middle-dot meta string "${trunc(text, 50)}"`, 'Line breaks, columns or hairlines; one dot in a byline at most');
      if (text.length <= 4 && EMOJI_ICON.test(text)) report('30a', 'FAIL', doc.file, t.line, `emoji icon "${text}" in <${t.name}>`, 'One icon library or custom SVG');
    }
  }
}

function checkF21(ctx) {
  for (const doc of ctx.docs) {
    if (doc.kind !== 'html') continue;
    let prev = 0;
    for (const m of doc.src.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
      const level = Number(m[1]);
      if (prev && level > prev + 1) {
        report('F21', 'WARN', doc.file, doc.lineOf(m.index), `h${prev} is followed by h${level} ("${trunc(m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(), 32)}")`, 'Step heading levels one at a time; size a head with CSS, never with its level');
        break;
      }
      prev = level;
    }
  }
}

function checkF22(ctx) {
  for (const r of ctx.rules) {
    const j = r.decls.find((d) => d.prop === 'text-align' && /^justify\b/.test(d.value.trim()));
    if (j && !r.decls.some((d) => d.prop === 'hyphens' && /auto/.test(d.value))) { report('F22', 'WARN', r.file, j.line, `justified text without hyphenation on ${r.selector}`, 'Set it left, or add hyphens: auto'); return; }
  }
  for (const doc of ctx.docs) {
    const m = /class(?:Name)?\s*=\s*["'][^"']*(?<![\w-])text-justify(?![\w-])/.exec(doc.src);
    if (m && !/(?<![\w-])hyphens-auto(?![\w-])/.test(doc.src)) { report('F22', 'WARN', doc.file, doc.lineOf(m.index), 'justified text without hyphenation (text-justify)', 'Set it left, or add hyphens-auto'); return; }
  }
}

function checkF23(ctx) {
  for (const doc of ctx.docs) {
    if (doc.kind !== 'html' || !/<html\b/i.test(doc.src)) continue;
    const missing = [];
    const html = /<html\b([^>]*)>/i.exec(doc.src);
    if (!html || !getAttr(html[1], 'lang')) missing.push('lang on <html>');
    if (!/<title\b[^>]*>\s*[^<\s][^<]*<\/title>/i.test(doc.src)) missing.push('a <title>');
    if (!/<meta\b[^>]*\bname\s*=\s*["']description["'][^>]*>/i.test(doc.src)) missing.push('a meta description');
    if (missing.length) report('F23', 'WARN', doc.file, 1, `the document lacks ${missing.join(', ')}`, 'Name the language, title the page in its own words, and describe it in one sentence for link previews');
  }
}

function checkF24(ctx) {
  const wide = (value) => resolveVars(value, ctx.tokens).split(/,(?![^(]*\))/).some((layer) => {
    if (/\binset\b/.test(layer)) return false;
    const len = [...layer.replace(/(?:oklch|oklab|rgba?|hsla?|color|color-mix)\([^)]*\)/g, '').matchAll(/(-?\d*\.?\d+)(px|rem|em)?(?=\s|$)/g)].map((m) => parseFloat(m[1]) * (m[2] === 'rem' || m[2] === 'em' ? 16 : 1));
    return len.length >= 3 && len[2] + Math.min(0, len[3] || 0) >= 24;
  });
  for (const r of ctx.rules) {
    const sh = r.decls.find((d) => d.prop === 'box-shadow' && d.value.trim() !== 'none');
    if (!sh || !wide(sh.value)) continue;
    const edge = r.decls.find((d) => /^border(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?$/.test(d.prop) && /(?:^|\s)(?:1px|0\.5px|thin|var\(--rule-hair\))(?:\s|$)/.test(d.value) && !/\b(?:none|transparent)\b/.test(d.value));
    if (edge) { report('F24', 'WARN', r.file, sh.line, `a hairline border under a wide soft shadow on ${r.selector}`, 'Commit to one: a defined edge, or elevation by shadow'); return; }
  }
  for (const doc of ctx.docs) {
    const m = /class(?:Name)?\s*=\s*["'][^"']*(?<![\w:-])border(?![\w-])[^"']*(?<![\w:-])shadow-(?:xl|2xl)(?![\w-])|class(?:Name)?\s*=\s*["'][^"']*(?<![\w:-])shadow-(?:xl|2xl)(?![\w-])[^"']*(?<![\w:-])border(?![\w-])/.exec(doc.raw || doc.src);
    if (m) { report('F24', 'WARN', doc.file, doc.lineOf ? doc.lineOf(m.index) : 1, 'a hairline border under a wide soft shadow (border with shadow-xl or shadow-2xl)', 'Commit to one: a defined edge, or elevation by shadow'); return; }
  }
}

let LIBRARY = null;
function library() {
  if (LIBRARY) return LIBRARY;
  LIBRARY = new Map();
  try { for (const p of JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'photos.json'), 'utf8')).photos) { LIBRARY.set(p.file.split('/').pop(), p); LIBRARY.set(savedName(p.id), p); } } catch { /* no library */ }
  return LIBRARY;
}
// theme.mjs photos --save names a file after its title; match that name back to the library entry.
const savedName = (id) => id.replace(/\.[a-z]+$/i, '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || `photo-${createHash('sha1').update(id).digest('hex').slice(0, 10)}`;
const SAVED = /([a-z0-9-]+)-(?:960|1280|1920)\.jpg/g;
const COMMONS = /upload\.wikimedia\.org\/wikipedia\/commons\/(?:thumb\/)?[0-9a-f]\/[0-9a-f]{2}\/([^/"'\s)?]+)/g;
const STOCK = /(?:images|plus)\.unsplash\.com\/(premium_photo|photo)-[\w-]+|images\.pexels\.com\/photos\/\d+|cdn\.pixabay\.com\/photo\//g;
function check76(ctx) {
  const lib = library();
  const text = ctx.docs.filter((d) => d.kind === 'html').map((d) => d.src).join('\n');
  const credited = (p) => /^(CC0|Public domain|PD)/i.test(p.license) || text.includes(p.page) || text.includes(p.page.replace(/^https:/, '')) || text.includes(p.author);
  const seen = new Set();
  for (const doc of ctx.docs) {
    let stock = 0, plus = 0;
    for (const m of doc.src.matchAll(STOCK)) {
      if (m[1] === 'premium_photo') { if (!plus++) report('76', 'FAIL', doc.file, doc.lineOf(m.index), 'an Unsplash+ photo, which needs a paid licence', 'Use a library photograph (theme.mjs photos) or the user\'s own'); }
      else if (!stock++) report('76', 'WARN', doc.file, doc.lineOf(m.index), 'a photo hotlinked from a stock site, whose terms bar images picked by an AI tool', 'Use a library photograph (theme.mjs photos) or the user\'s own; dismiss only if the user supplied this one');
    }
    for (const m of doc.src.matchAll(COMMONS)) {
      const name = m[1].replace(/^\d+px-/, '');
      if (seen.has(name)) continue;
      seen.add(name);
      const p = lib.get(name);
      if (!p) { if (lib.size) report('76', 'WARN', doc.file, doc.lineOf(m.index), `a Commons file that is not in the library (${trunc(decodeURIComponent(name), 40)})`, 'Pick photographs with theme.mjs photos, or check its licence and credit it by hand'); }
      else if (!credited(p)) report('76', 'FAIL', doc.file, doc.lineOf(m.index), `a library photo with no credit on the page (${trunc(p.author, 30)}, ${p.license})`, 'Add its printed credit to the footer\'s Photographs line (imagery.md § 2)');
    }
    for (const m of doc.src.matchAll(SAVED)) {
      const p = lib.get(m[1]);
      if (!p || seen.has(m[1])) continue;
      seen.add(m[1]);
      if (!credited(p)) report('76', 'FAIL', doc.file, doc.lineOf(m.index), `a library photo with no credit on the page (${trunc(p.author, 30)}, ${p.license})`, 'Add its printed credit to the footer\'s Photographs line (imagery.md § 2)');
    }
    if (doc.kind !== 'html') continue;
    for (const m of doc.src.matchAll(/<img\b([^>]*)>/gi)) {
      const src = getAttr(m[1], 'src');
      if ((src == null || !src.trim() || src.trim() === '#') && !getAttr(m[1], 'srcset') && !hasAttr(m[1], 'data-src')) { report('76', 'FAIL', doc.file, doc.lineOf(m.index), 'an <img> with no source', 'Give it the real image, make it a data-slot placeholder, or remove it'); break; }
    }
  }
}

const CHECKS = [check1, check2, check3, check3Stripe, check4, check6a, check7, check10, check10Motion, check11,
  check12, check15, check17, check18, check19, check20, check22, check23, check24, check24a,
  check25, check26, check27, check28, check30, check33, check34, check37, check38a,
  check39, check40_41, check42, check42Footer, check46, check47, check48, check49,
  check50, check50Wrap, check53, check54, check55, check56, checkCopyTell, check62, check63, check64, check65, check67, check38c,
  check19Tells, check58Static, check68, check69, check70, check42TwoButton, check47Placeholders, check65Tailwind, check29Glow, check11Lift, check15Fade,
  checkF1, checkF2, checkF3, checkF4, checkF5, checkF6, checkF7, checkF7Pills, checkF8, checkF9, checkF15, checkF16, checkF21, checkF22, checkF23, checkF24, check76,
  checkTailwind, checkComponentText];

const files = opts.paths.length ? collectFiles(opts.paths) : [];
if (!files.length && !opts.urls.length) { console.error('sloplint: no .html, .css, .jsx, .tsx, .vue, .svelte or .astro files found'); process.exit(2); }

const groups = new Map();
for (const f of files) {
  const dir = dirname(f);
  if (!groups.has(dir)) groups.set(dir, { css: [], html: [] });
  const g = groups.get(dir);
  if (extname(f).toLowerCase() === '.css') g.css.push(f);
  else g.html.push(f);
}

const localRef = (href) => href && !/^(?:[a-z]+:|\/\/)/i.test(href) ? href.split(/[?#]/)[0] : null;
function importsOf(css, from) {
  const out = [];
  for (const m of stripComments(css).matchAll(/@import\s+(?:url\(\s*)?["']?([^"')\s;]+)["']?\s*\)?/gi)) {
    const ref = localRef(m[1]);
    if (ref) out.push(resolve(from, ref));
  }
  return out;
}
function linksOf(doc, from) {
  const out = [];
  for (const t of doc.tags) {
    if (t.close || t.name !== 'link' || !/stylesheet/i.test(getAttr(t.attrs, 'rel') || '')) continue;
    const ref = localRef(getAttr(t.attrs, 'href'));
    if (ref) out.push(resolve(from, ref));
  }
  return out;
}

const projectRoots = new Map();
function projectRoot(dir) {
  if (projectRoots.has(dir)) return projectRoots.get(dir);
  const up = dirname(dir);
  const root = existsSync(join(dir, 'package.json')) ? dir : up === dir ? null : projectRoot(up);
  projectRoots.set(dir, root);
  return root;
}
function shareProjects(contexts) {
  const byRoot = new Map();
  for (const [dir, ctx] of contexts) {
    const root = projectRoot(dir);
    if (!root) continue;
    if (!byRoot.has(root)) byRoot.set(root, []);
    byRoot.get(root).push(ctx);
  }
  for (const list of byRoot.values()) {
    const parts = list.filter((c) => !c.cssFiles.length && c.docs.length && c.docs.every((d) => d.kind !== 'html'));
    if (!parts.length || parts.length === list.length) continue;
    const tokens = {};
    const shared = { focus: false, active: false, disabled: false, prm: false, once: new Set() };
    for (const c of list) {
      Object.assign(tokens, c.tokens);
      const tv = twGroup(c).variants;
      const sel = (re) => c.rules.some((r) => re.test(r.selector));
      shared.focus = shared.focus || sel(/:focus/) || [...tv].some((v) => /^focus/.test(v));
      shared.active = shared.active || sel(/:active/) || tv.has('active');
      shared.disabled = shared.disabled || sel(/:disabled|\[disabled\]|aria-disabled/) || tv.has('disabled') || tv.has('aria-disabled');
      shared.prm = shared.prm || /prefers-reduced-motion/i.test(stripComments(c.allCss)) || tv.has('motion-reduce') || tv.has('motion-safe');
    }
    for (const c of list) c.shared = shared;
    const stamped = list.find((c) => !parts.includes(c) && /Hallmark\s*·/.test(c.stampText));
    for (const c of parts) {
      if (stamped && !/Hallmark\s*·/.test(c.stampText)) c.stampText = `${c.stampText}\n${stamped.stampText}`;
      c.twTok = { ...tokens, ...c.tokens };
      c._tw = null;
    }
  }
}

const waiversByKey = new Map();
const postureByFile = {};
const heroPostureByFile = {};
const photoShapeByFile = {};
const jobByFile = {};
const contexts = [];
const parsedDocs = new Map();
const docOf = (f) => {
  if (parsedDocs.has(f)) return parsedDocs.get(f);
  let doc = null;
  try { doc = parseDoc(f, readFileSync(f, 'utf8')); } catch (e) { console.error(`sloplint: skipped ${rel(f)}, it could not be parsed (${e.message})`); }
  parsedDocs.set(f, doc);
  return doc;
};
function buildContext(key, cssList, docList) {
  const cssFiles = [];
  const rules = [];
  const docs = [];
  const inGroup = new Set([...cssList, ...docList.map((d) => d.file)]);
  const pending = [];
  for (const f of cssList) {
    const raw = readFileSync(f, 'utf8');
    cssFiles.push({ file: f, raw });
    rules.push(...parseCss(raw, f));
    pending.push(...importsOf(raw, dirname(f)));
  }
  for (const doc of docList) {
    docs.push(doc);
    for (const st of doc.styles) {
      rules.push(...parseCss(st.css, doc.file, st.lineOffset));
      pending.push(...importsOf(st.css, dirname(doc.file)));
    }
    pending.push(...linksOf(doc, dirname(doc.file)));
  }
  const reached = new Set();
  while (pending.length) {
    const p = pending.shift();
    if (inGroup.has(p) || extname(p).toLowerCase() !== '.css' || !existsSync(p)) continue;
    inGroup.add(p);
    reached.add(p);
    let raw;
    try { raw = readFileSync(p, 'utf8'); } catch { continue; }
    cssFiles.push({ file: p, raw, attached: true });
    rules.push(...parseCss(raw, p));
    pending.push(...importsOf(raw, dirname(p)));
  }
  const head40 = (t) => t.split('\n').slice(0, 40).join('\n');
  const stampText = [
    ...cssFiles.map((c) => head40(c.raw)),
    ...docs.flatMap((d) => d.styles.map((st) => head40(st.css))),
  ].join('\n');
  const posture = (/posture:\s*(restrained|committed|full-palette|drenched)/i.exec(stampText)?.[1] || 'restrained').toLowerCase();
  // a custom page designs its own hero: 44a and 44c read it as free
  const heroPosture = /theme:\s*custom\b/i.test(stampText) ? 'custom' : (/hero:\s*(settled|banner|poster|ledge|corridor|stage|counter|index)\b/i.exec(stampText)?.[1] || '').toLowerCase();
  const photoShape = /shape:\s*(photographic|portfolio)/i.test(stampText);
  const job = ((/\bjob:\s*([a-z][a-z /-]*)/i.exec(stampText) || [])[1] || '').trim().toLowerCase();
  for (const d of docs) { postureByFile[d.file] = posture; heroPostureByFile[d.file] = heroPosture; photoShapeByFile[d.file] = photoShape; jobByFile[d.file] = job; }
  const allCss = cssFiles.map((c) => c.raw).join('\n') + '\n'
    + docs.map((d) => d.styles.map((st) => st.css).join('\n')).join('\n');
  const tokensOnly = !docs.length && rules.length > 0 && rules.every(isTokenRule);
  contexts.push([key, { rules, tokens: buildTokens(rules), docs, cssFiles, genre: opts.genre, stampText, allCss, posture, tokensOnly }]);
  return reached;
}
for (const [dir, g] of groups) {
  const docs = g.html.map(docOf).filter(Boolean);
  const pages = docs.filter((d) => d.kind === 'html');
  const parts = docs.filter((d) => d.kind !== 'html');
  if (!pages.length) { buildContext(dir, g.css, parts); continue; }
  const used = new Set();
  for (const page of pages) {
    const linked = new Set();
    const queue = [...linksOf(page, dirname(page.file)), ...page.styles.flatMap((st) => importsOf(st.css, dirname(page.file)))];
    while (queue.length) {
      const q = queue.shift();
      if (linked.has(q) || !existsSync(q) || extname(q).toLowerCase() !== '.css') continue;
      linked.add(q);
      try { queue.push(...importsOf(readFileSync(q, 'utf8'), dirname(q))); } catch {}
    }
    const own = pages.length === 1 ? g.css : g.css.filter((c) => linked.has(c));
    own.forEach((c) => used.add(c));
    for (const c of linked) used.add(c);
    buildContext(page.file, own, [page]);
  }
  const rest = g.css.filter((c) => !used.has(c));
  if (rest.length || parts.length) buildContext(dir, rest, parts);
}
shareProjects(contexts);
for (const [key, ctx] of contexts) {
  applyWaivers(ctx, key);
  waiversByKey.set(key, { WAIVED, ANSWERED, DISMISSED, VERBATIM, APPSCREEN, LAYOUT_KEPT });
  for (const check of CHECKS) {
    try { check(ctx); } catch (e) {
      console.error(`sloplint: internal error in ${check.name} for ${rel(key)}: ${e.message}`);
    }
  }
}

let renderNotRun = null;
let domInventories = {};
if (opts.render) {
  const isShell = (f) => { try { const x = readFileSync(f, 'utf8'); return /<script\b[^>]*type\s*=\s*["']module["'][^>]*\bsrc\s*=\s*["'][^"']+\.(?:tsx?|jsx?|mjs|vue|svelte)["']/i.test(x); } catch { return false; } };
  const htmlFiles = files.filter((f) => extname(f).toLowerCase() === '.html' && !(opts.urls.length && isShell(f)));
  if (!htmlFiles.length && !opts.urls.length) renderNotRun = 'no HTML page to render; pass --url for a running dev server';
  else try {
    const mod = await import(new URL('./sloplint-render.mjs', import.meta.url).href);
    const extra = await mod.renderCheck([...htmlFiles, ...opts.urls], { genre: opts.genre, postureByFile, heroPostureByFile, photoShapeByFile, jobByFile, stage: opts.stage, selectors: opts.before || opts.kept ? Object.fromEntries([...new Set(contexts.flatMap(([, c]) => c.docs))].filter((d) => d.kind === 'html').map((d) => [d.file, scriptSelectors(d)])) : {}, scope: opts.scope === 'app' || [...waiversByKey.values()].some((x) => x.APPSCREEN) ? 'app' : opts.scope, before: opts.before });
    domInventories = extra.inventories || {};
    const allWaivers = { WAIVED: new Set([...waiversByKey.values()].flatMap((x) => [...x.WAIVED])), ANSWERED: new Set([...waiversByKey.values()].flatMap((x) => [...x.ANSWERED])), DISMISSED: new Set([...waiversByKey.values()].flatMap((x) => [...(x.DISMISSED || [])])), VERBATIM: [...waiversByKey.values()].some((x) => x.VERBATIM), APPSCREEN: [...waiversByKey.values()].some((x) => x.APPSCREEN), LAYOUT_KEPT: [...waiversByKey.values()].map((x) => x.LAYOUT_KEPT).find(Boolean) || false };
    for (const f of extra) {
      const w = /^https?:/.test(f.file) ? allWaivers : (waiversByKey.get(f.file) || waiversByKey.get(dirname(f.file)));
      WAIVED = w ? w.WAIVED : new Set();
      ANSWERED = w ? w.ANSWERED : new Set();
      DISMISSED = w ? (w.DISMISSED || new Set()) : new Set();
      VERBATIM = !!(w && w.VERBATIM);
      APPSCREEN = !!(w && w.APPSCREEN);
      LAYOUT_KEPT = (w && w.LAYOUT_KEPT) || false;
      report(f.gate, f.grade === 'REFLEX' ? 'FAIL' : f.grade, f.file, f.line, f.evidence, f.fix);
    }
    for (const x of extra.failed || []) { WAIVED = new Set(); ANSWERED = new Set(); DISMISSED = new Set(); VERBATIM = false; APPSCREEN = false; LAYOUT_KEPT = false; report('render', 'FAIL', x.file, 1, `the page did not render (${trunc(x.message, 60)}); its render gates did not run`, 'Fix the page or the URL and rerun; an unrendered page is never a pass'); }
    if (extra.notRun) renderNotRun = extra.notRun;
  } catch (e) {
    renderNotRun = e.message;
  }
}

const SNAP = join(process.cwd(), '.hallmark', 'before.json');
const squash = (t) => t.replace(/\s+/g, ' ').trim();
const escRe = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function wiringOf(src) {
  const body = src.replace(/<!--[\s\S]*?-->/g, '');
  const w = { handlers: [], links: [], fields: [], hooks: [], ids: [], scripts: [] };
  const val = String.raw`("[^"]*"|'[^']*'|\{(?:[^{}]|\{(?:[^{}]|\{[^{}]*\})*\})*\})`;
  for (const m of body.matchAll(new RegExp(String.raw`(?<![\w-])(on[A-Z]\w*|on:[\w|]+|@[a-z][\w.:-]*|v-on:[\w.:-]+|on(?:click|submit|change|input|keydown|keyup|blur|focus))\s*=\s*` + val, 'g'))) w.handlers.push(`${m[1]}=${squash(m[2])}`);
  for (const m of body.matchAll(new RegExp(String.raw`(?<![\w:-])(?:href|to|action)\s*=\s*` + val, 'g'))) {
    const tag = (/<([A-Za-z][\w.-]*)[^<]*$/.exec(body.slice(Math.max(0, m.index - 600), m.index)) || [])[1] || '';
    if (/^(link|base|use|image|script|style)$/.test(tag)) continue;
    const v = squash(m[1]).replace(/^["']|["']$/g, '').replace(/^\.\//, '');
    if (v && v !== '#') w.links.push(v);
  }
  for (const m of body.matchAll(/(?<![\w-])name\s*=\s*["']([^"']+)["']/g)) {
    const tag = (/<([A-Za-z][\w.-]*)[^<]*$/.exec(body.slice(Math.max(0, m.index - 600), m.index)) || [])[1] || '';
    if (!/^(meta|slot|iframe|param|a|map|object|link)$/i.test(tag)) w.fields.push(m[1]);
  }
  for (const m of body.matchAll(/\bregister\(\s*["']([\w.-]+)["']/g)) w.fields.push(m[1]);
  for (const m of body.matchAll(new RegExp(String.raw`\bdata-(?:testid|test|cy|qa|track[\w-]*|analytics[\w-]*|event[\w-]*|gtm[\w-]*)\s*=\s*` + val, 'g'))) w.hooks.push(squash(m[1]).replace(/^["']|["']$/g, ''));
  for (const m of body.matchAll(/(?<![\w-])id\s*=\s*["']([^"'{}\s]+)["']/g)) w.ids.push(m[1]);
  for (const m of body.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) w.scripts.push(m[1].split('?')[0].replace(/^\.\//, ''));
  return w;
}
function scriptText(doc) {
  const raw = doc.raw || doc.src;
  let js = [...raw.matchAll(/<script\b(?![^>]*\bsrc\s*=)(?![^>]*application\/(?:ld\+)?json)[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).join('\n');
  for (const m of raw.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) {
    if (/^(?:https?:)?\/\//.test(m[1])) continue;
    try { js += '\n' + readFileSync(resolve(dirname(doc.file), m[1].split('?')[0]), 'utf8'); } catch {}
  }
  return js;
}
function scriptSelectors(doc) {
  const js = scriptText(doc);
  const sels = new Set();
  for (const m of js.matchAll(/getElementById\(\s*["'`]([\w-]+)["'`]/g)) sels.add('#' + m[1]);
  for (const m of js.matchAll(/(?:querySelector(?:All)?|closest|matches)\(\s*(["'`])((?:(?!\1)[^\\\n])+)\1/g)) if (!m[2].includes('${')) sels.add(m[2].trim());
  return [...sels].sort();
}
function scriptHooks(doc) {
  const markup = (doc.raw || doc.src).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const has = (tok) => tok[0] === '#' ? new RegExp(`(?<![\\w-])id\\s*=\\s*["']${escRe(tok.slice(1))}["']`).test(markup)
    : tok[0] === '.' ? new RegExp(`(?<![\\w-])class\\s*=\\s*["'][^"']*(?<![\\w-])${escRe(tok.slice(1))}(?![\\w-])`).test(markup)
      : markup.includes(tok.slice(1));
  const queried = scriptSelectors(doc);
  const tokens = (sel) => [...sel.matchAll(/#[\w-]+|\.[A-Za-z_][\w-]*|\[data-[\w-]+/g)].map((t) => t[0]);
  return { queried, hooked: queried.filter((sel) => { const t = tokens(sel); return t.length > 0 && t.every(has); }) };
}
function takeInventory() {
  const docs = [...new Set(contexts.flatMap(([, c]) => c.docs))];
  const byFile = {};
  for (const d of docs) { const w = wiringOf(d.raw || d.src); byFile[rel(d.file)] = Object.fromEntries(Object.entries(w).map(([k, v]) => [k, [...new Set(v)].sort()])); }
  const pages = {};
  for (const [file, inv] of Object.entries(domInventories)) if (inv) pages[/^https?:/.test(file) ? file : rel(file)] = inv;
  const scripts = {};
  for (const d of docs) if (d.kind === 'html') {
    const h = scriptHooks(d);
    const dom = domInventories[d.file];
    if (dom && Array.isArray(dom.hooked)) h.dom = dom.hooked;
    h.hides = /\.hidden\s*=|["'`]hidden["'`]/.test(scriptText(d));
    if (h.queried.length || h.hides) scripts[rel(d.file)] = h;
  }
  return { files: byFile, wiring: unionWiring(Object.values(byFile)), scripts, pages };
}
function unionWiring(list) {
  const u = { handlers: new Set(), links: new Set(), fields: new Set(), hooks: new Set(), ids: new Set() };
  for (const w of list) for (const k of Object.keys(u)) for (const v of w[k] || []) u[k].add(v);
  return Object.fromEntries(Object.entries(u).map(([k, v]) => [k, [...v].sort()]));
}
let keptLine = null;
if (opts.kept) {
  let was = null;
  try { was = JSON.parse(readFileSync(SNAP, 'utf8')); } catch {}
  WAIVED = new Set(); ANSWERED = new Set(); DISMISSED = new Set(); VERBATIM = false; APPSCREEN = false; LAYOUT_KEPT = false;
  if (!was) report('kept', 'FAIL', SNAP, 1, 'no before record here; --kept has nothing to compare against', 'Run sloplint with --before from this folder before the redesign starts');
  else {
    const now = takeInventory();
    const outside = Object.keys(was.files || {}).filter((f) => !(f in now.files) && existsSync(resolve(f)));
    if (was.files) was.wiring = unionWiring(Object.entries(was.files).filter(([f]) => !outside.includes(f)).map(([, w]) => w));
    const stamps = contexts.map(([, c]) => c.stampText).join('\n');
    for (const m of stamps.matchAll(/\/\*\s*Hallmark\s*·\s*(dropped|reworded)\s+([^·*]+?)\s*·\s*([^*]+?)\s*\*\//gi)) if (m[2].trim() && m[3].trim().length < 12) report('kept', 'WARN', SNAP, 1, `${m[1]} ${trunc(m[2].trim(), 40)} is not on the record: its reason is under 12 characters`, 'Say why in a clause');
    const allowed = [...stamps.matchAll(/\/\*\s*Hallmark\s*·\s*(dropped|reworded)\s+([^·*]+?)\s*·\s*([^*]+?)\s*\*\//gi)].filter((m) => m[3].trim().length >= 12).flatMap((m) => (m[1].toLowerCase() === 'reworded' ? [...m[2].matchAll(/"([^"]+)"/g)].map((q) => q[1]) : m[2].split(',')).map((t) => t.trim().replace(/^[`"']|[`"']$/g, '').toLowerCase()).filter(Boolean));
    const acked = {};
    const gone = (a, b, cat) => (a || []).filter((x) => {
      if ((b || []).includes(x)) return false;
      if (allowed.some((t) => x.toLowerCase() === t || (t.length >= 4 && x.toLowerCase().includes(t)))) { if (cat) (acked[cat] ||= new Set()).add(x); return false; }
      return true;
    });
    const fieldsGone = (b, a, where) => {
      const named = (b || []).filter((x) => !x.startsWith('unnamed '));
      const spare = (a || []).length - named.filter((x) => (a || []).includes(x)).length;
      const short = Math.max(0, (b || []).length - named.length - spare);
      return [...gone(named, a, 'fields'), ...(short ? [`${short} field${short > 1 ? 's' : ''} with no name${where}`] : [])];
    };
    const hard = { links: new Set(), fields: new Set(), forms: new Set(), handlers: new Set(), 'test hooks': new Set(), scripts: new Set() };
    const soft = { headings: new Set(), figures: new Set(), images: new Set(), ids: new Set() };
    const total = { links: new Set(was.wiring.links), fields: new Set(was.wiring.fields), handlers: new Set(was.wiring.handlers), 'test hooks': new Set(was.wiring.hooks), headings: new Set(), figures: new Set() };
    for (const x of gone(was.wiring.links, now.wiring.links, 'links')) hard.links.add(x);
    for (const x of gone(was.wiring.fields, now.wiring.fields, 'fields')) hard.fields.add(x);
    for (const x of gone(was.wiring.handlers, now.wiring.handlers, 'handlers')) hard.handlers.add(x);
    for (const x of gone(was.wiring.hooks, now.wiring.hooks, 'test hooks')) hard['test hooks'].add(x);
    for (const x of gone(was.wiring.ids, now.wiring.ids)) soft.ids.add(x);
    for (const [f, w] of Object.entries(was.files || {})) if (now.files[f]) for (const x of gone(w.scripts, now.files[f].scripts)) hard.scripts.add(`${x} on ${f}`);
    const skipped = [];
    let wordsWas = 0, wordsNow = 0;
    for (const [k, b] of Object.entries(was.pages || {})) {
      const a = now.pages[k];
      if (!a) { skipped.push(k); continue; }
      for (const x of b.links || []) total.links.add(x);
      for (const x of b.fields || []) total.fields.add(x);
      for (const x of b.headings || []) total.headings.add(x);
      for (const x of b.figures || []) total.figures.add(x);
      for (const x of gone(b.links, [...a.links, ...now.wiring.links], 'links')) hard.links.add(x);
      for (const x of fieldsGone(b.fields, a.fields, ` on ${k}`)) hard.fields.add(x);
      for (const x of gone(b.actions, a.actions)) hard.forms.add(x);
      for (const x of gone(b.headings, a.headings, 'headings')) soft.headings.add(x);
      for (const x of gone(b.figures, a.figures, 'figures')) soft.figures.add(x);
      for (const x of gone(b.images, a.images)) soft.images.add(x);
      wordsWas += b.words || 0; wordsNow += a.words || 0;
    }
    const list = (set, n = 8) => { const a = [...set]; return a.slice(0, n).map((x) => trunc(x, 48)).join(', ') + (a.length > n ? ` and ${a.length - n} more` : ''); };
    const fix = 'Restore each one, or record it in the stamp: /* Hallmark · dropped <item>, <item> · <the reason> */';
    total['script hooks'] = new Set(); hard['script hooks'] = new Set();
    for (const [f, h] of Object.entries(was.scripts || {})) {
      if (outside.includes(f)) continue;
      const n = now.scripts[f];
      const both = n && h.dom && n.dom;
      const had = both ? h.dom : h.hooked;
      for (const x of had) total['script hooks'].add(`${f} ${x}`);
      const unhooked = n ? had.filter((x) => n.queried.includes(x) && !(both ? n.dom : n.hooked).includes(x)) : [];
      for (const x of unhooked) hard['script hooks'].add(`${f} ${x}`);
    }
    const guard = contexts.some(([, c]) => c.rules.some((r) => /\[hidden\]/.test(r.selector) && r.decls.some((d) => d.prop === 'display' && /none/.test(d.value))));
    if (!guard && Object.values(now.scripts).some((h) => h.hides)) report('kept', 'FAIL', SNAP, 1, 'a script hides elements with the hidden attribute and no rule pins it, so any display rule shows them again', 'Add [hidden] { display: none !important; } to the stylesheet');
    for (const [k, b] of Object.entries(was.pages || {})) {
      const a = now.pages[k];
      if (!a) continue;
      for (const bf of b.forms || []) {
        const af = (a.forms || []).find((x) => x.key === bf.key) || (a.forms || []).find((x) => x.attrs.join() === bf.attrs.join());
        if (!af) { if (!allowed.includes(bf.key.toLowerCase())) hard.forms.add(`the form ${bf.key} on ${k}`); continue; }
        for (const x of fieldsGone(bf.fields, af.fields, '')) hard.fields.add(`${x} in ${bf.key} on ${k}`);
        for (const x of bf.hidden) if (!af.hidden.includes(x)) hard.fields.add(`hidden ${x} in ${bf.key} on ${k}`);
        for (const x of bf.attrs) if (!af.attrs.includes(x)) hard.forms.add(`${x} on ${bf.key} (${k})`);
        if (bf.submits && !af.submits) hard.forms.add(`a submit control in ${bf.key} (${k})`);
        for (const x of bf.controls || []) if (!(af.controls || []).includes(x) && !(!x.includes('[name=') && (af.controls || []).some((y) => y.startsWith(`${x}[name=`))) && !allowed.some((t) => x.toLowerCase().includes(t) && t.length >= 4)) hard.forms.add(`${x} in ${bf.key} (${k})`);
      }
    }
    for (const x of [...hard.fields]) if ([...hard.fields].some((y) => y.startsWith(`${x} in `))) hard.fields.delete(x);
    for (const [k, set] of Object.entries(hard)) if (set.size) report('kept', 'FAIL', SNAP, 1, k === 'script hooks' ? `a script still queries what its page no longer has: ${list(set)}` : k === 'forms' ? `a form lost what it had before: ${list(set)}` : `${k} the page had before and no longer has: ${list(set)}`, k === 'script hooks' ? 'Keep the ids, classes and attributes scripts query, or change the script with the markup' : fix);
    for (const [k, set] of Object.entries(soft)) if (set.size) report('kept', 'WARN', SNAP, 1, `${k} gone or reworded since the before record: ${list(set)}`, 'Restore it, or record it in the stamp: /* Hallmark · reworded "<old>" to "<new>" · <the gate that named it> */ or dropped <item> · <the reason>');
    if (wordsWas > 80 && wordsNow < wordsWas * 0.6) report('kept', 'WARN', SNAP, 1, `the pages hold ${wordsNow} words where they held ${wordsWas}`, 'Check that no section of content was dropped');
    if (skipped.length) report('kept', 'WARN', SNAP, 1, `not compared, because this run did not render them: ${list(skipped, 4)}`, 'Render the same pages or URLs the before record holds');
    if (outside.length) report('kept', 'WARN', SNAP, 1, `not compared, because this run did not read them: ${list(outside, 4)}`, 'Run --kept on the same target as --before');
    const lostOf = (k) => (hard[k] || soft[k]).size;
    keptLine = { parts: ['links', 'fields', 'handlers', 'test hooks', 'script hooks', 'headings', 'figures'].filter((k) => total[k].size).map((k) => { const d = acked[k] ? acked[k].size : 0; return `${k} ${Math.max(0, total[k].size - lostOf(k) - d)}/${total[k].size}${d ? ` (${d} dropped on record)` : ''}`; }), was: was.summary || null };
  }
}

const seen = new Set();
const tierOk = (f) => !opts.tier || (opts.tier === 'floor' ? (f.tier === 'floor' && f.grade === 'FAIL') : f.tier === opts.tier);
const unique = findings.filter((f) => {
  if (!tierOk(f)) return false;
  const k = `${f.gate}|${f.grade}|${f.file}|${f.line}|${f.evidence}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

unique.sort((a, b) => {
  const ra = GRADE_RANK[a.grade] ?? 9, rb = GRADE_RANK[b.grade] ?? 9;
  if (ra !== rb) return ra - rb;
  const ga = gateSortKey(a.gate), gb = gateSortKey(b.gate);
  if (ga !== gb) return ga - gb;
  if (a.file !== b.file) return a.file < b.file ? -1 : 1;
  return a.line - b.line;
});

const count = (g) => unique.filter((f) => f.grade === g).length;
const fails = count('FAIL');
const reflex = count('REFLEX');
const warns = count('WARN');
const waived = count('WAIVED');
const rejected = count('WAIVER');
const answered = count('ANSWERED');
const dismissed = count('DISMISSED');
const notes = count('NOTE');

const tally = [`${fails} FAIL`];
if (reflex) tally.push(`${reflex} REFLEX`);
tally.push(`${warns} WARN`);
if (waived) tally.push(`${waived} WAIVED`);
if (rejected) tally.push(`${rejected} REJECTED`);
if (answered) tally.push(`${answered} ANSWERED`);
if (dismissed) tally.push(`${dismissed} DISMISSED`);
if (notes) tally.push(`${notes} NOTE`);

let beforeLine = null;
if (opts.before) {
  const inv = takeInventory();
  mkdirSync(dirname(SNAP), { recursive: true });
  writeFileSync(SNAP, JSON.stringify({ v: 1, at: new Date().toISOString(), scope: opts.scope, summary: { fails, reflex, warns }, ...inv }, null, 1) + '\n');
  beforeLine = `before: recorded ${new Set([...inv.wiring.links, ...Object.values(inv.pages).flatMap((p) => p.links)]).size} links, ${new Set([...inv.wiring.fields, ...Object.values(inv.pages).flatMap((p) => p.fields)]).size} fields, ${inv.wiring.handlers.length} handlers, ${inv.wiring.hooks.length} test hooks, ${new Set(Object.values(inv.scripts).flatMap((h) => h.hooked)).size} script hooks${Object.keys(inv.pages).length ? ` and ${Object.keys(inv.pages).length} rendered page(s)` : ''} in ${rel(SNAP)}; --kept checks a redesign against it`;
}
const keptNote = keptLine ? `kept: ${keptLine.parts.join(', ') || 'nothing recorded'}${keptLine.was ? `; before ${keptLine.was.fails} FAIL, ${keptLine.was.reflex} REFLEX, now ${fails} FAIL, ${reflex} REFLEX` : ''}` : null;
let compareNote = null;
if (opts.kept && opts.render && !renderNotRun) {
  try {
    const mod = await import(new URL('./sloplint-render.mjs', import.meta.url).href);
    const made = mod.writeCompare([...files.filter((f) => extname(f).toLowerCase() === '.html'), ...opts.urls], keptNote ? keptNote.replace(/^kept: /, 'Kept: ').replace(/; before (\d+) FAIL, (\d+) REFLEX, now (\d+) FAIL, (\d+) REFLEX/, '. Floor findings: $1 before, $3 now. Reflex findings: $2 before, $4 now') + '.' : null);
    if (made.length) compareNote = `compare: ${made.map(rel).join(', ')} shows before and after side by side`;
  } catch {}
}
const scopeNote = `${files.length} file(s)${opts.urls.length ? ` and ${opts.urls.length} URL(s)` : ''}${opts.stage === 'hero' ? ' (hero stage)' : ''}`;
const renderNote = opts.render ? (renderNotRun ? `render tier not run: ${renderNotRun}` : null) : null;
if (opts.json) {
  console.log(JSON.stringify({
    summary: { fails, reflex, warns, waived, rejected, answered, dismissed, notes, files: files.length, render: opts.render ? (renderNotRun ? `not run: ${renderNotRun}` : 'ran') : 'off', ...(keptNote ? { kept: keptNote } : {}), ...(beforeLine ? { before: beforeLine } : {}) },
    findings: unique,
  }, null, 2));
} else {
  if (!unique.length) console.log(`sloplint: clean. 0 FAIL, 0 REFLEX, 0 WARN across ${scopeNote}.`);
  else if (opts.before) {
    const by = new Map();
    for (const f of unique) { const k = `${f.grade} ${f.gate}`; if (!by.has(k)) by.set(k, []); by.get(k).push(f); }
    for (const [k, list] of by) console.log(`  ${k}${list.length > 1 ? ` x${list.length}` : ''} ${list.slice(0, 2).map((f) => `${f.file}:${f.line} ${trunc(f.evidence, 64)}`).join('; ')} | fix: ${list[0].fix}`);
    const every = join(dirname(SNAP), 'before.txt');
    mkdirSync(dirname(SNAP), { recursive: true });
    const ignore = join(dirname(SNAP), '.gitignore');
    if (!existsSync(ignore)) writeFileSync(ignore, 'shots/\nbefore/\nbefore.json\nbefore.txt\ncompare.html\n');
    writeFileSync(every, unique.map((f) => `${f.grade} ${f.gate} ${f.file}:${f.line} ${f.evidence} | fix: ${f.fix}`).join('\n') + '\n');
    console.log(`sloplint: ${tally.join(', ')} across ${scopeNote}, grouped by gate; every line is in ${rel(every)}.`);
  } else {
    const byFile = new Map();
    for (const f of unique) { if (!byFile.has(f.file)) byFile.set(f.file, []); byFile.get(f.file).push(f); }
    const told = new Set();
    for (const [file, list] of byFile) {
      console.log(file);
      for (const f of list) {
        const key = `${f.gate}|${f.fix}`;
        const fix = f.grade !== 'WAIVED' && f.grade !== 'ANSWERED' && f.grade !== 'DISMISSED' && !told.has(key) ? ` | fix: ${f.fix}` : '';
        told.add(key);
        console.log(`  ${f.grade} ${f.gate} :${f.line} ${f.evidence}${fix}`);
      }
    }
    console.log(`sloplint: ${tally.join(', ')} across ${scopeNote}.`);
  }
  if (renderNote) console.log(renderNote);
  if (keptNote) console.log(keptNote);
  if (compareNote) console.log(compareNote);
  if (beforeLine) console.log(beforeLine);
}
const exitCode = !opts.before && (fails > 0 || reflex > 0) ? 1 : 0;
if (process.stdout.writableLength) process.stdout.once('drain', () => process.exit(exitCode)); else process.exit(exitCode);
