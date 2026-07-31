
### Ft1 · Mast-headed
A wordmark and tagline anchor a single horizontal band. Two or three small links beside, address or licence below.
*Use when:* the page has heavy content; the footer should be quiet and singular.
*Don't confuse with:* Ft2 Inline-rule (which is even more reduced).

```html
<footer class="foot-mast">
  <p class="wordmark">Studio Name</p>
  <p class="tagline muted">Designs that don't look generated.</p>
  <p class="links muted">Imprint · Privacy · Contact</p>
</footer>
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Wordmark size: display 3xl · display 2xl · xl
- Tagline: italic serif · roman body · none
- Links row: inline · 2-line stack

## Mobile collapse

- **Below 60rem:** links wrap to two lines; tagline below wordmark
- **Below 40rem:** wordmark size step down; tagline italicises in if not already
