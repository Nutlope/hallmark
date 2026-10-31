# Writing a theme file

Read only when creating or editing a theme. A build never needs it. `node scripts/theme.mjs validate <file>` checks the contract below and must pass before a theme ships.

**A theme is a material, nothing else.** It says what a page is made of: paper, ink, faces, rules, radius, depth, texture, controls, motion, voice. It never says what the page contains, in what order, in what shape, or how much room anything gets, and it never ships a component: no signature object, no drawn thing, no named part a page must include. Space, section composition and the hero's size belong to `layout.md` and bind every theme alike; a theme that says "air carries the page" or "whitespace does the structure" is overriding them. Every rule the Floor, `craft.md` or `layout.md` already binds is left out.

## The header block

Every file opens with this block, which `scripts/theme.mjs index` compiles into `index.json` (the deal reads the index, never the files):

```
---
name: Coral
slug: coral
genre: modern-minimal
paper: light 96.5 50
display: grotesk-sans General Sans
accent: warm 28
posture: restrained
keywords: saas, platform, billing, payments, dashboard, b2b, startup, pricing, analytics, fintech, workflow, onboarding, trust, warm, human
material: warm grey paper, warm charcoal ink, General Sans throughout, soft pills, one coral signal
photo: muted
---
```

- `paper`: band (`light` over 85% L, `mid` 30 to 85, `dark` under 30), then L and hue of `--color-paper`.
- `display`: class, then the face. Classes: `roman-serif`, `high-contrast-serif`, `slab-serif`, `grotesk-sans`, `grotesk-heavy`, `geometric-sans`, `rounded-sans`, `display-condensed`, `display-heavy`, `mono`, `pixel`, `handwritten`, `blackletter`.
- `accent`: band (`warm` 10 to 60°, `cool` 200 to 300°, `neutral` chroma under 0.05, or `chromatic-<name>` for anything else), then the hue.
- `posture`: `restrained`, `committed`, `full-palette` or `drenched`.
- `keywords`: the words in a prompt that route here, lowercase, comma-separated, ten to twenty-five.
- `material`: one line, the deal prints it: paper, ink, faces, surface, signal. Materials only, no objects.
- `photo`: the treatment every photograph on a page takes, written into `base.css` by the scaffold as CSS on every image in a slot: `natural`, `warm`, `muted`, `mono`, `duotone <dark> <light>` or `tint <colour>` (token names without `--color-`, so `duotone ink paper`), optionally followed by `con=`, `sat=`, `vib=`, `exp=`, `sepia=`, `high=` or `shad=` with a whole number. Pick what the material would do to a photograph: a newsprint prints it black, a riso pulls it in two inks, a warm studio keeps it natural.
- `pictured`: written by `scripts/picture.mjs`, the shape and hero posture of the page in the theme's picture, so a build knows which composition is already taken.

## The picture

Every theme ships `<slug>.jpg` beside its file: the first screen and one lower screen of a finished page built in the theme with the skill, each at 1440 x 900, scaled to 960 wide and stacked (`node scripts/picture.mjs <slug> <page.html> <y of the lower screen>`). The page must sweep clean, pass `layout.md` on every screen, and be one a designer would sign; its lower screen shows the material at work in a full section, and its pictures are real (photographs or the product built), never an empty slot. A build reads the picture for palette balance, type voice and surfaces, never for layout. A theme without a picture validates with a warning.

## The body, in order, 3,000 to 8,000 bytes

1. **One paragraph:** what the theme feels like and what it is not. No brand names: describe the register, never the sites that have it.
2. **Tokens:** a `:root` block with the real values in OKLCH: paper, paper-2, paper-3, ink, ink-2, muted, rule, accent, accent-ink, focus; the three font tokens; `--radius-card`, `--radius-pill`, `--rule-hair`, `--shadow-card`; `--tracking-display`, `--display-weight` (the weight every head takes). Optional: `--color-slot` when the slot wash should take a second hue rather than the accent. No comments inside the block: `theme.mjs scaffold` copies it verbatim into a page's `tokens.css`. A theme with colourways lists the alternates in a short table under the block, and the page states its choice in the stamp.
3. **Type:** display, body, and the outlier if any, with weights, tracking, case and leading; sizes come from the shared scale (`layout.md` § 2), so a theme names a step only where its face needs one (a condensed face may set one step larger). Labels, captions, table heads, tags and nav links are the body face a step smaller, sentence case, untracked, or one label face the theme names, never mono unless mono is this theme's material. A head is one weight and one colour; a theme built on an accented word names it and says it appears once.
4. **Surfaces:** four to six bullets: rule weight and where rules run, radius, depth stance, the bands a page may use (which paper, how many), photographs (what kind of picture suits the material, how it is framed and cropped, how it meets the type), the texture budget (naming the `texture.md` recipe if any).
5. **Range:** three or four bullets on what this material makes without a photograph: which compositions of `layout.md` § 5 it sets best and with what (a figure in the display face, rules drawn into a table, the accent as a band that holds a form, a line set as a specimen, the product's own surface). A page in the theme alternates pictures with sections only this material could make (83), so the range is what keeps it from reading as a stock gallery. These are treatments of the shared compositions, never a component a page must include, and never a section order.
6. **Controls:** two or three bullets: the control pair, links, inputs, and where the accent may sit.
7. **Motion:** one to three lines: how fast, how it eases, what may move.
8. **Voice:** one or two lines on the copy's register.
9. **Do-nots:** three to five bullets specific to this theme's own failure modes, never restatements of a gate.
10. **Build hint:** at most 20 lines of CSS carrying the rules that make the material recognisable (the head setting, the control pair, a well or band surface, a texture if any), every colour, duration, easing and space a token (validate refuses raw milliseconds, a bare `ease`, named colours and raw spacing). Font links as one line.

## What a theme may not carry

A component or object of any kind (a plate, a sign, a disc, a drawer, a sticker sheet, a ticket, a drawn product, a folio column, a mark the page must draw), a section sequence, a page outline, a mandated nav, footer, hero or imagery, HTML scaffolds, page-part class names, rules about space or density, verbatim copy, invented brand names or people, an eyebrow in any form, a label in tracked capitals or small caps, a stamp or a badge that carries no fact, counts that fix a layout, neighbour comparison tables (the deal computes distance from the header block), or a list of reference sites.

## Contradictions to avoid

The field's calibration of the AI look, which the gates enforce: cream paper with a high-contrast serif and a terracotta accent (65); a monospace label voice on a theme whose material is not mono (64); labels, tags or controls in tracked capitals (67); one coloured or bold word inside a head (38iii); middle-dot meta strings and arrow suffixes (63); italic display as a flourish (38); glow shadows and radial halos on dark themes (29). A theme that wants one of these declares it as its material in the header and the file, with the Reflex it waives named once, or it does not have it.
