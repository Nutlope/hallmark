
### T1 · Pull-quote with marginalia
A quote sits in the wide column; the attribution and source link float in the narrow margin column.
*Use when:* the page already has a marginalia rhythm (Tufte-leaning, editorial).
*Don't confuse with:* T3 Single huge quote (which is centered and dominates).

```html
<aside class="proof-margin">
  <blockquote class="serif-italic">"…"</blockquote>
  <p class="attribution muted">— Name<br />Role, Company</p>
</aside>
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Quote treatment: italic display · roman large · serif italic
- Attribution: signed · stamped · timestamped
- Marginalia: none · timeline · 1 footnote

## Mobile collapse

- **Below 60rem:** marginalia move below quote; divider becomes hairline
- **Below 40rem:** marginalia consolidate into a single line
