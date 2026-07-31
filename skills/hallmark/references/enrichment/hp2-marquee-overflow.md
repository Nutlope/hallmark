### HP2 · Marquee-overflow

The H1 is intentionally larger than the viewport — `overflow-x: clip` on the hero container; the title bleeds past the right edge. Reads as manifesto · brutal · sport — the headline is loud enough that the page can't contain it.

*Use when:* the genre is playful (Brutal, Manifesto, Sport) and the title is *short* (≤ 6 words). Long titles + overflow = noise.
*Avoid when:* the title carries legal information that must be readable in full (privacy notice, terms page).

```html
<header class="hero hero--overflow">
  <h1 class="hero__display hero__display--xxl">STOP MAKING UI THAT LOOKS LIKE EVERYONE ELSE'S UI.</h1>
  <p class="hero__lede">Hallmark. A design skill that refuses defaults.</p>
</header>
```
```css
.hero--overflow { overflow-x: clip; padding: var(--space-2xl) var(--page-gutter); }
.hero__display--xxl { font-family: var(--font-display); font-weight: 800; font-size: clamp(4rem, 14vw, 14rem); line-height: 0.92; letter-spacing: -0.04em; margin: 0; white-space: nowrap; }
@media (max-width: 60rem) { .hero__display--xxl { white-space: normal; font-size: clamp(2.5rem, 10vw, 5rem); } }
```

*Anti-pattern:* `overflow-x: hidden` on `<html>` or `<body>` at the same time as this hero — the clip breaks horizontal scroll behaviour for descendants. Use `overflow-x: clip` only, scoped to the hero container.
