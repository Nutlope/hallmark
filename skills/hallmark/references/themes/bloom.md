# Theme - Bloom

The **light-paper** atmospheric theme: a generative AI-creative tool (music, video, image, voice) rendered in **warm daylight** instead of the usual nocturnal dark. A calm warm off-white ground (`oklch(97% 0.010 72)`), a soft terracotta bloom that reads like dawn light through a studio window, Geist geometric-sans display, Instrument Serif as a warm counterpoint, Geist Mono machine labels. It reads like a sunlit studio: inviting, expressive, made-not-manufactured. The daytime, optimistic face of the genre - Suno / Runway warmth pulled into the light.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `bloom`. Tokens: [`site/css/tokens.css`](../../../../site/css/tokens.css) `[data-theme="bloom"]`. No canonical build yet - mirror the atmospheric genre defaults.

## Axes (diversification)

- **Paper band** - light warm off-white (`L 97%`, hue 72, very low chroma `0.010`). `oklch(97% 0.010 72)`. The documented light-paper exception in a mostly-dark genre; distinct from every dark atmospheric ground and from Cobalt's cool near-white.
- **Display style** - **geometric-sans** (Geist `600`, `--tracking-display: -0.022em`, roman). Plain-English and confident. Distinct from serif themes and from Cobalt's grotesk.
- **Accent hue** - **restrained terracotta-coral** (`oklch(56% 0.13 35)`) with a soft warm companion (`oklch(64% 0.09 55)`) used only in the bloom tint. Warm ~35 deg; sits clear of Lumen's brass (~50) and any cool blue.

## Reference register

Suno . Udio . Runway . Luma . Pika . Krea . Ideogram . Playground . Kittl . consumer-facing generative-creative studios. The aesthetic: a warm, sunlit creative canvas where the generated output is the hero, plain-English expressive display, one warm accent on small surfaces. **Never name any of these in the output.**

**Patron-saint reference (internal):** *dawn light falling across a fresh studio canvas* - the atmospheric bloom recoloured from midnight to morning. When in doubt ask "does this feel like a studio at 9am, or a nightclub at midnight?" Keep the former.

## Required dependencies

1. **Fonts** - **Geist** (display + body, `400/500/600`), **Instrument Serif** (roman counterpoint only), **Geist Mono** (labels + meta). Google Fonts:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&family=Instrument+Serif&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />
   ```
2. **A small reveal script** - one `IntersectionObserver` adding `.is-in` (fade only, optional <=8px rise, reveal-once/unobserve). Reduced-motion ships static + fully visible.
3. **Optional one-shot type-in** of a single prompt line in the hero demo, then static. No looping.

## Signature moves

1. **Warm bloom on warm light paper** - the name move. Paper is `--color-paper` `oklch(97% 0.010 72)`, never `#fff`. One or two **fixed, un-animated** radial blooms sit behind the content: `--color-accent` (terracotta 35 deg) at ~8-10% alpha and `--color-accent-2` (55 deg) at ~6-8%, each ~25-40% footprint. It reads like sunlight on paper - Bloom **emits warm light from a light ground**, the genre's documented light-paper exception.

2. **Geist geometric-sans display, plain and confident** - `--font-display` at `--display-weight: 600`, `--tracking-display: -0.022em`, `--lh-tight: 1.06`, sized to `--text-display` (clamp to `5.75rem`). Roman, never italic. Expressive plain-English headline. A **near-centred hero is allowed** here (genre loosens the left-bias gate); the bloom frames the type.

3. **Warm near-black ink, never `#000`** - `--color-ink` `oklch(20% 0.022 40)` for headlines, `--color-ink-2` `oklch(30% 0.022 46)` for body, `--color-muted` `oklch(50% 0.018 58)` for meta. Every neutral carries a warm cast (hue 40-72). The whole page is warm-tinted, top to bottom.

4. **Instrument Serif as a warm counterpoint (roman only)** - `--font-serif` appears as **one** serif gesture: a lede sentence, a pull-quote, or a large numeral. Roman always, never in the H1, never italic in any heading. This dual voice (geometric sans + one serif line) separates Bloom from all-Geist dark siblings without turning editorial.

5. **Geist Mono machine-readout labels** - `--font-label` UPPERCASE, `--tracking-label: 0.12em`, for eyebrows, tags, model names, prompt chips, meta. The dry technical voice set against the warm expressive display.

6. **Pill CTA with a warm terracotta glow** - genre allows accent-fill pills. The one primary button fills `--color-accent` `oklch(56% 0.13 35)` with `--color-accent-ink` `oklch(98% 0.010 72)` text; hover adds a soft warm glow shadow (accent at low alpha) - the atmospheric lift. Accent stays a **signal** (< ~8% of any viewport); it is "used sparingly" per the token.

7. **Elevated warm surfaces, not hairlines** - atmospheric depth. Cards use `--color-paper-2` / `--color-paper-3` over a soft warm shadow with a `--color-rule` hairline; on hover they lift toward the reader with a warm glow. Depth comes from warm elevation, never from cool blur or glass.

8. **The generated output is the specimen** - the focal artefact is a hand-built CSS/SVG output card sitting in the bloom: a warm-lit prompt bar, a generated frame strip, a waveform, an image tile. It names the tool's verb (make, hum, compose, render) and shows the result, warmly lit - not a stock photo, not a glowing orb.

## Motion

Fade-in only; the atmosphere does the work. Section reveals fade (optional <=8px rise), reveal-once. The bloom is **static and fixed** - never animated, never a drifting blob. Hover adds a warm glow on the CTA and a lift on cards. Optional one-shot prompt type-in, then static. No slide, no bounce, no parallax, no autoplay. Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static and fully visible.

## Anti-patterns

- **No dark canvas.** Bloom is the light-paper atmospheric theme; a dark ground is Midnight / Terminal / Lumen-Night territory. Paper stays `L 97%`.
- **No cool paper or cool accent.** Warm hue (40-72 neutrals, ~35 accent) throughout; a cool grey or blue reads as Cobalt / Midnight.
- **No `#fff` / `#000`.** Warm off-white paper, warm near-black ink.
- **No italic headers, no italic Instrument Serif in the H1** (global rule). The serif counterpoint is roman.
- **No accent flood.** Terracotta lives on the CTA, the bloom, and small tags (< ~8% of viewport); a large orange field collides with Lumen brass / Coral coral and reads as a warning colour.
- **No glassmorphism, no gradient text** (universal gates). Warm elevation, not glass.
- **No hard-edged or moving bloom.** Soft, low-opacity, static, fixed; a drifting aurora blob is Aurora's move and breaks the calm.
- **No instrument-panel restraint.** Bloom is expressive and warm, not Cobalt's cool hairline dashboard.

## Macrostructure affinity / rejection

**Bloom loves:** Marquee Hero (one confident generative demo in the bloom - the atmospheric default) . Manifesto (a warm creative-tool page argues a worldview) . Photographic / portfolio-grid (a gallery of generated output, warmly lit) . feature-stack (make -> refine -> share workflow) . Stat-Led (only when there are honest numbers).

**Bloom refuses:** Workbench / component-playground (too mechanical - that is Cobalt / Lumen) . Long Document (prose-led; route editorial / Garden) . Letter (too intimate for a tool) . Catalogue (commerce grid; Bloom breathes).

## Voice fixtures

Warm, daylight, expressive, specific. Name the verb, name the output.

- *"Hum it. We'll finish the song."*
- *"From a sentence to a scene, before your coffee's cold."*
- *"Make something today you couldn't yesterday."*
- *"Describe the light. We'll paint it."*
- *"A studio that opens when you do."*

Never any of: *seamless, revolutionary, unleash, unlock, supercharge, cutting-edge, next-generation, game-changing, AI-powered* (as a badge). Say the verb (make, hum, describe), say the output (song, scene, image).

## How Bloom differs from neighbouring themes

| vs | what settles it instantly |
|---|---|
| **Midnight** (atmospheric, same Geist) | Midnight is a **dark** cool canvas (hue ~250), nocturnal and cool. Bloom is **light** warm off-white (hue 72) with a warm terracotta bloom. Light vs dark plus warm vs cool settles it at a glance. |
| **Coral** (modern-minimal, same warm + Geist + light) | Coral is warm-grey paper, hairline structure, a quiet SaaS product page, no bloom. Bloom is warm-cream with a warm radial bloom, expressive AI-creative display, and elevated surfaces. The bloom + expressive register is the tell. |
| **Garden** (editorial, same warm-light paper) | Garden is oat-cream with a roman-serif Young Serif display, green ink, and a hand-built botanical specimen. Bloom keeps warm-neutral ink, a Geist geometric display, and a light bloom canvas. Different ink, different focal treatment (botanical object vs warm light). |

## Test brief expectations

Candidate when the brief mentions: *generative . AI creative . music . song . video . image . voice . art . make . create . compose . render . imagine . prompt . studio . playground . expressive . warm . daylight . inviting . consumer creative*.
Product categories: *generative music / video / image / voice tool . creative AI app . consumer model playground . AI art studio.*
Emotional tone: *warm . inviting . optimistic . expressive . daylight-creative . human . playful-but-refined.*
Briefs that are dark / nocturnal (Midnight, Lumen), technical / instrument (Cobalt), or editorial / photographic-with-real-photos route elsewhere.

## Build hint

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-body); font-weight: 400; }

/* The bloom - two warm radials on warm paper, static + fixed */
body::before {
  content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background:
    radial-gradient(42% 38% at 72% 16%, oklch(56% 0.13 35 / 0.10), transparent 70%),
    radial-gradient(46% 40% at 18% 90%, oklch(64% 0.09 55 / 0.07), transparent 72%); }

/* Geist display - geometric, roman, sized big */
.hero__title, .section__title {
  font-family: var(--font-display); font-weight: var(--display-weight);
  letter-spacing: var(--tracking-display); line-height: var(--lh-tight);
  color: var(--color-ink); }

/* Instrument Serif - warm roman counterpoint, never the H1 */
.lede--serif { font-family: var(--font-serif); font-style: normal;
  color: var(--color-ink-2); }

/* Geist Mono machine-readout labels */
.eyebrow, .tag { font-family: var(--font-label); text-transform: uppercase;
  letter-spacing: var(--tracking-label); color: var(--color-muted); }

/* One pill CTA, warm terracotta glow on hover */
.btn--solid { background: var(--color-accent); color: var(--color-accent-ink);
  border-radius: 999px; }
.btn--solid:hover { box-shadow: 0 8px 30px oklch(56% 0.13 35 / 0.28); }

/* Reveal - fade only; the atmosphere does the work */
.reveal { opacity: 0; transition: opacity .6s ease; }
.reveal.is-in { opacity: 1; }
@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transition: none; } }
```

Plus the Geist + Instrument Serif + Geist Mono link and the small reveal script.
