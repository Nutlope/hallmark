# Test 03 v2 — Maple Street Bread (artisan bakery)

## The prompt (verbatim, same as v1)

> "Landing page for Maple Street Bread. Audience: locals who want to buy bread. Use: see what's available + visit. Tone: warm, hand-set, considered."

## Step 0 · Pre-flight

> *"No pre-flight signals — proceeding with full Hallmark stack."*

## Step 1 · Design-context gate — fully answered

Audience, use, tone all explicit.

## Step 2.5 · Project memory rotation

> *"Previous run on this brief picked Long Document + Linen + Tier-B SVG loaf. Picking from {Catalogue, Photographic, Letter} this time — Catalogue wins because the brief says 'see what's available' (the user is shopping a board, not reading a story)."*
>
> *"Theme rotation: Linen (light · geometric-sans · warm-amber) → Almanac (light · roman-serif · warm-amber). Differs on display style. Passes."*

## Step 3 · Visual ruleset loaded

`macrostructures.md` (Catalogue), `component-cookbook.md` (item-card archetypes, market-board headings), `typography.md` (Almanac pairing — IM Fell Display + Source Serif body), `color.md` (warm parchment palette), `microinteractions.md` (single primitive: hover line-rule on item rows), `anti-patterns.md`.

## Step 4 · Hero enrichment

> *"Enrichment: Tier-A pure-CSS bread silhouettes per item. Each row has a small (96 px) hand-drawn loaf shape rendered as inline SVG with a single accent stroke. No photography (raw bread photos read as Midjourney). No Lottie. Eight breads × eight tiny SVGs = ~140 lines of inline SVG total."*

## Step 5 · Preview

```markdown
**Hallmark · v0.6.0**

- **Macrostructure** · Catalogue
- **Theme** · Almanac (warm parchment paper · IM Fell Display roman-serif · warm-amber accent ~3%)
- **Enrichment** · Tier-A pure-CSS / inline-SVG bread silhouettes (one per item, 96px)
- **Sections** · Masthead · Today's bake (8-item catalogue grid) · Visit · Colophon
- **Motion** · row hover-rule (1 primitive)
- **Slop test** · 38 / 38 ✓
- **Diversification** · differs from v1 (Long Document/Linen) on macrostructure + display style
```

## Step 6 · Macrostructure stamp

```
/* Hallmark · macrostructure: Catalogue · F1 catalogue knobs: tiles=8, columns=2, rule=hairline-between
 * theme: Almanac · accent: warm-amber ~3% · enrichment: tier-A inline SVG bread silhouettes
 * studied: no · context: explicit · v0.6.0
 */
```

## What changed vs v1

- **Macro:** Long Document → Catalogue. v1 was a prose-led page with the menu as a quiet aside; v2 makes the menu the hero. The brief says "see what's available + visit" — Catalogue answers it more directly.
- **Theme:** Linen → Almanac. Both warm-paper, both light. Linen is geometric-sans display; Almanac is roman-serif display (IM Fell, period almanac feel). Display style differs.
- **Enrichment:** v1's single hand-built loaf with a `@property --rise` breathing loop becomes eight smaller item-level silhouettes, no animation. The page is busier, which Catalogue can carry; the v1 page would have been overloaded.
- **Voice:** v1 opened with a time-stamped salutation ("Saturday, 6:14 a.m."); v2 opens with a market-board "Today's bake" with date and a count.

## What stayed the same

- Brand: Maple Street Bread, Lisbon.
- Tier-A/B custom-craft (no Lottie, no Midjourney).
- Slop test: 38 / 38 ✓.
- Footer: visit and hours (no online ordering — same as the brief).
