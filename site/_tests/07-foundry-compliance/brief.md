# Test 07 v2 — Foundry (SOC2 / ISO27001 compliance)

## The prompt (verbatim, same as v1)

> "Build a landing page for Foundry — SOC2 and ISO 27001 compliance automation for B2B SaaS. Show: how many companies got compliant, what it costs, who uses it. Audience: founders + CTOs. Tone: technical but trustworthy."

## Step 0 · Pre-flight

> *"No pre-flight signals — proceeding with full Hallmark stack."*

## Step 1 · Design-context gate — fully answered

Audience, use, tone all explicit.

## Step 2.5 · Project memory rotation

> *"Previous run on this brief picked Stat-Led + Plain + none. Picking from {Bento Grid, Workbench, Marquee Hero} for the macro this time — Bento Grid wins because the brief says 'show how many · what it costs · who uses it' (three different signals; Bento is the macro built to carry multiple parallel proofs)."*
>
> *"Theme rotation: Plain (light · display-heavy · cool-deep-ink-blue) → Newsprint (light · roman-serif · warm-deep-red). Differs on display style and accent hue. Passes."*

## Step 3 · Visual ruleset loaded

`macrostructures.md` (Bento Grid), `component-cookbook.md` (F1 bento knobs, big-stat tile, logo-grid tile, pricing-card tile, testimonial-card tile, FAQ teaser), `typography.md` (Newsprint pairing — Source Serif Pro display + Geist body), `color.md` (Newsprint palette — warm cream paper, warm-deep-red accent), `microinteractions.md` (default-on for SaaS — counter on stat tile, focus-visible on CTAs, hover-rule on tier card), `anti-patterns.md`.

## Step 4 · Hero enrichment

> *"Enrichment: Tier-A pure-CSS logo wall (8 monochrome wordmarks set as `<svg>` text marks). No real customer logos (placeholder), no Lottie, no Midjourney. The Bento accommodates a logo grid as one tile rather than a separate section."*

## Step 5 · Preview

```markdown
**Hallmark · v0.6.0**

- **Macrostructure** · Bento Grid
- **Theme** · Newsprint (warm-cream paper · Source Serif Pro display · warm-deep-red accent ~3%)
- **Enrichment** · Tier-A pure-CSS logo grid (8 wordmark placeholders, mono)
- **Sections** · Masthead · Hero (left-bias) · 6-tile Bento (stat · logos · pricing · testimonial · features · FAQ teaser) · CTA strip · Colophon
- **Motion** · counter on hero stat · pulse-once on featured tier (2 primitives)
- **Slop test** · 38 / 38 ✓
- **Diversification** · differs from v1 (Stat-Led/Plain) on macrostructure + display style + accent hue
```

## Step 6 · Macrostructure stamp

```
/* Hallmark · macrostructure: Bento Grid · F1 bento knobs: tiles=6, spans=irregular, accent=corner-only
 * theme: Newsprint · accent: warm-deep-red ~3% · enrichment: tier-A CSS logo grid (8 mono wordmarks)
 * studied: no · context: explicit · v0.6.0
 */
```

## What changed vs v1

- **Macro:** Stat-Led → Bento Grid. v1 led with "847" sized at 22 rem and structured the rest as a 9-section linear SaaS page; v2 places the 847 inside a bento tile alongside five other parallel proofs (logos, pricing, testimonial, features, FAQ). Same data, different choreography.
- **Theme:** Plain → Newsprint. v1's pure-white #fff with deep ink-blue becomes warm-cream with warm-deep-red. The page reads less Klim-Type-Foundry and more *NYT Cooking* — still trustworthy, less austere.
- **Enrichment:** v1 had no enrichment (typography-only Stat-Led); v2 adds a Tier-A logo grid as one bento tile. Compliance pages need social proof, and a logo wall does that without a separate section.
- **Section count:** v1 had 9 linear sections (logos · stats · features · testimonials · pricing · FAQ · CTA · footer); v2 collapses into 6 bento tiles + a CTA strip + a colophon.

## What stayed the same

- Brand: Foundry, SOC2/ISO27001 automation.
- The "847 companies" anchor stat.
- Three-tier pricing.
- Slop test: 38 / 38 ✓.
