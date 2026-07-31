# Theme - Newsprint

The broadsheet front page, rebuilt for the screen. The page for an **essay, an op-ed, a magazine piece, a journalism or newsletter brand, a literary review, a longform publication** - the front-page-of-record school, executed in **warm cream, warm ink, one dried-brick signal**. A masthead over a double rule, hairline column rules, a drop cap opening the lede. It reads like something filed this morning and set by hand: authoritative, literary, calm.

Loaded eagerly by SKILL.md Step 3 whenever the catalog pick is `newsprint`. The OKLCH palette + font stack live in [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="newsprint"]`.

## Axes (diversification)

- **Paper band** - warm light (`L 92%`, hue ~50, low chroma). A warm newsprint cream (`--color-paper: oklch(92% 0.045 50)`), never a cool white and never a neutral grey.
- **Display style** - **roman serif / Didone** (Playfair Display 700, optical 48). High-contrast: hairline verticals against thick stems. Distinct from any sans or slab; italic is body-emphasis only, never the header face.
- **Accent hue** - **dried brick** (`--color-accent: oklch(32% 0.10 28)`; text-weight `--color-accent-ink: oklch(45% 0.13 30)`). A muted warm red, used only as furniture. Sits clear of Coral's bright coral and Carnival's oxblood.

## Reference register

The New York Times · The Guardian · The Economist · Financial Times · Le Monde · Bloomberg Businessweek · The Atlantic · The Pudding · The Marginalian · Reuters.

The aesthetic: the front page and the opinion column - centred masthead, dateline furniture, hairline columns, drop-cap ledes, pull-quotes set off by rules. **Never name any of these in the output.**

**Patron-saint reference (internal):** *a broadsheet front page* + *The Economist's rule discipline*, recoloured brick. When in doubt, ask "does this read like a printed page of record, or a marketing template?" Keep the former.

## Required dependencies

1. **Fonts** - **Playfair Display** (display, 700/800/900), **Crimson Pro** (body + italic emphasis, 400/500/600), **Inter** (kickers, bylines, meta labels), **IBM Plex Mono** (folios, edition numerals). Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,700&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
   ```
2. **A small reveal script** - one `IntersectionObserver` adding `.is-in` (fade + ~10px rise, ease-out ~600ms). No type-in, no counters. The page is print; motion is a single quiet entrance.

## Signature moves

1. **Masthead over a double rule.** The hero is a **centred** wordmark in Playfair Display 700+ at display size (`--text-display`), with a thin dateline/edition row (VOL · NO · date · edition) in Inter UPPERCASE, `0.06em` tracking (`--tracking-label`), closed by a **double rule** - two lines in `--color-rule-2` oklch(35% 0.020 35) with a hairline gap. The double-rule masthead is the single most-recognisable Newsprint move. A left-aligned wordmark hero reads as SaaS nav, not broadsheet - centre it.

2. **Warm cream paper, warm ink, never `#fff` / `#000`.** Paper `oklch(92% 0.045 50)`; ink `--color-ink: oklch(15% 0.030 25)` (warm near-black); body sits a notch up at `--color-ink-2: oklch(20% 0.030 28)`; meta/bylines at `--color-muted: oklch(46% 0.022 35)`. Every value is warm (hue 25-50); no neutral grey anywhere.

3. **Didone headline against book-serif body.** Playfair Display 700, optical 48, `--tracking-display: -0.022em` for heads and decks; Crimson Pro at `--text-base: 1.0625rem`, `--lh-normal: 1.55`, `--measure: 58ch` for body. The tension between the sparkling high-contrast head and the calm book serif is the voice. Italic = Crimson Pro emphasis in running text only.

4. **Multi-column body with a hairline column rule.** Longform flows in 2-3 columns split by a single `--color-rule` hairline oklch(68% 0.030 40): `column-rule: 1px solid var(--color-rule)`. The broadsheet sets text in columns, never one wide wall.

5. **Drop cap opens the lede.** The lead story's first paragraph opens with a Playfair Display drop cap (float, ~3 lines tall) in `--color-ink` or the brick accent. One per page - the newspaper's classic entry.

6. **One brick signal, < 5% of any viewport.** `--color-accent` oklch(32% 0.10 28) for a kicker tick, a pull-quote rule, a section marker; `--color-accent-ink` oklch(45% 0.13 30) when brick must read as coloured **text** (the one link, a standfirst dash); `--color-focus` oklch(48% 0.18 30) for focus rings. Never a fill behind a whole section, never a flood.

7. **Furniture in the label voice.** Kickers ("OPINION", "CULTURE"), bylines ("BY A. REPORTER"), datelines, and folios in Inter UPPERCASE `0.06em`, small; edition numerals in IBM Plex Mono. This small-caps furniture frames the serif columns - it is the broadsheet's machine-readout register.

8. **Rules and whitespace, no cards.** Sections divide with a `--color-rule` hairline and a `--color-rule-2` double rule at major breaks. No boxed cards, no drop-shadows, no rounded corners (radius 0). Pull-quotes hang between a top-and-bottom hairline with a brick indent, never in a box.

## Motion

Quiet and singular. One orchestrated reveal (fade + ~10px rise) as sections enter. Hover: a brick underline-grow on links. **No parallax, no type-in, no counters, no autoplay.** Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static and fully visible.

## Anti-patterns

- **No pure `#fff` paper / `#000` ink.** Warm cream + warm near-black only (hue 25-50).
- **No cool or blue accent.** Newsprint's signal is warm brick (hue 28); cool signals belong to Cobalt / Midnight.
- **No left-aligned wordmark hero.** The masthead centres; a left wordmark is modern-minimal vocabulary.
- **No boxed cards, drop-shadows, or rounded corners.** Hairlines and double rules carry structure; radius 0.
- **No duo-tone, ornaments, or hard-offset shadows.** That loudness is Carnival. Newsprint is one brick signal, no mustard, no `✱` dividers.
- **No single wide column of body text.** Longform runs in columns with a hairline column rule.
- **No sans-serif body.** Crimson Pro serif is the body; Inter is confined to kickers, bylines, and meta.
- **No gradient, glassmorphism, or background pattern.** The paper is flat warm cream; a faint fibre texture is the most it tolerates, off by default.

## Macrostructure affinity / rejection

**Newsprint loves these.**

- **Long Document** - prose-led broadsheet; *the* canonical fit
- **Letter** - the opinion column or editor's note
- **Quote-Led** - pull-quotes are native furniture
- **Manifesto** - a masthead opinion statement (quieter than Carnival's)
- **index-first** - a front-page index of headlines and standfirsts

**Newsprint refuses these.**

- **Bento Grid** - gridded product tiles; too boxed, too SaaS - broadsheet uses columns
- **Workbench** - technical tool spec; route Cobalt
- **Marquee Hero** - kinetic and loud; route Carnival
- **Photographic** - image-led hero; Newsprint leads with type and rules (a captioned cut is fine, not the hero)

## Voice fixtures

Specific, declarative, a dry editorial wit. Name the section, the date, the fact.

- *"All the type that's fit to set."*
- *"Filed this morning. Set by hand."*
- *"The front page, rebuilt for the screen."*
- *"Opinion: the hairline still holds."*
- *"Vol. IV, No. 12. Read on."*

Never any of: *seamless, robust, cutting-edge, leverage, synergy, unlock, supercharge, revolutionary, curated experience, storytelling journey*. Never "click here" - name the section or the byline.

## How Newsprint differs from neighbouring themes

| vs | difference |
|---|---|
| **Carnival** (same warm paper band) | Carnival is loud duo-tone maximalism: mustard + oxblood, Big Shoulders 800, ornaments, hard-offset shadows. Newsprint is quiet broadsheet: one brick signal, Playfair Didone, hairlines, no ornaments. Same cream, opposite volume. |
| **Almanac** (reference-desk cousin) | Almanac is the data / reference register - tabular figures, seasonal tables, ledger rules. Newsprint is the front-page story register - masthead, drop-cap ledes, bylines, running columns. Table vs column settles it. |
| **Riso** (print-craft cousin) | Riso is risograph craft: peach paper, CMYK misregistration, cyan + yellow. Newsprint is letterpress broadsheet: warm cream, one brick, crisp registration, Didone. Different print tradition. |
| **Manifesto** (editorial sibling) | Manifesto is black paper + ALL-CAPS Anton in red - inverted polarity, loud. Newsprint is cream paper + Playfair + brick furniture - light and composed. Dark-vs-light settles it instantly. |

## Test brief expectations

Newsprint should be a candidate when the brief mentions:

- *newspaper · broadsheet · editorial · magazine · journalism · publication · newsletter · op-ed · opinion · essay · longform · column · reportage · press · gazette · review · dispatch · weekly · daily · print · literary*
- Product categories: *news publication · magazine · editorial site · newsletter · essay or blog · journalism · opinion / review · media brand · literary journal*
- Emotional tone: *authoritative · considered · literary · print-craft · warm · trustworthy · hand-set · timeless*

Route elsewhere: dev / API -> Cobalt; loud music / zine -> Carnival; data / reference / seasonal -> Almanac; risograph print-craft -> Riso.

## Build hint

The first lines of CSS establish Newsprint's anchor moves:

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-body); font-weight: 400; line-height: var(--lh-normal); }

/* Masthead: centred wordmark closed by a double rule */
.masthead { text-align: center; font-family: var(--font-display); font-weight: 700;
            letter-spacing: var(--tracking-display); }
.masthead::after { content: ""; display: block; height: 4px;
                   border-top: 1px solid var(--color-rule-2);
                   border-bottom: 1px solid var(--color-rule-2); }
.kicker, .byline { font-family: var(--font-label); text-transform: uppercase;
                   letter-spacing: var(--tracking-label); color: var(--color-muted); }

/* Columns with a hairline rule; drop cap opens the lede */
.story { columns: 2; column-gap: 2.5rem; column-rule: 1px solid var(--color-rule);
         max-width: var(--measure); }
.story > p:first-of-type::first-letter { float: left; font-family: var(--font-display);
         font-weight: 800; font-size: 3.4em; line-height: 0.8; padding-right: 0.06em; }

/* The one brick signal */
a { color: var(--color-accent-ink); text-decoration-color: var(--color-accent); }

.reveal { opacity: 0; transform: translateY(10px);
          transition: opacity .6s ease-out, transform .6s ease-out; }
.reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }
```

Plus the Playfair Display + Crimson Pro + Inter + IBM Plex Mono link and the small reveal script.
