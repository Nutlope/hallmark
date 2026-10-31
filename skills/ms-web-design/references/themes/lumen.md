---
name: Lumen
slug: lumen
genre: atmospheric
paper: dark 12.5 290
display: roman-serif Instrument Serif
accent: warm 62
posture: restrained
keywords: inference, model, llm, ai tool, agent, voice, synthesis, api, gpu, serverless, runtime, tokens, latency, open models, developer, research lab, ml platform, dev tools, premium
material: violet-black ground, near-white ink, lowercase Instrument Serif heads a step large over Geist and Geist Mono, hairline wells, a faint blueprint grid, one molten brass signal and one rose verb
photo: duotone paper ink-2
pictured: Map / Diagram, Settled hero
---

# Lumen

A night console with a literary voice: a violet-black ground, near-white ink, Instrument Serif set all in lowercase and a step large over Geist, hairline wells and one molten brass signal. Cool dark, warm light: the warmth is rationed to the brass and one rose verb, so the page reads engineered and quietly lit at once. The product is the picture. It is not a neon dark mode, an orb on black, a glowing object, a purple poster or a serif magazine.

## Tokens

```css
:root {
  --color-paper: oklch(12.5% 0.027 290); --color-paper-2: oklch(16% 0.03 290); --color-paper-3: oklch(20% 0.032 290);
  --color-ink: oklch(96% 0.01 300); --color-ink-2: oklch(85% 0.017 298); --color-muted: oklch(69% 0.026 295);
  --color-rule: oklch(27% 0.034 290); --color-rule-2: oklch(36% 0.04 292); --rule-blueprint: oklch(96% 0.01 300 / 0.05);
  --color-accent: oklch(80% 0.15 62); --color-accent-2: oklch(72% 0.15 12); --color-accent-ink: oklch(14% 0.028 290);
  --color-live: oklch(80% 0.13 155); --color-focus: oklch(80% 0.15 62);
  --font-display: "Instrument Serif", ui-serif, Georgia, serif; --font-body: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: "Geist Mono", ui-monospace, monospace;
  --radius-card: 10px; --radius-pill: 999px; --rule-hair: 1px;
  --shadow-card: 0 28px 64px -30px oklch(4% 0.02 290 / 0.8);
  --tracking-display: -0.015em; --display-weight: 400;
}
```

A second drop, `day`: bone `oklch(97% 0.008 290)` under `oklch(18% 0.02 290)`, an indigo `oklch(46% 0.24 268)` signal with bone text, the verb in `oklch(56% 0.16 18)`. The stamp states the drop (`lumen: night`).

## Type

- **Display:** Instrument Serif 400, roman, all lowercase, `--tracking-display`, line-height 0.95 to 1.02. The face is narrow and light, so it sets one step large: section heads at `--text-display-s`, the hero head at its cap and beyond. Lowercase is the register for heads, nav, controls and labels; prose keeps sentence case so a model name survives.
- **Body:** Geist 400 and 500, `tabular-nums` wherever a figure appears.
- **Labels, captions, table heads:** Geist 400 a step smaller, lowercase, untracked, `--color-muted`.
- **Readouts and code:** Geist Mono 400 at 13px, lowercase, untracked: a measured value with its unit, a status, a model id, code. The mono is the machine speaking, never a label voice.
- **The verb:** the one accented word on the page, in the hero head only, always a verb, in `--color-accent-2` with a 1px underline that draws in (stamp `waive 38iii`).

## Surfaces

- Hairlines contain: 1px `--color-rule` on wells, rows and inputs, `--color-rule-2` on a control's edge; 10px radius on surfaces, pills on controls and tags.
- Depth is a lightness step from paper to paper-3; a surface that must lift trades its hairline for `--shadow-card` in the ground's own dark. Never a glow, a halo or a coloured shadow.
- Bands: `--color-paper-2`, two a page at most; no accent field, and a night page never takes a bone band.
- Photographs: one at most, a 21:9 band of the machines the work runs on (an aisle of racks, cabling, a lit rack face), printed in the ground's violet, 10px radius and a 1px rule, a caption naming the hardware beneath; no head on it.
- Texture: the blueprint grid, 1px `--rule-blueprint` lines on a 48px pitch, inside one well or band and never under running text (stamp `waive 47c`). No glass, no blur, no generated object standing in for the product.

## Range

- **A path as a diagram:** a real system drawn in hairline nodes and connectors: the slow path in muted mono, the product's path ruled in brass, each node a step the request really takes.
- **The product's own surface:** a request beside its response in one well split by a hairline, lowercase tabs, the status beneath as Geist Mono readouts; or a console screen at full size with its live state in `--color-live`.
- **A chart in a well:** over the blueprint grid, the variable in `--color-ink-2` at half strength, the one thing the product holds fixed as a brass line, the axis in mono.
- **A figure or a rate card:** one measured value in Instrument Serif at display size with its unit in mono, or rates as hairline rows of tabular figures under a lowercase head.

## Controls

- The control pair: a solid brass pill with `--color-accent-ink` text beside a hairline pill in `--color-rule-2`, both lowercase, 44 to 48px.
- Links take a brass underline on hover; inputs sit on `--color-paper` inside a band, 1px `--color-rule-2`, 10px radius, the brass focus ring.
- The brass stays under 5% of a screen: the primary fill, the focus ring, a link's hover, one line or readout. The rose belongs to the verb; `--color-live` to a live state only.

## Motion

One reveal: the verb's underline draws in once over `--dur-long`. Otherwise state only: a hairline pill takes `--color-paper-2` on hover, a streamed answer types once. No ambient loop, no breathing light, no stagger.

## Voice

Engineered, plain, specific: the model, the state, the unit, the price. Lowercase heads read like a note in a lab book, never cute. No exclamation marks.

## Do-nots

- Never a drawn or generated light: no orb, lamp, ring, halo or glowing object behind or beside a head.
- Never let the violet climb: a violet field or a violet-to-blue gradient is the generated look.
- Never colour a noun, never a second accented word; one verb, in the hero.
- Never sentence-case heads, and never a head at the plain section size; this face reads thin there.
- Never a warm ground or a third warm colour; the brass and the rose verb carry all the warmth.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap" rel="stylesheet">
```

```css
body { font-variant-numeric: tabular-nums; }
h1, h2, h3, nav, label, th, figcaption, .btn { text-transform: lowercase; }
h1, h2, h3 { font-weight: 400; } h2 { font-size: var(--text-display-s); line-height: 0.98; }
.verb { display: inline-block; color: var(--color-accent-2); }
.verb::after { content: ""; display: block; height: var(--rule-hair); background: currentColor; transform-origin: left; animation: draw var(--dur-long) var(--ease-out) both; }
@keyframes draw { from { transform: scaleX(0); } }
.btn { border-radius: var(--radius-pill); padding: var(--space-sm) var(--space-lg); font-weight: 500; }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); }
.btn--secondary { box-shadow: inset 0 0 0 var(--rule-hair) var(--color-rule-2); color: var(--color-ink); }
.btn--secondary:hover { background: var(--color-paper-2); }
.well { background: var(--color-paper-2); border: var(--rule-hair) solid var(--color-rule); border-radius: var(--radius-card); }
.blueprint { background-image: linear-gradient(var(--rule-blueprint) 1px, transparent 1px), linear-gradient(90deg, var(--rule-blueprint) 1px, transparent 1px); background-size: 48px 48px; }
.readout { font: 400 0.8125rem/1.5 var(--font-outlier); color: var(--color-ink-2); }
```
