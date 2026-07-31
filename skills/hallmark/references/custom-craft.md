# Custom craft — how to hand-build hero artwork

This file is loaded only when an enrichment archetype requires construction (see [`hero-enrichment.md`](hero-enrichment.md)). It tells you *which technique* to reach for at *which complexity tier* — and what each looks like done well.

**The principle.** Custom-built artwork is the design. Library-picked artwork is a shortcut, and a good audience reads it as one. The skill's job is to make custom-build the path of least resistance — by knowing when CSS alone suffices, when SVG is right, when JS-driven animation earns its bundle cost, and when (rarely) Three.js is justified.

The 2026 canon is set by Lynn Fisher (*A Single Div*), Diana Smith (*Pure CSS Francine* / *Lace*), Rauno Freiberg, Paco Coursey, Jhey Tompkins, and Adam Argyle. The thread: constraint-driven, hand-crafted, performance-respecting, accessibility-embedded. Use the platform; don't fight it.

This file is the index. Full guidance lives in `craft/`, one file per tier, with worked recipes in `craft/recipes/`. Pick from the table, then load ONLY the file you need.

## The six tiers

| Tier | Technique | Reach for it when | Bundle cost | File |
| --- | --- | --- | --- | --- |
| A | Pure CSS art | Shapes plus colour: bars, badges, spheres, abstract marks | Zero | `craft/tier-a-css.md` |
| B | Hand-built SVG | Characters, organic curves, multi-element scenes | 4-15 KB inline | `craft/tier-b-svg.md` |
| C | Declarative animation | Motion on top of A or B; CSS-first, JS only for orchestration | 0-50 KB | `craft/tier-c-animation.md` |
| D | Three.js / WebGL | The 3D is the hero value and the user interacts with it | Up to 2 MB | `craft/tier-d-webgl.md` |
| E | Generated stills | Characters or scenes where hand-build is uneconomical | Image weight | `craft/tier-e-generated.md` |
| F | Library + Lottie | Budget and timeline force a shortcut; last resort | Varies | `craft/tier-f-lottie.md` |

**The decision rule:**

```
Single element, simple motion           → CSS keyframes / @property
Multiple elements, orchestrated entrance → Motion (React) or GSAP (vanilla / complex)
Scroll-progress-linked                   → animation-timeline (CSS) — or GSAP ScrollTrigger if complex
State change between two layouts         → View Transitions API
A list reflows in React                  → AutoAnimate
A complex hero narrative with scrubbing   → GSAP timeline + ScrollTrigger
```

### Cross-recipe techniques

What all four recipes share — the four habits of hand-built CSS/SVG illustration in 2026:

1. **`@property` for declarative interpolation.** Animating a typed custom property (`<length>`, `<number>`, `<angle>`, `<color>`) gives you GPU-composited animation with zero JS. The bakery loaf, the workflow flow line, the architectural data-flow, and the mascot's blink — all use it.
2. **Asymmetric `transform: rotate()` for hand-drawn feel.** The workflow boxes rotate at ±1°, the mascot's eyes have an 80 ms delay between them, the sprig's leaves rotate +25° / -30°. Symmetry reads as algorithmic; controlled asymmetry reads as drawn.
3. **Opacity layering for pencil/secondary detail.** The workflow's reverse arrow is `var(--color-muted)`; the architectural sub-labels are 60% opacity; the sprig veins are 0.6 opacity. The hierarchy of opacity is the hierarchy of attention.
4. **Mono labels grounding decorative work in function.** The architectural diagram's `arch__sub` text uses `var(--font-mono)` at 8 px. The workflow's "small predicate language" uses mono. Decorative work earns its place by being legible and accurate; mono signals that.

Use these recipes verbatim when they fit, or strip them for technique when the brief calls for something different. The point is that *every illustration on a Hallmark page is built, not picked.*

### Anti-patterns, one line each

Every tier file carries its full anti-pattern list. The cross-tier tells:

- **Lottie where CSS would do.** Build it in CSS or SVG; the library pull is the shortcut that costs you.
- **50 KB of GSAP for one fade-in.** `transition: opacity 400ms var(--ease-out)` is zero bytes.
- **Animating `width` or `height`.** Reflows the layout; use `transform: scale()` with `transform-origin`.
- **Three.js for a non-interactive rotation.** No interaction, no justification; animate an SVG instead.
- **Untouched Figma export.** Run SVGOMG, always.
- **Raw generated raster.** Post-process: grain, asymmetric crop, colour grade. Raw output reads as AI.
- **Linear easing.** Add ease-out at minimum; it is the difference between moving and alive.
- **No `prefers-reduced-motion` fallback.** Every animation gets one.

---

**Two taxonomies, one mapping.** The enrichment ladder in SKILL.md Step 4 names outcomes (CSS art, hand-built SVG, generated still, library asset, Lottie). The craft tiers below are lettered by construction method. Map by name: CSS art = tier-a · hand-built SVG = tier-b · declarative animation = tier-c · WebGL = tier-d · generated stills = tier-e · library / Lottie = tier-f.

## Tier index

**Pick the tier. Then read ONLY that file** from `references/craft/`. Do not load the whole catalogue.

- **Tier A · Pure CSS art** - Shapes plus colour at zero bytes: the `clip-path` / `conic-gradient` toolkit table and the single-div bakery loaf worked example. [`craft/tier-a-css.md`](craft/tier-a-css.md)
- **Tier B · Hand-built SVG illustration** - The Figma to SVGOMG pipeline, declarative SVG animation methods, and the end-to-end bakery worked example. [`craft/tier-b-svg.md`](craft/tier-b-svg.md)
- **Tier C · Declarative animation** - `@property`, scroll-driven animations, View Transitions, and when Motion or GSAP earns its bundle. [`craft/tier-c-animation.md`](craft/tier-c-animation.md)
- **Tier D · Three.js / WebGL / shaders** - When 3D is justified, the performance budget, and the mandatory non-WebGL fallback. [`craft/tier-d-webgl.md`](craft/tier-d-webgl.md)
- **Tier E · Generated stills** - The model table (Nanobanana, Recraft V4, Midjourney, Flux) and post-processing discipline. [`craft/tier-e-generated.md`](craft/tier-e-generated.md)
- **Tier F · Library illustrations + Lottie** - Last-resort rules: customise, avoid giveaway poses, and the short list of jobs Lottie is actually for. [`craft/tier-f-lottie.md`](craft/tier-f-lottie.md)

## Recipe index

Four complete copy-paste recipes at Tier A or B, each with full code, a use-when / avoid-when note, a reduced-motion fallback, and an inspiration line. Load one when the brief calls for the named subject; strip for technique otherwise.

- **Recipe 1 · Workflow / process diagram** - Three labelled boxes, curved arrows, animated `stroke-dashoffset` flow. [`craft/recipes/flow-diagram.md`](craft/recipes/flow-diagram.md)
- **Recipe 2 · Minimal-line mascot** - Face-only SVG character with a blink loop; personality without uncanny valley. [`craft/recipes/mascot.md`](craft/recipes/mascot.md)
- **Recipe 3 · Three-tier architectural diagram** - Browser to API to Database with pulsing data-flow lines. [`craft/recipes/architecture-diagram.md`](craft/recipes/architecture-diagram.md)
- **Recipe 4 · Botanical leaf flourish** - A hand-drawn sprig beside a headline; no animation, the design is the stillness. [`craft/recipes/leaf-sprig.md`](craft/recipes/leaf-sprig.md)
