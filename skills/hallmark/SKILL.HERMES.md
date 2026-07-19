---
name: hallmark-hermes
description: "Hallmark (Hermes adapter) — Hermes-friendly version of the Hallmark skill. Outputs are emitted as plain code blocks; repository-level binary outputs are not used. Invocation examples and output format guidance are tuned for Hermes agents."
version: 1.0.0
---

# Hallmark — Hermes adapter

This is a Hermes-targeted variant of the Hallmark skill documentation. It updates output modes to emit plain code blocks and describes how Hallmark should emit results for Hermes agents.

## Invocation (Hermes)

Use the Hermes invocation shape below. Example:

hermes.invokeSkill('hallmark', {
  verb: 'redesign',               // 'audit' | 'redesign' | 'study'
  target: 'https://example.com', // URL, screenshot path, or text brief
  options: { mood: 'playful' }   // optional
}, {
  responseFormat: 'plain_code_blocks' // required for Hermes
})

Notes:
- Hermes expects the skill to return plain text responses; do not send binary files or repository-level outputs.
- Set responseFormat to 'plain_code_blocks' so Hermes can display executable code/files inside fenced code blocks.

## Output format

- Always emit code and file-like outputs as fenced code blocks (triple backticks). Include filename hints when helpful, e.g. ```/path/Button.tsx

- Include the pre-emit critique as a leading comment inside the first code block, e.g.:

```
/* Hallmark · pre-emit critique: P5 H4 E5 S4 R5 V5 */
```

- For component outputs, produce a single code-block containing the component file and, if required, a second code-block with the 8-state demo wrapper.

## Token discipline

- Every colour and font used in the emitted output (code blocks) must reference named tokens (e.g., `var(--color-accent)`). Inline OKLCH/hex values are disallowed unless lifted into the token block first.

## Hermes-specific rules

- Do not attempt to produce or reference repository-level outputs (zip, tar, binary blobs). Hermes does not support repository-level handoff.
- Keep outputs idempotent and self-contained within code blocks. If multiple files are required, emit them as separate fenced code blocks with clear filenames.

---

For full Hallmark rulings and gates, consult the original SKILL.md and references; this adapter focuses only on Hermes-compatible output and invocation guidance.
