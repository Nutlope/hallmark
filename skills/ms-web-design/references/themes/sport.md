---
name: Sport
slug: sport
genre: editorial
paper: light 98 250
display: display-condensed Saira Condensed
accent: chromatic-volt 120
posture: restrained
keywords: running, marathon, race, training, fitness, gym, team, league, fixtures, standings, scoreboard, athletics, performance, splits, sportswear, club, match, tournament
material: cool concrete paper, blue-black ink, uppercase Saira Condensed over Albert Sans, condensed figures and mono times, two-weight rules, one volt fill
photo: duotone ink paper con=20
pictured: Stat-Led, Poster hero
---

# Sport

A results-sheet material: cool concrete paper, blue-black ink, Saira Condensed 800 in capitals over an Albert Sans body, big condensed figures and JetBrains Mono times, hairlines and one heavier bar rule, and volt as the only colour. Volt is a fill: ink sits on it, and it never sets a letter on paper. Photographs print in the ink, like a race programme. It reads fast because of the condensed caps, the numbers and the action, never a slant or a gradient; it is not a sportswear advert and not a neon gaming page.

## Tokens

```css
:root {
  --color-paper: oklch(98% 0.005 250); --color-paper-2: oklch(95% 0.006 250); --color-paper-3: oklch(91.5% 0.007 250);
  --color-ink: oklch(16% 0.080 260); --color-ink-2: oklch(22% 0.060 258); --color-muted: oklch(50% 0.020 250);
  --color-rule: oklch(78% 0.008 250); --color-rule-2: oklch(36% 0.060 255);
  --color-accent: oklch(88% 0.200 120); --color-accent-ink: oklch(16% 0.080 260); --color-accent-deep: oklch(58% 0.145 125);
  --color-focus: oklch(58% 0.145 125); --color-slot: oklch(76% 0.07 258);
  --font-display: "Saira Condensed", sans-serif; --font-body: "Albert Sans", ui-sans-serif, sans-serif;
  --font-outlier: "JetBrains Mono", ui-monospace, monospace;
  --radius-card: 4px; --radius-pill: 4px; --rule-hair: 1px; --rule-bar: 2px;
  --shadow-card: none;
  --tracking-display: -0.015em; --display-weight: 800;
}
```

## Type

- **Display:** Saira Condensed 800, uppercase, `--tracking-display`, line-height 1.02, upright, roman. A true condensed design, so the caps stack without crowding, even at poster scale over a photograph; the speed is in the caps, never a slant.
- **Body:** Albert Sans 400 and 500, sentence case.
- **Figures:** at statement size (a distance, a field size, a price, a date) Saira Condensed 800 with `tabular-nums`, from `--text-display-s` up, the label in Albert Sans beneath. In columns and live data (times, splits, bibs) JetBrains Mono 500, a step or more larger than its label. Mono is a stopwatch, never a label or a head.
- **Labels, captions, table heads, units:** Albert Sans 500 a step smaller, sentence case, untracked, `--color-muted`; on a volt fill every word is the ink.

## Surfaces

- Two rule weights, never boxed cards: `--rule-hair` in `--color-rule` rules rows and grids; the `--rule-bar` in `--color-rule-2` opens and closes a table and breaks a section.
- Radius 4px on controls, inputs and photographs; no pills.
- Depth from rules and paper steps, never shadows: a well is `--color-paper-2` under a bar rule.
- Bands: a `--color-paper-2` band, or one `--color-ink` band with paper type; two a page at most, never a volt band.
- Photographs: race photography at the runner's eye or lower: a pack mid-stride, legs and shoes on tarmac, a road climbing a valley side, a number being pinned on; hard daylight, the motion sharp, cropped tight, nobody posing. Printed in the ink on the paper (the `photo:` duotone), 4px radius, an inset ink hairline at 8%. Type on a photograph is paper over an ink scrim from its edge; a volt figure may hold a frame's corner with a fact (the mile, the time).
- No texture, no gradient but a photograph's scrim, no hard-offset shadow.

## Range

- **The race in figures:** three or four of the prompt's numbers in condensed caps at display size under the bar rule, parted by hairlines, one at most sitting on a volt fill.
- **A working control on the race's facts:** a pace or time planner on the ink band, the chosen time in mono at display size, every mile in a ruled grid that changes in place, the finish cell in volt.
- **Results as a sheet:** the bar rule opening and closing a table of bibs and times in mono, the followed runner's row lifted a paper step and its latest split in volt.
- **The course as stages:** start to finish as numbered stages on one bar rule, a condensed-cap title and one line each, the live stage on volt.

## Controls

- The control pair: a volt-filled block with ink text beside one bordered 2px in ink, both 4px, set in the display face's capitals with no added tracking; on a photograph the second takes paper.
- Links grow a `--color-accent-deep` underline on hover (3:1 on paper); inputs are 4px with a 1px `--color-rule` border and the `--color-focus` ring.
- The volt is always a fill under ink and under 5% of a screen: the primary control, an active row, one highlighted figure.

## Motion

Nothing moves except state and live data: a deep-volt underline grows under a link on hover, a row lifts one paper step, a live split changes in place, never counting up. No reveal, no parallax.

## Voice

Race-briefing plain: the distance, the time, the place, as a marshal calls them. Imperative heads in capitals, sentence case below, numerals over words, verbs over adjectives.

## Do-nots

- Never slant or italicise the display; the upright condensed cap is the speed.
- Never loosen the display tracking past zero, or tighten it until two capitals touch.
- Never warm paper; the ground is cool concrete, hue 250.
- Never volt type, a volt hairline on paper or a second accent; photographs print in the ink, never in their own colour.
- Never a medal, trophy, podium or jersey texture, drawn or photographed; the race is the road and the runners.

## Build hint

```html
<link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@800&family=Albert+Sans:wght@400;500&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```

```css
h1, h2, h3 { font-family: var(--font-display); font-weight: var(--display-weight); letter-spacing: var(--tracking-display); text-transform: uppercase; line-height: 1.02; }
.figure { font: var(--display-weight) var(--text-display)/0.9 var(--font-display); font-variant-numeric: tabular-nums; }
.time { font: 500 var(--text-2xl)/1 var(--font-outlier); font-variant-numeric: tabular-nums; }
.btn { border: var(--rule-bar) solid transparent; border-radius: var(--radius-card); padding: var(--space-sm) var(--space-lg); font: var(--display-weight) var(--text-md)/1.25 var(--font-display); text-transform: uppercase; }
.btn--primary { background: var(--color-accent); color: var(--color-accent-ink); }
.btn--secondary { border-color: var(--color-ink); color: var(--color-ink); }
.well { background: var(--color-paper-2); border-top: var(--rule-bar) solid var(--color-rule-2); }
.rule { border-top: var(--rule-bar) solid var(--color-rule-2); }
th, td { border-top: var(--rule-hair) solid var(--color-rule); }
.photo { border-radius: var(--radius-card); outline: 1px solid color-mix(in oklab, var(--color-ink) 8%, transparent); outline-offset: -1px; }
.scrim { background: linear-gradient(to top, color-mix(in oklab, var(--color-ink) 70%, transparent), transparent 60%); color: var(--color-paper); }
a:hover { text-decoration-color: var(--color-accent-deep); }
::selection { background: var(--color-accent); color: var(--color-ink); }
```
