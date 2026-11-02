import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const cli = fileURLToPath(new URL('./theme.mjs', import.meta.url));

function run(t, args) {
  const cwd = mkdtempSync(join(tmpdir(), 'hallmark-photo-count-'));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const result = spawnSync(process.execPath, [cli, 'photos', ...args], {
    cwd, encoding: 'utf8', timeout: 5000,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null);
  return { ...result, cwd };
}

for (const value of ['0', '-1', '1.5', 'abc', 'NaN', 'Infinity', '1e309', '', ' ', '9007199254740992']) {
  test(`photos rejects invalid count ${JSON.stringify(value)}`, (t) => {
    const result = run(t, ['sea', '--n', value, '--json']);
    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.match(result.stderr, /--n.*positive.*integer/i);
    assert.equal(result.stdout, '');
  });
}

for (const suffix of [[], ['--json']]) {
  test(`photos rejects a missing count${suffix.length ? ' before another flag' : ''}`, (t) => {
    const result = run(t, ['sea', '--n', ...suffix]);
    assert.equal(result.status, 2, result.stdout + result.stderr);
    assert.match(result.stderr, /--n.*positive.*integer/i);
    assert.equal(result.stdout, '');
  });
}

for (const [args, count] of [[[], 3], [['--n', '1'], 1], [['--n', '4'], 4]]) {
  test(`photos selects ${count} matching images with ${args.join(' ') || 'the default count'}`, (t) => {
    const result = run(t, ['sea', '--seed', 'count-regression', ...args, '--json']);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stderr, '');
    const picks = JSON.parse(result.stdout).subjects[0].picks;
    assert.equal(picks.length, count);
    assert.equal(new Set(picks.map((p) => p.id)).size, count);
  });
}

test('photos rejects invalid count before creating a save directory', (t) => {
  // An unmatched subject keeps this regression offline even on unfixed code.
  const result = run(t, ['zzqvxxjkk', '--n', 'Infinity', '--save', 'images', '--json']);
  assert.equal(existsSync(join(result.cwd, 'images')), false);
  assert.equal(result.status, 2, result.stdout + result.stderr);
  assert.equal(result.stdout, '');
});
