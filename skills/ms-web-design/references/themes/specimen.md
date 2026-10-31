---
name: Specimen
slug: specimen
genre: editorial
paper: light 96.5 82
display: high-contrast-serif Bodoni Moda
accent: cool 262
posture: restrained
keywords: typography, type specimen, foundry, letterform, portfolio, editorial, magazine, essay, type studio, agency, brand story, print, publication, craft, considered, literary
material: warm oat paper, warm near-black ink, razor-hairline Bodoni Moda over Geist, square 1px rules, one ink-blue signal that also draws the metric guides
photo: duotone ink paper con=8
pictured: Specimen Book, Poster hero
---

# Specimen

A foundry's material: warm oat paper, warm near-black ink, Bodoni Moda 400 pinned at its highest optical size so the hairlines thin to a razor against the stems, a Geist body beneath it, square 1px rules and one ink-blue signal. It reads as hand-set and exact because all the contrast lives inside the letters, none in colour or depth. It is not a cream luxury page with a terracotta accent, and not a fashion masthead in bold Didone.

## Tokens

```css
:root {
  --color-paper: oklch(96.5% 0.016 82); --color-paper-2: oklch(93.5% 0.02 80); --color-paper-3: oklch(89% 0.024 78);
  --color-ink: oklch(17% 0.012 60); --color-ink-2: oklch(28% 0.014 60); --color-muted: oklch(49% 0.014 65);
  --color-rule: oklch(80% 0.018 75); --color-rule-2: oklch(66% 0.02 72);
  --color-accent: oklch(45% 0.18 262); --color-accent-ink: oklch(97% 0.012 82); --color-focus: oklch(50% 0.18 262);
  --color-guide: oklch(55% 0.16 262 / 0.5);
  --font-display: "Bodoni Moda", ui-serif, Georgia, serif; --font-body: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: "Geist Mono", ui-monospace, monospace;
  --radius-card: 0; --radius-pill: 0; --rule-hair: 1px;
  --shadow-card: none;
  --tracking-display: -0.02em; --display-weight: 400; --display-optical: 96;
}
```

`--color-guide` is the blue's second strength: a translucent hairline for a metric guide (cap height, x-height, baseline) drawn under a word, never a fill. `--color-rule-2` is the darker hairline for a control's track or a table's head.

## Type

- **Display:** Bodoni Moda 400, `--tracking-display`, line-height 1.02, sentence case, roman. `h1` and `h2` take `"opsz" 96`, where the hairline nearly vanishes against the stem and that contrast is the graphic; an `h3` lets the axis follow its size, since a razor hairline breaks at 25px. A word set as a poster may run to 20vw.
- **Body:** Geist 400 at 17px, line-height 1.55; the plain sans under the Didone is the tension. Bodoni Moda italic stays inside running text or a sample, never a head.
- **Labels, captions, table heads:** Geist 500 a step smaller, sentence case, `--color-muted`. Geist Mono only on figures that compare (a size, a weight, a code point), tabular.

## Surfaces

- 1px `--color-rule` hairlines on divisions, table rows and between cells; a 3px `double` rule heads the one table that matters, once a page.
- No depth: nothing lifts, nothing casts a shadow, nothing is rounded. A well is a paper step (`--color-paper-2`) inside a hairline.
- Bands: a `--color-paper-2` band, or one `--color-ink` band with oat type, where the Didone reads sharpest; two a page at most, never a blue one.
- Photographs: one at most, the face's world: a reading room, a book open on a desk, metal sorts in a case; it prints in ink on oat (the duotone) as a plate, square, inside a hairline, eight columns or the full container. Its caption names the setting beneath it; type never sits on it.
- No texture, no mesh, no gradient behind type: the oat is a colour, not a paper scan.

## Range

- **Statement with guides:** one word or line at poster size with `--color-guide` hairlines at its real cap height, x-height and baseline, each named in the label style.
- **Rows as a waterfall:** one line falling through sizes, each row its size in Geist Mono at left, hairlines between, every line cut to fit its row.
- **Grid as a character set:** hairline cells across twelve columns, one lead cell four wide holding a glyph at display size; the current cell fills ink.
- **Comparison and price list:** roman beside italic on the ink band, one passage each at reading size; the licence as a ruled table under the double rule, the price in Didone at `--text-display-s`.

## Controls

- The pair: an ink-filled rectangle with oat text beside a 1px ink-outlined one, both square, Geist 500, 48px tall.
- A range is a 1px `--color-rule-2` track with a square ink thumb; a toggle is two square cells inside one ink hairline, the pressed one paper with a 2px ink rule beneath, so the ink fill stays the primary's. Inputs are square with the `--color-focus` ring.
- Links carry a 1px ink-blue underline at 0.18em that thickens on hover. The blue stays under 5% of a screen: a link, the focus ring, the guides, one figure.

## Motion

Nothing moves except state: an underline thickens, a cell fills, a sample takes the size and weight it was given. No reveal, no loop, nothing on arrival.

## Voice

Editorial, hand-set, lightly literary. Verbs over adjectives; name the face, the size, the number.

## Do-nots

- Never a heavy display head; bold turns the Didone into a fashion masthead. Heavier weights appear only as samples of a family.
- Never an optical size under 72 on an `h1` or `h2`; fat hairlines are this theme's most common failure.
- Never a warm accent, never cool paper: the signal is ink blue, the warmth comes from the oat.
- Never a drawn book, page or device to show text; set the text itself at its size.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400&family=Geist:wght@400;500&family=Geist+Mono:wght@400&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-family: var(--font-display); font-weight: var(--display-weight); letter-spacing: var(--tracking-display); line-height: 1.02; }
h1, h2 { font-variation-settings: "opsz" var(--display-optical); }
h3 { font-optical-sizing: auto; line-height: 1.15; }
.btn { min-height: 48px; border: var(--rule-hair) solid var(--color-ink); border-radius: var(--radius-card); padding: 0 var(--space-lg); font-weight: 500; }
.btn--primary { background: var(--color-ink); color: var(--color-paper); }
.btn--secondary { background: transparent; color: var(--color-ink); }
.guide { border-top: var(--rule-hair) solid var(--color-guide); }
.rule--double { border: 0; border-top: 3px double var(--color-rule-2); }
input[type="range"] { appearance: none; height: 1px; background: var(--color-rule-2); }
input[type="range"]::-webkit-slider-thumb { appearance: none; width: 16px; height: 16px; background: var(--color-ink); border-radius: 0; }
.photo > img { outline: var(--rule-hair) solid var(--color-rule); outline-offset: -1px; }
a { text-decoration-color: var(--color-accent); text-underline-offset: 0.18em; }
a:hover { text-decoration-thickness: 2px; }
```
