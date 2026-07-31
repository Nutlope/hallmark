# Theme - Manifesto

Loud editorial, broadside register. The page for **a statement, a declaration, a movement, a cause, a defiant brand launch, a set of principles** - the protest-poster / political-broadside school, executed on a **warm near-black ground with condensed-bold uppercase display and exactly ONE fighting red**. Giant Anton headlines slam to the left margin, mono clause numbers march down the side, and the body drops to a quiet grotesque. It reads like a thesis nailed to a door: uncompromising, urgent, set once and set loud.

Loaded eagerly by SKILL.md Step 3 whenever the catalog pick is `manifesto`. The OKLCH palette + font stack live in [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="manifesto"]`. No canonical build yet: mirror the signature moves below.

## Axes (diversification)

- **Paper band** - **dark, warm** (`oklch(10% 0.005 60)`, a warm charcoal near-black). Stepped bands at `paper-2 15%` / `paper-3 20%`. The only dark theme in the editorial cluster.
- **Display style** - **display-condensed-bold** (Anton 400, single weight, `--display-optical: 96`). Uppercase, tracked at `0.005em`, leaded tight at `--lh-tight: 0.86`. Distinct from Carnival's variable-width Big Shoulders and every serif option.
- **Accent hue** - **fighting red** (`--color-accent: #E51A1A`; the same red tuned for text is `--color-accent-ink: oklch(58% 0.24 28)`). One warm red (~25-28 deg), used as a signal, never a flood. Sits clear of Carnival's mustard/oxblood duo-tone.

## Reference register

Recorded broadsides and statement pages: the Communist / Futurist / Dada printed manifesto, a strike poster, a punk zine cover, Wikimedia's "we stand for" appeals, agency mission pages set in condensed grotesque, Aesop's plainspoken conviction re-pitched loud. The aesthetic: a political declaration printed at scale in one ink plus red, numbered like articles, no image needed. **Never name any of these in the output.**

**Patron-saint reference (internal):** *the printed manifesto nailed up in public* - condensed-bold caps, clause numbers, one red word per line, argument carried by type alone. When in doubt ask "does this read like a declaration, or like a product page?" Keep the former.

## Required dependencies

1. **Fonts** - **Anton** (display, one weight 400, uppercase only), **Public Sans** (body, 400/600/700), **JetBrains Mono** (clause numbers, labels, meta). The stack also names Bebas Neue / Albert Sans / Hanken Grotesk as fallbacks; load the three primaries. Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Anton&family=Public+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
   ```
2. **A hard reveal script** - one `IntersectionObserver` adding `.is-in` that runs a **clip-up mask** on headline blocks (not a soft fade + drift). Snappy cubic-bezier, plays once, gates behind `prefers-reduced-motion: no-preference`.

## Signature moves

1. **Warm near-black ground, never `#000`** - `--color-paper` is `oklch(10% 0.005 60)`, a warm charcoal. Ink is warm near-white `--color-ink` (`oklch(98% 0.003 90)`); body text sits a notch back at `--color-ink-2` (`oklch(88% 0.006 80)`); meta drops to `--color-muted` (`oklch(60% 0.012 65)`). Everything is warm-tinted (hue 60-90), never neutral grey, never pure black or white.

2. **Anton at full display scale, stacked** - the headline is the page. Set `--font-display` uppercase at `clamp(4rem, 8vw+1rem, 9rem)` (`--text-display`), leaded at `--lh-tight: 0.86` so a three-line headline locks into one solid mass. Slam it to the left margin, edge to edge. This is THE move: giant condensed-bold declarations, not a title-and-lede.

3. **One red, three jobs, under 5% of any viewport** - red **words** inside a headline use `--color-accent-ink` (`oklch(58% 0.24 28)`, the text-legible red); red **fills, underlines, and the `--rule-fine: 3px` bar** use flat `--color-accent` (`#E51A1A`); focus rings use `--color-focus` (same red). At most **one red word per headline**. Text placed on a red fill is `--color-ink`, never dark ink.

4. **Numbered clauses** - the manifesto reads as articles. Mark each thesis with a `--font-mono` (JetBrains Mono) label, UPPERCASE, tracked at `--tracking-label: 0.10em`: `01 / 02 / 03` or `ARTICLE I`. The mono machine-voice against the Anton shout is the theme's two-register signature.

5. **Hairlines divide, one thick red bar accents** - `--rule-hair: 1px` (`--color-rule`, `oklch(28% 0.010 60)`) separates clauses like a printed broadsheet; a single `--rule-fine: 3px` red bar sits under a section head or leads the hero. Rules do the structural work: **no boxed cards, no drop-shadows**.

6. **Quiet body, loud display - the whole drama is scale contrast** - `--font-body` (Public Sans) set small and plain at `--measure: 56ch`, `--color-ink-2`. The body never competes; it is the calm argument under the shouting headline. The gap between `9rem` caps and `1rem` grotesque IS the theme.

7. **Square, ruler-drawn controls** - buttons and inputs are `0px` radius or hairline-bordered blocks. A primary action is a flat red `#E51A1A` block with `--color-ink` text, or an outlined block that inverts to red on hover. No pills, no soft radii, no gradients.

8. **At most one red-inverted band, as the climax** - the page may flood red **once** (red paper, `--color-ink` text) for the closing thesis or a pull-quote, giving a dark -> red -> dark rhythm and the single showcase beat. One band only: everywhere else red stays a signal.

## Motion

Hard and staccato, not soft. Headline blocks clip-reveal upward once on load; clauses can enter line by line with a snappy ease, never a drift-and-fade. No bounce, no parallax, no autoplay, no red pulsing. Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static and fully visible.

## Anti-patterns

- **No pure `#000` ground / `#fff` ink** - warm-tinted charcoal and warm near-white (hue 60-90).
- **No second accent** - red is the ONLY colour. No blue, no green, no duo-tone pairing (that is Carnival).
- **No red flood** beyond the single climactic band (signature 8): red is a signal, not a background.
- **No light / paper ground** - Manifesto is dark. A light statement page routes to Riso or Carnival.
- **No decorative ornaments** - no fleurons, stickers, hard-offset shadows, tinted paper tricks (Carnival's vocabulary).
- **No centred hero** (gate 6) - headlines slam left, edge-aligned.
- **No serif display** - `--font-serif` resolves to Anton on purpose; there is no roman serif here. Display is condensed-bold uppercase.
- **No lowercase, timid, or title-cased display** - the display voice is UPPERCASE and declarative.
- **No image-led hero** - type carries the page; a photograph undercuts the broadside.

## Macrostructure affinity

**Manifesto loves these.**

- **Manifesto** - the numbered-declaration shape *(canonical home)*
- **Long Document** - theses as numbered articles down the page
- **Stat-Led** - one enormous red number per belief
- **Quote-Led** - a single line set at display scale
- **Marquee Hero** - when the hero is one uncompromising statement

**Manifesto refuses these.**

- **Photographic / image-led** - Manifesto argues in type, not imagery
- **Bento Grid** - too neat and product-shaped for a broadside
- **Workbench** - tool-first; Manifesto is a stance, not an instrument
- **Conversational FAQ** - too soft and helpful; the voice declares, it does not chat

## Voice fixtures

Imperative, short, declarative. Fighting words, verbs over adjectives, one red word.

- *"WE REFUSE THE AVERAGE."*
- *"PRINT DISCIPLINE. ON SCREEN. NO EXCEPTIONS."*
- *"EVERY PAGE IS AN ARGUMENT."*
- *"SET IT LOUD. SET IT ONCE."*
- *"NOTHING SOFT. NOTHING BORROWED."*

Never any of: *seamless, effortless, delightful, gentle, playful, cozy, maybe, perhaps, leverage, synergy*. No hedging, no hype-marketing. State it and stand behind it.

## How Manifesto differs from neighbouring themes

| vs | difference |
|---|---|
| **Carnival** (loud-editorial sibling) | Carnival is a **light**, tinted-paper, **duo-tone** decorative page (mustard + oxblood, ornaments, hard-offset shadows, variable Big Shoulders). Manifesto is **dark**, **one red**, raw, condensed-bold Anton, no ornament. Light-decorative vs dark-declarative settles it instantly. |
| **Brutal** (raw-editorial sibling) | Brutal is a **light 98% sheet** with heavy black rules and Albert Sans 700 - rigid, grid-structural, its one red cutting the near-white. Manifesto is a **dark** warm-charcoal ground with condensed-bold Anton and numbered clauses - composed loudness, not grid rawness. Light-vs-dark and the display face settle it. |
| **Riso** (print-editorial sibling) | Riso is a **light** print-texture / duotone-registration page. Manifesto is a dark, textureless broadside carried by scale and one red bar, not by ink-misregistration charm. |

## Test brief expectations

Manifesto should be a candidate when the brief mentions:

- *manifesto · statement · declaration · principles · beliefs · mission · movement · protest · cause · campaign · activism · advocacy · "what we stand for" · values · take a stand · bold launch · defiant · anti-establishment · punk*
- Product categories: *activist / cause org · advocacy campaign · defiant brand launch · editorial statement · agency with an attitude · loud record label · movement or petition page*
- Emotional tone: *loud · defiant · urgent · declarative · high-contrast · uncompromising · righteous*

Briefs that are calm / product / consumer / image-led route elsewhere (Cobalt for dev-tools, Carnival for light-maximal, the quiet editorial themes for content). When the brief wants to **shout a conviction in type**, it is Manifesto.

## Build hint

The first lines of CSS establish Manifesto's anchor moves:

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-body); font-weight: 400; }

/* The headline is the page - condensed-bold caps, slammed left, leaded tight */
.display { font-family: var(--font-display); text-transform: uppercase;
           font-size: var(--text-display); line-height: var(--lh-tight);
           letter-spacing: var(--tracking-display); color: var(--color-ink);
           text-align: left; text-wrap: balance; }
.display .hot { color: var(--color-accent-ink); }   /* one red word, max */

/* Mono clause number + the one thick red bar */
.clause-no { font-family: var(--font-mono); text-transform: uppercase;
             letter-spacing: var(--tracking-label); color: var(--color-muted); }
.rule-red { height: var(--rule-fine); background: var(--color-accent); border: 0; }

/* Square controls - a flat red block, never a pill */
.btn { border-radius: 0; background: var(--color-accent); color: var(--color-ink);
       border: var(--rule-hair) solid var(--color-accent); }
:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }

/* Hard clip-reveal - the whole motion engine */
.reveal { clip-path: inset(0 0 100% 0); transition: clip-path .5s cubic-bezier(0.2,0.9,0.1,1); }
.reveal.is-in { clip-path: inset(0 0 0 0); }
@media (prefers-reduced-motion: reduce) { .reveal { clip-path: none; transition: none; } }
```

Plus the Anton + Public Sans + JetBrains Mono link and the small clip-reveal script.
