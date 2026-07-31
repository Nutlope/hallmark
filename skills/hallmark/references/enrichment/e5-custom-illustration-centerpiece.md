### E5 · Custom Illustration Centerpiece

A hand-built SVG (the default, Tier B) or a generated raster (Tier C, when characters demand it) sitting on the hero as a single illustrative element — the bakery loaf, the studio's mascot, the diagram of how the workflow flows.

*Use when:* the brand has a story or a thing-it-makes that benefits from being drawn.
*Avoid when:* the brand is "modern professional team" generic — illustrating that is the new template.

**Knobs:**
- Build method (Tier A pure-CSS / Tier B hand-SVG / Tier C generated / Tier D library)
- Animation (none · loop · scroll-linked)
- Scale (small accent · dominant)

**Example.** Maple Street Bread (bakery — see [`site/_tests/03-maple-bakery/`](../../../../site/_tests/03-maple-bakery/)). Letter-style hero copy left ("Saturday, 6:14 a.m. The dough went in at midnight."), 60-line hand-built SVG loaf right, 3 paths (body, shade, score-marks). Animated with `@property --rise` for a subtle 4 px breathing-loop over 6 s, alternating; the score-marks draw themselves on first paint via `stroke-dasharray`. Tier B, dominant scale, animation: loop. Reduced-motion fallback is a static keyframe.

For *how* to build a hand-drawn loaf in 60 lines of SVG and animate its breath with `@property`, see [`custom-craft.md`](../custom-craft.md) — there's a full bakery worked example, plus four more recipes (workflow diagram, mascot, architectural diagram, botanical accent).
