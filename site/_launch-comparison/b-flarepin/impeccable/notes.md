# Flarepin · Impeccable build notes

## Mode

`impeccable`

## Brief

Error-tracking SaaS for backend developers (Node / Python / Go), self-hosted or managed, pricing $0 / $29 / $99 per project, voice technical-sharp, founded by 2 ex-Stripe SREs, beta with 120 teams, 18ms median ingestion.

## Command(s) used

`/impeccable craft` — chosen because the brief asks to "build the landing page from a brief," and `craft` is the end-to-end build flow that internally runs `shape`. `shape` alone would have stopped at the brief; `craft` is the right command for ship-the-page intent.

Setup ran first per SKILL.md:
1. `load-context.mjs` ran — returned `hasProduct: false`, `hasDesign: false`, `contextDir: /private/tmp` (the cwd). Normally this would block on `/impeccable teach`; per task instructions I self-generated stub `PRODUCT.md` and `DESIGN.md` in the output folder instead of bouncing into an interactive teach flow.
2. Register identified as **brand** (landing page, cue from the task itself).
3. Loaded `reference/brand.md`, `reference/craft.md`, `reference/shape.md`, plus the shared design laws in `SKILL.md`, plus `reference/spatial-design.md` and `reference/color-and-contrast.md` for implementation.

Step 3 (Visual Direction Probe via Codex `image_gen`) was **skipped** with a one-line announcement (per craft.md): the harness lacks native image generation. Mocks collapse into the brief.

## Would-be Impeccable questions (count: 12) — self-answered

Impeccable's `shape` Phase 1 interview would have asked at least one round (2–3 questions) and a `craft.md` codex.md Step A round if image-gen were available. Because no image-gen is present and the brief is otherwise dense, the realistic question budget is one shape round plus the brief-level confirmation. Logged here in full for the comparison:

1. **Color strategy?** → **Committed**. Brand surface, dev-tool register, can carry one saturated brand color across 30–60% of attention. Reject Restrained-by-reflex (would be invisible per brand.md).
2. **Theme scene sentence?** → "An on-call backend engineer at 11pm, alone in a home office lit only by a glowing keyboard, scrolling a stack trace and deciding whether to wake the team." → **dark**.
3. **Three named anchor references?** → (a) Vercel's monochrome-with-one-accent restraint; (b) Sentry pre-2022 dev-tool density (stack frames in the hero); (c) early Linear (sharp, technical, no card chrome). Counterweight: Klim Pitch Sans specimens for type texture.
4. **Brand voice words (three)?** → exact, terse, on-call. Physical anchors: a pager, a tickertape, a `dmesg` log.
5. **First-order reflex check (observability → dark blue)?** → Reject blue. Pick **ember/amber** (oklch 72% 0.18 ~50), the color of a pager LED at 3am. Tinted neutrals lean amber, not blue.
6. **Second-order reflex check (avoid editorial-typographic, avoid neon-on-black)?** → Both avoided. Lane is terminal-native + ember, not magazine + italic.
7. **Font selection?** Reflex would be IBM Plex Mono + Inter (both banned by brand.md). Chose **`system-ui` + `JetBrains Mono`**. system-ui because the brand lives next to the user's OS (and zero webfont latency for prose). JetBrains Mono because mono here is register, not costume — the brand IS terminal-adjacent.
8. **Sections (DOM order)?** Topbar → Hero (with live stack trace + first-load latency count-up) → Why 18ms matters (with histogram + 3 honest claims) → Stacks (Node / Python / Go, with real install lines) → Deploy (self-hosted vs managed) → Pricing (comparison table, not card grid) → Founders (named, with bios) → Final CTA → Footer.
9. **How to handle the 18ms metric without the hero-metric template?** → 18ms is shown in context: inline in the trace footer, in the histogram with a p50 marker, and in the why-claim row with the measurement source ("our edge, last 7d, 4.2M events"). Never floating as a gradient stat.
10. **Pricing layout (avoid identical card grid)?** → Comparison **table** with the differentiating rows pulled forward and the middle tier subtly ember-tinted with full vertical borders (no side-stripe). Cards explicitly avoided.
11. **Imagery?** → Tech-brand imagery: live stack trace SVG, latency histogram SVG, code snippets per language, docker-compose snippet, DSN env snippet. Zero stock photos. Zero CSS-panel placeholders.
12. **Fidelity / scope?** → Production-ready single static HTML page with external CSS + tokens, one tiny first-load JS reveal (count-up to 18, respects `prefers-reduced-motion`).

(Confirmation gates 2–4 from craft.md collapsed into the brief itself per the harness-lacks-image-gen rule.)

## Reference files loaded

- `/Users/youssef/.claude/skills/impeccable/SKILL.md`
- `/Users/youssef/.claude/skills/impeccable/reference/craft.md`
- `/Users/youssef/.claude/skills/impeccable/reference/shape.md`
- `/Users/youssef/.claude/skills/impeccable/reference/brand.md`
- `/Users/youssef/.claude/skills/impeccable/reference/spatial-design.md`
- `/Users/youssef/.claude/skills/impeccable/reference/color-and-contrast.md`

Generated context stubs in this folder:
- `PRODUCT.md` (stub, generated)
- `DESIGN.md` (stub, generated)
- `tokens.css` (OKLCH tokens + scale + spacing)

## Sections shipped (DOM order)

1. `<header class="topbar">` — brand mark, primary nav, sign-in + start-free CTAs
2. `<section class="hero">` — display headline + lede + CTAs + meta strip; aside with live stack trace and latency count-up
3. `<section class="why" id="why">` — sticky head + prose + SVG histogram + 3-column claim row with measurement sources
4. `<section class="langs" id="langs">` — Node / Python / Go, each a row with name, install snippet, what's uniquely captured
5. `<section class="deploy" id="deploy">` — two-column self-hosted vs managed, real docker-compose and DSN snippets
6. `<section class="pricing" id="pricing">` — comparison table; head row, 7 feature rows, CTA row; middle tier ember-marked
7. `<section class="founders" id="founders">` — sticky head + 2 named founders with role + bio
8. `<section class="cta">` — final viewport, large display headline, two CTAs, no-credit-card fine print
9. `<footer class="footer">` — brand + 3-column nav + copyright

## Hero headline (verbatim) + char count

> "catch what your logs are missing."

33 characters. Lowercase deliberate (terminal register, not marketing-headline title case). The word "missing" is in JetBrains Mono + ember solid — flat color, no gradient text.

## Font stack

- Prose: `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`
- Mono: `"JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace`

JetBrains Mono is loaded from Google Fonts with weights 400 / 500 / 700. system-ui is platform-resolved (zero webfont round-trip).

## Color palette (OKLCH)

| Token | Value | Role |
|---|---|---|
| `--bg` | `oklch(14% 0.008 50)` | base surface, warm-tinted near-black |
| `--bg-1` | `oklch(17% 0.010 50)` | one elevation up |
| `--bg-2` | `oklch(21% 0.012 50)` | two up; code blocks |
| `--ink` | `oklch(94% 0.010 70)` | primary text |
| `--ink-mute` | `oklch(70% 0.014 60)` | secondary text |
| `--ink-dim` | `oklch(52% 0.012 55)` | tertiary, labels |
| `--rule` | `oklch(28% 0.010 55)` | hairlines |
| `--rule-soft` | `oklch(24% 0.010 55)` | softer hairlines |
| `--ember` | `oklch(72% 0.18 50)` | brand color, ~10% of pixels / ~80% of attention |
| `--ember-deep` | `oklch(58% 0.20 45)` | hover / pressed |
| `--ember-glow` | `oklch(78% 0.16 55)` | focus rings |
| `--good` | `oklch(72% 0.15 145)` | pass states in pricing |
| `--bad` | `oklch(64% 0.20 25)` | error tag in trace |

No `#000`, no `#fff`. Every neutral tinted toward the ember hue (~50–70). Strategy = **Committed**, not Restrained.

## File sizes (wc -c)

```
   25941 index.html
   22475 style.css
    1326 tokens.css
    1612 PRODUCT.md
    3643 DESIGN.md
   54997 total
```

(notes.md self-excluded; reported separately at 10195 bytes.)

## Honest observation: Impeccable vs Hallmark

What Impeccable produced that Hallmark wouldn't:

A lot of explicit, named *reasoning* that lives in `PRODUCT.md`, `DESIGN.md`, `tokens.css`, and the structured `notes.md` itself. The skill forced a register identification (brand), forced a color strategy with a name from a four-step axis (Committed), forced a theme scene sentence before picking dark, forced two reflex-rejection passes (observability-blue, editorial-serif), and forced font choices through a four-step procedure that explicitly bans the obvious picks. The page itself reflects that discipline: a comparison table instead of three identical pricing cards; SVG histogram + inline trace footer instead of a hero-metric stat block; full-width subtle background tint on the hot frame instead of a side-stripe border; a single committed ember accent instead of a polite blue-and-cream observability palette. Hallmark, by contrast, tends to start from a structural-variety mandate ("every theme must produce different layout structure, not just colour/font swaps") and produces strong layout differentiation more readily, but it would not necessarily produce the same paper-trail of explicit named decisions — the design choices are equally considered but less *audit-able* from the artifacts alone.

What Hallmark would produce that Impeccable here didn't:

More structural variety across sections — Hallmark's controlled-variety directive would likely push the four content sections (why / stacks / deploy / founders) toward more distinct layout topologies (one column-heavy, one diagonal split, one full-bleed, one editorial). The Impeccable build here uses a fairly consistent left-rail / right-body rhythm with one detour (the langs section). It also lacks the kind of single signature "look once and remember it" hero move that Hallmark would push for (a single oversized typographic gesture, a deliberately strange image crop, a custom-drawn pictograph). The Impeccable result is honest, dense, and on-brand for a dev tool, but it earns its distinctiveness through *content density and committed color*, not through *structural surprise*. Both are valid; they are different bars.
