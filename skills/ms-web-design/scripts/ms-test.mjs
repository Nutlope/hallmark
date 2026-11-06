#!/usr/bin/env node
// ms-web-design: checks that ms-sloplint's own additions behave. Run: node scripts/ms-test.mjs
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LINT = join(HERE, 'ms-sloplint.mjs');
const FIX = join(HERE, 'fixtures');
const lint = (target, cwd = HERE) => spawnSync(process.execPath, [LINT, target], { encoding: 'utf8', cwd }).stdout || '';
const count = (out, re) => (out.match(re) || []).length;
const failures = [];
const expect = (ok, msg) => { if (!ok) failures.push(msg); };

const fail = lint(join(FIX, 'ms-fail'));
expect(count(fail, /REFLEX ms-hover /g) === 1, 'ms-fail: ms-hover must fire once');
expect(count(fail, /REFLEX ms-cursor /g) === 2, 'ms-fail: ms-cursor must fire twice');
expect(count(fail, /REFLEX ms-scroll /g) === 3, 'ms-fail: ms-scroll must fire three times (snap, overflow, wheel)');
expect(count(fail, /REFLEX ms-intro /g) === 1, 'ms-fail: ms-intro must fire once');

const pass = lint(join(FIX, 'ms-pass'));
expect(!/ ms-(hover|cursor|scroll|intro) /.test(pass), 'ms-pass: no ms gate may fire');

const origen = lint('style.css', join(FIX, 'ms-origen'));
expect(/WAIVED ms-cursor /.test(origen), 'ms-origen: the ms-cursor waiver must hold');
expect(/MARCA REJECTED 54: design\.md was written by ms-web-design/.test(origen), 'ms-origen: our own design.md must not grant a brand override');
expect(/MOVIMIENTO posture: protagonista/.test(origen), 'ms-origen: the motion posture must be read from design.md');

const tmp = mkdtempSync(join(tmpdir(), 'ms-client-'));
try {
  cpSync(join(FIX, 'ms-origen'), tmp, { recursive: true });
  writeFileSync(join(tmp, 'design.md'), '# Design: fixture\nOrigen: ms-web-design (dirección de arte, 2026-11-06)\n\n## Marca del cliente\n- Labels in tracked capitals: brand book p. 12\n');
  const client = lint('style.css', tmp);
  expect(/MARCA 54: overridden by the client brand/.test(client), 'a "## Marca del cliente" section must grant the override');
} finally { rmSync(tmp, { recursive: true, force: true }); }

if (failures.length) { for (const f of failures) console.log(`FAIL  ${f}`); console.log(`ms-test: ${failures.length} failure(s)`); process.exit(1); }
console.log('ms-test: all ms-sloplint checks behave');
