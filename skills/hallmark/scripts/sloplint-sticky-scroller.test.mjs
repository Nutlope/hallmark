import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function failures(css) {
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-sticky-'));
  try {
    writeFileSync(join(dir, 'layout.css'), css);
    const run = spawnSync(process.execPath, [new URL('./sloplint.mjs', import.meta.url).pathname, dir, '--genre', 'modern-minimal', '--scope', 'app', '--json'], { encoding: 'utf8' });
    return JSON.parse(run.stdout).findings.filter(f => String(f.gate) === '56');
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
test('gate 56 ignores a sticky table header in its own overflow-x scroller', () => {
  assert.equal(failures('.sidebar { position:sticky; top:0; } .table-wrap { overflow-x:auto; } .table-wrap th { position:sticky; top:0; }').length, 0);
});
test('gate 56 still catches overlapping stickies in the page scroll', () => {
  assert.equal(failures('.sidebar { position:sticky; top:0; } .content th { position:sticky; top:0; }').length, 1);
});

test('gate 56 keeps clip-only containers in the page scroll context', () => {
  assert.equal(failures('.sidebar { position:sticky; top:0; } .content { overflow-x:clip; } .content th { position:sticky; top:0; }').length, 1);
});
