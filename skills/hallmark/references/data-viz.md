# Data viz - charts that read as set, not generated

Loaded when the brief involves charts/data/dashboards or the macro is Stat-Led / Workbench. Generalizes what Ledger, Almanac, and Sport already practice: the tabular spine, hairline grids, one quiet series, and the standing ban on decorative dashboards ("no donut walls, no gauge rows, no confetti of KPIs").

## Form first (before any drawing)

| The data is | The form is |
| --- | --- |
| one value | a stat tile (big figure + worded qualifier) - NEVER a one-bar chart |
| 2-5 values compared | a stat row, or horizontal bars |
| a series over time | a line, or a sparkline when it rides inside another component |
| more than ~7 categories | a table (Almanac's home turf) - more colours is not an answer |
| parts of a whole | a stacked horizontal bar - never pie, donut, or gauge (house ban) |

The most underused form is EMPHASIS: one accent series, everything else neutral. If every series is loud, none is.

## Construction (hand-built inline SVG, no chart library)

- **Bars**: <= 24px thick, 2-4px gaps, baseline at ZERO always; rounded only at the data end, <= 2px.
- **Lines**: 2px stroke; markers only at annotated points (>= 6px); a sparkline may fade-fill to transparent (the Ledger move), which is the ONE sanctioned gradient near a chart.
- **Gridlines**: 1px solid `--color-rule`, never dashed, fewer than you think (3-5 horizontal lines); axis lines can be the grid's first line, not a heavier stroke.
- **One y-axis.** Never dual axes - the classic way to fake a correlation. Two series with different units get two small charts (small multiples) instead.
- **No mark shadows, no 3D, no gradients in marks** (the sparkline fade-fill excepted).
- Sparklines inside components: no axes, no grid, no second colour (ledger-01 is the register).

## Colour

Adapted to Hallmark's one-accent discipline (an 8-hue categorical palette would fight everything else on the page):

- **Single series**: the accent.
- **Multi-series**: a LIGHTNESS ramp on the accent hue (L steps of ~12-15%, chroma constant), assigned in a fixed order, never cycled; context/reference series in `--color-muted`.
- **A second hue** only under Full-palette posture, from the declared roles, never invented mid-chart.
- **Text never wears the data colour.** Labels, values, and axis text are `--color-ink` / `--color-muted`; a series is identified by a swatch beside its label, not by dyeing the words.
- **tabular-nums on every numeric surface** (values, axes, tables) - the finish tier checks it.

## Honesty (gate 46 binds here hardest)

- Real numbers, or the labelled-placeholder treatment ("metric to confirm" + a grey block); a fabricated series is worse than an empty slot.
- Bars start at zero; a truncated axis that exaggerates a delta is the numeric version of an invented metric. Annotate a zoomed view explicitly ("axis starts at 94%") when the data genuinely lives in a narrow band.
- Sample data in examples is plausible and internally consistent (totals sum, dates sequence); the stamp notes `data: sample` when it is.

## Dark

Marks re-derive like accents in [`dark-mode.md`](dark-mode.md) (chroma down, L up); gridlines from the dark `--color-rule`; the fade-fill drops to half opacity on dark grounds.

## The dashboard bar

A Workbench/dashboard build shows FEWER, truer figures: one hero figure (stat tile), one supporting chart, one table. The KPI wall with six gauges is the tell this file exists to kill.
