---
name: Rim
slug: rim
genre: modern-minimal
paper: dark 9 75
display: grotesk-sans Switzer
accent: warm 45
posture: committed
keywords: space, satellite, earth observation, orbit, imagery, ground station, telemetry, hardware, schedule, utc, infrastructure, mission, sensor, monitoring, instrument, night, dark, measured
material: warm black paper, warm off-white ink, Switzer 500 with Geist Mono for every measurement, square hairline surfaces, the earth photographed straight down, an orange signal and a sky-blue second
photo: natural sat=-20 con=10
pictured: Map / Diagram, Ledge hero
---

# Rim

An instrument at night: warm black paper, warm off-white ink, Switzer at a medium weight for every head, Geist Mono for every number that measures something, square surfaces parted by hairlines, an orange signal and a sky-blue second, and the earth shown the way an instrument sees it, from straight above. It reads as exact because every edge is hard and every time carries its zone. It is not a glowing sci-fi page of starfields and halos, and not a neon dashboard.

## Tokens

```css
:root {
  --color-paper: oklch(9% 0.008 75); --color-paper-2: oklch(12.5% 0.009 75); --color-paper-3: oklch(6.5% 0.007 75);
  --color-ink: oklch(94% 0.010 80); --color-ink-2: oklch(84% 0.011 80); --color-muted: oklch(68% 0.012 80); --color-muted-2: oklch(50% 0.010 80);
  --color-rule: oklch(25% 0.010 78); --color-rule-2: oklch(16% 0.009 78);
  --color-accent: oklch(72% 0.17 45); --color-accent-ink: oklch(10% 0.02 45); --color-accent-2: oklch(74% 0.12 250); --color-focus: oklch(78% 0.15 45);
  --font-display: "Switzer", ui-sans-serif, system-ui, sans-serif; --font-body: var(--font-display);
  --font-outlier: "Geist Mono", ui-monospace, monospace;
  --radius-card: 0; --radius-pill: 0; --rule-hair: 1px; --shadow-card: none;
  --tracking-display: -0.04em; --display-weight: 500;
}
```

Two colourways, both dark, stated in the stamp: `rim: night` (the block above) or `rim: station` (navy `oklch(19% 0.055 262)`, rules `oklch(32% 0.060 262)`, the signals swapped to ice `oklch(84% 0.10 200)` and amber `oklch(76% 0.14 55)`).

## Type

- **Display:** Switzer 500, `--tracking-display` on the hero head and -0.03em on section heads, line-height 1.02, sentence case, roman. Medium, never bold; one colour per head.
- **Body:** Switzer 400 at 16 to 17px, line-height 1.55, in `--color-ink-2`; labels, captions and table heads are 500 a step smaller in `--color-muted`, sentence case, untracked, never mono.
- **Measurements (mono as material):** Geist Mono 400, tabular, for every time, coordinate, area, price and duration. A time always carries its zone, UTC by default. A measurement that is the point sets at `--text-display-s` to `--text-display` at -0.03em, its unit or zone at half the size in `--color-muted`. Mono never sets a head, a label or a paragraph.

## Surfaces

- Hairlines do the dividing: 1px `--color-rule` above every section head, around wells and under a table's head; rows on `--color-rule-2`.
- Zero radius on everything; nothing on the page is round. Depth by lightness only: `--color-paper-2` lifts a well, `--color-paper-3` sinks one. No shadow, glass, blur or halo.
- A well or a photograph may drop its border for two 12px corner ticks, 1px L shapes in `--color-muted` at opposite corners, set just outside the frame.
- Bands: `--color-paper-2` or `--color-paper-3`, edged by hairlines; two a page at most, never a light band.
- Photographs: the earth straight down at the scale a capture delivers: a field, a coastline, roofs, a river mouth, sharp edge to edge, with no horizon, no sky and no planet. Square, a 1px inset ring of ink at 8%. Its measurements (the site, the pass, the delivery) ride on a strip of `--color-paper` at 78% along its foot, in Geist Mono with the zone.

## Range

- **Measurements as figures:** two to four real quantities in Geist Mono at display size across the twelve columns, parted by vertical hairlines, the unit half size in muted: a range, a window, a price.
- **A diagram of real time:** a horizontal UTC axis in hairlines with ticks, the window as a 10px sky-blue band and each event a 1px pin in its signal with its time in mono beside it; a chart of the system, never decoration.
- **The product built:** the order or the queue on a `--color-paper-2` well with corner ticks, fields in mono, the chosen row on `--color-paper-3` with an orange square.
- **Ruled rows and a form-first close:** hairline rows with a Switzer title on the left and the line on the right; a form on paper-2 whose values type in mono.

## Controls

- The pair: a square orange-filled primary with `--color-accent-ink` text beside a square secondary outlined in 1px `--color-rule`, both Switzer 500.
- Links are ink, underlined on hover; inputs square on `--color-paper` with a 1px `--color-muted` border, a value that measures typed in Geist Mono.
- Orange marks the action and the current state, sky-blue the second state or a window; nothing else is coloured.

## Motion

Steady and exact: a state changes over `--dur-short` on `--ease-out`; a live time ticks once a minute. Nothing pulses, loops or reveals.

## Voice

Measured and exact: the site, the pass, the time in UTC, the area in square kilometres. No wonder, no frontier.

## Do-nots

- Never anything round: no pill, no avatar circle, no rounded button or frame.
- Never a bare time; `09:30` without a zone is the theme lying.
- Never bold display; Switzer 500 is the ceiling and the black does the weight.
- Never the planet from space, a starfield, a glow or an orbit traced round a globe.

## Build hint

```html
<link href="https://api.fontshare.com/v2/css?f[]=switzer@400,500&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: var(--display-weight); line-height: 1.02; }
h2 { letter-spacing: -0.03em; }
.measure { font-family: var(--font-outlier); font-variant-numeric: tabular-nums; }
.btn { border-radius: 0; padding: var(--space-sm) var(--space-md); border: var(--rule-hair) solid var(--color-rule); background: none; color: var(--color-ink); font-weight: 500; }
.btn--primary { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-ink); }
.well { position: relative; background: var(--color-paper-2); }
.photo { outline: var(--rule-hair) solid color-mix(in oklab, var(--color-ink) 8%, transparent); outline-offset: -1px; }
.ticks::before, .ticks::after { content: ""; position: absolute; width: 12px; height: 12px; border: 0 solid var(--color-muted); pointer-events: none; z-index: var(--z-raised); }
.ticks::before { top: calc(-1 * var(--space-xs)); left: calc(-1 * var(--space-xs)); border-width: 1px 0 0 1px; }
.ticks::after { right: calc(-1 * var(--space-xs)); bottom: calc(-1 * var(--space-xs)); border-width: 0 1px 1px 0; }
::selection { background: color-mix(in oklab, var(--color-accent) 35%, transparent); color: var(--color-ink); }
```
