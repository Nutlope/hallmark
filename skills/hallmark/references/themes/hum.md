# Theme - Hum

The playful, vibrant, **alive** register. Cream paper, multi-accent palette (pear-yellow primary, sky-cyan secondary, coral-red pop), rounded sans typography, generous radii, soft lifting shadows, mandatory hover-and-on-paint motion. Hum is the catalog theme for products that don't take themselves too seriously - daily-curiosity apps, learning platforms, habit trackers, friendship apps, kids' tools, indie creative software. Sites that should feel like the room is warm and someone smart is smiling.

Loaded eagerly by SKILL.md Step 3 whenever the catalog pick is `hum`. The palette + font stack live in [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="hum"]`. This file carries signature moves, motion direction, voice fixtures, anti-patterns, and how Hum holds its identity against neighbouring themes. Hum is the catalog's only playful theme - its closest siblings are Coral (single-accent restraint, modern-minimal) and Bloom (warm-light atmospheric), not another playful register.

## Axes (diversification)

- **Paper band** - light (`L 97%`), warm cream tinted toward pear-yellow hue (~95°). Yellower and brighter than any other warm-paper theme in the catalog - never the rose-warm or oat-warm cream of the editorial themes.
- **Display style** - **rounded-sans** (new axis value, Plus Jakarta Sans / Open Runde register - rounded humanist letterforms with closed apertures). Distinct from geometric-sans (Manifesto), italic-serif, classical-serif (Lumen), and other catalog options.
- **Accent hue** - **multi** (new axis value - three accents on stage simultaneously: pear-yellow `H 95`, sky-cyan `H 235`, coral-red `H 18`). Distinct from every single-accent or duo-tone theme in the catalog.

## Reference register

Brilliant.org (post-2024 brand refresh - Koto's pear-yellow + cream + custom CoFo Sans) · Duolingo (the named-color system: Feather Green, Macaw, Cardinal, Bee, Fox, Beetle, Humpback) · PostHog (Max the hedgehog, cream + red + blue, Open Runde + Squeak + Loud Noises) · tldraw (Shantell Sans with `Bounce` axis) · Cosmos (color-shift-on-hover) · Cluely (Mac OS chrome as set dressing) · Liveblocks (cursor-presence done right) · Hover.dev (the working dictionary of spring-physics interactions) · Each.place, Tella (vibrant gradient surfaces).

The aesthetic to match: cream paper (never pure white), a single character or mark that *reacts* to user actions, generous rounded surfaces, big confident counters in rounded display, soft drop shadows that lift on hover, multi-accent sections that don't fight (because each accent has its own surface). Pear-yellow + cream is the **calibration** combination - anything that reads further saturated than that has gone too vibrant; anything that reads more muted has lost the playfulness.

**Patron-saint reference (internal):** *Brilliant.org's Koji moment* + *PostHog's "if it could belong to any SaaS, it isn't PostHog enough" rule*. When in doubt about restraint, ask the inverse: *"is there a single moment on this page that would not exist if we weren't trying to feel alive?"* If no, the page is too quiet for Hum.

## Palette

Multi-accent. No single accent dominates - different surfaces use different accents, and the contrast between sections is part of the typographic rhythm.

- `--color-paper: oklch(97% 0.012 95)` - cream, slight pear-yellow pull (Brilliant's calibration)
- `--color-paper-2: oklch(94% 0.016 95)` - tinted band (yellower)
- `--color-paper-3: oklch(91% 0.020 95)` - deeper hover
- `--color-ink: oklch(20% 0.012 250)` - near-black with cool tilt (PostHog's `#151515` discipline - never pure black)
- `--color-accent: oklch(86% 0.18 95)` - pear-yellow (primary; CTA, streaks, primary character mark)
- `--color-accent-2: oklch(66% 0.18 235)` - sky-cyan (secondary; links, hover tints, illustrations)
- `--color-accent-3: oklch(68% 0.24 18)` - coral-red (pop; only used at high-energy single moments - streak completion, badge, the one big number)
- `--color-mint: oklch(80% 0.16 150)` - soft green (used sparingly - success states, secondary tags)
- `--color-lavender: oklch(74% 0.16 305)` - used sparingly (tag chips, decorative)

**Three-rule for accents:**
1. Each accent owns its own type of surface. Pear = primary action. Cyan = link / hover-tint. Coral = single high-energy moment per page.
2. Accents never blend in gradients (no pear-to-cyan gradient anywhere).
3. Mint and lavender are *occasional* - never more than one of each per page.

## Typography

Three font families. Rounded sans throughout - Hum has no serif anywhere.

- **Display / body:** Plus Jakarta Sans (Google Fonts, weights 400/500/600/700) - rounded humanist sans with closed apertures and friendly terminals. The Brilliant / PostHog / Open Runde register. Falls back to Geist, then system rounded.
- **Mono:** JetBrains Mono (uppercase labels, tabular numerals, streak counters).
- **No serif anywhere.** No `Instrument Serif`, no `Playfair`, no `Newsreader`. If a serif sneaks in, the theme is misapplied.

**Type discipline:**
- Display weight: **600** (heavier than Lumen's 400 - Hum's display is confident, not delicate).
- Tracking on display: `-0.025em` (tight, not over-tight).
- Body weight: 400 with 500 for inline emphasis.
- All-caps reserved for mono labels.
- **Big counters:** stat numerals at clamp(3rem, 5vw + 1rem, 5rem), rounded display, tabular-nums. Streaks, completion counts, deep-dive counts.

## The seven signature moves

A Hum build must exhibit **at least six of these seven**. Skipping the character moment (#5) is the only acceptable omission - for product-led pages without space for ornament.

These are the theme's *vocabulary*, not a layout: which moves appear is shared, but **how they're composed must differ every build** (see *Not-AI discipline* below). In particular, #3 is the colour-shift *technique* (accent tint deepens on hover) applied to whatever tile or row shape the build chooses - it is never a licence for the banned 3-equal-cards row.

### 1. The button system - three variations, the press is the feedback

Hum ships **one button system, three style variations**, structured as `.btn` (base = *push*) + a style modifier (`.btn--soft` | `.btn--outline`) + a colour modifier (`.btn--pear` | `--coral` | `--cyan` | `--lav` | `--mint` | `--ink`) + size (`.btn--sm` | `.btn--lg`). The reviewed `.btn` block below is the RECIPE: the press mechanics (edge shadow anatomy, hover-lift, active-press, the two bug fixes) are mandatory in every Hum build; the skin (colour modifiers, radius, size steps) restyles freely to the build. Keep the mechanics, restyle the skin; do not re-derive the press physics from scratch (that is how the broken version proliferated).

**The anatomy that matters (the two bugs this fixes):**

1. **Shadow = a full-width solid colour edge + a separate soft ground shadow.** `box-shadow: 0 4px 0 0 var(--btn-edge), 0 6px 12px -3px var(--btn-cast)`. **Never a negative spread** (`0 8px 0 -4px` makes the edge narrower than the button - the old bug). The first shadow is the button's *thickness*, flush to its width; the second is the cast shadow on the ground.
2. **The press is the feedback.** Lift on hover (`translateY(-2px)`, edge grows to `6px`), **press DOWN on `:active`** (`translateY(+3px)`, edge shrinks to `1px`) so it physically depresses. Easing is snappy - `cubic-bezier(0.2, 0.7, 0.3, 1)`, 140 ms hover / 70 ms active. **No `scale()`, no spring overshoot** (the old `scale(1.04)` + `cubic-bezier(…1.56…)` read floaty).

```css
.btn {
  --btn-face: var(--color-accent); --btn-ink: var(--color-ink);
  --btn-edge: var(--color-accent-deep); --btn-cast: oklch(76% 0.20 95 / 0.45);
  --btn-line: var(--color-accent-deep);
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5em;
  padding: 0.8rem 1.4rem; font-weight: 600; border: 0; border-radius: var(--radius-pill);
  color: var(--btn-ink); background: var(--btn-face); cursor: pointer; position: relative; isolation: isolate;
  box-shadow: 0 4px 0 0 var(--btn-edge), 0 6px 12px -3px var(--btn-cast);
  transform: translateY(0);
  transition: transform 140ms cubic-bezier(0.2,0.7,0.3,1), box-shadow 140ms cubic-bezier(0.2,0.7,0.3,1), background-color 160ms;
}
.btn:hover  { transform: translateY(-2px); box-shadow: 0 6px 0 0 var(--btn-edge), 0 12px 22px -4px var(--btn-cast); }
.btn:active { transform: translateY(3px);  box-shadow: 0 1px 0 0 var(--btn-edge), 0 2px 6px -2px var(--btn-cast); transition-duration: 70ms; }
.btn:focus-visible { outline: 3px solid color-mix(in oklch, var(--btn-edge) 70%, var(--color-focus)); outline-offset: 3px; }
.btn[disabled] { opacity: 0.5; cursor: not-allowed; pointer-events: none; transform: none; box-shadow: 0 4px 0 0 var(--btn-edge); }
/* .btn--soft = flat-lift (soft shadow, no colour edge); .btn--outline = hairline + accent fill sweeps up on hover.
   .btn__arrow slides 3px right on hover. .is-loading shows a spinner. Build these modifiers on top of the .btn base above. */
```

**Rules:** primary action = push (the chunky one). Secondary = soft. Tertiary = outline. One push button per primary moment; don't stack three push buttons in a row. The first-paint wobble is **retired** - it fought the press metaphor.

### 2. Multi-accent section bands

Sections alternate background between cream paper, pear-tint, cyan-tint, and coral-tint. Each accent owns sections matching its meaning: pear = primary product surfaces, cyan = community / "what people say," coral = the single emphatic moment (streak day, headline number). Bands transition with simple `background-color` changes - no gradients between them.

### 3. Color-shift card grid

Card grid where each card has a different accent tint at rest (very low opacity, ~6% of its accent). On hover: the card's tint deepens to ~12%, and the card lifts 4px with a softened shadow. The accents don't compete because each card holds its accent for its own surface.

### 4. Streak / counter tick-up

Big rounded numerals that count up from 0 to their target value on view-enter, over 1200ms with `cubic-bezier(0.22, 1, 0.36, 1)` easing (snappy arrival). The container scales 1 → 1.06 → 1 once on completion (the "yes!" moment). Implemented with `@property --num` for CSS-only tick-up, or a small JS loop with `requestAnimationFrame`.

### 5. Character moment - one small reacting mark

Every Hum page has ONE small character / mark that reacts to user interaction. Constructed entirely in CSS (no `<img>`, no Lottie). Examples:
- A small filled circle that pulses gently at rest and bursts a 4-point star when its CTA is clicked.
- A wordmark where one letter is the character - pulses, blinks, or wobbles on hover.
- A floating shape next to the hero that drifts in a slow circle and grows when hovered.

The character lives in **pear-yellow** by default - that's its colour. Other accents can carry it but pear is canonical.

### 6. Big rounded everything

`--radius-card: 20px`, `--radius-pill: 999px`, `--radius-input: 12px`. Soft drop shadows on cards (`0 12px 32px -16px ink/15%`) that brighten on hover. The *amount* of round (and the shadow philosophy) is a per-build lever - a kids' build can go chunky at 28px with a hard button-style edge, a quiet one tighter at 14px with a single soft layer (see the card-physics lever under *Not-AI discipline*). What never changes: **no square corners anywhere** - this is the rounded theme.

### 7. Star-burst micro-celebration on success

When a primary action completes (CTA click, form submit, streak hit), a 4-point star bursts from the click point and fades out over 420ms. Star is in coral-red (the pop accent), 24px tall at full size. Single firing per action; never auto-loops.

```css
.star-burst {
  position: absolute;
  width: 24px; height: 24px;
  background:
    linear-gradient(90deg, transparent 47%, var(--color-accent-3) 47% 53%, transparent 53%),
    linear-gradient(0deg,  transparent 47%, var(--color-accent-3) 47% 53%, transparent 53%);
  animation: star-burst 420ms ease-out forwards;
  pointer-events: none;
}
@keyframes star-burst {
  0%   { transform: scale(0) rotate(0deg);   opacity: 1; }
  60%  { transform: scale(1.2) rotate(35deg); opacity: 0.9; }
  100% { transform: scale(1.4) rotate(45deg); opacity: 0; }
}
```

## Motion direction

Hum's motion stack is **the loudest in the catalog**. Almost every interactive element does something on hover or first-paint.

| Element | Motion |
|---|---|
| Primary CTA (push) | lift 2px on hover (the colour edge grows), press DOWN 3px on `:active` (edge shrinks to 1px); snappy `cubic-bezier(0.2,0.7,0.3,1)`. No scale, no wobble - the press is the feedback |
| Cards | lift 4px + shadow brighten + accent tint deepen on hover (220ms `--ease-spring`) |
| Counters | tick-up on view-enter (1200ms, snappy ease-out) + scale pulse on completion |
| Character mark | pulse at rest (4s gentle scale 1 → 1.04 → 1); star-burst on relevant CTA click |
| Section headings | translateY(12px → 0) + opacity 0 → 1 on view-enter, 600ms, 80ms stagger |
| Star-burst | 420ms, fires once on primary action complete |
| Scroll | Lenis (`duration: 0.8, lerp: 0.10` - a soft, slightly elastic glide for the playful feel) |

Available easings:
- `--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)` (bouncy overshoot - the signature Hum easing, for MICRO press/pop interactions only; hero entrances stay bounce-free everywhere, per hero-discipline.md)
- `--ease-snap: cubic-bezier(0.22, 1, 0.36, 1)` (easeOutExpo - for tick-ups and reveals)
- `--ease-out`, `--ease-in-out` (standard fallbacks)

`prefers-reduced-motion: reduce`:
- Spring hovers collapse to opacity/colour transitions only (no scale, no rotate, no wobble).
- Counters render at final value instantly.
- Character mark stops pulsing (stays at final state).
- Star-burst disabled entirely.

The page must remain delightful with reduced motion - restraint, not breakage.

## Required dependencies

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

Two families. No third. No serif anywhere.

**Optional:** Lenis 1.3.23 for smooth scroll - recommended but not mandatory. Hum reads correctly without it; add when the brief calls for premium polish.

## Macrostructure affinity

**Hum loves these.**

- **Marquee Hero** - canonical: big "today's thing" card centred, big CTA below, character mark anchored to one side
- **Bento Grid** - multi-accent tiles, one accent per tile; the bento is Hum's natural shape
- **Workbench** - when the page has a live demo (small product preview surrounded by playful chrome)
- **Stat-Led** - big rounded counters carry the story
- **Catalogue** - a grid of items where each tile uses a different accent (color-shift gallery)
- **Narrative Workflow** - a numbered process-timeline spine (`1.0 → 2.0 → 3.0 → 4.0`): each stage owns its own accent band, the big rounded stage numerals ride the counter signature, and a connecting rail makes the sequence the page's structure. Works well for a guided-sourdough-style build. Reach for it when the product is *genuinely sequential* - recipes, learn-a-skill, onboarding, multi-week programs, anything that happens in ordered steps over time. Don't force it on one-moment tools (those want Marquee or Stat-Led).

## Macrostructure rejection

**Hum refuses these.**

- **Long Document** - Hum is not a 2,000-word essay theme
- **Manifesto** - too serious; Coral or Atelier handle subdued
- **Quote-Led** - too literary
- **Type Specimen** - typography is rounded sans only; specimens want range
- **Photographic** - Hum is pure shape + colour; photography can appear in a tile but never as a section's spine

## Layout & emphasis discipline (non-negotiable)

Two bugs appeared in early Hum builds and must never ship again.

### Section alignment - one content shell, identical edges

Every section's content must align to the **exact same left and right edges**, whether or not the section sits on a tinted band. The early bug: banded sections (`.section--band`) put their gutter padding on the band while plain sections put `max-width + padding` on themselves, so band content was ~one-gutter wider than plain content and the edges didn't line up.

**The rule:** one shell width model everywhere. The band provides *only* the background + block padding; the inner content carries the gutter.

```css
:root { --shell: var(--page-max); }           /* one number, every section obeys it */

/* plain section: capped box, gutter inside (border-box) */
.section { max-width: var(--shell); margin-inline: auto; padding: var(--section-gap) var(--page-gutter); }

/* banded section: full-bleed background, NO inline padding on the band itself */
.section--band { max-width: none; padding-inline: 0; }
.section--band > * { max-width: var(--shell); margin-inline: auto; padding-inline: var(--page-gutter); }
```

With global `box-sizing: border-box`, plain-section content and band content are now both `--shell` minus two gutters, both centred - edges match to the pixel. **Verify it:** the hero headline's left edge, a plain section's heading, and a banded section's heading must all sit on the same vertical line. If they don't, this rule was broken.

### Emphasis highlight - must follow the text, never a floating bar

The highlighter behind an emphasised word (`<em>` / `.hl`) and behind big display numbers must be painted as a **clipped background gradient on the text itself**, not an absolutely-positioned `::after` bar. The early bug: the `::after` bar only underlined the last line when the phrase wrapped, and drifted out of place at some sizes.

**The rule:** use a `background-image` highlighter with `box-decoration-break: clone` so it tracks the text across line breaks and scales with font-size automatically.

```css
em, .hl {
  color: inherit;
  background-image: linear-gradient(var(--hl, oklch(86% 0.18 95 / 0.55)) 0 0);
  background-repeat: no-repeat;
  background-size: 100% 0.32em;     /* band thickness, em-relative → scales with type */
  background-position: 0 82%;       /* sits just under the baseline */
  -webkit-box-decoration-break: clone;
  box-decoration-break: clone;      /* underline every wrapped line, not just the last */
  padding-bottom: 0.02em;
}
/* per-accent: set --hl on the element (pear default; coral/cyan/lav/mint as needed). */
```

This never breaks on wrap, never needs `white-space: nowrap`, and the band always sits correctly under the word. For a giant single-token display number (e.g. a Stat-Led hero count) the same technique applies - `background-size: 100% 0.14em; background-position: 0 88%` reads as a thick underline beneath the figure.

## Not-AI discipline - make every build read as a different studio (non-negotiable)

The fastest way Hum slides into AI-slop is **sameness**: many products sharing one skeleton below the hero. The *component* system (buttons, the highlight, tokens, the press metaphor) **should** be shared - that is a design system, and it's the right kind of consistency. The *page architecture* must **not** be shared. Two Hum builds have to read as two different studios' work, not two colour-swaps of one template.

**Study these real sites for how the register stays hand-made** (each cited for one specific move):
- **PostHog** - the closest production analog to Hum: cream `#EEEFE9`, ink applied *at opacity* (90% body / 95% link / 100% hover) not as new hexes, **dashed-rule** section dividers, a mascot with a strict model sheet, and a self-aware "shameless plug" section. Steal the discipline wholesale.
- **Brilliant** (Koto 2024) - shape-DNA shared between the wordmark and the spot illustrations. **Duolingo** - every character built from three primitives (rounded rect, circle, rounded triangle). **Family** - one springy, *scrubbable* number that's a toy. **Cosmos** - layered, captioned image *clusters*, never a tidy grid. **Daylight** - a warm palette deployed as a *system*, not a vibe. **Multiverse** - a split-screen hero instead of the centred stack. **Stripe** - restraint as craft (one gradient, narrow columns, layered soft shadows). **Linear** - hierarchy by scale-jump; the feature demonstrates itself.

### The deadliest tells - forbidden by default
- **The centred hero stack** (eyebrow/badge → centred H1 → two-line subhead → filled + ghost CTA, dead-centre). The single biggest tell. Default to an *off-centre* hero; only centre when one element deliberately breaks the grid.
- **A badge-pill directly above the H1** ("✨ now with…"). Never.
- **The 3-identical-accent-cards row** (icon-tile on top → title → two grey lines, ×3, equal gap). Already banned in Anti-patterns - but it's the reflex unit, so it keeps reappearing. If you have three things to say, say them in a *different shape*: zig-zag text/art rows, one big + two small, a numbered list, a horizontal scroll-rail, a comparison table.
- **Uniform radius + one shadow on everything.** Give each build its own card *physics* (see levers).
- **An accent stripe on a card's top/left edge** - reads as AI almost as reliably as em-dashes.
- **Emoji standing in for icons.** Hum draws its marks in CSS/SVG; an emoji in a chip or nav is a tell.
- **An all-caps grey eyebrow over *every* section** - use it sparingly, not as wallpaper.
- **A decorative gradient on the background AND the headline AND the button** (Hum bans accent-to-accent gradients anyway; never stack one three ways).

### Kill the shared tail (the highest-leverage rule)
No two Hum builds may share the same **back half**. The failure mode is a bespoke hero bolted onto an identical *features → 3-up testimonials → 3-tier-pricing → statement-footer* run. Vary, per build:
- **Pricing** - three tiers is *one* option. Also: a single honest price line; a free-vs-paid inline toggle; price folded into the product/catalogue surface; or no pricing at all (a "start" strip instead).
- **Social proof** - quote-cards-×3 is *one* option. Also: a single big pull-quote; a marquee of names; an inline stat+quote; a screenshot of real usage. The byline grammar "Name · metric" on every card is itself a tell - vary it.
- **Footer** - rotate the footer archetype. Don't ship the same giant-statement + `auto 1fr 1fr 1fr` meta grid every time. A compact single row, a marquee, or a footer that reuses the build's own artefact are all fair.

### Variety levers - pick a *different* combination each build (independent of palette)
1. **Hero archetype** - rotate: off-centre artefact-bleed · split-screen (value centre, art flanks) · text-left/art-right · art-LEFT/text-right · full-bleed colour-block with an overlapping product card · art-above-headline. Never default to centred-stack.
2. **The "one highlighted word in the headline"** is now in *every* existing build - it has become a tell. Use it in some; in others carry emphasis by scale, a drawn underline, or colour-blocking the whole line.
3. **Feature-block format** - commit to ONE non-default shape per build (zig-zag · big+small · dense linked index · table · numbered narrative).
4. **Density rhythm** - alternate airy sections with one deliberately dense "everything" section; don't hold `--section-gap` constant top-to-bottom.
5. **Card physics** - choose a personality per build: hairline-flat no-shadow (quiet/editorial) · chunky 28px + the button's hard edge-shadow (kids/toy) · borderless tinted blocks · Stripe-soft single layer · layered contact+ambient. Not `20px + 1.5px rule + --shadow-card` every time.
6. **Divider / seam** - dashed rules · full-bleed colour-block edges · whitespace only · a thin top accent rule. One language per build.
7. **Colour deployment** - same palette, different distribution: cream-dominant with tiny accent *punctuation* (PostHog) · bold full-section colour-blocking (one accent owns a whole section) · one accent gradient used exactly once. Distribution changes the feel more than the hues.
8. **Mascot dose & placement** - one character moment, but rotate where: hero-bleed · peeking from a card corner · an empty-state · the footer · a scroll-triggered cameo.
9. **Motion register** - spring-bouncy overshoot · calm-eased · one signature scrubbable/draggable toy (Family). Pick one; don't fade-in everything.

### Two requirements every build must meet
- **One off-grid / asymmetric moment** - a card that breaks the gutter, an oversized numeral bleeding off-edge, a 2/3-1/3 split, a tilted element. The page must not be one centred column of equal blocks. (Bubble's numbered rail is the current best example.)
- **One "designed exception"** - a single deliberate rule-break that says a human made this: a self-aware copy aside (PostHog's deadpan), an interactive toy (Family's scrub), a hand-drawn annotation over a clean shot, one tilted off-grid card, a full-bleed photo/colour break. Rotate which kind across builds.

### Micro-craft that reads hand-made
- **Modify ink with opacity, not new hexes** - body ~88-90% of `--color-ink`, links 95%, hover 100%. Fewer literal colours, used consistently.
- **Layer shadows** (a tight contact shadow + a soft ambient one), varied by elevation - never one `--shadow-card` on everything.
- **Tight tracking on display, sentence case, ≤3 type levels.** Big heads get negative letter-spacing; body stays neutral.
- **Voice:** max one em-dash per paragraph (the em-dash pile-up is the clearest "AI wrote this" tic - prefer periods). Honest metrics only; never decorative big-number theatre.

## Voice fixtures

Hum voice is **warm, smart, casual, direct**. Sentence case is allowed (unlike Lumen's full lowercase). Verbs over nouns. Confident but not knowing. Never condescending.

Headlines:

- "Your daily 30-second curio."
- "Get really good at one thing this quarter."
- "Notice yourself, in 30 seconds."
- "Learn something genuinely new today."
- "A small daily thing, kept for a long time."

Body patterns:

- "One small interesting thing, every morning at 8 a.m."
- "Free for the first seven days. $5 a month after that, or $45 a year."
- "Made by three people in Lisbon and Amsterdam. We're answering email."

Mono labels - UPPERCASE, used for ordinals, stats, and tags:

- `01 · TODAY`
- `02 · YOUR STREAK`
- `STREAK · 47 DAYS`
- `LEARNED · 312 THINGS`

**Never any of:** revolutionize, supercharge, unlock, leverage, unleash, transform, journey, holistic, mindful, ecosystem, platform, AI-powered, intelligent. The "feels alive" must come from *motion and colour*, not from breathless copy.

## Anti-patterns (theme-specific)

- **NEVER serif anywhere.** Display, body, captions - all rounded sans. If a serif is needed, the brief belongs in Lumen or one of the editorial themes.
- **NEVER pure white paper.** Cream `oklch(97% 0.012 95)` is the only acceptable ground. Pure white drains all the warmth out of the theme.
- **NEVER pure black ink.** `oklch(20% 0.012 250)` minimum lightness. Pure black on cream is harsh and breaks the warmth.
- **NEVER square corners on cards / pills / buttons.** Hum is the rounded theme. Cards = 20px, pills = 999px, inputs = 12px.
- **NEVER single-accent palette.** Hum is multi-accent. If a build wants one restrained accent only, it should route to Coral (single-accent modern-minimal) instead.
- **NEVER gradients between accents.** Pear-to-cyan or cyan-to-coral gradients are banned. Each accent owns its own surface.
- **NEVER over-rotate animations.** One signature character pulse + one CTA wobble per page. Bouncy easings on everything is exhausting; reserve spring for primary actions.
- **NEVER `font-style: italic` for the verb landmark.** Hum is not Lumen - verbs aren't italicised here. Emphasis comes from weight (500) or accent color, not italics.
- **NEVER invented metrics.** Streak counts must be honest (the user's actual data). Marketing stats must be real.
- **NEVER pure-rainbow gradient backgrounds.** Multi-accent ≠ Y2K rainbow. Each accent has its own surface; they sit next to each other in defined regions.
- **NEVER three-feature-card row with stock-icon tops.** Use abstract shape characters per card, not generic Lucide icons.
- **NEVER bento with > 8 tiles.** Hum's bento is small and warm, not maximalist.

## How Hum differs from neighbouring themes

| vs | difference |
|---|---|
| **Coral** (modern-minimal, the closest sibling) | Coral is warm-grey paper with a single restrained coral accent - Stripe-not-Linear register, motion optional. Hum uses coral only as its pop accent, on yellower cream with two other accents and mandatory motion. Coral is the friendly-but-quiet register (a quiet bakery card); Hum is exuberant and alive (a brilliant.org-style learning app). When a brief wants one restrained accent, route to Coral; when it wants multi-accent and a character moment, route to Hum. |
| **Bloom** (atmospheric) | Bloom is dark/cream with warm radial blooms behind the content (Suno register). Hum is fully light, no blooms, mandatory hover-and-paint motion. Different genres entirely. |
| **Specimen** (editorial) | Specimen is italic-serif on warm oat with classical typography. Hum is rounded sans on cream with vibrant character. Opposite registers. |

## Test brief expectations

Hum should be a candidate when the brief mentions:

- *daily, habit, streak, practice, learning, curiosity, mood, energy, friendship, community, kids, family, game, puzzle, creative, indie tool, character, mascot, fun, playful, alive*
- product categories: *learning platforms, habit trackers, daily-thing apps, friendship apps, creative tools (with character), kids' / family software, mood / energy / wellness apps, indie creative SaaS*
- emotional tone: *warm, alive, smart-but-warm, energetic, considered but joyful, post-Brilliant*

Briefs that say *enterprise, infrastructure, B2B, API, inference, agent, dashboard, manifesto, gallery, monograph* never route to Hum.

## Build hint

The first 24 lines of CSS should establish Hum's anchor moves:

```css
body {
  background: var(--color-paper); color: var(--color-ink);
  font-family: var(--font-body);
  font-feature-settings: "ss01" on, "cv11" on;
  font-variant-numeric: tabular-nums;
}

.eyebrow, .mono-label {
  font-family: var(--font-label); font-size: 11px; letter-spacing: 0.10em;
  text-transform: uppercase; color: var(--color-ink-2); opacity: 0.75;
}

.btn { /* push - a solid colour EDGE + a soft ground shadow. Never a negative spread, never scale(). */
  background: var(--color-accent); color: var(--color-ink); font-weight: 600;
  padding: 0.8rem 1.4rem; border: 0; border-radius: var(--radius-pill); cursor: pointer;
  box-shadow: 0 4px 0 0 var(--color-accent-deep), 0 6px 12px -3px oklch(76% 0.20 95 / 0.45);
  transition: transform 140ms cubic-bezier(0.2,0.7,0.3,1), box-shadow 140ms cubic-bezier(0.2,0.7,0.3,1);
}
.btn:hover  { transform: translateY(-2px); box-shadow: 0 6px 0 0 var(--color-accent-deep), 0 12px 22px -4px oklch(76% 0.20 95 / 0.45); }
.btn:active { transform: translateY(3px);  box-shadow: 0 1px 0 0 var(--color-accent-deep); } /* the press is the feedback */

/* cards MAY keep the spring lift (the retirement was buttons only); vary the physics per build */
.card {
  background: var(--color-paper); border-radius: var(--radius-card);
  box-shadow: 0 12px 32px -16px oklch(20% 0.012 250 / 0.12);
  transition: transform 220ms var(--ease-spring), box-shadow 220ms;
}
.card:hover { transform: translateY(-4px); }
```

Those lines carry 50% of the theme. The rest is the character moment + the multi-accent section bands + the motion stack.

## What Hum refuses (restated)

Disqualifiers - if any appears in a Hum build, it is not Hum:

- No serif anywhere.
- No pure white paper.
- No pure black ink.
- No square corners.
- No single-accent palette.
- No gradients between accents.
- No more than one CTA wobble per page.
- No more than one character moment per page.
- No `font-style: italic` for emphasis.
- No invented metrics.
- No rainbow gradient backgrounds.
- No generic stock-icon feature rows.
- No bento with > 8 tiles.
- No system-font fallback for the display.
- No motion-less interactive elements (every interactive element has SOME state response).
