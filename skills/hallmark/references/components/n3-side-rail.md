### N3 · Side-rail
A thin vertical strip on the left edge — wordmark rotated, plus 2–3 dot-indicators for sections. Editorial / portfolio energy.
*Use when:* the page is long and section-numbered.
*Don't confuse with:* N1 Top wordmark (which is horizontal).

```html
<nav class="nav-rail">
  <p class="wordmark vertical">Studio</p>
  <ul class="dots"><li></li><li></li><li></li></ul>
</nav>
```
```css
.nav-rail { position: fixed; left: 0; top: 0; bottom: 0; width: 3rem; padding: var(--space-md); writing-mode: vertical-rl; }
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Side: left · right
- Width: 12ch · 16ch · 20ch
- Indicator: filled bar · text-only · numbered

## Mobile collapse

- **Below 60rem:** rail unsticks and becomes a hamburger trigger above
- **Below 40rem:** hamburger becomes the only nav
