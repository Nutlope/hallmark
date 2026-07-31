#!/usr/bin/env python3
"""run-matrix.py: orchestrator for the Hallmark eval pipeline.

Pipeline (each stage is a subprocess, filters passed through):

  1. gen-direct.py    generate artifacts for every selected arm x brief x pack
  2. screenshot.mjs   hero/full/mobile PNGs into eval/_shots/
  3. score.mjs        sloplint mechanical gates -> score.json per run
  4. (repair loop)    see below
  5. judge.py         vision judge -> judge.json per run (skips b5/b6)
  6. report.mjs       assemble eval/index.html gallery

Repair loop (--repair N):
  The repair machinery lives INSIDE gen-direct.py (--repair mode); this
  script only sequences gen -> score -> gen --repair -> score. In each of up
  to N rounds, gen-direct.py --repair 1 re-prompts every cell whose
  score.json still has FAIL findings: the previous artifact plus the failing
  findings are sent back to the SAME arm with "Fix these mechanical
  failures, re-emit the complete file", and the artifact is overwritten.
  gen-direct.py re-scores each repaired cell itself (via score.mjs), and
  this script re-takes screenshots with --force and runs a full score pass
  after every round. The loop exits early once no FAILs remain.

Flags:
  --brief b1..b6 (default all), --arm <id> (default all enabled),
  --pack floor|full (default floor), --repair N (default 0),
  --skip-gen, --skip-judge, --force, --dry-run.
  --tier is accepted but currently a no-op: it is reserved for the future
  Tier-A harness wrapper described in eval/README.md; gen-direct.py is the
  Tier-B (bare API) generator and takes no tier argument.

--dry-run prints or dry-runs every stage without any API call (no keys
needed). --skip-gen starts from existing artifacts (screenshot onward).

Examples:
  python3 eval/run-matrix.py --repair 2
  python3 eval/run-matrix.py --brief b1 --arm glm52-together --pack full
  python3 eval/run-matrix.py --skip-gen --force
"""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
GEN = ROOT / "gen-direct.py"
SCREENSHOT = ROOT / "screenshot.mjs"
SCORE = ROOT / "score.mjs"
JUDGE = ROOT / "judge.py"
REPORT = ROOT / "report.mjs"
RUNS = ROOT / "runs"


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Hallmark eval matrix orchestrator")
    p.add_argument("--brief", default="all", help="brief id b1..b6, or 'all' (default)")
    p.add_argument("--arm", default="all", help="arm id from models.json, or 'all' enabled (default)")
    p.add_argument("--pack", default="floor", choices=["floor", "full"],
                   help="prompt pack for gen-direct.py (default floor)")
    p.add_argument("--tier", help="reserved for the Tier-A harness wrapper; currently a no-op")
    p.add_argument("--repair", type=int, default=0, metavar="N",
                   help="max repair rounds after scoring (default 0)")
    p.add_argument("--skip-gen", action="store_true",
                   help="skip generation; screenshot/score/judge/report only")
    p.add_argument("--skip-judge", action="store_true", help="skip the vision judge stage")
    p.add_argument("--force", action="store_true",
                   help="pass --force to gen, screenshot, and score stages")
    p.add_argument("--dry-run", action="store_true",
                   help="dry-run every stage; nothing is sent anywhere")
    return p.parse_args()


def stage_filters(args: argparse.Namespace) -> list[str]:
    """Filters for screenshot/score/judge, which treat missing flags as 'all'
    and match --arm as a run-dir prefix."""
    out: list[str] = []
    if args.brief != "all":
        out += ["--brief", args.brief]
    if args.arm != "all":
        # Pin to the exact arm-pack cell so other packs are untouched.
        out += ["--arm", f"{args.arm}-{args.pack}"]
    return out


def run_stage(name: str, cmd: list[str], required: bool = True) -> bool:
    print(f"\n== {name}: {' '.join(cmd)}", flush=True)
    result = subprocess.run(cmd, cwd=str(ROOT))
    if result.returncode != 0:
        print(f"stage '{name}' exited {result.returncode}", file=sys.stderr)
        if required:
            sys.exit(result.returncode)
        return False
    return True


def total_fails(args: argparse.Namespace) -> int | None:
    """Sum sloplint FAILs across matching runs; None if no scores yet."""
    if not RUNS.is_dir():
        return None
    total, seen = 0, 0
    for brief_dir in sorted(RUNS.iterdir()):
        if not brief_dir.is_dir():
            continue
        if args.brief != "all" and brief_dir.name != args.brief:
            continue
        for run_dir in sorted(brief_dir.iterdir()):
            if not run_dir.is_dir():
                continue
            if args.arm != "all" and not run_dir.name.startswith(args.arm):
                continue
            if not run_dir.name.endswith(f"-{args.pack}"):
                continue
            score_path = run_dir / "score.json"
            if not score_path.exists():
                continue
            try:
                score = json.loads(score_path.read_text())
            except (OSError, json.JSONDecodeError):
                continue
            if score.get("unavailable"):
                continue
            seen += 1
            total += int(score.get("summary", {}).get("fails", 0))
    return total if seen else None


def main() -> None:
    args = parse_args()
    if args.tier:
        print(f"note: --tier {args.tier} is reserved for the Tier-A wrapper; ignored for now")

    dry = ["--dry-run"] if args.dry_run else []
    force = ["--force"] if args.force else []
    gen_args = ["--brief", args.brief, "--arm", args.arm, "--pack", args.pack]
    filters = stage_filters(args)

    if not args.skip_gen:
        if not GEN.exists():
            print(f"error: {GEN} not found; use --skip-gen to run scoring stages only",
                  file=sys.stderr)
            sys.exit(1)
        run_stage("generate", [sys.executable, str(GEN), *gen_args, *force, *dry])

    run_stage("screenshot", ["node", str(SCREENSHOT), *filters, *force, *dry])
    run_stage("score", ["node", str(SCORE), *filters, *force, *dry])

    for round_no in range(1, max(args.repair, 0) + 1):
        fails = total_fails(args) if not args.dry_run else None
        if not args.dry_run and not fails:
            print(f"\nrepair: no FAILs outstanding, stopping before round {round_no}")
            break
        print(f"\n-- repair round {round_no}/{args.repair}"
              + (f" ({fails} FAILs outstanding)" if fails is not None else ""))
        ok = run_stage(f"repair-gen r{round_no}",
                       [sys.executable, str(GEN), *gen_args, "--repair", "1", *dry],
                       required=False)
        if not ok:
            break
        run_stage(f"repair-shots r{round_no}",
                  ["node", str(SCREENSHOT), *filters, "--force", *dry])
        run_stage(f"repair-score r{round_no}",
                  ["node", str(SCORE), *filters, "--force", *dry])
        if args.dry_run:
            break  # one illustrative round is enough when nothing changes

    if args.skip_judge:
        print("\n== judge: skipped (--skip-judge)")
    else:
        run_stage("judge", [sys.executable, str(JUDGE), *filters, *dry], required=False)

    if args.dry_run:
        print("\n== report: node report.mjs (skipped in dry run)")
    else:
        run_stage("report", ["node", str(REPORT)])
    print("\nmatrix complete" + (" (dry run)" if args.dry_run else "")
          + "; open http://127.0.0.1:4201 via serve.py to browse")


if __name__ == "__main__":
    main()
