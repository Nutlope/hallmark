---
name: Vantage
slug: vantage
genre: modern-minimal
paper: dark 13.5 235
display: grotesk-sans Geologica
accent: chromatic-lime 126
posture: restrained
keywords: lidar, scan, survey, mapping, 3d, spatial, point cloud, robotics, autonomy, drone, construction, digital twin, geospatial, measurement, sensor, inspection, engineering, heritage, digitisation, infrastructure, reality capture, terrain
material: blue-black ground, a live point cloud of the real thing as the hero's light, a sweep that lights it, pale steel ink, Geologica with sharpened corners at a light weight, hairline frames with corner ticks, one lime signal for what was found
pictured: Feature Ledger, Stage hero
photo: muted con=6 sat=-20
---

# Vantage

Reality capture at night: the thing itself, a site, a ridge, an object, rendered as tens of thousands of measured points on a blue-black ground, turning slowly while a sweep passes through and lights them. Around it the page is instrument-quiet: Geologica with its corners sharpened, steel-grey ink, hairline frames that only mark their corners, figures with their units. One lime signal means found, measured, live. It is not a particle network, not a neon cyber page, not a dashboard of glowing tiles.

## Tokens

```css
:root {
  --color-paper: oklch(13.5% 0.012 235); --color-paper-2: oklch(17% 0.014 235); --color-paper-3: oklch(21% 0.016 235);
  --color-ink: oklch(95% 0.006 230); --color-ink-2: oklch(82% 0.012 230); --color-muted: oklch(66% 0.016 230);
  --color-rule: oklch(27% 0.014 235); --color-rule-2: oklch(34% 0.016 235);
  --color-accent: oklch(89% 0.19 126); --color-accent-hi: oklch(93% 0.17 126); --color-accent-ink: oklch(19% 0.04 126); --color-focus: oklch(89% 0.19 126);
  --point-lo: oklch(42% 0.04 245); --point-mid: oklch(70% 0.04 232); --point-hi: oklch(96% 0.02 215);
  --color-slot: oklch(21% 0.016 235);
  --font-display: "Geologica", ui-sans-serif, system-ui, sans-serif; --font-body: "Geologica", ui-sans-serif, system-ui, sans-serif;
  --radius-card: 4px; --radius-pill: 999px; --rule-hair: 1px; --tick: 10px;
  --shadow-card: none;
  --tracking-display: -0.035em; --display-weight: 300;
}
```

Two dials, stated in the stamp (`vantage: terrain/steel`). Two Vantage pages in one run differ on both.

| Dial | Options |
| --- | --- |
| **Subject** (what the cloud is) | `terrain` (default): ground, structures and canopy from above at an oblique angle. `object`: one thing scanned whole, turning on its axis. `interior`: a room or tunnel seen from inside |
| **Colourway** | `steel` (default) as above. `sodium`: ground `oklch(13% 0.012 55)`, points from `oklch(40% 0.05 50)` to `oklch(95% 0.03 80)`, ink warm, the lime kept as the signal |

## Type

- **Display:** Geologica 300 with `"SHRP" 100` (its sharpened corners), `--tracking-display`, line-height 1.0, sentence case; 400 for small titles. Heads are short and sit on plain ground, never on dense points.
- **Body:** Geologica 300 at 17px with `"SHRP" 0`, line-height 1.6, `--color-ink-2`.
- **Measurements:** Geologica 400, `tabular-nums`, the unit a step smaller in `--color-muted` after a thin space; a figure at statement size takes 200. Labels Geologica 400 a step smaller, sentence case. Never mono, never tracked capitals.

## Surfaces

- **The cloud:** one generated canvas or WebGL scene of points only, no lines between them, no glow: size by distance, colour by height from `--point-lo` to `--point-hi`, a soft depth fade. A sweep plane passes every few seconds and lifts the points it touches toward white; anything found is lime. It fills the hero beside or behind the head and fades to paper at the edges.
- **Frames:** hairline `--color-rule` boxes are drawn only at their corners (`--tick` long ticks), around a measured thing or a panel; full hairline boxes only for inputs. Radius `--radius-card` at most.
- **Callouts:** a measured point carries a leader (a hairline with a 3px dot at the point) to its figure and unit; two at most on a screen.
- **Bands:** paper, and paper-2 for one quiet band; no lit or tinted bands. Flat depth, no shadows.
- **Photographs:** the real site or object in flat daylight, muted, `--radius-card`; never a sci-fi render.

## Range

- **A section cut:** one thin slice through the cloud set across the full width as a profile of points, with two or three heights called out by leader and figure.
- **A scan log as a table:** rows of captures with their date, area, points and accuracy in tabular figures, the live row marked by a lime dot.
- **Layers as working toggles:** ground, structures, canopy and found items as a ruled list of switches that really recolour or hide the cloud beside them.
- **A figure measured:** one number at statement size inside corner ticks, its tolerance under it in muted.

## Controls

- Primary pill: `--color-accent` under `--color-accent-ink`, 48px, Geologica 400; hover `--color-accent-hi`. Secondary: a hairline pill in `--color-rule-2`, ink text.
- Inputs: `--color-paper-2` wells with a hairline frame, lime caret and focus. Switches lime when on.
- Lime marks only what is found, live or primary; never a heading, never a fill larger than a pill.

## Motion

The cloud turns slowly (a revolution in two minutes, an object in seventy seconds), the sweep passes every six to eight seconds on an ease-in-out, the pointer tilts the view a few degrees. Panels and rows fade up once. Canvas pauses off screen. Reduced motion: one still frame with the sweep stopped mid-scene.

## Voice

Measured and exact: what was scanned, how big, how accurate, how soon.

## Do-nots

- Never lines joining points, never a glow or bloom, never a grid floor receding to a horizon.
- Never more than one hue on the points besides lime for found.
- Never the cloud under running text or behind a form.
- Never a monospace label; figures are tabular Geologica.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Geologica:wght,CRSV,SHRP@200..500,0,0..100&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-family: var(--font-display); font-weight: var(--display-weight); font-variation-settings: "SHRP" 100; letter-spacing: var(--tracking-display); line-height: 1; }
body { font-weight: 300; font-variation-settings: "SHRP" 0; }
.num { font-variant-numeric: tabular-nums; font-weight: 400; } .num .u { color: var(--color-muted); font-size: 0.75em; }
.ticks { position: relative; } .ticks::before, .ticks::after { content: ""; position: absolute; inset: 0; pointer-events: none; border: var(--rule-hair) solid var(--color-rule-2); -webkit-mask: conic-gradient(at var(--tick) var(--tick), transparent 75%, var(--color-ink) 0) 0 0 / calc(100% - var(--tick)) calc(100% - var(--tick)); mask: conic-gradient(at var(--tick) var(--tick), transparent 75%, var(--color-ink) 0) 0 0 / calc(100% - var(--tick)) calc(100% - var(--tick)); }
.btn { min-height: 48px; padding: 0 var(--space-lg); border: 0; border-radius: var(--radius-pill); background: var(--color-accent); color: var(--color-accent-ink); font: 400 var(--text-md)/1 var(--font-body); transition: background var(--dur-short) var(--ease-out); }
.btn:hover { background: var(--color-accent-hi); }
.btn--line { background: transparent; color: var(--color-ink); box-shadow: inset 0 0 0 var(--rule-hair) var(--color-rule-2); }
```
