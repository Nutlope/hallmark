### C2 · Inline form-as-CTA
The CTA *is* the form — a single email input with a "Submit →" beside it. No separate landing for sign-up.
*Use when:* the action is collecting an email.
*Don't confuse with:* C1 Outlined chip (which navigates, not submits).

```html
<form class="cta-form">
  <label for="email" class="visually-hidden">Email</label>
  <input id="email" type="email" placeholder="you@example.com" />
  <button type="submit">Send →</button>
</form>
```
```css
.cta-form { display: grid; grid-template-columns: 1fr auto; border-bottom: 1px solid var(--color-ink); }
.cta-form input { background: none; border: 0; padding: 0.7rem 0; min-height: 44px; }
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Field count: 1 · 2 · 3
- Submit position: end-of-row · separate line · embedded button
- Helper: above · below · none

## Mobile collapse

- **Below 60rem:** input + button stack vertically; full-width
- **Below 40rem:** label moves above input; button is full-width below
