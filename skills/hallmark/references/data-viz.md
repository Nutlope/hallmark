# Data visualisation

AI-generated charts are an obvious tell — rainbow palettes, dense gridlines, 3D donuts, dual-axis spaghetti, and a legend that names every series in marketing-speak. Half of every dashboard is chart-shaped, and until this file Hallmark had nothing to say about it.

This reference fires when the brief involves **analytics, metrics, dashboards, reports, admin consoles, or any chart / graph / sparkline / KPI strip**. Load it only then. Landing pages without numbers stay on the standard ruleset.

Charts are design. They obey the same token, type, colour, and restraint rules as the rest of the page. A chart that ignores the theme is a second product sitting inside the first.

---

## Principles

1. **One question per chart.** If you cannot name the question in six words, split the chart or drop it.
2. **Small multiples beat dense singles.** Three quiet panels > one panel with six series.
3. **Colour is data, not decoration.** One accent (or a short sequential / diverging ramp). Neutrals do the rest.
4. **Axes serve reading, not furniture.** Fewer ticks, no 3D, no dual Y unless the user supplies both series and a reason.
5. **Honest numbers only.** Gate 46 still applies — never invent metrics to fill a chart. Use real data, labelled placeholders (`—` + "metric to confirm"), or a different layout.
6. **Charts inherit tokens.** Stroke, fill, type, and surface all come from the theme's named tokens. No rainbow hex dump.

---

## When this file loads

Load when **any** of these fire:

- Brief names: *dashboard · analytics · metrics · KPI · report · chart · graph · sparkline · timeseries · funnel · heatmap · admin console · observability · usage*
- Macrostructure is **Workbench**, **Stat-Led**, or a multi-panel product surface
- The page already contains `<canvas>`, SVG series paths, or a chart library (Chart.js, Recharts, visx, Observable Plot, ECharts, D3)

Do **not** load for a landing page that only has a single hero stat figure with no series data.

---

## Chart-type defaults

Prefer the left column. The right column is the AI default — ban it unless the user explicitly requests it **and** the data shape requires it.

| Prefer | Avoid (AI tell) | Why |
| --- | --- | --- |
| Small multiples of line charts | One dual-axis multi-series line | Dual axes invite false comparison |
| Horizontal bar (ranked categories) | Vertical bar with rotated labels | Labels stay readable |
| Single-series line + area tint | Stacked area with 6+ series | Stacks hide trends past series 2 |
| Grouped bar (≤ 4 groups) | 3D bar / cylinder / cone | Perspective distorts magnitude |
| Dot / strip plot for distributions | Violin + box + swarm all at once | One encoding is enough |
| Simple donut **only** for part-of-whole with ≤ 4 slices | Multi-ring pie, exploded pie, 3D pie | Angles are hard to compare |
| Table + sparkline | Chart that duplicates a full table | Redundancy is noise |
| Heatmap with sequential ramp | Heatmap with rainbow spectral | Spectral is not ordered |

**Hard bans (always):**

- 3D charts of any kind
- Exploded / pulled-out pie slices
- Dual Y-axes unless both series are user-supplied **and** the brief names the comparison
- More than **one** accent hue for categorical series when ≤ 4 categories (use accent + 3 tinted neutrals)
- Rainbow / spectral categorical palettes (`#e41a1c #377eb8 #4daf4a #984ea3 …`)
- Drop shadows under marks
- Gradient fills on bars or pie slices
- Animated "count-up" on every KPI that loads

---

## Colour for data

Charts borrow the page palette. They do not invent a second one.

### Sequential (one magnitude)

Use the theme accent at rising lightness / chroma. Example (anchor from theme):

```css
/* sequential ramp — light → accent */
--viz-1: oklch(92% 0.02  var(--viz-hue));
--viz-2: oklch(78% 0.06  var(--viz-hue));
--viz-3: oklch(64% 0.11  var(--viz-hue));
--viz-4: oklch(50% 0.15  var(--viz-hue));
--viz-5: var(--color-accent);
```

### Diverging (above / below a midpoint)

Two arms around a neutral midpoint. Midpoint sits on paper/ink, not white.

```css
--viz-neg:  oklch(55% 0.14  25);   /* cool or warm opposite of accent */
--viz-mid:  var(--color-rule);
--viz-pos:  var(--color-accent);
```

### Categorical (≤ 4 series)

Accent + three neutrals at distinct lightness. **Never** five saturated hues.

```css
--viz-cat-1: var(--color-accent);
--viz-cat-2: oklch(45% 0.04 var(--viz-hue));
--viz-cat-3: oklch(60% 0.03 calc(var(--viz-hue) + 40));
--viz-cat-4: oklch(35% 0.02 var(--viz-hue));
```

If you need **more than 4** categories, switch encoding: small multiples, a table, or position — not more colours.

### Surface rules

- Plot background = `--color-paper` or `--color-paper-2`, never pure white/black.
- Gridlines = `--color-rule` at ≤ 1 px, low contrast. Prefer horizontal only for bar/line.
- Axis text = `--color-muted` or `--color-neutral`, never accent.
- Focus / hover mark = `--color-focus` or a +10% lightness shift on the series colour.

Contrast: marks against paper must clear **3:1** for UI, body annotations **4.5:1**.

---

## Typography inside charts

- Axis labels and ticks: **body** face, tabular nums (`font-variant-numeric: tabular-nums`), weight 400–500.
- Chart title: **display or body**, roman, not italic. Title names the *question*, not the chart type ("Revenue by week", not "Line Chart").
- Legend: body face, sentence case, not ALL CAPS, not marketing verbs ("Unleash growth").
- Annotation callouts: one accent underline or a hairline rule — no speech-bubble chrome.
- No third display face inside the plot. 2+1 still holds.

---

## Layout of chart blocks

A chart is a **section component**, not a free-floating widget.

```
┌─ section ─────────────────────────────────────┐
│  Title (question)              optional unit  │
│  one-line lede / date range                   │
│  ┌─ plot ───────────────────────────────────┐ │
│  │                                          │ │
│  └──────────────────────────────────────────┘ │
│  source · n= · last updated                   │
└───────────────────────────────────────────────┘
```

Rules:

- Title **above** the plot, left-aligned with the plot's left axis — not centred over a 3-column card grid of charts.
- **No card-in-card**: one containment layer. If the section already has a border, the plot does not get another thick card.
- KPI strip above a chart: ≤ **4** figures, each with label + value + optional delta. Deltas use honest arrows or `+`/`−` text — not green/red pills on every cell.
- Gap between multiple charts: named spacing tokens (`--space-l` / `--space-xl`), not arbitrary `17px`.
- On mobile (≤ 640 px): charts stack to **one column**; hide secondary series or switch to a compact sparkline + table. See [`responsive.md`](responsive.md).

---

## Marks and ink

- Line stroke: 1.5–2.5 px. No glow, no gradient stroke.
- Area fill under a line: accent at 8–16% opacity, not a second solid colour.
- Bar gap: ~20–30% of bar width. Rounded corners ≤ 2 px (or square for brutal / terminal themes).
- Points on a line: only when n is small (≤ 12) or values are sparse; otherwise the line alone.
- Avoid `box-shadow` on marks. Elevation is for chrome, not data.

---

## Interaction

Interactive charts follow [`interaction-and-states.md`](interaction-and-states.md) and [`microinteractions.md`](microinteractions.md):

| State | Behaviour |
| --- | --- |
| default | Full series visible; legend not selected |
| hover | Crosshair or nearest-point emphasis; **other series dim** to ~40% opacity — do not scale the mark |
| focus-visible | Keyboard-reachable points / bars; visible focus ring using `--color-focus` |
| disabled | Muted series when a legend item is off |
| loading | Skeleton aligned to final plot bounds — not a spinner in the corner |
| empty | Honest empty state: "No data for this range" + one action if applicable |
| error | Failure message; do not draw a fake zero series |

Tooltips:

- Appear on hover **and** focus (delay 0 on focus, ~200–400 ms on hover).
- Content: series name, value, unit, time — no "Insight unlocked!" copy.
- Prefer a single sticky tooltip near the point over a chasing floating card.

Reduced motion: no animated draw-on for series paths when `prefers-reduced-motion: reduce`. Snap to final frame. See [`motion.md`](motion.md).

---

## Accessibility

- Every chart needs a **text alternative**: visible data table (preferred), or `aria-describedby` pointing at a summary, or a linked "Download CSV".
- Do not rely on colour alone — pair colour with pattern, position, or direct labels on the mark.
- SVG charts: root has `role="img"` **and** an accessible name, **or** expose the data as a real table and `aria-hidden="true"` the decorative SVG.
- Canvas charts: always pair with a table or structured list; canvas alone is opaque to AT.
- Keyboard: if points are interactive, they are in the tab order or reachable via arrow keys inside a roving tabindex.

---

## KPI / stat strips (no full chart)

When the page only needs figures, not series:

- Prefer **Stat-Led** macrostructure patterns and [`components/h4-stat-led.md`](components/h4-stat-led.md) / numbered stat strips.
- Tabular nums, one accent on the primary figure at most.
- Never invent `+47%` / `10×` / `50,000+ teams` — placeholders only if real data is missing.
- Avoid the 3-equal "metric cards with icon-above-number" grid (anti-pattern: icon-tile feature card applied to metrics).

---

## Library guidance

Hallmark is library-agnostic. When the project already has a chart library, **use it** and restyle to tokens — do not add a second library.

| Situation | Guidance |
| --- | --- |
| Project has Recharts / Chart.js / visx / Plot / ECharts | Restyle strokes/fills/fonts to theme tokens; strip default legend chrome |
| Vanilla HTML skill emit | Prefer inline **SVG** with tokenised attributes; keep path data honest |
| Complex interaction needed | Prefer a real library the project already uses over a hand-rolled canvas |

Do not ship demo data that pretends to be production. Label sample series `Sample · replace with live data` when the brief has no numbers.

---

## Worked fingerprint (minimal SVG line)

A single-series weekly line that obeys the rules — adapt tokens to the active theme:

```html
<figure class="viz" aria-labelledby="viz-rev-title" aria-describedby="viz-rev-desc">
  <figcaption>
    <h3 id="viz-rev-title">Weekly active projects</h3>
    <p id="viz-rev-desc">Last 8 weeks · sample data</p>
  </figcaption>
  <svg viewBox="0 0 320 120" role="img" aria-label="Line chart of weekly active projects">
    <!-- grid: 3 horizontal rules only -->
    <g class="viz-grid" stroke="var(--color-rule)" stroke-width="1">
      <line x1="32" y1="20" x2="312" y2="20" />
      <line x1="32" y1="60" x2="312" y2="60" />
      <line x1="32" y1="100" x2="312" y2="100" />
    </g>
    <path
      class="viz-line"
      fill="none"
      stroke="var(--color-accent)"
      stroke-width="2"
      stroke-linejoin="round"
      stroke-linecap="round"
      d="M32 88 L72 72 L112 76 L152 48 L192 52 L232 36 L272 40 L312 28"
    />
  </svg>
  <p class="viz-source">Source: internal · n = sample</p>
</figure>
```

```css
.viz { color: var(--color-ink); font-family: var(--font-body); }
.viz h3 { font-family: var(--font-display); font-style: normal; font-weight: 600; }
.viz-source { color: var(--color-muted); font-size: 0.85rem; }
.viz-line { /* no filter, no glow */ }
```

---

## Audit checklist (punch list)

When `hallmark audit` hits a dashboard, flag by name:

| Tell | Severity |
| --- | --- |
| Rainbow categorical palette | Critical |
| 3D / exploded pie | Critical |
| Dual Y-axis without stated reason | Critical |
| Invented metrics in series | Critical |
| Card-in-card chart widgets | Major |
| Gradient bar / pie fills | Major |
| Centred title over every chart in a 3-col grid | Major |
| Missing text alternative / table | Major |
| Gridlines denser than data | Minor |
| Legend in ALL CAPS marketing voice | Minor |
| Count-up animation on every KPI | Minor |

Fixes always point back to this file and [`color.md`](color.md) / [`anti-patterns.md`](anti-patterns.md).

---

## Relation to other references

- Colour tokens and accent footprint: [`color.md`](color.md)
- Type and tabular nums: [`typography.md`](typography.md)
- Named tells (non-chart): [`anti-patterns.md`](anti-patterns.md)
- Motion / reduced motion: [`motion.md`](motion.md)
- Interactive states: [`interaction-and-states.md`](interaction-and-states.md)
- Stat-led page shape: [`macrostructures/04-stat-led.md`](macrostructures/04-stat-led.md)
- Workbench product surface: [`macrostructures/05-workbench.md`](macrostructures/05-workbench.md)

Charts that pass this file still face the full slop-test at Step 7 — especially gates on accent footprint, invented metrics, contrast, reduced motion, and re-drawn chrome.
