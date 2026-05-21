# `evals/` — anti-slop eval harness

An eval-driven hillclimb that improved Hallmark against two external anchors:

- **Impeccable's slop standard** — "37 patterns that mark an interface as
  AI-generated" across 8 dimensions ([impeccable.style/slop](https://impeccable.style/slop)).
- **"Your Evals Will Break and You Won't See It Coming"** — why static evals
  silently miss new failure regimes, and the case for self-evolving evals
  ([wanglun1996.github.io](https://wanglun1996.github.io/blog/your-evals-will-break.html)).

## What's here

| File | Role |
|---|---|
| `rubric.md` | The scoring rubric: 8 detector dimensions + 1 craft (judge) dimension. |
| `briefs.md` | The briefs each fixture is the skill exercised on. |
| `detector.mjs` | Deterministic slop detector — the CLI-checkable subset of the 37 patterns + Hallmark gates. v1 = 37 rules, v2 = 43. |
| `run.mjs` | Merges detector + judge sidecars, computes the cross-fixture **order parameter**, snapshots a cycle, rebuilds `results/history.md`. |
| `config.json` | Which fixtures belong to eval v1 vs v2. |
| `fixtures/*.html` | Self-contained pages (what Hallmark emits). |
| `fixtures/*.judge.json` | Per-fixture craft scores (philosophy, hierarchy, execution, specificity, restraint, variety, honesty). |
| `results/` | One JSON snapshot per cycle + the running `history.md` table. |

## Run it

```bash
cd evals
node detector.mjs fixtures/pulse.html --eval v2   # inspect one page
node run.mjs --cycle 10 --eval v2 --label "..."   # score a cycle, update history
```

## The hillclimb (10 cycles)

**Phase 1 (v1, cycles 1–5)** drove the three originals from 74.2 → 98.3 by
closing gaps the detector found — each cycle added a real gate to
`references/slop-test.md` (gates **70–77**) and brought the fixtures into line.

**The break (cycle 6)** upgraded the eval to **v2**: six new detector rules
for failure modes v1 was blind to (notably hero-float / gate 54, which the
v1-perfect fixtures had been violating the whole time), a cross-fixture
**order parameter** (macrostructure reuse — variety is a property of the
*set*, not the page), and two adversarial fixtures (`pulse`, `vellum`). Score
fell 98.3 → 76.4, exactly as the blog predicts.

**Phase 2 (v2, cycles 7–10)** climbed back to 98.7, adding gates **78–84**
and resisting `pulse`'s dark/neon/metric-hero brief gravity.

The skill is the artifact that improved: 15 new gates, motivated by what the
eval could measure. See `results/history.md` for the full score table.
