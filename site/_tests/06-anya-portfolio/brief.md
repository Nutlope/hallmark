# Test 06 v2 — Anya (software architect personal site)

## The prompt (verbatim, same as v1)

> "I'm Anya, a software architect. Build me a one-pager. Don't ask me questions, just figure it out."

## Step 0 · Pre-flight

> *"No pre-flight signals — proceeding with full Hallmark stack."*

## Step 1 · Design-context gate — skipped (explicit)

> *"Going with: audience = engineering leaders considering Anya for hire / consult · use = read about Anya, then contact · tone = austere, technical, prose-led. If any of those is wrong, redirect."*

## Step 2.5 · Project memory rotation

> *"Previous run on this brief picked Long Document + Studio + none. Picking from {Index-First, Letter, Specimen} for the macro this time — Index-First wins because a senior IC's one-pager benefits from a tabular structure (years · companies · domains) more than a prose-led essay; the sidebar TOC also makes the page scannable for hiring managers reading on a 30-second window."*
>
> *"Theme rotation: Studio (light · italic-serif · chromatic-green) → Plain (light · display-heavy · cool-deep-ink-blue). Differs on display style and accent hue. Passes."*

## Step 3 · Visual ruleset loaded

`macrostructures.md` (Index-First), `component-cookbook.md` (sidebar-TOC archetype, prose-block), `typography.md` (Plain pairing — Inter Tight display-heavy + Bricolage wordmark + body sans), `color.md` (Plain palette — pure-white paper, near-neutral cool greys, deep ink-blue), `microinteractions.md` (single primitive: TOC active-section highlight on scroll), `anti-patterns.md`.

## Step 4 · Hero enrichment

> *"Enrichment: none. The page is a TOC + prose. A personal portfolio that builds a Three.js spinning name reads as overcompensating. Restraint is the credibility signal."*

## Step 5 · Preview

```markdown
**Hallmark · v0.6.0**

- **Macrostructure** · Index-First
- **Theme** · Plain (pure-white paper #fff · Inter Tight display-heavy · deep ink-blue accent ~2%)
- **Enrichment** · none (typography only — restraint is the credibility signal)
- **Sections** · Sidebar TOC · 00 Index · 01 Now · 02 Years · 03 Writing · 04 Reach
- **Motion** · TOC active-section highlight (1 primitive)
- **Slop test** · 38 / 38 ✓
- **Diversification** · differs from v1 (Long Document/Studio) on macrostructure + display style + accent hue
```

## Step 6 · Macrostructure stamp

```
/* Hallmark · macrostructure: Index-First · F4 sidebar-toc knobs: width=12rem, sticky=true, numbered=00-04
 * theme: Plain · accent: deep-ink-blue ~2% (used as section-num + one rule)
 * enrichment: none (typography only — restraint is the credibility signal)
 * studied: no · context: skipped, inferred (personal / portfolio domain) · v0.6.0
 */
```

## What changed vs v1

- **Macro:** Long Document → Index-First. v1 was a salutation-led essay with a tabular work-sheet at the bottom; v2 leads with a numbered TOC on the left and structures the page as 5 sections that match how a hiring manager actually reads. Longer-form information density without losing the editorial feel.
- **Theme:** Studio → Plain. Studio's italic Fraunces + cool grey paper + forest-green accent had warmth; Plain is pure-white #fff paper + Inter Tight display-heavy + deep ink-blue. The page reads more like a Klim Type Foundry "about" than a small studio's about.
- **Voice:** v1 opened with "Hello, I'm Anya." (with a green highlighter mark behind "Anya"); v2 opens with the index list and the first section header `01 · NOW`.
- **Section count:** v1 had ~3 narrative sections; v2 has 5 indexed sections, each tighter.

## What stayed the same

- Brand: Anya, software architect, Lisbon.
- Enrichment: none on both. Typography only.
- Slop test: 38 / 38 ✓.
- Tabular work history (years × companies). v1 had it as a table at the bottom; v2 has it as section 02.
