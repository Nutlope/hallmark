---
name: Terminal
slug: terminal
genre: atmospheric
paper: dark 12.5 150
display: mono Martian Mono
accent: chromatic-green 142
posture: committed
keywords: cli, terminal, shell, command-line, tui, self-hosted, open-source, binary, ssh, sysadmin, devops, homelab, install script, package manager, repl, dotfiles, developer tool, phosphor
material: a near-black ground with a green cast in three lightness steps, pale phosphor ink and one bright phosphor signal with a dim wash of itself, every glyph Martian Mono with heads wide and text narrow, and pictures printed in the page's own glyphs: a photograph rendered as a grid of characters taken from the product's own text, dim cells small, bright cells full, stirred by the cursor
photo: duotone paper accent con=20
pictured: Session, Split hero
---

# Terminal

The page is the terminal surface, and its pictures are printed in type. A near-black ground with a green cast, pale phosphor ink, one bright phosphor green and a dim wash of it for what is added or selected, and Martian Mono for every glyph: heads wide, text narrow. A picture is printed as a grid of characters from the product's own text. It reads as a tool made by people who live in a shell. It is not the CRT costume and not a dark product page holding a screenshot of a terminal.

## Tokens

```css
:root {
  --color-paper: oklch(12.5% 0.012 150); --color-paper-2: oklch(16% 0.016 150); --color-paper-3: oklch(20.5% 0.022 150);
  --color-ink: oklch(94% 0.03 140); --color-ink-2: oklch(82% 0.05 142); --color-muted: oklch(64% 0.06 145);
  --color-rule: oklch(27% 0.028 148); --color-rule-2: oklch(38% 0.045 146);
  --color-accent: oklch(87% 0.2 142); --color-accent-ink: oklch(14% 0.02 150); --color-focus: oklch(87% 0.2 142);
  --color-accent-wash: oklch(23% 0.06 145);
  --glyph-0: oklch(30% 0.06 146); --glyph-1: oklch(38% 0.08 145); --glyph-2: oklch(47% 0.11 144); --glyph-3: oklch(57% 0.14 143);
  --glyph-4: oklch(67% 0.17 142); --glyph-5: oklch(77% 0.19 142); --glyph-6: oklch(86% 0.2 141); --glyph-7: oklch(94% 0.12 138);
  --font-display: "Martian Mono", ui-monospace, monospace; --font-body: var(--font-display); --font-outlier: var(--font-display);
  --radius-card: 0; --radius-pill: 0; --rule-hair: 1px; --shadow-card: none;
  --tracking-display: -0.02em; --display-weight: 500; --stretch-display: 112.5%; --stretch-body: 87.5%;
}
```

## Type

- **Every glyph is Martian Mono,** in three weights at most: 400, 500, 700. Display 500 at `--stretch-display`, line-height 1.12, `h1` at most 3.75rem in two or three lines. Body 400 at `--stretch-body`, 15 to 16px, line-height 1.65. Labels and meta a step smaller in `--color-muted`, sentence case, untracked.
- **Figures** set wide and light against the narrow text: 400 at `--stretch-display` from `--text-display-s` up, tabular, the unit or a `#` comment beneath in `--color-muted`.
- Prompt glyphs (`$`, `~ $`) in `--color-muted` mark real commands and only those; arguments in a reference take the accent.
- Martian Mono has no box-drawing or block glyphs. Diagrams are typed in `+ - |` and wordmarks printed as glyph pictures, so no fallback face slips into a line.

## Surfaces

- One hue, a ramp of lightness: ground, `--color-paper-2` for a session or an install well, `--color-paper-3` for hover and selection. Raised surfaces take a 1px `--color-rule` border, square, never a shadow; `--color-rule-2` is the firmer line under a table head or a diff's file header.
- Rules: 1px `--color-rule` between sections, rows and tabs.
- **Pictures as glyphs:** a picture with a strong silhouette on black, reduced to a grid of brightness levels (about 130 columns, cells 1.85 times as tall as wide) and drawn on a canvas, each lit cell one character of the product's text in `--glyph-0` to `--glyph-7`, dim cells at 62% size; a static `<pre>` stands in without script. One or two a page, big.
- When a glyph grid cannot be made, one photograph stands in, in the `photo:` duotone with a 1px `--color-rule` border: the machines themselves, never a screen showing an interface.
- No scanline, glow, bezel, title bar or traffic lights.

## Range

- **A comparison as a diff:** a unified diff across ten or twelve columns, a `--- a/` and `+++ b/` header over a `--color-rule-2` line, removed lines in `--color-muted` behind `-`, added lines in ink on `--color-accent-wash` behind a green `+`, a gutter of line numbers in `--color-rule-2`.
- **Figures as a tool's output:** three or four of the prompt's numbers at display size, wide and light, parted by vertical rules, each labelled by a `# comment` beneath, as `wc` or `du` would print them.
- **The session at size:** a session in a `--color-paper-2` well across eight columns or more, typed once, its output lighting a `+ - |` diagram beside it.
- **A reference as rows:** a command per row at `--text-title`, wide, its arguments in the accent, its line on the right, like a man page's synopsis; or a table of hosts, flags or exit codes.

## Controls

- Primary: an accent block with `--color-accent-ink` text, square. Secondary: a 1px `--color-ink-2` border. Hover and state switch in `steps(1)`.
- Install lines: a `--color-paper-2` well with tabs (brew, cargo, curl) underlined in the accent, the command at `--text-lg`, and a 16px copy icon at the right that turns into a tick in the accent for 1.4s.
- Links in `--color-ink-2`, underlined dotted, accent on hover; a selected row or tab takes `--color-accent-wash`.

## Motion

Stepped where it is state, alive where it is a picture: a glyph picture resolves row by row from noise over about 1.5s, once, and under the cursor its cells flare to the accent, then settle. A session types itself once when it enters the view. A caret blinks five times and holds. Reduced motion shows every final state.

## Voice

Commands, flags, paths and exit codes. Declarative and short: name the command, never the adjective.

## Do-nots

- Never a proportional face, and never a box-drawing glyph from a fallback font.
- Never a second hue: no amber, no cyan, no red for a removed line.
- Never a rounded corner, a pill or a soft card, and never a light section.
- Never more than one photograph, and only where glyphs cannot be made.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Martian+Mono:wdth,wght@75..112.5,400..700&display=swap" rel="stylesheet">
```

```css
body { font-stretch: var(--stretch-body); font-variant-numeric: tabular-nums; }
h1, h2, h3 { font-weight: var(--display-weight); font-stretch: var(--stretch-display); letter-spacing: var(--tracking-display); line-height: 1.12; }
.figure { font-weight: 400; font-stretch: var(--stretch-display); font-size: var(--text-display); line-height: 1; }
.art { position: relative; } .art canvas { position: absolute; inset: 0; }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); border-radius: 0; transition: background-color var(--dur-micro) steps(1); }
.well { background: var(--color-paper-2); border: var(--rule-hair) solid var(--color-rule); }
.diff .add { background: var(--color-accent-wash); color: var(--color-ink); } .diff .add::before { content: "+"; color: var(--color-accent); }
.diff .del { color: var(--color-muted); } .diff .del::before { content: "-"; }
```

To make a glyph picture: crop the subject, autocontrast, resize to `cols` by `round(cols * h / w / 1.85)`, quantise brightness to levels 0 to 8 (0 is blank), and ship the rows as strings; the canvas sets each lit cell's glyph from the product text in order and its colour from `--glyph-(level - 1)`.
