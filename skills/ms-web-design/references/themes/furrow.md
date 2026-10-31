---
name: Furrow
slug: furrow
genre: modern-minimal
paper: light 96 85
display: grotesk-sans Red Hat Display
accent: warm 40
posture: committed
keywords: farm, agriculture, land, field, livestock, sheep, cattle, crop, records, compliance, inspection, fleet, field service, rural, contractor, hectares, yard, outdoors, seasonal, working, units
material: warm manila paper, near-black ink in rules, a generated survey map in sienna contours and slate water, Red Hat Display 600 over Red Hat Text with Red Hat Mono figures, moulded 6px keys, a waterproof notebook card, one tangerine signal and a grass green for what is in date
photo: natural con=8 sat=-6
pictured: Field Record, Map hero
---

# Furrow

A working records voice drawn on the land itself: warm manila paper, near-black ink, and the place the work happens generated as a survey map (contours, hedges, walls, water, the holding edged in tangerine like a title plan) with the records pinned where they happened. Entries open as waterproof notebook pages; the rest is ruled lists, figures with their units and moulded keys. Tangerine is ear tag and baler twine; green is what is in date. It is not a pastoral lifestyle page, not a glossy dashboard and not a sat-nav.

## Tokens

```css
:root {
  --color-paper: oklch(96% 0.011 85); --color-paper-2: oklch(99.5% 0.005 85); --color-paper-3: oklch(92% 0.016 85);
  --color-ink: oklch(18% 0.006 60); --color-ink-2: oklch(28% 0.008 60); --color-muted: oklch(44% 0.012 60); --color-rule: oklch(88% 0.013 85);
  --color-accent: oklch(70% 0.19 40); --color-accent-ink: oklch(18% 0.006 60); --color-accent-soft: oklch(91% 0.05 50); --color-focus: oklch(60% 0.19 40);
  --color-green: oklch(48% 0.11 150); --color-green-soft: oklch(92% 0.04 150);
  --color-contour: oklch(62% 0.07 58); --color-water: oklch(60% 0.05 232); --color-hedge: oklch(50% 0.1 150);
  --color-grid: oklch(90% 0.014 85); --color-grid-strong: oklch(85% 0.018 85); --color-sheet: oklch(99.3% 0.004 85);
  --font-display: "Red Hat Display", "Red Hat Text", ui-sans-serif, sans-serif; --font-body: "Red Hat Text", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: "Red Hat Mono", ui-monospace, monospace;
  --radius-card: 10px; --radius-entry: 14px; --radius-pill: 6px; --rule-hair: 1px;
  --shadow-card: 0 1px 2px oklch(18% 0.006 60 / 0.08), 0 14px 28px -16px oklch(18% 0.006 60 / 0.28);
  --shadow-lift: 0 1px 1px oklch(18% 0.006 60 / 0.1), 0 2px 4px -1px oklch(18% 0.006 60 / 0.1), 0 24px 44px -20px oklch(18% 0.006 60 / 0.42);
  --tracking-display: -0.035em; --display-weight: 600;
}
```

## Type

- **Display:** Red Hat Display 600, `--tracking-display`, line-height 1.0, sentence case; a price that is the offer sets in it at display size; an entry's time in it at 44px, tabular.
- **Body:** Red Hat Text 400, line-height 1.55, `--color-muted`; 500 for a row's title.
- **Labels, chips, tabs:** Red Hat Text 500 a step smaller, sentence case, untracked. Never mono, never uppercase.
- **Figures (mono as material):** Red Hat Mono 400 and 500, tabular, a step smaller than the text beside them, only for what gets copied onto a form: dates, times, tag numbers, doses, batches, hectares. Place names on the map in Red Hat Text 500, sentence case, set along their field as a surveyor would.

## Surfaces

- The survey map, generated on a canvas on load and resize, never a picture: contours traced from noise by marching squares in `--color-contour`, every fifth heavier and labelled; hedges dotted in `--color-hedge`, walls solid ink, water in `--color-water`, buildings hatched, a lane and a gate; the holding edged in tangerine. Paper grain, fibre and two fold creases are drawn into the map only. A still frame of it is the no-script fallback.
- On the map: pins in three shapes (disc, diamond, triangle) for the kinds of record, an ink tag beside each with its time; the open one turns tangerine; a movement draws as a dashed route. A map loupe (1.9x, fine ring, reticle) rests on one landmark and glides to the pointer.
- The notebook card: `--color-paper-2` at `--radius-entry`, a 1px ink ring and `--shadow-lift`, an ink head with the kind and the time, then cells on an 8px `--color-grid` notebook grid parted by 1px ink lines, and 56px step keys at the foot.
- An exported record is a letter-folded sheet opened flat: `--color-sheet`, 3px corners, two creases lit from above.
- Rules: a 1px ink rule over a list, `--color-rule` hairlines between rows, a 2px ink rule over a total. Only the card and the white sheet lift.
- Photographs: the holding in ordinary weather at mid distance; natural, never golden hour; 10px radius, or full-bleed under an ink scrim.

## Range

- **The day on the map:** entries pinned where they happened, one open as a notebook card.
- **The book as an index:** a ruled table on the white sheet, a segmented filter of the logs above, chips for in date and in withdrawal.
- **One day by the hour:** logs as rows against the hours, each entry a pin with its tag.
- **The bill over the land:** the price as ruled lines on the tangerine field, a contour fragment with a hedge, a gate and one pin behind it.

## Controls

- Moulded keys at 6px, 48px tall: the primary tangerine with ink text, a lit inset top edge and a shaded inset bottom; the secondary white with a 1px `--color-rule` border and the same lit edge. Active sinks 1px.
- Fields hold their label inside the box, small and muted at the top left, the value beneath; white, 52px, a 1px `--color-muted` border; a figure field sets in mono.
- Tangerine is a fill with ink on it: the primary, the selected tab, the open pin, the holding's edge, the field band, the focus ring.

## Motion

Once, in view: pins land in time order, the route draws, the card opens, the loupe settles. Transforms and opacity, `--ease-out`, paused off screen. Reduced motion or no script: the pins down, one entry open.

## Voice

Plain and unit-bearing: 3.6 ha, 10 ml, 28 days, a pound sign on a price. Never a number without its unit, never a pastoral adjective.

## Do-nots

- Never tangerine as type; it is a fill with ink on it.
- Never a map tile, a satellite photograph or a pin-drop icon; the land is a generated survey.
- Never grain or creases outside the map.
- Never mono on a label, a chip or a head.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@600&family=Red+Hat+Text:wght@400;500&family=Red+Hat+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: var(--display-weight); line-height: 1; }
.btn { min-height: 48px; border: var(--rule-hair) solid var(--color-rule); border-radius: var(--radius-pill); padding: 0 var(--space-lg); font-weight: 500; background: var(--color-paper-2); color: var(--color-ink); box-shadow: inset 0 1px 0 var(--color-sheet), 0 1px 1px var(--color-rule); }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); border-color: color-mix(in oklab, var(--color-accent) 78%, var(--color-ink)); box-shadow: inset 0 1px 0 color-mix(in oklab, var(--color-sheet) 32%, transparent), inset 0 -1px 0 color-mix(in oklab, var(--color-ink) 10%, transparent); }
.btn:active { transform: translateY(1px); }
.ruled { border-top: var(--rule-hair) solid var(--color-ink); } .ruled > * { border-bottom: var(--rule-hair) solid var(--color-rule); }
.entry { border-radius: var(--radius-entry); background: var(--color-paper-2); box-shadow: 0 0 0 1px var(--color-ink), var(--shadow-lift); overflow: hidden; }
.notebook { background: linear-gradient(var(--color-grid) 1px, transparent 1px) 0 0 / 8px 8px, linear-gradient(90deg, var(--color-grid) 1px, transparent 1px) 0 0 / 8px 8px, var(--color-paper-2); }
.field label { position: absolute; left: var(--space-md); top: var(--space-xs); font-size: 0.75rem; font-weight: 500; color: var(--color-muted); }
.num { font-family: var(--font-outlier); font-variant-numeric: tabular-nums; }
```
