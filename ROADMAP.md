# Roadmap

What is next for Hallmark.

**Where v2 stands.** Hallmark builds new pages by itself and redesigns existing ones when asked by name. A build deals three themes from a catalog of fifty materials, each with a picture of a finished page and a range for the sections without a photograph, or designs one from scratch on request. A redesign records what the page says and does before it starts, works at one of three depths (polish, restyle, full), and fails its own sweep if a link, a form field, a handler or a test hook went missing. A Floor of hard rules and a set of Reflex defaults are enforced by a zero-dependency linter that reads HTML, CSS, framework components and Tailwind classes, and with `--render` measures the page itself: the fold at three widths, contrast against the pixels behind the text, focus rings found by tabbing, section rhythm, the share of the page in photographs, heads crowding what precedes them, text cramped against its box or painted under another element. Two fresh-context reviews, of the first screen and of the finished page, close every build.

---

## Now

**Decide the newest generated defaults.** Cream or off-white paper on its own, pill-shaped buttons, near-black with one acid accent and the hairline broadsheet now read as generated looks. Custom runs already treat them as spent; the catalog needs a decision: keep them as deliberate materials dealt only on their keywords, or re-paper and re-shape the themes that drift there.

**Conformance on all three harnesses.** Run the same brief and the same redesign through Claude Code, `codex exec` and OpenCode's non-interactive mode and assert each one reaches a 0 FAIL sweep with its fresh-context review recorded.

**Measure a build.** Time and token cost of one page build before and after the v2 efficiency pass (patterns in place of a whole exemplar page, `base.css` written by the scaffold, review briefs the builder never reads), on the same brief.

---

## Next

- **Theme-aware motion tokens.** Per-theme `--dur-micro`, `--dur-short` and `--dur-long` from each theme's motion character, so a severe theme moves faster than a calm one without hand-tuning.
- **Multi-page coherence.** Lock the brand axes in a `design.md`, vary the page-voice axes: different pages of one site, not different sites.
- **Brand-first flow.** From a short product description, a complete brand (palette, type, voice, imagery through the image hook) locked into a `design.md`, then every page built against it.
- **The edit-time hook on by default.** The Claude Code plugin ships it wired; `scripts/install-hook.mjs` is still opt-in for every other install.
- **App screens in depth.** The app scope skips the landing-page gates and names what replaces them; next are checks of its own (the four data states, table figures, a control vocabulary that holds across screens).

---

## Later

- **More harnesses.** Gemini CLI or Copilot only if demand shows up, same one-core shape.
- **Live preview as an MCP server.** Watch, render, screenshot and feed back into the sweep; the `--render` tier is the seed of it.
