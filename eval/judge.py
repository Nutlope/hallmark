#!/usr/bin/env python3
"""judge.py: vision judge for eval artifacts (Python 3.12+, stdlib only).

Sends the hero and mobile screenshots of each run to the Anthropic API
(model claude-fable-5) with a fixed rubric and writes judge.json in the run
directory:

  { model, axes: {philosophy..variety: 1-5}, gates: {"6","9","42","43","45":
    "pass"|"fail"|"unclear"}, overall: 1-10, rationale, usage, generatedAt }

Briefs b5 and b6 are skipped (component and decline probes; the rubric is for
full pages). Existing judge.json files are skipped unless --force.

The API key is taken from the ANTHROPIC_API_KEY environment variable, or, if
unset, parsed from the keyFiles listed in eval/models.json. The key value is
never printed or written anywhere.

Usage:
  python3 eval/judge.py [--brief b1] [--arm fable-baseline] [--force] [--dry-run]
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent
RUNS = ROOT / "runs"
SHOTS = ROOT / "_shots"
MODELS_JSON = ROOT / "models.json"

JUDGE_MODEL = "claude-fable-5"
API_URL = "https://api.anthropic.com/v1/messages"
# Fallback judge when the Anthropic key is missing or out of credit:
# GLM-4.5V on Together (vision-capable, openai-compatible).
FALLBACK_MODEL = "Qwen/Qwen3-VL-235B-A22B-Instruct-FP8"
FALLBACK_URL = "https://api.together.xyz/v1/chat/completions"
FALLBACK_ENV = "TOGETHER_API_KEY"
SKIP_BRIEFS = {"b5", "b6"}

RUBRIC = """You are a strict design judge for AI-generated landing pages. You are shown two screenshots of the same page: first the desktop hero (1280x800 viewport) and second the full mobile page (375 wide).

Score the page 1-5 (integers) on each of these six axes:
- philosophy: does the page commit to one coherent aesthetic point of view, or is it a generic template?
- hierarchy: is there a clear reading order with decisive size/weight/spacing contrast?
- execution: craft quality of type, spacing, alignment, color; absence of broken or clipped layout.
- specificity: does the content and imagery feel written for THIS product, or could it be any SaaS page?
- restraint: does every decorative element earn its place, or is there noise (gradient soup, glow spam, icon confetti)?
- variety: does the layout structure feel distinct from the default AI page shape (hero, three cards, stats, CTA)?

Then give a verdict of "pass", "fail", or "unclear" on each judged gate (fail means the defect IS present):
- "6": centred-everything hero (headline, subhead, CTAs all centre-stacked with no compositional asymmetry).
- "9": undifferentiated rhythm (every section the same width, same padding, same centred layout, no tempo change).
- "42": AI-default nav (generic logo-left links-right pill-CTA nav indistinguishable from the stock template).
- "43": AI-default footer (four-column link farm plus social icons with filler links).
- "45": unmotivated decoration (blobs, glows, gradients, particles with no semantic anchor in the product).

Finally give overall: an integer 1-10 for the page as a piece of design work, and rationale: one sentence.

Respond with ONLY a JSON object, no markdown fences, no prose, exactly this shape:
{"axes":{"philosophy":n,"hierarchy":n,"execution":n,"specificity":n,"restraint":n,"variety":n},"gates":{"6":"pass|fail|unclear","9":"...","42":"...","43":"...","45":"..."},"overall":n,"rationale":"one sentence"}"""


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Vision judge for eval runs")
    p.add_argument("--brief", help="only this brief id")
    p.add_argument("--arm", help="only run dirs starting with this arm id")
    p.add_argument("--force", action="store_true", help="re-judge even if judge.json exists")
    p.add_argument("--provider", choices=["operator", "anthropic", "together"], default="operator",
                   help="operator (default): the Claude Code operator reviews the shots, no API spend; "
                        "anthropic / together: automated vision judge (spends that key)")
    p.add_argument("--dry-run", action="store_true", help="list what would be judged; no API calls")
    return p.parse_args()


def load_env_key(name: str) -> str | None:
    """Env first, then the keyFiles listed in models.json. Never printed."""
    key = os.environ.get(name)
    if key:
        return key.strip()
    try:
        key_files = json.loads(MODELS_JSON.read_text()).get("keyFiles", [])
    except (OSError, json.JSONDecodeError):
        key_files = []
    for kf in key_files:
        try:
            for line in Path(kf).read_text().splitlines():
                line = line.strip()
                if line.startswith(name + "="):
                    value = line.split("=", 1)[1].strip().strip('"').strip("'")
                    if value:
                        return value
        except OSError:
            continue
    return None


def get_api_key() -> str | None:
    return load_env_key("ANTHROPIC_API_KEY")


def list_runs(brief: str | None, arm: str | None) -> list[dict]:
    out = []
    if not RUNS.is_dir():
        return out
    for brief_dir in sorted(RUNS.iterdir()):
        if not brief_dir.is_dir():
            continue
        brief_id = brief_dir.name
        if brief_id in SKIP_BRIEFS:
            continue
        if brief and brief_id != brief:
            continue
        for run_dir in sorted(brief_dir.iterdir()):
            if not run_dir.is_dir():
                continue
            if arm and not run_dir.name.startswith(arm):
                continue
            if not (run_dir / "index.html").exists():
                continue
            base = f"{brief_id}-{run_dir.name}"
            out.append(
                {
                    "brief_id": brief_id,
                    "cell": run_dir.name,
                    "run_dir": run_dir,
                    "hero": SHOTS / f"{base}-hero.png",
                    "mobile": SHOTS / f"{base}-mobile.png",
                }
            )
    return out


def image_block(png_path: Path) -> dict:
    data = base64.b64encode(png_path.read_bytes()).decode("ascii")
    return {
        "type": "image",
        "source": {"type": "base64", "media_type": "image/png", "data": data},
    }


def call_api_together(api_key: str, blocks: list[dict]) -> str:
    """OpenAI-compatible vision call; converts anthropic-style blocks."""
    content = []
    for b in blocks:
        if b["type"] == "text":
            content.append({"type": "text", "text": b["text"]})
        else:
            uri = "data:image/png;base64," + b["source"]["data"]
            content.append({"type": "image_url", "image_url": {"url": uri}})
    body = json.dumps({
        "model": FALLBACK_MODEL,
        "max_tokens": 1024,
        "messages": [{"role": "user", "content": content}],
    }).encode("utf-8")
    req = urllib.request.Request(
        FALLBACK_URL, data=body, method="POST",
        headers={"content-type": "application/json",
                 "authorization": f"Bearer {api_key}",
                 "User-Agent": "hallmark-eval/1.0"},
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"] or ""


def call_api(api_key: str, blocks: list[dict]) -> dict:
    body = json.dumps(
        {
            "model": JUDGE_MODEL,
            "max_tokens": 1024,
            "messages": [{"role": "user", "content": blocks}],
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        API_URL,
        data=body,
        method="POST",
        headers={
            "content-type": "application/json",
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "User-Agent": "hallmark-eval/1.0",
        },
    )
    with urllib.request.urlopen(req, timeout=180) as resp:
        return json.loads(resp.read().decode("utf-8"))


def parse_judgement(text: str) -> dict | None:
    """Defensive JSON extraction: strip fences, take outermost object."""
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:]
    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None
    try:
        obj = json.loads(cleaned[start : end + 1])
    except json.JSONDecodeError:
        return None
    if not isinstance(obj, dict) or "axes" not in obj:
        return None
    return obj


def judge_one(api_key: str, run: dict) -> dict:
    blocks = [
        {"type": "text", "text": "Desktop hero screenshot (1280x800):"},
        image_block(run["hero"]),
        {"type": "text", "text": "Full mobile screenshot (375 wide):"},
        image_block(run["mobile"]),
        {"type": "text", "text": RUBRIC},
    ]
    used_model = JUDGE_MODEL
    usage = None
    if globals().get("_FORCE_TOGETHER"):
        text = call_api_together(api_key, blocks)
        used_model = FALLBACK_MODEL
        parsed = parse_judgement(text)
        result = {"model": used_model, "generatedAt": datetime.now(timezone.utc).isoformat(), "usage": None}
        if parsed is None:
            result["error"] = "unparseable judge response"; result["raw"] = text[:4000]
        else:
            result["axes"] = parsed.get("axes"); result["gates"] = parsed.get("gates")
            result["overall"] = parsed.get("overall"); result["rationale"] = parsed.get("rationale")
        return result
    try:
        resp = call_api(api_key, blocks)
        text = "".join(
            b.get("text", "") for b in resp.get("content", []) if b.get("type") == "text"
        )
        usage = resp.get("usage")
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:200]
        fb_key = load_env_key(FALLBACK_ENV)
        if not fb_key:
            raise
        print(f"    anthropic judge unavailable ({e.code}: {detail[:60]}); falling back to {FALLBACK_MODEL}")
        text = call_api_together(fb_key, blocks)
        used_model = FALLBACK_MODEL
    parsed = parse_judgement(text)
    result: dict = {
        "model": used_model,
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "usage": usage,
    }
    if parsed is None:
        result["error"] = "unparseable judge response"
        result["raw"] = text[:4000]
    else:
        result["axes"] = parsed.get("axes")
        result["gates"] = parsed.get("gates")
        result["overall"] = parsed.get("overall")
        result["rationale"] = parsed.get("rationale")
    return result


def main() -> int:
    args = parse_args()
    runs = list_runs(args.brief, args.arm)
    if not runs:
        print("no judgeable runs found (b5/b6 are always skipped)")
        return 0

    todo = []
    for run in runs:
        out_path = run["run_dir"] / "judge.json"
        if out_path.exists() and not args.force:
            print(f"skip  {run['brief_id']}/{run['cell']} (judge.json exists)")
            continue
        missing = [p.name for p in (run["hero"], run["mobile"]) if not p.exists()]
        if missing:
            print(f"skip  {run['brief_id']}/{run['cell']} (missing shots: {', '.join(missing)})")
            continue
        todo.append(run)

    if args.dry_run:
        for run in todo:
            print(f"would judge {run['brief_id']}/{run['cell']}")
        return 0
    if not todo:
        print("nothing to judge")
        return 0

    if args.provider == "operator":
        print("operator judge mode (no API spend). Review these shots and score by the rubric:")
        for run in todo:
            print(f"  {run['brief_id']}/{run['cell']}: {run['hero']} + {run['mobile']}")
        print("\nRun with --provider together (or anthropic) for an automated pass.")
        print("Rubric axes: philosophy, hierarchy, execution, specificity, restraint, variety (1-5); overall 1-10.")
        return 0

    if args.provider == "together":
        api_key = load_env_key(FALLBACK_ENV)
        globals()["_FORCE_TOGETHER"] = True
    else:
        api_key = get_api_key()
    if not api_key:
        who = FALLBACK_ENV if args.provider == "together" else "ANTHROPIC_API_KEY"
        print(f"error: {who} not set and not found in keyFiles", file=sys.stderr)
        return 1

    for run in todo:
        out_path = run["run_dir"] / "judge.json"
        try:
            result = judge_one(api_key, run)
        except urllib.error.HTTPError as e:
            detail = ""
            try:
                detail = e.read().decode("utf-8", "replace")[:500]
            except OSError:
                pass
            result = {
                "model": JUDGE_MODEL,
                "generatedAt": datetime.now(timezone.utc).isoformat(),
                "error": f"HTTP {e.code}: {detail}",
            }
        except (urllib.error.URLError, TimeoutError, OSError) as e:
            result = {
                "model": JUDGE_MODEL,
                "generatedAt": datetime.now(timezone.utc).isoformat(),
                "error": f"request failed: {e}",
            }
        out_path.write_text(json.dumps(result, indent=2) + "\n")
        if "error" in result:
            print(f"judge {run['brief_id']}/{run['cell']}: ERROR {result['error'][:120]}")
        else:
            print(f"judge {run['brief_id']}/{run['cell']}: overall {result.get('overall')}")
        time.sleep(1)
    return 0


if __name__ == "__main__":
    sys.exit(main())
