#!/usr/bin/env node
// Screenshots of the real product, for the page that sells it (imagery.md § 4).
//
//   node capture.mjs <url | file.html> [--out <dir>] [--name <prefix>] [--routes /,/pricing]
//                    [--sizes desktop,phone] [--full] [--selector "<css>"] [--wait <ms>]
//                    [--dark] [--scale <1|2>]
//   node capture.mjs --cdp <port> [--target "<window title>"] [--selector "<css>"] [--out <dir>] [--name <prefix>]
//
// --cdp attaches to a desktop app already running with a DevTools port (an Electron app started with
// --remote-debugging-port=<port>, a WebView2 or CEF app) and captures its window as it is.
//
// Opens each route at 1440 x 900 (desktop) and 390 x 844 (phone), waits for fonts and images,
// and writes PNGs into --out (default ./images/screens). It prints, for each file, its size and a
// ready <img> for a data-slot. --selector captures one element (a panel, a chart, a dialog) instead
// of the viewport; --full captures the whole scroll height. It never draws a browser bar or a device
// frame: the page frames the picture in the theme's material.
import { mkdirSync, existsSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const flag = (k, d) => { const i = argv.indexOf(`--${k}`); return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : d; };
const has = (k) => argv.includes(`--${k}`);
const VALUED = new Set(['--out', '--name', '--routes', '--sizes', '--selector', '--wait', '--scale', '--cdp', '--target']);
const target = argv.find((a, i) => !a.startsWith('--') && !VALUED.has(argv[i - 1]));
if (!target && !has('cdp')) {
  console.error('usage: node capture.mjs <url | file.html> [--out <dir>] [--name <prefix>] [--routes /,/pricing] [--sizes desktop,phone] [--full] [--selector "<css>"] [--wait <ms>] [--dark] [--scale 2]');
  process.exit(2);
}
const out = resolve(flag('out', 'images/screens'));
const name = flag('name', 'screen').replace(/[^\w.-]+/g, '-').replace(/^\.+/, '') || 'screen';
const routes = flag('routes', '/').split(',').map((r) => r.trim()).filter(Boolean);
const sizes = flag('sizes', 'desktop,phone').split(',').map((s) => s.trim());
const wait = Number(flag('wait', '600'));
const scale = Number(flag('scale', '2'));
const selector = flag('selector', '');
const SIZES = { desktop: [1440, 900, false], laptop: [1280, 800, false], tablet: [834, 1112, true], phone: [390, 844, true] };

let puppeteer = null;
const roots = [process.env.HALLMARK_PUPPETEER, process.cwd(), HERE].filter(Boolean);
const globalRoot = async () => { try { const { execSync } = await import('node:child_process'); return dirname(execSync('npm root -g', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()); } catch { return null; } };
for (const root of roots) {
  for (const n of ['puppeteer-core', 'puppeteer']) {
    try { puppeteer = (await import(pathToFileURL(createRequire(join(root, 'noop.js')).resolve(n)).href)).default; } catch {}
    if (puppeteer) break;
  }
  if (puppeteer) break;
}
if (!puppeteer) { const g = await globalRoot(); for (const n of ['puppeteer-core', 'puppeteer']) { if (puppeteer || !g) break; try { puppeteer = (await import(pathToFileURL(createRequire(join(g, 'noop.js')).resolve(n)).href)).default; } catch {} } }
if (!puppeteer) { console.error('capture.mjs needs puppeteer-core or puppeteer (local, global or HALLMARK_PUPPETEER). Without it, take the screenshots with the harness or the OS (imagery.md § 4).'); process.exit(1); }
const CHROMES = [process.env.CHROME_PATH, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser', '/snap/bin/chromium', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'];
const findChrome = () => { const c = CHROMES.find((x) => x && existsSync(x)); if (c) return c; try { const b = typeof puppeteer.executablePath === 'function' ? puppeteer.executablePath() : null; if (typeof b === 'string' && existsSync(b)) return b; } catch {} return null; };
const chrome = findChrome();
if (has('cdp')) {
  const port = Number(flag('cdp', ''));
  if (!Number.isInteger(port) || port < 1 || port > 65535) { console.error('--cdp takes the app\'s DevTools port, for example --cdp 9222'); process.exit(2); }
  const want = flag('target', '').toLowerCase();
  const app = await puppeteer.connect({ browserURL: `http://127.0.0.1:${port}`, defaultViewport: null }).catch((e) => { console.error(`no DevTools endpoint on port ${port}: ${e.message}`); process.exit(1); });
  let page = null;
  for (const pg of await app.pages()) { const t = (await pg.title().catch(() => '')).toLowerCase(); if (!want || t.includes(want)) { page = pg; break; } }
  if (!page) { console.error(`no window${want ? ` titled like "${want}"` : ''} on port ${port}`); await app.disconnect(); process.exit(1); }
  mkdirSync(out, { recursive: true });
  const file = join(out, `${name}-app${selector ? '-part' : ''}.png`);
  const el = selector ? await page.$(selector) : null;
  if (selector && !el) { console.error(`no element matches ${selector}`); await app.disconnect(); process.exit(1); }
  await (el || page).screenshot({ path: file });
  const box = el ? await el.boundingBox() : await page.evaluate(() => ({ width: innerWidth, height: innerHeight }));
  const dpr = await page.evaluate(() => devicePixelRatio).catch(() => 1);
  const rel = relative(process.cwd(), file);
  console.log(`${rel}  ${Math.round(box.width * dpr)} x ${Math.round(box.height * dpr)}  (app window)`);
  console.log(`  <img src="${rel}" width="${Math.round(box.width * dpr)}" height="${Math.round(box.height * dpr)}" alt="" loading="lazy">`);
  await app.disconnect();
  process.exit(0);
}
if (!chrome) { console.error('no Chrome or Chromium found; set CHROME_PATH'); process.exit(1); }

const isUrl = /^https?:\/\//i.test(target);
const urlFor = (route) => {
  if (!isUrl) return pathToFileURL(resolve(target)).href;
  const u = new URL(target);
  if (route === '/') return u.href;
  const r = new URL(route, u.origin);
  return r.origin === u.origin ? r.href : null;
};
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({ executablePath: chrome, headless: true });
const made = [];
try {
  for (const route of isUrl ? routes : ['/']) {
    for (const size of sizes) {
      const [w, h, mobile] = SIZES[size] || SIZES.desktop;
      const p = await browser.newPage();
      if (has('dark')) await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'dark' }]);
      await p.setViewport({ width: w, height: h, deviceScaleFactor: scale, isMobile: mobile, hasTouch: mobile });
      const to = urlFor(route);
      if (!to) { console.log(`skip ${route}: not on ${new URL(target).origin}`); await p.close(); continue; }
      const res = await p.goto(to, { waitUntil: 'networkidle2', timeout: 45000 }).catch((e) => ({ err: e.message }));
      if (res && res.err) { console.log(`skip ${route} at ${size}: ${res.err}`); await p.close(); continue; }
      await p.evaluate(async () => { if (document.fonts) await document.fonts.ready; for (const i of document.querySelectorAll('img[loading="lazy"]')) i.loading = 'eager'; await Promise.race([Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; }))), new Promise((r) => setTimeout(r, 6000))]); }).catch(() => {});
      await new Promise((r) => setTimeout(r, wait));
      await p.bringToFront();
      const slug = route === '/' ? 'home' : route.replace(/^\/|\/$/g, '').replace(/[^\w-]+/g, '-');
      const file = join(out, `${name}-${slug}-${size}${selector ? '-part' : ''}.png`);
      let shot;
      if (selector) {
        const el = await p.$(selector);
        if (!el) { console.log(`skip ${route} at ${size}: no element matches ${selector}`); await p.close(); continue; }
        shot = await el.screenshot({ path: file });
      } else shot = await p.screenshot({ path: file, fullPage: has('full') });
      const dims = await p.evaluate((full) => [innerWidth, full ? document.documentElement.scrollHeight : innerHeight], has('full'));
      const box = selector ? await (await p.$(selector)).boundingBox() : { width: dims[0], height: dims[1] };
      made.push({ file, w: Math.round(box.width * scale), h: Math.round(box.height * scale), route, size });
      await p.close();
    }
  }
} finally { await browser.close(); }
for (const m of made) {
  const rel = relative(process.cwd(), m.file);
  console.log(`${rel}  ${m.w} x ${m.h}  (${m.route}, ${m.size})`);
  console.log(`  <img src="${rel}" width="${m.w}" height="${m.h}" alt="" loading="lazy">`);
}
if (!made.length) process.exitCode = 1;
else console.log(`\n${made.length} screenshot${made.length > 1 ? 's' : ''}. Look at each one before placing it: sample data only, nothing personal (names, emails, tokens), the screen in the state that tells the page's story.`);
