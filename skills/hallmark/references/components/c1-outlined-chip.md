
### C1 · Outlined chip
A bordered, transparent button with a typographic verb ("Save changes").
*Use when:* the page has one primary action; you want it visible but quiet.
*Don't confuse with:* C2 Oversized solid (which is statement-loud).

```html
<a class="cta-outline">Open your studio →</a>
```
```css
.cta-outline { display: inline-flex; align-items: center; gap: 0.4em; padding: 0.7rem 1.2rem; border: 1px solid var(--color-ink); min-height: 44px; }
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Shape: rectangular · pill (only allowed for tactile/playful tones) · slab
- Density: spacious · compact
- Adornment: arrow · plus · none

## Mobile collapse

- **Below 60rem:** unchanged (chips wrap onto multiple lines if needed)
- **Below 40rem:** full-width single chip ; min-height 44 px hit target
