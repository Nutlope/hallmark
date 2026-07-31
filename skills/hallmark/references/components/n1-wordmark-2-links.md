
### N1 · Wordmark + 2 links
Top-of-page bar: wordmark on the left, two text links on the right ("Pricing" / "Sign in"). No logo image, no menu icon.
*Use when:* the page has very few destinations.
*Don't confuse with:* N3 Side-rail (which is vertical).

```html
<nav class="nav-min">
  <a class="wordmark">Studio</a>
  <ul><li><a>Pricing</a></li><li><a>Sign in</a></li></ul>
</nav>
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Position: left/right split · centred · right-flush
- Links: text · text+icon · pill
- Sticky: yes · no

## Mobile collapse

- **Below 60rem:** unchanged
- **Below 40rem:** links wrap to second line if long; wordmark stays
