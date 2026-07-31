# `hallmark variants`

One brief, several distinct directions, side by side, in the user's own browser. The user flips between them, picks one, and only the winner ships. A single build is a bet; several structurally distinct builds are a conversation. v2 makes that conversation fast (progressive reveal, parallel drafts, sketch depth) and smooth (thumbnails, compositional grafts, section-zoom, a decisions log).

## Flow at a glance

1. Run SKILL.md Steps 0-1 once; read `.hallmark/log.json` once. On a resumed run, read `decisions.md` first (§ Smoothness) so a frozen decision is never re-litigated.
2. Detect the mode from the pre-flight: greenfield, routes, or scoped injection (Vite/Astro/SvelteKit). Routes and injection ask for the dev server URL.
3. Say the direction plan table; end with "Redirect now or I build all three."
4. Write the manifest with N directions at `status:"generating"`, then run `start.mjs` NOW: the picker opens on skeleton cards while you generate (§ Speed, progressive-first).
5. Build the directions at sketch depth: parallel subagents by default, sequential fallback. Flip each row to `status:"ready"` the instant its files land; run `thumbs.mjs`; say "Direction 1 ready" in chat per landing.
6. Relay the picker URL in one line.
7. Await the verdict via the poll ladder; a chat reply always works. Dispatch pick / riff / graft.
8. Promote the winner: complete the sketch to full depth, full 58-gate sweep, apply any graft, archive all directions, append the decisions log, ack, stop, log.

## The machinery

The verb rides on five zero-dependency scripts in `<skill-dir>/scripts/variants/` (`core.mjs` · `serve.mjs` · `start.mjs` · `await.mjs` · `thumbs.mjs`) and one run directory inside the USER'S project:

```
.hallmark/variants/<run-id>/     run-id: date + letter, e.g. 2026-07-23-a
  manifest.json                  run state (shape below)
  v1/ v2/ v3/                    greenfield direction folders (index.html + optional css)
  thumbs/<n>.png                 1280x800 PNG thumbnails (thumbs.mjs writes them)
  requests/  requests/done/      the pick / riff / graft queue
  decisions.md                   one entry per round (§ Smoothness)
  server.log                     serve.mjs stdout/err
.hallmark/variants/server.json   live-server identity: {port, pid, run, startedAt}
```

Second run the same day: increment the letter (`2026-07-23-b`). Respect any existing `.gitignore` treatment of `.hallmark/`.

`manifest.json` (you write it; `start.mjs` only ensures a skeleton exists):

```json
{ "run": "2026-07-23-a", "mode": "greenfield", "brief": "...",
  "devServer": null,
  "directions": [
    { "n": 1, "title": "The broadsheet", "macrostructure": "Long Document",
      "theme": "Newsprint", "nav": "N6", "footer": "Ft2",
      "axes": "light / roman-serif / warm", "url": "/frame/1/",
      "status": "generating", "thumb": false }
  ],
  "picked": null }
```

`mode` is `"greenfield"`, `"routes"`, or `"inject"`. In routes/inject mode `devServer` holds the user's dev-server origin and each direction's `url` is absolute into it (e.g. `http://localhost:3000/hallmark-v1`). Write `mode`, `brief`, and `devServer` as soon as § 2 resolves. Add each direction row when you plan it at `status:"generating"` with no `url` yet; write its `url` and flip `status` to `"ready"` the instant its files land; `thumbs.mjs` sets `thumb:true` after it screenshots that row. Every write of the manifest is atomic (write temp, rename).

---

## 1 · Trigger and arguments

- `hallmark variants <brief>` : the full run described here. Default: **3 directions at sketch depth**.
- Bare `hallmark variants` : continue an in-flight brief. If this conversation already carries one (a default build was being scoped, the user just answered the Step 1 gate, or the latest run's manifest has `"picked": null`), reuse it and say so in one line. Read `decisions.md` before continuing (§ Smoothness). No brief anywhere: ask for it, once, and nothing else.
- **Count override.** "Give me 4" / "five directions" is honored. The divergence rules below stay pairwise; with only three paper bands, directions 4+ relax the theme rule to >= 2 axes distinct against each earlier direction. Say so in the plan. Never offer more than 3 unprompted.
- **Depth.** Sketch-depth drafts are the default: each direction ships hero + one signature section + footer, about 40% of a full page (§ Speed). Only the winner is completed to full depth after the pick (§ 7).
- **`--full`** : override to three full pages when the user wants finished directions to compare. Costlier and slower; rarely needed before a pick.
- **`--fast-drafts`** : draft subagents run on a faster model (Sonnet, never Haiku); the winner completes on the session model (§ Speed).

"Show me 3 again" after a finished run: a new run-id, same ceremony reuse, and the archived directions stay where they are.

## 2 · Context detection

Three modes. Decide before the ceremony, state the mode in one line.

**Greenfield** : no project, or a project without a framework dev server. Directions are standalone pages in `v1/ v2/ v3/`; the picker serves them itself at `/frame/<n>/`.

**Routes mode** : a framework with file-based routing AND a running dev server. The directions become throwaway routes inside the user's own app, rendered by their real stack: their fonts load, their components import, the comparison is honest. **Ask for the dev server URL: never guess a port, never start a server yourself.** One line: *"Is your dev server running? Give me its URL (e.g. http://localhost:3000)."* No running server, or no answer: greenfield.

**Scoped injection** : Vite, Astro, or SvelteKit with a running dev server, when you want each direction to preview as a full-viewport overlay ON TOP of the real app without adding routes. Preview-only, no write-back (§ Scoped preview injection). Offer it when routes mode would fight the app's root shell, or when the user wants to see a direction over their live app. Same dev-server-URL ask as routes mode.

Detect the framework from the Step 0 pre-flight you already ran (`package.json` deps + directory shape): `next` with `app/` = app router · `next` with `pages/` = pages router · `@sveltejs/kit` = SvelteKit · `astro` = Astro · `nuxt` = Nuxt · `@remix-run/*` = Remix · `vite` present without a file router = Vite SPA.

Route recipes, direction `n`:

| Framework | Route file |
| --- | --- |
| Next.js (app router) | `app/hallmark-v<n>/page.tsx` |
| Next.js (pages router) | `pages/hallmark-v<n>.tsx` |
| SvelteKit | `src/routes/hallmark-v<n>/+page.svelte` |
| Astro | `src/pages/hallmark-v<n>.astro` |
| Nuxt | `pages/hallmark-v<n>.vue` |
| Remix | `app/routes/hallmark-v<n>.tsx` |

**No file router** (CRA, Vite SPA with react-router, anything unrecognized): do not wire router config; touching a routes array is exactly the shared-file edit § 4 forbids. Fall back to greenfield-style standalone sketches built on the pre-flight tokens (or scoped injection when the stack is Vite/Astro/SvelteKit), and tell the user the winner gets implemented into the real app afterwards.

**Root-layout warning.** If the app's root layout ships its own nav or shell, routes-mode directions render inside it, chrome and all. Say so before building, and offer scoped injection (the overlay sits above the shell) or greenfield frames when the shell would drown the comparison. A direction's own nav inside the app's nav is a confusing artifact, not a bug; name it once so the user does not think it is one.

## 3 · Shared ceremony

**Do:** run SKILL.md Steps 0-1 exactly ONCE for the whole run: one pre-flight scan, one three-question gate, one genre detection, one shared read of the structural family map. Read `.hallmark/log.json` once. Three directions never means three interrogations, and "go ahead" at the gate covers all three. Only the per-direction tuple in the plan table differs; do not re-run the gate or re-derive the genre per direction (§ Speed, analysis-once).

Then state **the direction plan**: a markdown table, said before any code. It replaces three separate Picks blocks; do not also narrate per-direction picks.

| # | Title | Macrostructure | Theme | Axes | Nav | Footer | Enrichment |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | The broadsheet | Long Document | Newsprint | light / roman-serif / warm | N6 | Ft2 | none |
| 2 | The control room | Workbench | Cobalt | mid / grotesk / cool | N13 | Ft5 | E1 Tier-A |
| 3 | The poster wall | Manifesto | Midnight | dark / display-slab / chromatic | N9 | Ft8 | none |

**Divergence rules, hard:**

- Three **different macrostructures from different structural families**: grid-led (Bento, Catalogue, Portfolio Grid, Ecosystem Index, Map & Diagram) · document-led (Long Document, Letter, Conversational FAQ, Index-First, Narrative Workflow) · poster-led (Manifesto, Marquee Hero, Quote-Led, Type Specimen, Specimen, Photographic) · product-led (Workbench, Feature Stack, Stat-Led, Component Playground, Split Studio). One family, one direction. Three shapes from one family is a colour swap wearing three hats.
- Themes **pairwise distinct on ALL THREE Rotation axes** (paper band, display style, accent hue; SKILL.md § Rotation). Three paper bands, three directions: this forces one dark, one mid, one light paper. Non-negotiable; it is what makes the picker grid legible at a glance.
- Three **distinct nav codes** and three **distinct footer codes** (index in [`component-cookbook.md`](../component-cookbook.md)).
- Every tuple also respects the log's last-3 rotation (SKILL.md § Rotation), because the winner gets logged and must not collide with history.

**Titles** are short evocative names ("The broadsheet", "The control room"), never theme names or "Option A". The title is what the user will say back to you in chat, so make each one unmistakable.

**Direction roles:** direction 1 is genre-faithful (what the brief most expects, done properly); direction 2 pulls from an adjacent genre; direction 3 is the wildcard. When Step 1's custom signals fired, the custom route ([`custom-theme.md`](../custom-theme.md)) is allowed for direction 3, run at draft depth: slate, draw, and direction contract, no finish review until it wins.

End the plan with the accountability beat, verbatim: *"Redirect now or I build all three."* A beat, not a blocking question; silence means build.

## Speed

The user's pain is wall-clock. Every default here trades nothing the user can see for time they can feel.

1. **Progressive-first (the default).** Start the picker BEFORE generating. Write the manifest with N directions at `status:"generating"` (no `url` yet), run `start.mjs`, hand over the URL: the picker opens on skeleton "building..." cards. Then generate; the instant a direction's files land, write its `url` and flip its row to `status:"ready"`. The picker's 2s poll reveals it while the others finish, so the user studies direction 1 while 2 and 3 are still drawing. Emit one line in chat as each lands: *"Direction 1 ready."*

2. **Parallel by default (subagents).** When the harness has subagents, spawn one per direction; each gets the shared analysis + its tuple row + the fragment contract (§ 4). Sequential-in-one-conversation is the fallback: it keeps the prompt prefix cached and leans on progressive reveal to hide the wait. Honest tradeoff: parallel subagents each re-pay the shared prefix cold (no cache reuse across agents), but they win roughly 3x on wall-clock, and wall-clock is the pain, so parallel is the default.

3. **Sketch-depth drafts (the default).** Each direction ships hero + one signature section + footer, about 40% of a full page: enough to judge structure, theme, and voice, not a line more. Only the WINNER completes to full depth after the pick (§ 7). `--full` overrides to full directions when the user wants finished pages to compare.

4. **Analysis-once + shared head.** Run the shared analysis once (§ 3): audience, use, tone, genre, family map. Generate the head, reset, and font-load boilerplate once as a shared base each direction references, so three drafts do not each re-derive the same reset and font loading. The token-variable NAMES can be shared; the VALUES must diverge per direction (a shared theme block would homogenize the three systems, § 4). The shared base is a draft-time head start, not the shipped system; the winner still earns its own real `:root` tokenization at promotion.

5. **`--fast-drafts` (optional).** Draft subagents run on a faster model (Sonnet); the winner completes on the session model. Never Haiku: Haiku's HTML craft sits below the bar, and a draft too rough to judge defeats the point.

Expected speedup: **time-to-first-direction ~60s -> ~15-20s; full run ~2.3x a build -> ~1.1-1.3x a build.**

## 4 · Build recipes

**Parallel path** (harness supports subagents, the default): after the table, spawn one subagent per direction. Each receives the brief + the inferred audience/use/tone + its tuple row + its output target + the shared base + the **fragment contract**. Briefing template:

```
You are building direction <n> of 3 for a Hallmark variants run.
Brief: <brief>. Inferred: audience <a> · use <u> · tone <t> · genre <g>.
Tuple: "<title>" · <macro> · <theme> · axes <axes> · nav <N#> · footer <Ft#> · enrichment <E# or none>.
Depth: SKETCH - hero + one signature section + footer only (unless the run is --full).
Output: <absolute path to v<n>/index.html, or the route file from the recipes table>.
Reference the shared base at <path> for head/reset/font-load; define your OWN distinct theme token values.
Include this chip tag verbatim: <the § 4 snippet with data-direction="<n>">.
Load ONLY references/macrostructures/<picked file>, the picked component archetype
files, and the universal set (typography · color · layout-and-space · motion ·
copy · anti-patterns). Do not read log.json. Do not append memory. Do not run
the full gate sweep: the Core-15 sweep only (contrast gates 40-41 are in it). Styles fully
self-contained. Stamp the CSS with `direction: <n> of 3 · run: <run-id>`.
```

**Sequential fallback** (no subagents): same table, build v1 then v2 then v3 in one context, universal references loaded once and reused. Same fragment contract and sketch depth per direction, minus the spawning. Flip each row to `ready` before starting the next so progressive reveal still works.

**Progressive reveal wiring.** Whichever path: the manifest row starts at `status:"generating"` with no `url`. When a direction's files exist and are servable, write its `url` and set `status:"ready"` in one atomic manifest write, then say "Direction <n> ready" in chat. Do not wait for all three before the first flip.

**Draft quality bar.** Drafts are sketch depth and get an abbreviated pass: run `sloplint.mjs` on each draft and fix FAILs (it is cheap and mechanical), then sweep only the **Core-15** ([`slop-test.md`](../slop-test.md) § Core-15, which includes contrast gates 40-41) by judgment. ONLY THE WINNER runs the full 58-gate sweep, later, at § 7. Do not spend three full sweeps on sketches that will be archived.

**Self-containment.** Each direction is fully self-contained: its own inline styles or a sibling css file in its folder. No shared `tokens.css` across directions; shared theme tokens would quietly homogenize the three systems you are trying to keep apart. The shared base of § Speed is head/reset/font-load only, copied in, not a live shared theme file. In routes mode, hang each direction's token block on the route's own root element (a wrapper class), not `:root`, so three simultaneous routes cannot fight each other or leak into the app shell; every colour still references a `var(--*)` per the critical floor. The winner gets properly tokenized at promotion.

**Greenfield target:** `.hallmark/variants/<run-id>/v<n>/index.html`. Sibling assets referenced by relative path (`./style.css`), never root-absolute, because the frame serves under `/frame/<n>/`.

**Routes mode target:** the framework route from the § 2 table. Author the chip script tag into each generated route, exactly this shape (adjust `data-direction`, port, and base):

```html
<script src="http://127.0.0.1:<port>/chip.js" data-direction="2" data-of="3" data-mode="routes" data-base="http://localhost:3000/hallmark-v" data-title="The control room"></script>
```

Greenfield frames carry the chip too, with `data-mode="greenfield"` and `data-base="http://127.0.0.1:<port>/frame/"`. `data-title` is the direction's plan-table title (optional but write it). What the chip does (so you can describe it, not so you can rebuild it):

- Renders the **corner dock**: a compact glass bar pinned bottom-right, inside a shadow root so the page's own CSS cannot touch it. The page stays full-bleed; nothing wraps it.
- The bar: `‹ 1 2 3 ›` (numbers jump straight to a direction; the current one is filled), the direction title in small caps, **Pick**, a `⋯` tray with meta + Riff + Graft, and an `×` to dismiss. ArrowLeft/ArrowRight flip too, guarded against focused inputs.
- On load it fetches `/api/state` from the helper origin to learn live titles, meta, and the real direction count, so a riffed direction 4 is reachable even when the embedded `data-of` is stale; the data attributes are only the offline fallback.
- Pick / Riff / Graft POST to `/api/pick` on the chip's own origin. On failure the bar swaps to *"picker offline · tell your agent: pick 2"*, so the flow survives the server dying.
- Respects `prefers-reduced-motion`; nothing animates beyond opacity/transform.

Assume port 4180 when writing the tags; § 9 covers the walk-up case.

**Routes-mode discipline:** never touch shared stylesheets, config files, or `package.json` during variant generation. Each direction is additive route files only. Write all of a direction's files in **one batch** so the dev server hot-reloads once per direction, not once per file. (Scoped injection is the one exception that touches a config file, and only with consent, § Scoped preview injection.)

## Thumbnails

After the directions land (`status:"ready"`), render PNG thumbnails so the grid does not depend on live iframes:

```
node <skill-dir>/scripts/variants/thumbs.mjs --run <run-dir>
```

`thumbs.mjs` (zero-install, dual-engine: try `puppeteer-core`, else spawn the installed Chrome, the same pattern the eval screenshots use) reads the manifest, screenshots each ready direction's `url` to `<run-dir>/thumbs/<n>.png` at 1280x800, and sets `thumb:true` on that direction (atomic manifest write). The picker grid then renders `<img src="/thumb/<n>.png?<cachebust>">` for any direction with `thumb===true`, falling back to the scaled live iframe when `thumb` is unset, and the "building..." placeholder when the direction is not yet ready. Single view stays a live iframe, so the winner is always judged live.

This also fixes **iframe-blocked dev servers**: a routes-mode app that sends `X-Frame-Options` or CSP `frame-ancestors` refuses to render inside the grid iframe, but a PNG always shows. Run `thumbs.mjs` whenever the grid thumbnails come up blank, and re-run it after a riff so the new direction gets a thumbnail too.

serve.mjs serves `GET /thumb/<n>.png` from `<run-dir>/thumbs/<n>.png` (200 `image/png`, or 404 when absent).

## 5 · Serve and hand over

Start the picker (idempotent; safe to re-run). Do this BEFORE the directions finish, right after you write the `generating` manifest rows (§ Speed, progressive-first):

```
node <skill-dir>/scripts/variants/start.mjs --run <run-dir>
```

`start.mjs` ensures the skeleton + manifest exist, reuses a live server whose `/api/state` identity matches this run, otherwise spawns `serve.mjs` detached (stdout/err to `server.log`), and prints exactly:

```
PICKER http://127.0.0.1:<port>
AWAIT  node <abs-path>/await.mjs --run <run-dir> --timeout 540
DRAIN  node <abs-path>/await.mjs --run <run-dir> --drain
```

The server starts even when no direction is `ready` yet: an empty or all-`generating` manifest opens the picker on skeleton cards, so the user watches the directions appear. Do not require all directions present at start.

Relay the picker URL to the user in one line: *"Flip with arrows or the number keys; Pick when one clicks; Riff deals a fourth; Graft borrows a section from another."* If the harness has a browser preview pane, open the picker there too.

What the user sees (built by `core.mjs`, dark neutral shell, system-ui, self-contained):

- An overview grid of the directions: a PNG thumbnail per direction once `thumbs.mjs` has run (a scaled live 1280x800 iframe when no thumbnail yet), and a "building..." skeleton card for any direction still at `status:"generating"`.
- Each card labelled with the direction's title (as `n · title`) and its macro/theme/nav/footer meta.
- Click or 1/2/3 enters single view: the direction FULL-BLEED in a live iframe, nothing framing it. Every control lives in the **corner dock**, a compact glass bar pinned bottom-right: a grid glyph back to the overview, `‹ 1 2 3 ›` with direct number jump (a still-generating direction shows as a dimmed, pulsing number until it lands), the direction title, **Pick**, and a `⋯` tray carrying the tuple meta, Riff, Graft, and the key hints.
- Keys: arrows flip (ready directions only), 1-9 jump, P pick, R riff (optional one-line steer), G graft (§ Smoothness), Esc back to the grid; all guarded against focused inputs.
- The page binds to 127.0.0.1 only and polls `/api/state` every 2 seconds, so manifest updates (a direction flipping to ready, a thumbnail arriving, a riff landing, the pick recorded) appear without a restart.

**No-server variant:** `node <skill-dir>/scripts/variants/start.mjs --run <run-dir> --static` skips the server, writes `compare.html` into the run dir (self-contained, srcdoc-inlined iframes of v1-v3, keyboard 1/2/3 and arrows, a banner telling the user to reply "pick N" in chat), and prints its path. Reach for it when a long-lived process is unwelcome but node exists.

## Scoped preview injection

Vite, Astro, and SvelteKit only. **Preview-only: it shows the variant over your running app, it never edits your app's source.** Next.js is out (no clean dev-only injection hook that stays preview-only); for Next, use routes mode or greenfield sketches. There is no write-back: the winner still ships as a normal Hallmark build after the pick.

When the app runs a Vite/Astro/SvelteKit dev server, preview each direction as a full-viewport overlay inside the real app without adding throwaway routes. serve.mjs serves `GET /inject/<n>.js` (built by `core.mjs buildInjectJs(n,total,port)`); loaded inside the dev app it mounts a fixed, max-z-index, full-viewport overlay iframe pointing at the direction's preview URL, plus the same corner dock (flip / number jump / pick / riff / graft, posting to the helper origin; titles and count refresh from `/api/state`). It guards arrow keys against focused inputs, is dev-only (a no-op unless `location.hostname` is `localhost` or `127.0.0.1`), and is dismissible (x, Esc).

Wire it in dev config only, and get the user's ok first (it loads a script from the helper origin into their dev app). Swap the `1` in `/inject/1.js` for the direction you want on top first; the overlay's own flip controls move between directions once loaded. Use the picker port that `start.mjs` printed for `<port>`.

**Vite** - a dev-only plugin using `transformIndexHtml`:

```js
// vite.config.js - dev only
export default {
  plugins: [{
    name: 'hallmark-variants',
    apply: 'serve',
    transformIndexHtml: () => [{
      tag: 'script',
      attrs: { src: 'http://127.0.0.1:<port>/inject/1.js' },
      injectTo: 'body',
    }],
  }],
};
```

**Astro** - `injectScript('page', ...)` from a dev-only integration:

```js
// astro.config.mjs - dev only
export default {
  integrations: [{
    name: 'hallmark-variants',
    hooks: {
      'astro:config:setup': ({ injectScript, command }) => {
        if (command !== 'dev') return;
        injectScript('page', 'import("http://127.0.0.1:<port>/inject/1.js")');
      },
    },
  }],
};
```

**SvelteKit** - a `handle` hook rewriting the page chunk in dev:

```js
// src/hooks.server.js - dev only
import { dev } from '$app/environment';
export async function handle({ event, resolve }) {
  return resolve(event, {
    transformPageChunk: ({ html }) =>
      dev ? html.replace('</body>', '<script src="http://127.0.0.1:<port>/inject/1.js"></script></body>') : html,
  });
}
```

**Caveats.**

- **Consent.** Adding the hook touches a config file. Show the exact diff, get a yes before writing it, and offer to revert it after the pick.
- **CSP / X-Frame-Options.** If the dev app sets a strict `Content-Security-Policy` (`script-src`, `frame-src`) or `X-Frame-Options`, the injected script or its overlay iframe is blocked. This is a dev-only caveat; do not weaken production CSP for a preview.
- **Fallback.** When injection is not possible (Next, no dev server, strict CSP, or the user declines), fall back to greenfield standalone sketches built on the pre-flight tokens. The winner still ships as a normal build either way.

## 6 · The poll ladder

The verdict comes back through `await.mjs`:

```
node <abs-path>/await.mjs --run <run-dir> [--drain] [--timeout <sec>] [--ack <id>] [--note "<line>"] [--stop]
```

Exit codes: **0** = one request claimed (atomic rename to `.working`) and printed as JSON on stdout · **2** = idle/timeout · **1** = error.

Handling on exit 0:

1. Parse the JSON from stdout. A pick looks like:

   ```json
   { "id": "0001", "action": "pick", "choice": 2 }
   ```

   A riff carries `"action": "riff"`, always a `"steer"` field (possibly empty), and may carry `"choice"`: the direction on screen when the user riffed. A graft looks like:

   ```json
   { "id": "0002", "action": "graft", "choice": 2, "from": 3, "section": "pricing" }
   ```

   Requests also carry `"createdAt"`. `await.mjs` is generic: it claims, prints, and drains any action, so graft requests flow through the same path with no special handling in the script.
2. Dispatch on `action`: `"pick"` → § 7, `"riff"` → § 8, `"graft"` → § Smoothness (graft the named section into the winner, then promote via § 7).
3. Ack: `--ack <id>` moves the claimed file to `requests/done/`; `--note "<line>"` records what you did with it.
4. A request carrying `"redelivered": true` is an orphaned claim older than 5 minutes (a previous attempt died mid-handle); handle it normally.

On exit 1: read `server.log`, then fall back to chat.

Pick the rung your harness supports:

1. **Claude Code:** blocking wait with a long shell timeout (>= 600000 ms), or run the same command in the background and act when it exits:

   ```
   node <abs-path>/await.mjs --run <run-dir> --timeout 540
   ```

   Between turns, `--drain` prints ALL queued requests as a JSON array (exit 2 when empty); drain at the top of any turn where the user might have clicked meanwhile.

2. **Codex CLI / OpenCode (short-turn harnesses):** short loops:

   ```
   node <abs-path>/await.mjs --run <run-dir> --timeout 60
   ```

   After 3 consecutive idle exits, stop polling and ask in chat: *"Reply 1, 2, or 3 (or riff, or graft e.g. 'pricing from 3')."* On Codex, the sandbox may refuse the server outright (see [`harnesses/codex.md`](../harnesses/codex.md)); go straight to rung 3.

3. **No node / no server allowed** (a sandbox that blocks the bind, or an install channel without scripts): skip the server entirely. Write `compare.html` by hand into the run dir, in the static template shape, and ask for the verdict in chat. The hand-written file must be:

   - Fully self-contained: each direction's page inlined into an iframe `srcdoc` attribute (escape quotes), no external requests, frames full-bleed one at a time.
   - Navigable: keyboard 1/2/3 jumps to a direction, arrow keys cycle, plus a visible bottom-right dock for mouse users.
   - Honest about the channel: the dock carries a `pick N` chip that copies the reply to paste in chat, and its tray says "no server · your chat is the channel: reply 'pick N' (or riff / graft)". No Pick button that pretends to work.
   - Labelled: the dock shows the current direction's title, and its tray the macro/theme meta from the plan table.

**THE FLOW NEVER DEAD-ENDS.** A chat reply naming a verdict ("2", "pick 2", "the poster one", "2 but the pricing from 3") is a valid channel at every rung, always, even while the server is up. After acting on a chat verdict, run `--drain` once and ack anything stale so `requests/` ends empty.

## 7 · Pick and continue

On `{"action": "pick", "choice": n}` or the chat equivalent (and after any graft, § Smoothness, has been transplanted into the winner):

**Greenfield:**

1. Copy the winner into place as the normal build output (wherever a default Hallmark build would land for this project).
2. Complete the sketch to full depth first (unless `--full` already built full pages): remaining sections, all states, responsive pass.
3. Run the FULL 58-gate sweep + sloplint, fix every FAIL, stamp, emit `tokens.css`, exactly as SKILL.md Steps 6-7 demand. The draft's abbreviated pass counts for nothing here; the winner earns the whole bar.

**Routes mode:** state the file plan first: the standard safety rail, promoting into real targets needs the user's ok. For example:

> Promoting direction 2. Plan: modify `app/page.tsx` (the new design), create `app/tokens.css`, delete `app/hallmark-v1/`, `app/hallmark-v2/`, `app/hallmark-v3/`. Ok?

Then implement the winning direction into the real app as a normal Hallmark build: tokenize into the project's system (real `:root` tokens now, not the draft's scoped block), strip the chip tag, delete the other variant routes. In scoped-injection mode, also revert the dev-config hook you added with consent (§ Scoped preview injection).

**Always, all modes:**

- Archive all directions to `.hallmark/variants/<run-id>/` (never hard-delete; this is what makes "show me the 3 again" free). In routes mode, copy the route files into the run dir before deleting them from the app.
- Append the round to `decisions.md` (§ Smoothness): the winner, any graft, any section rounds.
- Ack the request (`--ack <id>`), stop the server (`await.mjs --run <run-dir> --stop`, which POSTs `/api/shutdown` via `server.json` and clears it), and report the cleanup in one line: *"Archived 3 directions to .hallmark/variants/2026-07-23-a/, picker stopped, log updated."*
- Set `"picked": n` in the manifest.
- Append the log entry, winner fields at top level so SKILL.md § Rotation reads it like any other run:

```json
{ "date": "...", "macrostructure": "<winner>", "theme": "<winner>", "hero": "<Posture>/<H#>",
  "nav": "...", "footer": "...", "enrichment": "...", "axes": "<paper/display/accent>",
  "fingerprint": "<heading|body|divider|button|image|reveal>", "brief": "...", "verb": "variants",
  "picked": 2,
  "variants": [ {"n": 1, "...": "..."}, {"n": 2, "...": "..."}, {"n": 3, "...": "..."} ] }
```

Each `variants[]` row carries that direction's title, macrostructure, theme, nav, footer, and enrichment, so a future run can rotate away from all three, not just the winner.

## Smoothness

The point of variants is a fast, honest decision loop. The picker already carries the ergonomics: the corner dock (title, `‹ 1 2 3 ›` number jump, Pick, tray), input-guarded arrow flip (arrows never fire while a prompt input is focused), and side-by-side thumbnails in the grid (§ Thumbnails). Build on that with three moves.

**Compositional grafts (the key unlock).** The verdict is rarely "2 is perfect." It is usually "2, but the pricing section from 3." Handle it whether it arrives in chat or through the picker's Graft button.

- Picker: single view has a **Graft** button (key `g`) that prompts *"Take which section from which direction? e.g. 'pricing from 3'"* and POSTs `{action:"graft", choice:<winner n>, from:<other n>, section:"<name>"}` to `/api/pick`, which writes `requests/NNNN-graft.json`.
- Chat: the same verdict typed out ("2 but the pricing from 3") is a graft; parse `choice`, `from`, and `section` from the sentence.
- The move: before promoting, open the winner (`choice`) and the donor (`from`). Lift the named `section` markup plus its scoped styles out of the donor and transplant it into the winner where that section belongs, replacing the winner's own version. Reconcile tokens: the donor's section references the donor's theme vars, so remap them to the winner's token names, and re-check contrast, so the graft reads as one page, not a seam. Then promote the grafted winner through § 7.
- Log every graft in `decisions.md` so a resumed run does not undo it.

**Section-zoom (after the pick).** Once a direction wins, zoom to one section instead of whole pages: riff a single section in place, *"3 heroes for this direction"*, each rendered in the real page context, not in isolation. The user picks one or asks to merge two; freeze it; advance to the next section. Fast, because a section is about 1/5 of a page, so three section variants cost roughly what one page draft did. Reach for it when the pick was "close, but the hero is not there yet": finish the winner section by section rather than re-rolling whole pages.

**Decisions log.** Append to `.hallmark/variants/<run-id>/decisions.md` every round: the question asked, the directions offered (their tuples), the verdict, any grafts, and each section round's outcome. One short entry per round, newest at the bottom. Read it at the START of a resumed run (a bare `hallmark variants` that continues an in-flight run, § 1) so a frozen decision is never re-litigated: if the log says direction 2 won and the hero was frozen in section round 3, resume from there, do not re-offer three fresh directions.

Example `decisions.md` entry:

```
## round 1 · 2026-07-23-a
brief: pricing page for a solo dev tool
directions: 1 broadsheet (Long Document/Newsprint) · 2 control room (Workbench/Cobalt) · 3 poster wall (Manifesto/Midnight)
verdict: pick 2
graft: pricing section from 3 into 2
frozen: macrostructure Workbench, theme Cobalt

## round 2 · section-zoom
section: hero (3 variants)
verdict: hero B
frozen: hero B
```

## 8 · Riff

On `{"action": "riff", "steer": "..."}` (steer optional) or a chat ask ("riff", "deal another", "none of these"):

- Plan direction 4: a macrostructure different from all three, from whichever structural family remains; a theme distinct on as many axes as remain. With only three paper bands, direction 4 relaxes to >= 2 axes distinct against each earlier direction; say so in the one-line plan.
- Honor the steer line as art direction ("warmer", "like 2 but dark"). Where the steer and the divergence default conflict, the steer wins; the user is telling you where the target is.
- Build v4 under the same fragment contract and sketch depth, write `v4/` (or the `hallmark-v4` route with a chip tag reading `data-direction="4" data-of="4" data-title="<its title>"`), append its tuple to `manifest.json` `directions` at `status:"generating"` then flip to `"ready"` when it lands, and ack the riff request. Run `thumbs.mjs` again so direction 4 gets a thumbnail. The picker's 2-second poll shows the new direction without a restart, and the earlier chips learn the new count live from `/api/state`, so direction 4 is reachable from them too; the embedded `data-of` only matters as the offline fallback (bump it when you touch those files anyway).
- A second riff repeats the ritual as direction 5. If the user riffs twice without picking, ask what is missing instead of dealing a sixth.

## 9 · Risks and edge notes

- **Iframe-refusing dev servers** (`X-Frame-Options` / CSP `frame-ancestors`): the grid iframes render blank. Run `thumbs.mjs` (§ Thumbnails); the PNG grid renders regardless, and single view still opens the route directly where the chip flips and picks. This is the v2 fix for what used to need opening tabs by hand.
- **File watchers that restart on new files:** batch writes (§ 4). One write per direction, never a file-by-file trickle that restarts the dev server three times.
- **Tailwind content globs** pick up new `hallmark-v*` routes automatically. Fine; no config edit, and config edits are forbidden anyway (the scoped-injection dev hook is the one consented exception, § Scoped preview injection).
- **Port conflicts:** `serve.mjs` tries 4180 and walks up to 4189. If the printed PICKER port differs from the 4180 you stamped into chip tags or an inject hook, update `src` and `data-base` in each direction once.
- **Stale server from a previous run:** `start.mjs` checks the live server's `/api/state` identity against this run; a matching run is reused, anything else is replaced and `server.json` rewritten. The server also self-shuts after 30 minutes without picker polls, so a forgotten run does not linger.
- **Dev server restarts mid-run** (routes mode): the routes are plain files, so they come back with it; the chip reconnects on its next click. Nothing to do.
- **Abandoned run:** the user walks away without picking. The server self-shuts, the manifest keeps `"picked": null`, and a later bare `hallmark variants` resumes exactly this run (§ 1), reading `decisions.md` first. Do not delete an unpicked run.
- **Uncommitted variant routes:** the `hallmark-v*` routes are throwaway; if the user mentions committing mid-run, suggest waiting until § 7 deletes them.
- **Token budget:** sketch-depth drafts (default) plus progressive reveal bring a run to roughly 1.1-1.3x one build in wall-clock (§ Speed). `--full` restores the fuller ~2.3x full-page run when the user wants three finished directions to compare; offer sketch depth (the default) when the brief is heavy or the model context is tight.
