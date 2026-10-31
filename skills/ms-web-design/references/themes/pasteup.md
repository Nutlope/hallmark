---
name: Paste-up
slug: pasteup
genre: playful
paper: mid 73 70
display: display-condensed League Gothic
accent: chromatic-yellow 112
posture: committed
keywords: zine, fair, market, festival, print fair, book fair, exhibitors, punk, diy, collective, gig, poster, workshop, night market, flea, indie, community, launch, loud, photocopy, flyer
material: kraft board, a fibre wash, near-black toner, League Gothic capitals over a Newsreader galley, white copy paper on paper lifts, hard ink offsets, one sheet of fluorescent yellow
photo: mono con=45
pictured: Bento Grid, Stage hero
---

# Paste-up

A hand-made flyer: kraft board, near-black toner, League Gothic capitals at poster size over a Newsreader galley, white copy paper on real paper shadows, controls on hard ink offsets, one sheet of fluorescent yellow. Photographs come off the copier, black and white, the greys crushed. The paste-up lives in the paper, the tilt and the lift, never in props. It is not a grunge texture pack, a scrapbook of stickers and tape, or a clean modern poster.

## Tokens

```css
:root {
  --color-paper: oklch(73% 0.068 70); --color-paper-2: oklch(66% 0.072 68); --color-paper-3: oklch(97% 0.008 90);
  --color-ink: oklch(17% 0.01 60); --color-ink-2: oklch(24% 0.014 60); --color-muted: oklch(28% 0.026 62);
  --color-rule: oklch(50% 0.055 68); --color-rule-2: oklch(84% 0.012 85);
  --color-accent: oklch(93% 0.2 112); --color-accent-ink: oklch(17% 0.01 60); --color-focus: oklch(17% 0.01 60);
  --font-display: "League Gothic", Impact, sans-serif; --font-body: "Newsreader", Georgia, serif;
  --radius-card: 0; --radius-pill: 999px; --rule-hair: 1px;
  --shadow-card: 0 1px 0 oklch(18% 0.01 60 / 0.2), 0 4px 10px oklch(18% 0.01 60 / 0.12);
  --shadow-sheet: 0 14px 30px oklch(18% 0.01 60 / 0.26), 0 2px 4px oklch(18% 0.01 60 / 0.14);
  --tracking-display: 0.01em; --display-weight: 400;
}
```

The fluorescent is a paper, not an ink: it carries toner type and is never type itself. Three boards, stated in the stamp (`pasteup: kraft`): kraft, the tokens above, fibre at 0.5 multiply; black wall, ground `oklch(21% 0.012 60)`, toner `oklch(94% 0.012 90)`, muted `oklch(70% 0.015 80)`, fibre at 0.35 screen; sugar paper, ground `oklch(84% 0.035 150)`, toner `oklch(22% 0.02 160)`, muted `oklch(42% 0.03 160)`, fibre at 0.4 multiply.

## Type

- **Display:** League Gothic 400, uppercase, `--tracking-display`, never under 28px, so item titles (`h3`) set in Newsreader 500 instead. It is a poster face: a flyer head or a figure takes up to twice `--text-display` at line-height 0.92; a section head takes one step up from `--text-section` at 1.0.
- **Body:** Newsreader 400 and 500 at 18px, line-height 1.5; italic is emphasis in running text only. On a sheet, text sits on copy white; on the board it takes `--color-ink`, never `--color-muted`, under 18px.
- **Labels, captions, table heads, meta, controls:** Newsreader 500 a step smaller, sentence case, untracked. No mono.

## Surfaces

- Paper lifts, not boxes: a well is a sheet of copy paper (`--color-paper-3`) on `--shadow-card`, a raised sheet takes `--shadow-sheet`. Radius 0; hairlines in `--color-rule` part rows on the board, `--color-rule-2` on a sheet.
- Tilt is the paste: a sheet or a photograph may sit 0.5° to 2° off square, three tilted surfaces a screen at most; inputs, tables and long reading stay square.
- The fluorescent sheet fills the primary control and one sheet a screen, with toner type on it; never a band, a head or a word on the board.
- Bands: `--color-paper-2` (a deeper kraft) or the toner with board-coloured type; two a page at most.
- Photographs: zines, hands, copiers, staplers and fair tables, close and flat-lit, a crowd from behind at most; through the copier (the `photo:` line), hard black and white. Printed multiply on a copy sheet with a 10 to 16px margin and lifted, or straight onto the board so the kraft shows through the whites; never colour, never full-bleed. A caption sits on the sheet's foot.
- Texture: the fibre wash (`texture.md` § 1, a low-frequency tan tint) on a kraft band at the board's opacity and blend, never on a sheet or under running text.

## Range

- **The facts as a wall of flyers:** the prompt's date, count, price and deadline each on its own sheet in League Gothic at poster size, mixed spans and heights, overlapping by a few pixels, two or three tilted, one on the fluorescent; no photograph among them.
- **A typed sheet:** a timetable, a price list or the where-and-when as a ruled table on one copy sheet at a slight tilt, the left column in League Gothic, the rest in Newsreader.
- **The toner band:** one line in League Gothic at `--text-display` or larger, board-coloured on toner, across ten columns.
- **The form as a sheet:** fields on copy paper, square, on a hard offset, beside its head and the deadline set big on the board.

## Controls

- The control pair: a fluorescent primary with toner type on a hard `4px 4px 0` ink offset, beside a copy-paper secondary on the same offset, both Newsreader 500 at 15px.
- Links are toner with a 1px underline, thicker on hover; inputs are copy paper, square, a 1px ink border; the focus ring is toner.

## Motion

Paper physics only: a button drops 1px into its offset on hover and 4px on press over `--dur-micro`. Nothing floats, nothing reveals.

## Voice

Flyer voice: the date, the door, the price, the table number.

## Do-nots

- Never paste-up props: no tape, stickers, stamps or scrawled notes.
- Never a word set apart in a head: no cut-out word, no yellow word, no italic word.
- Never a soft shadow on a control; controls sit on a hard ink offset.
- Never a grunge overlay, a torn edge or a photograph in colour.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=League+Gothic&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap" rel="stylesheet">
```

```css
h1, h2 { font-weight: 400; text-transform: uppercase; line-height: 1; } h1 { line-height: 0.92; }
h3 { font: 500 var(--text-title)/1.2 var(--font-body); }
.btn { border: 0; border-radius: 0; padding: var(--space-sm) var(--space-md); font: 500 15px/1.2 var(--font-body); color: var(--color-ink); box-shadow: 4px 4px 0 var(--color-ink); transition: translate var(--dur-micro) var(--ease-out), box-shadow var(--dur-micro) var(--ease-out); }
.btn:hover { translate: 1px 1px; box-shadow: 3px 3px 0 var(--color-ink); }
.btn:active { translate: 4px 4px; box-shadow: none; }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); }
.btn--secondary { background: var(--color-paper-3); }
.sheet { background: var(--color-paper-3); box-shadow: var(--shadow-sheet); rotate: var(--r, 0deg); }
.sheet--fluoro { background: var(--color-accent); color: var(--color-accent-ink); }
.sheet img { mix-blend-mode: multiply; filter: grayscale(1) contrast(1.3); }
.fibre { position: relative; isolation: isolate; }
.fibre::before { content: ""; position: absolute; inset: 0; z-index: -1; opacity: 0.5; mix-blend-mode: multiply; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='p'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.02 0.03' numOctaves='3' seed='7'/%3E%3CfeColorMatrix values='0 0 0 0 0.55 0 0 0 0 0.45 0 0 0 0 0.3 0 0 0 0.28 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23p)'/%3E%3C/svg%3E"); }
::selection { background: color-mix(in oklab, var(--color-accent) 70%, transparent); color: var(--color-ink); }
```
