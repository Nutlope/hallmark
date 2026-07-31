### F4 · Step sequence
Numbered stages (`1.0 → 2.0 → 3.0`) flow vertically. Each stage has a heading, a paragraph, sometimes a small visual.
*Use when:* the product is a workflow, not a single moment.
*Don't confuse with:* F2 Sticky-scroll (which doesn't number stages).

```html
<ol class="steps">
  <li><span class="stage">1.0</span><h3>Intake.</h3><p>…</p></li>
  <li><span class="stage">2.0</span><h3>Plan.</h3><p>…</p></li>
</ol>
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Numbering: I/II/III · 01/02/03 · 1.0/2.0/3.0
- Layout: vertical stack · horizontal flow · diagonal
- Connector: line · arrow · none

## Mobile collapse

- **Below 60rem:** numbering moves from left margin to inline-with-step
- **Below 40rem:** step containers tighten; connector lines drop
