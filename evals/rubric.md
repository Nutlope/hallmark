# Hallmark eval rubric

Hallmark's one job: emit UI that looks **made, not generated**. This rubric
scores that job against two external anchors and Hallmark's own craft axes.

## Anchors

1. **Impeccable's slop standard** — "37 patterns that mark an interface as
   AI-generated" across 8 dimensions (impeccable.style/slop). The
   deterministic, CLI-checkable subset is encoded in `detector.mjs`.
2. **Hallmark's pre-emit self-critique** — six craft axes (philosophy,
   hierarchy, execution, specificity, restraint, variety) plus honest copy.
   These are taste calls, scored 1–5 by an LLM judge per fixture.

## Dimensions (each 0–5)

| # | Dimension | Source | Scored by | What a 5 looks like |
|---|---|---|---|---|
| 1 | **visual** | Impeccable | detector | No side-tab stripes, glass, or decorative sparklines |
| 2 | **typography** | Impeccable | detector | Distinctive faces, ≤3 families, comfortable leading, mixed-case body |
| 3 | **color** | Impeccable | detector | Tokenised palette, no gradient text / AI purple, real contrast |
| 4 | **layout** | Impeccable | detector | Asymmetric, 4px scale, ≤75ch measure, contiguous headings |
| 5 | **motion** | Impeccable | detector | Scoped transitions, no overshoot, reduced-motion guard |
| 6 | **interaction** | Impeccable | detector | Button hierarchy, no emoji icons, specific copy |
| 7 | **responsive** | Impeccable | detector | overflow-x clipped, minmax tracks, no feature amputation |
| 8 | **general** | Impeccable + Hallmark | detector | focus-visible, stamp present, full state coverage |
| 9 | **craft** | Hallmark | LLM judge | A clear position, instant hierarchy, in-spec execution, brief-specific, restrained, structurally varied, honest |

**Fixture score** = mean of the detector dimensions plus craft × 20 (0–100).
In v2, the cross-fixture `structure` order parameter is also folded into each
fixture score. **Cycle score** = mean of fixture scores.

## Judge sidecar (per fixture, 1–5)

`philosophy`, `hierarchy`, `execution`, `specificity`, `restraint`,
`variety`, `honesty`. A score < 3 on any axis means the fixture would have
triggered a Hallmark revision pass before emit.

## How a cycle works (hillclimbing)

1. Run `node run.mjs --cycle N --eval vX` → detector + judge → cycle score.
2. Read the failing rules. For each, ask **"why didn't the skill prevent
   this?"** — the answer is a gap in `SKILL.md` / `references/`.
3. Close the gap in the skill (new/strengthened gate or rule), then bring the
   fixtures into line with the strengthened skill.
4. Re-run. The score is the cycle's result. The skill — not just the
   fixtures — is what improved.

## Why the eval is versioned (v1 → v2)

Per *"Your Evals Will Break and You Won't See It Coming"*: static evals are
structurally reactive and silently miss new failure regimes. Once fixtures
saturate v1, the detector is no longer measuring slop — it is measuring
"slop v1 already knows about." v2 adds order-parameter-style meta checks and
adversarial fixtures that probe the tells v1 cannot see, then we hillclimb
again.
