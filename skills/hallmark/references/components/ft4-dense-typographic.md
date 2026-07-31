### Ft4 · Dense typographic
One large block of text — credits, references, licence, address — in a small monospace font, fully justified or ragged-right. Editorial colophon energy.
*Use when:* the brand is editorial and a colophon-style sign-off fits.
*Don't confuse with:* Ft3 Index (which navigates).

```html
<footer class="foot-dense mono">
  <p>Hallmark v0.2.0. Built with The Future, Fraunces, IBM Plex Mono. MIT licensed. Powered by Together AI. 137 Marlow Street, 2026.</p>
</footer>
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Family: monospace · serif · sans
- Layout: single block · paragraphs · log-style
- Includes: build hash · date · attribution

## Mobile collapse

- **Below 60rem:** unchanged (mono/wraps naturally); reduce padding
- **Below 40rem:** font-size step down
