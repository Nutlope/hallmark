### Recipe 4 · Botanical leaf flourish

A small (~40 × 80 px) hand-drawn sprig with two asymmetric leaves at +25° and -30° rotations. Leaf veins at 0.6 opacity. Sized to sit beside a headline as an inline accent. Pure SVG, no animation by default (the design is the stillness).

```html
<svg class="sprig" viewBox="0 0 40 80" aria-hidden="true">
  <path class="sprig__stem" d="M 20 76 Q 18 56 21 36 Q 22 22 20 8" />

  <g transform="translate(8 38) rotate(-25)">
    <ellipse class="sprig__leaf"  cx="0" cy="0" rx="6" ry="11" />
    <path     class="sprig__vein" d="M 0 -10 Q 1 0 0 10" />
  </g>

  <g transform="translate(28 52) rotate(30)">
    <ellipse class="sprig__leaf"  cx="0" cy="0" rx="6" ry="11" />
    <path     class="sprig__vein" d="M 0 -10 Q -1 0 0 10" />
  </g>

  <path class="sprig__stem" d="M 20 22 Q 16 19 13 22" />
</svg>
```

```css
.sprig {
  width: 32px;
  height: 64px;
  display: inline-block;
  vertical-align: -0.6em;
  margin-inline-end: 0.4em;
  color: var(--color-accent);
}

.sprig__stem  { fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; }
.sprig__leaf  { fill: none; stroke: currentColor; stroke-width: 1.4; }
.sprig__vein  { fill: none; stroke: currentColor; stroke-width: 0.9; opacity: 0.6; stroke-linecap: round; }

/* Use beside a headline */
h1.has-flourish { display: flex; align-items: baseline; gap: 0.4em; }
```

**Use when** the brief is a bakery, restaurant, café, boutique, herbalist, florist, atelier — anything where a hand-drawn signal of *care* fits the brand. **Avoid when** the brand is technical, brutalist, or quietly austere (the sprig adds warmth where the page wants restraint).

*Inspiration:* hand-drawn botanical assets in old broadsheet papers; restaurant menus from Lisbon and Tokyo; Lynn Fisher's constraint-driven simplicity (this recipe could have been *A Single Div* with cleverer clip-paths, but SVG is more legible at small scale).
