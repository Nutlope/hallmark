### E7 · Abstract Background — subtle gradient + grain

A two-colour CSS gradient at low chroma, overlaid with SVG `<feTurbulence>` grain at < 0.1 opacity. *Not* aurora; *not* purple-to-cyan mesh; *not* floating orbs. The point is *texture you can barely see* — paper-quality, not decoration.

*Use when:* the page would feel synthetic with a flat surface.
*Avoid when:* the theme already has a paper feel (Specimen, Atelier, Riso). Doubling the grain is muddy.

**Knobs:**
- Gradient direction (45° / 135° / radial)
- Grain amount (off · subtle · textured)
- Animation (none · slow drift) - parallax is banned page-wide (motion.md); scroll-linked motion lives only in scroll-choreography.md

**Example.** A small podcast site (when the host wants more visual heat than Tide's typography-only quote). Two-stop CSS gradient at 135° (warm-cream → barely-orange, both at < 0.04 chroma) over the *hero only* — never page-wide. SVG `<feTurbulence>` grain overlay at 0.06 opacity, `mix-blend-mode: multiply`. No animation. Resists every aurora-blob temptation.

```html
<section class="hero hero--bg">
  <div class="hero__bg" aria-hidden="true">
    <svg width="0" height="0" style="position: absolute;">
      <filter id="grain"><feTurbulence baseFrequency="0.9" numOctaves="2"/></filter>
    </svg>
  </div>
  <div class="hero__copy"> ... </div>
</section>
```
```css
.hero { position: relative; isolation: isolate; }
.hero__bg {
  position: absolute; inset: 0; z-index: -1;
  background:
    linear-gradient(135deg,
      color-mix(in oklch, var(--color-paper) 100%, var(--color-accent) 4%),
      color-mix(in oklch, var(--color-paper) 100%, var(--color-paper-2) 50%));
}
.hero__bg::after {
  content: ""; position: absolute; inset: 0;
  filter: url(#grain);
  opacity: 0.06;
  mix-blend-mode: multiply;
  pointer-events: none;
}
```
