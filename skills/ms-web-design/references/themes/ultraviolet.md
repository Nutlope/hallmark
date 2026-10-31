---
name: Ultraviolet
slug: ultraviolet
genre: modern-minimal
paper: light 95 300
display: geometric-sans Outfit
accent: cool 290
posture: committed
keywords: music, audio, stems, remix, dj, producer, player, streaming, tempo, playlist, creator, app, consumer, lowercase, violet, sound, beats, recording studio
material: lavender paper or a violet-black night, Outfit set lowercase over Onest, hairline pills, one saturated violet in two strengths, photographs pulled into the violet
photo: tint accent con=10
pictured: Workbench, Stage hero, in the night colourway
---

# Ultraviolet

A producer's tool in one pigment: a paper tinted the same hue as the ink, one saturated violet in two strengths, Outfit set lowercase on every head and control, pills throughout, depth held to a hairline, photographs pulled into the violet. It reads quick, exact and young without raising its voice. It is not a purple-gradient startup page and not a neon club flyer.

## Tokens

```css
:root {
  --color-paper: oklch(95% 0.02 300); --color-paper-2: oklch(92% 0.03 300); --color-paper-3: oklch(89% 0.035 300);
  --color-ink: oklch(18% 0.02 300); --color-ink-2: oklch(28% 0.03 300); --color-muted: oklch(46% 0.05 300);
  --color-rule: oklch(84% 0.04 300); --color-rule-2: oklch(70% 0.08 295);
  --color-accent: oklch(50% 0.25 290); --color-accent-deep: oklch(43% 0.22 290); --color-accent-soft: oklch(86% 0.08 295);
  --color-accent-ink: oklch(97% 0.01 300); --color-focus: oklch(50% 0.25 290);
  --font-display: "Outfit", ui-sans-serif, system-ui, sans-serif; --font-body: "Onest", ui-sans-serif, sans-serif;
  --font-outlier: "JetBrains Mono", ui-monospace, monospace;
  --radius-card: 16px; --radius-pill: 999px; --rule-hair: 1px;
  --shadow-card: 0 1px 2px oklch(18% 0.02 300 / 0.06);
  --tracking-display: -0.03em; --display-weight: 500;
}
```

Three colourways, set once per page and stated in the stamp (`ultraviolet: lavender`). A nocturnal prompt takes `night`, which may carry one band in the `record` colours.

| Colourway | Paper, ink, accent |
| --- | --- |
| `lavender` (default) | the block above |
| `record` | ground `oklch(50% 0.25 290)`, ink `oklch(95% 0.02 300)`, the accent turns white `oklch(99% 0.005 300)` with violet text on it, rule `oklch(72% 0.14 292)` |
| `night` | ground `oklch(14% 0.02 290)`, paper-2 `17.5% 0.025 290`, paper-3 `21% 0.03 290`, ink `92% 0.04 300`, ink-2 `80% 0.05 300`, muted `68% 0.06 300`, rule `28% 0.04 290`, rule-2 `44% 0.07 292`, accent `55% 0.25 290`, deep `48% 0.24 290`, soft `36% 0.09 293`, focus `62% 0.22 290` |

## Type

- **Display:** Outfit 500, lowercase, `--tracking-display`, line-height 1. Lowercase is the material: heads, nav links, buttons and pills never carry a capital.
- **Figures:** Outfit 300 at `--text-display` and over, lowercase units beside them in the label voice, tabular; the thin geometric numeral is the one place the display goes light.
- **Body:** Onest 400, sentence case, line-height 1.55. Prose is the one place a capital appears.
- **Labels, captions, table heads:** Outfit 500 a step smaller, lowercase, untracked, in `--color-muted`. Mono only inside code.

## Surfaces

- Hairlines: 1px `--color-rule` between rows; pills and outlined controls carry 1.5px of `--color-rule-2`. No borders on cards; a surface is a step to `--color-paper-2`.
- Radius: `--radius-pill` on every control and tag, 16px on surfaces, screens and photographs; nothing square.
- Depth: none on paper, the whisper `--shadow-card` under a raised surface. No blur, no glow, no gradient.
- Bands: a `--color-paper-2` band, an ink band, or one violet field in the `record` colours; two a page at most.
- The product sits plain on `--color-paper-2` or bleeds off its edge, never in a bezel; a waveform is real line work, its played part in the violet, its rest in `--color-accent-soft`.
- Photographs: the night around the music (hands on a mixer, a booth, a crowd lit from the stage seen from behind), tinted violet, 16px radius, a 1px inset ring of ink at 8%; type over one only on an ink scrim. Faces never lead. No texture.

## Range

- **Lanes as the picture:** the product's own waveforms across ten or twelve columns, one stem to a row under hairlines, a bar ruler above in the label voice; the played part violet, the rest soft. It carries a section with no photograph and no frame.
- **Figures in light Outfit:** the prompt's real numbers at display size in the 300, parted by hairlines, one of them in the violet, each unit lowercase beside it.
- **A table of uses:** a full-width Table in lowercase, the use at title size, the stems it takes as small pills, one line of what you hear; a price list takes the same rows.
- **The record field:** one band in the violet holding a working drop zone or a form, the white pill its only fill.

## Controls

- A violet-filled pill (`--color-accent-ink` on `--color-accent`, `--color-accent-deep` on hover) beside an inset-outlined one (1.5px of `--color-ink`), both Outfit 500 lowercase; inside a violet field the filled pill turns white with violet text.
- Links underline in violet on hover; inputs are pills with a 1.5px `--color-rule-2` inset ring that turns ink on focus. Toggles (solo, mute) are small pills that fill violet when pressed.
- The violet is one pigment: one filled control, the focus ring, a link's hover, a progress fill, a played waveform, one figure.

## Motion

Quick and dry: `--dur-micro` colour transitions on pills over `--ease-out`, a lane that dims or lights as a toggle moves, and at most one settle on load over `--dur-long` from an already-visible default. Nothing spins or loops.

## Voice

Lowercase, short, exact: the stem, the bar, the minute, the track count. It talks like a producer, not a label.

## Do-nots

- Never a capital in a head, a nav link or a button.
- Never a second chromatic colour, in a photograph either; the violet is the only one.
- Never a purple-to-pink gradient, a mesh behind text or a glow.
- Never square controls or 4px radii; Ultraviolet is round.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;500&family=Onest:wght@400&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: 500; line-height: 1; text-transform: lowercase; letter-spacing: var(--tracking-display); }
.figure { font: 300 var(--text-display)/0.9 var(--font-display); font-variant-numeric: tabular-nums; }
.btn, .pill { display: inline-flex; align-items: center; border-radius: var(--radius-pill); font: 500 var(--text-sm)/1 var(--font-display); text-transform: lowercase; transition: background-color var(--dur-micro) var(--ease-out); }
.btn { min-height: 48px; padding: 0 var(--space-lg); } .pill { padding: var(--space-xs) var(--space-md); box-shadow: inset 0 0 0 1.5px var(--color-rule-2); }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); }
.btn--primary:hover { background: var(--color-accent-deep); }
.btn--secondary { box-shadow: inset 0 0 0 1.5px currentColor; color: inherit; }
.well { background: var(--color-paper-2); border-radius: var(--radius-card); }
.band--violet { background: var(--color-accent); color: var(--color-accent-ink); }
.wave__rest { fill: var(--color-accent-soft); } .wave__played { fill: var(--color-accent); }
::selection { background: color-mix(in oklab, var(--color-accent) 25%, transparent); }
```
