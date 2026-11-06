# ms · Motion as the lead: the `protagonista` posture

By default a page is still apart from one reveal and one scroll pattern at most (`craft.md` § 5, `scroll-choreography.md`). This posture lets motion become part of the identity, for owners whose work is motion, prototyping or interaction. It is opt-in, and it is easy to forget, so the skill offers it when it fits.

## When to offer it

Offer it in one Picks row, never switch it on yourself, when any of these is true:

- the references move (a motion-led reference, page transitions, scroll-driven type);
- the material is motion, prototyping, interaction or animation work;
- the user talks about animation, transitions or movement;
- `ms-arte.md` lands on the Motion first territory of `ms-esteticas.md`.

The row:

```markdown
- **Movimiento** · normal; this work is motion-led: say `movimiento protagonista` to make motion part of the identity
```

On a run where none of these holds, the row is left out.

## How it is switched on

The user says *movimiento protagonista*, or `design.md` says `Motion: protagonista` in `## Dirección`. The stamp then carries `motion: protagonista`, and the Picks row says **Movimiento** · protagonista. Switching it off is the same sentence with *normal*.

## What it allows

- Up to three scroll patterns from `scroll-choreography.md` on one page, each on a different section. `ms-sloplint` turns F8, the second-pattern finding, into a note.
- Cross-document view transitions between pages (`@view-transition { navigation: auto; }`) and named transitions for the piece that travels from an index to its page.
- A reveal per section instead of one per page, each short and in the same easing.
- Type or images that respond to scroll through `animation-timeline`.

## What still binds

- **The static page is complete first.** Every fact, picture and link is in the HTML and visible with scripting off and under reduced motion (Floor item 7, gate 62). Motion is built last, on top.
- **Reduced motion** shows every end state at once.
- **`transform` and `opacity` only** (gate 10a); one timing scale and one easing family for the whole site.
- **Never** scroll hijacking, an intro that delays the work, or a cursor that replaces the pointer: `ms-sloplint` still reports `ms-scroll`, `ms-intro` and `ms-cursor` under this posture.
- **Every motion has a job:** state, continuity, hierarchy or the owner's character. A movement that only shows that things can move is cut, and the finish review treats it as a finding.
