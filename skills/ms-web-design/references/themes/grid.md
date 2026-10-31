---
name: Grid
slug: grid
genre: editorial
paper: light 97.5 90
display: grotesk-sans Radio Canada Big
accent: cool 266
posture: full-palette
keywords: identity, brand system, wayfinding, signage, design studio, type specimen, editorial grid, institution, museum, archive, index, directory, systems, modular, swiss, grotesque, manual, programme, poster, collection
material: white poster stock, blue-black ink, Radio Canada Big 700 in sentence case over Radio Canada, flat fields of ultramarine and one Swiss red mark, no strokes
pictured: Poster Sequence, Poster hero
photo: duotone ink paper-2 con=12
---

# Grid

Swiss international style as it is practised now: a white sheet, a blue-black ink, one neo-grotesque in two optical cuts, and two flat colours with separate jobs, an ultramarine that floods fields and a Swiss red that marks the one chosen thing. Structure comes from the column system itself: type hung from column lines, fields that start and stop on them, jumps of three or four steps in scale and white held on purpose. No strokes part the sections and nothing is boxed; a page reads as a run of composed sheets. It is not a nostalgic poster pastiche, not a red-and-black template and not a minimal product page.

## Tokens

```css
:root {
  --color-paper: oklch(97.5% 0.005 90); --color-paper-2: oklch(94.2% 0.006 90); --color-paper-3: oklch(90.5% 0.008 90);
  --color-ink: oklch(19% 0.022 266); --color-ink-2: oklch(31% 0.02 266); --color-muted: oklch(47% 0.016 266);
  --color-rule: oklch(87.5% 0.008 90);
  --color-accent: oklch(44% 0.2 266); --color-accent-ink: oklch(97.5% 0.005 90); --color-focus: oklch(46% 0.2 266);
  --color-field: oklch(44% 0.2 266); --color-field-ink: oklch(97.5% 0.005 90);
  --color-mark: oklch(57% 0.215 29); --color-mark-ink: oklch(97.5% 0.005 90);
  --font-display: "Radio Canada Big", ui-sans-serif, system-ui, sans-serif; --font-body: "Radio Canada", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: var(--font-display);
  --radius-card: 0; --radius-pill: 0; --rule-hair: 1px; --shadow-card: none;
  --tracking-display: -0.035em; --display-weight: 700;
}
```

Three roles and the paper, one job each. **Field**, the ultramarine: the flood a sheet is printed on, full width or from a column line to the bleed. **Mark**, the Swiss red: what is chosen or current (a letter, a year, a hovered link) and at most one red field a page. **Ink**: type on paper and the primary control. Red never sits on the ultramarine, and two fields never touch.

## Type

- **Display:** Radio Canada Big 700, sentence case (a capital first letter and proper nouns, nothing else), `--tracking-display`, line-height 0.9 at poster size, 1.0 at section size. Lines start on a column line, flush left, ragged right; never centred. One weight and one colour a head; a head that crosses from paper onto a field switches to field-ink at the field's edge, as an overprint would, the only change it may carry.
- **Poster scale:** a poster head sizes with the screen, `clamp(4.5rem, 10.2vw, 10rem)`, tracking -0.045em, held at 1920. Figures and index letters take the display cut and may run larger than any head beside them; a statement takes the display at 400.
- **Body:** Radio Canada 400 at 17px, line-height 1.5. Labels, field names, captions and nav links are Radio Canada 500 a step smaller, sentence case, untracked, `--color-muted` on paper and field-ink on a field. No mono, no capitals in a label.
- **Wordmark:** the name in two lines at one size, the first word in the display at 700, the second at 400, leading 0.92; it may hang beside a square of the mark red exactly two lines tall.

## Surfaces

- No strokes: sections part by space, a change of paper or a field, never a rule. The only lines are 1px hairlines between table rows and under an input.
- Radius 0 and no shadow anywhere; depth is scale and colour. A well is `--color-paper-2` with no border.
- Fields: a page takes two or three, one of them may be the red; each runs edge to edge or from a column line off the page, and abuts white.
- Photographs: objective and frontal in even light, of print and its tools (type, presses, sheets, drawers), printing in the blue-black on `--color-paper-2` (the `photo:` duotone), so the frame is a step of tone, never a line. Square, both edges on column lines; never type over a picture.
- Texture: none. The white is the material.

## Range

- **The overprint sheet:** a head at poster scale hung from column 1 and running across a field that starts on a later column line, its letters turning field-ink where they cross, one real figure set large at the field's foot.
- **The index as a specimen:** letters, decades or names at display size as a ragged line of buttons, the chosen one in the mark red and repeated at full height beside the line as the figure.
- **A field that holds a control:** a range, a choice or a set of inputs on the ultramarine or the red, the value set at poster scale in field-ink and changing as it moves; inputs on a field are type at `--text-3xl` over a hairline.
- **A statement hung asymmetric:** one sentence at statement size from column 3 or 4, the columns to its left white, its key nouns as links.

## Controls

- Primary: a square block of ink with paper text, 52px tall, the same on paper and on either field. Secondary: text with a 1px underline that turns mark red on hover.
- Inputs: square, no box; a 1px line beneath in `--color-muted` on paper, field-ink at 60% on a field. The focus ring is 2px `--color-focus`, field-ink on the ultramarine and ink on the red.
- `::selection` is the mark red with paper text. Otherwise red marks only a chosen value, a hover and its one field.

## Motion

State only, `--dur-short` on `--ease-out`: a letter or link turns red, a value at poster scale swaps in place. No scroll reveals, no parallax.

## Voice

Exact and plain, sentence case: name the record, the field, the year and the press in the order a catalogue lists them, and leave the adjectives out.

## Do-nots

- Never a rule above a section, a black stroke round a control or a boxed card.
- Never red on the ultramarine, never two fields touching, never a second blue.
- Never a lowercase or an all-capitals head.
- Never a photograph in colour, toned in a field colour, framed, or under type.
- Never a centred head or a centred block of text.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Radio+Canada+Big:wght@400;700&family=Radio+Canada:wght@400;500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: var(--display-weight); line-height: 1; text-align: start; }
.btn { min-height: 52px; padding-inline: var(--space-lg); border: 0; border-radius: 0; font-weight: 500; transition: background-color var(--dur-short) var(--ease-out); }
.btn--primary { background: var(--color-ink); color: var(--color-paper); }
.btn--primary:hover { background: var(--color-ink-2); }
.btn--secondary { background: none; color: currentColor; text-decoration: underline var(--rule-hair); text-underline-offset: 0.32em; }
.btn--secondary:hover { color: var(--color-mark); }
.field { background: var(--color-field); color: var(--color-field-ink); --color-focus: var(--color-field-ink); }
.field--mark { background: var(--color-mark); color: var(--color-mark-ink); --color-focus: var(--color-ink); }
.overprint { color: var(--color-field-ink); clip-path: inset(0 0 0 calc(7 * (100% + var(--gap-columns)) / 12 - var(--gap-columns))); }
.wordmark { display: inline-grid; grid-template-columns: auto auto; column-gap: var(--space-sm); font: var(--display-weight) var(--text-md)/0.92 var(--font-display); }
.wordmark::before { content: ""; grid-row: span 2; aspect-ratio: 1; background: var(--color-mark); }
::selection { background: var(--color-mark); color: var(--color-mark-ink); }
```
