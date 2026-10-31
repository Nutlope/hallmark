---
name: Broadside
slug: broadside
genre: editorial
paper: light 92 88
display: display-condensed Six Caps
accent: warm 33
posture: committed
keywords: auction, sale, market, fair, event, one night, announcement, town, notice, poster, bill, lots, machinery, tools, festival, fete, hammer, date, venue, tickets
material: grained buff stock, near-black ink, Six Caps and Bevan wood capitals over Archivo Narrow, ink rules at one point or five, one vermilion
photo: duotone ink paper con=20
pictured: Marquee Hero, Settled hero
---

# Broadside

A printer's bill: grained buff stock, near-black ink, Six Caps fitted to the measure over Bevan, Archivo Narrow small print, rules at one point or five, one vermilion. It is loud because the capitals are tall and the rules heavy, never because anything is drawn; photographs print plainly in the ink, like the plate on a sale bill. Not a western pastiche, nor a soft cream editorial page.

## Tokens

```css
:root {
  --color-paper: oklch(92% 0.028 88); --color-paper-2: oklch(88.5% 0.032 88); --color-paper-3: oklch(85% 0.036 86);
  --color-ink: oklch(18% 0.01 50); --color-ink-2: oklch(30% 0.012 50); --color-muted: oklch(43% 0.02 62);
  --color-rule: oklch(75% 0.028 82);
  --color-accent: oklch(53% 0.19 33); --color-accent-ink: oklch(95.5% 0.018 88); --color-focus: oklch(53% 0.19 33);
  --font-display: "Six Caps", "Impact", sans-serif; --font-display-2: "Bevan", Georgia, serif;
  --font-body: "Archivo Narrow", "Arial Narrow", ui-sans-serif, sans-serif;
  --font-outlier: var(--font-body);
  --radius-card: 0; --radius-pill: 0; --rule-hair: 1px; --rule-bar: 5px; --rule-frame: 3px;
  --shadow-card: none;
  --tracking-display: 0.02em; --display-weight: 400;
  --grain: 0.08;
}
```

One dial, the colourway, stated in the stamp (`broadside: bill`).

| Colourway | Stock | Ink | Accent |
| --- | --- | --- | --- |
| `bill` (default) | the block above | ink | vermilion |
| `inked` | oklch(17% 0.01 60), grain screened | buff oklch(92% 0.028 88) | vermilion at oklch(63% 0.19 33); paper band dark |
| `red-bill` | the vermilion | buff oklch(95.5% 0.018 88), 5.5:1 | buff; posture drenched |

## Type

- **Six Caps** 400, uppercase, line-height 0.88, `--tracking-display`, for the h1, big figures and fitted lines. It is fitted, not stepped: each line its own element that never wraps (`white-space: nowrap`, the 55b guard), its size set from its measured width in `cqi` so it fills its column exactly; lines stacked in one block differ in size, as type set by hand does.
- **Bevan** 400 for section heads, item titles, the wordmark and short lines of fact; uppercase, untracked, line-height 1.
- **Archivo Narrow** 400 and 600, line-height 1.5, for everything read; labels, table heads, captions and meta in its 500 a step smaller, sentence case, untracked, `--color-muted`. Figures are Six Caps, or Archivo Narrow tabular in a row.
- Three families, no outlier: one case of wood type, the gothic for scale and the slab for weight.

## Surfaces

- Rules: `--rule-bar` in ink above a section, a table or between two columns of a bill, `--rule-hair` in ink under a running head, `--rule-hair` in `--color-rule` between rows. Nothing between one and five.
- Square corners everywhere, no shadow. A frame is a double rule, a `--rule-frame` ink border with a 1px ink keyline 3px inside it, round a well or a photograph.
- Bands: `--color-paper-2`, ink with buff type, or one vermilion band with buff type; two a page at most.
- Photographs: plain daylight documentary at eye level, the thing for sale whole and side-on, a detail at arm's length; nobody facing the lens. Printed in the ink on the stock (the `photo:` duotone), square, in the double-rule frame; type never sits on one, and a caption under it carries a fact.
- Grain, the only texture: the speck layer (`texture.md` § 1) at `--grain`, multiplied on buff and screened on ink, on bands, wells and photograph frames, never under running text.

## Range

- A timetable as a bill: each day a column under a five-point rule, its name fitted in Six Caps to the column, the hour in Bevan, the small print under a 1pt rule; columns parted by a five-point vertical rule.
- A count or a date fitted to the full measure in Six Caps, the one vermilion line of its screen, its small print beneath.
- Particulars as rows: a Bevan label on the left, the fact in Archivo Narrow 600 on the right, hair rules between, a five-point rule over the first; a fact not yet known prints as a muted fill, never invented.
- A form on the vermilion band: buff fields with an ink keyline, the ink block as its action, the head in Bevan.

## Controls

- An ink-filled block in Archivo Narrow 600, untracked capitals (legal under an uppercase display), beside the same block as an unfilled double-rule frame; square, 48px, one fill a page.
- Links in ink, underlined, vermilion on hover; inputs square, 48px, a 1px ink border.
- Vermilion sets one whole display line (its own element, never part of a head) or one figure a screen, on buff or `--color-paper-2`.

## Motion

Printed, so still: a live figure updates in place, a fitted line fits once when the fonts load. No marquee, no hover growth, no reveal.

## Voice

A sale bill read aloud: the date, the place, the lot and the hour, each said once. Shouted in capitals, explained in the small print, in the words of the trade it sells to.

## Do-nots

- Never a ragged big line; a Six Caps line that does not fill its measure is fitted or cut.
- Never a fourth face outside code: the case is Six Caps, Bevan and the narrow.
- Never a rounded corner; frames, controls and photographs are square.
- Never a second colour, in type or in a picture; photographs print in the ink.
- Never a drawn gavel, star or ornament; the capitals and the photograph are the loud things.
- Never a photograph on every fold; half the bill is type, and the type is the loud half.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Six+Caps&family=Bevan&family=Archivo+Narrow:wght@400;500;600&display=swap" rel="stylesheet">
```

```css
h1, .display { font-family: var(--font-display); font-weight: 400; text-transform: uppercase; line-height: 0.88; letter-spacing: var(--tracking-display); }
.fit { display: block; white-space: nowrap; }
h2, h3, .wordmark { font-family: var(--font-display-2); font-weight: 400; text-transform: uppercase; line-height: 1; letter-spacing: 0; }
.rule-bar { border-top: var(--rule-bar) solid var(--color-ink); }
.frame, .btn--frame { border: var(--rule-frame) solid var(--color-ink); box-shadow: inset 0 0 0 3px var(--color-paper), inset 0 0 0 4px var(--color-ink); }
.frame { padding: var(--space-lg); } .frame--photo { padding: var(--space-2xs); }
.btn { display: inline-flex; align-items: center; min-height: 48px; padding: 0 var(--space-xl); border: 3px solid var(--color-ink); background: var(--color-ink); color: var(--color-paper); font: 600 var(--text-sm)/1 var(--font-body); text-transform: uppercase; }
.btn--frame { background: transparent; color: var(--color-ink); }
.grained { position: relative; isolation: isolate; }
.grained::after { content: ""; position: absolute; inset: 0; pointer-events: none; opacity: var(--grain); mix-blend-mode: multiply; } /* the speck SVG, texture.md § 1 */
::selection { background: color-mix(in oklab, var(--color-accent) 30%, transparent); }
```
