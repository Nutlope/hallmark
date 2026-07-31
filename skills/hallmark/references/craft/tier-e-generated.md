## Tier E · Generated stills (Nanobanana / Recraft V4 / Midjourney)

When characters or specific scenes are needed and hand-build is uneconomical (the brief calls for a small mascot in five poses; the agency is selling a thing that needs an evocative atmospheric still).

| Model | Cost | Best for | Output |
| --- | --- | --- | --- |
| **[Nanobanana 2 / Gemini 2.5 Flash Image](https://ai.google.dev/gemini-api/docs/image-generation)** | $0.039 / image | Character consistency across multiple panels, fast iteration, brand-style adherence via reference images, infographics with text | PNG (transparent supported); no SVG, no animation |
| **[Recraft V4](https://www.recraft.ai/)** | ~$0.04 / image | **The only mainstream model with production-grade SVG output.** Logos, icons, illustrations that need to live in code and scale. | SVG + PNG |
| **[Midjourney v8](https://www.midjourney.com)** | ~$0.14 / image | Aesthetic beauty, artistic direction, atmospheric stills | PNG |
| **[Flux 2](https://blackforestlabs.ai/)** | ~$0.03 / image | Photorealism, skin / fabric / product detail | PNG |

### The callable hook (opt-in)

When `TOGETHER_API_KEY` is set and the user has asked for a generated image, you can fetch one instead of recommending a manual round-trip:

```
node <skill-dir>/scripts/imagegen.mjs "<prompt>" --size 1536x1024 [--model ...] [--out <path>]
```

Default model `black-forest-labs/FLUX.1.1-pro` (photoreal, ~$0.04/MP); `--model google/gemini-3-pro-image` for legible in-image text and brand consistency (carries a SynthID watermark). It caches by prompt hash under `.hallmark/img-cache/` and writes a provenance sidecar. **With no key it exits gracefully (code 3) and you fall back to CSS-art or a labelled placeholder** - the recommend-only behaviour below. Never auto-fire it; it serves image-heavy briefs on request, and every generated asset is still post-processed and provenance-stamped per the discipline below.

### Discipline when generating

- **Always post-process.** Add grain, asymmetric crop, hand-drawn overlays, colour grading. Raw model output reads as AI 100 % of the time. The post-process is what makes it ours.
- **Use reference images** for brand consistency. Nanobanana's character-consistency feature is the differentiator vs. Midjourney; feed it your existing brand assets so generations stay on-style.
- **Stamp the model in the macrostructure comment** (`generated: flux-1.1-pro (via scripts/imagegen.mjs) · post-processed`). Future audits need to know provenance.
- **Verify the SynthID watermark** is present (Google's invisible AI-provenance marker).
- **Multi-frame animation isn't supported** by any of these models. Don't try to assemble keyframes into a Lottie loop - that's Tier F territory and almost always a worse outcome than a single still.

### Anti-patterns of generated stills

- **Symmetrical compositions.** Algorithmic; reads as AI. Crop asymmetrically.
- **Smooth-mesh-blob faces.** The 2024 "generic AI character" look. Avoid character-led stills if you can't get past this; or use Nanobanana's character-consistency feature with reference images and prompt heavily for asymmetry / imperfection.
- **Default lighting + blue-tinted backgrounds.** The generic AI tell. Specify brand-anchored colour and unusual lighting in the prompt.
- **Six fingers, doubled furniture, impossible rooms.** Less common than 2023, but still lurking. Always inspect.
