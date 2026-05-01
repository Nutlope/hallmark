# Test 05 v2 — Tracejam (SaaS observability)

## The prompt (verbatim, same as v1)

> "Build a landing page for Tracejam — a tracing/observability tool for distributed systems. Audience: SREs and platform engineers. Use case: try it / contact sales. Tone: technical."

## Step 0 · Pre-flight

> *"No pre-flight signals — proceeding with full Hallmark stack."*

## Step 1 · Design-context gate — fully answered

Audience, use, tone all explicit.

## Step 2.5 · Project memory rotation

> *"Previous run on this brief picked Bento Grid + Pastel + Tier-A flame chart. Picking from {Workbench, Stat-Led, Long Document} for the macro this time — Workbench wins because the brief says 'try it' and Workbench is structured to walk an SRE through a single workflow rather than show six surfaces in a tile grid."*
>
> *"Theme rotation: Pastel (light · geometric-sans · cool-indigo) → Midnight (dark · geometric-sans · phosphor-cyan). Differs on paper band (light → dark) and accent hue (indigo → phosphor-cyan). Two of three axes differ. Passes."*

## Step 3 · Visual ruleset loaded

`macrostructures.md` (Workbench), `component-cookbook.md` (F2 sticky-scroll, H1 left-bias hero, code-card archetype), `typography.md` (Midnight pairing — Geist Mono display + Geist body), `color.md` (Midnight palette — dark cool greys), `microinteractions.md` (active-step highlight via `IntersectionObserver`, copy-to-clipboard on code lines, focus-visible rings), `anti-patterns.md`.

## Step 4 · Hero enrichment

> *"Enrichment: Tier-A pure-CSS pinned dashboard panel — a hand-built waterfall trace rendered as flex bars. Different from v1's clipped-edge browser frame: this one sits in the right column, pinned during scroll, swapping its content as the user scrolls past each step. Same Tier-A custom-craft, different layout role."*

## Step 5 · Preview

```markdown
**Hallmark · v0.6.0**

- **Macrostructure** · Workbench
- **Theme** · Midnight (dark cool paper · Geist Mono display · phosphor-cyan accent ~3%)
- **Enrichment** · Tier-A pure-CSS sticky dashboard panel (3-state, swaps on scroll)
- **Sections** · Masthead · Hero · Sticky-walkthrough (3 steps × pinned panel) · Integrations · Pricing · Colophon
- **Motion** · sticky-step active highlight · copy-to-clipboard on code (2 primitives)
- **Slop test** · 38 / 38 ✓
- **Diversification** · differs from v1 (Bento Grid/Pastel) on macrostructure + paper band + accent hue
```

## Step 6 · Macrostructure stamp

```
/* Hallmark · macrostructure: Workbench · F2 sticky-scroll knobs: pinned=right, content=trace-panel, steps=3
 * theme: Midnight · accent: phosphor-cyan ~3% · enrichment: tier-A CSS-art trace panel (sticky-pinned, 3-state)
 * studied: no · context: explicit · v0.6.0
 */
```

## What changed vs v1

- **Macro:** Bento Grid → Workbench. v1 split Tracejam into six asymmetric tiles (stat / sparkline / quote / code / integrations / spotlight); v2 walks the user through three SRE-shaped steps, each pinned alongside a swapping dashboard panel.
- **Theme:** Pastel → Midnight. v1's light-cool paper with indigo accent becomes dark cool paper with phosphor-cyan. The dashboard mockup reads more credible on dark surface for a tracing tool.
- **Enrichment:** v1's right-clipped browser frame becomes a sticky 3-state panel that updates as the user scrolls past each step. Same hand-built CSS-art content; different layout role.
- **Pricing:** v1 had no pricing on the page; v2 adds a 3-tier table (Free / Team / Scale) — Workbench can carry it without becoming a Bento.

## What stayed the same

- Brand: Tracejam, distributed tracing, SRE audience.
- Tier-A custom-craft (no Lottie, no real video).
- Slop test: 38 / 38 ✓.
