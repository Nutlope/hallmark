# Interaction and states

Loaded for forms and stateful controls. `craft.md` § 9 and gate 39a own the input rules and § 2 owns contrast; this file owns the eight-state table, the field recipe and the overlay patterns.

## The eight states

| State | When | Treatment |
| --- | --- | --- |
| Default | At rest | Base styling |
| Hover | Pointer over, inside `@media (hover: hover)` | One signal: a colour step, a 1px lift or a border step (11) |
| Focus | Keyboard or programmatic focus | The ring, at once (15, 26a) |
| Active | During press | A 1px drop or one step darker |
| Disabled | Not interactive | Three channels together: `opacity: 0.55`, `cursor: not-allowed` and the native `disabled` attribute, or `aria-disabled="true"` where the control must stay focusable (39a) |
| Loading | Processing | Inline progress; the label stays readable and the width does not jump |
| Error | Failed | `--color-error` on the border, the message, `aria-invalid`; never colour alone |
| Success | Completed | The result itself, from the server's answer; an icon from the page's set at most; no toast (16); no success state where no request was made (70) |

An element missing one of these is not finished.

## Focus rings

The scaffold's ring is the page's: `outline: 2px solid var(--color-focus); outline-offset: 2px`, inset on inputs (a negative offset) so it never collides with a neighbouring field. 3:1 against both the element and the page. `:focus-visible`, so it shows for the keyboard; never `outline: none` without a replacement.

## Hit targets

44 x 44 CSS px for anything a finger can reach. Expand a small control without changing its look:

```css
.icon-btn { position: relative; }
.icon-btn::before { content: ""; position: absolute; inset: -12px; }
```

## Forms

- A visible label above every field; never a placeholder as the label.
- A placeholder shows a format (`01 Jan 2026`), never an instruction.
- Validate on blur once the field has been touched, then on every input.
- An error says what broke, why, and what to do, in one sentence where it can; tie it to the field with `aria-describedby` and set `aria-invalid="true"`.
- Required fields carry `aria-required` and a visible word, never colour alone.
- Disable submit only while a request is in flight, never at rest.

## The field

Every text input, textarea, select and combobox.

**The border never changes width.** State moves to `background-color`, `border-color`, `outline` or `box-shadow`, never `border-width`; a transparent outline is reserved at rest so the ring appears without a shift.

```css
.input { border: 1px solid var(--color-muted); outline: 2px solid transparent; outline-offset: -3px; }
.input:focus-visible { outline-color: var(--color-focus); }
```

| State | Treatment |
| --- | --- |
| Default | 1px `--color-muted` border (a field's edge needs 3:1, which a rule never has), paper background, placeholder in `--color-muted` |
| Hover | `--color-paper-2` background, border unchanged |
| Focus | The ring; the border may deepen to `--color-ink-2` at the same width |
| Filled | As default; the value carries the state |
| Disabled | The three channels; placeholder dims one step |
| Error | `--color-error` border, the error text in the helper line, an error icon from the page's set in the right-edge slot |
| Success | Only after a real check returned; a check icon from the page's set; clears when the user edits |
| Loading | A small spinner in the right-edge slot; the field stays editable, submit waits |

- **Height:** inputs match the height of the button beside them (44 to 52px on a marketing page, 39); vertical padding is `(height - line-height) / 2`.
- **Right-edge slot:** reserve about 24px for a clear button, an error glyph or a spinner, so nothing reflows when one appears.
- **Label** 4 to 8px above; **helper** about 4px below at the label's size, quieter, in a line that reserves `min-height: 1lh` (F14); the error replaces the helper in that line, never adds a second.
- Never transition `border-width`, `padding` or `height`; never animate the ring.

**Controls.** Textarea: `resize: vertical`, `min-height: 6rem`. Select: native, with a custom chevron on the wrapper; a fully custom select only when it keeps native keyboard and screen-reader behaviour. Checkbox and radio: native, `accent-color` for the cheap correct version, styled by state in CSS, never toggled by script. A switch is a checkbox with the same contract. Range: the thumb takes focus and a 44px hit target. File input: a styled `<label>` is the surface. Combobox: the listbox sits below without pushing content, `aria-expanded` mirrors it, arrows cycle, Enter selects, Escape closes.

## Modals and overlays

- A native `<dialog>` opened with `showModal()`: focus trap, Escape and `::backdrop` for free.
- Pin it once custom positioning is added, or it can snap to a corner: `position: fixed; inset: 0; margin: auto; height: fit-content; max-height: min(80dvh, 40rem)`. A non-dialog overlay centres with `display: grid; place-items: center` on a fixed container.
- `inert` on the page behind; close on Escape, backdrop click and a visible close control; first focus to the first interactive element.

## Popovers, menus, tooltips

The Popover API for light-dismiss, stacking and Escape; CSS anchor positioning where available, `position: fixed` with `getBoundingClientRect()` otherwise; flip near the viewport edge; never inside an `overflow: hidden` ancestor that clips it.

## Undo over confirm

Reversible actions run at once and offer Undo for 5 to 10 seconds. Irreversible ones (delete an account, drop a table) keep the confirm, and the user types the name of the thing being destroyed.

## Loading and empty

- A skeleton where the content's shape is known (lists, cards, tables); a spinner only in a button, replacing the label.
- An empty state is one line naming what is empty, one on why it matters, and one action (`craft.md` § 6). Never a bare *No results*.
- A disabled control near the user's attention says why it is disabled.
