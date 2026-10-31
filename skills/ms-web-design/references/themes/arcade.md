---
name: Arcade
slug: arcade
genre: playful
paper: dark 14 312
display: pixel Silkscreen and Bungee
accent: chromatic-ember 40
posture: full-palette
keywords: game, indie, game studio, launch party, demo night, hackathon, festival, meetup, retro, pixel, arcade, nostalgia, synth, lo-fi, toy, zine, club night, loud
material: aubergine CRT ground, lilac-white ink, Bungee capitals split in RGB over Chivo, Silkscreen figures, hard offset shadows, ember and acid signals
photo: tint accent
pictured: Marquee Hero, Stage hero
---

# Arcade

A late-night cabinet: an aubergine ground under a CRT screen, Bungee capitals split in RGB over Chivo, Silkscreen figures, hard offset shadows, two loud inks that take turns like two players. Photographs come through the screen, tinted in the lead. It is loud through colour, lettering, light and press physics, never drawn props; not a neon synthwave poster, not a pixel-art game page.

## Tokens

```css
:root {
  --color-paper: oklch(14% 0.04 312); --color-paper-2: oklch(18.5% 0.042 312); --color-paper-3: oklch(23% 0.045 312);
  --color-ink: oklch(95% 0.014 315); --color-ink-2: oklch(87% 0.018 315); --color-muted: oklch(71% 0.024 315);
  --color-rule: oklch(34% 0.05 312);
  --color-accent: oklch(66% 0.215 40); --color-accent-2: oklch(88% 0.195 115); --color-accent-ink: oklch(14% 0.04 312);
  --color-focus: oklch(88% 0.195 115);
  --color-crt-r: oklch(63% 0.24 25); --color-crt-g: oklch(80% 0.25 140); --color-crt-b: oklch(60% 0.24 265); --color-crt-c: oklch(78% 0.14 200); --color-shade: oklch(8% 0.02 315);
  --font-display: "Bungee", "Impact", sans-serif; --font-body: "Chivo", ui-sans-serif, sans-serif; --font-outlier: "Silkscreen", monospace;
  --radius-card: 4px; --radius-pill: 0; --rule-hair: 1px; --rule-bar: 2px;
  --shadow-card: 6px 6px 0 var(--color-accent-2);
  --tracking-display: 0; --display-weight: 400;
}
```

Two dials, each stated in the stamp (`arcade: ember/grille`). Colourway, lead over answer on ground: `ember` (the block above), `sodium` (80% 0.165 72 over 60% 0.145 242 on 14% 0.030 300) or `oxblood` (83% 0.150 90 over 58% 0.200 25 on 16% 0.028 330). Screen: `grille` (1px vertical RGB stripes at low alpha) or `mask` (a triad dot lattice on a 3px pitch). Never mix two on a page.

## Type

- **Display:** Bungee 400, uppercase, untracked, line-height 1.02, for the h1, one statement line and the wordmark, each under 28 characters. It carries the RGB split: 1 to 2px of `--color-crt-r` one way and `--color-crt-c` the other, zero blur, one split line per screen.
- **Heads and body:** Chivo; section heads 900 at -0.02em and line-height 1, sentence case; prose 400 at 1.6.
- **Figures:** Silkscreen 700, untracked, tabular, at 40px and up only (it smears smaller), in the two inks, with the unit beside it in Chivo 700. Never a word in Silkscreen but a unit like PM.
- **Labels:** Chivo 700 a step smaller, sentence case.

## Surfaces

- `--rule-bar` on wells and anything pressable, `--rule-hair` in `--color-rule` between rows; 4px radius, square tags and inputs.
- Depth: the zero-blur acid offset on anything pressable, a ground step on a well, the cursor row (a row filled ember with `--color-accent-ink` type, like a selected menu line) for the one thing a list wants chosen. Never blur.
- Bands: `--color-paper-2` under the screen, or one ember field with `--color-accent-ink` type and no RGB split. Two a page at most.
- Photographs: the night from inside the room: hands on a stick, keys lit from below, players from behind, nobody facing the lens. Tinted, a `--rule-bar` border, under the screen; big and few.
- The screen (`texture.md` § 4): the dial's layer and a `--color-shade` scanline, static, on bands, wells and photographs; never under running text, never a bezel.

## Range

- **Figures as a score line:** the prompt's real numbers in Silkscreen at `--text-display-s` and up, ember and acid alternating, parted by `--rule-bar` verticals across the twelve columns.
- **Two-player comparison:** two wells side by side, one keyed ember and one acid (a top bar and the figure ink), rows matched across them for two audiences or two choices; the inks are the players, nothing is drawn.
- **A timetable or price list as a menu:** Rows of Silkscreen times or prices against Chivo 900 titles on hairlines, one cursor row lit ember.
- **Statement and working control:** one Bungee line at display size on the ember field; or the press surface as a stepper with a running total in Silkscreen at display size.

## Controls

- The press surface: an ember fill, Chivo 700, a `--rule-bar` ink border and the acid offset, beside the same surface unfilled. Hover moves away from the shadow, active slams toward it; a stepper button is the same surface square.
- Links in ink with a 2px acid underline; inputs 52px, square, a `--rule-bar` border in `--color-muted`.
- Ember leads and acid answers across controls and figures; never a third ink.

## Motion

Press physics on `--dur-micro` and `--ease-out`. A cursor row lights on `steps(1)`, no fade; the RGB split may widen 1px on a display line that links.

## Voice

Coin-op plain, said over the noise: the night, the hour, the door price, the machines. Short lines, verbs first, no nostalgia.

## Do-nots

- Never magenta and cyan as the pair, never a starfield; the screen is the texture.
- Never a soft shadow, a phosphor glow or a gradient on a button.
- Never a drawn sprite, joystick, controller or pixel character; the night is photographed.
- Never a page of tinted photographs back to back: an ember picture beside an ember picture is one orange wall.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Bungee&family=Chivo:wght@400;700;900&family=Silkscreen:wght@700&display=swap" rel="stylesheet">
```

```css
h1, .display { font-family: var(--font-display); font-weight: 400; line-height: 1.02; text-transform: uppercase; text-shadow: -1.5px 0 0 var(--color-crt-r), 1.5px 0 0 var(--color-crt-c); }
h2, h3 { font-family: var(--font-body); font-weight: 900; letter-spacing: -0.02em; line-height: 1; }
.figure { font-family: var(--font-outlier); font-weight: 700; color: var(--color-accent-2); font-variant-numeric: tabular-nums; }
.btn { background: var(--color-accent); color: var(--color-accent-ink); border: var(--rule-bar) solid var(--color-ink); border-radius: var(--radius-card); padding: var(--space-sm) var(--space-lg); font-weight: 700;
  box-shadow: var(--shadow-card); transition: translate var(--dur-micro) var(--ease-out), box-shadow var(--dur-micro) var(--ease-out); }
.btn:active { translate: 3px 3px; box-shadow: 2px 2px 0 var(--color-accent-2); }
.btn--secondary { background: transparent; color: var(--color-ink); }
.row:hover, .row[aria-current] { background: var(--color-accent); color: var(--color-accent-ink); transition: background-color var(--dur-micro) steps(1); }
.well { background: var(--color-paper-2); border: var(--rule-bar) solid var(--color-rule); border-radius: var(--radius-card); }
.crt { position: relative; isolation: isolate; }
.crt::after { content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image:
    repeating-linear-gradient(to right, color-mix(in oklab, var(--color-crt-r) 5%, transparent) 0 1px, color-mix(in oklab, var(--color-crt-g) 5%, transparent) 1px 2px, color-mix(in oklab, var(--color-crt-b) 5%, transparent) 2px 3px),
    repeating-linear-gradient(to bottom, transparent 0 2px, color-mix(in oklab, var(--color-shade) 16%, transparent) 2px 3px); }
```
