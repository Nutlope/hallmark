# Custom theme - the ritual and the protocol

Loaded only when the custom route is confirmed at Step 2.6 of the Design flow. Custom is **made-to-measure for one brief**, written inline into the page's `:root`, never a permanent catalog entry. It spans two depths: **tuned** (a complete OKLCH palette + free-font pairing on Hallmark's structures) and **bespoke** (structure and composition designed from first principles too). One route, chosen depth.

**The freedom is the combination, never the floor.** Every constraint in [`color.md`](color.md), [`typography.md`](typography.md), and [`anti-patterns.md`](anti-patterns.md) still applies, and **every slop-test gate fires unchanged at every depth** (unpicked variants drafts alone defer the sweep to promotion, per [`verbs/variants.md`](verbs/variants.md)). The Step 5 preview surfaces the direction, posture, palette, and pairing in plain text before any code is emitted, so the user can redirect.

Custom exists because the model's own taste is an attractor. Left alone, a model asked for "something unique" ships the same two or three looks per category, every time. The ritual below is a set of outside interventions that break that pull: named rejections, a deterministic draw, a scene the palette must obey, and a contract the build is audited against.

## Two routes, plain English

- **catalog** - the 24 named themes, rotated by the Rotation block in [`SKILL.md`](../SKILL.md). The default. Most briefs use it and never hear otherwise.
- **custom** - made-to-measure, at the depth the brief needs:
  - **Tuned** - a one-off palette + pairing built for one brief, keeping Hallmark's macrostructures and archetypes.
  - **Bespoke** - when the brief's structure itself is the ask, the composition is designed from first principles too. Same route, deeper end. See § Bespoke depth.

Custom never extends the catalog with a permanent theme.

## § Triggers

Do not offer catalog-vs-custom on every prompt; that is friction, not discipline. Surface the fork only when the brief carries one of these signals:

1. **Explicit ask** - "custom", "custom theme", "tailored to our brand", "make it ours", "something unique", "play with the colors and fonts", "I want my own palette".
2. **Distinctiveness ask** - "distinctive", "stand out", "memorable", "not generic", "make it a whole thing", "nothing off the shelf".
3. **Named brand colour** - a specific anchor as hex / OKLCH / name: "use our terracotta", "the brand red is #c0392b", "anchor on sea-blue".
4. **Two or more vibe words** pointing somewhere the catalog cannot go: "moss, lichen, soft pink" / "sun-drenched, market-day" / "late-night, neon, brutalist deli". One adjective ("warm", "technical") is a tone, not a signal; the catalog already carries it.
5. **Brand-mood reference attached** - a swatch, moodboard, or Pantone chip. (A page screenshot routes to `study` instead.)
6. **A singular structural vision** (routes to the bespoke depth) - "no theme", "from scratch", "fully bespoke", "art-direct it", or a page shape no macrostructure covers (a scroll-assembled poem, a ticket-shaped page, an interactive periodic table).
7. **The visible offer was taken** - Step 1 adds *"Want this made-to-measure? Say `custom`"* to greenfield product-launch briefs; the user saying `custom` there is signal enough.

If a signal fires, ask one short follow-up before picking a theme:

> *"This brief reads like a custom system would fit better than the 24 named themes. Want me to construct one tuned to <one-line summary of the vibe>, or stay on the catalog for variety + speed?"*

Wait for the answer. Custom (or yes / go) continues below from § The ritual. Catalog (or silence) drops the fork and proceeds with the catalog route. **Default is catalog; silence never routes to custom.** If no signal fires, do not mention the fork at all.

---

## § The ritual

Runs on every custom build, both depths, in order, before any palette work. Each step produces one or two written lines in the reply; the whole ritual reads as a short paragraph of decisions, not a form.

### R.1 · Reflex check

Name the category's obvious aesthetic AND the second-order trap, then reject both in writing. Two altitudes, both mandatory:

- First order: the aesthetic anyone would guess. Tea brand: sage, cream, forest green. Fintech: navy and emerald trust palette. AI tool: near-black with a glowing gradient.
- Second order: the "tasteful" fallback a design-literate model reaches for after dodging the first. Tea: editorial serif on bone paper. Fintech: monochrome Swiss restraint. AI tool: mono type and terminal green.

Format: *"Reflex check: rejecting <first-order> (the category default) and <second-order> (the tasteful fallback)."* Landing on either after writing this line means the self-check failed; redirect before continuing.

Third altitude, **the mirror**: if the slate you are about to write would fit the category's OTHER products unchanged, it is category gravity wearing a slate's clothes. Sharpen entries until at least three are only defensible for THIS product.

### R.2 · Spent defaults

Hallmark's own house defaults count as already spent for this brief family. Declare it before writing the slate. The spent table:

| Brief family | Already spent (do not land here) |
| --- | --- |
| warm / bookish / food / family | cream paper · serif display · lamplight amber accent |
| tech / developer / AI | near-black surface · one neon accent · mono labels |
| editorial / studio / portfolio | bone paper · high-contrast serif · hairline rules everywhere |
| playful / consumer | rounded sans · candy accent on white · blob shapes |
| luxury / craft | ivory · letterspaced small caps · no accent |
| health / science | clinical white · single blue · geometric sans |
| finance | navy · emerald · tabular mono |
| events / music | black · duotone photo treatment · condensed caps |

The spent look can still be *earned* if the draw lands on a direction that genuinely demands it; what is banned is drifting there by default.

### R.3 · The slate

List ~7 grounded directions, numbered 1-7. Each is a **concrete visual system, artifact, place, or ritual this audience already knows**, one line each, with the germ of a system grammar. Not adjectives, not moods. Good slate entries name things that exist: a regional print tradition, a specific era of packaging, an instrument's control surface, a municipal document, a shop interior the audience has stood in.

Format per entry: *"3. The pharmacy blotter: clinical buff card, one federal-blue rule system, dosage-table typography."*

### R.4 · The draw

The model never hand-picks from its own slate; its favourite is deterministic, and refusing that argmax is the whole point. An outside pick decides:

```
node <skill-dir>/scripts/seed.mjs "<brief-slug>" --n 7 --wild 2
```

The script prints a reproducible line: `draw: n/7 (seed <slug>·<date>·r0) · wildcards: <name>, <name>`. Paste it into the Picks block (which, on a custom run, emits after this ritual). Re-roll (only when the user asks): rerun with `--reroll 1`, `--reroll 2`, and so on; it usually lands elsewhere (there is no exclusion; roll again if it repeats), and the seed key keeps every roll reproducible.

**Wildcards.** The two dealt entries come from [`direction-atlas.json`](direction-atlas.json), a curated deck of real design-history lineages. A wildcard **replaces the drawn slate entry only if it beats it on both axes: audience identification and product clarity.** Weigh in one written line each; discard losers without ceremony. Wildcards exist to break category gravity, not to win by novelty.

**Script-less fallback** (no Node, no shell): N = (letter count of the brief, spaces and punctuation excluded) mod 7, pick slate entry N + 1; each re-roll adds 3 (mod 7). Print the arithmetic so the pick is reproducible: *"draw fallback: 142 letters mod 7 = 2, entry 3."* Skip wildcards, and stamp the seed as `seed: fallback-<letters>·<date>·r<n>`.

### R.5 · The scene sentence

One concrete sentence placing a real person at a real time and place with the product. *"A subscriber in Vermont, 6:43am in early January; the kettle just clicked off; one lamp on."* The scene decides **surface lightness and light temperature** before any palette work: that sentence forces a dark surface with warm interior light, not a daylit white. § B.2 consumes this decision directly. A scene that does not constrain the surface is not concrete enough; rewrite it.

### R.6 · Colour posture

Commit to exactly one, with a one-line justification:

- **Restrained** - accent <= 5% of any viewport; the catalog's discipline. Right when type and structure carry the brand.
- **Committed** - one colour carries 30-60% of the surface, routed through the surface tokens (`--color-field`, the paper family), while the accent token proper stays <= 5%. Right when the brief IS a colour ("the brand is that orange").
- **Full palette** - 3 or 4 named roles, each with a stated job (field, signal, seal, ink). Right for editorial systems and print-lineage directions.
- **Drenched** - the surface IS the colour; ink and rules derive from it. Right for single-message pages and poster energy.

Posture is declared in the stamp and the log. Gate 23 reads the posture: a declared surface colour is not accent footprint; undeclared accent sprawl still fails. Contrast gates 40-41 bind unchanged on any coloured surface. See [`color.md`](color.md) § Colour postures.

### R.7 · The direction contract

Five blocks, <= 150 words total, written into the artifact as a comment directly BELOW the macrostructure stamp and critique line (the stamp stays line 1, per gate 20), before any code, and mirrored in the Step 5 preview:

```
/* direction contract · seed <key>
 * THESIS: the one-sentence position this page takes.
 * OWN-WORLD: what makes it not-anyone's-page; the drawn direction, named.
 * STORY: the scene sentence.
 * FIRST-VIEWPORT: what the fold shows, concretely.
 * FORM: structure + the one signature move.
 */
```

If a block reads like a mood ("elegant, premium feel"), the direction is not decided yet; rewrite it until each block is checkable. **The signature move** named in FORM is the one structural or visual idea a visitor would describe to a friend; a page without one is a template with nice tokens.

---

## § Bespoke depth

Most custom runs are tuned. **Bespoke** is the deep end, fired by signal 6: the brief's structure itself is the ask and no catalog shape fits. The ritual runs identically (R.1 through R.7); bespoke changes what the build may drop:

**It drops:** the named-theme tokens (palette written inline for this page only; § B still governs how); the genre cluster routing; the fixed macrostructure + archetype catalog (compose the structure for the idea; a novel hero, nav, or section is encouraged when it serves the FORM block); the diversification rotation (bespoke is a one-off, though it must not clone a recent bespoke run).

**It keeps:** every universal slop-test gate; accessibility and contrast (APCA / WCAG, visible `:focus-visible`, `prefers-reduced-motion`, semantic landmarks, alt text); the font ban list and free-baseline discipline (§ C); OKLCH palette discipline (§ B); one orchestrated motion; the Step 5 preview before code; the stamp + log.

Bespoke is more design judgment, not less: a bespoke page that reads generic, or trips a gate, has failed. It is also rare; reaching for bespoke on a vanilla brief is over-reach.

---

## § A · The one follow-up question

Once custom is confirmed, ask **one** thing in **one** message:

> *"Custom needs one input - describe the brand's vibe in 4-8 words. Examples: 'archival warmth, hand-set, no varnish' · 'industrial precision, cool, technical' · 'moss, lichen, soft pink, herbal'.*
>
> *Optional second input: an anchor colour - hex, OKLCH, or a name like 'terracotta', 'sea-blue'. Skip it and I'll pick one from the vibe."*

Do not ask anything else; audience / use / tone from Step 1 plus the vibe is enough. Two or three words is enough to proceed; a paragraph gets compressed to 4-8 words for the stamp. The ritual runs regardless of how the user answers; the vibe feeds R.3's slate.

---

## § B · Palette construction

Build in this order; each step applies the cited rule without restating it.

### B.0 · Posture and scene set the frame

Before any values: the scene sentence (R.5) fixes the paper's lightness band and light temperature; the posture (R.6) decides where large colour lives. Committed and Drenched route their colour through the paper / field tokens, never by inflating the accent's footprint.

### B.1 · Anchor accent first

- Convert the named or hex anchor to OKLCH; clamp chroma to **0.12-0.20** (inside the cap in [`color.md`](color.md) § Palette construction). When the brief names a REAL brand, the anchor comes from `.hallmark/brand-spec.md` ([`brand-truth.md`](brand-truth.md)), never from memory.
- No anchor given: derive hue from the vibe: warmth 30-60° · technical 220-250° · botanical 130-160° · late-night neon 280-320° · sun-drenched 60-80°. Chroma 0.12-0.16.

### B.2 · Paper

- Paper L from the scene sentence: bright / airy → **L 95-98%** (warm-tinted) · archival / editorial → **L 92-95%** · clinical / spec-sheet → **L 98-100%** near-white, cool-tinted · dark / late-night → **L 12-18%**, anchor-tinted.
- **Always tint paper toward the anchor hue, chroma 0.005-0.020** per [`color.md`](color.md) § Principles (tint the greys).
- Committed posture: the carried colour becomes `--color-field` at the scene's lightness band; paper stays a quiet neighbour. Drenched posture: paper IS the anchor at usable lightness; ink derives from it.
- Paper-2: step ±2-4% L. Paper-3 (optional): ±5-7% L.

### B.3 · Ink

- Paper L < 50: ink L **88-96%**. Paper L >= 50: ink L **16-24%**.
- Tint ink chroma **0.005-0.014** toward the anchor. Ink-2: 4-8% L toward paper, same hue family.

### B.4 · Supporting greys

Step ~6-10% L between paper and ink, all tinted toward the anchor (chroma 0.005-0.018): `--color-rule` (L ~70-82% light paper / ~26-34% dark), `--color-rule-2` (4-6% closer to paper), `--color-muted` (L ~38-56%), `--color-neutral` (L ~30-56%). The L-steps give typographic depth without leaning on accent.

### B.5 · Focus

Same hue as accent, chroma 0.18-0.22, L ±5% of accent. `:focus-visible` only; appears instantly.

### B.6 · Accent-ink

Text on accent fills: accent L > 50 uses ink; accent L <= 50 uses paper. Verify APCA >= Lc 60 / WCAG 4.5:1 for body, 3:1 for large text.

### B.6b · Texture (print-lineage draws only)

When the drawn direction's lineage is print (riso zine, letterpress, ticket stock, line-printer), it may draw ONE artifact from [`texture.md`](texture.md) under that file's budget tokens. Digital-native draws take none; texture is earned by lineage, never added for warmth.

### B.7 · Verification

Gate 7 (no pure #000/#fff): paper and ink both carry chroma. Gate 22 (no zero-chroma neutrals): every grey >= 0.005. Gate 23 (accent footprint): plan the accent's role; under Committed / Drenched the carried colour lives in field / paper tokens and the accent proper still keeps to a signal.

---

## § C · Font pairing

Custom pulls from the tone pairings in [`typography.md`](typography.md), and **may mix tones** - that is the freedom:

- Editorial display + Technical body: an academic-tone SaaS.
- Brutalist display + Editorial body: a manifesto magazine.
- Playful display + Austere body: a creator-tool brand.
- Luxury display + Technical body: a hand-crafted dev tool.

One display face, one body face, optional mono. The discipline: **free-baseline only** unless the user confirms licences; the banned defaults stay banned (gate 1); variable fonts preferred. Then confirm the pair reads: enough weight contrast in the display, body legible at >= 14px across 45-75ch, mono-on-mono only when the mono IS the design. The drawn direction (R.4) should be audible in the pairing: a ledger direction wants tabular figures; a playbill direction wants wood-type energy in the display slot.

---

## § D · Axes and posture

A custom theme declares its diversification values explicitly so the Rotation block in [`SKILL.md`](../SKILL.md) fires the same as catalog:

- **Paper band:** dark (L < 30%) · mid (30-85%) · light (> 85%).
- **Display style:** italic-serif · roman-serif · geometric-sans · grotesk-sans · mono · display-condensed-bold · display-heavy · slab-serif · system-native · risograph-bold · handwritten (rare).
- **Accent hue band:** warm 10-60° · cool 200-300° · neutral (chroma < 0.05) · chromatic-other (sub-tag the anchor: `chromatic-moss ~140°`).
- **Posture** (fourth logged value): restrained · committed · full-palette · drenched.

## § E · Stamp format

```css
/* Hallmark · macrostructure: <name or "bespoke: <one-line shape>"> · <hero archetype + knobs>
 * theme: custom · direction: "<drawn direction name>" · vibe: "<4-8 words>"
 * paper: oklch(<L>% <C> <H>) · accent: oklch(<L>% <C> <H>) · display: <font> · body: <font>
 * axes: <paper-band> / <display-style> / <accent-hue> · posture: <posture>
 * seed: <slug>·<date>·r<n> · contract: kept (5/5) · studied: no · v1.2.0
 */
```

The `contract: kept (5/5)` line is written only after the finish review below confirms it. This extends the base stamp; the tone and the contrast / nav / footer / mobile records SKILL.md Step 6 and the gate list require still ride on line 1. The direction contract comment (R.7) sits directly below the stamp and critique line.

## § F · `.hallmark/log.json` entry shape

```json
{ "date": "2026-07-23",
  "macrostructure": "Workbench",
  "theme": "custom",
  "direction": "Line-printer output",
  "posture": "committed",
  "seed": "loop-observability·2026-07-23·r0",
  "wildcard": true,
  "theme_axes": "dark / grotesk-sans / chromatic-other (amber ~75)",
  "vibe": "industrial precision, cool, technical",
  "hero": "Ledge/H4",
  "fingerprint": "Stacked numbered|Two-column asymmetric|Hairline|Outlined|None|Number-tick",
  "nav": "N8", "footer": "Ft4",
  "enrichment": "none",
  "brief": "Loop · payment-rail observability" }
```

Catalog entries keep recording `theme: <name>` and skip the custom fields. The Rotation block treats both the same: a custom run must differ from the previous entry on at least one axis, whatever route that entry used.

## § The finish review

Before the slop test, re-read the direction contract promise by promise: THESIS still the page's position? OWN-WORLD visible in the shipped surface, or did the build drift back toward a spent default? STORY's light still in the palette? FIRST-VIEWPORT actually what the fold shows? FORM's signature move present and load-bearing? Any unkept promise = revise, not ship. Then run Step 7 as normal (every gate, both depths). Custom-only; this review never replaces the gate sweep.

---

## § G · Worked examples

### G.1 · Coffeebox, the full ritual

**Brief:** *"Landing page for Coffeebox, a small-batch coffee subscription. Roast on Sunday, ship on Monday, drink Tuesday. Audience: people who already buy good coffee. Tone: warm, hand-set, editorial. Custom confirmed."* **Vibe answer:** *"archival warmth, hand-set, no varnish."* **Anchor:** *"terracotta."*

- **Reflex check:** rejecting kraft-paper-and-coffee-browns (category default) and italic-serif-on-cream editorial (tasteful fallback).
- **Spent:** warm/food family, so cream + serif + lamplight is spent unless the draw earns it back.
- **Slate:** 1 the roastery chalkboard; 2 the grocer's price ticket; 3 the shipping manifest; 4 the Sunday broadsheet food column; 5 the enamel tin label; 6 the postal frank and rubber stamp; 7 the harvest-lot auction sheet.
- **Draw** (illustrative; your date changes it): `node scripts/seed.mjs "coffeebox-subscription" --wild 2` printed a draw landing on entry 6 with two wildcards, Seed packet and Card catalog. Wildcard weigh-in: Seed packet loses to the postal direction on product clarity (subscription = things that arrive in the mail); Card catalog loses on audience identification. **Building: the postal frank.**
- **Scene:** *"A subscriber on a Tuesday at 7:10am, tearing the strip on a kraft mailer at the kitchen counter, stamp-marks inked slightly off-square."* Light paper, warm, daylit.
- **Posture:** Full palette (kraft field, frank red, ink black, airmail blue seal), each with a stated job.
- **Contract:** THESIS: your coffee is mail, and mail used to be beautiful. OWN-WORLD: postal franking, done with restraint. STORY: the scene above. FIRST-VIEWPORT: wordmark as a circular frank, one mailer photo-placeholder, ship-date line, subscribe CTA as a stamp outline. FORM: Long Document rhythm; the signature move is the frank-mark rule system dating each section like a postmark.
- **Palette:** paper `oklch(95% 0.015 80)` kraft-tinted · ink `oklch(24% 0.012 60)` · accent `oklch(55% 0.17 30)` frank red · seal `oklch(58% 0.10 240)` airmail blue (named role, footprint budgeted) · rule `oklch(80% 0.015 75)`. **Pair:** display Bricolage Grotesque (hand-set energy, roman) · body Source Serif 4 · mono JetBrains Mono for lot numbers. **Axes:** light / geometric-sans / warm · posture: full-palette.

### G.2 · Loop, a Committed dark build

**Brief:** *"Loop is real-time payment-rail observability for fintech platform engineers. Use: try it / contact sales. Tone: industrial, cool, technical. Custom confirmed."* **Vibe:** *"industrial precision, cool, technical."* **Anchor:** *(skipped)*.

- **Reflex check:** rejecting navy-and-emerald fintech trust (category default) and neon-on-black terminal cosplay (tasteful fallback).
- **Slate:** 1 the double-entry ledger; 2 the SWIFT wire printout; 3 the control-room annunciator panel; 4 the oscilloscope face; 5 the bank vault engineering plate; 6 the reconciliation stamp; 7 the trading-floor pit board.
- **Draw** (illustrative): the draw landed on entry 4 and dealt Line-printer output and Blueprint as wildcards. Line-printer output beats entry 4 on both axes (engineers live in logs; the report idiom carries latency tables natively). **Building: the line-printer report.**
- **Scene:** *"An on-call engineer at 2am, one monitor lit, tearing yesterday's batch report off the tractor feed."* Dark surface, cool, one warm task light.
- **Posture:** Committed. The greenbar stripe carries 40% of the surface as `--color-field`; the alert amber accent stays a signal.
- **Contract:** THESIS: observability is a report you can trust at 2am. OWN-WORLD: greenbar line-printer output, modernised, not cosplayed. STORY: above. FIRST-VIEWPORT: masthead as a job header (run id, date), one live latency table in greenbar stripes, try-CTA as a form-feed break. FORM: Workbench macrostructure; the signature move is greenbar striping as the page's only surface rhythm.
- **Palette:** paper `oklch(15% 0.012 220)` · field stripe `oklch(19% 0.020 160)` greenbar · ink `oklch(93% 0.010 210)` · accent `oklch(75% 0.15 75)` alert amber · rule `oklch(30% 0.012 215)`. **Pair:** display Space Grotesk 600 · body Geist · mono IBM Plex Mono for every figure. **Axes:** dark / grotesk-sans / chromatic-other (amber ~75°) · posture: committed.

### G.3 · Mossroot, compressed to the stamp

Herbal apothecary in Porto; vibe *"moss, lichen, soft pink, herbal"*; the draw (illustrative) landed on the slate's herbarium-sheet entry, wildcards discarded; scene: overcast morning shop light; posture: restrained.

```css
/* Hallmark · macrostructure: Catalogue · F1 catalogue knobs: tiles=8, columns=2, rule=hairline-between
 * theme: custom · direction: "the herbarium sheet" · vibe: "moss, lichen, soft pink, herbal"
 * paper: oklch(96% 0.018 145) · accent: oklch(72% 0.13 350) · display: Cormorant Garamond · body: EB Garamond
 * axes: light / roman-serif / chromatic-other (dusty-pink) · posture: restrained
 * seed: mossroot-apothecary·2026-07-23·r0 · contract: kept (5/5) · studied: no · v1.2.0
 */
```

---

## What custom does **not** do

1. **Does not invent themes that ignore the rules.** Every band, cap, tint requirement, font ban, and slop-test gate carries forward. The freedom is the combination.
2. **Does not save themes for reuse.** A custom run is per-output; nothing writes back to the skill catalog's tokens. (The project-root `tokens.css` emit from SKILL.md Step 6 still happens; that file belongs to the user's project.)
3. **Does not ask multiple follow-up questions.** One vibe answer (+ optional anchor) is enough.
4. **Does not relax the diversification rule.** Custom entries declare axes + posture; the rotation fires on both routes.
5. **Does not bypass the Step 5 preview.** Direction, posture, palette, and pairing surface in plain text before code.
6. **Does not skip the draw.** The model's own #1 pick is exactly what the draw exists to refuse; a custom run with no seed line in the stamp is over-invented. Audit it; redirect.
