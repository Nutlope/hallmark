# ms · Art direction: from references to design.md

A phase that runs before Step 1 when the user brings references (URLs, screenshots, a moodboard folder), names a territory from `ms-esteticas.md`, asks for a visual direction, or asks for inspiration. Never on silence, never in component scope, never under `--fast`. Its one output is the project's `design.md`; the ordinary flow then builds from it.

## The brand comes first

When the project has a client system (a client `design.md`, `.hallmark/brand-spec.md`, or a design system the user names), the direction works inside it. References then decide only what the brand leaves open: composition, density, image treatment, navigation, motion. They never change its colours, faces or marks.

Leaving the brand is an explicit request, never a default: *inspiration outside the brand*, *explore beyond the brand*, or the same in other words. Then the run is an exploration: write it as exploracion.md in `.hallmark/`, leave the client `design.md` untouched, and change it only when the user approves a direction by name.

## 1. See every reference

Judge only what you have seen: a screenshot the user gave, or a capture you take with `node <skill-dir>/scripts/capture.mjs <url> --out .hallmark/refs --full`. A reference you cannot open is not described from its name or its reputation: ask for a screenshot, or for what the user likes in it.

## 2. Read by dimension

For each reference, one short line on each dimension where it says something, and nothing where it is silent:

- **Type:** families and how they relate, scale, contrast, measure, editorial or interface voice.
- **Colour:** how many hues, what the ground does, whether colour builds structure or decorates.
- **Layout:** grid, alignment, margins, full bleed or contained, how a page paces.
- **Density:** quiet or packed, and where it changes.
- **Images:** scale, crop, frame, captions or annotation, raw capture or staged.
- **Navigation:** where it lives, how persistent, how much the visitor must learn.
- **Motion:** what moves, when, and whether it explains a state or only decorates.
- **Details:** the small recurring things (rules, numbering, labels, captions, texture).

Then keep the few lines that matter. This is a reading, not an inventory.

## 3. Patterns and tensions

What repeats across references is the user's taste: name it. Where two references pull apart (dense and sparse, still and moving, heavy chrome and none, loud type and quiet type), name the tension and decide it. Never average two references into a middle neither of them is.

## 4. Give each reference a job

- **Dominant:** one reference sets the system (type, grid, colour behaviour).
- **Supporting:** the others lend one ingredient each, and say what is *not* taken from them.
- **Signature:** at most one or two places where the system gets louder. The page still has one Signature as SKILL.md defines it; a supporting detail repeats quietly, and there are two of those at most.

A combination is a set of roles under shared rules, never a collage of everything on the moodboard.

## 5. Test the direction against the real site

Two questions before any direction is proposed. What should this site make easy to believe about its owner? Does the direction survive the real content: how many pieces of work, how much text, how good the pictures are, what is confidential? A direction that only works with one perfect hero image fails here.

## 6. Two or three directions, then one

Never more than three. For each:

- **Name** and one sentence of idea.
- **Why it fits:** the content and the goal, not the taste alone.
- **What it takes,** reference by reference.
- **Risk:** how it could turn generic, derivative or hard to use.
- **The owner's part:** the one place their own material makes it theirs.

Recommend one and say why. On a custom run the three sketches of `direction.md` become these three.

## 7. The HTML test

Every direction must hold with scripting off: the whole content reads in HTML and CSS, in order, and the work is reachable in one or two steps from the landing screen. Motion and interaction are a layer on top (Floor item 7, gate 62). A direction whose content needs script to appear is reworked or dropped; a motion-led one goes through `ms-movimiento.md`.

## 8. Translate into this skill's terms

Name the genre, the base (a catalog theme, or custom through `direction.md`), the shape, the nav, the motion posture and the `ms-esteticas.md` territory it came from. Vague words become visible decisions: never *premium*, *modern* or *clean* without the type, spacing or colour choice that makes it so.

## 9. Write design.md

At the root, before the build:

````markdown
# Design: <project name>
Origen: ms-web-design (dirección de arte, <yyyy-mm-dd>)

## Dirección
- Character: <3 to 5 words, each one visible on the page>
- Idea: <one sentence>
- References: <ref>: takes <what>; leaves <what> (one line each)
- Type: <relationship, scale, voice>
- Layout and density: <grid, rhythm, bleed>
- Colour: <behaviour, accent logic>
- Images: <scale, crop, frame, captions>
- Navigation: <model, persistence>
- Motion: <normal | protagonista>; <what moves and why>
- Signature: <one>; supporting details: <at most two>
- Avoid: <specific defaults and misreadings of these references>
````

The `Origen` line marks the file as ours. A client brand never comes from it: `ms-sloplint` accepts a `ms · marca` override only from a file without that line, or from a `## Marca del cliente` section that cites the client's own source. The `## System`, `## Tokens`, `## Controls` and `## Motion` sections of `design-md.md` follow once the scaffold has run, written from `tokens.css`.

Then the ordinary flow: Step 3 takes the base named in `## Dirección` instead of dealing, and the Picks block opens with **Dirección** (the base, the dominant reference, the territory).

## After the build

- **The direction is a constraint.** A new idea in a later iteration strengthens it, fixes a named problem, or replaces a rule on purpose by editing `## Dirección`. Nothing else enters.
- **Swap test.** Put another person's work in the slots: if the site would feel the same, the frame is not answering the work.
- **A site of several pages** (a portfolio, a studio site): build the home and one complete inner page, such as one case study, review both, then the rest.
- **Critique** follows `ms-critica.md`: what already feels authored first, then the findings, in its order.
