# `hallmark audit input.html`

> User invocation: *"hallmark audit input.html"*

## Verbs loaded

- [`anti-patterns.md`](../../../references/anti-patterns.md) — the named-tells library to score against
- [`structure.md`](../../../references/structure.md) — for the structural-fingerprint check (gate 9)
- [`microinteractions.md`](../../../references/microinteractions.md) — the timing/easing canon

(No write paths. `audit` does not edit.)

## Findings — `input.html` (148 lines, 1 stylesheet inline)

### CRITICAL — page ships as slop · 5 findings

| # | Tell | Where | Fix |
| --- | --- | --- | --- |
| 1 | **AI structural template** — hero (centered, 100vh) → 3-equal feature grid → CTA → footer. The fingerprint that screams "AI-generated UI". | full page · `<section class="hero">` (l. 79) → `.features` (l. 96) → `.cta` (l. 113) → `<footer>` (l. 121) | Pick a non-Hero+3-Card macrostructure from `macrostructures.md`. For an AI/SaaS positioning brief, `Bento Grid`, `Stat-Led`, or `Workbench` is right. **This is a structural finding — the visual fixes won't save it.** |
| 2 | **Inter as display font** | `body { font-family: 'Inter' }` (l. 10) | Pair a distinctive display face with body. Geist Mono + Geist; Newsreader + Inter Tight; Bricolage + Söhne. Single-Inter is the LLM-default. |
| 3 | **Purple-to-blue gradient on the hero headline** (`background-clip: text`) | `.hero h1` (l. 24-29) | Single ink colour for the headline. Reserve gradient for one specific decorative band, never for headline text. |
| 4 | **Pure `#fff` and pure `#000` as base colours** | `body { background: #fff; color: #000; }` (l. 11-12) | OKLCH paper at 96–98 % L with a slight hue tint (warm or cool); ink at 18–22 % L tinted to match. Pure-white + pure-black reads industrial-template. |
| 5 | **Cards have a thick coloured side-stripe + the same gradient-icon on every card + nested card inside one card** | `.feature-card { border-left: 4px solid #8b5cf6 }` (l. 110); `.nested-card` (l. 134); icon-wrap gradient (l. 122) | Drop the side-stripe entirely. Drop the icon-above-headline pattern. Drop the nested card (cards inside cards is the boy-band tell). If you need three feature blocks, ship them as numbered prose rows or a 2-up asymmetric pair, not 3-up icon tiles. |

### MAJOR — looks AI-generated · 6 findings

| # | Tell | Where | Fix |
| --- | --- | --- | --- |
| 6 | **`transition: all`** with bouncy easing on `.btn`, `.feature-card`, `.cta button` | l. 41, l. 117, l. 130 | Specify properties: `transition: transform 100ms var(--ease-out), border-color 200ms var(--ease-out)`. Bouncy `cubic-bezier(0.34, 1.56, ...)` is reserved for *physical* interactions (drag, drop, throw); UI state changes get the named easings. |
| 7 | **`hover: scale(1.05) translateY(-2px)` + shadow + transform on the same element** | `.btn:hover` (l. 41), `.feature-card:hover` (l. 116), `.cta button:hover` (l. 132) | One hover effect, not three. Pick one of: subtle border-colour shift, subtle background tint, or a 1 px translate. Drop the rest. Multi-property hover is an AI-default tell. |
| 8 | **Animating `transform` + adding `box-shadow` + colour change in 300 ms** — at least three layout-perceived properties at once | `.btn:hover` (l. 41) | The hover state should change one observable thing in 100–150 ms. The user knows it's interactive; you're not selling them. |
| 9 | **Cliché copy** — "AI-powered platform for modern teams", "ship faster, collaborate smarter", "Built for the modern team", "Get up and running in seconds", "50,000+ teams" | l. 80, l. 81, l. 110-111, l. 117 | Replace template phrases with claims specific to *this* product. Slop test gate 20 (placeholder names / startup-cliché copy) fires here. |
| 10 | **Pill-shape buttons (`border-radius: 9999px`) + the same gradient on the button** | `.btn` (l. 35), `.cta button` (l. 122) | Pill buttons are not wrong on principle, but a pill button + gradient + bouncy hover is the third cliché stacked. Pick a sober border-radius (2–4 px) or own the pill — but not with the gradient. |
| 11 | **Auto-rotating section padding all `6rem`** — every section identical in rhythm | `.features { margin: 6rem auto }`, `.cta { padding: 6rem 2rem }`, hero `min-height: 100vh` | Vary section spacing. The rhythm signals which sections are heavier vs lighter. Identical padding is the equal-whitespace tell from gate 10. |

### MINOR — small taste issues · 3 findings

| # | Tell | Where | Fix |
| --- | --- | --- | --- |
| 12 | **Hero `min-height: 100vh`** | `.hero { min-height: 100vh }` (l. 16) | Most hero copy doesn't earn 100 vh. Set min-height to content + a small floor (`min-height: 70vh` at most). 100vh hero with one centered heading is the AI cliché. |
| 13 | **No `:focus-visible` ring anywhere** — `.btn`, `.feature-card`, `.cta button` | l. 35, l. 110, l. 122 | Add `:focus-visible { outline: 2px solid <accent>; outline-offset: 3px; }` on every interactive element. Eight states is the rule (gate 28). |
| 14 | **No reduced-motion fallback for any of the hover transitions** | full page | Wrap motion in `@media (prefers-reduced-motion: reduce) { .btn, .feature-card, button { transition: none; transform: none; } }`. Slop test gate 29. |

---

## Counts

**5 critical · 6 major · 3 minor.** Total: 14.

The page fails the slop test on **at least 14 of 38 gates.** It is not refinable in place — the structural fingerprint (gate 9) plus the gradient-text headline (gate 5) plus the hover-stack (gate 14) require a `redesign`, not a `refine`.

## Recommendation

Do **not** run `hallmark refine` here. Run `hallmark redesign` instead — `refine` preserves structure, and the structure itself is the primary problem. See [`../redesign/`](../redesign/) for what a redesign of a similar page looks like.

If the user *insists* on keeping this page's structure (e.g., because the brief explicitly asked for a Hero + 3 features), `refine` can fix the visual tells (font, gradient, easings, side-stripe, hover-stack) but the structural-fingerprint finding will still fail audit on the next pass.
