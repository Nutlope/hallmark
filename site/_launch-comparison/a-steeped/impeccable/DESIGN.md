# Steeped — DESIGN.md

Stub generated alongside the landing page. Captures the design decisions the page commits to so subsequent surfaces can match.

## Theme & scene

> *A subscriber in Vermont, 6:43am in early January. The kettle just clicked off. One lamp on in the kitchen. Outside the window, dawn is still blue.*

The scene forces a **dark surface with warm interior light** — not bright daylit white, not midnight black. The page is the colour of strong tea against a winter window.

## Color strategy

**Committed.** One saturated color carries the surface.

Tokens (OKLCH, no `#000`, no `#fff`):

| Token         | Value                       | Role                                  |
|---------------|-----------------------------|---------------------------------------|
| `--ink`       | `oklch(0.18 0.012 60)`      | Page surface (warm near-black)        |
| `--ink-soft`  | `oklch(0.32 0.014 60)`      | Section backgrounds, hairlines        |
| `--ink-quiet` | `oklch(0.52 0.012 60)`      | Tertiary text, captions               |
| `--steep`     | `oklch(0.54 0.135 55)`      | The committed amber — type & accents  |
| `--steep-deep`| `oklch(0.42 0.130 50)`      | Hover, struck-through, edges          |
| `--steep-lit` | `oklch(0.68 0.140 60)`      | Liquor in the cup illustration        |
| `--bone`      | `oklch(0.96 0.012 80)`      | Inverted panels, body copy on dark    |
| `--bone-edge` | `oklch(0.91 0.014 80)`      | Hairlines on bone                     |
| `--leaf`      | `oklch(0.38 0.078 145)`     | Single deliberate green, used once    |

Category-reflex check: tea brands default to sage / cream / forest-green. Rejected. Second-order reflex is editorial-Fraunces-on-bone. Also rejected. The committed amber on warm near-black is the colour of the actual liquor in low light.

## Typography

- **Display:** Source Serif 4, weights 400 and 600. Carries the slow, warm tone without falling into the Fraunces/Cormorant editorial reflex.
- **Sans:** Switzer (Indian Type Foundry). Weights 400, 500, 600. Used for prices, labels, body copy, controls.
- **Scale:** modular, fluid `clamp()`, 1.333 ratio.
- **Hero:** Source Serif 4 italic-roman mix at `clamp(3.2rem, 2.2rem + 6vw, 7.2rem)`. Line-height 0.95. Tight.

## Layout

- Asymmetric. Left-aligned hero, single decisive image on the right.
- Tea-of-the-month index is a two-column ledger with vertical hairlines, not a card grid.
- Subscribe panel inverts to bone on amber for the only moment of full chromatic commitment.
- Spacing varies deliberately: hero breathes, ledger tightens, subscribe expands again.

## Imagery

The brief implies imagery. Without verified stock URLs, the page ships a **hand-drawn SVG vignette** of a glass cup with hot liquor and rising steam — credible scene per impeccable's imagery law.

## Motion

One coordinated page-load: hero text reveals with a staggered translate-and-fade on the serif words. The steam in the SVG drifts continuously. Section reveals on scroll use `IntersectionObserver`, opacity + transform only, 600ms `ease-out-quart`. Respects `prefers-reduced-motion`.

## Bans honored

- No side-stripe borders.
- No gradient text.
- No glassmorphism.
- No hero-metric template (no big "600 subscribers" number-and-label).
- No identical card grid.
- No em dashes in copy.
- No monospace-as-tech-shorthand.
- No tiny tracked uppercase label above every heading (one used once, deliberately).
</content>
