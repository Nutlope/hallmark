### HP4 · Decorative-numeral

A huge edition number / year / chapter glyph set in display-italic in a hero corner. The numeral *means something* — issue 22, year 2026, chapter 03, version 0.8. Reads as editorial · newsprint · almanac.

*Use when:* the page genuinely has an edition / issue / chapter / version semantic — magazines, journals, archived work, dated essays.
*Avoid when:* the numeral has no semantic anchor. A random "42" in the corner reads as decoration, which is slop (see slop-test gate 45).

```html
<header class="hero hero--num">
  <p class="hero__eyebrow">Studio · Spring 2026</p>
  <h1 class="hero__display">A working archive.</h1>
  <p class="hero__lede">Twelve years. Selected projects, in their own time.</p>
  <span class="hero__num" aria-hidden="true">22</span>
</header>
```
```css
.hero--num { position: relative; padding: var(--space-2xl) var(--page-gutter) var(--space-3xl); overflow: hidden; }
.hero__num { position: absolute; right: var(--page-gutter); bottom: -0.15em; font-family: var(--font-display); font-style: italic; font-weight: 600; font-size: clamp(8rem, 22vw, 18rem); line-height: 1; color: color-mix(in oklch, var(--color-ink) 8%, transparent); pointer-events: none; user-select: none; }
@media (max-width: 60rem) { .hero__num { font-size: clamp(5rem, 26vw, 9rem); right: -0.1em; } }
```

*Anti-pattern:* numerals that mean nothing. The numeral must carry information — issue, year, version, chapter, plate. If you can't name what the number *is*, drop it.
