# Hallmark

**A design skill for Claude Code, Codex, Cursor and OpenCode that refuses to look AI-generated.**

[usehallmark.com](https://www.usehallmark.com) &nbsp;·&nbsp; fifty themes &nbsp;·&nbsp; custom on request &nbsp;·&nbsp; redesign and audit by name

Made by Together AI.

<p align="center">
  <img src="site/OG-hallmark.png" alt="Hallmark, the design skill that ends AI slop" />
</p>

Hallmark holds a hard floor and then gets out of the way. It deals three themes from a catalog of fifty materials, builds the page around what the visitor came to do, and lints the result in a real browser against the tells that read as machine-made: the eyebrow above every heading, tracked-capital labels, one coloured word in a headline, a page of empty frames or nothing but photographs, a hero that misses its screen, an email sign-up at the end of every page, a form that says thanks without sending anything. A fresh-context reviewer gets the last word.

The gates come in tiers. The **Floor** never ships (contrast, focus, reduced motion, invented facts, a broken phone layout). **Reflex** gates are the defaults a model falls into; a build with a reason may overrule one on the record. **Finish** checks are craft detail that never blocks a ship.

## New in v2

- **Fifty themes.** Each is a material (paper, type, colour, surfaces, its own components and texture) with a picture of a finished page, and the build lays out its own page in it.
- **Built from the job.** A booking page books, a shop sells, a newsletter subscribes: the action sits where the category puts it, and the page ends on it.
- **Custom.** Ask for a custom page and Hallmark designs from your prompt alone, under the same rules and checks.
- **Your real product.** Point it at a URL, a dev server or an app and it captures the screenshots itself.
- **Real photographs.** 755 openly licensed photos, picked per subject and credited on the page.
- **Redesign and audit.** `/hallmark redesign <path>` rebuilds a page and keeps its content and wiring; `/hallmark audit <path>` only reports.

## Themes

<table>
  <tr>
    <td width="20%"><a href="https://www.usehallmark.com/themes/dusk/"><img src="docs/screenshots/dusk.jpg" alt="Dusk theme: Closewise, bank reconciliation" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/cobalt/"><img src="docs/screenshots/cobalt.jpg" alt="Cobalt theme: Relay, a webhook API" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/studio/"><img src="docs/screenshots/studio.jpg" alt="Studio theme: Field Office, an identity studio" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/atelier/"><img src="docs/screenshots/atelier.jpg" alt="Atelier theme: Maison Orla, a fragrance atelier" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/ribbon/"><img src="docs/screenshots/ribbon.jpg" alt="Ribbon theme: Lull, a sleep sounds app" /></a></td>
  </tr>
  <tr>
    <td><b>Dusk</b><br/><sub>Closewise, bank reconciliation</sub></td>
    <td><b>Cobalt</b><br/><sub>Relay, a webhook API</sub></td>
    <td><b>Studio</b><br/><sub>Field Office, an identity studio</sub></td>
    <td><b>Atelier</b><br/><sub>Maison Orla, a fragrance atelier</sub></td>
    <td><b>Ribbon</b><br/><sub>Lull, a sleep sounds app</sub></td>
  </tr>
  <tr>
    <td width="20%"><a href="https://www.usehallmark.com/themes/furrow/"><img src="docs/screenshots/furrow.jpg" alt="Furrow theme: Fieldbook, farm records" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/dose/"><img src="docs/screenshots/dose.jpg" alt="Dose theme: Tandem, a family medication app" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/refract/"><img src="docs/screenshots/refract.jpg" alt="Refract theme: Bellwater Lido, an outdoor pool" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/vantage/"><img src="docs/screenshots/vantage.jpg" alt="Vantage theme: Swath, construction site scans" /></a></td>
    <td width="20%"><a href="https://www.usehallmark.com/themes/hedgerow/"><img src="docs/screenshots/hedgerow.jpg" alt="Hedgerow theme: Five Mile Gin, a distillery" /></a></td>
  </tr>
  <tr>
    <td><b>Furrow</b><br/><sub>Fieldbook, farm records</sub></td>
    <td><b>Dose</b><br/><sub>Tandem, a family medication app</sub></td>
    <td><b>Refract</b><br/><sub>Bellwater Lido, an outdoor pool</sub></td>
    <td><b>Vantage</b><br/><sub>Swath, construction site scans</sub></td>
    <td><b>Hedgerow</b><br/><sub>Five Mile Gin, a distillery</sub></td>
  </tr>
</table>

Ten of the fifty. A theme is a material, not a plan: it never says what a page contains or in what order, so two prompts in one theme make two different pages. Each is one file of at most 8 KB in [`references/themes/`](skills/hallmark/references/themes/) with a picture beside it; a build reads exactly one. See them all at [usehallmark.com](https://www.usehallmark.com).

## Custom

Say **custom** and Hallmark drops the themes: no plan, no components, no palette recipe, only the floor, the gates and a short direction in [`direction.md`](skills/hallmark/references/direction.md) to find one idea that only this client has and let it run the page.

## How a build runs

1. Pre-flight reads the project (fonts, palette, framework, a locked `design.md`) and asks once for the material: photos, screenshots, real numbers. Nothing is invented.
2. `scripts/theme.mjs deal` offers three themes that fit the prompt and clear the log; `draw` deals the page's anatomy from its job.
3. The hero is built alone, rendered and reviewed cold before the rest of the page exists.
4. `scripts/sloplint.mjs --render` checks the page at eight widths, then a subagent reviews it with fresh eyes.

Each page is self-contained HTML and CSS, stamped in its first CSS comment with the decisions it took.

## Redesign

Hallmark never starts on a design that already exists unless you name it:

```
/hallmark redesign ./src/app
/hallmark audit ./index.html
```

A full redesign keeps the content and the wiring and changes the system and the layout; say *keep the layout* for a restyle or *polish* for only the tells. `sloplint --before` records every link, field, handler and heading first, `sloplint --kept` fails the redesign if one went missing, and the handoff is a side-by-side before and after.

## Install

```
npx skills add nutlope/hallmark -g
```

`-g` installs for every project; leave it off to install into the current one. Needs Node 18 or later. The browser checks (`sloplint --render`, screenshots) also need `npm i -g puppeteer-core` and Chrome; without them the static checks still run.

| Harness | Lands in | Invoke |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/hallmark` | `/hallmark <prompt>` or describe a new build |
| Codex CLI | `~/.agents/skills/hallmark` | `$hallmark <prompt>` or describe a new build |
| Cursor | finds the copies above | `/hallmark <prompt>` or describe a new build |
| OpenCode | finds the copies above | `/hallmark <prompt>` or describe a new build |

- **One harness only:** `npx skills add nutlope/hallmark -g --agent claude-code` (or `codex`, `opencode`, `cursor`, `github-copilot`).
- **As a Claude Code plugin:** `/plugin marketplace add nutlope/hallmark`, then `/plugin install hallmark@hallmark` (invoked as `/hallmark:hallmark`).
- **From a clone:** `node skills/hallmark/scripts/install.mjs` validates every theme and reference before it copies; `install-hook.mjs` adds an edit-time Floor check to Claude Code.
- **Lint any page:** `node skills/hallmark/scripts/sloplint.mjs <file-or-dir> --render`.
- **If it does not fire on its own,** name it: *use hallmark to build ...*.

## Inspired by

[Impeccable](https://github.com/pbakaus/impeccable) · [frontend-design](https://github.com/anthropics/claude-code/tree/main/plugins/frontend-design) · [Open Design](https://github.com/nexu-io/open-design) · [Kami](https://github.com/tw93/kami) · [taste-skill](https://github.com/Leonxlnx/taste-skill) · [huashu-design](https://github.com/alchaincyf/huashu-design) · [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) · [Emil Kowalski's skills](https://github.com/emilkowalski/skills) · [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines)

## License

MIT. Use it, fork it, ship it.

The photo library (`skills/hallmark/scripts/photos.json`) lists photographs hosted on Wikimedia Commons and holds no image files. Each keeps its own licence (CC0, public domain, CC BY or CC BY-SA), and Hallmark credits every one it uses on the page. It does not use stock sites (Unsplash, Pexels, Pixabay), whose terms bar AI tools from picking their images.
