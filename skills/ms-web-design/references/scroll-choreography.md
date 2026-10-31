# Scroll choreography: the one earned pattern

The default is still none: the reveal-once in `craft.md` § 5 is the page norm. This file is the exception: a scroll-linked pattern used once, on structure, when the content has a sequence worth pinning or scrubbing. sloplint's F8 counts pattern families and flags a second one.

## Budget

- **One pattern per page.** Two scroll behaviours compete for the same attention.
- **Never on body text.** Targets are structural: a pinned section, one display element, a 2px spine, figures. Prose never moves under the reader.
- **Hero entrance rules unchanged.** The page-load orchestration in `craft.md` § 5 stays as is; scroll choreography never replaces it, and no element carries both.
- **Static end-state mandatory.** Base CSS shows the finished layout. The choreography lives entirely inside `@supports (animation-timeline: view())` and `@media (prefers-reduced-motion: no-preference) and (min-width: 40rem)`; reduced motion, small screens and browsers without support get the complete page.
- **Order matters:** the `animation` shorthand resets `animation-timeline` and `animation-range`, so declare them after it.
- **`linear` is correct here:** scrubbing maps scroll distance to progress one to one; an easing curve detaches the page from the thumb.
- A pattern counts as one of the page's three motion primitives (`microinteractions.md`).

## 1 · Pinned chapter: steps reveal while the section is pinned

The tall track owns a named view-timeline; the pinned pane's steps consume it in slices. (Elements inside a stuck pane cannot drive their own `view()`: they are not moving.)

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

## 2 · Scrub-linked headline: one display element, clip wipe

For a mid-page Statement head (`layout.md` § 5), never the hero `h1`, whose entrance is the load reveal. One element a page.

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

## 3 · Progress spine: `scroll(root)` scaling a 2px rule

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

## 4 · Sticky diptych: a two-pane pin

The structure is a Split (`layout.md` § 5) with one side pinned: `.sticky-stack { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: var(--gap-columns); }`, `.pane-sticky { position: sticky; top: calc(var(--banner-height, 0px) + var(--space-xl)); align-self: start; z-index: var(--z-sticky); }` (it docks below a sticky nav, 56), `.pane-scroll { display: grid; gap: var(--space-2xl); }`, each figure at 16:10 and 440px tall or more; under 60rem one column and `position: static`. The choreography adds only this: the scrolling figures fade in on their own `view()` (they move, so self-timelines work); the pinned side holds from one diptych to the next.

```css
/* base: .sticky-stack grid + .pane-sticky pin, above; the pinned side holds down the page */
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) and (min-width: 40rem) {
    .pane-scroll figure { animation: fig-in linear both; animation-timeline: view();
      animation-range: entry 0% entry 60%; }
    @keyframes fig-in { from { opacity: 0.3; transform: translateY(12px); } to { opacity: 1; transform: none; } }
  }
}
```

## JS fallback (optional, shared)

When JS is present and `animation-timeline` is not, the one fallback is the reveal-once in `craft.md` § 5, never a scroll listener or a scrub polyfill:

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

Pair it with a `--dur-long` `--ease-out` transition to the end state, and hide `[data-reveal]` only under the `.js` class the script adds (62). Without script and without support, the static layout is already the finished page.
