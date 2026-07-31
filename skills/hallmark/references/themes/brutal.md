# Theme - Brutal

Raw graphic-design brutalism. The page for a **design studio, a streetwear drop, a zine, a statement portfolio, an event / festival poster** - the school of heavy grids, slab type, and one loud signal. Near-white paper (`oklch(98% 0.001 0)`) is carved by near-black 3px rules (`oklch(12% 0.005 0)`), stacked with giant uppercase Albert Sans 700, and cut by exactly ONE red (`#E63946`) as a fill-block or bar. It reads like a wayfinding sign or a broadsheet front page: loud, rigid, unhedged.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `brutal`. Tokens: `site/css/tokens.css` under `[data-theme="brutal"]`.

## Axes (diversification)

- **Paper band** - light (`oklch(98% 0.001 0)`, chroma ~0, hue 0). An engineered near-white, all but neutral. Not tinted, not warm-grey - a clean sheet the black rules bite into.
- **Display style** - **display-heavy**: Albert Sans **700**, run UPPERCASE at `--tracking-display: -0.045em`. `--lh-tight: 1.02` is the floor: below it, cap-tops of line N+1 collide with line N on multi-line all-caps heads.
- **Accent hue** - **warm red** (`#E63946`, text form `oklch(58% 0.24 25)`). One saturated signal, hue ~25. Sits clear of the cool themes; used as a graphic cut, never a wash.

## Reference register

Bloomberg Businessweek graphics, Balenciaga, Gumroad, Cash App, Are.na, MSCHF, Off-White, Read the Docs. The aesthetic: the heavy-grid front page and the wayfinding sign - thick black rules, one red bar, type as the structure. **Patron-saint (internal):** *a broadsheet masthead crossed with a machine-shop label plate* - rigid grid, one red stamp, everything flush to a border. Never name any of these in the output.

## Required dependencies

1. **Fonts** - **Albert Sans** (display + body, 400/500/700/900), **JetBrains Mono** (labels + meta). All-sans; no serif anywhere. Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@400;500;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
   ```
2. **A minimal reveal (optional)** - one `IntersectionObserver` adding `.is-in`. Motion snaps or steps, it does not glide (see Motion). Reduced-motion ships everything static + visible.

## Signature moves

1. **Engineered near-white paper, near-black ink** - paper `oklch(98% 0.001 0)`, ink `oklch(8% 0.005 0)`, body `oklch(12% 0.005 0)`. Close to `#fff`/`#000` on purpose but never either: the ~0-chroma neutrality is what makes the red read as the only colour on the page.

2. **Thick rules are the structure** - two weights only: `--rule-fine: 3px` heavy borders box every section and figure; `--rule-hair: 1px` splits rows inside them. Brutalism draws with a marker, not a pencil. Column rules stay visible; content sits flush to the border with no inset gutter softening it.

3. **Zero radius, everywhere** - `border-radius: 0` on buttons, inputs, blocks, images. Square corners are non-negotiable; any rounding reads as a softer sibling and breaks the theme.

4. **One red signal, graphic not gradient** - `#E63946` as a solid fill-block, a full-width bar, a `<mark>` at x-height, the focus ring, one primary button (red fill, paper text). Kept under ~5% of any viewport. Never a gradient, never a tint wash, never two accents.

5. **Uppercase Albert Sans 700 display, edge to edge** - heads run UPPERCASE, `--tracking-display: -0.045em`, `--lh-tight: 1.02`, sized by `--text-display` (clamp to 6.5rem). Flush-left, allowed to run wide and clip against a rule. Never centred, never italic (global rule).

6. **Inverted solid blocks, no float** - the page reads as stacked filled rectangles: a solid black panel with paper text, a solid red panel, a bordered white panel. No drop-shadow blur, no glass, no card-on-card float - blocks butt against each other and against rules.

7. **JetBrains Mono catalog voice** - eyebrows, section numbers (`01 / 02 / 03`), meta rows, filenames, kbd hints in mono, UPPERCASE, `--tracking-label: 0.04em`, in `--color-muted` (`oklch(38%)`). The machine-readout counterpoint to the shouting display face.

## Motion

Mechanical and abrupt. Reveals snap or step (a hard `opacity` cut, or a 1-step translate over ~120ms), they do not ease-glide. Hover flips state instantly: a block inverts to `--color-ink` (or `--color-accent`) with paper text, a border thickens to red. No bounce, no parallax, no blur transition, no autoplay. Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static + fully visible.

## Anti-patterns

- **No rounded corners.** Any `border-radius` > 0 belongs to Cobalt / Coral, not here.
- **No blurred drop-shadows, no glassmorphism.** Depth is borders and solid fills; a hard-offset no-blur shadow is Carnival's decorative move, keep it out.
- **No ornaments / fleurons / layered offset stacks** - that is Carnival's decorated lane. Brutal is raw.
- **No black paper.** Inversion into a dark ground is Manifesto. Brutal is a **light 98%** sheet with black structure.
- **No second colour, no gradient, no pastel.** Exactly one red signal on near-neutral ink.
- **No serif, no italic display.** Albert Sans + JetBrains Mono only.
- **No centred hero, no soft prose column drifting to middle.** Flush-left, edge-aligned to a rule.
- **Do not let the red flood.** It cuts; it does not coat.

## Macrostructure affinity / rejection

**Brutal loves:**
- **Manifesto** - short, loud, all-caps declaratives stacked between heavy rules.
- **Stat-Led** - big figures in bordered cells, mono labels beneath.
- **Specimen / type-specimen** - Albert Sans 700 as the subject, giant glyphs edge to edge.
- **Catalogue / index-first** - numbered rows split by hairlines, mono meta, one red column.
- **Bento Grid** - only with 3px square-cornered borders (a rigid module wall, never soft tiles).

**Brutal refuses:**
- **Photographic / image-led** - Brutal leads with type and rule, not imagery.
- **Letter** - too intimate; Brutal shouts, it does not confide.
- **Conversational FAQ** - too friendly and rounded for a wayfinding sign.
- **Quote-Led** - too gentle a centre of gravity.

## Voice fixtures

Blunt, declarative, often ALL CAPS. Verbs and nouns, no hedging.

- *"SAME PROMPT. TWO OUTPUTS."*
- *"NO TEMPLATES. NO DEFAULTS."*
- *"READ THE SPEC. SHIP THE PAGE."*
- *"STRUCTURE IS THE STYLE."*
- *"ONE RED. EVERYTHING ELSE IS INK."*

Never any of: *seamless, elegant, delightful, gentle, soft, curated, whimsical, effortless, playful*. No hedges, no hype. Say the thing flat.

## How Brutal differs from neighbouring themes

| vs | what settles it instantly |
|---|---|
| **Carnival** (editorial maximalist sibling) | Carnival is **decorated**: duo-tone accents, ornaments, hard-offset layered shadows, variable-width type, tinted paper. Brutal is **raw**: near-white paper, one red, thick black borders, no ornament, Albert Sans slab. Decorated vs raw. |
| **Manifesto** (loud editorial sibling) | Manifesto is **BLACK paper** + all-caps red display (dark, inverted polarity). Brutal is a **light 98% sheet** with black structure and a red cut. Light vs dark settles it in one glance. |
| **Riso** (print-craft editorial) | Riso is risograph craft: peach paper, CMYK misregistration, soft grainy ink. Brutal is hard-edged and crisp: no texture, no misregistration, heavy exact rules. |

## Test brief expectations

Brutal should be a candidate when the brief mentions:

- *brutalist · raw · bold · high-contrast · statement · agency · studio · portfolio · streetwear · drop · zine · manifesto · type-forward · graphic-design · poster · festival · collective · no-nonsense · uncompromising*
- Product categories: *design studio / agency · streetwear or fashion drop · editorial / zine · type-forward portfolio · event or festival page · statement landing*
- Emotional tone: *loud · blunt · confident · raw · high-contrast · rigid · unhedged*

Warm, soft, image-led, or intimate briefs route elsewhere (Carnival for decorated maximalism, Manifesto for the dark inversion, the quieter editorial themes for prose).

## Build hint

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink);
       font-family: var(--font-body); font-weight: 400; }

/* Display - uppercase Albert Sans 700, ultra-tight, edge-aligned */
h1, h2, .display { font-family: var(--font-display);
  font-weight: var(--display-weight); text-transform: uppercase;
  letter-spacing: var(--tracking-display); line-height: var(--lh-tight); }

/* Structure = thick square-cornered rules, never radius */
.block { border: var(--rule-fine) solid var(--color-rule); border-radius: 0; }
.rule  { border: 0; border-top: var(--rule-fine) solid var(--color-rule); }

/* One red signal - solid fill or bar, never gradient */
.bar, mark { background: var(--color-accent); color: var(--color-paper); }
.accent { color: var(--color-accent-ink); }
.btn { border: var(--rule-fine) solid var(--color-rule); border-radius: 0; }

/* Mono catalog voice */
.label { font-family: var(--font-label); text-transform: uppercase;
  letter-spacing: var(--tracking-label); color: var(--color-muted); }

/* Inversion on hover - instant, no blur, no bounce */
.invert:hover { background: var(--color-ink); color: var(--color-paper); }

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
```

Plus the Albert Sans + JetBrains Mono link and the minimal snap-reveal script.
