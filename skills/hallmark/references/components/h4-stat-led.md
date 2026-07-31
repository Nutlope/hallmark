### H4 · Stat-Led
A giant number or metric is the hero. A small qualifier line below.
*Use when:* you have one defensible, externally-verifiable number.
*Don't confuse with:* T4 Numbered stat strip (which is several stats in a row, not one focal).

```html
<section class="hero-stat">
  <p class="figure tnum">99.97<span class="unit">%</span></p>
  <p class="qualifier">…</p>
</section>
```
```css
.figure { font-size: clamp(6rem, 18vw, 16rem); font-variant-numeric: tabular-nums; line-height: 0.85; }
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Number style: tabular display · italic display · monospace
- Qualifier position: below · inline-right · stacked-above
- Secondary stats: none · two below · row of four

## Mobile collapse

- **Below 60rem:** number stays full width, text stacks below; secondary stats become 2-up grid
- **Below 40rem:** number size step down (`clamp` floor lifts); qualifier text wraps
