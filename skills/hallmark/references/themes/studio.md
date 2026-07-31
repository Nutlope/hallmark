# Theme - Studio

Editorial, design-studio register. The page for a **creative studio, a branding practice, an art-direction shop, a design portfolio, a selected-work index** - the considered-agency school, executed in **high-contrast Fraunces on a cool studio-white, with one deep botanical green**. A faintly cool near-white ground (`oklch(96.5% 0.005 200)`), ruler-drawn hairlines, huge thick/thin display serif, and a numbered work-index doing the structural work. It reads like a studio that sets its own type: crafted, confident, curatorial.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `studio`. Tokens: `site/css/tokens.css` under `[data-theme="studio"]`.

## Axes (diversification)

- **Paper band** - light, cool: `oklch(96.5% 0.005 200)`. An engineered studio-white, hue ~200, almost no chroma. Distinct from warm editorial grounds and from any dark canvas.
- **Display style** - **high-contrast serif** (Fraunces at optical 144, `SOFT` 30, weight 400, tracking `-0.022em`). The thick/thin contrast is the theme. Not a grotesk, not a slab, not a condensed.
- **Accent hue** - **chromatic green** `oklch(46% 0.140 145)`. A deep botanical emerald, mid-dark and saturated but never neon. One signal only, ink-on-white everywhere else.

## Reference register

Aesop · Stripe Press · Readymag · Instrument · Locomotive · Area 17 · Cosmos · Semplice · a type foundry's Fraunces specimen.

The aesthetic: the design-studio case-study index - a cool crafted canvas, one green signal, big high-contrast serif, a hairline project ledger, mono meta-lines. **Never name any of these in the output.**

**Patron-saint reference (internal):** a branding studio's selected-work index, set in high-contrast Fraunces and recoloured deep green - the specimen discipline of a type foundry with the warmth of a working studio. When in doubt ask "does this read like a studio that hand-sets its own page, or a template?" Keep the former.

## Required dependencies

1. **Fonts** - **Fraunces** (display, variable opsz/wght/SOFT, roman + italic for body emphasis), **Geist** (body 400/500/600), **Geist Mono** (labels + meta). Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT@0,9..144,400..700,0..100;1,9..144,400..700,0..100&family=Geist:wght@400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
   ```
2. **A small reveal script** - one `IntersectionObserver` adding `.is-in` (fade + ~10px rise, ease-out ~600ms). One orchestrated entrance, then static. Reduced-motion safe.

## Signature moves

1. **Cool studio-white, never `#fff`** - paper `oklch(96.5% 0.005 200)`, second surface `oklch(93.5% 0.007 200)`. Ink is cool near-black `oklch(13% 0.024 205)`; body sits at `--color-neutral` `oklch(34% 0.016 205)`. Everything tints faintly toward hue 200-205.

2. **Fraunces set big and high-contrast** - the display face at optical size 144 (`--display-optical`), weight 400, `SOFT` 30, letter-spacing `-0.022em`. `font-variation-settings: "opsz" 144, "SOFT" 30`. Headlines run 2-3 lines, **edge-aligned left**, up to `6.25rem` (`--text-display`). The dramatic thick/thin stroke is the signature - do not flatten it with a low optical size.

3. **One botanical green signal** (< 5% of any viewport) - `--color-accent-ink` `oklch(46% 0.140 145)` for a green word in a headline, a link underline, a small index tick, the active nav item. The **one filled button** uses `--color-accent` as background with a `--color-paper` label (never green-on-green). Everything else is ink-on-white.

4. **Geist body against a Fraunces display** - the tension of a clean neutral sans body under a high-contrast display serif. Body Geist 400 at a 45-75ch measure. **Never set running body in the serif**; Fraunces is display and pull-quotes only.

5. **Geist Mono spec-sheet labels** - eyebrows, section numbers, project indices, dates, roles, captions in Geist Mono UPPERCASE, tracking `0.08em` (`--tracking-label`). The machine-readout counterpoint to the lush serif - a studio's colophon voice.

6. **A hairline work-index, not cards** - 1px `--color-rule` `oklch(82% 0.008 200)` rules define sections and a numbered project ledger (index no. / title in Fraunces / discipline / year across hairline-separated rows). **No boxed cards, no drop-shadows.** Depth is rules and whitespace.

7. **Whitespace as material** - `--section-gap` 6.5rem between beats, `--section-head-gap` 1.5rem under heads. Asymmetric columns: title left, mono meta/index right. Generous, unhurried, never centre-stacked.

8. **Green emphasis, never italic headers** - a single emphasized headline word takes the green (`--color-accent-ink`) or a green underline; the display face stays roman. Fraunces **italic is body-emphasis and pull-quotes only** (genre rule).

## Motion

Quiet and editorial. One orchestrated entrance per section (fade + ~10px rise, ease-out ~600ms) via a single `IntersectionObserver`. Hover: green underline-grow on links, a 1px rule shift toward green on index rows. **No bounce, no parallax, no autoplay, no marquee.** Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships fully visible and static.

## Anti-patterns

- **No warm paper** - Studio is cool (hue ~200-205); warm cream is Atelier/Garden vocabulary.
- **No pure `#fff` / `#000`** - cool studio-white and cool near-black only.
- **Never flatten Fraunces** - a low optical size kills the thick/thin contrast that defines the theme. Keep opsz high on the display.
- **No italic display headers** - roman only; italic is body emphasis (genre rule).
- **No green flood / neon green** - one deep botanical signal, < 5%. Green backgrounds or bright green break it.
- **No boxed cards, shadows, or glassmorphism** - hairlines and whitespace carry the page.
- **No centred-everything hero** - left-biased, title-left / meta-right.
- **No pill / gradient CTA** - one filled green button + typographic links.

## Macrostructure affinity / rejection

**Studio loves.**

- **Portfolio-grid / split-studio** - the selected-work case-study index (its native shape)
- **Index-first** - a numbered hairline project ledger
- **Type-specimen / Specimen** - Fraunces set big; the theme is specimen-capable
- **Photographic** - a studio shows its work; cool paper frames imagery cleanly
- **Manifesto** - a studio statement of approach in big composed serif (quiet register)

**Studio refuses.**

- **Workbench** - instrument-panel / dev-tool shape belongs to the cool-modern lane, not a studio
- **Bento Grid** - tiled product boxes fight the hairline editorial structure
- **Stat-Led** - a studio does not open with a dashboard of numbers
- **Conversational FAQ** - too chatty/support; Studio is curatorial

## Voice fixtures

Confident, spare, a little literary. Verbs over adjectives. Name the work.

- *"We design the things a brand is remembered by."*
- *"A small studio. Considered work."*
- *"Identity, editorial, and the space between."*
- *"Selected work - 2016 to present."*
- *"Set with care. Shipped with nerve."*

Never any of: *seamless, cutting-edge, disrupt, synergy, elevate, next-level, world-class, digital solutions*. Never "click here." Name the project, the discipline, the year.

## How Studio differs from neighbouring themes

| vs | what settles it instantly |
|---|---|
| **Garden** (green sibling) | Garden is a warm, botanical, organic nature register where green floods a soft world. Studio is a cool engineered studio-white where the same green is one restrained signal - agency, not garden. Temperature + role of the green settle it. |
| **Atelier** (quiet-serif sibling) | Atelier is the hushed, letter-shaped, small-serif personal practice. Studio is bigger and more confident - Fraunces at opsz 144, a work-index ledger, a green signal. Scale and structure settle it. |
| **Specimen** (Fraunces/high-contrast sibling) | Specimen exists to display a typeface (type is the subject). Studio uses Fraunces as its voice to present a studio's work (the studio is the subject). Same face possible, different subject. |

## Test brief expectations

Studio should be a candidate when the brief mentions:

- *design studio · creative studio · branding · brand identity · art direction · agency · portfolio · case study · selected work · editorial design · typography · creative direction · graphic design · design practice*
- Product categories: *design studio · creative/branding agency · art-direction shop · portfolio site · editorial/publishing practice*
- Emotional tone: *considered · crafted · confident · curatorial · high-contrast · editorial · tasteful · warm-precise*

Briefs that are dev-tool / enterprise / warm-consumer / loud-maximalist route elsewhere (the cool-modern lane for developer products, Carnival for loud editorial, Garden for organic/nature).

## Build hint

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-neutral);
       font-family: var(--font-body); font-weight: 400; }

/* Fraunces display - big, high-contrast, roman, tight */
.display { font-family: var(--font-display); font-weight: var(--display-weight);
           font-variation-settings: "opsz" 144, "SOFT" 30;
           font-size: var(--text-display); line-height: 0.98;
           letter-spacing: var(--tracking-display); color: var(--color-ink); }
.display .mark { color: var(--color-accent-ink); }        /* the one green signal */

/* Mono spec-sheet label */
.label { font: 500 0.75rem/1 var(--font-mono); text-transform: uppercase;
         letter-spacing: var(--tracking-label); color: var(--color-muted); }

/* Hairline index row - no cards, no shadow */
.row { border-top: 1px solid var(--color-rule); padding: 1.25rem 0; }

/* The one filled button - paper label, never green-on-green */
.btn--primary { background: var(--color-accent); color: var(--color-paper);
                border-radius: 4px; }

/* Reveal - the whole motion engine */
.reveal { opacity: 0; transform: translateY(10px);
          transition: opacity .6s cubic-bezier(0.16,1,0.3,1),
                      transform .6s cubic-bezier(0.16,1,0.3,1); }
.reveal.is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

Plus the Fraunces + Geist + Geist Mono link and the small reveal script.
