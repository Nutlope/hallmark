# Theme - Field

Warm, credible, hand-drawn SaaS. The page for a **productivity / collaboration / notes / meetings / small-team** product that wants to feel friendly **and** serious - the warm-cream playful lane, executed as **calm marigold-on-cream, one signal accent, hand-drawn ink**. Cream paper, a Source Serif headline over Public Sans body, a marigold highlighter behind one phrase, and a tilted content artifact (a sticky note, not app chrome). It reads like a plain-spoken team that ships.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `field`. Tokens: [`site/css/tokens.css`](../../../../site/css/tokens.css) `[data-theme="field"]`. Reference build: [`site/examples/field-01/`](../../../../site/examples/field-01/).

## Axes (diversification)

- **Paper band** - **light warm cream** (`oklch(96.5% 0.015 90)`, hue 90). Never `#fff`, never cool grey. Ink is warm near-black `oklch(25% 0.02 70)`, hue 70 - warm, not neutral.
- **Display style** - **roman serif** (Source Serif 4, 600, tracking `-0.02em`). No italic display. A serif headline over a Public Sans body - the friendly-but-serious pairing that separates it from the all-sans playful sibling.
- **Accent hue** - **chromatic marigold** (`oklch(75% 0.13 80)`). One warm gold-orange signal, used as highlighter + ink-stroke accent, never a flood (< 5% of any viewport).

## Reference register

Notion · the Anthropic marketing school · Coda.

The aesthetic: the warm-but-credible productivity landing - cream canvas, a serif display, a single marigold signal, hand-drawn strokes over a real content artifact. Friendly, plain, trustworthy. **Never name any of these in the output.**

**Patron-saint move (internal):** a serious tool that lets itself be *warm* - marigold highlighter + a tilted note where a colder theme would ship a UI screenshot. When in doubt ask "does this read like a person wrote it, or a template?" Keep the former.

## Required dependencies

1. **Fonts** - **Source Serif 4** (display, 400/600) + **Public Sans** (body + labels, 400/500/600). Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap" rel="stylesheet" />
   ```
   `--font-mono` (Geist Mono) is defined but rarely used; only load it if a page actually shows mono.
2. **No JS required.** The highlighter is pure CSS; the strokes and artifacts are inline SVG. If motion is added it is CSS-only and reduced-motion safe.

## The signature moves

1. **Warm cream paper + warm ink, tinted shadows** - `oklch(96.5% 0.015 90)` ground, `oklch(25% 0.02 70)` ink, body a notch lighter (`oklch(43% 0.02 72)`). Shadows are warm-tinted (hue 70), **never neutral grey**. No pure black or white anywhere.

2. **The marigold highlighter - THE core move** - one phrase in the hero title wears a marigold band behind its x-height, drawn with a `linear-gradient(180deg, transparent 38%, accent 38%, accent 92%, transparent 92%)` on a `<mark>` with `box-decoration-break: clone`. Highlighter, not a fill. Exactly one per hero.

3. **Hand-drawn ink strokes** - arrows, connectors, spot illustrations, checkmarks are **stroke-based inline SVG** with round caps/joins (`.ink` at ink, `.acc` at deep marigold), never flat filled icon tiles. A loose marigold-tipped doodle arrow points at the hero artifact.

4. **A tilted content artifact, not app chrome** - the hero's right side is a real object (a sticky note: title, dashed rule, Owner / Due / Decision rows with marigold ticks) on `--color-paper-2`, `rotate(-1.6deg)`, warm note-shadow. Title + lede sit LEFT, artifact RIGHT - asymmetric, never centred, never a product screenshot.

5. **Serif display over sans support** - Source Serif 4 headline (600, `-0.02em`); Public Sans body; eyebrows are Public Sans UPPERCASE, `0.12em` tracking. The serif carries warmth, the sans carries the plain voice.

6. **Ink-filled primary, marigold as underline** - the one primary button is **ink-filled** (`--color-ink` bg, cream text) with a warm shadow lift; links and ghost CTAs use a **marigold underline** that grows on hover. Marigold is the signal, never the button flood. Nav "Sign in" is a bordered outline pill (999px).

7. **Staggered beats on a dashed thread** - "how it works" is three beats connected by a **hand-drawn dashed thread**, each beat vertically staggered (top offsets 0 / 2rem / 4rem) with a serif numeral in deep marigold. **Not** a flat three-equal-tile grid.

8. **Alternating document rows + a warm CTA band** - features alternate text-left / art-right then flip, each art a bordered card holding a hand-drawn SVG. The page closes on a warm CTA band (`oklch(93% 0.045 84)`, hairline top+bottom) - the one deeper-cream beat.

## Motion

Composed and warm. Primary button lifts `translateY(-2px)` on hover; nav/link underlines grow via `scaleX`; the ghost arrow nudges `translateX` on hover. Ease `cubic-bezier(0.2, 0.6, 0.3, 1)`. **No bounce, no parallax, no autoplay.** All motion gates behind `prefers-reduced-motion`; reduced-motion ships static.

## Anti-patterns

- **No cool or grey paper** - Field is warm cream (hue 90). Cool bone is Almanac's.
- **No multi-accent flood** - one marigold signal only. Three saturated accents is Hum's lane.
- **No pure `#fff` / `#000`, no neutral-grey shadows** - warm cream, warm ink, warm-tinted shadows.
- **No flat filled icon tiles** - illustration is hand-drawn stroke SVG, or it is nothing.
- **No product screenshot / app chrome hero** - the artifact is a drawn content object (a note, a card), not a UI capture.
- **No marigold-filled buttons or gradient CTAs** - primary is ink-filled; marigold stays a highlighter/underline.
- **No centred-everything hero** - left-biased: title/lede left, artifact right.
- **No hype voice, no loud maximalism** - if it wants to shout, it is not Field.

## Macrostructure affinity + rejection

**Field loves.** Marquee Hero *(canonical - field-01)* · SaaS / Product (deck ingredients: how-it-works beats, feature rows, a warm CTA band - dealt, not sequenced) · Letter (the small-team, still-early warm note - Field can be intimate where the cool themes cannot) · Feature Tour (alternating document rows).

**Field refuses.** Manifesto (too loud - Field is plain, not a shout) · Terminal / code-hero (that is the cool dev themes; Field shows a content artifact, not code) · Photographic / image-led (Field draws by hand) · Long Document / archive (prose-led editorial routes to the warm-editorial themes).

## Voice fixtures

Warm, plain, concrete, honest - name the noun (owner, date, decision), admit the product is small.

- *"Meetings that end with a plan."*
- *"From talk to plan, in three moves."*
- *"Every next step has a name on it."*
- *"A task with no owner is a task nobody does."*
- *"No card. One workspace. Leave whenever you like."*

Never any of: *seamless, robust, effortless, delight, magic, powerful, revolutionary, unlock, supercharge, leverage, synergy*. Never "click here." Never hype the small team into a movement.

## How Field differs from neighbouring themes

| vs | difference |
|---|---|
| **Hum** (loud playful sibling) | Hum is cream (`97% 0.012 95`) with **three** saturated accents - pear-yellow (`86% 0.18 95`), sky-cyan (`66% 0.18 235`), coral-red (`68% 0.24 18`) - all-sans Plus Jakarta, 20px radii, deliberately loud. Field shares the warm-cream playful cluster but ships **one** marigold signal (`75% 0.13 80`), a Source Serif display, 10px radii, and a quiet credible voice. Same lane, opposite volume - the rotation walks between them. |
| **Almanac** (archival editorial) | Almanac is a cool near-neutral bone (`94% 0.008 245`) with a deep-blue accent (`38% 0.135 250`) and a Newsreader prose serif - a document to read. Field is warm cream (hue 90), marigold, Public Sans body, hand-drawn - a product to try, not an archive. |
| **Garden** (warm editorial) | Garden shares the warm-oat ground (`95.5% 0.022 92`, hue 92 ~ Field's 90) but its ink is **botanical green** (`24% 0.052 152`) with leaf-green (`47% 0.13 140`) + terracotta accents and a Young Serif display - organic and editorial. Field's ink is warm-neutral (hue 70), its one accent is marigold, and it is a SaaS product, not a garden essay. Shared ground temperature; ink+accent hue settles it. |

## Test brief expectations

Field is a candidate when the brief mentions:

- *productivity · collaboration · team · workflow · meetings · notes · tasks · planning · workspace · small team · friendly · approachable · human · warm-but-credible · get-things-done · consumer-prosumer SaaS*
- Product categories: *productivity SaaS · team/collaboration tool · note-taking · task/project tool · prosumer app*
- Emotional tone: *warm · friendly · credible · plain-spoken · human · approachable-serious · calm-optimistic*

Loud / maximal playful routes to Hum; content-led / archival / editorial routes to Almanac or Garden; cool / technical dev-tool routes to Cobalt; dark / dramatic routes to the atmospheric themes. When the brief is a warm product that wants to feel trustworthy without going cold, it is Field.

## Build hint

The first lines of CSS establish Field's anchor moves:

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-body); font-size: 1.0625rem; line-height: 1.6; }
h1, h2, h3 { font-family: var(--font-display); font-weight: 600;
             color: var(--color-ink); letter-spacing: -0.02em; line-height: 1.08; }

/* THE signature - marigold highlighter behind the x-height of one phrase */
.mark { padding-inline: .06em; -webkit-box-decoration-break: clone; box-decoration-break: clone;
        background-image: linear-gradient(180deg, transparent 38%,
          var(--color-accent) 38%, var(--color-accent) 92%, transparent 92%); }

/* hand-drawn strokes: ink + a deeper marigold (--color-focus), round caps, never filled */
.ink { fill: none; stroke: var(--color-ink); stroke-width: 2.4; stroke-linecap: round; stroke-linejoin: round; }
.acc { fill: none; stroke: var(--color-focus); stroke-width: 2.6; stroke-linecap: round; stroke-linejoin: round; }

/* nav hairline + warm paper glass; primary is INK-filled, marigold stays an underline */
.nav { border-bottom: 1px solid var(--color-rule); backdrop-filter: blur(8px); }
.btn--primary { background: var(--color-ink); color: var(--color-paper);
                border-radius: var(--radius-card); box-shadow: var(--shadow-card); }
.btn--primary:hover { transform: translateY(-2px); }

/* the content artifact sits tilted - an object, not app chrome */
.note { background: var(--color-paper-2); border: 1px solid var(--color-rule-2);
        border-radius: 16px; box-shadow: var(--shadow-card); transform: rotate(-1.6deg); }

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; } .btn--primary:hover { transform: none; }
}
```

Plus the Public Sans + Source Serif 4 link. Reference build: [`site/examples/field-01/`](../../../../site/examples/field-01/) - match its register (tokens, voice, motion feel), never its composition; reusing its section order, hero geometry, or grid is a gate-32-grade repeat.
