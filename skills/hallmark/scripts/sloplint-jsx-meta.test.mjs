import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

function inspect(source) {
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-dot-'));
  try {
    writeFileSync(join(dir, 'header.tsx'), source);
    const run = spawnSync(process.execPath, [new URL('./sloplint.mjs', import.meta.url).pathname, dir, '--genre', 'modern-minimal', '--scope', 'app', '--json'], { encoding: 'utf8' });
    return JSON.parse(run.stdout).findings.filter(f => String(f.gate) === '63' || String(f.id) === '63');
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

test('gate 63 catches a single separator joining JSX meta expressions', () => {
  assert.ok(inspect('export const C = ({ user, date }) => <p className="meta">{user} · plan made {date}</p>;').length > 0);
});

test('gate 63 keeps ordinary prose and a single static byline dot', () => {
  assert.equal(inspect('export const C = () => <p>Alex · 2026</p>;').length, 0);
  assert.equal(inspect('export const C = ({ firstName, lastName }) => <p>{firstName} · {lastName}</p>;').length, 0);
  assert.equal(inspect('export const C = ({ author, year }) => <p className="byline">{author} · {year}</p>;').length, 0);
  assert.equal(inspect('export const C = ({ user }) => <p>Hello {user}, welcome back.</p>;').length, 0);
});
