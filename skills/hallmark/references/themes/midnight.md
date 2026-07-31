# Theme - Midnight

Atmospheric, cool-nocturnal register. The page for an **AI or dev tool you open after dark** - a generative model playground, a rendering pipeline, an observability console, a late-night creative instrument - but rendered in **cold azure moonlight, not the genre's warm firelight**. A deep midnight-blue canvas (`oklch(15% 0.022 250)`), near-white cool ink, one azure signal, and thin airy Geist display. It reads calm, spacious, cerebral: the small hours, not the golden hour.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `midnight`. Tokens: [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="midnight"]`. No canonical build yet; mirror the moves below.

> **Why cool, not warm.** The atmospheric cluster defaults to warm blooms (Bloom terracotta, Lumen Night amber). Midnight is the deliberate **cool** exception: it keeps the dark canvas + fade-only motion + centred hero, but aims a single azure accent (hue 220) at the cold-light lane. The blue chill is the differentiator, not a recolour of a warm sibling.

## Axes (diversification)

- **Paper band** - **dark, blue-tinted** (`oklch(15% 0.022 250)`, ~15% L, hue 250). A midnight blue with real chroma, never `#000`. Elevation climbs to `paper-2` `oklch(20% 0.024 250)` and `paper-3` `oklch(25% 0.026 250)`.
- **Display style** - **geometric-sans, thin** (Geist at `--display-weight: 300`). Airy light-weight display, tracking `-0.03em`. Distinct from Bloom's weighty Geist 600 and every serif sibling.
- **Accent hue** - **azure / cool cyan-blue** (`oklch(72% 0.16 220)`). Sits a few degrees cyan of the blue ground (250), so it reads as a separate cold light, not a brighter canvas. Clear of Cobalt/Lumen indigos (~256/268). Signal, never flood.

## Reference register

Linear (dark) · Raycast · Vercel dark mode · Resend dark · Cron / calendar dark · Perplexity dark · Diagram · cool nocturnal model playgrounds.

The aesthetic: the cool-dark product page - a deep blue canvas, one cold signal, thin confident display, generous void. Hand-built, moody without being warm.

**Patron-saint reference (internal):** *Linear's cool-dark restraint* + *an observatory at 2 a.m.* - a calm instrument lit by one distant azure light. Ask "does this feel like a cold clear night, or a warm-lit room?" Keep the former.

## Required dependencies

1. **Fonts** - **Geist** (display 300 + body 400/500), **Geist Mono** (labels), **Instrument Serif** (one roman accent moment only). Google Fonts:
   ```html
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Instrument+Serif&display=swap" rel="stylesheet" />
   ```
2. **A reveal script** - one `IntersectionObserver` adding `.is-in` (fade + ~10px rise, ease-out ~600ms). Fade is the whole motion budget.

## Signature moves

1. **Deep midnight-blue canvas, never black** - `--color-paper: oklch(15% 0.022 250)`. The 0.022 chroma is load-bearing: it is midnight *blue*, not void. Ink is cool near-white `--color-ink: oklch(95% 0.008 230)`; body sits at `--color-ink-2: oklch(86% 0.010 230)`.

2. **Thin Geist display, the airy nocturnal signature** - `--display-weight: 300`, tracking `-0.03em`, `--text-display: clamp(2.75rem, 5vw + 1rem, 5.25rem)`. Light-weight display at large size is the theme's face: spacious, cold, calm. Never the genre-default 600.

3. **One azure signal, used sparingly** (< 5% of any viewport) - `--color-accent: oklch(72% 0.16 220)` on the eyebrow tick, a link hover, the one primary button, focus rings, an active nav item, a single glowing numeral. Everything else is cool-white on blue-dark.

4. **A single cool glow, not two warm blooms** - one fixed radial-gradient low or behind the hero, azure hue ~220-240 at low chroma, fading into the paper like light on a night horizon. Fixed-attached, no animation. Cold light only; never a warm bloom.

5. **Layered dark surfaces + faint hairlines** - build depth with `paper` / `paper-2` / `paper-3`, separated by 1px `--color-rule: oklch(33% 0.024 245)` (or `rule-2` `oklch(48% 0.020 240)` for a brighter edge). Cards float on the elevated layers; hairlines draw the seams. No drop-shadow theatre.

6. **Wide-tracked mono eyebrows** - `--font-label` (Geist Mono), UPPERCASE, `--tracking-label: 0.16em`. The cold machine-readout voice under the thin Geist display. Meta, status, kbd hints all take it.

7. **Generous nocturnal void** - `--section-gap: 6rem`, `--measure: 60ch`, centred or near-centred hero (genre gate 6 loosened). The dark and the space do the work; let the type breathe.

8. **Instrument Serif for one roman moment** - `--font-serif` is available for a single large numeral or a pulled line, **roman only, never italic** (a top AI tell, banned in headers). Never the running display; Geist thin owns that.

## Motion

Fade only, composed and slow. Section reveals fade + rise once. Hover: an azure underline-grow on links, a 1px border shift to `--color-accent` on focusable surfaces. No slide, no bounce, no parallax, no autoplay - the atmosphere carries it. Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static and fully visible.

## Anti-patterns

- **No warm accent** (amber, orange, terracotta, gold) - that is Bloom and Lumen-Night. Midnight is azure hue 220.
- **No pure black canvas** - the ground is blue-tinted `15% 0.022 250`, never `#000` / `#111`.
- **No heavy display weight** - stay at 300; Geist 600 is Bloom's face, not Midnight's.
- **No serif display, no italics anywhere** - Geist thin is the display; Instrument Serif is a roman accent only.
- **No light-paper sections** - Midnight is dark throughout; do not sneak a white band in (genre rule).
- **No warm-and-cool bloom juggling** - one cool glow, single hue family. No second warm light.
- **No glassmorphism, no gradient text** (universal gates), no aurora-of-many-hues; one azure light on a blue-dark ground.

## Macrostructure affinity

**Midnight loves:** Marquee Hero (one confident thin-type hero on the dark canvas) · Manifesto (the cold canvas argues a statement) · Stat-Led (azure numerics glowing on blue-dark) · Photographic (the dark ground frames moody visuals) · Feature-stack (stacked capabilities on layered dark surfaces).

**Midnight refuses:** Long Document (prose wants light editorial paper) · Letter (too warm and intimate) · Catalogue (too busy and commercial for the calm dark) · Conversational FAQ (too casual for the cool register).

## Voice fixtures

Cool, nocturnal, spare, a touch cerebral. Name the thing plainly.

- *"Made for the small hours."*
- *"Render the night in a single pass."*
- *"A quiet instrument for loud ideas."*
- *"Ship between midnight and dawn."*
- *"Cool, exact, awake."*

Never any of: *warm, cozy, golden, firelit, seamless, cutting-edge, revolutionary, supercharge, unlock*. Never italics. Never "click here"; name the command or the number.

## How Midnight differs from neighbouring themes

| vs | what settles it instantly |
|---|---|
| **Cobalt** (cool-blue neighbour) | Cobalt is a **light** engineered canvas, Space Grotesk, a literal code/API hero, hue 256. Midnight is a **dark** blue canvas, thin Geist 300, diffuse cool glow, hue 220. Light vs dark, code-hero vs atmosphere. |
| **Lumen** (atmospheric sibling) | Lumen is **warm** amber-gold (or light indigo), Instrument Serif *display*, one *built* light artefact. Midnight is **cool** azure, Geist thin display, a soft diffuse glow. Warm-serif-apparatus vs cool-thin-sans atmosphere. |
| **Aurora** (dark cool sibling) | Aurora blooms cyan and runs a **Sentient serif body**. Midnight is all-Geist (sans throughout), more restrained, one azure *signal* rather than a blooming cyan field. Serif-body-blooms vs all-sans-restraint. |

## Test brief expectations

Midnight is a candidate when the brief mentions:

- *AI tool · generative · model playground · render · pipeline · observability · dark mode · nocturnal · late-night · after-hours · moody · cinematic · cool · cerebral · midnight · azure · calm-technical*
- Product categories: *AI creative tool · generative model UI · dev tool with a moody register · data / observability console · cool nocturnal SaaS*
- Emotional tone: *cool · calm · nocturnal · spacious · cerebral · quiet-confident · cold-clarity*

Warm / consumer / editorial / image-led-light briefs route elsewhere (Bloom or Lumen-Night for warm atmospheric, Cobalt for a light code tool). When the brief wants dark **and cold**, it is Midnight.

## Build hint

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-body); font-weight: 400; }

/* One fixed cool glow - the whole canvas treatment */
body::before { content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background: radial-gradient(60% 45% at 50% 82%,
              oklch(30% 0.06 230 / 0.55), transparent 70%); }

/* Thin airy display + wide-tracked mono eyebrow */
.display { font-family: var(--font-display); font-weight: var(--display-weight);
           letter-spacing: var(--tracking-display); font-size: var(--text-display); }
.eyebrow { font-family: var(--font-label); text-transform: uppercase;
           letter-spacing: var(--tracking-label); color: var(--color-accent); }

/* The one azure signal */
.btn--primary { background: var(--color-accent); color: var(--color-paper);
                border-radius: 8px; }
a:hover { color: var(--color-accent); }

/* Reveal - fade only */
.reveal { opacity: 0; transform: translateY(10px);
          transition: opacity .6s ease, transform .6s ease; }
.reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

Plus the Geist + Geist Mono + Instrument Serif link and the small reveal script.
