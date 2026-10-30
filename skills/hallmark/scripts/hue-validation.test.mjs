import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./theme.mjs', import.meta.url));
const run = (...args) => {
  const result = spawnSync(process.execPath, [script, 'check', ...args], { encoding: 'utf8' });
  assert.ifError(result.error);
  return result;
};

test('non-finite hue inputs cannot be reported clear', () => {
  for (const value of ['blue', 'NaN', 'Infinity', '-Infinity', '1e999']) {
    const result = run('--hue', value);
    assert.equal(result.status, 2, value + ': ' + result.stdout + result.stderr);
    assert.doesNotMatch(result.stdout, /clear:/);
    assert.match(result.stderr, /hue.*finite/i);
  }
});

test('empty hue inputs are refused instead of becoming zero degrees', () => {
  for (const value of ['', '   ']) {
    const result = run('--hue', value);
    assert.equal(result.status, 2, JSON.stringify(value) + ': ' + result.stdout + result.stderr);
    assert.doesNotMatch(result.stdout, /clear:|near:/);
  }
});

test('a following option does not hide a missing hue value', () => {
  const result = run('--hue', '--face', 'Hallmark Test Family');
  assert.equal(result.status, 2, result.stdout + result.stderr);
  assert.doesNotMatch(result.stdout, /clear:/);
});

test('finite hue values retain circular comparisons', () => {
  const ordinary = run('--hue', '30');
  assert.equal(ordinary.status, 0, ordinary.stdout + ordinary.stderr);
  assert.match(ordinary.stdout, /near:/);
  for (const value of ['390', '-330']) {
    const wrapped = run('--hue', value);
    assert.equal(wrapped.status, 0, wrapped.stdout + wrapped.stderr);
    assert.equal(wrapped.stdout, ordinary.stdout);
  }
});

test('face-only checks still work without a hue', () => {
  const result = run('--face', 'Hallmark Test Family');
  assert.equal(result.status, 0, result.stdout + result.stderr);
  assert.match(result.stdout, /clear: no catalog theme sets its display/);
});
