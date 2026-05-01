# Test 01 v2 — Tide (indie podcast)

## The prompt (verbatim, same as v1)

> "build me a landing page for my indie podcast called Tide. just go ahead, you pick."

## Step 0 · Pre-flight

> *"No pre-flight signals — proceeding with full Hallmark stack."*

(Vanilla scratch directory; no `package.json`, no `tailwind.config.*`, no existing CSS — silent pre-flight.)

## Step 1 · Design-context gate — skipped

The user opted out. Skill states inferences in one sentence:

> *"Going with: audience = listeners who care about voice and atmosphere · use = listen + subscribe · tone = intimate, hand-set, voice-led. If any of those is wrong, redirect."*

## Step 2.5 · Project memory rotation

> *"This is the first Hallmark v0.6.0 run for this project. No `.hallmark/log.json` rotation needed."*

(But the v1 stamp at `_tests/01-tide-podcast/style.css` says **Quote-Led + Atelier**. The v2 brief is to re-run the same prompt with the new skill — picking a different macro/theme to demonstrate the diversification rule firing in a "second visit" frame.)

> *"Previous run on this brief picked Quote-Led + Atelier. Picking from {Letter, Index-First, Long Document} this time — Letter wins for an audio-domain brief because the medium is voice and a letter to the listener carries weight a pull-quote doesn't repeat."*
>
> *"Theme rotation: Atelier (light · italic-serif · warm) → Salon (light · mono-display · warm). Differs on display style. Passes."*

## Step 3 · Visual ruleset loaded

`macrostructures.md` (Letter), `component-cookbook.md` (H6 Letter Hero), `typography.md` (mono-display + roman-serif body — Salon's pairing), `color.md`, `microinteractions.md` (single primitive: caret blink only), `anti-patterns.md`.

## Step 4 · Hero enrichment

> *"Enrichment: none (typography only). Letter macro on Salon theme; the prose is the design. Adding a Lottie or a Midjourney microphone shot would dilute the voice — same anti-slop call as v1."*

## Step 5 · Preview

```markdown
**Hallmark · v0.6.0**

- **Macrostructure** · Letter
- **Theme** · Salon (warm-cream paper · IBM Plex Mono display · Cormorant Garamond serif body · warm-amber accent ~2%)
- **Enrichment** · none (typography only)
- **Sections** · Masthead · Salutation · Letter body (3 paragraphs) · Listen-where row · Colophon
- **Motion** · cursor caret blink only (1 primitive)
- **Slop test** · 38 / 38 ✓
- **Diversification** · differs from v1 (Quote-Led/Atelier) on macrostructure + display style
```

## Step 6 · Macrostructure stamp

```
/* Hallmark · macrostructure: Letter · H6 hero knobs: salutation=greeting, body=3 paragraphs, signoff=initials
 * theme: Salon · accent: warm-amber ~2% · enrichment: none (typography only)
 * studied: no · context: skipped, inferred (audio domain) · v0.6.0
 */
```

## What changed vs v1

- **Macro:** Quote-Led → Letter. The pull-quote frames a podcast as listened-to-by-others (third-party endorsement); Letter frames it as host-to-listener (first-person address). Both work; Letter is more intimate, which the rotation rule was steering toward.
- **Theme:** Atelier → Salon. Both warm-cream, both light. Atelier is italic-serif display; Salon is mono display + serif body. Display-style differs, so the diversification gate passes.
- **Voice:** the v1 page opens with a listener's quote; this opens with the host's salutation. Same word-count budget, different rhetorical posture.
- **Microinteraction:** v1 had no motion. v2 keeps it just as restrained — only a blinking caret on the salutation, optional.

## What stayed the same

- Enrichment tier: none on both. Voice carries the brand.
- Section count: ~5, both pages.
- Slop test: 38 / 38 ✓ on both.
