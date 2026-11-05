import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = process.env.THEME_SCRIPT || fileURLToPath(new URL('./theme.mjs', import.meta.url));
const entry = { mode: 'redesign', depth: 'polish', prompt: 'Preserve the existing history' };
function fixture(t, text) {
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-log-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const log = join(dir, 'log.json');
  if (text !== undefined) writeFileSync(log, text);
  const run = () => spawnSync(process.execPath, [script, 'log', '--log', log, '--entry', JSON.stringify(entry)], { encoding: 'utf8' });
  return { dir, log, run };
}

for (const value of [null, false, 42, 'history', {}, { history: [{ prompt: 'old' }] }, { runs: 'history' }, { runs: {} }, [null], ['old'], [[]], { runs: [false] }]) {
  test(`rejects invalid history without changing bytes: ${JSON.stringify(value)}`, (t) => {
    const text = JSON.stringify(value, null, 2) + '\n';
    const { dir, log, run } = fixture(t, text);
    const result = run();
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /nothing was written/);
    assert.equal(readFileSync(log, 'utf8'), text);
    assert.deepEqual(readdirSync(dir), ['log.json']);
  });
}

test('preserves syntactically invalid JSON', (t) => {
  const text = '{broken\n';
  const { log, run } = fixture(t, text);
  assert.notEqual(run().status, 0);
  assert.equal(readFileSync(log, 'utf8'), text);
});

for (const wrapped of [false, true]) {
  test(`prepends to ${wrapped ? 'legacy runs object' : 'array'} and keeps the latest 20`, (t) => {
    const history = Array.from({ length: 25 }, (_, i) => ({ prompt: `old ${i}`, custom: i }));
    const { log, run } = fixture(t, JSON.stringify(wrapped ? { runs: history } : history));
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    const actual = JSON.parse(readFileSync(log, 'utf8'));
    assert.equal(actual.length, 20);
    assert.equal(actual[0].prompt, entry.prompt);
    assert.deepEqual(actual.slice(1), history.slice(0, 19));
  });
}

for (const text of [undefined, '[]', '{"runs":[]}']) {
  test(`creates or accepts an empty history: ${text}`, (t) => {
    const { log, run } = fixture(t, text);
    const result = run();
    assert.equal(result.status, 0, result.stderr);
    const actual = JSON.parse(readFileSync(log, 'utf8'));
    assert.equal(actual.length, 1);
    assert.equal(actual[0].prompt, entry.prompt);
  });
}
