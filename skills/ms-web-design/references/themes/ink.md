---
name: Ink
slug: ink
genre: editorial
paper: light 99.5 100
display: grotesk-sans Epilogue
accent: chromatic-teal 190
posture: restrained
keywords: library, lending, community, civic, notice board, catalogue, rota, volunteer, non-profit, neighbourhood, borrow, tools, repair, membership, events, local, competent, monochrome
material: white paper, a black with no hue, Epilogue 700 over Epilogue 400, hairline rules and state pills, one teal that means in
photo: muted
pictured: Catalogue, Settled hero
---

# Ink

A notice printed in plain black: white paper, a black with no hue, Epilogue at 700 for the head and 400 for everything you read, hairline rules, and one teal that means in or open. Its photographs show the things on the shelves, in daylight with the colour turned down. It feels competent, local and kind, the way a well-run community desk does. It is not a cold corporate monochrome and not a warm cream editorial page.

## Tokens

```css
:root {
  --color-paper: oklch(99.5% 0.003 100); --color-paper-2: oklch(97% 0.004 100); --color-paper-3: oklch(94% 0.006 100);
  --color-ink: oklch(16% 0 0); --color-ink-2: oklch(28% 0 0); --color-muted: oklch(44% 0 0);
  --color-rule: oklch(89% 0.004 100); --color-rule-2: oklch(93.5% 0.003 100);
  --color-accent: oklch(50% 0.095 188); --color-accent-ink: oklch(99.5% 0.003 100); --color-accent-soft: oklch(93% 0.05 190); --color-accent-soft-ink: oklch(27% 0.045 190);
  --color-focus: oklch(50% 0.095 188);
  --font-display: "Epilogue", ui-sans-serif, system-ui, sans-serif; --font-body: var(--font-display);
  --font-outlier: "IBM Plex Mono", ui-monospace, monospace;
  --radius-card: 12px; --radius-pill: 999px; --rule-hair: 1px;
  --shadow-card: 0 20px 40px oklch(20% 0 0 / 0.16);
  --tracking-display: -0.04em; --display-weight: 700;
}
```

Two colourways, both light, stated in the stamp (`ink: paper` or `ink: board`).

| Colourway | Ground and teal |
| --- | --- |
| `paper` (default) | the block above: white, hueless black, teal at 50% |
| `board` | notice-board yellow `oklch(93% 0.10 95)` with rules at `oklch(84% 0.10 92)`, ink `oklch(20% 0.02 80)`, teal deepened to `oklch(46% 0.078 190)`; wells and tags turn white |

## Type

- **Display:** Epilogue 700, `--tracking-display`, line-height 1.0 at hero size and 1.05 below, sentence case, roman; a figure (a count, a price, an hour) takes the same setting, a step larger than the head beside it.
- **Body:** Epilogue 400 at 16 to 17px, line-height 1.55, in `--color-ink-2` (muted greys tire on white); the name in a row, links and tags at 600.
- **Labels, captions, table heads, meta:** Epilogue 400 a step smaller, sentence case, untracked; never mono.
- **Outlier:** IBM Plex Mono only inside code and on figures that compare in a column (loan counts, a card number, times on a rota). Large figures and prices are Epilogue 700 in ink; the teal marks only what is in or open.

## Surfaces

- Rules: a list or a table opens on a 1px `--color-ink` rule and continues on `--color-rule` hairlines between its rows; `--color-rule-2` parts quieter rows.
- Radius 12px on wells and photographs, 10px on controls and inputs, pills on tags.
- Flat paper: a well is `--color-paper-2` with a 1px `--color-rule` edge; `--shadow-card` sits only under something that floats over the page (a menu, a dialog), never under a surface at rest.
- Bands: a `--color-paper-2` band or an ink band with paper text. Two a page at most; never a teal field.
- Photographs: the things and the street that shares them, in plain daylight at arm's length: a pegboard of tools, a ladder against a wall, a neighbour carrying something home, seen from behind; no face to the lens, no brand mark to the camera. The colour is turned down (the `photo:` muted) so the teal stays the one colour that means anything; 12px radius, a 1px `--color-rule` hairline, no shadow. A thing's name and its state tag sit under its picture, never on it.
- No texture.

## Range

- **The shelf as a ruled list:** every thing a row under the ink rule, its name at 600, one line on what it is, its state pill at the row's end, a filter field that narrows the rows as you type.
- **Steps as a notice:** how it works as three or four numbered stages across the columns, each numeral in Epilogue 700 at display size over a hairline, the stage that means in carrying the pale teal pill.
- **A timetable of opening days:** the next dates as rows, the hours in each, the next one inked; the dates come from the clock, never typed in.
- **Figures in plain black:** a count, a fee and the hours set large in Epilogue 700 on a `--color-paper-2` well, the one that means open in teal.

## Controls

- The pair: an ink-filled button with paper text beside a 1px `--color-rule` bordered button on `--color-paper-2`, both at 10px radius in Epilogue 600.
- Tags carry state and nothing else: in is pale teal (`--color-accent-soft`) with `--color-accent-soft-ink`, out is outlined in the rule colour, on is ink-filled.
- Teal means in or open: a tag, a large figure, a link's hover, the focus ring. Links are ink at 600, underlined, teal on hover.

## Motion

Nothing moves but state: a filter applies as you type, a tag changes state on click, an underline turns teal over `--dur-micro`. No marquee, no reveal, no counter.

## Voice

The desk volunteer's: what is in, when it is back, who is on Saturday. Short, kind, exact, never institutional.

## Do-nots

- Never a second colour: teal means in, and out is an outline, never red.
- Never a warm black. The ink has no hue, and the page says so: `waive 22 · ink and greys at zero chroma · a notice board is printed in plain black`.
- Never a teal field or teal running text; teal is a state, not a surface.
- Never a resting shadow; the paper stays flat.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700&family=IBM+Plex+Mono:wght@400&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: var(--display-weight); line-height: 1.02; }
.btn { border: var(--rule-hair) solid var(--color-rule); border-radius: 10px; padding: var(--space-sm) var(--space-md); font-weight: 600; background: var(--color-paper-2); color: var(--color-ink); }
.btn--primary { background: var(--color-ink); border-color: var(--color-ink); color: var(--color-paper); }
.tag { display: inline-flex; padding: var(--space-2xs) var(--space-sm); border-radius: var(--radius-pill); font-size: var(--text-xs); font-weight: 600; background: var(--color-paper-3); }
.tag--in { background: var(--color-accent-soft); color: var(--color-accent-soft-ink); }
.tag--out { background: transparent; box-shadow: inset 0 0 0 var(--rule-hair) var(--color-rule); color: var(--color-muted); }
.tag--on { background: var(--color-ink); color: var(--color-paper); }
.ruled { border-top: var(--rule-hair) solid var(--color-ink); } .ruled > * { border-bottom: var(--rule-hair) solid var(--color-rule); }
.well { background: var(--color-paper-2); border: var(--rule-hair) solid var(--color-rule); border-radius: var(--radius-card); }
.photo { border-radius: var(--radius-card); outline: var(--rule-hair) solid var(--color-rule); outline-offset: -1px; }
a { font-weight: 600; } a:hover { text-decoration-color: var(--color-accent); }
::selection { background: var(--color-accent-soft); color: var(--color-accent-soft-ink); }
```
