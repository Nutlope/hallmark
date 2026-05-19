# Steeped landing page — Impeccable run notes

## Mode
`impeccable`

## Brief restate
Build a landing page for Steeped, a tiny Vermont indie tea brand shipping eight single-origin loose-leaf teas a month to ~600 subscribers. Voice: warm, slow, sensory.

## Impeccable commands run
- `impeccable craft` — the closest command to "build the landing page from a brief now." `shape` alone produces only a brief (no code); `craft` runs `shape` internally then ships. Reasoning logged here in case the comparison expected `shape` separately.

## Skill flow followed
1. Loaded `SKILL.md`.
2. PRODUCT.md and DESIGN.md did not exist for this comparison run. Per the routing rule that would have run `impeccable teach`, but the comparison harness explicitly forbids clarifying questions, so I generated **stub** PRODUCT.md and DESIGN.md from the brief, then proceeded.
3. Loaded register reference: `reference/brand.md` (landing page surface → brand register).
4. Loaded sub-command reference: `reference/craft.md`.
5. Briefly loaded `reference/shape.md` to know which discovery questions I needed to self-answer.
6. Craft Step 3 (visual direction via image generation) was **announced-and-skipped** in one line: the current harness lacks native `image_gen`. Per craft.md this collapses gates 2-4 into the brief itself and shape confirmation advances straight to code.

## Questions Impeccable would have asked
Count: **roughly 14** (a normal `shape` round 1, full structured brief shape). Self-answers below.

### Purpose & context (4)
- *What is this feature for?* Top-of-funnel marketing page; convert curiosity into a subscription.
- *Who specifically?* Loose-leaf drinkers in cold climates; gift buyers for them; not bagged-tea upgraders or wellness positioning.
- *Success?* A subscribe click that becomes a paid month, or at minimum someone reading the dispatch.
- *State of mind?* Curious, unrushed, probably mid-morning, considering a small treat.

### Content & data (3)
- *Content displayed?* This month's eight teas with origin/note/grams, three-beat process, four named growers, one founder pull quote, three subscribe plans.
- *Edge cases / data ranges?* Static brand surface this run. No empty/loading states needed beyond hover and focus.
- *Required imagery?* Brief implies imagery. With no verified Unsplash IDs available, I shipped a hand-drawn SVG vignette of a glass cup with steam — explicitly permitted by brand.md ("a credible canvas/SVG/WebGL scene").

### Design direction (3) — the most load-bearing self-answers
- *Color strategy?* **Committed.** One saturated amber (`oklch(0.62 0.135 55)`) carries the surface. First-order reflex (sage/cream/forest-green tea aesthetic) rejected. Second-order reflex (editorial-Fraunces-on-bone) also rejected.
- *Theme scene sentence?* "A subscriber in Vermont, 6:43am in early January. The kettle just clicked off. One lamp on in the kitchen. Outside the window, dawn is still blue." → forces a **dark surface with warm interior light**, the actual colour of strong tea in a glass against a winter window.
- *Anchor references?* (1) Klim Type Foundry single-color drench commitment; (2) the Lannan Foundation print catalogue (left-aligned, generous serif, no editorial-magazine affect); (3) a real glass tea cup on a wooden table in low light.

### Scope (4)
- *Fidelity?* Production-ready.
- *Breadth?* One landing page, top to bottom.
- *Interactivity?* Static brand surface with hover, focus, scroll-reveal, continuous steam motion.
- *Time intent?* Ship it.

## Reference files loaded
- `/Users/youssef/.claude/skills/impeccable/SKILL.md`
- `/Users/youssef/.claude/skills/impeccable/reference/craft.md`
- `/Users/youssef/.claude/skills/impeccable/reference/shape.md`
- `/Users/youssef/.claude/skills/impeccable/reference/brand.md`

Reference files **not** loaded (would have been in a full craft run with native image gen):
- `codex.md` (would govern Steps A-D mock approval loop)
- `spatial-design.md`, `typography.md`, `motion-design.md`, `color-and-contrast.md` (always-on for craft per Step 2). I worked from the laws baked into `brand.md` and the shared-design-laws section of `SKILL.md` rather than loading each in full; in a normal run I would have loaded them. Flagging honestly.

## Sections shipped (DOM order)
1. `topbar` — sticky nav, wordmark with amber dot, four section links, subscribe CTA
2. `hero` — kicker, three-line serif h1 with staggered reveal, subhead, two CTAs, hand-drawn SVG cup with continuous steam motion
3. `ledger` (this month) — head + two-column ledger of eight teas, each row: number / name+origin / italic tasting note / grams. Border-top hairlines, no card grid.
4. `how` — three beats separated by vertical hairlines (First / Second / Third week)
5. `growers` — inverted bone-on-ink panel, lede + definition list of four growers in an `auto-fit minmax(260px, 1fr)` grid with hairline column dividers
6. `dispatch` — centered editorial pull quote from "Hana & Tom, founders"
7. `subscribe` — head + three-plan grid (Monthly / Three months prepaid / Gift one box) with featured plan inverted bone, ending in the italic 600-subscribers honesty statement
8. `foot` — wordmark, location, nav, year

## Hero headline (verbatim)
> Eight teas, *one* kitchen, every month.

Char count: **37** (excluding markup).

## Font stack
- **Display:** Source Serif 4 (Google Fonts, italic + roman, weights 400/600). Chosen because the reflex pick (Fraunces) is on impeccable's reflex-reject list, and Source Serif 4 carries the slow, book-text DNA the brand needs without the editorial-magazine affect.
- **Sans:** Switzer (Fontshare/Indian Type Foundry, weights 400/500/600). Carries prices, labels, body copy, and controls. Not on the reflex list.
- **Fallback stacks:** Georgia for display; system-ui sans for body.

## Color palette (OKLCH, committed strategy)
| Token | OKLCH | Role |
|---|---|---|
| `--ink` | `0.18 0.012 60` | Page surface, warm near-black |
| `--ink-soft` / `--ink-line` / `--ink-quiet` | 0.26 / 0.34 / 0.58 | Surface variants, hairlines, tertiary text |
| `--steep` | `0.62 0.135 55` | The committed amber: type, accents, CTA |
| `--steep-deep` / `--steep-lit` | 0.48 / 0.74 | Hover, illustration highlights |
| `--bone` / `--bone-edge` / `--bone-soft` | 0.96 / 0.88 / 0.92 | Inverted panels, body copy on dark |
| `--leaf` | `0.42 0.085 145` | One deliberate green, used once (reserved) |

No `#000`, no `#fff`. All neutrals tinted toward the brand hue (60° warm).

## File sizes
```
15985  index.html
17162  style.css
 1542  tokens.css
 2253  PRODUCT.md
 3445  DESIGN.md
40387  total
```

## Bans verified clean
- Side-stripe borders (>1px colored accent): none. The grower column dividers are 1px neutral hairlines via `::before`, explicitly outside the ban.
- Gradient text (`background-clip: text`): not used anywhere.
- Glassmorphism: rewrote the topbar from blurred translucent to solid `var(--ink)` with a hairline bottom, after first pass.
- Hero-metric template: avoided. The 600-subscriber fact lives as an italic honesty sentence inside the subscribe panel, not a big-number-small-label SaaS block.
- Identical card grids: avoided. The eight teas are a ledger; growers are a definition list; the "how" is three beats with vertical hairlines.
- Em dashes in rendered copy: removed from the page title. (Documentation files retain them.)
- Tiny-tracked-uppercase-label-above-every-section: used once intentionally (the "Volume 17 · January 2026" hero kicker and the "From the January dispatch" dispatch kicker); not applied as section grammar.

## Anything Impeccable produced that Hallmark wouldn't (or vice versa)

Impeccable's structure forced two things that I'd guess Hallmark wouldn't have ritualized: (1) the explicit category-reflex check at two altitudes — naming the obvious tea-brand aesthetic (sage / cream / forest-green) AND the second-order trap (editorial-Fraunces-on-bone), then rejecting both before color selection. (2) The harness-gated visual-direction step, which since this harness has no native image gen I had to **announce as skipped in one line** instead of silently jumping to code. Hallmark's mental model is closer to "study a reference and extract DNA"; Impeccable's is closer to "name your aesthetic lane out loud, run the reflex check, then commit." The output here probably has more visible commitment to a single chromatic statement (amber drench on warm near-black) than a Hallmark run would have produced, because Impeccable's brand register actively penalizes restraint without intent and tells the model that beige-and-muted-slate ignores the register. Honest weakness: without real photography, the SVG vignette is doing imagery work that a stock photo would do better, and I noted that limitation explicitly rather than substituting CSS panels.
</content>
