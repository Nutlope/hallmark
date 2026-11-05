import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

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

test('validate rejects an invalid Build hint in a CRLF file, like it does in LF', () => {
  const source = readFileSync(new URL('../references/themes/hum.md', import.meta.url), 'utf8').replace(/\r\n/g, '\n');
  const at = source.indexOf('```css', source.indexOf('## Build hint')) + '```css\n'.length;
  const bad = `${source.slice(0, at)}  color: black;\n${source.slice(at)}`;
  const cli = fileURLToPath(new URL('./theme.mjs', import.meta.url));
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-theme-crlf-'));
  try {
    for (const [name, text] of [['lf', bad], ['crlf', bad.replace(/\n/g, '\r\n')]]) {
      const file = join(dir, `${name}.md`);
      writeFileSync(file, text);
      const result = spawnSync(process.execPath, [cli, 'validate', file], { encoding: 'utf8' });
      assert.equal(result.status, 1, `${name}: ${result.stdout}${result.stderr}`);
      assert.match(result.stdout, /named colour black in the build hint/, `${name}: ${result.stdout}`);
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
