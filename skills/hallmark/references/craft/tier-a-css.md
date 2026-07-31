## Tier A · Pure CSS art

**When.** Geometric forms, gradient compositions, glyph-style decoration. Bars, dots, badges, icons, simple loaves, sliced spheres, abstract logos. Anything that's *shapes plus colour*.

**Effort:** high (mastering `clip-path` + `conic-gradient` takes practice).
**Payoff:** very high (zero bytes, browser-native, infinitely scalable).
**Bundle cost:** zero.

### The CSS-art toolkit (2026)

| Feature | Use for | Browser support |
| --- | --- | --- |
| `clip-path: polygon(…)` | Multi-sided shapes (chevrons, hexagons, custom blobs) | 96 %+ |
| `clip-path: path("M …")` | Curved hand-drawn outlines from an SVG path | 88 %+ (use feature query for fallback) |
| `conic-gradient()` | Pie segments, radial dividers, mandalas, rotating colour wheels | 96 %+ |
| `radial-gradient()` | Spheres, glow points, sun-burst centres | 100 % |
| `linear-gradient()` (multi-stop) | Composite shapes via stacked stops | 100 % |
| `mask-image: url(…)` | Layered transparency, morphing shapes, text-clip effects | 95 %+ |
| `mix-blend-mode` | Compositional depth (multiply, overlay, screen) | 95 %+ |
| `filter` (drop-shadow, blur, hue-rotate) | Soft shadows on irregular shapes (uses the alpha channel) | 100 % |
| `@property` | Smoothly-interpolated custom properties (colour, length, angle) | 88 %+ |
| `animation-timeline: scroll() / view()` | Declarative scroll-linked motion, hardware-composited | Baseline 2025 (88 %) |

### A worked example — the bakery loaf as a single div

```html
<div class="loaf" aria-label="A loaf of bread"></div>
```

```css
@property --rise {
  syntax: "<length>";
  initial-value: 0px;
  inherits: false;
}

.loaf {
  width: 12rem;
  height: 7rem;
  background:
    /* crust ridges */
    radial-gradient(ellipse at 30% 70%, transparent 1.2rem, var(--color-ink-2) 1.21rem 1.3rem, transparent 1.31rem),
    radial-gradient(ellipse at 50% 70%, transparent 1.2rem, var(--color-ink-2) 1.21rem 1.3rem, transparent 1.31rem),
    radial-gradient(ellipse at 70% 70%, transparent 1.2rem, var(--color-ink-2) 1.21rem 1.3rem, transparent 1.31rem),
    /* loaf body */
    linear-gradient(180deg, oklch(78% 0.12 60), oklch(64% 0.16 50));
  border-radius: 50% 50% 14% 14% / 70% 70% 30% 30%;
  transform: translateY(var(--rise));
  animation: rise 6s ease-in-out infinite alternate;
  box-shadow: 0 1.2rem 1.5rem -0.8rem oklch(20% 0.02 60 / 0.18);
}

@keyframes rise {
  to { --rise: -4px; }   /* the breath: 4px over 6s, the loaf is alive */
}

@media (prefers-reduced-motion: reduce) {
  .loaf { animation: none; --rise: 0px; }
}
```

That's a hand-built bakery centerpiece in about 25 lines, no asset, animated, accessible. The next bakery brief Hallmark touches gets a *different* loaf because the variation knobs change (rise distance, loaf curvature, crust-ridge spacing, colour stop).

### Anti-patterns of CSS art

- **Recalculating `clip-path` on every scroll.** Tanks framerate. Animate `transform` instead, or use `animation-timeline` (which composites off-thread).
- **Over-nested wrapper divs.** A pure-CSS illustration should fit in one to three elements. Eight nested wrappers reads as "I gave up structuring this".
- **No reduced-motion fallback.** Every animation must have a `@media (prefers-reduced-motion: reduce)` block.
- **Random gradient noise.** If the gradient looks generated rather than designed, redo it. Three stops max for any single gradient layer.
