# ms · App screens

Loaded on every app screen (`flow.md` § App screens). It is the guide to `vendor/taste-skill/app-screens.md`, a verbatim copy of taste-skill's app-screen file, distilled from 23 measured product screens (source and commit in the ORIGEN file at the repo root). That file was written for taste-skill's own scripts and house rules, so it is read through this one. Never edit the copy; every adaptation lives here. Its gate numbers and file names are taste-skill's, not Hallmark's.

## Precedence

When two sources disagree, the first one in this list wins:

1. The user's own words.
2. The client's `design.md`, `DESIGN.md` or `.hallmark/brand-spec.md`, for style only (the brand override under the Floor in `SKILL.md`).
3. The Floor.
4. Sergio's principles (`SKILL.md`).
5. `flow.md` § App screens.
6. The vendored app-screen file.

So the vendored file's "at most one tracked uppercase label on a screen" does not apply: Floor item 9 forbids it, unless a client brand specifies it.

## What to read, what to replace

| In the vendored file | In ms-web-design |
|---|---|
| Section 1, when this applies | Read. Same signals as `flow.md` § App screens. |
| Sections 2.1 and 2.2, inventory and the screen's one question | Read and do. Write the question in the Picks block's Signature row. |
| Section 2.3, choose a style (taste-skill's draw script and style library) | Replace. Palette, faces, radius and surfaces come from the dealt theme (`theme.mjs scaffold <slug> --scope app`). From the table of seven styles take only the **move** of the one that fits how the product is used, and write one line on why. Still choose the face and one signature element built from the product's own things. |
| Sections 2.4 to 2.6, shell, data, states | Read and do. The four-states rule matches `flow.md`. |
| Section 2.7, the check (taste-skill's inspector and its allow flags) | Replace with `ms-sloplint.mjs <files> --scope app --render`. Where it asks for an allow flag, write a Reflex waiver instead. |
| Section 2.8, report | Replace with the Picks block and Step 7. |
| Sections 3 to 12: shell, canvas, KPIs, charts, tables, forms, type and colour, density, states, phone | Read. This is why the file is here. The default tokens in section 9.5 yield to the theme's tokens; keep its sizes, contrasts and colour budget. |
| Section 13, house rules for app screens | Read through the precedence above. The bans its author calls taste (violet and indigo) are **Reflex**: avoided by default, waivable on the record when the brand or the product asks for it. |
| Section 14, tells of generated dashboards | Read. It is the checklist for the finish review of an app screen. |
