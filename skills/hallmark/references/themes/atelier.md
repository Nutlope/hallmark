# Theme - Atelier

The considered-object page: a fashion house, a fragrance, a gallery or exhibition, a furniture / ceramics / architecture studio, a made-in-small-numbers brand story. The Aesop / couture-masthead / gallery-placard school, rendered in **warm plaster and umber** - not cream, not grey. A near-neutral plaster ground (`oklch(94% 0.005 60)`), one **fat high-contrast Didone masthead** (Playfair Display 900, optical 144), grotesk captions, wide-tracked mono placards, and a single amber ember for the only warm signal. It reads hand-set and unhurried: an object *presented*, never sold.

Loaded eagerly by SKILL.md Step 3 whenever the catalog pick is `atelier`. The OKLCH palette + font stack live in [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="atelier"]`.

## Axes (diversification)

- **Paper band** - light (94%). Plaster near-neutral: `oklch(94% 0.005 60)`, steps to `oklch(91% 0.006 60)` and `oklch(87% 0.008 55)`. Warm hue 60 held at almost-zero chroma - unbleached linen, distinct from Garden's oat (chroma 0.022) and Newsprint's tan (0.045).
- **Display style** - high-contrast serif (Playfair). Playfair Display at weight **900**, optical size **144**, tracking `-0.018em` - a fatface Didone (hair-thin serifs against fat verticals). Not Specimen's light Fraunces (340), not a thin Vogue-hairline cut.
- **Accent hue** - warm umber (~40 deg, low chroma). The `--color-accent` is nearly ink-dark umber `oklch(22% 0.060 40)`; the one *visible* signal is `--color-accent-ink` / `--color-focus` = amber `oklch(45% 0.13 60)`.

## Reference register

Aesop · a couture / fashion-house masthead · gallery + museum exhibition pages · Kinfolk / Cereal editorial · Studio Nicholson, The Row, Toteme · Frama, Byredo, Le Labo · an architecture-studio portfolio.

The aesthetic: the object presented under a dramatic serif crown with a spec-sheet caption - warm plaster canvas, hairline structure, one amber ember, imagery treated like a gallery print. **Never name any of these in the output.**

**Patron-saint reference (internal):** *Aesop's product-as-object restraint* + *a couture magazine masthead*, recoloured plaster-and-umber. When in doubt ask "does this read like a gallery placard, or like a product ad?" Keep the former.

## Required dependencies

1. **Fonts** - **Playfair Display** (display, 900, optical axis), **Hanken Grotesk** (body, 400/500/600), **IBM Plex Mono** (labels/meta, UPPERCASE). Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:opsz,wght@5..1200,400..900&family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
   ```
2. **A small reveal script** - one `IntersectionObserver` adding `.is-in` (fade + ~10px rise, ease-out ~600ms). Optionally a one-shot masked curtain-wipe (clip-path) on the masthead, then static.

## Signature moves

1. **Plaster paper, warm near-neutral, never white.** `--color-paper: oklch(94% 0.005 60)`, surfaces to `91%` / `87%`. Ink is warm near-black umber `--color-ink: oklch(12% 0.024 40)`; body sits at `--color-neutral: oklch(28% 0.014 45)`. The whole page reads unbleached-linen warm - not grey, not cream, never `#fff`.

2. **The Didone masthead is the hero.** Playfair Display at weight `var(--display-weight)` = 900, `font-variation-settings: "opsz" 144`, tracking `-0.018em`, clamped to `6.25rem` via `--text-display`. One large fatface line, set LEFT or broadsheet-centred, carries the page's entire gravity. Nothing competes with it.

3. **Monochrome-umber, amber only as a whisper.** `--color-accent: oklch(22% 0.060 40)` is nearly ink-dark - use it as a fill/ink block or a heavy rule, **not** a bright pop. The single warm signal is amber `oklch(45% 0.13 60)` (`--color-accent-ink` / `--color-focus`): a link underline, a focus ring, a drop-cap, one `<mark>`. Keep it under 4% of any viewport - the page is warm-monochrome with one ember.

4. **Wide-tracked mono placards.** Eyebrows, section numbers, captions, spec meta in IBM Plex Mono (`--font-label`), UPPERCASE, tracking `0.24em` (`--tracking-label`). The machine-precise gallery-placard voice under the couture Didone - material, dimensions, year, edition.

5. **Grotesk body under the serif crown.** Hanken Grotesk 400/500 body at `--lh-normal: 1.55` / `--lh-relaxed: 1.7`, `--measure: 56ch`. The triad - fat Didone display + neutral grotesk body + wide mono labels - **is** Atelier. Never set running body in the serif (that move belongs to Newsprint).

6. **Hairlines, generous air, asymmetric columns.** 1px `--color-rule: oklch(78% 0.006 55)` for fine rules, `--color-rule-2: oklch(56% 0.008 50)` for a section divider or double-rule. No boxed cards, no drop-shadows, no glass. `--section-gap: 6.5rem`, `--page-max: 64rem`. Depth comes from rules + whitespace only.

7. **The object presented, not sold.** Compose like a lookbook or exhibition index: a named object, a drop-cap opening, a numbered index, imagery treated as a gallery print (generous margin, hairline frame). CTAs are text-underline or a hairline-outline at a small (2-4px) radius - never a filled amber blob.

## Motion

Quiet and orchestrated. One entrance: the masthead's masked curtain-wipe (or a plain fade), section reveals fade + rise, an amber underline-grow on link hover. **No bounce, no parallax, no autoplay, no marquee.** Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static + fully visible.

## Anti-patterns

- **No bright saturated pop.** The umber accent is near-ink; amber is a whisper. No orange (Specimen), no oxblood red (Newsprint), no green (Garden / Studio).
- **No serif running body.** Body is Hanken Grotesk. Playfair in paragraphs reads broadsheet - that is Newsprint, wrong theme.
- **No warm-tan or cream newspaper stock.** Atelier's paper is near-neutral plaster (chroma 0.005), not oat (0.022) or tan (0.045).
- **No thin / hairline Didone masthead.** Atelier's Playfair is FAT (900). A light cut collides with Specimen's Fraunces 340 and reads generic-luxury.
- **No boxed cards, drop-shadows, or glassmorphism.** Hairlines + air carry every surface.
- **No filled-pill or gradient CTA.** Underline or hairline-outline at small radius. Name the object / the collection.
- **No pure `#fff` / `#000`, no centred three-icon-tile feature grid, no background texture or pattern.**

## Macrostructure affinity / rejection

**Loves:** **Specimen** (the Didone as its own subject) · **Photographic** (lookbook / gallery imagery, object-led) · **Catalogue** (a numbered index of objects or works) · **Letter** (intimate, hand-set; Ft6 letter close) · **Long Document** (a considered magazine feature or essay).

**Refuses:** **Bento Grid** (modular tiles fight the broadsheet restraint) · **Stat-Led** (big-number KPI dashboards are enterprise, not gallery) · **Workbench / component-playground** (instrument-panel dev-tool shape is Cobalt's) · **Marquee Hero** (kinetic scroll is too loud for one quiet curtain).

## Voice fixtures

Hand-set, literary, object-precise, couture-calm. Verbs over adjectives; name the object.

- *"Made in small numbers, by hand, in Lisbon."*
- *"One coat. Twelve hours. A finish that keeps."*
- *"The 04 chair, in oiled ash."*
- *"We compose a scent the way a printer composes a page."*
- *"Nothing added that the object did not ask for."*

Never: *seamless, elevate, curated, bespoke, luxury, effortless, game-changing, must-have.* Never "shop now" / "buy now" - say "See the collection" or name the piece.

## How Atelier differs from neighbouring themes

| vs | what settles it instantly |
|---|---|
| **Newsprint** (shares Playfair Display) | Newsprint is Playfair **700** + Crimson Pro **serif body** + warm-tan stock (`oklch(92% 0.045 50)`) + oxblood accent - a broadsheet. Atelier is Playfair **900** fatface + **grotesk body** (Hanken) + near-neutral plaster + amber whisper. Body face + paper warmth settle it. |
| **Specimen** (serif-display sibling) | Specimen is **light** Fraunces (340) + bright **orange** (`#FC4C02`) on warm paper - a type showcase. Atelier is **fat** Playfair (900) + warm-monochrome umber. Display weight + accent hue settle it. |
| **Garden** (same 94% paper band) | Garden is Young Serif + oat cream + living **leaf-green**, botanical and organic. Atelier is a high-contrast Didone on near-neutral plaster with **no green** - gallery, not garden. |

## Test brief expectations

Atelier is a candidate when the brief mentions:

- *fashion · atelier · couture · fragrance / perfume · gallery · exhibition · museum · ceramics · furniture · homeware · architecture studio · design studio · lookbook · collection · made by hand · craft · small-batch · editorial feature · brand story*
- Product categories: *fashion / apparel brand · fragrance house · gallery or museum · furniture / homeware · architecture or interior studio · design-studio portfolio · considered B2C brand story*
- Emotional tone: *refined · hand-set · warm-monochrome · gallery-quiet · considered · understated · unhurried*

Briefs that are developer / enterprise / dashboard route elsewhere (Cobalt, Almanac); loud-maximalist editorial routes to Carnival; broadsheet news routes to Newsprint.

## Build hint

The first lines of CSS establish Atelier's anchor moves:

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-neutral);
       font-family: var(--font-body); font-weight: 400; line-height: var(--lh-normal); }

/* The fatface Didone masthead - the page's whole gravity */
.masthead { font-family: var(--font-display); font-weight: var(--display-weight);
            font-variation-settings: "opsz" var(--display-optical);
            font-size: var(--text-display); letter-spacing: var(--tracking-display);
            line-height: var(--lh-tight); color: var(--color-ink); }

/* Wide-tracked mono placard */
.placard { font: 500 0.75rem/1 var(--font-label); text-transform: uppercase;
           letter-spacing: var(--tracking-label); color: var(--color-muted); }

/* Hairlines + the one amber ember */
.rule { border: 0; border-top: 1px solid var(--color-rule); }
a { color: inherit; text-decoration-color: var(--color-accent-ink); }
:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }

/* Reveal - the whole motion engine */
.reveal { opacity: 0; transform: translateY(10px);
          transition: opacity .6s cubic-bezier(0.16,1,0.3,1),
                      transform .6s cubic-bezier(0.16,1,0.3,1); }
.reveal.is-in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

Plus the Playfair Display + Hanken Grotesk + IBM Plex Mono link and the small reveal script.
