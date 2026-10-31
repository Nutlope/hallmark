---
name: Formwork
slug: formwork
genre: editorial
paper: mid 74 80
display: display-condensed Oswald
accent: warm 38
posture: restrained
keywords: construction, concrete, skatepark, contractor, civil, landscape, foundry, industrial, fabrication, workshop, engineering, cast, welded, builders, hardware, tools, site, heavy
material: warm grey concrete paper with a speck grain, near-black ink, Oswald capitals over Archivo, square cast edges and hard shadows, hard black-and-white photographs of poured concrete, one safety orange signal
photo: natural sat=-100 con=35 exp=8
pictured: Site Board, Poster hero
---

# Formwork

A site-office voice: warm grey concrete for paper, near-black ink, Oswald 700 capitals over Archivo, square cast edges, hard shadows and one safety orange. It feels heavy and exact because the surface is poured, every edge is straight and the photographs show the concrete itself in black and white, so the orange is the only colour on the page. It is not a black-and-yellow hazard page and not a glossy architecture portfolio.

## Tokens

```css
:root {
  --color-paper: oklch(74% 0.008 80); --color-paper-2: oklch(69% 0.009 80); --color-paper-3: oklch(64% 0.01 80);
  --color-plate: oklch(82% 0.007 80); --color-plate-ink: oklch(95% 0.006 80);
  --color-ink: oklch(18% 0.005 270); --color-ink-2: oklch(28% 0.006 80); --color-muted: oklch(31.5% 0.008 80);
  --color-rule: oklch(64% 0.01 80);
  --color-accent: oklch(66% 0.21 38); --color-accent-ink: oklch(18% 0.005 270); --color-focus: oklch(42% 0.15 38);
  --color-accent-deep: oklch(48% 0.17 38);
  --texture-opacity: 0.05;
  --font-display: "Oswald", ui-sans-serif, sans-serif; --font-body: "Archivo", ui-sans-serif, sans-serif;
  --font-outlier: "Archivo Narrow", ui-sans-serif, sans-serif;
  --radius-card: 0; --radius-pill: 0; --rule-hair: 1px; --rule-bar: 3px;
  --shadow-card: 6px 6px 0 var(--color-ink);
  --tracking-display: -0.005em; --display-weight: 700;
}
```

Three pours, stated in the stamp (`formwork: cast`). Muted sits on paper and paper-2 only; on anything darker the text is ink.

| Pour | Wall and ink | Orange |
| --- | --- | --- |
| **Cast** (default) | concrete `oklch(74% 0.008 80)` under near-black, grain multiplied across it | `oklch(66% 0.21 38)` |
| **Night pour** | `oklch(27% 0.006 270)` under `oklch(95% 0.006 80)`, grain screened | `oklch(70% 0.21 40)` |
| **Drawing** | tracing paper `oklch(95% 0.012 85)` under blue-black ink `oklch(22% 0.02 260)`, no grain | a red `oklch(58% 0.21 30)` |

## Type

- **Display:** Oswald 700, uppercase, `--tracking-display`, roman; line-height 1.0 to 1.05 (55a), 0.9 only on a line that cannot wrap. One colour per head. Condensed, a section head takes one step up (`--text-display-s` and up), and a lone figure may run to 20rem.
- **Body:** Archivo 400 and 500, 16 to 17px, line-height 1.5, in `--color-ink-2`.
- **Figures (the outlier):** Archivo Narrow 500, tabular, sentence case, for measurements and counts: a radius in millimetres, a depth, a week, a park's number.
- **Labels, captions, table heads, meta:** Archivo 500 a step smaller, sentence case, untracked. No mono on the page.

## Surfaces

- Rules: `--rule-bar` in ink across the top of a section or a table, `--rule-hair` in `--color-paper-3` between rows.
- Radius 0 on everything; concrete is cast against straight boards.
- Depth is cast, never soft: a plate is `--color-plate` with a `--rule-bar` ink border and the hard `--shadow-card` in ink, one or two a page; nothing is blurred.
- Bands: `--color-paper-2` (a darker pour) or one `--color-ink` band with `--color-paper` text; never an orange field. Two a page at most.
- Photographs: concrete close and at work in hard daylight: a bowl's transition from the deck, board-marked walls, coping and edges, the pour and the float, a skater from behind or far off. Hard black and white, the whites clean and the blacks deep (the `photo:` line), so a picture stands off the grey paper and the orange stays the only colour. Square in a 2px ink frame, no shadow; a caption beneath in the label style; type on a photograph only over an ink scrim from its edge.
- Texture, the grain: `texture.md` § 1 across the whole paper at `--texture-opacity` (0.05, so it may sit under running text), multiplied, screened on the night pour; it is what makes the paper read as cast.

## Range

- **A figure cast as a plate:** the prompt's one real count in Oswald at 14 to 20rem on a plate with the hard shadow, its unit and what it counts in Archivo beside it.
- **Steps as a pour sequence:** three or four stages across the twelve columns under a `--rule-bar`, each an Oswald numeral at `--text-display-s`, a one-word stage and one plain line, verticals in `--color-paper-3` between.
- **Comparison as two plates:** two audiences or two jobs side by side, each a plate with its rows on hairlines; orange only on the one action.
- **Statement on the ink band:** one line of Oswald capitals at display size in `--color-plate-ink` on `--color-ink`, grain screened.

## Controls

- The pair: an orange primary raised on a hard `0 3px 0` shadow in `--color-accent-deep` that presses down 3px on `:active`, beside a pressed-in secondary (`inset 0 2px 3px`, a 2px ink border). Both in Oswald 700 capitals, untracked, following the display; radio labels are labels, Archivo sentence case.
- Links are ink, underlined, orange on hover; inputs are pressed in like the secondary.
- Orange stays under 5% of a screen: the primary, one figure, the focus ring.

## Motion

Concrete does not move. A control presses in over `--dur-micro` on `--ease-out`; state lands at once. Nothing on scroll, nothing ambient.

## Voice

A foreman's plain talk: what was poured, where, for whom and when it opens. Short lines, every figure with its unit.

## Do-nots

- Never a rounded corner, a blurred shadow or a second accent; the hard shadow and the orange are the material.
- Never draw the concrete (board seams, tie holes, cracks, a hazard stripe); photograph it.
- Never a colour photograph beside the orange; pictures print in black and white.
- Never Oswald in lowercase or at a light weight; it is 700 capitals.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@700&family=Archivo:wght@400;500&family=Archivo+Narrow:wght@500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: 700; text-transform: uppercase; }
.btn { border-radius: 0; padding: var(--space-sm) var(--space-xl); font: 700 var(--text-sm)/1.6 var(--font-display); text-transform: uppercase; }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); box-shadow: 0 3px 0 var(--color-accent-deep);
  transition: translate var(--dur-micro) var(--ease-out), box-shadow var(--dur-micro) var(--ease-out); }
.btn--primary:active { translate: 0 3px; box-shadow: 0 0 0 var(--color-accent-deep); }
.btn--secondary { background: var(--color-paper-2); color: var(--color-ink); border: 2px solid var(--color-ink); box-shadow: inset 0 2px 3px color-mix(in oklab, var(--color-ink) 30%, transparent); }
.card { background: var(--color-plate); border: var(--rule-bar) solid var(--color-ink); box-shadow: var(--shadow-card); }
.photo img { outline: 2px solid var(--color-ink); outline-offset: -2px; }
.band--cast { position: relative; isolation: isolate; background: var(--color-paper-2); }
::selection { background: color-mix(in oklab, var(--color-accent) 35%, transparent); }
```
