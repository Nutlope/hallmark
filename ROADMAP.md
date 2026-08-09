# Roadmap

What's next. 

---

## Now

**Nanobanana hook for image-heavy briefs.** Today the integration is recommend-only — Hallmark tells the user to go generate something and bring it back. Image-heavy briefs (e-commerce, travel, food, lookbook) route to typography-only and feel underserved. Add a first-class hook that writes a prompt, invokes the API, ingests the returned image, and wires it into the build (cache by prompt hash). Pair with a new image-led theme (working title *Plate*) tuned for full-bleed photographic compositions.

---

## Next

**Brand-first flow.** From a short product description, Hallmark generates a complete brand — palette, type system, voice, custom imagery via Nanobanana — and locks it into a `design.md`. The user then runs Hallmark normally and the whole site builds against that generated brand, page after page. Closes the gap for users who have a product idea but no brand yet.

**Theme-aware motion tokens.** Per-theme `--dur-micro` / `--dur-short` / `--dur-long`, scaled by the table already in [`microinteractions.md`](skills/hallmark/references/microinteractions.md). Atelier should feel slower than Brutal; today they share durations. One pass through the tokens file.

**`hallmark variant`** — produce three structurally distinct versions of the same brief side-by-side; the user picks one or asks for a fourth. The biggest cause of "AI feel" is users accepting the first output because they didn't know it could be different.

**Structural cookbook.** [`structure.md`](skills/hallmark/references/structure.md) catalogues the *axes* of variety but doesn't show what a left-margin-headed, hairline-divided, no-image page actually looks like assembled. Twelve to twenty worked fingerprints with short HTML/CSS sketches — patterns are easier to reach for than principles.

**Tactile-rebellion reference.** Controlled imperfection — handmade textures, hand-drawn SVG paths, controlled-jitter typography (a 0.5° tilt on one mark is taste; on every word it's chaos). Where the field is going.

**Charts reference for analytics pages.** ~~AI-generated charts are an obvious tell — rainbow palettes, dense gridlines, 3D donuts, dual-axis line spaghetti. Add a `data-viz.md` that picks small multiples over single dense charts, restrains colour to one accent + neutrals, and bans the worst types outright. Half of every dashboard is chart-shaped, and Hallmark currently has nothing to say about it.~~ **Done** — see [`skills/hallmark/references/data-viz.md`](skills/hallmark/references/data-viz.md) (wired from `SKILL.md` load-conditionally + `anti-patterns.md`).

**Multi-page coherence.** The structural-variety rule is correct for variety, wrong for brand consistency inside a multi-page product. Lock the brand axes (type, colour, divider language); vary the page-voice axes (heading placement, body composition, button voice). Different *pages* of the same site, not different *sites*.

**`study` reads your own codebase too.** Today `study` accepts a screenshot or a URL of an external design. Add a third input mode: a path to your project. Hallmark walks the files, identifies tokens + the structural fingerprint actually in use, and emits the same `design.md`. Closes the loop for users who arrive with code, not a brief — same verb, same output, third input mode.

---

## Later

- **`hallmark explain`** — narrate the choices axis by axis. The skill teaches; users start making the same calls themselves.
- **Negative-capability rules** — for each anti-pattern, the perceptual or cognitive reason it fails. Understanding it beats knowing it.
- **Emotion-first prompting** — *nostalgic · optimistic · sceptical* instead of *editorial · brutalist · austere*. Today's tone words don't reach.
- **Sound + haptic policy** — when web sound is acceptable (gaming, accessibility-augmenting) without crossing into kitsch.
- **Live preview as an MCP server** — watch the file, render in a sandbox, screenshot, feed the screenshot back for self-critique against the slop test. Closes the loop between generation and audit.
