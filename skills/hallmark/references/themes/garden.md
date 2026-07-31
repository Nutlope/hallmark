# Theme - Garden

Warm-botanical editorial. The page for a **small farm, apiary, cidery, seed company, herbalist, nursery, or single-maker food brand** - the naturalist field-journal / herbarium-sheet school. A **warm oat-cream ground** (`oklch(95.5% 0.022 92)`, never grey-sage), **botanical green ink** (`oklch(24% 0.052 152)` - a warm near-black green, never `#000`), one **living leaf-green** accent, and a **hand-built botanical specimen** as the focal artefact. It reads like a well-kept field notebook: honest, seasonal, grown-not-manufactured.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `garden`. Tokens: [`site/css/tokens.css`](../../../../site/css/tokens.css) `[data-theme="garden"]`. Reference build: [`site/examples/garden-01/`](../../../../site/examples/garden-01/) (Hollowback Apiary - single-ridge Vermont honey, catalogue of seasonal lots).

## Axes (diversification)

- **Paper band** - light warm (`L 95.5%`, hue 92, low chroma). Oat cream, faintly honeyed. Distinct from the genre's cool/bone grounds and from any grey-sage; tint everything toward oat, never toward slate.
- **Display style** - **roman serif** (Young Serif, one organic weight `400`, `--display-style: normal`). Chunky, slab-ish, hand-cut. Never italic in headers (global rule); Young Serif ships one weight, so vary by size, not weight.
- **Accent hue** - **chromatic leaf-green** (`oklch(47% 0.13 140)`, primary) with an **earthy clay / terracotta** pop (`oklch(54% 0.14 46)`, secondary). Living, chlorophyll-real - sits clear of any cool teal or corporate emerald.

## Reference register

Aesop . Kinfolk . Cereal . Frama . Le Labo . Mast . Toast Ale . Ballymaloe . small-CSA and single-apiary brand sites.

The aesthetic: the naturalist's brand story - warm paper, roman serif, a hand-drawn or hand-built botanical specimen, seasonal honesty, prose that smells of the field. **Patron-saint reference (internal):** *a pressed-herbarium sheet* - one specimen, a hand-lettered mono tag, a warm neutral mount. When in doubt ask "does this read like a field journal, or a supermarket label?" Keep the former. Never name any of these in the output.

## Required dependencies

1. **Fonts** - **Young Serif** (display, one weight), **Hanken Grotesk** (body, 400/500/600/700), **Newsreader** (readable text-serif for long prose - Young Serif is display-only), **Geist Mono** (specimen tags + meta labels). Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Young+Serif&family=Hanken+Grotesk:wght@400;500;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,500&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
   ```
2. **A small reveal script** - one `IntersectionObserver` adding an in-view class (fade + short rise, staggered by `--i`, <=500ms, reveal-once/unobserve). Reduced-motion ships static + fully visible.
3. **Any form-as-CTA** (a standing-order / harvest-note signup) gets honest idle -> loading -> success/error states narrated in `aria-live`, per the reference build's standing-jar form.

## Signature moves

1. **Oat-cream paper, botanical-green ink** - background `--color-paper` `oklch(95.5% 0.022 92)`; body ink `--color-ink-2` `oklch(33% 0.05 150)`, headline ink `--color-ink` `oklch(24% 0.052 152)`. Every neutral carries a green cast (hue 90-152). Never a pure grey, never `#000`/`#fff`. Set `font-variant-numeric: oldstyle-nums`.

2. **Young Serif display, sized not weighted** - `--font-display` at `--display-weight: 400`, roman only. Hierarchy comes from size (`--text-display` clamp to 5rem) and `--tracking-display: -0.006em`, never from italic or a bolder cut. A drop-of-honey slab feel, hand-cut, not a refined Didone.

3. **A hand-built botanical specimen is the hero** - the focal artefact is drawn in pure CSS + hand-authored SVG (a honeycomb wash, a glass jar of amber honey, corked vials of each pour), never a stock photo. It is the thing being sold, anchored not decorative. Tier-A CSS + Tier-B SVG craft carries the page's imagery.

4. **Herbarium specimen tags** - `--font-label` (Geist Mono), UPPERCASE, `--tracking-label: 0.14em` for eyebrows, lot codes, dates, meta. The dry machine-tag voice mounted against the warm Young Serif display - like pencil on a pressed-plant sheet.

5. **Leaf-green as a signal, clay as a warm pop** - `--color-accent` `oklch(47% 0.13 140)` on links, the one solid button, focus rings, active nav - under 5% of any viewport. `--color-accent-2` `oklch(54% 0.14 46)` (clay/terracotta) appears mostly *inside the craft* (honey fill, cork, ripe accents), rarely as UI chrome. Two hues, disciplined.

6. **Botanical tint bands, not boxed cards** - soft full-bleed section bands use `--tint-moss` `oklch(47% 0.13 140 / 0.10)` or `--tint-clay` `oklch(54% 0.14 46 / 0.10)`. Structure is hairlines (`--color-rule` soft green-grey, `--color-rule-2` mossy) + generous whitespace, not drop-shadowed boxes.

7. **Sprig ornaments beside section titles** - a small hand-authored SVG leaf-sprig or fleuron sits inline before an `<h2>`, drawn in `--color-rule-2`/accent. The broadsheet fleuron, botanised.

8. **Prose set in Newsreader** - long provenance/story copy uses `--font-serif` (Newsreader) at `--measure: 58ch`, readable and warm. Young Serif never runs as body. The build's default nav is **N6 newspaper masthead** (dateline + wordmark + double rule) and footer is **Ft6 letter close** (roman signoff + postscript) - broadsheet head, personal-letter foot.

## Motion

Quiet and seasonal. One orchestrated entrance: staggered reveal of hero lines and catalogue cards (fade + <=10px rise, `--i` stagger, <=500ms, reveal-once). Optional single hover behaviour on a specimen (a jar-fill rise). All transform/opacity only - no bounce, no parallax, no autoplay. Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static and fully visible.

## Anti-patterns

- **No grey-sage or slate paper.** Garden's ground is warm oat (hue ~92); a cool grey-green kills it.
- **No pure `#000`/`#fff`** - green-cast ink, oat paper. Gate 7.
- **No stock photography** - the imagery is hand-built CSS/SVG botanical craft. A real honey photo reads as a supermarket label.
- **No italic Young Serif headers** and no faux-bold - one roman weight, vary by size (global rule + one-weight face).
- **No cool teal / corporate emerald accent** - the green must read chlorophyll-living (hue ~140), not fintech.
- **No boxed drop-shadow cards or card-in-card** - hairlines + tint bands. Gate 4.
- **No floating pill nav / gradient-on-pill CTA** - broadsheet masthead + one solid leaf-green button; pill fine, gradient not.
- **No centred-everything hero** - copy left, specimen right (or asymmetric). Gate 6.

## Macrostructure affinity / rejection

**Garden loves:** Catalogue (seasonal-lot / product-card grid - *canonical, garden-01*) . Long Document (provenance / field-story prose) . Letter (the maker's note home) . Photographic-as-specimen (hand-built botanical illustration standing in for photos) . Stat-Led (small honest facts: hives, elevation, forage).

**Garden refuses:** Workbench / component-playground (too mechanical for a farm) . Bento Grid (too gridded and product-y - Garden breathes) . Marquee Hero of pure kinetic type (fights the quiet) . Specimen-as-type-specimen (that is a sibling's job; Garden's specimen is botanical, not a glyph table).

## Voice fixtures

- *"Honey that tastes like one hillside."*
- *"Nine hives. One ridge. No blending."*
- *"A poor June is a smaller June, and the summer lot says so."*
- *"Cold-spun, strained once, poured by hand the same week."*
- *"When a pour is gone it is gone until the same flowers come round again."*

Never any of: *artisanal, curated, elevated, handcrafted-with-love, farm-to-table, sustainable-first, wellness, small-batch* as a hollow badge. Say the ridge, the flower, the pour date, the number of jars.

## How Garden differs from neighbouring themes

| vs | what settles it instantly |
|---|---|
| **Almanac** (editorial, field-reference sibling) | Almanac is a dense data/ledger register (tables, monospace almanac). Garden is a warm brand-story with a hand-built botanical specimen and a living leaf-green accent - narrative, not tabular. |
| **Atelier** (editorial, quiet-personal sibling) | Atelier is a restrained studio/letter voice on a neutral ground. Garden shares the letter-close warmth but commits to green ink, oat paper, and chunky Young Serif - agrarian, not gallery-quiet. |
| **Specimen** (editorial, roman-display sibling) | Specimen's "specimen" is a type/glyph specimen. Garden's specimen is a *botanical* object (jar, vial, comb) and its accent is chromatic leaf-green - a farm, not a foundry. |

## Test brief expectations

Candidate when the brief mentions: *farm . apiary . honey . cidery . orchard . seed . nursery . herbalist . botanical . tea . preserves . single-origin . seasonal . harvest . small-maker . CSA . provenance . grown . field . homestead*.
Product categories: *artisan food/drink . apiary . farm brand . seed co . nursery . herbal / botanical goods . maker story.*
Emotional tone: *warm . honest . seasonal . rooted . unhurried . hand-made . naturalist.*
Briefs that are technical, corporate, cool, or image-heavy-with-photos route elsewhere.

## Build hint

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-body); font-weight: 400;
       font-variant-numeric: oldstyle-nums; }

/* Young Serif display - roman, one weight, sized not bolded */
.section__title, .hero__title {
  font-family: var(--font-display); font-weight: var(--display-weight);
  font-style: var(--display-style); letter-spacing: var(--tracking-tight);
  color: var(--color-ink); line-height: var(--lh-tight); }

/* Herbarium specimen tag - dry mono against the warm serif */
.tag, .eyebrow { font-family: var(--font-label); text-transform: uppercase;
  letter-spacing: var(--tracking-label); color: var(--color-muted); }

/* Tint band + hairline, never a boxed card */
.band--moss { background: var(--tint-moss); }
.rule { border-top: 1px solid var(--color-rule); }

/* One leaf-green button; clay stays on the craft */
.btn--solid { background: var(--color-accent); color: var(--color-accent-ink); }

/* Reveal - the whole motion engine */
.reveal { opacity: 0; transform: translateY(10px);
  transition: opacity .5s ease, transform .5s ease;
  transition-delay: calc(var(--i, 0) * 70ms); }
.reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; } }
```

Plus the Young Serif + Hanken Grotesk + Newsreader + Geist Mono link and the small reveal script. Reference build: [`site/examples/garden-01/`](../../../../site/examples/garden-01/) - match its register (tokens, voice, motion feel), never its composition; reusing its section order, hero geometry, or grid is a gate-32-grade repeat.
