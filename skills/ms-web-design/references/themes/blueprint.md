---
name: Blueprint
slug: blueprint
genre: modern-minimal
paper: mid 35 256
display: geometric-sans Chakra Petch
accent: neutral 240
posture: drenched
keywords: architecture, architect, engineering, construction, structural, interiors, planning, surveying, cad, drafting, fabrication, prefab, developer, technical, spec, permit, renovation, build, drawings, architecture studio, timber
material: prussian-blue sheet, white line ink, Chakra Petch capitals over IBM Plex Sans with mono measurements, square double keylines and dimension strings, photographs printed as cyanotypes, the white line as the only signal
photo: duotone paper-3 ink con=30 exp=-10
pictured: Bento Grid, Poster hero
---

# Blueprint

A drafting sheet as a material: Prussian-blue paper, a white line for ink, Chakra Petch drafted capitals over IBM Plex Sans, mono measurements with their units, keylines instead of cards, and photographs printed as cyanotypes, the sheet's blue in the shadows and its white in the light. It reads technical because everything is a line, a dimension or a print on one ground and the line is the only signal. It is not a dark product page with a blue gradient, not a neon wireframe.

## Tokens

```css
:root {
  --color-paper: oklch(35% 0.105 256); --color-paper-2: oklch(31% 0.10 257); --color-paper-3: oklch(26.5% 0.095 258);
  --color-ink: oklch(97% 0.012 240); --color-ink-2: oklch(90% 0.025 242); --color-muted: oklch(80% 0.045 244);
  --color-rule: oklch(93% 0.02 240 / 0.85); --color-rule-2: oklch(93% 0.02 240 / 0.32);
  --color-grid: oklch(97% 0.01 240 / 0.09); --color-grid-2: oklch(97% 0.01 240 / 0.2);
  --color-accent: oklch(97% 0.012 240); --color-accent-ink: oklch(33% 0.105 256); --color-focus: oklch(97% 0.012 240);
  --font-display: "Chakra Petch", ui-sans-serif, sans-serif; --font-body: "IBM Plex Sans", ui-sans-serif, sans-serif;
  --font-outlier: "IBM Plex Mono", ui-monospace, monospace;
  --radius-card: 0; --radius-pill: 0; --rule-hair: 1px; --rule-heavy: 2px; --shadow-card: none;
  --tracking-display: -0.012em; --display-weight: 600; --sheet-inset: 20px; --tick: 14px;
}
```

Three sheets, stated in the stamp (`blueprint: cyanotype`).

| Sheet | Ground, line, muted |
| --- | --- |
| **cyanotype** (default) | the tokens above |
| **whiteprint** | ground `oklch(97.5% 0.006 240)`, ink `oklch(35% 0.105 256)`, muted `oklch(52% 0.07 255)` |
| **brownline** | ground `oklch(86% 0.045 80)`, ink `oklch(28% 0.05 50)`, muted `oklch(45% 0.05 55)`, a red pencil `oklch(45% 0.19 28)` for annotation only |

## Type

- **Display:** Chakra Petch 600 for every head, `--tracking-display`, roman, one weight a head: the h1 and h2 uppercase at line-height 1.02 (55a), the h3 in sentence case.
- **Body:** IBM Plex Sans 400 for prose and 500 for labels and controls; reversed on the sheet, nothing lighter than 400.
- **Labels, captions, table heads, meta:** IBM Plex Sans 500 a step smaller, sentence case. IBM Plex Mono 500 sets a measurement with its unit, a stage or drawing number, a year on a dimension string and code, nothing else.

## Surfaces

- Lines only: 1px `--color-rule` keylines on every surface, and a second keyline in `--color-rule-2` 5px inside on a figure or a photograph. Radius 0, no shadows; depth is a second line, a `--rule-heavy` line or a one-step darker ground.
- The dimension string: a hairline with a 45° tick (`--tick` long) at each end and short extension lines, its value set above it. It measures something real, never a decoration.
- The grid: 24px minor lines in `--color-grid`, 120px major in `--color-grid-2`, offset by `--sheet-inset`, only under a drawing, a schedule or a chart of real data.
- Bands: `--color-paper-2` or `--color-paper-3`, two a page at most; the sheet is already the colour (drenched), so there is no other field.
- Photographs: structures built and building, shot square-on so they read like drawings (a frame going up, a roof from below, a model on a table), printed as cyanotypes inside the double keyline; pick frames with a real white and a real shadow, since grey prints flat. Type over one sits on a `--color-paper-3` scrim from its edge.

## Range

- **Figures as dimensions:** the prompt's one number in Chakra Petch at display size, set on a dimension string that spans ten or twelve columns between its two real ends (a first year and now, a smallest and largest span), the ends in mono.
- **Tables as drawing registers:** a stage schedule, a deliverables list or a price list as a keylined table, stage numbers in mono in their own column, the row title one weight heavier, a `--rule-heavy` line under the head row; on `--color-paper-2` it reads as the register sheet of a set.
- **Forms as a title block:** fields set as cells of a keylined block, each label at the cell's top left, the cells sized by what they hold, the submit in the ink fill at the block's foot.
- **Comparisons and steps as elevations:** two options side by side as columns parted by one heavy line, or stages as a run along one long dimension string with a tick at each stage, each stage a numeral, a title and a line.

## Controls

- An ink-filled primary with sheet-coloured text beside a 1px-outlined secondary in ink, both square, 48px, IBM Plex Sans 500.
- Links in ink with a 1px underline that clears on hover; inputs square, 48px, a 1px `--color-rule` keyline on `--color-paper-2`, the white focus ring, never a glow.
- The line is the accent: white on blue, in rules, the primary fill and the focus ring.

## Motion

Static, drafted. A rule or a dimension string may draw itself once a page (scaleX from its left tick over `--dur-long` on `--ease-out`); hover on a keylined surface that links darkens its ground one step.

## Voice

Specification voice: the building type, the stage, the year, the format, a unit on every figure; nothing a drawing note could not carry.

## Do-nots

- Never a filled card, a blur or a lifted panel; the sheet has lines, not layers.
- Never a second colour on the cyanotype, in type or in a photograph; the red pencil belongs to the brownline sheet.
- Never a building, frame or section drawn to stand in for a project, and never a dimension string with an invented value; a drawing is real project data or it is absent.
- Never the grid as wallpaper behind prose, and never a lowercase h1 or h2.
- Never a rounded corner, anywhere.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@600&family=IBM+Plex+Sans:wght@400;500&family=IBM+Plex+Mono:wght@500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: 600; }
h1, h2 { text-transform: uppercase; line-height: 1.02; }
.num { font-family: var(--font-outlier); font-weight: 500; }
.fig { position: relative; border: var(--rule-hair) solid var(--color-rule); }
.fig::after { content: ""; position: absolute; inset: 5px; z-index: 2; border: var(--rule-hair) solid var(--color-rule-2); pointer-events: none; }
.dim { position: relative; height: var(--rule-hair); background: var(--color-rule); }
.dim::before, .dim::after { content: ""; position: absolute; top: calc(var(--tick) / -2); width: var(--rule-hair); height: var(--tick); background: var(--color-rule); transform: rotate(45deg); }
.dim::before { left: 0; } .dim::after { right: 0; }
.btn { border: var(--rule-hair) solid var(--color-rule); border-radius: 0; background: transparent; color: var(--color-ink); padding: var(--space-sm) var(--space-lg); font-weight: 500; }
.btn--primary { background: var(--color-ink); border-color: var(--color-ink); color: var(--color-accent-ink); }
```
