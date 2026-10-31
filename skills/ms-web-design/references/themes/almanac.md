---
name: Almanac
slug: almanac
genre: editorial
paper: mid 84 245
display: grotesk-sans Hanken Grotesk
accent: chromatic-magenta 350
posture: restrained
keywords: almanac, yearbook, field guide, reference, handbook, manual, index, catalogue, encyclopedia, data, figures, tables, statistics, research, dataset, records, directory, glossary, specifications
material: cool slate stock with a pale printed sheet, blue-black ink, Hanken Grotesk heads over Newsreader prose with mono figures, two rule weights and square corners, one chart magenta
photo: muted
pictured: Workbench, Stage hero
---

# Almanac

The register of a reference book: cool slate stock, blue-black ink, Hanken Grotesk heads over Newsreader prose, figures in mono lined up to the decimal, rules in two weights, and one deep magenta, the colour a sea chart prints its lights in, kept small. It reads as exact because the rules and the numerals hold the authority, not colour or ornament. It is not a dashboard on grey and not a warm editorial page.

## Tokens

```css
:root {
  --color-paper: oklch(84% 0.012 245); --color-paper-2: oklch(81% 0.012 245); --color-paper-3: oklch(77% 0.012 245);
  --color-ink: oklch(16% 0.020 245); --color-ink-2: oklch(24% 0.018 245); --color-muted: oklch(38% 0.016 245);
  --color-rule: oklch(73% 0.013 240); --color-rule-2: oklch(32% 0.018 240);
  --color-accent: oklch(45% 0.180 350); --color-accent-2: oklch(37% 0.160 350); --color-accent-ink: oklch(97% 0.006 245); --color-focus: oklch(46% 0.190 350);
  --color-sheet: oklch(93.5% 0.008 245);
  --font-display: "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Newsreader", ui-serif, Georgia, serif;
  --font-outlier: "IBM Plex Mono", ui-monospace, monospace;
  --radius-card: 0; --radius-pill: 2px; --rule-hair: 1px; --rule-bar: 2px; --shadow-card: none;
  --tracking-display: -0.02em; --display-weight: 600;
}
```

## Type

- **Display:** Hanken Grotesk 600 for every head, `--tracking-display`, line-height 1.05, sentence case, roman; the hero head tightens to -0.035em at line-height 0.95. The grotesk sets structure; the serif never sets a head.
- **Body:** Newsreader 400 and 500 with optical sizing, line-height 1.55; italic is in-paragraph emphasis only.
- **Labels, captions, table heads, meta:** Newsreader 500 a step smaller, sentence case, `--color-muted`. Never mono.
- **Figures:** IBM Plex Mono 400 and 500 with `tabular-nums`, right-aligned in a column, decimals lined up. Mono sets numerals and nothing else; a lone figure (a price, a count) may run to `--text-display` in Plex Mono 500 at -0.04em.

## Surfaces

- Two rule weights: `--rule-hair` in `--color-rule` parts rows and divisions; `--rule-bar` in `--color-rule-2` draws one firm line under a head or a table head. Nothing heavier.
- Square corners on every surface, 2px at most on a control. No boxed cards, no shadows: depth is a rule and a paper step (`--color-paper-2` on a well or an alternate row).
- The sheet: `--color-sheet` is the printed page, a pale stock laid on the slate with a 2px ink rule at its head and hairlines inside; the product's own pages and tables sit on it, never a paragraph.
- Bands: a `--color-paper-2` band, or one `--color-ink` band with paper text and mono in the sheet colour. Two bands a page at most; never a magenta field.
- Photographs: the subject at working distance (a harbour at low water, a slipway, the sea under weather), mid to far, flat overcast or first light, no face to the lens. Square, an inset 1px `--color-rule-2` outline, full-bleed or across ten columns; a caption beneath carries a fact; type never sits on a photograph.
- No texture: ruled paper, never a card surface.

## Range

- **The page itself:** a table set as the printed book sets it, on the sheet: a dated head over a 2px rule, the row names in Newsreader, times and heights in Plex Mono right-aligned, one row in magenta where the page points; it carries a hero or a split on its own.
- **One chart, set large:** a single series in magenta at 2px across twelve columns, the night or the off-hours shaded in paper steps, every turning point labelled in mono; with a control it becomes the page's one working thing.
- **The file on the ink band:** a header row and a handful of sample lines in Plex Mono in the sheet colour, the column names in magenta, a caption that says what the full file holds.
- **A comparison of editions or plans:** a Table of two or three columns, the firm rule under the head, prices as mono figures, the actions in the last row.

## Controls

- A magenta filled control (`--color-accent-ink` on `--color-accent`) beside a hairline-outlined control in ink, both Hanken Grotesk 500 at the 2px radius.
- Links in ink with a 1px magenta underline at a 0.15em offset that thickens on hover; inputs square with a 1px `--color-muted` edge.
- Magenta stays under 5% of a screen: the filled control, link underlines, the one series a chart argues from.

## Motion

Nothing moves except state: a row that links tints on hover, a link's underline thickens. No reveal, no count-up, no marquee.

## Voice

Declarative, dated, exact: cite the figure, the edition, the source, the unit. Never a hype adjective.

## Do-nots

- Never a hot pink or a violet; the magenta holds at L 44, hue 350, deep enough to read as a chart's print.
- Never warm or white paper; slate at hue 245, always tinted.
- Never a boxed card or a drop shadow; two rule weights carry every surface.
- Never a giant count as the hero, a page of small charts, or one mark for each day or port: one chart, set large, carries the data.
- Never a decorative wave or line drifting behind the type; a curve appears only as a chart with its axes.
- Never proportional figures in a column; numerals that compare are Plex Mono, tabular, right-aligned.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
body { color: var(--color-ink-2); }
h1, h2, h3 { font-weight: 600; color: var(--color-ink); }
.num, td.num { font-family: var(--font-outlier); font-variant-numeric: tabular-nums; text-align: right; }
thead th, .rule-firm { border-bottom: var(--rule-bar) solid var(--color-rule-2); }
th { font: 500 var(--text-sm)/1.3 var(--font-body); color: var(--color-muted); text-align: left; }
td { border-top: var(--rule-hair) solid var(--color-rule); }
.btn { border: var(--rule-hair) solid var(--color-ink); border-radius: var(--radius-pill); padding: var(--space-sm) var(--space-lg); font: 500 var(--text-sm)/1 var(--font-display); color: var(--color-ink); background: transparent; }
.btn--primary { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-ink); } .btn--primary:hover { background: var(--color-accent-2); }
.well { background: var(--color-paper-2); border-top: var(--rule-bar) solid var(--color-rule-2); }
.sheet { background: var(--color-sheet); border-top: var(--rule-bar) solid var(--color-ink); }
.band--ink { background: var(--color-ink); color: var(--color-paper); }
.chart .series { fill: none; stroke: var(--color-accent); stroke-width: 2; }
.photo > img { outline: var(--rule-hair) solid var(--color-rule-2); outline-offset: -1px; }
a { color: var(--color-ink); text-decoration-color: var(--color-accent); text-underline-offset: 0.15em; } a:hover { text-decoration-thickness: 2px; }
```
