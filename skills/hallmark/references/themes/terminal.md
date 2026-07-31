# Theme - Terminal

Green-phosphor CRT, rendered as a landing page. The page for a **CLI, a shell tool, a self-hosted binary, an open-source dev utility, a homelab/DevOps product** - the page that *is* a terminal session, not one that shows a screenshot of one. Dark green-black ground (`oklch(11% 0.018 145)`), phosphor-green ink (hue 138, up to `chroma 0.19`), one hue top to bottom, every glyph monospace, a blinking block cursor. It reads like a live shell: fast, raw, competent, no ornament.

Loaded eagerly by SKILL.md Step 3 when the catalog pick is `terminal`. Tokens: [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="terminal"]`. Canonical build: none yet - mirror the signature moves below.

## Axes (diversification)

- **Paper band** - dark, green (`oklch(11% 0.018 145)`, a near-black with a green cast). The darkest ground in the catalog, and the only one tinted green rather than neutral or indigo.
- **Display style** - **mono** (JetBrains Mono 500, `--tracking-display 0.01em`). No proportional face exists on the page; display just sizes the mono up (`--text-display` clamps to 4rem).
- **Accent hue** - **chromatic phosphor** (`oklch(78% 0.190 138)`). A lit P1-green, not neon `#00ff00`. It is the *same* hue as the ink and the paper - the whole page is one hue.

## Reference register

Warp - Charm / charm.sh - Ghostty - Fig - Vercel's monospace - old DEC/VT220 green screens - man pages - `htop`/`btop` TUIs.

The aesthetic: a shell session as a homepage - monochrome phosphor, box-drawn chrome, prompt prefixes, a cursor that blinks. Hand-built, precise, never a costume. **Patron-saint reference (internal):** *a green VT220 phosphor screen, recoloured for the web* + *a README you can run*. When in doubt ask "does this read like a live terminal, or like a hacker-themed skin?" Keep the former. **Never name any of these in the output.**

## Required dependencies

1. **Font** - **JetBrains Mono** only (display 500, body 400, bold 700). No sans, no serif anywhere. Google Fonts:
   ```html
   <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
   ```
2. **A reveal script** - one `IntersectionObserver` adding `.is-in` (fade only, ~500ms; no rise - the screen does not slide).
3. **A one-shot type-in** - the hero command line types itself once, then a block cursor (`▋`) blinks steadily. Both gate behind `prefers-reduced-motion`.

## Signature moves

1. **One hue, top to bottom.** Paper (`oklch(11% 0.018 145)`), rules, muted meta (`oklch(58% 0.090 140)`), body (`oklch(78% 0.140 138)`), bright ink (`oklch(86% 0.160 138)`), accent (`oklch(78% 0.190 138)`) all sit on hue 138-145. There is no second hue on the page. The monochrome *is* the design. Hierarchy comes from the L/chroma ramp, since hue cannot carry it.

2. **Every glyph is JetBrains Mono.** Display, headings, body, labels, meta, buttons - all `--font-mono`. No proportional type exists anywhere, not even a "friendlier" body. A sans or serif on the page means the theme is broken.

3. **Zero radius, sharp rectangles.** `--radius-card / --radius-pill / --radius-input` all resolve to `0`. Windows, buttons, inputs, chips have square corners. No pill CTA, no soft card - the hard edge is the CRT bezel.

4. **The shell prompt is the grammar.** Eyebrows, section labels, and nav items are prefixed `$`, `>`, or `~/`. A blinking block cursor (`▋`) trails the hero headline or the active input. The page behaves as one continuous session, not a marketing page describing one.

5. **Phosphor glow, not drop-shadow.** Bright text (ink, accent) carries a soft `text-shadow` bloom in the accent hue - the phosphor bleeding past its pixel. Depth otherwise steps through `--color-paper-2` (`15%`) / `--color-paper-3` (`19%`) elevation. Never a grey box-shadow, never blur.

6. **Scanline atmosphere.** A fixed, low-opacity horizontal scanline overlay (`repeating-linear-gradient`, ~3px pitch, under ~6% alpha), optionally a faint vignette. This is Terminal's answer to the genre's warm blooms - the atmosphere is CRT, not dusk. It must never fight legibility.

7. **Rules are TUI chrome.** 1px `--color-rule` (`oklch(28% 0.030 140)`) borders framed like a terminal: a window title bar carrying `● ● ●` or `[ session ]`, box-drawn (`+--+`, `│`) dividers, a `~/project $` breadcrumb. Structure reads as terminal furniture, not as web cards.

8. **Bright green is the signal.** `--color-ink` (86% L) and `--color-accent` (`chroma 0.19`) are the brightest greens - reserve them for the one headline verb, the active prompt, the cursor, focus rings, and a `OK` / `200` / `PASS` chip. Body holds at `--color-ink-2` (78% / 0.14), meta drops to `--color-muted` (58% / 0.09).

## Motion

The hero command types in once, then the block cursor blinks on a steady 1s `step-end` loop. Section reveals fade only (no rise, the screen does not scroll its content in). An optional one-time boot flicker on load is allowed. No parallax, no bounce, no autoplay. Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static, cursor solid, scanlines still (or absent).

## Anti-patterns

- **No second hue.** No warm bloom, no cyan, no amber, no indigo. If it is not green (hue 138-145), it does not belong. This is what separates Terminal from Midnight / Aurora / Lumen.
- **No proportional type.** No sans, no serif, ever - JetBrains Mono carries the whole page.
- **No rounded corners.** No pill CTA, no soft card, no rounded input. Radius stays `0`.
- **No pure `#000` or neon `#00ff00`.** Paper is a green-black (`oklch(11% 0.018 145)`); accent is a lit phosphor (`oklch(78% 0.190 138)`), not a `#0f0` highlighter.
- **No light sections.** Unlike Cobalt (a light page with one dark band), Terminal is dark end to end. Never sneak a white section in.
- **No skeuomorphic terminal screenshot as hero.** The *page* is the terminal; do not paste a picture of one.
- **No heavy CRT costume.** Overdense scanlines or a fat glow read as a theme skin, not an instrument. Keep the effects subtle.
- **No emoji or colour icons.** Monochrome glyphs, box-drawing, and ASCII only.

## Macrostructure affinity / rejection

**Loves.**
- **Workbench** - the tool-first, panelled shape; Terminal's native register
- **Dev-tool / CLI** - install line + a clean run + `PASS` / `exit 0`
- **Marquee Hero** - one confident shell demo carrying the fold
- **Stat-Led** - benchmark numbers in a mono table (throughput, latency, exit codes)
- **Long Document** - a README or man-page rendered as the page

**Refuses.**
- **Photographic / image-led** - Terminal is text; no photography survives the phosphor screen
- **Letter** - too intimate and warm; Terminal speaks in a machine voice
- **Quote-Led** - testimonial pull-quotes want a serif Terminal does not have
- **Catalogue / portfolio-grid** - image-thumbnail grids fight the text-only surface

## Voice fixtures

Speak in commands, flags, and exit codes. Declarative, terse, specific.

- `$ curl -sSL install.sh | sh`
- *"Runs where you run. Nothing to configure."*
- *"One binary. No daemon. Exit 0."*
- *"Pipe it, grep it, ship it."*
- `> ready.` (block cursor blinking after)

Never any of: *seamless, robust, magical, revolutionary, next-gen, effortless, delightful, supercharge*. Never "click here." Name the command, the flag, the exit code.

## How Terminal differs from neighbouring themes

| vs | difference |
|---|---|
| **Midnight** (atmospheric) | Midnight is dark **blue** (hue ~250) with a real proportional display face (thin Geist) and a diffuse azure glow. Terminal is monochrome **green** (138-145), all-mono, with a shell prompt and scanlines. Hue + all-mono settle it instantly. |
| **Cobalt** (modern-minimal) | Cobalt is a **light** engineered page with one dark graphite code band. Terminal is dark end to end and green - it *is* the code surface, not a light page containing one. Light-vs-dark + hue settle it. |
| **Aurora** (atmospheric) | Aurora blooms **cyan** and sets body in a serif. Terminal has no bloom (scanlines instead), no serif (all-mono), and one green hue. |
| **Lumen** (atmospheric) | Lumen carries Instrument Serif, a built light artefact, and two palette drops. Terminal is single-drop, all-mono, no serif, phosphor-glow rather than emitted-light. |

## Test brief expectations

Terminal should be a candidate when the brief mentions:

- *CLI - terminal - shell - command-line - TUI - self-hosted - open-source - binary - hacker - ssh - sysadmin - DevOps - homelab - install script - package manager - REPL - retro - CRT - phosphor - green screen*
- Product categories: *CLI tool - terminal/shell product - self-hosted infra - dev CLI - open-source binary - sysadmin/DevOps tool - retro-computing product*
- Emotional tone: *hacker - raw - fast - no-nonsense - retro-technical - machine - underground - competent*

When the brief wants a page that *is* a shell (not one that shows a code card), with green-CRT energy, it is Terminal. Warm / consumer / editorial / image-led briefs route elsewhere.

## Build hint

```css
html, body { overflow-x: clip; }
body { background: var(--color-paper); color: var(--color-ink-2);
       font-family: var(--font-mono); font-weight: 400; letter-spacing: 0; }

/* Display just sizes the mono up - no other face exists */
.display { font: 500 var(--text-display)/var(--lh-tight) var(--font-mono); }

/* Phosphor glow on bright text - the CRT bleed */
.ink, .accent { color: var(--color-ink);
  text-shadow: 0 0 8px oklch(78% 0.19 138 / 0.35); }

/* Scanline atmosphere - fixed, faint, above paper, below content */
body::after { content: ""; position: fixed; inset: 0; pointer-events: none; z-index: 9;
  background: repeating-linear-gradient(oklch(86% 0.16 138 / 0.04) 0 1px, transparent 1px 3px); }

/* Blinking block cursor - the live prompt */
.cursor::after { content: "\25AE"; color: var(--color-accent);
  animation: blink 1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }

/* Zero radius everywhere - sharp CRT edges */
.card, .btn, .input { border-radius: 0; border: 1px solid var(--color-rule); }

.reveal { opacity: 0; transition: opacity .5s ease; }
.reveal.is-in { opacity: 1; }

@media (prefers-reduced-motion: reduce) {
  .cursor::after { animation: none; }
  .reveal { opacity: 1; transition: none; }
}
```

Plus the JetBrains Mono link and the reveal + one-shot type-in script.
