#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(HERE);
const HOME = homedir();

const PAYLOAD = ["SKILL.md", "LICENSE", "references", "scripts"];
const AGENTS_PAYLOAD = ["agents"];

const TARGETS = {
  claude: {
    label: "Claude Code",
    dir: path.join(HOME, ".claude", "skills", "hallmark"),
    detect: () => fs.existsSync(path.join(HOME, ".claude")),
    agents: true,
  },
  codex: {
    label: "Codex CLI and Cursor",
    dir: path.join(HOME, ".agents", "skills", "hallmark"),
    detect: () => [".codex", ".agents", ".cursor"].some((d) => fs.existsSync(path.join(HOME, d))),
    legacy: path.join(HOME, ".codex", "skills", "hallmark"),
    universal: true,
    agents: true,
  },
  opencode: {
    label: "OpenCode",
    dir: path.join(HOME, ".config", "opencode", "skills", "hallmark"),
    detect: () => fs.existsSync(path.join(HOME, ".config", "opencode")) || fs.existsSync(path.join(HOME, ".opencode")),
    agents: true,
  },
};

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const FLAGS = ["--claude", "--codex", "--opencode", "--cursor", "--copy", "--dry-run", "--force", "--remove", "--help", "-h", "--no-auto", "--no-universal", "--no-universal-agents", "--no-agents"];
const unknown = args.filter((a) => !FLAGS.includes(a));
if (has("--help") || has("-h") || unknown.length) {
  if (unknown.length) console.log(`Unknown option: ${unknown.join(" ")}\n`);
  console.log(`node install.mjs [--claude] [--codex] [--cursor] [--opencode] [--copy] [--dry-run] [--force] [--remove] [--no-auto] [--no-universal] [--no-universal-agents] [--no-agents]

  Installs Hallmark for every harness it finds (or only the ones named), after checking every theme and reference.
  --dry-run  print what would be copied and change nothing
  --copy     give OpenCode its own copy instead of reading the Claude Code or Codex one
  --force    install even if the checks find a problem
  --remove   delete every installed copy
  --no-auto    disable auto-detection; require explicit target flags
  --no-universal  skip the universal agents (~/.agents/) target
  --no-universal-agents  skip the agents/ directory for universal targets only (OpenAI agent config used by Amp, Antigravity, Cline, Codex, Cursor, Deep Agents, Gemini CLI, GitHub Copilot, Kimi Code CLI, OpenCode, Warp, Zed)
  --no-agents  do not install the agents/ directory (OpenAI agent config used by Amp, Antigravity, Cline, Codex, Cursor, Deep Agents, Gemini CLI, GitHub Copilot, Kimi Code CLI, OpenCode, Warp, Zed)`);
  process.exit(unknown.length ? 2 : 0);
}
const DRY = has("--dry-run");
const NO_AGENTS = has("--no-agents");
const NO_UNIVERSAL = has("--no-universal");
const NO_UNIVERSAL_AGENTS = has("--no-universal-agents");
const NO_AUTO = has("--no-auto");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === ".DS_Store" || entry.name === ".hallmark" || entry.name === "node_modules" || entry.name === "fixtures") continue;
    if (entry.isSymbolicLink()) continue; // never follow a link out of the skill into the install
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(s, d); }
  }
}

function installTo(dir, payload) {
  if (DRY) return console.log(`  would install -> ${dir}`);
  const tmp = dir + ".tmp-install";
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  for (const item of payload) {
    const src = path.join(SKILL_ROOT, item);
    if (!fs.existsSync(src)) continue;
    const dest = path.join(tmp, item);
    if (fs.statSync(src).isDirectory()) copyDir(src, dest);
    else { fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.copyFileSync(src, dest); }
  }
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(path.dirname(dir), { recursive: true });
  fs.renameSync(tmp, dir);
  console.log(`  installed -> ${dir}`);
}

function removeAt(dir) {
  if (!fs.existsSync(dir)) return;
  if (DRY) return console.log(`  would remove ${dir}`);
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(`  removed ${dir}`);
}

if (has("--remove")) {
  console.log("Removing Hallmark from every known install location:");
  for (const t of Object.values(TARGETS)) removeAt(t.dir);
  removeAt(TARGETS.codex.legacy);
  process.exit(0);
}

const explicit = ["claude", "codex", "opencode"].filter((k) => has("--" + k) || (k === "codex" && has("--cursor")));
let picked;
if (explicit.length) {
  picked = explicit;
} else if (NO_AUTO) {
  console.log("--no-auto requires at least one explicit target: --claude, --codex, --cursor, or --opencode");
  process.exit(1);
} else {
  picked = Object.keys(TARGETS).filter((k) => TARGETS[k].detect());
}
if (NO_UNIVERSAL) {
  picked = picked.filter((k) => !TARGETS[k].universal);
}
if (!picked.length) {
  console.log("No targets selected. Use --claude, --codex, --cursor, --opencode, or run without --no-auto to auto-detect.");
  process.exit(1);
}

const { execFileSync } = await import("node:child_process");
try {
  if (!DRY) execFileSync(process.execPath, [path.join(HERE, "theme.mjs"), "index"], { stdio: "inherit" });
} catch {
  console.log("  (theme index not rebuilt; run node scripts/theme.mjs index)");
}
const gate = (label, argv) => {
  try {
    execFileSync(process.execPath, argv, { stdio: "pipe" });
    return true;
  } catch {
    return false;
  }
};
const themeFiles = fs.readdirSync(path.join(SKILL_ROOT, "references", "themes")).filter((f) => f.endsWith(".md")).map((f) => path.join(SKILL_ROOT, "references", "themes", f));
const clean = gate("refcheck", [path.join(HERE, "refcheck.mjs"), "--errors"]) & gate("theme validate", [path.join(HERE, "theme.mjs"), "validate", ...themeFiles]);
if (!clean && !has("--force")) {
  console.log("Checks failed. Use --force to install anyway.");
  process.exit(1);
}

console.log(`Hallmark installer${DRY ? " (dry run)" : ""}`);

for (const key of picked) {
  const t = TARGETS[key];
  console.log(`\n${t.label}:`);

  if (key === "opencode" && !has("--copy")) {
    const willHaveCompat = picked.includes("claude") || picked.includes("codex") ||
      fs.existsSync(TARGETS.claude.dir) || fs.existsSync(TARGETS.codex.dir);
    if (willHaveCompat) {
      console.log(`  skipped: OpenCode auto-discovers the Claude Code / Codex copy via its compatibility paths.`);
      console.log(`  (force an explicit copy with: node install.mjs --opencode --copy)`);
      continue;
    }
  }

  const targetPayload = [...PAYLOAD, ...(NO_AGENTS || (NO_UNIVERSAL_AGENTS && t.universal) || !t.agents ? [] : AGENTS_PAYLOAD)];
  console.log(`  payload: ${targetPayload.join(", ")}`);

  installTo(t.dir, targetPayload);

  if (key === "codex" && fs.existsSync(t.legacy)) {
    console.log(`  an older copy sits at ${t.legacy}; Codex may list Hallmark twice. Remove it with: node install.mjs --remove, then install again.`);
  }
}

console.log(`\nDone. Invoke as: /hallmark (Claude Code) · $hallmark (Codex) · /hallmark (Cursor, OpenCode).`);
