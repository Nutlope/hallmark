---
name: Console
slug: console
genre: modern-minimal
paper: dark 17 250
display: grotesk-sans Host Grotesk
accent: chromatic-amber 80
posture: restrained
keywords: lab, laboratory, protocol, experiment, notebook, science, research, observability, monitoring, version control, audit, compliance, instruments, data, devtools, engineering, telemetry, record, operations, dark, developer
material: graphite ground in three lightness steps, pale ink, hairline panels cut from one surface, Host Grotesk 500 for reading, Atkinson Hyperlegible Mono for what was measured, amber for a person and cool blue for an instrument
photo: duotone paper-3 ink
pictured: Audit Trail, Stage hero
---

# Console

An instrument kept by careful people: a graphite ground stepped in three lightnesses, hairline panels cut from one surface, Host Grotesk for what a person reads, Atkinson Hyperlegible Mono for what an instrument measured, amber for a person and cool blue for an instrument. The ground is neutral so both meanings sit on it at equal weight, and nothing glows. It is not a neon terminal, a glass dashboard or a science-fiction control room.

## Tokens

```css
:root {
  --color-paper: oklch(17% 0.008 250); --color-paper-2: oklch(21% 0.009 250); --color-paper-3: oklch(13.5% 0.007 250);
  --color-ink: oklch(95% 0.005 250); --color-ink-2: oklch(83% 0.008 250); --color-muted: oklch(71% 0.01 250);
  --color-rule: oklch(31% 0.01 250); --color-rule-2: oklch(42% 0.012 250);
  --color-accent: oklch(82% 0.15 80); --color-accent-ink: oklch(18% 0.04 75); --color-accent-soft: oklch(29% 0.05 80); --color-focus: oklch(82% 0.15 80);
  --color-cool: oklch(77% 0.12 245); --color-cool-soft: oklch(29% 0.05 245);
  --color-ok: oklch(76% 0.15 150); --color-ok-soft: oklch(24.5% 0.03 150); --color-bad: oklch(70% 0.17 25); --color-bad-soft: oklch(24.5% 0.035 25);
  --font-display: "Host Grotesk", ui-sans-serif, system-ui, sans-serif; --font-body: var(--font-display);
  --font-outlier: "Atkinson Hyperlegible Mono", ui-monospace, monospace;
  --radius-card: 10px; --radius-pill: 6px; --rule-hair: 1px;
  --shadow-card: none;
  --tracking-display: -0.03em; --display-weight: 500;
}
```

One dial, the colourway, stated in the stamp (`console: graphite`): `graphite`, the tokens above; `paper`, ground oklch(98% 0.006 85) under ink oklch(19% 0.010 60), amber oklch(54% 0.14 70) and cool oklch(52% 0.14 250), the paper band turning light; `amber-room`, ground oklch(15% 0.022 70) under ink oklch(95% 0.012 85), amber oklch(82% 0.15 82) and the cool turned to ice oklch(82% 0.08 200). In every colourway amber means a person and cool means an instrument.

## Type

- **Display:** Host Grotesk 500, `--tracking-display`, line-height 1.02 to 1.05, sentence case, roman; calm at size, never 700.
- **Body:** Host Grotesk 400 at 16 to 17px, line-height 1.55, in `--color-muted`; the lede in `--color-ink-2`.
- **Labels, captions, table heads, chips:** Host Grotesk 500 a step smaller, sentence case, in `--color-muted`.
- **Measured:** Atkinson Hyperlegible Mono 400 and 500 at 14 to 15px for what an instrument or the system wrote: a reading with its unit, an id, a diff, a timestamp, every figure tabular. Its slashed zero and tailed one are the point; at display size it is the theme's loudest thing. Never a label, a head or a control.

## Surfaces

- Hairline panels: a surface is a 1px `--color-rule` with `--color-paper-2` inside, radius 10px (6px on controls). Panels that sit together are one surface divided by 1px rules; `--color-rule-2` marks the selected row or the spine of a trail.
- Three steps, no lamp: the ground, a panel one step up, the deepest step for code, logs, a changed row and photographs. No shadow, glow, bloom or spotlight.
- Bands: a `--color-paper-3` or `--color-paper-2` band, never an amber field; two a page at most.
- Photographs: one or two, of the bench and never a face (gloved hands at a pipette, a rack of tubes), dark and close, black and white from the deepest step to the ink, radius 10px, a 1px rule edge, a caption beneath.
- No texture, no gradient on a surface.

## Range

- **Diffs:** a comparison set as two versions in one panel, a gutter of plus and minus in ok and bad, the changed rows on the soft tints, the reason in the person's words beside them.
- **Readings:** a single value at display size in the measured face, the struck value it replaced above it, and who, when and why beneath in amber, cool and ink; a statement made of a record.
- **Trails:** rows as an audit trail on a 1px `--color-rule-2` spine, each entry a version, a person in amber, a time in cool, a reason in ink; a timetable or changelog reads the same way.
- **Panels:** a bento or a comparison cut from one surface with 1px seams, one panel the lead, each panel holding the product at full fidelity rather than a picture of it.

## Controls

- The pair: an amber fill with `--color-accent-ink` beside a 1px `--color-rule-2` outline on `--color-paper-2`, both at 6px, Host Grotesk 500.
- A chip carries state only: the label face inside a 1px rule at 4px radius, tinted `--color-accent-soft` or `--color-cool-soft` by meaning. A version picker is a row of such chips, the chosen pair on the cool tint. Inputs sit on `--color-paper-3` inside a 1px rule at 6px; links underline in `--color-rule-2` and turn amber on hover.
- Two meanings: amber is a person (an operator, a deviation, the current step, the one primary control); cool is an instrument (a reading, a trace, a version). Ok and bad exist for diffs and status only.

## Motion

A value changes when its source does, over `--dur-short` on `--ease-out`; a chart may draw once. No reveal, parallax or hover lift.

## Voice

A lab notebook kept by a careful person: the value, its unit, the time, who signed. A number without a unit or a time is nothing.

## Do-nots

- Never swap the meanings; an amber reading or a cool deviation is the theme lying.
- Never a floating card with a shadow under it.
- Never a third signal or a photograph in colour.
- Never mono on a label, a head or a button; mono is what an instrument wrote.
- Never a page of small panels only; one value or one record a page is set large.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Host+Grotesk:wght@400;500&family=Atkinson+Hyperlegible+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-family: var(--font-display); font-weight: 500; letter-spacing: var(--tracking-display); line-height: 1.04; }
.panels { display: grid; gap: var(--rule-hair); background: var(--color-rule); border: var(--rule-hair) solid var(--color-rule); border-radius: var(--radius-card); overflow: hidden; }
.panels > * { background: var(--color-paper-2); }
.measured { font-family: var(--font-outlier); font-size: var(--text-sm); font-variant-numeric: tabular-nums slashed-zero; }
.reading { font-family: var(--font-outlier); font-size: var(--text-display); font-weight: 400; letter-spacing: -0.04em; line-height: 1; color: var(--color-ink); }
.row--minus { background: var(--color-bad-soft); } .row--plus { background: var(--color-ok-soft); }
.btn { border: var(--rule-hair) solid var(--color-rule-2); border-radius: var(--radius-pill); padding: var(--space-sm) var(--space-md); background: var(--color-paper-2); color: var(--color-ink); font-weight: 500; transition: background-color var(--dur-short) var(--ease-out); }
.btn--primary { background: var(--color-accent); border-color: var(--color-accent); color: var(--color-accent-ink); }
::selection { background: color-mix(in oklab, var(--color-accent) 25%, transparent); }
```
