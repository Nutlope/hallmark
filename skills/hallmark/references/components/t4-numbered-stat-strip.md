### T4 · Numbered stat strip
A horizontal strip of 3–5 stats (count + qualifier) running across one row. Tabular nums.
*Use when:* you have multiple complementary metrics that work together.
*Don't confuse with:* H4 Stat-led hero (which is one focal number, not several).

```html
<section class="stat-strip tnum">
  <div><b>2.4M</b><span>users</span></div>
  <div><b>99.97%</b><span>uptime</span></div>
  <div><b>14</b><span>regions</span></div>
</section>
```

---

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Layout: 3-up · 4-up · 5-up · 6-up
- Number weight: display · body large
- Qualifier position: under · inline · above

## Mobile collapse

- **Below 60rem:** strip 4-up → 2-up
- **Below 40rem:** strip becomes vertical; 1 stat per row
