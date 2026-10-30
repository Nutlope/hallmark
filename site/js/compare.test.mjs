import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync(new URL('./compare.js', import.meta.url), 'utf8');
const pairs = ['first', 'second', 'third'].map((id, i) => ({
  id, label: id, bareH: 3000, hmH: 3000, bare: i + 10, hm: i + 1,
}));

function setup(reduced, delayedDecode = false) {
  const pending = [];
  const classes = new Set();
  const decoding = [];
  const node = () => ({
    style: { setProperty() {} },
    classList: { add: v => classes.add(v), remove: v => classes.delete(v) },
    addEventListener() {}, setAttribute() {},
    decode: () => delayedDecode ? new Promise(resolve => decoding.push(resolve)) : Promise.resolve(),
  });
  const bare = node(), hm = node(), countBare = node(), countHm = node();
  const children = {
    '[data-cmp-scroll]': node(), '[data-cmp-handle]': node(),
    '[data-cmp-bare]': bare, '[data-cmp-hm]': hm,
    '[data-f-bare]': countBare, '[data-f-hm]': countHm,
    '[data-cmp-space]': node(),
  };
  const stage = Object.assign(node(), {
    clientWidth: 1000, clientHeight: 500,
    querySelector: key => children[key],
  });
  const pin = Object.assign(node(), {getBoundingClientRect: () => ({top: 0})});
  let select;
  const context = {
    document: {querySelector: key => ({
      '[data-cmp]': stage,
      '[data-cmp-data]': {textContent: JSON.stringify(pairs)},
      '[data-cmp-pin]': pin,
      '[data-cmp-tabs]': {},
    })[key]},
    HM: {reduce: {matches: reduced}, tabs: (_list, callback) => {select = callback;}},
    Image: class {set src(value) {this.url = value; pending.push(this);} get src() {return this.url;}},
    innerHeight: 900, getComputedStyle: () => ({top: '84px'}),
    addEventListener() {}, requestAnimationFrame() {}, cancelAnimationFrame() {},
    // Only the transition delay fires; background warmup and animation are outside this test.
    setTimeout: (callback, ms) => {if (ms === 180) callback();},
  };
  context.window = context;
  runInNewContext(source, context);
  const finish = async id => {
    for (const image of pending.filter(image => image.url.includes('/' + id + '-'))) image.onload();
    await new Promise(resolve => setImmediate(resolve));
  };
  const shown = () => ({bare: bare.src, hm: hm.src, bareCount: countBare.textContent, hmCount: countHm.textContent});
  const decoded = async () => {
    for (const resolve of decoding.splice(0)) resolve();
    await new Promise(resolve => setImmediate(resolve));
  };
  return {select, finish, shown, classes, decoded, reduce: context.HM.reduce};
}

for (const reduced of [true, false]) {
  test('a slow prior tab cannot replace the newest selection, reduced=' + reduced, async () => {
    const ui = setup(reduced);
    ui.select(1);
    ui.select(2);
    await ui.finish('third');
    const newest = ui.shown();
    assert.match(newest.bare, /third-bare-full/);
    assert.equal(newest.bareCount, '12 issues');
    await ui.finish('second');
    assert.deepEqual(ui.shown(), newest);
    assert.equal(ui.classes.has('is-swap'), false);
  });
}

test('sequential loads and returning to a cached pair still update normally', async () => {
  const ui = setup(false);
  ui.select(1); await ui.finish('second');
  assert.match(ui.shown().bare, /second-bare-full/);
  ui.select(2); await ui.finish('third');
  assert.match(ui.shown().hm, /third-hallmark-full/);
  ui.select(1);
  await new Promise(resolve => setImmediate(resolve));
  assert.match(ui.shown().bare, /second-bare-full/);
  assert.equal(ui.shown().hmCount, '2 issues');
});

test('an old image decode cannot end a newer transition', async () => {
  const ui = setup(false, true);
  ui.select(1); await ui.finish('second');
  ui.select(2);
  await ui.decoded();
  assert.equal(ui.classes.has('is-swap'), true);
  await ui.finish('third'); await ui.decoded();
  assert.equal(ui.classes.has('is-swap'), false);
  assert.match(ui.shown().bare, /third-bare-full/);
});

for (const pending of ['load', 'decode']) {
  test('switching to reduced motion clears an older pending ' + pending, async () => {
    const ui = setup(false, true);
    ui.select(1);
    if (pending === 'decode') await ui.finish('second');
    ui.reduce.matches = true;
    ui.select(2);
    await ui.finish('third');
    assert.equal(ui.classes.has('is-swap'), false);
    assert.match(ui.shown().bare, /third-bare-full/);
    await ui.finish('second'); await ui.decoded();
    assert.equal(ui.classes.has('is-swap'), false);
    assert.match(ui.shown().bare, /third-bare-full/);
  });
}

test('switching from reduced to animated keeps the new transition until its decode', async () => {
  const ui = setup(true, true);
  ui.select(1);
  ui.reduce.matches = false;
  ui.select(2);
  await ui.finish('second');
  assert.equal(ui.classes.has('is-swap'), true);
  await ui.finish('third');
  assert.match(ui.shown().bare, /third-bare-full/);
  assert.equal(ui.classes.has('is-swap'), true);
  await ui.decoded();
  assert.equal(ui.classes.has('is-swap'), false);
});
