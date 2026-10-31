---
name: Bloom
slug: bloom
genre: atmospheric
paper: light 97 72
display: grotesk-sans Ranade
accent: warm 36
posture: committed
keywords: generative, ai creative, music, song, video, image, voice, art, make, create, compose, render, imagine, prompt, creative studio, playground, expressive, warm, daylight, consumer creative, portrait, headshot, selfie, retouch
material: warm off-white paper with grain and a generated working grid, two quiet terracotta blooms, warm umber ink, Ranade with one roman Gambarino figure, rubber and cased parts lit from above, part tones on rounded clips
photo: warm exp=4
pictured: Workbench, Stage hero
---

# Bloom

Daylight on a working sheet: warm off-white paper with a faint grain, the medium's own grid (a piano roll, a timeline, a ruler) printed into the ground and fading out from the stage, umber ink, Ranade with one roman Gambarino moment. The making happens on the grid in rounded clips; the parts you touch are physical: a rubber cap in a bezel, cases slid from a stack. It is not a dark generative canvas with neon glows, not a cream editorial page, not a terracotta poster.

## Tokens

```css
:root {
  --color-paper: oklch(97% 0.010 72); --color-paper-2: oklch(94.6% 0.013 70); --color-paper-3: oklch(91.5% 0.016 66);
  --color-ink: oklch(21% 0.024 40); --color-ink-2: oklch(31% 0.022 46); --color-muted: oklch(49% 0.02 56);
  --color-rule: oklch(88% 0.014 64); --color-sheet: oklch(98.7% 0.007 78);
  --color-accent: oklch(53% 0.145 36); --color-accent-2: oklch(66% 0.10 55); --color-accent-soft: oklch(53% 0.145 36 / 0.11);
  --color-accent-ink: oklch(98.5% 0.008 72); --color-focus: oklch(53% 0.145 36);
  --lane-1: oklch(50% 0.04 55); --lane-2: oklch(48% 0.105 28); --lane-3: oklch(70% 0.115 72); --lane-4: oklch(65% 0.085 12);
  --grid-16: oklch(21% 0.024 40 / 0.035); --grid-beat: oklch(21% 0.024 40 / 0.075); --grid-bar: oklch(21% 0.024 40 / 0.15); --grid-row: oklch(21% 0.024 40 / 0.045);
  --rubber: oklch(55% 0.15 34); --rubber-hi: oklch(66% 0.125 42); --rubber-lo: oklch(43% 0.125 31);
  --umber: oklch(30% 0.03 45); --bezel: oklch(92.5% 0.014 68); --case: oklch(93.5% 0.012 70);
  --hi: oklch(99.6% 0.006 80 / 0.75); --shade-1: oklch(21% 0.024 40 / 0.08); --shade-2: oklch(21% 0.024 40 / 0.16); --shade-3: oklch(30% 0.06 40 / 0.28);
  --font-display: "Ranade", ui-sans-serif, system-ui, sans-serif; --font-body: var(--font-display);
  --font-outlier: "Gambarino", Georgia, serif; --font-code: "Geist Mono", ui-monospace, monospace;
  --radius-card: 18px; --radius-inner: 10px; --radius-clip: 6px; --radius-pill: 999px; --rule-hair: 1px;
  --shadow-card: 0 1px 2px oklch(21% 0.024 40 / 0.06), 0 18px 36px -18px oklch(21% 0.024 40 / 0.26);
  --shadow-lift: 0 2px 4px oklch(21% 0.024 40 / 0.07), 0 36px 72px -32px oklch(45% 0.1 40 / 0.34);
  --tracking-display: -0.024em; --display-weight: 600;
}
```

## Type

- **Display:** Ranade 600 for every head, `--tracking-display`, line-height 1.04 to 1.08, sentence case, one colour: the ink.
- **Body:** Ranade 400 at 17 to 18px, line-height 1.55; 500 for labels and controls. Three weights in all.
- **The serif moment:** Gambarino 400, roman, once a page: one figure at 160px or more, or one lede. Never a head, never italic.
- **Labels:** Ranade 500 a step smaller, sentence case, `--color-muted`. Geist Mono only for a ruler's fine numerals and timecodes inside the built product.

## Surfaces

- The ground is the medium's grid in CSS: stacked linear gradients for bars, beats, sixteenths and rows (black-key rows tinted every octave for a piano roll), on `--color-sheet` behind the stage, then continued faintly past it and masked to fade out radially. The grid returns in small crops beside steps and at the close.
- On the grid, the work: four part lanes in `--lane-*` tones as rounded clips (`--radius-clip`, a tinted gradient, an inset hairline in the lane tone, a lit top edge) carrying bar waveforms or notes; a hairline playhead; a key strip and a fine-numeral ruler.
- Texture is generated: a 180px feTurbulence grain at 5% over the paper, and at 30% soft-light on rubber.
- Light from above on every part. Two warm blooms stay, quieter: `--color-accent` near 8% top right, `--color-accent-2` near 5% bottom left, fixed.
- Raised warm surfaces, never hairline boxes: `--shadow-card`, `--shadow-lift` for the one that matters. Two bands at most, never terracotta.
- Photographs: daylight at home, hands, an instrument by a window; never a studio at night.

## Range

- **The input becoming the output on one grid:** what the user gives (a hum, a sketch, a line) drawn as a trace that settles onto the grid, the result growing in lanes beneath, and Play really plays it.
- **Choices as cased spines:** options as a stack of cases (a colour band striped with light, a card label, pips for its parts); the chosen one slides out and the grid re-arranges.
- **One figure in the serif** beside three steps, each with a small crop of the grid.
- **The result as one clip** on the grid at the close, downloadable.

## Controls

- The primary is a rubber cap in a recessed bezel: a domed `--rubber` radial gradient lit from the top, grain, set in a `--bezel` well with an inset shade; it sits at the left of a `--color-sheet` pill with its label, and its ring breathes while the product listens. Press sinks it 1px.
- Secondary: a sheet pill with a shade ring and a lit top edge, or an `--umber` pill.
- Links in terracotta, underlined on hover; inputs 52px pills with a 1px `--color-muted` edge.

## Motion

Once, in view: the input draws in (about 3 s), notes settle, the playhead glides home, lanes grow. Transforms and opacity, paused off screen. Reduced motion or no script: the finished arrangement, playhead at the start. The blooms never move.

## Voice

Warm, daylight, specific: the verb (hum, make, listen), the output (song, part, scene), and where.

## Do-nots

- Never a dark canvas, a neon glow or a third bloom.
- Never a terracotta field or card; terracotta is rubber, a link, a lane.
- Never a grid at full strength across a whole section; it fades from the stage.
- Never an italic serif, and never the serif in a head or in two places.

## Build hint

```html
<link href="https://api.fontshare.com/v2/css?f[]=ranade@400,500,600&display=swap" rel="stylesheet">
<link href="https://api.fontshare.com/v2/css?f[]=gambarino@400&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: var(--display-weight); color: var(--color-ink); }
.roll { --beat: 40px; --row: 14px; background-color: var(--color-sheet); background-image: linear-gradient(to right, var(--grid-bar) 1px, transparent 1px), linear-gradient(to right, var(--grid-beat) 1px, transparent 1px), linear-gradient(to right, var(--grid-16) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-row) 1px, transparent 1px); background-size: calc(var(--beat) * 4) 100%, var(--beat) 100%, calc(var(--beat) / 4) 100%, 100% var(--row); }
.clip { --c: var(--lane-1); border-radius: var(--radius-clip); background: linear-gradient(color-mix(in oklab, var(--c) 18%, var(--color-sheet)), color-mix(in oklab, var(--c) 28%, var(--color-sheet))); box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--c) 42%, transparent), inset 0 1px 0 var(--hi); }
.rec { border-radius: 50%; background: radial-gradient(circle at 50% 30%, var(--bezel), var(--color-paper-3)); box-shadow: inset 0 2px 3px var(--shade-2), 0 1px 0 var(--hi); }
.rec__cap { border-radius: 50%; background: radial-gradient(120% 110% at 50% 18%, var(--rubber-hi), var(--rubber) 48%, var(--rubber-lo)); box-shadow: inset 0 1px 0.5px var(--hi), 0 5px 9px -3px var(--shade-3); }
.pill { border-radius: var(--radius-pill); background: var(--color-sheet); box-shadow: 0 0 0 1px var(--shade-1), 0 8px 18px -10px var(--shade-2), inset 0 1px 0 var(--hi); font-weight: 500; }
a { color: var(--color-accent); text-underline-offset: 0.2em; }
```
