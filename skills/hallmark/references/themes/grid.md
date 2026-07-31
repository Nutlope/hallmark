# Theme - Grid

Swiss / neo-grotesque systems design. The page for a **design studio, an identity or signage practice, a type specimen, an institutional index, an editorial programme** - the object-poster / transit-signage school, executed on a **near-white cool sheet with an exposed 12-column hairline grid, one heavy grotesk, and exactly ONE signal red used as a geometric mark**. Giant lowercase Archivo 800 slams to the left margin, the column rules stay visible behind the content, and every surface butts against a hairline. It reads like a wayfinding manual: rational, gridded, set once and built to outlast its brief.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `grid`. Tokens: `site/css/tokens.css` under `[data-theme="grid"]`. Reference build: `site/examples/grid-01/`.

> **The editorial exception.** The editorial cluster is otherwise serif-led (Newsprint, Editorial, Specimen). Grid is its Swiss neo-grotesque slot: no serif anywhere, structure carried by an exposed grid and hairlines, warmth carried by one red. If it wants a roman serif or a soft column, it is a different editorial theme.

## Axes (diversification)

- **Paper band** - **light**, cool near-white (`--color-paper: oklch(99% 0.003 255)`, faint cool, never `#fff`). Stepped at `paper-2 97.2%` / `paper-3 94.5%`. Ink is cool near-black `--color-ink: oklch(16% 0.010 255)`.
- **Display style** - **grotesk-heavy** (Archivo **800**, `--display-weight: 800`), run **lowercase** at `--tracking-display: -0.045em`. Heavy + lowercase is the differentiator against every uppercase-condensed and serif option.
- **Accent hue** - **warm signal red** (`--color-accent: oklch(55% 0.21 28)`). One saturated red (~28 deg), used as a square, a bar, a period; never a wash. `--color-focus` is the same red.

## Reference register

Vitra, Braun, the Vignelli canon, Museum fur Gestaltung, the Swiss International poster tradition. The aesthetic: the institutional identity manual and the transit-signage system - a modular grid drawn in public, one grotesk, one red, no image needed. **Patron-saint (internal):** *a signage manual crossed with a printed grid specimen* - rules visible, type as structure, red as the only warm mark. When in doubt ask "does this read like a systems manual, or like a marketing template?" Keep the former. **Never name any of these in the output.**

## Required dependencies

1. **Fonts** - **Archivo** only, one family across display / body / labels (400/500/600/700/800). No serif, no mono in use: `--font-serif` and `--font-mono` resolve to unused fallbacks - do **not** load them. Google Fonts (exactly the canonical link):
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
   ```
2. **No reveal script required.** The build is static; motion is hover-only (see Motion). If a reveal is added, it must gate behind `prefers-reduced-motion: no-preference` and ship static + visible otherwise.

## Signature moves

1. **The exposed 12-column hairline grid - THE move.** An absolutely-positioned `.rails__inner` paints a `repeating-linear-gradient` of 1px `--color-rule` lines every `calc(100% / 12)`, sitting behind the content at `z-index: 0`. The grid is visible, not scaffolding to remove. Content rides a `grid-template-columns: repeat(12, minmax(0,1fr))` on top.

2. **One typeface, whole page.** Archivo carries display (800), body (400), and the caps labels. Swiss discipline comes from weight, scale, and tracking - not from a second family. No serif contrast, no mono voice.

3. **Giant lowercase display, slammed left, with a red square period.** `--text-display` (`clamp(52px, 10.5vw, 136px)`), weight 800, `letter-spacing: -0.045em`, `line-height: 0.9`, `text-transform: lowercase`. A solid `0.52em` red square (`.hero__period`) sits inline where a full stop would - the theme's mark.

4. **Red only as a geometric mark, under 5% of any viewport.** A square period, a `12px` red block ending the first index row (`.row__mark span`), a `3px × 96px` red bar over the contact head (`.contact__rule`), a red period on the position line. Never a fill wash, never a second colour.

5. **Hairlines + ink section-rules do all structure; zero cards.** `--radius-card: 0`, `--shadow-card: none`. Faint `--color-rule` hairlines split cells; a `1px`-to-`2px` solid `--color-ink` rule tops each section and the index. Content butts flush to the rule - no boxes, no float, no drop-shadow.

6. **Cellular chrome: nav and footer are bands of equal cells.** The sticky `.topbar` is `border-block: 1px solid var(--color-ink)`; each cell is `grid-column: span 2` (mark spans 4) divided by `border-inline-start: 1px solid` the hairline. The footer repeats the pattern at `span 3`. A DE / EN toggle sits in the last cell.

7. **The work index: numbered full-width rows on the 12-col grid.** `no` span 1 / `title` span 7 / `meta` span 3 / `mark` span 1, split by hairlines, topped by a `2px` ink rule. Hover tints the row (`--color-paper-2`) and nudges the title `translateX(8px)`.

8. **Caps labels as numbered eyebrows.** Section heads open with an Archivo uppercase label, `12px`, weight 600, `letter-spacing: 0.09em`, `--color-muted`, numbered `01 · Practice` / `02 · Selected work`. The quiet caps counterpoint to the giant lowercase display.

## Motion

Near-zero. No reveals, no parallax, no autoplay. The only motion is hover micro-state: row background shifts to `--color-paper-2` and the title slides `8px`; nav links underline; the contact mail border shifts to red; `::selection` is red on paper. Smooth scroll only. Everything transitions in ~0.18-0.2s ease; `prefers-reduced-motion: reduce` kills transitions and `scroll-behavior`.

## Anti-patterns

- **No uppercase display.** Grid's display is **lowercase**; uppercase-condensed is Manifesto / Brutal.
- **No dark ground.** Grid is a light 99% sheet - a dark statement page is Manifesto.
- **No thick 3px black rules boxing solid blocks.** That marker-weight structure is Brutal; Grid draws with a 1px pencil and lets the column grid show.
- **No hiding the grid.** The rails stay visible - the grid is content, not a layout aid to delete.
- **No second accent, no gradient, no red wash.** One red, geometric, under 5%.
- **No cards, radius, or drop-shadow.** `--radius-card: 0`, `--shadow-card: none`; depth is hairlines and ink rules.
- **No serif and no mono body.** One grotesque only; do not reach for `--font-serif` / `--font-mono`.
- **No centred hero.** Slam left, edge-aligned to the grid.

## Macrostructure affinity + rejection

**Grid loves:** **Manifesto** (a gridded statement, red period as climax) · **Specimen** (type on a visible grid) · **Long Document** (an editorial column programme) · **Stat-Led** (figures in bordered cells, caps labels beneath) · the numbered **Index / directory** shape (the canonical work index).

**Grid refuses:** **Photographic / image-led** (Grid is type + rule, not imagery) · **Letter** (too intimate; Grid is an institution, not a note) · **Marquee with a product mock** (Grid shows the system, not a screenshot) · anything wanting soft rounded tiles or a consumer-warm bento.

## Voice fixtures

Rational, plainspoken, institutional. Name the system concretely. No hype.

- *"Structure before surface."*
- *"We draw the grid first, so every decision after it has somewhere to stand."*
- *"A grid is not decoration. It is a decision made once, in public."*
- *"The system has to survive twenty years of new hands and new content."*
- *"Identity, wayfinding, and editorial systems for institutions that plan in decades."*

Never any of: *seamless, robust, cutting-edge, leverage, synergy, revolutionary, unlock, supercharge, elevate, curated, bespoke*. Never "click here." Name the practice, the place, the year.

## How Grid differs from neighbouring themes

| vs | difference |
|---|---|
| **Manifesto** (dark poster) | Manifesto is a **dark** ground (`oklch(10% 0.005 60)`), Anton 400 **uppercase** at `--lh-tight: 0.86`, red `#E51A1A`. Grid is a **light** sheet (`oklch(99% 0.003 255)`), Archivo **800 lowercase**, red `oklch(55% 0.21 28)`. Same "one red, type carries it" DNA - opposite value and case. |
| **Cobalt** (cool dev-tool) | Cobalt is modern-minimal: accent electric **cobalt** `oklch(58% 0.20 256)`, Space Grotesk + JetBrains Mono, a dark graphite code-card hero, 6-10px radii, one dark band. Grid is editorial: **red** accent, single-family Archivo, an exposed 12-col grid, **zero radius**, no code, no dark band. Blue instrument vs red Swiss manual. |
| **Brutal** (heavy sans) | Both are light near-neutral sheets with one red and zero radius, but Brutal draws with **3px** black rules (`--color-rule: oklch(12%)`) boxing solid inverted blocks in Albert Sans 700 **uppercase**. Grid draws with **1px** hairlines (`--color-rule: oklch(88%)`) painting a **visible column grid**, Archivo 800 **lowercase**, no solid panels. Marker vs pencil; shout vs quiet. |

## Test brief expectations

Grid should be a candidate when the brief mentions:

- *identity · brand system · wayfinding · signage · design studio · type specimen · editorial grid · institution · museum · archive · index · directory · systems · modular · Swiss · grotesque · manual · programme*
- Product categories: *design / branding studio · cultural institution · publisher · specimen or catalog · portfolio index*
- Emotional tone: *rational · systematic · precise · institutional · disciplined · timeless · calm-authoritative*

Briefs that are warm / consumer / image-led / serif-editorial route elsewhere (the serif editorial themes for prose, Cobalt for dev tools). When the brief wants a **visible grid, one grotesk, and one red**, it is Grid.

## Build hint

The first lines of CSS establish Grid's anchor moves:

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink);
       font-family: var(--font-body); font-size: 16px; line-height: 1.5; }

/* THE move: the exposed 12-column hairline grid, painted behind content */
.rails__inner {
  height: 100%; max-width: 1280px; margin-inline: auto;
  background-image: repeating-linear-gradient(to right,
    var(--color-rule) 0, var(--color-rule) 1px,
    transparent 1px, transparent calc(100% / 12));
}
.grid { display: grid; grid-template-columns: repeat(12, minmax(0,1fr)); gap: 0; }

/* Giant lowercase display, slammed left, with the red square period */
.hero__title { font-family: var(--font-display); font-weight: var(--display-weight);
  font-size: clamp(52px, 10.5vw, 136px); letter-spacing: var(--tracking-display);
  line-height: 0.9; text-transform: lowercase; }
.hero__period { display: inline-block; width: 0.52em; height: 0.52em;
  background: var(--color-accent); }   /* the one signal, as a mark */

/* Sections butt against ink rules: zero cards, zero radius, zero shadow */
.band, .work, .contact { border-top: 1px solid var(--color-ink); }
::selection { background: var(--color-accent); color: var(--color-accent-ink); }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  * { transition-duration: 0.01ms !important; }
}
```

Plus the Archivo link above (Archivo only). Reference build: `site/examples/grid-01/` - match its register (tokens, voice, motion feel), never its composition; reusing its section order, hero geometry, or grid is a gate-32-grade repeat.
