---
name: Hum
slug: hum
genre: playful
paper: light 97 95
display: rounded-sans Chillax
accent: chromatic-yellow 95
posture: full-palette
keywords: daily, habit, streak, practice, learning, reading, curiosity, mood, energy, friendship, community, kids, family, parents, school, game, puzzle, creative, playful, alive
material: grained cream paper pulled toward pear-yellow, torn paper edges with a pale fibre core, card-stock controls that press down, blue-black ink, Chillax throughout, three accents that never blend and a mint for growth
photo: natural vib=12 exp=4
pictured: Workbench, Settled hero
---

# Hum

Cut paper made by hand, cheerful without turning childish: cream paper with a visible grain and fibre, sheets torn along their edges so a pale core shows, card stock you can press, all lit from the top left. Chillax runs from head to label (its single-storey a and g read like an early reader's page) in a blue-black ink. Three accents never blend: pear for the action, blue for links, coral for one loud moment; mint is growth. Not a pastel nursery template, not a rainbow page, not clip-art.

## Tokens

```css
:root {
  --color-paper: oklch(97% 0.012 95); --color-paper-2: oklch(94.5% 0.018 95); --color-paper-3: oklch(91% 0.022 95);
  --color-ink: oklch(20% 0.014 255); --color-ink-2: oklch(29% 0.014 255); --color-muted: oklch(47% 0.014 255);
  --color-rule: oklch(87% 0.016 95);
  --color-accent: oklch(87% 0.175 96); --color-accent-deep: oklch(72% 0.16 92); --color-accent-ink: oklch(20% 0.014 255);
  --color-accent-2: oklch(50% 0.17 250); --color-accent-3: oklch(70% 0.2 22);
  --color-mint: oklch(82% 0.15 152); --color-mint-deep: oklch(48% 0.12 155); --color-focus: oklch(50% 0.17 250);
  --color-card: oklch(98.8% 0.007 95); --color-edge: oklch(83% 0.04 88); --color-fringe: oklch(99.2% 0.006 95);
  --color-kraft: oklch(63% 0.085 62); --color-sand: oklch(77% 0.1 76); --color-sugar: oklch(89% 0.035 236);
  --color-hill-1: oklch(94.5% 0.03 118); --color-hill-2: oklch(91.5% 0.045 135); --color-leaf: oklch(64% 0.15 150);
  --font-display: "Chillax", ui-rounded, ui-sans-serif, sans-serif; --font-body: var(--font-display);
  --font-outlier: "Geist Mono", ui-monospace, monospace;
  --radius-card: 24px; --radius-stock: 16px; --radius-input: 14px; --radius-pill: 999px; --rule-hair: 1px;
  --shadow-card: 0 1px 2px oklch(20% 0.014 255 / 0.06), 0 12px 28px -14px oklch(20% 0.014 255 / 0.22);
  --shadow-paper: drop-shadow(0 0 0.6px oklch(20% 0.014 255 / 0.32)) drop-shadow(1.5px 2.5px 1.5px oklch(20% 0.014 255 / 0.1)) drop-shadow(6px 14px 16px oklch(20% 0.014 255 / 0.13));
  --tracking-display: -0.03em; --display-weight: 600;
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1); --ease-snap: cubic-bezier(0.22, 1, 0.36, 1);
}
```

## Type

- **Display:** Chillax 600, `--tracking-display`, line-height 1.02 to 1.05, sentence case. Figures at `--text-display` or larger, their unit at `--text-title`.
- **Body:** Chillax 500 at 17 to 19px, line-height 1.5; emphasis is a pear highlighter band behind the words, never inside a head. Two weights, 500 and 600.
- **Labels, captions, units:** Chillax 500 a step smaller, sentence case, `--color-muted`. Geist Mono only inside code.

## Surfaces

- The paper is generated, never a picture: two `feTurbulence` data URIs, a fine fractal grain (`--grain`) and a long turbulence fibre (`--fibre`), under every paper, card and accent fill.
- Torn edges: a band, a nav bar, a photograph or a sheet ends in a `clip-path` polygon from seeded value noise, its fibre twin (`--color-fringe`) standing a pixel proud beneath. Grounds may layer: far hills in `--color-hill-*`, soil in `--color-leaf`, a kraft strip, a blue sugar-paper mat.
- Light comes from the top left: stacked `--shadow-paper` drop shadows fall down and right on every cut sheet; a card may lift one corner in a page curl.
- Round everywhere: 24px surfaces (28 to 32px for children), 16px card stock, no square corner.
- Bands: paper-2, a torn ink sheet with paper text, or one pear field. Two a page at most.
- Photographs: bright daylight at a child's height, never a face to camera; torn on one edge, one or two a page.

## Range

- **The product as card stock:** the app's own moment built large, words as card-stock tiles on a torn kraft strip, each pressed one popping into its accent.
- **Growth set in type:** a bed of plants made of Chillax glyphs (stems of l, bracket leaves, letter heads) on torn soil, filling as the prompt's numbers say, shown in states a row of pills switches.
- **Figures on the pear field:** three or four of the prompt's numbers at display size in ink on one pear sheet, each unit beneath in 500.
- **A choice as card-stock pills:** a working control on the prompt's facts, the result a sentence with its key value in a pear highlighter band.

## Controls

- Card stock: 54px controls at `--radius-stock`, grain and fibre on the fill, an inset highlight on top and a solid 5px edge below (`--color-accent-deep` on the pear primary, `--color-edge` on the secondary card); hover raises the edge to 7px, active presses it to 1px. The spring runs on the primary only.
- Each accent owns a job: pear the primary and the one pear field; blue links and the focus ring; coral one loud fill; mint growth. A chosen pill is ink with paper type. One die-cut sticker may carry the offer.
- Inputs: 14px radius, 52px tall, a 1px `--color-muted` border, the blue focus ring.

## Motion

Spring posture declared (gate 12): `--ease-spring` on the primary control only; everything else on `--ease-snap`, never `scale()`. A word pops in its accent and its plant grows; a timer may tear off a scrap of paper as it runs, paused off screen. Reduced motion or no script: the end state.

## Voice

Warm, smart, casual, direct, written to the grown-up beside the child. Sentence case, verbs over nouns, honest numbers only.

## Do-nots

- Never a serif, never pure white paper, never a square corner.
- Never a clean vector edge on a cut sheet or a shadow that falls up or left.
- Never a gradient between two accents and never a rainbow ground.
- Never emoji, stock icons or a drawn character; type, paper and the product carry it.

## Build hint

```html
<link href="https://api.fontshare.com/v2/css?f[]=chillax@500,600&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: var(--display-weight); }
.btn { --edge: 5px; border: 0; border-radius: var(--radius-stock); min-height: 54px; padding: 0 var(--space-lg); font-weight: 600; background: var(--grain), var(--fibre), var(--color-card); box-shadow: inset 0 0 0 1px var(--color-rule), 0 var(--edge) 0 0 var(--color-edge); transition: translate var(--dur-micro) var(--ease-snap), box-shadow var(--dur-micro) var(--ease-snap); }
.btn--primary { background: var(--grain), var(--fibre), var(--color-accent); color: var(--color-accent-ink); box-shadow: 0 var(--edge) 0 0 var(--color-accent-deep), 2px calc(var(--edge) + 4px) 10px -3px color-mix(in oklab, var(--color-ink) 32%, transparent); transition-timing-function: var(--ease-spring); }
.btn:hover { --edge: 7px; translate: 0 -2px; } .btn:active { --edge: 1px; translate: 0 4px; }
.sheet { position: absolute; filter: var(--shadow-paper); } .sheet > i { position: absolute; inset: 0; background: var(--grain), var(--fibre), var(--sheet-c, var(--color-paper-3)); }
mark { background: color-mix(in oklab, var(--color-accent) 55%, transparent); color: inherit; box-decoration-break: clone; }
a { color: var(--color-accent-2); }
```
