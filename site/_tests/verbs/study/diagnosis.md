# `hallmark study` — diagnosis report

> User invocation: *"hallmark study aperture-portfolio.png"*

## References loaded

- [`study.md`](../../../references/study.md) — the vision-extraction protocol + structured-fields schema + refusal heuristics
- [`study-examples.md`](../../../references/study-examples.md) — three worked examples (Pentagram-style portfolio, Klim-specimen, Rauno-personal)
- [`macrostructures.md`](../../../references/macrostructures.md) — to name the page-shape
- [`component-cookbook.md`](../../../references/component-cookbook.md) — to name the hero / pitch / footer archetypes

## Diagnosis (10 structured fields)

> **1. Macrostructure** · **Specimen** (numbered left-margin labels + huge italic serif + asymmetric spans + typographic-only CTA).
>
> **2. Hero archetype** · **H4 Margin-Number Display** — the page's only anchor is a vertical column of two-digit indices.
>
> **3. Pitch archetype** · none. The work *is* the pitch.
>
> **4. Footer archetype** · **Ft1 Single-Line Colophon** — studio name, year, contact, three links, no nav.
>
> **5. Display family role** · italic editorial serif (high optical size, soft axis, ink-black). One free candidate: *Fraunces* italic display. One paid candidate the user might confirm: *Tiempos Headline*. **The skill names roles, not exact font IDs — visual font ID is unreliable.**
>
> **6. Body family role** · geometric sans (humanist Inter-Tight-or-similar at 350–400 weight). One free candidate: *Geist*. One paid candidate: *Söhne*.
>
> **7. Surface lightness band** · light (paper L ≈ 96 %). Slight warm tint at hue 80 — Pentagram-warm cream, not stark white.
>
> **8. Accent hue band + chroma** · warm-orange ~25–30°, low chroma (≤ 0.13), used at < 5 % of viewport. One accent, applied to active state and the one number the brand wants the visitor to remember.
>
> **9. Density verdict** · sparse. ~3–4 macro elements on the first viewport. Generous vertical margin between rows (≥ `--space-3xl`).
>
> **10. Type-pairing role** · italic-display + sans-body — the canonical editorial pairing.

## Anti-patterns the screenshot has — do NOT carry over

> 1. The hover-state on the number-label uses a slow ease-in-out 800 ms colour fade. Per [`microinteractions.md`](../../../references/microinteractions.md) § The timing canon, hover state should be 150–200 ms. **Carry the *idea* (colour-shift on hover); shorten the *duration*.**
>
> 2. The footer text is set at 11 px with 0.06 em tracking — under the 14 px floor for body copy. **Bump to 12–13 px on rebuild, keep the tracking.**

## Confirmation question (the skill always asks before building)

> *"Adopt this DNA wholesale, or change one axis? For example, I could keep the macrostructure (Specimen) but pick a theme that better matches your work. If your tone is more ink-blue and B2B, I'd suggest **Plain** (pure-white paper) instead of the warm-cream **Specimen** theme. If your work is craft-led and warm, **Specimen** is the closer match."*
>
> *"Also: visual font ID is unreliable. The closest free pairing is **Fraunces italic + Geist** — that's what I'll ship by default. If you have a licence for the paid pair (Tiempos / Söhne), say so before I build."*

## What the user answered

> *"Adopt the DNA wholesale. We're craft-led; Specimen is the right match. Use the free pairing — we don't have paid licences."*

## What the skill builds

`output.html` + `output.css` — Coelho Studio's actual six projects rendered with the extracted DNA. The bones come from the screenshot; the words and projects come from the user. **No pixel-faithful reproduction.** See [`notes.md`](notes.md) for what fired.
