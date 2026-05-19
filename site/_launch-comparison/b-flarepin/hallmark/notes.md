# Flarepin · Hallmark build · notes

**Mode:** hallmark (default Design flow)

**Brief (one line):** Flarepin — error-tracking SaaS for backend devs (Node/Python/Go), self-hosted or managed, $0 / $29 / $99 per project, ~120 beta teams, 18 ms median ingestion, founded by 2 ex-Stripe SREs.

---

## Self-answered Hallmark questions (per brief instruction — did not ask)

- **Audience** · Backend engineers and SREs running production Node / Python / Go services. They already know what an unhandled rejection is; they want to see the span that drained the pool, not be told that errors happen.
- **Use case** · Drive a single action — *"start a free project"* — with a secondary read-the-captures path for the still-evaluating.
- **Tone** · Technical · sharp · no marketing fluff. Declarative voice. The page never says "trusted by", never invents a percentage, never abstracts. The brief explicitly demanded this and it is what backend dev tools earn trust with.

---

## Genre · macrostructure · theme · nav · footer

| Axis | Pick |
|---|---|
| **Genre** | modern-minimal (SaaS / dev-tool signal) |
| **Macrostructure** | **05 · Workbench** — numbered steps with side-by-side caption + code panels, sticky-like cadence without sticky-scroll fragility |
| **Theme** | **Quiet** (canonical modern-minimal) — paper `oklch(99.2% 0 0)`, monochrome neutrals, single ink-blue accent `oklch(48% 0.16 254)` |
| **Nav** | **N5 · Floating pill** — content-sized, blur backdrop, soft shadow, hairline border |
| **Footer** | **Ft2 · Inline single line** — wordmark + meta + links on one row, hairline top |
| **Enrichment** | **Tier-A pure-CSS trace panel** — a `<figure>` of monospace, syntax-coloured exception output with one pinned span. **No re-drawn browser chrome, no traffic-light dots, no fake IDE frame** (gate 57). |

**Wordmark register:** Fraunces 600 over a Geist body (3-family ceiling held: Geist · Fraunces · Geist Mono).

---

## Step 5 · Preview block (verbatim)

> **Hallmark · v1.0.0**
>
> - **Macrostructure** · Workbench
> - **Theme** · Quiet (near-white paper · zero-chroma neutrals · single ink-blue accent · Geist display)
> - **Enrichment** · Tier-A pure-CSS trace panel (typographic, no re-drawn chrome) + Tier-A inline `<pre>` capture panels in each step
> - **Sections** · Nav · Hero (Workbench) · Runtime strip · 3-step Workbench tour · What it catches · Pricing (3 tiers) · Founders · Final CTA · Footer
> - **Motion** · trace-pin pulse (2.4 s loop, reduced-motion fallback) · button press translateY · nav backdrop blur — **under three primitives**
> - **Slop test** · 65 / 65 ✓
> - **Diversification** · first Hallmark run in `_launch-comparison/b-flarepin/`; no prior stamp to differ from
>
> *System portable? Say `lock the system` to extract this build's tokens + voice into a `design.md`.*

---

## Hero headline

**Verbatim:** *"Errors with their stack still warm."*

- **Word count:** 6 words ✓ (≤ 7)
- **Character count:** 35 chars ✓ (≤ 50)
- **Token applied:** `--text-display` → `clamp(2.5rem, 5vw + 0.5rem, 4.5rem)`. Sits in the 21–50-char bucket per `typography.md § Hero headline sizing`; full display size with no step-down required.
- **Voice fit:** *Errors with their stack* is the noun the brief sells. *Still warm* is the technical-voice payoff — concrete, evocative, no fluff. No invented metric. Italic `<em>` on "still warm" via the wordmark serif (Fraunces) — earns the 3-family ceiling.

---

## Slop test · 65 / 65 ✓

All 65 gates pass. The risk-weighted ones, with their resolutions:

| Gate | Risk | Resolution |
|---|---|---|
| **8** pure `#fff` | low | Modern-minimal allows pure paper; I went one step under at `oklch(99.2% 0 0)` for chroma future-proofing |
| **9** AI structural template | high (default risk for SaaS) | Replaced "hero → 3 features → CTA" with Workbench tour + asymmetric step grid + numbered macro-labels |
| **24** zero-chroma neutrals | low | Modern-minimal allows; the canonical Stripe/ElevenLabs school |
| **51** nav fingerprint | high | Used N5 floating pill instead of the wordmark-left + links-centre + button-right + hairline-bottom AI default |
| **52** footer fingerprint | high | Ft2 inline single line, not the 4-column Product/Company/Resources/Legal slop |
| **53** hero centred-everything | high | Hero is two-column left-bias; alignment broken across grid |
| **54** hero padding asymmetry | medium | Start = 5.5 rem · end = 8 rem (ratio 1.45 ≥ 1.3) |
| **56** invented metrics | **critical** | Only **18 ms** and **120 teams** appear as Flarepin-brand metrics — both supplied. The 3,790 / 3,812 ms numbers inside the trace are illustrative example log content, not brand claims |
| **57** re-drawn chrome | **critical** | The trace panel is a styled `<figure>` of monospace text. No traffic-light dots, no URL pill, no fake titlebar/window chrome, no fake IDE. The first-line `::before` caption ("exception_captured.log · 02:14:08.221 UTC") is a label, not chrome |
| **58** token discipline | high | Every colour referenced via `var(--color-*)`. Hover/press inks lifted into `--color-ink-hover` / `--color-ink-press` tokens; nav inset highlight and shadow lifted into `--color-paper-glow` / `--color-shadow` |
| **59** two-line clickable text | medium | All CTAs labelled short ("Start free", "Start a free project", "Read the docs"); nav links collapsed below 40 rem |
| **60** emoji-as-icon | medium | No `✨🚀⚡` icons. Arrow glyphs are typographic, `✓` only appears inside a code-styled `<pre>` as part of simulated log output |
| **61** image-grid `1fr` | medium | Every multi-column grid uses `minmax(0, 1fr)` |
| **62** overflow-x clip | required | `html, body { overflow-x: clip; }` set |
| **63** display long-word wrap | required | `overflow-wrap: anywhere; min-width: 0` on `.hero__display` |
| **64** per-theme section-head | n/a | No theme override of `.section__head` grid; single theme only |
| **65** radio-tab scroll-jump | n/a | No CSS-radio tab pattern used |

---

## File sizes (`wc -c`)

```
12945  index.html
18715  style.css
 3823  tokens.css
─────
35483  total
```

---

## How this differs from the vanilla "no-skills" build

The no-skills build will reach reflexively for the AI structural template — Inter-everywhere, wordmark-left + centred-links + button-right nav, three-equal feature cards with emoji icons, gradient hero text, a 4-column footer, and either "Acme" placeholder logos or an invented "trusted by 10,000+ teams" line — none of which appear here; Hallmark replaces that fingerprint with a Workbench macrostructure on Quiet, an N5 floating pill, an Ft2 inline footer, a pure-CSS typographic trace panel that doesn't re-draw browser chrome (gate 57), Geist + Geist Mono + Fraunces (no Inter, no emoji icons), real metrics only (18 ms, 120 teams, $0/$29/$99), and an asymmetric three-step grid with monospace code panels that reads as written for backend engineers rather than generated for SaaS.
