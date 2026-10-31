---
name: Squeeze
slug: squeeze
genre: playful
paper: mid 41 154
display: geometric-sans Gabarito
accent: warm 56
posture: drenched
keywords: fruit, food box, grocer, market, delivery, weekly, seasonal, farm shop, subscription, produce, veg box, cheerful, family, treats, stall, orchard, local, fresh
material: forest-green paper with real chroma, warm white ink, Gabarito 800 heads and figures over Manrope, soft rounded tiles a step lighter or deeper, fruit photographed bright and close, juicy peach controls
photo: natural vib=12 con=4
pictured: Bento Grid, Stage hero
---

# Squeeze

A market stall in colour: a forest-green ground with real chroma, warm white ink, Gabarito's round, heavy heads and figures over a sturdy Manrope, soft tiles a step lighter or deeper, fruit photographed bright and close, juicy peach controls and one warm-white card. It is cheerful because the green is the whole surface and the fruit is the colour on it; a price or a day set huge in Gabarito is as much the material as a crate of fruit. It is not a neutral grocery template with a green button, and not an organic label in serif and kraft.

## Tokens

```css
:root {
  --color-paper: oklch(41% 0.100 154); --color-paper-2: oklch(47% 0.105 154); --color-paper-3: oklch(34% 0.090 156);
  --color-ink: oklch(99% 0.005 90); --color-ink-2: oklch(94% 0.020 120); --color-muted: oklch(90% 0.030 150); --color-rule: oklch(55% 0.100 154);
  --color-accent: oklch(83% 0.115 56); --color-accent-2: oklch(74% 0.150 46); --color-accent-ink: oklch(30% 0.070 40); --color-focus: oklch(88% 0.14 85);
  --color-card: oklch(97% 0.012 85); --color-card-ink: oklch(24% 0.05 160);
  --font-display: "Gabarito", ui-sans-serif, system-ui, sans-serif; --font-body: "Manrope", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: var(--font-display);
  --radius-card: 24px; --radius-control: 16px; --radius-pill: 999px; --rule-hair: 1px; --rule-bar: 2px;
  --shadow-card: 0 14px 32px -16px oklch(22% 0.05 160 / 0.5);
  --tracking-display: -0.025em; --display-weight: 800;
}
```

## Type

- **Display:** Gabarito 800, `--tracking-display`, line-height 1.0, sentence case, one colour per head. Round, compact and heavy, so it takes the shared display scale without a cap; never under 700.
- **Figures:** prices, dates and days in Gabarito 800 with tabular, lining numerals; a single figure may run three to four times the section head, tracked to -0.04em, with its unit at the same weight.
- **Body:** Manrope 500, line-height 1.55, in `--color-muted`; links and row titles at 700. Three weights in all: 800, 700, 500.
- **Labels, captions, table heads, meta:** Manrope 700 a step smaller, sentence case, untracked. Never mono, never uppercase.

## Surfaces

- Tiles, not cards: a tile is the ground one step lighter (`--color-paper-2`) at `--radius-card`, no border, no shadow; a sunk well takes `--color-paper-3`. A tile a visitor can choose sinks to `--color-paper-3` when chosen and takes a 3px `--color-accent` ring.
- The one raised surface is the warm-white card (`--color-card`, `--color-card-ink` type, `--shadow-card`), once a page, for the thing a visitor pays for; inside it the focus ring takes `--color-card-ink`.
- Rules at `--rule-bar` in `--color-rule`; only a rule between list rows is `--rule-hair`.
- Bands: the page is green, so a band is the lighter or the deeper green (`--color-paper-2`, `--color-paper-3`); two a page at most, never a white, grey or peach band.
- Photographs: fruit close in daylight, a crate from above, fruit held out, a heap on a stall; bright, the fruit filling the frame. `--radius-card`, no ring, no shadow; captions under in the label style; type on a photograph sits over a `--color-paper-3` scrim at 45 to 65%.
- No texture: the green is a flat colour.

## Range

- A price, a size or a day set as one figure at statement size: Gabarito 800 in ink straight on the green, its unit at full weight, the head and one line beside it on the remaining columns. The green and the figure carry the screen alone.
- A timetable of real dates as tiles or full-width rows: each date big in Gabarito, the weekday in the label style, the chosen one sunk to `--color-paper-3` and ringed in peach; a stall's chalkboard that works as a control.
- A promise set as a statement on the deeper green band, Gabarito at display size across ten columns, one action under it.
- Questions or plain terms as rows: Gabarito titles on the left, Manrope answers on the right, hair rules in `--color-rule` between.

## Controls

- The control pair: a peach-filled primary with `--color-accent-ink` text beside a 2px ink-outlined secondary, both at `--radius-control`, Manrope 700. Tags and chips are pills; nav links may be `--color-paper-2` pills.
- Links are ink at 700, the underline turning peach on hover; inputs take a 2px `--color-rule` border at `--radius-control` and the `--color-focus` ring.
- Peach stays on controls: the primary, a chosen chip or tile ring, a link's hover; `--color-accent-2` is the primary's pressed and hover step only. Never peach type and never a peach field.

## Motion

Cheerful and quick, state only: a control presses 1px down at `--dur-micro`, a chosen tile rings at `--dur-short` on `--ease-out`, a choosable tile steps a green lighter on hover. No reveal, no parallax, no loop; nothing that cannot be pressed reacts.

## Voice

The stall-holder's, out loud on a Thursday morning: the fruit, the day it comes, what ripe feels like in the hand. Short, warm sentences with the price said plainly; never gourmet, never a wellness pitch.

## Do-nots

- Never a neutral ground. White is for the one card; grey does not exist. The page is green.
- Never a dull or greyed green; the ground keeps its chroma, or it turns to army surplus.
- Never a weight under 500, a serif, or a mono figure: numbers are Gabarito.
- Never a hairline border; a 1px rule lives only between list rows.
- Never a dim photograph, and never one on every screen: the fruit is brightest when the green and the type get screens of their own.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Gabarito:wght@800&family=Manrope:wght@500;700&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-family: var(--font-display); font-weight: var(--display-weight); letter-spacing: var(--tracking-display); }
h1, h2 { line-height: 1; }
.figure { font: var(--display-weight) clamp(7rem, 16vw, 15rem)/0.85 var(--font-display); letter-spacing: -0.04em; font-variant-numeric: lining-nums tabular-nums; }
.tile { background: var(--color-paper-2); border-radius: var(--radius-card); }
.tile:has(:checked) { background: var(--color-paper-3); box-shadow: inset 0 0 0 3px var(--color-accent); }
.card { background: var(--color-card); color: var(--color-card-ink); border-radius: var(--radius-card); box-shadow: var(--shadow-card); }
.btn { border: var(--rule-bar) solid var(--color-ink); border-radius: var(--radius-control); padding: var(--space-sm) var(--space-lg); font: 700 var(--text-md)/1.25 var(--font-body); color: var(--color-ink); transition: translate var(--dur-micro) var(--ease-out), background-color var(--dur-micro) var(--ease-out); }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); border-color: var(--color-accent); }
.btn--primary:hover { background: var(--color-accent-2); border-color: var(--color-accent-2); }
.btn:active { translate: 0 1px; }
.photo img { border-radius: var(--radius-card); }
::selection { background: color-mix(in oklab, var(--color-accent) 45%, transparent); color: var(--color-card-ink); }
```
