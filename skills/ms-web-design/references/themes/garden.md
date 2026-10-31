---
name: Garden
slug: garden
genre: editorial
paper: light 95.8 90
display: roman-serif Vollkorn
accent: chromatic-green 140
posture: committed
keywords: farm, apiary, honey, cidery, orchard, pick your own, apples, seed, nursery, herbalist, botanical, tea, preserves, single-origin, seasonal, harvest, small-maker, csa, provenance, grown, field, homestead
material: warm oat paper, deep green ink, Vollkorn 600 with old-style figures over Hanken Grotesk, hairlines and soft moss or clay tints, daylight photographs in true colour, one leaf-green signal
photo: natural con=6 sat=-6
pictured: Field Guide, Stage hero
---

# Garden

A grower's voice: warm oat paper, a near-black green ink, Vollkorn heads and old-style figures over Hanken Grotesk, hairlines, soft moss and clay tints, the place photographed in daylight, one leaf-green signal. It feels honest and seasonal because every neutral leans green, the fruit keeps its real colour and nothing is boxed, glossy or grey. It is not a sage-and-slate wellness page and not a cream bookshop with a terracotta accent.

## Tokens

```css
:root {
  --color-paper: oklch(95.8% 0.024 90); --color-paper-2: oklch(92.6% 0.030 90); --color-paper-3: oklch(89% 0.034 90);
  --color-ink: oklch(23% 0.050 152); --color-ink-2: oklch(33% 0.048 150); --color-muted: oklch(46% 0.034 142);
  --color-rule: oklch(83% 0.024 112); --color-rule-2: oklch(68% 0.042 138);
  --color-accent: oklch(46% 0.135 142); --color-accent-2: oklch(86% 0.075 128); --color-accent-ink: oklch(97% 0.015 95);
  --color-focus: oklch(46% 0.135 142); --tint-moss: oklch(46% 0.135 142 / 0.11); --tint-clay: oklch(54% 0.140 46 / 0.10);
  --font-display: "Vollkorn", ui-serif, Georgia, serif; --font-body: "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: "Newsreader", ui-serif, Georgia, serif;
  --radius-card: 4px; --radius-pill: 999px; --rule-hair: 1px; --shadow-card: none;
  --tracking-display: -0.012em; --display-weight: 600;
}
```

## Type

- **Display:** Vollkorn 600, roman, sentence case, `--tracking-display`, line-height 1.04; one weight for every head, never italic. Sturdy without the 700's thickness, so a 52px head reads as set, not shouted. Its old-style figures are the theme's best numbers: an acreage or a count in Vollkorn at 160px and over, descending below the line, needs no other picture.
- **Body:** Hanken Grotesk 400 and 500 with `oldstyle-nums`; tables take lining tabular numerals, display figures keep Vollkorn's old-style ones.
- **Captions under a photograph (the outlier):** Newsreader 400 at the label size, sentence case, in `--color-muted`, one fact a line, like a nursery's label. Vollkorn never runs as body.
- **Labels, table heads, meta, lot codes, dates:** Hanken Grotesk 500 a step smaller, sentence case, untracked, `--color-muted`. No mono on the page.

## Surfaces

- Rules: 1px `--color-rule` hairlines part rows and sections; `--color-rule-2` tops a table or outlines a control. Radius 4px on wells and photographs, pills on controls.
- Depth is flat paper: no shadow, no drop-shadowed box; a well is `--color-paper-2` or a tint, never a bordered card.
- Bands: a full-bleed `--tint-moss` or `--tint-clay` wash, `--color-paper-2`, or the green ink with oat text, where `--color-accent-2` (pale leaf) takes the accent's place; never a solid leaf-green field. Two a page at most.
- Photographs: the place in its season, in daylight and true colour: fruit on the bough at arm's length, the rows seen from the grass, hands and baskets at the work, crates in the barn; soft overcast or low sun, the fruit never pushed past its real colour. 4px radius, a 1px `--color-rule` hairline, no shadow. A head sits on a photograph only over an ink scrim at 40 to 60%.
- Every neutral carries a green or oat cast (hue 90 to 152), never a pure grey. No texture.

## Range

- **Figures in old-style numerals:** the prompt's acreage, varieties or jars in Vollkorn 600 at 160px and over, three across on hairlines, a Hanken line beneath each.
- **The season as a ruled strip:** the twelve months in one hairline row, the open ones on the moss tint with what happens in them, the rest left as paper; under it the hours and the place as two-column rows.
- **A price list or produce list:** hairline rows on paper-2 or the green ink, the name in Vollkorn at item size, a Newsreader note, the price in lining figures at the right edge; a missing fact stays a labelled placeholder.
- **A statement on green ink:** one sentence in Vollkorn at section size and over in oat, the action in pale leaf beneath.

## Controls

- One flat leaf-green pill with `--color-accent-ink` text beside a hairline-outlined pill in `--color-rule-2`.
- Links in ink, underlined, the line turning leaf green on hover; inputs at 4px with a 1px `--color-muted` border on oat.
- Leaf green stays under 5% of a screen: the primary, a link's hover, the focus ring, one figure. Clay lives in its tint band only, never on a control, a nav or a head.

## Motion

State only, `--dur-short` on `--ease-out`: a pill darkens one step, an underline grows under a link. No reveal, no stagger, no parallax.

## Voice

Warm, honest, seasonal, unhurried. Say the field, the variety, the month, the acreage, the number of jars, only as the prompt gives them; never artisanal, curated or small-batch as a hollow badge.

## Do-nots

- Never grey-sage or slate paper; the ground is warm oat, hue 92.
- Never a cool teal or corporate emerald; the green is chlorophyll, hue 140.
- Never italic or faux-bold Vollkorn; load the real 600, and never mix it with 700 on one page.
- Never clay on a control or a head, and never a gradient on the leaf-green pill.
- Never produce styled on white or a staged picnic; the place is a working one.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Vollkorn:wght@600&family=Hanken+Grotesk:wght@400;500&family=Newsreader:opsz,wght@6..72,400&display=swap" rel="stylesheet">
```

```css
body { font-variant-numeric: oldstyle-nums; color: var(--color-ink-2); }
table, .num { font-variant-numeric: lining-nums tabular-nums; }
h1, h2, h3 { font-weight: var(--display-weight); color: var(--color-ink); }
.figure { font: 600 clamp(6rem, 12vw, 11rem)/0.86 var(--font-display); font-variant-numeric: oldstyle-nums proportional-nums; color: var(--color-ink); }
.btn { border-radius: var(--radius-pill); border: var(--rule-hair) solid var(--color-rule-2); padding: var(--space-sm) var(--space-lg); font-weight: 500; color: var(--color-ink); }
.btn--primary { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-ink); }
.band--moss { background: var(--tint-moss); }
.photo img { border-radius: var(--radius-card); outline: var(--rule-hair) solid var(--color-rule); outline-offset: -1px; }
.photo figcaption { font: 400 var(--text-sm)/1.4 var(--font-outlier); color: var(--color-muted); }
a:hover { text-decoration-color: var(--color-accent); }
::selection { background: color-mix(in oklab, var(--color-accent) 22%, transparent); }
```
