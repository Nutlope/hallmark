# Hero enrichment — when, what, and how much

This file is loaded after the macrostructure pick (Step 3 in the design flow), when you reach Step 4: "Decide on hero enrichment." It tells you whether to enrich the hero with media at all, and if so, which archetype and how to build it. It is an index: run the detection gate, pick a tier, pick at most one archetype and one polish pattern, then load ONLY the matching file from `references/enrichment/`.

**The promise.** Enrichment is an option, not a default. A typographic-only hero is *always* an acceptable answer. Visual enrichment — demo video, illustration, mockup, animated loop, abstract background, photography — has to *earn its place*. If the hero can be deleted of its enrichment and still works, the enrichment earned its place. If the hero collapses without the enrichment, you propped weak typography on a crutch.

**The bar.** Better nothing than bad something. A page that ships a quiet, well-set typographic hero is always better than a page that ships a stock illustration, a Lottie checkmark, an aurora-blob background, or a generic centred demo video block.

---

## Image-need detection — does this brief need imagery at all?

Before picking an enrichment tier, decide whether the brief actually wants imagery. The default is **typography-only**. Match the brief against this table; act on the *first* row that fires:

| Brief signal (any of these words / intents) | Image strategy |
| --- | --- |
| e-commerce, shop, store, product catalogue, brand, fashion, lookbook | Real product photos required — placeholder until user provides |
| photography, portfolio, gallery, artist | Imagery *is* the page — placeholder until user provides |
| food, restaurant, menu, dish, coffee, wine, recipe | Hero photo + product crops — placeholder until user provides |
| team, staff, "about us", portraits, hiring, careers | Kit avatars ([`imagery-kit.md`](imagery-kit.md) § avatar, with their paired names) until the user provides real people; never pravatar/dicebear/unsplash faces (F9) |
| travel, hotel, destination, real estate, listing, property | Cover photo + tile photos — placeholder until user provides |
| news, blog, magazine, journal, publication | Feature image per post — placeholder until user provides |
| SaaS landing, manifesto, agency, studio, atmospheric, slow-and-editorial | **Composed-abstract (kit grammar, built in-page).** Compose washes, transparent abstracts, and ornaments with the kit's patterns, constructed via craft tier-a CSS / tier-b SVG - see [`imagery-kit.md`](imagery-kit.md) (its hard rule: no URL outside the manifest) and [`assets.md` § Placeholder strategy](assets.md). |
| API, docs, changelog, CLI, library, dev-tool, SDK, package | **No imagery.** Typography-only. Code blocks if needed. |
| editorial, essay, letter, foundry, type-specimen, broadside | **No imagery.** Display typography is the design. |
| (all other / vague / unspecified) | **Default: typography-only.** When in doubt, no images. |

Rules:

- When the user has attached an image asset (or `.hallmark/preflight.json` cached one), use it. Never overwrite with a placeholder.
- When the brief is genuinely ambiguous between a "needs photos" row and a "no imagery" row, ask one short question: *"Will you have product photos, or should I leave swappable placeholders?"*
- A placeholder must look like a placeholder, not like a confident decision. The skill refuses to invent stock photos as if they were the final design.
- Imagery rows above don't override genre overlays. Modern-minimal genre still suppresses decorative kit imagery (gate in `imagery-kit.md` anti-patterns).

The hierarchy below picks the tier *after* this gate decides imagery is needed at all. Skipping this gate is what produces "blob illustration on every page" outputs — exactly the AI-default Hallmark refuses.

---

## The enrichment hierarchy

Reach for the highest tier the brief lets you ship in the time you have. Skipping tiers is the new tell.

| Tier | What | When |
| --- | --- | --- |
| **0 · Typography only** | No enrichment. Display, lede, optional CTA. | Always acceptable. The strongest fail-state. |
| **A · Custom-built CSS art** | Pure-CSS shapes, gradients, clip-paths, no asset, zero dependency. | Geometric shapes, gradient compositions, glyph-style decoration. |
| **B · Hand-built SVG** | Designed in Figma, optimised, animated declaratively. | Illustrations more complex than CSS handles cleanly — a loaf, a mascot, a workflow diagram. |
| **C · Generated illustration** | Nanobanana / Recraft V4 / Midjourney, with provenance + post-processing. | Characters or specific scenes that hand-build can't economically reach. Always post-processed. |
| **D · Library illustration** | Storyset / Humaaans / unDraw, customised with brand colours. | When budget and timeline force a shortcut — and even then, never unmodified. |
| **E · Lottie animation** | LAST RESORT. Only when complex character motion can't be hand-built. | Articulated figures, multi-frame mascot loops. Never for "spinning logo" or "checkmark draw" — those are CSS. |

**The discipline.** If you can do it in tier A, do it in tier A. If A can't reach it, try B. Only drop to C when characters demand it. Only D when the brief is explicit about "fast and cheap". Only E when E is genuinely the only option. Reaching for E because it's familiar — and many AI tools do — is the signature of a templated page.

See [`custom-craft.md`](custom-craft.md) for *how* to build (its craft tiers are lettered by construction method: css, svg, animation, webgl, generated, lottie; match by name). See [`assets.md`](assets.md) for the catalogue of sources for generated stills, libraries, and Lottie.

---

## Eyeball or ask — the decision protocol

Two paths to picking enrichment:

```
If the brief contains explicit visual cues, pick from this map:

  • "demo", "show how it works", "product tour"           → E1 / E2 demo video
  • "platform", "tool", "infra", "dashboard", "developer" → E3 / E4 mockup
  • "shop", "store", "menu", "products", "items"          → E8 photography (or F6 product grid)
  • "bakery", "kitchen", "café", "atelier" + craft brief  → E5 custom illustration (Tier B SVG)
  • "agency", "studio", "portfolio"                       → E8 photography or no enrichment
  • "manifesto", "essay", "book", "letter"                → no enrichment (typography only)
  • Coral theme picked                                    → no enrichment (the theme IS restraint)

Else if the brief is genuinely ambiguous, ask one question:
  "Want me to add a demo video, an illustration, or keep it
   typography-only? I default to typography-only because it's
   the strongest fail-state."

Else default to no enrichment. State the inference in one sentence
in your reply, alongside the macrostructure inference.
```

When in doubt: don't enrich. The hero will be fine. Most great landing pages are typographic.

---

## Eight enrichment archetypes — index

Each file carries the full recipe: definition, use-when / avoid-when, variation knobs (consistent with [`component-cookbook.md`](component-cookbook.md)), a worked example, and a code sketch where the build is non-obvious. **Pick zero or one. Then read ONLY that one file.**

- **E1 · Demo Video, clipped by the viewport edge**: headline left, demo video right, the rightmost 10-20 % cut off past the viewport. SaaS with real footage, or a Tier A CSS-art mockup. [`enrichment/e1-clipped-demo-video.md`](enrichment/e1-clipped-demo-video.md)
- **E2 · Demo Video, full-bleed muted loop**: video as wallpaper under a ghost overlay; the feel is the message, not the detail. [`enrichment/e2-fullbleed-muted-loop.md`](enrichment/e2-fullbleed-muted-loop.md)
- **E3 · Mock App Screenshot, browser-framed split**: framed screenshot right, slight tilt, numbered pin annotations. [`enrichment/e3-browser-framed-split.md`](enrichment/e3-browser-framed-split.md)
- **E4 · Mock App Screenshot, floating no-frame**: chrome-less screenshot with soft shadow; demands a beautiful capture. [`enrichment/e4-floating-no-frame.md`](enrichment/e4-floating-no-frame.md)
- **E5 · Custom Illustration Centerpiece**: one hand-built SVG (Tier B) or generated raster (craft tier: generated) as the hero's single illustrative element. [`enrichment/e5-custom-illustration-centerpiece.md`](enrichment/e5-custom-illustration-centerpiece.md)
- **E6 · Animated Loop**: one small custom CSS / SVG loop, 4 s or less, that gives an otherwise still page life. [`enrichment/e6-animated-loop.md`](enrichment/e6-animated-loop.md)
- **E7 · Abstract Background**: two-colour low-chroma gradient plus feTurbulence grain; paper texture, never aurora. [`enrichment/e7-abstract-background.md`](enrichment/e7-abstract-background.md)
- **E8 · Hero Photography**: one tightly-cropped photograph with a margin-aligned caption; cookbook H6 cross-reference. [`enrichment/e8-hero-photography.md`](enrichment/e8-hero-photography.md)

---

## Hero shape polish — patterns beyond enrichment

The eight enrichment archetypes above (E1–E8) decide *what sits next to the headline*. The four polish patterns below decide *how the headline itself sits* — they affect layout, type, motion, not decoration on top. They are admissible on top of any hero macrostructure (Marquee Hero, Stat-Led, Quote-Led, Letter, Photographic). Pick one polish pattern when the hero feels shape-flat — colour-only, symmetric, predictable.

You can ship a hero with one polish pattern *and* one enrichment archetype, but never two polish patterns at once. The hero is a high-stakes surface; one structural choice carries it. **Pick zero or one. Then read ONLY that one file.**

- **HP1 · Vertical-rail title**: the wordmark runs vertically beside the body; studio and editorial energy. [`enrichment/hp1-vertical-rail-title.md`](enrichment/hp1-vertical-rail-title.md)
- **HP2 · Marquee-overflow**: the H1 intentionally bleeds past the viewport edge; short loud titles only. [`enrichment/hp2-marquee-overflow.md`](enrichment/hp2-marquee-overflow.md)
- **HP3 · Cursor-spotlight**: a radial gradient tracks the cursor, scoped to the hero backdrop only. [`enrichment/hp3-cursor-spotlight.md`](enrichment/hp3-cursor-spotlight.md)
- **HP4 · Decorative-numeral**: a huge display-italic numeral that means something (issue, year, version, chapter). [`enrichment/hp4-decorative-numeral.md`](enrichment/hp4-decorative-numeral.md)

The decision sequence:

1. Pick the hero macrostructure (Marquee Hero, Stat-Led, Quote-Led, Letter, Photographic) — see [`macrostructures.md`](macrostructures.md).
2. Pick zero-or-one **enrichment archetype** (E1–E8 above).
3. Pick zero-or-one **polish pattern** (HP1–HP4 above).
4. Load [`enrichment/hero-discipline.md`](enrichment/hero-discipline.md) alongside your pick and apply it: space discipline, hero animation discipline, and the eight pre-flight quality questions that decide whether the enrichment ships at all.
5. Stamp the choices into the macrostructure stamp.

---

## Output stamp

When you ship enrichment, the macrostructure stamp records the choice:

```css
/* Hallmark · macrostructure: Marquee Hero · H1 hero knobs: size=xxl, alignment=left-bias
 * enrichment: E1 Clipped-Edge Video · clip=right, aspect=16/10, frame=hairline
 * polish: HP3 Cursor-spotlight (scoped to hero, reduced-motion fallback pinned at 50%/30%)
 * nav: N5 Floating pill · footer: Ft5 Statement
 * craft: tier-A CSS art (no real video — pure custom-built mockup)
 * theme: Newsprint · accent: steel-blue ~3% · studied: no
 */
```

If no polish pattern is used, omit the `polish:` line — don't fake it. Same for enrichment.

This signals to future Hallmark runs (and to the audit verb) what was chosen and how. It also lets the user see the inferences in one place and redirect if anything's off.
