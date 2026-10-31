---
name: Coral
slug: coral
genre: modern-minimal
paper: light 97 55
display: grotesk-sans General Sans
accent: warm 30
posture: restrained
keywords: saas, platform, billing, payments, invoicing, dashboard, b2b, startup, product, pricing, analytics, fintech, workflow, team, onboarding, trust, warm, human, calm
material: warm grey paper and a felt desk, cotton stationery lit from the left, General Sans throughout with Geist Mono figures, letterpress card controls, coral pressed into the stock for the one settled state
photo: muted sepia=8
pictured: Conversational FAQ, Desk hero
---

# Coral

A warm, plain product voice made physical: fine stationery on a felt desk, seen from above in one daylight from the left. Records are cotton sheets, envelopes and index cards with real edges; controls are letterpress cards; one coral ink is pressed in where something is settled. General Sans throughout. Not a cream editorial page, not a skeuomorphic toy, not a blue SaaS template.

## Tokens

```css
:root {
  --color-paper: oklch(97% 0.006 55); --color-paper-2: oklch(94.5% 0.007 55); --color-paper-3: oklch(91.5% 0.009 55);
  --color-ink: oklch(21% 0.012 38); --color-ink-2: oklch(29% 0.013 40); --color-muted: oklch(47% 0.013 45);
  --color-rule: oklch(87% 0.009 55); --color-rule-2: oklch(81% 0.011 55);
  --color-accent: oklch(74% 0.125 30); --color-accent-ink: oklch(21% 0.012 38); --color-accent-2: oklch(54% 0.165 29); --color-focus: oklch(54% 0.17 30);
  --color-cotton: oklch(98.8% 0.0045 80); --color-desk: oklch(94.3% 0.008 64); --color-print: oklch(23% 0.012 38);
  --color-board: oklch(22% 0.011 40); --color-board-type: oklch(96.5% 0.006 70); --color-paid: oklch(55.5% 0.15 33);
  --tex-cotton: url("cotton.svg"); --tex-desk: url("felt.svg");
  --shade: 32% 0.03 50; --lit: 100% 0.005 80; --deep: 7% 0.01 40;
  --font-display: "General Sans", ui-sans-serif, system-ui, sans-serif; --font-body: var(--font-display);
  --font-outlier: "Geist Mono", ui-monospace, monospace;
  --radius-card: 8px; --radius-input: 6px; --radius-pill: 999px; --radius-stock: 8px; --rule-hair: 1px;
  --shadow-card: 0 1px 2px oklch(20% 0.01 35 / 0.05);
  --edge-stock: inset 0 1px 0 oklch(var(--lit) / 0.9), inset 0 -1px 0 oklch(var(--shade) / 0.07), 0 0 0 0.5px oklch(var(--shade) / 0.22), 0 1px 0 oklch(var(--shade) / 0.12);
  --cast-stock: 6px 5px 10px -6px oklch(var(--shade) / 0.3); --cast-stock-lift: 12px 10px 18px -8px oklch(var(--shade) / 0.3);
  --press-groove: inset 1px 1.5px 2px oklch(var(--shade) / 0.16), inset -1px -1px 0 oklch(var(--lit) / 0.9), 0 0 0 0.5px oklch(var(--shade) / 0.2);
  --tracking-display: -0.03em; --display-weight: 600;
}
```

## Type

- **Display:** General Sans 600, `--tracking-display`, line-height 1.02 to 1.08, sentence case, roman. A lone price sets at two to three times `--text-display`, tracked -0.05em, line-height 0.85, its unit beside it at `--text-title` in 500.
- **Body:** General Sans 400 and 500. On stock, `--color-print`; on board, `--color-board-type`.
- **Labels:** General Sans 500 a step smaller, sentence case, `--color-muted`.
- **Figures in a column:** Geist Mono 400 (General Sans has no tabular figures). A price in a sentence or a head stays General Sans.

## Surfaces

- One light, from the left: each paper object takes a lit edge top and left, a shade edge bottom and right, and a cast falling right (`--edge-stock`, `--cast-stock`).
- The hero ground is a desk: `--color-desk` under a daylight radial from the left and a generated felt texture. Records the product handles are built as stationery on it: invoices, letters and statements on cotton sheets, a window envelope with glassine showing the address, replies as correspondence index cards, a groove pressed into a card. Each is CSS on `--color-cotton`, sized from one unit so it scales whole.
- Texture is generated, never a picture: the build writes `cotton.svg`, a 360px tile of two stitched feTurbulence layers (cloud 0.011, grain 0.92, warm and faint) with short fibre strokes, under a lit-to-shade gradient on every paper object; `felt.svg` the same at 0.018. Sections stay plain.
- The settled state (paid, signed, booked) is pressed into the stock: the word in General Sans 600 in `--color-paid`, through an SVG filter that offsets a shade wall into the letterforms and lets a noise mask leave the ink uneven, tilted a few degrees.
- One `--color-ink` band, the board; stationery on it casts from `--deep`.
- Photographs are rare: work at arm's length in daylight, muted; built stationery answers first.

## Range

- **The job played as paperwork:** the product's task told in its own documents on the desk (a sheet into an envelope, a reply card tucked under, the outcome pressed in), built in the hero and reused below.
- **Records as an index:** replies, bookings or clients as cotton index cards stacked with offset tabs, beside their record on a full sheet.
- **The price on the board:** the lone figure huge in paper beside a ruled list of what it pays for; the action sits on stationery laid on the band (an envelope flap, a card).
- **The other side:** what the recipient sees, built on cotton, a groove control rewriting it live.

## Controls

- Letterpress cards, not pills: 8px radius, 48px tall, cotton stock with `--edge-stock` and `--cast-stock` and the label pressed in (a lit text shadow below it); the primary is ink board with the label pressed the other way. Hover lifts 1px into `--cast-stock-lift`; active presses 1px down.
- A choice of two to four is a groove pressed into cotton (`--press-groove`, 12px radius) with a cotton card riding in it to the chosen stop.
- Inputs 48px, 6px radius, 1px `--color-muted` border, deep coral focus. Status is an ink outline; coral is spent only on the pressed settled state, link underlines and focus.

## Motion

Once, after fonts load and in view: the job plays on the desk in about six seconds, transforms and opacity only, paused off screen, then still. Reduced motion and no script show the finished state.

## Voice

Plain, warm second-person sentences about the work and the money: who, how much, when, what the product did. Never cute.

## Do-nots

- Never cool paper, a blue signal or a second light; every shadow falls right.
- Never a pill button or a flat square button; controls are pressed cards.
- Never a photograph of paper; stationery is built in CSS.
- Never coral as a band, a fill behind text or a head; it is the pressed ink of one settled state.

## Build hint

```html
<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-weight: var(--display-weight); }
.desk { background-color: var(--color-desk); background-image: radial-gradient(90% 120% at 0% 30%, var(--color-cotton), transparent 62%), var(--tex-desk); }
.stock { background-color: var(--color-cotton); background-image: linear-gradient(100deg, var(--color-cotton), transparent 45%), var(--tex-cotton); color: var(--color-print); box-shadow: var(--edge-stock), var(--cast-stock); }
.btn { min-height: 48px; padding: 0 var(--space-lg); border: 0; border-radius: var(--radius-stock); font-weight: 500; transition: transform var(--dur-short) var(--ease-out); }
.btn--card { background-color: var(--color-cotton); background-image: var(--tex-cotton); color: var(--color-print); text-shadow: 0.5px 0.75px 0 var(--color-cotton); box-shadow: var(--edge-stock), var(--cast-stock); }
.btn--ink { background: var(--color-board); color: var(--color-board-type); text-shadow: 0 -0.75px 0 var(--color-ink); box-shadow: var(--cast-stock); }
.btn:hover { transform: translateY(-1px); box-shadow: var(--edge-stock), var(--cast-stock-lift); } .btn:active { transform: translateY(1px); }
.fig { font-family: var(--font-outlier); font-variant-numeric: tabular-nums; }
a:hover { text-decoration-color: var(--color-accent-2); }
```
