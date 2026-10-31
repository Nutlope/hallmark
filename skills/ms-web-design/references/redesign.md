# Redesign

Loaded only when the user names Hallmark with `redesign` or `audit` (`/hallmark redesign <target>`, *redesign the site with Hallmark*). A request that changes an existing design without naming Hallmark (a restyle, new colours or a new theme, a polish, a redesign, a small edit) never loads this file: it is done as asked, in the project's own system. A redesign is a build whose material is the page that exists: SKILL.md still binds, and this file says what the run keeps, what replaces the Step 1 ask and what the sweep adds. The target is the user's own code (a file, a folder, a route on a dev server); a live URL with no source behind it can only be audited, through `--url`.

## What a redesign keeps

- **The content.** Every fact, claim, name, price, date and quote the page states. Figures, quotes and logos already there are the user's material: carried over as found and listed in the handoff to verify, one a gate doubts (a trend nobody measured, 46a) included. Nothing is added: no action, section, claim or picture the page did not have, beyond what the user hands over and what a gate requires (a pause on a loop, 18; a focus ring). A drawing made from the page's own facts (its channels, its steps, a figure) is composition, and full depth may make one.
- **The wiring.** Every link, form, field, handler, route, id and test hook; every script, data call and analytics call. Edit markup inside the component that owns it. Never move logic, rename a prop, or drop a `name`, an `id`, a `key`, a `type`, an `href` or a `data-testid` that a script or a test reads. A prop the Floor empties (an emoji passed as an icon) may go with it, named in the handoff. A state the screen has no logic for (a failed load, an undo) is listed for the owner, never built.
- **The files.** No file deleted, no route removed and no component tree replaced without a file-level plan the user approved, and no test edited to make the redesign pass. Documents in the repo (a README, a prompt, a deck) explain the product; they are not page copy. In a git project, start from a clean tree, `.hallmark/` aside (ask the user to commit or stash; never do it for them), so the redesign is one diff they can read and revert. The stylesheet is the redesign's to edit: the append-only rule guards it from a build, not from its own redesign.
- **The brand,** when there is one. A brand is chosen: a logo, a colour or a face the project names (a brand file, a logo asset, named tokens, a font file of its own) or the user states. It stays at every depth, its values read from the project's files, never from memory. A framework default or a look the gates name (the purple-to-blue gradient, Inter as the display, a stock swatch) is not a brand: restyle and full replace it, and the Picks block says so in case it was. A locked `design.md` is the system at every depth.
- **The words,** unless a gate names them. Wording that fails a copy gate (19, 54, 58, 63, 69) is tightened from the facts already on the page, and the handoff lists every changed line, before and after. An eyebrow is never just deleted: where its heading is figurative, the plain label becomes the heading (*Opening hours* over *When to find us* becomes *Opening hours*). Terms, disclaimers and consent text are never reworded. When the user says to keep every word, stamp `copy: verbatim`: 19, 58 and 69 then report as notes.

## Depth

The verb is a **full** redesign: the content and the wiring stay, the system and the composition change. A lighter depth runs only when the same request asks for it in so many words, and the Picks block names the depth:

| Depth | Stays | Changes | Only when the request says |
| --- | --- | --- | --- |
| **full** | the content and the wiring | the system and the composition: shape, hero, section objects, chrome | nothing else: it is the verb |
| **restyle** | the layout | the system: colour, type, radius, shadow, motion, the controls | *keep the layout*, *restyle*, *reskin*, *only the colours and type* |
| **polish** | the system and the layout | only what a gate names: the tells, contrast, states, motion, tokens | *polish*, *keep our look*, *only fix what looks generated* |

The depths do not blend: a polish that finds the concept wrong says so and recommends the full run, it never smuggles one in.

**Full depth on an app screen** recomposes each screen inside the shell it has: what leads, and how the figures, tables and forms are arranged (`flow.md` § App screens). Routes, destinations and each component's logic stay; there is no hero stage and no hero review.

*From scratch* is a build, not a depth: SKILL.md as written, the old page as its Step 2 inventory, in new files beside the old ones.

## Before

1. Run the pre-flight (Step 0), then list the pages in the target: route, file, and whether each is a page or an app screen (`flow.md` § App screens). In a framework project start the dev server and record through `--url`; the linter does not render the empty shell `index.html` from disk. An unstamped page has no genre: infer it from the page as Step 1 would from a prompt, and say so.
2. Record the page as it stands:

```
node <skill-dir>/scripts/sloplint.mjs <target> --genre <genre> --render --before [--url <route> ...] [--scope app]
```

It prints the findings grouped by gate and writes them to `.hallmark/before.txt`, the screenshots to `.hallmark/before/` and the record to `.hallmark/before.json`: every link, form, field, inline handler, test hook, script tag, selector a script queries, heading and figure. Git ignores the folder's screenshots and records.

3. Look at the screenshots before you weigh the findings, so the linter does not write the verdict, then give the read in four lines: what the page is for (the audience, the one action); what works and stays (at least one thing); what reads as generated (the worst tells, by gate); what is broken.

**`audit <target>` stops here.** It loads `gates.md` § 1, § 4 and § 5, walks the judged gates from the screenshots, and reports the findings by tier with `file:line`, the read, the lightest depth that settles them and what only a deeper one would. It changes none of the project's files.

## The ask

One message replaces the Step 1 ask; skip it when the request already answers it or no one can answer:

> *Before I redesign, three things. 1. **What must stay**: the brand, a section, a page? Say *keep the layout* and I only restyle. 2. **What is wrong with it**, in your words, and the feeling you want instead. 3. **Anything new to show**: screenshots, photos, numbers, a quote. Or say **go ahead** and I will redesign it in full.*

## The plan

The Picks block opens with four rows of its own, and nothing is deleted until the user has seen the Files row:

```markdown
- **Redesign** · full · 3 pages (/, /pricing, /docs)
- **Before** · Floor 14 FAIL · Reflex 9 · a centred template in a stock indigo; the pricing table is clear and stays
- **Keeps** · every link, field and handler · the green and the brand face · the pricing table
- **Files** · edit: app/page.tsx, app/pricing/page.tsx, app/globals.css · create: app/tokens.css, app/base.css · delete: none
```

Then the build rows the depth reaches: Theme at restyle and full (dealt, `brand` or locked); Shape, Chrome, Hero, Signature and Sections at full only, where Step 2 runs with the page's own content as its inventory. At polish the block stops after Files. The deal's `--prompt` is the read's first line (what the page is for, in plain nouns), never the page's own copy, which is what the redesign is leaving behind.

## Build

- **Polish** is `flow.md` § The sweep, on the user's own page: fix in place, single elements and tokens, never restructure, under the check stamp with `built: the project · redesign: polish`. It loads `gates.md` § 1 to § 5 and `patterns.md`, `interaction-and-states.md` when the page has a form, the theme file an old stamp names, and from `craft.md` only the section a finding points at.
- **Where the layout stays** (polish and restyle), the stamp's `redesign:` field tells sloplint to report the layout gates (6b, 8, 9, 32, 42, 44a, 44c, 58, 77, 79) as notes; at polish the spacing and scale gates (24b, 59, 78) too, so a polish does not re-space a site it was asked to keep. Print them for the user with the depth that would settle them; do not rebuild them. At every depth 58 (the screen budget) is a note too: the words are the owner's, and only a copy gate cuts one. In app scope those gates are skipped, so the handoff's Layout row comes from the read and the review. A theme's own composition rules (its do-nots, the dials that vary between pages) yield to a kept layout: the theme lends its system, and every page takes one dial set.
- **Restyle and full** start from the scaffold, with the depth in the stamp: `theme.mjs scaffold <slug> --redesign <depth>`, or `scaffold --brand --redesign <depth>` for a kept brand, its tokens filled from the palette and faces the pre-flight found (no `check`: the coordinates are the user's); add `--scope app` for app screens. It writes `tokens.css` and `base.css` beside the project's stylesheet and prints the imports that fit it (`export-formats.md` has the Tailwind and shadcn names). Then the shared components and the chrome, then the pages, the most visited first, each swept before the next.
- **More than one page** at restyle or full: lock the system once the scaffold has run (`design-md.md`). Every page reads it and the variety rule inverts: pages share theme, type and accent, and differ only in shape. One stylesheet for several pages lists a hero posture per route, `hero: Settled (/), Stage (/contact)`. Past three pages, give each page to its own subagent where the harness has them, with `design.md`, the page's files and this file.
- **Full depth** runs the hero stage and the hero review; polish and restyle skip both. The old sections still sit below the new hero at that stage: the stage judges the first screen alone, and what it reports below the fold waits for the sweep. Gate 8 judges the composition, not the order of the content: a kept sequence in a new composition is waived on the record.

## After

1. The sweep, against the record: `sloplint <target> --genre <genre> --render --kept`. Anything the page had and no longer has is a `FAIL kept` (a link, a form, a field, a handler, a test hook, a script, a selector a script still queries) or a `WARN kept` (a heading, a figure, an image, an id). Restore it, or put it on the record in the stamp: `/* Hallmark · dropped /blog, #team · the user is retiring the blog and the team section */`, or for a line a copy gate named, `/* Hallmark · reworded "Built for modern teams" to "Out of your way" · 19 names the opener */`, or `dropped "<the line>" · 69 names it` for a line a gate cuts whole. The run also writes `.hallmark/compare.html`, the before and after screenshots side by side: give the user its path.
2. The project's own checks, where it has them: the type check, the build, the tests. A redesign that breaks one is not finished.
3. The finish review also takes the `before` screenshots and answers what the old page did better (`review-finish.md`). A polish hands it only the full pages at 1440, before and after, and takes at most five findings. A finding that is a plain defect (a misalignment, a broken glyph, a label that lies) is fixed at any depth; one that asks for a new composition joins the layout findings; one that asks for content the page never had goes to the owner in the handoff.
4. The log entry carries `mode: redesign`, `depth` and `scope` (page, site or app), plus the build's fields at full depth.
5. The handoff, ahead of the material ask; where the layout stayed it adds a Layout row (the findings only a full redesign would settle):

```
Redesign · full · 3 pages
Before   Floor 14 FAIL · Reflex 9
After    Floor 0 · Reflex 1 waived (47b)
Kept     14/14 links · 5/5 fields · 9/9 handlers · 11/11 headings · every figure
Changed  the system and the composition: shape, hero, sections, chrome
Dropped  none
Yours    2 claims kept as found ("50,000+ teams", the Acme quote) · 4 lines reworded, listed below
Compare  .hallmark/compare.html
```
