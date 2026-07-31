### Ft3 · Index-style category list
Three or four short columns, each headed by a category in small caps, holding 4–6 links each.
*Use when:* the page is a hub or a documentation root.
*Don't confuse with:* Ft4 Dense typographic (which is one big block, not columns).

```html
<footer class="foot-index">
  <div><p class="caps">Product</p><ul>…</ul></div>
  <div><p class="caps">Company</p><ul>…</ul></div>
  <div><p class="caps">Resources</p><ul>…</ul></div>
</footer>
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Columns: 3 · 4 · 5
- Heading style: small caps · italic · monospace
- Bullet: hairline · none

## Mobile collapse

- **Below 60rem:** grid 4-col → 2-col
- **Below 40rem:** grid 2-col → 1-col; column heads remain
