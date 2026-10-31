---
name: Riso
slug: riso
genre: editorial
paper: light 97 90
display: grotesk-heavy Cabinet Grotesk
accent: chromatic-pink 356
posture: committed
keywords: risograph, riso, print studio, print fair, zine, small press, poster, art book, spot colour, two colour, indie press, diy, handmade, prints, open studio
material: bright uncoated stock and no black, a medium blue drum for every word, a fluorescent pink drum for the fills, purple where they cross, Cabinet Grotesk 800 over Literata, grain, one word a hair out of register
photo: duotone ink paper-2 con=14
pictured: Job Sheet, Stage hero
---

# Riso

A small-press run from two drums and nothing else: bright uncoated stock, a medium blue drum that sets every word and a fluorescent pink drum for the fills, crossing in a purple nobody mixed. Cabinet Grotesk 800 heads over a Literata body, grain where the ink skips, one word a hair out of register. It reads handmade because the imperfection is in the ink, not in tape and scribbles. It is not clean vector flatness, not a neon zine, and never black.

## Tokens

```css
:root {
  --color-paper: oklch(97% 0.011 90); --color-paper-2: oklch(93.5% 0.034 356); --color-paper-3: oklch(84% 0.11 356);
  --color-ink: oklch(40% 0.165 265); --color-ink-2: oklch(45% 0.15 265); --color-muted: oklch(50% 0.115 265);
  --color-rule: oklch(85% 0.045 265);
  --color-accent: oklch(68% 0.235 356); --color-accent-ink: oklch(27% 0.13 265); --color-focus: oklch(44% 0.2 265);
  --font-display: "Cabinet Grotesk", ui-sans-serif, sans-serif; --font-body: "Literata", ui-serif, Georgia, serif;
  --radius-card: 2px; --radius-pill: 2px; --rule-hair: 1px;
  --shadow-card: none; --texture-opacity: 0.08;
  --tracking-display: -0.025em; --display-weight: 800;
}
```

## Type

- **Display:** Cabinet Grotesk 800, `--tracking-display`, sentence case, in the blue; `h1` leads 0.92, `h2` 0.98. A head is one weight and one colour. Figures that are the offer set in it, tabular.
- **The misregistered word** (stamp `waive 38iii`): one focal word in the hero head prints in both drums, a pink copy behind the blue nudged 2 to 3px down and right, so only its fringe shows (`texture.md` § 3). Once a page.
- **Body and lede:** Literata 400, opsz following size, in the blue.
- **Labels, captions, table heads, nav:** Literata 500 a step smaller, sentence case, `--color-muted` or the blue. No mono: figures take Literata's tabular numerals.

## Surfaces

- No black: every word, rule and icon prints in the blue drum, every fill in the pink; where pink overprints blue (`mix-blend-mode: multiply`) the purple shows, and nobody paints it.
- Screens of the pink drum are the papers: `--color-paper-2` (a light screen) under any text, `--color-paper-3` (half strength) under display type only, the solid pink with `--color-accent-ink`. The blue drum may print solid, with type knocked out to the stock. Two bands a page.
- Hairlines in `--color-rule`, 1.5px blue where a rule frames a figure, 2px radius, no shadow; depth is overprint.
- Photographs: the work and the room in even light, cropped close, with real tonal range. Each prints in both drums, blue shadows into a light pink screen (the `photo:` duotone), 2px radius, grain over it, captions beneath in Literata.
- Grain, declared: paper specks where the ink skips (`texture.md` § 1, light specks) on fills, bands and photographs at `--texture-opacity`, never under running text; grain and misregistration are one drum's family.

## Range

- **Figures** set as a two-ink overprint: the number in blue Cabinet 800 at display size, a solid pink shape multiplied across part of it, so the purple prints only where the drums cross. A price or a date carries a screen this way.
- **Steps** as separations: the same artwork shown as the blue layer alone, the pink layer alone, then the sheet with both, three plates on the stock in hairline frames; the process is the picture.
- **Rows and forms** on the light pink screen: a price list or an order as blue hairline rows in Literata tabular figures, a live total in the display face, the chosen row on the half screen.
- **Bands** in one drum at full strength: the solid blue with a statement knocked out to the stock and the pink primary on it, or the solid pink with deep blue type; a statement at display size is the loudest thing this material makes.

## Controls

- The pair: a pink-filled rectangle with `--color-accent-ink` type beside one outlined 1.5px in the blue, both at 2px radius in Cabinet Grotesk 800 at 15px; pressed, a control drops 1px down and right, the way a sheet lands.
- Links underline in pink, thicker on hover; inputs 48px tall at 2px radius with a 1.5px blue border on the stock, the value in Cabinet 800.
- Pink sits on the primary, link underlines and one fill a screen; the focus ring is blue.

## Motion

One reveal: the pink drum settles into its offset once on load over `--dur-long` on `--ease-out`, and never loops. Controls change colour over `--dur-short`; nothing else moves.

## Voice

Specific and hand-set: name the ink, the sheet, the drum and the price; verbs over adjectives. Imperfect on purpose.

## Do-nots

- Never black ink or a grey; the only third colour is the purple the drums make.
- Never a registered, ungrained flat gradient; that is vector, not riso.
- Never pink as type on the stock; the pink drum fills, the blue one writes.
- Never the misregistration on a second head; one word, then rest.
- Never a page of duotone photographs back to back; the drums need a page of their own between pulls.

## Build hint

```html
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Literata:opsz,wght@7..72,400;7..72,500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: var(--display-weight); } h1 { line-height: 0.92; } h2 { line-height: 0.98; }
.misreg { position: relative; display: inline-block; isolation: isolate; }
.misreg::after { content: attr(data-text); position: absolute; inset: 0; z-index: -1; white-space: nowrap; pointer-events: none; color: var(--color-accent); transform: translate(2px, 3px); }
.overprint { background: var(--color-accent); mix-blend-mode: multiply; }
a { text-decoration-color: var(--color-accent); text-decoration-thickness: 2px; } a:hover { text-decoration-thickness: 4px; }
.btn { display: inline-flex; align-items: center; min-height: 48px; padding: 0 var(--space-lg); border: 1.5px solid transparent; border-radius: var(--radius-card); font: var(--display-weight) 0.9375rem/1 var(--font-display); transition: background-color var(--dur-short) var(--ease-out), transform var(--dur-micro) var(--ease-out); }
.btn:active { transform: translate(1px, 1px); }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); }
.btn--secondary { border-color: var(--color-ink); color: var(--color-ink); }
.band--solid { background: var(--color-ink); color: var(--color-paper); }
.grained { position: relative; isolation: isolate; }
.grained::after { content: ""; position: absolute; inset: 0; z-index: 1; pointer-events: none; opacity: var(--texture-opacity); background-size: 200px 200px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 9 -4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E"); }
```
