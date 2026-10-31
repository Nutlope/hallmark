---
name: Dose
slug: dose
genre: modern-minimal
paper: light 97.6 88
display: grotesk-sans Schibsted Grotesk
accent: chromatic-green 160
posture: committed
keywords: health, medication, pharmacy, care, carer, family, reminders, schedule, app, mobile, medicine, patients, clinic, prescription, tracking, calm, trust, routine, elderly, parents
material: warm morning paper with a fibre grain and window light, translucent tinted plastic, green-black ink, Schibsted Grotesk over Instrument Sans with DM Mono pharmacy labels, moulded controls, one pharmacy green
photo: natural sat=-15 con=-6
pictured: Care Register, Organiser hero
---

# Dose

Translucent plastic and daylight: warm morning paper with a fine fibre grain, window light falling across it, bands of soft tinted plastic like a pill organiser, green-black ink, Schibsted Grotesk heads over Instrument Sans, and DM Mono for the time and the dose, set like a pharmacy label. One pharmacy green does every signal. It is trustworthy because it is exact and unhurried, and it lives in a kitchen, not a clinic. It is not a clinical blue portal, not a wellness pastel and not an alarm.

## Tokens

```css
:root {
  --color-paper: oklch(97.6% 0.011 88); --color-paper-2: oklch(96.5% 0.02 160); --color-paper-3: oklch(93% 0.036 160);
  --color-ink: oklch(21% 0.025 170); --color-ink-2: oklch(31% 0.02 170); --color-muted: oklch(49% 0.024 165);
  --color-rule: oklch(86.5% 0.022 140);
  --color-accent: oklch(50% 0.13 160); --color-accent-deep: oklch(42% 0.11 162); --color-accent-soft: oklch(88% 0.08 160); --color-accent-ink: oklch(99% 0.006 160);
  --color-focus: oklch(45% 0.14 160);
  --p-mon: oklch(85% 0.052 22); --p-tue: oklch(87.5% 0.058 64); --p-wed: oklch(91.5% 0.064 98); --p-thu: oklch(86.5% 0.075 160);
  --p-fri: oklch(87% 0.048 210); --p-sat: oklch(84% 0.045 270); --p-sun: oklch(84% 0.048 322);
  --light: oklch(99.4% 0.016 84); --glint: oklch(100% 0 0);
  --font-display: "Schibsted Grotesk", ui-sans-serif, sans-serif; --font-body: "Instrument Sans", ui-sans-serif, sans-serif;
  --font-outlier: "DM Mono", ui-monospace, monospace;
  --radius-card: 14px; --radius-input: 10px; --radius-pill: 999px; --rule-hair: 1px;
  --shadow-card: 0 1px 2px oklch(30% 0.03 165 / 0.08), 0 24px 48px -24px oklch(40% 0.08 165 / 0.35);
  --shadow-lift: 0 1px 1px oklch(30% 0.03 165 / 0.10), 8px 18px 28px -14px oklch(36% 0.06 165 / 0.32), 18px 40px 60px -30px oklch(40% 0.08 165 / 0.30);
  --tracking-display: -0.03em; --display-weight: 700;
}
```

Committed: the paper is warm, the green tints and the plastic carry the colour, mint (`--color-accent-soft`) marks what is checked, and the accent proper stays on controls, focus, a stamp and one figure. Grounds, stated in the stamp (`dose: white`): **white** (default, the tokens above), **green** (drenched `oklch(46% 0.12 160)` under white ink, surfaces white inside, mint on the ground), **night** (`oklch(13% 0.01 170)` under `oklch(96% 0.01 160)`, plastic at 40% light, mint with dark ink).

## Type

- **Display:** Schibsted Grotesk 700, `--tracking-display`, line-height 1.02, sentence case, lining tabular figures.
- **Body:** Instrument Sans 400 and 500, 16 to 18px, line-height 1.5.
- **Labels, captions, table heads:** Instrument Sans 500 a step smaller, sentence case.
- **Times, doses, pharmacy labels:** DM Mono 400 and 500 (`08:00`, `500 mg`), at text size inside a sentence, at title size where a timetable's first column is the time, and as the whole voice of a pharmacy label; never a tab, a table head or a display figure. Three weights a page: 400, 500, 700.

## Surfaces

- The ground is generated, never a picture: the paper takes a fractal-noise fibre grain (an `feTurbulence` data URI under the paper colour), and the hero takes window light, four blurred panes of `--light` skewed across the paper, drifting over 90 seconds.
- Plastic is the surface: a tint (`--p-*`, never a state) at about 62% alpha, a `--glint` line along the top edge, a deeper inner shade at the foot, and the coloured light it lets through pooled and blurred on the paper below. It makes bands, trays and compartments; CSS 3D may turn a set of them three-quarter on the paper.
- A label is paper on plastic: grained white, 10px radius, a tear-off stub on a dashed rule, DM Mono throughout, a confirmation as a double-ringed green stamp rotated 2 degrees naming the time and who; missed or due is the same in grey.
- Radii read as an app: 10px controls, 14px surfaces, 999 on tags, a phone screen at about 28px. White surfaces lift on `--shadow-lift`; one green-black ink band may carry a statement.
- Photographs: the home where a dose is given, hands and rooms in soft daylight, never a face to camera or a clinic; 14px radius, captions beneath.

## Range

- **A sequence as plastic bands:** each stage a full-width band in its own tint, the number in Schibsted at display size, two phone screens of the product on it, the minute each happened in DM Mono beside its line.
- **A record as labels:** the photograph beside two pharmacy labels, one stamped given in green, one missed in grey, each stating the dose, time and person.
- **Statement on the ink band:** one plain sentence in Schibsted 700 at `--text-display`, one line in mint beneath it.
- **A first step in a tray:** the form on a sunken plastic tray, choices as plastic keys, the product's screen beside it answering live.

## Controls

- Moulded plastic: a 52px control at 10px with a 1px rim, a 3px rim below, a bevel of `--glint` on top and a soft cast shadow; it sinks 3px on press. The primary is green plastic, the secondary clear.
- Choices are plastic keys, mint when checked. Links underline in green on hover. Inputs: 52px at 10px with a 1px `--color-muted` border.

## Motion

Light drifts over 90 seconds and pauses off screen. Once in view: a lid lifts, a label rises, its stamp lands and a tick ripples to whoever else sees it. Reduced motion or no script: the end state, light still.

## Voice

A pharmacist's plainness, spoken by a family: the name, the dose, the time, who gave it, in the words a son or daughter uses (Mum, your brother). Never a journey, never a warning in red.

## Do-nots

- Never red or amber for a missed or late state; it is grey.
- Never a plastic tint as a signal or a second brand colour; the green does every signal.
- Never clinical stock: spilled pills, blister packs in close-up, white coats.
- Never glossy toy plastic: tints stay pale, light is daylight, no gradients beyond the glint and the shade.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@700&family=Instrument+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-family: var(--font-display); font-weight: 700; letter-spacing: var(--tracking-display); line-height: 1.02; }
.btn { height: 52px; padding: 0 var(--space-lg); border: 0; border-radius: var(--radius-input); font: 500 var(--text-md) var(--font-body); box-shadow: inset 0 1px 0 var(--glint), 0 0 0 1px var(--color-rule), 0 3px 0 var(--color-rule); transition: transform var(--dur-micro) var(--ease-out); }
.btn--primary { background: linear-gradient(var(--color-accent), var(--color-accent-deep)); color: var(--color-accent-ink); box-shadow: 0 0 0 1px var(--color-accent-deep), 0 3px 0 var(--color-accent-deep); }
.btn:active { transform: translateY(3px); }
.plastic { --t: var(--p-thu); position: relative; border-radius: var(--radius-card); background: linear-gradient(color-mix(in oklab, var(--glint) 32%, transparent), transparent 18%), color-mix(in oklab, var(--t) 62%, transparent); box-shadow: inset 0 1.5px 0 var(--glint), inset 0 -24px 36px -28px color-mix(in oklab, var(--t) 45%, var(--color-ink)); }
.dose, .label { font-family: var(--font-outlier); font-variant-numeric: tabular-nums; }
.band--ink { background: var(--color-ink); color: var(--color-paper); }
```
