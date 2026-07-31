### H6 · Photographic Fold
Single full-bleed image fills the viewport. Caption sits in a corner.
*Use when:* you have real photography that earns full-bleed.
*Don't confuse with:* H2 Split (which pairs image with text in a grid).

```html
<section class="hero-photo">
  <img class="bleed" src="" alt="" />
  <p class="caption">Spring, 2026.</p>
</section>
```
```css
.hero-photo { position: relative; height: 80dvh; }
.hero-photo .bleed { width: 100%; height: 100%; object-fit: cover; }
.hero-photo .caption { position: absolute; bottom: var(--space-md); right: var(--space-md); }
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Image area: full-bleed · 16/7 · 4/3 · 1/1 square
- Caption position: lower-left · upper-right · margin
- Text below or overlaid

## Mobile collapse

- **Below 60rem:** image stays full-bleed; caption moves from absolute corner to inline below image
- **Below 40rem:** caption font-size step down; corner caption never overlaps text on phones
