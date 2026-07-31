# Theme - Riso

Risograph-print register. The page for a **print fair, zine fest, small press, poster shop, illustration studio, art-book event** - warm blush stock, two saturated spot inks printed slightly out of register, paper you can almost smell. It reads like a soy-ink poster that got a URL: heavy grotesk headlines misregistered in cyan and pink, a serif lede, a machine-set catalogue underneath.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `riso`. Tokens: [`site/css/tokens.css`](../../../../site/css/tokens.css) `[data-theme="riso"]`. Reference build: [`site/examples/riso-01/`](../../../../site/examples/riso-01/) (an "OFF-REGISTER" risograph print fair - masthead, misregistered hero mark, exhibitor catalogue).

## Axes (diversification)

- **Paper band** - **mid warm pink stock**, `oklch(84% 0.048 30)`. True riso stock (real risograph paper ships saturated), ink `oklch(18% 0.060 30)` at 11.5:1. Not white, not cool - everything tinted hue 30.
- **Display style** - grotesk-sans: **Public Sans 800/900**, tight `--tracking-display: -0.04em`, `--lh-tight: 0.92`. Heavy poster grotesk, distinct from every serif-display sibling.
- **Accent hue** - cool riso blue, `oklch(46% 0.140 220)` (deep enough to hold a 3:1 focus ring on the pink stock), paired with riso yellow `oklch(78% 0.180 95)`. Two spot inks overprinted, never flooded; accent text runs >= 18px bold or sits on an ink underline.

## Reference register

Risotto Studio · Hato Press · Nieves · Colorama · People of Print · Present & Correct · Draw Down Books · It's Nice That · Printed Matter fairs.

The aesthetic: the risograph poster and small-press catalogue - warm stock, spot-colour duotone, deliberate misregistration, halftone grain, an inventory laid out like a listings page. Never name any of these in the output.

**Patron-saint reference (internal):** *a two-colour riso print that missed register by a hair* - the offset is the charm, not a defect. When in doubt, ask "does this look printed on a drum, or exported from a vector tool?" Keep the former.

## Required dependencies

1. **Fonts** - **Public Sans** (display 800/900 + labels), **Newsreader** (serif body/lede), **Geist Mono** (uppercase machine labels, captions, counts). Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;600;800;900&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Geist+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
   ```
2. **A small reveal script** - one `IntersectionObserver` adding `.is-in` (fade + ~10px rise, ease-out ~600ms). No autoplay, no loop.
3. **The `riso-mis` overprint** - a headline word / wordmark carries two offset echoes via `data-text` + `::before`/`::after`, `mix-blend-mode: multiply`. This is the theme's whole identity; ship it on at least the hero title and the masthead.

## Signature moves

1. **Off-register overprint (THE move)** - a key headline word and the wordmark get a misregistered echo: `::before` in riso blue `oklch(46% 0.140 220)` nudged up-left ~2px, `::after` in a riso pink nudged down-right ~2px, both `mix-blend-mode: multiply` over the black `data-text`. The colour fringes read as ink that missed the drum. Use on 1-2 focal words only, never every heading.

2. **Warm pink stock, never white** - ground is `oklch(84% 0.048 30)`, panels step to `--color-paper-2` / `--color-paper-3` (80% / 75%, same hue). Ink is warm near-black `oklch(18% 0.060 30)`, body `--color-neutral` `oklch(34% 0.060 30)`. Every neutral tilts hue 30.

3. **Two spot inks, overprinted and multiply-blended** - blue 220° + yellow 95° are the only colours. Where they cross, `mix-blend-mode: multiply` makes a third hue for free. The pure-CSS riso plate centrepiece = three ink shapes stacked, misregistered, multiplied, with a grain layer on top.

4. **Halftone / paper grain** - a faint noise or dot-grain overlay sits on the ink art (and optionally very lightly on paper) so fills read printed, not vector. Riso is the one editorial theme where texture belongs - keep it on the ink, subtle, never a loud full-page flood. Recipes and budget: [`texture.md`](../texture.md) § Grain and § Misregistration.

5. **Newspaper masthead + catalogue body** - N6 masthead: issue line (`Edition 04 · Govanhill · Free entry`), big wordmark, thin nav, double rule. The page body is a **Catalogue/Specimen** - a uniform, filterable grid of exhibitors/items. Riso is an index, not a sales pitch.

6. **Heavy grotesk over serif** - Public Sans 800/900 display at `-0.04em` and `--lh-tight: 0.92`; Newsreader serif for lede and running body at 45-75ch. The poster-headline / reading-serif contrast is load-bearing.

7. **Mono machine labels** - Geist Mono, UPPERCASE, `--tracking-label: 0.06em` for kickers, plate captions (`Plate 04 · 3 colours · 280 gsm`), item counts, meta. The print-shop readout voice against the grotesk.

8. **Spot highlight + hairlines, zero shadow** - single-accent `<mark>` band at x-height, `--color-rule` `oklch(70% 0.040 30)` hairlines, solid rectangle buttons. No boxed cards, no drop-shadow, no blur; depth comes from overprint and rule.

## Motion

Quiet and printed. Section reveals fade + rise once. The misregistration may settle on load (echoes drift a hair into their offset, then rest) but never loops. Hover: rule-colour shift to accent, mark-band grow. No bounce, no parallax, no autoplay. Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships the offsets static and fully visible.

## Anti-patterns

- **No clean vector flatness** - riso must show the offset fringe + grain. Perfectly-registered, texture-free fills read as generic and kill the theme.
- **No cool-white or pure-white paper** - that is Cobalt's ground. Riso paper is warm blush, hue 30.
- **No pure `#000` ink** - warm near-black `oklch(18% 0.060 30)`.
- **No gradient / glow / neon / aurora-mesh** - riso is flat spot inks multiplied, not RGB light. Colour comes from overprint, not luminance.
- **No drop shadows, no boxed or card-in-card layouts** - hairlines and overprint carry structure.
- **No floating pill nav, no pill-gradient CTA** - masthead + a solid rectangle button.
- **Don't drown the page in ink** - two spot colours as accents (< ~15% of any viewport); the blush paper stays dominant.
- **Don't borrow Carnival's kit** - its offset is a hard solid box-shadow and its duo is mustard/oxblood. Riso's offset is ink misregistration; its duo is blue/yellow. Keep them apart.

## Macrostructure affinity / rejection

**Riso loves these.**

- **Catalogue** - the exhibitor / item / stockist index grid *(canonical - riso-01)*
- **Specimen** - a type or print specimen shown in overprint
- **Marquee Hero** - one big off-register poster statement above the fold
- **Type-specimen** - the grotesk face demoed in spot colour
- **Manifesto** - a loud printed statement page (print-fair voice)

**Riso refuses these.**

- **Workbench / component-playground** - too instrument-panel; that is Cobalt's shape
- **Conversational FAQ** - too chatty-product for a print object
- **Photographic** - riso leads with printed ink art, not photography
- **Stat-Led / Bento dashboard** - riso is a printed page, not a metrics grid

## Voice fixtures

Specific, hand-set, a little literary. Verbs and counts over adjectives.

- *"Thirty-four studios. Eight presses. Soy ink everywhere."*
- *"Design like print: warm, off-register, intentional."*
- *"One drum at a time."*
- *"Fluorescent pink that won't sit still, teal that bleeds a hair past its edge."*
- *"Free entry - first 200 get a printed map."*

Never any of: *seamless, cutting-edge, revolutionary, synergy, leverage, premium, glossy, pixel-perfect*. Never "click here." Riso is deliberately imperfect - never sell it as flawless.

## How Riso differs from neighbouring themes

| vs | what settles it instantly |
|---|---|
| **Carnival** (loud editorial sibling) | Carnival = duotone mustard + oxblood, chunky variable display, hard-offset **box-shadow**, decorative ornaments. Riso = blue + yellow **spot inks**, off-register overprint + grain (misregistration, not a solid shadow), warm pink stock. Offset-as-ink vs offset-as-shadow. |
| **Newsprint** (paper sibling) | Newsprint = warm cream stock, columns, one-brick ink-only restraint (no spot colour). Riso = warm pink stock + two saturated spot inks (blue + yellow) + printed grain. Spot colour and print-artifact texture settle it. |
| **Brutal** (editorial sibling) | Brutal = raw system type, hard mono borders, cold. Riso = crafted print object - grotesk + serif, spot inks, grain, warmth. Craft and colour vs raw and monochrome. |

## Test brief expectations

Riso should be a candidate when the brief mentions:

- *risograph · riso · print fair · zine · zine fest · small press · letterpress · screenprint · poster · gig poster · art book · book fair · spot colour · illustration studio · indie press · DIY · print studio · stockist*
- Product categories: *print fair · zine fest · art-book event · poster shop · illustration / print studio · indie publisher · creative-studio event*
- Emotional tone: *warm · tactile · handmade · off-register · analog · spot-colour · playful-craft · printed*

Briefs that are cool/technical route to Cobalt; loud-decorative editorial routes to Carnival; grey ink-only routes to Newsprint. When the brief wants ink on warm stock with a colour that misses register, it is Riso.

## Build hint

The first lines of CSS establish Riso's anchor moves:

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink);
       font-family: var(--font-body); font-weight: 400; }

/* Grotesk display, tight and heavy */
.display { font-family: var(--font-display); font-weight: var(--display-weight);
           letter-spacing: var(--tracking-display); line-height: var(--lh-tight); }

/* THE move - off-register overprint via data-text echoes */
.riso-mis { position: relative; color: var(--color-ink); }
.riso-mis::before, .riso-mis::after {
  content: attr(data-text); position: absolute; inset: 0;
  mix-blend-mode: multiply; pointer-events: none; }
.riso-mis::before { color: var(--color-accent);  transform: translate(-2px, -2px); } /* riso blue */
.riso-mis::after  { color: oklch(64% 0.19 12);   transform: translate( 2px,  2px); } /* pink */

/* Hairlines + solid rectangle button, never a pill or shadow */
.rule { border-top: 1px solid var(--color-rule); }
.btn--solid { background: var(--color-accent); color: var(--color-paper); border-radius: 2px; }
mark { background: var(--color-accent-2); color: var(--color-ink); } /* yellow band at x-height */

@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; } }
```

Plus the Public Sans + Newsreader + Geist Mono link and the small reveal script. Reference build: [`site/examples/riso-01/`](../../../../site/examples/riso-01/) (built on the pre-2026-07 tokens; example builds are dated artifacts and are never retro-edited when a theme’s tokens move) - match its register (tokens, voice, motion feel), never its composition; reusing its section order, hero geometry, or grid is a gate-32-grade repeat.
