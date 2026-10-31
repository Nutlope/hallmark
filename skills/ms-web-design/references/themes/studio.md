---
name: Studio
slug: studio
genre: editorial
paper: light 97.2 215
display: roman-serif Hedvig Letters Serif
accent: warm 52
posture: restrained
keywords: design studio, creative studio, branding, brand identity, art direction, agency, portfolio, case study, selected work, editorial design, typography, creative direction, graphic design, considered, curatorial
material: cool studio-white proof paper with an ink dot grid and grain, blue-black ink, Hedvig Letters Serif heads over Geist, crop marks on every printed piece, orange construction guides, the work photographed in true colour, one cadmium-orange signal
photo: natural
pictured: Portfolio Index, Ledge hero
---

# Studio

A design studio's proof sheet, caught mid-build: cool studio-white paper with an ink dot grid and a fine grain, blue-black ink, Hedvig Letters Serif for the heads (a contemporary serif with a calligraphic hand in its joins), a clean Geist body, crop marks at the corners of every printed piece, and one cadmium orange that both fills the action and draws the construction: metric guides, clear-space boxes, redlines. It reads as considered because the type is shown being measured. It is not a warm cream portfolio with a terracotta accent, and not a grey minimal template.

## Tokens

```css
:root {
  --color-paper: oklch(97.2% 0.006 215); --color-paper-2: oklch(94% 0.009 215); --color-paper-3: oklch(90.5% 0.011 215); --color-paper-hi: oklch(99% 0.004 215);
  --color-ink: oklch(16% 0.032 250); --color-ink-2: oklch(34% 0.022 245); --color-muted: oklch(49% 0.018 240);
  --color-rule: oklch(84% 0.010 225);
  --color-accent: oklch(68% 0.172 50); --color-accent-ink: oklch(16% 0.032 250); --color-focus: oklch(52% 0.15 48);
  --color-dot: color-mix(in oklab, var(--color-ink) 20%, transparent); --color-mark: color-mix(in oklab, var(--color-ink) 72%, transparent);
  --font-display: "Hedvig Letters Serif", ui-serif, Georgia, serif; --font-body: "Geist", ui-sans-serif, system-ui, sans-serif;
  --font-outlier: "Sofia Sans Extra Condensed", "Arial Narrow", ui-sans-serif, sans-serif;
  --radius-card: 3px; --radius-pill: 3px; --rule-hair: 1px;
  --shadow-card: none;
  --shadow-sheet: 1px 2px 0 color-mix(in oklab, var(--color-ink) 7%, transparent), 10px 18px 36px -14px color-mix(in oklab, var(--color-ink) 32%, transparent);
  --tracking-display: -0.022em; --display-weight: 400;
}
```

## Type

- **Display:** Hedvig Letters Serif 400, its one weight, `--tracking-display`, line-height 0.98 to 1.04, sentence case, `font-optical-sizing: auto`. The hand holds from a 200px wordmark down to a 25px item title (tracking -0.005em there). Heads, figures and the wordmark only.
- **Body:** Geist 400 and 500, line-height 1.55, ink-2 for running text.
- **Labels, captions, guide readouts:** Geist 500 a step smaller, sentence case, `--color-muted`, tabular figures for any measurement. No mono.
- **Specimen face:** Sofia Sans Extra Condensed 500, only inside a specimen that shows an alternative system; never a head or label of the page itself.

## Surfaces

- The ground is a generated proof, never a picture: a 24px radial-gradient dot grid in `--color-dot` under an `feTurbulence` grain (`--grain`), on the hero, nav and footer, masked to fade before the next section; the rest of the page is clean paper.
- Crop marks on every printed piece (a sheet, a photograph, a card, a control, a focused field): eight 1px `--color-mark` ticks drawn with background gradients on a `::before`, set off the corners by a small gap, larger on a sheet. Registration targets may sit at a sheet's sides.
- Orange draws construction: 1px `--color-accent` guides at the font's real ascender, cap height, x-height, baseline and descender with their readouts in the label voice, a clear-space box in x units, redlines with dimensions. Rules only, never orange type.
- Two rules: 1px `--color-rule` between rows; 1px `--color-ink` opening a set. Radius 3px.
- One shadow, for paper objects only (a card, a sheet), lit from the top left: `--shadow-sheet`. Everything else lies flat.
- Bands: paper-2, or one ink band with paper type; never an orange field.
- Photographs: the work where it is used, level, daylight, verticals straight, true colour, crop-marked, a ratio redline beside it; never a mockup.

## Range

- **A wordmark under construction:** the name set huge in Hedvig with its metric guides, clear-space box and readouts on the dot grid; the pointer measures a letter's advance in font units.
- **Systems as specimen cards:** two or three alternatives as crop-marked cards (face line, `Aa Gg Rr 0123456789`, hex swatches) that switch one board set by type, colour or grid.
- **An index that opens:** rows under an ink rule, Hedvig at item size, each opening into a case with its photograph held at a stated ratio.
- **A size test:** one line at falling sizes (banner, poster, ticket), each on its own orange guides with its live size beside it.

## Controls

- Printed controls: a 1px ink border at 2px radius, a second rule inset 2px inside it, crop marks at the corners that open slightly on hover; the primary is filled orange with ink text. Geist 500, 48px.
- Fields: 3px, a 1px `--color-muted` border, crop marks appear on focus. Links take an orange underline on hover.
- Orange fill stays on the one action; orange lines are construction and may be many but thin.

## Motion

Guides draw in once along their length. A set of systems may turn every few seconds while in view and stops on any choice. State changes at `--dur-short` on `--ease-out`. Reduced motion: the full construction, still.

## Voice

Spare and exact, a little literary. Verbs over adjectives; name the work, the institution, the surface it lives on, the measurement. Never "creative solutions" or "brands brought to life".

## Do-nots

- Never Hedvig in running text, never the specimen face outside a specimen.
- Never an orange flood, orange type or a second warm colour.
- Never warm paper; the ground is cool, hue 215.
- Never a guide that is not true to the font's metrics or a dimension that is not the real one.
- Never the dot grid behind a whole page or running text.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Geist:wght@400;500&family=Sofia+Sans+Extra+Condensed:wght@500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-family: var(--font-display); font-weight: var(--display-weight); letter-spacing: var(--tracking-display); color: var(--color-ink); font-optical-sizing: auto; line-height: 1.0; }
.proof { background-image: var(--grain), radial-gradient(circle at 1px 1px, var(--color-dot) 1px, transparent 1.4px); background-size: 160px 160px, 24px 24px; }
.crop { position: relative; --l: 8px; --o: 12px; }
.crop::before { content: ""; position: absolute; inset: calc(-1 * var(--o)); pointer-events: none; background: linear-gradient(var(--color-mark), var(--color-mark)) 0 var(--o) / var(--l) 1px no-repeat, linear-gradient(var(--color-mark), var(--color-mark)) var(--o) 0 / 1px var(--l) no-repeat; }
.btn { border: var(--rule-hair) solid var(--color-ink); border-radius: 2px; min-height: 48px; padding: 0 var(--space-lg); font-weight: 500; color: var(--color-ink); }
.btn::after { content: ""; position: absolute; inset: 2px; border: var(--rule-hair) solid var(--color-mark); }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); }
.guide { height: var(--rule-hair); background: var(--color-accent); }
.set { border-top: var(--rule-hair) solid var(--color-ink); } .set > * { border-bottom: var(--rule-hair) solid var(--color-rule); }
```
