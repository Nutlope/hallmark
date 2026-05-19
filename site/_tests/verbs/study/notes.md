# `study` verb · what fired and why

## Input

A described screenshot (`input-description.md`) of a Pentagram-style design studio's portfolio homepage. Italic-serif studio mark, numbered project list, warm cream paper, single warm-orange accent on the active row, Single-Line Colophon footer.

## What `study` does

> *"Extract the DNA — macrostructure, archetypes, type-pairing role, colour anchor, rhythm — and produce a diagnosis report, then optionally rebuild the user's content using the extracted DNA. Never copies pixels. Never claims to identify exact fonts. Refuses obvious template-marketplace or competitor-page screenshots."*

Five-step pipeline (per [`SKILL.md`](../../../SKILL.md) § `hallmark study`):

1. **Refuse-or-proceed check** — public reference, not a paid template, not a direct competitor's live page → proceed.
2. **Vision pass** — read the image into the structured-fields schema in [`study.md`](../../../references/study.md). Output ten fields.
3. **Diagnosis report** — return the named macrostructure + archetypes + anti-patterns to NOT carry over. See [`diagnosis.md`](diagnosis.md).
4. **Confirmation question** — ask before building.
5. **Build** — produce `output.html` + `output.css` with the user's actual six projects, stamped `studied: yes`.

## What loaded

- [`references/study.md`](../../../references/study.md) — the protocol, schema, and refusal heuristics.
- [`references/study-examples.md`](../../../references/study-examples.md) — the three worked examples (Pentagram-style portfolio, Klim-specimen, Rauno-personal). The Pentagram example matched our screenshot most closely; the skill imitated the diagnosis structure.
- [`references/macrostructures.md`](../../../references/macrostructures.md) — to name the page-shape (Specimen).
- [`references/component-cookbook.md`](../../../references/component-cookbook.md) — for archetype names (H4 Margin-Number Display, Ft1 Single-Line Colophon).
- [`references/typography.md`](../../../references/typography.md) — for the type-role vocabulary (italic-display + sans-body) and free / paid candidate pairings.
- [`references/color.md`](../../../references/color.md) — for the warm-orange-at-low-chroma colour-anchor.
- [`references/microinteractions.md`](../../../references/microinteractions.md) — for the hover-duration anti-pattern callout (the screenshot's 800 ms is too slow; should be 150–200 ms).

## What `study` did *not* do

- **Did not name the exact font.** Visual font ID is unreliable; the skill named the *role* (italic editorial serif at high optical size) and proposed two real candidates (Fraunces free / Tiempos Headline paid).
- **Did not pixel-clone.** The output uses Coelho Studio's six actual projects, not "Aperture's" five-or-whatever projects. The bones come from the screenshot; the words and projects come from the user.
- **Did not copy the screenshot's hover duration.** The screenshot used 800 ms; the rebuild uses 180 ms. The skill flagged this in the diagnosis as anti-pattern-to-not-carry-over.
- **Did not copy the screenshot's footer text size.** The screenshot used 11 px; the rebuild uses 13 px. Below 14 px is below the body floor (per `typography.md`); the skill flagged this and bumped it.
- **Did not copy any imagery, photography, or proprietary content.**

## Stamp

The output's first CSS comment block:

```
/* Hallmark · macrostructure: Specimen · H4 hero knobs: number-column=margin, alignment=left-bias
 * theme: Specimen · accent: warm-orange ~3% · enrichment: none (typography only)
 * studied: yes · DNA-source: user reference (Aperture-style portfolio) · paid-fonts: not confirmed (free pairing applied)
 */
```

The `studied: yes` flag tells future `audit` runs to be lenient on "Specimen-fall-through" (gate 23) — the user explicitly chose this DNA — but stricter on "did the page actually use the extracted DNA?" The `paid-fonts: not confirmed` flag documents the substitution to the user.

## Why this is the canonical `study` test

The screenshot maps neatly to study-examples.md Example A (Pentagram-style editorial portfolio). It exercises:

- The refusal heuristics (public reference, not a competitor → proceed).
- The 10-field structured schema.
- The font-role-not-font-ID discipline.
- The "anti-patterns the screenshot has — do NOT carry over" output.
- The confirmation question.
- The `studied: yes` stamp.

If the input had been a paid Squarespace-template marketplace screenshot, the verb would have refused. If the input had been a direct competitor's live site, the verb would have asked before extracting. Both branches are documented in [`study.md`](../../../references/study.md); this test exercises the proceed-with-public-reference branch.
