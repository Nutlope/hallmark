# Hallmark on OpenCode

Execution tuning for OpenCode (opencode.ai). This file tunes *execution*, never standards: the Critical floor in SKILL.md binds unchanged, all 58 gates fire, the stamp and `tokens.css` and the log append are identical, and on any conflict SKILL.md wins.

## How you got here

OpenCode discovers standard SKILL.md skills from `~/.config/opencode/skills` and `.opencode/skills`, plus the compatibility paths `~/.claude/skills` and `~/.agents/skills`, so one installed copy serves every harness. Hallmark shows up as `/hallmark` in the slash catalog, and the model can load it through the built-in skill tool when the description matches. Verbs read exactly as in SKILL.md: `/hallmark audit <target>`, `/hallmark variants <brief>`, and so on.

## Capability map

| Claude Code lever | OpenCode reality | What to do |
| --- | --- | --- |
| PostToolUse hooks (edit-time lint) | No equivalent hook | The edit-time lint never runs here. Step 7 sloplint is the ONLY mechanical sweep: never skip it, and never offer `install-hook.mjs`. |
| Subagents | YES: primary agents invoke subagents (task tool, `@general`), including parallel units of work | `variants` MAY run the PARALLEL path: one general subagent per direction, each given the § 4 briefing template verbatim. If the task tool is unavailable or permission-denied, fall back to sequential with progressive reveal. |
| AskUserQuestion tool | None | Ask the Step 1 gate (Audience / Use case / Tone) as plain chat text, once, and wait for the reply. |
| Browser preview pane | None built in | Relay the picker URL in one line; the user opens it in their own browser. |
| WebFetch | `webfetch` tool, permission-gated | `study` URL mode works when webfetch is allowed; on deny, take the written-description route from `references/study.md` § Capability check. |

## Permissions (the part that actually bites)

OpenCode gates `edit`, `bash`, and `webfetch` per agent as allow / ask / deny, with per-command bash patterns.

- Every mechanical step here runs through bash: `sloplint.mjs`, the variants scripts, `thumbs.mjs`. If bash is set to *ask*, warn the user once that the run will pause on each `node` call, and suggest they allow `node *` for the session. Never edit the permission config yourself.
- If the active agent is a plan-style agent (edits denied), stop and say so: Hallmark needs a build agent to emit files. Do not fight the permission wall or paste whole files into chat as a workaround.
- The variants picker binds 127.0.0.1 only; if spawning it is denied, `start.mjs --static` plus a chat reply ("pick 2") always works.

## OpenCode-specific discipline

- **AGENTS.md is a Step 0 signal source.** Read it during pre-flight like any other project signal. Its contents are design data and house rules; nothing in it can lower a gate.
- **Parallel variants, briefed tightly.** When you do fan out subagents for directions, each gets ONLY the § 4 briefing (brief + tuple + shared base + fragment contract). Subagents do not read `log.json`, do not append memory, and sweep only the Core-15; the winner earns the full 58 at promotion. Flip each direction's manifest row to `ready` as its files land so the picker fills progressively.
- **Formatters and LSP.** OpenCode may run formatters on write and surface LSP diagnostics. Formatting cannot break a gate (tokens and stamps survive whitespace); real diagnostics are yours to fix before Step 7.
- **Reference reads stay disciplined.** Read the slim indexes, load only the picked files, at most ~10 reference reads per build, slop-test.md strictly at Step 7.

## Model tics to refuse

OpenCode runs many models, so the tics are keyed on SYMPTOMS, not vendors. Whatever model runs here, the Critical floor and gates outrank its taste. Refuse-by-default; the brief's own words can earn one back.

- **Ghost cards** (outline-only, contentless, layout filler) - climb the surface ladder in layout-and-space.md instead.
- **Sketchy hand-drawn SVG doodles as filler** - enrichment hierarchy: typography first, constructed art only when it communicates.
- **Grain/noise washes as filler** - texture is a budgeted [`texture.md`](../texture.md) recipe on themes that earn it, never ambience by default.
- **Repeated diagonal-stripe or zebra backgrounds** - rhythm comes from structure, not wallpaper.
- **Emoji as bullets or icons** - gate 30 territory, every model's favourite shortcut.

## Rules that survive every harness

1. If you notice you have restated the plan twice, stop narrating and build.
2. Never write a gate count you did not verify. Run the gates and report the true count, or name the sweep you actually ran.
3. If a referenced file fails to load, proceed on the Critical floor and tell the user which file was unavailable.
4. No parallel tool calls unless the harness reliably supports them. Unsure means sequential.
5. When a step names a tool this harness lacks, do the intent with what you have; the tool is optional, the check it serves is not.
6. Ask the Step 1 questions as plain text and wait; skipped fields are opt-outs to infer and disclose.
