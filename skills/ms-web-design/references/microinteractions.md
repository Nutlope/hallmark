# Microinteractions

Loaded when the page has stateful UI. `craft.md` § 5 owns the durations, the three easings and the bans; `gates.md` owns the tells (10, 11, 12, 15, 16, 17, 18, 26, 27, 62); the theme's Motion section decides how much moves. This file owns the recipes, and repeats none of them.

## Principles

- **Motion has a job or it is cut.** Every animation clarifies, guides or confirms. Ask what would be lost if it were instant; if nothing, remove it.
- **Silent success.** When the user can see the result, no toast. Toasts are for failures and for effects the page cannot show.
- **Optimism with rollback.** Update the interface at once, send the request behind it, and roll back with a way to retry when it fails.
- **Reduced motion is a state, not an afterthought.** Every recipe below names it: spatial motion collapses to a 150ms opacity crossfade, functional state still changes.
- **Keyboard first.** Every hover affordance has a focus equivalent; nothing is hover-only.
- **Three primitives at most per page** (a reveal, a hover signal, one functional loop such as a marquee or a counter count as three). A theme whose character is still runs none beyond functional state changes.

## Recipes

Durations are `--dur-micro` 120ms, `--dur-short` 220ms and `--dur-long` 420ms; enters `--ease-out`, exits `--ease-in` at 60 to 75% of the enter, toggles `--ease-in-out`. A spring appears only under a declared spring posture on a playful theme, on the primary control and one character moment (12).

**Button press.** Hover is one signal, a colour change; press is a 1px drop, released on pointer up. The focus ring never animates.

```css
.btn { transition: background-color var(--dur-short) var(--ease-out), transform var(--dur-micro) var(--ease-out); }
.btn:hover { background: var(--color-paper-3); }
.btn:active { transform: translateY(1px); }
```

**Input focus.** The outline appears at once, inset on inputs; the border may deepen one step but its width never changes (39a). The label sits above the field at rest and never moves: a floating label starts life as a placeholder, which is the tell.

**Validation.** First on blur once the field has been touched, then on every input; never on the first keystroke. The helper line swaps for the error in the same reserved line (F14): what broke, why, what to do. `aria-invalid` and `aria-describedby` on the field.

**Toast.** Failures and invisible effects only (16). One corner, newest pushes the stack one way, nothing else repositions. In over `--dur-long`, 4 to 6s dwell, out at 65%; auto-dismiss pauses on hover and focus; an error toast carries one retry action and does not leave on its own.

**Modal.** A `<dialog>` opened with `showModal()`, `inert` on the page behind it. Backdrop fades and the panel scales 0.96 to 1 over `--dur-long` `--ease-out`; it closes at about 65% with `--ease-in`. First focus goes to the first interactive element, not the close button. Reduced motion: the 150ms crossfade.

**Menu.** The Popover API (light-dismiss, Escape and stacking for free), CSS anchor positioning that flips within 16px of an edge. Opens over `--dur-short` `--ease-out`, closes at 65% with `--ease-in`; items may stagger 30ms when there are eight or fewer.

**Tooltip.** Hover delay 800 to 1000ms, focus delay 0 (17); opacity over `--dur-micro`. It stays while the pointer moves onto it and leaves on Escape (WCAG 1.4.13).

**Tab change.** The indicator moves by `transform` (translate and scale on the x axis, never `width`) over `--dur-short`; the outgoing panel fades at `--dur-micro`, the incoming one follows. A panel that changes height animates `grid-template-rows: 0fr` to `1fr`, never `height`.

**Number tick.** Real figures only (46a). On data load, count from the previous value (zero on first load) over 400 to 800ms with `--ease-out` applied to the value, formatted by `Intl.NumberFormat`. Announce only the final value (`aria-live="polite"`). Reduced motion: the final value at once.

**Copy to clipboard.** The label swaps to *Copied* for 2.5s; no toast, the label is the feedback.

```js
btn.addEventListener("click", async () => {
  await navigator.clipboard.writeText(value);
  btn.dataset.state = "copied";
  setTimeout(() => delete btn.dataset.state, 2500);
});
```

**Drag to reorder.** The handle appears on hover and on focus; the cursor is `grab`, then `grabbing`; a ghost at 50% opacity follows the pointer and a 1px accent line marks the drop target. Release snaps over `--dur-short` `--ease-out`, no spring. Arrow keys reorder a focused row; `aria-live` announces the move.

**Optimistic update.** The row changes at once and the request runs behind it. Success says nothing. Failure rolls the row back over `--dur-short` and raises a toast with *Try again*, which stays until acted on.

```js
const prev = item.done;
item.done = !prev; render();
try { await api.update(item); }
catch { item.done = prev; render(); toast({ tone: "error", message: "Could not save.", action: { label: "Try again", run: retry } }); }
```

**Search as you type.** Debounce 250ms; while waiting, a quiet signal on the field (the border one step deeper). Matches in `<mark>`. Announce the result count once the debounce settles, never per keystroke.

**Command palette.** Opens at once on ⌘K or `/`; the input keeps focus throughout. Arrow keys move a highlight that slides by `transform` over `--dur-micro`; the rows themselves never move. Enter selects, Escape closes. Rows may fade in on first open, never on filtering.

**Page-load reveal.** One orchestrated entrance, per `craft.md` § 5: staggered by DOM order, 0.4 to 0.8s in all, IntersectionObserver rather than scroll listeners, once. A still theme skips it, and that is correct.

## Motion character

Every system declares one: a catalog theme in its Motion section, a custom page in its own stylesheet. The same press is louder in a severe system than in a calm one.

| Character | Duration scale | Feels like |
| --- | --- | --- |
| **still** | none | Print. Nothing moves; a caret may blink inside a typed command, four or five beats and then solid, never on its own. |
| **severe** | 0.7 to 0.75 times | Fast and decisive; snaps into place; no spring anywhere. |
| **brisk** | 0.85 to 0.9 times | Technical and functional: an instrument panel. |
| **calm** | 1.0 to 1.3 times | Restrained to generous, `--ease-out` at its gentlest. |

Most pages have too much motion, not too little. The static answer is usually the right one.
