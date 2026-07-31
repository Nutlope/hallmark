## Tier B · Hand-built SVG illustration

**When.** Complex illustrations CSS can't express cleanly — characters, articulated figures, organic curves, multi-element scenes. The bakery's full storefront, the studio mascot, the workflow diagram with seven labelled paths.

**Effort:** medium (designing in Figma + cleaning the export).
**Payoff:** very high (scales infinitely, compresses to < 10 KB, animatable).
**Bundle cost:** the file size of the SVG — typically 4–15 KB inline.

### Pipeline

1. **Design in Figma.** Use a component system (constraints, variants). Keep paths as paths — don't rasterise. Name layers; the export honours them.
2. **Export as SVG.** Figma's export is decent. Set "Outline strokes" only if you need stroke-as-fill animation; otherwise keep them strokes.
3. **Run through [SVGOMG](https://jakearchibald.github.io/svgomg/)** — removes Figma metadata, unnecessary `<defs>`, redundant transforms. 30–60 % size reduction is typical.
4. **Inline the result in HTML** for animation, or save as `static.svg` and reference via `<img>` or CSS `background-image` for caching.
5. **Animate declaratively** — CSS keyframes on `<path d="">` (Chrome, Edge, Safari support the `d` property), `@property`-driven attribute interpolation, or [Motion](https://motion.dev) for orchestrated sequences.

### A hand-built SVG with declarative animation

```html
<svg viewBox="0 0 200 100" class="loaf-svg" aria-label="A loaf of bread">
  <path class="loaf-body" d="M 20 70 Q 100 10 180 70 L 180 90 L 20 90 Z" />
  <path class="loaf-score" d="M 60 50 L 90 30 M 100 45 L 130 25 M 140 50 L 165 35" />
</svg>
```

```css
@property --bake {
  syntax: "<percentage>";
  initial-value: 0%;
  inherits: false;
}

.loaf-body {
  fill: oklch(72% 0.14 50);
  filter: drop-shadow(0 4px 8px oklch(20% 0.02 60 / 0.16));
  transform-origin: 100px 90px;
  animation: bake 6s ease-in-out infinite alternate;
}

.loaf-score {
  stroke: oklch(38% 0.1 35);
  stroke-width: 2;
  stroke-linecap: round;
  fill: none;
  stroke-dasharray: 0 200;
  animation: score 1.6s 0.8s var(--ease-out) forwards;
}

@keyframes bake  { to { transform: scaleY(calc(1 + var(--bake) * 0.005)); --bake: 1%; } }
@keyframes score { to { stroke-dasharray: 200 200; } }

@media (prefers-reduced-motion: reduce) {
  .loaf-body, .loaf-score { animation: none; }
  .loaf-score { stroke-dasharray: 200 200; }
}
```

The breath comes from `@property --bake` interpolating a percentage; the score-marks draw themselves once on load via `stroke-dasharray`. No JS. 18 lines of CSS. Reduced-motion-safe.

### Animation choices for SVG in 2026

| Method | When | Verdict |
| --- | --- | --- |
| **CSS keyframes on `<path d>`** | Path-morphing where shapes have matching anchor counts | Use this. Composable with the rest of CSS, GPU-friendly. |
| **`@property` + animated CSS variables** | Smoothly interpolated colour, length, angle, percentage | Use this. Declarative, predictable. |
| **CSS keyframes on `transform` / `opacity`** | Position, rotation, fade | Always. Hardware-accelerated, no layout thrash. |
| **`stroke-dasharray` draw-on** | Hand-drawn line illustrations that build themselves | Yes. Cheap and effective. |
| **SMIL `<animate>`** | Legacy SVG-only attribute animation | Acceptable in 2026 but deprioritised — CSS is composable, SMIL isn't. Use only if CSS can't express it. |
| **JS via Motion / GSAP** | Multi-element orchestrated entrances, scroll-scrubbing, complex timelines | Use when CSS isn't enough — see Tier C below. |

### Anti-patterns of hand-built SVG

- **Shipping the raw Figma export.** Always run SVGOMG. Untouched exports carry hundreds of bytes of metadata, unused `<defs>`, doubled transforms.
- **A 300-KB SVG.** Anything over 30 KB is suspicious. Most well-built illustrations sit at 4–15 KB. If yours is 100 KB+, you have hidden raster embeds or thousands of unnecessary path commands.
- **`viewBox` cruft.** A `viewBox="0 0 24 24"` for an icon, or `viewBox="0 0 1920 1080"` for a hero illustration. Match the box to the design's bounds, no padding, no extra space.
- **Animation with linear easing on everything.** Add ease-out (or a cubic-bezier specified to two decimals); the difference is the difference between "moving" and "alive".
- **Path morphing between shapes with mismatched anchor counts.** Browsers will interpolate, but the result jitters. Either match anchor counts, or use `clip-path` instead.

---

## The bakery worked example, end-to-end

**Brief:** "Build a landing page for a small bakery in Lisbon."

**Step 2 (macrostructure):** Long Document — the bakery is a story-led brand, not a SaaS product.
**Step 3 (theme):** Atelier — warm-paper, prose-led, intimate.
**Step 4 (enrichment):** E5 Custom Illustration Centerpiece. Tier B (hand-built SVG).

**The output:**

A 60-line SVG of a single loaf, three paths (crust + crumb + scoring marks), positioned to the right of the headline at 40 % column width. Animation: `@property --rise` interpolates a 4 px vertical lift over 6 s, ease-in-out, alternate. The score-marks draw themselves on first paint via `stroke-dasharray`. Reduced-motion: static loaf, no animation.

```css
/* Hallmark · macrostructure: Long Document
 * H5 hero: Letter (intimate salutation + 2-paragraph body)
 * enrichment: E5 Custom Illustration · craft: tier-B SVG (60 lines)
 * animation: @property --rise (6s, alternate) + stroke-dasharray draw-on
 * theme: Atelier · accent: warm-amber ~3% · studied: no
 */
```

The next bakery brief Hallmark touches gets a *different* loaf — different curvature, different rise distance, different score pattern, possibly a different illustration entirely (a sourdough boule vs. a baguette vs. a flatbread). The variation knobs in [`hero-enrichment.md`](../hero-enrichment.md) make sure of it.
