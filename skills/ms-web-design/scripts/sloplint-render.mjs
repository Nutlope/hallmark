#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname, basename, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const WIDTHS = [320, 375, 414, 768, 1024, 1280, 1920];
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'];
const isUrl = (t) => /^https?:\/\//.test(t);
const slugOf = (t) => isUrl(t) ? t.replace(/^https?:\/\//, '').replace(/[^\w.-]+/g, '-').replace(/-+$/, '') : basename(t, '.html');

const SHOTS = [];
let SHOT_DIR = 'shots';
const frames = (page) => page.evaluate(async () => { if (document.fonts && document.fonts.status !== 'loaded') await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 3000))]); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); }).catch(() => {});
const settleImages = (page) => page.evaluate(async () => { for (const i of document.querySelectorAll('img[loading="lazy"]')) i.loading = 'eager'; for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); } window.scrollTo(0, 0); const waiting = [...document.images].filter((i) => !i.complete); await Promise.race([Promise.all(waiting.map((i) => new Promise((r) => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }))), new Promise((r) => setTimeout(r, 15000))]); await Promise.all([...document.images].map((i) => (i.complete && i.naturalWidth && i.decode ? i.decode().catch(() => {}) : null))); }).catch(() => {});
function contrast(a, b) {
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const Y = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const x = Y(a), y = Y(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

async function pixelBehind(page, probe) {
  const HIDE = [['color', 'transparent'], ['text-shadow', 'none'], ['-webkit-text-stroke', '0'], ['text-decoration-color', 'transparent']];
  const restore = () => page.evaluate((n, props) => {
    const el = document.querySelector(`[data-hm-probe="${n}"]`);
    if (el) for (const [k] of props) el.style.removeProperty(k);
    window.scrollTo(0, 0);
  }, probe, HIDE).catch(() => {});
  try {
    const rect = await page.evaluate((n, props) => {
      const el = document.querySelector(`[data-hm-probe="${n}"]`);
      if (!el) return null;
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      for (const [k, v] of props) el.style.setProperty(k, v, 'important');
      const r = el.getBoundingClientRect();
      const x = Math.max(0, r.left), y = Math.max(0, r.top);
      return { x: x + scrollX, y: y + scrollY, width: Math.min(r.right, innerWidth) - x, height: Math.min(r.bottom, innerHeight) - y };
    }, probe, HIDE);
    if (!rect || rect.width < 2 || rect.height < 2) { await restore(); return null; }
    await frames(page);
    const data = await page.screenshot({ clip: rect, encoding: 'base64' });
    await restore();
    return await page.evaluate(async (b64) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const x = c.getContext('2d');
      x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      const ch = [[], [], []];
      for (let i = 0; i < d.length; i += 4) { ch[0].push(d[i]); ch[1].push(d[i + 1]); ch[2].push(d[i + 2]); }
      return ch.map((a) => a.sort((p, q) => p - q)[a.length >> 1] / 255);
    }, data);
  } catch { await restore(); return null; }
}

async function shoot(page, file, tag, fullPage) {
  try {
    const dir = isUrl(file) ? join(process.cwd(), '.hallmark', SHOT_DIR) : join(dirname(file), '.hallmark', SHOT_DIR);
    mkdirSync(dir, { recursive: true });
    const ignore = join(dirname(dir), '.gitignore');
    if (!existsSync(ignore)) writeFileSync(ignore, 'shots/\nbefore/\nbefore.json\nbefore.txt\ncompare.html\n');
    const out = join(dir, `${slugOf(file)}-${tag}.png`);
    await page.screenshot({ path: out, fullPage });
    SHOTS.push(out);
  } catch {}
}

export async function renderCheck(htmlFiles, metaIn) {
  const failed = [];
  const meta = { genre: null, postureByFile: {}, heroPostureByFile: {}, photoShapeByFile: {}, jobByFile: {}, stage: 'page', scope: 'page', before: false, ...(metaIn || {}) };
  const heroOnly = meta.stage === 'hero';
  SHOT_DIR = meta.before ? 'before' : 'shots';
  const inventories = {};
  let puppeteer = null;
  const { createRequire } = await import('node:module');
  const tryRoots = async (roots) => {
    for (const root of roots) {
      for (const name of ['puppeteer-core', 'puppeteer']) {
        try {
          const req = createRequire(join(root, 'noop.js'));
          const resolved = req.resolve(name);
          puppeteer = (await import(pathToFileURL(resolved).href)).default;
          if (puppeteer) return;
        } catch {}
      }
    }
  };
  const local = [process.cwd(), dirname(fileURLToPath(import.meta.url))];
  if (process.env.HALLMARK_PUPPETEER) local.unshift(process.env.HALLMARK_PUPPETEER);
  await tryRoots(local);
  if (!puppeteer) {
    try {
      const { execSync } = await import('node:child_process');
      const g = execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
      if (g) await tryRoots([dirname(g)]);
    } catch {}
  }
  if (!puppeteer) {
    const none = []; none.failed = failed; none.notRun = 'no puppeteer-core found locally, globally or via HALLMARK_PUPPETEER';
    return none;
  }
  let chrome = [process.env.CHROME_PATH, ...CHROMES].find((p) => p && existsSync(p)) || null;
  if (!chrome && typeof puppeteer.executablePath === 'function') {
    try { const bundled = puppeteer.executablePath(); if (bundled && existsSync(bundled)) chrome = bundled; } catch {}
  }
  if (!chrome) {
    const none = []; none.failed = failed; none.notRun = 'no Chrome or Chromium found; set CHROME_PATH';
    return none;
  }
  const findings = [];
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
  try {
    for (const file of htmlFiles) {
      const page = await browser.newPage();
      try {
        const scriptErrors = [];
        page.on('pageerror', (e) => scriptErrors.push(String((e && e.message) || e).split('\n')[0]));
        const lost = new Set();
        const lostName = (u) => { try { const x = new URL(u); return x.protocol === 'file:' ? x.pathname.split('/').pop() : x.host; } catch { return String(u).slice(0, 40); } };
        page.on('requestfailed', (r) => { if (['stylesheet', 'font'].includes(r.resourceType())) lost.add(lostName(r.url())); });
        page.on('response', (r) => { try { if (r.status() >= 400 && ['stylesheet', 'font'].includes(r.request().resourceType())) lost.add(lostName(r.url())); } catch {} });
        await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]).catch(() => {});
        const nav = await page.goto(isUrl(file) ? file : pathToFileURL(file).href, { waitUntil: isUrl(file) ? 'networkidle0' : 'load', timeout: 30000 }).then((r) => ({ r }), (e) => ({ e }));
        if (nav.e && !/timeout/i.test(nav.e.message)) throw nav.e;
        if (nav.r && isUrl(file) && !nav.r.ok() && nav.r.status() !== 304) throw new Error(`HTTP ${nav.r.status()} from ${file}`);
        await page.evaluate(async () => {
          document.documentElement.classList.add('hallmark-shot');
          for (const el of [document.documentElement, document.body]) if (el) el.style.setProperty('scroll-behavior', 'auto', 'important');
          const quiet = document.createElement('style');
          quiet.textContent = 'nextjs-portal, astro-dev-toolbar { display: none !important; }';
          document.head.appendChild(quiet);
          if (document.fonts) await document.fonts.ready;
        }).catch(() => {});
        if (isUrl(file)) {
          const stamp = await page.evaluate(async () => { let t = [...document.querySelectorAll('style')].map((x) => x.textContent.slice(0, 4000)).join('\n'); for (const l of document.querySelectorAll('link[rel~="stylesheet"]')) { try { t += '\n' + (await (await fetch(l.href)).text()).slice(0, 4000); } catch {} } return t; }).catch(() => '');
          meta.postureByFile[file] = (/posture:\s*(restrained|committed|full-palette|drenched)/i.exec(stamp)?.[1] || 'restrained').toLowerCase();
          const field = (/hero:\s*([^·*\n]+)/i.exec(stamp) || [])[1] || '';
          let route = ''; try { route = new URL(file).pathname.replace(/\/$/, '') || '/'; } catch {}
          const own = new RegExp(`(settled|banner|poster|ledge|corridor|stage|counter|index)\\s*\\(${route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'i').exec(field);
          meta.photoShapeByFile[file] = /shape:\s*(photographic|portfolio)/i.test(stamp);
          meta.jobByFile[file] = ((/\bjob:\s*([a-z][a-z /-]*)/i.exec(stamp) || [])[1] || '').trim().toLowerCase();
          meta.heroPostureByFile[file] = /theme:\s*custom\b/i.test(stamp) ? 'custom' : ((own || /(settled|banner|poster|ledge|corridor|stage|counter|index)\b/i.exec(field) || [])[1] || '').toLowerCase();
        }
        const pageMeta = { genre: meta.genre, posture: meta.postureByFile[file] || 'restrained' };
        const prefix = heroOnly ? 'hero-' : '';
        for (const width of heroOnly ? [375, 1280] : WIDTHS) {
          await page.setViewport({ width, height: width === 375 && heroOnly ? 812 : 800 });
          await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
          await frames(page);
          if (width === 1280) await shoot(page, file, `${prefix}1280x800`, false);
          if (width === 375 && !heroOnly) { await settleImages(page); await frames(page); }
          if (width === 375) await shoot(page, file, heroOnly ? 'hero-375x812' : '375', !heroOnly);
          if (!heroOnly && (width === 375 || width === 1280)) for (const f of await page.evaluate(lineBreaks).catch(() => [])) findings.push({ ...f, file, line: 1 });
          const res = await page.evaluate(observe, width === 1280, pageMeta);
          const measured = new Map();
          for (const f of res) {
            if (f.probe == null) continue;
            if (!measured.has(f.probe)) measured.set(f.probe, await pixelBehind(page, f.probe));
            const bg = measured.get(f.probe);
            if (!bg) continue;
            const real = contrast(f.fg, bg);
            if (real >= f.threshold - 0.05) f.drop = true;
            else f.evidence = f.evidence.replace(/computed contrast [\d.]+:1/, `contrast ${real.toFixed(2)}:1 against the pixels behind`).replace(/\([\d.]+:1\)$/, `(${real.toFixed(2)}:1)`);
          }
          for (const f of res) if (!f.drop) { const { probe, fg, threshold, drop, ...rest } = f; findings.push({ ...rest, file, line: 1, evidence: `[${width}px] ${f.evidence}` }); }
        }
        for (const [w, h] of [[1440, 900], [1920, 1080]]) {
          await page.setViewport({ width: w, height: h });
          await page.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
          await frames(page);
          await shoot(page, file, `${prefix}${w}x${h}`, false);
          if (!heroOnly && w === 1440) {
            await settleImages(page);
            await shoot(page, file, '1440-full', true);
          }
          await frames(page);
          const res = await page.evaluate(observeSpace, w === 1440, heroOnly, meta.heroPostureByFile[file] || '', !!meta.photoShapeByFile[file], meta.jobByFile[file] || '');
          for (const f of res) findings.push({ ...f, file, line: 1, evidence: `[${w}px] ${f.evidence}` });
        }
        if (!heroOnly) {
          await page.setViewport({ width: 1440, height: 900 });
          await frames(page);
          inventories[file] = await page.evaluate(inventory, (meta.selectors && meta.selectors[file]) || []).catch(() => null);
          const quality = await page.evaluate(observeQuality, meta.scope).catch(() => []);
          const hidden = await page.evaluate(observeOcclusion).catch(() => []);
          for (const f of [...quality, ...hidden]) findings.push({ ...f, file, line: 1, evidence: `[1440px] ${f.evidence}` });
          await page.evaluate(() => { window.scrollTo(0, 0); if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); });
          const rings = new Set();
          const bare = [];
          for (let i = 0; i < 16; i++) {
            await page.keyboard.press('Tab');
            await frames(page);
            const ring = await page.evaluate(focusRing);
            if (!ring || rings.has(ring.key)) continue;
            rings.add(ring.key);
            if (ring.bare) { if (bare.length < 4) bare.push(ring.key); continue; }
            if (ring.ratio != null && ring.ratio < 2.95) { const bg = await pixelsAroundRing(page, ring); if (bg) ring.ratio = contrast(ring.ring, bg); }
            if (ring.ratio != null && ring.ratio < 2.95) findings.push({ gate: '26a', grade: 'FAIL', file, line: 1, evidence: `[1440px] focus ring ${ring.ratio.toFixed(2)}:1 against what is behind it on ${ring.key}`, fix: 'A ring at 3:1 or better against the surface it is drawn over: --color-focus, or a ring colour per band' });
          }
          if (bare.length) findings.push({ gate: '26a', grade: 'FAIL', file, line: 1, evidence: `[1440px] nothing shows keyboard focus on ${bare.join(', ')}`, fix: 'Give every control a :focus-visible ring; never remove an outline without putting one back' });
        }
        if (!heroOnly) {
          await page.setViewport({ width: 1440, height: 900 });
          await frames(page);
          await page.evaluate(() => {
            window.__hmSeen = [...document.querySelectorAll('p, li, h1, h2, h3, h4, dd, td, blockquote, figcaption')].filter((el) => {
              const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
              return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 1 && r.height > 1 && !el.closest('nav, header, dialog, [hidden], [aria-hidden="true"]');
            });
          }).catch(() => {});
          await page.setViewport({ width: 375, height: 800 });
          await frames(page);
          const cut = await page.evaluate(() => {
            const flat = (t) => (t || '').replace(/\s+/g, ' ').trim();
            const shown = flat(document.body.innerText);
            const gone = (window.__hmSeen || []).filter((el) => {
              const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
              if (!(cs.display === 'none' || cs.visibility === 'hidden' || r.width < 1 || r.height < 1)) return false;
              const t = flat(el.textContent);
              return t.length > 12 && !shown.includes(t);
            });
            const off = [...document.querySelectorAll('table')].flatMap((t) => (t.rows[0] ? [...t.rows[0].cells] : [])).filter((el) => { const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1 && r.left >= window.innerWidth - 2; });
            return { words: gone.reduce((n, el) => n + flat(el.textContent).split(' ').length, 0), first: gone[0] ? flat(gone[0].textContent).slice(0, 36) : '', off: off.length, col: off[0] ? flat(off[0].textContent).slice(0, 24) : '' };
          }).catch(() => ({ words: 0, off: 0 }));
          if (cut.words >= 40) findings.push({ gate: 'F25', grade: 'WARN', file, line: 1, evidence: `[375px] ${cut.words} words shown at 1440 are hidden on a phone (first: "${cut.first}")`, fix: 'If it matters, make it work on a phone; if it does not, cut it everywhere' });
          if (cut.off >= 2) findings.push({ gate: 'F25', grade: 'WARN', file, line: 1, evidence: `[375px] a table opens with ${cut.off} columns off-screen (from "${cut.col}")`, fix: 'Keep the column that names the row and the one that acts on it in view: restack each row, or pin the first column' });
        }
        if (scriptErrors.length) findings.push({ gate: 'render', grade: 'FAIL', file, line: 1, evidence: `a script threw on load: ${scriptErrors[0].slice(0, 90)}`, fix: 'Fix the script; a page that throws ships half-working' });
        if (lost.size) findings.push({ gate: 'render', grade: 'WARN', file, line: 1, evidence: `the shots show a fallback: fonts or stylesheets did not load (${[...lost].slice(0, 2).join(', ')})`, fix: 'Recapture when the host answers or the path is right; never review or sign off a fallback face' });
      } catch (e) {
        console.error(`render tier: failed on ${file}: ${e.message}`);
        failed.push({ file, message: e.message });
      } finally {
        await page.close().catch(() => {});
      }
    }
  } finally {
    await browser.close().catch(() => {});
  }
  if (SHOTS.length) console.error(heroOnly ? `render tier: ${SHOTS.length} hero screenshots in ${dirname(SHOTS[0])} (1280x800, 1440x900, 1920x1080 and 375x812 first screens)` : `render tier: ${SHOTS.length} screenshots in ${dirname(SHOTS[0])} (1280x800, 1440x900, 1920x1080 folds; 1440 and 375 full pages)`);

  const seen = new Set();
  const kept = findings.filter((f) => {
    const k = f.file + '|' + f.gate + '|' + f.evidence.replace(/^\[\d+px\] /, '');
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  kept.failed = failed;
  kept.inventories = inventories;
  return kept;
}

export function writeCompare(targets, note) {
  const groups = new Map();
  for (const t of targets) {
    const dir = isUrl(t) ? join(process.cwd(), '.hallmark') : join(dirname(t), '.hallmark');
    if (!groups.has(dir)) groups.set(dir, []);
    groups.get(dir).push(slugOf(t));
  }
  const esc = (x) => String(x).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const made = [];
  for (const [dir, slugs] of groups) {
    const has = (side, slug, tag) => existsSync(join(dir, side, `${slug}-${tag}.png`));
    const pages = slugs.filter((x) => has('before', x, '1440x900') && has('shots', x, '1440x900'));
    if (!pages.length) continue;
    const pair = (slug, tag, label, cls) => (has('before', slug, tag) && has('shots', slug, tag) ? `<div class="pair ${cls}"><figure><img src="before/${esc(slug)}-${tag}.png" alt="${esc(slug)} before, ${label}"><figcaption>Before, ${label}</figcaption></figure><figure><img src="shots/${esc(slug)}-${tag}.png" alt="${esc(slug)} after, ${label}"><figcaption>After, ${label}</figcaption></figure></div>` : '');
    const body = pages.map((x) => `<section><h2>${esc(x)}</h2>${pair(x, '1440x900', 'first screen at 1440', '')}${pair(x, '1440-full', 'whole page at 1440', '')}${pair(x, '375', 'whole page on a phone', 'phone')}</section>`).join('\n');
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Before and after</title>
<meta name="description" content="The redesign's screenshots, before and after, side by side.">
<style>
:root { color-scheme: light; --paper: oklch(97% 0.004 250); --ink: oklch(22% 0.01 250); --muted: oklch(45% 0.01 250); --rule: oklch(86% 0.006 250); }
html, body { overflow-x: clip; }
body { margin: 0; padding: 48px 32px 96px; background: var(--paper); color: var(--ink); font: 16px/1.5 ui-sans-serif, system-ui, sans-serif; }
h1 { margin: 0 0 8px; font-size: 28px; line-height: 1.15; letter-spacing: -0.01em; }
p { margin: 0; color: var(--muted); max-width: 72ch; }
section { margin-top: 72px; }
h2 { margin: 0 0 16px; font-size: 18px; font-weight: 600; }
.pair { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px; align-items: start; margin-bottom: 32px; }
.pair.phone { max-width: 760px; }
figure { margin: 0; }
img { display: block; width: 100%; height: auto; outline: 1px solid var(--rule); outline-offset: -1px; background: oklch(100% 0 0); }
figcaption { margin-top: 8px; font-size: 14px; color: var(--muted); }
@media (max-width: 720px) { body { padding: 32px 16px 64px; } .pair { grid-template-columns: minmax(0, 1fr); } }
</style>
</head>
<body>
<h1>Before and after</h1>
<p>${esc(note || 'Each pair shows the page as it stood and as it stands now, at the same size.')}</p>
${body}
</body>
</html>
`;
    writeFileSync(join(dir, 'compare.html'), html);
    made.push(join(dir, 'compare.html'));
  }
  return made;
}

function inventory(selectors) {
  const base = location.pathname.slice(0, location.pathname.lastIndexOf('/') + 1);
  const key = (raw) => {
    try {
      const u = new URL(raw, location.href);
      if (!/^(https?|file):$/.test(u.protocol)) return raw.trim();
      if (u.origin !== location.origin) return u.href;
      if (u.pathname === location.pathname && u.search === location.search && u.hash) return u.hash;
      return (location.protocol === 'file:' && u.pathname.startsWith(base) ? u.pathname.slice(base.length) : u.pathname) + u.search + u.hash;
    } catch { return raw.trim(); }
  };
  const uniq = (a) => [...new Set(a.filter(Boolean))];
  const text = (el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const quiet = (el) => !!el.closest('script, style, noscript, template');
  const links = uniq([...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => h && h.trim() && h.trim() !== '#').map(key));
  const fieldsIn = (root) => {
    const n = {};
    return uniq([...root.querySelectorAll('input, select, textarea, button[name]')].filter((f) => f.getAttribute('name') || !(f.tagName === 'INPUT' && /^(submit|button|reset|image|hidden)$/i.test(f.getAttribute('type') || ''))).map((f) => {
      const hook = f.getAttribute('data-testid') || f.getAttribute('data-test') || f.getAttribute('data-cy');
      if (f.getAttribute('name')) return f.getAttribute('name');
      if (f.id && !/^(:|radix-|headlessui-|react-aria)/.test(f.id)) return `#${f.id}`;
      if (hook) return `[${hook}]`;
      const t = f.tagName === 'INPUT' ? (f.getAttribute('type') || 'text').toLowerCase() : f.tagName.toLowerCase();
      n[t] = (n[t] || 0) + 1;
      return `unnamed ${t} ${n[t]}`;
    }));
  };
  const fields = fieldsIn(document);
  const actions = uniq([...document.querySelectorAll('form[action]')].map((f) => `${(f.getAttribute('method') || 'get').toLowerCase()} ${key(f.getAttribute('action'))}`));
  const forms = [...document.querySelectorAll('form')].map((f, i) => ({
    key: f.id ? `#${f.id}` : f.getAttribute('action') ? `${(f.getAttribute('method') || 'get').toLowerCase()} ${key(f.getAttribute('action'))}` : `form ${i + 1}`,
    attrs: [`method=${(f.getAttribute('method') || 'get').toLowerCase()}`, f.getAttribute('action') ? `action=${key(f.getAttribute('action'))}` : '', f.hasAttribute('novalidate') ? 'novalidate' : ''].filter(Boolean),
    fields: fieldsIn(f),
    hidden: uniq([...f.querySelectorAll('input[type="hidden"][name]')].map((c) => `${c.getAttribute('name')}=${c.getAttribute('value') || ''}`)),
    submits: f.querySelectorAll('button:not([type]), button[type="submit"], input[type="submit"], input[type="image"]').length,
    controls: uniq([...f.querySelectorAll('button, input, select, textarea')].map((c) => `${c.tagName.toLowerCase()}${c.getAttribute('type') ? `[type=${c.getAttribute('type')}]` : ''}${c.getAttribute('name') ? `[name=${c.getAttribute('name')}]` : ''}`)),
  }));
  const hooked = (selectors || []).filter((x) => { try { return !!document.querySelector(x); } catch { return false; } });
  const headings = uniq([...document.querySelectorAll('h1, h2, h3, h4')].filter((h) => !quiet(h)).map((h) => text(h).toLowerCase().replace(/[\p{Extended_Pictographic}\uFE0F\u200d]/gu, '').replace(/\s+/g, ' ').trim()).filter((t) => t.length > 1));
  const body = text(document.body);
  const figures = uniq((body.match(/[$€£¥]\s?\d[\d,.]*\+?[kKmM]?|\b\d[\d,.]*\s?%|\b\d[\d,.]*[kKmM]?\+(?=\s|$)|\b\d{1,3}(?:,\d{3})+\b|\b\d{1,2}[:.]\d{2}\s?(?:am|pm)?\b|\b(?:19|20)\d{2}\b|\b\d+(?:\.\d+)?\s(?:hours?|minutes?|mins?|days?|weeks?|months?|years?|seconds?|ms|km|kg|g|ml|mm|cm|gb|mb|tb|x)\b|\+?\d[\d\s().-]{7,}\d/gi) || []).map((t) => t.replace(/\s+/g, '').toLowerCase()));
  const images = uniq([...document.querySelectorAll('img[src]')].map((i) => (i.getAttribute('src') || '').split('?')[0].split('/').pop()));
  const controls = document.querySelectorAll('button, [role="button"], input[type="submit"], input[type="button"], select, textarea, input:not([type="hidden"])').length;
  return { links, fields, actions, forms, hooked, headings, figures, images, controls, words: body ? body.split(' ').length : 0 };
}

function focusRing() {
  let el = document.activeElement;
  if (!el || el === document.body || el === document.documentElement) return null;
  const box = el.getBoundingClientRect();
  if (box.width < 4 || box.height < 4) el = (el.labels && el.labels[0]) || el.closest('label') || el.parentElement;
  if (!el) return null;
  el.style.setProperty('transition', 'none', 'important');
  const cs = getComputedStyle(el);
  const key = el.tagName.toLowerCase() + (el.classList[0] ? '.' + el.classList[0] : '') + ((el.textContent || '').trim() ? ` "${el.textContent.trim().slice(0, 18)}"` : '');
  if (cs.outlineStyle === 'none' || !(parseFloat(cs.outlineWidth) > 0)) {
    const active = document.activeElement;
    const chain = []; for (let n = el, i = 0; n && n !== document.body && i < 5; n = n.parentElement, i++) chain.push(n);
    const look = () => chain.flatMap((n) => [null, '::before', '::after'].map((ps) => { const c = getComputedStyle(n, ps); return [c.outlineStyle, c.outlineWidth, c.boxShadow, c.borderTopColor, c.borderBottomColor, c.borderLeftColor, c.borderBottomWidth, c.backgroundColor, c.backgroundImage, c.color, c.textDecorationLine, c.opacity].join('|'); })).join('~');
    const focused = look();
    active.blur();
    const rest = look();
    active.focus({ preventScroll: true });
    return { key, ratio: null, bare: focused === rest };
  }
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgb = (str) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = 'rgba(0, 0, 0, 0)'; cx.fillStyle = str; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255]; };
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const Y = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  let node = parseFloat(cs.outlineOffset) < 0 ? el : el.parentElement;
  let bg = null;
  for (; node && node !== document.documentElement; node = node.parentElement) { const c = rgb(getComputedStyle(node).backgroundColor); if (c[3] >= 0.9) { bg = c; break; } }
  if (!bg) { const b = rgb(getComputedStyle(document.body).backgroundColor); bg = b[3] > 0 ? b : [1, 1, 1, 1]; }
  const ring = rgb(cs.outlineColor);
  if (ring[3] < 0.5) return { key, ratio: null };
  const a = Y(ring), b = Y(bg);
  const r = el.getBoundingClientRect();
  const pad = Math.max(0, parseFloat(cs.outlineOffset)) + parseFloat(cs.outlineWidth) + 3;
  return { key, ring: ring.slice(0, 3), ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05), rect: { x: r.left, y: r.top, w: r.width, h: r.height }, pad };
}

async function pixelsAroundRing(page, ring) {
  try {
    await page.evaluate(() => { let el = document.activeElement; if (el) { const b = el.getBoundingClientRect(); if (b.width < 4 || b.height < 4) el = el.closest('label') || el.parentElement; } if (el) { el.setAttribute('data-hm-ring', ''); el.style.setProperty('outline-style', 'none', 'important'); el.style.setProperty('box-shadow', 'none', 'important'); } });
    await frames(page);
    const vw = await page.evaluate(() => [innerWidth, innerHeight, scrollX, scrollY]);
    const x = Math.max(0, ring.rect.x - ring.pad), y = Math.max(0, ring.rect.y - ring.pad);
    const clip = { x: x + vw[2], y: y + vw[3], width: Math.min(vw[0], ring.rect.x + ring.rect.w + ring.pad) - x, height: Math.min(vw[1], ring.rect.y + ring.rect.h + ring.pad) - y };
    if (clip.width < 4 || clip.height < 4) return null;
    const data = await page.screenshot({ clip, encoding: 'base64' });
    return await page.evaluate(async (b64, inner) => {
      const el = document.querySelector('[data-hm-ring]');
      if (el) { el.removeAttribute('data-hm-ring'); el.style.removeProperty('outline-style'); el.style.removeProperty('box-shadow'); }
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
      const x = c.getContext('2d'); x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      const ch = [[], [], []];
      for (let py = 0; py < c.height; py++) for (let px = 0; px < c.width; px++) {
        if (px >= inner.l && px < inner.r && py >= inner.t && py < inner.b) continue;
        const i = (py * c.width + px) * 4; ch[0].push(d[i]); ch[1].push(d[i + 1]); ch[2].push(d[i + 2]);
      }
      if (!ch[0].length) return null;
      return ch.map((a) => a.sort((p, q) => p - q)[a.length >> 1] / 255);
    }, data, { l: ring.rect.x - x, t: ring.rect.y - y, r: ring.rect.x - x + ring.rect.w, b: ring.rect.y - y + ring.rect.h });
  } catch { return null; }
}

function observe(checkFold, meta) {
  meta = meta || { genre: null, posture: 'restrained' };
  const out = [];
  const push = (gate, grade, evidence, fix, extra) => out.push({ gate: String(gate), grade, evidence, fix, ...(extra || {}) });
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

  if (document.documentElement.scrollWidth > window.innerWidth + 1) {
    push(34, 'FAIL', `horizontal scroll: scrollWidth ${document.documentElement.scrollWidth} > viewport ${window.innerWidth}`,
      'overflow-x: clip on html and body; find the overflowing block');
  }

  if (window.innerWidth === 375) {
    const clipped = (el) => { for (let q = el.parentElement; q && q !== document.body && q !== document.documentElement; q = q.parentElement) { const cs = getComputedStyle(q); if (/hidden|clip|auto|scroll/.test(`${cs.overflowX} ${cs.overflow}`)) return true; } return false; };
    const spill = [...document.querySelectorAll('body *')].find((el) => { if (!visible(el) || getComputedStyle(el).position === 'fixed' || el.closest('svg') || clipped(el)) return false; const r = el.getBoundingClientRect(); return r.right > window.innerWidth + 2 || r.left < -2; });
    if (spill && document.documentElement.scrollWidth <= window.innerWidth + 1) { const r = spill.getBoundingClientRect(); push(34, 'FAIL', `${describe(spill)} runs ${Math.round(Math.max(r.right - window.innerWidth, -r.left))}px past the 375 screen, hidden only by the page's clip`, 'Stack it under 60rem: drop the desktop column gap, widths and offsets on the phone'); }
    for (const sl of document.querySelectorAll('[data-slot]')) { const cs = getComputedStyle(sl); if (cs.display === 'none' || !sl.getClientRects().length || sl.closest('[hidden]')) continue; const r = sl.getBoundingClientRect(); if (r.width < 40 || r.height < 40) { push('F18', 'WARN', `slot "${sl.getAttribute('data-slot')}" renders at ${Math.round(r.width)} x ${Math.round(r.height)}px on a phone`, 'The slot collapsed: give it width: 100% and an aspect-ratio in the stacked layout'); break; } }
    const flush = [...document.querySelectorAll('p, li, h1, h2, h3, blockquote, dd')].find((el) => {
      if (!visible(el) || el.closest('nav, pre, table, [data-slot]')) return false;
      const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim().length >= 20);
      if (own.reduce((n, t) => n + t.textContent.trim().length, 0) < 40) return false;
      let left = Infinity, right = -Infinity;
      for (const t of own) { const range = document.createRange(); range.selectNodeContents(t); for (const r of range.getClientRects()) { if (r.width < 2) continue; left = Math.min(left, r.left); right = Math.max(right, r.right); } }
      return right - left > 120 && right <= window.innerWidth + 1 && (left < 8 || right > window.innerWidth - 8);
    });
    if (flush) push(72, 'REFLEX', `text runs to the edge of the screen (${describe(flush)})`, 'Give the page a gutter: 16px or more at each side on a phone');
  }

  for (const el of document.querySelectorAll('a, button, [role="button"], [role="tab"]')) {
    if (!visible(el)) continue;
    const text = (el.textContent || '').trim();
    if (!text) continue;
    const isButton = el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' || /btn|button|cta/i.test(typeof el.className === 'string' ? el.className : '');
    const block = el.closest('p, li, dd, td, blockquote, figcaption');
    if (!isButton && block && (block.innerText || '').trim().length > text.length + 12) continue;
    if ([...el.querySelectorAll('*')].some((d) => !d.closest('svg') && /^(block|flex|grid|list-item|table)$/.test(getComputedStyle(d).display))) continue;
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
    const tops = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const host = n.parentElement;
      if (!n.textContent.trim() || !host || host.closest('svg')) continue;
      const hr = host.getBoundingClientRect();
      if (hr.width <= 2 || hr.height <= 2) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) if (r.width > 0 && r.height > 0) tops.push(r.top);
    }
    tops.sort((a, b) => a - b);
    let lines = tops.length ? 1 : 0;
    for (let i = 1; i < tops.length; i++) if (tops[i] - tops[i - 1] > lh * 0.6) lines++;
    if (lines > 1) {
      const primary = isButton || (!!el.closest('nav') && !el.closest('footer') && !el.closest('nav[aria-label*="bread" i]'));
      push(primary ? '49a' : '49b', primary ? 'FAIL' : 'REFLEX', `${primary ? 'control' : 'link'} "${text.slice(0, 32)}" wraps to ${lines} lines (${describe(el)})`,
        'Shorten the label or set nowrap');
    }
  }

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
        push('44b', 'FAIL', `h1 crosses the 1280x800 fold (bottom ${Math.round(hr.bottom)}px)`,
          'Right-size the display clamp to the fold');
      } else if (cta) {
        const cr = cta.getBoundingClientRect();
        if (cr.bottom > fold) {
          push('44b', 'FAIL', `primary CTA below the 1280x800 fold (bottom ${Math.round(cr.bottom)}px)`,
            'Trim hero padding so the CTA fits the fold');
        }
      }
    }
  }

  if (checkFold) {
    const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    const cvs = document.createElement('canvas'); cvs.width = cvs.height = 1;
    const ctx2 = cvs.getContext('2d', { willReadFrequently: true });
    const toRgb = (str) => { ctx2.clearRect(0, 0, 1, 1); ctx2.fillStyle = 'rgba(0, 0, 0, 0)'; ctx2.fillStyle = str; ctx2.fillRect(0, 0, 1, 1); const d = ctx2.getImageData(0, 0, 1, 1).data; return { r: d[0] / 255, g: d[1] / 255, b: d[2] / 255, a: d[3] / 255 }; };
    const parse = (s) => {
      if (!s || s === 'transparent') return null;
      const m = /^rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)$/.exec(s.trim());
      if (m) return { r: +m[1] / 255, g: +m[2] / 255, b: +m[3] / 255, a: m[4] == null ? 1 : +m[4] };
      const alpha = /\/\s*([\d.]+%?)\s*\)$/.exec(s);
      const c = toRgb(s);
      if (alpha) c.a = alpha[1].endsWith('%') ? parseFloat(alpha[1]) / 100 : parseFloat(alpha[1]);
      return c;
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
    const over = (top, base) => ({ r: top.r * top.a + base.r * (1 - top.a), g: top.g * top.a + base.g * (1 - top.a), b: top.b * top.a + base.b * (1 - top.a), a: 1 });
    const gradStops = (el, base) => {
      const out = [];
      for (let node = el; node && node !== document.documentElement; node = node.parentElement) {
        const cs2 = getComputedStyle(node);
        if (/gradient/.test(cs2.backgroundImage)) {
          const layers = []; let depth = 0, cur = '';
          for (const ch of cs2.backgroundImage) { if (ch === '(') depth++; if (ch === ')') depth--; if (ch === ',' && depth === 0) { layers.push(cur); cur = ''; } else cur += ch; }
          layers.push(cur);
          const sizes = cs2.backgroundSize.split(',');
          for (const [li, layer] of layers.entries()) {
            const bh = /\s([\d.]+)px\s*$/.exec((sizes[li] || sizes[0] || '').trim()); if (bh && parseFloat(bh[1]) <= 6) continue;
            if (!/^\s*(linear|radial|conic)-gradient/.test(layer) || /[\s,(]\d(?:\.\d+)?px\b/.test(layer)) continue;
            for (const m of layer.matchAll(/(?:oklch|oklab|lab|lch|rgba?|hsla?|color)\([^()]*\)|#[0-9a-fA-F]{3,8}\b/g)) out.push(over(toRgb(m[0]), base));
          }
        }
        const c = parse(cs2.backgroundColor);
        if (c && c.a >= 0.9) break;
      }
      return out;
    };
    let reported = 0;
    const seenSel = new Set();
    for (const el of document.querySelectorAll('body *')) {
      if (reported >= 10) break;
      if (!visible(el) || el.closest('svg')) continue;
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
      const key = describe(el);
      const where = `${key} "${(el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 24)}"`;
      const stops = gradStops(el, bg);
      if (stops.length && !seenSel.has(key)) {
        const rs = stops.map((c) => ratio(fg, c));
        const worst = Math.min(...rs), best = Math.max(...rs);
        if (best < threshold - 0.05) { seenSel.add(key); reported++; push(40, 'FAIL', `contrast ${best.toFixed(2)}:1 at best over the gradient behind ${where}`, 'Raise the contrast to threshold, or give the text its own ground'); }
        else if (worst < threshold - 0.05) { seenSel.add(key); reported++; push(40, 'WARN', `contrast drops to ${worst.toFixed(2)}:1 over the gradient behind ${where}`, 'Check the text where the gradient is darkest or lightest; give the label its own ground'); }
        continue;
      }
      const r = ratio(fg, bg);
      if (r < threshold - 0.05 && !seenSel.has(key)) {
        seenSel.add(key);
        reported++;
        el.setAttribute('data-hm-probe', String(reported));
        const probe = { probe: reported, fg: [fg.r, fg.g, fg.b], threshold };
        push(40, 'FAIL', `computed contrast ${r.toFixed(2)}:1 < ${threshold}:1 on ${where}`,
          'Raise the contrast to threshold', probe);
        const btnish = el.closest('a, button, [class*="btn"], [class*="cta"]');
        if (btnish && r < 1.6) {
          push(41, 'FAIL', `button text ~ button fill on ${key} (${r.toFixed(2)}:1)`,
            'Use accent-ink or paper for the label', probe);
        }
      }
    }
  }

  if (checkFold && meta.posture === 'restrained') {
    const cs0 = getComputedStyle(document.documentElement);

    const cv3 = document.createElement('canvas'); cv3.width = cv3.height = 1;
    const cx3 = cv3.getContext('2d', { willReadFrequently: true });
    const toRgb = (str) => {
      str = (str || '').trim();
      if (!str || str === 'transparent') return null;
      cx3.clearRect(0, 0, 1, 1); cx3.fillStyle = 'rgba(1, 2, 3, 0.5)'; cx3.fillStyle = str;
      if (cx3.fillStyle === 'rgba(1, 2, 3, 0.5)') return null;
      cx3.fillRect(0, 0, 1, 1);
      const d = cx3.getImageData(0, 0, 1, 1).data;
      return [d[0], d[1], d[2], d[3] / 255];
    };
    const targets = ['--color-accent', '--color-accent-2']
      .map((t) => toRgb(cs0.getPropertyValue(t).trim())).filter(Boolean);
    if (targets.length) {
      const near = (str) => {
        const p = toRgb(str);
        if (!p || p[3] < 0.5) return false;
        return targets.some((t) => Math.abs(t[0] - p[0]) + Math.abs(t[1] - p[1]) + Math.abs(t[2] - p[2]) <= 30);
      };
      const CW = 16, COLS = Math.ceil(innerWidth / CW), ROWS = Math.ceil(800 / CW);
      const grid = new Uint8Array(COLS * ROWS);
      let walked = 0;
      for (const el of document.querySelectorAll('body, body *')) {
        if (++walked > 4000) break;
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
        const turned = cs.transform !== 'none' && !/^matrix\(1, 0, 0, 1, /.test(cs.transform);
        for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
          if (turned) { const hit = document.elementFromPoint(x * CW + CW / 2, y * CW + CW / 2); if (!hit || !(hit === el || el.contains(hit))) continue; }
          grid[y * COLS + x] = 1;
        }
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

// F26: a paragraph whose last line is one short word (a straggler), or a head of two or three lines whose last line is a stub
function lineBreaks() {
  const out = [];
  const vis = (el) => { const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) return false; const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  const lines = (el) => {
    const rows = [];
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let t = w.nextNode(); t; t = w.nextNode()) {
      if (!t.textContent.trim() || t.parentElement.closest('svg, [aria-hidden="true"]')) continue;
      const rg = document.createRange(); rg.selectNodeContents(t);
      for (const q of rg.getClientRects()) {
        if (!q.width || !q.height) continue;
        const row = rows.find((x) => Math.abs(x.mid - (q.top + q.height / 2)) < q.height / 3);
        if (row) { row.l = Math.min(row.l, q.left); row.r = Math.max(row.r, q.right); } else rows.push({ mid: q.top + q.height / 2, l: q.left, r: q.right });
      }
    }
    return rows.sort((a, b) => a.mid - b.mid).map((x) => x.r - x.l);
  };
  const bad = [];
  for (const e of document.querySelectorAll('p, li, blockquote, h1, h2, h3')) {
    if (bad.length >= 3 || !vis(e) || e.closest('nav, footer, svg, pre, code, table, [aria-hidden="true"], [data-slot]') || e.querySelector('br')) continue;
    const text = (e.innerText || '').trim(); const words = text.split(/\s+/).length;
    if (words < 4 || e.getBoundingClientRect().width < 200) continue;
    const cs = getComputedStyle(e); const wrap = `${cs.textWrap || ''} ${cs.textWrapStyle || ''}`;
    if (/flex|grid|table/.test(cs.display) || [...e.children].some((c) => /flex|grid|block|table/.test(getComputedStyle(c).display))) continue;
    const ls = lines(e); if (ls.length < 2) continue;
    const last = ls[ls.length - 1], widest = Math.max(...ls), prev = ls[ls.length - 2];
    const head = /^H[123]$/.test(e.tagName);
    if (head && ls.length <= 3 && !/balance/.test(wrap) && last < prev * 0.35) bad.push(`${e.tagName.toLowerCase()} "${text.replace(/\s+/g, ' ').slice(0, 32)}" ends on a stub`);
    else if (!head && !/pretty|balance/.test(wrap) && !/\s/.test(text.split(/\s+/).slice(-1)[0]) && last < widest * 0.3 && ls.length >= 2 && (e.innerText || '').trim().split('\n').pop().trim().split(/\s+/).length === 1) bad.push(`"${text.replace(/\s+/g, ' ').slice(0, 32)}" leaves one word on its last line`);
  }
  if (bad.length) out.push({ gate: 'F26', grade: 'WARN', evidence: `[${innerWidth}px] ${bad.join('; ')}`, fix: 'text-wrap: balance on heads and pretty on body copy, or rewrite the line; a <br> goes only between phrases and is checked at 375' });
  return out;
}

function observeSpace(atLaptop, heroOnly, heroPosture, photoShape, job) {
  const freeFold = /^(poster|ledge|banner|custom)$/.test(heroPosture || '');
  const out = [];
  const push = (gate, grade, evidence, fix) => out.push({ gate: String(gate), grade, evidence, fix });
  const vw = window.innerWidth, vh = window.innerHeight;
  const vis = (el) => { const s = getComputedStyle(el); if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) return false; const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  const abs = (el) => { const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right, w: r.width, h: r.height }; };
  let secs = [...document.querySelectorAll('section, main > div, footer')].filter((s) => vis(s) && s.getBoundingClientRect().height > 40);
  secs = secs.filter((s) => !secs.some((o) => o !== s && o.contains(s)));
  const h1 = document.querySelector('h1');
  const heroish = (el) => /^(SECTION|HEADER)$/.test(el.tagName) || [...el.classList].some((c) => /^hero(-[\w-]+)?$/i.test(c) || /(^|-)hero$/i.test(c));
  let hero = null;
  for (let n = h1; n && n !== document.body; n = n.parentElement) if (heroish(n)) { hero = n; break; }
  hero = hero || [...document.querySelectorAll('section, header, [class]')].find(heroish) || secs[0];
  const heroEnd = hero ? abs(hero).bottom : null;

  let stack = 0, textBox = null, fig = null;
  if (hero && h1) {
    const cta = [...hero.querySelectorAll('a, button')].filter((c) => vis(c) && (c.textContent || '').trim() && !c.closest('nav'))[0];
    const ctaTop = cta ? abs(cta).top : Infinity;
    const texts = [...hero.querySelectorAll('h1, h2, p, small, [class*="sub"], [class*="lede"], [class*="eyebrow"], [class*="kicker"], [class*="label"]')].filter((e) => vis(e) && (e.innerText || '').trim() && !e.closest('nav, svg, table, figure, [data-slot], form, fieldset, label, output, [role="tabpanel"], [role="group"]') && abs(e).top < ctaTop);
    const seen = [];
    for (const e of texts) { if (seen.some((o) => o.contains(e) || e.contains(o))) continue; seen.push(e); }
    stack = seen.length;
    const ink = (el) => { let L = Infinity, T = Infinity, R = -Infinity, B = -Infinity; const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); for (let t = w.nextNode(); t; t = w.nextNode()) { if (!t.textContent.trim() || t.parentElement.closest('svg')) continue; const rg = document.createRange(); rg.selectNodeContents(t); for (const q of rg.getClientRects()) { if (!q.width || !q.height) continue; L = Math.min(L, q.left); T = Math.min(T, q.top); R = Math.max(R, q.right); B = Math.max(B, q.bottom); } } return L === Infinity ? abs(el) : { top: T + scrollY, bottom: B + scrollY, left: L, right: R }; };
    const boxes = [h1, ...seen.filter((e) => Math.abs(abs(e).left - abs(h1).left) < 40)].map(ink);
    textBox = { top: Math.min(...boxes.map((b) => b.top)), bottom: Math.max(...boxes.map((b) => b.bottom), cta ? abs(cta).bottom : 0), left: Math.min(...boxes.map((b) => b.left)), right: Math.max(...boxes.map((b) => b.right)) };
    let bestA = 0;
    const clipped = (el) => { const r = el.getBoundingClientRect(); let L = r.left, T = r.top, R = r.right, B = r.bottom; for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (/hidden|clip/.test(`${cs.overflow} ${cs.overflowX} ${cs.overflowY}`)) { const q = p.getBoundingClientRect(); L = Math.max(L, q.left); T = Math.max(T, q.top); R = Math.min(R, q.right); B = Math.min(B, q.bottom); } } R = Math.min(R, vw); return { top: T + scrollY, bottom: B + scrollY, left: L, right: R, w: Math.max(0, R - L), h: Math.max(0, B - T) }; };
    const beside = (b) => b.left >= textBox.right - 40 || b.right <= textBox.left + 40;
    const consider = (e) => {
      if (!vis(e) || e.closest('nav') || e.contains(h1) || seen.some((t) => e.contains(t))) return;
      const b = clipped(e); const a = b.w * b.h;
      if (b.w > 160 && b.h > 120 && a > bestA && b.w < vw * 0.95 && beside(b)) { fig = b; fig.el = e; bestA = a; }
    };
    for (const e of hero.querySelectorAll('svg, canvas, img, figure, video, picture, [data-slot], [class*="fig"], [class*="visual"], [class*="device"], [class*="demo"], [class*="shot"], [class*="illus"], [class*="panel"]')) consider(e);
    if (!fig) {
      const heroBg = getComputedStyle(hero).backgroundColor;
      for (const e of hero.querySelectorAll('div, span, aside, i, b')) {
        const cs = getComputedStyle(e);
        if (cs.backgroundImage !== 'none' || (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== heroBg) || parseFloat(cs.borderTopWidth) > 0) consider(e);
      }
    }
    if (fig) {
      fig.side = fig.left >= textBox.right - 40 ? 'right' : 'left';
      let lca = h1.parentElement;
      while (lca && !lca.contains(fig.el)) lca = lca.parentElement;
      let col = h1;
      while (col.parentElement && col.parentElement !== lca) col = col.parentElement;
      const cb = abs(col);
      fig.colEdge = fig.side === 'right' ? Math.max(textBox.right, cb.right) : Math.min(textBox.left, cb.left);
    }
  }

  if (atLaptop) {

    const words = [];
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      const p = n.parentElement; if (!p || !vis(p) || p.closest('script, style, noscript, svg, [data-slot], [data-credits]')) continue;
      const t = n.textContent.trim(); if (!t) continue;
      const pr = p.getBoundingClientRect(); const c = t.split(/\s+/).filter((w) => /[A-Za-z]{2,}/.test(w)).length; if (c) words.push({ top: pr.top + scrollY, bottom: pr.bottom + scrollY, c });
    }
    const H = document.documentElement.scrollHeight;
    let maxWords = 0, at = 0;
    for (let y = 0; y < H; y += 50) { const w = Math.round(words.reduce((a, x) => { const h = Math.max(1, x.bottom - x.top); const ov = Math.max(0, Math.min(x.bottom, y + 900) - Math.max(x.top, y)); return a + x.c * Math.min(1, ov / h); }, 0)); if (w > maxWords) { maxWords = w; at = y; } }
    if (maxWords > 95) push(58, 'FAIL', `${maxWords} words on one screen (from y=${at})`, 'One idea per screen: cut to about 80 words, make the section an object');
    else if (maxWords > 80) push(58, 'WARN', `${maxWords} words on one screen (from y=${at})`, 'Close to the 80-word screen budget');
    if (stack > 2) push(58, 'FAIL', `hero carries ${stack} text blocks before its actions`, 'Headline, one sentence, actions; delete the rest');

    const clipAbs = (el, stop) => { const r0 = el.getBoundingClientRect(); let T = r0.top, B = r0.bottom; for (let q = el.parentElement; q && q !== document.body; q = q.parentElement) { const cs = getComputedStyle(q); if (/hidden|clip/.test(`${cs.overflow} ${cs.overflowY}`)) { const qr = q.getBoundingClientRect(); T = Math.max(T, qr.top); B = Math.min(B, qr.bottom); } if (q === stop) break; } return { top: T + scrollY, bottom: B + scrollY }; };
    const content = (s) => { let top = Infinity, bottom = -Infinity; for (const c of s.querySelectorAll('*')) { if (!vis(c)) continue; if (!(c.innerText || '').trim() && !/^(SVG|IMG|CANVAS|VIDEO)$/.test(c.tagName) && getComputedStyle(c).backgroundColor === 'rgba(0, 0, 0, 0)') continue; if (c.children.length && ![...c.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && !/^(SVG)$/.test(c.tagName) && getComputedStyle(c).backgroundColor === 'rgba(0, 0, 0, 0)') continue; const b = clipAbs(c, s); if (b.bottom <= b.top) continue; top = Math.min(top, b.top); bottom = Math.max(bottom, b.bottom); } if (top === Infinity) { const b = abs(s); return b; } return { top, bottom }; };
    // a paper is a colour or a painted image (a gradient, a split ground), whichever the nearest box sets
    const paperOf = (el) => { for (let q = el; q; q = q.parentElement) { const cs = getComputedStyle(q), c = cs.backgroundColor; if (/gradient|url\(/.test(cs.backgroundImage)) return `${c}|${cs.backgroundImage}`; if (!/^(transparent|rgba\(0, 0, 0, 0\))$/.test(c)) return c; } return 'none'; };
    const gaps = [], shifts = [];
    for (let i = 0; !heroOnly && i < secs.length - 1; i++) { gaps.push(Math.round(content(secs[i + 1]).top - content(secs[i]).bottom)); shifts.push(paperOf(secs[i]) !== paperOf(secs[i + 1])); }
    const real = gaps.filter((g) => g > -50);
    const short = gaps.filter((g, i) => g > -50 && g < (shifts[i] ? 64 : 112));
    if (real.length) {
      const min = short.length ? Math.min(...short) : Infinity;
      if (short.length) push(59, 'REFLEX', `smallest gap between sections is ${min}px (gaps: ${real.join(', ')})`, '120px or more between sections, by the --section-gap steps');
      else if (real.length > 2 && new Set(real).size === 1) push(59, 'REFLEX', `every section gap is ${min}px`, 'Vary the rhythm across --section-gap-s, --section-gap and --section-gap-l');
    }
    if (!heroOnly && secs.length > 9) push(59, 'WARN', `${secs.length} sections`, 'Six to nine sections a page, hero and footer included; merge or cut');
    else if (!heroOnly && secs.length < 5) push(77, 'WARN', `${secs.length} sections, hero and footer included`, 'A landing strip, not a page: six to nine sections, five on a thin prompt (layout.md § 3)');
    if (!heroOnly) {
      for (const sl of document.querySelectorAll('[data-slot]')) {
        const cs = getComputedStyle(sl);
        if (cs.display === 'none' || cs.visibility === 'hidden' || !sl.getClientRects().length || sl.closest('[hidden]')) continue;
        const r = sl.getBoundingClientRect();
        if (r.width < 40 || r.height < 40) { push('F18', 'WARN', `slot "${sl.getAttribute('data-slot')}" renders at ${Math.round(r.width)} x ${Math.round(r.height)}px`, 'The slot collapsed: give it a width from its track and a real aspect-ratio, never a percentage of a shrink-to-fit parent'); break; }
      }
      for (const e of document.querySelectorAll('p, li, dd, td, th, h2, h3, h4, figcaption, blockquote')) {
        if (!vis(e) || e.closest('nav, svg, [aria-hidden="true"]')) continue;
        const t = (e.innerText || '').trim();
        if (t.length < 24) continue;
        const cs = getComputedStyle(e);
        const fs = parseFloat(cs.fontSize) || 16;
        const lh = parseFloat(cs.lineHeight) || fs * 1.4;
        const r = e.getBoundingClientRect();
        if (r.width < fs * 8 && r.height / lh >= 3.6) { push('F17', 'WARN', `"${t.slice(0, 28)}" squeezed to ${Math.round(r.width)}px wide over ${Math.round(r.height / lh)} lines (${e.tagName.toLowerCase()}${e.classList[0] ? '.' + e.classList[0] : ''})`, 'A grid placement or a span ran wide; give the text its column back'); break; }
      }
    }

    const nameOf = (e) => `${e.tagName.toLowerCase()}${e.getAttribute('data-slot') ? `[data-slot=${e.getAttribute('data-slot')}]` : e.classList[0] ? '.' + e.classList[0] : ''}`;
    const dataish = /chart|graph|plot|spark|map|diagram|logo|wordmark|brand|icon|flag|qr|avatar/i;
    const drawn = [];
    for (const svg of document.querySelectorAll('svg')) {
      if (!vis(svg) || svg.parentElement.closest('svg')) continue;
      const r = svg.getBoundingClientRect();
      if (r.width < 120 || r.height < 120) continue;
      let named = false;
      for (let q = svg; q && q !== document.body && !named; q = q.parentElement) named = dataish.test(`${typeof q.className === 'string' ? q.className : (q.className && q.className.baseVal) || ''} ${q.id || ''} ${q.getAttribute('aria-label') || ''} ${q.getAttribute('data-kind') || ''}`);
      if (named || svg.querySelector('text')) continue;
      const shapes = [...svg.querySelectorAll('path, ellipse, circle, polygon')];
      const curvy = shapes.filter((s) => s.tagName === 'ellipse' || s.tagName === 'circle' && parseFloat(s.getAttribute('r') || 0) > 6 || /[CcQqSsAa]/.test(s.getAttribute('d') || '')).length;
      const fills = new Set(shapes.map((s) => getComputedStyle(s).fill).filter((f) => f && f !== 'none'));
      if (curvy >= 3 || (shapes.length >= 6 && fills.size >= 3)) drawn.push(`${nameOf(svg.parentElement || svg)} (${Math.round(r.width)}x${Math.round(r.height)}, ${shapes.length} shapes)`);
    }
    if (drawn.length) push(80, 'REFLEX', `drawn illustration: ${drawn.slice(0, 3).join('; ')}`, 'A photograph (theme.mjs photos), the product built, or type at scale; SVG is for icons, logos and labelled charts or diagrams (imagery.md § 7)');

    const empty = [];
    const shows = (box) => {
      const b = box.getBoundingClientRect();
      let area = 0;
      for (const m of box.querySelectorAll('img, video, picture, canvas, iframe, svg')) { if (!vis(m) || (m.tagName.toLowerCase() === 'svg' && m.parentElement.closest('svg'))) continue; if (m.tagName === 'IMG' && !(m.getAttribute('src') || m.getAttribute('srcset') || '').trim()) continue; const q = m.getBoundingClientRect(); area += q.width * q.height; if (area >= b.width * b.height * 0.25) return true; }
      const bits = [...box.querySelectorAll('*')].filter((e) => vis(e) && ((e.innerText || '').trim() || /^(INPUT|SELECT|TEXTAREA|BUTTON)$/.test(e.tagName)) && !e.children.length);
      return bits.length >= 4 || (box.innerText || '').trim().length >= 80 || box.matches('[data-kind="product"]') || !!box.closest('[data-kind="product"]');
    };
    for (const sl of document.querySelectorAll('[data-slot]')) { if (!vis(sl) || sl.closest('[hidden]')) continue; const r = sl.getBoundingClientRect(); if (r.width < 160 || r.height < 120) continue; if (!shows(sl)) empty.push(`${nameOf(sl)} ${Math.round(r.width)}x${Math.round(r.height)}`); }
    for (const e of document.querySelectorAll('div, figure, span, i, aside')) {
      if (e.hasAttribute('data-slot') || e.closest('[data-slot]') || !vis(e)) continue;
      const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
      if (r.width < 300 || r.height < 200 || r.width > vw * 0.9 || !/gradient/.test(cs.backgroundImage) || /url\(/.test(cs.backgroundImage)) continue;
      if ((e.innerText || '').trim().length > 60 || e.querySelector('img, video, canvas, svg, picture, input, table')) continue;
      if (!shows(e)) empty.push(`${nameOf(e)} ${Math.round(r.width)}x${Math.round(r.height)}, a gradient with nothing in it`);
    }
    if (empty.length) push(81, 'REFLEX', `${empty.length} empty picture${empty.length > 1 ? 's' : ''}: ${empty.slice(0, 3).join('; ')}`, 'Put the picture in: the user\'s image, a library photograph (theme.mjs photos) or the product built at full fidelity; the wash is only a loading colour (imagery.md § 3)');

    const marks = [];
    const colourOf = (e) => { const cs = getComputedStyle(e); return e instanceof SVGElement ? `${cs.fill}|${cs.stroke}` : `${cs.backgroundColor}|${cs.borderTopColor}|${cs.color}`; };
    for (const p of document.querySelectorAll('*')) {
      if (p.children.length < 24 || !vis(p)) continue;
      const kids = [...p.children].filter((k) => !/^(defs|title|desc|style|script)$/i.test(k.tagName));
      if (kids.length < 24) continue;
      const small = kids.filter((k) => { const q = k.getBoundingClientRect(); return !(k.textContent || '').trim() && q.width > 0 && q.height > 0 && ((q.width <= 24 && q.height <= 48) || q.width <= 6 || q.height <= 6); });
      if (small.length < 24 || small.length < kids.length * 0.8) continue;
      const tally = new Map(); for (const k of small) { const c = colourOf(k); tally.set(c, (tally.get(c) || 0) + 1); }
      if (Math.max(...tally.values()) < small.length * 0.6 || tally.size > 4) continue;
      const sizes = small.map((k) => { const q = k.getBoundingClientRect(); return Math.round(q.width) * 1000 + Math.round(q.height); });
      const common = Math.max(...[...new Set(sizes)].map((s) => sizes.filter((x) => x === s).length));
      if (common < small.length * 0.7) continue;
      if (marks.some((m) => m.el.contains(p) || p.contains(m.el))) continue;
      marks.push({ el: p, text: `${nameOf(p)} holds ${small.length} identical marks` });
    }
    const ONE_FOR_EACH = /\bone (?:mark|dot|stroke|tick|line|square|bar|cell|pin|block|circle|seed|bead|stripe|notch)s? (?:for|per) (?:each|every)\b/i;
    const ONE_FOR_EACH_BARE = /\bone (?:for|per) (?:each|every)\b/i;
    for (const e of document.querySelectorAll('[aria-label], figcaption, svg title, p, small, span')) {
      if (marks.length >= 2) break;
      const t = `${e.getAttribute('aria-label') || ''} ${(e.textContent || '').length < 160 ? e.textContent : ''}`;
      const counting = ONE_FOR_EACH.test(t) || (ONE_FOR_EACH_BARE.test(t) && (e.matches('figcaption') || (e.getAttribute('aria-label') && e.closest('svg, figure, [role="img"]'))));
      if (counting && !marks.some((m) => m.el.contains(e))) marks.push({ el: e, text: `"${t.trim().slice(0, 60)}"` });
    }
    if (marks.length) push(82, 'REFLEX', `counting device: ${marks.slice(0, 2).map((m) => m.text).join('; ')}`, 'Set the number in type at the size it deserves; never one mark for each thing (imagery.md § 7)');

    if (heroEnd != null) {
      const foot = [...document.querySelectorAll('body footer, [role="contentinfo"]')].filter(vis).pop();
      const docH = foot ? Math.min(document.documentElement.scrollHeight, abs(foot).top) : document.documentElement.scrollHeight, from = Math.max(heroEnd, vh);
      const box = document.querySelector('.container') || document.body;
      const cw = Math.min(box.getBoundingClientRect().width || vw, vw);
      let area = 0, n = 0;
      const seenA = [];
      const add = (el) => { if (!vis(el) || el.closest('footer') || seenA.some((o) => o.contains(el))) return; const b = abs(el); const top = Math.max(b.top, from), bot = Math.min(b.bottom, docH); if (bot - top < 80 || b.w < 160) return; seenA.push(el); area += (bot - top) * Math.min(b.w, cw); n++; };
      for (const m of document.querySelectorAll('img, video')) { if (m.closest('[data-kind="product"], [data-product]')) continue; const nw = m.naturalWidth || m.videoWidth || 0; if (m.tagName === 'IMG' && /\.svg(\?|$)/i.test(m.currentSrc || m.src || '')) continue; if (m.tagName === 'IMG' && nw && nw < 200) continue; add(m); }
      for (const e of document.querySelectorAll('section *, main *')) { const bi = getComputedStyle(e).backgroundImage; if (/url\(/.test(bi) && !/svg|data:image\/svg/i.test(bi)) add(e); }
      const share = area / Math.max(1, (docH - from) * cw);
      if (share > (photoShape ? 0.45 : 0.36) && n >= 3) push(83, 'REFLEX', `photographs cover ${Math.round(share * 100)}% of the page below the hero (${n} pictures${photoShape ? ', a photograph-led shape' : ''})`, 'Balance the page: cut or shrink pictures until they cover a quarter to a third of it, and carry the freed sections in type, figures, the product or a list (imagery.md § 5)');
    }
    if (heroEnd != null && !/subscribe|join|attend|listen|visit|newsletter|waitlist/.test(job || '')) {
      const foot = [...document.querySelectorAll('body footer, [role="contentinfo"]')].filter(vis).pop();
      const before = foot ? secs.filter((x) => x !== foot && abs(x).bottom <= abs(foot).top + 2).pop() : secs[secs.length - 1];
      // a form whose submit books, asks or requests is the job's own action, not a mailing list
      const asks = (f) => { const t = [...f.querySelectorAll('button, input[type=submit]')].map((b) => b.innerText || b.value || '').join(' '); return /\b(book|enquir|inquir|request|contact|walkthrough|demo|quote|reserve|apply|start|create|order|buy|download|try)/i.test(t) && !/newsletter|updates|subscribe|the list|mailing/i.test(t); };
      const signup = (box) => box && [...box.querySelectorAll('form, [role="form"]')].find((f) => { if (asks(f)) return false; const fields = [...f.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=checkbox]):not([type=radio]), textarea, select')].filter(vis); return fields.length >= 1 && fields.length <= 2 && fields.some((x) => x.type === 'email' || /e-?mail/i.test(`${x.name} ${x.id} ${x.placeholder} ${x.getAttribute('autocomplete') || ''}`)); });
      const hit = signup(before) || signup(foot);
      if (hit) push(85, 'REFLEX', `the page closes on an email sign-up${job ? ` on a ${job} page` : ' and the stamp names no job'}`, 'End on what the visitor came to do (the booking, the buy box, the download, the next date, the latest issue) or on the last strong section; an email close is for a subscribe or join page, and the stamp says job: (anatomy.md)');
    }

    let heroFoot = null;
    if (hero && !/^(poster|ledge)$/.test(heroPosture || '')) {
      const hb = abs(hero);
      let cTop = Infinity, cBottom = -Infinity;
      for (const c of hero.querySelectorAll('*')) {
        // the site nav is not hero content; a nav lower in the hero (a band of section links) is
        const nv = c.closest('nav');
        if (!vis(c) || (nv && abs(nv).top <= hb.top + 220) || c === hero) continue;
        const cs = getComputedStyle(c);
        const painted = (c.innerText || '').trim() || /^(SVG|IMG|CANVAS|VIDEO|PICTURE)$/.test(c.tagName) || cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none' || parseFloat(cs.borderTopWidth) > 0;
        if (!painted || /fixed|sticky/.test(cs.position)) continue;
        const b = abs(c); cTop = Math.min(cTop, b.top); cBottom = Math.max(cBottom, Math.min(b.bottom, hb.bottom));
      }
      let navBottom = hb.top;
      for (const n of document.querySelectorAll('header, nav, [class*="nav"], [class*="bar"]')) { if (!vis(n) || hero.contains(n) && !/fixed|sticky/.test(getComputedStyle(n).position)) continue; const cs = getComputedStyle(n); const b = abs(n); if ((/fixed|sticky/.test(cs.position) || hero.contains(n)) && b.top <= hb.top + 40 && b.bottom < hb.top + 220) navBottom = Math.max(navBottom, b.bottom); }
      const after = secs.find((x) => x !== hero && !hero.contains(x) && abs(x).top >= hb.bottom - 4);
      const bottomEdge = after ? Math.min(content(after).top, hb.bottom + 240) : hb.bottom;
      const topPad = cTop - navBottom, bottomPad = bottomEdge - cBottom;
      if (heroPosture !== 'custom' && isFinite(topPad) && isFinite(bottomPad) && topPad > 24 && bottomPad < topPad - 8) push('44a', 'REFLEX', `hero content sits low: ${Math.round(topPad)}px above it, ${Math.round(bottomPad)}px below`, 'Centre the content in its screen: the space below 1.0 to 1.5 times the space above (a Ledge sits low on purpose; say Ledge in the stamp)');
      heroFoot = { cBottom, navBottom };
    }
    if (heroEnd != null && !freeFold) {
      if (heroEnd > vh + 8) push('44c', 'REFLEX', `hero runs past the 1440x900 fold (hero ends at ${Math.round(heroEnd)}px)`, 'Size the display and the visual so the hero is one screen');
      else if (heroEnd < vh * 0.84 && secs.length > 1) push('44c', 'REFLEX', `hero ends at ${Math.round(heroEnd)}px of a 900px screen`, 'Fill the first screen with the visual or the headline, not with copy');
    }
    if (fig && textBox && !freeFold) {
      const off = Math.round((fig.top + fig.bottom) / 2 - (textBox.top + textBox.bottom) / 2);
      const gap = Math.round(fig.side === 'right' ? fig.left - fig.colEdge : fig.colEdge - fig.right);
      const edge = Math.round(fig.side === 'right' ? vw - fig.right : fig.left);
      if (Math.abs(off) > 60) push('44c', 'REFLEX', `hero visual centre is ${off}px from the text block centre`, 'Align the visual beside the text');
      const inkGap = Math.round(fig.side === 'right' ? fig.left - textBox.right : textBox.left - fig.right);
      if (inkGap > 240 && gap <= 120) push('44c', 'REFLEX', `hero text ends ${inkGap}px short of its visual`, 'Widen the text column or bring the visual in: the text and the visual stand 48 to 120px apart (layout.md § 6)');
      if (gap > 120 || (edge < 8 && gap > 48 && heroPosture !== 'stage')) push('44c', 'REFLEX', `hero visual sits ${gap}px from the text and ${edge}px from the viewport edge`, 'Bring the visual to within 48 to 120px of the text; never pin it to the corner');
    }

    if (heroFoot && hero && isFinite(heroFoot.cBottom)) {
      const hb = abs(hero);
      const after = secs.find((x) => x !== hero && !hero.contains(x) && abs(x).top >= hb.bottom - 4);
      const nextTop = after ? content(after).top : Infinity;
      const band = Math.round(Math.min(vh, nextTop) - heroFoot.cBottom);
      if (heroFoot.cBottom < vh && band > 160) push(79, 'REFLEX', `${band}px of nothing between the hero's last content (y ${Math.round(heroFoot.cBottom)}) and ${nextTop < vh ? 'the next section' : 'the fold'}`, 'Centre the content in the screen and grow the visual or the head (layout.md § 6); never fill it with copy');
    }

    if (!heroOnly) {
      const below = secs.filter((x) => x !== hero && !(hero && (hero.contains(x) || x.contains(hero))) && x.tagName !== 'FOOTER' && !x.closest('footer, nav') && (!hero || abs(x).top >= abs(hero).bottom - 4));
      const leavesOf = (root) => {
        const out = [];
        const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
        for (let t = w.nextNode(); t; t = w.nextNode()) { if (!t.textContent.trim()) continue; const p = t.parentElement; if (!p || !vis(p) || p.closest('script, style, noscript')) continue; const rg = document.createRange(); rg.selectNodeContents(t); for (const q of rg.getClientRects()) if (q.width > 1 && q.height > 1) out.push({ top: q.top + scrollY, bottom: q.bottom + scrollY, left: q.left, right: q.right }); }
        for (const e of root.querySelectorAll('*')) {
          if (!vis(e) || (e.closest('svg') && e.tagName.toLowerCase() !== 'svg')) continue;
          const cs = getComputedStyle(e);
          const painted = /^(IMG|SVG|CANVAS|VIDEO|PICTURE|IFRAME|INPUT|TEXTAREA|SELECT|TABLE)$/i.test(e.tagName) || e.hasAttribute('data-slot') || cs.backgroundImage !== 'none' || cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0) + (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.borderRightWidth) || 0) >= 2;
          if (!painted) continue;
          const b = e.getBoundingClientRect(); if (b.width * b.height < 64 || (b.width > vw * 0.97 && !/^(IMG|PICTURE|VIDEO|CANVAS|SVG)$/i.test(e.tagName) && !e.hasAttribute('data-slot'))) continue;
          out.push({ top: b.top + scrollY, bottom: b.bottom + scrollY, left: b.left, right: b.right });
        }
        return out;
      };
      // content a rail scrolls past the screen's edge does not widen the page's measure
      const span = (ls) => ls.filter((b) => b.right > 0 && b.left < vw).reduce((a, b) => ({ left: Math.min(a.left, Math.max(0, b.left)), right: Math.max(a.right, Math.min(vw, b.right)) }), { left: Infinity, right: -Infinity });
      const all = span([...(hero ? [hero] : []), ...below].flatMap(leavesOf));
      const W = all.right - all.left;
      const h1fs = h1 ? parseFloat(getComputedStyle(h1).fontSize) : 0;
      const heads = below.flatMap((x) => [...x.querySelectorAll('h2')]).filter((h) => vis(h) && !h.closest('nav, footer'));
      if (heads.length) {
        const sizes = heads.map((h) => parseFloat(getComputedStyle(h).fontSize)).sort((a, b) => a - b);
        const med = sizes[Math.floor(sizes.length / 2)];
        if (med < 40) push(78, 'REFLEX', `section heads render at ${Math.round(med)}px${h1fs ? ` under a ${Math.round(h1fs)}px hero head` : ''}`, 'h2 at --text-section (about 52px at 1440), item titles at --text-title (layout.md § 2)');
      }
      const thin = [];
      let bands = 0;
      if (W > 400) for (const sec of below) {
        const ls = leavesOf(sec);
        if (!ls.length) continue;
        const u = span(ls);
        const wPct = (Math.min(u.right, all.right) - Math.max(u.left, all.left)) / W;
        const words = (sec.innerText || '').split(/\s+/).filter((x) => /[A-Za-z0-9]/.test(x)).length;
        let mass = false, statement = false;
        const secBg = getComputedStyle(sec).backgroundColor;
        for (const e of sec.querySelectorAll('img, svg, canvas, video, picture, figure, iframe, [data-slot]')) { if (!vis(e) || (e.tagName.toLowerCase() === 'svg' && e.closest('[data-slot], figure') && e.closest('[data-slot], figure') !== e)) continue; if (e.getBoundingClientRect().height >= 300) { mass = true; break; } }
        if (!mass) for (const e of sec.querySelectorAll('div, article, aside, ul, ol, dl, table, form, a')) {
          if (!vis(e)) continue;
          const cs = getComputedStyle(e); const r = e.getBoundingClientRect();
          const filled = (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== secBg) || cs.backgroundImage !== 'none' || (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0) + (parseFloat(cs.borderLeftWidth) || 0) + (parseFloat(cs.borderRightWidth) || 0) >= 2;
          if (filled && r.height >= 240 && r.width >= W * 0.35 && r.width < vw * 0.97) { mass = true; break; }
        }
        if (!mass) for (const t of sec.querySelectorAll('table, ul, ol, dl, div, [class]')) {
          if (!vis(t)) continue;
          if (t.tagName === 'TABLE') { const r = t.getBoundingClientRect(); if (t.querySelectorAll('tr').length >= 4 && r.width >= W * 0.6) { mass = true; break; } continue; }
          const kids = [...t.children].filter((k) => vis(k) && k.getBoundingClientRect().height > 20);
          if (kids.length < 3) continue;
          const rs = kids.map((k) => k.getBoundingClientRect());
          const across = rs.every((r) => Math.abs(r.top - rs[0].top) < 12) && new Set(rs.map((r) => Math.round(r.left))).size === rs.length;
          const spread = Math.max(...rs.map((r) => r.right)) - Math.min(...rs.map((r) => r.left));
          const tall = Math.max(...rs.map((r) => r.bottom)) - Math.min(...rs.map((r) => r.top));
          if ((across && spread >= W * 0.7) || (!across && spread >= W * 0.4 && tall >= 120)) { mass = true; break; }
        }
        if (!mass && [...sec.querySelectorAll('input:not([type=hidden]), select, textarea')].filter(vis).length >= 2) mass = true;
        for (const e of sec.querySelectorAll('h2, h3, p, blockquote, h2 span, p span, div, output, [contenteditable]')) { if (!vis(e) || (/^(DIV|OUTPUT)$/.test(e.tagName) && ![...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()))) continue; const cs = getComputedStyle(e); const fs = parseFloat(cs.fontSize); const lh = parseFloat(cs.lineHeight) || fs * 1.15; const r = e.getBoundingClientRect(); const n = (e.innerText || '').split(/\s+/).filter(Boolean).length; if ((fs >= 40 && n <= 40 && r.height >= lh * 1.8 && r.width >= W * 0.5) || fs >= 72) { statement = true; break; } }
        if (statement) mass = true;
        const painted = getComputedStyle(sec).backgroundColor !== 'rgba(0, 0, 0, 0)' || getComputedStyle(sec).backgroundImage !== 'none';
        if (!mass && painted && words <= 40 && sec.querySelector('a, button, form') && !bands) { bands++; continue; }
        if ((wPct < 0.72 && !statement) || !mass) thin.push(`${(sec.querySelector('h2, h3') || {}).innerText ? `"${sec.querySelector('h2, h3').innerText.trim().slice(0, 28)}"` : sec.tagName.toLowerCase() + (sec.className && typeof sec.className === 'string' ? '.' + sec.className.trim().split(/\s+/)[0] : '')} (${Math.round(wPct * 100)}% wide${mass ? '' : ', no mass'})`);
      }
      if (thin.length) push(77, 'REFLEX', `${thin.length} thin section${thin.length > 1 ? 's' : ''}: ${thin.slice(0, 3).join('; ')}`, 'Widen the body to ten of twelve columns and give it mass: a visual 300px tall or more, a set of three across, rows, or a statement (layout.md § 4 and § 5)');
    }
  } else {

    if (textBox && textBox.left < 120) push('44d', 'FAIL', `hero text starts ${Math.round(textBox.left)}px from the edge at 1920`, 'Cap the container at 1360 to 1520px and centre it');
    if (heroEnd != null && heroEnd > vh + 8) push('44d', 'FAIL', `hero runs past the 1920x1080 screen (hero ends at ${Math.round(heroEnd)}px)`, 'Cap vw-sized visuals and display sizes');
    const inkWidth = (e) => { const range = document.createRange(); range.selectNodeContents(e); return range.getBoundingClientRect().width; };
    const wide = [...document.querySelectorAll('p, h1, h2, h3, li')].filter((e) => vis(e) && !e.querySelector('p, h1, h2, h3, h4, div, figure, ul, ol, table, section') && (e.innerText || '').trim().length > 40 && inkWidth(e) > 1600);
    if (wide.length) push('44d', 'FAIL', `${wide.length} text block${wide.length > 1 ? 's run' : ' runs'} wider than 1600px at 1920 (first: ${wide[0].tagName.toLowerCase()} "${(wide[0].innerText || '').trim().slice(0, 28)}")`, 'Cap the container; hold the measure');
  }
  return out;
}

function observeQuality(scope) {
  const out = [];
  const push = (gate, grade, evidence, fix) => out.push({ gate: String(gate), grade, evidence, fix });
  const vis = (el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false; const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
  const name = (el) => el.tagName.toLowerCase() + (el.classList && el.classList[0] ? '.' + el.classList[0] : '');
  const abs = (r) => ({ top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right });
  const clear = (c) => /^(transparent|rgba\(0, 0, 0, 0\))$/.test(c);
  const quiet = (el) => !!el.closest('script, style, noscript, [aria-hidden="true"], dialog:not([open])') || !!(el.parentElement && el.parentElement.closest('svg'));
  const all = [...document.body.querySelectorAll('*')].filter((el) => !quiet(el) && vis(el));

  const boxes = [];
  for (const el of all) {
    const media = /^(IMG|svg|CANVAS|VIDEO|PICTURE|IFRAME|INPUT|BUTTON|SELECT|TEXTAREA)$/.test(el.tagName) || el.hasAttribute('data-slot');
    if (!media && ![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
    boxes.push({ el, ...abs(el.getBoundingClientRect()) });
  }
  const overlapX = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 8;
  const crowded = [];
  for (const h of document.querySelectorAll('h2, h3, h4')) {
    if (!vis(h) || quiet(h) || h.closest('nav, footer, table, [data-slot]')) continue;
    let small = false;
    for (let p = h.parentElement; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (!clear(cs.backgroundColor) || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none') { small = p.getBoundingClientRect().height < 200; break; }
    }
    if (small) continue;
    const hb = abs(h.getBoundingClientRect());
    let above = null, below = null;
    for (const b of boxes) {
      if (h.contains(b.el) || b.el.contains(h) || !overlapX(b, hb)) continue;
      if (b.bottom <= hb.top + 1 && (!above || b.bottom > above.bottom)) above = b;
      if (b.top >= hb.bottom - 1 && (!below || b.top < below.top)) below = b;
    }
    if (!above || !below) continue;
    const up = hb.top - above.bottom, down = below.top - hb.bottom;
    if (down < 6 || down > 160) continue;
    if (up < 0.75 * down && down - up >= 12) crowded.push(`${name(h)} "${(h.innerText || '').trim().slice(0, 18)}" ${Math.round(up)}px over, ${Math.round(down)}px under`);
  }
  if (crowded.length >= 2) push(71, 'REFLEX', `heads nearer what precedes them than what they head: ${crowded.slice(0, 2).join('; ')}`, 'At least twice the space above a head as below it');

  const tight = [];
  for (const el of all) {
    if (tight.length >= 3) break;
    if (/^(SECTION|MAIN|HEADER|FOOTER|NAV|ARTICLE|INPUT|TEXTAREA|SELECT|svg|IMG|TABLE|THEAD|TBODY|TR|TD|TH|PRE|CODE|IFRAME|VIDEO|CANVAS|DIALOG)$/.test(el.tagName) || el.closest('[data-slot], table')) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 100 || r.height <= 30 || r.width > innerWidth * 0.9) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'inline') continue;
    if (/auto|scroll/.test(cs.overflowX + cs.overflowY)) continue;
    const bw = ['Top', 'Right', 'Bottom', 'Left'].map((k) => parseFloat(cs[`border${k}Width`]) || 0);
    const inked = (k) => bw[k] >= 1 && !clear(cs[`border${['Top', 'Right', 'Bottom', 'Left'][k]}Color`]);
    let under = 'rgb(255, 255, 255)';
    for (let p = el.parentElement; p; p = p.parentElement) { const c = getComputedStyle(p).backgroundColor; if (!clear(c)) { under = c; break; } }
    const filled = !clear(cs.backgroundColor) && cs.backgroundColor !== under;
    if (!filled && !(inked(1) && inked(3))) continue;
    const sides = ['left', 'right', 'top', 'bottom'];
    let L = Infinity, T = Infinity, Rr = -Infinity, B = -Infinity, fs = parseFloat(cs.fontSize) || 16;
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let t = walk.nextNode(); t; t = walk.nextNode()) {
      const host = t.parentElement;
      if (!t.textContent.trim() || !host || host.closest('svg') || !vis(host)) continue;
      let nested = false;
      for (let p = host; p && p !== el; p = p.parentElement) {
        const ps = getComputedStyle(p);
        if (/absolute|fixed/.test(ps.position) || (!clear(ps.backgroundColor) && ps.backgroundColor !== cs.backgroundColor) || (parseFloat(ps.borderTopWidth) >= 1 && parseFloat(ps.borderLeftWidth) >= 1)) { nested = true; break; }
      }
      if (nested) continue;
      const rg = document.createRange(); rg.selectNodeContents(t);
      const hf = parseFloat(getComputedStyle(host).fontSize) || 16; const trim = hf >= 40 ? 0.2 * hf : 0;
      for (const q of rg.getClientRects()) { if (!q.width || !q.height) continue; L = Math.min(L, q.left); T = Math.min(T, q.top + trim); Rr = Math.max(Rr, q.right); B = Math.max(B, q.bottom - trim); fs = parseFloat(getComputedStyle(host).fontSize) || fs; }
    }
    if (L === Infinity) continue;
    const side = Math.max(8, Math.min(0.5 * fs, 24)) - 0.5, end = Math.max(4, Math.min(0.3 * fs, 12)) - 0.5;
    const inset = { left: L - (r.left + bw[3]), right: r.right - bw[1] - Rr, top: T - (r.top + bw[0]), bottom: r.bottom - bw[2] - B };
    const short = Object.entries(inset).filter(([k, v]) => sides.includes(k) && v < (k === 'left' || k === 'right' ? side : end));
    if (short.length) tight.push(`${name(el)} ${short.map(([k, v]) => `${k} ${Math.round(v)}px`).join(', ')}`);
  }
  if (tight.length) push(72, 'REFLEX', `text crowds the edge of its box: ${tight.join('; ')}`, 'Pad the box: max(8px, 0.5em) at the sides, max(4px, 0.3em) above and below');

  const controls = all.filter((el) => (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button' || (el.tagName === 'A' && /btn|button|cta/i.test(String(el.className))) || (el.tagName === 'INPUT' && /^(submit|button|text|email|search|tel|url|password|number)$/.test(el.type))) && !el.closest('nav, header, dialog, [role="dialog"], [data-slot], [role="tablist"]') && (el.tagName === 'INPUT' || (el.innerText || '').trim()));
  const offSize = controls.map((el) => ({ el, h: el.getBoundingClientRect().height })).filter((c) => c.h > 8 && (c.h < (scope === 'app' ? 30 : 42) || c.h > 54));
  if (offSize.length) push('39b', 'REFLEX', `control height outside ${scope === 'app' ? '32 to 52px' : '44 to 52px'}: ${offSize.slice(0, 3).map((c) => `${name(c.el)} ${Math.round(c.h)}px`).join(', ')}`, 'Marketing controls stand 44 to 52px; app UI 32 to 40px with a 44px hit target');

  const long = [];
  for (const el of all) {
    if (long.length >= 2 || el.tagName !== 'P' || el.closest('nav, footer, table, figure, [data-slot]')) continue;
    const t = (el.innerText || '').replace(/\s+/g, ' ').trim();
    if (t.length < 240) continue;
    const cs = getComputedStyle(el);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.4;
    let cols = 1; for (let q = el; q && q !== document.body && cols === 1; q = q.parentElement) { const qc = getComputedStyle(q); if (qc.columnCount !== 'auto' || qc.columnWidth !== 'auto') cols = Math.max(1, Math.round(q.getBoundingClientRect().width / Math.max(1, el.getClientRects()[0]?.width || q.getBoundingClientRect().width))); }
    const lines = Math.round(el.getBoundingClientRect().height / lh) * cols;
    if (lines >= 3 && t.length / lines > 88) long.push(`${name(el)} about ${Math.round(t.length / lines)} characters a line`);
  }
  if (long.length) push(25, 'REFLEX', `running prose set too wide: ${long.join(', ')}`, 'Cap the measure at 45 to 75ch');

  const tiles = all.find((g) => {
    if (g.closest('nav, footer, form, table')) return false;
    const kids = [...g.children].filter(vis);
    if (kids.length < 3 || kids.length > 4) return false;
    const rects = kids.map((k) => k.getBoundingClientRect());
    if (rects.some((r) => Math.abs(r.top - rects[0].top) > 4 || r.width < 160) || Math.max(...rects.map((r) => r.width)) > Math.min(...rects.map((r) => r.width)) * 1.04) return false;
    return kids.every((k) => {
      const head = k.querySelector('h2, h3, h4');
      if (!head) return false;
      const icon = [...k.querySelectorAll('svg, img, [class*="icon"], span, div, i')].find((n) => {
        if (n.contains(head) || head.contains(n)) return false;
        const r = n.getBoundingClientRect();
        const glyph = (n.textContent || '').trim();
        const iconish = n.tagName === 'svg' || n.tagName === 'IMG' || /icon/i.test(String(n.className && n.className.baseVal != null ? n.className.baseVal : n.className)) || (glyph.length > 0 && glyph.length <= 2 && /\p{Extended_Pictographic}/u.test(glyph));
        const media = n.tagName === 'svg' || n.tagName === 'IMG';
        return iconish && r.height > 8 && r.height <= 96 && (!media || r.width <= 96) && r.bottom <= head.getBoundingClientRect().top + 2;
      });
      return !!icon;
    });
  });
  if (tiles) push(3, 'REFLEX', `equal columns of icon-above-heading tiles (${name(tiles)})`, 'Vary the widths, set the icon inline with the heading, or drop the icons');

  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgb = (s) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = 'rgba(0, 0, 0, 0)'; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return [d[0] / 255, d[1] / 255, d[2] / 255, d[3] / 255]; };
  const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const lum = (c) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
  const ratio = (a, b) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
  const over = (c, b) => [0, 1, 2].map((i) => c[i] * c[3] + b[i] * (1 - c[3]));
  const bgOf = (n) => { for (; n && n !== document.documentElement; n = n.parentElement) { const c = rgb(getComputedStyle(n).backgroundColor); if (c[3] >= 0.9) return c; } const b = rgb(getComputedStyle(document.body).backgroundColor); return b[3] > 0 ? b : [1, 1, 1, 1]; };
  const weak = [];
  for (const f of all.filter((el) => /^(TEXTAREA|SELECT)$/.test(el.tagName) || (el.tagName === 'INPUT' && /^(text|email|search|tel|url|password|number|date|time)$/.test(el.type)))) {
    const fh = f.getBoundingClientRect().height;
    const around = bgOf(f.parentElement);
    let best = ratio(over(rgb(getComputedStyle(f).backgroundColor), around), around);
    for (let n = f, d = 0; n && d < 3 && n.getBoundingClientRect().height <= fh + 48; n = n.parentElement, d++) {
      const cs = getComputedStyle(n); const back = d ? bgOf(n.parentElement) : around;
      for (const s of ['Top', 'Right', 'Bottom', 'Left']) if (parseFloat(cs[`border${s}Width`]) >= 1 && cs[`border${s}Style`] !== 'none') best = Math.max(best, ratio(over(rgb(cs[`border${s}Color`]), back), back));
      for (const m of (cs.boxShadow || '').matchAll(/((?:rgba?|oklch|oklab|color)\([^)]*\)|#[0-9a-f]{3,8})\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+([\d.]+)px\s+(-?[\d.]+)px/gi)) if (+m[4] === 0 && (+m[5] >= 1 || Math.abs(+m[3]) >= 1)) best = Math.max(best, ratio(over(rgb(m[1]), back), back));
    }
    if (best < 2.95) weak.push(`${name(f)} ${best.toFixed(2)}:1`);
  }
  if (weak.length) push(40, 'FAIL', `a field's edge is under 3:1 against what surrounds it: ${weak.slice(0, 3).join(', ')}`, 'Draw the field in --color-muted, or fill it a step off the surface it sits on');

  const weights = new Map();
  const strained = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = tw.nextNode(); t; t = tw.nextNode()) {
    const host = t.parentElement; const txt = t.textContent.trim();
    if (!txt || !host || quiet(host) || host.closest('svg') || !vis(host)) continue;
    const hs = getComputedStyle(host);
    const w = Math.round((parseFloat(hs.fontWeight) || 400) / 100) * 100;
    weights.set(w, (weights.get(w) || 0) + txt.length);
    if (strained.length >= 4 || txt.length < 3 || host.closest('sup, sub, [data-slot], figure svg') || strained.some((x) => x.el === host)) continue;
    const size = parseFloat(hs.fontSize) || 16;
    const prose = !!host.closest('p, li, dd, blockquote') && txt.length > 60 && size < 28;
    const lh = parseFloat(hs.lineHeight);
    if (size < 11 || (prose && size < 12)) strained.push({ el: host, why: `${name(host)} at ${Math.round(size * 10) / 10}px` });
    else if (prose && lh && lh / size < 1.3 && host.getBoundingClientRect().height > lh * 2.2) strained.push({ el: host, why: `${name(host)} leaded ${(lh / size).toFixed(2)}` });
  }
  if (strained.length) push(75, 'REFLEX', `text that strains the eye: ${strained.map((x) => x.why).join(', ')}`, 'Running text 12px or more (16px for body), functional text 11px or more, multi-line prose leaded 1.3 or more');
  const dead = [...document.querySelectorAll('img')].filter((el) => !quiet(el) && el.complete && el.naturalWidth === 0 && (el.currentSrc || el.getAttribute('src')));
  if (dead.length) push(76, 'FAIL', `an image that does not load: ${dead.slice(0, 3).map((el) => (el.getAttribute('src') || '').split('/').pop().slice(0, 40)).join(', ')}`, 'Point it at a file that exists, make it a data-slot placeholder, or remove it');
  const used = [...weights].filter(([, n]) => n >= 30).map(([w]) => w).sort((a, b) => a - b);
  if (used.length > 3) push('F19', 'WARN', `${used.length} font weights in running use (${used.join(', ')})`, 'Three weights at most, display and body together, picked as extremes');

  for (const g of all) {
    const cs = getComputedStyle(g);
    const grid = /grid/.test(cs.display);
    const wrap = /flex/.test(cs.display) && cs.flexWrap === 'wrap' && cs.flexDirection.startsWith('row');
    if ((!grid && !wrap) || g.closest('nav, footer, form')) continue;
    const kids = [...g.children].filter((c) => vis(c) && !/absolute|fixed/.test(getComputedStyle(c).position));
    if (kids.length < 3) continue;
    const rects = kids.map((c) => c.getBoundingClientRect());
    if (grid && Math.max(...rects.map((r) => r.width)) > Math.min(...rects.map((r) => r.width)) * 1.15) continue;
    if (wrap && !kids.every((c) => c.querySelector('img, svg') || /^(IMG|svg)$/.test(c.tagName) || c.getBoundingClientRect().width >= 120)) continue;
    const rows = [];
    for (const r of rects) { const row = rows.find((x) => Math.abs(x.top - r.top) < 4); if (row) row.n++; else rows.push({ top: r.top, n: 1 }); }
    rows.sort((a, b) => a.top - b.top);
    if (rows.length >= 2 && rows[rows.length - 1].n === 1 && rows[rows.length - 2].n >= 2) { push('F20', 'WARN', `${name(g)} leaves one item alone on its last row (${rows.map((x) => x.n).join(' + ')})`, 'Change the count or the columns so the last row is not an orphan'); break; }
  }
  return out;
}

async function observeOcclusion() {
  const out = [];
  const vis = (el) => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) return false; const r = el.getBoundingClientRect(); return r.width > 3 && r.height > 3; };
  const pinned = (el) => { for (let p = el; p && p !== document.body; p = p.parentElement) if (/fixed|sticky/.test(getComputedStyle(p).position)) return true; return false; };
  const unseen = (el) => { const cs = getComputedStyle(el); return parseFloat(cs.opacity) < 0.05 || (/^(transparent|rgba\(0, 0, 0, 0\))$/.test(cs.backgroundColor) && cs.backgroundImage === 'none' && !(el.innerText || '').trim() && !/^(IMG|svg|CANVAS|VIDEO|PICTURE)$/.test(el.tagName) && !el.querySelector('img, svg, canvas, video')); };
  const runs = [];
  let total = 0, hidden = 0;
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let t = tw.nextNode(); t; t = tw.nextNode()) {
    const host = t.parentElement; const txt = t.textContent.trim();
    if (!txt || !host || host.closest('script, style, noscript, svg, [aria-hidden="true"], nav, header, dialog, [popover], [role="menu"], details:not([open]), [hidden]')) continue;
    if (getComputedStyle(host).display === 'none') continue;
    total += txt.length;
    let gone = false;
    for (let p = host; p && p !== document.body; p = p.parentElement) { const cs = getComputedStyle(p); if (cs.display === 'none') { gone = null; break; } if (cs.visibility === 'hidden' || parseFloat(cs.opacity) === 0) gone = true; }
    if (gone === null) { total -= txt.length; continue; }
    if (gone) { hidden += txt.length; continue; }
    if (!host.closest('[data-slot]') && vis(host)) runs.push({ t, host });
  }
  if (total > 500 && hidden > 150 && hidden / total > 0.3) out.push({ gate: '62', grade: 'FAIL', evidence: `${Math.round((100 * hidden) / total)}% of the page's text is still hidden after load`, fix: 'Visible by default: scope the hidden state under a .js class, or show the end state under reduced motion' });
  const bad = [];
  const H = document.documentElement.scrollHeight;
  for (let y = 0; y < H && bad.length < 3; y += Math.max(200, innerHeight - 100)) {
    window.scrollTo(0, y);
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    for (const { t, host } of runs) {
      if (bad.length >= 3) break;
      if (pinned(host)) continue;
      const rg = document.createRange(); rg.selectNodeContents(t);
      for (const q of rg.getClientRects()) {
        if (q.width < 6 || q.height < 6) continue;
        const cx = q.left + q.width / 2, cy = q.top + q.height / 2;
        if (cy < 0 || cy >= innerHeight || cx < 0 || cx >= innerWidth) continue;
        const ghost = getComputedStyle(host).pointerEvents === 'none'; if (ghost) host.style.setProperty('pointer-events', 'auto', 'important');
        const top = document.elementFromPoint(cx, cy);
        if (ghost) host.style.removeProperty('pointer-events');
        if (!top || top === host || host.contains(top) || top.contains(host) || pinned(top) || unseen(top)) continue;
        const tr = top.getBoundingClientRect();
        if (!(cx >= tr.left && cx <= tr.right && cy >= tr.top && cy <= tr.bottom)) {
          const clearPseudo = (ps) => /^(none|normal)$/.test(ps.content) || (/^(transparent|rgba\(0, 0, 0, 0\))$/.test(ps.backgroundColor) && ps.backgroundImage === 'none');
          if (clearPseudo(getComputedStyle(top, '::after')) && clearPseudo(getComputedStyle(top, '::before'))) continue;
        }
        bad.push(`${top.tagName.toLowerCase()}${top.classList[0] ? '.' + top.classList[0] : ''} over "${t.textContent.trim().slice(0, 16)}"`);
        break;
      }
    }
  }
  window.scrollTo(0, 0);
  if (bad.length) out.push({ gate: '73', grade: 'FAIL', evidence: `text painted under another element: ${bad.join('; ')}`, fix: 'Give the text its own space, or put it above what covers it on a surface of its own' });
  return out;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const htmls = process.argv.slice(2).filter((p) => p.endsWith('.html'));
  const res = await renderCheck(process.argv.slice(2).filter((p) => isUrl(p)).concat(htmls.map((p) => resolve(process.cwd(), p))));
  console.log(JSON.stringify(res, null, 2));
  process.exit(0);
}
