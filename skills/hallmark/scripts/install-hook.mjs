#!/usr/bin/env node
// Install the Hallmark edit-time lint hook into a project's .claude/settings.json.
//
//   node install-hook.mjs [--global] [--print] [--remove]
//
//   (default)  merge the hook into ./.claude/settings.json (project scope)
//   --global   target ~/.claude/settings.json instead
//   --print    print the hook block and the target path; write nothing
//   --remove   remove the Hallmark hook (matched by its command path)
//
// Idempotent: re-running never duplicates the hook. Claude Code only. The hook
// is advisory (never blocks a write); see lint-hook.mjs.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

const HERE = dirname(fileURLToPath(import.meta.url));
const HOOK_CMD = `node "${join(HERE, "lint-hook.mjs")}"`;
const MATCHER = "Write|Edit|MultiEdit";

const args = process.argv.slice(2);
const has = (f) => args.includes(f);

const settingsPath = has("--global")
  ? join(homedir(), ".claude", "settings.json")
  : join(process.cwd(), ".claude", "settings.json");

const hookEntry = {
  matcher: MATCHER,
  hooks: [{ type: "command", command: HOOK_CMD, timeout: 5000 }],
};

function readSettings() {
  if (!existsSync(settingsPath)) return {};
  try { return JSON.parse(readFileSync(settingsPath, "utf8")); } catch {
    console.error(`refusing to overwrite unparseable ${settingsPath}; fix or delete it first.`);
    process.exit(1);
  }
}

function isOurs(entry) {
  return (entry?.hooks ?? []).some((h) => typeof h?.command === "string" && h.command.includes("lint-hook.mjs"));
}

if (has("--print")) {
  console.log(`# add to ${settingsPath} :`);
  console.log(JSON.stringify({ hooks: { PostToolUse: [hookEntry] } }, null, 2));
  process.exit(0);
}

const settings = readSettings();
settings.hooks ??= {};
settings.hooks.PostToolUse ??= [];

// drop any existing Hallmark hook (keeps everyone else's hooks intact)
settings.hooks.PostToolUse = settings.hooks.PostToolUse.filter((e) => !isOurs(e));

if (has("--remove")) {
  writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
  console.log(`removed the Hallmark lint hook from ${settingsPath}`);
  process.exit(0);
}

settings.hooks.PostToolUse.push(hookEntry);
mkdirSync(dirname(settingsPath), { recursive: true });
writeFileSync(settingsPath, JSON.stringify(settings, null, 2) + "\n");
console.log(`installed the Hallmark edit-time lint hook into ${settingsPath}`);
console.log(`it lints .html/.css Hallmark artifacts on write and advises (never blocks). Remove with --remove.`);
