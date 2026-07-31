# Theme - Ledger

Modern-minimal, fintech-terminal register. The page for **treasury software, a business bank, a payments API, an accounting or reconciliation product, a finance dashboard**: the Mercury / Ramp school, or Bloomberg density tamed. A dark navy instrument panel, ruler-drawn hairlines, exactly ONE teal signal on the figures that matter, and **data as the hero**: a reconciled balance and a live ledger, not a hero illustration. It reads like a closed book at 06:00 UTC: precise, calm, audited.

Loaded eagerly by SKILL.md Step 3 whenever the catalog pick is `ledger`. The OKLCH palette + font stack live in [`site/css/tokens.css`](../../../../site/css/tokens.css) under `[data-theme="ledger"]`. Reference build: [`site/examples/ledger-01/`](../../../../site/examples/ledger-01/) (a treasury landing whose hero is an account panel: reconciled balance, sparkline, live transaction table).

> **The one dark option in the modern-minimal cluster.** Coral and Cobalt own the light lane; Ledger fills the dark, data-as-hero fintech slot. It is dark but **not atmospheric** (that is Midnight): no glow, no bloom, no serif, no thin display. Flat navy, tabular numerals, teal on the positive figures. An instrument panel, not a mood.

## Axes (diversification)

- **Paper band** - **dark navy** (`--color-paper` `L 20%`, hue 255, chroma 0.025), lifted a hair to `--color-paper-2` (`L 24%`) for cards and a subtle top-band gradient under the nav. A cool terminal ground, distinct from Midnight's deeper `L 15%` and from every light theme.
- **Display style** - **grotesk-sans** (`--font-display` Hanken Grotesk `600`, `--tracking-display` `-0.02em`) paired with **tabular mono** (`--font-mono` IBM Plex Mono, `font-variant-numeric: tabular-nums`) on every figure. Not a serif, not a thin display.
- **Accent hue** - **chromatic teal** (`--color-accent` `oklch(78% 0.12 185)`). A single positive-figure signal, sitting clear of Cobalt's cobalt (256), Midnight's blue (220), and Coral's coral (28). Teal = reconciled, credited, live.

## Reference register

Mercury · Ramp · Brex · Modern Treasury · Stripe (dashboard) · Bloomberg terminal (density tamed) · Plaid · Mercury Treasury · a business-banking or reconciliation console.

The aesthetic: the fintech product landing where **the money is the hero**: a big reconciled balance in tabular mono, a live ledger table, a 30-day sparkline, mono meta and status. Dense but legible; a terminal you would trust with the close. Never name any of these in the output.

**Patron-saint reference (internal):** *Mercury's calm dark console* + *Bloomberg's tabular density, halved*, recoloured to one teal signal. When in doubt, ask "does this read like a treasury console a controller signs off on, or like a crypto landing?" Keep the former: no neon, no gradients on numbers.

## Required dependencies

1. **Fonts** - **Hanken Grotesk** (display + body, 400/500/600/700), **IBM Plex Mono** (all figures, labels, status, meta; 400/500). No serif anywhere. Google Fonts:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
   ```
2. **`tabular-nums` everywhere numeric** - `.mono { font-family: var(--font-mono); font-variant-numeric: tabular-nums; }` on the balance, ledger amounts, spec values, meta, clock. Columns must align digit-for-digit; this is the theme's spine.
3. **A live-feel account panel** - the hero's right column: a pulsing `LIVE` dot, an as-of-UTC timestamp, a reconciled balance, an inline SVG sparkline, and a scrollable ledger `<table>`. Optional one-shot count-up of the balance on load, then static; gates behind `prefers-reduced-motion`.

## Signature moves

1. **Data-as-hero account panel, not an illustration** - the hero's right column is a `--color-paper-2` card (`--radius-card` 12px, one hairline `--color-rule`, a deep soft `--shadow-card`) holding a head row (`OPERATING · USD · ****4471` + a `LIVE` status), a reconciled balance, a sparkline, and a live ledger. Title + lede sit LEFT, panel RIGHT: asymmetric Stat-Led, never centred.

2. **The reconciled balance is the biggest thing on the page** - `--font-mono`, `tabular-nums`, `--color-accent` teal, `clamp(2.1rem, 5vw, 3.1rem)`. A small `$` cur superscript, faded `.09` decimals. Under it a mono meta line: `Reconciled balance · as of 06:00 UTC · +$18,204.55 today` with the delta in teal.

3. **A live ledger table** - a real `<table>` in mono/`tabular-nums`: Time, Description, Amount (right-aligned). Credits teal (`.pos`), debits `--color-muted` (`.neg`), a `matched` pill per row, hover raises the row to `--color-paper-3`. This is the second hero, not a decorative dashboard.

4. **One teal signal, on the figures that matter** (< 5% of any viewport) - positive amounts, the balance, the `LIVE` dot, the "all systems operational" bullet, and the **one** solid teal CTA (`Open an account`, `--color-accent-ink` dark text). Everything else is `--color-ink`/`--color-muted` on navy. Debits are never red; they are just muted.

5. **The 30-day sparkline** - an inline SVG line in teal over a fill that fades teal → transparent, captioned `30-DAY RECONCILED BALANCE`. One quiet chart that reads a real series, no axes, no grid, no second colour.

6. **Hairlines and one surface tier carry depth** - 1px `--color-rule` borders draw the nav, panel, table rows, `.section` tops, datasheet, and trust rows. Cards lift on `--color-paper-2` with a single deep `--shadow-card`; no glow, no inner gradients. Depth from borders and one shadow, not blur.

7. **Mono machine-readout labels** - eyebrows, `panel__head`, ledger headers, spec values, footer meta, and a live `UTC 06:00:12` nav clock in IBM Plex Mono, UPPERCASE, `0.06`-`0.14em` tracking. The terminal voice against the Hanken display.

8. **The datasheet, not the pitch** - features render as a dense `<dl>` spec grid ("A datasheet, not a pitch"): `dt` label left in ink, `dd` value right in mono. Trust renders as label/paragraph rows. Ledger argues in specifications, not adjectives.

## Motion

Composed and near-still. The `LIVE` dot pulses (opacity 1 → 0.4, `2.4s`). Ledger rows shift background on hover; buttons dip `translateY(1px)` on `:active`; nav links and `.tlink` shift border/colour on hover. An optional one-shot balance count-up on load, then static. **No parallax, no autoplay charts, no glow, no number-scrambling on scroll.** Everything gates behind `prefers-reduced-motion: no-preference`; reduced-motion ships static, fully visible, animations killed.

## Anti-patterns

- **No atmospheric glow / aurora / mesh / radial bloom / gradient text.** That is Midnight's lane. Ledger is a flat instrument panel: navy + hairlines + one teal.
- **No pure `#000` / `#fff`.** Dark navy paper (`L 20%`, hue 255), cool light ink (`L 93%`). Even the darkest surface stays chromatic.
- **No red debits, no second accent.** Debits are `--color-muted`; teal is the only chromatic colour on the page.
- **No code card / terminal-window hero.** That is Cobalt. Ledger's focal artefact is a financial account panel, not a `POST`/`200 OK`.
- **No proportional numerals on figures.** Every balance, amount, and spec value is `tabular-nums` mono; columns align or the theme breaks.
- **No pill / gradient CTAs.** One solid teal button at `--radius-input` (8px) + ghost buttons and `.tlink` typographic links. Name the destination (`Open an account`).
- **No centred-everything hero, no 3-equal-icon feature grid.** Title-left / panel-right; features are a dense datasheet, how-it-works a numbered 01/02/03 trio.
- **No fake dashboard clutter** - one sparkline, one ledger, real-looking sample numbers. No donut walls, no gauge rows, no confetti of KPIs. (Chart construction beyond the sparkline: [`data-viz.md`](../data-viz.md).)

## Macrostructure affinity

**Ledger loves these.**

- **Stat-Led** - deck ingredients: the hero balance panel, a numbered how-it-works trio, the datasheet, one trust row - dealt per macrostructures.md § deck *(canonical - ledger-01)*
- **SaaS / Product** - fintech landing where the console is the proof
- **Workbench** - the dashboard-first, tool-shaped page
- **Comparison / datasheet** - dense spec tables, controller-facing
- **Marquee** - when the hero is one confident figure and a live feed

## Macrostructure rejection

**Ledger refuses these.**

- **Letter** - too intimate; Ledger is a console, not a note
- **Manifesto** - too loud; Ledger argues in figures, not slogans
- **Photographic / image-led** - Ledger leads with the balance, not imagery
- **Long Document** - prose-led; route an editorial theme instead

## Voice fixtures

Declarative, numeric, audited. Name the figure, the feed, the lock time. No hype adjectives.

- *"Treasury, reconciled while you sleep."*
- *"Wake up to a closed book, not a queue of exceptions."*
- *"A datasheet, not a pitch."*
- *"Every figure audits back to the transaction that moved it."*
- *"Balances lock at 06:00 UTC, every day."*

Never any of: *seamless, robust, cutting-edge, leverage, synergy, revolutionary, unlock, supercharge, effortless, game-changing.* Never "click here." Name the balance, the feed, the control, the number.

## How Ledger differs from neighbouring themes

| vs | difference |
|---|---|
| **Cobalt** (light code-hero sibling) | Cobalt is cool near-white paper (`oklch(98.5% 0.004 250)`), electric cobalt (`0.20 256`), Space Grotesk / JetBrains Mono, and a **code/API card** hero. Ledger is dark navy (`oklch(20% 0.025 255)`), teal (`0.12 185`), Hanken / IBM Plex Mono, and an **account-panel** hero. Light-vs-dark and code-vs-money settle it: same cluster, opposite ground, different focal artefact. |
| **Midnight** (dark but atmospheric) | Both are dark near hue 250, but Midnight is **atmospheric**: deeper `L 15%`, blue accent (`0.16 220`), Geist + Instrument Serif, `--display-weight 300` with `0.16em` labels, numbered display + typewriter reveals. Ledger is **modern-minimal**: lifted `L 20%` navy, teal 185, Hanken `600`, tabular-mono data panels, flat and still. Mood vs instrument. |
| **Coral** (light warm modern-minimal) | Coral is warm-grey paper (`oklch(96.5% 0.005 50)`), warm coral accent (`0.165 28`), Geist, `--radius-pill 999px` soft pills, and a quiet title/lede hero. Ledger is dark navy, teal, `12px card / 8px control radii, and a data-as-hero panel. Opposite temperature and opposite ground. |

## Test brief expectations

Ledger should be a candidate when the brief mentions:

- *treasury · banking · fintech · payments · reconciliation · ledger · accounting · close · audit · balance · cash management · finance dashboard · payouts · settlement · compliance · SOC 2 · controller · CFO*
- Product categories: *business bank · treasury OS · payments API · accounting / recon tool · finance dashboard · fintech SaaS*
- Emotional tone: *precise · audited · calm · trustworthy · dense-but-legible · terminal · instrument-panel · dark*

Briefs that are warm / consumer / editorial / image-led route elsewhere (Coral for warm SaaS, Cobalt for dev tools, the editorial themes for content). When the brief is finance and wants to *show the numbers*, it is Ledger.

## Build hint

The first lines of CSS establish Ledger's anchor moves:

```css
html, body { overflow-x: clip; }
body { background: linear-gradient(180deg, var(--color-paper-2) 0%, var(--color-paper) 46%) no-repeat;
       background-color: var(--color-paper); color: var(--color-ink);
       font-family: var(--font-body); font-weight: 400; }

/* Every figure is tabular mono - the theme's spine */
.mono, .balance, .ledger, .spec__row dd {
  font-family: var(--font-mono); font-variant-numeric: tabular-nums; }
.pos { color: var(--color-accent); }   /* credits + the one signal; debits stay muted */

/* The account panel - one surface, one hairline, one deep shadow (no glow) */
.panel { background: var(--color-paper-2); border: 1px solid var(--color-rule);
         border-radius: var(--radius-card); box-shadow: var(--shadow-card); overflow: clip; }
.balance { color: var(--color-accent); font-weight: 500; letter-spacing: -0.02em;
           font-size: clamp(2.1rem, 5vw, 3.1rem); line-height: 1; }

/* Live ledger rows lift on hover - no red, ever */
.ledger td { border-bottom: 1px solid var(--color-rule); color: var(--color-ink-2); }
@media (hover: hover) { .ledger tbody tr:hover td { background: var(--color-paper-3); } }

/* Bordered sticky nav + the one teal button (8px, never a pill) */
.nav { border-bottom: 1px solid var(--color-rule); backdrop-filter: blur(14px); }
.btn--accent { background: var(--color-accent); color: var(--color-accent-ink);
               border-radius: var(--radius-input); }

.dot { animation: pulse 2.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; } }
```

Plus the Hanken Grotesk + IBM Plex Mono link and the small pulse/count-up script. Reference build: [`site/examples/ledger-01/`](../../../../site/examples/ledger-01/) - match its register (tokens, voice, motion feel), never its composition; reusing its section order, hero geometry, or grid is a gate-32-grade repeat.
