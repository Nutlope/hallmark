---
name: Spore
slug: spore
genre: atmospheric
paper: dark 15 60
display: roman-serif Young Serif
accent: warm 30
posture: committed
keywords: grower, mushroom, fungi, farm, food, producer, fermentation, wine, natural wine, wine bar, bottle shop, cellar, preserves, dark, culture, night market, harvest, subscription, small batch
material: coffee-ground black with a warm grain, parchment ink, Young Serif over Instrument Sans, soft pills and grained wells, photographs lit by lamps and candles, one oyster pink
photo: warm con=6 exp=-4
pictured: Photographic, Stage hero
---

# Spore

A cellar at night: coffee-ground black warmed toward brown, a warm grain on its wells, parchment Young Serif over Instrument Sans, soft pills, photographs lit only by lamps and candles, and one oyster-mushroom pink. It feels close and handmade because the warmth sits in the ground, the grain, the figures and one soft colour, never in drawn light. It is not a dark-mode template with a glow, nor a wellness label.

## Tokens

```css
:root {
  --color-paper: oklch(15% 0.012 60); --color-paper-2: oklch(19% 0.014 58); --color-paper-3: oklch(24% 0.02 50);
  --color-ink: oklch(93% 0.022 85); --color-ink-2: oklch(84% 0.022 78); --color-muted: oklch(67% 0.02 70);
  --color-rule: oklch(31% 0.016 60);
  --color-accent: oklch(77% 0.09 30); --color-accent-2: oklch(86% 0.06 30); --color-accent-ink: oklch(15% 0.012 60); --color-focus: oklch(86% 0.06 30);
  --font-display: "Young Serif", Georgia, serif; --font-body: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
  --radius-card: 14px; --radius-pill: 999px; --rule-hair: 1px;
  --shadow-card: 0 16px 40px oklch(8% 0.01 60 / 0.4);
  --tracking-display: -0.012em;
  --grain: 0.15; --display-weight: 400;
}
```

One dial, the colourway, stated in the stamp (`spore: cellar`).

| Colourway | Ground | Ink | Accent |
| --- | --- | --- | --- |
| `cellar` (default) | `oklch(15% 0.012 60)`, grain screened at 15% | parchment `oklch(93% 0.022 85)` | pink `oklch(77% 0.09 30)` |
| `lab` | cream `oklch(94% 0.02 85)`, grain multiplied at 6% | `oklch(17% 0.015 60)` | pink `oklch(62% 0.13 30)` |
| `head-torch` | `oklch(12% 0.008 60)`, grain at 15% | `oklch(93% 0.03 85)` | ochre `oklch(74% 0.13 80)` |

## Type

- **Display:** Young Serif 400, `--tracking-display`, line-height 1.02, sentence case, roman, one colour per head. Its one weight is the voice: hierarchy comes from size, never from bolding.
- **Figures:** prices, days, hours and counts are Young Serif, lining, and may run past `--text-display` when one number is the section's reason; a price is the one figure that takes pink.
- **Body:** Instrument Sans 400 and 500, line-height 1.55, in `--color-ink-2`. A second name after a product's (a grape, a vintage, a Latin name) is Instrument Sans italic, the outlier and the only italic.
- **Labels, captions, table heads:** Instrument Sans 500 a step smaller, sentence case, `--color-muted`.

## Surfaces

- 1px `--color-rule` between rows; a 1.5px `--color-ink-2` edge on fields. Nothing else has a border.
- Radii: pills on controls and chips, `--radius-card` on wells and photographs; inputs square.
- Depth is the ground's three steps: paper, a grained `--color-paper-2` well, a `--color-paper-3` band. A state that is live now (tonight, the chosen row) lifts one step and takes a pink chip. `--shadow-card` only under a well that overlaps a photograph.
- Photographs: the place after dark, close: racks, a pour, a candlelit counter, a glass; low warm light into shadow, never flash or daylight. `--radius-card` with a 1px ink ring at 8%; type on one sits on its dark side over a paper scrim at 45 to 65%.
- Grain: the speck grain of `texture.md` § 1, screened at `--grain`, on wells and bands only; never under running text in a column or over a photograph.

## Range

- **One figure as the section:** a count or a price in Young Serif at two to four times `--text-display` on a grained well, its plain label beneath, beside two or three hairline rows that say what the number means.
- **The week as a timetable:** Rows of day names in Young Serif at `--text-title`, the hours beside them, closed days dropped to muted, tonight's row lifted to paper-3 with its pink chip; a head block on columns 1 to 4 beside them.
- **A list or price list:** ruled rows with the name in Young Serif, the second name in italic, the price flush right in pink; set three or five columns deep and it reads as the shelf.
- **A grained band that holds a form:** paper-3 with the speck grain, the price large in pink beside square fields and the pink pill; or a statement in Young Serif at `--text-display` across ten columns.

## Controls

- The pair: a pink-filled pill with `--color-accent-ink` text, lightening to `--color-accent-2` on hover, beside a pill outlined in 1.5px `--color-ink-2`. Chips are pills; the chosen one fills pink.
- Links are parchment with an underline that turns pink on hover; inputs are square with the 1.5px edge and the `--color-focus` ring.

## Motion

State only, in one frame: a chip selects, a row lifts, a pill lightens. Nothing reveals, nothing grows, nothing loops.

## Voice

A maker's log: the name, the day, the hour, the vintage, the price. No wellness, no mystique, no "curated".

## Do-nots

- Never a second hue; a green for "in stock" makes a garden centre.
- Never drawn light as the mood (a beam, a pool, a glow behind a head); the light lives in the photographs.
- Never a neutral or blue-black ground; every dark step tints toward hue 60.
- Never pink running text or a pink outline; pink is a fill, a price or the focus.
- Never photograph after photograph; between two pictures a figure, a timetable or a list in Young Serif.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-family: var(--font-display); font-weight: 400; letter-spacing: var(--tracking-display); line-height: 1.02; }
.btn { border-radius: var(--radius-pill); padding: var(--space-sm) var(--space-lg); font-weight: 600; transition: background-color var(--dur-micro) var(--ease-out); }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); }
.btn--primary:hover { background: var(--color-accent-2); }
.btn--secondary { background: transparent; color: var(--color-ink); box-shadow: inset 0 0 0 1.5px var(--color-ink-2); }
.well { background: var(--color-paper-2); border-radius: var(--radius-card); }
.figure { font-family: var(--font-display); font-variant-numeric: lining-nums; line-height: 0.86; }
.grained { position: relative; isolation: isolate; }
.grained::after { content: ""; position: absolute; inset: 0; z-index: var(--z-base); border-radius: inherit; pointer-events: none; opacity: var(--grain); mix-blend-mode: screen;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.6 0 0 0 0 0.55 0 0 0 0 0.45 0 0 0 0.35 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E"); }
```
