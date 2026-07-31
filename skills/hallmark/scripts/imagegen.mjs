#!/usr/bin/env node
// Hallmark image hook. Generates a photographic / illustrative asset for an
// image-heavy brief via Together's images endpoint, caches by prompt hash, and
// stamps provenance. Zero dependencies (Node 18+ global fetch). OPT-IN: it only
// runs when the user asks for a generated image AND TOGETHER_API_KEY is set;
// with no key it prints a graceful fallback message and exits non-zero so the
// build falls back to CSS-art / placeholder (today's recommend-only behaviour).
//
//   node imagegen.mjs "<prompt>" [--model <id>] [--size 1024x1024] [--out <path>]
//                                [--n 1] [--steps 4] [--force] [--json]
//
// Default model: black-forest-labs/FLUX.1.1-pro (photoreal, ~$0.04/MP).
// Alternatives: --model google/gemini-3-pro-image (legible in-image text, brand
// consistency; carries a SynthID watermark), black-forest-labs/FLUX.1-dev.
//
// Cache: .hallmark/img-cache/<sha256(model|prompt|size|steps)>.png (+ .json
// provenance). A cache hit re-uses the file and never calls the API.

import { createHash } from "node:crypto";
import { mkdirSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ENDPOINT = "https://api.together.xyz/v1/images/generations";
const DEFAULT_MODEL = "black-forest-labs/FLUX.1.1-pro";
const CACHE_DIR = join(process.cwd(), ".hallmark", "img-cache");

function parseArgs(argv) {
  const a = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t.startsWith("--")) {
      const k = t.slice(2);
      if (k === "force" || k === "json") a[k] = true;
      else a[k] = argv[++i];
    } else a._.push(t);
  }
  return a;
}

function out(obj, code = 0) {
  if (args.json) process.stdout.write(JSON.stringify(obj) + "\n");
  else if (obj.path) console.log(obj.path);
  else if (obj.message) console.error(obj.message);
  process.exit(code);
}

const args = parseArgs(process.argv.slice(2));
const prompt = args._.join(" ").trim();
if (!prompt) out({ error: 'usage: node imagegen.mjs "<prompt>" [--model ...] [--size WxH] [--out path]' }, 2);

const model = args.model ?? DEFAULT_MODEL;
const size = args.size ?? "1024x1024";
const [w, h] = size.split("x").map((n) => parseInt(n, 10));
if (!w || !h) out({ error: `bad --size ${size} (want WxH, e.g. 1536x1024)` }, 2);
const steps = parseInt(args.steps ?? "4", 10);

const hash = createHash("sha256").update([model, prompt, size, steps].join("|")).digest("hex").slice(0, 16);
const cachePath = args.out ?? join(CACHE_DIR, `${hash}.png`);
const metaPath = cachePath.replace(/\.png$/, "") + ".json";

// --- cache hit -------------------------------------------------------------
if (!args.force && existsSync(cachePath)) {
  out({ path: cachePath, cached: true, model, prompt });
}

// --- key check: graceful fallback (this is the opt-in gate) ----------------
const key = process.env.TOGETHER_API_KEY;
if (!key) {
  out({
    error: "no-key",
    message:
      "TOGETHER_API_KEY not set. Image generation is opt-in; falling back to CSS-art / a labelled placeholder. " +
      "Set TOGETHER_API_KEY to generate real imagery, or keep the typography-only / placeholder path.",
  }, 3);
}

// --- generate --------------------------------------------------------------
try {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, prompt, width: w, height: h, steps, n: parseInt(args.n ?? "1", 10), response_format: "b64_json" }),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    out({ error: `together ${res.status}`, message: `image API ${res.status}: ${detail}` }, 1);
  }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) out({ error: "no-image", message: "image API returned no b64_json payload" }, 1);

  mkdirSync(CACHE_DIR, { recursive: true });
  if (args.out) mkdirSync(join(args.out, ".."), { recursive: true });
  writeFileSync(cachePath, Buffer.from(b64, "base64"));
  const provenance = { model, prompt, size, steps, hash, generatedVia: "together", note: "generated asset; post-process before shipping; verify licensing", at: new Date().toISOString().slice(0, 10) };
  writeFileSync(metaPath, JSON.stringify(provenance, null, 2) + "\n");
  out({ path: cachePath, cached: false, model, prompt, provenance });
} catch (e) {
  out({ error: "fetch-failed", message: `image generation failed: ${String(e?.message ?? e)}. Falling back to placeholder.` }, 1);
}
