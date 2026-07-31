
### H1 · Marquee
A single statement fills the fold. No subhead, no CTA in view.
*Use when:* the brand or person *is* the message.
*Don't confuse with:* H4 Stat-Led (which is a number, not a statement).

```html
<section class="hero-marquee">
  <h1 class="display-xxl">A statement.</h1>
</section>
```
```css
.hero-marquee { min-height: 80dvh; display: grid; align-content: end; padding: 0 var(--page-gutter) var(--space-2xl); }
.display-xxl { font-size: clamp(4rem, 12vw, 12rem); line-height: 0.92; }
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Display size: `xxl` (clamp 4–12rem) · `xl` (clamp 3–8rem)
- Alignment: left-bias · centred · right-bias
- Underlay: none · single rule above · single rule below

## Mobile collapse

- **Below 60rem:** unchanged (typography-only; centres / left-biases naturally)
- **Below 40rem:** display size step down (`xl` → `lg`); reduce side padding
