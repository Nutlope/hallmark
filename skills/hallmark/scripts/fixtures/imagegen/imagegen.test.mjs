import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, realpathSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = fileURLToPath(new URL('../../imagegen.mjs', import.meta.url));
const model = 'black-forest-labs/FLUX.1.1-pro';
const prompt = 'Rye loaves on a flour-dusted counter';
const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jUioAAAAASUVORK5CYII=', 'base64');

function withCache(n, explicit, check) {
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-image-cache-'));
  try {
    const hash = createHash('sha256').update([model, prompt, '1024x1024', 4, n].join('|')).digest('hex').slice(0, 16);
    const output = explicit ? join(dir, 'chosen.png') : join(dir, '.hallmark', 'img-cache', hash + '.png');
    mkdirSync(dirname(output), { recursive: true });
    const stem = output.replace(/\.png$/, '');
    const paths = Array.from({ length: n }, (_, i) => n === 1 ? output : stem + '-' + (i + 1) + '.png');
    for (const path of paths) writeFileSync(path, png);
    writeFileSync(stem + '.json', JSON.stringify({ hash, files: paths.map((path) => path.split(/[\\/]/).pop()) }));
    const args = [prompt, '--n', String(n), '--json', ...(explicit ? ['--out', output] : [])];
    const run = (extra = []) => {
      const env = { ...process.env };
      delete env.TOGETHER_API_KEY;
      const result = spawnSync(process.execPath, [script, ...args, ...extra], { cwd: dir, env, encoding: 'utf8' });
      assert.equal(result.error, undefined);
      return { code: result.status, report: JSON.parse(result.stdout) };
    };
    check({ run, paths, metadata: stem + '.json' });
  } finally { rmSync(dir, { recursive: true, force: true }); }
}

for (const explicit of [false, true]) {
  test('reuse all cached batch images' + (explicit ? ' at explicit output' : ' in default cache'), () => {
    withCache(2, explicit, ({ run, paths }) => {
      const { code, report } = run();
      assert.equal(code, 0);
      assert.equal(report.cached, true);
      assert.equal(realpathSync(report.path), realpathSync(paths[0]));
      assert.deepEqual(report.paths.map(resolvePath), paths.map(resolvePath));
      for (const path of report.paths) assert.deepEqual(readFileSync(path), png);
    });
  });
}
const resolvePath = (path) => realpathSync(path);

test('single-image cache continues to use unnumbered output', () => {
  withCache(1, true, ({ run, paths }) => {
    const { code, report } = run();
    assert.equal(code, 0);
    assert.equal(report.cached, true);
    assert.equal(realpathSync(report.path), realpathSync(paths[0]));
  });
});

test('missing middle image and force bypass do not report cache hits', () => {
  withCache(3, true, ({ run, paths }) => {
    const forced = run(['--force']);
    assert.equal(forced.code, 3);
    assert.equal(forced.report.error, 'no-key');
    rmSync(paths[1]);
    const { code, report } = run();
    assert.equal(code, 3);
    assert.equal(report.error, 'no-key');
  });
});

test('explicit output from a different request is not reused', () => {
  withCache(2, true, ({ run, metadata }) => {
    writeFileSync(metadata, JSON.stringify({ hash: 'another-request' }));
    const { code, report } = run();
    assert.equal(code, 3);
    assert.equal(report.error, 'no-key');
  });
});

test('large image count with no cache remains a bounded no-key miss', () => {
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-image-count-'));
  try {
    const env = { ...process.env };
    delete env.TOGETHER_API_KEY;
    const started = performance.now();
    const result = spawnSync(process.execPath, ['--max-old-space-size=32', script, prompt, '--n', '1000000000', '--json'], {
      cwd: dir, env, encoding: 'utf8', timeout: 5000,
    });
    assert.equal(result.error, undefined);
    assert.equal(result.status, 3, result.stderr);
    assert.equal(JSON.parse(result.stdout).error, 'no-key');
    assert.ok(performance.now() - started < 5000);
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
