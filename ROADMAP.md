# Hallmark — Roadmap

A forward-looking plan for what to build next, drawn from the gaps the latest research surfaced and from where the field is heading. Ordered by impact-to-effort.

---

## Now — actively working on

### N.1  Better themes + more custom-designed themes

**Status now.** The 22 catalog themes work but a handful (Plain, Specimen, Salon, Linen) bleed into each other on first read — same paper-band, similar accent footprint, similar display roles. Real distinctiveness lives in only ~12 of them. Custom-theme construction (the `custom-theme.md` branch) exists but is rarely reached for; users mostly stay on catalog defaults.

**Build.**
1. **Tighten the existing 22** — audit each theme's three diversification axes (paper-band / display-style / accent-hue) and pull any pair that overlaps on 2+ axes back to distinct territory. The themes that ship today should each carry a stronger fingerprint.
2. **Add 4–6 new catalog themes** in underserved corners of the axis space — e.g. mid-band warm chromatic (something between Salon and Garden), dark-monochrome editorial (no current Midnight equivalent for serif-led editorial), high-contrast print-poster (a Brutal cousin that's quieter), warm dark with handwritten accent. Each new theme ships with its own tokens block in `site/css/tokens.css` and a stamp axis declaration.
3. **Surface the custom branch more often.** Right now custom requires 3+ vibe words. Lower the bar so a single distinctive brand colour or unusual font request routes to custom, not the closest catalog cousin.

**Why it matters.** Catalog rotation is the headline differentiator — if half the catalog is interchangeable, the rotation doesn't deliver. More distinct themes = more visible variety per session = users feel the discipline working without reading the rules.

### N.2  Nanobanana image generation inside Hallmark (image-led theme)

**Status now.** [`assets.md`](references/assets.md) lists Nanobanana as the canonical generated-still source (Tier C in the enrichment hierarchy) but the integration is *recommend-only* — Hallmark tells the user to go generate something and bring it back. No first-class image-led theme exists; image-heavy briefs route to a typography-only macrostructure and feel underserved.

**Build.**
1. **First-class Nanobanana hook.** When the brief signals "needs imagery" (e-commerce, travel, food, lookbook, gallery) and the user hasn't supplied real assets, Hallmark generates a brief for Nanobanana (style, subject, framing, palette tokens), invokes the API, ingests the returned image, and wires it into the build. Cache by prompt hash so re-runs are cheap.
2. **New image-led theme** (working title: **Plate**) — a theme tuned for image-heavy compositions. Generous photographic framing, neutral chrome around full-bleed imagery, hairline rules, restrained type so the picture leads. Pairs with the Photographic macrostructure and the H6 Photographic-Fold archetype. Distinct from existing themes because it assumes imagery exists and treats text as caption-grade.
3. **Token discipline for generated stills.** Nanobanana outputs need to thread back to the theme's accent / paper — extract dominant hue from the returned image, suggest as accent override, let the user confirm. Prevents the "generated image clashes with the theme palette" failure mode.

**Why it matters.** Today Hallmark is a typography-led tool. Half of real-world landing pages need imagery (consumer brands, hospitality, e-commerce). Adding first-class Nanobanana support + an image-led theme covers that gap without forcing the user to leave the skill, and it positions Hallmark as a complete builder rather than a type-only specialist.

---

## Tier 1 — Ship next (high impact, contained scope)

### 1.1  Theme-aware microinteraction tokens

**Status now.** [`microinteractions.md`](references/microinteractions.md) describes a duration multiplier per theme as a table — but the multipliers aren't actually expressed in CSS. Atelier and Salon should *feel* slower than Brutal and Sport, but right now they share the same `--dur-short` / `--dur-long`.

**Build.** Move `--dur-micro`, `--dur-short`, `--dur-long` into per-theme overrides in [`tokens.css`](site/css/tokens.css), scaled by the table in `microinteractions.md`. Newsprint and Terminal use `0ms` for spatial motion (they're print/terminal metaphors). One pass through the file; small diff.

**Why it matters.** Today a Salon page and a Brutal page animate at the same speed. They shouldn't. The principle of structural variety should extend to motion variety.

### 1.2  DESIGN.md output protocol

**Status now.** Hallmark produces code. It does not produce a portable design spec.

**Build.** When Hallmark generates new work, also emit a `DESIGN.md` in the project root containing: chosen tone, palette tokens (with OKLCH values), type stack, spacing scale, structural fingerprint, motion tokens, and the named anti-patterns the page must continue to avoid. Other AI tools (Cursor, v0, Bolt) can read this file directly to keep iterating on the same design language.

**Why it matters.** Closes the loop between Hallmark and the rest of the agent ecosystem. The skill stops being a one-shot generator and becomes a system that hands its decisions forward.

### 1.3  `hallmark variant` — three fingerprints, user picks one

**Status now.** Hallmark produces *one* designed output per brief.

**Build.** New verb: `hallmark variant <target>` produces three structurally distinct versions of the same brief — different fingerprints across the six axes — and presents them as a side-by-side comparison. The user picks the one that fits, or asks for a fourth. This is the workflow `taste-skill v3.0` parameterises with dials; Hallmark would expose it as a verb.

**Why it matters.** The biggest cause of "AI feel" isn't bad output — it's the user accepting the *first* output because they don't know it could be different. Showing three forces a judgement call and surfaces taste.

### 1.4  Theme switcher polish on the landing page

**Status now.** The 12-theme picker is good but a few rough edges remain.

**Build.**
- Trap the focus inside the popover when open (currently focus can escape).
- Make the swatch dots match each theme's *exact* paper/ink/accent (some currently approximate).
- On theme apply, briefly flash the orange accent rule under the trigger label to confirm — *silent success* via a 200ms colour pulse, not a toast.
- The kbd hint (`press T`) currently sits next to the trigger but only on hover — also reveal on `:focus-within` of the navbar, for keyboard users who haven't reached for the mouse.

**Why it matters.** The landing page itself is the strongest demo of Hallmark's microinteraction taste. It has to be exemplary.

---

## Tier 2 — Build after Tier 1 lands (still concrete, more scope)

### 2.1  `references/structural-cookbook.md` — concrete recipes

**Status now.** [`structure.md`](references/structure.md) catalogues the *axes* of structural variety. It doesn't show *what* a left-margin-headed, single-column, hairline-divided, unstyled-link, no-image, no-reveal page actually looks like assembled.

**Build.** A cookbook file with 12–20 *complete* structural fingerprints, each with a short HTML/CSS sketch, a paragraph explaining when to reach for it, and a real-world reference (NYT Mag, Stripe, Linear, Pentagram, etc.). The cookbook teaches the model patterns the same way recipe books teach cooking — through *worked examples*, not just *principles*.

**Why it matters.** Models are pattern-matchers. Catalogued patterns + named recipes are easier to reach for than principles + axes.

### 2.2  `references/tactile-rebellion.md` — controlled imperfection

**Status now.** Hallmark assumes pixel-precision is the goal. The 2026 cultural movement is the opposite: handmade textures, controlled imperfection, *wabi-sabi*. 73% of designers (per CreativeBloq's 2026 trends report) are deliberately adding imperfections to differentiate from AI.

**Build.** A new reference file covering: when to apply texture (sparingly; one element per page max); how to do it without falling into kitsch (real letterpress reference, not "letterpress filter"); free SVG noise/grain generators; hand-drawn SVG path techniques; controlled-jitter typography (a 0.5° rotation on a single mark is taste; on every word it's chaos).

**Why it matters.** This is where the field is going and the current canon (impeccable, kami) has nothing on it. First-mover advantage.

### 2.3  `references/data-viz.md` — Tufte-leaning anti-slop charts

**Status now.** Nothing about charts. Yet a dashboard or analytics page is half data viz, and AI-generated charts are *especially* bad — rainbow palettes, 3D pies, gridlines everywhere, sparkles instead of lines.

**Build.** A reference file covering: small multiples over single dense charts; tabular numbers; restraint in colour (one accent for the focal series, neutrals for context); axis design (minimum gridlines, no chartjunk); when to use bars vs lines vs sparklines; banned chart types (3D anything, donut charts where pie would do, dual-axis line charts).

**Why it matters.** Data-density is the next frontier of "looks AI-generated" — and Tufte is the canonical reference no current skill cites.

### 2.4  Multi-page coherence rules

**Status now.** Hallmark's structural-variety rule says "two consecutive pages in the same session should not share more than three of the six structural axes." That's correct for variety but wrong for *brand consistency* across a real product where every page should feel like the same site.

**Build.** A new reference: `references/coherence.md`. When working within a multi-page project, lock the first three axes (typography, colour, divider language — the *brand* axes) and vary the remaining three (heading placement, body composition, button voice — the *page-voice* axes). Different *pages* of the same site, not different *sites*. Add a test: "if I removed the navigation, would these two pages look like they're from the same product?" Yes. Continue. No. Re-anchor.

**Why it matters.** Right now the structural-variety rule is too strong. Real products need *coherent variety*, not chaotic variety.

### 2.5  `hallmark extract` — read existing code, output DESIGN.md

**Status now.** Hallmark generates from briefs. It can't ingest existing systems.

**Build.** New verb: `hallmark extract <directory>`. Reads the codebase. Identifies tokens (colour vars, type ramps, spacing scale, easings). Identifies the structural fingerprint actually in use. Writes a DESIGN.md the user can hand to other agents — or to Hallmark itself for `redesign` work. SkillUI does this for visual designs; Hallmark would do it taste-aware.

**Why it matters.** Most users come to Hallmark *with* an existing codebase, not a greenfield brief. The skill needs an entry point for the existing case.

---

## Tier 3 — Long horizon (research-grade, ambitious)

### 3.1  `hallmark explain` — pedagogy verb

A verb that explains the choices made, *axis by axis*, in plain language. "I picked left-margin headings because the brief was editorial and the audience is reading-led; I picked hairline dividers because the tone was austere and ornament would have warmed the page; I picked silent success on the form because the user can see the row was saved." Teaches users to make the same choices themselves over time. The skill becomes a *teacher*, not just a generator.

### 3.2  Negative-capability rules

[PencilPlaybook](https://github.com/stevembarclay/pencilplaybook) embeds *perceptual psychology* in its anti-patterns — not just "don't use side-stripe cards" but "side-stripe cards trigger a horizontal cognitive scan that splits the user's attention from the content; the brain has to process two reading axes at once, which costs ~120ms per card." That's a different kind of teaching.

Build a `references/why.md` that, for each major anti-pattern, includes the perceptual or cognitive reason it fails. Models that *understand* an anti-pattern reach for the alternative more reliably than models that just *know* the anti-pattern.

### 3.3  Emotion-first prompting

Today: tone words (editorial, brutalist, austere). Tomorrow: emotion words (anxious, optimistic, nostalgic, sceptical). The brief "build me a page that feels nostalgic but also forward-looking" should produce different work than "build me a page that feels confident and warm" — even if the audience and use case are the same.

This requires a new mapping: emotion → tone → fingerprint. Worth building once the field has converged on what these mappings are. (Currently nobody has mapped them.)

### 3.4  Sound and haptic policy

Currently [`microinteractions.md`](references/microinteractions.md) says "no sound on web" — correct default. But Hallmark could ship a tiny module covering: when sound is appropriate (gaming, AAA brands, accessibility-augmenting); haptic feedback (Vibration API on mobile); and how to do them without crossing into kitsch. Small file; long horizon.

### 3.5  Live preview as a Claude Code MCP server

The most ambitious direction. Today Hallmark writes code into files; the user runs a static server to preview. A Claude Code MCP server could:
- Watch the file
- Render it in a sandbox
- Take a screenshot
- Feed the screenshot back to the model for self-critique against the slop test
- Iterate

This closes the loop between *generation* and *audit*, automatically. The skill audits itself before handing back. Anthropic's [canvas-design](https://github.com/anthropics/skills) skill is a step toward this for static art; Hallmark could be the interactive equivalent.

---

## Things to *not* do

A list of tempting directions that would make Hallmark worse, not better. Forcing the discipline.

- **Don't add a fifth verb** before the existing four are battle-tested. `default / audit / refine / redesign` is enough surface area for the next six months. Adding `polish / typeset / colorize / animate / ...` (impeccable's path) trades comprehensibility for surface area. Resist.
- **Don't add more than 12 themes.** The cognitive cost of 16 themes is higher than the value of 16 themes. If anything, *cut* underperforming ones.
- **Don't ship a UI library.** Hallmark is a *taste* skill, not a component kit. shadcn/ui and Geist exist; refer users to them. Building components inside Hallmark dilutes the focus.
- **Don't add A/B testing or analytics** to the skill. It's not a SaaS product.
- **Don't build a Figma plugin.** The skill works in code; that's a feature, not a limit. Designers who want Figma have other tools.
- **Don't add prompts to "match a brand"** by URL scraping on the *default* verb. That's SkillUI's job — point users there. **Exception:** `hallmark study` accepts URLs as a source for DNA extraction (read-only; never to clone the surface). The same refusal heuristics that govern image-mode `study` apply — marketplaces, template demos, and disclosed competitors are auto-refused before WebFetch fires.
- **Don't add image generation.** Out of scope; AI imagery is its own problem space, and the right answer is usually "use real photos" or "no image."

---

## Measurement

How we know Hallmark is getting better, not just bigger:

1. **Slop test pass rate.** Every output should pass all 20 questions. Track failures and categorise.
2. **Structural-fingerprint diversity.** Across the last 10 outputs of the skill, how many *unique* fingerprints? Target ≥ 8/10.
3. **Microinteraction tells per output.** Target 0. (`transition-all`, `hover:scale-105`, bouncy easing on UI, etc. are flagged.)
4. **User picks the first output without revision.** A high "first try" rate is the single best taste indicator. Track it.
5. **DESIGN.md re-import round-trip.** A user runs `hallmark extract` then `hallmark` with the extracted DESIGN.md in scope. The result should match the original within token boundaries. If it drifts, the extraction or the application is wrong.

---

## What's already shipped

For reference. Everything below is in current `0.4.0`.

- ✓ Skill: 5 verbs (default, audit, refine, redesign, study)
- ✓ References: typography, color, layout-and-space, motion, microinteractions, structure, interaction-and-states, responsive, copy, anti-patterns, macrostructures, component-cookbook, study, hero-enrichment, custom-craft, assets
- ✓ 16 themes with structural fingerprints (including Studio, Pastel, Riso, Quiet)
- ✓ 21 named macrostructures + 36 component archetypes with within-archetype variation knobs
- ✓ Sticky-top banner theme picker with random + ?theme= URL parameter
- ✓ Per-theme component archetype swap (hero + footer rebuild on theme change)
- ✓ Hero enrichment: demo video / mockup / illustration / abstract background, with Lottie demoted to last resort
- ✓ Custom-craft canon: pure CSS art, hand-built SVG, declarative animation, View Transitions, Three.js when justified
- ✓ Asset-source catalogue: Lucide / Phosphor / Heroicons (icons), Simple Icons / SVGL (logos), Nanobanana 2 / Recraft V4 (generated illustration), Storyset / Humaaans (library), Mixkit / Coverr (video), Unsplash / Nappy (photography)
- ✓ Working install path: `cp skill/* ~/.claude/skills/hallmark/`
- ✓ Slop test 33 questions: visual (8), structural (2), microinteractions (10), variety (3), implementation (6), hero enrichment (4)
- ✓ View Transitions on theme switch, with reduced-motion fallback
- ✓ Copy-to-clipboard with silent success on install code blocks
- ✓ Keyboard shortcut (`T` cycle, `Shift+T` reverse, `R` random)

---

## Deferred

- **Tier 2.3 — Data-viz / chart canon.** Small multiples, axis restraint, banned types (3D donut, dual-axis), Tufte principles. Mentioned in hero-enrichment.md but full reference not yet written.
