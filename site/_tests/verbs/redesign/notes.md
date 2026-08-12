# `redesign` verb · what changed and why

## Input

`input.html` — a 60-line landing page for a fictional AI product called "Nexus". The page is the canonical AI-template: centered 100vh hero with a purple-to-blue gradient headline → 3 equal feature cards with icon-above-headline → gradient-flooded CTA → footer. Hits 14 anti-patterns (see [`../audit/audit-report.md`](../audit/audit-report.md)).

## What `redesign` does

> *"Take the target's content and intent, throw out the structure, and rebuild it from scratch with a deliberately different structural fingerprint. Preserve copy, brand, and information architecture; replace everything else."*

The user is **not** happy with the structure — that's why the previous `audit` recommended `redesign` over `refine`. The verb's job is to keep the words and replace the shape.

## What was preserved (every word verbatim)

- **Headline:** "The AI-powered platform for modern teams"
- **Sub-copy:** "Nexus helps you ship faster, collaborate smarter, and scale seamlessly with AI-native workflows built for the way teams work today."
- **Button label:** "Get started free"
- **Three feature headings:** "Lightning fast" · "Built to scale" · "Built for the modern team"
- **Three feature bodies (verbatim):** "Get up and running in seconds with our AI-native onboarding flow." · "From startup to enterprise — Nexus grows with you, every step of the way." · "Tools that get out of your way and let your team do their best work."
- **CTA headline:** "Ready to ship faster?"
- **CTA sub-copy:** "Join 50,000+ teams already building with Nexus."
- **Footer copy:** "© 2026 Nexus, Inc. · All rights reserved."
- **Brand name** + product positioning ("AI-powered platform for modern teams")

The redesign **does not** rewrite the cliché copy — that's not the verb's job. (Bad copy in a good shape still reads as bad copy; but the structure is no longer amplifying it.)

## What was replaced

| Axis | Input | Output | Why |
| --- | --- | --- | --- |
| **Macrostructure** | Hero (centered, 100vh) → 3-Card Grid → CTA → Footer | **Workbench** — left-bias hero (1.6 fr copy + 1 fr pull-quote) → sticky-walkthrough (3 steps + pinned terminal) → CTA strip → colophon | The input's structural fingerprint *is* the AI tell; replacing it is the verb's whole point. |
| **Theme** | Pure white + purple-to-blue gradient + Inter | **Plain** — pure-white paper with cool grey rules + Inter Tight + deep ink-blue accent at < 2 % | Plain is the closest sober theme to "platform / SaaS" without the AI gradient cliché. |
| **Hero alignment** | centered 100vh | left-bias 70vh | Centered 100vh is the AI default; left-bias with the pull-quote on the right gives the page asymmetry. |
| **Headline treatment** | 4 rem, 900 weight, gradient-text | clamp(2.5–4.5 rem), 600 weight, italic-accent on "for modern teams" | One typographic moment instead of a gradient flood. |
| **Three features** | 3-equal-columns grid with gradient-icon cards | numbered sticky-scroll steps with rule on the left | Same three pieces of copy; new rhetorical container. The reader experiences them sequentially, not in parallel. |
| **CTA section** | Full-bleed gradient block, 6rem padding, centered button | Single-line CTA strip with copy on the left + button on the right | The full-bleed gradient is the loudest tell on the input; the strip is sober. |
| **Buttons** | Pill `border-radius: 9999px`, gradient bg, bouncy hover | Square 2 px radius, accent-fill / outline pair, named easing, focus-visible ring | Pill + gradient + bouncy is the third stacked cliché; sober + named-easing is the substitute. |
| **Icons / decoration** | Emoji-icons (`⚡`, `🚀`, `🎯`) inside gradient squares | (none — no icons) | Icon-above-headline is the AI 3-card tell; removing the icons removes the tell. |
| **Easings / motion** | `transition: all 300ms cubic-bezier(0.34, 1.56, ...)` (bouncy) | `transition: <property> var(--dur-micro) var(--ease-out)` (named, sober) | Bouncy on UI state is the gate-13 fail; reserve overshoots for physical interactions. |
| **Colour tokens** | inline hex / rgb / gradients | OKLCH custom properties at `:root` with semantic names | Gate 24 + the project's token discipline. |
| **Pinned demo** | (none — no demo) | A 4-line `nexus init` terminal block in the right column | Adds proof-of-concept (the input gestured at "AI-native workflows" but never showed any); the demo is intentionally tiny — Tier-A pure-CSS, no Lottie, no recording. |

## What `redesign` *did not* do

- **Did not rewrite the copy.** The cliché phrases stayed. (That's `redesign`'s discipline — the user keeps the words.)
- **Did not change the brand name** or the product positioning.
- **Did not add sections that weren't implied** by the original IA. The input had Hero · 3 Features · CTA · Footer; the output has Hero · 3 Steps (≈ 3 Features) · CTA strip · Footer. Same IA, different containers.

## Slop test

| Before | After |
| --- | --- |
| 24 / 38 ✓ (failed gates 1–4, 5, 6, 9–18, 24–28) | 38 / 38 ✓ |

## Stamp

The output's `<style>` opens with:

```
/* Hallmark · macrostructure: Workbench · F2 sticky-scroll knobs: pinned=right, content=feature-card, steps=3
 * theme: Plain · accent: deep-ink-blue ~2% · enrichment: none (typography only)
 * studied: no · context: redesign — copy & IA preserved, structure & visual rebuilt
 */
```

The `studied: no · context: redesign` flag tells the next Hallmark run that the page's macrostructure was a deliberate redesign choice — `audit` will be lenient on "Specimen-fall-through" and strict on "did the redesign actually use the new fingerprint, or did it drift back".

## Why this is the right verb here

The audit recommended `redesign` over `refine` because the page's structural fingerprint *was* the slop. `refine` would have left the centered-hero + 3-card + gradient-CTA shape intact — fixing the colour tokens and easings, but the page would still look AI-generated. `redesign` was the right call.

If the user had said "I love the shape, just fix the colours" → `refine`. If they say "throw it out, keep my words" → `redesign` (this page). The two verbs have surgical-vs-restructural roles, and the audit decides which.
