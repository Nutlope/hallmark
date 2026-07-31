# Theme - Sport

Athletic editorial, scoreboard register. The page for a running club, a race event, a training program, a team or league, a performance-gear drop, a fixtures / standings board. A cool concrete-grey ground (`oklch(98% 0.003 250)`), blue-black ink (`oklch(16% 0.080 260)`), uppercase condensed Inter Tight heads, tabular JetBrains Mono numerals, and exactly ONE blaze-orange signal (`oklch(58% 0.190 35)`). It reads like a timed event: fast, measured, competitive.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `sport`. Tokens: `site/css/tokens.css` `[data-theme="sport"]`. No canonical build yet; mirror the token anchors in Build hint below.

## Axes (diversification)

- **Paper band** - light, cool concrete (`--color-paper oklch(98% 0.003 250)`, L 98, hue 250, near-zero chroma). An engineered near-white with a faint cool cast. Not warm cream (Carnival, Riso), not black (Manifesto).
- **Display style** - display-condensed, uppercase. Inter Tight `--display-weight 700`, opsz token `96`, `--tracking-display -0.04em`, all-caps on the `--lh-tight 1.02` floor. Upright, never italic (`--display-style: normal`).
- **Accent hue** - warm blaze-orange (`--color-accent oklch(58% 0.190 35)`; as text `--color-accent-ink oklch(54% 0.20 35)`). High-chroma safety-orange, used as a single signal, never a flood. Clear of Coral's coral and Lumen's brass.

## Reference register

On Running · Bandit Running · Soar · District Vision · Strava · Whoop · Formula 1 result boards · NBA scoreboards · Wilson · Gymshark.

The aesthetic: the clinical performance grid, the race-bib crop, the standings table, the split-time readout. **Patron-saint (internal):** a stadium scoreboard's mono precision + a running-club singlet, recoloured blaze-orange on cool concrete. When in doubt ask "does this read like a timed result board, or a wellness landing page?" Keep the former. **Never name any of these in the output.**

## Required dependencies

1. **Fonts** - **Inter Tight** (display, 700/800, uppercase), **Albert Sans** (body, 400/500/600), **JetBrains Mono** (numerals + UPPERCASE labels). All-sans; no serif. Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=Albert+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
   ```
2. **A reveal script** - one `IntersectionObserver` adding `.is-in` (fade + ~10px rise, ease-out ~600ms).
3. **A count-up script** - stat numerals tick to their final value once on reveal (the scoreboard flip). Reduced-motion renders the final number static.

## Signature moves

1. **Cool concrete paper, blue-black ink, never `#fff` / `#000`.** Paper `oklch(98% 0.003 250)`; ink `oklch(16% 0.080 260)` is a cool near-navy black (chroma 0.08, visibly blue, not warm charcoal). Body sits at `--color-ink-2 oklch(22% 0.060 258)`, meta at `--color-muted oklch(50% 0.020 250)`.

2. **Uppercase condensed display, tracked tight.** Inter Tight 700 all-caps at `--tracking-display -0.04em`, `--lh-tight 1.02`. The tension lives in the caps and the tracking, not a slant - upright, never italic. Two-line all-caps heads risk ascender/descender collision (see the token note): hold the 1.02 floor, never drop under it.

3. **One blaze-orange signal, < 5% of any viewport.** `oklch(58% 0.190 35)` marks the race-bib number, the one primary CTA, the active fixture, a link underline, the focus ring, the single lane stripe. Everything else is cool grey + ink. Orange-as-text uses `--color-accent-ink`.

4. **The scoreboard: mono tabular numerals, set large** (chart construction, when a figure grows one: [`data-viz.md`](../data-viz.md))**.** JetBrains Mono with `font-variant-numeric: tabular-nums` for times, splits, scores, distances, dates. The number is the content and outsizes its label. The stopwatch / standings voice.

5. **Two-weight rule system, never boxed cards.** Hairline `--color-rule oklch(78% 0.008 250)` at `--rule-hair 1px` rules table rows and fine grids; heavy `--color-rule-2 oklch(36% 0.060 255)` at `--rule-fine 2px` frames the scoreboard and breaks sections. Depth from rules, never soft shadows or card-in-card.

6. **A single lane stripe.** One vertical or diagonal orange bar (a track lane / speed stripe / finish line) in `--color-accent`, pure CSS, placed ONCE as the page's kinetic graphic. Never repeated as decoration.

7. **Mono labels, uppercase, tracked wide.** Eyebrows, meta, bib tags in JetBrains Mono, uppercase, `--tracking-label 0.10em`. The wide mono label is the ONLY place caps go loose; the display stays tight (move 2).

8. **Fast section rhythm.** Sections at `--section-gap 5.5rem`, heads tight above their content at `--section-head-gap 1.25rem`, prose capped at `--measure 58ch`.

## Motion

Kinetic but disciplined. Section reveals fade + rise. Stat numerals count up once on reveal (the scoreboard flip). Hover: orange underline-grow on links, a 2px border shift to orange on focusable rows. No parallax, no autoplay, no bounce. Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships final numbers, full visibility, static.

## Anti-patterns

- **No italic display.** `--display-style: normal`; the athletic lean comes from tracking and layout, not slanted type.
- **No warm paper.** Sport is cool (hue 250). Warm grey / cream is Carnival, Riso, Almanac.
- **No second accent, no duo-tone.** One orange signal only; duo-tone belongs to Carnival.
- **No hard-offset poster shadow** (`4px 4px 0`). Rules carry structure; the offset shadow is Carnival's.
- **No loose tracking on the display.** The hero is tight (`-0.04em`); wide caps live only on mono labels (`0.10em`). Spread display caps read as AI-stretched.
- **No pill / gradient CTA.** One solid orange button, square-ish radius (4px), destination named.
- **No serif anywhere.** All-sans: Inter Tight / Albert Sans / JetBrains Mono.
- **No stadium skeuomorphism** - no grass texture, jersey-mesh gradient, medal / trophy emoji.

## Macrostructure affinity / rejection

**Sport loves these.**

- **Stat-Led** - *canonical.* The scoreboard, the standings, the split table, the season figures.
- **Marquee Hero** - one big uppercase word + the lane stripe.
- **Bento Grid** - fixtures / results / kit tiles, each rule-framed.
- **Type Specimen** - the condensed caps as the content.
- **Feature-stack** - training-plan or spec rows down a hairline column.

**Sport refuses these.**

- **Letter** - too intimate; Sport is a result, not a note.
- **Conversational FAQ** - too soft.
- **Long Document** - prose-led; route Newsprint / Editorial.
- **Quote-Led** - too pensive; Sport is present-tense and timed.

## Voice fixtures

Imperative, kinetic, numbered. Caps on the headline, sentence case in the body.

- *"EVERY SPLIT COUNTS."*
- *"42.195 KM. ONE MORNING."*
- *"TRAIN FOR THE DISTANCE, NOT THE DAY."*
- *"BUILT FOR THE FINAL LAP."*
- *"FASTER THAN LAST SEASON. PROVE IT."*

Numerals over words (5K, not five-K). Verbs and numbers, not adjectives. **Never any of:** *journey, wellness, holistic, elevate, unleash, game-changer, next-level, curated.*

## How Sport differs from neighbouring themes

| vs | difference |
|---|---|
| **Manifesto** | Manifesto is BLACK paper + red Anton, caps as protest. Sport is light cool-grey paper + blaze-orange + Inter Tight, caps as scoreboard. Both uppercase; opposite polarity (dark vs light) and purpose (declaration vs result). |
| **Carnival** | Carnival is duo-tone poster art (Big Shoulders width axis, ornaments, hard-offset shadows). Sport is single-signal data (Inter Tight, mono tabular numerals, hairlines). Expressive vs measured. |
| **Brutal** | Brutal is raw heavy-border slab brutalism. Sport is fast and hairline-precise, one heavy rule, the number as hero. Structure from rules and data, not slab weight. |

## Test brief expectations

Sport should be a candidate when the brief mentions:

- *running · marathon · race · training · fitness · gym · team · league · fixtures · standings · scoreboard · athletics · performance · splits · PR / PB · kit · sportswear · club · season · match · tournament · endurance*
- Product categories: *sportswear · running brand · fitness app · sports team or club · race event · training program · performance gear · league / standings site*
- Emotional tone: *fast · competitive · measured · kinetic · disciplined · timed · hard*

## Build hint

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-body); font-weight: 400; }

/* Scoreboard heads: uppercase condensed Inter Tight, tight + upright */
h1, h2 { font-family: var(--font-display); font-weight: var(--display-weight);
         text-transform: uppercase; letter-spacing: var(--tracking-display);
         line-height: var(--lh-tight); font-style: normal; }

/* The scoreboard number: mono, tabular, larger than its label */
.stat-num { font-family: var(--font-mono); font-variant-numeric: tabular-nums;
            font-size: var(--text-2xl); color: var(--color-ink); }
.label { font-family: var(--font-label); text-transform: uppercase;
         letter-spacing: var(--tracking-label); color: var(--color-muted); }

/* Two-weight rule system, never boxed cards */
.hair { border-top: var(--rule-hair) solid var(--color-rule); }
.rule { border-top: var(--rule-fine) solid var(--color-rule-2); }

/* One blaze-orange signal: the CTA, the single lane stripe */
.btn--primary { background: var(--color-accent); color: var(--color-paper);
                border-radius: 4px; }
.lane { background: var(--color-accent); }

.reveal { opacity: 0; transform: translateY(10px);
          transition: opacity .6s cubic-bezier(0.16,1,0.3,1),
                      transform .6s cubic-bezier(0.16,1,0.3,1); }
.reveal.is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

Plus the Inter Tight + Albert Sans + JetBrains Mono link and the reveal + count-up script.
