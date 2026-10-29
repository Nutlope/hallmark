import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';

const source = readFileSync(new URL('./sloplint.mjs', import.meta.url), 'utf8');
function run(mode, prior = true, render = true) {
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-before-'));
  try {
    writeFileSync(join(dir, 'sloplint.mjs'), source);
    // Inject the renderer's documented result protocol, leaving the production CLI,
    // inventory collection, output writing and exit handling unchanged.
    writeFileSync(join(dir, 'sloplint-render.mjs'), `export async function renderCheck(urls) {
      if (${JSON.stringify(mode)} === 'throw') throw new Error('browser launch failed');
      const result = [];
      result.failed = ${JSON.stringify(mode)} === 'failed' || ${JSON.stringify(mode)} === 'mixed'
        ? [{file: urls[urls.length - 1], message: 'HTTP 404'}] : [];
      if (${JSON.stringify(mode)} === 'not-run') result.notRun = 'no browser available';
      result.inventories = ${JSON.stringify(mode)} === 'success' || ${JSON.stringify(mode)} === 'mixed'
        ? {[urls[0]]: {links: ['/book'], fields: [], handlers: [], hooks: [], headings: [], text: []}} : {};
      return result;
    }`);
    mkdirSync(join(dir, '.hallmark'));
    const before = join(dir, '.hallmark/before.json');
    const original = '{"v":1,"operator":"known-good-baseline"}\n';
    if (prior) writeFileSync(before, original);
    writeFileSync(join(dir, 'page.html'), '<!doctype html><html><body><a href="/book">Book</a></body></html>');
    const args = [join(dir, 'sloplint.mjs'), '--before', '--json'];
    if (render) args.push('--url', 'http://localhost:4173/', ...(mode === 'mixed' ? ['--url', 'http://localhost:4173/missing'] : []));
    else args.push(join(dir, 'page.html'));
    const result = spawnSync(process.execPath, args, {cwd: dir, encoding: 'utf8'});
    assert.ifError(result.error);
    return {...result, before: existsSync(before) ? readFileSync(before, 'utf8') : null, original};
  } finally { rmSync(dir, {recursive: true, force: true}); }
}
for (const mode of ['failed', 'mixed', 'not-run', 'throw']) {
  test(`incomplete ${mode} render preserves an existing before inventory`, () => {
    const r = run(mode);
    assert.equal(r.status, 2, r.stdout + r.stderr);
    assert.equal(r.before, r.original);
    assert.match(r.stderr, /before|inventory|record/i);
  });
}
test('failed first render does not create a before inventory', () => {
  const r = run('failed', false);
  assert.equal(r.status, 2, r.stdout + r.stderr);
  assert.equal(r.before, null);
});
test('complete rendered inventory replaces the prior record', () => {
  const r = run('success');
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.notEqual(r.before, r.original);
  assert.ok(JSON.parse(r.before).pages['http://localhost:4173/']);
});
test('static before mode still records a page with lint findings', () => {
  const r = run('static', true, false);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.notEqual(r.before, r.original);
  assert.ok(JSON.parse(r.before).wiring.links.length);
});
