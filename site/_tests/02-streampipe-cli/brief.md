# Test 02 v2 — Streampipe (open-source CLI)

## The prompt (verbatim, same as v1)

> "Make a docs landing for an open-source CLI called Streampipe. It does stream parsing for log/event pipelines. Use the Terminal theme. Audience: backend developers. Use case: install the tool and read the docs. Tone: technical, terse."

## Step 0 · Pre-flight

> *"No pre-flight signals — proceeding with full Hallmark stack."*

## Step 1 · Design-context gate — fully answered

Audience, use, tone, theme all explicit. No inference.

## Step 2.5 · Project memory rotation

> *"Previous run on this brief picked Workbench + Terminal. The user explicitly requested Terminal again, so theme is fixed. Picking from {Long Document, Component Playground, Specimen} for the macro this time — Long Document fits a docs-landing brief because the page asks the user to read, not click through a sticky tour."*
>
> *"Theme: Terminal as requested. No theme rotation when the user names one."*

## Step 3 · Visual ruleset loaded

`macrostructures.md` (Long Document), `component-cookbook.md`, `typography.md` (single-family monospace specimen — the design IS mono), `color.md` (Terminal phosphor palette), `microinteractions.md` (single primitive: caret blink in code blocks), `anti-patterns.md`.

## Step 4 · Hero enrichment

> *"Enrichment: Tier-A pure-CSS terminal mockup, but inline as a `<pre>` rendered code block — no clipped-edge browser frame. The Long Document macro wants the demo embedded in the prose, not floated next to a sticky tour. Same anti-Lottie call as v1; different placement."*

## Step 5 · Preview

```markdown
**Hallmark · v0.6.0**

- **Macrostructure** · Long Document
- **Theme** · Terminal (dark phosphor paper · IBM Plex Mono throughout · phosphor-green accent)
- **Enrichment** · Tier-A pure-CSS terminal blocks (inline, embedded in prose)
- **Sections** · Masthead · Lede · Install · How it works (3 numbered notes) · Examples · Flag table · Colophon
- **Motion** · caret blink in code blocks (1 primitive)
- **Slop test** · 38 / 38 ✓
- **Diversification** · differs from v1 (Workbench/Terminal) on macrostructure (Workbench → Long Document); theme fixed by user request
```

## Step 6 · Macrostructure stamp

```
/* Hallmark · macrostructure: Long Document · H5 hero knobs: salutation=command, body=2 paragraphs, signoff=mit-license
 * theme: Terminal · accent: phosphor-green ~6% (functional, not decorative)
 * enrichment: Tier-A inline CSS-art terminal blocks (no sticky pin, no Lottie)
 * studied: no · context: explicit · v0.6.0
 */
```

## What changed vs v1

- **Macro:** Workbench → Long Document. v1's Workbench pinned a code panel on the right and stepped through three actions; v2's Long Document writes the docs as prose with the demo embedded inline. Both honor the brief; the rotation rule pushed v2 toward Long Document.
- **Theme:** unchanged (Terminal — user-requested, can't rotate).
- **Enrichment placement:** v1's clipped-edge demo terminal is now an inline `<pre>` block embedded in paragraph 2. Same Tier-A custom-craft, different layout role.
- **Voice:** v1 opened with `$ streampipe --help`; v2 opens with a single sentence describing what the CLI does. The `$` command moves to the install section.

## What stayed the same

- Theme (Terminal — user-requested).
- Single-family monospace specimen (typography.md allows this when the single font IS the design).
- Slop test: 38 / 38 ✓.
- Enrichment tier (Tier-A pure-CSS).
