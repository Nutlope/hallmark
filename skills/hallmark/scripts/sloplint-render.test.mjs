import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';

// Use the production helpers unchanged, with test-only exports in a temporary module.
const dir = mkdtempSync(join(tmpdir(), 'hallmark-render-'));
const source = readFileSync(new URL('./sloplint-render.mjs', import.meta.url), 'utf8');
const modulePath = join(dir, 'render.mjs');
writeFileSync(modulePath, source + '\nexport { pixelBehind, pixelsAroundRing };\n');
const { pixelBehind, pixelsAroundRing } = await import(pathToFileURL(modulePath));
rmSync(dir, { recursive: true, force: true });
const puppeteerPath = process.env.HALLMARK_TEST_PUPPETEER;
const chromePath = process.env.HALLMARK_TEST_CHROME;
const skip = !puppeteerPath || !chromePath ? 'set HALLMARK_TEST_PUPPETEER and HALLMARK_TEST_CHROME for real-browser regressions' : false;

async function withPage(run) {
  const { default: puppeteer } = await import(pathToFileURL(puppeteerPath));
  const browser = await puppeteer.launch({ executablePath: chromePath, headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 400, height: 300 });
    await run(page);
  } finally {
    await browser.close();
  }
}
const styles = (page) => page.$eval('#target', (el) => ({
  properties: [...el.style].sort().map((k) => [k, el.style.getPropertyValue(k), el.style.getPropertyPriority(k)]),
  hasStyle: el.hasAttribute('style'),
  marker: el.getAttribute('data-hm-ring'),
  color: getComputedStyle(el).color,
}));

for (const outcome of ['success', 'screenshot failure', 'small clip']) {
  test(`text pixel probe restores inline styles after ${outcome}`, { skip }, async () => withPage(async (page) => {
    await page.setContent('<body style="background:white"><p id="target" data-hm-probe="1" style="color:#aaa!important;text-shadow:1px 1px red;-webkit-text-stroke-width:2px;text-decoration-color:blue!important">Low contrast text</p>');
    if (outcome === 'small clip') await page.$eval('#target', (el) => { el.style.width = '1px'; el.style.height = '1px'; });
    const before = await styles(page);
    if (outcome === 'screenshot failure') page.screenshot = async () => { throw new Error('fixture screenshot failure'); };
    const result = await pixelBehind(page, 1);
    if (outcome === 'success') assert.deepEqual(result, [1, 1, 1], 'sample the white background with text hidden');
    else assert.equal(result, null);
    assert.deepEqual(await styles(page), before);
  }));
  test(`ring pixel probe restores inline styles after ${outcome}`, { skip }, async () => withPage(async (page) => {
    await page.setContent('<body style="background:white"><button id="target" style="outline-style:dashed!important;box-shadow:0 0 0 2px red!important">Focus</button>');
    await page.focus('#target');
    const rect = await page.$eval('#target', (el) => { const r = el.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    const before = await styles(page);
    if (outcome === 'screenshot failure') page.screenshot = async () => { throw new Error('fixture screenshot failure'); };
    const result = await pixelsAroundRing(page, { rect: outcome === 'small clip' ? { x: 500, y: 500, w: 1, h: 1 } : rect, pad: 4 });
    if (outcome === 'success') assert.deepEqual(result, [1, 1, 1], 'sample the white surrounding pixels with ring hidden');
    else assert.equal(result, null);
    assert.deepEqual(await styles(page), before);
  }));
}

test('text probe preserves absence of an inline style attribute', { skip }, async () => withPage(async (page) => {
  await page.setContent('<p id="target" data-hm-probe="1">Plain text</p>');
  const before = await styles(page);
  await pixelBehind(page, 1);
  assert.deepEqual(await styles(page), before);
}));
