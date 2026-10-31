# Data viz: charts that read as set, not generated

Loaded when the prompt involves charts, data or dashboards, or the shape is Stat-Led or Workbench: a tabular spine, hairline grids, one series that argues, and no decorative dashboards (no donut walls, gauge rows or confetti of KPIs).

## Form first (before any drawing)

| The data is | The form is |
| --- | --- |
| one value | a stat tile (a large figure and a worded qualifier), never a one-bar chart |
| two to five values compared | a stat row, or horizontal bars |
| a series over time | a line, or a sparkline when it rides inside another component |
| more than about seven categories | a table; more colours is not an answer |
| parts of a whole | a stacked horizontal bar; never a pie, a donut or a gauge |

The most underused form is emphasis: one accent series, everything else neutral. If every series is loud, none is.

## Construction (inline SVG written for the data, no chart library)

- **Bars**: <= 24px thick, 2-4px gaps, baseline at zero always; rounded only at the data end, <= 2px.
- **Lines**: 2px stroke; markers only at annotated points (>= 6px); a sparkline may fade-fill to transparent, the one sanctioned gradient near a chart.
- **Gridlines**: 1px solid `--color-rule`, never dashed, fewer than you think (3-5 horizontal lines); axis lines can be the grid's first line, not a heavier stroke.
- **One y-axis.** Never dual axes, the classic way to fake a correlation. Two series with different units get two small charts (small multiples) instead.
- **No mark shadows, no 3D, no gradients in marks** (the sparkline fade-fill excepted).
- Sparklines inside components: no axes, no grid, no second colour.

## Colour

Adapted to Hallmark's one-accent discipline (an 8-hue categorical palette would fight everything else on the page):

- **Single series**: the accent.
- **Multi-series**: a lightness ramp on the accent hue (L steps of ~12-15%, chroma constant), assigned in a fixed order, never cycled; context/reference series in `--color-muted`.
- **A second hue** only under Full-palette posture, from the declared roles, never invented mid-chart.
- **Text never wears the data colour.** Labels, values, and axis text are `--color-ink` / `--color-muted`; a series is identified by a swatch beside its label, not by dyeing the words.
- **Tabular numerals on every numeric surface** (values, axes, tables; F6).

## Honesty (gate 46a binds here hardest)

- Real numbers, or a text slot (`craft.md` § 8) where a figure is missing; a fabricated series is worse than an empty slot.
- Bars start at zero; a truncated axis that exaggerates a delta is the numeric version of an invented metric. Annotate a zoomed view explicitly ("axis starts at 94%") when the data genuinely lives in a narrow band.
- Sample data lives only inside a built product sample or a code surface, reads as a sample (totals sum, dates sequence) and is never a figure a visitor could take as a claim (`craft.md` § 6); the stamp notes `data: sample`.

## Dark

Marks re-derive like accents in [`dark-mode.md`](dark-mode.md) (chroma down, L up); gridlines from the dark `--color-rule`; the fade-fill drops to half opacity on dark grounds.

## The dashboard bar

A Workbench or dashboard build shows fewer, truer figures: one hero figure (stat tile), one supporting chart, one table. The KPI wall with six gauges is the tell this file exists to kill.
