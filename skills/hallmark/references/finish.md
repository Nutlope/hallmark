# Finish - the last 2% that separates set from generated

Loaded on every build, with the universal set. These are the micro-decisions a good design engineer makes without thinking and a model skips without noticing. Most are mechanically checked by sloplint's F-tier (F1-F9); an F finding is polish feedback, never counted in the 58 gates.

## Type finish

- **Heading measure rides ON the element** (never the wrapper), in `ch`, by size. Body keeps its 45-75ch envelope; headings tighten as they grow:

  | Size | max-width |
  | --- | --- |
  | `--text-display` | ~20ch |
  | `--text-display-s` | ~24ch |
  | `--text-4xl` | ~30ch |
  | `--text-3xl` | ~35ch |
  | `--text-2xl` | ~40ch |
  | `--text-xl` | ~45ch |

- **`text-wrap: balance` on headings, `text-wrap: pretty` on ledes and body.** A ragged two-word orphan under a display head is a tell. (F3)
- **Punctuation is typeset**: curly quotes and apostrophes, a true `…` never `...`, a non-breaking space inside unit and key pairs (`10 MB`, `⌘ K`, `v1.2`), and `font-variant-numeric: tabular-nums` wherever numbers compare or column (stats, prices, tables, counters). (F1, F2, F6)
- **Hanging punctuation on pull-quotes**: the opening quote hangs into the margin so the text edge stays optically flush:

  ```css
  .quote p::before { content: "\201C"; position: absolute; transform: translateX(-100%); }
  .quote p { position: relative; }
  ```

## Control finish

- **One filled primary per page.** Exactly one button style carries the fill (accent or ink); secondaries are outlined or typographic and never higher-contrast than the primary; a repeated filled primary dilutes the ask. (F4)
- **Button height budget**: marketing CTAs 44-52px visual height. App-UI and component scope may run 32-40px visual ONLY with the hit-target expansion recipe from interaction-and-states.md (the `::before` inset trick keeps the logical target >= 44px; the coarse-pointer 48px rule stands). Max TWO button sizes per page, at least 6px apart; input height locks to button height.
- **Icon discipline**: one consistent icon set per page, never freestyle hand-drawn SVG icons; render at the set's natural grid (a 24-viewBox icon at 24px, never scaled to 19px); never wrapped in decorative coloured circles or squares (F5); beside multi-line text, align to the FIRST line (`align-items: start`), not center.

## Surface finish

- **Concentric radii**: a rounded child inside a padded rounded parent takes `inner = outer - padding`:

  ```css
  .card { border-radius: var(--radius-card); padding: var(--space-md); }
  .card > img { border-radius: calc(var(--radius-card) - var(--space-md)); }
  ```

  Equal nested radii read as a die-cut mistake; clamp at >= 2px.
- The escalation ladder governs what earns a card at all: layout-and-space.md § Surfaces. (F7 flags one recipe stamped everywhere.)

## Responsive finish - mobile runs larger

The counterintuitive idiom models never guess: on mobile, BODY-adjacent UI renders LARGER and steps DOWN at the 60rem breakpoint. Thumbs and held-closer screens want bigger targets and bigger labels; density is a desktop luxury.

```css
.meta, .nav a, .btn { font-size: 1rem; }        /* mobile base */
.checkbox { width: 1.25rem; height: 1.25rem; }
@media (min-width: 60rem) {
  .meta, .nav a, .btn { font-size: 0.875rem; }  /* desktop tightens */
  .checkbox { width: 1rem; height: 1rem; }
}
```

Display headings are exempt (their `clamp()` already scales the other way); body copy never drops below 16px on mobile.

## Motion finish

- **Exits run 60-75% of their enter** (a 300ms enter pairs with a ~200ms exit, never the reverse).
- **Stagger bands**: 30-50ms between small rows (menu items, list rows), 60-100ms between content blocks; total stagger <= 500ms; one-shot, never re-fired on scroll.
- Enters take `--ease-out`, exits take `--ease-in` - already law in motion.md; restated here only because it is the single most-reversed pair in generated CSS.

## The bar

None of this is decoration; every rule here is the difference between a page that was set and a page that was emitted. When an F finding fires at Step 7, fix it or dismiss it with a reason; never ship it unread.
