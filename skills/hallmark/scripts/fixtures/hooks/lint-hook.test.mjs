import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = dirname(fileURLToPath(import.meta.url));
const hookScript = join(here, '..', '..', 'lint-hook.mjs');
const lint = join(here, '..', '..', 'sloplint.mjs');
const html = '<!doctype html><html><head><title>Venue</title><link rel="stylesheet" href="style.css"></head><body><button>Book a table</button></body></html>';
const css = '/* Hallmark · shape: app screen · genre: atmospheric */\n:root { --color-ink: oklch(20% 0 0); }\n';

function run(script, args = [], input) {
  const result = spawnSync(process.execPath, [script, ...args], { input, encoding: 'utf8' });
  assert.equal(result.error, undefined);
  return result;
}

function hook(file) {
  const result = run(hookScript, [], JSON.stringify({ tool_input: { file_path: file } }));
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

function fixture(dir, { marked = false, depth = 0, stamped = false, ext = 'html' } = {}) {
  mkdirSync(dir, { recursive: true });
  if (marked) mkdirSync(join(dir, '.hallmark'));
  const leaf = join(dir, ...Array.from({ length: depth }, (_, i) => 'nested' + i));
  mkdirSync(leaf, { recursive: true });
  const file = join(leaf, 'index.' + ext);
  const component = (stamped ? '/* Hallmark */\n' : '') + 'export default () => <button>Book</button>;';
  writeFileSync(file, ext === 'html' ? html : component);
  writeFileSync(join(leaf, 'style.css'), css);
  return file;
}

function temporaryFixture(check) {
  const root = mkdtempSync(join(tmpdir(), 'hallmark-hook-'));
  try { check(root); }
  finally { rmSync(root, { recursive: true, force: true }); }
}

test('linked stylesheet in marked project reports actual native Floor findings', () => {
  temporaryFixture((root) => {
    const file = fixture(root, { marked: true });
    const oracle = run(lint, [file, '--json', '--tier', 'floor']);
    assert.equal(oracle.status, 1);
    const failures = JSON.parse(oracle.stdout).findings.filter((finding) => finding.grade === 'FAIL');
    assert.deepEqual(failures.map((finding) => finding.gate).sort(), ['26a', '34']);
    const result = hook(file);
    assert.ok(result.hookSpecificOutput, 'marked-project HTML must report Floor findings');
    const report = result.hookSpecificOutput.additionalContext;
    for (const failure of failures) {
      assert.ok(report.includes('gate ' + failure.gate));
      assert.ok(report.includes(failure.evidence));
    }
  });
});

test('ordinary HTML and unmarked components with Hallmark comments stay ignored', () => {
  temporaryFixture((root) => {
    for (const [name, options] of [['ordinary', {}], ['component', { ext: 'jsx', stamped: true }]]) {
      assert.deepEqual(hook(fixture(join(root, name), options)), {});
    }
  });
});

test('stamped CSS outside a marked project still reports violations', () => {
  temporaryFixture((root) => {
    fixture(root);
    const file = join(root, 'style.css');
    writeFileSync(file, css + 'button { transition: all 150ms; }');
    assert.ok(hook(file).hookSpecificOutput);
  });
});

test('project marker search keeps its eight-directory boundary', () => {
  temporaryFixture((root) => {
    for (const depth of [7, 8]) {
      const file = fixture(join(root, 'depth' + depth), { marked: true, depth, ext: 'jsx' });
      const result = hook(file);
      if (depth === 7) assert.ok(result.hookSpecificOutput);
      else assert.deepEqual(result, {});
    }
  });
});
