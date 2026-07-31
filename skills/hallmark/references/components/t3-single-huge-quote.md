### T3 · Single huge quote
One quote, set big, centered, taking a whole section. No supporting text, no attribution boxes — attribution is a small caps line beneath.
*Use when:* one quote is so good it earns the room.
*Don't confuse with:* T1 Margin pull-quote (which is the *side* mate, not the *room*).

```html
<section class="proof-room">
  <blockquote class="display-italic">"…"</blockquote>
  <p class="attribution"><span class="caps">— Name, Company</span></p>
</section>
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Quote face: serif italic · roman display · italic mono
- Width: full-bleed · 60ch · 40ch
- Attribution position: same line · separate band

## Mobile collapse

- **Below 60rem:** quote remains full width; attribution wraps below
- **Below 40rem:** quote size step down by 1.4×
