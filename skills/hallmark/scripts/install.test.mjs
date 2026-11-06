#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { test, describe } from "node:test";
import { strictEqual, ok } from "node:assert";
import { fileURLToPath } from "node:url";
import path from "node:path";

const SCRIPT = path.join(path.dirname(fileURLToPath(import.meta.url)), "install.mjs");
const NODE = process.execPath;

function runInstall(args) {
  const result = spawnSync(NODE, [SCRIPT, ...args]);
  return {
    code: result.status,
    out: result.stdout.toString(),
    err: result.stderr.toString(),
  };
}

describe("install flags", () => {
  test("--help lists --no-universal, --no-universal-agents, --no-agents, --no-auto", () => {
    const r = runInstall(["--help"]);
    strictEqual(r.code, 0);
    ok(r.out.includes("--no-universal"), "--no-universal listed in help");
    ok(r.out.includes("--no-universal-agents"), "--no-universal-agents listed in help");
    ok(r.out.includes("--no-agents"), "--no-agents listed in help");
    ok(r.out.includes("--no-auto"), "--no-auto listed in help");
  });

  test("--no-auto without explicit target exits with error", () => {
    const r = runInstall(["--no-auto"]);
    strictEqual(r.code, 1);
    ok(r.out.includes("--no-auto requires"), "error message mentions --no-auto requires explicit target");
  });

  test("--no-agents excludes agents from payload line", () => {
    const r = runInstall(["--dry-run", "--no-agents"]);
    const payloadLine = r.out.split("\n").find((l) => l.includes("payload:"));
    ok(payloadLine, "payload line present");
    ok(!payloadLine.includes("agents"), "agents excluded from payload");
  });

  test("default payload includes agents", () => {
    const r = runInstall(["--dry-run"]);
    const payloadLine = r.out.split("\n").find((l) => l.includes("payload:"));
    ok(payloadLine, "payload line present");
    ok(payloadLine.includes("agents"), "agents included in payload by default");
  });

  test("--no-universal skips the codex (universal agents) target", () => {
    const r = runInstall(["--dry-run", "--no-universal"]);
    strictEqual(r.code, 0);
    ok(r.out.includes("Claude Code"), "Claude Code target still present");
    ok(!r.out.includes("Codex CLI and Cursor"), "Codex target (universal agents) skipped");
  });

  test("--no-universal skips codex target even when explicitly requested", () => {
    const r = runInstall(["--dry-run", "--no-universal", "--codex"]);
    // --no-universal filters out codex, leaving no targets -> exits with error
    strictEqual(r.code, 1);
    ok(r.out.includes("No targets selected"), "error message about no targets");
  });

  test("--no-agents and --no-universal work together", () => {
    const r = runInstall(["--dry-run", "--no-agents", "--no-universal"]);
    const payloadLine = r.out.split("\n").find((l) => l.includes("payload:"));
    ok(payloadLine, "payload line present");
    ok(!payloadLine.includes("agents"), "agents excluded from payload");
    ok(r.out.includes("Claude Code"), "Claude Code still present");
    ok(!r.out.includes("Codex CLI and Cursor"), "Codex skipped");
  });

  test("--no-universal-agents excludes agents from universal targets only", () => {
    const r = runInstall(["--dry-run", "--no-universal-agents", "--codex", "--claude"]);
    strictEqual(r.code, 0);
    const codexPayload = r.out.split("\n").find((l) => l.includes("Codex CLI and Cursor"));
    const claudePayload = r.out.split("\n").find((l) => l.includes("Claude Code"));
    ok(codexPayload, "Codex target present");
    ok(claudePayload, "Claude Code target present");
    // Check that agents are excluded from universal target (codex) but included for non-universal (claude)
    const codexPayloadLine = r.out.split("\n").find((l) => l.includes("Codex CLI and Cursor") || l.includes("payload:"));
    // The payload line for each target should show agents excluded for codex
    const lines = r.out.split("\n");
    let inCodex = false;
    let inClaude = false;
    let codexHasAgents = false;
    let claudeHasAgents = false;
    for (const line of lines) {
      if (line.includes("Codex CLI and Cursor")) inCodex = true;
      if (line.includes("Claude Code")) inClaude = true;
      if (line.includes("payload:") && inCodex) {
        codexHasAgents = line.includes("agents");
        inCodex = false;
      }
      if (line.includes("payload:") && inClaude) {
        claudeHasAgents = line.includes("agents");
        inClaude = false;
      }
    }
    ok(!codexHasAgents, "agents excluded from universal target (codex) with --no-universal-agents");
    ok(claudeHasAgents, "agents included for non-universal target (claude) with --no-universal-agents");
  });

  test("--no-universal-agents with --no-universal skips universal target entirely", () => {
    const r = runInstall(["--dry-run", "--no-universal-agents", "--no-universal", "--codex", "--claude"]);
    strictEqual(r.code, 0);
    ok(!r.out.includes("Codex CLI and Cursor"), "universal target skipped with --no-universal");
    ok(r.out.includes("Claude Code"), "Claude Code still present");
    const claudePayloadLine = r.out.split("\n").find((l) => l.includes("Claude Code") || l.includes("payload:"));
    const lines = r.out.split("\n");
    let inClaude = false;
    let claudeHasAgents = false;
    for (const line of lines) {
      if (line.includes("Claude Code")) inClaude = true;
      if (line.includes("payload:") && inClaude) {
        claudeHasAgents = line.includes("agents");
        inClaude = false;
      }
    }
    ok(claudeHasAgents, "agents included for claude when --no-universal skips universal target");
  });

  test("--no-universal-agents implies agents for non-universal targets", () => {
    const r = runInstall(["--dry-run", "--no-universal-agents", "--claude", "--opencode", "--copy"]);
    strictEqual(r.code, 0);
    const lines = r.out.split("\n");
    let inClaude = false;
    let inOpencode = false;
    let claudeHasAgents = false;
    let opencodeHasAgents = false;
    for (const line of lines) {
      if (line.includes("Claude Code")) inClaude = true;
      if (line.includes("OpenCode")) inOpencode = true;
      if (line.includes("payload:") && inClaude) {
        claudeHasAgents = line.includes("agents");
        inClaude = false;
      }
      if (line.includes("payload:") && inOpencode) {
        opencodeHasAgents = line.includes("agents");
        inOpencode = false;
      }
    }
    ok(claudeHasAgents, "agents included for claude (non-universal) with --no-universal-agents");
    ok(opencodeHasAgents, "agents included for opencode (non-universal) with --no-universal-agents");
  });
});
