# Component cookbook

Fifty component archetypes you can compose into any macrostructure. Every entry: a *shape*, a one-line "use when", a one-line "don't confuse with", and a short structural sketch (DOM + minimal CSS). Pick from this file when you're building a section and don't know which shape to reach for.

The same macrostructure (e.g., Bento Grid) can be built from many different combinations of these archetypes. The macrostructure picks the *page shape*; this file picks the *components inside it*.

**Diversification rule:** lives in SKILL.md's Rotation block; check it before picking archetypes.

---

## Archetype index — load ONLY the picks you need

**Pick your archetype names here, then read ONLY those individual files** from `references/components/`. Do not load the whole cookbook. A typical build needs 5–7 files: 1 hero + 1 section head + 1–2 features + 1 CTA + 1 footer + 1 nav.

### Heroes

- **H1 · Marquee** — A single statement fills the fold. No subhead, no CTA in view. [`components/h1-marquee.md`](components/h1-marquee.md)
- **H2 · Split diptych** — Headline + lede on one side, image or product capture on the other. 6/6 or 7/5 columns. [`components/h2-split-diptych.md`](components/h2-split-diptych.md)
- **H3 · Quote led** — A pull-quote with attribution is the hero. Your headline is borrowed credibility. [`components/h3-quote-led.md`](components/h3-quote-led.md)
- **H4 · Stat led** — A giant number or metric is the hero. A small qualifier line below. [`components/h4-stat-led.md`](components/h4-stat-led.md)
- **H5 · Letter hero** — First-person opening — "Dear reader,". No buttons in fold. Reads as personal correspondence. [`components/h5-letter-hero.md`](components/h5-letter-hero.md)
- **H6 · Photographic fold** — Single full-bleed image fills the viewport. Caption sits in a corner. [`components/h6-photographic-fold.md`](components/h6-photographic-fold.md)
- **H7 · Demo video clipped by viewport edge** — Display headline left, demo video right, the rightmost ~10–20 % extending past the viewport so it's intentionally cut off. The clip *is* the design — it implies there's more product than fits the screen. [`components/h7-demo-video-clipped-by-viewport-edge.md`](components/h7-demo-video-clipped-by-viewport-edge.md)
- **H8 · Mockup split browser framed** — Headline left, browser-frame mockup right, the mockup tilted 1–3° for life. Frame can be browser chrome, macOS toolbar, minimal hairline, or floating no-frame. [`components/h8-mockup-split-browser-framed.md`](components/h8-mockup-split-browser-framed.md)
- **H9 · Custom illustration centerpiece** — A single hand-built SVG (Tier B in the enrichment hierarchy — or pure CSS at Tier A for simpler shapes) sitting on the hero as one illustrative element: the bakery loaf, the studio mark. [`components/h9-custom-illustration-centerpiece.md`](components/h9-custom-illustration-centerpiece.md)

### Section heads

- **S1 · Stacked numbered** — The section number stacks directly above the heading, same column (the old side-column form is gate 54's auto-fail). [`components/s1-left-margin-numbered.md`](components/s1-left-margin-numbered.md)
- **S2 · Hanging** — Heading floats above the section in negative space; no border, no rule. [`components/s2-hanging.md`](components/s2-hanging.md)
- **S3 · Sticky pinned** — Heading remains in viewport while content scrolls beneath. Orientation aid. [`components/s3-sticky-pinned.md`](components/s3-sticky-pinned.md)
- **S4 · Inline no break** — The heading is a small caps phrase that emerges *inside* the body flow; no spatial break. [`components/s4-inline-no-break.md`](components/s4-inline-no-break.md)
- **S5 · Bottom anchored** — The label or heading sits *below* the section's content. Inverts hierarchy. [`components/s5-bottom-anchored.md`](components/s5-bottom-anchored.md)

### Feature blocks

- **F1 · Bento grid** — Asymmetric grid of 8–15 tiles in mixed spans (1×1, 2×1, 1×2, 2×2). Visual rhythm via size. [`components/f1-bento-grid.md`](components/f1-bento-grid.md)
- **F2 · Sticky scroll stack** — Sticky left pane, scrolling right pane that cycles through related screenshots. [`components/f2-sticky-scroll-stack.md`](components/f2-sticky-scroll-stack.md)
- **F3 · Tabular spec sheet** — Each row is a feature; columns hold name, value, footnote. Hairline rules between rows. Tabular numerics. [`components/f3-tabular-spec-sheet.md`](components/f3-tabular-spec-sheet.md)
- **F4 · Step sequence** — Numbered stages (`1.0 → 2.0 → 3.0`) flow vertically. Each stage has a heading, a paragraph, sometimes a small visual. [`components/f4-step-sequence.md`](components/f4-step-sequence.md)
- **F5 · Annotated screenshot** — A product capture sits centre-stage with arrows or short labels pointing to UI details. [`components/f5-annotated-screenshot.md`](components/f5-annotated-screenshot.md)
- **F6 · Product card grid** — Each card is a product, not a feature. Image · name · price · one micro-action. Reads like a shop floor, not a marketing site. [`components/f6-product-card-grid.md`](components/f6-product-card-grid.md)

### CTAs / signups

- **C1 · Outlined chip** — A bordered, transparent button with a typographic verb ("Save changes"). [`components/c1-outlined-chip.md`](components/c1-outlined-chip.md)
- **C2 · Inline form as cta** — The CTA *is* the form — a single email input with a "Submit →" beside it. No separate landing for sign-up. [`components/c2-inline-form-as-cta.md`](components/c2-inline-form-as-cta.md)
- **C3 · Typographic link** — Just a word, an arrow, and a 1-px underline. No box, no fill. [`components/c3-typographic-link.md`](components/c3-typographic-link.md)
- **C4 · Sticky bottom bar** — A horizontal bar pinned to the viewport bottom, holding a CTA + a brief reassurance line. [`components/c4-sticky-bottom-bar.md`](components/c4-sticky-bottom-bar.md)

### Testimonials / proof

- **T1 · Pull quote with marginalia** — A quote sits in the wide column; the attribution and source link float in the narrow margin column. [`components/t1-pull-quote-with-marginalia.md`](components/t1-pull-quote-with-marginalia.md)
- **T2 · Logo wall hairline** — A row of customer logos, monochromatic, separated by hairline rules. No card boxes, no shadows. [`components/t2-logo-wall-hairline.md`](components/t2-logo-wall-hairline.md)
- **T3 · Single huge quote** — One quote, set big, centered, taking a whole section. No supporting text, no attribution boxes — attribution is a small caps line beneath. [`components/t3-single-huge-quote.md`](components/t3-single-huge-quote.md)
- **T4 · Numbered stat strip** — A horizontal strip of 3–5 stats (count + qualifier) running across one row. Tabular nums. [`components/t4-numbered-stat-strip.md`](components/t4-numbered-stat-strip.md)

### Footers

- **Ft1 · Mast headed** — A wordmark and tagline anchor a single horizontal band. Two or three small links beside, address or licence below. [`components/ft1-mast-headed.md`](components/ft1-mast-headed.md)
- **Ft2 · Inline rule single line** — A single horizontal line of credits, address, copyright. Hairline rule above. No columns. [`components/ft2-inline-rule-single-line.md`](components/ft2-inline-rule-single-line.md)
- **Ft3 · Index style category list** — Three or four short columns, each headed by a category in small caps, holding 4–6 links each. [`components/ft3-index-style-category-list.md`](components/ft3-index-style-category-list.md)
- **Ft4 · Dense typographic** — One large block of text — credits, references, licence, address — in a small monospace font, fully justified or ragged-right. Editorial colophon energy. [`components/ft4-dense-typographic.md`](components/ft4-dense-typographic.md)
- **Ft5 · Statement** — One large display sentence dominates the footer — a closing line, not a sitemap. Wordmark, minimal links, copyright sit beneath in muted small type. Stripe (older), Mailchimp pre-r [`components/ft5-statement.md`](components/ft5-statement.md)
- **Ft6 · Letter close** — Closes the page like a letter — `Yours, the team. 2026.` Optional postscript line beneath. Sets the page as a piece of writing rather than a product. [`components/ft6-letter-close.md`](components/ft6-letter-close.md)
- **Ft7 · Newsletter first** — The form (label + input + submit) is the *primary* element of the footer; everything else (wordmark, links, copyright) is set in 12 px muted type beneath. Stratechery, Substack-sha [`components/ft7-newsletter-first.md`](components/ft7-newsletter-first.md)
- **Ft8 · Marquee scroll** — A horizontal infinite-scroll line of repeating tagline + dot separator: `STUDIO · 2026 · STUDIO · 2026 · STUDIO · 2026 ·`. Sport-genre sites, fashion lookbooks, brand-forward agenc [`components/ft8-marquee-scroll.md`](components/ft8-marquee-scroll.md)

### Navigation

- **N1 (N1a) · Wordmark 2 links** — Top-of-page bar: wordmark on the left, two text links on the right ("Pricing" / "Sign in"). No logo image, no menu icon. The *minimal* variant — for the dense canonical SaaS bar use **N1b**. [`components/n1-wordmark-2-links.md`](components/n1-wordmark-2-links.md)
- **N2 · Floating chip** — A small fixed chip in a corner — wordmark + a single action ("Try it"). Doesn't sit in document flow. [`components/n2-floating-chip.md`](components/n2-floating-chip.md)
- **N3 · Side rail** — A thin vertical strip on the left edge — wordmark rotated, plus 2–3 dot-indicators for sections. Editorial / portfolio energy. [`components/n3-side-rail.md`](components/n3-side-rail.md)
- **N4 · Hidden behind k** — No visible nav. The user opens a command palette via `⌘K` to get anywhere. Designed for keyboard-first audiences. [`components/n4-hidden-behind-k.md`](components/n4-hidden-behind-k.md)
- **N5 · Floating pill** — A rounded full-pill nav, *visibly detached* from the page edges, sitting ~`var(--space-md)` from the top, soft blur backdrop, soft shadow. Reads as contemporary modern-minimal — Ve [`components/n5-floating-pill.md`](components/n5-floating-pill.md)
- **N6 · Newspaper masthead** — Full-width header, large centred wordmark on the top row, thin issue/date line above or below in serif small caps, optional inline link row beneath, double-rule below the whole thi [`components/n6-newspaper-masthead.md`](components/n6-newspaper-masthead.md)
- **N7 · Brutal slab** — A heavy, full-width nav with a 2 px solid border-bottom, all-caps wordmark and tracked uppercase link row, dense rhythm, no shadow, no rounded corners. Reads as Pentagram project p [`components/n7-brutal-slab.md`](components/n7-brutal-slab.md)
- **N8 · Terminal command** — A nav formatted as a CLI prompt: `> studio --catalog --voice --get▮`. The "links" are command flags. The blinking cursor (`▮`) is allowed *only here* (it has purpose — signals "you [`components/n8-terminal-command.md`](components/n8-terminal-command.md)
- **N9 · Edge aligned minimal** — Wordmark hard-left, single CTA hard-right, vast empty space between, no link row at all. The *absence* is the design — Apple product pages, Carl Hauser, luxury sites. [`components/n9-edge-aligned-minimal.md`](components/n9-edge-aligned-minimal.md)
- **N10 · Floating on scroll morph** — A sticky bar at the top that **morphs into a floating pill** as the user scrolls past a threshold. Two visual modes share one DOM — `.nav` (outer) owns the bar look, `.nav__inner`  [`components/n10-floating-on-scroll-morph.md`](components/n10-floating-on-scroll-morph.md)
- **N1b · Canonical SaaS three-section** — Wordmark-left · centred 4–6-link cluster (some with hover dropdowns) · sign-in + filled CTA right. The dominant modern marketing nav; frosts on scroll. N1/N1a is the *minimal* two-link variant; this is the dense, balanced one. [`components/n1b-saas-three-section.md`](components/n1b-saas-three-section.md)
- **N11 · Mega-menu panel** — Top bar whose triggers open a full-width multi-column panel (icon · title · description per item, grouped, + a feature card); page dims behind a scrim. For platforms/hubs with many grouped destinations. [`components/n11-mega-menu.md`](components/n11-mega-menu.md)
- **N12 · Announcement banner + retracting nav** — A coloured promo banner stacked above one real nav; banner retracts on scroll-down, returns on scroll-up, dismisses via ×. Banner ≠ second nav (colour contrast keeps them distinct). [`components/n12-banner-retract.md`](components/n12-banner-retract.md)
- **N13 · Inline ⌘K search pill** — A visible search pill in the bar (placeholder + `⌘K` hint) opening a spotlight modal with grouped, keyboard-navigable results. The *visible* opposite of N4. For search/docs-heavy products. [`components/n13-inline-cmdk-pill.md`](components/n13-inline-cmdk-pill.md)

---

## Within-archetype variation knobs

Picking an archetype is the first axis of variety. The second is *how you build it*. Two pages built with the same archetype should not be identical — each archetype below has 2–3 *variation knobs*. Pick one value per knob per output. This prevents "every Bento I build looks like the same Bento."

When you pick an archetype, **state the knob values you chose** in the macrostructure stamp comment, e.g.:

```css
/* Hallmark · macrostructure: Bento Grid · F1 Bento knobs: tiles=6, spans=irregular, accent=corner-only · ... */
```

The knob values live **inside each archetype file** (`## Knobs`), next to the code they vary; this index never carries them.

**Anti-pattern (gate 32):** picking the same knob values across two outputs is the same templating as picking the same archetype. If your last Bento was `tiles=6, spans=irregular, accent=corner-only`, the next one changes at least one knob.

---

## Routing — which footer fits which genre

| Genre | Default | Also OK |
| --- | --- | --- |
| editorial | **Ft1 Mast-headed** | Ft2, Ft4, Ft6, Ft7 |
| modern-minimal | **Ft2 Inline single line** | Ft1, Ft5 |
| atmospheric | **Ft5 Statement** | Ft1, Ft2 |
| playful | **Ft8 Marquee scroll** | Ft5, Ft3 |
| terminal | **Ft4 Dense colophon** | Ft2 |
| docs / reference | **Ft3 Index columns** | Ft1 |

**Diversification.** Footer rotation lives in SKILL.md's Rotation block.

**Default away from Ft3.** The 4-column index footer is the AI fingerprint when used reflexively (Product · Company · Resources · Legal + social row + tiny copyright). Reach for Ft3 only when the page is a hub or docs-root with a genuine sitemap; default to Ft1, Ft2, Ft4, Ft5, Ft6, Ft7, or Ft8 otherwise.

---

## Routing — which nav fits which genre / theme

| Genre / cluster | Default nav | Acceptable also |
| --- | --- | --- |
| editorial (Newsprint · Garden · Atelier · Carnival · …) | **N6 Masthead** | N1a, N9, N12 |
| modern-minimal (Coral · Cobalt) | **N1b SaaS three-section** | N5, N11, N13, N9 |
| atmospheric (Bloom · Aurora · Midnight · Lumen) | **N5 Floating pill** (blur backdrop sells the mood) | N9, N4, N13, N1b |
| playful (Hum · Field · Arcade) | **N7 Brutal slab** (rounded knobs for Hum) | N1b, N11, N12, N13 |
| terminal / CLI (Terminal) | **N8 Terminal command** | N4 ⌘K-only, N13 |
| docs / reference (Almanac) | **N3 Side-rail** | N13, N1a, N4 |
| commerce / product launch | **N12 Banner + retract** | N1b, N11, N9 |

**Diversification.** Nav rotation and the state-it-out-loud line live in SKILL.md's Rotation block.

**Default away from N1a.** The most-recognised AI fingerprint is N1a (wordmark + inline link row + button-right) used reflexively. For a real product nav reach for **N1b** (the dense, balanced canonical bar) or N5/N11/N13 first; reach for N1a only when the page genuinely has 2 destinations.

---

## Picking from this file

When building a section:

1. Identify the section's role (hero / section-head / feature / CTA / testimonial / footer / navigation).
2. Glance at the archetypes in that category.
3. Pick the one whose "Use when" fits the brief.
4. Make sure no two sections in the same page use the same archetype.
5. If the macrostructure suggests a default (e.g., Bento Grid → F1 Bento), use it; if it doesn't suggest, vary deliberately.

The goal is composed variety — within a page, sections feel different from each other; across pages Hallmark builds, sections feel different from the last.

---


## Mobile collapse — per archetype

Every archetype has a defined collapse behaviour at narrow viewports. The two breakpoints to know:

- **60 rem (~960 px)** — the *layout* breakpoint. Multi-column grids collapse to single column. Tilts and clip effects drop. Sticky panes unstick.
- **40 rem (~640 px)** — the *typography* breakpoint. Display sizes shrink one step. Side-margin labels move inline. Annotations consolidate.

Below 60 rem the archetype must still feel like itself — same hierarchy, same tone, same rhythm — but in a stacked single-column form. Below 40 rem the page is a phone; treat space like a luxury.

Each archetype file carries its own `## Mobile collapse` section with the two breakpoint behaviours; read it with the file when you pick.

**Cross-cutting rules:**

- All hit targets ≥ 44 × 44 px below 40 rem (WCAG AA). Never below.
- Padding-inline ≥ `clamp(1rem, 4vw, 1.5rem)` on the page container so content doesn't kiss the screen edge.
- Disable any scroll-linked animation below 40 rem (mobile scroll has its own physics; layered animations fight it).
- Image `loading="lazy"` always below the fold; **never on the LCP element regardless of viewport.**
- Auto-play video respects `data-saver` (`navigator.connection.saveData`) — replaces with poster when set.


