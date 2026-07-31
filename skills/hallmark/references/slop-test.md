# Slop test — 58 gates + pre-emit self-critique

Run this list before handing back any output. Every answer must be **no**. Update the Step 5 preview block's `Slop test` row to reflect the actual outcome of this run.

Some gates are **universal** (apply to every genre); some are **genre-scoped** (apply only when the active genre is editorial, atmospheric, modern-minimal, or playful). Genre overrides are noted inline. Where a gate has *no* genre note, treat it as universal.

---

## Core-15 sweep (component scope)

When the artifact is a single component (one nav, one footer, one card, one section), sweep this universal subset:

**Gates 1, 2, 7, 10, 14, 15, 22, 26, 27, 30, 38a, 39, 40, 41, 48.** (`sloplint.mjs --scope component` additionally enforces gates 24 and 37, both mechanical; fix those FAILs too.)

That covers banned fonts, gradients, pure black/white, transition hygiene, box-model animation, focus rings, neutral chroma, interaction states, reduced motion, icon tells, italic headers, input states, both contrast gates, and token discipline. Every answer must still be **no**.

Any artifact that is a page, including fast-mode pages, runs all 58. The tier cuts narration and check time for single components, never page guarantees. One exception: unpicked `variants` drafts run only this sweep plus sloplint; the promoted winner runs all 58 (see [`verbs/variants.md`](verbs/variants.md)).

---

## Gate classes

Every gate below carries a class tag:

- **[M]** Mechanical: checked by `scripts/sloplint.mjs`. Fix FAILs before judging; WARNs need a human or model to confirm.
- **[M/R]** Static partial: sloplint covers the code-level half; the optional `--render` tier completes it.
- **[R/J]** Render-verifiable: confirm on the rendered page when rendering is available, else judge.
- **[J]** Judged: the model verifies these at Step 7; no script can.

When sloplint has run, walk the J and R/J gates, plus the judged halves of M/R gates when --render did not run, and confirm or dismiss every WARN; re-litigating M gates the script already passed is wasted judgment. Verification is budgeted: one batched inspection round, one fix batch, at most one confirm round, then stop.

---

## Pre-emit self-critique (six axes)

Run this **before** the gate list, not after. Score the planned output 1–5 on each axis. Anything **< 3 on any axis triggers a revision pass** before the gate sweep — don't bring known weakness into a fifty-eight-gate review.

Two passes is normal. Three is a sign the brief is wrong, not the design — re-read the brief.

| # | Axis | What you're scoring (what a 3 looks like vs a 5) |
|---|---|---|
| **P** | **Philosophy** | Is there a clear *why* — a position the page is taking? A 3 has a tone; a 5 has an argument a reader could disagree with. |
| **H** | **Hierarchy** | Can a reader tell, in 2 seconds, what's primary, secondary, tertiary? A 3 needs a second look; a 5 survives the squint test. |
| **E** | **Execution** | Are the details (rule weight, accent footprint, text-wrap, focus rings, contrast) in spec? A 3 has two or three loose details; a 5 would pass the gates on the first sweep. |
| **S** | **Specificity** | Does this look like *this brief*? A 3 fits the category; a 5 could belong to no other product. |
| **R** | **Restraint** | Is everything earning its place? A 3 keeps one decoration too many; a 5 lost something you liked. |
| **V** | **Variety** | Structural distance from the log's `fingerprint` entries, never visual distance — colour-swaps don't count. A 3 differs on three of the six axes; a 5 shares almost nothing with the last three runs. |

Record the six scores in a one-line stamp comment directly below the macrostructure stamp (which stays line 1, per gate 20), with the weakest axis named and answered: `/* Hallmark · pre-emit critique: P5 H4 E5 S3 R5 V4 · weakest: S - hero could be any dev tool; added the ledger-rule motif */`. **At least one axis scores <= 4, with its reason and the fix taken in the `weakest:` clause. A straight-5s stamp is unexamined, not excellent; rewrite until one real weakness is found and addressed.** Future runs should be able to find this and avoid repeating the same weakness.

---

## Visual

1. **[M]** Is the display font Inter, Roboto, Open Sans, Poppins, Lato, or a system default?
2. **[M]** Is there a purple-to-blue (or cyan-to-magenta) gradient anywhere — **including a `background-clip: text` gradient headline**? *Genre note: atmospheric allows radial gradients on background only — never on text or pill buttons. No genre allows gradient text.*
3. **[M]** Is there a 3-equal-column card grid with icon-above-heading tiles?
4. **[M]** Is any card nested inside another card?
5. **[M]** Is any card using a thick coloured left/right side-stripe border?
6. **[J]** **Hero shape — centred-everything.** Is the hero `min-height: 100vh`/`100dvh` outside a stamped **Poster** posture, OR are the eyebrow, title, lede, AND CTA all stacked on the same centred vertical axis? Auto-fail. Pick at most two centred elements and break alignment for the rest; the eyebrow or CTA should sit off-axis (margin-aligned, right-flush, numeral-anchored). *Genre note: atmospheric and playful allow a centred hero when the canvas itself is the design (Suno-style); editorial / atelier allow a centred-narrow hero, but even then the eyebrow or CTA sits off-axis.* *Posture note: a stamped Poster hero may run 92-100dvh (hero-discipline.md § Hero postures); the centred-element ceiling still binds per the genre carve-outs.*
7. **[M]** Is pure `#000` or pure `#fff` used as a base colour anywhere? *Genre note: modern-minimal allows pure `#fff` paper (the Stripe / ElevenLabs school).*

## Structural

8. **[J]** Does the page reuse a structure it shouldn't — either the generic AI template (Hero → 3 features → CTA → footer), **or** the *same* structural fingerprint / macrostructure as a previous Hallmark output in this project? Read the file system: if `.hallmark/log.json` entries or a CSS macrostructure stamp exist, this build's macrostructure must differ from the last three (SKILL.md § Rotation).
9. **[J]** Are sections separated only by equal whitespace, with no rule, no ornament, no colour shift — every section identical in rhythm? The fix vocabulary is the escalation ladder in layout-and-space.md § Surfaces: different regions climb different rungs (whitespace, hairline, tinted well, card).

## Microinteractions

10. **[M]** Is `transition-all` (or `transition: all`) used anywhere? (Specify the properties.)
11. **[M]** Is `hover:scale-105` (or any uniform hover-scale) applied across multiple unrelated elements?
12. **[M]** Are bouncy / overshoot easings (`cubic-bezier(0.34, 1.56, ...)`, etc.) used on UI state changes — buttons, modals, tooltips? (Reserve overshoots for physical interactions only.)
13. **[J]** Does any element have *more than one* hover effect at the same time (translate + scale + shadow + colour + rotate)?
14. **[M]** Are you animating `width`, `height`, `top`, `left`, `margin`, or `padding` anywhere?
15. **[M]** Does the focus ring transition into existence (fade in)? (Focus rings must appear instantly — keyboard users need an immediate indicator.)
16. **[J]** Is there a celebratory success toast for an action whose effect the user can already see? (Silent success is taste; toasts are for failures and invisible effects.)
17. **[M]** Are tooltip hover-delay and focus-delay equal? (Hover should delay 800–1000 ms; focus should be 0 ms.)
18. **[M]** Is auto-rotating content (carousel, banner, stats) lacking pause-on-hover-and-focus? (WCAG 2.2.2.)
19. **[M]** Is there a placeholder name "Jane Doe / John Smith" or a startup cliché (Acme, Nexus, Seamless, Unleash)?

## Variety

20. **[M]** Is the `/* Hallmark · macrostructure: <name> · ... */` stamp missing from the top of the CSS? (It must be present.)
21. **[J]** Did I default to the **Specimen** macrostructure (numbered left-margin labels + huge serif + asymmetric spans + typographic-only CTA) when the brief did not explicitly call for editorial / foundry / specimen energy? (Specimen fall-through is banned.) *Genre note: atmospheric, modern-minimal, and playful never default to Specimen — only editorial does, and only when the brief signals it.*

## Implementation gates

22. **[M]** Does any neutral / surface colour have `oklch(... 0 ...)` (zero chroma)? Pure greys read as flat. Tint every neutral toward the anchor hue — minimum 0.005 chroma. *Genre note: modern-minimal allows zero-chroma neutrals (the monochrome Stripe / ElevenLabs school).*
23. **[M/R]** Does the accent colour cover more than ~5 % of any single viewport (count by area: solid fills, large headings in accent, full-bleed accent backgrounds)? If yes, retreat — accent is for emphasis, not for filling. *Genre note: atmospheric allows accent-tinted radial blooms covering up to ~20 % of the canvas, since the bloom is the design.* *Posture note: a colour serving as a declared surface under a stated colour posture (`--color-paper*`, `--color-field` on Committed / Drenched custom runs, and every dark theme already) is not accent footprint; the accent token proper stays <= 5%, contrast gates 40-41 bind unchanged on the coloured surface, and undeclared accent sprawl still fails. See [`color.md`](color.md) § Colour postures.* *Mechanics: sloplint's static half WARNs on accent tokens painting viewport-scale rules or display-size text (posture-aware via the stamp); `--render` measures the painted area on the 1280x800 fold and FAILs past 8% (atmospheric: 30%).*
24. **[M]** Is any padding / gap / margin a value that isn't on the named spacing scale (`--space-3xs` … `--space-5xl`, multiples of 4 px)? Arbitrary `padding: 17px` is a tell.
25. **[M]** Is any prose container's `max-width` outside the 45–75 ch range? Measure must read; under 45 ch is choppy, over 75 ch loses the eye.
26. **[M]** Does any interactive element lack `:focus-visible`, `:active`, OR `:disabled` styling? (Eight states is the rule. Default + hover is two; you need at least default + hover + focus-visible + active + disabled present in code.)
27. **[M]** Is there any `transform` / `animation` keyframe that is NOT covered by a `@media (prefers-reduced-motion: reduce)` fallback? Every motion gets a reduced-motion alternative.

## Hero enrichment gates

(When the page carries enrichment — see [`hero-enrichment.md`](hero-enrichment.md). Exception: gate 30 is about icon libraries and emoji, not enrichment; it applies to every page and component regardless.)

28. **[M]** If the page has a demo video, does it autoplay with sound, lack a `poster`, lack `fetchpriority="high"`, or use `loading="lazy"` on the LCP element? (LCP-killers fail this gate.)
29. **[J]** If the page has an abstract background, is it more than one accent colour, more than ~5 % footprint, or animating mesh-gradient on the whole page? (Aurora blobs and mesh-on-everything fail this gate.) *Genre note: atmospheric allows up to two warm-toned radial blooms covering ~20–30 % of the canvas, fixed-attached, no animation.*
30. **[M]** **Icon tells.** Does the page (a) mix two or more icon libraries (Material + Heroicons + Lucide on the same page), OR (b) use an emoji glyph (✨ 🚀 ⚡ 🔥 🎯 ✅) as a feature-card / value-prop / step / pricing-tier icon? Either is an AI-default tell. Pick one icon library (Lucide / Phosphor / Heroicons — see [assets.md](assets.md)), build a custom SVG, or drop the icon and lead with typography.
31. **[J]** If the page has illustration, did I default to a Lottie library when a hand-built SVG or pure-CSS shape would have worked? (Lottie is last resort, not the default.)

## Diversification gates

(Cross-reference `.hallmark/log.json` when present.)

32. **[J]** If I used the same archetype as a previous Hallmark output (per `.hallmark/log.json` or the latest macrostructure stamp), did I pick at least one different *variation knob*? Two Bento Grids with `tiles=6, spans=irregular, accent=corner-only` are the same Bento — the within-archetype knobs in [`component-cookbook.md`](component-cookbook.md) exist precisely to prevent that. State the knob deltas in the stamp, and check the log's `fingerprint` field: sharing more than three of the six structural axes with a logged entry is the same failure at page scale.
33. **[M]** Does any visual-only `<svg>`, custom-art `<div>`, `<canvas>`, or decorative figure lack `aria-label` or `aria-hidden="true"`? Hand-built CSS art and SVG illustrations need an accessible name *or* an explicit hide. Skipping this is the new accessibility tell.

## Layout-safety gates

(The page must survive every viewport.)

34. **[M/R]** Does the page horizontally scroll on any viewport between 320 px and 1920 px? Open the rendered page; drag the dev-tools width slider across that range. If a horizontal scrollbar appears at any width, fail. The required fix is `overflow-x: clip` on **both** `html` and `body` — use `clip`, not `hidden` (`clip` preserves `position: sticky` and `position: fixed` on descendants). This is a hard requirement on every emitted page, not only when scroll is observed. (Cross-reference: [`layout-and-space.md` § Page-edge clipping](layout-and-space.md).)
35. **[J]** For every decorative effect on text — highlighter `<mark>` / `<em>` band / accent stroke / underline — did I visually confirm the position and size? A highlighter band must sit behind the x-height (`linear-gradient(180deg, transparent ~38%, accent ~38%, accent ~92%, transparent ~92%)`), **not** at the baseline (which reads as a fat underline). Underlines must be 1–2 px and offset 1–2 px from the baseline, never 5+ px. Decorative strokes must not exceed 5 % of the viewport (gate 23). The check is *visual*: imagine the rendered output and confirm the band lands in the right vertical zone. No render available: verify the numbers from code instead; the highlighter band's gradient stops sit at ~38% and ~92% of the line box (the x-height zone, never the baseline), underlines are `text-decoration-thickness: 1-2px` with `text-underline-offset: 1-2px`, and decorative strokes stay under 5% of viewport area.
36. **[J]** Are interactive bars (nav, toolbar, command bar, hero CTA row, footer link strip) explicitly vertically centered? Default flex layouts inherit `align-items: stretch`, which makes a button taller than its sibling text and breaks the visual baseline. Every flex row mixing height-different elements (button + text, icon + text, mark + body) must declare `align-items: center` and `line-height: 1` on the items with intrinsic height. Inheriting `line-height: 1.55` from `html` fights the row's vertical rhythm.

## Typography discipline gates

(Three faces is the ceiling. See [`typography.md` § The 2+1 rule](typography.md).)

37. **[M]** Does the page use **more than three** distinct `font-family` families? Count: `--font-display`, `--font-body`, and at most one outlier (`--font-outlier` for wordmark / hero stat / pull quote). A fourth family on the page — e.g. body + display + mono in code blocks + a separate display for the hero — is slop. Same family at different weights counts as one family. Mono counts as a family if used in any non-code context (captions, labels, numerals). If you find four, drop one back to the body or display face.
38. **[J]** Is the **outlier face used in more than two slots** on the page? The outlier is a register, not a third surface — wordmark + hero stat is the canonical pair, or wordmark + masthead, or hero stat + pull quote. Three slots = the outlier is now a third body font; collapse it back to the body face.
38a. **[M]** Is any **heading or display type italic** (`font-style: italic` on `h1`–`h6`, a `.*__title`, `.hero__title`, a wordmark, a stat figure, a footer statement, or an `<em>`/`<i>` inside a heading)? If yes, fail. Italic headers — above all the single italicised emphasis-word inside an upright headline — are a top AI tell. Headers are roman; emphasis comes from weight, accent colour, or a drawn underline. Italic is allowed *only* as body-copy emphasis inside running paragraphs. (Applies to every theme; Studio / Garden / Sport — historically italic-display — are reworked to roman.)

## Input-state gate

(Inputs are where almost-right UIs lose. See [`interaction-and-states.md` § Input field states](interaction-and-states.md).)

39. **[M]** Do input / textarea / select fields handle every state correctly? Fail on **any** of these five:
    - **Border-width shifts between states** — default / hover / focus / error must all keep `border-width: 1px`. State changes go to `background-color`, `outline`, `box-shadow`, or `border-color` — never `border-width` (it shifts layout).
    - **Focus ring built from `border` instead of `outline`** — must be `outline: 2px solid var(--color-focus)` with `outline-offset: 1px`; reserve `outline: 2px solid transparent` at rest to prevent geometry shift on activate.
    - **Input height ≠ adjacent button height** on the same form — share one base height (44 px floor); 38 px input + 44 px button is the most common form-tuning slop.
    - **Helper-text slot collapses when empty** — reserve `min-height: 1lh` even with no helper / error, so an appearing error doesn't push the page down.
    - **Disabled signalled by `opacity` alone** — disabled needs three channels: `opacity: 0.55` AND `cursor: not-allowed` AND the native `disabled` attribute (or `aria-disabled="true"`).

## Contrast & readability

Universal — apply to every genre. These gates catch the real-world failures the user flagged: black-text-on-black-button, dark sections with unreadable text, ink-on-ink slop where the LLM forgot to flip the text colour after flipping the surface.

Contrast computation: for every `(color, background-color)` pair on the page, run **APCA Lc** OR **WCAG 2.1 ratio**. OKLCH lightness is a fast pre-check — if `|L_text − L_bg| < 50 %`, the pair likely fails 4.5:1 — confirm with a full calculation.

40. **[M/R]** **Contrast thresholds.** Does any text, icon, or `:focus-visible` ring fail its threshold against its *computed* background? Pair every `color` declaration with its effective `background-color` and verify. Thresholds: **body text** (under 24 px regular OR under 18 px bold) needs **WCAG 4.5:1 / APCA Lc ≥ 60**; **large text** (≥ 24 px regular / ≥ 18 px bold), **icons**, and **focus rings** need **WCAG 3:1 / APCA Lc ≥ 45**. The most-missed cases: text inside a card that inherits `color` but the card switched to `background: var(--color-paper-2)`; muted text (`var(--color-muted)`) on `var(--color-paper-3)`; a focus ring whose `--color-focus` clears 3:1 against the element but not the page surface.

41. **[M/R]** **The contrast failures that ship most often.** Fail on **any**:
    - **Button text ≈ button fill** — if the computed text colour and fill are within **5 % lightness AND 0.05 chroma** in OKLCH, fail. This catches the black-on-black bug (`color: var(--color-ink)` on `background: var(--color-ink)` — the model forgot `--color-accent-ink` / `--color-paper`).
    - **`--color-accent-ink` missing or unused** — whenever `--color-accent` fills a surface that carries text, `--color-accent-ink` must be defined, verify ≥ APCA Lc 60 / WCAG 4.5:1 against `--color-accent`, and be applied as the `color` on that fill.
    - **Dark-section ink-on-ink** — any section / panel whose `background-color` is OKLCH lightness < 50 % must also swap its text colour (typically to `--color-paper`) and ensure nested children inherit. A class that sets `background: <dark>` must set `color: <light>` in the same rule (or be wrapped in a parent that does). Common failure: a `.vs__col:first-child` painted with accent / ink but the inner panels still using default ink-coloured text.

The CSS stamp at Step 6 should record the result: `· contrast: pass (40–41)` if both gates pass, or `· contrast: FAIL gates <list>` if any are open. Fix before shipping.

## Nav · footer · hero structural slop

Universal — apply to every genre. These gates catch the most-recognised AI fingerprints in nav, footer, and hero shape. They sit alongside the structural-fingerprint gate (gate 8): gate 8 catches the *page* fingerprint; 42–45 catch the *chrome* fingerprints that sit on top of it.

42. **[M]** **Nav fingerprint.** Is the page's `<nav>` (or top-of-page `<header>` with role="banner") the AI default — wordmark-left + 4–5 inline text links centred-or-right + button-right at full viewport width + 1 px hairline border-bottom + white background? If yes, fail unless the brief explicitly justifies N1a (the page has only 2 destinations *and* the routing table for the genre allows N1a). Hallmark output should rotate among N1b, N2, N3, N4, N5, N6, N7, N8, N9, N10, N11, N12, N13 from [`component-cookbook.md`](component-cookbook.md) § Navigation.

43. **[M]** **Footer fingerprint.** Is the `<footer>` the AI default — 4 columns of links (Product / Company / Resources / Legal) + social-icon row + tiny copyright at the very bottom + 1 px hairline top-border + neutral grey background? If yes, fail unless the page is a genuine docs root or hub. Default to Ft1, Ft2, Ft4, Ft5, Ft6, Ft7, or Ft8 from [`component-cookbook.md`](component-cookbook.md) § Footers.

44. **[R/J]** **Hero fit — posture envelope + fits the fold.** Two checks, both on the rendered hero: (a) Does the hero obey its declared posture's envelope ([`hero-discipline.md`](enrichment/hero-discipline.md) § Hero postures; the stamp's `hero:` field, Settled when absent)? Settled / Banner / Corridor / Stage: `padding-block-end` ≥ 1.3× `padding-block-start` inside the posture's min-height range. Ledge inverts it (block-start ≥ 2× block-end, content anchored to the base). Poster waives the ratio only when content is edge- or corner-anchored. A hero matching no envelope, or claiming one and breaking it, fails. (b) On a standard laptop viewport — test at **1280×800** (13″), not just 1440×900 — can the hero's essential content (eyebrow, headline, lede, **and the primary CTA**, plus any hero visual's focal point) all be seen **without scrolling**? This is the other half of gate 6 (which caps the hero's *shape*): this caps its *content*. A hero can satisfy `min-height` and still overflow because the content is intrinsically too tall — usual culprits are an **oversized display clamp**, **loose line-height** (display at ~1.2 instead of 1.0–1.1), a **lede that runs 3+ lines**, or **bloated `padding-block`**. Right-size to the fold: pull the display `clamp()` max down until the headline fits 2–3 lines, set display line-height 1.0–1.1, hold the lede to ~2 lines (≤ ~60 ch), trim hero padding. **Don't overcorrect:** a hero that already fits passes untouched — this never means tiny type or stripped whitespace. Long-form / art-directed statements (a poem broadside, a scroll-poster) may legitimately run taller, but even then the **first screen must read as a complete, deliberate composition** — never a headline sliced in half by the fold. For models that cannot render or see, the numeric heuristics above are the text-only verification path: display `clamp()` max sized so the headline lands in 2-3 lines, display line-height 1.0-1.1, lede at most ~2 lines and at most ~60 ch, and `padding-block` within budget.

45. **[J]** **Decorative-without-purpose.** Does the hero contain a decorative element (cursor, scanline, gradient blob, abstract shape, ornament, badge, sticker) that has no semantic anchor in the content? Fail. Decoration must be motivated: a cursor inside a typed command (signals "you'd type next"), a numeral that names an issue / year / version / chapter, a gradient that responds to interaction (HP3 cursor-spotlight), a stamp that names an authorship or date. Random ornaments — a "42" in the corner with no edition meaning, a cursor floating beside a hero, a Pantone chip with no colour rationale — are slop.

The CSS stamp at Step 6 should record the result alongside contrast: `· nav: N# · footer: Ft# · slop: pass (42–45)`. If any of 42–45 fail, fix before shipping.

## Honest copy · no fabricated content

Universal — apply to every genre. The page must not invent facts about the user's product, team, or market.

46. **[M]** **Invented metric.** Does the page contain any quantitative claim — "10× faster", "saves 5 hours per week", "trusted by 50,000+ teams", "99.9 % uptime", "+47 % conversion" — that the user did not supply, that has no source, and that the model fabricated to fill a stat-led layout, comparison row, or proof bar? If yes, fail. The fix is one of: replace the number with `—` and a labelled grey block, replace it with a question to the user ("metric to confirm"), or rebuild the section without the proof slot. Stat-led macrostructures are slop the moment their stats become decorative. **A stat is also never the hero's *sole* headline** — a lead figure carries the hero only alongside a worded headline; a giant number with no words as the dominant hero text is a bare-number tell, so pair it with a line that says what it means. *(See [anti-patterns.md § Invented metrics](anti-patterns.md).)*

## Re-drawn UI chrome

Universal. Hallmark must reuse the user's existing chrome (browser, OS, IDE) instead of redrawing it.

47. **[M]** **Re-drawn chrome.** Did Hallmark hand-build a fake browser bar (URL pill + traffic-light dots), a fake phone frame (rounded rectangle + notch + speaker slit), a fake code-block frame (mock window-chrome around a `<pre>`), a fake terminal frame, or a fake IDE chrome (file tabs + activity bar + sidebar) using HTML/CSS or SVG? If yes, fail. Re-drawn chrome is one of the strongest "looks AI-generated" tells — the model invented a UI that already exists in the user's environment. The fix: use a `<picture>` or `<figure>` containing a real screenshot, or omit the chrome and let the content stand on its own. *(See [anti-patterns.md § Re-drawn UI chrome](anti-patterns.md).)* *Arcade carve-out: the Arcade theme's retro-system aesthetic (pixel type, scanline overlay, starfield, magenta/cyan on violet-black, a blinking cursor anchored to typed text) is allowed as an atmospheric treatment, since it re-draws no specific UI. What stays banned even on Arcade: a fake OS window (title bar + traffic-light dots), a fake browser/phone/IDE frame, or a fake terminal-app chrome around content. The retro signal comes from type and light, never from a re-drawn interface.*

## Token discipline

Universal. The theme picks the palette and font stack at the top of the run; the rest of the run consumes tokens, never invents them.

48. **[M]** **Mid-render token improvisation.** Did Hallmark introduce any colour value (`#hex`, `oklch(...)`, `rgb(...)`, `hsl(...)`) or `font-family` declaration *outside* the design tokens defined in `:root` / `[data-theme="..."]` / a variants route-wrapper token block (verbs/variants.md § 4)? If yes, fail. Every colour and every font in the artifact must reference a named token (`var(--color-accent)`, `font-family: var(--font-display)`). Inline OKLCH or one-off hexes are mid-render improvisation — the model picked the theme, then forgot it and freestyled. The fix: lift the value into the token block as a new named variable, or replace it with an existing token. *(See [SKILL.md § Locked tokens](../SKILL.md) and [anti-patterns.md § Mid-render token improvisation](anti-patterns.md).)*

## Responsive — clickable affordances

Universal. Buttons, links, and nav items must remain readable as single-line affordances when the viewport shrinks.

49. **[M/R]** **Two-line clickable text.** Does any button label, primary nav link, footer link, tab label, breadcrumb, or CTA text wrap to two or more lines at any viewport between 320 px and 1920 px? If yes, fail. Clickable text reading on two lines looks broken — visitors read it as a styling error, not as intentional. The fix is one of: shorten the label (the best fix; "Get started free" → "Start free"), set `white-space: nowrap` on the affordance and let the parent reflow, drop a non-essential nav item at narrow widths via `hidden=until-found`, or collapse the nav into a sheet/menu. Never let a CTA or nav link wrap. *(See [responsive.md § Clickable text — never wraps](responsive.md).)*

The CSS stamp at Step 6 should record results: `· honest: pass (46) · chrome: pass (47) · tokens: pass (48) · responsive: pass (49) · icons: pass (30)`. Any failure must be fixed before shipping.

## Mobile-responsiveness — the non-negotiables

Universal. Every emitted page must render flawlessly at 320 px, 375 px, 414 px, and 768 px CSS-pixel widths. Gates 34 (no horizontal scroll) and 49 (no two-line clickable text) already cover the headline cases; 50–57 below codify the patterns the marketing-site responsiveness pass uncovered. Eyeball each viewport before marking the output complete.

50. **[M]** **Image-bearing grid track without `minmax(0, 1fr)`.** Does any `grid-template-columns` (or `grid-template-rows`) containing a `1fr` track render an `<img>` / `<picture>` / image-bearing element inside one of those tracks? If yes, the track must be `minmax(0, 1fr)` instead. Plain `1fr` resolves to `minmax(auto, 1fr)`, where `auto` minimum is the largest content's intrinsic width — for a 1024 + px native image, that's 1024 + px minimum, which pushes the layout past viewport on phones. The fix is one character per track: `1fr` → `minmax(0, 1fr)`.

51. **[M]** **Display headers without long-word wrap.** Does any element rendering display-size text (`h1`, `.hero__display`, `.section__title`, `.skill-row__title`, hero-equivalent classes) lack `overflow-wrap: anywhere; min-width: 0`? If yes, fail. Long hyphenated words ("AI-generated", uppercase compound brand names) overflow viewport because the only break opportunity is at the hyphen — `overflow-wrap: anywhere` lets the engine break inside the word as a last resort.

52. **[M]** **Per-theme section-head override without mobile collapse.** When a theme or variant overrides `.section__head { grid-template-columns: ... }` to anything other than `1fr`, does it also include the mobile-collapse rule, OR does a global `[data-theme] .section__head { grid-template-columns: 1fr }` exist at `@media (max-width: 48rem)` with matching specificity? If neither, fail. Theme-specific 2-column heads keep their template on mobile, the title wraps onto the section label, and the page reads broken (most visible on Sport: italic Anton title overlapping "02 / EXAMPLES").

53. **[M]** **CSS-only radio tab pattern that scroll-jumps.** When implementing tab toggles via `<input type="radio">` siblings + `:checked` selectors, does the artifact either (a) keep the radios in normal document flow with zero size + opacity 0 (no `position: absolute; top: 0`), OR (b) ship a JS handler that intercepts label clicks, calls `e.preventDefault()`, manually sets `radio.checked = true`, dispatches `change`, and focuses with `{ preventScroll: true }`? If the radios are at `position: absolute; top: 0` with no JS guard, fail. Default-position radios cause the page to jump to the section's top on every tab click — visible on every viewport but most disruptive on mobile.

54. **[M]** **Section eyebrow / tag beside the heading (tag-left, header-right).** Does any section render an eyebrow / number / mono-cap label (`01 · THE TOUR`, `02 / FEATURES`, `Chapter Three`) in a column to the left of, or to the right of, the section heading on the same horizontal row? Auto-fail. The pattern reads as a templated editorial-SaaS tell within seconds. When an eyebrow is used at all (see [`anti-patterns.md § Eyebrow on every section`](anti-patterns.md) — default OFF), the heading goes **directly underneath it in the same column**, vertical stack only. Concretely: **any `<header>`, `<div>`, or `<section>` wrapper — regardless of class name (`.section__head`, `.workbench__head`, `.pricing__head`, `.catches__head`, `.foo__intro`, anything macrostructure- or section-specific)** — that contains both an eyebrow / label / number / kicker element AND a heading element MUST resolve to single-column layout: `display: block`, `display: flex; flex-direction: column`, or `display: grid; grid-template-columns: 1fr` (or `minmax(0, 1fr)`). Any multi-column grid on such a wrapper (`grid-template-columns: 1fr 2fr`, `minmax(0, 0.4fr) minmax(0, 1fr)`, `auto 1fr`, etc.) is banned. **The rule binds on the *content shape* — eyebrow + heading in the same wrapper — not on a specific class-name allowlist.** It supersedes the "Left-margin" axis in [`structure.md`](structure.md) and the "Hanging headers" pattern in [`layout-and-space.md`](layout-and-space.md) for any head that carries an eyebrow. **NOT bypassable by "preserve structural parity" / "mirror this reference" / "match the prior build" instructions** — if a reference build ships the banned pattern (most pre-rule builds do), silently flatten it in the new build. The rules win over parity. Reference builds may pre-date this gate; the gate is authoritative.

55. **[M]** **All-caps display heads with line-height < 1.0 → cap-collision on wrap.** Does any display-size element (`.hero__display`, `.section__title`, `h1`, `h2`, or anything `≥ --text-2xl`) declare both `text-transform: uppercase` AND a `line-height` (or `--lh-tight`) below `1.0`? If yes, fail. Uppercase glyphs have no descenders and their cap-tops sit at the very top of the line box — at `line-height: 0.94` (the old Manifesto / Sport / Brutal default) the cap-tops of line N+1 visibly collide with the baseline or commas of line N when the title wraps. The condensed display faces (Anton, Inter Tight 900, Bebas Neue) make this worse. **Floor for all-caps display heads is `line-height: 1.0`; recommended `1.02–1.08`.** Either bump `--lh-tight` ≥ 1.0 for the theme, or drop `text-transform: uppercase` on the display element. Most visible when a two-line `.section__title` wraps with a trailing comma on line one ("SAME PROMPT, TWO / DIFFERENT OUTPUTS.") — the comma + cap-D fuse into a single glyph blob.

56. **[M/R]** **Sticky element at `top: 0` below a sticky page-level nav → bleed.** Does the artifact declare `position: sticky; top: 0;` on any element OTHER than the page's top-level nav / banner / header, when a sticky `<header>` / `<nav>` / `.banner` also exists at `top: 0` (i.e. there are two sticky-at-top-0 elements on the page)? Auto-fail. Both stick to the viewport top during scroll and overlap; the deeper-in-DOM element paints over the nav (visible as a "section header bleeding into the nav bar" glitch). Fix: define a `--banner-height` token (~44–64 px depending on nav design) and offset every secondary sticky to `top: var(--banner-height)`, so it docks **beneath** the nav. Also give the nav a higher z-index than in-page sticky elements — split `--z-sticky` (in-page, e.g. 200) from `--z-sticky-nav` (top nav, e.g. 300) so the nav always out-paints when sticky boxes momentarily overlap. This gate fires only when the page actually has sticky elements (S3 sticky-pinned section heads, F2 sticky-scroll feature stacks, sticky tables-of-contents); pages without sticky behaviour pass trivially.

57. **[J]** **Studied DNA discarded for a catalog theme.** Did a `study` diagnosis emit earlier in the conversation, AND does the build's CSS stamp's `theme:` field name a catalog theme (Specimen, Midnight, Brutal, Garden, Atelier, Newsprint, Terminal, Manifesto, Almanac, Sport, Studio, Riso, Bloom, Coral, Cobalt, Aurora, Editorial, Carnival, Lumen, Hum) rather than `studied-DNA (source: ...)` — without the user having explicitly pivoted ("use Newsprint instead", "ignore the DNA", "rotate to a different theme")? Auto-fail. The studied DNA was meant to be the system (SKILL.md § 2.6 Condition 0); defaulting back to catalog is the attractor pull. Fix: re-emit using the studied DNA's tokens directly (paper OKLCH, accent OKLCH, named candidate fonts, macrostructure, archetypes) and update the stamp to `theme: studied-DNA (source: <URL or image>)` with the inline values. This gate is trivially passed when no recent study exists in conversation scope.

The CSS stamp at Step 6 records mobile pass alongside contrast: `· mobile: pass (34, 49, 50–57)`.

---

## The finish tier (F-checks)

sloplint also runs nine FINISH checks, ids F1-F9. They are polish, not gates: confirm or fix each at Step 7 with the same seriousness as a WARN, but never count them in the 58, and never let one block a ship the gates approved. The rules live in [`finish.md`](finish.md) (F1-F6), [`layout-and-space.md`](layout-and-space.md) § Surfaces (F7), [`scroll-choreography.md`](scroll-choreography.md) (F8), and the imagery kit's avatar discipline (F9, whose fake-avatar half is the tier's one FAIL).

- **F1** straight quotes in prose · **F2** `...` instead of `…` · **F3** no `text-wrap: balance` on display heads · **F4** more than one filled-primary button recipe · **F5** icon in a coloured circle coin · **F6** display-size numerics without tabular figures · **F7** one container recipe stamped on six or more selectors · **F8** more than one scroll-choreography pattern · **F9** fake-human avatar hotlinks (FAIL) / person-keyword stock URLs (WARN).

---

If any answer is **yes**, fix it. Do not ship slop.
