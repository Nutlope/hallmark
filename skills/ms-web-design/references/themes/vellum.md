---
name: Vellum
slug: vellum
genre: editorial
paper: light 94 82
display: blackletter Grenze Gotisch
accent: cool 268
posture: committed
keywords: roastery, coffee, bakery, wine, cellar, apothecary, bookshop, press, letterpress, guild, heritage, artisan, manuscript, parchment, edition, tasting, vintage, craft, old world, slow
material: parchment paper, a long tan fibre wash on bands, umber ink, Grenze Gotisch heads over Hanken Grotesk with Grenze roman for statements, hairline and double rules, one ultramarine pigment
photo: warm con=6
pictured: Trade Ledger, Poster hero
---

# Vellum

An old printing house: a parchment ground, umber ink, Grenze Gotisch for the heads, its roman sibling Grenze for a sentence set large, a plain Hanken Grotesk for everything read, hairlines and double rules, and ultramarine as the one pigment. The gothic face carries the age, so nothing else is ornamented: no tavern, no distressed pastiche, no cream-and-serif editorial page.

## Tokens

```css
:root {
  --color-paper: oklch(94% 0.024 82); --color-paper-2: oklch(90% 0.032 80); --color-paper-3: oklch(86% 0.036 78);
  --color-ink: oklch(23% 0.025 55); --color-ink-2: oklch(31% 0.024 58); --color-muted: oklch(46% 0.024 64);
  --color-rule: oklch(75% 0.035 72);
  --color-accent: oklch(43% 0.17 268); --color-accent-deep: oklch(35% 0.15 268); --color-accent-soft: oklch(89% 0.035 268); --color-accent-ink: oklch(95% 0.02 82);
  --color-focus: oklch(50% 0.18 268); --color-field: var(--color-accent);
  --font-display: "Grenze Gotisch", ui-serif, Georgia, serif; --font-body: "Hanken Grotesk", ui-sans-serif, sans-serif;
  --font-outlier: "Grenze", ui-serif, Georgia, serif;
  --radius-card: 2px; --radius-pill: 2px; --rule-hair: 1px; --rule-double: 4px; --shadow-card: none;
  --tracking-display: -0.01em; --display-weight: 600; --fibre: 0.5;
}
```

Three colourways, stated in the stamp (`vellum: parchment`).

| Colourway | Ground, ink, pigment |
| --- | --- |
| **parchment** (default) | the tokens above |
| **oxblood, reversed** | ground `oklch(27% 0.09 20)`, ink `oklch(94% 0.02 80)`, pigment gold `oklch(84% 0.11 85)` texted in the ground, rule `oklch(44% 0.08 20)`, fibre at 0.25 |
| **indigo, the ledger** | ground `oklch(93% 0.012 240)`, ink `oklch(24% 0.035 265)`, the same ultramarine, rule `oklch(76% 0.02 250)`, fibre at 0.14 |

## Type

- **Display:** Grenze Gotisch 600 for `h1` and `h2`, line-height 0.92, `--tracking-display`, sentence case. It closes up below 30px, so `h3` and smaller set in Hanken Grotesk 600.
- **Outlier, Grenze 400:** the roman sibling, for one sentence set at `--text-display-s` and for figures at display size, line-height 1.02. Never for running text.
- **Body:** Hanken Grotesk 400 and 500, line-height 1.55; nav links at 600. Three weights a page at most: 400, 500, 600.
- **Labels, captions, table heads, meta:** Hanken Grotesk 500 a step smaller, sentence case, untracked. Figures that a table compares (weights, lots, dates) take Hanken's tabular figures, right-aligned.

## Surfaces

- Rules: 1px `--color-rule` hairlines between rows, 1px ink along a section's top, and a `--rule-double` double ink rule where a printer would double one: over a table's head, under the masthead, along the top of a band.
- Radius 2px everywhere, no pills, no shadows: the page is printed flat.
- Bands: a `--color-paper-2` band carrying the fibre wash, and one ultramarine `--color-field`; two a page at most, never touching.
- Photographs: the trade in its own light (the drum, the cooling tray, sacks, the counter, hands at the bench), close, no face to the lens; warmed, 2px radius, a 1px `--color-rule` edge. Captions beneath carry a fact; a head sits on one only over an umber scrim.
- Texture, the fibre wash: long tan fibres of SVG turbulence, stitched so they never tile, multiplied at `--fibre` (`texture.md`, the low-frequency wash), on a band or a well only.

## Range

- **Table as a day book:** the week's list as a full-width ruled table under a double rule, pigment numerals indexing the rows, the name in Hanken 600 at title size, values in tabular figures; a hovered row takes `--color-accent-soft`.
- **Statement with figures:** one sentence of the prompt in Grenze 400 across nine or ten columns on the fibre band, and beneath it, parted by a hairline, the prompt's own numbers in Grenze Gotisch at display size in pigment with a plain label under each.
- **Form on the field:** the ultramarine band holding a working choice (a size, a frequency) as square cells joined edge to edge, the running answer in Grenze Gotisch at section size.
- **Rows as an index:** three to five ruled rows, the title in Grenze Gotisch at section size, one line of Hanken beside it: terms, visits, ways to buy.

## Controls

- A pigment-filled primary (`--color-accent-ink` on `--color-accent`) that deepens to `--color-accent-deep` on hover, beside a ghost with a 1px ink border, both 2px radius, Hanken Grotesk 500.
- Links underline in pigment on hover; inputs take 2px radius and a 1px ink border.
- Ultramarine is the one pigment: the primary, a link's hover, the focus ring, the numerals that index a list, the figures, one band.

## Motion

Still. A hover underline in pigment, a row's soft wash and the primary deepening over `--dur-micro`; no reveal, no parallax.

## Voice

Ledger-plain and dated: the item, the weight, the year, the town, as a clerk would enter them. Never *artisanal*, *curated*, or a story the prompt did not give.

## Do-nots

- Never clay, terracotta or oxblood as the pigment on parchment; oxblood is a ground only.
- Never Grenze Gotisch below 30px, at paragraph length, or opening a head on a capital I, which reads as J.
- Never a deckled edge, a vignette, a coffee ring, a burn or a second texture.
- Never the founding year alone as the hero's head; it sits in a sentence, a row or a figure with its label.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Grenze+Gotisch:wght@600&family=Grenze:wght@400&family=Hanken+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
```

```css
h1, h2 { font-weight: 600; line-height: 0.92; }
h3 { font-family: var(--font-body); font-weight: 600; }
.statement { font: 400 var(--text-display-s)/1.02 var(--font-outlier); }
.btn { border: var(--rule-hair) solid currentColor; border-radius: var(--radius-card); padding: var(--space-sm) var(--space-lg); font-weight: 500; color: inherit; background: transparent; transition: background-color var(--dur-micro) var(--ease-out); }
.btn--primary { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-ink); }
.btn--primary:hover { background: var(--color-accent-deep); border-color: var(--color-accent-deep); }
.band--pigment { background: var(--color-field); color: var(--color-accent-ink); }
.rule-double { border-top: var(--rule-double) double var(--color-ink); }
.ledger tbody tr:hover { background: var(--color-accent-soft); }
.fibre { position: relative; isolation: isolate; }
.fibre::before { content: ""; position: absolute; inset: 0; z-index: -1; opacity: var(--fibre); mix-blend-mode: multiply; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='p' x='0' y='0' width='100%25' height='100%25'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.004 0.02' numOctaves='4' seed='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.62 0 0 0 0 0.52 0 0 0 0 0.36 0 0 0 0.3 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E"); }
```
