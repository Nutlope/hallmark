# Macrostructures

Twenty-one named landing-page shapes. Each is a complete fingerprint (heading placement, body composition, divider language, button voice, image treatment, reveal pattern) bundled under one name. **This is a vocabulary, not a menu.** Design the page the prompt asks for, then name the shape you designed so Rotation and gate 32 have something to read; reaching in here first and building whatever comes back is how twenty-one shapes collapse into the same three. When nothing here fits what you designed, say so, describe the shape as a fingerprint (§ The fingerprint, below), and give it a short name for the stamp and the log (*a season page*).

## The 21 macrostructures, index

**Read only the one file** for the shape you landed on, from `references/macrostructures/`. Do not load the whole catalogue. Slugs are stable; Rotation reads the shape from the stamp and the log. Nav and footer are part of the shape, settled with the hero. Each shape file names the `layout.md` compositions it is built from; the code is yours.

- **01 · Bento Grid.** Modular blocks of varying sizes laid out as an irregular grid. Each block is a feature, a figure, an image or a quote the user supplied. Rhythm comes from size variation, not card uniformity. [`macrostructures/01-bento-grid.md`](macrostructures/01-bento-grid.md)
- **02 · Long Document.** Reads like a memo, a letter or a journal entry. No marketing structure. Continuous prose with inline section heads. The page is literature about the product. [`macrostructures/02-long-document.md`](macrostructures/02-long-document.md)
- **03 · Marquee Hero.** The hero is the page above the fold. A single statement or visual fills the viewport. Below the fold the page becomes something else (a list, a grid, prose). [`macrostructures/03-marquee-hero.md`](macrostructures/03-marquee-hero.md)
- **04 · Stat-Led.** The hero is a figure the user gave, with the line that says what it means. Everything that follows supports or qualifies it. [`macrostructures/04-stat-led.md`](macrostructures/04-stat-led.md)
- **05 · Workbench.** Real product captures are the primary content. The page is a guided tour of the app in use, with short captions in place of marketing copy. [`macrostructures/05-workbench.md`](macrostructures/05-workbench.md)
- **06 · Conversational FAQ.** Bold questions, prompt answers. The page reads like an honest interview with the product. Each pair may be a disclosure. [`macrostructures/06-conversational-faq.md`](macrostructures/06-conversational-faq.md)
- **07 · Manifesto.** Polemical large type. The page tells the reader what to believe before it tells them what to buy. [`macrostructures/07-manifesto.md`](macrostructures/07-manifesto.md)
- **08 · Photographic.** A single huge image dominates each fold. Text is small annotation, not headline. The design says look before it says read. [`macrostructures/08-photographic.md`](macrostructures/08-photographic.md)
- **09 · Quote-Led.** The hero is a quote the user supplied, with its attribution. The headline is someone else's voice. [`macrostructures/09-quote-led.md`](macrostructures/09-quote-led.md)
- **10 · Specimen.** Large serif display, asymmetric spans, hairline rules, a typographic CTA, generous whitespace. Only for prompts about type, publishing or writing (a foundry, a journal, a press); the editorial genre alone does not qualify. [`macrostructures/10-specimen.md`](macrostructures/10-specimen.md)
- **11 · Catalogue.** Uniform grid of variations of the same thing: typefaces, palettes, SKUs. The page is a visual index of inventory. [`macrostructures/11-catalogue.md`](macrostructures/11-catalogue.md)
- **12 · Letter.** First-person, written, intimate. Opens with a greeting. Reads as a personal note from the founder. [`macrostructures/12-letter.md`](macrostructures/12-letter.md)
- **13 · Index-First.** The page is a list of links. No hero image, no narrative flow. Navigation as design. [`macrostructures/13-index-first.md`](macrostructures/13-index-first.md)
- **14 · Narrative Workflow.** Numbered stages tell the story of how the user uses the product over time. Each section is a phase; the page is a process timeline. [`macrostructures/14-narrative-workflow.md`](macrostructures/14-narrative-workflow.md)
- **15 · Split Studio.** Diptych. Every major block divides the screen, text on one side, proof on the other; the proof keeps its side and the rows vary by weight. [`macrostructures/15-split-studio.md`](macrostructures/15-split-studio.md)
- **16 · Feature Stack.** Sticky left pane holding the heading, scroll-synced right pane cycling through related captures. Paced like film. [`macrostructures/16-feature-stack.md`](macrostructures/16-feature-stack.md)
- **17 · Type Specimen.** The typeface is the design. Foundry pages and design systems where a custom face is the proof. [`macrostructures/17-type-specimen.md`](macrostructures/17-type-specimen.md)
- **18 · Portfolio Grid.** Filterable cards of projects. Studio and designer homepages where the work is the product. [`macrostructures/18-portfolio-grid.md`](macrostructures/18-portfolio-grid.md)
- **19 · Map / Diagram.** A single large spatial diagram organises the page: flowchart, floor plan, network graph, system map. [`macrostructures/19-map-diagram.md`](macrostructures/19-map-diagram.md)
- **20 · Ecosystem Index.** Multiple discovery surfaces: featured, latest, by category, by people. The platform's value is browsing, not declaration. [`macrostructures/20-ecosystem-index.md`](macrostructures/20-ecosystem-index.md)
- **21 · Component Playground.** Interactive code-and-preview blocks are the page's primary content. Each block previews a thing and shows how to copy it. [`macrostructures/21-component-playground.md`](macrostructures/21-component-playground.md)

---

## SaaS section deck: deal it, do not sequence it

When the shape is **Bento Grid, Stat-Led, Workbench or Marquee Hero** and the prompt is a B2B SaaS page, build from this deck. Cards have roles, not positions. The base of the deck is made of things the page can show honestly without inventing anything; the top of the deck exists only when the user handed over the material.

**Base cards** (always available):

| Card | Role | Composition |
| --- | --- | --- |
| Spec sheet | what it is, in figures the product ships with: limits, formats, versions, regions | Table or Rows (`layout.md` § 5) |
| Worked example | the product doing one real job on the user's material: a command and its output, a capture and its caption | Showcase or Split |
| Changelog | the last three or four entries with their real dates; the page proves it is alive | Rows |
| Comparison anatomy | the product beside the way it is done today, row by row, no scores | Table |
| Pricing table | the actual price, two or three tiers; "Contact sales" on every tier says the brand does not trust the buyer | `craft.md` § 9 Pricing |
| FAQ | real objections answered like a person; "Yes, both providers work out of the box" beats "integrates with leading providers" | [`macrostructures/06-conversational-faq.md`](macrostructures/06-conversational-faq.md) |
| CTA strip | the ask, once, one button | Band |
| Footer | the close, in the theme's voice | `layout.md` § 7 |

**Material cards** (exist only when the user supplied the material, and the Picks block names what was supplied):

| Card | Needs | Without it |
| --- | --- | --- |
| Hero visual | a real capture | the product built in a `data-slot` (`imagery.md` § 4), or a typographic hero; never a styled-div UI outside a slot (47c) |
| Logo row | the user's own customer marks, with permission to show them | the card does not exist; no invented marks, no "Trusted by" line (46a, 54) |
| Three features | three named capabilities, each with a capture or figure to show | fold them into the worked example or the spec sheet |
| Testimonials | quotes the user supplied verbatim, with the person's name, role and company as given | the card does not exist; no plausible names, no paraphrase (46a, 19) |

**Every deal deviates twice.** (a) Drop at least one base card and name it (the CTA strip is the usual cut; footer never drops). (b) Either promote a second base card into the hero's place (a spec sheet as the hero object says "the numbers are the pitch"; a worked example as the hero says "watch it work") or reorder one adjacent pair meaningfully (pricing before the example says "the price is the pitch"). State both moves in the Picks block: `deck: -cta +changelog` or `deck: -faq · pricing<example`. A deal that keeps at least five cards still reads complete; below five it is a landing strip, not a landing page: re-add cards or switch shape.

Cards part by the three `--section-gap` steps, mixed (59), and each fills its section (`layout.md` § 4).

The deck is not a template you stamp out: the shape determines how each card looks. A Bento Grid page interleaves the spec sheet and the example inside the grid; a Stat-Led page sequences them top to bottom under the figure; a Marquee Hero page lets the marquee carry the claim and the example carry the proof.

For non-SaaS work (Editorial, Manifesto, Letter, Long Document, Quote-Led) this deck does not apply. A bakery does not need a pricing tier comparison.

---

## How to pick

On a theme build the draw deals the shape (SKILL.md Step 2); these steps are for a swap the material forces, or a run without Node.

0. **Read the material inventory** (SKILL.md Step 2). A shape built on screenshots or figures needs them, real or as slots the user asked for; with neither, pick a shape that carries type and facts.
1. **Read the prompt.** Note any words that strongly signal one shape ("data heavy", "tell a story", "a list of links", "many small features", "personal note").
2. **Read `.hallmark/log.json`** (newest first) and the `shape:` field of any Hallmark stamp in the project; the last three shapes are excluded.
3. **Match the prompt to a shape** using the index lines above and § Domain to trio below, then open only the file you land on. Most prompts match two to four; pick the one most distant from the logged shapes, and check the mirror test in SKILL.md Step 2.
4. **State the pick once**, in the Picks block's Shape row and the stamp's `shape:` field.
5. If torn, take the domain's trio (§ Domain to trio) and pick the one most distant from the log.

Two pages Hallmark builds for two different prompts must look like different sites, not colour swaps of one template.

## The fingerprint: six axes

**1. Heading placement.** Left-margin (marginalia beside the body; a label beside a heading is an eyebrow, gate 54) · Hanging (the heading floats above in air) · Centred display · Bottom-aligned (the heading anchors the base, content above) · Overlapping (over a photo or colour block) · Sticky or pinned · Numbered by structure (a real `<ol>` with `counter()`, or one numeral at graphic scale) · Inline with the body (no break, the heading emerges from the prose). Any placement is fair; what reads as a mistake is a narrow auto-centred head over full-width left-flush content.

**2. Body composition.** Single column · Two-column asymmetric (wide body, narrow margin for captions) · Multi-column justified with hyphenation · Marginalia (sidenotes in the outer margin) · Three equal columns (reference density) · Full-bleed with margin reset (65ch body, pull quotes and images bleed) · Asymmetric spans (2-1-3 ratios on a grid).

**3. Divider language.** Hairline rule (0.5 to 1px, inset or full-bleed) · Ornament (a fleuron, a dot, a mark) · Negative space (the gap is the divider) · Bleed-colour block (a paper change is the edge) · Double rule. Pick one language for the page and vary its weight and placement by seam (9): the same rule at the same gap at every seam is the template.

**4. Button voice.** Solid (one filled primary) · Outlined · Unstyled link (an underlined word) · Oversized solid · Typographic only (a word in a weight, no box) · Form as CTA (the action is fill-this-field).

**5. Image treatment.** Full-bleed · Tightly cropped to the grid · Inline with the text · Margin-aligned · None.

**6. Reveal pattern.** Fade-up stagger (once, orchestrated) · Horizontal sweep · Type-unmask (a clip-path opening over text) · Number-tick (counters, only on real figures) · Typewriter (a terminal only, the caret inside a typed command) · None.

Fingerprint: one choice per axis, written `Hanging|Asymmetric spans|Hairline|Outlined|Margin-aligned|None`. Two rules: coherence (choices from the same world; a justified newspaper body wants a typographic CTA, not an oversized solid) and anti-repetition (no more than three of six axes shared with any of the last three logged entries; a None on Image or Reveal that the theme or the material forces is not a shared choice).

## Domain to trio, when the prompt names no shape

Three shapes from different families (grid-led, document-led, poster-led, product-led) that fit the domain, never three near-twins; the one most distant from the last logged shape is the pick:

| Domain words | Trio |
| --- | --- |
| podcast, audio, music, listening | Photographic · Quote-Led · Letter |
| shop, store, product, merch, commerce | Catalogue · Photographic · Bento Grid |
| docs, CLI, SDK, API, library, open source | Workbench · Long Document · Component Playground |
| platform, infra, observability, B2B tool | Bento Grid · Workbench · Stat-Led |
| agency, studio, case studies, portfolio | Portfolio Grid · Split Studio · Index-First |
| personal one-pager, about-me, resume | Long Document · Letter · Index-First |
| restaurant, café, bar, food, menu | Photographic · Long Document · Catalogue |
| fashion, apparel, beauty, lookbook | Photographic (with real photographs) · Catalogue · Marquee Hero |
| fintech, banking, payments, trading | Stat-Led · Workbench · Long Document |
| manifesto, campaign, cause, advocacy | Manifesto · Quote-Led · Stat-Led |
| editorial, foundry, magazine, type | Specimen · Long Document · Type Specimen |
| product launch, SaaS marketing | Bento Grid · Workbench · Stat-Led |
| conference, event, speaker | Marquee Hero · Manifesto · Photographic |
| no signal at all | Bento Grid · Long Document · Manifesto |

Developer docs and developer marketing are different prompts (a walkthrough wants Workbench; the landing wants Bento plus Stat-Led), as are a one-pager and a case-study portfolio; the Step 1 use decides. A vague tone word ("modern", "clean") is read through the genre and stated as an inference, never a second question.
