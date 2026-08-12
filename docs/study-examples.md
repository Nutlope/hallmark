# `hallmark study` — three worked examples

How `study` reads a screenshot the user admires, returns a diagnosis, and (optionally) rebuilds the user's content with the extracted DNA. Each worked example below shows: what the user pasted · what the skill names · what it refuses to do · what it produces.

The whole point of `study`: extract **structural DNA** (macrostructure + archetypes + type-pairing role + colour anchor + rhythm), **never pixels**. If the user wants a 1:1 copy, they want a different tool. Hallmark hands them a diagnosis and lets them keep the bones.

---

## Example A · A Pentagram-style editorial portfolio

**What the user pastes:** a screenshot of a New York studio's portfolio site — large italic-serif name in the top-left margin, numbered project list flowing down the page, generous warm-cream paper, a single warm-orange accent on the active project, a hairline rule between rows. (User says: *"I want my portfolio to feel like this.")*

### Refuse-or-proceed check

Public reference for inspiration → proceed. (Refusal heuristics fire on: paid-template-marketplace listings, copy-protected portfolios. None match.)

### Diagnosis report (what `study` returns first)

> **Macrostructure:** **Specimen** (numbered left-margin labels + huge italic serif + asymmetric spans + typographic-only CTA).
>
> **Hero archetype:** H4 Margin-Number Display — the page's only anchor is a vertical column of two-digit indices.
>
> **Pitch archetype:** none. The work is the pitch.
>
> **Footer archetype:** Ft1 Single-Line Colophon — studio name, year, contact, three links, no nav.
>
> **Display family role:** italic editorial serif (high optical size, soft axis, ink-black). **Body family role:** geometric sans (humanist Inter-Tight-or-similar at 350-400 weight). Two free candidates: *Fraunces* italic display + *Geist* body. One paid candidate the user might confirm: *Tiempos Headline* + *Söhne*. The skill names *roles*, not exact font IDs — visual font ID is unreliable.
>
> **Surface lightness band:** light (paper L ≈ 96%). Slight warm tint at hue 80 — Pentagram-warm cream, not stark white.
>
> **Accent hue band + chroma:** warm-orange ~25-30°, low chroma (≤ 0.13), used at < 5% of viewport. One accent, applied to active state and the one number the brand wants the visitor to remember.
>
> **Density verdict:** sparse. ~3-4 macro elements on the first viewport. Generous vertical margin between rows (≥ `--space-3xl`).
>
> **Type-pairing role:** italic-display + sans-body — the canonical editorial pairing.
>
> **Two anti-patterns the screenshot has** that you should NOT carry over:
>
> 1. The hover-state on the number-label uses a slow ease-in-out 800 ms colour fade. Per `microinteractions.md` § The timing canon, hover state should be 150–200 ms. Carry the *idea* (colour-shift on hover); shorten the *duration*.
> 2. The footer text is set at 11 px with 0.06em tracking — under the 14 px floor for body copy. Bump to 12-13 px on rebuild, keep the tracking.

### Confirmation question

> *"Adopt this DNA wholesale, or change one axis? For example, I could keep the macrostructure (Specimen) but pick a theme that better matches your work — if your tone is more ink-blue and B2B, I'd suggest **Plain** (pure-white paper) instead of the warm-cream **Specimen** theme."*

### What `study` builds when the user says "go"

Macrostructure stamp:
```css
/* Hallmark · macrostructure: Specimen · H4 hero knobs: number-column=margin, alignment=left-bias
 * theme: Specimen · accent: warm-orange ~3% · enrichment: none
 * studied: yes · DNA-source: user reference · paid-fonts: not confirmed (free pairing applied)
 */
```

Output: the user's actual portfolio entries arranged in a numbered-margin column with italic-Fraunces titles and Geist-body summaries. Hover delays shortened to 200 ms. Footer text bumped to 12 px. The bones come from the screenshot; the words and projects come from the user.

---

## Example B · A Klim-Type-Foundry-leaning specimen

**What the user pastes:** a screenshot of a type-specimen page — full-bleed black paper, single huge geometric-sans display character ("R") tilted -2°, a ruled grid behind it, a footer-band with the typeface name, weight, OpenType features, and a tiny set of glyph callouts. (User says: *"This is the energy I want for our agency rebrand.")*

### Refuse-or-proceed check

Type specimens are typically published references; proceed. (If the screenshot were a paid font foundry's marketing page with an explicit "preview is licensed" watermark, the skill would refuse and ask the user to bring an unconfirmed reference.)

### Diagnosis report

> **Macrostructure:** **Type Specimen** (single character or word centred + ruled grid + footer-band of metadata).
>
> **Hero archetype:** H9 Single-Glyph — the entire above-the-fold is one letterform.
>
> **Pitch archetype:** none on the first viewport. The page is *the work being specified*. Pitch (if any) lives below the fold as supporting paragraphs.
>
> **Footer archetype:** Ft3 Tabular-Specimen — name · weight · OpenType features · designer credit.
>
> **Display family role:** geometric-sans-heavy (display-display, weights 800-900). **Body family role:** the same sans at 400 — single-font specimen pages are allowed when the single font *is* the design (per `typography.md`). Free candidate: *Bricolage Grotesque 800*. Paid candidate: *Druk* or *NaN Jaune*. *Refuse to guess the exact paid font ID.*
>
> **Surface lightness band:** dark (paper L ≈ 12%). The dark is uniform across the viewport — no gradient.
>
> **Accent hue band + chroma:** chromatic-other — single hot-orange callout at ≈ 0.18 chroma, used on **one** OpenType-feature label. Even in a stark specimen, the rule "accent < 5% of viewport" holds.
>
> **Density verdict:** ultra-sparse. One element above the fold. Density only increases below.
>
> **Type-pairing role:** single-family specimen (single-font is the design). Body and display the same family at different weights.
>
> **Two anti-patterns the screenshot has** to NOT carry over:
>
> 1. The footer-band uses light-grey text (oklch ~75% lightness) on near-black paper. Contrast ratio ~3.2:1 — fails WCAG AA for body. Bump to oklch ~88% on rebuild.
> 2. The grid lines behind the glyph are at 1 px solid white at 0.4 opacity. On a 4K display this becomes a sub-pixel that disappears or aliases. Use 1 px solid + colour-mix down to 35% lightness instead — keeps visibility across pixel densities.

### Confirmation question

> *"This DNA is for a specimen page, not a marketing page. If you're rebranding an agency, the glyph hero will be impressive on the first visit and pointless after. Suggested adaptation: Type Specimen as the homepage, then a Long Document or Workbench pattern for the about / case-studies / contact pages. Pick: keep all-Specimen, or hybrid?"*

### What `study` builds (hybrid path)

Macrostructure stamp:
```css
/* Hallmark · macrostructure: Type Specimen · H9 hero knobs: glyph=user-mark, tilt=-2deg, grid=1px-soft
 * theme: Manifesto · accent: hot-orange ~3% · enrichment: none
 * studied: yes · DNA-source: user reference · paid-fonts: not confirmed (Bricolage 800 free)
 */
```

The homepage emits the agency's mark in 22-rem Bricolage 800, ruled grid behind, single-line metadata footer. The about and case-study pages inherit the dark-paper + geometric-sans tokens but switch to **Workbench** macrostructure (left-margin index + 1fr content). Brand consistency, structural variety.

---

## Example C · A small-studio personal site (Rauno-Freiberg-style)

**What the user pastes:** a screenshot of a personal designer-engineer site — dark-mode paper, a small italic-serif name in the top-left, a single demo embed at the centre (CSS-art clock that ticks), a writing list below. (User says: *"I want my own personal site to feel like this.")*

### Refuse-or-proceed check

An ambiguous source is the edge case here. Per `study.md` § Refusal heuristics: when you can't tell whether the source is the user's own work or someone else's, ask first.

> *"Is this your own work, a public reference for inspiration, or someone else's live site? If it's someone else's live site, I'll extract the DNA at the structural level only — no copy, no demos, no font IDs — and you'll bring your own content. If it's a paid portfolio template, I won't reproduce it."*

User confirms: public reference for inspiration → proceed with DNA extraction only.

### Diagnosis report

> **Macrostructure:** **Long Document** with a centred demo as the hero archetype.
>
> **Hero archetype:** H5 Centered-Demo — a single hand-built artefact (CSS art, SVG illustration, declarative animation) sized at ~24 rem, centred on the page, no other hero copy above it.
>
> **Pitch archetype:** P3 List-of-Writings — title + date + 1-line summary, in a tabular column.
>
> **Footer archetype:** Ft1 Single-Line Colophon.
>
> **Display family role:** italic editorial serif. **Body family role:** geometric sans, body weight 400. Free candidate pairing: *Fraunces* italic + *Geist*.
>
> **Surface lightness band:** dark (paper L ≈ 16%). Slight cool tint at hue 240. Inks at ~90-95% L, also slight cool.
>
> **Accent hue band + chroma:** chromatic-other — green at hue 145, ≈ 0.14 chroma. Used on the active demo's signal element (the ticking dot), nowhere else.
>
> **Density verdict:** sparse-medium. Hero demo + ~12-line writing list above the fold.
>
> **Type-pairing role:** italic-display-with-sans-body — same as Specimen, just on dark paper.
>
> **One anti-pattern the screenshot has** to NOT carry over:
>
> 1. The CSS-art clock loops at 1 fps with no `prefers-reduced-motion` fallback. **Always pair declarative animation with a reduced-motion alternative** (`microinteractions.md` § Reduced motion is a first-class state, not an afterthought).
>
> One thing the screenshot does *better than most* and you SHOULD carry over:
>
> 1. The italic name in the top-left has a baseline at the same y-position as the centred demo's vertical centre — a subtle horizontal-baseline alignment that makes the page feel composed rather than stacked. Carry this; it's invisible until removed.

### Confirmation question

> *"The DNA is portable: dark paper · italic-Fraunces name · centred demo · cool-green accent. Two questions before I build: (1) what's your demo? — I can hand-build it as Tier-A CSS art if you describe it, or you can paste an existing animation. (2) do you have ~5 writings to seed the list, or should I leave a placeholder section?"*

### What `study` builds when the user provides their own demo + writings

Macrostructure stamp:
```css
/* Hallmark · macrostructure: Long Document · H5 hero knobs: demo=centered, size=24rem
 * theme: Midnight · accent: forest-green ~3% · enrichment: Tier-A custom-craft (user-supplied recipe)
 * studied: yes · DNA-source: user reference · with reduced-motion fallback
 */
```

Output: the user's actual name in italic-Fraunces top-left, their demo (e.g. an ambient breathing-loop) hand-built as CSS art with an explicit `@media (prefers-reduced-motion: reduce)` fallback, their writings tabulated below in Geist body. The bones from the screenshot; the demo and writings from the user. **No pixel-faithful reproduction.**

---

## What `study` doesn't do (worth restating)

1. **Names the font role, not the font ID.** Visual font identification is unreliable. The skill proposes one or two real candidates from the canon and asks the user to confirm.
2. **Never copies pixels.** The DNA is the macrostructure + archetype + colour-anchor + type-pairing — not the dress.
3. **Refuses the obvious bad sources.** Paid-template-marketplace listings; copy-protected portfolios without permission.
4. **Always disclosures the substitutions.** When the screenshot's font is paid (Tiempos / Söhne / Druk) and the user hasn't confirmed a licence, the skill names a free understudy (Fraunces / Inter Tight / Bricolage Grotesque) and *says it's substituting*.

These three examples cover the most common categories of `study` request: an editorial portfolio, a type-specimen statement page, and a small personal site. The protocol is the same for every screenshot — refuse-or-proceed, diagnose, confirm, build. See [`study.md`](../skills/hallmark/references/study.md) for the full protocol.
