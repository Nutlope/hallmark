---
name: Atelier
slug: atelier
genre: editorial
paper: light 94.5 76
display: roman-serif Sentient
accent: cool 248
posture: restrained
keywords: fashion, atelier, couture, fragrance, gallery, exhibition, museum, ceramics, furniture, homeware, architecture, design studio, lookbook, collection, craft, small-batch, made by hand, brand story, luxury, object, hotel, boutique hotel, hospitality, stay
material: limewash paper under a slow luminous air, deep umber ink, Sentient light over Hanken Grotesk, cotton card stock with fibre and pressed type, hairlines, matted prints in warm daylight, one cool slate signal
photo: warm con=-6 vib=-10
pictured: Gallery Hang, Diffusion hero
---

# Atelier

The register of a maker's catalogue held in still air: limewash paper with a slow, luminous haze moving behind it, deep umber ink, Sentient light in heads and statements, Hanken Grotesk for reading, hairlines, one slate signal nearly as dark as the ink. The things a house hands you (a sample strip, a card, a numbered print) are built on cotton stock, lit from the top left, with pressed type and fibre. Not a cream page with a thin luxury serif, not a product page with a blue button.

## Tokens

```css
:root {
  --color-paper: oklch(94.5% 0.010 76); --color-paper-2: oklch(91.8% 0.013 74); --color-paper-3: oklch(88% 0.015 72);
  --color-ink: oklch(19% 0.024 52); --color-ink-2: oklch(31% 0.018 54); --color-muted: oklch(47% 0.014 60);
  --color-rule: oklch(81% 0.011 70);
  --color-accent: oklch(41% 0.075 248); --color-accent-ink: oklch(96% 0.008 76); --color-focus: oklch(50% 0.095 248);
  --color-card: oklch(97.6% 0.007 82); --color-card-edge: oklch(86% 0.012 72); --color-pencil: oklch(52% 0.010 62);
  --card-lit: oklch(98.4% 0.006 84); --card-shade: oklch(96.4% 0.008 78); --lit: oklch(99.6% 0.004 85 / 0.9);
  --stain-1: oklch(70% 0.075 14); --stain-2: oklch(66% 0.055 132); --stain-3: oklch(60% 0.080 58); --stain-4: oklch(68% 0.045 206);
  --font-display: "Sentient", Georgia, serif; --font-body: "Hanken Grotesk", system-ui, sans-serif;
  --font-outlier: var(--font-body);
  --radius-card: 0; --radius-pill: 3px; --rule-hair: 1px; --rule-head: 1px;
  --shadow-card: 0 0 0 1px oklch(30% 0.03 55 / 0.05), 0.5px 1px 1px oklch(30% 0.03 55 / 0.08), 3px 8px 14px -6px oklch(30% 0.03 55 / 0.14), 14px 36px 64px -28px oklch(30% 0.03 55 / 0.3);
  --tracking-display: -0.018em; --tracking-statement: -0.022em; --display-weight: 300; --statement-weight: 300; --serif-small: 400;
}
```

## Type

- **Display and statement:** Sentient 300 for every head and for a sentence or a figure at `--text-display-s` or larger, line-height 1.02 to 1.1, sentence case, roman. One weight and one colour a head.
- **Small serif:** Sentient 400 for `h3`, a name on a card, a day, an entry numeral; never under 16px, never a paragraph.
- **Body:** Hanken Grotesk 400, line-height 1.6, `--color-ink-2`. Three weights a page: Sentient 300 and 400, Hanken 400.
- **Labels:** the wall label: Hanken 400 a step smaller, sentence case, untracked; the object in ink, the material or number in `--color-muted`. A numbered edition is pencilled: a blank rule for the hand, then the run, in `--color-pencil`.

## Surfaces

- The air: one fixed WebGL field behind the page, domain-warped noise drifting upward in cream and pale amber veils, mixed in linear light, rendered at half size; the pointer's recent path parts it and a chosen item tints it. It shows through the hero and one or two zones; paper sections cover it. A still frame of the same field is the fallback. Never a gradient blob, never a photograph.
- Texture is generated as feTurbulence data URIs: `--grain` (180px, 1.15) multiplied at 0.16 over the air, `--fibre` (220px, 0.85) on all card stock.
- Card stock: cotton in `--color-card`, 2px corners, `--shadow-card`, an inset lit edge top left, an inner hairline frame inset 14px in `--color-card-edge`; type on it is pressed (a 1px lit text shadow below).
- Sample strips: slim cotton blotters with a pointed tip, the item's stain wicking up from the tip, the name printed small and vertical. They fan from a rivet beside a head, hang from a rail as tabs (the chosen one let down on a thread), or tuck behind a card.
- Hairlines on rows; a table or list opens on an ink `--rule-head` rule. Photographs: still life and rooms in warm daylight, hung square with a wall label; the lead picture is a print on a thin cotton mat with a fine bevel and its edition pencilled beneath.

## Range

- **Statement:** one sentence of the prompt in Sentient 300 across nine or ten columns, the pencilled edition line and a wall-text paragraph opening on a slate drop cap.
- **The choice as strips:** the collection as blotters on a rail, each a real tab; the chosen one drops, its picture and wall label beside it.
- **Timetable:** days or hours as a ruled table under the ink rule, names in Sentient 400, a closed row muted, never struck through.
- **The booking as a card:** the form as a letterpress card on cotton: the house name pressed, a ringed day picker (a blind impression around the chosen day), engraved time chips, ruled lines to write on, strips tucked behind.

## Controls

- A hairline-outlined control in ink at 3px (hover fills ink, paper text) beside an underlined link with a slate underline. No colour-filled control.
- Choices on card stock are pressed in: inset shade top left, lit edge below; chosen takes a 1px ink ring. Fields on a card are a label over a ruled line.
- The slate stays under 4% of a screen: underlines, the drop cap, the focus ring.

## Motion

Fade-in after fonts; strips unfurl once on `--ease-out` over `--dur-long`; the air drifts, parts and tints, paused off screen. Reduced motion and no script: a still air, the first item chosen.

## Voice

Hand-set, object-precise: the object, the material, the number made, the days the door is open. No superlatives, never "shop now" or "discover".

## Do-nots

- Never a warm accent; the signal is cool slate under chroma 0.09.
- Never a bold or high-contrast head; Sentient light carries the voice.
- Never serif running text.
- Never a flat white card or a blurred glass panel; card stock has fibre, a lit edge and one light from the top left.
- Never two still lifes side by side at one size.

## Build hint

```html
<link href="https://api.fontshare.com/v2/css?f[]=sentient@300,400&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400&display=swap" rel="stylesheet">
```

```css
body { color: var(--color-ink-2); line-height: 1.6; }
h1, h2 { font-weight: var(--display-weight); color: var(--color-ink); } h3 { font-weight: var(--serif-small); }
.ruled { border-top: var(--rule-head) solid var(--color-ink); } .ruled > * + * { border-top: var(--rule-hair) solid var(--color-rule); }
.dropcap::first-letter { float: left; font: var(--serif-small) 3.3em/0.8 var(--font-display); padding: 0.1em 0.1em 0 0; color: var(--color-accent); }
.btn { min-height: 52px; border: var(--rule-hair) solid var(--color-ink); border-radius: var(--radius-pill); padding: 0 var(--space-lg); color: var(--color-ink); background: transparent; transition: background-color var(--dur-short) var(--ease-out), color var(--dur-short) var(--ease-out); }
.btn:hover { background: var(--color-ink); color: var(--color-paper); }
.stock { border-radius: 2px; background: var(--fibre) 0 0 / 220px, linear-gradient(160deg, var(--card-lit), var(--color-card) 55%, var(--card-shade)); box-shadow: var(--shadow-card), inset 1px 1px 0 var(--lit); text-shadow: 0 1px 0 var(--lit); }
.stock::before { content: ""; position: absolute; inset: 0.875rem; border: var(--rule-hair) solid var(--color-card-edge); }
.air::after { content: ""; position: absolute; inset: 0; background-image: var(--grain); background-size: 180px; opacity: 0.16; mix-blend-mode: multiply; }
```
