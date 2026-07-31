#!/usr/bin/env node
// Hallmark edit-time lint hook (Claude Code PostToolUse).
//
// Wire it in .claude/settings.json (see install-hook.mjs) on Write|Edit|MultiEdit.
// It lints a Hallmark artifact the instant it is written and feeds any FAILs
// back ADVISORILY via `additionalContext`, so slop dies at the keystroke instead
// of at Step 7. It NEVER blocks a write, never exits non-zero, never writes files.
//
// Contract:
//   - stdin: the PostToolUse JSON ({ tool_name, tool_input:{file_path,...}, ... }).
//   - stdout: `{}` (silent no-op) OR `{"additionalContext":"..."}` (advisory).
//   - exit: always 0.
//
// It no-ops silently unless the written file is a .html/.css that looks like a
// Hallmark artifact (carries the stamp, or a <style>/:root block). WARNs are
// excluded (only FAILs are worth interrupting for). Any internal error -> `{}`.
//
// Claude Code only; other harnesses simply never fire it (Step 7 still lints).

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OK = (obj = {}) => { process.stdout.write(JSON.stringify(obj)); process.exit(0); };

function main() {
  // --- read the hook payload from stdin ---
  let raw = "";
  try { raw = readFileSync(0, "utf8"); } catch { return OK(); }
  let payload;
  try { payload = JSON.parse(raw); } catch { return OK(); }

  const filePath = payload?.tool_input?.file_path;
  if (typeof filePath !== "string" || !filePath) return OK();
  const lower = filePath.toLowerCase();
  if (!lower.endsWith(".html") && !lower.endsWith(".css")) return OK();

  // --- read the file from disk (already written; robust for Write/Edit/MultiEdit) ---
  let src = "";
  try { src = readFileSync(filePath, "utf8"); } catch { return OK(); }
  if (src.length === 0) return OK();

  // --- artifact sniff: only lint things Hallmark authored ---
  const looksHallmark =
    /\/\*\s*Hallmark/.test(src) ||          // the stamp
    /:root\s*\{/.test(src) ||               // a token block
    (lower.endsWith(".html") && /<style[\s>]/i.test(src)); // an inline-styled page
  if (!looksHallmark) return OK();

  // --- light genre / scope detection to cut false nags ---
  const gm = src.match(/genre:\s*(editorial|modern-minimal|atmospheric|playful)/i);
  const args = [filePath, "--json"];
  if (gm) args.push("--genre", gm[1].toLowerCase());
  if (/·\s*component:/i.test(src) || lower.endsWith(".preview.html")) args.push("--scope", "component");

  // --- run sloplint (sibling script); swallow everything on failure ---
  const sloplint = join(dirname(fileURLToPath(import.meta.url)), "sloplint.mjs");
  let out = "";
  try {
    out = execFileSync(process.execPath, [sloplint, ...args], {
      encoding: "utf8",
      timeout: 4000,
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch (e) {
    // sloplint exits 1 when it finds a FAIL; its JSON is still on stdout.
    out = e?.stdout?.toString?.() ?? "";
  }
  if (!out) return OK();

  let report;
  try { report = JSON.parse(out); } catch { return OK(); }
  const fails = (report?.findings ?? []).filter((f) => f.grade === "FAIL");
  if (fails.length === 0) return OK();

  const name = filePath.split("/").pop();
  const lines = fails.slice(0, 12).map((f) => `- gate ${f.gate} (line ${f.line}): ${f.evidence} -> ${f.fix}`);
  const more = fails.length > 12 ? `\n  (+${fails.length - 12} more)` : "";
  const ctx =
    `Hallmark lint on ${name}: ${fails.length} FAIL${fails.length === 1 ? "" : "s"} before this passes Step 7.\n` +
    lines.join("\n") + more +
    `\nFix these now while the context is small; run scripts/sloplint.mjs to re-check.`;
  return OK({ additionalContext: ctx });
}

try { main(); } catch { OK(); }
