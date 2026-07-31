# Theme - Specimen

The `:root` default and the canonical Hallmark editorial voice. The page for a **type foundry, a design portfolio, a magazine essay, an agency site, a considered brand story** - the type-specimen school, where one high-contrast serif set enormous and thin *is* the page. Warm oat paper, a single signal-orange mark, ruler-drawn hairlines, and Fraunces shown at specimen scale. It reads like a well-set printed page: quiet, warm, exact.

Loaded eagerly by SKILL.md Step 3 whenever the catalog pick is `specimen` (also the silent default when no other theme signal fires). Tokens: [`site/css/tokens.css`](../../../../site/css/tokens.css) under `:root` / `[data-theme="specimen"]`. No canonical example folder yet - build to this spec.

## Axes (diversification)

- **Paper band** - warm oat (`oklch(96% 0.018 80)`, hue 80). A cream near-white with real yellow warmth, distinct from Almanac's cool blue-grey oat and Atelier's near-neutral taupe.
- **Display style** - **high-contrast serif** (Fraunces, light). `--display-weight: 340`, `--display-optical: 144` (the largest, highest-contrast optical cut), `--display-soft: 20`. Thin and elegant, never the black display of Atelier/Newsprint.
- **Accent hue** - **signal orange** (`#FC4C02`, hue ~33). One warm spark, `--color-accent-ink: oklch(55% 0.21 32)` for legible orange text on oat. A signal, never a flood.

## Reference register

Klim / Commercial Type foundry specimens · Pentagram · Aesop · Cereal · Kinfolk · It's Nice That · Readymag editorial · Frere-Jones. The aesthetic: the printed type specimen and the considered editorial portfolio - one serif shown at scale, hairline structure, mono folios, generous paper. **Never name any of these in the output.**

**Patron-saint reference (internal):** *a type foundry's specimen sheet* - one word set at 96pt, a weight ladder, a glyph grid, a single ink colour. When in doubt ask "does this read like a printed specimen, or a marketing template?" Keep the former.

## Required dependencies

1. **Fonts** - **Fraunces** (display + serif emphasis, variable opsz/wght/SOFT), **Geist** (body sans, 400/500/600), **Geist Mono** (labels + meta). Google Fonts:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,300..700,0..100;1,9..144,300..700,0..100&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
   ```
2. **A small reveal script** - one `IntersectionObserver` adding `.is-in` (fade + ~10px rise, `--ease-out`, ~600ms). Optional one-shot: a weight/optical ladder that settles once, then static. No other required JS - Specimen is a reading page, not a tool.

## Signature moves

1. **Warm oat paper, never `#fff`** - `--color-paper: oklch(96% 0.018 80)`. Ink is warm near-black `--color-ink: oklch(18% 0.014 60)`, never `#000`; body sits a notch up at `--color-ink-2: oklch(26% 0.014 60)`. Everything tinted warm (hue 60-80).

2. **Specimen-scale Fraunces, thin and huge** - the hero is one word or a short phrase set enormous and LIGHT: `--display-weight: 340`, `font-variation-settings: "opsz" 144, "SOFT" 20`, `--text-display: clamp(3rem, 5.5vw + 1rem, 5.75rem)`, `--tracking-display: -0.025em`, `--lh-tight: 1.02`. The high-contrast serif carries the page; the type *is* the graphic.

3. **One signal-orange mark, < 5% of any viewport** - `--color-accent: #FC4C02` on the eyebrow tick, a link underline, one CTA, the drop cap, the focus ring, a single italic emphasis. Everything else is warm ink on oat. Orange never fills a band or a card.

4. **Hairlines, square corners, no shadow** - `--rule-card: 1px`, `--radius-card: 0`, `--shadow-card: none`, `--rule-hair: 0.5px`. Structure is drawn with rules, columns, double-rules and fleurons - never boxed cards or blur. Editorial ornament (fleuron, drop cap) is welcome; depth is not.

5. **Geist Mono uppercase labels** - eyebrows, meta, folios, figure captions in `--font-mono` (Geist Mono), UPPERCASE, `--tracking-label: 0.12em`, `--text-xs`, colour `--color-muted`. The machine-readout counterpoint that keeps the warm serif from going soft.

6. **Sans body under a serif display** - body is Geist (`--font-body`) at `--measure: 62ch`, `--lh-normal: 1.45`. The sans-under-serif contrast is the specimen tension. Fraunces italic is for pull-quotes and single-word emphasis only, never the display face (global rule).

7. **Asymmetric editorial grid** - `--page-max: 76rem`, left-biased hero (headline left, meta or figure right), 2:5 or 3:7 prose columns, edge-aligned headlines. Never centred-everything (gate 6).

8. **Specimen character on show** - an orange Fraunces drop cap, a weight/optical ladder, a glyph or figure row, mono folio numbers. The page quietly demonstrates the typeface it is set in.

## Motion

Quiet and composed. One orchestrated entrance: section reveals fade + rise (`--ease-out`, ~600ms). Optionally one weight/optical ladder that settles once, then holds static. Hover: orange underline-grow on links; a 1px rule shift toward accent on focusable surfaces. No bounce, no parallax, no autoplay. Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static and fully visible.

## Anti-patterns

- **No pure `#fff` paper / `#000` ink.** Warm oat, warm near-black - always tinted toward hue 60-80.
- **No heavy/black display.** Fraunces stays light (340). Playfair-900 heft is Atelier's move; a bold hero reads as a different theme.
- **No cool paper.** Cool blue-grey oat is Almanac's; salmon-pink is Newsprint's. Specimen is warm.
- **No second accent.** One signal orange only - no teal, blue, or companion hue.
- **No rounded corners, pills, or shadows.** Square, hairline, flat.
- **No card-in-card, no three-equal-icon-tile grid, no glassmorphism, no gradient text, no mesh/aurora blob, no background texture.** Oat paper + hairlines + one orange mark carry it.
- **No orange flood.** The accent is a spark on a mark, never a fill behind type or a full band.

## Macrostructure affinity / rejection

**Specimen loves:** **Type Specimen / Specimen** *(canonical - one face at scale, weight ladder, glyph grid)* · **Long Document** (editorial essay, drop cap, hairlines) · **Portfolio Grid** (a considered work index) · **Manifesto** (when the serif carries a statement) · **Letter / Quote-Led** (intimate editorial voice).

**Specimen refuses:** **Workbench / component-playground** (tool-first, route Cobalt/Almanac) · **Bento Grid** (modular tile logic fights the column) · **Stat-Led dashboard** (numbers-first apparatus) · **Map-diagram / ecosystem-index** (systems diagram, not a printed page).

## Voice fixtures

Editorial, hand-set, lightly literary. Verbs over adjectives; name the thing concretely.

- *"Set in Fraunces, at ninety-six points."*
- *"One typeface, argued at length."*
- *"Warm paper, cold rules, one orange mark."*
- *"Weight three-forty. Optical size one-forty-four. Nothing louder."*
- *"The page, composed like a specimen sheet."*

Never any of: *seamless, robust, cutting-edge, leverage, synergy, elevate, unlock, supercharge, curated*. Never "click here" - name the section, the number, the face.

## How Specimen differs from neighbouring themes

| vs | what settles it instantly |
|---|---|
| **Atelier** (editorial serif sibling) | Atelier is Playfair Display at weight **900** (heavy, dramatic), near-neutral taupe paper, oxblood/near-black accent (`oklch(22% 0.060 40)`). Specimen is Fraunces at **340** (thin), warmer oat, signal-orange accent. Thin-plus-orange vs black-plus-oxblood. |
| **Newsprint** (broadsheet) | Newsprint is salmon-pink paper (`oklch(92% 0.045 50)`), **serif body** (Crimson Pro), Playfair-700 display, burgundy accent, broadsheet columns. Specimen has **sans body** (Geist), oat not pink, orange not burgundy. |
| **Almanac** (technical almanac) | Almanac is **cool** blue-grey paper (hue 245), **sans display** (Hanken Grotesk), blue accent, dense small type. Specimen is warm, serif-display, orange. Warm-serif vs cool-sans. |

## Test brief expectations

Specimen is a candidate (and the default fallback) when the brief mentions:

- *type specimen · typography · foundry · letterform · portfolio · editorial · magazine · essay · manifesto · studio · agency · brand story · print · publication · considered · craft · design-led*
- Product categories: *type foundry · design portfolio · editorial/magazine · agency site · personal site · brand story · indie publication*
- Emotional tone: *literary · hand-set · warm · considered · high-craft · quiet-confident · editorial*

When the brief names no specialised aesthetic ("a landing page for X"), it lands here. Cool/technical routes to Almanac or Cobalt; loud-maximalist to Carnival; heavy-dramatic serif to Atelier.

## Build hint

The first lines of CSS establish Specimen's anchor moves:

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-body); font-weight: 400; }

/* Specimen-scale display - Fraunces, light, max optical size */
.display { font-family: var(--font-display); font-weight: var(--display-weight); /* 340 */
           font-variation-settings: "opsz" var(--display-optical), "SOFT" var(--display-soft);
           font-size: var(--text-display); letter-spacing: var(--tracking-display);
           line-height: var(--lh-tight); }

/* Mono label - the machine-readout counterpoint */
.label { font-family: var(--font-mono); text-transform: uppercase;
         letter-spacing: var(--tracking-label); font-size: var(--text-xs);
         color: var(--color-muted); }

/* Hairline structure, square corners, no shadow */
.rule { border-top: var(--rule-fine) solid var(--color-rule); }
.card { border: var(--rule-card) solid var(--color-rule);
        border-radius: var(--radius-card); box-shadow: var(--shadow-card); }

/* The one signal - orange, used sparingly */
a { text-decoration-color: var(--color-accent); }
.dropcap::first-letter { color: var(--color-accent); font-family: var(--font-display); }
:focus-visible { outline: 2px solid var(--color-focus); }

.reveal { opacity: 0; transform: translateY(10px);
          transition: opacity .6s var(--ease-out), transform .6s var(--ease-out); }
.reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

Plus the Fraunces + Geist + Geist Mono link and the small reveal script.
