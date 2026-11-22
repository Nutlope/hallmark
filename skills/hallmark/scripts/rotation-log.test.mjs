import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const cli = fileURLToPath(new URL('./theme.mjs', import.meta.url));
const index = JSON.parse(readFileSync(new URL('../references/themes/index.json', import.meta.url), 'utf8')).themes;
const triple = (t) => `${t.paper.band}/${t.display.class}/${t.accent.band}`;
const POTTERY = ['atmospheric', 'a pottery school with kiln and clay workshops'];
const FLYERS = ['playful', 'a risograph print fair with flyers and toner'];

function fixture(check) {
  const dir = mkdtempSync(join(tmpdir(), 'hallmark-rotation-'));
  const log = join(dir, '.hallmark', 'log.json');
  mkdirSync(join(dir, '.hallmark'), { recursive: true });
  const deal = ([genre, prompt], entries) => {
    writeFileSync(log, JSON.stringify(entries, null, 1) + '\n');
    const result = spawnSync(process.execPath,
      [cli, 'deal', '--genre', genre, '--prompt', prompt, '--log', log, '--json'],
      { cwd: dir, encoding: 'utf8', timeout: 15000 });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    return JSON.parse(result.stdout).deal.map((d) => d.slug);
  };
  try { check({ deal }); } finally { rmSync(dir, { recursive: true, force: true }); }
}

// A build records its theme the way the scaffold's stamp writes it, so the log's theme field reads
// "Kiln (deal 1/3, seed x)" or "Kiln (by request)", never a bare name.
test('a logged stamp theme keeps its theme out of the next deal', () => fixture(({ deal }) => {
  const first = deal(POTTERY, []);
  const logged = first.map((slug, i) => `${index.find((t) => t.slug === slug).name} (${i === 0 ? 'deal 1/3, seed abc' : 'by request'})`);
  const next = deal(POTTERY, logged.map((theme) => ({ theme })));
  assert.deepEqual(next.filter((slug) => first.includes(slug)), [], `logged ${logged.join(', ')} and dealt ${next.join(', ')} again`);
}));

// The catalog has one theme whose name is not its slug, and a stamp logs the name.
test('a logged theme whose name differs from its slug is still blocked', () => fixture(({ deal }) => {
  const first = deal(FLYERS, []);
  assert.ok(first.includes('pasteup'), `the flyer prompt must deal pasteup to test it, got ${first.join(', ')}`);
  const next = deal(FLYERS, [{ theme: 'Paste-up (by request)' }]);
  assert.ok(!next.includes('pasteup'), `pasteup was dealt again after "Paste-up (by request)" was logged: ${next.join(', ')}`);
}));

// The stamp writes axes as "<triple> · posture: <posture>"; the guard compares the triple alone.
test('a logged axes line with the stamp posture still blocks the theme on those axes', () => fixture(({ deal }) => {
  const top = index.find((t) => t.slug === deal(POTTERY, [])[0]);
  const next = deal(POTTERY, [{ theme: 'custom', axes: `${triple(top)} · posture: ${top.posture}` }]);
  assert.ok(!next.includes(top.slug), `${top.slug} sits on ${triple(top)} and was dealt again: ${next.join(', ')}`);
}));
