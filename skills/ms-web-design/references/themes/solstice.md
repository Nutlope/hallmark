---
name: Solstice
slug: solstice
genre: editorial
paper: light 94 80
display: high-contrast-serif Yeseva One
accent: warm 24
posture: restrained
keywords: farm, orchard, cider, perry, winery, harvest, seasonal, food, almanac, produce, vineyard, calendar, market, craft drink, label, bottle, rural, slow, sun, midsummer
material: cream paper, warm brown ink, Yeseva One over Archivo and Archivo Narrow, gold hairlines and hard paper shadows, photographs in low warm light, one vermilion signal
photo: warm high=-12
pictured: Midsummer, Stage hero
---

# Solstice

An almanac's warmth: cream paper, warm brown ink, Yeseva One heads, Archivo for the reading and Archivo Narrow for the small print, gold hairlines doing the ruling, square surfaces on hard paper shadows, photographs taken in low late light, and one vermilion signal. It reads as seasonal and rural through the ink, the gold, a fat serif and the light in its pictures, never through drawings of produce. It is not a farmhouse script page and not a terracotta-on-cream template.

## Tokens

```css
:root {
  --color-paper: oklch(94% 0.03 80); --color-paper-2: oklch(97% 0.02 85); --color-paper-3: oklch(89% 0.05 80);
  --color-ink: oklch(27% 0.05 50); --color-ink-2: oklch(36% 0.05 50); --color-muted: oklch(48% 0.06 55);
  --color-rule: oklch(84% 0.06 78);
  --color-accent: oklch(54% 0.20 24); --color-accent-ink: oklch(97% 0.02 85); --color-focus: oklch(54% 0.20 24);
  --color-gold: oklch(74% 0.14 75); --color-gold-2: oklch(84% 0.11 80); --color-slot: var(--color-gold);
  --font-display: "Yeseva One", ui-serif, Georgia, serif; --font-body: "Archivo", ui-sans-serif, sans-serif;
  --font-outlier: "Archivo Narrow", ui-sans-serif, sans-serif;
  --radius-card: 0; --radius-pill: 999px; --rule-hair: 1px; --rule-bar: 2px;
  --shadow-card: 10px 10px 0 var(--color-paper-3);
  --tracking-display: -0.005em; --display-weight: 400;
}
```

The signal is vermilion at hue 24, a red with warmth in it that sits with the gold and the brown, never clay; the gold rules and never fills. Three lights, stated in the stamp (`solstice: long-light`).

| Light | Paper and ink | Signal and gold |
| --- | --- | --- |
| `long-light` (default) | cream `oklch(94% 0.03 80)` under brown `oklch(27% 0.05 50)` | vermilion `oklch(54% 0.20 24)`, gold `oklch(74% 0.14 75)` |
| `dusk` | plum brown `oklch(27% 0.05 40)` under cream ink; raised wells stay cream | vermilion keeps `oklch(54% 0.20 24)` with cream text, gold `oklch(78% 0.14 80)` |
| `midwinter` | frost `oklch(95% 0.012 230)` under cold brown `oklch(28% 0.03 260)` | vermilion keeps its hue, gold goes pale `oklch(80% 0.06 230)` |

## Type

- **Display:** Yeseva One 400, roman, line-height 1.0, `--tracking-display`, one colour per head; big figures take it too.
- **Body:** Archivo 400 and 500, 16 to 17px, line-height 1.55, in `--color-ink-2`.
- **Small print:** Archivo Narrow 600 at 12.5 to 13.5px, sentence case, untracked, the outlier, for dates, months, captions under a photograph and axis labels. Meta and table heads: Archivo 500 a step smaller, sentence case. No mono.

## Surfaces

- Rules: `--rule-bar` ink across the top of a section, `--rule-hair` in `--color-rule` between rows, a gold hairline under a head inside a well.
- Square everywhere but the control pair: no radius on a well, a photograph or an input; the buttons and the stepper take `--radius-pill`.
- Depth: a raised well takes a `--rule-bar` ink border, a 1px gold rule inset 6px and the hard `--shadow-card`, an offset in paper-3 with no blur; never a soft shadow.
- Bands: a `--color-paper-2` band, or one warm brown ink band with cream text; two a page at most, never a vermilion field.
- Photographs: the season in low, late light: fruit on the branch, long grass, a glass or a bottle on a table outside, the orchard at evening; warm, a little hazy, shadows long. Square, a 1px ink hairline at 10%, no shadow. A caption sits under the frame in the small print, one fact (the place, the month, the bottle); type on a photograph sits on its shaded side over a brown scrim at 40 to 60%.
- No texture: the cream stays clean.

## Range

- **The product built, standing in the light:** the bottle cut out at full height with its label set in live type (the name in Yeseva, the kind in vermilion small print, a gold hairline, the run), on a sky that grades from the cream down through dusk into a dark field, a low warm glow behind it.
- **The label as a ruled list:** a paper-2 well inset with a gold hairline, its facts as rows (style, bottle, run, price, release), small-print labels left and Yeseva values right, dotted gold rules between them.
- **The year on one line:** the seasons from blossom to bottle as stops on a hairline across the brown band, the months in gold small print, the stages in cream Yeseva, the present one marked in the sun's colour.
- **An order that counts:** a pill stepper beside the one vermilion button whose label carries the running total, under a statement head at display size on a cream to dusk ground.

## Controls

- The pair: a vermilion-filled pill in Archivo Narrow 600 with `--color-accent-ink` text, beside a plain one in ink over a 2px ink underline, no box.
- Links underline in ink and turn vermilion on hover; inputs square on `--color-paper-2` with a 1px ink border.
- Restrained: vermilion sits on the primary, the focus ring and one figure, under 5% of a screen; gold never colours text.

## Motion

Quiet: a tab swaps its panel and a row lights on hover, over `--dur-short` on `--ease-out`. No reveal, no counter, no loop.

## Voice

The almanac: the hour of light, the pressing day, the orchard by name. Never a toast to the good life.

## Do-nots

- Never a second warm colour; a second orange makes a fruit stand.
- Never a neutral ink; a grey-black kills the cream.
- Never a rounded card or a soft shadow; a raised well is square, ruled and hard-shadowed.
- Never a cold or flat-lit photograph: a blue noon sky or a flash turns the cream sickly.
- Never clay or terracotta in place of vermilion; past hue 28 the theme becomes the cream, serif and clay page every generator makes.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Yeseva+One&family=Archivo:wght@400;500&family=Archivo+Narrow:wght@600&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: 400; line-height: 1; }
.small, figcaption { font: 600 12.5px var(--font-outlier); color: var(--color-muted); }
.btn { display: inline-flex; padding: var(--space-md) var(--space-xl); border: 0; font: 600 var(--text-sm)/1 var(--font-outlier); background: var(--color-accent); color: var(--color-accent-ink); }
.btn--secondary { background: none; color: var(--color-ink); padding: var(--space-lg) 0 var(--space-xs); border-bottom: var(--rule-bar) solid var(--color-ink); }
.well { background: var(--color-paper-2); border: var(--rule-bar) solid var(--color-ink); outline: var(--rule-hair) solid var(--color-gold); outline-offset: -7px; box-shadow: var(--shadow-card); }
.band--ink { background: var(--color-ink); color: var(--color-paper); }
.photo img { outline: var(--rule-hair) solid color-mix(in oklab, var(--color-ink) 10%, transparent); outline-offset: -1px; }
a:hover { text-decoration-color: var(--color-accent); }
::selection { background: color-mix(in oklab, var(--color-gold) 40%, transparent); }
```
