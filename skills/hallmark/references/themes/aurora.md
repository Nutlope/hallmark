# Theme - Aurora

Atmospheric, after-dark register. The page for a **dev tool, an AI or generative product, a model playground, a rendering pipeline you open at night** - but rendered in **cold blue-green light, not the genre's warm firelight**. A near-black cyan-tilted canvas (`oklch(11% 0.025 200)`), cool near-white ink, one teal-green signal, and - the identity move - **two overlapping cool blooms curtaining the ground like the northern lights**. Weighty Sora display for confidence; a **Sentient serif body** to keep the cold canvas from reading clinical. It should feel like the moment after a deploy goes green.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `aurora`. Tokens: [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="aurora"]`. No canonical build yet; mirror the moves below.

> **Why the bloom, not the glow.** Midnight is the cluster's one *diffuse azure glow*; Aurora is the one *paired bloom curtain*. The genre licenses up to two blooms - Aurora is the theme that spends the whole budget: cyan + teal-green, overlapping, so the ground reads as an aurora, not a single light. That two-hue cold curtain plus a serif body is the differentiator, not a recolour.

## Axes (diversification)

- **Paper band** - **near-black, cyan-tilted** (`oklch(11% 0.025 200)`). The *deepest* ground in the cluster (Midnight 15%, Lumen Night 13%). Elevation climbs to `paper-2` `oklch(15% 0.028 200)` and `paper-3` `oklch(18% 0.030 200)`. The 0.025 chroma at hue 200 is load-bearing: cold blue-green, never `#000`.
- **Display style** - **geometric-sans, weighty** (Sora `--display-weight: 600`, tracking `-0.035em`, up to `5.75rem`). Confident and heavy - the opposite of Midnight's airy thin 300.
- **Accent hue** - **teal-green** (`oklch(68% 0.145 172)`) with a **cyan** secondary (`oklch(72% 0.170 200)`). Both cold; hue 172 sits ~78deg green of Midnight's azure 250. Teal-green is the UI signal; cyan lives in the first bloom.

## Reference register

Linear (dark) · Vercel after-dark · Raycast · Resend dark · Railway · Supabase dark · Planetscale · northern-lights dev landings.

The aesthetic: the cool-dark product page where the canvas glows blue-green behind confident sans display, one teal-green signal, serif reading voice. Hand-built, moody, cold but not clinical.

**Patron-saint reference (internal):** *Linear's dark restraint* + *the northern lights over a cold coast* + *the calm right after a green deploy*. Ask "does this feel like blue-green light on a night sky, or a warm-lit room?" Keep the former. Never name any of these in the output.

## Required dependencies

1. **Fonts** - **Sora** (display 600, plus 400), **Sentient** (body + serif accent, 400/500, Fontshare), **Geist Mono** (labels):
   ```html
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
   <link href="https://api.fontshare.com/v2/css?f[]=sentient@400,500&display=swap" rel="stylesheet" />
   ```
2. **A reveal script** - one `IntersectionObserver` adding `.is-in` (fade + ~10px rise, ease-out ~600ms). Fade is the whole motion budget; the blooms are static.

## Signature moves

1. **Two cool blooms - the aurora itself.** Fixed-attached radial gradients: **cyan** (`--color-accent-2`, hue 200) top-right + **teal-green** (`--color-accent`, hue 172) bottom-left, each ~25-30% footprint, low chroma, overlapping toward the centre so the ground curtains. No animation. This paired cold curtain is the theme; one lonely glow is Midnight, not Aurora.
2. **Deepest near-black cyan ground, never black** - `--color-paper: oklch(11% 0.025 200)`. Ink is cool near-white `--color-ink: oklch(96% 0.010 200)`; body sits at `--color-ink-2: oklch(82% 0.012 200)`. The cyan tilt runs through every neutral.
3. **Sentient serif body - the cluster's one serif reading voice.** `--font-body`/`--font-serif` = Sentient (soft-contrast variable serif) for lede and running text. It warms the cold canvas; Midnight and Terminal are all-sans, so the serif is instantly Aurora. **Roman only** (italic in headers is a global AI tell, banned).
4. **Weighty Sora display** - `--display-weight: 600`, `--tracking-display: -0.035em`, `--text-display: clamp(3rem, 6vw + 1rem, 5.75rem)`. Heavy sans confidence against the serif body. Never the thin 300 that owns Midnight.
5. **One teal-green signal, used sparingly** (< 5% of any viewport) - `--color-accent: oklch(68% 0.145 172)` on the eyebrow tick, a link hover, the one primary button, focus rings, a status chip, an active nav item. Buttons fill teal-green with `--color-accent-ink` (= paper) text. Everything else is ink-on-dark. Cyan stays in the bloom, never a second UI flood.
6. **Elevated dark surfaces + faint hairlines.** Cards ride `paper-2`/`paper-3`, seamed by 1px `--color-rule: oklch(28% 0.022 200)` (or `rule-2` for a brighter edge). Genre glow-lift on hover (soft cyan shadow, `translateY(-4px)`) - no drop-shadow theatre.
7. **Wide-tracked mono eyebrows** - `--font-label` (Geist Mono), UPPERCASE, `--tracking-label: 0.10em`. The machine-readout voice between the heavy Geist display and the calm Sentient prose.
8. **Centred, breathing hero** - genre gate 6 loosened; `--section-gap: 6.5rem`. The bloom field frames the type; let the void carry it.

## Motion

Fade only, composed and slow. Section reveals fade + rise once. Hover: teal-green underline-grow on links, a 1px border shift to `--color-accent` and a soft teal glow-lift on cards. No slide, no bounce, no parallax, no autoplay - the blooms are fixed and never animate. Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static and fully visible.

## Anti-patterns

- **No warm accent** (amber, orange, terracotta, gold) - that is Bloom and Lumen-Night. Aurora is teal-green + cyan, hue 172/200.
- **No single azure glow at hue 250** - that is Midnight. Aurora is *two* blooms and greener (hue 200).
- **No all-sans body** - the body is Sentient serif; never set running text to the display sans. The serif is the theme's warmth.
- **No thin display** - Sora 600, not Midnight's thin Geist 300.
- **No pure black / `#111`** - the ground is cyan-tilted `11% 0.025 200`.
- **No italic anywhere, no gradient text, no glassmorphism** (global gates). Sentient runs roman.
- **No built apparatus or leader-line diagram** - that focal grammar is Lumen. Aurora's canvas treatment is ambient blooms, not a machined object.
- **No rainbow aurora** - the curtain is two cold hues (cyan + teal-green) only, never a full spectrum.

## Macrostructure affinity / rejection

**Aurora loves:** Marquee Hero (one heavy Sora hero over the bloom field, canonical) · Manifesto (the cold canvas argues a statement) · Stat-Led (cyan numerics glowing on near-black) · Feature-stack (capabilities on layered dark surfaces) · Quote-Led (the Sentient serif carries a pulled line).

**Aurora refuses:** Bento Grid (tile collage fights the diffuse curtain) · Catalogue (too commercial and busy for the calm dark) · Workbench (clinical, tool-first - route Cobalt) · Conversational FAQ (too casual for the after-dark register).

## Voice fixtures

Cool, after-dark, dev-fluent, warmed by the serif. Name the thing plainly.

- *"Ship after dark."*
- *"The moment after the deploy goes green."*
- *"Cool by default. Warm where it reads."*
- *"Built for the late shift."*
- *"Green across the board, coast to coast."*

Never any of: *seamless, cutting-edge, revolutionary, supercharge, unlock, leverage, synergy, robust*. Never italics. Never "click here"; name the command or the number.

## How Aurora differs from neighbouring themes

| vs | what settles it instantly |
|---|---|
| **Midnight** (cool-dark sibling) | Midnight is one diffuse azure glow (hue 250), all-Geist sans, thin 300, restrained. Aurora is **two** blooms (teal-green 172 + cyan 200), a **Sentient serif body**, a heavy **Sora** 600 display, and a teal-green signal. Paired-cold-curtain-with-serif vs single-glow-all-sans. |
| **Lumen** (atmospheric) | Lumen is warm brass-on-violet with a *built apparatus* + Instrument Serif *display* + blueprint grid. Aurora is cool *ambient blooms* + Sora display + Sentient body. Machined-artefact vs atmospheric-curtain; warm vs cold. |
| **Bloom** (atmospheric, canonical light) | Bloom is warm cream light paper, expressive consumer copy. Aurora is near-black cyan dark, dev-after-dark copy. Warm-light vs cold-dark settles it at a glance. |

## Test brief expectations

Aurora is a candidate when the brief mentions:

- *dev tool · AI tool · generative · model playground · render · pipeline · observability · deploy · ship · dark mode · after-hours · late-night · nocturnal · moody · cool · aurora · northern lights · blue-green · cold-clarity*
- Product categories: *AI creative tool · generative model UI · dev tool with a moody register · data / observability console · cool nocturnal SaaS*
- Emotional tone: *cool · after-dark · atmospheric · calm-confident · cold-but-not-clinical · post-deploy*

Warm / consumer / editorial / light briefs route elsewhere (Bloom or Lumen-Night for warm atmospheric, Cobalt for a light code tool). When the brief wants dark, cold, and a glowing canvas, it is Aurora.

## Build hint

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-body); font-weight: 400; }

/* The two cool blooms - the whole canvas treatment, fixed and static */
body::before { content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(38% 32% at 82% 12%, oklch(72% 0.17 200 / 0.20), transparent 70%),
    radial-gradient(40% 34% at 12% 92%, oklch(68% 0.145 172 / 0.16), transparent 72%); }

/* Weighty Sora display + wide-tracked mono eyebrow */
.display { font-family: var(--font-display); font-weight: var(--display-weight);
           letter-spacing: var(--tracking-display); font-size: var(--text-display); }
.eyebrow { font-family: var(--font-label); text-transform: uppercase;
           letter-spacing: var(--tracking-label); color: var(--color-accent); }

/* The one teal-green signal */
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink);
                border-radius: 999px; }
a:hover { color: var(--color-accent); }

/* Reveal - fade only */
.reveal { opacity: 0; transform: translateY(10px);
          transition: opacity .6s ease, transform .6s ease; }
.reveal.is-in { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

Plus the Geist + Geist Mono + Sentient link and the small reveal script.
