import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, realpathSync, writeFileSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const script = fileURLToPath(new URL('../../theme.mjs', import.meta.url));
const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jUioAAAAASUVORK5CYII=';

function withProject(check) {
  const root = realpathSync(mkdtempSync(join(tmpdir(), 'hallmark-photo-src-')));
  try {
    // Only the download boundary is controlled; selection, saving and HTML formatting run normally.
    const preload = join(root, 'download-fixture.mjs');
    writeFileSync(preload, `globalThis.fetch = async (url) => {
      if (!String(url).startsWith('https://upload.wikimedia.org/')) throw new Error('unexpected request');
      return process.env.HALLMARK_TEST_FAIL_DOWNLOAD
        ? new Response('unavailable', { status: 503 })
        : new Response(Buffer.from('${png}', 'base64'), { headers: { 'content-type': 'image/png' } });
    };`);
    const run = (args = [], fail = false) => {
      const env = { ...process.env };
      delete env.HALLMARK_TEST_FAIL_DOWNLOAD;
      delete env.TOGETHER_API_KEY;
      if (fail) env.HALLMARK_TEST_FAIL_DOWNLOAD = '1';
      const result = spawnSync(process.execPath, ['--import', preload, script, 'photos', 'tide marker Formby', '--n', '1', '--seed', '1234', ...args], {
        cwd: root, env, encoding: 'utf8', timeout: 5000,
      });
      assert.equal(result.error, undefined);
      assert.equal(result.status, 0, result.stderr);
      return result.stdout;
    };
    check({ root, run });
  } finally { rmSync(root, { recursive: true, force: true }); }
}

function imageSource(output) {
  const match = /<img src="([^"]+)"/.exec(output);
  assert.ok(match, output);
  return match[1];
}

function assertSavedSource(root, source, expectedPrefix) {
  assert.ok(source.startsWith(expectedPrefix), source);
  assert.ok(!source.startsWith('/'), 'HTML uses a project-relative URL');
  const url = new URL(source, 'http://localhost/');
  assert.equal(url.hash, '');
  assert.equal(url.search, '');
  const file = join(root, decodeURIComponent(url.pathname));
  assert.deepEqual(readFileSync(file), Buffer.from(png, 'base64'));
}

test('relative save emits a URL usable by a page served from the project root', () => {
  withProject(({ root, run }) => {
    assertSavedSource(root, imageSource(run(['--save', 'assets'])), 'assets/');
  });
});

test('absolute save inside the project also emits a relative URL', () => {
  withProject(({ root, run }) => {
    assertSavedSource(root, imageSource(run(['--save', join(root, 'assets')])), 'assets/');
  });
});

test('saved HTML URL encodes spaces, hash and Unicode path segments', () => {
  withProject(({ root, run }) => {
    assertSavedSource(root, imageSource(run(['--save', 'assets/été #1'])), 'assets/%C3%A9t%C3%A9%20%231/');
  });
});

test('JSON keeps an absolute saved filesystem path', () => {
  withProject(({ root, run }) => {
    const output = JSON.parse(run(['--save', 'assets', '--json']));
    const saved = output.subjects[0].picks[0].saved;
    assert.ok(isAbsolute(saved));
    assert.equal(realpathSync(saved), realpathSync(resolve(root, 'assets', readdirSync(join(root, 'assets'))[0])));
    assert.deepEqual(readFileSync(saved), Buffer.from(png, 'base64'));
  });
});

test('failed downloads keep the remote image fallback', () => {
  withProject(({ run }) => {
    const output = run(['--save', 'assets'], true);
    assert.ok(imageSource(output).startsWith('https://upload.wikimedia.org/'));
    assert.ok(output.includes('not saved: HTTP 503'));
    assert.ok(output.includes('srcset='));
  });
});

test('without save the remote source and srcset remain available', () => {
  withProject(({ run }) => {
    const output = run();
    assert.ok(imageSource(output).startsWith('https://upload.wikimedia.org/'));
    assert.ok(output.includes('srcset='));
  });
});
