#!/usr/bin/env node
/**
 * sloplint.mjs - deterministic static slop checker for Hallmark output.
 * Zero dependencies. Node 18+. One file.
 *
 * Usage:
 *   node sloplint.mjs <file-or-dir ...> [--genre editorial|modern-minimal|atmospheric|playful]
 *                     [--scope page|component] [--json] [--render]
 *
 * Coverage map (the skill's slop test has 58 gates: numbered 1-57 plus 38a).
 * This checker implements every mechanically checkable gate; gates tagged J
 * in slop-test.md stay model-judged and are NOT checked here.
 *
 * [M] static, FAIL-grade (unambiguous mechanical violations):
 *   1   banned display font (Inter/Roboto/Open Sans/Poppins/Lato/system default)
 *   2   gradient text (background-clip: text over a gradient) - the FAIL half
 *   4   card nested inside card
 *   7   pure #000 / #fff base colour (modern-minimal: pure #fff allowed)
 *   10  transition: all
 *   12  bouncy / overshoot easing on UI state changes (entrance choreography
 *       on content elements is not flagged)
 *   14  animating width / height / top / left (margin / padding transitions,
 *       e.g. deliberate nav morphs, downgrade to WARN; skip-links exempt)
 *   15  focus ring that transitions into existence
 *   19  placeholder names (Jane Doe) and startup cliches (Acme, Nexus...)
 *   20  missing Hallmark stamp comment (also passes on "/* Hallmark" in first 15 lines)
 *   22  zero-chroma oklch neutral (modern-minimal exempt; alpha<1 shadow values exempt)
 *   24  off-scale px padding / margin / gap (px values only; rem/em rhythm skipped)
 *   26  :focus-visible missing entirely = FAIL; missing :active / :disabled = WARN
 *   27  keyframes / transform transitions with no prefers-reduced-motion block
 *   30  emoji glyph as feature / step / tier icon - the FAIL half
 *   33  visual svg / canvas without aria-hidden or aria-label
 *   34  static half: html/body missing overflow-x clip|hidden entirely = FAIL;
 *       overflow-x: hidden instead of clip = WARN; width:100vw = WARN
 *   37  more than three distinct font families
 *   38a italic heading / display type
 *   48  colour or font literal outside the token block: #hex/rgb()/hsl() = FAIL,
 *       oklch() = WARN (calibrated: shipped pages extend tokens with oklch alpha
 *       variants in place; hex/rgb/hsl remain unambiguous improvisation)
 *   51  display header w/ long unbroken word and no overflow-wrap: anywhere
 *   53  CSS-only radio tabs at position:absolute top:0 with no JS guard
 *   55  all-caps display head with line-height < 1.0
 *   56  static half: two position:sticky top:0 elements
 *
 * [M] static, WARN-grade (heuristics needing human / model confirmation):
 *   2   purple-to-blue / cyan-to-magenta gradient (atmospheric: radial bg allowed)
 *   3   3-equal-column grid (icon-tile suspicion)
 *   5   thick coloured side-stripe border
 *   11  uniform hover-scale across multiple selectors
 *   17  tooltip focus delay equals hover delay
 *   18  infinite auto-rotating animation without pause-on-hover
 *   F1-F9 finish tier (never counted in the 58 gates; see slop-test.md § The
 *       finish tier): F1 straight quotes in prose · F2 three-period ellipsis ·
 *       F3 no text-wrap balance on display heads · F4 >1 filled primary button ·
 *       F5 icon-in-coloured-circle coin · F6 display-size numerics without
 *       tabular figures · F7 one container recipe on >= 6 selectors · F8 >1
 *       scroll-choreography pattern · F9 fake-human avatar hotlinks (FAIL) and
 *       person-keyword unsplash (WARN)
 *   23  accent token on viewport-scale backgrounds / display-size accent text
 *       (WARN; posture-aware via the stamp; --render measures painted area
 *       against the 5% budget and can FAIL)
 *   25  prose measure outside 45-75ch
 *   28  video/LCP hygiene (autoplay w/o muted, no poster, lazy hero media)
 *   30  two or more icon libraries mixed - the WARN half
 *   39  input-state subchecks (border-width shift, border-built focus ring,
 *       height mismatch, opacity-only disabled)
 *   40  declared same-rule colour/background contrast below threshold
 *   41  button text ~ button fill; accent w/o accent-ink; dark surface w/o colour swap
 *   42  AI-default nav fingerprint
 *   43  AI-default footer fingerprint
 *   46  invented-metric shapes ("verify the user supplied this number")
 *   47  re-drawn UI chrome (fake browser/phone/terminal frame classes)
 *   49  static half: long clickable label without white-space: nowrap
 *   50  image-bearing grid track using bare 1fr
 *   52  per-theme section-head override without mobile collapse
 *   54  eyebrow + heading in a multi-column wrapper
 *
 * [M/R] gates 34, 40, 41, 49, 56 gain full verification in the optional render
 * tier (sloplint-render.mjs, --render). Gate 44 is render-verifiable only.
 *
 * [J] judged only, never checked here: 6, 8, 9, 13, 16, 21, 23, 29, 31, 32,
 *     35, 36, 38, 45, 57.
 *
 * Extra non-gate tell: " -- " double-hyphen in page copy (copy.md mandates a
 * true em dash in generated copy, so em dashes themselves are never flagged).
 *
 * Output: human table (FAIL first) or --json
 *   {summary:{fails,warns,files}, findings:[{gate,grade,file,line,evidence,fix}]}
 * Exit code 1 if any FAIL, else 0.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, dirname, basename, resolve } from 'node:path';

/* ---------------------------------------------------------------- CLI --- */

const GENRES = ['editorial', 'modern-minimal', 'atmospheric', 'playful'];
const args = process.argv.slice(2);
const opts = { genre: null, scope: 'page', json: false, render: false, paths: [] };
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--genre') { opts.genre = args[++i]; }
  else if (a === '--scope') { opts.scope = args[++i]; }
  else if (a === '--json') { opts.json = true; }
  else if (a === '--render') { opts.render = true; }
  else if (a === '--help' || a === '-h') { usage(); process.exit(0); }
  else if (a.startsWith('--')) { console.error(`unknown flag ${a}`); usage(); process.exit(2); }
  else opts.paths.push(a);
}
function usage() {
  console.error('usage: node sloplint.mjs <file-or-dir ...> [--genre editorial|modern-minimal|atmospheric|playful] [--scope page|component] [--json] [--render]');
}
if (!opts.paths.length) { usage(); process.exit(2); }
if (opts.genre && !GENRES.includes(opts.genre)) {
  console.error(`--genre must be one of: ${GENRES.join(', ')}`); process.exit(2);
}
if (!['page', 'component'].includes(opts.scope)) {
  console.error('--scope must be page or component'); process.exit(2);
}

/* ------------------------------------------------------- file collection --- */

function collectFiles(paths) {
  const files = [];
  const seen = new Set();
  const visit = (p) => {
    const abs = resolve(p);
    if (seen.has(abs)) return;
    let st;
    try { st = statSync(abs); } catch { console.error(`sloplint: cannot read ${p}`); return; }
    if (st.isDirectory()) {
      const base = basename(abs);
      if (base === 'node_modules' || base.startsWith('.')) return;
      for (const e of readdirSync(abs)) visit(join(abs, e));
    } else {
      const ext = extname(abs).toLowerCase();
      if (ext === '.html' || ext === '.css') { seen.add(abs); files.push(abs); }
    }
  };
  for (const p of paths) visit(p);
  return files;
}

/* ---------------------------------------------------------- CSS parsing --- */

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
  const makeRule = (selector, s, e, media, keyframes) => {
    const body = src.slice(s, e);
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
  const walk = (start, end, media, keyframes) => {
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
          walk(blockStart, blockEnd, q, keyframes);
        } else if (/^@(-webkit-)?keyframes/i.test(selector)) {
          const name = selector.replace(/^@(-webkit-)?keyframes/i, '').trim();
          walk(blockStart, blockEnd, media, name || 'anon');
        } else if (/^@font-face/i.test(selector)) {
          rules.push(makeRule('@font-face', blockStart, blockEnd, media, null));
        }
      } else {
        rules.push(makeRule(selector, blockStart, blockEnd, media, keyframes));
      }
      i = k;
    }
  };
  walk(0, src.length, null, null);
  return rules;
}

/* --------------------------------------------------------- HTML parsing --- */

const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function parseHtml(file, src) {
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

  const tags = [];
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
  while ((m = tagRe.exec(src))) {
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
    .replace(/&hellip;|&#8230;/g, '\u2026').replace(/&mdash;|&#8212;/g, '\u2014')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ').replace(/[ \t]+/g, ' ');
  return { file, src, styles, scripts, tags, text, lineOf };
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

/** Direct element children of tags[idx]: [{name, open, html}]. */
function directChildren(doc, idx) {
  const open = doc.tags[idx];
  if (open.close || open.selfClosing) return [];
  const children = [];
  let depth = 1;
  let childStart = -1, childOpen = null;
  for (let i = idx + 1; i < doc.tags.length; i++) {
    const t = doc.tags[i];
    if (t.close) {
      depth--;
      if (depth === 0) break;
      if (depth === 1 && childOpen) {
        children.push({ name: childOpen.name, open: doc.src.slice(childOpen.pos, childOpen.end), html: doc.src.slice(childStart, t.end) });
        childOpen = null;
      }
      continue;
    }
    if (depth === 1) {
      if (t.selfClosing) {
        children.push({ name: t.name, open: doc.src.slice(t.pos, t.end), html: doc.src.slice(t.pos, t.end) });
      } else {
        childStart = t.pos; childOpen = t;
      }
    }
    if (!t.selfClosing) depth++;
  }
  return children;
}

/** innerHTML of tags[idx] via depth counting; returns {inner, endPos} or null. */
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

/* ----------------------------------------------------------- colour math --- */

function parseNum(s) { const v = parseFloat(s); return Number.isNaN(v) ? null : v; }

/** Parse a CSS colour into {r,g,b (gamma sRGB 0-1), alpha} or null. */
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

/* ------------------------------------------------------------- helpers --- */

function isTokenRule(rule) {
  return /:root|\[data-theme/i.test(rule.selector)
    || basename(rule.file).toLowerCase() === 'tokens.css'
    || rule.selector === '@font-face';
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

/* ----------------------------------------------------------- gate engine --- */

const COMPONENT_GATES = new Set(['1', '2', '7', '10', '14', '15', '22', '24', '26', '27', '30', '37', '38a', '39', '40', '41', '48', 'F4', 'F5', 'F6', 'F9']);
const PAGE_ONLY = new Set(['3', '4', '5', '17', '18', '19', '20', '25', '28', '33', '34', '42', '43', '46', '47', '49', '50', '51', '52', '53', '54', '55', '56', 'copy-tell']);

const findings = [];
function report(gate, grade, file, line, evidence, fix) {
  const g = String(gate);
  if (opts.scope === 'component' && !COMPONENT_GATES.has(g)) return;
  findings.push({ gate: g, grade, file: rel(file), line: line || 1, evidence: trunc(String(evidence)), fix });
}

function gateSortKey(g) {
  if (g === '38a') return 38.5;
  const f = /^F(\d+)$/.exec(g);
  if (f) return 900 + Number(f[1]); // finish tier groups after the numbered gates; copy-tell stays last
  const n = parseFloat(g);
  return Number.isNaN(n) ? 999 : n;
}

/* Each check receives ctx = { rules, tokens, docs, genre } */

function selectorIsInteractive(sel) {
  return /(^|[\s,>+~(])(a|button|input|select|textarea|summary)\b|\.(btn|button|cta|link|tab|chip|control)/i.test(sel);
}
const HEADING_SEL = /(^|[\s,>+~(])h[1-6]\b|__title|__display|hero__|wordmark|masthead|display/i;

function mergedDeclsBySelector(rules) {
  const map = new Map();
  for (const r of rules) {
    if (r.keyframes || r.selector === '@font-face') continue;
    const key = r.selector + '@@' + (r.media || '');
    if (!map.has(key)) map.set(key, { selector: r.selector, media: r.media, decls: [], file: r.file, line: r.line });
    map.get(key).decls.push(...r.decls);
  }
  return [...map.values()];
}

/* gate 1: banned display font */
function check1(ctx) {
  const banned = new Set(['inter', 'roboto', 'open sans', 'poppins', 'lato', 'system-ui', '-apple-system', 'arial', 'helvetica', 'helvetica neue', 'segoe ui']);
  const seen = new Set();
  const flag = (fam, file, line, where) => {
    if (banned.has(fam) && !seen.has(fam + where)) {
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

/* gate 2: gradient text (FAIL) + purple-blue gradient (WARN) */
function check2(ctx) {
  const bySel = mergedDeclsBySelector(ctx.rules);
  for (const r of bySel) {
    const clip = r.decls.find((d) => /background-clip/.test(d.prop) && /\btext\b/i.test(d.value));
    if (clip) {
      const grad = r.decls.find((d) => /^background(-image)?$/.test(d.prop) && /gradient\(/i.test(d.value));
      const transparent = r.decls.find((d) => (d.prop === 'color' || d.prop === '-webkit-text-fill-color') && /transparent/i.test(d.value));
      if (grad || transparent) {
        report(2, 'FAIL', r.file, clip.line, `gradient text on ${r.selector}`, 'Solid ink headline; no gradient text');
      }
    }
  }
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (!/gradient\(/i.test(d.value)) continue;
      const isRadial = /radial-gradient|conic-gradient/i.test(d.value);
      if (ctx.genre === 'atmospheric' && isRadial) continue;
      const resolved = resolveVars(d.value, ctx.tokens);
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
      const purple = stops.some((h) => h >= 250 && h <= 340);
      const bluecyan = stops.some((h) => h >= 170 && h < 260);
      if (purple && bluecyan) {
        report(2, 'WARN', r.file, d.line, `purple-to-blue gradient on ${r.selector}`, 'One anchor hue; drop the purple-blue gradient');
      }
    }
  }
}

/* gate 3: 3-equal-column grid */
function check3(ctx) {
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (d.prop !== 'grid-template-columns') continue;
      const v = resolveVars(d.value, ctx.tokens).trim();
      if (/^repeat\(\s*3\s*,\s*(minmax\(\s*0(px)?\s*,\s*1fr\s*\)|1fr)\s*\)$/.test(v)
        || /^(1fr|minmax\(\s*0(px)?\s*,\s*1fr\s*\))(\s+(1fr|minmax\(\s*0(px)?\s*,\s*1fr\s*\))){2}$/.test(v)) {
        /* only a tell when the tiles carry icon-above-heading shape */
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

/* gate 4: card in card */
function check4(ctx) {
  /* a card is the BEM block itself ("card", "code-card", "card--dark");
     child elements ("card__bar") are parts of the same card, not nested cards */
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
      const isCard = cls.split(/\s+/).some((c) => cardWord.test(c) && !containerish.test(c));
      if (isCard && stack.some((s) => s.isCard)) {
        report(4, 'FAIL', doc.file, t.line, `card nested in card: class="${trunc(cls, 40)}"`, 'Keep one containment layer');
      }
      stack.push({ name: t.name, isCard });
    }
  }
}

/* gate 5: thick side-stripe border */
function check5(ctx) {
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (!/^border-(left|right|inline-start|inline-end)$/.test(d.prop)) continue;
      const m = /(\d+(?:\.\d+)?)px/.exec(d.value);
      if (m && parseFloat(m[1]) >= 3 && !/transparent|none/i.test(d.value)) {
        report(5, 'WARN', r.file, d.line, `${d.prop}: ${trunc(d.value, 32)} on ${r.selector}`, 'Hairline all round, none, or an accent square');
      }
    }
  }
}

/* gate 7: pure black / white base colour */
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
        report(7, 'FAIL', r.file, d.line, `pure ${isBlack ? '#000' : '#fff'}: ${d.prop}: ${trunc(d.value, 28)} (${r.selector})`, 'Tint the base toward the anchor hue');
      }
    }
  }
}

/* gate 10: transition: all */
function check10(ctx) {
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (d.prop === 'transition' && /(^|,)\s*all[\s,]|^all$|^all\s/.test(d.value.trim())) {
        report(10, 'FAIL', r.file, d.line, `transition: all on ${r.selector}`, 'List the transitioned properties explicitly');
      }
      if (d.prop === 'transition-property' && /\ball\b/.test(d.value)) {
        report(10, 'FAIL', r.file, d.line, `transition-property: all on ${r.selector}`, 'List the transitioned properties explicitly');
      }
    }
  }
  for (const doc of ctx.docs) {
    if (/class\s*=\s*["'][^"']*\btransition-all\b/.test(doc.src)) {
      report(10, 'FAIL', doc.file, 1, 'class "transition-all" in markup', 'List the transitioned properties explicitly');
    }
  }
}

/* gate 11: uniform hover-scale */
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
}

/* gate 12: overshoot easing on UI state changes (buttons, modals, tooltips).
   Entrance choreography on content elements is a design choice and is not flagged. */
function check12(ctx) {
  const uiSel = /:hover|:active|:focus|\b(btn|button|modal|dialog|tooltip|dropdown|menu|popover|toast|tab|input|select|switch|toggle|accordion)\b/i;
  for (const r of ctx.rules) {
    if (!uiSel.test(r.selector)) continue;
    for (const d of r.decls) {
      if (!/transition|animation/.test(d.prop)) continue;
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

/* gate 14: animating box-model properties.
   width/height/top/left = FAIL (layout thrash); margin/padding = WARN
   (deliberate morphs, e.g. a floating-nav padding morph, need confirmation). */
function check14(ctx) {
  const hardRe = /(?<![\w-])(width|height|top|left)(?![\w-])/;
  const softRe = /(?<![\w-])(margin(?:-[a-z]+)?|padding(?:-[a-z]+)?)(?![\w-])/;
  const a11ySel = /skip|sr-only|visually-hidden/i;
  for (const r of ctx.rules) {
    if (a11ySel.test(r.selector)) continue; /* skip-links move via top by design */
    if (r.keyframes) {
      for (const d of r.decls) {
        if (/^(min|max)-/.test(d.prop)) continue;
        if (hardRe.test(d.prop)) {
          report(14, 'FAIL', r.file, d.line, `@keyframes ${r.keyframes} animates ${d.prop}`, 'Animate transform or opacity instead');
        } else if (softRe.test(d.prop)) {
          report(14, 'WARN', r.file, d.line, `@keyframes ${r.keyframes} animates ${d.prop}`, 'Animate transform or opacity instead');
        }
      }
      continue;
    }
    for (const d of r.decls) {
      if (d.prop === 'transition' || d.prop === 'transition-property') {
        const hard = hardRe.exec(d.value);
        const soft = softRe.exec(d.value);
        if (hard) {
          report(14, 'FAIL', r.file, d.line, `transitioning ${hard[1]} on ${r.selector}`, 'Animate transform or opacity instead');
        } else if (soft) {
          report(14, 'WARN', r.file, d.line, `transitioning ${soft[1]} on ${r.selector}`, 'Animate transform or opacity instead');
        }
      }
    }
  }
}

/* gate 15: focus ring transitions in */
function check15(ctx) {
  for (const r of ctx.rules) {
    if (!/:focus(-visible|-within)?\b/.test(r.selector)) continue;
    for (const d of r.decls) {
      if (d.prop === 'transition' && /outline|box-shadow|opacity|all/.test(d.value)) {
        report(15, 'FAIL', r.file, d.line, `focus ring transition on ${r.selector}`, 'Remove the transition; rings appear instantly');
      }
    }
  }
}

/* gate 17: tooltip focus delay equals hover delay */
function check17(ctx) {
  const tips = ctx.rules.filter((r) => /tooltip|tip\b/i.test(r.selector));
  const delayed = (r) => r.decls.find((d) => /^transition(-delay)?$/.test(d.prop) && /(\d{3,})ms|([1-9][\d.]*)s\b/.test(d.value));
  const hover = tips.filter((r) => /:hover/.test(r.selector)).map(delayed).find(Boolean);
  const focus = tips.filter((r) => /:focus/.test(r.selector)).map(delayed).find(Boolean);
  if (hover && focus) {
    report(17, 'WARN', tips[0].file, focus.line, 'tooltip focus delay matches hover delay', 'Hover delay 800-1000ms; focus delay 0');
  }
}

/* gate 18: infinite auto animation without pause */
function check18(ctx) {
  const autoish = /carousel|marquee|ticker|rotate|slider|scroll|auto/i;
  const paused = ctx.rules.some((r) => /:hover|:focus/.test(r.selector) && r.decls.some((d) => d.prop === 'animation-play-state' && /paused/.test(d.value)));
  for (const r of ctx.rules) {
    if (r.keyframes || !autoish.test(r.selector)) continue;
    for (const d of r.decls) {
      if (/^animation(-iteration-count)?$/.test(d.prop) && /\binfinite\b/.test(d.value) && !paused) {
        report(18, 'WARN', r.file, d.line, `infinite animation on ${r.selector} with no pause state`, 'Pause on hover and focus');
      }
    }
  }
}

/* gate 19: placeholder names and cliches */
function check19(ctx) {
  for (const doc of ctx.docs) {
    const t = doc.text;
    const patterns = [
      [/\b(jane doe|john smith|john doe|example user)\b/i, 'placeholder name'],
      [/\bAcme\b/, 'startup cliche name'],
      [/\bNexus\b/, 'startup cliche name'],
      [/\bUnleash\b/, 'startup cliche name'],
    ];
    for (const [re, label] of patterns) {
      const m = re.exec(t);
      if (m) {
        const pos = doc.text.indexOf(m[0]);
        const line = pos >= 0 ? (doc.src.slice(0, doc.src.indexOf(m[0]) >= 0 ? doc.src.indexOf(m[0]) : 0).split('\n').length) : 1;
        report(19, 'FAIL', doc.file, line, `${label}: "${m[0]}"`, 'Use plausible audience-fitting names');
      }
    }
  }
}

/* gate 20: Hallmark stamp */
function check20(ctx) {
  const stamped = (src) => /\/\*\s*Hallmark|Hallmark\s*·/.test(src.split('\n').slice(0, 15).join('\n'));
  let ok = false;
  const cssSources = [];
  for (const f of ctx.cssFiles) cssSources.push(f.raw);
  for (const doc of ctx.docs) for (const s of doc.styles) cssSources.push(s.css);
  for (const s of cssSources) if (stamped(s)) { ok = true; break; }
  if (!ok && cssSources.length) {
    const where = ctx.cssFiles[0]?.file || ctx.docs[0]?.file;
    report(20, 'FAIL', where, 1, 'no Hallmark stamp in the first 15 lines of any CSS', 'Add the Hallmark stamp comment');
  }
}

/* gate 22: zero-chroma oklch */
function check22(ctx) {
  if (ctx.genre === 'modern-minimal') return;
  const MASK_PROPS = /(^|-)mask(-image|-composite|-mode)?$|^filter$|^backdrop-filter$/;
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (MASK_PROPS.test(d.prop)) continue; // masks/filters read alpha or luminance; zero-chroma stops are legitimate there
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

/* gate 23: accent-footprint heuristic (WARN) - static half; --render measures the real area */
function check23(ctx) {
  const heads = [
    ...ctx.cssFiles.map((f) => f.raw),
    ...ctx.docs.flatMap((d) => d.styles.map((st) => st.css)),
  ].map((t) => t.split('\n').slice(0, 40).join('\n')).join('\n');
  const posture = (/posture:\s*(restrained|committed|full-palette|drenched)/i.exec(heads)?.[1] || 'restrained').toLowerCase();
  if (posture === 'drenched') return; // the surface IS the colour, by declaration
  const ACC = /var\(\s*--color-accent(?:-2)?\s*[,)]/;
  const SURFACE = /(^|[\s,>~+])(body|html|main|section|header|footer|aside)(\b|$)|\bhero\b|__hero|banner|\bstrip\b|\bband\b/i;
  const big = (r) => r.decls.some((d) =>
    (/^(min-)?height$/.test(d.prop) && (parseFloat((/([\d.]+)\s*(vh|dvh|svh)/.exec(d.value) || [])[1] || 0) >= 40 || (pxOf(d.value) ?? 0) >= 320)) ||
    (d.prop === 'inset' && /^0(px)?(\s|$)/.test(d.value.trim())));
  for (const r of ctx.rules) {
    if (isTokenRule(r) || r.keyframes) continue;
    for (const d of r.decls) {
      if (!/^background(-color|-image)?$/.test(d.prop) || !ACC.test(d.value)) continue;
      if (/\/\s*0?\.[0-2]\d*/.test(d.value)) continue;            // alpha-thinned tint or wash, not a fill
      if (ctx.genre === 'atmospheric' && /radial-gradient/i.test(d.value)) continue; // the bloom licence; area judged at the gate
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

/* gate 24: off-scale px spacing */
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
          report(24, 'FAIL', r.file, d.line, `${d.prop}: ${trunc(d.value, 28)} (off the 4px scale) on ${r.selector}`, 'Use the 4px spacing scale');
        }
      }
    }
  }
}

/* gate 25: prose measure */
function check25(ctx) {
  const proseish = /(^|[\s,>+~(])p\b|lede|prose|copy|__body|__text|__desc|paragraph/i;
  for (const r of ctx.rules) {
    if (!proseish.test(r.selector) || HEADING_SEL.test(r.selector)) continue;
    for (const d of r.decls) {
      if (d.prop !== 'max-width') continue;
      const m = /^([\d.]+)ch$/.exec(resolveVars(d.value, ctx.tokens).trim());
      if (m) {
        const ch = parseFloat(m[1]);
        if (ch < 45 || ch > 75) {
          report(25, 'WARN', r.file, d.line, `measure ${ch}ch on ${r.selector} (45-75ch range)`, 'Set prose measure between 45 and 75ch');
        }
      }
    }
  }
}

/* gate 26: interaction states present */
function check26(ctx) {
  const hasInteractive = ctx.docs.some((doc) => /<(a|button|input|select|textarea)\b|role\s*=\s*["']button/i.test(doc.src))
    || ctx.rules.some((r) => selectorIsInteractive(r.selector));
  if (!hasInteractive) return;
  const has = (pseudo) => ctx.rules.some((r) => r.selector.includes(pseudo));
  const file = ctx.cssFiles[0]?.file || ctx.docs[0]?.file || '?';
  if (!has(':focus-visible') && !has(':focus')) {
    report(26, 'FAIL', file, 1, 'no :focus-visible styling anywhere', 'Style focus-visible, active, and disabled states');
  }
  if (!has(':active')) {
    report(26, 'WARN', file, 1, 'no :active styling anywhere', 'Style focus-visible, active, and disabled states');
  }
  const hasFormish = ctx.docs.some((doc) => /<(button|input|select|textarea)\b/i.test(doc.src));
  if (hasFormish && !has(':disabled') && !ctx.rules.some((r) => /\[disabled\]|aria-disabled/.test(r.selector))) {
    report(26, 'WARN', file, 1, 'no :disabled styling anywhere', 'Style focus-visible, active, and disabled states');
  }
}

/* gate 27: reduced-motion fallback */
function check27(ctx) {
  const hasMotion = ctx.rules.some((r) => r.keyframes)
    || ctx.rules.some((r) => r.decls.some((d) => /^transition/.test(d.prop) && /transform/.test(d.value)));
  if (!hasMotion) return;
  const hasPRM = ctx.rules.some((r) => r.media && /prefers-reduced-motion/i.test(r.media))
    || ctx.cssFiles.some((f) => /prefers-reduced-motion/i.test(stripComments(f.raw)))
    || ctx.docs.some((doc) => doc.styles.some((s) => /prefers-reduced-motion/i.test(stripComments(s.css))));
  if (!hasPRM) {
    const kf = ctx.rules.find((r) => r.keyframes);
    const file = kf ? kf.file : (ctx.cssFiles[0]?.file || ctx.docs[0]?.file || '?');
    report(27, 'FAIL', file, kf ? kf.line : 1, 'motion present, no prefers-reduced-motion block', 'Add a prefers-reduced-motion fallback');
  }
}

/* gate 28: media / LCP hygiene */
function check28(ctx) {
  for (const doc of ctx.docs) {
    let firstMedia = true;
    for (const t of doc.tags) {
      if (t.close) continue;
      if (t.name === 'video') {
        if (hasAttr(t.attrs, 'autoplay') && !hasAttr(t.attrs, 'muted')) {
          report(28, 'WARN', doc.file, t.line, 'autoplay video without muted', 'autoplay muted loop playsinline, with poster');
        }
        if (!getAttr(t.attrs, 'poster')) {
          report(28, 'WARN', doc.file, t.line, 'video without poster', 'Add a poster frame');
        }
        if ((getAttr(t.attrs, 'loading') || '').toLowerCase() === 'lazy' && firstMedia) {
          report(28, 'WARN', doc.file, t.line, 'lazy-loaded hero video', 'fetchpriority=high on the LCP element');
        }
        firstMedia = false;
      }
      if (t.name === 'img') {
        if (firstMedia && (getAttr(t.attrs, 'loading') || '').toLowerCase() === 'lazy') {
          report(28, 'WARN', doc.file, t.line, 'lazy-loaded first image (likely LCP)', 'fetchpriority=high on the LCP element');
        }
        firstMedia = false;
      }
    }
  }
}

/* gate 30: emoji icon (FAIL) + mixed icon libraries (WARN) */
function check30(ctx) {
  const EMOJI = /[✨⚡✅⭐🚀🔥🎯🎉💡📈🔒🌟💪🧠]|🛠/;
  for (const doc of ctx.docs) {
    for (let i = 0; i < doc.tags.length; i++) {
      const t = doc.tags[i];
      if (t.close || t.selfClosing) continue;
      const cls = getAttr(t.attrs, 'class') || '';
      const iconish = /icon|card|step|tier|feature|value|prop|badge/i.test(cls);
      const inner = innerOf(doc, i);
      if (!inner) continue;
      const content = inner.inner.replace(/<[^>]*>/g, '').trim();
      if (content && content.length <= 4 && EMOJI.test(content) && (iconish || !/<[a-z]/.test(inner.inner))) {
        if (EMOJI.test(content)) {
          report(30, 'FAIL', doc.file, t.line, `emoji icon "${content}" in <${t.name} class="${trunc(cls, 28)}">`, 'One icon library or custom SVG');
        }
      }
    }
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
    report(30, 'WARN', ctx.docs[0]?.file || ctx.cssFiles[0]?.file, 1, `icon libraries mixed: ${[...found].join(' + ')}`, 'One icon library per page');
  }
}

/* gate 33: unlabeled visual svg / canvas */
function check33(ctx) {
  const labeledAttrs = (a) => hasAttr(a, 'aria-hidden') || getAttr(a, 'aria-label') != null
    || getAttr(a, 'aria-labelledby') != null
    || ['img', 'presentation', 'none'].includes((getAttr(a, 'role') || '').toLowerCase());
  for (const doc of ctx.docs) {
    const stack = []; /* ancestor labeled-ness */
    for (const t of doc.tags) {
      if (t.close) {
        for (let i = stack.length - 1; i >= 0; i--) {
          if (stack[i].name === t.name) { stack.splice(i); break; }
        }
        continue;
      }
      if (t.name === 'svg' || t.name === 'canvas') {
        const ancestorLabeled = stack.some((s) => s.labeled);
        if (!labeledAttrs(t.attrs) && !ancestorLabeled) {
          report(33, 'FAIL', doc.file, t.line, `<${t.name}> without aria-hidden or aria-label`, 'Add aria-hidden or an aria-label');
        }
      }
      if (!t.selfClosing) stack.push({ name: t.name, labeled: labeledAttrs(t.attrs) });
    }
  }
}

/* gate 34 static half: page-edge clipping */
function check34(ctx) {
  let clip = false, hidden = null;
  for (const r of ctx.rules) {
    if (!/(^|[\s,])(html|body)\b/.test(r.selector)) continue;
    for (const d of r.decls) {
      if (d.prop === 'overflow-x' || d.prop === 'overflow') {
        if (/\bclip\b/.test(d.value)) clip = true;
        else if (/\bhidden\b/.test(d.value)) hidden = { file: r.file, line: d.line, sel: r.selector };
      }
    }
  }
  const file = ctx.cssFiles[0]?.file || ctx.docs[0]?.file;
  if (!clip && !hidden && file && ctx.docs.length) {
    report(34, 'FAIL', file, 1, 'no overflow-x: clip on html/body', 'overflow-x: clip on html and body');
  } else if (!clip && hidden) {
    report(34, 'WARN', hidden.file, hidden.line, `overflow-x: hidden on ${hidden.sel} (breaks sticky)`, 'Use overflow-x: clip, not hidden');
  }
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (/^(width|min-width)$/.test(d.prop) && /^100vw$/.test(d.value.trim())) {
        report(34, 'WARN', r.file, d.line, `${d.prop}: 100vw on ${r.selector} (scrollbar overflow)`, 'width: 100% with container padding');
      }
    }
  }
}

/* gate 37: font family count */
function check37(ctx) {
  const families = new Map();
  const generic = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'ui-monospace', 'ui-serif', 'ui-sans-serif', 'inherit', 'initial']);
  for (const r of ctx.rules) {
    if (r.selector === '@font-face') continue;
    for (const d of r.decls) {
      if (d.prop !== 'font-family' && !/^--font-/.test(d.prop)) continue;
      if (/^--font-/.test(d.prop) && !isTokenRule(r)) continue;
      const fam = firstFamily(resolveVars(d.value, ctx.tokens));
      if (!fam || generic.has(fam) || fam.startsWith('var(')) continue;
      if (!families.has(fam)) families.set(fam, { file: r.file, line: d.line });
    }
  }
  if (families.size > 3) {
    const list = [...families.keys()].join(', ');
    const first = [...families.values()][3];
    report(37, 'FAIL', first.file, first.line, `${families.size} font families: ${trunc(list, 56)}`, 'Drop the extra family; three is the ceiling');
  }
}

/* gate 38a: italic headings */
function check38a(ctx) {
  for (const r of ctx.rules) {
    if (!HEADING_SEL.test(r.selector)) continue;
    for (const d of r.decls) {
      if (d.prop === 'font-style' && /italic|oblique/.test(d.value)) {
        report('38a', 'FAIL', r.file, d.line, `italic display type on ${r.selector}`, 'Roman headers; emphasis via weight or accent');
      }
    }
  }
  /* <em>/<i> in a heading is only a violation when it renders italic; a page
     that globally sets em { font-style: normal } (highlighter-band pattern) passes. */
  const emNormalized = ctx.rules.some((r) =>
    /(^|[\s,])(em|i)\b/.test(r.selector)
    && r.decls.some((d) => d.prop === 'font-style' && /normal/.test(d.value)));
  if (emNormalized) return;
  for (const doc of ctx.docs) {
    const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
    let m;
    while ((m = re.exec(doc.src))) {
      if (/<(em|i)\b/i.test(m[2])) {
        report('38a', 'FAIL', doc.file, doc.lineOf(m.index), `<em>/<i> inside <h${m[1]}>`, 'Roman headers; emphasis via weight or accent');
      }
    }
  }
}

/* gate 39: input-state subchecks */
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
          report(39, 'WARN', r.file, d.line, `border-width ${baseW}px -> ${w}px on ${r.selector} (layout shift)`, 'Keep border-width constant; move state to outline');
        }
      }
    }
    if (/:focus/.test(r.selector)) {
      const setsBorder = r.decls.some((d) => /^border(-color)?$/.test(d.prop));
      const setsOutline = r.decls.some((d) => /^outline/.test(d.prop));
      if (setsBorder && !setsOutline) {
        report(39, 'WARN', r.file, r.line, `focus state via border on ${r.selector}`, 'Focus ring via outline, not border');
      }
    }
  }
  for (const r of ctx.rules) {
    if (!/:disabled|\[disabled\]/.test(r.selector)) continue;
    const hasOpacity = r.decls.some((d) => d.prop === 'opacity');
    const hasCursor = r.decls.some((d) => d.prop === 'cursor' && /not-allowed/.test(d.value));
    if (hasOpacity && !hasCursor) {
      report(39, 'WARN', r.file, r.line, `disabled via opacity alone on ${r.selector}`, 'Add cursor: not-allowed and the disabled attribute');
    }
  }
}

/* gates 40 + 41: declared-pair contrast math */
function check40_41(ctx) {
  const bySel = mergedDeclsBySelector(ctx.rules);
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

/* gate 42: AI-default nav fingerprint */
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
      report(42, 'WARN', doc.file, navTag.line, `default nav shape: ${links} links + CTA + 1px hairline`, 'Route the nav via the cookbook variants');
    }
  }
}

/* gate 43: AI-default footer fingerprint */
function check43(ctx) {
  for (const doc of ctx.docs) {
    const idx = doc.tags.findIndex((t) => !t.close && t.name === 'footer');
    if (idx === -1) continue;
    const inner = innerOf(doc, idx);
    if (!inner) continue;
    const uls = (inner.inner.match(/<ul\b/gi) || []).length;
    /* the AI default is 4 EQUAL link columns; a statement footer with an
       auto brand column + meta columns is not the fingerprint */
    const fourEqualCol = ctx.rules.some((r) => /footer/i.test(r.selector) && r.decls.some((d) =>
      d.prop === 'grid-template-columns'
      && (/repeat\(\s*4\s*,/.test(d.value)
        || /^(1fr|minmax\([^)]*\))(\s+(1fr|minmax\([^)]*\))){3,}$/.test(d.value.trim()))));
    /* count link groups: columns carrying 3+ links each */
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
      report(43, 'WARN', doc.file, doc.tags[idx].line, `default footer shape: ${uls >= 4 ? uls + ' link columns' : '4 equal columns of links'}`, 'Route the footer via the cookbook variants');
    }
  }
}

/* gate 46: invented-metric shapes */
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
    for (const re of shapes) {
      const m = re.exec(doc.text);
      if (m) {
        const pos = doc.src.indexOf(m[0]);
        report(46, 'WARN', doc.file, pos >= 0 ? doc.lineOf(pos) : 1,
          `metric "${m[0].trim()}" - verify the user supplied this number`, 'Confirm the metric or drop the slot');
      }
    }
  }
}

/* gate 47: re-drawn UI chrome */
function check47(ctx) {
  const re = /(browser|window|mac|osx)[-_]?(bar|chrome|frame|dots|controls)|traffic[-_]?light|phone[-_]?(frame|mock(up)?)|device[-_]?frame|\bnotch\b|title[-_]?bar|terminal[-_]?(chrome|frame|bar|dots|header)|window[-_]?(dots|buttons)|url[-_]?(bar|pill)/i;
  for (const doc of ctx.docs) {
    const m = re.exec(doc.src);
    if (m) {
      report(47, 'WARN', doc.file, doc.lineOf(m.index), `re-drawn chrome marker "${m[0]}"`, 'Use a real screenshot in a figure');
    }
  }
  for (const r of ctx.rules) {
    const m = re.exec(r.selector);
    if (m) {
      report(47, 'WARN', r.file, r.line, `re-drawn chrome selector ${r.selector}`, 'Use a real screenshot in a figure');
      break;
    }
  }
}

/* gate 48: token discipline. oklch WARNs are capped at 6 per file to keep the
   table readable; the seventh becomes a "+N more" summary. */
function check48(ctx) {
  const colorLit = /#[0-9a-fA-F]{3,8}\b|(?<![\w-])rgba?\(|(?<![\w-])hsla?\(|(?<![\w-])oklch\(/;
  const oklchCount = new Map();
  const warnOklch = (file, line, evidence) => {
    const n = (oklchCount.get(file) || 0) + 1;
    oklchCount.set(file, n);
    if (n <= 6) report(48, 'WARN', file, line, evidence, 'Lift the value into the token block');
  };
  for (const r of ctx.rules) {
    if (isTokenRule(r)) continue;
    for (const d of r.decls) {
      if (d.prop === 'font-family') {
        const v = d.value;
        if (!v.includes('var(')) {
          const fam = firstFamily(v);
          const generic = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'inherit', 'system-ui', 'ui-monospace']);
          if (!generic.has(fam)) {
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
        if (isOklch) warnOklch(r.file, d.line, ev);
        else report(48, 'FAIL', r.file, d.line, ev, 'Lift the value into the token block');
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
        if (isOklch) warnOklch(doc.file, doc.lineOf(m.index), ev);
        else report(48, 'FAIL', doc.file, doc.lineOf(m.index), ev, 'Lift the value into the token block');
      }
    }
  }
  for (const [file, n] of oklchCount) {
    if (n > 6) {
      report(48, 'WARN', file, 1, `+${n - 6} more oklch literals outside tokens in this file`, 'Lift the values into the token block');
    }
  }
}

/* gate 49 static half: long clickable labels without nowrap */
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
        || /(^|\s)(btn|cta|button)(\s|$|__|--)/i.test(cls);
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

/* gate 50: bare 1fr track with images */
function check50(ctx) {
  for (const r of ctx.rules) {
    for (const d of r.decls) {
      if (!/^grid-template-(columns|rows)$/.test(d.prop)) continue;
      const flat = resolveVars(d.value, ctx.tokens).replace(/minmax\([^)]*\)/g, 'MM');
      if (!/\b1fr\b/.test(flat)) continue;
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
        report(50, 'WARN', r.file, d.line, `bare 1fr track holds images (${r.selector})`, 'Use minmax(0, 1fr) for image tracks');
      }
    }
  }
}

/* gate 51: display header long-word wrap safety */
function check51(ctx) {
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
        report(51, 'FAIL', doc.file, t.line, `display header word "${trunc(risky, 30)}" with no overflow-wrap: anywhere`, 'Add overflow-wrap: anywhere and min-width: 0');
      }
    }
  }
}

/* gate 52: theme section-head override without mobile collapse */
function check52(ctx) {
  const overrides = ctx.rules.filter((r) => !r.media
    && /\[data-theme[^\]]*\]/.test(r.selector) && /__head\b/.test(r.selector)
    && r.decls.some((d) => d.prop === 'grid-template-columns'
      && !/^(1fr|minmax\(\s*0(px)?\s*,\s*1fr\s*\)|none)$/.test(resolveVars(d.value, ctx.tokens).trim())));
  for (const o of overrides) {
    const collapsed = ctx.rules.some((r) => r.media && /max-width:\s*(48rem|768px)/.test(r.media)
      && /__head\b/.test(r.selector)
      && r.decls.some((d) => d.prop === 'grid-template-columns' && /^(1fr|minmax\(\s*0(px)?\s*,\s*1fr\s*\)|none)$/.test(d.value.trim())));
    if (!collapsed) {
      const d = o.decls.find((x) => x.prop === 'grid-template-columns');
      report(52, 'WARN', o.file, d.line, `${o.selector} keeps ${trunc(d.value, 24)} on mobile`, 'Collapse the head to one column on mobile');
    }
  }
}

/* gate 53: scroll-jumping radio tabs */
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

/* gate 54: eyebrow beside heading (multi-column head wrapper) */
function check54(ctx) {
  const multiCol = (v) => {
    const flat = v.replace(/minmax\([^)]*\)|repeat\([^)]*\)|calc\([^)]*\)/g, 'T');
    const tracks = flat.trim().split(/\s+/).filter((x) => x && x !== '/');
    if (/repeat\(/.test(v)) return true;
    return tracks.length >= 2 && !/^(none|subgrid)$/.test(v.trim());
  };
  for (const r of ctx.rules) {
    if (r.media && /max-width/.test(r.media)) continue;
    const d = r.decls.find((x) => x.prop === 'grid-template-columns' && multiCol(resolveVars(x.value, ctx.tokens)));
    if (!d) continue;
    const classes = (r.selector.match(/\.[a-zA-Z][\w-]*/g) || []).map((c) => c.slice(1));
    if (!classes.length) continue;
    for (const doc of ctx.docs) {
      for (let i = 0; i < doc.tags.length; i++) {
        const t = doc.tags[i];
        if (t.close || t.selfClosing) continue;
        const cls = getAttr(t.attrs, 'class') || '';
        if (!classes.some((c) => cls.split(/\s+/).includes(c))) continue;
        /* the eyebrow and the heading must live in DIFFERENT grid children
           (side by side); label + heading stacked inside one column passes */
        const children = directChildren(doc, i);
        const eyebrowRe = /class\s*=\s*["'][^"']*(eyebrow|kicker|label|tag\b|__num|index|chapter)/i;
        const CONTENT_TAGS = /^(ol|ul|table|section|article|main|nav|figure)$/;
        let eyebrowChild = -1, headingChild = -1;
        children.forEach((chunk, ci) => {
          /* only the child's own open tag counts as an eyebrow; a label-classed
             element buried inside a content column (a track-number span in an
             <ol>) is not a section eyebrow */
          if (eyebrowChild === -1 && eyebrowRe.test(chunk.open) && !CONTENT_TAGS.test(chunk.name)) eyebrowChild = ci;
          if (headingChild === -1 && (/^h[1-6]$/.test(chunk.name) || /<h[1-6]\b/i.test(chunk.html))) headingChild = ci;
        });
        if (eyebrowChild !== -1 && headingChild !== -1 && eyebrowChild !== headingChild) {
          report(54, 'FAIL', r.file, d.line, `eyebrow + heading share a ${trunc(d.value, 20)} row (${r.selector})`, 'Stack the eyebrow above the heading');
        }
      }
    }
  }
}

/* gate 55: all-caps display head with line-height < 1 */
function check55(ctx) {
  const bySel = mergedDeclsBySelector(ctx.rules);
  for (const r of bySel) {
    const upper = r.decls.find((d) => d.prop === 'text-transform' && /uppercase/.test(d.value));
    if (!upper) continue;
    const displayish = HEADING_SEL.test(r.selector);
    const lhD = r.decls.find((d) => d.prop === 'line-height');
    if (!lhD) continue;
    const lh = parseFloat(resolveVars(lhD.value, ctx.tokens));
    if (!Number.isNaN(lh) && lh < 1.0 && (displayish || lh < 1.0 && r.decls.some((d) => d.prop === 'font-size' && (pxOf(resolveVars(d.value, ctx.tokens)) ?? 0) >= 28))) {
      if (displayish || (pxOf(resolveVars(r.decls.find((d) => d.prop === 'font-size')?.value || '', ctx.tokens)) ?? 0) >= 28) {
        report(55, 'FAIL', r.file, lhD.line, `uppercase + line-height ${lh} on ${r.selector} (cap collision)`, 'Line-height 1.0 minimum for caps heads');
      }
    }
  }
}

/* gate 56 static half: two sticky top-0 elements */
function check56(ctx) {
  const bySel = mergedDeclsBySelector(ctx.rules);
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

/* extra: double-hyphen dash tell in copy (em dash itself is mandated, never flagged) */
function checkCopyTell(ctx) {
  for (const doc of ctx.docs) {
    const m = /\w\s--\s\w/.exec(doc.text);
    if (m) {
      const pos = doc.src.indexOf(m[0]);
      report('copy-tell', 'WARN', doc.file, pos >= 0 ? doc.lineOf(pos) : 1, `double-hyphen dash "${m[0]}" in copy`, 'Use a true em dash in page copy');
    }
  }
}

/* ------------------------------------------------- finish tier (F1-F9) --- */
/* Polish checks, never counted in the 58 gates. WARN unless noted; F9's
   fake-avatar half is FAIL. See slop-test.md § The finish tier. */

/* Position-preserving prose view: code-ish blocks, comments, and tags are
   space-padded (never collapsed) so match indices map straight to doc.lineOf.
   Entities stay ENCODED here; patterns match both forms. */
function maskedProse(doc) {
  if (doc._prose == null) {
    const pad = (m) => m.replace(/[^\n]/g, ' ');
    doc._prose = doc.src
      .replace(/<(script|style|pre|code|kbd|samp|textarea)\b[^>]*>[\s\S]*?<\/\1>/gi, pad)
      .replace(/<!--[\s\S]*?-->/g, pad)
      .replace(/<[^>]*>/g, pad);
  }
  return doc._prose;
}

function maxPxIn(value) { // largest px-equivalent in a value (handles clamp())
  let best = null;
  for (const m of String(value).matchAll(/(-?\d+(?:\.\d+)?)(px|rem|em)/g)) {
    const px = m[2] === 'px' ? parseFloat(m[1]) : parseFloat(m[1]) * 16;
    if (best == null || px > best) best = px;
  }
  return best;
}

function baseSelector(sel) { // strip pseudo-classes/elements
  return sel.replace(/::?[a-z-]+(\([^)]*\))?/gi, '').replace(/\s+/g, ' ').trim();
}

/* gate F1: straight quotes in prose (curly quotes never flagged) */
function checkF1(ctx) {
  const dq = /(?:"|&quot;|&#0?34;)(?=[A-Za-z])|[A-Za-z](?:"|&quot;|&#0?34;)/g;
  const ap = /[A-Za-z](?:'|&#0?39;|&apos;)(?=[A-Za-z])/g; // contractions/possessives only
  for (const doc of ctx.docs) {
    const prose = maskedProse(doc);
    const hits = [...prose.matchAll(dq), ...prose.matchAll(ap)].sort((a, b) => a.index - b.index);
    if (!hits.length) continue;
    const around = prose.slice(Math.max(0, hits[0].index - 16), hits[0].index + 16).replace(/\s+/g, ' ').trim();
    report('F1', 'WARN', doc.file, doc.lineOf(hits[0].index),
      `straight quote in prose x${hits.length} (first: ${trunc(around, 40)})`, 'Use typographic quotes: \u201C \u201D \u2019');
  }
}

/* gate F2: three-period ellipsis in prose */
function checkF2(ctx) {
  for (const doc of ctx.docs) {
    const prose = maskedProse(doc);
    const hits = [...prose.matchAll(/\.{3,}/g)];
    if (!hits.length) continue;
    report('F2', 'WARN', doc.file, doc.lineOf(hits[0].index),
      `three-period ellipsis in prose x${hits.length}`, 'Use a true ellipsis character (\u2026)');
  }
}

/* gate F3: display heads without text-wrap balance (single WARN per file set) */
function checkF3(ctx) {
  const H12 = /(^|[\s,>+~(])h[12]\b/i;
  const targets = [];
  let satisfied = false;
  for (const r of mergedDeclsBySelector(ctx.rules)) {
    const isH12 = H12.test(r.selector);
    const isDisplayClass = HEADING_SEL.test(r.selector)
      && r.decls.some((d) => d.prop === 'font-size' && (maxPxIn(resolveVars(d.value, ctx.tokens)) ?? 0) >= 40);
    if (!isH12 && !isDisplayClass) continue;
    targets.push(r);
    if (r.decls.some((d) => /^text-wrap(-style)?$/.test(d.prop) && /balance|pretty/.test(d.value))) satisfied = true;
  }
  if (targets.length && !satisfied) {
    report('F3', 'WARN', targets[0].file, targets[0].line,
      `no text-wrap: balance on any display head (${targets.length} head rule(s), e.g. ${trunc(targets[0].selector, 32)})`,
      'Add text-wrap: balance to h1/h2-level heads');
  }
}

/* gate F4: more than one filled-primary button recipe */
function checkF4(ctx) {
  const BTN = /\b(btn|button|cta)\b|__(btn|button|cta)\b/i;
  const filled = new Map(); // base selector -> {r, d}
  for (const r of mergedDeclsBySelector(ctx.rules)) {
    if (isTokenRule(r) || /:hover|:active|:focus|:disabled|\.is-|\[disabled/i.test(r.selector)) continue;
    const first = baseSelector(r.selector.split(',')[0]);
    if (!BTN.test(first)) continue;
    for (const d of r.decls) {
      if (!/^background(-color)?$/.test(d.prop)) continue;
      const rv = resolveVars(d.value, ctx.tokens);
      if (/transparent|none/i.test(rv)) continue;
      if (/var\(\s*--color-(accent|ink)\b/.test(d.value) && !filled.has(first)) filled.set(first, { r, d });
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

/* gate F5: icon in a coloured circle coin */
function checkF5(ctx) {
  for (const r of mergedDeclsBySelector(ctx.rules)) {
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

/* gate F6: display-size numeric surfaces without tabular figures (selector heuristic) */
function checkF6(ctx) {
  const NUM_SEL = /\b(stat|price|table|figure|count|num)[\w-]*/i;
  const hasTnum = (r) => r.decls.some((d) => d.prop === 'font-variant-numeric'
    || (d.prop === 'font-feature-settings' && /tnum/.test(d.value)));
  if (ctx.rules.some((r) => /^(html|body|:root)\b/i.test(r.selector.trim()) && hasTnum(r))) return;
  const bySel = mergedDeclsBySelector(ctx.rules);
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

/* gate F7: container monotony - identical surface recipe across >= 6 selectors */
function checkF7(ctx) {
  const byKey = new Map();
  for (const r of mergedDeclsBySelector(ctx.rules)) {
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

/* gate F8: more than one scroll-choreography pattern family */
function checkF8(ctx) {
  const famOf = (sel) => {
    const m = /\.([a-z][\w-]*)/i.exec(sel) || /(^|[\s>+~])([a-z][\w-]*)/i.exec(sel);
    const name = m ? (m[1] || m[2]) : sel;
    return name.split('__')[0].split('--')[0].toLowerCase();
  };
  const NAVISH = /^(nav|header|topbar|masthead|banner)$/; // scroll-reactive navs are n10/n12 territory
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

/* gate F9: fake-human avatar hotlinks (FAIL) / person-keyword unsplash (WARN) */
function checkF9(ctx) {
  const FAKE = /(i\.pravatar\.cc|pravatar\.cc|api\.dicebear\.com|dicebear\.com|randomuser\.me|thispersondoesnotexist\.com|ui-avatars\.com)/i;
  const UNSPLASH = /https?:\/\/[^"'()\s]*unsplash\.com[^"'()\s]*/gi;
  const PERSONY = /person|face|portrait|people|headshot/i;
  const scan = (text, file, lineAt) => {
    const f = FAKE.exec(text);
    if (f) report('F9', 'FAIL', file, lineAt(f.index), `fake-human avatar service ${f[1]}`,
      'Use the Hallmark avatar kit or drop the face; a generated stranger is fabricated social proof');
    for (const m of text.matchAll(UNSPLASH)) {
      if (PERSONY.test(m[0])) report('F9', 'WARN', file, lineAt(m.index),
        `unsplash person-keyword URL ${trunc(m[0], 44)}`,
        'Faces as social proof need real people; keep unsplash for scenery and objects');
    }
  };
  for (const doc of ctx.docs) scan(doc.src, doc.file, (i) => doc.lineOf(i));
  for (const c of ctx.cssFiles) scan(c.raw, c.file, (i) => c.raw.slice(0, i).split('\n').length);
}

/* -------------------------------------------------------------- runner --- */

const CHECKS = [check1, check2, check3, check4, check5, check7, check10, check11,
  check12, check14, check15, check17, check18, check19, check20, check22, check23, check24,
  check25, check26, check27, check28, check30, check33, check34, check37, check38a,
  check39, check40_41, check42, check43, check46, check47, check48, check49,
  check50, check51, check52, check53, check54, check55, check56, checkCopyTell,
  checkF1, checkF2, checkF3, checkF4, checkF5, checkF6, checkF7, checkF8, checkF9];

const files = collectFiles(opts.paths);
if (!files.length) { console.error('sloplint: no .html or .css files found'); process.exit(2); }

const groups = new Map();
for (const f of files) {
  const dir = dirname(f);
  if (!groups.has(dir)) groups.set(dir, { css: [], html: [] });
  const g = groups.get(dir);
  if (extname(f).toLowerCase() === '.css') g.css.push(f);
  else g.html.push(f);
}

for (const [dir, g] of groups) {
  const cssFiles = [];
  const rules = [];
  const docs = [];
  for (const f of g.css) {
    const raw = readFileSync(f, 'utf8');
    cssFiles.push({ file: f, raw });
    rules.push(...parseCss(raw, f));
  }
  for (const f of g.html) {
    const raw = readFileSync(f, 'utf8');
    const doc = parseHtml(f, raw);
    docs.push(doc);
    for (const s of doc.styles) rules.push(...parseCss(s.css, f, s.lineOffset));
    const inlineRe = /style\s*=\s*"([^"]*)"/gi;
    let m;
    while ((m = inlineRe.exec(raw))) {
      // inline styles participate in token discipline via check48 (scanned there)
    }
  }
  const ctx = { rules, tokens: buildTokens(rules), docs, cssFiles, genre: opts.genre };
  for (const check of CHECKS) {
    try { check(ctx); } catch (e) {
      console.error(`sloplint: internal error in ${check.name} for ${dir}: ${e.message}`);
    }
  }
}

/* render tier */
if (opts.render) {
  const htmlFiles = files.filter((f) => extname(f).toLowerCase() === '.html');
  try {
    const mod = await import(new URL('./sloplint-render.mjs', import.meta.url).href);
    const postureByFile = {};
    for (const f of htmlFiles) {
      let head = '';
      try { head = readFileSync(f, 'utf8').split('\n').slice(0, 60).join('\n'); } catch { /* unreadable */ }
      postureByFile[f] = (/posture:\s*(restrained|committed|full-palette|drenched)/i.exec(head)?.[1] || 'restrained').toLowerCase();
    }
    const extra = await mod.renderCheck(htmlFiles, { genre: opts.genre, postureByFile });
    for (const f of extra) {
      findings.push({ ...f, file: rel(f.file), evidence: trunc(String(f.evidence)) });
    }
  } catch (e) {
    console.error(`render tier unavailable (${e.message}); static checks only`);
  }
}

/* dedupe identical findings */
const seen = new Set();
const unique = findings.filter((f) => {
  const k = `${f.gate}|${f.grade}|${f.file}|${f.line}|${f.evidence}`;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

unique.sort((a, b) => {
  if (a.grade !== b.grade) return a.grade === 'FAIL' ? -1 : 1;
  const ga = gateSortKey(a.gate), gb = gateSortKey(b.gate);
  if (ga !== gb) return ga - gb;
  if (a.file !== b.file) return a.file < b.file ? -1 : 1;
  return a.line - b.line;
});

const fails = unique.filter((f) => f.grade === 'FAIL').length;
const warns = unique.filter((f) => f.grade === 'WARN').length;

if (opts.json) {
  console.log(JSON.stringify({ summary: { fails, warns, files: files.length }, findings: unique }, null, 2));
} else {
  if (!unique.length) {
    console.log(`sloplint: clean. 0 FAIL, 0 WARN across ${files.length} file(s).`);
  } else {
    const wGate = Math.max(4, ...unique.map((f) => String(f.gate).length));
    const wWhere = Math.max(9, ...unique.map((f) => `${f.file}:${f.line}`.length));
    console.log(`${'GATE'.padEnd(wGate)}  GRADE  ${'WHERE'.padEnd(wWhere)}  EVIDENCE`);
    for (const f of unique) {
      console.log(`${String(f.gate).padEnd(wGate)}  ${f.grade.padEnd(5)}  ${`${f.file}:${f.line}`.padEnd(wWhere)}  ${f.evidence}`);
      console.log(`${''.padEnd(wGate)}         ${''.padEnd(wWhere)}  fix: ${f.fix}`);
    }
    console.log(`\n${fails} FAIL, ${warns} WARN across ${files.length} file(s).`);
  }
}
process.exit(fails > 0 ? 1 : 0);
