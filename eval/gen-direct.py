#!/usr/bin/env python3
"""
gen-direct.py - Tier B of the Hallmark eval harness: bare API generation.

One cell = one (brief, arm, pack). The system prompt is a compiled skill pack
from make-pack.mjs; the user message is the brief; the call is a single bare
chat completion (streaming), with one nudge if no HTML artifact comes back.
No tools, no harness, no vision. Runs strictly sequentially.

Usage:
  python3 eval/gen-direct.py --brief b1 --arm fable-baseline --pack floor
  python3 eval/gen-direct.py --brief all --arm all --pack full
  python3 eval/gen-direct.py --brief b4 --arm glm52-together --pack floor --force
  python3 eval/gen-direct.py --brief b1 --arm fable-baseline --pack floor --dry-run
  python3 eval/gen-direct.py --brief all --arm all --pack floor --repair 1

Repair mode (--repair N): instead of fresh generation, each selected cell
that already has an index.html and a score.json with FAIL findings is
re-prompted (same arm, same pack): the previous artifact plus the failing
findings are appended and the model is asked to fix the mechanical failures
and re-emit the complete file. After each re-emission the cell is re-scored
via score.mjs, and the loop continues up to N rounds or until the cell has
zero FAILs. Cells without FAILs (or without a usable score.json) are left
untouched. run-matrix.py orchestrates gen -> score -> gen --repair -> score.

Keys are loaded from the keyFiles listed in eval/models.json (KEY=VALUE lines)
with the process environment as a fallback. Key VALUES are never printed.

Output per cell: eval/runs/<briefId>/<armId>-<pack>/
  index.html   extracted artifact (only when extraction succeeded)
  raw.txt      full model output (both turns when nudged)
  run.json     {ok, extracted, durationSec, promptTok, completionTok,
                costUSD, loc, nudged, error, ...}

Python 3.12+, stdlib only.
"""

import argparse
import datetime
import json
import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

EVAL_DIR = Path(__file__).resolve().parent
RUNS_DIR = EVAL_DIR / "runs"
PACKS_DIR = EVAL_DIR / "_packs"

MAX_TOKENS = 64000
READ_TIMEOUT = 600  # seconds of stream silence before giving up
RETRY_ATTEMPTS = 3
# Together sits behind Cloudflare, which 403s the default urllib UA.
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) hallmark-eval/1.0"
NUDGE = "Ship the complete index.html now."
REPAIR_INSTRUCTION = (
    "Fix these mechanical failures, re-emit the complete file. "
    "Output the full corrected index.html and nothing else."
)

# --------------------------------------------------------------------------- #
# Config + keys
# --------------------------------------------------------------------------- #


def load_json(path):
    return json.loads(Path(path).read_text(encoding="utf-8"))


def load_key_env(key_files):
    """Parse KEY=VALUE lines from the key files; process env wins as fallback
    for names a file does not define. Values are kept in memory only."""
    env = {}
    for kf in key_files:
        try:
            text = Path(kf).read_text(encoding="utf-8")
        except FileNotFoundError:
            continue
        for line in text.splitlines():
            m = re.match(r"^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$", line)
            if m:
                env.setdefault(m.group(1), m.group(2).strip().strip('"').strip("'"))
    for name, value in os.environ.items():
        env.setdefault(name, value)
    return env


def ensure_pack(pack):
    """Compile the pack via make-pack.mjs (single source of truth) and cache
    it under eval/_packs/. Requires node on PATH."""
    out = PACKS_DIR / f"{pack}.txt"
    proc = subprocess.run(
        ["node", str(EVAL_DIR / "make-pack.mjs"), "--pack", pack, "--out", str(out)],
        capture_output=True,
        text=True,
    )
    if proc.returncode != 0:
        sys.exit(f"make-pack.mjs failed for pack '{pack}':\n{proc.stderr.strip()[:500]}")
    return out.read_text(encoding="utf-8")


# --------------------------------------------------------------------------- #
# Streaming HTTP (stdlib only)
# --------------------------------------------------------------------------- #


def _iter_sse(resp):
    for raw in resp:
        line = raw.decode("utf-8", "replace").strip()
        if not line.startswith("data:"):
            continue
        payload = line[5:].strip()
        if payload == "[DONE]":
            continue
        try:
            yield json.loads(payload)
        except json.JSONDecodeError:
            continue


def openai_compat_stream(arm, key, system, messages):
    """One OpenAI-shaped streaming chat completion. messages excludes system."""
    body = {
        "model": arm["model"],
        "messages": [{"role": "system", "content": system}] + messages,
        "max_tokens": MAX_TOKENS,
        "stream": True,
        "stream_options": {"include_usage": True},
    }
    # omitTemperature means: do not send the key at all (reasoning models
    # reject or ignore it). Otherwise send the arm's temperature when set.
    if not arm.get("omitTemperature") and "temperature" in arm:
        body["temperature"] = arm["temperature"]
    for k, v in (arm.get("extra") or {}).items():
        body[k] = v
    req = urllib.request.Request(
        arm["base"].rstrip("/") + "/chat/completions",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {key}",
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT,
            "Accept": "text/event-stream",
        },
        method="POST",
    )
    content = ""
    prompt_tok = completion_tok = 0
    with urllib.request.urlopen(req, timeout=READ_TIMEOUT) as resp:
        for j in _iter_sse(resp):
            if j.get("usage"):
                u = j["usage"]
                prompt_tok = u.get("prompt_tokens") or prompt_tok
                completion_tok = u.get("completion_tokens") or completion_tok
            ch = (j.get("choices") or [None])[0]
            if not ch:
                continue
            piece = (ch.get("delta") or {}).get("content")
            if piece:
                content += piece
    return {"text": content, "prompt_tok": prompt_tok, "completion_tok": completion_tok}


def anthropic_stream(arm, key, system, messages):
    """One Anthropic Messages API streaming call."""
    body = {
        "model": arm["model"],
        "max_tokens": MAX_TOKENS,
        "system": system,
        "messages": messages,
        "stream": True,
    }
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=json.dumps(body).encode("utf-8"),
        headers={
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
            "User-Agent": USER_AGENT,
            "Accept": "text/event-stream",
        },
        method="POST",
    )
    text = ""
    in_tok = out_tok = 0
    with urllib.request.urlopen(req, timeout=READ_TIMEOUT) as resp:
        for j in _iter_sse(resp):
            t = j.get("type")
            if t == "error":
                # Anthropic can 200 then error mid-stream; raise so we retry.
                err = j.get("error") or {}
                raise RuntimeError(f"anthropic stream error: {err.get('type')}: {err.get('message')}")
            if t == "message_start":
                in_tok = (j.get("message", {}).get("usage", {}) or {}).get("input_tokens", 0) or 0
            elif t == "content_block_delta":
                d = j.get("delta") or {}
                if d.get("type") in (None, "text_delta") and d.get("text"):
                    text += d["text"]
            elif t == "message_delta":
                u = j.get("usage") or {}
                if u.get("output_tokens"):
                    out_tok = u["output_tokens"]
    return {"text": text, "prompt_tok": in_tok, "completion_tok": out_tok}


def _retryable(exc):
    if isinstance(exc, urllib.error.HTTPError):
        return exc.code == 429 or exc.code >= 500
    # Network stalls / mid-stream provider errors are worth one more try too.
    return isinstance(exc, (TimeoutError, ConnectionError, RuntimeError, urllib.error.URLError))


def with_retries(fn, label):
    last = None
    for attempt in range(RETRY_ATTEMPTS):
        try:
            return fn()
        except Exception as e:  # noqa: BLE001
            detail = ""
            if isinstance(e, urllib.error.HTTPError):
                try:
                    detail = e.read().decode("utf-8", "replace")[:200]
                except Exception:
                    pass
                msg = f"HTTP {e.code} {detail}"
            else:
                msg = str(e)[:200]
            last = RuntimeError(msg)
            if not _retryable(e) or attempt == RETRY_ATTEMPTS - 1:
                break
            wait = 5 * (attempt + 1)
            print(f"    [{label}] attempt {attempt + 1} failed ({msg[:120]}); retrying in {wait}s", flush=True)
            time.sleep(wait)
    raise last


# --------------------------------------------------------------------------- #
# Extraction
# --------------------------------------------------------------------------- #


def extract_html(text):
    """Prefer the largest fenced html block that looks like a document; else
    the first <!DOCTYPE ... </html> span."""
    if not text:
        return None
    best = None
    for f in re.findall(r"```(?:html)?\s*([\s\S]*?)```", text, re.IGNORECASE):
        if re.search(r"<!doctype html|<html[\s>]", f, re.IGNORECASE):
            if best is None or len(f) > len(best):
                best = f
    if best:
        return best.strip()
    m = re.search(r"<!doctype[\s\S]*</html>", text, re.IGNORECASE)
    return m.group(0).strip() if m else None


def looks_like_html(text):
    return bool(re.search(r"<!doctype|<html[\s>]", text or "", re.IGNORECASE))


# --------------------------------------------------------------------------- #
# One cell
# --------------------------------------------------------------------------- #


def run_cell(brief_entry, arm, pack, system, key, force):
    brief_id = brief_entry["id"]
    label = f"{brief_id}/{arm['id']}-{pack}"
    out_dir = RUNS_DIR / brief_id / f"{arm['id']}-{pack}"
    if (out_dir / "run.json").exists() and not force:
        print(f"  {label}: exists, skipping (use --force to regenerate)", flush=True)
        return

    call = anthropic_stream if arm["kind"] == "anthropic" else openai_compat_stream
    start = time.time()
    prompt_tok = completion_tok = 0
    nudged = False
    error = None
    raw_parts = []
    artifact = None

    messages = [{"role": "user", "content": brief_entry["brief"]}]
    try:
        for turn in range(2):
            r = with_retries(lambda: call(arm, key, system, messages), label)
            prompt_tok += r["prompt_tok"]
            completion_tok += r["completion_tok"]
            raw_parts.append(r["text"])
            if looks_like_html(r["text"]):
                artifact = extract_html(r["text"])
                break
            if turn == 0:
                nudged = True
                messages.append({"role": "assistant", "content": r["text"] or "(no output)"})
                messages.append({"role": "user", "content": NUDGE})
                print(f"    [{label}] no artifact yet; nudging once", flush=True)
    except Exception as e:  # noqa: BLE001
        error = str(e)[:300]

    duration = round(time.time() - start, 2)
    ok = artifact is not None
    loc = artifact.count("\n") + 1 if artifact else 0

    out_dir.mkdir(parents=True, exist_ok=True)
    raw = "\n\n===== NUDGE TURN =====\n\n".join(raw_parts)
    (out_dir / "raw.txt").write_text(raw, encoding="utf-8")
    if artifact:
        (out_dir / "index.html").write_text(artifact, encoding="utf-8")

    run = {
        "brief": brief_id,
        "arm": arm["id"],
        "pack": pack,
        "model": arm["model"],
        "kind": arm["kind"],
        "ok": ok,
        "extracted": ok,
        "durationSec": duration,
        "promptTok": prompt_tok,
        "completionTok": completion_tok,
        "costUSD": None,  # no per-arm pricing wired yet; null is allowed
        "loc": loc,
        "nudged": nudged,
        "error": error,
        "generatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat().replace("+00:00", "Z"),
    }
    (out_dir / "run.json").write_text(json.dumps(run, indent=2), encoding="utf-8")

    status = "ok" if ok else ("ERROR" if error else "no artifact")
    note = " (expected for study-decline)" if not ok and brief_entry["expect"]["scope"] == "study-decline" else ""
    print(
        f"  {label}: {status}{note} | {duration}s | in {prompt_tok} out {completion_tok} | {loc} loc"
        + (" | nudged" if nudged else ""),
        flush=True,
    )


# --------------------------------------------------------------------------- #
# Repair mode
# --------------------------------------------------------------------------- #


def load_score(out_dir):
    p = out_dir / "score.json"
    if not p.exists():
        return None
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None


def failing_findings(score):
    if not score or score.get("unavailable"):
        return []
    return [
        f
        for f in score.get("findings", [])
        if str((f or {}).get("grade", "")).upper() == "FAIL"
    ]


def rescore_cell(brief_id, arm_id, pack):
    """Refresh score.json for one cell by shelling out to score.mjs."""
    subprocess.run(
        [
            "node",
            str(EVAL_DIR / "score.mjs"),
            "--brief",
            brief_id,
            "--arm",
            f"{arm_id}-{pack}",
            "--force",
        ],
        capture_output=True,
        text=True,
    )


def build_repair_message(fails):
    lines = []
    for f in fails:
        gate = f.get("gate", "?")
        evidence = f.get("evidence") or f.get("summary") or ""
        fix = f.get("fix") or ""
        line = f"- gate {gate}: {evidence}".rstrip()
        if fix:
            line += f" (fix: {fix})"
        lines.append(line)
    return (
        "Your index.html failed these mechanical slop-test gates:\n"
        + "\n".join(lines)
        + "\n\n"
        + REPAIR_INSTRUCTION
    )


def repair_cell(brief_entry, arm, pack, system, key, rounds):
    brief_id = brief_entry["id"]
    label = f"{brief_id}/{arm['id']}-{pack}"
    out_dir = RUNS_DIR / brief_id / f"{arm['id']}-{pack}"
    html_path = out_dir / "index.html"
    if not html_path.exists():
        print(f"  {label}: no artifact, nothing to repair", flush=True)
        return

    call = anthropic_stream if arm["kind"] == "anthropic" else openai_compat_stream
    repaired = 0
    for round_no in range(1, rounds + 1):
        score = load_score(out_dir)
        if score is None or score.get("unavailable"):
            print(f"  {label}: no usable score.json, skipping repair", flush=True)
            return
        fails = failing_findings(score)
        if not fails:
            print(f"  {label}: zero FAILs, no repair needed", flush=True)
            return

        print(f"  {label}: repair round {round_no}/{rounds} ({len(fails)} FAILs)", flush=True)
        current = html_path.read_text(encoding="utf-8")
        messages = [
            {"role": "user", "content": brief_entry["brief"]},
            {"role": "assistant", "content": f"```html\n{current}\n```"},
            {"role": "user", "content": build_repair_message(fails)},
        ]
        start = time.time()
        try:
            r = with_retries(lambda: call(arm, key, system, messages), label)
        except Exception as e:  # noqa: BLE001
            print(f"  {label}: repair call failed ({str(e)[:160]}); keeping current artifact", flush=True)
            return
        duration = round(time.time() - start, 2)
        artifact = extract_html(r["text"])
        with (out_dir / "raw.txt").open("a", encoding="utf-8") as fh:
            fh.write(f"\n\n===== REPAIR ROUND {round_no} =====\n\n{r['text']}")
        if not artifact:
            print(f"  {label}: repair round produced no artifact; keeping current file", flush=True)
            return
        html_path.write_text(artifact, encoding="utf-8")
        repaired += 1

        run_path = out_dir / "run.json"
        try:
            run = json.loads(run_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError):
            run = {}
        run["ok"] = True
        run["extracted"] = True
        run["loc"] = artifact.count("\n") + 1
        run["durationSec"] = round(float(run.get("durationSec") or 0) + duration, 2)
        run["promptTok"] = int(run.get("promptTok") or 0) + r["prompt_tok"]
        run["completionTok"] = int(run.get("completionTok") or 0) + r["completion_tok"]
        run["repairRounds"] = int(run.get("repairRounds") or 0) + 1
        run_path.write_text(json.dumps(run, indent=2), encoding="utf-8")

        rescore_cell(brief_id, arm["id"], pack)
        score = load_score(out_dir)
        remaining = len(failing_findings(score))
        print(f"  {label}: round {round_no} done | {duration}s | {remaining} FAILs remain", flush=True)
        if remaining == 0:
            return
    if repaired:
        print(f"  {label}: repair budget exhausted after {repaired} round(s)", flush=True)


# --------------------------------------------------------------------------- #
# Entry
# --------------------------------------------------------------------------- #


def main():
    ap = argparse.ArgumentParser(description="Hallmark eval: bare API generation (Tier B)")
    ap.add_argument("--brief", required=True, help="b1..b6 or 'all'")
    ap.add_argument("--arm", required=True, help="arm id from models.json or 'all' (enabled arms only)")
    ap.add_argument("--pack", required=True, choices=["floor", "full"])
    ap.add_argument("--force", action="store_true", help="regenerate cells whose run.json exists")
    ap.add_argument("--dry-run", action="store_true", help="list the work and key availability; call nothing")
    ap.add_argument(
        "--repair",
        type=int,
        default=0,
        metavar="N",
        help="repair mode: re-prompt cells whose score.json has FAILs, up to N rounds each",
    )
    args = ap.parse_args()

    briefs = load_json(EVAL_DIR / "briefs.json")
    models = load_json(EVAL_DIR / "models.json")

    if args.brief != "all":
        briefs = [b for b in briefs if b["id"] == args.brief]
        if not briefs:
            sys.exit(f"unknown brief id: {args.brief}")
    arms = models["arms"]
    if args.arm == "all":
        arms = [a for a in arms if a.get("enabled", True)]
    else:
        arms = [a for a in arms if a["id"] == args.arm]
        if not arms:
            sys.exit(f"unknown arm id: {args.arm}")

    env = load_key_env(models.get("keyFiles", []))

    # Key availability check by NAME only; values never leave memory.
    missing = sorted({a["env"] for a in arms if not env.get(a["env"])})
    if missing:
        files = ", ".join(models.get("keyFiles", []))
        if args.dry_run:
            print(f"NOTE: missing key(s) {', '.join(missing)} (checked {files} + process env)")
        else:
            sys.exit(f"missing key(s): {', '.join(missing)} (checked {files} + process env)")

    cells = [(b, a) for b in briefs for a in arms]
    print(f"{len(cells)} cell(s): pack={args.pack}, briefs={[b['id'] for b in briefs]}, arms={[a['id'] for a in arms]}")

    if args.dry_run:
        for b, a in cells:
            out_dir = RUNS_DIR / b["id"] / f"{a['id']}-{args.pack}"
            state = "exists" if (out_dir / "run.json").exists() else "would run"
            if args.repair > 0:
                fails = len(failing_findings(load_score(out_dir)))
                state = f"would repair ({fails} FAILs)" if fails else "no repair needed"
            key_state = "key ok" if env.get(a["env"]) else f"key MISSING ({a['env']})"
            print(f"  {b['id']}/{a['id']}-{args.pack}: {state} | {key_state} -> {out_dir}")
        print("dry run: nothing sent.")
        return

    system = ensure_pack(args.pack)
    print(f"pack '{args.pack}' compiled: {len(system)} chars (~{len(system) // 4} tok)")
    for b, a in cells:
        if args.repair > 0:
            repair_cell(b, a, args.pack, system, env[a["env"]], args.repair)
        else:
            run_cell(b, a, args.pack, system, env[a["env"]], args.force)


if __name__ == "__main__":
    main()
