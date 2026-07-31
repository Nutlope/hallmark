### Ft2 · Inline-rule single line
A single horizontal line of credits, address, copyright. Hairline rule above. No columns.
*Use when:* the page is editorial and the footer is afterthought.
*Don't confuse with:* Ft4 Dense typographic (which packs more in).

```html
<footer class="foot-line">
  <p>© 2026 · 137 Marlow Street · MIT licensed</p>
</footer>
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Order: wordmark/links/credit · credit/wordmark/links
- Separator: middot · pipe · em-dash · vertical rule
- Density: dense · spaced

## Mobile collapse

- **Below 60rem:** links wrap to multiple lines; separator becomes a soft return
- **Below 40rem:** becomes a vertical list
