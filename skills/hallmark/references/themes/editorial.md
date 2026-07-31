# Theme - Editorial

The contemporary magazine, set for the screen. The page for a **culture or fashion magazine, a design annual, an interview series, a longform feature, a considered content-marketing piece** - the modern editorial-spread school, executed on **warm cream with a heavy condensed-sans headline answered by a Playfair Display italic aside**. Inter Tight 800 crashes tight against the left margin (tracking `-0.04em`); a serif-italic pull-quote answers it; hairline rules and Roman-numeral folios carry the structure. It reads like a well-art-directed feature: stylish, type-forward, warm but crisp.

Loaded eagerly by SKILL.md Step 3 whenever the catalog pick is `editorial`. The OKLCH palette + font stack live in [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="editorial"]`. No canonical example folder yet - build to this spec.

## Axes (diversification)

- **Paper band** - warm cream, light (`--color-paper: oklch(94% 0.020 75)`). A hair darker and a hair cooler than Specimen's oat (96%, hue 80); never `#fff`, never a neutral grey.
- **Display style** - **display-condensed sans** (Inter Tight, `--display-weight: 800`). A heavy, tight grotesque set at `--tracking-display: -0.04em` - magazine-shaped. Never a serif display; the serif appears only as italic emphasis.
- **Accent hue** - **warm coral** (`--color-accent: oklch(60% 0.160 35)`). Pinker and softer than Specimen's signal orange, far brighter than Newsprint's dried brick. A signal on marks and fills, never a flood.

## Reference register

The Gentlewoman · Racquet · MOLD · AIGA Eye on Design · Dazed · i-D · Wallpaper* · The Face · Are.na blog · Family Style.

The aesthetic: the contemporary art-directed feature spread - a tight grotesque headline against a Didone italic pull-quote, cream margins, hairline furniture, one warm mark. **Never name any of these in the output.**

**Patron-saint reference (internal):** *a culture magazine's feature opener* - Inter Tight slammed left, a Playfair italic aside in the margin, mono folios, one coral tick. When in doubt ask "does this read like an art-directed feature, or a marketing template?" Keep the former.

## Required dependencies

1. **Fonts** - **Inter Tight** (display, 700/800), **Inter** (body, 400/500/600), **Playfair Display** (italic emphasis + pull-quotes, 400/500/600 italic), **Geist Mono** (folios, labels, meta). Google Fonts:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@600;700;800&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,500;1,400;1,500;1,600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet">
   ```
2. **A small reveal script** - one `IntersectionObserver` adding `.is-in` (fade + ~10px rise, `--ease-out`, ~600ms). Optional one-shot: a single pull-quote that settles once, then static. No other required JS - Editorial is a reading page, not a tool.

## Signature moves

1. **Two-axis type: heavy condensed sans display + Playfair italic aside.** THE move. Headlines are Inter Tight `--display-weight: 800` at `--text-display: clamp(2.5rem, 5vw + 0.75rem, 4.75rem)`, `--tracking-display: -0.04em`, slammed left. Inside a head, or as a pull-quote, single words or a clause switch to **Playfair Display italic** (`--font-serif`). The grotesque-against-Didone-italic tension is the whole voice. Body stays plain Inter.

2. **Warm cream paper, cool-tilted ink, never `#fff` / `#000`.** Paper `oklch(94% 0.020 75)`; the deepest ink `--color-ink: oklch(15% 0.014 280)` carries a faint **cool** tilt (hue 280) - printed-black on warm cream. Body sits up at `--color-ink-2: oklch(28% 0.014 55)`, meta at `--color-muted: oklch(48% 0.014 60)` (warm). The cool ink over warm paper is a deliberate print detail, not a mistake.

3. **One coral signal, < 5% of any viewport.** `--color-accent: oklch(60% 0.160 35)` on the eyebrow tick, a link underline, one CTA, a folio mark, `--color-focus: oklch(62% 0.160 35)` rings. On a coral **fill** (a tag, a kicker block) text is `--color-accent-ink: oklch(98% 0.005 70)` (near-white). Coral never floods a full band and never fills behind body type.

4. **Square everything - radius 0.** `--radius-card: 0`, `--radius-pill: 0`, `--radius-input: 0`. Buttons, tags, inputs, kicker blocks are sharp rectangles. Magazine furniture is set in square blocks, never pills or soft radii.

5. **0.5px hairlines + asymmetric grid, no cards.** `--rule-card: 0.5px` (`--color-rule: oklch(80% 0.018 70)`); heavier splits use `--color-rule-2: oklch(64% 0.014 68)`. Columns run asymmetric (2:5, 3:7), the hero is left-biased, `--section-gap: 6rem`, `--section-head-gap: 1.5rem`. Structure is rules and columns - **no boxed cards, no shadow, no blur**.

6. **Roman-numeral marginalia + mono folios.** Sections carry Roman numerals (I, II, III) and Geist Mono labels (`--font-mono`, UPPERCASE, `--tracking-label: 0.10em`, `--color-muted`) marching down the margin like a contents/folio system. The mono machine-voice against the tight display is the second register.

7. **Serif-italic pull-quotes hung between hairlines.** Playfair Display italic set large is the pull-quote and emphasis register - it hangs between a top-and-bottom hairline with a coral indent, never in a box. The serif is italic emphasis only, never the display face (global rule).

## Motion

Quiet and composed. One orchestrated entrance: section reveals fade + rise (`--ease-out`, ~600ms). Optionally a single pull-quote that settles once, then holds. Hover: coral underline-grow on links; a hairline shift toward coral on focusable surfaces. No bounce, no parallax, no autoplay. Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static and fully visible.

## Anti-patterns

- **No serif display face.** Inter Tight (sans) carries every headline; Playfair appears only as italic emphasis. A serif headline reads as Newsprint / Specimen / Atelier.
- **No rounded corners, pills, or shadows.** Radius is 0 everywhere; soft pills are modern-minimal (Coral) vocabulary.
- **No pure `#fff` paper / `#000` ink.** Warm cream, cool-tilted near-black.
- **No orange or brick drift.** Keep the accent coral (hue 35, chroma 0.16) - not Specimen's redder orange, not Newsprint's dark brick, not terracotta.
- **No centred masthead.** That is Newsprint's broadsheet move; Editorial is left-biased and asymmetric.
- **No dark ground.** Editorial is light cream; a dark statement page is Manifesto.
- **No ALL-CAPS Anton shout.** Inter Tight runs title-case and tight, magazine-modern, not a broadside.
- **No glassmorphism, gradient text, mesh/aurora blob, or background texture.** Cream + 0.5px hairlines + one coral mark carry it.

## Macrostructure affinity / rejection

**Editorial loves:** **Long Document** *(the feature essay - drop cap, columns, pull-quotes)* · **Photographic** (a modern feature opener: photo + tight-sans headline crashing over it) · **Quote-Led** (Playfair italic pull-quotes are native furniture) · **index-first** (a magazine contents / issue index) · **Letter** (an editor's note).

**Editorial refuses:** **Workbench / component-playground** (tool-first apparatus, route Cobalt) · **Bento Grid** (modular product tiles, too SaaS for a spread) · **Stat-Led** (numbers-first dashboard) · **Conversational FAQ** (too chatty; the feature is composed, not a chat).

## Voice fixtures

Considered, contemporary, lightly literary. Verbs over adjectives; name the piece, the issue, the byline.

- *"The issue, set in tight type."*
- *"A feature, composed like a spread."*
- *"Grotesque headline. Didone aside. One coral mark."*
- *"Read it the way it was set: hairlines, columns, cream margins."*
- *"Culture, filed and art-directed."*

Never any of: *seamless, robust, cutting-edge, leverage, synergy, elevate, unlock, supercharge, curated, storytelling journey*. Never "click here" - name the piece or the section.

## How Editorial differs from neighbouring themes

| vs | what settles it instantly |
|---|---|
| **Specimen** (warm-paper editorial sibling) | Specimen shows a **serif display** at scale (Fraunces light 340) over sans body, signal orange. Editorial shows a **heavy condensed sans** display (Inter Tight 800) with Playfair as an italic garnish, coral. Thin-serif-head vs heavy-sans-head. |
| **Newsprint** (warm-paper broadsheet) | Newsprint is all-serif (Playfair Didone head + Crimson body), a **centred** masthead, columns, brick. Editorial is sans head + sans body, **left-biased** asymmetric hero, coral. Broadsheet-serif vs magazine-sans. |
| **Manifesto** (condensed-display sibling) | Both use a condensed display, but Manifesto is **dark** ground + Anton **UPPERCASE** + red. Editorial is **light** cream + Inter Tight **title-case** + coral. Light-vs-dark and caps-vs-titlecase settle it. |

## Test brief expectations

Editorial is a candidate when the brief mentions:

- *magazine · editorial · feature · culture · fashion · design annual · interview series · longform · publication · issue · contemporary · art direction · profile · lookbook · brand story · content · considered*
- Product categories: *culture / fashion magazine · digital publication · design annual · interview series · editorial content site · brand editorial / content-marketing · agency journal*
- Emotional tone: *considered · contemporary · stylish · type-forward · confident · magazine-modern · warm-but-crisp*

Route elsewhere: broadsheet / journalism -> Newsprint; type foundry / quiet portfolio -> Specimen; loud declaration -> Manifesto; dev / API -> Cobalt.

## Build hint

The first lines of CSS establish Editorial's anchor moves:

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-body); font-weight: 400; }

/* Two-axis display: heavy condensed sans, tight, slammed left */
.display { font-family: var(--font-display); font-weight: var(--display-weight); /* 800 */
           font-size: var(--text-display); letter-spacing: var(--tracking-display); /* -0.04em */
           color: var(--color-ink); text-align: left; text-wrap: balance; }
.display em, .pull { font-family: var(--font-serif); font-style: italic; /* Playfair aside */
                     font-weight: 500; letter-spacing: var(--tracking-tight); }

/* Mono folio + Roman-numeral marginalia */
.folio { font-family: var(--font-mono); text-transform: uppercase;
         letter-spacing: var(--tracking-label); color: var(--color-muted); }

/* Square everything, hairlines carry structure */
.card { border: var(--rule-card) solid var(--color-rule); border-radius: var(--radius-card); } /* 0.5px, 0 */
.tag { background: var(--color-accent); color: var(--color-accent-ink); border-radius: 0; } /* one coral fill */

/* The one coral signal */
a { text-decoration-color: var(--color-accent); }
:focus-visible { outline: 2px solid var(--color-focus); }

.reveal { opacity: 0; transform: translateY(10px);
          transition: opacity .6s var(--ease-out), transform .6s var(--ease-out); }
.reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }
```

Plus the Inter Tight + Inter + Playfair Display + Geist Mono link and the small reveal script.
