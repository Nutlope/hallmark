# Craft

Type, colour, surfaces, motion, copy, section openings, missing facts and finish, read on every page build, as numbers wherever a number exists. `layout.md` owns the canvas, the sizes, the sections and the hero; `imagery.md` owns the pictures; the theme supplies the material.

## 1. Type

At most two families, a display face and a body face (one family may do both). A third is one **outlier** with exactly one role (a wordmark, a headline figure, code; mono for code and measured figures counts as one); a second role makes it a third family in running use (37, F13). One family at different weights is one family.

- **Weights:** three at most across the page, display and body together (F19), picked as extremes: 300 beside 800, or 400 beside 700.
- **Sizes:** on a theme build, the roles in `layout.md` § 2, built on a 1.25 ratio from a 16px body, plus a wordmark size if the theme names one; a custom build sets its own scale from the scaffold's (`direction.md` § Mechanics). Hierarchy past those comes from weight and colour.
- **Display:** tracking -0.02 to -0.04em on a regular-width face, 0 to -0.015em on a condensed or very heavy one (two letters touching is a fault); line-height 1.0 to 1.15, tighter as it grows (1.2 reads as inherited; a mixed-case poster head may close to 0.92). An uppercase head that can wrap never goes under 1.0 (55a). A head is one weight, one style and one colour: one word set apart by italic, colour, weight or a highlight is the accented word (38i, 38iii); stress comes from a line break or a second line at a second size.
- **Display size:** `--text-display` (84px at 1440); a theme may set 5.5rem, 6rem when display-heavy, 7rem for a single word. A poster-scale theme or shape (Manifesto, Marquee Hero, a Poster hero) sizes with the screen, `clamp(4rem, 10vw, 9rem)`, full size at 1440 and held at 1920 (Floor 14), while the fold still holds the headline, one sentence and the action. A wide face takes the poster scale a step down.
- **Headline by length:** count the rendered `h1`: 20 characters or fewer, full display (a single word may reach 7rem); 21 to 50, display; 51 to 90, `--text-display-s` or split at the sense break with `<br>`; over 90, rewrite. A `<br>` goes only between phrases and is checked at 375, where it often lands badly; heads take `text-wrap: balance`, body copy `pretty`, so no head ends on a stub and no paragraph on one word (F26).
- **Heading measure** rides on the element in `ch` (the scaffold sets `h1` 20ch, `h2` 30ch, `h3` 40ch; a head at display-s about 24ch), never on the heading group's wrapper.
- **Body:** 16px minimum, line-height 1.5 to 1.65, measure 45 to 75ch (25); never all caps, never justified without hyphenation (F22), never tracked past 0.05em.
- **Labels, captions, table heads, meta, tags, chips, nav links:** the body face a step smaller, sentence case (lowercase on a theme whose voice is lowercase), untracked (67). Mono only for code, a figure or a measurement, or when mono is the theme's material (64). Capitals belong to a wordmark and to a theme whose display voice is uppercase, where a control may follow at 0.04em or less.
- **Required:** `font-display: swap`; a fallback of the same build (a grotesk to `system-ui`, a serif to Georgia), metric overrides only where published; `font-synthesis: none`, only the weights you use; `tabular-nums` on figures that compare (F6); `text-wrap: balance` on heads (F3) and `pretty` on body; curly quotes, a true ellipsis, a non-breaking space inside unit pairs (`10 MB`, `⌘ K`) in a proportional face.
- **Wordmark:** may take another face than the body, and on tone-rich themes should (`fonts.md` § The wordmark); one family throughout only when the body voice is the brand (a letter, a manifesto, a long document).

## 2. Colour

- **OKLCH everywhere.**
- **Four layers.** Paper (light: L 92 to 98, chroma 0.005 to 0.015 toward the anchor hue; dark: L 12 to 18, 0.008 to 0.015). Ink (on light paper L 16 to 24, on dark L 88 to 96, tinted 0.005 to 0.014). Five to nine neutrals between them, each tinted 0.005 to 0.018 (22). One accent at chroma 0.12 to 0.22 with a paired `--color-accent-ink` (41). A focus colour on the accent's hue, chroma 0.18 to 0.22, L within 5% of the accent.
- **Never a pure absolute** as a surface or an improvised value (7a, 7b); tint the greys toward the anchor.
- **The accent is a signal, not a fill:** under 5% of any viewport under the default Restrained posture (23): an active nav item, a focus ring, a link underline on hover, the primary control, the one series a chart argues from.
- **Postures,** declared in the stamp before code. **Restrained** (above). **Committed:** one colour carries 30 to 60% of the surface through `--color-field` or the paper family; the accent stays a signal. **Full palette:** three or four named roles (field, signal, seal, ink), each with a job and a footprint. **Drenched:** the surface is the colour; ink and rules derive from it. A declared surface colour is not accent footprint.
- **Contrast:** body 4.5:1 (target 7:1) or APCA Lc 60; large text, icons, focus rings and field edges 3:1 or Lc 45 (40). Every rule that paints a dark surface swaps its text colour in the same rule (41); grey text never sits on a coloured surface.
- **Bans:** gradients past three stops; purple-blue, purple-pink or cyan-on-dark anywhere (2a); glow shadows on dark, chromatic halos, spotlights (29); alpha as a colour's definition (alpha is for overlays and shadows); red and green as the only signal.
- **Dark mode** is opt-in and derived, never inverted (`dark-mode.md`).

## 3. Surfaces

- **A primary axis:** left-biased, right-biased, top-heavy or bottom-weighted. Centre-biased is a default, not a choice (6b).
- **Spacing is a scale:** `--space-3xs` 2px · `2xs` 4 · `xs` 8 · `sm` 12 · `md` 16 · `lg` 24 · `xl` 40 · `2xl` 64 · `3xl` 96 · `4xl` 144. A raw length where a token exists fails (24a); at most three optical nudges off the scale (24b). `gap` for siblings, `margin` only to break the flow.
- **Grids:** CSS Grid for the page, Flexbox inside components; flex children that must shrink take `min-width: 0`, icons and images `flex-shrink: 0`. No empty cell and no orphan on a last row: change the count (F20). Grids hold their column count above 1440, and `vw` visuals carry a `max-width` (44d).
- **The surface ladder:** whitespace, then a hairline (1px `--color-rule`), then a tinted well (`--color-paper-2` or `-3`, no border), then a card (a border or a shadow, never both, F24), kept for content that is independently interactive or of a different kind. Never white cards on a tinted page, a card in a card (4), or a bordered box inside a well; climb different rungs at different seams (9, F7). Sibling stats part with a top or vertical hairline: no leading padding on the first, no trailing on the last, the pattern reset wherever the column count changes.
- **Depth is weight and scale.** One shadow at most: `0 1px 2px oklch(20% 0.01 <hue> / 0.05)` or `0 0 0 1px oklch(30% 0.01 <hue> / 0.06)`. Elevated surfaces are never darker than their canvas. Eight z levels: base 1, raised 10, dropdown 100, sticky 200, sticky-nav 300, modal 400, toast 500, tooltip 600 (56).
- **Clipping:** `overflow-x: clip` keeps `sticky` and `fixed` working where `hidden` breaks them (34); the section holding a deliberate overflow keeps `overflow: visible`.
- **Radii:** one per level, concentric (`inner = outer - padding`, at least 2px); image radii `min(1vw, var(--radius-card))`.

## 4. The hero's motion

Size, posture and composition are `layout.md` § 6; what it shows is `imagery.md` § 1.

- **Entrance:** one settle of 0.4 to 0.8s including its stagger, from an already-visible default; a fade with an 8px rise is one motion. Never a fade, a sweep and a scale on one element; never bounce; never a starfield, a mouse parallax or an auto-rotating carousel.
- **Before it ships,** the hero's visual shows the real thing, is big, keeps the accent under its footprint and weighs under 2 MB with a reduced-motion fallback; any no changes the visual, never the copy.

## 5. Motion

- **Who decides:** the theme's Motion section; a shape's reveal runs only where the theme allows one, the genre's default only where the theme is silent.
- **Only `transform` and `opacity`** (10a); blur, `clip-path`, mask and shadow may join when they stay smooth on the element alone.
- **Easings:** `--ease-out` for arrivals, `--ease-in` for exits, `--ease-in-out` for toggles; never the browser's `ease`, `linear` only for progress and scrubbing, no overshoot on UI state (12).
- **Durations:** `--dur-micro` 120ms (press, tick, colour), `--dur-short` 220ms (hover, tooltip, menu), `--dur-long` 420ms (modal, drawer, accordion, reveal). Exits at 60 to 75% of the enter. Stagger 30 to 50ms between rows, 60 to 100ms between blocks, 500ms in all at most, once.
- **One reveal per page,** staggered by `--i`, 0.4 to 0.8s in all, content visible without it (62; `patterns.md` § One reveal). Under reduced motion every reveal shows its end state at once and the render tier shoots that way; what must still run (a loader, a 150ms fade) takes `.keep-motion`.
- **Scroll:** IntersectionObserver for reveals and threshold states; a passive, frame-throttled scroll listener only where direction matters; scroll-scrubbed motion only as one pattern from `scroll-choreography.md` (F8).
- **State:** hover is one signal (11) that raises contrast: a colour step, or a 1px lift at micro on a control that keeps its colour. Tooltips wait 800 to 1000ms on hover, 0 on focus (17); focus rings never animate (15); menus, modals and accordions follow `microinteractions.md`.
- **Never:** parallax, custom cursors, cursor followers, a marquee that will not pause on hover and focus (18), `will-change` on a whole class, a pulsing dot, a caret blinking past five beats, an infinite loop other than a loader, one small loop of 4s or less, or one ambient loop the theme declares (8s or slower). Every loop stops under reduced motion and off-screen, and one past 5 seconds carries a visible pause control (`patterns.md` § A loop that can pause).

## 6. Copy

Write as the owner would say it across a counter: the prompt's own nouns, a real place, a number the user gave, the verb a customer would use.

- **The swap test:** a head that would work on a competitor's page is rewritten with a noun only this prompt has. *Software that works for you* fits anyone; *Invoices that chase themselves* fits one product.
- **Three tests a line:** can the reader picture it, could it be proven false, could only this business say it. Specific beats clever: the place, the hour, the material, the result (*Sourdough at four, gone by ten*); a pun is a second-draft move, once a page at most.
- **The subhead** says what it is, for whom and the one difference, in twelve words or fewer. **Section heads** say what the visitor will see or get (*Three loaves a morning*), never a category label (*Features*, *Our story*, *Why us*); a staged shape's one-word stage names are the exception.
- **Rhythm:** a short line beside a longer one; verbs over adjectives; one idea a sentence; no triads of adjectives (*fast, simple, powerful*).
- **Budget** (58): headlines seven words or fewer, section heads six or fewer; section intros one line; paragraphs two short sentences; lists four items of a three-word label and a ten-word line (five for steps that cannot merge; past that, a table); tables five rows; a set the user gave keeps its true count; 450 visible words a page at most. Read only the headings and the hero: if they tell the story, the rest is the right length.
- **Refuse the generated voice:** everything gate 19 names, plus *Reimagine*, *Whether you're X or Y*, *It's not just X, it's Y*, *Say goodbye to*, *game-changer*, *journey*, a colon title (*Focus: the app for*), *Click here*, *Enter your email below*, a version string in marketing copy.
- **Buttons:** the verb of the action (*Book a fitting*); *Continue* only as a flow's second step. **Errors:** what happened, why if known, what to do; no *Oops*, no exclamation marks. **Empty states:** what is empty, why it matters, one action. **Loading:** a spinner after 150 to 300ms, shown at least 300ms, beside the label; *Loading…* past 2s.
- **Sample data** inside a built product uses `example.com`, the prompt's field names and values that read as samples (*Example Kitchen*, round amounts), never a figure a visitor could take as a claim (46a).
- **Punctuation:** curly quotes, `…`, a true apostrophe, no `--` and no em or en dash (a comma, a colon, a full stop or parentheses instead), a non-breaking space before units. A full stop on every standalone sentence, none on list items.

## 7. Opening a section

The reflex is a small tracked-caps label above the heading, and the reflex is the tell (54). Ask *what does the reader not yet know?* If nothing, open with nothing. If something, it rides on a fact, a destination or an identifier, never on a name for what comes next. Twelve ways in:

1. **Nothing:** air above, the heading flush.
2. **The heading announces itself:** the subject in its first two words. Usually the best move.
3. **A lead-in inside the paragraph** in a heavier weight, never on its own line.
4. **A drop cap,** one a page, first paragraph only.
5. **A rule that does more than rule:** hairline, fleuron, double rule, colour edge or pure gap; one divider language, varied in weight and placement from seam to seam (9).
6. **A numeral at graphic scale,** one a page at most and never in the hero by habit: `clamp(6rem, 16vw, 14rem)`, only when the number is real and is the point (an issue, a year, a price that is the offer).
7. **A real `<ol>`** with `counter()` when the sequence is genuine.
8. **A caption below** the content instead of a label above it.
9. **Marginalia** in the outer margin beside the body.
10. **A change of paper:** the band's edge is the break.
11. **A running head or folio:** continuous chrome at the page edge, legal because it persists rather than announces.
12. **Persistence:** the heading stays in view while its content scrolls beneath.

Two moves may share a section; three is noise. Use one opening, or two alternating, rotated against the log. Legal because each names something present: a `<figcaption>`, a `<th>`, a `<label>`, a `<legend>`, a nav or tab label, a byline or `<time>`, a unit after its figure, a code block's real filename, a live `role="status"` chip, one linked announcement that goes somewhere real, a plan name (which usually wants to be the heading).

## 8. Missing facts

Pictures, slots and the built product are `imagery.md` § 1 to § 4.

- **A missing fact** (a venue, a date, a price) is a text slot, never an invented value: `<span class="fill" data-fill="venue">Venue to be announced</span>` in `--color-muted` inside a dashed outline (`patterns.md` § A fact the prompt did not give), so it reads as a blank to fill, never as a link or selected text; two a page at most, each in the handoff. When the job's anatomy asks for more facts than the prompt gave (hours, an address, dates, prices), slot the two a visitor needs to act and let the rest wait in the handoff. Only a fact the page cannot do without takes a slot: a row, a column or a line that would hold nothing but a missing fact is cut, never announced.
- **A face the page is about** that the user has not supplied is a font slot: the display token names it first, a free face of the same build stands in and says so in one caption (stamp `waive 37`), and the handoff asks for the files.
- **A section the user named but gave nothing for** is its heading, one line on what will go there and one text slot, or it merges into a neighbour; never a block of pending rows.
- **A link whose URL the prompt does not give** points at the section of this page that does the most of it (`#lookbook`); the handoff names the URL it needs. Never an invented route.
- **A form whose endpoint the prompt does not give** carries an empty `data-endpoint`, says plainly that nothing was sent, and never prints a success state (70; `patterns.md` § A form that posts nowhere yet).

## 9. Finish

The last 2%; sloplint's F-checks (`gates.md` § 5) report most of it.

- **Controls:** one filled primary a page, dialogs counted as their own page (F4); secondaries outlined or typographic, never louder than the primary; nav actions quieter than the hero's. Marketing controls 44 to 52px, app UI 32 to 40px with a 44px hit target (48px on coarse pointers) (39b); two button sizes at most, 6px or more apart; an input matches the button beside it (39a). Delete takes a secondary style unless deleting is the page's one action.
- **Inputs:** constant border width; the focus ring an `outline` (inset on inputs), never a border change; disabled by `opacity: 0.55`, `cursor: not-allowed` and the native attribute together (39a); `min-height: 1lh` reserved for helper text (F14); 16px on mobile; a `name`, `autocomplete`, the right `type` and `inputmode`, a `<label>` or `aria-label` on every field; paste never blocked; submit enabled until the request starts, and a failed submit focuses the first invalid field; an explicit `type` on every `<button>`. Full recipe: `interaction-and-states.md`.
- **Testimonials** only when the user supplied them (46a): the attribution bottom-aligned, the avatar the real person or nothing; hanging punctuation on pull quotes.
- **Pricing:** emphasise a tier with its button and a word, never a different card colour; buttons aligned across tiers at the bottom; a taller featured tier is a grid sibling on explicit rows, never negative margins.
- **Tables:** sentence-case heads that never wrap, horizontal rules only, no outer border or card, full width. On a phone the column that names the row and the one that acts on it stay in view (F25): restack each row as a labelled block, or pin the first column.
- **Responsive:** body-adjacent UI (meta, nav links, controls) larger on a phone, stepping down at 60rem; body never under 16px; every desktop sidebar or filter column collapses into a menu or disclosure; container queries for widgets whose layout depends on their box.
- **Browser surfaces** (F16): keep what `base.css` themes (selection, caret, scrollbar, focus ring, underline).
- **Nav:** one line, 56 to 80px; a sticky one taller than the scaffold's `scroll-padding-top` raises it. Text links in one weight across states (state is a colour or a soft background, never a primary fill); a tab row scrolls sideways rather than wrapping; under 60rem, links that no longer fit go behind a menu; the logo links home with an `aria-label`.
- **The document:** `lang`, a `<title>` in the page's own words, a one-sentence meta description (F23); heading levels step one at a time (F21); every `<img>` has `width`, `height` and a file that exists (76).
- **Prose pages:** line-height 1.65 to 1.75, a measure of 60 to 75ch (25). **Stats:** a title that never wraps, no icon. **Features and metadata** are a `<dl>`, the `<dt>` one weight heavier. **A one-field form:** 20rem wide, never an input and a button sharing one border.
- **Assets:** `alt=""` when the subject is named beside the image; footer links at body weight; logo rows split evenly (3 + 3, never 5 + 1).
