# Theme - Arcade

Retro-nostalgia in the **playful** cluster. A coin-op cabinet rendered entirely in CSS: a violet-black CRT ground, a fixed starfield, scanlines, **pixel display type with a magenta ghost**, and hard-offset press buttons. Loud but tasteful - two neon accents, never a rainbow. The page for a **game jam, an indie launch, a demo night, a launch party, a playful community event**.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `arcade`. Tokens: [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="arcade"]`. Reference build: [`site/examples/arcade-01/`](../../../../site/examples/arcade-01/). The full-page proposal [`site/_proposals/themes/arcade.html`](../../../../site/_proposals/themes/arcade.html) is the structural source of truth.

## Axes (diversification)

- **Paper band** - **dark** violet-black (`oklch(16% 0.020 300)`, hue 300 carried through every neutral). Not Terminal's green-black 145, not any light ground in the cluster.
- **Display style** - **pixel display** (Silkscreen 700, mono glyph grid). Distinct from every grotesk/serif/rounded option; the one genuinely bitmap face in the catalog.
- **Accent** - **chromatic-magenta** (`oklch(70% 0.24 340)`) leading, **cyan** (`oklch(85% 0.13 195)`) answering. A high-chroma neon duo, alternated so neither floods.

## Reference register

Poolside.fm · Panic · the OP-1 generation of software. The aesthetic: playful retro-hardware nostalgia - CRT glow, pixel type, coin-op and cassette-era warmth executed with restraint, not kitsch. **Never name any of these in the output.**

## Required dependencies

**Fonts** - **Silkscreen** (display + labels, 400/700), **Hanken Grotesk** (body, 400-800). IBM Plex Mono is the `--font-mono` fallback; add it to the link only if a page shows a code/mono run.
```html
<link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700;800&family=Silkscreen:wght@400;700&display=swap" rel="stylesheet" />
```
A tiny cursor-blink keyframe (steps(1)) is the only script-free animation; no JS required.

## The signature moves

1. **Violet-black CRT ground + fixed starfield** - `--color-paper` `oklch(16% 0.020 300)` behind ~8 layered `radial-gradient` stars (white / cyan / dim, using `--star` `--star-cyan` `--star-dim`), `background-attachment: fixed` so the field sits still while content scrolls. A full-viewport scanline overlay via `body::after` (`repeating-linear-gradient`, `--scanline`, `z-index: 40`, `pointer-events: none`). **Gate-47 carve-out:** scanlines + starfield ARE the sanctioned retro signal - decorative, never blocking input, never a fake monitor bezel. (Scanline budget and the portable recipe: [`texture.md`](../texture.md) § Scanline.)

2. **Pixel display with a magenta ghost** - Silkscreen 700 for hero/section display, `text-shadow: 0.085em 0.085em 0 var(--color-accent)` for the offset drop-shadow. Display and Silkscreen **labels only**. Body copy is Hanken Grotesk - never set a paragraph in Silkscreen (unreadable past ~3 words). Section titles use Hanken 800, not pixel.

3. **Blinking block cursor** - a cyan █ (`.cursor`, `var(--color-accent-2)` + magenta `box-shadow`) appended after the wordmark, `steps(1)` blink at `1.06s`. **Gate-47 carve-out:** the cursor is a retro terminal caret, a sanctioned signal - not a step toward fake window chrome.

4. **Hard-offset press buttons** - every interactive surface (score slots, primary `.btn`) carries a solid `Npx Npx 0` shadow in `--shadow-mag` / `--shadow-cyn`. `:hover` moves *away* from the shadow (grows to 8-9px), `:active` slams *toward* it (2px) - a physical button press. Zero blur. `--radius-card` 4px, `--radius-pill` 0.

5. **Player-select CTA** - the hero's dual action is a **P1 / P2 score-slot pair** (magenta P1, cyan P2) in arcade language: INSERT COIN, 1 CREDIT, FREE PLAY, REGISTER / SPONSOR. The marquee strip up top reads like a cabinet header.

6. **Silkscreen machine labels** - every kicker, meta line, table header, and rank chip (1UP / 2UP / 3UP, high-score initials) is Silkscreen UPPERCASE, tracking `0.02-0.14em`, alternating cyan/magenta. The readout voice against the ink body.

7. **Two-accent alternation** - magenta (`--color-accent`, hue 340) leads, cyan (`--color-accent-2`, hue 195) answers; they swap across beats / tracks / prizes so no single neon dominates. `--color-accent-ink` is the violet-black itself - dark text on the neon fills.

8. **Chunky 2px rules, near-square radii** - structure is drawn with 2px borders and `border-top` section rules, not hairlines; 4px card radius, 0 pill. Depth is hard shadow + thick rule, never blur.

## Motion

Near-static. The **one** animation is the cyan block-cursor blink. Interaction is press-physics: hard-shadow surfaces translate 2-3px on `:hover` / `:active` (`120ms ease-out`), border brightens to `--line-lit`. Focus is a 3px cyan `--ring` outline at 4-5px offset. Everything gates behind `prefers-reduced-motion`; reduced-motion stops the cursor and every transition (static, fully visible). No parallax, no autoplay, no bounce; the starfield is `fixed`, not animated.

## Anti-patterns

- **No body copy in Silkscreen** - pixel face is display + labels only; paragraphs are Hanken Grotesk. This is the single most common failure.
- **No fake OS / window chrome** - **gate-47:** no fake monitor bezels, browser or title bars, traffic-light dots, or "app window" cards. The retro read is scanlines + starfield + pixel type + cursor, not skeuomorphic desktop furniture.
- **No pure `#000` / `#fff`** - violet-black paper (`16% 0.020 300`), violet-tinted near-white ink (`95% 0.012 300`). Every neutral carries hue 300.
- **No soft or blurred shadows, no gradient CTAs** - shadows are hard 0-blur offsets; the button is flat magenta with a 2px ink border, never a gradient pill (`--radius-pill` is 0).
- **No rainbow** - exactly two accents alternating. Don't add a third neon or an RGB spread. Loud but tasteful.
- **No arcade emoji / clip-art** (👾🕹️) - the retro comes from type, scanlines, stars, and hard shadows, not pasted glyphs.
- **No centred-everything** - hero content is `flex-start`, left-biased; the pixel display stacks left over the field.

## Macrostructure affinity

**Arcade loves these.**

- **Manifesto** - loud event / jam / launch page, big pixel display *(canonical - arcade-01)*
- **Marquee** - one confident pixel wordmark + insert-coin CTA
- **Showcase / Gallery** - a lineup of games, tracks, or entries as score slots
- **Feature grid as cabinet lineup** - tracks / prizes as bordered arcade cards

## Macrostructure rejection

**Arcade refuses these.**

- **Long Document** - Silkscreen headers can't carry sustained reading; route warm-editorial
- **Docs / API product** - too playful; that's Cobalt or Terminal
- **Photographic / image-led** - Arcade builds its world from CSS, not photography
- **Corporate / trust-led SaaS** - too loud for a calm B2B pitch

## Voice fixtures

Playful, coin-op, high-score. Short and declarative. Name the credit, the theme, the buzzer.

- *"Insert coin. Ready player 1?"*
- *"Free play - no entry fee, no catch, ever."*
- *"One theme, 48 hours, any team size."*
- *"Everyone plays everyone. The room picks its favorites."*
- *"New high score - enter your initials."*

Never any of: *seamless, robust, cutting-edge, leverage, synergy, revolutionary, unlock, supercharge, next-level, gamechanger, epic (as filler).* Never "click here." Never lean on *level up / 8-bit / 16-bit* as filler - earn the retro through the type and the field.

## How Arcade differs from neighbouring themes

| vs | difference |
|---|---|
| **Hum** (playful sibling, rounded-warm) | Hum is **light** cream (`oklch(97% 0.012 95)`), Plus Jakarta Sans rounded sans, 20px radii, pear-yellow + cyan + coral, spring/bounce motion. Arcade is **dark** violet-black (`16% 0.020 300`), pixel Silkscreen, 4px/0 radii, magenta+cyan over scanlines, hard-offset press. Same cluster, opposite build: soft-warm-daylight vs pixel-CRT-night. |
| **Terminal** (mono/dark sibling, phosphor-CRT editorial) | Terminal is green-black (`oklch(11% 0.018 145)`), JetBrains Mono for **everything incl. body**, phosphor-green accent (`78% 0.190 138`), calm reading. Arcade is violet-black hue 300, pixel Silkscreen for display/labels but **Hanken Grotesk body**, magenta+cyan. Terminal is a readable green editor; Arcade is a loud neon cabinet. |
| **Carnival** (loud sibling, editorial) | Carnival is **light** pink-cream (`oklch(92% 0.045 50)`), Big Shoulders Display condensed, mustard + oxblood, hard-offset shadow but a poster layout. Both are loud with hard shadows; Carnival is a warm daylight fairground poster, Arcade is a dark neon arcade at night. |

## Test brief expectations

Arcade is a candidate when the brief mentions:

- *game jam · indie game · game studio · launch party · demo night · hackathon · festival · meetup · retro · pixel · arcade · nostalgia · playful launch · music / synth / lo-fi toy · zine*
- Product categories: *game · creative event · community · music/audio toy · indie tool with personality*
- Emotional tone: *playful · loud · retro · nostalgic · fun · irreverent · high-energy · night*

Calm / corporate / trust-led routes to Cobalt or Coral; sustained editorial reading routes warm-editorial. Arcade is for pages that want to feel like a coin-op cabinet.

## Build hint

The palette tokens (`--color-*`) come from `[data-theme="arcade"]`. The starfield / scanline / neon-glow vars below (`--star*`, `--scanline`, `--shadow-cyn`, `--shadow-mag`, `--line-lit`, `--ring`) are **page-local decorative tokens**: define them in your page `:root` as in the reference build `site/examples/arcade-01/` (gate 48 allows page-defined tokens).

The first lines of CSS establish Arcade's anchor moves:

```css
html, body { overflow-x: clip; }
body { background-color: var(--color-paper); color: var(--color-ink);
       font-family: var(--font-body); line-height: 1.6;
       background-image:
         /* --star / --star-dim / --scanline / --shadow-cyn are page-added decorative tokens: lift them into your :root (gate 48). */
         radial-gradient(1.5px 1.5px at 12% 16%, var(--star), transparent 62%),
         radial-gradient(1.5px 1.5px at 83% 24%, var(--color-accent-2), transparent 62%),
         radial-gradient(1px 1px at 46% 62%, var(--star-dim), transparent 62%);
       background-attachment: fixed; background-repeat: no-repeat; }

/* CRT scanlines - decorative, never blocks input */
body::after { content: ""; position: fixed; inset: 0; z-index: 40;
  pointer-events: none;
  background: repeating-linear-gradient(to bottom,
    transparent 0 2px, var(--scanline) 2px 3px); }

/* Pixel display with the magenta ghost - display/labels only */
.pix { font-family: var(--font-display); font-weight: 700; }
.hero__display { font-family: var(--font-display);
  text-shadow: 0.085em 0.085em 0 var(--color-accent); }

/* Hard-offset press button - zero blur, radius 4px */
.btn { background: var(--color-accent); color: var(--color-accent-ink);
  border: 2px solid var(--color-ink); box-shadow: 6px 6px 0 var(--shadow-cyn);
  transition: transform 110ms ease-out, box-shadow 110ms ease-out; }
.btn:active { transform: translate(3px, 3px); box-shadow: 2px 2px 0 var(--shadow-cyn); }

@media (prefers-reduced-motion: reduce) {
  .cursor { animation: none; opacity: 1; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

Plus the Silkscreen + Hanken Grotesk link above. Reference build: [`site/examples/arcade-01/`](../../../../site/examples/arcade-01/) - match its register (tokens, voice, motion feel), never its composition; reusing its section order, hero geometry, or grid is a gate-32-grade repeat.
