# Theme - Cobalt

Modern-minimal, dev-tool register. The page for an **API, an SDK, a CLI, a docs home, a developer platform** - the GitBook / Firecrawl / Vercel school, executed in **cool cobalt-on-light, not orange**. A calm cool-white ground, ruler-drawn hairlines, exactly ONE electric cobalt signal accent, and **code as the hero**. It reads like good infrastructure: calm, precise, fast.

Loaded eagerly by SKILL.md Step 3 whenever the catalog pick is `cobalt`. The OKLCH palette + font stack live in [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="cobalt"]`. Reference build: [`site/examples/cobalt-01/`](../../../../site/examples/cobalt-01/) (an API product landing with a request/response hero).

> **Why not orange.** GitBook and Firecrawl both converged on orange-as-signal - but that lane is now crowded, and Hallmark's warm slots are already taken (Lumen brass, Bloom terracotta, Coral coral). Cobalt keeps their *discipline* (cool ground + one signal + code-as-hero + hairlines) and aims the signal at the open electric-blue lane instead. The blue is the differentiator, not a copy.

## Axes (diversification)

- **Paper band** - cool light (`L 98.5%`, hue ~250, very low chroma). An engineered near-white - distinct from Coral's warm grey and from the genre's dark grounds.
- **Display style** - **grotesk-sans** (Space Grotesk 500/600 - slightly mechanical, tight tracking). Distinct from Geist (Coral) and from every serif/rounded option.
- **Accent hue** - **electric cobalt** (`oklch(58% 0.20 256)`). High-chroma true blue - reads "API-live," sits clear of Midnight/Lumen's dusky indigos (~250/268). Used as a *signal*, never a flood.

## Reference register

GitBook · Firecrawl · Vercel / Geist · Linear · Mintlify · Stripe docs · Resend · Clerk · Railway · Supabase.

The aesthetic: the developer-product landing and docs home - a cool engineered canvas, one signal accent, **code/terminal/API as the focal element**, hairline structure, a ⌘K-flavoured nav. Never name any of these in the output.

**Patron-saint reference (internal):** *Vercel's blueprint-and-mono restraint* + *Firecrawl's live request-result credibility move*, recoloured cobalt. When in doubt, ask "does this read like an instrument panel, or like a marketing template?" Keep the former.

## Required dependencies

1. **Fonts** - **Space Grotesk** (display, 500/600), **Inter** (body, 400/500), **JetBrains Mono** (code + small UPPERCASE labels). All-sans; no serif anywhere. Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
   ```
2. **A small reveal script** - one `IntersectionObserver` adding `.is-in` (fade + ~10px rise, ease-out ~600ms). Plus a one-shot "type-in" of a single line in the hero code demo, then static.
3. **A working ⌘K command palette** - a small JS overlay that opens on click **and** ⌘K / Ctrl+K (Esc or backdrop closes; Arrow↑/↓ select; type-to-filter), `role="dialog"` / `aria-modal`, focus-managed, reduced-motion safe. The ⌘K in the nav actually works - Cobalt's signature interactive move.

## The signature moves

1. **Cool engineered paper, never `#fff`** - `oklch(98.5% 0.004 250)`. Ink is cool charcoal `oklch(24% 0.02 258)`, never `#000`. Body text sits a notch lighter (`oklch(34% 0.018 257)`).

2. **Hairlines do the work** - 1px `--color-rule` borders define every surface. **No boxed cards, no drop-shadows** beyond a single barely-there `0 1px 2px` lift on the code card. Depth comes from borders, not blur.

3. **One cobalt signal, used sparingly** (< 5% of any viewport) - the eyebrow tick, a link's hover underline, the one primary button, focus rings, the `200 OK` chip, the active nav item. Everything else is ink-on-cool-white.

4. **Code is the hero** - a dark **graphite** card (`oklch(22% 0.016 260)`) with a window bar (3 dots + a filename), syntax tokens (cobalt for methods/keys, light for strings, muted for punctuation), and a status chip. One line types in once, then static. Either a **live API request/response** (POST + JSON `200 OK`) or a **terminal** (install + a clean `PASS` run). Title + lede sit LEFT; the demo sits RIGHT - asymmetric, never centred.

5. **Bordered nav + a working ⌘K palette** - a flush full-width bar, single hairline bottom border, light blur on scroll. Wordmark + 2-3 text links left; a bordered **⌘K** affordance + one solid cobalt button right. The ⌘K **opens a real command palette** (mono search + command rows; click or ⌘K/Ctrl+K; Esc to close) - the page *behaves* like a dev tool, not just looks like one. **Not a floating pill** (softer, and Coral's vocabulary).

6. **Tight technical radii** - 6px on buttons/inputs, 10px on code cards. Not Coral's soft pills, not 0px brutalism - "drawn with a ruler."

7. **Mono labels** - eyebrows, meta, status, kbd hints in JetBrains Mono, UPPERCASE, `0.06em` tracking. The machine-readout voice against the Space Grotesk display.

8. **One dark graphite band per page** - a single full-bleed dark section (a quickstart, a how-it-works, a watch-mode demo) on `oklch(~20% 0.016 260)` with light cool text and the cobalt accent popping. It gives the page a **light → dark → light** rhythm and a showcase moment. The page's *one* dark beat - Cobalt is a light theme *with* a dark band, never a dark theme.

## Motion

Composed and sparse. The one hero type-in (plays once). Section reveals fade + rise. Hover: cobalt underline-grow on nav/links; a 1px border-colour shift to cobalt on the code card / focusable surfaces. **No bounce, no parallax, no autoplay.** Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static + fully visible.

## Anti-patterns

- **No orange accent** - the crowded GitBook/Firecrawl lane and a collision with Lumen/Bloom/Coral. Cobalt is blue.
- **No warm paper** - warm grey is Coral's. Cobalt is cool (hue ~250-258).
- **No pure `#fff` / `#000`.** Cool near-white paper, cool charcoal ink.
- **No pill / gradient CTAs.** One solid cobalt button at 6px radius + understated typographic links. Name the destination.
- **No centred-everything hero** (gate 6) - left-biased, title-left / demo-right.
- **No three-equal-icon-tile feature grid** (gate 3) - vary it (one wide code example + narrower points; asymmetric benchmark figures).
- **No glassmorphism, no gradient text** (gates), **no aurora/mesh blob, and no background texture/pattern at all** - cool paper + hairlines carry the page; its one dark beat is the graphite band (signature 8), not a background.

## Macrostructure affinity

**Cobalt loves these.**

- **SaaS / API Product** - deck ingredients: a quick-start code card, benchmark figures, real pricing - dealt per macrostructures.md § deck, never a fixed run *(canonical - cobalt-01)*
- **Dev-tool / CLI** - terminal hero + install + benchmark figures + docs CTA
- **Docs home** - a calm index with a search-first nav
- **Workbench** - the technical, tool-first shape
- **Marquee** - when the hero is one confident code demo

## Macrostructure rejection

**Cobalt refuses these.**

- **Letter** - too intimate; Cobalt is a product, not a note
- **Manifesto** - too loud; Cobalt is calm infrastructure
- **Photographic / image-led** - Cobalt leads with code, not imagery
- **Long Document** - prose-led; route warm-editorial instead

## Voice fixtures

Declarative, technical, specific. Name the X concretely. No hype adjectives.

- *"Turn any website into clean Markdown for LLMs."*
- *"One API. Every page."*
- *"From idea to production in an afternoon."*
- *"Type-safe by default. Fast by design."*
- *"Built to ship - `200 OK` in under 200 ms."*

Never any of: *seamless, robust, cutting-edge, leverage, synergy, revolutionary, unlock, supercharge*. Never "click here." Name the endpoint, the command, the number.

## How Cobalt differs from neighbouring themes

| vs | difference |
|---|---|
| **Coral** (modern-minimal sibling) | Coral is warm-grey paper + warm coral accent + Geist + soft pills + a quiet title/lede hero. Cobalt is cool-white + electric blue + Space Grotesk/JetBrains Mono + tight bordered controls + a live code hero. Same genre, opposite temperature - the rotation walks between them. |
| **Midnight** (atmospheric) | Both live near hue 250-258, but Midnight is a **dark** canvas (atmospheric, numbered display, typewriter reveals). Cobalt is a **light** engineered canvas (modern-minimal, code hero). Light vs dark settles it instantly. |
| **Lumen** (atmospheric) | Lumen is a dark (or cool-bone) *apparatus* page with Instrument Serif + an emit/refract focal artefact. Cobalt is light, all-sans, and its focal element is a literal code/API card, not a built light-instrument. |
| **Aurora** (atmospheric) | Aurora is dark cyan blooms + Sentient serif body. Cobalt is light, hairline-structured, cobalt-on-white - no blooms, no serif. |

## Test brief expectations

Cobalt should be a candidate when the brief mentions:

- *API · SDK · CLI · dev tool · developer platform · docs · documentation · infrastructure · backend · database · observability · webhooks · type-safe · open-source tool · ship · deploy · developer experience · B2B developer*
- Product categories: *API · developer tool · dev platform · docs site · infra · SaaS-for-engineers*
- Emotional tone: *precise · engineered · fast · technical · instrument-panel · calm-confident · cool*

Briefs that are warm / consumer / editorial / image-led route elsewhere (Coral for warm SaaS, the editorial themes for content). When the brief is for developers and wants to *show the code*, it's Cobalt.

## Build hint

The first lines of CSS establish Cobalt's anchor moves:

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-body); font-weight: 400; }

/* Reveal - the whole motion engine */
.reveal { opacity: 0; transform: translateY(10px);
          transition: opacity .6s cubic-bezier(0.16,1,0.3,1),
                      transform .6s cubic-bezier(0.16,1,0.3,1); }
.reveal.is-in { opacity: 1; transform: none; }

/* The code hero - dark graphite card, hairline-framed */
.code-card { background: var(--color-graphite); border: 1px solid var(--color-rule-2);
             border-radius: 10px; box-shadow: 0 1px 2px oklch(24% 0.02 258 / 0.05);
             font-family: var(--font-mono); }
.code-card .tok-key, .status--ok { color: var(--color-accent); }   /* the one signal */
.status--ok { font: 500 0.75rem/1 var(--font-mono); letter-spacing: .06em; }

/* Bordered nav + the one cobalt button (6px, never a pill) */
.nav { border-bottom: 1px solid var(--color-rule); backdrop-filter: blur(8px); }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink);
                border-radius: 6px; }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

Plus the Space Grotesk + Inter + JetBrains Mono link and the small reveal/type-in script. Reference build: [`site/examples/cobalt-01/`](../../../../site/examples/cobalt-01/) - match its register (tokens, voice, motion feel), never its composition; reusing its section order, hero geometry, or grid is a gate-32-grade repeat.
