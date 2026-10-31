---
name: Wayfind
slug: wayfind
genre: modern-minimal
paper: light 95.5 250
display: mono Chivo Mono
accent: cool 264
posture: committed
keywords: transit, metro, rail, station, wayfinding, departures, timetable, live, map, commute, city, platform, signage, logistics, status, operations, schedule, mobility, travel, trip, journey, itinerary, booking, flights, airport
material: cool grey paper, blue-black ink, Chivo Mono throughout, square 2px ink borders, ink plates, cobalt for what is live, amber for figures on ink
photo: natural sat=-12 con=10
pictured: Station Sequence, Stage hero
---

# Wayfind

Public signage set as a page: cool grey paper, blue-black ink, every glyph in Chivo Mono (a sober grotesk cut to the fixed cell of a departure board), square 2px ink borders, ink plates that carry a sign, cobalt for what is live and amber for figures. The mono is the board's face and the borders mark the way. It reads in daylight, at a glance, from three metres; it is not a developer tool, not a dark terminal and not a retro departures pastiche.

## Tokens

```css
:root {
  --color-paper: oklch(95.5% 0.006 250); --color-paper-2: oklch(91% 0.009 250); --color-paper-3: oklch(99.5% 0.005 250);
  --color-ink: oklch(16% 0.014 262); --color-ink-2: oklch(29% 0.014 262); --color-muted: oklch(47% 0.016 260);
  --color-rule: oklch(80% 0.011 250); --color-ink-rule: oklch(34% 0.014 262);
  --color-accent: oklch(51% 0.22 264); --color-accent-2: oklch(81% 0.16 82); --color-accent-ink: oklch(99.5% 0.003 250); --color-focus: oklch(51% 0.22 264);
  --font-display: "Chivo Mono", ui-monospace, monospace; --font-body: var(--font-display); --font-outlier: var(--font-body);
  --radius-card: 0; --radius-pill: 999px; --rule-hair: 1px; --rule-bar: 2px;
  --shadow-card: 0 24px 40px -24px oklch(8% 0.01 260 / 0.6);
  --tracking-display: -0.03em; --display-weight: 800;
}
```

Three colourways, set once per page and stated in the stamp (`wayfind: platform`).

| Colourway | Paper, ink, rule |
| --- | --- |
| `platform` (default) | the block above |
| `night` | paper `oklch(15% 0.012 262)`, ink `oklch(96% 0.005 250)`, rule `oklch(31% 0.014 262)`, cobalt lifts to `oklch(62% 0.2 264)` |
| `signal` | paper `oklch(51% 0.22 264)` cobalt, ink white, rule `oklch(75% 0.12 264)`; the cobalt button becomes the ink one |

## Type

- **Display:** Chivo Mono 800, `--tracking-display`, line-height 0.98, sentence case. A mono line runs wide, so `h1` caps at 4.75rem and a head stays short enough to read in one look.
- **Body:** Chivo Mono 400, line-height 1.55, `tabular-nums` on everything. Mono is the material here (waive 64): the board's face sets the whole page. Three weights: 400, 500 and 800.
- **Figures:** minutes, platforms and exits in 800, at `--text-display-s` or larger when a figure is the section's reason; amber on ink, ink on paper.
- **Labels, table heads, pills, buttons:** Chivo Mono 500 a step smaller (buttons 800), sentence case, untracked; the signage reads through the mono and the borders, never through capitals.

## Surfaces

- Rules: `--rule-bar` ink borders on every surface (wells, plates, buttons, the underside of a nav, a table's head rule); row dividers `--rule-hair` in `--color-rule`, or `--color-ink-rule` on ink.
- Radius 0 everywhere except pills. Depth is borders; `--shadow-card` only under a surface that floats over another.
- The plate: a square field of ink (or amber under ink text) inside a 2px border, holding one instruction and its figure, the way a sign holds a platform number.
- Bands: `--color-paper-2`, an `--color-ink` band where figures turn amber, or one cobalt field in the `signal` colours; two bands a page at most.
- Photographs: the network at eye level: platforms, tiled walls, a train in, stairs up to daylight; people only from behind and moving. Square, inside the 2px ink border; type never sits on the picture, only on a plate inside the frame. Captions name the station or the line. A phone screen built from the product takes a 9:19.5 frame in that border, never a drawn bezel.
- No texture, no gradient.

## Range

- **A departure board as a Table** on the ink band: destination in 500, the line as a small square in the network's own colour, minutes in 800 amber at title size or larger, a late row as an amber fill under ink text, a 2px paper head rule.
- **A route as Steps:** the way out as three or four plates in a row, each a 2px bordered square holding one instruction (carriage, stairs, exit) and its figure, joined by a 2px ink rule like a corridor sign.
- **Status as Rows:** each line or service a full-width row, its swatch, its name in 800, its ends in 400, its state at the right edge; one cobalt live dot on the row that just changed.
- **A figure as a sign:** one number in 800 at display size inside a bordered plate, its unit beside it, and a station picker of square cells joined edge to edge that changes it.

## Controls

- A cobalt-filled button beside a transparent one with a `--rule-bar` ink border, both square, Chivo Mono 800, sentence case, 48 to 52px.
- A choice set is square cells sharing 2px borders; the chosen cell fills ink with paper text. Links are ink, underlined, cobalt on hover; inputs are square, 2px ink border on `--color-paper-3`.
- Cobalt is for what is live (the current stop, a clock, the primary action); amber colours figures only on ink or as a fill under ink text.

## Motion

Departure-board stiff: `--dur-micro` colour changes in `steps(1)`, rows updating in place, no reveal on scroll. A live dot blinks once when a row updates; it never loops.

## Voice

Signage: the platform, the exit, the minute, the carriage. Imperative and short; a head reads in one look.

## Do-nots

- Never a proportional face anywhere, not even for prose.
- Never amber as a text colour on the paper; it belongs on ink or under ink text.
- Never a third bright colour, except a network's own line colours as small squares beside their names.
- Never rounded cards or soft shadows on cards; Wayfind is bordered.
- Never a drawn platform, train or carriage row standing in for the place; photograph the station, build the screen.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Chivo+Mono:wght@400;500;800&display=swap" rel="stylesheet">
```

```css
body { font-variant-numeric: tabular-nums; }
h1, h2, h3 { font-weight: 800; line-height: 0.98; }
h1 { font-size: min(var(--text-display), 4.75rem); }
small, th, figcaption { font-weight: 500; color: var(--color-muted); }
.btn { display: inline-flex; align-items: center; gap: var(--space-xs); padding: var(--space-md) var(--space-lg); border: var(--rule-bar) solid currentColor; font: 800 var(--text-sm)/1 var(--font-body); color: inherit; transition: background-color var(--dur-micro) steps(1); }
.btn--primary { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-ink); }
.plate { border: var(--rule-bar) solid var(--color-ink); background: var(--color-ink); color: var(--color-paper); }
.plate .figure { font-weight: 800; color: var(--color-accent-2); }
.band--ink { background: var(--color-ink); color: var(--color-paper); }
th { border-bottom: var(--rule-bar) solid currentColor; } td { border-bottom: var(--rule-hair) solid var(--color-rule); }
::selection { background: var(--color-accent-2); color: var(--color-ink); }
```
