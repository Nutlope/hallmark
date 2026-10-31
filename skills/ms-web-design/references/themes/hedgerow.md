---
name: Hedgerow
slug: hedgerow
genre: editorial
paper: dark 24 158
display: high-contrast-serif Prata
accent: chromatic-green 118
posture: drenched
keywords: distillery, gin, brewery, forager, botanicals, nature reserve, walking, trail, seeds, plants, nursery, hedge, countryside, field guide, provenance, harvest, batch, seasonal, map, miles
material: deep leaf-green paper, cream ink, Prata heads over Manrope, low-key photographs in true colour, square flat surfaces with pill controls, one chartreuse signal with a moss strength for cream
photo: natural sat=-10 con=8 exp=-8
pictured: Field Guide, Poster hero
---

# Hedgerow

A dark page that reads as green, not night: a deep leaf-green ground, cream ink, Prata's sharp high-contrast names over a quiet Manrope, plants photographed close in shade, and one chartreuse that marks the controls and the few lines the page draws. It feels botanical, exact and fresh, like a field guide opened on a bench. It is not black luxury with a gold accent, and not a rustic kraft-paper page.

## Tokens

```css
:root {
  --color-paper: oklch(24% 0.052 158); --color-paper-2: oklch(19.5% 0.045 158); --color-paper-3: oklch(29.5% 0.05 158);
  --color-ink: oklch(93% 0.022 88); --color-ink-2: oklch(81% 0.035 150); --color-muted: oklch(69% 0.045 150);
  --color-rule: oklch(35% 0.05 158);
  --color-accent: oklch(87% 0.19 118); --color-accent-2: oklch(92% 0.13 118); --color-accent-deep: oklch(46% 0.12 128); --color-accent-ink: oklch(22% 0.05 158); --color-focus: oklch(92% 0.13 118);
  --font-display: "Prata", Georgia, serif; --font-body: "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: "IBM Plex Mono", ui-monospace, monospace;
  --radius-card: 0; --radius-pill: 999px; --rule-hair: 1px;
  --shadow-card: none;
  --tracking-display: -0.005em; --display-weight: 400;
}
```

One dial, the colourway, stated in the stamp (`hedgerow: hedge`). `--color-accent-deep` is the moss strength of the signal: it takes the chartreuse's place on the cream band, where chartreuse vanishes.

| Colourway | Ground | Ink | Accent |
| --- | --- | --- | --- |
| `hedge` (default) | oklch(24% 0.052 158) | cream oklch(93% 0.022 88) | chartreuse oklch(87% 0.19 118) |
| `sloe` | plum oklch(25% 0.06 320) | oklch(94% 0.02 80) | straw oklch(88% 0.15 95) |

## Type

- **Display:** Prata 400, its only weight, `font-synthesis: none`; line-height 1.08, sentence case, roman. Item titles take Prata too, never under 22px, where its hairlines thin out. Figures at statement size are Prata, lining.
- **Body:** Manrope 400 at 17px, line-height 1.6, in `--color-ink-2`; 500 for labels, 700 only on controls.
- **Labels, captions, table heads:** Manrope 500 a step smaller, sentence case, untracked, `--color-muted`. A plant's Latin name sits beside its common one in this style, roman. IBM Plex Mono only inside code.

## Surfaces

- 1px rules: `--color-rule` between rows, `--color-muted` where two sections part, a 1.5px chartreuse rule heading the one list that matters most.
- Square and flat: radius 0 on wells, photographs and inputs; no shadow, no blur, no gradient but a photograph's scrim. Depth is a paper step: a well in `--color-paper-3`, a band in `--color-paper-2`.
- Bands: a `--color-paper-2` band, and one cream band (`--color-ink` ground, `--color-paper` text, moss line work, hedge-green controls) for the densest section. Two a page at most.
- Photographs: plants as a forager meets them, close and low-key: one plant at arm's length in shade, a hedge along a lane, the land at first light, the still, a glass on a dark bench. Square, a 1px cream ring at 8%, colour kept true, never toned green. A caption names the plant under the frame; type on a photograph only over a hedge-green scrim at 45 to 70%.
- Line work only for a chart or a map of real places, 1.2px chartreuse strokes, unfilled. No texture.

## Range

- **Index as a field guide:** Rows with the common name in Prata at `--text-2xl` or larger, the Latin name in the label style, then one line, under the chartreuse rule; the plants carry a section with no picture.
- **Figures as a bottle label:** the batch, the count, the price, the distance in Prata at `--text-display-s` and up, parted by `--color-rule` verticals on a `--color-paper-2` band; one figure in chartreuse.
- **Statement in cream:** one Prata sentence at display size on the green, or the cream band holding a working control (a quantity and its running total in Prata) with moss rules.
- **Table as a still log:** batch, date bottled, count and price as ruled rows, numerals tabular, the current row's rule chartreuse.

## Controls

- The pair: a chartreuse pill in Manrope 700 with `--color-accent-ink` text beside a pill outlined in 1.5px chartreuse. The primary lightens to `--color-accent-2` on hover. On the cream band both turn hedge green.
- Links are cream with a 1px chartreuse underline; inputs are square, a 1px `--color-muted` border on `--color-paper-2`, the ring in `--color-focus`.

## Motion

Still. State only, over `--dur-short` on `--ease-out`: the primary lightens, an underline thickens, a row's rule turns chartreuse. No growth, no drift, no scroll reveal.

## Voice

A field guide's: the plant and where it grows, then how far and when, only where the prompt knows; never invent a distance or a month. Provenance as a sentence, never a badge.

## Do-nots

- Never a second accent; sold out is muted, not red.
- Never a black or blue-black ground; the dark is leaf green, or plum on `sloe`.
- Never a bright, high-key photograph: a berry on white or a sunny meadow reads as a hole in the green.
- Never chartreuse running text, a chartreuse band, or chartreuse on cream.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Prata&family=Manrope:wght@400;500;700&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: 400; line-height: 1.08; font-synthesis: none; }
.btn { border: 1.5px solid var(--color-accent); border-radius: var(--radius-pill); padding: var(--space-sm) var(--space-lg); font-size: var(--text-sm); font-weight: 700; transition: background-color var(--dur-short) var(--ease-out); }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); }
.btn--primary:hover { background: var(--color-accent-2); border-color: var(--color-accent-2); }
.btn--secondary { background: transparent; color: var(--color-accent); }
.band--cream { background: var(--color-ink); color: var(--color-paper); --color-rule: color-mix(in oklab, var(--color-paper) 22%, var(--color-ink)); }
.band--cream .btn { border-color: var(--color-paper); color: var(--color-paper); }
.band--cream .btn--primary { background: var(--color-paper); color: var(--color-ink); }
.band--cream .figure { color: var(--color-accent-deep); }
.index { border-top: 1.5px solid var(--color-accent); }
.index > li { border-bottom: var(--rule-hair) solid var(--color-rule); }
.photo img { outline: var(--rule-hair) solid color-mix(in oklab, var(--color-ink) 8%, transparent); outline-offset: -1px; }
.figure { font-family: var(--font-display); font-variant-numeric: lining-nums tabular-nums; }
a { text-decoration-color: var(--color-accent); }
```
