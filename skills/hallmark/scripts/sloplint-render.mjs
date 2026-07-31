#!/usr/bin/env node
/**
 * sloplint-render.mjs - optional render tier for sloplint.mjs (--render).
 *
 * Completes the [M/R] gates with a real browser:
 *   34  horizontal scroll at 320/375/414/768/1280/1920 px widths
 *   49  two-line clickable affordances (a, button, [role=button], nav a)
 *   44  hero fold at 1280x800: first h1 + nearest CTA fully inside the fold
 *   40/41  computed-style contrast for visible text
 *   23  painted accent area at 1280x800 vs the 5% budget (posture-aware)
 *   56  two position:sticky top:0 elements actually overlapping
 *
 * Requires puppeteer-core (optional) plus a Chrome executable at the standard
 * mac path or CHROME_PATH. When either is missing it degrades to a one-line
 * notice and the static checks stand alone.
 *
 * Finding shape matches sloplint.mjs: {gate, grade, file, line, evidence, fix}.
 */

import { existsSync } from 'node:fs';

const WIDTHS = [320, 375, 414, 768, 1280, 1920];
const MAC_CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

export async function renderCheck(htmlFiles, metaIn) {
  const meta = { genre: null, postureByFile: {}, ...(metaIn || {}) };
  let puppeteer;
  try {
    puppeteer = (await import('puppeteer-core')).default;
  } catch {
    console.error('render tier unavailable (puppeteer-core not installed); static checks only');
    return [];
  }
  const chrome = existsSync(MAC_CHROME) ? MAC_CHROME
    : (process.env.CHROME_PATH && existsSync(process.env.CHROME_PATH) ? process.env.CHROME_PATH : null);
  if (!chrome) {
    console.error('render tier unavailable (no Chrome executable found; set CHROME_PATH); static checks only');
    return [];
  }
  const findings = [];
  const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new' });
  try {
    for (const file of htmlFiles) {
      const page = await browser.newPage();
      try {
        await page.goto('file://' + file, { waitUntil: 'networkidle0', timeout: 20000 }).catch(() => {});
        const pageMeta = { genre: meta.genre, posture: meta.postureByFile[file] || 'restrained' };
        for (const width of WIDTHS) {
          await page.setViewport({ width, height: 800 });
          await new Promise((r) => setTimeout(r, 120));
          const res = await page.evaluate(observe, width === 1280, pageMeta);
          for (const f of res) findings.push({ ...f, file, line: 1, evidence: `[${width}px] ${f.evidence}` });
        }
      } catch (e) {
        console.error(`render tier: failed on ${file}: ${e.message}`);
      } finally {
        await page.close().catch(() => {});
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }
  /* dedupe: keep the first width at which each (gate, evidence-tail) fires */
  const seen = new Set();
  return findings.filter((f) => {
    const k = f.gate + '|' + f.evidence.replace(/^\[\d+px\] /, '');
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/* Runs inside the page. checkFold is true only at 1280x800. */
function observe(checkFold, meta) {
  meta = meta || { genre: null, posture: 'restrained' };
  const out = [];
  const push = (gate, grade, evidence, fix) => out.push({ gate: String(gate), grade, evidence, fix });
  const describe = (el) => {
    const cls = (el.className && typeof el.className === 'string') ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '';
    return el.tagName.toLowerCase() + cls;
  };
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };

  /* gate 34: horizontal scroll */
  if (document.documentElement.scrollWidth > window.innerWidth + 1) {
    push(34, 'FAIL', `horizontal scroll: scrollWidth ${document.documentElement.scrollWidth} > viewport ${window.innerWidth}`,
      'overflow-x: clip on html and body; find the overflowing block');
  }

  /* gate 49: two-line clickable affordances */
  for (const el of document.querySelectorAll('a, button, [role="button"], nav a')) {
    if (!visible(el)) continue;
    const text = (el.textContent || '').trim();
    if (!text) continue;
    const rects = el.getClientRects();
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
    const wrapped = rects.length > 1 || el.getBoundingClientRect().height > lh * 1.9;
    if (wrapped && cs.display.includes('inline') && rects.length > 1) {
      push(49, 'FAIL', `clickable "${text.slice(0, 32)}" wraps to ${rects.length} lines (${describe(el)})`,
        'Shorten the label or set nowrap');
    } else if (wrapped && !cs.display.includes('inline')) {
      push(49, 'FAIL', `clickable "${text.slice(0, 32)}" renders two text lines (${describe(el)})`,
        'Shorten the label or set nowrap');
    }
  }

  /* gate 44: hero fold at 1280x800 */
  if (checkFold) {
    const h1 = document.querySelector('h1');
    if (h1 && visible(h1)) {
      const hr = h1.getBoundingClientRect();
      const scope = h1.closest('section, header, main, div') || document.body;
      let cta = null;
      for (const c of scope.querySelectorAll('a, button')) {
        if (visible(c) && (c.textContent || '').trim()) { cta = c; break; }
      }
      const fold = 800;
      if (hr.bottom > fold || hr.top < 0) {
        push(44, 'FAIL', `h1 crosses the 1280x800 fold (bottom ${Math.round(hr.bottom)}px)`,
          'Right-size the display clamp to the fold');
      } else if (cta) {
        const cr = cta.getBoundingClientRect();
        if (cr.bottom > fold) {
          push(44, 'FAIL', `primary CTA below the 1280x800 fold (bottom ${Math.round(cr.bottom)}px)`,
            'Trim hero padding so the CTA fits the fold');
        }
      }
    }
  }

  /* gates 40/41: computed contrast for visible text */
  if (checkFold) {
    const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    const parse = (s) => {
      const m = /rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/.exec(s);
      if (!m) return null;
      return { r: +m[1] / 255, g: +m[2] / 255, b: +m[3] / 255, a: m[4] == null ? 1 : +m[4] };
    };
    const lum = (c) => 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b);
    const ratio = (a, b) => {
      const la = lum(a), lb = lum(b);
      return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
    };
    const bgOf = (el) => {
      let node = el;
      while (node && node !== document.documentElement) {
        const c = parse(getComputedStyle(node).backgroundColor);
        if (c && c.a >= 0.9) return c;
        node = node.parentElement;
      }
      const root = parse(getComputedStyle(document.body).backgroundColor);
      return root && root.a > 0 ? root : { r: 1, g: 1, b: 1, a: 1 };
    };
    let reported = 0;
    const seenSel = new Set();
    for (const el of document.querySelectorAll('body *')) {
      if (reported >= 10) break;
      if (!visible(el)) continue;
      const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 2);
      if (!hasText) continue;
      const cs = getComputedStyle(el);
      const fg = parse(cs.color);
      if (!fg || fg.a < 0.9) continue;
      const bg = bgOf(el);
      const size = parseFloat(cs.fontSize);
      const weight = parseInt(cs.fontWeight, 10) || 400;
      const large = size >= 24 || (size >= 18 && weight >= 700);
      const threshold = large ? 3.0 : 4.5;
      const r = ratio(fg, bg);
      const key = describe(el);
      if (r < threshold - 0.05 && !seenSel.has(key)) {
        seenSel.add(key);
        reported++;
        push(40, 'FAIL', `computed contrast ${r.toFixed(2)}:1 < ${threshold}:1 on ${key}`,
          'Raise the contrast to threshold');
        const btnish = el.closest('a, button, [class*="btn"], [class*="cta"]');
        if (btnish && r < 1.6) {
          push(41, 'FAIL', `button text ~ button fill on ${key} (${r.toFixed(2)}:1)`,
            'Use accent-ink or paper for the label');
        }
      }
    }
  }

  /* gate 23: painted accent area at 1280x800. Runs only when no colour
     posture is declared (a stamped posture is the gate's own carve-out and
     stays judged); dark papers can never match the accent RGB, so the
     dark-theme exception is automatic. Union grid = no double-counting. */
  if (checkFold && meta.posture === 'restrained') {
    const cs0 = getComputedStyle(document.documentElement);
    /* Modern Chrome keeps oklch() in computed values AND in canvas fillStyle
       serialization, so normalize by parsing: hex, rgb/rgba, color(srgb),
       and oklch via the same math sloplint.mjs uses. */
    const oklchToRgb = (L, C, H) => {
      const hr = (H * Math.PI) / 180;
      const a = C * Math.cos(hr), b = C * Math.sin(hr);
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
      const l = l_ ** 3, mm = m_ ** 3, ss = s_ ** 3;
      return [
        4.0767416621 * l - 3.3077115913 * mm + 0.2309699292 * ss,
        -1.2684380046 * l + 2.6097574011 * mm - 0.3413193965 * ss,
        -0.0041960863 * l - 0.7034186147 * mm + 1.7076147010 * ss,
      ].map((c) => {
        const cl = Math.min(1, Math.max(0, c));
        const g = cl <= 0.0031308 ? 12.92 * cl : 1.055 * cl ** (1 / 2.4) - 0.055;
        return Math.round(g * 255);
      });
    };
    const toRgb = (str) => {
      if (!str) return null;
      str = str.trim();
      let m;
      if ((m = /^#([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(str))) {
        const h = m[1];
        return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), m[2] ? parseInt(m[2], 16) / 255 : 1];
      }
      if ((m = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/.exec(str))) {
        return [+m[1], +m[2], +m[3], m[4] == null ? 1 : +m[4]];
      }
      if ((m = /^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\)$/.exec(str))) {
        return [Math.round(+m[1] * 255), Math.round(+m[2] * 255), Math.round(+m[3] * 255), m[4] == null ? 1 : +m[4]];
      }
      if ((m = /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*([\d.]+%?))?\s*\)$/.exec(str))) {
        const L = m[1].endsWith('%') ? parseFloat(m[1]) / 100 : parseFloat(m[1]);
        const alpha = m[4] == null ? 1 : (m[4].endsWith('%') ? parseFloat(m[4]) / 100 : parseFloat(m[4]));
        return [...oklchToRgb(L, parseFloat(m[2]), parseFloat(m[3])), alpha];
      }
      return null;
    };
    const targets = ['--color-accent', '--color-accent-2']
      .map((t) => toRgb(cs0.getPropertyValue(t).trim())).filter(Boolean);
    if (targets.length) {
      const near = (str) => {
        const p = toRgb(str);
        if (!p || p[3] < 0.5) return false; // alpha-thinned tints don't count
        return targets.some((t) => Math.abs(t[0] - p[0]) + Math.abs(t[1] - p[1]) + Math.abs(t[2] - p[2]) <= 30);
      };
      const CW = 16, COLS = Math.ceil(innerWidth / CW), ROWS = Math.ceil(800 / CW);
      const grid = new Uint8Array(COLS * ROWS);
      let walked = 0;
      for (const el of document.querySelectorAll('body, body *')) {
        if (++walked > 4000) break; // perf bound
        if (el !== document.body && !visible(el)) continue;
        const cs = getComputedStyle(el);
        const isBg = near(cs.backgroundColor);
        const isTxt = near(cs.color) && parseFloat(cs.fontSize) >= 32 &&
          [...el.childNodes].some((nd) => nd.nodeType === 3 && nd.textContent.trim());
        if (!isBg && !isTxt) continue;
        const r = el.getBoundingClientRect();
        const x0 = Math.max(0, Math.floor(r.left / CW));
        const x1 = Math.min(COLS - 1, Math.floor((Math.min(r.right, innerWidth) - 1) / CW));
        const y0 = Math.max(0, Math.floor(r.top / CW));
        const y1 = Math.min(ROWS - 1, Math.floor((Math.min(r.bottom, 800) - 1) / CW));
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) grid[y * COLS + x] = 1;
      }
      let filled = 0;
      for (const c of grid) filled += c;
      const pct = (100 * filled) / (COLS * ROWS);
      const warnAt = meta.genre === 'atmospheric' ? 20 : 5;
      const failAt = meta.genre === 'atmospheric' ? 30 : 8;
      if (pct > failAt) {
        push(23, 'FAIL', `accent paints ~${pct.toFixed(1)}% of the 1280x800 viewport (> ${failAt}%)`,
          'Retreat the accent to <= 5%; large colour belongs to paper/field tokens or a declared posture');
      } else if (pct > warnAt) {
        push(23, 'WARN', `accent paints ~${pct.toFixed(1)}% of the 1280x800 viewport`,
          'Confirm this is a declared posture surface, else retreat to <= 5%');
      }
    }
  }

  /* gate 56: double sticky at top 0 */
  if (checkFold) {
    const sticky = [];
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.position === 'sticky' && parseFloat(cs.top) === 0) sticky.push(el);
    }
    if (sticky.length >= 2) {
      push(56, 'FAIL', `two sticky top:0 elements: ${sticky.slice(0, 2).map(describe).join(' + ')}`,
        'Offset the second sticky by banner height');
    }
  }

  return out;
}

/* direct CLI use: node sloplint-render.mjs <html ...> */
if (import.meta.url === `file://${process.argv[1]}`) {
  const htmls = process.argv.slice(2).filter((p) => p.endsWith('.html'));
  const res = await renderCheck(htmls.map((p) => new URL(p, `file://${process.cwd()}/`).pathname));
  console.log(JSON.stringify(res, null, 2));
  process.exit(0);
}
