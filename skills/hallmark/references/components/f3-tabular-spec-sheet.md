### F3 · Tabular spec sheet
Each row is a feature; columns hold name, value, footnote. Hairline rules between rows. Tabular numerics.
*Use when:* features compare quantitatively.
*Don't confuse with:* F1 Bento (which is non-tabular and visually rhythmic).

```html
<table class="spec-sheet tnum">
  <tr><th>Latency</th><td>p99 &lt; 50 ms</td><td class="muted">measured externally</td></tr>
  <tr>…</tr>
</table>
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Columns: 2 (key/val) · 3 (key/val/unit) · 4 (with footnote)
- Rule density: every row · groups of 3 · headers only
- Numbers: tabular · proportional

## Mobile collapse

- **Below 60rem:** columns reduce: 4-col → 2 (key + value), drop unit + footnote
- **Below 40rem:** spec list goes vertical; each row is `dt` above `dd`
