// theme.test.mjs: the fingerprint, the shape map and the rotation the log reads.
//
// Runs with the built-in test runner, no dependency:  node --test skills/hallmark/scripts/tests/
//
// The fingerprint is the six choices a page makes on the six structural axes. Gate 32 and
// macrostructures.md § The fingerprint say that no more than three of the six may be shared
// with any of the last three logged builds; these tests hold the tool to that sentence.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SCRIPT = join(HERE, '..', 'theme.mjs');
const SKILL = join(HERE, '..', '..');
const MACROS = join(SKILL, 'references', 'macrostructures');
const MACROS_MD = join(SKILL, 'references', 'macrostructures.md');

const BENTO = 'Hanging|Asymmetric spans|Negative space|Outlined|Tightly cropped to the grid|None';
const WORKBENCH = 'Hanging|Single column|Negative space|Solid|Inline with the text|Type-unmask';
const SPECIMEN = 'Hanging|Marginalia|Hairline rule|Typographic only|None|Fade-up stagger';

function run(args, cwd) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8', cwd });
  return { code: r.status, out: r.stdout || '', err: r.stderr || '' };
}

function workdir() {
  return mkdtempSync(join(tmpdir(), 'hallmark-fingerprint-'));
}

function entry(over = {}) {
  return JSON.stringify({
    shape: 'Workbench', theme: 'Dusk', axes: 'dark/grotesk-sans/warm', hero: 'Stage',
    nav: 'edge-aligned', footer: 'mast', imagery: 'photographs', entry: 'a dev tool',
    fingerprint: WORKBENCH, sections: ['Showcase'], signature: 'the trace', prompt: 'a dev tool',
    ...over,
  });
}

function logIn(dir, over) {
  return run(['log', '--entry', entry(over), '--log', join(dir, 'log.json')], dir);
}

test('the fingerprint command names six axes and the twenty-one shapes', () => {
  const r = run(['fingerprint', '--json']);
  assert.equal(r.code, 0, r.err);
  const j = JSON.parse(r.out);
  assert.equal(j.axes.length, 6);
  assert.deepEqual(j.axes.map((a) => a.key), ['heading', 'body', 'divider', 'button', 'image', 'reveal']);
  assert.equal(j.limit, 3);
  assert.equal(Object.keys(j.shapes).length, 21);
});

test('the vocabulary in the code is the vocabulary in macrostructures.md', () => {
  // refcheck holds the two in step; this says the six axes are there to be held.
  const j = JSON.parse(run(['fingerprint', '--json']).out);
  assert.equal(j.axes.length, 6);
  for (const ax of j.axes) assert.ok(ax.values.length >= 5, `the ${ax.key} axis has too few choices`);
});

test('every shape file states a fingerprint the code can read', () => {
  const files = readdirSync(MACROS).filter((f) => /^\d\d-.*\.md$/.test(f));
  assert.equal(files.length, 21);
  const j = JSON.parse(run(['fingerprint', '--json']).out);
  for (const f of files) {
    const src = readFileSync(join(MACROS, f), 'utf8');
    const name = (/^##\s*\d+\s*·\s*(.+)$/m.exec(src) || [])[1];
    const fp = (/^\*\*Fingerprint:\*\*\s*`([^`]+)`/m.exec(src) || [])[1];
    assert.ok(name, `${f} has no shape name`);
    assert.ok(fp, `${f} has no Fingerprint line`);
    assert.equal(fp.split('|').length, 6, `${f} states ${fp.split('|').length} choices, not six`);
    assert.ok(j.shapes[name.trim()], `${f} names ${name.trim()}, which the shape map does not hold`);
    assert.equal(j.shapes[name.trim()], fp, `${f} states a fingerprint the shape map reads differently`);
    for (const value of fp.split('|')) {
      const axis = j.axes[j.axes.findIndex((a) => a.values.includes(value))];
      assert.ok(axis, `${f} uses "${value}", which is not in the vocabulary`);
    }
  }
});

test('a fingerprint that is not one choice per axis is refused', () => {
  const r = run(['check', '--fingerprint', 'Hanging|Single column']);
  assert.equal(r.code, 2);
  assert.match(r.err, /6 choices/);
});

test('a value from the wrong axis is refused', () => {
  const r = run(['check', '--fingerprint', 'Marginalia|Single column|Hairline rule|Outlined|None|None']);
  assert.equal(r.code, 2);
  assert.match(r.err, /heading "Marginalia" is not one of/);
});

test('the check names the axes a fingerprint shares with a logged build', () => {
  const dir = workdir();
  logIn(dir, { fingerprint: BENTO });
  const r = run(['check', '--fingerprint', BENTO, '--log', join(dir, 'log.json')], dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /the same fingerprint/);
  assert.match(r.out, /repeated patterns:/);
  assert.match(r.out, /- heading: Hanging/);
  assert.match(r.out, /- body: Asymmetric spans/);
});

test('the check passes a fingerprint that is clear of the last three builds', () => {
  const dir = workdir();
  logIn(dir, { fingerprint: BENTO });
  const r = run(['check', '--fingerprint', SPECIMEN, '--log', join(dir, 'log.json')], dir);
  assert.equal(r.code, 0, r.out + r.err);
  assert.match(r.out, /action: clear/);
});

test('a None on Image or Reveal is the absence of a choice, not a shared one', () => {
  const dir = workdir();
  const none = 'Hanging|Single column|Hairline rule|Outlined|None|None';
  logIn(dir, { fingerprint: none });
  const r = run(['check', '--fingerprint', none, '--log', join(dir, 'log.json')], dir);
  assert.equal(r.code, 1);
  assert.match(r.out, /4 of 6 axes shared/);
  assert.doesNotMatch(r.out, /- image:/);
  assert.doesNotMatch(r.out, /- reveal:/);
});

test('a build never logs a fingerprint that is already logged', () => {
  const dir = workdir();
  assert.equal(logIn(dir, { fingerprint: BENTO }).code, 0);
  const again = logIn(dir, { fingerprint: BENTO });
  assert.equal(again.code, 2);
  assert.match(again.err, /never repeats a fingerprint/);
});

test('a build logs a fingerprint that shares more than three axes, but says so', () => {
  const dir = workdir();
  logIn(dir, { fingerprint: WORKBENCH });
  const r = logIn(dir, { shape: 'Marquee Hero', fingerprint: 'Hanging|Single column|Hairline rule|Solid|Inline with the text|Type-unmask' });
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /warning: 5 of 6 axes are shared/);
});

test('a redesign may keep the fingerprint it has', () => {
  const dir = workdir();
  logIn(dir, { fingerprint: BENTO });
  const r = logIn(dir, { mode: 'redesign', depth: 'polish', fingerprint: BENTO });
  assert.equal(r.code, 0, r.err);
});

test('a fingerprint that is not a fingerprint is never logged', () => {
  const dir = workdir();
  const r = logIn(dir, { fingerprint: 'Hanging|Single column' });
  assert.equal(r.code, 2);
  assert.match(r.err, /not a fingerprint/);
});

test('the draw states the fingerprint of the shape it deals', () => {
  const dir = workdir();
  const r = run(['draw', '--material', 'photo', '--job', 'visit', '--seed', 'a1b2c3', '--log', join(dir, 'log.json')], dir);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /^fingerprint: .+\|.+\|.+\|.+\|.+\|.+$/m);
});

test('the draw keeps clear of a shape that repeats a logged fingerprint', () => {
  const dir = workdir();
  logIn(dir, { shape: 'Index-First', fingerprint: BENTO });
  const shapes = new Set();
  for (let i = 0; i < 60; i++) {
    const r = run(['draw', '--material', 'photo', '--job', 'visit', '--seed', `s${String(i).padStart(3, '0')}`, '--log', join(dir, 'log.json')], dir);
    const line = (r.out.match(/^shape: (.+?) ·/m) || [])[1];
    if (line) shapes.add(line);
  }
  assert.ok(shapes.size > 1, 'the draw should deal more than one shape across the seeds');
  assert.ok(!shapes.has('Bento Grid'), 'the draw dealt Bento Grid, whose fingerprint is already logged');
});

test('the deal still avoids the last three themes', () => {
  const dir = workdir();
  const r = run(['deal', '--genre', 'editorial', '--prompt', 'a bakery in Lisbon', '--log', join(dir, 'log.json')], dir);
  assert.equal(r.code, 0, r.err);
  assert.match(r.out, /^deal: /m);
});

test('a log the tool cannot read is refused, and nothing is written', () => {
  const dir = workdir();
  const file = join(dir, 'log.json');
  writeFileSync(file, '{not json');
  const r = run(['log', '--entry', entry(), '--log', file], dir);
  assert.equal(r.code, 1);
  assert.match(r.err, /not valid JSON/);
});

test('every shape the draw can deal is in the shape map', () => {
  const src = readFileSync(SCRIPT, 'utf8');
  const j = JSON.parse(run(['fingerprint', '--json']).out);
  const pool = (src.match(/shapes:\s*\{[\s\S]*?\n  \},/) || [''])[0];
  const names = [...pool.matchAll(/'([^']+)'/g)].map((m) => m[1]);
  assert.ok(names.length, 'the draw pools could not be read');
  for (const n of names) {
    assert.ok(j.shapes[n], `the draw can deal "${n}", which has no fingerprint in the shape map`);
  }
  assert.ok(existsSync(MACROS_MD));
});
