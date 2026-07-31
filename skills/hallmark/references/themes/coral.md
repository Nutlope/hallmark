# Theme - Coral

Modern-minimal, warm SaaS register. The page for a **SaaS product, a platform, a billing or payments tool, a B2B dashboard, a startup landing** done in warmth, not cool steel. A warm-grey ground (never pure white), warm charcoal ink (never black), exactly ONE warm coral signal, General Sans for everything, and soft pills. The confident-but-human school: calm, generous, typographic. It reads like a product that is easy to trust.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `coral`. Tokens: `site/css/tokens.css` `[data-theme="coral"]`. Coral is the canonical modern-minimal theme; the rotation walks Coral (warm) to Cobalt (cool).

## Axes (diversification)

- **Paper band** - warm light (`oklch(96.5% 0.005 50)`, hue 50, very low chroma). A warm near-white grey, not Cobalt's cool-white and not Garden's oat-cream.
- **Display style** - grotesk-sans (General Sans 600, `-0.025em` tracking). Single-family, distinct from Cobalt's Space Grotesk and from every serif.
- **Accent hue** - warm coral (`oklch(64% 0.165 28)`). One warm signal, sits clear of Cobalt's electric blue and Garden's leaf green. Used as a signal, never a flood.

## Reference register

Stripe · Linear · Vercel · ElevenLabs · Framer · Raycast · Resend · Mercury. The aesthetic: the confident warm SaaS landing, a two-column typographic hero, generous whitespace, soft pill CTAs, one restrained accent, thin visible borders. Never name any of these in the output.

**Patron-saint reference (internal):** *Stripe's warm restraint*, the monochrome-with-conviction landing warmed one notch off cool grey and given a single coral signal. When in doubt, ask "does this feel like a calm, trustworthy product, or a loud template?" Keep the former.

## Required dependencies

1. **Fonts** - **General Sans** (display 600/500, body 400/500, Fontshare) and **Geist Mono** (small UPPERCASE labels, meta, code). One sans family top to bottom; no serif, no second sans:
   ```html
   <link href="https://api.fontshare.com/v2/css?f[]=general-sans@500,600,700&display=swap" rel="stylesheet" />
   <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
   ```
2. **A small reveal script** (optional, restrained) - one `IntersectionObserver` adding `.is-in` (fade + ~8px rise, ease-out ~500ms). Coral is composed; keep reveals subtle or off. No type-in, no autoplay.

## Signature moves

1. **Warm-grey paper, never `#fff`** - `oklch(96.5% 0.005 50)`, hue 50. Layer warm greys: paper-2 `94%`, paper-3 `91%`. Ink is warm near-black `oklch(20% 0.010 35)`, body sits a notch lighter at `oklch(26% 0.012 40)`. The warmth is the whole differentiator from cool siblings, so commit to it and never drift to pure white.

2. **One warm coral signal, used sparingly** (< 5% of any viewport) - `oklch(64% 0.165 28)`. Spend it on the eyebrow tick, a link's hover underline, focus rings, one stat figure, OR a single coral-filled pill. Pick one, do not flood. Everything else is warm-ink-on-warm-grey. Never a coral background wash, never gradient text.

3. **General Sans single-family discipline** - display and body all General Sans; meta and code Geist Mono. Display 600 at `-0.025em`. No serif anywhere, no second sans. Coral is warmed by paper and accent, never by a font swap.

4. **Soft pills** - `999px` (`--radius-pill`) on CTAs and chips; cards at `8px` (`--radius-card`), inputs at `6px`. The rounded, friendly control vocabulary, the opposite of Cobalt's ruler-drawn 6px tightness. This is a load-bearing sibling separator.

5. **Quiet two-column hero** - title plus one confident line LEFT, supporting lede RIGHT (or beneath), primary and secondary pill under it. No code card, no mandatory product screenshot. The page opens calm and typographic, asymmetric to a regular grid, left-aligned. Fit the whole hero in the first viewport.

6. **Ink-filled primary pill + outlined secondary** - the canonical modern-minimal pair, warmed: primary is `--color-ink` filled with `--color-paper` text (or coral-filled with `--color-accent-ink` text, if that is where you spend the one signal from move 2); secondary is a 1px `--color-rule` outlined pill. Always name the destination, never "click here."

7. **Thin visible borders + generous air** - 1px `--color-rule` (`oklch 86%`) on surfaces and section divisions, with a barely-there `--shadow-card` (`0 1px 2px`). Not the 0.5px editorial hairline, not boxed-in. Whitespace does the luxury work: `--section-gap` 6rem, display up to `4.5rem`. The page breathes.

## Motion

Composed and sparse. Optional section reveals fade and rise ~8px, once. Hover: coral underline-grow on nav and links; a 1px border-colour lift to `--color-rule-2` on cards and focusable surfaces. No bounce, no parallax, no autoplay, no type-in. Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static and fully visible.

## Anti-patterns

- **No cool paper** - cool grey or blue is Cobalt's. Coral is warm (hue 35-50).
- **No pure `#fff` / `#000`** - the genre allows white, but Coral commits to warm grey paper and warm charcoal ink. That commitment is its identity.
- **No code / API / terminal hero** - that is Cobalt's move. Coral leads typographically.
- **No second typeface** - General Sans only (Geist Mono for meta/code). No serif, no Space Grotesk, no mono-as-display.
- **No tight ruler radii** - Coral is soft pills (999px), not 6px bordered controls.
- **No coral flood, gradient, or coral background wash** - the accent is a < 5% signal.
- **No glassmorphism, no aurora / mesh blob, no background texture** - warm paper, thin borders, and whitespace carry the page.
- **No centred-everything hero** - left-biased two-column.

## Macrostructure affinity / rejection

**Coral loves:**
- **Stat-Led** - a warm metrics page (teams onboarded, uptime, volume processed)
- **Feature-stack / SaaS** - deck ingredients: calm feature rows, real pricing, one warm CTA - dealt per macrostructures.md § deck
- **Bento Grid** - warm, restrained product-surface tiles
- **Marquee Hero** - when the hero is one confident typographic statement
- **Conversational FAQ** - a calm, human support voice

**Coral refuses:**
- **Photographic / image-led** - Coral leads with type and whitespace, not imagery
- **Manifesto** - too loud; Coral is a calm product, not a proclamation
- **Long Document** - prose-led; route warm-editorial (Garden) instead
- **Specimen / type-specimen** - that is the specimen theme's territory

## Voice fixtures

Declarative, warm, specific. Name the X. No hype.
- *"Billing that just works, so you can build."*
- *"One dashboard. Every metric that matters."*
- *"From first commit to first customer."*
- *"Built for teams who ship."*
- *"Payments infrastructure, minus the friction."*

Never: *seamless, robust, cutting-edge, leverage, synergy, revolutionary, unlock, supercharge*. Never "click here." Name the number, the product, the outcome.

## How Coral differs from neighbouring themes

| vs | what settles it instantly |
|---|---|
| **Cobalt** (modern-minimal sibling) | Coral is warm-grey paper + coral accent + General Sans + soft 999px pills + a quiet typographic hero. Cobalt is cool-white + electric blue + Space Grotesk / JetBrains Mono + tight 6px bordered controls + a live code hero. Same genre, opposite temperature; the rotation walks between them. |
| **Garden** (warm paper neighbour) | Both are warm and light, but Garden is oat-cream botanical *editorial* with green ink and a hand-built specimen artefact. Coral is warm-*grey* modern-minimal SaaS, all General Sans, coral signal. Register (product vs field-journal) settles it. |
| **Lumen** (warm-family accent) | Lumen is a premium AI *apparatus* page with a classical serif headline and a built light-instrument. Coral is light, all-sans SaaS with soft pills and no artefact. Serif + apparatus vs sans + pills settles it. |

## Test brief expectations

Coral is a candidate when the brief mentions:
- *SaaS · platform · billing · payments · dashboard · B2B · startup · product landing · pricing · analytics · fintech · workflow · team tool · onboarding · trust · warm · human*
- Product categories: *SaaS · fintech · B2B platform · startup landing · dashboard · billing/payments*
- Emotional tone: *warm · calm · confident · trustworthy · human · premium-restrained*

Warmth plus product-not-code routes here. If the brief wants to *show the code* or reads cool and technical, route Cobalt; if it is editorial or image-led, route elsewhere.

## Build hint

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-body); font-weight: 400; }

/* Display - General Sans 600, tight */
.display { font-family: var(--font-display); font-weight: var(--display-weight);
           letter-spacing: var(--tracking-display); font-size: var(--text-display); }

/* Reveal - restrained, optional */
.reveal { opacity: 0; transform: translateY(8px);
          transition: opacity .5s cubic-bezier(0.16,1,0.3,1),
                      transform .5s cubic-bezier(0.16,1,0.3,1); }
.reveal.is-in { opacity: 1; transform: none; }

/* Soft pills - the control vocabulary */
.btn { border-radius: var(--radius-pill); }
.btn--primary { background: var(--color-ink); color: var(--color-paper); }
.btn--secondary { border: 1px solid var(--color-rule); color: var(--color-ink); }

/* One coral signal + mono labels */
.eyebrow, .link:hover { color: var(--color-accent); }
.label { font-family: var(--font-mono); text-transform: uppercase;
         letter-spacing: var(--tracking-label); }

@media (prefers-reduced-motion: reduce) {
  .reveal { opacity: 1; transform: none; transition: none; }
}
```

Plus the General Sans + Geist Mono links and the small reveal script.
