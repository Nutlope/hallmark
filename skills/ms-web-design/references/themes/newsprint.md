---
name: Newsprint
slug: newsprint
genre: editorial
paper: light 94 92
display: slab-serif Zilla Slab
accent: warm 32
posture: restrained
keywords: newspaper, broadsheet, journalism, publication, magazine, newsletter, local news, op-ed, opinion, essay, longform, column, reportage, press, gazette, review, dispatch, literary
material: pale newsprint stock, warm black ink, Zilla Slab heads over a Spectral body with Libre Franklin agate for listed figures, justified columns under hairline column rules, a double rule, one dried-brick signal
photo: mono
pictured: Broadsheet Front, Stage hero
---

# Newsprint

A broadsheet in a browser: pale newsprint stock, warm black ink, a blunt Zilla Slab head over a calm Spectral book serif, hairlines and column rules for ordinary breaks, a double rule for the major ones, and a dried-brick signal that never fills anything. Photographs run in black and white with a caption, as a paper prints them. It reads reported and edited, not decorated. It is not a magazine of rounded cards, not a sans-serif blog, and not the cream editorial template with a terracotta button.

## Tokens

```css
:root {
  --color-paper: oklch(94% 0.011 92); --color-paper-2: oklch(90.5% 0.015 88); --color-paper-3: oklch(87% 0.017 86);
  --color-ink: oklch(17% 0.012 60); --color-ink-2: oklch(27% 0.012 58); --color-muted: oklch(46% 0.014 60);
  --color-rule: oklch(68% 0.016 75); --color-rule-2: oklch(34% 0.012 60);
  --color-accent: oklch(44% 0.13 32); --color-accent-ink: oklch(95% 0.012 90); --color-focus: oklch(48% 0.17 32);
  --font-display: "Zilla Slab", ui-serif, Georgia, serif; --font-body: "Spectral", ui-serif, Georgia, serif;
  --font-outlier: "Libre Franklin", ui-sans-serif, sans-serif;
  --radius-card: 0; --radius-pill: 0; --rule-hair: 1px;
  --shadow-card: none;
  --tracking-display: -0.02em; --display-weight: 700;
}
```

## Type

- **Display:** Zilla Slab 700, `--tracking-display`, line-height 1.05, sentence case, roman, for heads, decks and the masthead. Bracketed serifs at nearly stem weight: hold the one weight and let the shared scale make the hierarchy.
- **Body:** Spectral 400 and 500 at 1.0625rem, line-height 1.55. The blunt slab over the calm book serif is the voice; Spectral italic is emphasis in running text only.
- **Bylines, datelines, captions, table heads, meta:** Spectral 500 a step smaller, sentence case, untracked, `--color-muted`.
- **Agate, Libre Franklin 500:** the paper's listings face, only for figures in a ruled list or table (times, prices, counts, results), tabular and right-aligned, the size of the text beside it. Never a label, a head or running text. Three weights a page: 400, 500, 700.
- **Columns:** running text of more than one paragraph may set in two or three justified columns with `hyphens: auto` and a hairline column rule, each 28 to 40ch.
- **Drop cap:** may open one long passage, a Zilla Slab initial about three lines tall in ink or brick, once a page at most.

## Surfaces

- Hairlines in `--color-rule` carry ordinary breaks, and text set in columns takes a hairline column rule; the double rule, two 1px lines in `--color-rule-2` 2px apart, is the heaviest divider the theme owns and marks the major breaks.
- Rules, never boxes: radius 0 and no shadow anywhere. A well is a `--color-paper-2` field ruled top and bottom, never a bordered card.
- Bands: `--color-paper-2`, or one `--color-ink` band with paper type; two a page at most, never a brick field.
- Photographs: black-and-white documentary, the place and its people at a working distance or from behind, in available light, the tones running from paper white to ink; the lead picture wide, the rest cropped to the story. Square, a 1px `--color-rule` border, no shadow. Every picture takes a one-line caption beneath it in the byline voice, a fact; type never sits on a photograph.
- Texture, if any: the faintest fibre grain (`texture.md` § 1) on one band, off by default and never under running text.

## Range

- **Front page in columns:** one head at `--text-display-s` across the full measure over three justified columns of Spectral, a drop cap, a dateline in the byline voice; a 1px column rule between, a double rule above.
- **Listings as agate:** a week, a programme or a price list as ruled rows, the day or item in Zilla Slab at title size, the line in Spectral, the figure in Franklin agate at the right edge.
- **Figures as a box score:** the publication's own numbers in Zilla Slab at display size between two double rules, each over one Spectral line, parted by column rules.
- **The ink band:** a notice reversed in paper on `--color-ink` (a price, a call to subscribe) with its form; the brick becomes a hairline on it, never a fill.

## Controls

- The control pair: an ink-filled rectangle with paper type beside one ruled top and bottom in ink, both square, set in Zilla Slab 700 a step smaller.
- Links in brick with a 1px brick underline that thickens on hover; inputs are square with a 1px `--color-rule-2` border on `--color-paper-2`.
- The brick stays under 5%: links, the focus ring, a short tick on a rule; never a fill.

## Motion

State only: a link's underline thickens on hover. No reveal, no counter, nothing that types or scrolls itself.

## Voice

Specific and declarative, with a dry editorial wit: name the place, the day and the fact, and write heads a sub-editor would pass, in sentence case and full stops.

## Do-nots

- Never a sans-serif body or a sans label voice; Spectral does all the small work.
- Never a cool or bright accent; dried brick is furniture, not a shout.
- Never boxed cards, shadows or rounded corners; rules carry the structure.
- Never Zilla Slab under 700 or in italic; one blunt roman weight.
- Never a colour, toned or tinted photograph, and never one without its caption.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@700&family=Spectral:ital,wght@0,400;0,500;1,400&family=Libre+Franklin:wght@500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: var(--display-weight); }
.rule--double { box-sizing: content-box; height: 2px; border: 0; border-block: var(--rule-hair) solid var(--color-rule-2); }
.cols { columns: 3 18rem; column-gap: var(--space-xl); column-rule: var(--rule-hair) solid var(--color-rule); text-align: justify; hyphens: auto; }
.agate { font: 500 1em/1 var(--font-outlier); font-variant-numeric: tabular-nums; }
.dropcap::first-letter { float: left; font: 700 3.4em/0.8 var(--font-display); padding-right: 0.06em; }
.btn { border: 0; background: none; border-radius: 0; padding: var(--space-md) var(--space-lg); font: 700 0.9375rem/1 var(--font-display); }
.btn--primary { background: var(--color-ink); color: var(--color-paper); }
.btn--secondary { border-block: var(--rule-hair) solid var(--color-ink); color: var(--color-ink); }
.well { background: var(--color-paper-2); border-block: var(--rule-hair) solid var(--color-rule); }
figure img { border: var(--rule-hair) solid var(--color-rule); }
figcaption { font: 500 var(--text-sm)/1.4 var(--font-body); color: var(--color-muted); padding-top: var(--space-xs); }
a { color: var(--color-accent); text-decoration-color: var(--color-accent); text-underline-offset: 0.16em; }
a:hover { text-decoration-thickness: 2px; }
::selection { background: color-mix(in oklab, var(--color-accent) 20%, transparent); }
```
