### E1 · Demo Video — Clipped-by-viewport-edge

A display headline left, a demo video right, and the rightmost ~10–20 % of the video extending past the viewport so it's intentionally cut off. The clip *is* the design — it implies "there's more product than fits on this screen". Pioneered by Linear; refined by Vercel, Resend, Cursor.

*Use when:* the brief is a SaaS / dev tool / dashboard / platform and you have real footage of the product.
*Avoid when:* you don't have real footage. A clipped-edge video of a stock-footage city skyline reads as filler.

**Knobs:**
- Clip side (right · left · both)
- Aspect ratio (16/10 · 16/9 · 4/3)
- Frame treatment (hairline 1 px frame · browser chrome · none)

**Example.** Tracejam (SaaS observability — see [`site/_tests/05-tracejam-saas/`](../../../../site/_tests/05-tracejam-saas/)). Display headline left ("Distributed tracing that explains itself."); hand-built CSS-art trace waterfall right, tilted -0.4°, extending 12 vw past the viewport's right edge. Aspect 16/10. Hairline frame. **Not a real video** — the mockup is custom-built CSS at Tier A (rectangles on a percentage grid simulating a flame chart). Mobile (< 60 rem): drop the clip, stack vertically.

```html
<section class="hero hero--clipped">
  <div class="hero__copy">
    <h1>Plan, build, ship.</h1>
    <p>The project tracker your engineering team won't ignore.</p>
    <a class="btn" href="/signup">Try it free</a>
  </div>
  <figure class="hero__media">
    <video autoplay muted loop playsinline preload="metadata"
           poster="/hero-poster.webp" fetchpriority="high"
           aria-label="Tour of the dashboard interface">
      <source src="/hero.av1.mp4"  type='video/mp4; codecs="av01.0.05M.08"'>
      <source src="/hero.vp9.webm" type="video/webm">
      <source src="/hero.h264.mp4" type="video/mp4">
    </video>
  </figure>
</section>
```

```css
.hero--clipped {
  display: grid;
  grid-template-columns: minmax(20rem, 1fr) 1.4fr;
  gap: var(--space-2xl);
  align-items: center;
  overflow: visible;        /* let the media spill past the page edge */
}
.hero__media {
  width: calc(100% + 12vw); /* the 12 % of viewport that sits beyond the right edge */
  aspect-ratio: 16 / 10;
  border-radius: 12px;
  border: var(--rule-hair) solid var(--color-rule);
  overflow: hidden;
}
.hero__media video { width: 100%; height: 100%; object-fit: cover; }

@media (max-width: 60rem) {
  .hero--clipped { grid-template-columns: 1fr; }
  .hero__media { width: 100%; }    /* don't try to clip on mobile — reads as broken */
}

@media (prefers-reduced-motion: reduce) {
  .hero__media video { display: none; }
  .hero__media { background: url('/hero-poster.webp') center/cover; }
}
```

**Critical:** never `loading="lazy"` on the hero video — that kills LCP. Use `preload="metadata"` and `fetchpriority="high"`. Always include a `poster=""` and a `<track kind="captions">` for accessibility.
