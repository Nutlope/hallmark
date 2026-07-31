### HP1 · Vertical-rail title

The wordmark or a pull-label runs *vertically* alongside the centred body. CSS: `writing-mode: vertical-rl; text-orientation: mixed;` on the rail; the body sits in normal flow beside it. Reads as studio · atelier · editorial — Japanese-print rhythm, hand-set page furniture.

*Use when:* the hero is otherwise centred or marquee-shaped and the page wants a structural anchor that isn't a rule or a numeral.
*Avoid when:* the body title is itself big and centred — vertical rail beside huge horizontal display reads as competing axes; pick one direction.

```html
<header class="hero hero--rail">
  <p class="hero__rail" aria-hidden="true">STUDIO · 2026 · WORK · LETTERS</p>
  <div class="hero__body">
    <h1 class="hero__display">A working archive.</h1>
    <p class="hero__lede">Twelve years. Selected projects, in their own time.</p>
  </div>
</header>
```
```css
.hero--rail { display: grid; grid-template-columns: auto 1fr; gap: var(--space-2xl); padding: var(--space-2xl) var(--page-gutter); align-items: end; }
.hero__rail { writing-mode: vertical-rl; text-orientation: mixed; font-family: var(--font-display); font-size: var(--text-sm); letter-spacing: 0.18em; color: var(--color-ink-2); margin: 0; }
@media (max-width: 60rem) { .hero--rail { grid-template-columns: 1fr; } .hero__rail { writing-mode: horizontal-tb; font-size: var(--text-xs); } }
```

*Anti-pattern:* vertical text *and* horizontal display title competing at the same scale. Pick one direction; the rail is supporting voice.
