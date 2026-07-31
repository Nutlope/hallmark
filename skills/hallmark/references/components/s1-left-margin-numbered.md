### S1 · Stacked numbered
The section number sits directly ABOVE the heading, same column, vertical stack; the ordinal energy comes from type contrast (mono number vs display heading), not from a side column. Gate 54 bans the old tag-left / heading-right two-column head outright; this is the compliant form of the numbered editorial section.
*Use when:* the page is editorial / specimen AND the content is genuinely ordinal (chapters, steps, issues). Numbering is default-OFF elsewhere; cap 1-2 per page.
*Don't confuse with:* S5 Bottom-anchored (which puts the label *under* the section).

```html
<header class="head-numbered">
  <p class="num-label">01 — Foundations</p>
  <h2>…</h2>
</header>
```
```css
.head-numbered { display: flex; flex-direction: column; gap: var(--space-2xs); }
.head-numbered .num-label { font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-muted); letter-spacing: 0.06em; }
```

*Mobile:* already single-column; nothing collapses.

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Number style: `01 —` label · bare `01` · `No. 4`
- Density: cap 1-2 per page
- Label ink: muted · accent-tick

## Mobile collapse

- **Below 60rem:** unchanged (already a single-column stack)
- **Below 40rem:** unchanged
