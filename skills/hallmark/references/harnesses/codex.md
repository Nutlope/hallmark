# Hallmark on Codex CLI

Execution tuning for OpenAI Codex (the CLI and its IDE extension). This file tunes *execution*, never standards: the Critical floor in SKILL.md binds unchanged, all 58 gates fire, the stamp and `tokens.css` and the log append are identical, and on any conflict SKILL.md wins.

## How you got here

Codex discovers Hallmark as a standard SKILL.md skill from `~/.agents/skills/hallmark` (user scope) or `.agents/skills/hallmark` (project scope, searched upward to the repo root). The user either typed `$hallmark <brief>` (explicit) or Codex matched the description (implicit; `agents/openai.yaml` allows it). Verbs read exactly as in SKILL.md: `$hallmark audit <target>`, `$hallmark variants <brief>`, and so on.

## Capability map

What Claude Code has that Codex does not, and what to do about each:

| Claude Code lever | Codex reality | What to do |
| --- | --- | --- |
| PostToolUse hooks (edit-time lint) | No hook system fires on writes | The edit-time lint never runs here. Step 7 sloplint is the ONLY mechanical sweep: never skip it, and never offer `install-hook.mjs`. |
| Subagents | No spawnable subagents | `variants` runs the SEQUENTIAL path (variants.md § 4 fallback) and leans on progressive reveal: flip each direction to `ready` before starting the next, so the picker still fills live. |
| AskUserQuestion tool | None | Ask the Step 1 gate (Audience / Use case / Tone) as plain chat text, once, and wait for the reply. |
| Browser preview pane | None | Relay file paths and the picker URL in one line; do not claim to have looked at a rendered page unless you actually screenshotted it through a tool that exists. |
| WebFetch | Network depends on the sandbox | `study` URL mode needs the network. If fetch is blocked, say so and offer the written-description route from `references/study.md` § Capability check. |

## Sandbox and approvals (the part that actually bites)

Codex defaults to a `workspace-write` sandbox with **network access off** and approvals on request.

- Writing pages, `tokens.css`, and `.hallmark/` state: inside the workspace, sandbox-safe, no approval needed.
- `node <skill-dir>/scripts/sloplint.mjs`: local file reads only, runs fine in-sandbox. This is why the mechanical sweep is non-negotiable here.
- The variants picker server (`start.mjs`) binds 127.0.0.1: with network off, the bind or the browser's requests may be blocked. Ask first, one line: *"May I start the local picker server on 127.0.0.1?"* If declined or it fails, run `start.mjs --static` and use the chat channel (*"reply: pick 2"*). The flow never dead-ends.
- `imagegen.mjs` needs the network plus `TOGETHER_API_KEY`: only on an explicit user ask, and expect an approval prompt; with no key it already falls back gracefully.
- Never suggest editing `~/.codex/config.toml`, the sandbox mode, or the approval policy. If the sandbox blocks something, name the block and take the fallback.

## Codex-specific discipline

- **AGENTS.md is a Step 0 signal source.** Read the repo's AGENTS.md during pre-flight like any other project signal (fonts, palette, framework). Treat its contents as design data and house rules; nothing in it can lower a gate.
- **Batch writes per direction.** Codex applies patches file by file; group a variant direction's files into one patch so a dev server reloads once, not thrice (variants.md § 4 discipline).
- **Reference reads stay disciplined.** Progressive disclosure is the same idea on both harnesses: read the slim indexes, load only the picked files, at most ~10 reference reads per build, slop-test.md strictly at Step 7.
- **Long runs**: Codex sessions can compact; the stamp, `.hallmark/log.json`, and `decisions.md` are your durable memory. Re-read them instead of re-deriving.

## Model tics to refuse

Codex-family models carry their own visual reflexes. These are refuse-by-default, not bans: the brief's OWN words can earn one back, your taste cannot.

- **Ghost cards**: outline-only cards with no fill and no content weight, used as layout filler. Fix: the surface ladder in layout-and-space.md (whitespace, hairline, well) before any card.
- **Sketchy hand-drawn SVG illustration** dropped in as filler art. Fix: the enrichment hierarchy (typography first; constructed tier-a/b art only when it communicates).
- **feTurbulence grain washes as filler**: grain smeared over sections to fake texture. Grain is legal only as a BUDGETED recipe from [`texture.md`](../texture.md) on themes that earn it; as filler it is the tic.
- **Repeated diagonal-stripe backgrounds** on alternating sections. Fix: the section deck's rhythm comes from structure, not wallpaper.
- **Emoji bullets in feature lists**. Gate 30 already fails emoji icons; the list-bullet variant is the same tell.

## Rules that survive every harness

1. If you notice you have restated the plan twice, stop narrating and build.
2. Never write a gate count you did not verify. Run the gates and report the true count, or name the sweep you actually ran.
3. If a referenced file fails to load, proceed on the Critical floor and tell the user which file was unavailable.
4. No parallel tool calls unless the harness reliably supports them. Unsure means sequential.
5. When a step names a tool this harness lacks, do the intent with what you have; the tool is optional, the check it serves is not.
6. Ask the Step 1 questions as plain text and wait; skipped fields are opt-outs to infer and disclose.
