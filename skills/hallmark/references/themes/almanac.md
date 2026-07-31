# Theme - Almanac

Editorial-reference register. The page for a **data yearbook, a field guide, a reference manual, a technical handbook, an index or catalogue of entries** - the almanac / whole-catalog school, executed in **cool slate-grey stock, not white**, with **tables and figures as the hero**. A cool mid-band paper ground (`oklch(84% 0.012 245)`), ruler-drawn hairlines, tabular figures that line up to the decimal, and one **deep bookish ink-blue** that never gets loud. It reads like a trusted reference: dense, indexed, exact.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `almanac`. Tokens: [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="almanac"]`.

## Axes (diversification)

- **Paper band** - **mid cool** (`L 84%`, hue 245, chroma 0.012). A slate *ledger stock*, the catalog's first mid-band paper - unmistakably deeper than Cobalt's `98.5%` near-white and Newsprint's warm `92%`.
- **Display style** - **grotesk-sans**, Hanken Grotesk `600`, tight tracking `-0.014em`. A workmanlike Swiss grotesk, not a serif and not geometric-Geist.
- **Accent hue** - **deep ink-blue** (`oklch(38% 0.135 250)`) - dark and quiet, a library-stamp blue. Explicitly *not* Cobalt's electric `L58`; Almanac's signal is bookish, never live.

## Reference register

Works in Progress · Our World in Data · Stripe Press · Low-Tech Magazine · Whole Earth Catalog · The Pudding · Baymard · Poor Richard's Almanack. The aesthetic: the reference yearbook and the data almanac - a cool indexed canvas, hairline tables, tabular figures, a sticky side-rail of contents, mono entry-numbers. **Never name any of these in the output.**

**Patron-saint reference (internal):** *an old farmer's almanac reset in a Swiss grid* - its tables kept honest by hairlines and tabular figures, its entries numbered in mono. When in doubt ask "does this read like a trusted reference, or like a brochure?" Keep the former.

## Required dependencies

1. **Fonts** - **Hanken Grotesk** (display + body, 400/500/600), **Newsreader** (serif, running entries + body emphasis, optical-sizing), **IBM Plex Mono** (entry numbers, units, table headers, UPPERCASE labels). Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
   ```
2. **A reveal + number-tick script** - one `IntersectionObserver` adding `.is-in` (fade + ~8px rise, ease-out, `0.85×` speed - functional, not showy). Plus **number-tick counters** that count `0 → final` for stats, dates, prices on first reveal, then hold.
3. **A sticky side-rail with scroll-spy** - the left index (N3) stays pinned; the active section highlights as you scroll. `role="navigation"`, keyboard-reachable, reduced-motion safe.

## Signature moves

1. **Cool slate stock, never `#fff`** - `oklch(84% 0.012 245)`, with `paper-2` (`81%`) for alternating table rows and `paper-3` (`77%`) for the side-rail well and callout blocks. Ink is cool near-black `oklch(16% 0.020 245)`, never `#000` (11.9:1 on the stock); muted meta sits at `oklch(42% 0.016 245)`.

2. **Tables and figures are the hero** - the almanac *is* its data. Hairline-ruled tables with `font-variant-numeric: tabular-nums`, right-aligned numerics, decimals that line up, units in mono (charts, when a table earns one: [`data-viz.md`](../data-viz.md)). Lead with a data block, an index, or a spec table - never a photograph.

3. **Two rule weights, used deliberately** - light hairline `--color-rule` (`oklch(74% 0.012 240)`) draws the grid and row separators; the dark `--color-rule-2` (`oklch(38% 0.018 240)`) draws the one emphatic line under a section head or table `thead`. **No boxed cards, no shadows.** Depth is rules, not blur.

4. **Three-column encyclopedia density** - reference chunks in a three-column-equal grid, scannable, each entry numbered. Dense by design, not airy. This is the almanac's body posture; a single luxe hero column is wrong here.

5. **Sticky side-rail index (N3)** - a pinned left rail listing sections/entries with mono numbers, active item in the ink-blue accent. The page is navigated like a book's contents, not scrolled like a brochure. **Not a floating pill, not a masthead.**

6. **Mono entry-numbers and labels** - IBM Plex Mono, UPPERCASE, `0.06em` tracking (`--tracking-label`) for eyebrows, entry numbers (`§ 01`, `No. 214`), units, dates, table headers. The machine-readout voice against the Hanken Grotesk display.

7. **Newsreader for the running entry** - the one serif carries long-form entry prose and pull-ledes at the `64ch` measure, italic reserved for in-paragraph emphasis only (never a heading). Grotesk sets structure; serif sets reading.

8. **One deep ink-blue, sparingly** (< 5% of any viewport) - `oklch(38% 0.135 250)` on links, the active rail item, one figure or the single primary control. Dark and quiet; everything else is ink-on-bond-grey. The accent is a stamp, not a flood.

## Motion

Functional and sparse, like turning a reference page. Section reveals fade + rise at `0.85×` ease-out; number-tick counters run once to their final value on reveal, then hold; the side-rail active item shifts as sections cross. **No bounce, no parallax, no autoplay, no marquee.** Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static, counters at final value, fully visible.

## Anti-patterns

- **No electric blue.** Almanac's accent is dark bookish `L38`; the live `L58` cobalt is a sibling's lane.
- **No pure `#fff` / `#000`.** Cool bond-grey paper, cool near-black ink.
- **No warm paper.** Warm grey is Newsprint's; Almanac is cool (hue 240-250).
- **No boxed cards, no drop-shadows, no glassmorphism.** Hairline tables and two rule weights carry every surface.
- **No photographic or image-led hero** - data, tables, or an index lead; images are small, outlined, inline to the measure.
- **No single luxe centered hero column** (that is Atelier/Garden) - Almanac is dense, three-column, left-biased.
- **No justified newspaper columns** - that is Newsprint's broadsheet; Almanac is an encyclopedia grid, ragged-right.
- **No pill / gradient CTA.** One quiet ink-blue control or a typographic link; name the destination.

## Macrostructure affinity / rejection

**Almanac loves.**

- **Long Document** - a reference manual or guide: prose, tables, a running index.
- **Catalogue** - the almanac as an indexed run of numbered entries.
- **Stat-Led** - a data yearbook: tabular figures, number-tick, sourced tables.
- **index-first** - a contents-led page navigated by the side-rail.
- **Specimen** - a dense data/spec specimen with hairline spec tables.

**Almanac refuses.**

- **Marquee Hero** - too kinetic; Almanac opens on an index or a table, not a sweep.
- **Photographic** - image-led; Almanac leads with data and type.
- **Manifesto** - too loud; Almanac is neutral, trusted reference.
- **Letter** - too intimate; Almanac is a reference, not a note.

## Voice fixtures

Declarative, dated, exact. Cite the figure, the edition, the source.

- *"Everything worth knowing about the harvest, indexed."*
- *"Edition 2026. 214 entries, cross-referenced."*
- *"Sunrise 6:12. Sunset 20:41. First frost by the 14th."*
- *"Figures updated quarterly. Sources at the foot of each table."*
- *"Look it up once. Trust it after."*

Never any of: *seamless, revolutionary, magical, effortless, game-changing, cutting-edge, supercharge, unlock*. Never "click here." Cite the entry, the unit, the number.

## How Almanac differs from neighbouring themes

| vs | difference |
|---|---|
| **Newsprint** (editorial, light, dense) | Newsprint is warm `92%` paper + roman-serif display (Playfair) + brick accent + justified broadsheet columns + a masthead. Almanac is cool `84%` slate stock + grotesk display (Hanken) + ink-blue + a ragged three-column encyclopedia grid + a side-rail. Broadsheet vs reference book settles it. |
| **Cobalt** (modern-minimal, cool, blue) | Same cool + blue + mono labels, but Cobalt is `98.5%` engineered near-white + **electric** `L58` cobalt + Space Grotesk + code-as-hero + a dark graphite band + ⌘K. Almanac is greyer bond + **deep** `L38` bookish blue + a Newsreader serif + tables-as-hero + a side-rail. Reference book vs dev-tool. |
| **Garden** (editorial, light) | Garden is warm `95.5%` + roman-serif (Young Serif) + leaf-green + marginalia + generous negative space + calm springs. Almanac is cool + grotesk + ink-blue + dense three-column + functional `0.85×` motion. Botanical calm vs data density. |

## Test brief expectations

Almanac should be a candidate when the brief mentions:

- *almanac · yearbook · field guide · reference · handbook · manual · index · catalogue · encyclopedia · data · figures · tables · statistics · research · dataset · records · directory · glossary · compendium · specifications*
- Product categories: *data / research site · reference manual · field guide · knowledge base · directory · public dataset · technical handbook · editorial data journalism*
- Emotional tone: *exact · indexed · trusted · dense · scholarly · matter-of-fact · reference-grade · cool*

Briefs that are warm / broadsheet / image-led / atmospheric route elsewhere (Newsprint for the newspaper, Garden for the warm serif, the atmospheric themes for mood). When the brief is a **reference full of data** and wants to *show the tables*, it is Almanac.

## Build hint

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink);
       font-family: var(--font-body); font-weight: 400; }

/* Two rule weights: hairline grid + one emphatic head rule */
.rule    { border-top: 1px solid var(--color-rule); }
.head-rule { border-bottom: 2px solid var(--color-rule-2); }

/* Tables are the hero - tabular, right-aligned, hairline-ruled */
table { border-collapse: collapse; font-variant-numeric: tabular-nums; }
thead th { border-bottom: 2px solid var(--color-rule-2);
           font: 500 var(--text-sm)/1 var(--font-mono);
           text-transform: uppercase; letter-spacing: var(--tracking-label); }
td.num { text-align: right; font-variant-numeric: tabular-nums; }
tbody tr:nth-child(even) { background: var(--color-paper-2); }

/* Mono labels + entry numbers */
.label { font: 500 var(--text-xs)/1 var(--font-mono);
         text-transform: uppercase; letter-spacing: var(--tracking-label);
         color: var(--color-muted); }

/* Newsreader for the running entry; deep ink-blue as the one signal */
.entry { font-family: var(--font-serif); max-width: var(--measure); }
a, .rail__item[aria-current] { color: var(--color-accent); }

/* Functional reveal - 0.85x, no showmanship */
.reveal { opacity: 0; transform: translateY(8px);
          transition: opacity .5s ease-out, transform .5s ease-out; }
.reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

Plus the Hanken Grotesk + Newsreader + IBM Plex Mono link and the reveal / number-tick / scroll-spy script.
