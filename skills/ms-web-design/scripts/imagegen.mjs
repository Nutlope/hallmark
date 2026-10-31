#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdirSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname, basename } from "node:path";

const ENDPOINT = "https://api.together.xyz/v1/images/generations";
const DEFAULT_MODEL = "black-forest-labs/FLUX.1.1-pro";

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
  else if (obj.message || obj.error) console.error(obj.message || obj.error);
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

const n = Math.max(1, parseInt(args.n ?? "1", 10) || 1);
const hash = createHash("sha256").update([model, prompt, size, steps, n].join("|")).digest("hex").slice(0, 16);
const cacheDir = args.out ? dirname(args.out) : join(process.cwd(), ".hallmark", "img-cache");
const cachePath = args.out ?? join(cacheDir, `${hash}.png`);
const stem = cachePath.replace(/\.png$/, "");
const metaPath = stem + ".json";
const pathFor = (i) => (n === 1 ? cachePath : `${stem}-${i + 1}.png`);

const sameRequest = () => { if (!args.out) return true; try { return JSON.parse(readFileSync(metaPath, "utf8")).hash === hash; } catch { return false; } };
if (!args.force && existsSync(cachePath) && sameRequest()) {
  out({ path: cachePath, cached: true, model, prompt });
}

const key = process.env.TOGETHER_API_KEY;
if (!key) {
  out({
    error: "no-key",
    message:
      "TOGETHER_API_KEY not set. Image generation is opt-in; falling back to CSS-art / a labelled placeholder. " +
      "Set TOGETHER_API_KEY to generate real imagery, or keep the typography-only / placeholder path.",
  }, 3);
}

try {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, prompt, width: w, height: h, steps, n, response_format: "b64_json" }),
    signal: AbortSignal.timeout(180000),
  });
  if (!res.ok) {
    const detail = (await res.text()).slice(0, 300);
    out({ error: `together ${res.status}`, message: `image API ${res.status}: ${detail}` }, 1);
  }
  const data = await res.json();
  const images = (data?.data ?? []).map((d) => d?.b64_json).filter(Boolean);
  if (!images.length) out({ error: "no-image", message: "image API returned no b64_json payload" }, 1);

  mkdirSync(cacheDir, { recursive: true });
  const paths = [];
  images.forEach((b64, i) => { const p = pathFor(i); writeFileSync(p, Buffer.from(b64, "base64")); paths.push(p); });
  const provenance = { model, prompt, size, steps, n, hash, files: paths.map((p) => basename(p)), generatedVia: "together", note: "generated asset; post-process before shipping; verify licensing", at: new Date().toISOString().slice(0, 10) };
  writeFileSync(metaPath, JSON.stringify(provenance, null, 2) + "\n");
  out({ path: paths[0], paths, cached: false, model, prompt, provenance });
} catch (e) {
  out({ error: "fetch-failed", message: `image generation failed: ${String(e?.message ?? e)}. Falling back to placeholder.` }, 1);
}
