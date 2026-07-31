# Theme - Carnival

Loud-maximalist editorial. **Duo-tone accent system across six named palette drops** (each its own mood), chunky variable display, decorative ornaments, hard-offset shadows, tinted paper. The loud sibling to Riso / Manifesto / Brutal - but **decorative, not raw**.

Loaded eagerly by SKILL.md Step 3 whenever the catalog pick is `carnival`. The default palette ("Cold Snap") and font stack live in [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="carnival"]`; this file carries the **palette drops** (six variants) plus the rules that tokens cannot encode.

## Axes (diversification)

- **Paper band** - light (`L 88-95%`, tinted - varies by drop)
- **Display style** - **display-heavy** (Big Shoulders Display 800, variable-width axis)
- **Accent hue** - **per-drop**. Each drop has its own duo-tone hue pair (warm+warm, cool+warm, warm+cool, etc.). The drop name is recorded alongside the theme name in the diversification log so consecutive builds rotate drops, not just themes.

## Palette drops

A drop is a named duo-tone palette that preserves Carnival's structural signature (saturated accent-1 + complementary accent-2 + tinted paper + deep ink) while rotating hue. **Every Carnival build picks one drop.** The catalog of six:

### Drop 01 · Cold Snap *(default)*

Warm + warm. Indie record-label, winter, scrappy. The canonical Carnival.

- `--color-paper: oklch(92% 0.045 50)` - warm pink-cream
- `--color-paper-2: oklch(88% 0.050 45)`
- `--color-paper-3: oklch(82% 0.060 40)`
- `--color-ink: oklch(18% 0.080 20)` - deep aubergine
- `--color-ink-2: oklch(28% 0.060 25)`
- `--color-muted: oklch(45% 0.05 30)`
- `--color-rule: oklch(40% 0.18 25)` - oxblood rules (decorative)
- `--color-accent: oklch(86% 0.18 95)` - mustard
- `--color-accent-2: oklch(40% 0.21 25)` - oxblood
- `--color-accent-ink: oklch(18% 0.080 20)`
- `--color-focus: oklch(40% 0.21 25)`

**When to pick:** independent music · winter releases · DIY scrappy · the brief mentions cassettes, vinyl, EPs.

### Drop 02 · Citrus Riot

Loud + neon. 90s zine, summer, electric. Lime against magenta - the hardest collision in the catalogue.

- `--color-paper: oklch(94% 0.040 85)` - pale acid cream
- `--color-paper-2: oklch(90% 0.048 82)`
- `--color-paper-3: oklch(84% 0.055 80)`
- `--color-ink: oklch(20% 0.07 145)` - deep forest
- `--color-ink-2: oklch(32% 0.05 140)`
- `--color-muted: oklch(48% 0.04 130)`
- `--color-rule: oklch(28% 0.28 350)` - deep magenta rules
- `--color-accent: oklch(82% 0.20 130)` - chartreuse-lime
- `--color-accent-2: oklch(28% 0.28 350)` - deep magenta (reads AA on paper, and as text)
- `--color-accent-ink: oklch(20% 0.07 145)`
- `--color-focus: oklch(28% 0.28 350)`

**When to pick:** zine collectives · summer drops · skate / DIY culture · briefs that want LOUD without referencing music.

### Drop 03 · Diner Sign

Americana. Cream + cherry red + navy. Postwar diner, road trip, neon-and-chrome.

- `--color-paper: oklch(95% 0.035 90)` - bright cream
- `--color-paper-2: oklch(91% 0.042 88)`
- `--color-paper-3: oklch(86% 0.050 85)`
- `--color-ink: oklch(16% 0.04 30)` - black-brown
- `--color-ink-2: oklch(28% 0.05 30)`
- `--color-muted: oklch(45% 0.04 35)`
- `--color-rule: oklch(30% 0.16 250)` - navy rules
- `--color-accent: oklch(60% 0.22 25)` - cherry red
- `--color-accent-2: oklch(30% 0.16 250)` - navy
- `--color-accent-ink: oklch(95% 0.035 90)`
- `--color-focus: oklch(30% 0.16 250)`

**When to pick:** food + drink · hospitality · vintage Americana · briefs mentioning burgers, milkshakes, motels, roadside.

### Drop 04 · Studio Night

Cool + cool. Dusk warmth, cyan + plum. Late-night booth, blue hour, podcast studio at midnight.

- `--color-paper: oklch(88% 0.05 25)` - warm dusk pink
- `--color-paper-2: oklch(84% 0.055 22)`
- `--color-paper-3: oklch(78% 0.06 20)`
- `--color-ink: oklch(20% 0.05 270)` - deep navy-black
- `--color-ink-2: oklch(32% 0.045 265)`
- `--color-muted: oklch(48% 0.04 260)`
- `--color-rule: oklch(24% 0.18 320)` - deep plum rules
- `--color-accent: oklch(78% 0.18 220)` - cyan
- `--color-accent-2: oklch(24% 0.18 320)` - deep plum (reads AA on paper, and as text)
- `--color-accent-ink: oklch(20% 0.05 270)`
- `--color-focus: oklch(24% 0.18 320)`

**When to pick:** late-night radio · podcasts about anything · music + atmosphere · briefs mentioning "late", "after dark", "blue hour", "moonlight".

### Drop 05 · Aqua Park

Cool + warm. Turquoise against coral. Summer pool, motel sign, vacation.

- `--color-paper: oklch(94% 0.040 180)` - pale aqua-cream
- `--color-paper-2: oklch(90% 0.048 178)`
- `--color-paper-3: oklch(84% 0.055 175)`
- `--color-ink: oklch(20% 0.06 200)` - deep teal
- `--color-ink-2: oklch(32% 0.05 198)`
- `--color-muted: oklch(48% 0.04 195)`
- `--color-rule: oklch(36% 0.24 35)` - deep coral rules
- `--color-accent: oklch(72% 0.16 195)` - turquoise
- `--color-accent-2: oklch(36% 0.24 35)` - deep coral (reads AA on paper, and as text)
- `--color-accent-ink: oklch(20% 0.06 200)`
- `--color-focus: oklch(36% 0.24 35)`

**When to pick:** summer brands · vacation / hospitality · skate / surf / pool · briefs mentioning summer, beach, motel, sun.

### Drop 06 · Pressroom

Warm + cool. Amber-gold against slate-blue. 1950s journalism, print shop, broadsheet weight.

- `--color-paper: oklch(89% 0.025 65)` - warm slate-cream
- `--color-paper-2: oklch(85% 0.030 62)`
- `--color-paper-3: oklch(79% 0.035 58)`
- `--color-ink: oklch(16% 0.02 60)` - ink-black
- `--color-ink-2: oklch(28% 0.025 58)`
- `--color-muted: oklch(45% 0.025 55)`
- `--color-rule: oklch(34% 0.10 240)` - slate-blue rules
- `--color-accent: oklch(78% 0.18 75)` - amber-gold
- `--color-accent-2: oklch(34% 0.10 240)` - slate-blue
- `--color-accent-ink: oklch(16% 0.02 60)`
- `--color-focus: oklch(34% 0.10 240)`

**When to pick:** journalism · newsletters · editorial / opinion · briefs mentioning "press", "newspaper", "broadsheet", "subscription".

### Drop rotation rule

The diversification log (`/.hallmark/log.json`) records the drop alongside the theme: `"theme": "carnival", "drop": "studio-night"`. **A new Carnival build picks a drop that hasn't appeared in the last 3 entries.** If only Cold Snap is in the log, any of the other five is valid. If the brief contains a strong drop signal (see "when to pick" above), honour the signal even if it tightens diversification.

### Pick the drop by domain first

Match the brief's **domain** before reaching for the loudest palette:

- food / drink / hospitality / street market → **Diner Sign** (or Cold Snap)
- independent music / labels / EPs → **Cold Snap** (or Pressroom)
- late-night / radio / podcast / after-dark → **Studio Night**
- summer / pool / beach / vacation → **Aqua Park**
- zine / skate / DIY / deliberately chaotic → **Citrus Riot**
- journalism / newsletter / editorial → **Pressroom**

Citrus Riot and Aqua Park are the highest-chroma drops - reach for them when the brief genuinely *wants* maximum loudness, not as a default. A food market reads better in Diner Sign than in lime-on-magenta.

### When to construct a custom drop instead

If the brief explicitly names a brand colour that doesn't fit any catalog drop - e.g. *"our brand is teal and beige"* - route to the **custom theme** branch (see `custom-theme.md`) instead of stretching a Carnival drop. Drops are curated, not infinite. Six is the right number for now.

## Reference register

Dropout TV · Fly.io · Stones Throw Records · Third Man Records · Drag City · Moodelier · Kelsey Dake · Bold Monday.

The aesthetic: independent music labels, comedy networks, illustrator portfolios, hot-sauce brands, indie game studios. Things with **character**. Things that print posters as a side hustle. Things that sound loud out loud.

**Patron-saint reference (internal):** *Dropout TV homepage* + *Stones Throw artist pages*. When in doubt about decorative density, ask "would Dropout or Stones Throw run this much density?" If less, add ornaments. If more, you've gone too far.

## Signature moves

The theme's seven tics. A Carnival build should exhibit at least five of them.

1. **Duo-tone accent system.** Sections alternate which accent fills them. Section 1 fills with `--color-accent` (mustard); section 2 fills with `--color-accent-2` (oxblood); section 3 mustard again; etc. One section never shows both - they are *competing*, not blended.

   ```css
   .section:nth-of-type(odd)  { --section-fill: var(--color-accent); }
   .section:nth-of-type(even) { --section-fill: var(--color-accent-2); }
   ```

2. **Decorative ornaments.** Use `✱` (asterisk operator), `❋` (heavy six-petalled), `◆` (black diamond) as bullets, section dividers, and rhythmic spacers. Patterns:
   - Section dividers: `✱ ✱ ✱ ✱` (repeated 4×, centred)
   - List bullets: `❋` (replaces • / disc)
   - Section heading prefixes: `◆ Section Name` (left-aligned, ornament in accent colour)

3. **Layered colour blocks that bleed off the page edge.** Accent fills extend 24px past the page max-width on the left or right, so they read as **posters pinned to the wall**, not as buttons.

   ```css
   .colour-block { margin-inline: calc(var(--page-gutter) * -1); padding-inline: var(--page-gutter); }
   ```

4. **Hard-offset drop shadow.** Every card, CTA, and image gets `box-shadow: 4px 4px 0 var(--color-ink)`. No soft shadows ever. The shadow is **flat ink, offset**. This is the single most-recognisable Carnival move.

5. **All-caps headlines with Big Shoulders variable-width, tightly tracked.** `font-variation-settings: "wdth" 110, "wght" 800;`. Track them **tight**, not loose: `letter-spacing: -0.005em` on the hero word, `0.02em` on section heads. The loose `0.04em` look reads as AI-spread and is reserved **only** for the marquee banner (where horizontal spread is the point). Keep line-height tight too: `0.82` for single hero words, `0.92` for multi-line heads. The effect is a marquee poster set by a typographer, not a stretched default.

6. **Halftone pattern fills** in placeholder image regions (budget and generalized recipe: [`texture.md`](../texture.md) § Halftone). Pure CSS, no images:

   ```css
   .halftone {
     background-image: radial-gradient(var(--color-ink) 1.5px, transparent 1.5px);
     background-size: 12px 12px;
   }
   ```

   Used wherever the page would otherwise have a photo placeholder.

7. **Marquee scroll** on banner OR footer with decorative dot separators. *"NEW EP ◆ OUT NOW ◆ ON CASSETTE ◆ BLUE VINYL ◆ NEW EP ◆..."* - horizontal scroll, honours `prefers-reduced-motion: reduce` (freeze at static state).

## Layout pitfalls (must avoid)

Carnival's dense visual language has known traps. Read this list **before** writing a card layout - these are mistakes that have happened in earlier builds and shipped looking broken.

1. **Halftone portrait + side-by-side text in a narrow card → text gets covered.** When pairing a halftone "host portrait" / "artist portrait" with a show / artist name in the same card, **never use a 2-column grid where the content column can collapse below 200 px**. On a 3-up `repeat(3, 1fr)` desktop grid, the content column inside each card is ~150-180 px wide and a 5 rem portrait squeezes the title into overlap. The safe patterns:
   - **Vertical stack** (portrait on top, content below - the portrait sits naturally in the top-left of the card content area because of card padding). This is the default for portrait-paired cards.
   - **Side-by-side ONLY at 2-up or 1-up grids** where the content column has ≥ 250 px to breathe.
   - **Sticker corner** - portrait positioned `absolute; top: 0; right: 0` as a small badge, with text content flowing full-width below.

   Concretely: if the card is in a `repeat(3, 1fr)` grid and includes a portrait + title pair, the card must use `display: flex; flex-direction: column;` with the portrait at a fixed `width: 4.5rem; height: 4.5rem;` (not `width: 100%`). Halftone squares **never** overlap typography.

2. **Hard-offset shadow on a card next to a viewport edge → shadow gets clipped.** When a card sits flush against the right edge of the page gutter, its `4px 4px 0` shadow extends past the page max-width. Add `padding-right: max(var(--page-gutter), 8px)` to grids that include shadowed cards near the edge, or set the shell to have ≥ 8 px right margin past the card grid.

3. **Duo-tone fill on a card whose content includes both accents → reads as "blended", not "competing".** A mustard tile must never contain an oxblood badge inside it. Pick one accent per tile. (Signature #1 explicitly says this - but it's worth restating here because it gets violated when adding a sticker or a "NEW" badge.)

4. **Marquee scroll that doesn't repeat its content → gap at end of loop.** The marquee must contain the same scrolling text repeated at least twice (or use `aria-hidden` siblings) so the scroll animation reads as continuous, not as a single string sliding off.

5. **Big Shoulders width axis used without `font-variation-settings` → no width variation.** Setting `font-stretch` on Google's Big Shoulders Display does not work - only `font-variation-settings: "wdth" 110` does. If you see a hero that's supposed to be width-110 but renders at width-100, this is the bug.

6. **Section head detached from, or mis-centred over, its body.** The section head (heading + any lede) sits **tight above** the content it names - about `1.25rem` (`--section-head-gap`) - and **shares that content's alignment**. Don't cap the head at a narrow `max-width` / `ch` and then `margin-inline: auto` it: that strands a centred head over a full-width, left-flush grid (the classic accidental mismatch). Left-flush grid → left-flush head. (See the alignment-coherence note in `layout-and-space.md`.)

7. **Newsletter / CTA button not aligned with the input beside it.** When a button sits next to a form input in one row, they must share the **same height, vertical padding, and border width**, and the row must use `align-items: center` - otherwise the button floats above the input's baseline. If a label is stacked above the input it makes that column taller; centre the row on the *control*, not the column (give the field `align-items: center` or pull the label out of the flex row).

## Macrostructure affinity

**Carnival loves these.**

- **Marquee Hero** - the canonical Carnival opening; large word, scrolling banner under
- **Type Specimen** - the page IS the type; Big Shoulders Display 96 px+ as content
- **Manifesto** - short loud declarative statements (works for Carnival's voice too, but louder palette)
- **Stat-Led** - when the page leads with numbers, Carnival displays them big-and-mustard
- **Photographic** - image-led with halftone treatments and ornament captions
- **Bento Grid** (loud variant) - gridded blocks where each tile alternates accent colour

## Macrostructure rejection

**Carnival refuses these.**

- **Long Document** - too quiet; Carnival doesn't sustain over 1500 words
- **Letter** - too intimate; Carnival never whispers
- **Quote-Led** - too pensive
- **Conversational FAQ** - too soft
- **Workbench** - too technical; Carnival is poster art, not product spec

If the brief would otherwise land in one of these, redirect to Marquee Hero or Manifesto.

## Voice fixtures

Sample lines the Carnival voice should *read like*. Short. Loud. Declarative. Caps on the headlines, not on the body.

- *"FIVE NEW FLAVORS. ALL TOO HOT."*
- *"WE PRESS RECORDS. THAT'S IT."*
- *"NEW SEASON. NEW SHOWS. SAME CHAOS."*
- *"ONE EP. THREE ARTISTS. NO REGRETS."*
- *"THE GAME IS PIXEL ART. THE GAME IS HARD."*

Body copy is **shorter than other themes**. 1-2 short sentences per paragraph. Paragraphs separated by ornament dividers, not whitespace alone.

**Voice rules:**
- Headlines: ALL CAPS, ≤ 6 words, period at end (not exclamation - the loudness is in the type, not the punctuation).
- Body: sentence case, short, present-tense.
- Numerals over words always (*5* not *five*).
- Never any of: "experience", "journey", "elevate", "curate", "platform", "ecosystem", "transform". These are SaaS-default AI tells; Carnival is independent, not platformed.

## Anti-patterns (theme-specific)

- **Never soft shadows.** Carnival is hard-offset (`4px 4px 0`) or no shadow. If you find yourself reaching for `0 8px 24px`, redirect.
- **Never both accents in one block.** Mustard *or* oxblood per section, never blended.
- **Never sentence-case headlines.** Headlines are ALL CAPS or `font-variant: all-petite-caps`.
- **Never light-grey text.** Body text is full-ink. Carnival doesn't do "subtle".
- **Never long paragraphs.** If a paragraph exceeds 3 sentences, break it with an ornament divider or split into two blocks.
- **Never neutral CTAs.** Every CTA fills with one of the two accent colours.
- **Never thin rules.** Rules are 2 px solid in oxblood. Hairlines belong to Boutique / Specimen.
- **Emoji as decoration is allowed when typographic** (✱ ❋ ◆ are typographic ornaments, not emoji). Smiley-face / heart emoji are still banned per universal anti-patterns.

## How Carnival differs from neighbouring themes

| vs | difference |
|---|---|
| **Riso** | Riso is risograph print-craft (peach paper, CMYK misregistration on display, cyan + yellow). Carnival is *editorial maximalism* - duo-tone, oxblood-on-pink, decorative ornaments, variable-width type. Different parent tradition. |
| **Manifesto** | Manifesto is BLACK paper + ALL CAPS red Anton. Carnival is *tinted warm paper* + duo accents + ornaments. Inverted polarity - Manifesto is dark, Carnival is light. |
| **Brutal** | Brutal is raw graphic-design brutalism (heavy borders, slab type, no ornaments). Carnival is **decorative** - ornaments, layered blocks, variable type, character. |
| **Sport** | Sport is athletic italic uppercase (Inter Tight italic 700). Carnival is poster-art expressive (Big Shoulders 800 with width axis). Sport feels Nike; Carnival feels Drag City. |

## Test brief expectations

Carnival should be a candidate when the brief mentions:

- *record label · podcast · comedy · indie · zine · poster · illustrator · games · hot sauce · merch · streetwear · cassette · vinyl · cassettes · live show · zine · brand of one*
- product categories: music · comedy · games · illustration · hot sauce · merch · skateboards · gig posters
- emotional tone: *loud, fun, scrappy, chaotic, layered, character-led, decorative*

Briefs that say *enterprise / scale / API / B2B / dashboard* never route to Carnival.

## Build hint

When emitting a Carnival page, the first 12 lines of CSS should establish the four most important tells:

```css
body { background: var(--color-paper); color: var(--color-ink); font-family: var(--font-body); }
h1, h2 { font-family: var(--font-display); font-weight: 800; font-variation-settings: "wdth" 110; letter-spacing: 0.02em; line-height: 0.92; text-transform: uppercase; } /* hero word goes tighter: letter-spacing: -0.005em; line-height: 0.82 */
.card, .cta { box-shadow: 4px 4px 0 var(--color-ink); border: 2px solid var(--color-ink); }
.section:nth-of-type(odd)  { background: var(--color-accent);   color: var(--color-accent-ink); }
.section:nth-of-type(even) { background: var(--color-accent-2); color: var(--color-paper); }
.ornament { color: var(--color-accent); }
.halftone { background-image: radial-gradient(var(--color-ink) 1.5px, transparent 1.5px); background-size: 12px 12px; }
```

Those rules carry 70 % of the theme's identity. The rest is content fit.
