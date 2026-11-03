import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = fileURLToPath(new URL('./theme.mjs', import.meta.url));
function fixture(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-reroll-'));
  try {
    const run = (reroll, n = 3) => spawnSync(process.execPath,
      [script, 'deal', '--prompt', 'neighborhood bakery', '--reroll', String(reroll),
       '--n', String(n), '--json', '--log', join(dir, 'log.json')],
      {cwd: dir, encoding: 'utf8', timeout: 3000});
    fn(run);
  } finally { rmSync(dir, {recursive: true, force: true}); }
}

for (const n of [1, 3]) {
  test('an exhausted catalog terminates even for a billion rerolls, hand=' + n, () => fixture(run => {
    const result = run(1_000_000_000, n);
    assert.ifError(result.error);
    assert.equal(result.status, 1, result.stdout + result.stderr);
    assert.match(result.stderr, /nothing left to deal at reroll 1000000000/);
    assert.equal(result.stdout, '');
  }));
}

test('normal first and next hands retain three different themes', () => fixture(run => {
  const first = run(0), next = run(1);
  assert.ifError(first.error); assert.ifError(next.error);
  assert.equal(first.status, 0, first.stderr);
  assert.equal(next.status, 0, next.stderr);
  const a = JSON.parse(first.stdout), b = JSON.parse(next.stdout);
  assert.equal(a.deal.length, 3);
  assert.equal(b.deal.length, 3);
  const previous = new Set(a.deal.map(theme => theme.slug));
  assert.ok(b.deal.every(theme => !previous.has(theme.slug)));
}));

test('small exhausted requests retain their existing diagnostic', () => fixture(run => {
  const result = run(100);
  assert.ifError(result.error);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /nothing left to deal at reroll 100/);
}));
