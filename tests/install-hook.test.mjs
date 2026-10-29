import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = resolve(dirname(fileURLToPath(import.meta.url)), '../skills/hallmark/scripts/install-hook.mjs');
const command = `node "${resolve(dirname(script), 'lint-hook.mjs')}"`;
function fixture(t, settings) {
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-hook-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  mkdirSync(join(dir, '.claude'));
  const file = join(dir, '.claude/settings.json');
  const original = JSON.stringify(settings, null, 4) + '\n';
  writeFileSync(file, original);
  return {
    original,
    read: () => readFileSync(file, 'utf8'),
    run: (...args) => spawnSync(process.execPath, [script, ...args], { cwd: dir, encoding: 'utf8' }),
  };
}

for (const hooks of [[], [{ matcher: '*', hooks: [] }], 'invalid', 42, false]) {
  for (const mode of [[], ['--remove']]) {
    test(`refuses hooks ${JSON.stringify(hooks)} during ${mode.length ? 'removal' : 'installation'}`, (t) => {
      const f = fixture(t, { hooks, permissions: { deny: ['Read(private.txt)'] } });
      const result = f.run(...mode);
      assert.equal(result.status, 1);
      assert.match(result.stderr, /hooks is not a JSON object/);
      assert.doesNotMatch(result.stdout, /installed|removed/);
      assert.equal(f.read(), f.original, 'invalid settings must remain byte-for-byte unchanged');
    });
  }
}

for (const settings of [{}, { hooks: null }, { hooks: {} }]) {
  test(`initializes missing hooks for ${JSON.stringify(settings)}`, (t) => {
    const f = fixture(t, settings);
    assert.equal(f.run().status, 0);
    const result = JSON.parse(f.read());
    assert.equal(result.hooks.PostToolUse.length, 1);
    assert.equal(result.hooks.PostToolUse[0].hooks[0].command, command);
  });
}

test('installation is idempotent and preserves unrelated configuration and shared hooks', (t) => {
  const other = { type: 'command', command: 'echo other' };
  const f = fixture(t, {
    permissions: { deny: ['Read(private.txt)'] },
    hooks: {
      PreToolUse: [{ matcher: '*', hooks: [other] }],
      PostToolUse: [{ matcher: 'Write', hooks: [other, { type: 'command', command }] }],
    },
  });
  assert.equal(f.run().status, 0);
  const once = f.read();
  assert.equal(f.run().status, 0);
  assert.equal(f.read(), once);
  const result = JSON.parse(once);
  assert.deepEqual(result.permissions, { deny: ['Read(private.txt)'] });
  assert.deepEqual(result.hooks.PreToolUse, [{ matcher: '*', hooks: [other] }]);
  assert.deepEqual(result.hooks.PostToolUse[0], { matcher: 'Write', hooks: [other] });
  assert.equal(result.hooks.PostToolUse.length, 2);
  assert.equal(f.run('--remove').status, 0);
  const removed = JSON.parse(f.read());
  assert.deepEqual(removed.hooks.PostToolUse, [{ matcher: 'Write', hooks: [other] }]);
  assert.deepEqual(removed.permissions, result.permissions);
});

test('refuses invalid PostToolUse without rewriting the settings', (t) => {
  const f = fixture(t, { hooks: { PostToolUse: {} } });
  assert.equal(f.run().status, 1);
  assert.equal(f.read(), f.original);
});

test('--print does not validate or modify existing settings', (t) => {
  const f = fixture(t, { hooks: [] });
  assert.equal(f.run('--print').status, 0);
  assert.equal(f.read(), f.original);
});
