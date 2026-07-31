### S4 · Inline (no break)
The heading is a small caps phrase that emerges *inside* the body flow; no spatial break.
*Use when:* the page is prose-led; reading should be continuous.
*Don't confuse with:* S2 Hanging (which separates with negative space).

```html
<p>… <span class="head-inline">A small heading.</span> …</p>
```
```css
.head-inline { font-variant-caps: all-small-caps; letter-spacing: 0.06em; font-weight: 500; }
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Caps: all-small-caps · uppercase at text-xs
- Weight: 500 · 600

## Mobile collapse

- **Below 60rem:** unchanged (inline flows with the prose)
- **Below 40rem:** unchanged
