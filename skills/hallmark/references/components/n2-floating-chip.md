### N2 · Floating chip
A small fixed chip in a corner — wordmark + a single action ("Try it"). Doesn't sit in document flow.
*Use when:* the page is fold-heavy and traditional nav would fight the content.
*Don't confuse with:* C4 Sticky bottom bar (which is full-width).

```html
<aside class="nav-chip">
  <a class="wordmark">Studio</a>
  <a class="cta-outline">Try →</a>
</aside>
```
```css
.nav-chip { position: fixed; top: var(--space-md); right: var(--space-md); display: inline-flex; gap: var(--space-md); padding: 0.5rem 0.75rem; background: var(--color-paper); border: 1px solid var(--color-rule); }
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Anchor: top · bottom · top-right · bottom-left
- Content: theme picker · search · navigation
- Backdrop: blur · solid · none

## Mobile collapse

- **Below 60rem:** chip remains floating; reduce padding
- **Below 40rem:** chip widens to support 44 px hit target; never below 280 px
