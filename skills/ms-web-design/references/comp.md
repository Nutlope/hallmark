# Comp before build: composing in pixels before composing in CSS

Loaded **only** when the pre-flight found `TOGETHER_API_KEY` (signal 9): at the comp step after the Picks block, and for a generated still (§ Generated stills, at the end). With no key this file never loads and the build goes from the Picks block straight to Step 6. The comp step is never a blocker and never something to apologise for skipping.

A rendered comp carries mass, interval and alignment at a glance, which prose cannot; reproducing an approved image is easier than inventing a composition from a paragraph.

---

## § What the comp is, and is not

| It is | It is not |
| --- | --- |
| a composition proposal: mass, interval, alignment, where the eye lands first | a design system; the palette and pairing were settled in the Picks block and do not move |
| the first viewport only, at the surface's own dimensions | a full page; comping below the fold buys nothing and costs a call per region |
| a target to reproduce in code, measured against | a texture source; nothing from the comp is ever embedded in the page |
| disposable once the build matches it | an asset; comps are not shipped and not committed |

**The comp does not get a vote on the Floor.** An image generator will hand you eyebrows, a violet-to-cyan gradient, glassmorphism, and a fake browser window, because nothing in it has read the gates. Same rule as an archive exemplar: **take its composition, not its compliance.** A comp is never evidence that a gate is wrong, and "the comp had it" is not a waiver reason.

---

## § The call

Two comps, three when the direction genuinely forks. One is not a choice and four is a shopping trip.

```
node <skill-dir>/scripts/imagegen.mjs "<prompt>" --size 1280x800 --n 1 --out .hallmark/comps/c1.png
```

The prompt is built from the Picks block and the stamp's idea or theme line, not from the prompt. A prompt that reads like the prompt produces the category default in pixels, the page `direction.md` sets aside. Carry, in this order: the **first viewport** as you planned it (what sits where, how large), the **idea** in a few plain words, the **ground and accent** as plain colour words, the **display class** (not the face name; no generator knows Erode), and the **macrostructure** as a compositional instruction. Then one negative clause naming what the category does, so the generator is pushed off it too.

> *"Web page hero, top 1280x800 only. A rowing club's season set as one large race timetable, the next race the biggest line on the screen. White ground, deep green ink, one signal-yellow mark. Heavy grotesk headline flush left on five columns, two lines; the timetable on the other seven. A thin rule under the headline, nothing else above the fold. Flat, printed, no depth. Not a centred hero, no cards, no gradient, no device mockup."*

**Vary the comps on one axis only.** Two comps that differ in everything are two prompts, and comparing them tells you nothing about the decision you are actually making. Vary the composition (where the weight sits, symmetry against asymmetry, type-led against image-led) and hold the system fixed.

---

## § The approval point

Show both, side by side, at their own size. One line each on what differs. Then stop and ask which one, or whether neither.

This is the second and last redirect window (the Picks block was the first) and it is much cheaper than the one after the build. **Do not build past a comp the user has not chosen.** "I'll build A and we can adjust" is how the approval point turns into decoration.

If the user picks neither, ask which was closer on composition, change that axis, and re-call once. Two rounds is the ceiling; after that, build without a comp and say so in one line.

---

## § Reproduction discipline

**A model reliably believes its recreation succeeded when it did not.** This is the failure mode that makes the whole step worthless if unguarded, because the belief is what stops you looking.

So, before building anything below the fold:

1. Screenshot the built page at **exactly the comp's dimensions** (1280x800).
2. Put the two side by side and answer three questions in writing, one line each:
   - **Mass.** Does the weight sit in the same place, at the same size, relative to the viewport?
   - **Interval.** Are the gaps between the major elements the same proportion of the height?
   - **Entry.** Does the eye land on the same element first?
3. Name the largest divergence and fix it, or state in one line why the built version is right and the comp was wrong. Both are legitimate. Silence is not.

The comp is the target, not the authority: reproducing a comp that misjudged the copy length is worse than diverging from it deliberately. What is banned is diverging without noticing.

Record it in the stamp: `comp: 2 rendered · c1 approved · reproduced (checked at 1280x800)`, or `comp: skipped (no key)`, or `comp: 2 rendered · none approved · built unconstrained`.

---

## § The medium inventory

Before writing a line of the build, every region of the approved comp gets a written implementation medium. Six or eight regions, one line each, and it takes about a minute.

**The gate: a CSS gradient or a layered background is not a texture.** Writing "CSS" against a woven cloth, a sculpted panel, a printed halftone, a photographed material, or anything with grain is how a committed comp silently becomes a flat page with the same section order and none of its ambition. The inventory exists to make that substitution visible while it is still cheap.

| Medium | What it is right for |
| --- | --- |
| **Code** (CSS/SVG) | what the page *draws*: rules, type, geometry, diagrams, anything that animates or reacts, anything that must reflow |
| **Raster** (generated or supplied) | what the world *paints*: material, grain, cloth, paper fibre, photography, painted or sculpted surfaces, real depth |
| **Neither** | the region the comp invented and the copy does not support. Cut it here, not after building it |

Two rules on top:

- **A raster region needs a real source:** a user-supplied asset, a library photograph (`imagery.md` § 2) or a generated still (§ Generated stills). A photograph from memory is not a source, and a region the comp painted as a picture never becomes a drawing (80).
- **A region cannot change medium silently during the build.** Downgrading raster to CSS mid-build is the whole failure this section catches. Change it if the code argues for it, and say so in one line.

Ship the inventory as part of the comp message, under the comps:

```
Timetable          code      a real table, must reflow
Headline           code      type, must reflow
Rule under head    code      1px, tokenised
Next-race mark     code      the accent on one row, it moves once on load
Rower photograph   raster    library photo; the comp's crew is not a real crew
```

---

## § Generated stills

A picture for the page itself, outside the comp step: only when `TOGETHER_API_KEY` is set and the user asked for generated images, or for a subject the library cannot reach (`imagery.md` § 1).

```
node <skill-dir>/scripts/imagegen.mjs "<prompt>" --size 1536x1024 --out <project>/images/<name>.png
```

Prompt like a photographer's prompt: one concrete subject, the place, the light and the lens (*a stack of rye loaves on a flour-dusted steel counter, early window light from the left, 50mm, shallow depth*), with *no text, no people facing the camera*. Look at every result; six fingers, doubled furniture and melted labels go back. Treatment and frame as for a library photo. Stamp `generated: <model> via imagegen.mjs`. Never auto-fire it.
