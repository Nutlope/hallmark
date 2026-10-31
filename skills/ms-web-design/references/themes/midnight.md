---
name: Midnight
slug: midnight
genre: atmospheric
paper: dark 14 264
display: grotesk-sans Mona Sans
accent: cool 230
posture: committed
keywords: render, 3d, animation, vfx, film, video, frames, pipeline, generative, ai tool, model playground, dark mode, nocturnal, late-night, after-hours, overnight, moody, cinematic, cerebral, calm, technical, midnight
material: midnight-blue ground to every edge, cool white ink, Mona Sans expanded at 300 over its normal width, square-cut surfaces in lightness steps, photographs as moonlight, one azure signal
photo: duotone paper ink-2
pictured: Narrative Workflow, Settled hero
---

# Midnight

A cold, calm night instrument whose blue is the ground itself: deep midnight blue to every edge, cool white ink, Mona Sans at an expanded 300 for the heads like titles on a film, the same family at its normal width for reading, surfaces cut square in steps of lighter blue, one azure signal. Photographs arrive as moonlight, shadows in the ground's blue and highlights in the ink. It is not a neon dark mode, not frosted glass, and not a black page with a blue button.

## Tokens

```css
:root {
  --color-paper: oklch(14% 0.048 264); --color-paper-2: oklch(18.5% 0.052 264); --color-paper-3: oklch(23% 0.055 264);
  --color-ink: oklch(95% 0.016 250); --color-ink-2: oklch(88% 0.05 245); --color-muted: oklch(73% 0.04 256);
  --color-rule: oklch(29% 0.058 264); --color-rule-2: oklch(40% 0.06 262);
  --color-accent: oklch(80% 0.11 230); --color-accent-2: oklch(58% 0.1 236); --color-accent-ink: oklch(16% 0.05 264); --color-focus: oklch(84% 0.12 228);
  --font-display: "Mona Sans", ui-sans-serif, system-ui, sans-serif; --font-body: var(--font-display); --font-outlier: var(--font-display);
  --radius-card: 0; --radius-pill: 0; --rule-hair: 1px;
  --shadow-card: 0 24px 48px -24px oklch(6% 0.04 264 / 0.7);
  --tracking-display: -0.015em; --display-weight: 300; --display-stretch: 125%;
}
```

## Type

- **Display:** Mona Sans 300 at the expanded width on `h1` and `h2`, `--tracking-display`, line-height 1.04, sentence case, roman. The wide light cut is the voice; a long head steps down to `--text-display-s` rather than closing up. Item titles take 500 at the normal width.
- **Figures that are the point:** the display cut at 300, tabular, from `--text-display` up to twice it, tracking -0.03em, the unit beside it at the normal width 400 in `--color-ink-2`.
- **Body:** Mona Sans 400 at the normal width, line-height 1.6. One family at two widths: the cold comes from the ground and the ink, never from a second face.
- **Labels, table heads, meta, status:** 500 a step smaller, sentence case, untracked, `--color-muted`. Tabular figures wherever numbers compare; no mono anywhere.

## Surfaces

- Depth is a step of lightness from paper to paper-2 to paper-3, cut square at radius 0 like a frame; a lifted surface takes `--shadow-card` in the ground's own dark. No outline around a surface; a 1px `--color-rule` parts rows in a table or a list and nothing else.
- Bands: `--color-paper-2` or `--color-paper-3`, two a page at most; never an azure field and never a light band.
- Photographs: low-key light after dark, architecture at night, a lit stairwell, a long corridor; one subject held still, cropped wide or tall. The duotone runs from paper to ink-2, so a daylight picture turns to a pale sheet: pick night. Square frames, a 1px inset outline of ink at 8%, a label-style caption giving the hour or the frame.
- No texture, no glass, no blur, no bloom.

## Range

- **A figure as the statement:** one real number in the display cut at up to twice `--text-display`, alone on the ground with its unit and one line; the wide light cut makes a price read like a title card.
- **The product from another angle:** a detail of the interface cropped large on a paper-2 well (a job sheet, a meter, a contact sheet), stepped in lightness, never framed in a drawn window.
- **Steps or a night log:** an `<ol>` of stages or hours, each head in the expanded cut, figures tabular, the current one in ink and the rest in muted; the meter (a 2px `--color-rule-2` track, an `--color-accent-2` or azure fill) is the only line that moves.
- **Rows and forms on the ground:** hairline rows with expanded titles on the left and the normal width on the right; a calculator on a paper-2 band whose answer is a display-cut figure.

## Controls

- The pair: a solid azure rectangle with `--color-accent-ink` text beside a secondary outlined in `--color-rule-2`, both square, 500. A segmented choice is the same square, filled ink when chosen.
- Links take an azure underline on hover; inputs sit on the paper with a 1px `--color-muted` edge, square.
- The azure stays under 5%: the one primary control, a link's hover, one meter value or one figure. Never a field, a gradient or a second light.

## Motion

One settle: the hero's text fades from 0.6 to 1 over `--dur-long` on `--ease-out`, once, from a visible default. Hover steps a surface one lightness up. A value changes when its source does; nothing slides, loops or follows the cursor.

## Voice

Cool and spare, the night shift's register: the hour, the count, the cost. Short declaratives; a number always carries its unit or its time. Never hype.

## Do-nots

- Never a warm accent; the light here is cold.
- Never a heavy display weight or a head at the normal width; the expanded 300 is the face.
- Never a lamp: no radial glow, no halo, no lit edge on a card.
- Never a rounded corner or a light section; dark and square end to end.
- Never a photograph in its own colours beside the duotone, and never a daylight scene.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Mona+Sans:wdth,wght@100,400;100,500;125,300&display=swap" rel="stylesheet">
```

```css
h1, h2 { font-weight: var(--display-weight); font-stretch: var(--display-stretch); line-height: 1.04; }
h3 { font-weight: 500; }
.fig { font-weight: var(--display-weight); font-stretch: var(--display-stretch); letter-spacing: -0.03em; line-height: 0.9; font-variant-numeric: tabular-nums; }
.well { background: var(--color-paper-2); border-radius: var(--radius-card); }
.well--raised { background: var(--color-paper-3); box-shadow: var(--shadow-card); }
.btn { border: var(--rule-hair) solid transparent; background: none; border-radius: var(--radius-pill); padding: var(--space-sm) var(--space-lg); font-weight: 500; color: var(--color-ink); transition: background-color var(--dur-short) var(--ease-out); }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); }
.btn--secondary { border-color: var(--color-rule-2); }
.btn--secondary:hover { background: var(--color-paper-2); }
.meter { height: 2px; background: var(--color-rule-2); } .meter > span { display: block; height: 100%; background: var(--color-accent); }
a:hover { text-decoration-color: var(--color-accent); }
.settle { animation: settle var(--dur-long) var(--ease-out) both; }
@keyframes settle { from { opacity: 0.6; } }
```
