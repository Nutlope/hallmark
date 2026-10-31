---
name: Ribbon
slug: ribbon
genre: atmospheric
paper: light 98.5 85
display: grotesk-sans Instrument Sans
accent: chromatic-teal 190
posture: committed
keywords: sleep, sound, soundscape, audio, night, rest, calm, wellness, meditation, white noise, ambient, listen, headphones, wind down, bedtime, quiet, breathing, app, subscription
material: warm off-white or blue-black night, Instrument Sans at a quiet weight over Figtree, machined parts lit from above, the hour drawn as light on a generated canvas, one signal
photo: muted sepia=14
pictured: Night Notes, Stage hero, in the two-in-the-morning colourway
---

# Ribbon

The hour before sleep, set quietly: Instrument Sans at 400, upright and tightly set, for every head, Figtree in a soft grey for reading, hairline rules instead of boxes, and the night itself drawn as slow light behind a machined instrument that really sets the levels. The calm comes from light type, slow light and well-made parts. It is not a glossy wellness app and not a sky of stars and moons.

## Tokens

```css
:root {
  --color-paper: oklch(98.2% 0.008 82); --color-paper-2: oklch(95.8% 0.011 82); --color-paper-3: oklch(92.3% 0.014 82);
  --color-ink: oklch(18% 0.006 80); --color-ink-2: oklch(30% 0.008 80); --color-muted: oklch(47% 0.012 80);
  --color-rule: oklch(89.5% 0.011 82); --color-rule-2: oklch(93.5% 0.009 82);
  --color-accent: oklch(44% 0.075 190); --color-accent-soft: oklch(92% 0.028 190); --color-accent-ink: oklch(98% 0.006 85); --color-focus: oklch(52% 0.09 190);
  --color-band: oklch(26% 0.045 195); --color-band-ink: oklch(94% 0.012 85);
  --color-slot: oklch(69% 0.07 80);
  --metal-hi: oklch(97% 0.006 85); --metal-lo: oklch(85% 0.01 85);
  --edge-light: inset 0 1px 0 oklch(100% 0 0 / 0.5);
  --shadow-part: 0 1px 0 oklch(20% 0.01 80 / 0.25), 0 10px 18px -6px oklch(20% 0.01 80 / 0.3);
  --shadow-panel: 0 1px 0 oklch(20% 0.01 80 / 0.2), 0 24px 48px -16px oklch(20% 0.02 80 / 0.35);
  --font-display: "Instrument Sans", ui-sans-serif, system-ui, sans-serif; --font-body: "Figtree", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: "JetBrains Mono", ui-monospace, monospace;
  --radius-card: 20px; --radius-part: 6px; --radius-pill: 999px; --rule-hair: 1px;
  --shadow-card: none;
  --tracking-display: -0.035em; --display-weight: 400;
}
```

One dial, the colourway, stated in the stamp (`ribbon: two-in-the-morning`). The accent is the one lit thing; `--color-slot` is the photo wash; `--color-accent-soft` is a fader's track or a pressed pill, never type.

| Colourway | Paper | Ink | Accent, metal |
| --- | --- | --- | --- |
| `dawn` (default) | `oklch(98.2% 0.008 82)` | `oklch(18% 0.006 80)` | teal `oklch(44% 0.075 190)`; aluminium as above, the night drawn on `--color-band` |
| `two-in-the-morning` | blue-black `oklch(13.2% 0.022 258)`, paper-2 16.4%, rule 27% | `oklch(93.5% 0.012 85)`, muted `oklch(72% 0.02 255)` | a lit window, amber `oklch(82% 0.095 68)` with `oklch(20% 0.03 62)` text; metal `oklch(44% 0.012 255)` to `oklch(25% 0.014 255)`, shadows from black |
| `moss` | sage `oklch(89% 0.034 140)` | `oklch(22% 0.03 150)` | ochre `oklch(48% 0.115 70)`; wash deep teal `oklch(46% 0.07 195)` |

## Type

- **Display:** Instrument Sans 400, upright, `--tracking-display`, line-height 1.04, sentence case, one colour; 500 for small titles (a panel's name, the wordmark). Big figures and levels take the display face too, lining and tabular.
- **Body:** Figtree 400 at 17px, line-height 1.6, in `--color-muted`; Figtree 500 for a part's name and value.
- **Labels:** Figtree 500 a step smaller, sentence case, untracked, `--color-muted`, tabular figures on values.

## Surfaces

- The hero ground is the hour drawn as light on one generated canvas (in dawn, on `--color-band`): fine slow streaks for rain, long soft lines for wind, a far row of lit points on a low horizon, whatever the prompt's sounds are, over a CSS sky-to-land gradient. Never a photograph behind the head, never a star or a moon.
- Machined parts lit from above: panels in a top-to-bottom gradient with `--edge-light` and `--shadow-panel`; a recessed bed (inset shadow) holding vertical faders with knurled caps (`--metal-hi` to `--metal-lo`, fine striped grip, a lit accent index line), a sunk slot whose glow fills to the level, tick scales either side; a draggable curve for anything timed, with a metal handle.
- Texture is generated: a 160px canvas noise tile set as `--grain` by script, `soft-light` at 0.35 to 0.55, on the night and in panels only.
- Rules, not boxes, in reading sections: 1px `--color-rule` hairlines. Radius: controls pill, parts `--radius-part`, panels `--radius-card`.
- Photographs: the night held still and close (a window, a lamp, a far train); low light, no person. `--radius-card`, no border.

## Range

- **The instrument as the hero:** the product's controls built as a machined panel that really works, beside a one-line head, over the drawn night.
- **Rows as a list of levels:** each part's name in the display face on hairlines, its line in Figtree, its level as a display figure; the same panel in the app's frame beside it, synced.
- **Time as a drawn curve:** what changes over the night drawn as lines falling together across the width, columns marking the moments, levels in tabular Figtree beneath.
- **Price under the horizon:** the figure in the display face at 8 to 10rem over the same land and lit row, one Figtree line, the lit pill.

## Controls

- Machined pills, 52px: a top-to-bottom gradient with `--edge-light` and `--shadow-part`, a 1px border; the primary is the accent, lit from inside with an inset highlight. Active presses 1px down. A switch is a pill track with a metal knob that lights the accent when on.
- Faders and curves are real inputs (`role="slider"`, keyboard steps). Sound plays only after a press of Listen, and Stop or Esc ends it.
- The accent sits on the primary, the focus ring, fader glows, the index lines and one figure.

## Motion

Slow and breathing, `--dur-long` on `--ease-in-out`. One ambient canvas and one CSS loop at most, both paused off screen; levels ease, never jump. Reduced motion and no script: a still night, every part at its sample level.

## Voice

Calm and specific: the hour, the sound, how loud. Never a promise of perfect sleep.

## Do-nots

- Never an italic or a heavy head; the display stays upright at 400 and 500.
- Never a starfield, a moon, a navy-to-violet gradient or a stock sleeper.
- Never a plastic or flat control on the instrument; parts are machined, lit from above, one light.
- Never a drawn waveform or equaliser; levels live on faders and lines.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500&family=Figtree:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: 400; font-synthesis: none; line-height: 1.04; }
.btn { min-height: 52px; padding: 0 var(--space-lg); border: var(--rule-hair) solid var(--color-rule); border-radius: var(--radius-pill); background: linear-gradient(var(--color-paper-2), var(--color-paper-3)); box-shadow: var(--edge-light), var(--shadow-part); color: var(--color-ink); font: 500 var(--text-md)/1 var(--font-body); }
.btn--primary { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-ink); }
.btn:active { transform: translateY(1px); }
.panel { border-radius: var(--radius-card); background: linear-gradient(var(--color-paper-2), var(--color-paper-3)); box-shadow: var(--edge-light), var(--shadow-panel); }
.cap { border-radius: var(--radius-part); background: linear-gradient(var(--metal-hi), var(--metal-lo)); box-shadow: var(--edge-light), var(--shadow-part); }
.grain { background-image: var(--grain); background-size: 160px; mix-blend-mode: soft-light; opacity: 0.4; }
a:hover { text-decoration-color: var(--color-accent); }
```
