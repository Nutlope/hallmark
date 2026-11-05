import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(
  new URL('../theme.mjs', import.meta.url)
);

function runPhotos(orient) {
  return spawnSync(
    process.execPath,
    [
      script,
      'photos',
      'mountain landscape',
      '--orient',
      orient,
      '--json',
      '--seed',
      'orientation-regression-test',
    ],
    { encoding: 'utf8' }
  );
}

test('rejects an unsupported photo orientation', () => {
  const result = runPhotos('sideways');

  assert.equal(result.status, 2);
  assert.match(
    result.stderr,
    /--orient must be one of: landscape, portrait, square/
  );
});

test('accepts landscape and returns matching photos', () => {
  const result = runPhotos('landscape');

  assert.equal(result.status, 0, result.stderr);

  const output = JSON.parse(result.stdout);
  assert.ok(output.subjects[0].picks.length > 0);
  assert.ok(
    output.subjects[0].picks.every(
      (photo) => photo.orient === 'landscape'
    )
  );
});
