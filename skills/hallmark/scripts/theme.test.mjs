import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

function withTempDir(run) {
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-theme-'));
  try {
    return run(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function validateFile(cli, dir, name, text) {
  const file = join(dir, `${name}.md`);
  writeFileSync(file, text);
  return spawnSync(process.execPath, [cli, 'validate', file], { encoding: 'utf8' });
}

function insertBuildHintRule(source, rule) {
  const heading = '## Build hint\n';
  const headingAt = source.indexOf(heading);
  assert.notEqual(headingAt, -1, 'fixture must have a Build hint section');
  assert.equal(source.indexOf(heading, headingAt + heading.length), -1, 'fixture must have exactly one Build hint section');
  const section = source.slice(headingAt);
  const openingFences = [...section.matchAll(/^```css\n/gm)];
  assert.equal(openingFences.length, 1, 'fixture must have exactly one Build hint CSS fence');
  const insertionAt = headingAt + openingFences[0].index + openingFences[0][0].length;
  return `${source.slice(0, insertionAt)}${rule}\n${source.slice(insertionAt)}`;
}

test('validate accepts a theme with either LF or CRLF line endings', () => {
  const source = readFileSync(new URL('../references/themes/hum.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const cli = fileURLToPath(new URL('./theme.mjs', import.meta.url));
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-theme-'));
  try {
    for (const [name, text] of [['lf', source], ['crlf', source.replace(/\n/g, '\r\n')]]) {
      assert.ok(Buffer.byteLength(text) < 8000, 'fixture must stay below the independent size limit');
      const file = join(dir, `${name}.md`);
      writeFileSync(file, text);
      const result = spawnSync(process.execPath, [cli, 'validate', file], { encoding: 'utf8' });
      assert.equal(result.status, 0, `${name}: ${result.stdout}${result.stderr}`);
      assert.match(result.stdout, /: ok \(Hum,/);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

for (const [name, rule, diagnostic] of [
  ['raw duration', '.repro { transition: opacity 250ms; }', 'raw duration 250ms in the build hint'],
  ['bare easing', '.repro { transition: opacity var(--dur-short) ease; }', 'bare ease keyword in the build hint'],
  ['named colour', '.repro { color: white; }', 'named colour white in the build hint'],
  ['raw spacing', '.repro { padding: 24px; }', 'raw 24px spacing in the build hint'],
]) {
  test(`rejects ${name} under LF and CRLF`, () => {
    const source = readFileSync(new URL('../references/themes/hum.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
    const text = insertBuildHintRule(source, rule);
    const cli = fileURLToPath(new URL('./theme.mjs', import.meta.url));

    withTempDir((dir) => {
      for (const [ending, fixture] of [['LF', text], ['CRLF', text.replace(/\n/g, '\r\n')]]) {
        assert.ok(Buffer.byteLength(fixture) < 8000, `${ending} fixture must stay below the independent size limit`);
        const result = validateFile(cli, dir, ending.toLowerCase(), fixture);
        const output = `${result.stdout}${result.stderr}`;
        assert.equal(result.status, 1, `${ending}: ${output}`);
        assert.ok(output.includes(diagnostic), `${ending}: expected ${diagnostic}, got ${output}`);
        assert.doesNotMatch(output, /: ok \(/);
      }
    });
  });
}

test('validate enforces the raw byte limit and accepts exactly 8,000 bytes', () => {
  const source = readFileSync(new URL('../references/themes/hum.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const cli = fileURLToPath(new URL('./theme.mjs', import.meta.url));
  const exact = `${source}${' '.repeat(8000 - Buffer.byteLength(source))}`;
  const paddedLf = `${source}${'\n'.repeat(450)}`;
  const paddedCrlf = paddedLf.replace(/\n/g, '\r\n');

  assert.equal(Buffer.byteLength(exact), 8000);
  assert.ok(Buffer.byteLength(paddedLf) < 8000);
  assert.ok(Buffer.byteLength(paddedCrlf) > 8000);

  withTempDir((dir) => {
    const exactResult = validateFile(cli, dir, 'exact', exact);
    assert.equal(exactResult.status, 0, `${exactResult.stdout}${exactResult.stderr}`);

    const lfResult = validateFile(cli, dir, 'padded-lf', paddedLf);
    assert.equal(lfResult.status, 0, `${lfResult.stdout}${lfResult.stderr}`);

    const crlfResult = validateFile(cli, dir, 'padded-crlf', paddedCrlf);
    const crlfOutput = `${crlfResult.stdout}${crlfResult.stderr}`;
    assert.equal(crlfResult.status, 1, crlfOutput);
    assert.ok(crlfOutput.includes(`${Buffer.byteLength(paddedCrlf)} bytes, over 8,000`), crlfOutput);
  });
});
