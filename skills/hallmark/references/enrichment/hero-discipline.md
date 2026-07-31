# Hero discipline: space, motion, and the ship gate

Load this file for EVERY page hero, enriched or not: the posture below is picked at Step 2 alongside nav and footer, and the eight pre-flight questions decide whether an enrichment ships at all.

## Hero postures - pick one, stamp it

The posture sets the hero's geometry envelope. **Settled is the neutral default**; every other posture is opt-in, named in the Picks block, the CSS stamp (`· hero: <Posture>/<H#>`), and the log. Gate 44 reads the posture from the stamp (no field = Settled). Fold-fit at 1280x800 and the two-centred-elements ceiling (gate 6) bind on all six. Rotation lives in SKILL.md § Rotation.

| Posture | Character | Min-height | Padding rule | Alignment | Pairs with | Genre affinity |
| --- | --- | --- | --- | --- | --- | --- |
| **Settled** | balanced fold; sits into the page | `clamp(60vh, 75dvh, 88dvh)` (70-90% of viewport) | block-end >= 1.3x block-start | <= 2 centred | any H1-H9 | any (default) |
| **Banner** | compressed opener; the page starts fast | 40-55dvh (cap ~`min(52dvh, 34rem)`) | block-end >= 1.3x block-start | 0-1 centred, edge-led | H1 (short), H4, H5 | reference / docs / utility (Almanac, Ledger, Grid, Cobalt) |
| **Poster** | full-bleed canvas; the fold IS the artwork | 92-100dvh (100dvh legal only here) | waived when content is edge/corner-anchored, else 1.3x | centred only under gate 6's genre carve-outs | H1, H6 | atmospheric · playful-canvas · Manifesto / Sport |
| **Ledge** | tall top void; content rests at the base | 70-88dvh | inverted: block-start >= 2x block-end, content `align-content: end` | <= 1 centred | H1, H4, H6 | sport · brutal · manifesto · photographic |
| **Corridor** | tall centred reading column | 66-85dvh | block-end >= 1.3x block-start | centred column <= 44ch; eyebrow OR CTA off-axis | H3, H5, H1 | editorial · atelier (gate 6 centred-narrow rule) |
| **Stage** | text column + full-height visual that may bleed | 70-92dvh | 1.3x on the text column; visual may touch the hero's edges | <= 1 centred | H2, H7, H8 | modern-minimal · playful product |

Mobile (< 48rem): every posture collapses to content height (`min-height: auto` or <= 60dvh); Poster may stay full-bleed. Fold-fit (gate 44b) is posture-independent: at 1280x800 the essential content is complete without scrolling on every posture, including Ledge (content bottom = hero bottom minus block-end padding, and the hero itself stays <= 88dvh) and Poster (content anchored inside the first 800px).

## Hero space discipline

These bind on every hero, whatever the posture.

- **Fit the fold — content, not just the box.** The posture caps the hero's *height*; this caps its *content*. On a 13″ laptop (~800 px tall) the eyebrow + headline + lede + primary CTA must all be visible **without scrolling**. When they aren't, it's almost always wasted vertical space — an oversized display `clamp()` max, display line-height near 1.2, a 3-line lede, or `padding-block` bloat. Pull the clamp max down, set display line-height 1.0–1.1, hold the lede to ~2 lines, trim the padding. **Right-size, don't cramp** — a hero that already fits needs no shrinking, and this never means tiny type or no whitespace. Slop-test gate 44 enforces this.
- **Padding per posture.** The posture table above owns the padding rule (1.3x bottom-heavy on most, inverted on Ledge, waived on an anchored Poster). Symmetric padding on a Settled/Banner/Corridor/Stage hero floats off the page; gate 44 reads the stamped posture and enforces the matching rule.
- **Never centre everything.** Eyebrow + title + lede + CTA all stacked centred is the AI fingerprint. Pick at most *two* centred elements; break alignment for the others. Gate 6 enforces this. Centred-narrow heroes are admissible only when the genre is editorial / atelier *and* the eyebrow or CTA breaks alignment.
- **Entrance animation.** Pick one of {fade, sweep, none} per element — never both fade *and* sweep on the same element. Duration ≤ 220 ms. Disable on `prefers-reduced-motion: reduce`. Cross-reference the "One orchestrated reveal per page" rule below.
- **Headline typography.** Prefer one display weight + tight tracking (-0.02em to -0.04em) over default 0; line-height 0.95–1.05 for display, never 1.2 (which inherits the body line-height and reads as un-set type). Avoid two display weights on the same headline (a `<strong>` in a different weight inside the title is AI's idea of "emphasis"; pick one weight, let the words carry).
- **One polish pattern, max.** HP1–HP4 are mutually exclusive on a single hero. A vertical rail *and* a marquee-overflow *and* a cursor spotlight *and* a decorative numeral on one hero is a panic attack. Pick one.

---

## Animation discipline (hero specifically)

Cross-references [`motion.md`](../motion.md), [`microinteractions.md`](../microinteractions.md), and [`custom-craft.md`](../custom-craft.md). The hero is the highest-stakes animation surface on the page; the rules are tighter here than elsewhere.

**One orchestrated reveal per page.** Not eight. Not "everything fades in on scroll". One: the hero settles in 0.4–0.8 s with a single coordinated motion, then stops.

**Banned for hero entrances:**
- Bouncy elastic easing (`cubic-bezier(0.34, 1.56, ...)`) — reads as 2016 Framer demo. This ban is about hero ENTRANCES; a theme whose spec earns spring easing for micro press/pop interactions (Hum) keeps it there, never here
- Scroll-fade-everything (every section fades in when it enters the viewport)
- Mouse-follow gradients on SaaS landing pages (allowed only on portfolio / creative / agency work)
- Parallax-on-mouse (motion sickness, gimmicky)
- Particle / starfield backgrounds (2010s nostalgia, distracting). One scoped exception: Arcade's FIXED starfield + scanlines are that theme's sanctioned retro signal ([`texture.md`](../texture.md) § Scanline; the field never animates)
- Auto-rotating hero carousels (WCAG 2.2.2 fail unless paused-on-hover-and-focus is implemented)

**Allowed:**
- A single image-fade-in-late after the headline lands (~0.6 s after, ~0.4 s duration)
- Type-unmask on the headline (`clip-path` opening over text)
- View Transitions API for state changes (theme switch, route change)
- Number-tick on a stat-led hero (counter from 0 to final, ≤ 1.2 s)
- A single subtle Lottie / CSS loop ≤ 4 s, with `prefers-reduced-motion` fallback

**Reduced-motion is the default in 2026.** Every animation gets a `@media (prefers-reduced-motion: reduce)` block that either disables the motion or replaces it with a static keyframe. This is non-negotiable; the slop test will catch you.

---

## Quality bar — eight pre-flight questions

Every question must answer *yes* before the enrichment ships. If any answer is *no*, ship the typographic-only hero instead.

1. Does the enrichment **communicate** something the typography can't?
2. Is it under **2 MB** total (video poster + first segment, illustration + animation JSON, image + grain)?
3. Does it have a **`prefers-reduced-motion` fallback**?
4. If video: muted, looped, `playsinline`, with a poster + `fetchpriority="high"` + caption track?
5. If illustration: built or generated with intent? **Not picked from a Lottie library as a shortcut?**
6. If background: under one accent colour at < 5 % footprint? (Aurora and mesh-gradients fail this.)
7. Does it survive being deleted? (If the hero still works without it, it earned its place. If the hero collapses without it, you propped weak typography on a crutch.)
8. Does its tone match the page's tone? (Risograph illustration on a Brutal page = wrong. Hand-drawn doodle on a Workbench developer-tool page = wrong. Three.js bloom on a Coral page = wrong.)

The slop test ([`SKILL.md`](../../SKILL.md) §5) carries four binary gates that mirror these questions; the audit verb runs them.

---

## Common mistakes — and the fixes

- **Defaulting to E5 illustration on every brief.** Most heroes don't want an illustration. Reach for E0 (typography only) first; reach for E1–E4 when there's a *thing* to show; reach for E5 only when illustration genuinely matches the tone.
- **Using a stock Lottie checkmark as the hero animation.** That's tier E used to skip tiers A–D. Build the checkmark in pure CSS (`stroke-dasharray` animated to draw the tick); it's 8 lines.
- **Adding a grain background everywhere.** Grain is a treatment, not a default: it is a budgeted recipe in [`texture.md`](../texture.md) for the themes that earn it (Riso, Carnival, Arcade). Specimen and Atelier BAN texture; don't add it there at all.
- **Treating the abstract background as the hero.** It isn't. The headline is. The background is paper.
- **Shipping the unmodified Storyset SVG.** That's tier D ungrounded — the library look. Customise the colour to your anchor hue at minimum; recompose if you can.
- **A clipped-edge video on mobile.** The clip reads as broken on a 375-px viewport. Always collapse to stacked at < 60 rem.
