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
writeFileSync(modulePath, source + '\nexport { pixelBehind, pixelsAroundRing, navigationDisclosures };\n');
const { pixelBehind, pixelsAroundRing, navigationDisclosures } = await import(pathToFileURL(modulePath));
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
    assert.equal(browser.browserContexts().length, 1, 'disposable contexts must be closed');
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

const disclosure = (handler = '', buttonAttrs = '', panelAttrs = '') => `<!doctype html><html lang="en"><head><title>Navigation test</title><style>[hidden]{display:none!important}button{min-height:44px}</style></head><body><nav aria-label="Main"><button type="button" id="toggle" aria-controls="panel" aria-expanded="false" ${buttonAttrs}>Menu</button><div id="panel" hidden ${panelAttrs}><a href="#content">Content</a></div></nav><main id="content">Content</main><script>const b=document.querySelector('button'), p=document.querySelector('#panel'); b.onclick=()=>{${handler}};</script></body></html>`;
const working = `p.hidden=false;b.setAttribute('aria-expanded','true');`;
async function checkDisclosure(page, html) {
  await page.setContent(html);
  const findings = await navigationDisclosures(page);
  return findings;
}
for (const [name, handler, reason] of [
  ['working', working, null],
  ['inert', '', 'did not open'],
  ['ARIA only', `b.setAttribute('aria-expanded','true')`, 'did not open'],
  ['panel only', 'p.hidden=false', 'aria-expanded'],
  ['animated', `p.style.opacity='0';p.hidden=false;p.style.transition='opacity .15s';setTimeout(()=>{p.style.opacity='1';b.setAttribute('aria-expanded','true')},100)`, null],
]) test(`navigation disclosure: ${name}`, { skip }, async () => withPage(async page => {
  const found = await checkDisclosure(page, disclosure(handler));
  if (reason) { assert.equal(found.length, 1); assert.equal(found[0].gate, '26d'); assert.equal(found[0].grade, 'FAIL'); assert.match(found[0].evidence, new RegExp(reason)); }
  else assert.deepEqual(found, []);
  assert.equal(await page.$eval('#toggle', b => b.getAttribute('aria-expanded')), 'false', 'original page untouched');
  assert.equal(await page.$eval('#panel', p => p.hidden), true);
}));
test('navigation disclosure: missing target', { skip }, async () => withPage(async page => {
  const found = await checkDisclosure(page, disclosure().replace('aria-controls="panel"', 'aria-controls="missing"'));
  assert.equal(found.length, 1); assert.match(found[0].evidence, /missing/);
}));
for (const [name, html] of [
  ['outside navigation', disclosure().replace('<nav aria-label="Main">', '<div>').replace('</nav>', '</div>')],
  ['non-navigation target', disclosure().replace('<a href="#content">Content</a>', '<p>Details</p>')],
  ['hidden button', disclosure('', 'hidden')],
  ['disabled button', disclosure('', 'disabled')],
  ['inert navigation', disclosure().replace('<nav ', '<nav inert ')],
  ['form button', disclosure().replace('<nav ', '<form><nav ').replace('</nav>', '</nav></form>')],
  ['submit button', disclosure().replace('type="button"', 'type="submit"')],
  ['associated form', disclosure('', 'form="owner"').replace('<main', '<form id="owner"></form><main')],
  ['disabled fieldset', disclosure().replace('<nav ', '<fieldset disabled><nav ').replace('</nav>', '</nav></fieldset>')],
  ['already expanded', disclosure().replace('aria-expanded="false"', 'aria-expanded="true"')],
  ['widget role', disclosure('', 'role="tab"')],
]) test(`navigation disclosure skips ${name}`, { skip }, async () => withPage(async page => {
  assert.deepEqual(await checkDisclosure(page, html), []);
}));
for (const [name, handler] of [
  ['request', `fetch('https://example.invalid/action').catch(()=>{})`],
  ['popup', `window.open('https://example.invalid/')`],
  ['navigation', `location.href='https://example.invalid/'`],
  ['link activation', `const a=document.createElement('a');a.href='https://example.invalid/';a.target='_blank';document.body.append(a);a.click()`],
  ['direct form submission', `const f=document.createElement('form');f.action='https://example.invalid/';document.body.append(f);f.submit()`],
]) test(`navigation disclosure blocks ${name}`, { skip }, async () => withPage(async page => {
  const found = await checkDisclosure(page, disclosure(handler));
  assert.equal(found.length, 1); assert.equal(found[0].grade, 'WARN');
  assert.match(found[0].evidence, /not evaluated/);
  assert.equal(page.url(), 'about:blank');
}));

test('navigation disclosure reports unavailable isolation as WARN', async () => {
  let attempted = false;
  const found = await navigationDisclosures({
    evaluate: async () => [{ exists: true, key: 'button#menu', index: 0 }],
    viewport: () => ({ width: 375 }),
    createCDPSession: async () => ({ send: async method => method === 'Runtime.evaluate' ? { result: {} } : {}, detach: async () => {} }),
    browser: () => ({ createBrowserContext: async () => { attempted = true; throw new Error('unavailable'); } }),
  });
  assert.equal(attempted, true);
  assert.equal(found.length, 1); assert.equal(found[0].grade, 'WARN');
});

async function withDisclosureServer(htmlFor, run) {
  const { createServer } = await import('node:http');
  let analytics = 0;
  const server = createServer((req, res) => {
    if (req.url === '/analytics') { analytics++; res.writeHead(204); res.end(); return; }
    res.setHeader('Content-Type', 'text/html'); res.end(htmlFor());
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  try { await run(`http://127.0.0.1:${server.address().port}`, () => analytics); }
  finally { server.closeAllConnections(); await new Promise(r => server.close(r)); }
}
for (const delayed of [false, true]) test(`HTTP disclosure ${delayed ? 'hydrates after 500ms' : 'has an inert handler'}`, { skip }, async () => withPage(async page => {
  const html = delayed ? disclosure().replace('b.onclick=()=>{}', `setTimeout(()=>{b.addEventListener('click',()=>{${working}})},500)`) : disclosure();
  await withDisclosureServer(() => html, async origin => {
    await page.goto(origin);
    const found = await navigationDisclosures(page);
    if (delayed) assert.deepEqual(found, []);
    else { assert.equal(found.length, 1); assert.equal(found[0].grade, 'FAIL'); }
  });
}));
for (const [name, css, fail] of [
  ['clipped', '#panel{clip-path:inset(100%)}', true],
  ['opaque cover', '#panel{position:relative}#panel::after{content:"";position:absolute;inset:0;background:white;z-index:10}', true],
  ['transparent cover', '#panel{position:relative}#panel::after{content:"";position:absolute;inset:0;background:transparent;z-index:10}', false],
  ['partial cover', '#panel{position:relative}#panel::after{content:"";position:absolute;inset:0 0 0 50%;background:white;z-index:10}', false],
]) test(`disclosure exposure: ${name}`, { skip }, async () => withPage(async page => {
  const found = await checkDisclosure(page, disclosure(working).replace('</style>', css + '</style>'));
  if (fail) { assert.equal(found.length, 1); assert.equal(found[0].grade, 'FAIL'); }
  else assert.deepEqual(found, []);
}));
for (const opens of [true, false]) test(`analytics does not mask ${opens ? 'working' : 'inconclusive'} disclosure`, { skip }, async () => withPage(async page => {
  await withDisclosureServer(() => disclosure(`${opens ? working : ''}fetch('/analytics').catch(()=>{});`), async (origin, count) => {
    await page.goto(origin);
    const found = await navigationDisclosures(page);
    if (opens) assert.deepEqual(found, []);
    else { assert.equal(found.length, 1); assert.equal(found[0].grade, 'WARN'); }
    assert.equal(count(), 0, 'analytics must never reach server');
  });
}));
test('slow synchronous activation is inconclusive and disposes its context', { skip }, async t => withPage(async page => {
  await page.setContent(disclosure(`const end=Date.now()+2500;while(Date.now()<end){};${working}`));
  const contexts = page.browser().browserContexts().length;
  const start = performance.now();
  const found = await navigationDisclosures(page);
  const elapsed = performance.now() - start;
  t.diagnostic(`slow-handler check, including readiness and cleanup: ${elapsed.toFixed(0)}ms`);
  assert.equal(found.length, 1); assert.equal(found[0].grade, 'WARN');
  assert.match(found[0].evidence, /deadline/);
  assert.ok(elapsed < 8000, `finite slow handler took ${elapsed}ms`);
  assert.equal(page.browser().browserContexts().length, contexts);
}));

test('HTTP client-only handler mismatch is inconclusive', { skip }, async () => withPage(async page => {
  await withDisclosureServer(() => disclosure(), async origin => {
    await page.goto(origin);
    await page.evaluate(() => {
      const b = document.querySelector('button'); b.onclick = null;
      b.addEventListener('click', () => { document.querySelector('#panel').hidden = false; b.setAttribute('aria-expanded', 'true'); });
    });
    const found = await navigationDisclosures(page);
    assert.equal(found.length, 1); assert.equal(found[0].grade, 'WARN');
    await page.click('button');
    assert.equal(await page.$eval('#panel', p => p.hidden), false);
  });
}));
test('unconfirmed direct-handler readiness is WARN', { skip }, async () => withPage(async page => {
  const found = await checkDisclosure(page, disclosure().replace('b.onclick=()=>{}', ''));
  assert.equal(found.length, 1); assert.equal(found[0].grade, 'WARN');
}));

test('post-load background analytics is blocked during readiness', { skip }, async () => withPage(async page => {
  await page.setRequestInterception(true);
  page.on('request', r => (r.url().endsWith('/analytics') ? r.abort() : r.continue()).catch(() => {}));
  await withDisclosureServer(() => disclosure(working).replace('</script>', "setTimeout(()=>fetch('/analytics').catch(()=>{}),100)</script>"), async (origin, count) => {
    await page.goto(origin);
    // Original-page interception is independent of the disposable probe context.
    assert.deepEqual(await navigationDisclosures(page), []);
    assert.equal(count(), 0);
  });
}));
