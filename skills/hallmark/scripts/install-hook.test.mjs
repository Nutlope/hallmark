import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

test("reinstall and removal recognize the hook from a renamed checkout", (t) => {
  const root = mkdtempSync(join(tmpdir(), "hallmark-hook-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const scripts = join(root, "renamed-checkout", "scripts");
  mkdirSync(scripts, { recursive: true });
  const installer = join(scripts, "install-hook.mjs");
  copyFileSync(new URL("./install-hook.mjs", import.meta.url), installer);

  const settingsDir = join(root, ".claude");
  mkdirSync(settingsDir);
  const settingsPath = join(settingsDir, "settings.json");
  const other = { matcher: "Write", hooks: [{ type: "command", command: "echo other" }] };
  writeFileSync(settingsPath, JSON.stringify({ hooks: { PostToolUse: [other] } }));
  const run = (...args) => execFileSync(process.execPath, [installer, ...args], { cwd: root });
  const hooks = () => JSON.parse(readFileSync(settingsPath, "utf8")).hooks.PostToolUse;

  run();
  assert.equal(hooks().length, 2);
  run();
  assert.equal(hooks().length, 2);
  run("--remove");
  assert.deepEqual(hooks(), [other]);
});
