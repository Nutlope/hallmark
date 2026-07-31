# Imagery kit - the composition playbook (and, later, hosted assets)

The kit is two things: the composition playbook below (the category vocabulary and the layered, off-centre, blend-mode patterns that make abstract imagery read intentional) and a REAL set of hosted assets at `https://www.usehallmark.com/imagery/<category>/<file>`, listed in the manifest section and served from the deployed site (`site/imagery/` in the repo).

**The hard rule: never emit a URL that is not listed in the manifest below.** Anything not listed is CONSTRUCTED in-page instead: washes and blobs via craft tier-a CSS or tier-b SVG (see [`custom-craft.md`](custom-craft.md)), textures via CSS gradients, generated stills via tier-e only when the user opted in and `TOGETHER_API_KEY` is set (`scripts/imagegen.mjs`). A URL that 404s in the shipped page is worse than no image; the constructed fallback stays in reach for every listed asset too.

**Why this exists.** The v0.9.0 watercolor sprinkle was generated per-emit and was inconsistent. The kit recovers that aesthetic but as discrete, swappable, deliberately-composed assets. Compose with them like a senior frontend engineer: layered transparent PNG behind text, biased off-centre, intentionally large, mix-blend-mode where it earns its place. Not "abstract gradient on top of headline" — that's the AI default.

---

## Categories

| Category | What | Format | Example uses |
| --- | --- | --- | --- |
| **avatar** | Photoreal placeholder portraits, unisex-ambiguous, varied ages and skin tones, neutral studio grounds. Generated (FLUX), provenance sidecars committed. | JPG | Testimonial/byline/team slots. ALWAYS paired with its numbered unisex name (table below); placeholder people, never claims. |
| **mark** | Geometric logo placeholders in four families (orbit, stack, field, stroke), `currentColor`. | SVG | Logo walls, nav wordmark compositions. INLINE the SVG (an `<img>` cannot inherit currentColor). |
| **watercolor** | Full-bleed soft-edge painterly fields on white paper. Warm + cool. | JPG | Section background accent; hero-half flood; behind-quote wash; composites with `mix-blend-mode: multiply`. |
| **transparent** | Brushstroke / blob gestures on PURE WHITE ground - no faked alpha. Composite with `img { mix-blend-mode: multiply; }` over light papers (the white vanishes); skip the category on dark themes; true alpha = hand-built tier-b SVG. | JPG | Layered hero composition (large, off-centre, behind text). The masterclass move. |
| **texture** | Tile-able paper grain, riso dot, cross-hatch, weave; `currentColor` where sensible. | SVG | Body grain via `mix-blend-mode: multiply`; section-divider banding. Budgets in [`texture.md`](texture.md). |
| **screens** | App-screenshot frames built on Hallmark tokens (sources committed beside outputs; re-render is one Chrome command). | PNG | h8/f5 screenshot slots; phone-figure slots. |
| **ornament** | Small stamps, plates, numerals, flourishes. | SVG | Beside a quote; the section-label gutter; a letter close. (Hand-built per page until listed.) |
| **silhouette** | Abstract product shapes for empty slots. | SVG | Hand-built tier-b per page until listed. |

**Naming:** `<category>-<palette-family>-<variant>.<ext>` — e.g. `watercolor-warm-01.webp`, `transparent-brush-cool-03.png`, `ornament-stamp-01.svg`, `texture-grain-paper-02.webp`. Palette families: `warm` · `cool` · `neutral` · `chromatic`.

---

## Manifest (the allowlist - only what is listed here may be referenced by URL)

Assets live in the repo at `site/imagery/<category>/` and serve at `https://www.usehallmark.com/imagery/<category>/<file>` once the site deploys. Picking logic: match the active theme's palette family + the brief's tone, reference the listed URL, keep the constructed fallback in reach. Provenance: `gen:flux-1.1-pro` files carry a committed `.json` sidecar (model, prompt, date); pages embedding kit imagery append `imagery: <file> · <provenance>` to their Hallmark stamp.

```
avatar-01.jpg .. avatar-16.jpg    768x768    studio portraits, varied age/skin/hair, neutral grounds    testimonial/byline avatars; pair with name NN    gen:flux-1.1-pro
watercolor-warm-01.jpg   1440x800   sienna/ochre wash pooling lower-left on white     section wash, warm palettes    gen:flux-1.1-pro
watercolor-warm-02.jpg   1440x800   terracotta/apricot wash upper-right               section wash, warm palettes    gen:flux-1.1-pro
watercolor-cool-01.jpg   1440x800   prussian/grey wash lower-right                    section wash, cool palettes    gen:flux-1.1-pro
watercolor-cool-02.jpg   1440x800   viridian/slate wash from the left edge            section wash, cool palettes    gen:flux-1.1-pro
transparent-brush-warm-01.jpg   1216x1216   sienna diagonal brushstroke on white; multiply   layered hero art, light papers   gen:flux-1.1-pro
transparent-brush-warm-02.jpg   1216x1216   ochre torn-edge blob on white; multiply          layered hero art, light papers   gen:flux-1.1-pro
transparent-brush-cool-01.jpg   1216x1216   prussian brushstroke on white; multiply          layered hero art, light papers   gen:flux-1.1-pro
transparent-brush-cool-02.jpg   1216x1216   slate-teal blob on white; multiply               layered hero art, light papers   gen:flux-1.1-pro
texture-grain-paper-01.svg   512x512   feTurbulence paper grain, opacity baked 0.15   body grain via multiply       hand-built
texture-riso-dot-01.svg      24x24     offset riso dot lattice, currentColor          section banding                hand-built
texture-crosshatch-01.svg    16x16     45/135deg hatch, currentColor                  panel texture                  hand-built
texture-weave-01.svg         20x20     over-under weave bars, currentColor            divider banding                hand-built
mark-orbit-01..03.svg   32x32   circle grammar (ring+satellite, vesica, wedge)   logo wall / wordmark marks   hand-built
mark-stack-01..03.svg   32x32   bar grammar (steps, bar+counter, offset slab)    logo wall / wordmark marks   hand-built
mark-field-01..03.svg   32x32   grid grammar (displaced dot, diagonal run, rotated square)   logo wall / wordmark marks   hand-built
mark-stroke-01..03.svg  32x32   line grammar (chevrons, arc over baseline, oblique strokes)  logo wall / wordmark marks   hand-built
screens/screen-dashboard-01.png    1280x800   analytics dashboard on Hallmark tokens   h8/f5 screenshot slots   hand-built
screens/screen-settings-01.png     1280x800   settings page on Hallmark tokens         h8/f5 screenshot slots   hand-built
screens/screen-feed-mobile-01.png  390x844    mobile card feed (uses kit avatars)      phone-figure slots       hand-built
```

**Avatar-name pairing (deterministic; use avatar+name together or neither):** 01 Alex Morgan · 02 Sam Idowu · 03 Jordan Reyes · 04 Riley Chen · 05 Casey Okafor · 06 Rowan Diaz · 07 Quinn Haddad · 08 Devon Park · 09 Marlowe Nguyen · 10 Sage Ellison · 11 Kit Fernandes · 12 Noor Rahim · 13 Ari Solberg · 14 Jules Baptiste · 15 Remy Kowalski · 16 Toni Vega. These are placeholder humans, not claims: the assets.md TODO-replace comment applies, and gate 19's name rules are satisfied by the pairing.

**Wordmark placeholders are a composition, not files** (SVG text inside an `<img>` cannot inherit page fonts): inline a mark SVG beside the brand name set in the page's display token:

```html
<a class="wordmark"><svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor" aria-hidden="true"><!-- mark-orbit-01 paths --></svg> Meridian</a>
```

---

## Usage patterns — how a senior engineer would compose these

(The `…/imagery/` paths in the examples below resolve against the manifest. For categories still unlisted (ornament, silhouette), swap in the constructed equivalent: inline tier-b SVG, gradient washes, CSS grain.)

### Layered hero composition (the masterclass move)

A transparent abstract object behind hero text. The image is bigger than you think it should be — that's what makes it feel intentional, not decorative.

```css
.hero { position: relative; isolation: isolate; }

.hero__art {
  position: absolute;
  top: 50%;
  right: -10%;
  transform: translateY(-50%);
  width: clamp(60%, 80vh, 1400px);
  height: auto;
  z-index: 0;
  pointer-events: none;
  /* Optional warmth: */
  mix-blend-mode: multiply;
  opacity: 0.85;
}

.hero__art--bias-left  { right: auto; left: -10%; }

.hero > * { position: relative; z-index: 1; }
```

Bias to one side (left or right, never centred). The text sits at `z-index: 1`, the art at `z-index: 0`. Test mobile: art may need to scale down or shift to avoid the headline at 320 px.

### Section background wash

A painterly field as a full-bleed section accent. One section per page, never global. While the manifest is empty the wash is CONSTRUCTED (layered radial gradients at low alpha read painterly; a manifest asset would slot into the same `background` line later):

```css
.section--wash { position: relative; isolation: isolate; }
.section--wash::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 48% at 22% 30%, oklch(from var(--color-accent) l c h / 0.14), transparent 70%),
    radial-gradient(50% 42% at 78% 72%, oklch(from var(--color-accent) calc(l + 0.08) calc(c * 0.6) h / 0.10), transparent 72%);
  z-index: -1;
  pointer-events: none;
}
```

### Decoration

Inline ornament beside a quote or in the section-label gutter. Small. No border, no shadow, no animation.

```html
<p class="section-label">
  <span class="num">02</span>
  <img class="section-label__ornament" src="…/imagery/ornament/ornament-stamp-01.svg" alt="" aria-hidden="true" />
  <span>Examples</span>
</p>
```

```css
.section-label__ornament { width: 1.5em; height: auto; vertical-align: middle; }
```

### Texture overlay

Grain over a solid colour. Always opacity-capped at `0.15`.

```css
.texture-grain {
  background-image: url("…/imagery/texture/texture-grain-paper-01.webp"), var(--paper-fill);
  background-size: 256px 256px, cover;
  background-blend-mode: multiply;
  opacity: 1; /* the grain texture is at 0.15 in the source asset */
}
```

### Empty state

Generic silhouette in unfilled data slots, greyscale-tinted, with a "Replace with real photo" hint visible to the developer (HTML comment).

```html
<!-- TODO: Replace with real product photo, target size: 600×900 -->
<picture class="product-card__photo product-card__photo--empty">
  <img src="…/imagery/silhouette/silhouette-bottle-01.png" alt="Hand-poured ceramic vessel, studio lighting" />
</picture>
```

---

## Anti-patterns

- **Don't use kit imagery as the literal subject.** An abstract bottle is *not* a stand-in for an actual coffee-shop hero — those need photographic placeholders (Picsum / Unsplash). The kit is for atmosphere / composition / decoration, not subject replacement.
- **Don't layer 3+ kit pieces on one page.** Restraint. One transparent object in the hero + one wash in a later section is the cap.
- **Don't apply the same watercolor wash to multiple sections.** It's a section accent, not a global treatment.
- **Don't use kit imagery in modern-minimal genre** (Stripe / Linear / ElevenLabs school). That genre's whole point is the absence of decorative imagery.
- **Don't centre the layered hero art.** Centred behind text is the AI-default move. Bias to one side, off-axis.
- **Don't use mix-blend-mode without testing on the active paper.** `multiply` over a dark canvas inverts; `screen` over light paper washes out. Eyeball the result per theme.

---

## Generation pipeline (out-of-band, one-time)

The kit is generated once per palette family, post-processed, and committed to the marketing site's public folder:

```
site/public/imagery/
  ├── watercolor/        ~6 files × 4 palette families = 24 WebPs
  ├── transparent/       ~6 files × 4 palette families = 24 PNGs
  ├── ornament/          ~8 SVGs (palette-agnostic, use currentColor)
  ├── texture/           ~6 tile-able WebPs
  ├── silhouette/        ~6 PNGs (palette-agnostic, transparent)
  └── pattern/           ~6 tile-able WebPs
```

**Tooling.** Nanobanana 2 / Recraft V4 with reference images. Prompt seed-list per category lives at the top of each file's directory in a `prompts.md` (one-line prompts, results pinned by seed for reproducibility).

**Post-processing.** Trim, transparent-background where applicable, colour-balance against Hallmark's OKLCH palette tokens, save as WebP for size + PNG where alpha matters. Ornaments as inline SVG so they inherit `currentColor`.

**Total target weight.** ≤ 5 MB across all categories. Each individual file ≤ 200 KB. Lossy WebP at q=80 unless the image needs lossless (ornaments → SVG; transparents → PNG with `pngquant`).

**Re-generation.** Treat the kit as a refreshable batch, not a one-off. When the palette catalogue changes (new theme, new accent hue), re-generate the relevant palette family. Manifest above is the spec; assets are the deliverable.
