#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { homedir } from "node:os";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.dirname(HERE);
const HOME = homedir();

const PAYLOAD = ["SKILL.md", "LICENSE", "references", "scripts", "agents"];

const TARGETS = {
  claude: {
    label: "Claude Code",
    dir: path.join(HOME, ".claude", "skills", "hallmark"),
    detect: () => fs.existsSync(path.join(HOME, ".claude")),
  },
  codex: {
    label: "Codex CLI and Cursor",
    dir: path.join(HOME, ".agents", "skills", "hallmark"),
    detect: () => [".codex", ".agents", ".cursor"].some((d) => fs.existsSync(path.join(HOME, d))),
    legacy: path.join(HOME, ".codex", "skills", "hallmark"),
  },
  opencode: {
    label: "OpenCode",
    dir: path.join(HOME, ".config", "opencode", "skills", "hallmark"),
    detect: () => fs.existsSync(path.join(HOME, ".config", "opencode")) || fs.existsSync(path.join(HOME, ".opencode")),
  },
};

const args = process.argv.slice(2);
const has = (f) => args.includes(f);
const FLAGS = ["--claude", "--codex", "--opencode", "--cursor", "--copy", "--dry-run", "--force", "--remove", "--help", "-h"];
const unknown = args.filter((a) => !FLAGS.includes(a));
if (has("--help") || has("-h") || unknown.length) {
  if (unknown.length) console.log(`Unknown option: ${unknown.join(" ")}\n`);
  console.log(`node install.mjs [--claude] [--codex] [--cursor] [--opencode] [--copy] [--dry-run] [--force] [--remove]

  Installs Hallmark for every harness it finds (or only the ones named), after checking every theme and reference.
  --dry-run  print what would be copied and change nothing
  --copy     give OpenCode its own copy instead of reading the Claude Code or Codex one
  --force    install even if the checks find a problem
  --remove   delete every installed copy`);
  process.exit(unknown.length ? 2 : 0);
}
const DRY = has("--dry-run");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name === ".DS_Store" || entry.name === ".hallmark" || entry.name === "node_modules" || entry.name === "fixtures") continue;
    if (entry.isSymbolicLink()) continue; // never follow a link out of the skill into the install
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function installTo(dir) {
  if (DRY) return console.log(`  would install -> ${dir}`);
  const tmp = dir + ".tmp-install";
  fs.rmSync(tmp, { recursive: true, force: true });
  fs.mkdirSync(tmp, { recursive: true });
  for (const item of PAYLOAD) {
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
const picked = explicit.length ? explicit : Object.keys(TARGETS).filter((k) => TARGETS[k].detect());

if (!picked.length) {
  console.log("No harness detected (~/.claude, ~/.codex, ~/.agents, ~/.cursor, ~/.config/opencode all absent).");
  console.log("Pick explicitly: node install.mjs --claude --codex --opencode");
  process.exit(1);
}

const { execFileSync } = await import("node:child_process");
try {
  if (!DRY) execFileSync(process.execPath, [path.join(HERE, "theme.mjs"), "index"], { stdio: "inherit" });
} catch {
  console.log("  (theme index not rebuilt; run node scripts/theme.mjs index)");
}
const gate = (label, argv) => {
  try { execFileSync(process.execPath, argv, { stdio: "pipe" }); return true; }
  catch (e) { console.log(`\n${label} failed:\n${String(e.stdout || "").trim()}`); return false; }
};
const themeFiles = fs.readdirSync(path.join(SKILL_ROOT, "references", "themes")).filter((f) => f.endsWith(".md")).map((f) => path.join(SKILL_ROOT, "references", "themes", f));
const clean = gate("refcheck", [path.join(HERE, "refcheck.mjs"), "--errors"]) & gate("theme validate", [path.join(HERE, "theme.mjs"), "validate", ...themeFiles]);
if (!clean && !has("--force")) {
  console.log("\nNothing installed. Fix the findings above, or pass --force to install anyway.");
  process.exit(1);
}
console.log(`Hallmark installer${DRY ? " (dry run)" : ""} · payload: ${PAYLOAD.join(", ")}`);

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

  installTo(t.dir);

  if (key === "codex" && fs.existsSync(t.legacy)) {
    console.log(`  an older copy sits at ${t.legacy}; Codex may list Hallmark twice. Remove it with: node install.mjs --remove, then install again.`);
  }
}

console.log(`\nDone. Invoke as: /hallmark (Claude Code) · $hallmark (Codex) · /hallmark (Cursor, OpenCode).`);
