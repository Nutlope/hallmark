---
name: Cobalt
slug: cobalt
genre: modern-minimal
paper: light 98.5 250
display: grotesk-sans Familjen Grotesk
accent: cool 256
posture: restrained
keywords: api, sdk, cli, dev tool, developer platform, docs, documentation, infrastructure, backend, database, observability, webhooks, events, type-safe, open source, ship, deploy, developer experience, technical
material: cool near-white paper, blue-grey ink and hairlines, Familjen Grotesk over IBM Plex Sans, a generated ASCII field on an 8 by 16 cell, keycaps and cut-corner panels, JetBrains Mono on graphite, one electric cobalt signal
photo: duotone graphite paper
pictured: Feature Ledger, Field hero
---

# Cobalt

An exact, technical register: cool near-white paper ruled with hairlines, Familjen Grotesk heads over IBM Plex Sans, and a ground made of characters, a generated ASCII field snapped to an 8 by 16 cell that shows the product's own traffic in cobalt tints. Panels are cut on two opposite corners, buttons are keycaps with a real bottom edge, code runs on graphite. It is precise because every edge is a hairline or a cut and every glyph means something; it is not a dark developer page or a terminal costume.

## Tokens

```css
:root {
  --color-paper: oklch(98.6% 0.005 250); --color-paper-2: oklch(96.2% 0.008 252); --color-paper-3: oklch(93% 0.011 252);
  --color-ink: oklch(21% 0.028 262); --color-ink-2: oklch(36% 0.022 260); --color-muted: oklch(50% 0.018 258);
  --color-rule: oklch(90% 0.009 252); --color-rule-2: oklch(83% 0.012 252);
  --color-graphite: oklch(21% 0.024 262); --color-graphite-2: oklch(26.5% 0.026 262); --color-graphite-ink: oklch(93% 0.010 250); --color-graphite-muted: oklch(69% 0.022 256);
  --color-accent: oklch(52% 0.19 258); --color-accent-2: oklch(76% 0.13 254); --color-accent-wash: oklch(95% 0.028 256); --color-accent-ink: oklch(98.6% 0.005 250); --color-focus: oklch(52% 0.19 258);
  --color-accent-deep: oklch(43% 0.2 262); --color-accent-edge: oklch(39% 0.16 260);
  --color-glyph-1: oklch(89% 0.025 254); --color-glyph-2: oklch(81% 0.045 255); --color-glyph-3: oklch(70% 0.085 256); --color-glyph-4: oklch(60% 0.13 257);
  --color-graphite-glyph-1: oklch(33% 0.03 262); --color-graphite-glyph-2: oklch(41% 0.05 260); --color-graphite-glyph-3: oklch(53% 0.1 258);
  --color-key-face: oklch(99.4% 0.003 250); --color-key-edge: oklch(80% 0.016 254);
  --font-display: "Familjen Grotesk", system-ui, sans-serif; --font-body: "IBM Plex Sans", system-ui, sans-serif;
  --font-outlier: "JetBrains Mono", ui-monospace, monospace;
  --radius-card: 8px; --radius-input: 6px; --radius-pill: 999px;
  --cell-w: 8px; --cell-h: 16px; --cut: 8px; --cut-l: 16px;
  --rule-hair: 1px; --shadow-card: 0 1px 2px oklch(21% 0.028 262 / 0.06);
  --shadow-key: 0 3px 0 0 var(--color-key-edge), 0 6px 8px -4px oklch(21% 0.028 262 / 0.28), inset 0 1px 0 oklch(100% 0 0 / 0.9);
  --shadow-key-accent: 0 3px 0 0 var(--color-accent-edge), 0 6px 8px -4px oklch(30% 0.12 260 / 0.45), inset 0 1px 0 oklch(100% 0 0 / 0.22);
  --shadow-key-press: inset 0 1px 2px oklch(21% 0.028 262 / 0.14);
  --tracking-display: -0.028em; --display-weight: 600;
}
```

## Type

- **Display:** Familjen Grotesk 600 on heads and figures, 500 on item titles, `--tracking-display`, line-height 1.02, sentence case, tabular figures; a count at 60px and over is the loudest type.
- **Body:** IBM Plex Sans 400 and 500.
- **Labels, table heads, status:** Familjen Grotesk 500 a step smaller, `--color-muted`. Never mono.
- **Code and glyphs:** JetBrains Mono for code, machine values and the field; never a label, head or chip.

## Surfaces

- A 1px `--color-rule` edges every surface and splits every row; neutrals tilt to hue 250 to 260.
- Panels, chips and fields are cut on two opposite corners: `border-radius: var(--cut-l) 4px` with `corner-shape: bevel round bevel round` inside `@supports`, `--cut` on small parts, plain 8px and 6px radius as the fallback. Depth is `--shadow-card` and a paper step; only keys have an edge.
- The ground is a generated ASCII field on one canvas, never a picture: noise sampled per 8 by 16 cell into a character ramp, tinted `--color-glyph-1` to `-4` with `--color-accent-deep` for the densest cells, shaped by the product's own flow (raw on one side, resolved on the other). It sits behind the hero; one divider row and one graphite panel (graphite glyph tints) may repeat it, four places at most; a dot grid on the cell stands in without script.
- Graphite is the dark material: `--color-graphite` under `--color-graphite-ink`, `--color-graphite-2` for a selected line or header strip, `--color-graphite-muted` for comments. Syntax takes `--color-accent-2`, never a rainbow. Two bands a page at most, one graphite.
- Photographs are rare: one at most, a real system seen from a distance, in the duotone, no type on it.

## Range

- **A table that is the API:** ruled full width, machine values in mono, one row on the cobalt wash.
- **A mapping:** two graphite panes, input and output, matched lines joined by hairline elbows.
- **A timeline as a ruler:** real seconds on one hairline, attempts as notched ticks with their status in Familjen 600 at display size, waits as dimension lines, failure in the error colour.
- **A working control on the prompt's numbers:** its result as one large figure over a meter of fifty mono cells.

## Controls

- Keycaps: a key-face button on a 3px bottom edge that lifts 1px on hover and sinks on press; the one primary is a solid cobalt key. Options are keys on a sunken paper-3 tray, the chosen one pressed.
- A command is a cut chip with a working copy key. Links take a cobalt underline on hover. Inputs are cut, `--color-muted` border, cobalt focus.
- Status is text with one icon, never a filled chip. Cobalt stays under 5% of a screen outside the field.

## Motion

The field runs at 30 fps with a pointer lens, pauses off screen, and is one composed still under reduced motion. Keys travel over `--dur-micro`; connectors draw in once. No bounce, no parallax.

## Voice

Declarative and specific, like a good changelog: the event, the endpoint, the status code. No hype adjectives.

## Do-nots

- Never a warm accent, a pill or a gradient button.
- Never noise for its own sake: the field maps traffic or state the product has, and no type sits on its densest cells.
- Never fake code: a snippet compiles or returns; with no host in the prompt, call `example.com`.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Familjen+Grotesk:wght@500;600&family=IBM+Plex+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-family: var(--font-display); font-weight: 600; letter-spacing: var(--tracking-display); color: var(--color-ink); } h3 { font-weight: 500; }
.key { border: var(--rule-hair) solid var(--color-rule-2); border-radius: var(--radius-input); padding: 0 var(--space-lg); min-height: 48px; background: var(--color-key-face); color: var(--color-ink); font: 500 var(--text-md)/1 var(--font-display); box-shadow: var(--shadow-key); transition: transform var(--dur-micro) var(--ease-out), box-shadow var(--dur-micro) var(--ease-out); }
.key:hover { transform: translateY(-1px); } .key:active { transform: translateY(3px); box-shadow: var(--shadow-key-press); }
.key--primary { background: var(--color-accent); border-color: var(--color-accent-edge); color: var(--color-accent-ink); box-shadow: var(--shadow-key-accent); }
.cut { border: var(--rule-hair) solid var(--color-rule); border-radius: var(--radius-card); background: var(--color-paper); }
@supports (corner-shape: bevel) { .cut { border-radius: var(--cut-l) 4px var(--cut-l) 4px; corner-shape: bevel round bevel round; } }
.graphite { background: var(--color-graphite); color: var(--color-graphite-ink); } .graphite .token { color: var(--color-accent-2); }
a { text-decoration-color: var(--color-rule-2); text-underline-offset: 0.2em; } a:hover { text-decoration-color: var(--color-accent); }
```
