### Recipe 2 · Minimal-line mascot

A small SVG character — face only, ~120 × 120 px — that has personality without anthropomorphic uncanny-valley risk. Two ellipse eyes (with `@keyframes blink` 3s loop), a single quadratic-curve mouth, and two stem accents (hair / hat / horns / antennae). Pairs beside text.

```html
<figure class="mascot" aria-label="The Hallmark mascot — a face with two eyes and a small smile">
  <svg viewBox="0 0 120 130" class="mascot__svg">
    <circle class="mascot__head" cx="60" cy="60" r="42" />

    <ellipse class="mascot__eye mascot__eye--l" cx="46" cy="56" rx="4" ry="6" />
    <ellipse class="mascot__eye mascot__eye--r" cx="74" cy="56" rx="4" ry="6" />

    <path class="mascot__mouth" d="M 50 76 Q 60 84 70 76" />

    <path class="mascot__accent" d="M 32 22 Q 40 12 52 18" />
    <path class="mascot__accent" d="M 88 22 Q 80 12 68 18" />
  </svg>
</figure>
```

```css
.mascot { display: inline-block; width: 80px; height: 86px; margin: 0; vertical-align: -8px; }
.mascot__svg { width: 100%; height: 100%; color: var(--color-ink); }
.mascot__head { fill: color-mix(in oklch, var(--color-paper-2) 100%, var(--color-accent) 6%); stroke: var(--color-ink); stroke-width: 2; }
.mascot__eye  { fill: var(--color-ink); animation: blink 5s ease-in-out infinite; }
.mascot__eye--r { animation-delay: 80ms; }   /* one eye lags slightly — feels organic */
@keyframes blink {
  0%, 8%, 92%, 100% { ry: 6px; }
  12%, 14%          { ry: 0.8px; }
}
.mascot__mouth { fill: none; stroke: var(--color-ink); stroke-width: 1.6; stroke-linecap: round; }
.mascot__accent { fill: none; stroke: var(--color-accent); stroke-width: 1.2; opacity: 0.6; stroke-linecap: round; }

@media (hover: hover) and (pointer: fine) {
  .mascot:hover .mascot__head { fill: color-mix(in oklch, var(--color-paper-2) 100%, var(--color-accent) 12%); transition: fill 240ms cubic-bezier(0.16, 1, 0.3, 1); }
}

@media (prefers-reduced-motion: reduce) {
  .mascot__eye { animation: none; }
}
```

**Use when** a small product / studio / indie brand needs personality without the uncanny-valley risk of a generated character. **Avoid when** the mascot needs to be expressive across many states (use Rive instead — the @property route is for simple loops, not articulated emotion).

*Inspiration:* Are.na's reductive-aesthetic site mark; the Mailchimp Freddie family (single-colour confidence); Diana Smith's CSS-art portrait constraints.
