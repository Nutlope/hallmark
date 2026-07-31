# Benchmarking `hallmark variants` speed

How to measure what the v2 changes actually buy: faster time to the first
direction, faster time to all directions ready, and fewer output tokens. Two
halves, because a variants run has two kinds of cost that need two kinds of
measurement:

- **Agent-side cost** (model latency and output tokens) needs a live,
  authenticated agent driving the real skill. It cannot be faked in this repo,
  so this doc gives you a hand-run protocol you execute on your own machine.
- **Mechanical cost** (server cold-start, picker first-paint, thumbnail
  generation) is deterministic plumbing with no model in the loop, so
  `eval/variants-bench.mjs` measures it directly and prints a table.

Nothing here calls a model or the network beyond loopback. The mechanical
harness stands up a throwaway greenfield run in the OS temp dir, drives the
real `scripts/variants/{start,thumbs,await}.mjs`, and tears it down.

## The four configurations

A variants run is a matrix of two independent choices: **how the directions are
generated** (sequentially in one context, or in parallel subagents) and **how
much each direction contains** (full pages, or `--sketch`: hero plus one
signature section plus footer). Layer progressive reveal on top and you get the
ladder worth measuring:

| # | Config | Generation | Depth | Reveal | Role |
| --- | --- | --- | --- | --- | --- |
| A | `sequential-full` | one context, v1 then v2 then v3 | full | all at end | v1 baseline |
| B | `parallel-full` | one subagent per direction | full | all at end | parallelism only |
| C | `parallel-sketch` | one subagent per direction | sketch | all at end | parallelism + cheaper drafts |
| D | `parallel-sketch+progressive` | one subagent per direction | sketch | each flips to `ready` as it lands | the v2 default |

Config A is exactly the v1 sequential fallback. Config D is what v2 aims users
at: parallel subagents, sketch depth by default on heavy briefs, and a manifest
that flips each direction to `status:"ready"` the moment its files land so the
picker reveals it immediately instead of waiting for the slowest sibling.

## What to record per configuration

Three numbers, plus the mechanical baseline the harness prints:

1. **Time-to-first-direction (TTFD)** - wall-clock from "the agent starts
   building" to the first direction being viewable in the picker. This is the
   number the user feels first. With progressive reveal it is roughly the time
   to build **one** direction, not three.
2. **Time-to-all-ready (TTAR)** - wall-clock until every planned direction is
   `status:"ready"` in the manifest. This is where parallelism pays.
3. **Total output tokens** - summed generated tokens across the run (all
   directions). This is where `--sketch` pays. Read it from the harness the
   agent runs in (Claude Code reports usage per turn; the eval Tier-B runner in
   `gen-direct.py` records `completion_tokens` in each `run.json`).

## Expected deltas (from the research)

Targets to check your measurements against, not guarantees. They compound.

- **Progressive reveal cuts TTFD to about one third.** In config A the user
  waits for all three directions before seeing anything; in config D they see
  the first direction after roughly one direction's worth of work. For three
  directions that is about `1/3` of the old wait to first pixels. This delta is
  the same shape whether depth is full or sketch, because it is about *when* the
  picker reveals, not *how much* each direction contains.
- **Sketch depth removes about 40% of output.** Hero plus one signature section
  plus footer is roughly 60% of a full page's markup and CSS, so drafting three
  sketches instead of three full pages trims total output tokens by about 40%.
  The winner is completed to full depth only after the pick, so the finished
  deliverable is unchanged; only the two archived losers stay as sketches.
- **Parallel generation compresses wall-clock about 2 to 2.8x.** Three
  directions built by three subagents finish in about the time of the slowest
  one plus fan-out overhead, versus the sum of three in sequence. The realized
  factor depends on how even the three are and on harness scheduling; treat
  anything in the `2x` to `2.8x` band as on-target for TTAR.

Rough model, three directions, per-direction build time `t`:

| | TTFD | TTAR | Output |
| --- | --- | --- | --- |
| A `sequential-full` | `3t` (all at end) | `3t` | `3 x full` |
| B `parallel-full` | `t` | `~t` + fan-out | `3 x full` |
| C `parallel-sketch` | `~0.6t` | `~0.6t` + fan-out | `~0.6 x (3 x full)` |
| D `parallel-sketch+progressive` | `~0.6t`, revealed on landing | `~0.6t` + fan-out | `~0.6 x (3 x full)` |

The point of the table is the shape, not the constants: A pays the full cost
before the user sees anything, D reveals the first direction fast, finishes all
three in about one direction's wall-clock, and spends the least output getting
there.

## Measuring the agent-side numbers on your own machine

You need the authenticated agent, so run this by hand:

1. Pick one brief and hold it fixed across all four configs. Use a heavy brief
   (the kind where `--sketch` is offered unprompted), or one of `eval/briefs.json`
   `b1`..`b3`.
2. For each config, note three timestamps: **start** (agent begins building),
   **first ready** (first direction shows in the picker), **all ready** (last
   direction flips). TTFD = first - start; TTAR = all - start. The manifest is
   the source of truth: each direction row carries `status`, and the picker's
   2s poll flips it, so watching the picker is enough. For an exact log, tail
   the run's `manifest.json` and stamp when each `status` becomes `"ready"`.
3. Record total output tokens from your harness's usage report.
4. Repeat 2 to 3 times per config and take the median; model latency is noisy.
5. Keep the brief, model, and machine identical across configs. You are
   measuring the config, not the weather.

Report as a 4-row table (one row per config) with TTFD, TTAR, output tokens,
and the derived ratios against config A.

## Measuring the mechanical numbers here

```sh
node eval/variants-bench.mjs            # n=3 pages, table
node eval/variants-bench.mjs --n 5      # stress the thumbnail step
node eval/variants-bench.mjs --json     # machine-readable
node eval/variants-bench.mjs --keep     # leave the run + server up to poke at
```

It reports:

- **server cold-start** - `start.mjs` spawning `serve.mjs` until the picker is
  listening and the `PICKER` line prints. This is the fixed startup tax paid
  once per run, independent of how many directions exist.
- **picker first-paint** - `GET /` for the static picker shell (median of 5).
  The shell is a constant string, so it paints in well under a millisecond and,
  crucially, paints *before any direction exists*. That is the mechanical proof
  of progressive-first: `start.mjs` can bring the picker up over an empty or
  all-`generating` manifest, so the user gets skeleton cards immediately and
  each direction fills in on a later poll.
- **state read** - `GET /api/state` (median of 5), which re-reads the manifest
  from disk on every hit. This is what the 2s poll costs; it stays flat as
  directions are added.
- **thumbnails** - `thumbs.mjs` screenshotting every `ready` page to
  `<run>/thumbs/<n>.png`, plus the per-thumbnail average. Skipped cleanly with a
  `pending` note when `thumbs.mjs` is not present, and `n/a` when no screenshot
  engine is installed (set `CHROME_PATH`, or install `puppeteer-core`, same
  dual-engine pattern as `eval/screenshot.mjs`).

Sample shape (numbers vary by machine):

```
  server cold-start   ~0.3 s    start.mjs -> serve.mjs listening + PICKER
  picker first-paint  ~0.5 ms   GET / (static shell, median of 5)
  state read          ~0.5 ms   GET /api/state (manifest reread, median of 5)
  thumbnails (3/3)    ~1.8 s    thumbs.mjs, all ready pages
  per-thumbnail       ~0.6 s    avg over 3 pages
```

Read the mechanical table as the floor under the agent-side numbers: cold-start
and first-paint are the plumbing cost the user pays regardless of model speed,
and they are small enough that TTFD is dominated by generation time, which is
exactly why parallel + sketch + progressive is the configuration that moves it.
