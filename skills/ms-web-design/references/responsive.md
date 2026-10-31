# Responsive

Loaded for an unusual layout. No desktop-only interactions; every page renders without fault from 320 to 1920 CSS pixels.

## What the script checks and what it cannot

sloplint covers the mechanical half at 320, 375, 414, 768, 1024, 1280, 1440 and 1920: horizontal scroll and `overflow-x: clip` (34), wrapping controls (49), image tracks and display heads (50), radio tabs (53), stacked sticky elements (56). Check by eye at each width what it cannot see: every desktop sidebar or filter column collapses into a menu or a disclosure, section heads stack to one column, and a per-theme override carries its own mobile rule.

## Breakpoints

Two, shared by the whole page, in `rem` so they follow the user's font size. The scaffold steps its tokens down at both: under 60rem (about 960px, the layout breakpoint) gutters drop to 24px and the three section gaps to 80, 96 and 120px; under 40rem (about 640px, the type breakpoint) gutters drop to 16px, the section gaps to 56, 72 and 96px, and column gaps to 16px. Write component rules against the same two widths, in one direction for the whole page. Add a third only where the content itself breaks.

- **Under 60rem:** multi-column grids go to one column, tilts and clip effects drop, sticky panes unstick, every hero posture collapses to content height (Poster may stay full-bleed).
- **Under 40rem:** display sizes step down, margin captions move inline, annotations consolidate.

## Fluid and discrete

`clamp()` for sizes that change continuously (the scale's display tokens already do); media queries for layouts that change discretely. Detect capability with `@media (hover: hover)` and `(pointer: coarse)`, never with width:

```css
@media (hover: hover) { .link:hover { text-decoration-thickness: 2px; } }
@media (pointer: coarse) { .btn { min-height: 48px; } }
```

Body-adjacent UI (meta, nav links, controls) runs larger on a phone and tightens at 60rem (`craft.md` § 9).

## Clickable text never wraps

Buttons, primary nav links and CTAs are single-line at every width from 320 to 1920 (49a); footer links, tabs and breadcrumbs too unless a real phrase cannot shorten (49b). When one wraps, in this order:

1. **Shorten the label.** *Get started free* to *Start free*; *Read the documentation* to *Read the docs*.
2. **`white-space: nowrap`** on the control, and let the row around it reflow.
3. **Collapse the row**, not the labels: under 60rem the links that no longer fit go behind a menu, while two or three short ones that fit stay in the bar.

## Units and safe areas

- `dvh` or `svh` for heights that meet mobile browser chrome, never `vh` on a hero (6a); `width: 100%`, never `100vw` (34).
- With `viewport-fit=cover`, fold the safe area into the gutter token: `--gutter: max(16px, env(safe-area-inset-left))`.

## Tables, images, languages

- **Tables** on a phone keep the column that names the row and the one that acts on it in view: restack each row as a labelled block, or pin the first column (`craft.md` § 9, F25). Ten columns on a phone is a redesign, not a squeeze.
- **Images:** `srcset` with width descriptors, `<picture>` for a different crop, `width` and `height` attributes on every image, `loading="lazy"` below the fold and never on the LCP element.
- **Languages:** logical properties (`margin-inline-start`, `padding-block`), room for 30 to 40% longer strings, no hard-coded date or number formats.

Never: device sniffing instead of feature queries, hover-only interactions, breakpoints in `px`.
