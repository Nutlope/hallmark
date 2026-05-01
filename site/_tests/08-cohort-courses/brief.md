# Test 08 v2 — Cohort (cohort-based courses platform)

## The prompt (verbatim, same as v1)

> "Build a landing page for Cohort — the platform for cohort-based courses. Run live courses with 30 to 500 students. Built for educators, not LMS sales teams. Audience: course operators + indie creators. Tone: warm, salon-room, editorial."

## Step 0 · Pre-flight

> *"No pre-flight signals — proceeding with full Hallmark stack."*

## Step 1 · Design-context gate — fully answered

Audience, use, tone all explicit.

## Step 2.5 · Project memory rotation

> *"Previous run on this brief picked Marquee Hero + Salon + Tier-A continuous marquee. Picking from {Stat-Led, Long Document, Workbench} for the macro this time — Stat-Led wins because the brief itself leads with a number range ('30 to 500 students'); a stat hero answers the brief literally."*
>
> *"Theme rotation: Salon (light · mono-display · warm-amber) → Linen (light · geometric-sans · warm-amber). Differs on display style. Accent stays warm-amber. One axis differs — passes (the rule requires at least one)."*

## Step 3 · Visual ruleset loaded

`macrostructures.md` (Stat-Led), `component-cookbook.md` (H8 huge-stat hero, three-stat supporting row, testimonial-card), `typography.md` (Linen pairing — Inter Tight display + Inter Tight body), `color.md` (Linen palette — warm beige, warm-amber accent), `microinteractions.md` (default-on for marketing — counter on hero stat, no marquee), `anti-patterns.md`.

## Step 4 · Hero enrichment

> *"Enrichment: none (typography only). The brief's range '30–500' is itself the visual — set it at 22 rem and the page can carry the rest typographically. No marquee (v1 had it; the rotation rule pushes us off it). No mockup (the page isn't selling a screen)."*

## Step 5 · Preview

```markdown
**Hallmark · v0.6.0**

- **Macrostructure** · Stat-Led
- **Theme** · Linen (warm beige paper · Inter Tight geometric-sans · warm-amber accent ~3%)
- **Enrichment** · none (typography only — the range "30–500" is the visual)
- **Sections** · Masthead · Hero stat · Three supporting stats · Two operator testimonials · Two-tier pricing · CTA · Colophon
- **Motion** · counter on hero stat (1 primitive)
- **Slop test** · 38 / 38 ✓
- **Diversification** · differs from v1 (Marquee Hero/Salon) on macrostructure + display style
```

## Step 6 · Macrostructure stamp

```
/* Hallmark · macrostructure: Stat-Led · H8 hero knobs: stat=range, size=22rem, weight=display-light
 * theme: Linen · accent: warm-amber ~3% · enrichment: none (typography only — the range is the visual)
 * studied: no · context: explicit · v0.6.0
 */
```

## What changed vs v1

- **Macro:** Marquee Hero → Stat-Led. v1 led with a continuous-scroll marquee of course titles + instructor names; v2 leads with the brief's own range "30–500" sized at 22 rem. The rest of the page carries supporting stats and operator testimonials.
- **Theme:** Salon → Linen. Both warm, both light. Salon was IBM Plex Mono display + Cormorant body (mono-display); Linen is Inter Tight throughout (geometric-sans). Display style differs.
- **Enrichment:** v1's continuous marquee → v2's typography-only hero. Stat-Led can carry the page without a moving element.
- **Voice:** v1 opened with "Cohort runs live courses the way your favourite teacher would — with a date, a roster, and a room"; v2 opens with the range first, voice in the supporting copy.

## What stayed the same

- Brand: Cohort, course platform, educator audience.
- Two-tier pricing (Run your first cohort / Scale).
- Slop test: 38 / 38 ✓.
- Warm paper band.
