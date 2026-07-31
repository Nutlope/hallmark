# Scroll choreography - the one earned pattern

The default is still none: motion.md's IntersectionObserver reveal-once is the page norm. This file is the exception path - a scroll-linked pattern used ONCE, on structure, when the content genuinely has a sequence worth pinning or scrubbing. sloplint check F8 counts pattern families and flags a second one.

## Budget (non-negotiable)

- **One pattern per page.** Two scroll behaviours compete for the same attention.
- **Never on body text.** Targets are structural: a pinned section, ONE display element, a 2px spine, figures. Prose never moves under the reader.
- **Hero entrance rules unchanged.** The page-load orchestration in motion.md stays as is; scroll choreography never replaces it, and no element carries both.
- **Static end-state mandatory.** Base CSS shows the finished layout. The choreography lives entirely inside `@supports (animation-timeline: view())` + `@media (prefers-reduced-motion: no-preference) and (min-width: 40rem)` - reduced-motion, small screens, and non-supporting browsers get the complete page.
- **Order footgun:** the `animation` shorthand RESETS `animation-timeline` and `animation-range`. Declare them AFTER `animation`, always.
- **`linear` is correct here** - scrubbing maps scroll distance to progress 1:1; an easing curve would make the page feel detached from the thumb.
- A pattern counts as one of the page's three animation primitives (microinteractions.md).

## 1 · Pinned chapter - steps reveal while the section is pinned

The tall track owns a named view-timeline; the pinned pane's steps consume it in slices. (Elements inside a stuck pane cannot drive their own `view()` - they are not moving.)

```html
<section class="chapter">
  <div class="chapter__pin">
    <h2>How it works</h2>
    <ol class="chapter__steps"><li>…</li><li>…</li><li>…</li></ol>
  </div>
</section>
```
```css
.chapter { min-height: 280vh; }                          /* track length = pin duration */
.chapter__pin { position: sticky; top: calc(var(--banner-height, 0px) + var(--space-xl)); }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) and (min-width: 40rem) {
    .chapter { view-timeline: --chapter block; }
    .chapter__steps li { animation: chapter-step linear both; animation-timeline: --chapter; }
    .chapter__steps li:nth-child(1) { animation-range: contain 5% contain 30%; }
    .chapter__steps li:nth-child(2) { animation-range: contain 30% contain 55%; }
    .chapter__steps li:nth-child(3) { animation-range: contain 55% contain 80%; }
    @keyframes chapter-step { from { opacity: 0.2; transform: translateY(8px); } to { opacity: 1; transform: none; } }
  }
}
```

## 2 · Scrub-linked headline - ONE display element, clip wipe

For a mid-page statement head (Ft5 / T3 register), never the hero h1 (that is load-orchestration territory). One element per page, ever.

```css
.statement__head { /* base: fully drawn */ }
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) and (min-width: 40rem) {
    .statement__head {
      animation: head-wipe linear both;
      animation-timeline: view();
      animation-range: entry 20% cover 45%;
    }
    @keyframes head-wipe {
      from { clip-path: inset(0 100% 0 0); transform: translateX(-0.25em); }
      to   { clip-path: inset(0 0 0 0); transform: none; }
    }
  }
}
```

## 3 · Progress spine - scroll(root) scaling a 2px rule

Reading progress as a hairline, not a chrome bar. A functional indicator, so `linear` is canon. Hidden below 40rem (it eats the mobile gutter).

```css
.spine { position: fixed; inset-block: 0; left: max(1rem, 2vw); width: 2px; background: var(--color-rule); }
.spine::after { content: ""; position: absolute; inset: 0; background: var(--color-accent);
  transform-origin: top; transform: scaleY(0); }
@media (max-width: 40rem) { .spine { display: none; } }
@supports (animation-timeline: scroll()) {
  @media (prefers-reduced-motion: no-preference) and (min-width: 40rem) {
    .spine::after { animation: spine-grow linear both; animation-timeline: scroll(root); }
    @keyframes spine-grow { to { transform: scaleY(1); } }
  }
}
```

## 4 · Sticky diptych - alternating two-pane pin

Structure and pin mechanics come from [`components/f2-sticky-scroll-stack.md`](components/f2-sticky-scroll-stack.md) - markup, `--banner-height` offset, and mobile collapse are defined there; do not restate them. This recipe adds only the choreography: the scrolling figures fade in on their own `view()` (they move, so self-timelines work), and consecutive diptychs alternate the pinned side.

```css
/* f2 base: .sticky-stack grid + .pane-sticky pin, per the component file */
.sticky-stack:nth-of-type(even) .pane-sticky { order: 2; }   /* alternate the pin side */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) and (min-width: 40rem) {
    .pane-scroll figure { animation: fig-in linear both; animation-timeline: view();
      animation-range: entry 0% entry 60%; }
    @keyframes fig-in { from { opacity: 0.3; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  }
}
```

## JS fallback (optional, shared)

When JS is present and `animation-timeline` is not, the one sanctioned fallback is motion.md's reveal-once - never a scroll listener, never a scrub polyfill:

```html
<script>
  if (!CSS.supports('animation-timeline: view()')) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-seen'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -20%' });
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el));
  }
</script>
```

Pair with a 420ms `--ease-out` transition to the end state. Without JS and without support, the base static layout is already the finished page - that is the contract.
