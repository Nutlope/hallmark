---
name: Terrazzo
slug: terrazzo
genre: modern-minimal
paper: light 96 82
display: geometric-sans Syne
accent: warm 38
posture: restrained
keywords: materials, library, architects, samples, catalogue, surfaces, stone, timber, terrazzo, ceramic, tile, interiors, interiors studio, showroom, specification, swatches, supplier, drawer, photography, tactile
material: off-white paper, white card surfaces ruled in ink over a hard offset, wide Syne heads over Onest, JetBrains Mono for codes and millimetres, surfaces photographed flat-on in true colour, rust the one signal
photo: natural con=4
pictured: Sample Drawer, Ledge hero
---

# Terrazzo

A materials library's specification voice: off-white paper, near-black ink, wide Syne heads over a plain Onest body, JetBrains Mono for the codes and the millimetres, and white card surfaces ruled in 2px ink over a hard offset, holding the surfaces themselves photographed flat-on and close. Controls are ink; colour arrives only in aggregate, in the stone, timber, terrazzo and glaze the photographs show, with rust as the one signal. It is organised like a sample drawer and reads like a spec sheet. It is not a pastel lifestyle page and not confetti.

## Tokens

```css
:root {
  --color-paper: oklch(96% 0.009 82); --color-paper-2: oklch(92% 0.012 82); --color-paper-3: oklch(87.5% 0.014 80);
  --color-plate: oklch(99.5% 0.003 82);
  --color-ink: oklch(16% 0.006 60); --color-ink-2: oklch(27% 0.006 60); --color-muted: oklch(46% 0.01 60);
  --color-rule: oklch(81% 0.012 80);
  --color-accent: oklch(53% 0.15 38); --color-accent-soft: oklch(91% 0.035 45); --color-accent-ink: oklch(99.5% 0.003 82); --color-focus: oklch(50% 0.16 38);
  --font-display: "Syne", ui-sans-serif, sans-serif; --font-body: "Onest", ui-sans-serif, sans-serif;
  --font-outlier: "JetBrains Mono", ui-monospace, monospace;
  --radius-card: 0; --radius-pill: 0; --rule-hair: 1px; --rule-bar: 2px;
  --shadow-card: 14px 14px 0 var(--color-paper-3); --shadow-card-hover: 14px 14px 0 var(--color-ink);
  --tracking-display: -0.025em; --display-weight: 700;
}
```

Three colourways, stated in the stamp (`terrazzo: off-white`).

| Colourway | Paper and ink | Signal and controls |
| --- | --- | --- |
| **Off-white** (default) | the tokens above | rust; ink controls |
| **Black** | `oklch(14% 0.005 60)` under bone ink `oklch(96% 0.01 80)`; cards stay white | rust lifted to `oklch(68% 0.14 40)`; bone controls with ink text |
| **Stone** | warm grey `oklch(85% 0.012 80)` under the same ink | rust; ink controls |

## Type

- **Display:** Syne 700, `--tracking-display`, line-height 1.0, sentence case. The face sets wide, so heads stay short rather than drop a step; 800 turns clumsy and is never used. A figure at display size takes -0.04em.
- **Body:** Onest 400 and 500, line-height 1.5. Three weights a page: 400, 500, 700.
- **Labels, captions, table heads:** Onest 500 a step smaller, sentence case, untracked.
- **Codes and measures:** JetBrains Mono 500 for a sample code (`ST-0412`), a size in millimetres, a count in a table; the size of the text beside it, never a label or a head.

## Surfaces

- Rules: `--rule-bar` ink on the top of a table, along a band's edge and around a card; `--rule-hair` in `--color-rule` between rows. Radius 0 everywhere.
- Cards: `--color-plate` inside a `--rule-bar` ink border over the hard `--shadow-card` (paper-3, no blur), the page's one container; nothing else casts. A linked card swaps its offset to ink on hover.
- Bands: a `--color-ink` band with paper text, or a `--color-paper-2` band; never a coloured field, two a page at most.
- Photographs: the surface itself, flat-on and close in even daylight, so grain, chips, veins and joints read near one to one; a set of four runs as a true set at one ratio. True colour, a little sharpened. Each sits in a card, edge to edge with its caption beneath naming the family and the finish; type never sits on a photograph.
- No texture and nothing drawn on the paper: the surfaces in the photographs are the pattern.

## Range

- **Specification table:** the stock as a full-width table under a `--rule-bar` ink rule: the code and the size in mono, the surface's name in Onest 500 at title size, family and finish in muted; a hovered or selected row takes `--color-accent-soft` and a rust code.
- **Figure on the ink band:** the library's one big number in Syne at twice `--text-display`, paper on ink, with the families or the terms set beside it as a short ruled list.
- **Steps on rules:** a real ordered list hung from hairlines, each numeral in Syne at section size, the stage in Onest 500 and one line beside it.
- **Form as a request card:** the booking on a white card with its hard offset, inputs square on the plate colour, choices as square cells joined edge to edge, the checked cell ink with paper text.

## Controls

- An ink-filled primary with paper text beside a `--rule-bar` inset ink outline, both square, Onest 500. On the ink band the primary turns plate with ink text.
- Links are ink with a hairline underline that turns rust on hover; inputs are square on `--color-plate` with a 1px ink border.
- Rust reaches a code, a selected row or chip, a hover underline and the focus ring; colour otherwise comes only from the photographs.

## Motion

Still. A linked card swaps its offset from paper-3 to ink over `--dur-micro`; a filtered row leaves without animation.

## Voice

A catalogue's plainness: the family, the finish, the code, the size at one to one. Never sells the feeling of stone.

## Do-nots

- Never a drawn chip, speck or confetti; a surface's colour comes from its photograph.
- Never a photograph as a background or under type; it lives in a card.
- Never a coloured primary on off-white paper; controls are ink.
- Never a rounded corner, on a card, a control or a photograph.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Onest:wght@400;500&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: 700; line-height: 1; }
.btn { border-radius: 0; padding: var(--space-md) var(--space-lg); font-weight: 500; color: inherit; }
.btn--primary { background: var(--color-ink); color: var(--color-paper); }
.btn--secondary { box-shadow: inset 0 0 0 var(--rule-bar) currentColor; }
.card { background: var(--color-plate); border: var(--rule-bar) solid var(--color-ink); box-shadow: var(--shadow-card); }
a.card { transition: box-shadow var(--dur-micro) var(--ease-out); }
a.card:hover { box-shadow: var(--shadow-card-hover); }
.band--ink { background: var(--color-ink); color: var(--color-paper); }
.band--ink .btn--primary { background: var(--color-plate); color: var(--color-ink); }
.spec { border-top: var(--rule-bar) solid var(--color-ink); } .spec tr:hover { background: var(--color-accent-soft); }
.code { font-family: var(--font-outlier); font-weight: 500; font-variant-numeric: tabular-nums; }
::selection { background: color-mix(in oklab, var(--color-accent) 25%, transparent); }
```
