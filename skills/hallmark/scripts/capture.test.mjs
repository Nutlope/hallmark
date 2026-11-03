import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const skip = !process.env.HALLMARK_PUPPETEER || !process.env.CHROME_PATH ? 'set HALLMARK_PUPPETEER and CHROME_PATH for real-browser regressions' : false;
const script = fileURLToPath(new URL('./capture.mjs', import.meta.url));
async function capture(routes, prepare, check) {
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-capture-'));
  const server = createServer((req, res) => {
    if (req.url === '/redirect') { res.writeHead(302, { Location: '/ok' }); res.end(); return; }
    const status = req.url === '/ok' ? 200 : req.url === '/missing' ? 404 : 500;
    res.writeHead(status, { 'Content-Type': 'text/html' });
    res.end(`<html><title>${status}</title><h1>${status === 200 ? 'Owned product fixture' : 'Error document'}</h1></html>`);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  try {
    prepare?.(dir);
    const result = await new Promise((resolve, reject) => {
      const p = spawn(process.execPath, [script, `http://127.0.0.1:${server.address().port}`, '--routes', routes, '--sizes', 'desktop', '--wait', '0', '--scale', '1', '--out', dir], { env: process.env });
      let stdout = '', stderr = '';
      p.stdout.on('data', (s) => { stdout += s; });
      p.stderr.on('data', (s) => { stderr += s; });
      p.on('error', reject);
      p.on('close', (status) => resolve({ status, stdout, stderr }));
    });
    await check(dir, result);
  } finally {
    await new Promise((r) => server.close(r));
    rmSync(dir, { recursive: true, force: true });
  }
}
for (const [route, status] of [['/missing', 404], ['/failed', 500]]) {
  test(`capture rejects HTTP ${status} without replacing an existing screenshot`, { skip }, async () => {
    const file = `screen-${route.slice(1)}-desktop.png`;
    await capture(route, (dir) => writeFileSync(join(dir, file), 'prior screenshot'), (dir, result) => {
      assert.equal(result.status, 1, result.stdout + result.stderr);
      assert.equal(readFileSync(join(dir, file), 'utf8'), 'prior screenshot');
      assert.doesNotMatch(result.stdout, /<img/);
      assert.match(result.stdout, new RegExp(`HTTP ${status}`));
    });
  });
}
test('capture keeps successful routes when another route fails', { skip }, async () => {
  await capture('/missing,/ok', null, (dir, result) => {
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(readdirSync(dir), ['screen-ok-desktop.png']);
    assert.equal((result.stdout.match(/<img /g) || []).length, 1);
    assert.match(result.stdout, /1 screenshot\./);
    assert.deepEqual([...readFileSync(join(dir, 'screen-ok-desktop.png')).subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  });
});
test('capture accepts a redirect to a successful document', { skip }, async () => {
  await capture('/redirect', null, (dir, result) => {
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(readdirSync(dir), ['screen-redirect-desktop.png']);
    assert.match(result.stdout, /<img /);
  });
});
