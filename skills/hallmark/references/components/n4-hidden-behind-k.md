### N4 · Hidden behind ⌘K
No visible nav. The user opens a command palette via `⌘K` to get anywhere. Designed for keyboard-first audiences.
*Use when:* the page is for technical users who expect this affordance.
*Don't confuse with:* N2 Floating chip (which is visible always).

```html
<button class="kbd-hint">⌘ K</button>
<dialog class="palette">…</dialog>
```

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Trigger: button · keyboard only · both
- Surface: modal · sheet · spotlight
- Recents: shown · hidden

## Mobile collapse

- **Below 60rem:** hamburger appears for users who don't know ⌘K
- **Below 40rem:** unchanged (⌘K equivalent is on-screen tap)
