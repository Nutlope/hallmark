# Recipes — copy-paste prompts that ship Hallmark output

Eight worked briefs you can paste into Claude Code, Cursor, or Codex with the Hallmark skill installed. Each shows the prompt verbatim, the audience/use/tone the skill inferred, the macrostructure + theme + enrichment it picked, and a one-paragraph excerpt of the output. Live page links are included where the test exists in [`site/_tests/`](../../site/_tests/).

The first recipe is the **canonical try-it prompt** — paste it into a fresh project to verify the skill is installed and discover the flow before reading anything else.

---

## 00 · Try it · Coffeebox

**Prompt** (copy/paste verbatim):

> *"Build me a landing page for Coffeebox — a small-batch coffee subscription. Roast on Sunday, ship on Monday, drink Tuesday. Audience: people who already buy good coffee and want fewer trips to the shop. Tone: warm, hand-set, editorial — like a small café's chalkboard."*

**Inferred trio:** explicit (audience: serious-coffee buyers · use: subscribe · tone: editorial-warm).

**Picks:** Long Document · **Linen** (warm-paper roman-serif) · Tier-B hand-built SVG (a small coffee-bean icon, optional).

**Excerpt of the output:**

> *"Coffeebox · est. 2026 · n.º 12.* The first roast leaves the drum at 6:14 a.m. Sunday. By Monday morning it's in a paper bag in your post box. By Tuesday the kitchen smells like a café. Subscribe, skip a week, change the roast — all from the email. We bake what we baked yesterday. We ship what shipped well. We answer the email ourselves."

**Why this is the canonical try-it:** the brief has explicit context (no design-context-gate friction), an editorial tone (different from any AI-default landing page), and a domain (coffee subscription) that has zero overlap with SaaS/dev-tool clichés. If Hallmark produces *Linen-with-italic-Cormorant-and-warm-paper* for this prompt, the skill is wired correctly.

---

## 01 · Tide · Indie podcast

**Prompt:**

> *"Design a landing page for Tide — an indie podcast about long-form interviews with small-studio designers. Just go ahead, pick the rest yourself."*

**Inferred trio** (the user opted out): audience = designers, design-curious listeners · use = listen + subscribe · tone = quiet editorial.

**Picks:** Letter · **Salon** (warm cream paper, IBM Plex Mono masthead, Cormorant Garamond body, warm-amber caret) · no enrichment (typography only).

**Excerpt:**

> *"Dear listener, Tide is a podcast about how small studios actually work. The bookings, the unsent invoices, the day a senior designer leaves and you sit in the office not knowing what to say to the four people who stayed."* The hero is the salutation. Below: three paragraphs of host-voice, a sign-off, then a single row of "listen where you listen" links — Apple, Spotify, Pocket Casts, Overcast, RSS. No mockups. No demo. The voice carries the brand.

**Live:** [`_tests/01-tide-podcast/`](../../site/_tests/01-tide-podcast/index.html)

---

## 02 · Streampipe · Open-source CLI

**Prompt:**

> *"Build me a landing page for Streampipe — a small, fast, single-binary CLI for parsing log and event streams from stdin. Filter, transform, route. Composes with anything that emits lines. Audience: developers. Use: install + read docs. Tone: technical. Use the Terminal theme."*

**Inferred trio:** explicit. **Theme requested.**

**Picks:** Long Document · **Terminal** (dark phosphor-green, mono everywhere) · Tier-A inline CSS-art terminal blocks (no Lottie, no real video, no sticky pin — embedded inline in the prose).

**Excerpt:**

> *"$ streampipe — a small, fast, single-binary CLI for parsing log and event streams from stdin."* Then a paragraph of prose explaining what it does, an inline `<pre>` showing `tail -f access.log | streampipe parse --format nginx --filter 'status >= 500' --out json` with three sample JSON output lines, then a second paragraph (Rust, 1.2 MB binary, no daemon, no buffer). Below: install section (three snippets — brew · cargo · curl), three numbered notes on how it works, a six-row flag table. Pure CSS, no scripts.

**Live:** [`_tests/02-streampipe-cli/`](../../site/_tests/02-streampipe-cli/index.html)

---

## 03 · Maple Street Bread · Artisan bakery

**Prompt:**

> *"Build a landing page for Maple Street Bread — a small artisan bakery in Lisbon. Sourdough, slow, by hand. We open at seven, thirty loaves, gone by noon, no online orders. Audience: locals. Use: see what we bake, find us. Tone: warm, hand-set."*

**Inferred trio:** explicit.

**Picks:** Catalogue · **Almanac** (warm parchment paper, IM Fell roman-serif display, warm-amber accent) · Tier-A hand-built inline-SVG bread silhouettes (one per item, 96 px, no animation).

**Excerpt:**

> Plate-banner masthead: *"Maple Street Bread · Lisbon · est. 2026 · n.º 47 · sourdough by hand."* Then a centred section: *"Today's bake — Saturday, 6:14 a.m., eight breads, gone by noon."* Below: a 2-column catalogue grid of eight breads (Country sourdough · Baguette tradition · Focaccia rosemary · Boule miche · Rye dark · Brioche feuilletée · Walnut levain · Bola d'óleo). Each row carries a 96-px bread silhouette, the name in IM Fell, a one-line description, and a price (or "sold out"). Visit and hours in a centred almanac panel at the bottom. No CTA — the brief is "see what's available + visit."

**Live:** [`_tests/03-maple-bakery/`](../../site/_tests/03-maple-bakery/index.html)

---

## 04 · Meridian · Studio manifesto

**Prompt:**

> *"A studio manifesto for Meridian — a small environmental-products design practice in Lisbon. Declarative, no flashy stuff."*

**Inferred trio** (partial): audience = practice peers + clients · use = read it + sign on or move on · tone = declarative editorial.

**Picks:** Quote-Led · **Brutal** (near-black paper, Druk-style condensed display, single yellow strike accent) · no enrichment.

**Excerpt:**

> A single twenty-word pull-quote: *"We make products that don't outlive their use"* — with a yellow strike-through behind "outlive." Attribution beneath: *"— The studio · the position we open with · this is the page."* Below the bleed-yellow rule, four numbered principles (Fewer things, made well · Material is the brief · Repair before replace · Slow is the deliverable), each with one paragraph of body copy. Final § Working rules — five terse operational statements (the shop runs on a four-day week · we answer the email ourselves · etc.). No CTA, no testimonials, no roadmap.

**Live:** [`_tests/04-meridian-manifesto/`](../../site/_tests/04-meridian-manifesto/index.html)

---

## 05 · Tracejam · SaaS observability

**Prompt:**

> *"Build me a landing page for Tracejam — a tracing/observability tool for distributed systems. Audience: SREs and platform engineers. Use case: try it / contact sales. Tone: technical."*

**Inferred trio:** explicit.

**Picks:** Workbench · **Midnight** (dark cool paper, Geist Mono display, phosphor-cyan accent) · Tier-A pure-CSS sticky trace panel (3-state, swaps on scroll — no clipped browser frame).

**Excerpt:**

> *"Tracejam · v0.4 · For SREs &amp; platform engineers. Distributed tracing that explains itself."* Hero left-aligned with two CTAs (Try it free / Talk to sales). On the right, a sample trace card with five spans — auth.verify, pricing.quote (red, regressed), rates.fx (orange, warning), ledger.write — bars rendered as flex children. Below: a sticky-walkthrough section with three steps (open · find · read), each with a one-paragraph body and a small `$ tracejam ...` command. The right column carries a pinned trace panel with a "REGRESSED" chip and a "WHY" explainer in plain text. Eight integrations strip, three-tier pricing, single-line colophon.

**Live:** [`_tests/05-tracejam-saas/`](../../site/_tests/05-tracejam-saas/index.html)

---

## 06 · Anya · Personal one-pager

**Prompt:**

> *"Personal site for Anya — software architect in Lisbon. Don't ask, just figure it out."*

**Inferred trio** (the user opted out): audience = engineering hiring managers · use = read who I am, see my work · tone = austere, italic-editorial.

**Picks:** Index-First · **Plain** (pure-white paper #ffffff, Inter Tight display-heavy, deep ink-blue accent) · no enrichment.

**Excerpt:**

> Sticky left sidebar with a numbered TOC: *00 Index · 01 Now · 02 Years · 03 Writing · 04 Reach.* Each section in the right column starts with its own num + label and a clamp-set H2. *"00 · Index"* opens with *"A small, scannable index of who I am and what I do."* — followed by a two-paragraph bio. *"01 · Now"* covers consulting two engagements at a time on payment systems and monolith-to-services migrations. *"02 · Years"* is a tabular work history (Stripe → Monzo → Knot → independent). *"03 · Writing"* lists five linked pieces with date columns. *"04 · Reach"* is a four-cell contact grid (email · GitHub · LinkedIn · Mastodon).

**Live:** [`_tests/06-anya-portfolio/`](../../site/_tests/06-anya-portfolio/index.html)

---

## 07 · Foundry · Compliance SaaS

**Prompt:**

> *"Build me a landing page for Foundry — SOC 2 and ISO 27001 compliance automation for B2B SaaS. Show: how many companies got compliant, what it costs, who uses it. Audience: founders + CTOs. Tone: technical but trustworthy."*

**Inferred trio:** explicit.

**Picks:** Bento Grid · **Newsprint** (warm-cream paper, Source Serif 4 display, warm-deep-red accent) · Tier-A pure-CSS logo grid (eight wordmark placeholders, mono).

**Excerpt:**

> Newspaper-banner masthead with the wordmark centred. Hero left-bias: *"Compliance, ground out in **days**, not in months."* — the word "days" set in red italic. Right: a pull-quote panel with a CTO testimonial. Below: a 6-tile bento — (1) the "847." anchor stat with a one-line caption, (2) eight customer wordmarks in a 4×2 logo grid, (3) three-tier pricing snippet (Starter $299 · Team $899 popular · Scale custom), (4) a second testimonial pull-quote, (5) a six-row "what's automated" feat-list, (6) a six-question FAQ teaser. Final CTA strip: *"Start the trial. Cancel before the first invoice if it's not ready."* Single-line colophon.

**Live:** [`_tests/07-foundry-compliance/`](../../site/_tests/07-foundry-compliance/index.html)

---

## 08 · Cohort · Cohort-based courses

**Prompt:**

> *"Build a landing page for Cohort — the platform for cohort-based courses. Run live courses with 30 to 500 students. Built for educators, not LMS sales teams. Audience: course operators + indie creators. Tone: warm, salon-room, editorial."*

**Inferred trio:** explicit.

**Picks:** Stat-Led · **Linen** (warm beige paper, Inter Tight geometric-sans, warm-amber accent) · no enrichment (typography only — the brief's "30–500" range is the visual).

**Excerpt:**

> Centred eyebrow: *"Built for educators · not LMS sales teams."* Hero stat at 22 rem: **"30 — 500"** (with the dash in warm-amber). Headline: *"Live courses, the size your roster actually is."* Sub: *"Cohort runs courses with thirty to five hundred students at once — the size of a real classroom, the size of a real lecture, and a few sizes between. With a date, a roster, and a room."* Below: three supporting stats (186 cohorts run · 93 % finish-rate · 4.7/5 operator NPS). Two operator testimonials side-by-side. Two-tier pricing (First cohort free · Operator $199/mo). Single CTA strip and colophon. No marquee, no card-stack — the brief carried by the typography.

**Live:** [`_tests/08-cohort-courses/`](../../site/_tests/08-cohort-courses/index.html)

---

## How the recipes are organised

Every recipe shares the same four lines so you can scan a brief and immediately see *which combination Hallmark picks for what*:

1. **Prompt** — verbatim, copy/paste-ready.
2. **Inferred trio** — what the design-context-gate produces (audience · use · tone). Marked `explicit` if the user provided all three; `the user opted out` if not.
3. **Picks** — macrostructure · theme · enrichment archetype.
4. **Excerpt** — one paragraph of the produced copy or layout, so you can verify the output matches the brief without running the skill yet.

When generating something new, look for the closest match in this file and **note what's different** between your brief and the recipe. The macrostructure pick is usually inherited; the theme often shifts (per the diversification rule); enrichment may change tier.

## What the recipes are *not*

- Not templates. Hallmark's whole point is structural variety — duplicating a recipe verbatim is the **Specimen-fall-through** anti-pattern (gate 23 in [`SKILL.md`](../SKILL.md)).
- Not fixed picks. Two consecutive runs of recipe 00 (Coffeebox) on the same project should produce *different* macrostructures or themes — the [`.hallmark/log.json`](../SKILL.md) project memory enforces this.
- Not exhaustive. The 21 macrostructures × 16 themes × 8 enrichment archetypes = 2,688 distinct fingerprints. The 9 recipes here are a starter set; the next 50 are yours to discover.
