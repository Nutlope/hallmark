---
name: Kiln
slug: kiln
genre: atmospheric
paper: dark 13 40
display: high-contrast-serif Boska
accent: warm 45
posture: full-palette
keywords: kiln, ceramics, pottery, firing, glaze, heat, temperature, ceramics studio, craft, sensor, monitor, hardware, iot, warmth, dark, glow, schedule, workshop
material: near-black ground, cream ink, Boska over Geist, smoked wells, photographs lit by the work, a heat ramp that marks temperature, one ember signal
photo: warm sepia=50 sat=-12 con=8 exp=-6
pictured: Workbench, Stage hero
---

# Kiln

A dark workshop with the kiln door open a crack: a near-black ground, cream ink, Boska's cut high-contrast serif over a plain Geist, and heat only where something is hot. The photographs carry the fire; a ramp from ash through oxblood, ember and amber to white heat colours a temperature as it climbs. Warm in one place, cold everywhere else. It is not a dark luxury page with an orange button, and not a glowing gradient poster.

## Tokens

```css
:root {
  --color-paper: oklch(13% 0.012 40); --color-paper-2: oklch(17.5% 0.016 40); --color-paper-3: oklch(22% 0.018 40);
  --color-ink: oklch(94% 0.02 80); --color-ink-2: oklch(84% 0.025 70); --color-muted: oklch(72% 0.03 60);
  --color-rule: oklch(96% 0.01 80 / 0.12);
  --color-accent: oklch(70% 0.2 45); --color-accent-ink: oklch(14% 0.02 40); --color-focus: oklch(76% 0.19 56);
  --heat-0: oklch(12% 0.012 40); --heat-1: oklch(22% 0.07 22); --heat-2: oklch(40% 0.16 27); --heat-3: oklch(60% 0.21 36);
  --heat-4: oklch(76% 0.19 56); --heat-5: oklch(89% 0.14 78); --heat-6: oklch(98% 0.04 95);
  --font-display: "Boska", "Iowan Old Style", Georgia, serif; --font-body: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: "Geist Mono", ui-monospace, monospace;
  --radius-card: 28px; --radius-well: 16px; --radius-pill: 999px; --rule-hair: 1px;
  --shadow-card: 0 50px 90px -30px oklch(8% 0.01 40 / 0.5);
  --tracking-display: -0.02em; --display-weight: 500;
}
```

Three colourways, stated in the stamp (`kiln: ember`).

| Colourway | Ground, ink, accent |
| --- | --- |
| `ember` (default) | the block above |
| `bisque` | ground `oklch(96.5% 0.014 80)`, ink `oklch(20% 0.02 40)`, accent `oklch(54% 0.17 62)` with the ground as its text; the ramp starts at `oklch(90% 0.035 75)`; wells turn bone |
| `reduction` | ground `oklch(21% 0.06 22)`, ink `oklch(95% 0.02 85)`, accent `oklch(84% 0.12 62)`; the ramp begins at the ground |

## Type

- **Display:** Boska 500, `--tracking-display`, line-height 1.04, sentence case, roman, one colour per head; a statement set in it may run to `--text-display` at line-height 1.0.
- **Figures:** a temperature, a firing time or the price that carries the story is Boska 500, lining and tabular, at -0.03em, its unit (°C, h, £) in the same face; a lone figure may run twice the hero head.
- **Body:** Geist 400 and 500 at 16 to 18px, line-height 1.55.
- **Labels, captions, axis ticks, table heads:** Geist 500 a step smaller, sentence case, untracked, in `--color-muted`. Geist Mono only inside code.

## Surfaces

- 1px `--color-rule` between rows, on a well's edge and on a chart's grid; no rule brighter than that.
- Radius 28px on photographs and built screens, scaled down with the viewport; `--radius-well` on wells and inputs; pills on controls.
- Wells are smoked: `--color-paper-2` a clear step above the ground, a 1px rule edge, no shadow, never blurred, never nested. `--shadow-card`, a deep low drop, only under a built screen standing on the ground or a photograph, never with a ring.
- Heat marks temperature and nothing else: the ramp colours a firing curve in steps, each band of degrees its own colour, oxblood low to white heat at the peak, and a range track (three stops). It never fills a box, a band, a slot or the ground, and no text sits on it.
- Bands: a `--color-paper-2` band, two a page at most.
- Photographs: the work, close and in low light: a kiln at temperature, a loaded kiln, glaze, pots on a shelf, hands in clay, lit by the kiln, a bench lamp or a window, shadows falling into the ground. A 28px frame with a 1px inset ring of cream at 8%; type on one sits only on its dark side, over a paper scrim at 40 to 65%.

## Range

- A firing schedule as rows: each segment's rate and target in Boska figures, keyed by a short bar of the ramp step its target reaches.
- A reading or a warning set as a statement: Boska at `--text-display` across ten columns, cream on the ground, the hour and the kiln beside it in Geist; nothing else on the screen.
- A log as a full-width table: date, firing and cone in Geist, the peak in Boska keyed to its ramp step, a sparkline of the whole curve per row in `--color-ink-2`.
- A price or a temperature as one figure on a smoked band, the action beside it.

## Controls

- The pair: an ember pill (`--color-accent` with `--color-accent-ink` text, Geist 500), 50px tall, beside a ghost pill with a 1px inset `--color-rule` ring and cream text.
- Inputs are smoked wells at 16px radius; a range input runs a 2px track filled along the ramp under a 28px ember thumb.
- Ember is only ever a fill: the primary, a thumb, the live point on a curve, the focus ring in `--color-focus`. Every letter stays cream.

## Motion

Slow and thermal: colour changes run `--dur-long` on `--ease-out`, controls answer over `--dur-short`. Nothing pulses, flickers or glows on hover.

## Voice

Calm and physical, in a potter's words: the cone, the degrees, the hour, the load. Name the firing, never the feeling.

## Do-nots

- Never the ramp as a fill: no heat gradient behind text, on the ground, in a slot or across a band.
- Never orange type; the ember is a fill, and every letter stays cream.
- Never a brown or warm-lit ground; it stays near-black so the heat has somewhere to rise from.
- Never a bright, flat-lit photograph or a pot on white seamless.
- Never a third hue beside the ramp.
- Never a photograph on every screen: the fire lives in the curve and the figures too.

## Build hint

```html
<link href="https://api.fontshare.com/v2/css?f[]=boska@500&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: var(--display-weight); line-height: 1.04; }
.btn { display: inline-flex; align-items: center; min-height: 50px; padding: 0 var(--space-lg); border-radius: var(--radius-pill); font-weight: 500; transition: background-color var(--dur-short) var(--ease-out); }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); }
.btn--ghost { background: transparent; color: var(--color-ink); box-shadow: inset 0 0 0 var(--rule-hair) var(--color-rule); }
.well { background: var(--color-paper-2); border: var(--rule-hair) solid var(--color-rule); border-radius: var(--radius-well); }
.figure { font-family: var(--font-display); font-weight: var(--display-weight); letter-spacing: -0.03em; font-variant-numeric: lining-nums tabular-nums; }
.photo { border-radius: min(2vw, var(--radius-card)); outline: var(--rule-hair) solid color-mix(in oklab, var(--color-ink) 8%, transparent); outline-offset: -1px; }
.scrim { background: linear-gradient(to top, color-mix(in oklab, var(--color-paper) 65%, transparent), transparent 55%); }
.range-track { background: linear-gradient(to right, var(--heat-2), var(--heat-4), var(--heat-6)); }
::selection { background: color-mix(in oklab, var(--color-accent) 35%, transparent); }
```
