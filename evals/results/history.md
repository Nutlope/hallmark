# Eval history — Hallmark anti-slop hillclimb

Score = mean of detector dimensions plus craft, × 20 (0–100). v2 also
folds in the cross-fixture `structure` order parameter. Dimensions 1–8
are the deterministic Impeccable detector; `craft` is the LLM-judge mean
of Hallmark's six axes + honesty.

| Cycle | Eval | Rules | Score | visua | typog | color | layou | motio | inter | respo | gener | craft | struc | Change |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | v1 | 37 | **74.2** | 3.89 | 4.52 | 3.61 | 3.33 | 4.33 | 3.33 | 3.89 | 2.78 | 3.71 | — | — |
| 2 | v1 | 37 | **78.0** | 3.89 | 5.00 | 4.72 | 3.33 | 4.33 | 3.33 | 3.89 | 2.78 | 3.81 | — | +3.8 |
| 3 | v1 | 37 | **81.8** | 3.89 | 5.00 | 4.72 | 5.00 | 4.33 | 3.33 | 3.89 | 2.78 | 3.86 | — | +3.8 |
| 4 | v1 | 37 | **85.9** | 3.89 | 5.00 | 4.72 | 5.00 | 4.33 | 5.00 | 3.89 | 2.78 | 4.05 | — | +4.1 |
| 5 | v1 | 37 | **98.3** | 5.00 | 5.00 | 5.00 | 5.00 | 5.00 | 5.00 | 5.00 | 5.00 | 4.24 | — | +12.4 |
| 6 | v2 | 43 | **76.4** | 4.33 | 4.44 | 4.57 | 3.78 | 4.40 | 4.75 | 4.33 | 4.00 | 3.57 | 0.00 | -21.9 |
| 7 | v2 | 43 | **82.4** | 5.00 | 4.56 | 5.00 | 3.78 | 5.00 | 5.00 | 4.33 | 4.67 | 3.89 | 0.00 | +6.0 |
| 8 | v2 | 43 | **84.8** | 5.00 | 4.78 | 5.00 | 4.22 | 5.00 | 5.00 | 4.67 | 4.67 | 4.06 | 0.00 | +2.4 |
| 9 | v2 | 43 | **97.6** | 5.00 | 5.00 | 5.00 | 4.55 | 5.00 | 5.00 | 5.00 | 5.00 | 4.26 | 5.00 | +12.8 |
| 10 | v2 | 43 | **98.7** | 5.00 | 5.00 | 5.00 | 5.00 | 5.00 | 5.00 | 5.00 | 5.00 | 4.32 | 5.00 | +1.1 |

## Notes per cycle

- **Cycle 1 (v1)** — Baseline: skill applied as-is; residual slop across motion, color, layout, interaction, visual.
- **Cycle 2 (v1)** — Typography & palette discipline: gate 70 (single-typeface floor) + gate 71 (AI-palette / raw colour in gradients). ledger gets a real pairing and a solid headline; bloom tokenised.
- **Cycle 3 (v1)** — Layout discipline: gate 72 (justified text) + gate 73 (skipped heading levels). fernweh de-centred and re-leveled; rote 3-equal grids varied; kiln spacing back on the 4px scale.
- **Cycle 4 (v1)** — Interaction discipline: gate 74 (button hierarchy) + gate 75 (reflexive modal). Secondary register added to ledger/fernweh; fernweh emoji icons replaced with numbered walks; kiln modal swapped for an inline reserve section.
- **Cycle 5 (v1)** — Cleanup + gate 76 (decorative chart) + gate 77 (feature amputation; detector media-extractor hardened). kiln side-tab/sparkline removed and gallery reflows; ledger motion scoped; stamps + overflow clip + focus rings across all three.
- **Cycle 6 (v2)** — EVAL UPGRADE -> v2 (your evals will break): +6 detector rules (hero-float/gate54, dark-mode reflex, hero-metric, icon-tile-above-heading, mono-as-shorthand, everything-in-cards) + cross-fixture order parameter (macrostructure reuse) + 2 adversarial fixtures (pulse, vellum). Re-measure only, no fixes.
- **Cycle 7 (v2)** — Resist the brief on pulse: gate 78 (dark-mode reflex) + gate 79 (glassmorphism). Flipped to a light single-accent palette; removed neon gradient/glass/gradient-text/side-tab; replaced fabricated 10x/99.99%/50k+ metrics with honest facts; scoped motion, focus rings, button hierarchy.
- **Cycle 8 (v2)** — pulse structural cleanup: gate 80 (icon-tile-above-heading) + gate 81 (mono-as-shorthand) + gate 82 (everything-in-cards). Distinctive face, empty icon tiles dropped, vanity KPI strip de-metered into a baseline fact row, grids varied, hero bottom-weighted, overflow clipped.
- **Cycle 9 (v2)** — Order parameter + reading comfort: gate 83 (long-form leading/measure) + gate 84 (cross-output macrostructure reuse). pulse re-keyed stat-led -> feature-stack; vellum stamped long-document with a Fraunces/Spectral pairing, 1.6 leading, 68ch measure, ragged-right. structure 0 -> 5.
- **Cycle 10 (v2)** — Final consolidation: enforce gate 54 (hero bottom-weight) across the three originals; de-meter ledger's big-number stat strip into an inline fact row (clears the hero-metric tell v2 surfaced). All five fixtures detector-clean on v2.
