# Gates

The one list of what Hallmark refuses. § 1 to § 4 load at Step 4 (§ 1 to § 3 drive the pre-emit pass, § 4 the build); § 5, the Finish checks and the judged clauses, waits for the Step 7 walk, § 6 for the two reviews. `scripts/sloplint.mjs` implements every gate tagged M and derives its tier map from this file, which wins on any disagreement.

## 1. How a gate binds

Every gate carries a **tier**, which says whether you may disagree with it:

- **Floor.** Never waivable. A gate is Floor when no admired page breaks it on purpose (correctness, access, honesty, the bans), or when it is a **house rule**, a reflex so reliably machine-made that Hallmark is stricter than the field: 54 (the eyebrow), 58 (the screen budget), 63 (template punctuation) and 67 (the tracked-caps label), and no others.
- **Reflex.** A default a language model falls into. A build with a real reason may waive one on the record; past three waivers sloplint notes a house style, which belongs in a `design.md`.
- **Finish.** Craft detail, invisible at arm's length: the F-checks (§ 5). Reported and answered, never blocking.
- **Ledger.** Bookkeeping about repetition (32). Reports at `NOTE`, never counts toward the verdict.

**Class** says who checks it: **M** sloplint's static tier (CSS and markup, Tailwind utilities in components included); **M/R** a static half plus the render tier (`--render`, or `--url` for a dev server); **R** the render tier alone; **R/J** render or judge; **J** judged at Step 7. When sloplint has run, walk only the J and R/J gates and the judged halves of M/R gates.

**Grades:** `FAIL` (Floor, nothing ships) · `REFLEX` (an unanswered Reflex: fix or waive) · `WAIVED` (guard satisfied, visible) · `WARN` (suspected: confirm or dismiss; a dismissal reports as `DISMISSED`) · `ANSWERED` (a Finish finding with a recorded reason) · `NOTE` (bookkeeping). `FAIL` and `REFLEX` report separately, so "0 FAIL" stays a true statement about the Floor. A finding marked `kept` comes from a redesign's record of what the page had (`redesign.md` § After) and binds like the Floor.

**Retired numbers stay retired:** 5, 13, 14, 21, 31, 35, 36, 43, 45, 51, 52, 57, 60 and 61 are never reused, so an older stamp still reads.

## 2. Waivers and answers

A Reflex gate is waived in the CSS stamp block, below the critique line:

```css
/* Hallmark · waive 47b · one frame, a real terminal capture inside · the terminal is the product being sold */
```

Three fields: the gate, the **guard evidence**, the reason. sloplint re-derives the guard; a build that cannot state its guard usually finds it does not hold. A waiver naming a Floor gate is rejected and the gate fires. One waiver per gate, named by its clause (`47b`, not `47`). The reason is about this page and shares a word with it; one under 24 characters, boilerplate, or reused word for word on another waiver is rejected. The log entry's `waived` field records them; the same gate waived on three consecutive builds is a house style, not an exception.

A Finish finding is answered the same way, `/* Hallmark · answered F3 · the display head is one word and cannot wrap */`; a `WARN` is confirmed and fixed, or dismissed on the record, `/* Hallmark · dismissed 58 · the window holds a five-row table, counted twice across the sticky pane */`.

Words the user insists on are material, not output: `copy: verbatim` in the stamp reports the copy gates (19, 58, 69) as notes. A redesign records what it gives up with `dropped` (`redesign.md` § After).

## 3. Pre-emit critique

Before the sweep, score the planned page 1 to 5 on six axes; anything under 3 triggers a revision first.

| Axis | 3 | 5 |
| --- | --- | --- |
| **P**hilosophy | has a tone | has an argument a reader could disagree with |
| **H**ierarchy | needs a second look | survives the squint test |
| **E**xecution | two or three loose details | would pass the gates first time |
| **S**pecificity | fits the category | could belong to no other product |
| **R**estraint | keeps one decoration too many | lost something you liked |
| **V**ariety | differs from the log on three of six structural axes | shares almost nothing with the last three runs |

Stamp: `/* Hallmark · pre-emit critique: P5 H4 E5 S3 R5 V4 · weakest: S, hero could be any dev tool; led with the real deploy log instead of a stock dashboard */`. Name the weakest axis and the fix taken; straight 5s name what was cut to earn them. Never invent a weakness to fill the field.

## 4. The gates

One line each. `a`/`b` clauses share a number and carry their own tier. Genre notes: **ed** editorial, **mm** modern-minimal, **at** atmospheric, **pl** playful.

### Colour and surface

| Gate | Tier | Class | The tell | The fix |
| --- | --- | --- | --- | --- |
| 2a | Floor | M | Purple-to-blue, purple-to-pink or cyan-on-dark gradient anywhere, `background-clip: text` included | one anchor hue, solid ink |
| 2b | Reflex | M | Gradient text in any other hue. Guard: a single-hue ramp (stops within 40°), both stops tokens, 40 and 41 pass | solid ink; weight or a display face |
| 7a | Floor | M | `#000`, `#fff`, `oklch(0% …)` or `oklch(100% …)` as a colour outside the token block | tint toward the anchor hue, chroma 0.005 or more |
| 7b | Reflex | M | A surface token that resolves to a pure absolute. Guard: stamp says `surface: absolute`, 40 and 41 pass. **mm** allows `#fff` paper | tint the paper |
| 22 | Reflex | M | Zero-chroma neutrals on a page with an anchor hue. **mm** exempt | chroma 0.005 or more |
| 23 | Reflex | M/R | Accent past ~5% of any viewport without a declared posture; the render tier fails past 8% (**at** 30%). A declared surface colour under a stated posture is not accent | retreat, or declare the posture in the stamp |
| 29 | Reflex | M/J | Glow and wash: aurora or mesh blobs behind text, floating blurred orbs, a chromatic radial halo or spotlight, a coloured zero-offset glow shadow on dark. **at** allows two fixed radial blooms, each 20 to 30% of the canvas, never animated | a solid or grained surface; elevation by lightness, shadows with offset and blur |
| 65 | Reflex | M/J | The named look on a custom or unthemed build: cream paper (L 90 or over, hue 55 to 105), a high-contrast serif display and a terracotta or clay accent (hue 15 to 55). A catalog theme carrying it is dealt only on its keywords. Guard: the prompt pins it | move one axis: the accent first, the paper second, the display last |
| 74 | Reflex | M | The stock swatch: a framework's default palette (Tailwind's indigo-500, violet-600, slate-900 and kin) as a token or utility. Guard: the pre-flight found it in the project | a colour mixed for the page in OKLCH |

### Type

| Gate | Tier | Class | The tell | The fix |
| --- | --- | --- | --- | --- |
| 1 | Reflex | M | Inter, Roboto, Open Sans, Poppins, Lato or a system face as the display | a display face from the theme or `fonts.md` |
| 25 | Reflex | M/R | Running prose `max-width` outside 45 to 75ch, or rendered lines of about 88 characters or more over three lines; a lede or caption of two sentences or fewer may sit from 28ch | `max-width: 65ch` |
| 37 | Reflex | M | More than three font families. Guard: a font slot (`craft.md` § 8) with its stand-in waived on the record | display, body, one outlier |
| 38i | Floor | M | One italic word inside an otherwise roman heading | a line break, or the whole head set one way |
| 38ii | Reflex | M | An italic display system. Guard: declared on `--font-display`, on every head at that level, true italic with `font-synthesis: none` | roman display |
| 38iii | Reflex | M/J | The accented word: one word or phrase in a heading set apart by colour, weight, a highlight or an underline. Guard: the theme names it as its signature and it appears once, in the hero | the whole head one way; a line break; a second line at a second size |
| 55a | Floor | M | An uppercase display head that can wrap with `line-height` under 1.0 | 1.0 at least, 1.02 to 1.08 recommended |
| 55b | Reflex | M | A single-line caps lockup under 1.02. Guard: it cannot wrap at 320px | leave it |
| 64 | Reflex | M | Mono as costume: monospace on labels, captions, meta rows, table heads or small type when neither display nor body is mono and the content is not code, a figure or a measurement. Guard: the theme's material is mono, or the text is code | labels in the body face, a step smaller, normal case |
| 75 | Reflex | R | Text that strains: running text under 12px, functional text under 11px, multi-line prose leaded under 1.3 | body 16px at 1.5 to 1.65; labels one step smaller |
| 67 | Floor | M | The tracked-caps label: a label, caption, table head, nav link, tag, chip or any text at 15px or under set uppercase or in small caps, or letter-spaced past 0.03em. House rule. Legal: a wordmark; a control on a page whose display is itself uppercase, tracked 0.04em or less | the body face, a step smaller, sentence case, untracked |

### Structure and layout

| Gate | Tier | Class | The tell | The fix |
| --- | --- | --- | --- | --- |
| 3 | Reflex | M/R | Card tells: three equal columns of icon-above-heading tiles, an icon in a rounded tile above a heading, a thick coloured side stripe on a card | vary widths and heights, inline icons, hairline or no border |
| 4 | Floor | M | A card inside a card | one containment layer |
| 6a | Floor | M | A hero sized in `vh` | `dvh` or `svh` |
| 6b | Reflex | J | A hero 92dvh or taller with no stamped `hero:` posture, or title, lede, action and mark all on one centred axis. Guard: 44b passes. **at** and **pl** reach the centred canvas as their normal answer | at most two centred elements; break one alignment |
| 8 | Reflex | J | The AI template (hero, three features, call to action, footer), or the same shape as one of the last three logged builds | build differently; read `.hallmark/log.json` |
| 9 | Reflex | J | Every section separated the same way with the same gap | climb different rungs of the surface ladder in different places |
| 24a | Floor | M | A raw `padding`, `margin` or `gap` length where a `--space-*` token exists | the token |
| 24b | Reflex | M | Off-scale spacing. Guard: three at most, each an optical nudge | the scale |
| 34 | Floor | M/R | Horizontal scroll at any width 320 to 1920; `overflow-x` missing on `html` and `body`; `100vw` widths | `overflow-x: clip` on both, `width: 100%` |
| 44a | Reflex | R/J | Hero content off centre for its posture, measured on what is painted (nav to first content, against last content to the next section): Settled, Banner, Corridor and Stage want the second 1.0 to 1.5 times the first; Ledge inverts; Poster waives when anchored; a custom hero is free | centre the content in its screen (`layout.md` § 6) |
| 44b | Floor | R/J | Headline, lede, primary action and the visual's focal point not all visible at 1280 x 800 without scrolling | pull the display clamp down, tighten leading, a two-line lede, trim padding |
| 44c | Reflex | R/J | At 1440 x 900 the next section starts above y 760 or below y 900, or the hero visual's centre is more than 60px from the text block's, or it stands more than 120px from the text or is pinned to the viewport edge. Guard: a Poster, Ledge or Banner posture, a Stage visual bleeding off the outer edge (the edge clause only), or a custom run | the visual beside the text; the hero fills its screen and only its screen |
| 44d | Floor | M/R | At 1920 x 1080 the container has no `max-width`, gutters under 120px, a grid gains columns, or the hero no longer fits | cap 1360 to 1520 and centre; hold column counts; cap `vw` visuals |
| 50 | Floor | M | An image-bearing grid track on bare `1fr`; a display head without `overflow-wrap: break-word; min-width: 0` | `minmax(0, 1fr)`; `break-word`, never `anywhere` |
| 53 | Floor | M | CSS-only radio tabs at `position: absolute; top: 0` with no JS guard (the page jumps on every click) | radios in flow at zero size, or a handler with `preventScroll` |
| 56 | Floor | M/R | Two `position: sticky; top: 0` elements (a section head sliding under the nav) | `top: var(--banner-height)` on the second; `--z-sticky-nav` above `--z-sticky` |
| 58 | Floor | M/R | More than about 80 words in any 900px window at 1440, or a hero with more than two text blocks before its actions. House rule | headline, one sentence, actions; a section is a head block, then its composition (`layout.md` § 4) |
| 59 | Reflex | M/R | A gap under 120px between sections at 1440 (64px where the paper changes), or every gap the same. Guard: a dense macrostructure that separates with rules and colour | 120px at least, varied |
| 71 | Reflex | R | The crowded head: two or more h2 to h4 nearer what precedes them than what they head (the space above under 0.75 times the space below and 12px or more short). Heads in a box under 200px tall are exempt | at least twice the space above a head as below it |
| 72 | Reflex | R | The cramped box: text in a filled or side-bordered box over 100 x 30px closer than max(8px, 0.5em) to its sides or max(4px, 0.3em) to its top and bottom (the em part capped at 24 and 12px), or running text within 8px of a phone's edge | pad the box; a 16px gutter |
| 77 | Reflex | R | The thin section: below the hero, a body spanning under three quarters of the container at 1440 that is not a statement, or a section with no mass (no visual 300px tall, no set of three across, no list or table of three rows, no statement at the section size). Guard: a band of one line and an action, once a page | widen the body to ten columns, add a visual, set a statement, or merge the section (`layout.md` § 4) |
| 78 | Reflex | R | Section heads too small: the median `h2` below the hero renders under 40px at 1440. Guard: a Long Document, Letter or Photographic shape, whose heads are inline or annotation | `h2` at `--text-section`, item titles at `--text-title` (`layout.md` § 2) |
| 79 | Reflex | R | The dead band: at 1440 x 900, more than 160px of nothing between the hero's lowest content and the fold or the hero's foot, whichever comes first. Guard: a Ledge or Poster posture | centre the content and grow the visual or the head; never fill with copy |
| 80 | Reflex | R/J | The drawn illustration: an inline SVG or CSS figure of an object, plant, animal, person, product, building, landscape or scene past icon size (the render tier flags an SVG of 120px or more with three curves or three fills and no text). Guard: a chart, map or diagram of real data or a real system, named as one (`class` or `aria-label`), or the user's logo | a photograph from the library or the user, the product built, or type at scale (`imagery.md`) |
| 81 | Reflex | R | The empty picture: a `data-slot`, or a gradient block 300 x 200px or larger, showing nothing but its wash: no image, video or built sample | the user's image, a library photograph (`theme.mjs photos`) or the product at full fidelity (`imagery.md` § 3) |
| 82 | Reflex | R | The counting device: 24 or more identical marks (ticks, dots, bars, squares) standing for a quantity, one for each bottle, identity or day. Guard: a chart whose marks differ in value or colour | set the number in type |
| 83 | Reflex | R | The photo wall: below the hero, photographs cover more than about a third of the page at 1440 (45% on a Photographic or Portfolio Grid shape), so it reads as a stock gallery. Guard: a gallery or portfolio of the user's own work | keep the strongest pictures, set big; carry the rest in the theme's material: type, figures, the product, a table (`imagery.md` § 5) |
| 84 | Reflex | J | The fake product: the page shows a built mock of a product that exists and could be reached (a URL, a running dev server, a project in the folder, an app on the machine), or a drawn interface where a screenshot belonged. Guard: the product does not run yet, or capturing it would show private data | run it, put it in a telling state and capture it with `scripts/capture.mjs` or the OS; frame the captures in the theme (`imagery.md` § 4) |
| 85 | Reflex | R | The stock close: the last section before the footer, or the footer, is an email sign-up (a form of one or two fields, one an email) on a page whose job is not one where a mailing list is native (subscribe, join, attend, listen, visit), or whose stamp names no `job:`. Guard: the user asked for a sign-up; a form whose button books, enquires, orders or starts the product | end on what the visitor came to do, in the form the job takes (the booking, the buy box, the download, the next date and the address, the latest issue), or on the last strong section (`anatomy.md`) |

### Chrome and copy

| Gate | Tier | Class | The tell | The fix |
| --- | --- | --- | --- | --- |
| 19 | Floor | M | Copy tells: placeholder names (Jane Doe), startup clichés (Acme, Nexus), buzzwords (seamless, robust, empower, supercharge, elevate, effortless, unlock, unleash, next-generation, world-class, best-in-class, industry-leading, mission-critical, future-proof), the rebuttal cadence three or more times ("Not a feature. A platform."), "quietly trusted by", em or en dashes, filler openers ("Built for the modern team", "In today's landscape"), a stock second action beside the primary (*Learn more*, *Get started*, *Book a demo*). A stock footer line (*All rights reserved*) is a `WARN`; the page's own name is never a cliché | say what the product does, in its own nouns |
| 20 | Floor | M | The Hallmark stamp missing from the first lines of CSS (build form or checked form) | write it |
| 42 | Reflex | M | Chrome by reflex: the AI nav (wordmark left, inline links, button right, hairline under) or the AI footer (four link columns, social row, copyright) without the stamp naming it | decide it and name it (`nav:`, `footer:`), or build another shape |
| 46a | Floor | M | An invented metric, testimonial, logo wall or case-study count | the user's number, a text slot (`craft.md` § 8), or nothing |
| 46b | Reflex | J | A bare figure as the hero's only headline. Guard: user-supplied and labelled | pair it with the line that says what it means |
| 47a | Floor | M | A hand-drawn browser bar (traffic lights, URL pill) or OS window title bar | a real screenshot in a `<figure>`, or no chrome |
| 47b | Reflex | M | A phone, laptop, terminal or editor frame. Guard: one frame, real content inside | one frame or none |
| 47c | Reflex | J | Imitation material: a hero "product UI" of styled divs outside a `data-slot`, a many-vertex `clip-path` standing in for a photo's edge, CSS bevels or embossing faking a physical object, a decorative grid or stripe background with nothing under it. Guard: the theme's material is geometry and the drawn thing is geometry, not a picture | the product built inside a slot, a real asset, or nothing |
| 54 | Floor | M | The eyebrow: short inert type before a heading that announces it, in any geometry (stacked, beside, pill, ordinal, category tag over a card, `TRUSTED BY` over logos). House rule. Legal: `<figcaption>`, `<th>`, `<label>`, a nav or tab label, a byline or `<time>`, a unit after its figure, a real filename, a live `role="status"` chip, one linked announcement going somewhere real | open the section another way (`craft.md` § Opening a section) |
| 63 | Floor | M/J | Template punctuation: meta strings joined with middle dots (`A · B · C`), an arrow glued to link or button text (`Learn more →`), decorative status dots before labels, `WORD - fragment` labels. House rule. Legal: one dot in a byline, a caption or a live state, a marquee's repeating separator. The script fires from two dots; one dot is judged | line breaks, columns, hairlines; a verb as the label |
| 66 | Reflex | J | Decoration text: rotated vertical text with nothing to say, scroll cues, a version badge or `BETA` pill in the hero, a weather or locale strip, a mono-caps strip under the hero, credit captions under stand-ins, a `01 / 4` count on tiles. Guard: the prompt is a launch, a venue or a distributed studio and the text is a fact | delete it; a lost fact becomes a caption or a footer line |
| 68 | Reflex | M | The wireframe page: more than five empty `data-slot`s on one page (a slot holding an image or a built sample is not empty), or four or more in one row (a team of blank portraits, a range of blank bottles). Guard: the user asked for that many slots and named them | set the set in type (names, roles, facts in a list or table); a slot that stays holds a library photo or the product (`imagery.md` § 3) |
| 69 | Reflex | M/J | The echo: one fact (a price, a time, a date, a count) printed in four or more sections (repeats inside one section count once), or a section's last line restating its heading. Guard: a ledger or table whose rows repeat a value by nature | say each fact once, where it does work |
| 70 | Floor | M/J | The fake send: a form or control that prints success ("Sent", "Reserved", "You're on the list", "Thanks") with no request behind it, or confirms something the prompt never offered | an empty `data-endpoint` and no success state until the form is wired; the handoff names the endpoint |

### Motion and interaction

| Gate | Tier | Class | The tell | The fix |
| --- | --- | --- | --- | --- |
| 10a | Floor | M | `transition: all`; animating `width`, `height`, `top` or `left` | list the properties; `transform` and `opacity` |
| 10b | Reflex | M | Transitioning `margin` or `padding`. Guard: a morph whose outer height is invariant (the scroll-morphing nav) | `transform` |
| 11 | Reflex | M/J | Hover effects: the same lift or scale on every card, more than one effect on one element, an image scaling or rotating on hover, a hover state on a non-interactive element | one signal per element, on the container, not the image |
| 12 | Reflex | M | Bounce or overshoot easing on UI state. **pl** with a declared spring posture may use it on the primary action and one character moment | exponential ease-out |
| 15 | Floor | M | A focus ring that fades in | instant |
| 16 | Reflex | J | A celebratory toast for an effect the user already sees | silent success |
| 17 | Floor | M | Tooltip focus delay equal to hover delay | hover 800 to 1000ms, focus 0 |
| 18 | Floor | M | Auto-rotating content with no pause on hover and focus | pause on hover and focus, and a visible pause control on anything moving past 5 seconds |
| 26a | Floor | M/R | An interactive element with no `:focus-visible`, a ring under 3:1 against what it is drawn over, or an outline removed with nothing in its place | a ring at 3:1 or better, instant |
| 26b | Reflex | M | Missing `:active` or `:disabled`. Guard: not a form control, no `aria-disabled` anywhere | all eight states |
| 27 | Floor | M | A keyframe or transform transition without a `prefers-reduced-motion: reduce` fallback (`transition: all` over a hover transform counts) | add it |
| 28a | Floor | M | A video autoplaying without `muted`; `loading="lazy"` on the LCP element | `autoplay muted loop playsinline`; `fetchpriority="high"` on an LCP image, a preloaded poster for an LCP video |
| 28b | Reflex | M | Video without `poster` or a priority hint. Guard: below the fold and not the LCP | add them |
| 39a | Floor | M | Input states that break: border width shifting between states, a focus ring built from `border`, an input taller or shorter than its adjacent button, disabled by opacity alone | constant border, `outline`, shared height, three disabled channels (opacity, `cursor: not-allowed`, the native attribute) |
| 39b | Reflex | M | Control height outside 44 to 52px on a marketing page. Guard: app UI at 32 to 40px with the hit-target expansion | the number |
| 62 | Floor | M | Content hidden at rest: a reveal class setting `opacity: 0` or `visibility: hidden` that depends on JavaScript to show it, with no `.js` scoping, no self-running CSS animation and no `@starting-style`, so the page ships blank when a script fails | visible by default; hide only under a `.js` class, or animate from visible with `@starting-style` |

### Assets and access

| Gate | Tier | Class | The tell | The fix |
| --- | --- | --- | --- | --- |
| 30a | Floor | M | An emoji standing in for an icon | one icon library, custom SVG, or typography |
| 30b | Reflex | M | Two icon libraries on one page. Guard: the second is a brand or platform mark in two slots at most | one library |
| 33 | Floor | M | A decorative `<svg>`, `<canvas>` or CSS-art element with neither `aria-hidden="true"` nor a label | hide it or name it |
| 76 | Floor | M/R | A broken image: an `<img>` with no source or one that does not load; a library photo with no credit on the page; a paid stock photo (a free stock hotlink is a WARN) | the real file, or a library photo credited in the footer (`imagery.md` § 2) |
| 73 | Floor | R | Text painted under another element: an opaque box, an image or another run of text covers a line of it (sticky and fixed chrome excepted) | give the text its own space, or its own surface above the cover |
| 40 | Floor | M/R | Text, icon, focus ring or a field's edge under its contrast threshold against its computed background (body 4.5:1 or APCA Lc 60; large text, icons, rings and field edges 3:1 or Lc 45) | fix the pair; a field edge takes `--color-muted` |
| 41 | Floor | M/R | Button text within 5% L and 0.05 chroma of its fill; `--color-accent-ink` missing where the accent carries text; a dark panel that does not swap its text colour; grey text on a coloured surface | the paired ink token |
| 48 | Floor | M | A colour or `font-family` literal outside the token block | lift it into the tokens |
| 49a | Floor | M/R | A button label or primary nav link wrapping at any width 320 to 1920 | shorten it; `white-space: nowrap` |
| 49b | Reflex | M/R | A footer link, tab or breadcrumb wrapping. Guard: a real phrase that cannot shorten, two lines at most | shorten it |
| 32 | Ledger | J | The same section compositions in the same order as a logged build; a fingerprint sharing more than three of six axes with a logged entry | change a composition or the order; say the delta in the stamp |

## 5. Finish checks and judged clauses

Loaded at Step 7, with the sweep's findings in hand.

### Finish (F-checks, never block)

F1 straight quotes in prose · F2 `...` for an ellipsis · F3 no `text-wrap: balance` on display heads · F4 more than one filled-primary button recipe on a page (dialogs count as their own page), or two filled buttons side by side · F5 an icon in a coloured coin · F6 display-size figures without tabular numerals · F7 one container recipe stamped on six or more selectors, or the pill radius on five or more selectors that are not controls, tags or badges · F8 more than one scroll-choreography pattern · F9 fake-human avatar hotlinks (this half is a FAIL) or person-keyword stock URLs · F10 a Lottie where CSS or SVG would do · F11 a highlighter band at the baseline instead of behind the x-height, or an underline thicker than 2px or offset more than 0.25em · F12 a flex row of unequal heights without `align-items: center` · F13 the outlier face carrying more than one role · F14 a helper-text slot with no reserved `min-height: 1lh` · F15 page invariants broken: more than one primary button style, container width, column gap below the hero or radius per nesting level, or more centred heading groups than left-aligned ones · F16 browser surfaces unthemed: no `::selection`, `caret-color` or `scrollbar-color` on a page with a committed palette · F17 a text block squeezed into a sliver at 1440 (under about 16 characters wide over four lines or more) (render) · F18 a `data-slot` rendering under 40px in either dimension at 1440, or a page with slots and no `hallmarkSlots` script (render) · F19 more than three font weights in running use, display and body together (render) · F20 a grid or wrapping row leaving one item alone on its last row under a fuller row (render) · F21 a heading level skipped · F22 justified text without `hyphens: auto` · F23 a document without `lang`, a `<title>` or a meta description · F24 a hairline border under a wide soft shadow (24px or more of blur after a negative spread) on one surface · F25 content a phone never gets: about 40 words or more shown at 1440 and hidden at 375, navigation aside, or a table opening with two or more columns off-screen (render). · F26 a paragraph that leaves one word on its last line, or a head of two or three lines ending on a stub, at 375 or 1280 (balance the head, `pretty` the copy, or rewrite)

### Judged clauses

The gates above that a script cannot settle, with enough to judge them well.

**6b, the hero shape.** A hero built around one centred object is a composition; four things stacked on the centre line is a default. Prefer at most two centred elements with one breaking alignment (margin-aligned, right-flush, numeral-anchored). A hero with a stamped posture fills its screen (`layout.md` § 6); an unstamped one stops short of 92dvh.

**8 and 32, repetition.** Read `.hallmark/log.json` newest first. The page's shape must differ from the last three; the six structural axes in `macrostructures.md` § The fingerprint are the ruler, and the log's `fingerprint` field is what you compare against, never memory. The same composition twice in a row on one page is the template; across pages, a different order or a different lead composition is enough.

**9, section rhythm.** Whitespace, hairline, tinted well, card: the surface ladder in `craft.md`. A page that climbs the same rung at every seam reads as a template; one that climbs different rungs in different places reads as set.

**11, hover by judgement.** One signal per element. Feedback belongs to the container, never to an image. Non-interactive things do not react to the pointer.

**16, toasts.** If the effect is visible, no toast. Toasts are for failures and invisible effects.

**23, footprint by eye.** Count solid fills, large accent headings and full-bleed accent bands against the 1280 x 800 fold. A declared Committed, Full-palette or Drenched posture moves the colour into surface tokens; undeclared sprawl still fails.

**29, glow and wash.** The bloom is the tell whether it is drawn with a shadow or a gradient. Atmospheric earns two fixed blooms because the canvas is the design; everywhere else the surface is paper or ground, and depth comes from lightness steps and shadows with offset and blur.

**38iii, the accented word.** One word in the accent colour, in bold or on a highlighter band: after the eyebrow, the most common machine-made head. A head is one weight, one style and one colour. Three themes carry an accented word as their signature (Manifesto's red word, Lumen's coloured verb, Riso's misregistered word); they stamp the waiver and place it once, in the hero.

**44, the fold.** Three widths, one question each: at 1280 x 800 is everything the hero has to say inside the screen; at 1440 x 900 is the hero exactly one screen, its content centred in it, with its visual beside the text; at 1920 x 1080 does the container hold and the hero still fit. A custom hero answers the first and the last. Fill a short hero with the visual or the headline, never with more copy.

**46b, the bare number.** A figure is a headline only when the page is built around it and it carries its unit and its source.

**47c, imitation material.** The question is whether the thing pretends. A sample of the product inside a `data-slot`, its values reading as samples and named in the handoff, does not pretend; a styled-div dashboard with invented figures standing as proof does. Geometry that is geometry (a diagram, a chart, an animated line) is a first-class medium; geometry pretending to be a picture is the tell. Grids and stripes need a canvas, a map or a measuring tool under them.

**54, the eyebrow test.** Small type before a heading survives only when it carries a fact, a destination or an identifier the reader would otherwise lack. Delete the line and read the page: if nothing was lost but a name for what comes next, it was an eyebrow. The fix is never bare deletion; `craft.md` § Opening a section has twelve other ways in, and where the heading under it is figurative the plain label becomes the heading.

**58, the screen budget.** Nobody reads a landing page. A visitor takes one idea per screen or leaves. About 80 words per 900px window, labels and cells included; the hero is a headline, one sentence and its actions.

**62, hidden at rest.** Reveal patterns must be visible with scripting off. The safe shapes: `.js .reveal { opacity: 0 }` with the class added by the script, or a CSS animation from visible that reduced-motion collapses, or `@starting-style`.

**63, template punctuation.** The middle dot as a universal separator, the arrow as a universal suffix and the coloured dot as a universal prefix are the punctuation of generated pages. One dot in a byline, a marquee's separator and a dot that conveys live state are legal.

**65, the named look.** Cream, high-contrast serif, terracotta: the most recognised generated look, and the one a warm, bookish or family prompt pulls a model toward hardest. A catalog theme that carries it was vetted as a material and is dealt only when the prompt's keywords ask for it, so the gate reads custom and unthemed builds; there `direction.md` refuses it first.

**66, decoration text.** The agency-portfolio tics: rotated labels, scroll cues, version pills, city-and-weather strips, mono-caps strips under the hero, credit lines under stock images. Each says "designed" without carrying a fact. A fact stays; a decoration goes.

**67, tracked caps.** The small uppercase line with its letters spread apart, whether it sits above a heading, heads a table, names a tag or runs the nav. Delete the transform and the tracking and read it again: a label in the body face at a step smaller says the same thing without announcing that a machine set it. Capitals survive as a wordmark, and as the display voice of a theme built on them, where a control may follow.

**68, the wireframe page.** A page that promises material it does not have shows it as frames: six blank portraits under "Six instructors", four tall empty phones in a row, four grey bottles. Each frame is honest on its own; together they read as a wireframe somebody forgot to finish. Set the set in type, and keep a slot or two where the user's images will land, each holding a library photograph or the product built.

**69, the echo.** A thin prompt tempts a builder to say its few facts again: the price in the hero, on every card, in the FAQ and the footer. Each repetition reads as filler. Say a fact once, where it does work.

**70, the fake send.** A form that answers "Sent" to nobody is an invented outcome, as dishonest as an invented metric. Until the endpoint exists, the form validates, posts nowhere, and says so plainly ("Nothing was sent; this form is not connected yet").

**77 to 79, a full page.** The failure these catch is the opposite of clutter: a page of small things on a wide canvas. A screen that holds only a heading and a line, a narrow column with the right half empty, a 36px section head under an 84px hero, a hero whose content stops at 60% of the screen. The fix is mass, never more words and never a smaller gap: a bigger visual, a wider body, a head at the section size, a statement set large. `layout.md` § 4 and § 5 hold the compositions that fill a section within the 80-word screen.

**80 to 82, pictures.** A page that shows nothing real reaches for three substitutes: a drawing of the thing (a loaf, a sprig, a mascot, a mountain in strokes), a coloured box where the photograph should be, and a row of marks that counts what the copy could state. Each reads as generated at a glance. The library has the photograph; the product can be built; the number can be set large.

**83, the photo wall.** The opposite failure: a page that is all photographs, one after another, reads as a stock gallery, and the theme never gets to speak. Keep the pictures that carry a fact, set them big, and build the sections between them from the theme's material (its Range).

**84, the fake product.** Ask where the product is before building one. A prompt that names an app, a site or a tool that exists, a folder holding its code, or a URL means the page shows captures of it: the main screen, a detail, a second screen, the phone view. A built mock is right only for a product not built yet, and its handoff names the screens to capture later.

**85 and the stock anatomy.** The close is the visible part of a deeper habit: hero beside a picture, a figure row, three steps, a split, a showcase, an email band. Judge the whole page against `anatomy.md`: is the job's action where real sites in the category put it, are the category's own sections here (the menu, the lineup, the issues, the record), and could this exact sequence of sections sit under a different business's name? If it could, the page has no anatomy of its own yet.

## 6. The reviews, in fresh context

The thread that built the page is its weakest reviewer. Two reviews run with no inherited transcript (a subagent in Claude Code): the **hero review** once at Step 6, before any section below the fold exists, and the **finish review** at Step 7. When a subagent can run them, do not read their prompts yourself: start the reviewer with *Read `<skill-dir>/references/review-hero.md` (or `review-finish.md`) and follow it* and pass these, files as paths and lines as quoted text. The hero review: the four `hero-*` screenshots, the stamp's first two lines, the Picks block's Material and Signature rows, the theme's picture. The finish review: the render tier's screenshots, the page's HTML or component source, the stamp's theme or idea line, the theme file and its picture, the hero review's findings with how each was settled, `gates.md` § 4, and on a redesign the `before` screenshots. Run it in the foreground, since the build waits on its first word (in Claude Code, `run_in_background: false`), never behind a timer or a wake-up.

Act on its first word. `recapture` means the screenshots were wrong (a fallback face, a blank frame): retake them and start the review again; it does not use up the one round. Otherwise fix what is real, recapture the same shots (`--stage hero` for the hero), and score each finding yourself against its recapture: `resolved`, `partial` or `unresolved`, with a reason. Send the recaptures back for one scoring round only when the first word was `rebuild` or a finding named a Floor gate; scoring is not a second review. Record the outcome in the stamp, hero first: `hero-review: fix · 4 findings · 4 resolved`, then `finish-review: subagent · 5 findings · 4 resolved 1 unresolved · gap: none`. No subagents: then, and only then, read the prompt, re-read the artifact cold, run the prompt against yourself, and record `in-thread`.

**Nothing ships with an open `FAIL` or an open `REFLEX`.** A Floor finding is fixed; a Reflex finding is fixed or waived; a Finish finding is read and answered.
