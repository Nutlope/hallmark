# Export formats

Loaded when a `design.md` exists and its `## Exports` need refreshing, or when the user asks for the tokens in another format. `tokens.css` is the source of truth, written by `theme.mjs scaffold`; every other format is a translation of it, written only when asked for.

## The token set

| Family | Tokens |
| --- | --- |
| Colour | `--color-paper`, `-paper-2`, `-paper-3`, `-ink`, `-ink-2`, `-muted`, `-rule` (and `-rule-2` where a theme sets one), `-accent`, `-accent-ink`, `-focus`, `-error`, `-success`; `-field` under a Committed posture, `-accent-2` where a theme names a second ink |
| Type | `--font-display`, `--font-body`, `--font-outlier`; `--text-xs` to `--text-3xl` on a 1.25 ratio from 16px, `--text-display-s`, `--text-display`, and the roles `--text-section` (`h2`), `--text-title` (`h3`), `--text-lead` (an app screen: a fixed 1.2 ratio, the roles at small fixed steps); `--tracking-display` |
| Space | `--space-3xs` (2px) to `--space-4xl` (144px), ten steps; `--container`, `--gutter`, `--gap-columns`, `--section-gap-s`, `--section-gap`, `--section-gap-l` |
| Shape | `--radius-card`, `--radius-pill`, `--rule-hair`, `--shadow-card` |
| Motion | `--ease-out`, `--ease-in`, `--ease-in-out`; `--dur-micro` 120ms, `--dur-short` 220ms, `--dur-long` 420ms |
| Layers | `--z-base` 1, `-raised` 10, `-dropdown` 100, `-sticky` 200, `-sticky-nav` 300, `-modal` 400, `-toast` 500, `-tooltip` 600 |

A page that needs another token names it by role and declares it in `tokens.css`; nothing downstream uses a name `tokens.css` does not declare.

## `tokens.css` in a project

The scaffold writes `tokens.css` and `base.css` beside the project's entry stylesheet (`src/index.css`, `app/globals.css`; `--dir` names another folder) and prints the two imports that fit it. They go right after the file's last `@import`, never below a rule: CSS drops an `@import` that follows one, and the tokens vanish without an error. Where the project already names its tokens (`--background`, a Tailwind `@theme`), map Hallmark's roles onto those names rather than adding a parallel set. Replace the file only when the user asks for a full takeover.

## Tailwind v4

Where the entry stylesheet imports Tailwind 4, the scaffold writes `tokens.css` in two blocks, and the imports follow `@import "tailwindcss"`:

```css
@import "tailwindcss";
@import "./tokens.css";
@import "./base.css" layer(base);
```

```css
@theme static { --color-paper: oklch(96.5% 0.008 50); --font-display: "Fraunces", serif; --text-lg: 1.25rem; --radius-card: 4px; }
:root { --space-lg: 24px; --dur-short: 220ms; --z-modal: 400; --section-gap: 144px; }
```

- **`@theme static`** holds every `--color-*`, `--font-*`, `--text-*`, `--tracking-*`, `--radius-*`, `--shadow-*` and `--ease-*` token, so each is a utility (`bg-paper`, `text-ink`, `font-display`, `rounded-card`) and, being static, still a variable for hand-written CSS. Everything else stays in `:root`.
- **Never `--spacing-<name>`.** Tailwind sizes `w-`, `max-w-`, `p-` and `gap-` from that namespace, so `--spacing-xl: 40px` turns `max-w-xl` into 40px. The space scale needs no mapping: every step but 2px is a multiple of Tailwind's 4px unit (`--space-lg` is `p-6`, `--space-xl` is `p-10`, `--space-2xl` is `p-16`).
- **Nine names are Tailwind's own:** `--text-xs`, `-sm`, `-lg`, `-xl`, `-2xl`, `-3xl` and the three `--ease-*`. The scaffold's values replace Tailwind's, so `text-lg` and `ease-out` change wherever the project uses them. On a new project, a restyle or a full redesign that is the system arriving. On one new page in a project whose other pages must not move, take those nine out of `@theme` and declare them on the page's root element.
- **`base.css` goes in the base layer.** Unlayered, its element rules (`a { color: inherit }`, `h1 { max-width: 20ch }`) outrank every utility, because Tailwind's utilities sit in a layer.
- **The stamp is read from the source.** Tailwind drops comments from what it emits; sloplint reads the stylesheet you wrote.

Tailwind v3 (`@tailwind` directives): `tokens.css` stays one `:root` block, the stamp and both imports go above the directives (below them they are dropped), `base.css` with `layer(base)` so it lands after Preflight and under the utilities. Utilities on request: the same names under `theme.extend` in `tailwind.config`, each value a `var()` of the token.

## DTCG `tokens.json`

For Style Dictionary or Tokens Studio pipelines. Path-based, a `$type` on every token, OKLCH as a string (convert to hex only if the pipeline cannot read it, and say the conversion is lossy). A fluid size exports its maximum; the `clamp()` stays in CSS.

```json
{
  "color": {
    "paper": { "$value": "oklch(96.5% 0.008 50)", "$type": "color" },
    "accent": { "$value": "oklch(62% 0.17 28)", "$type": "color" }
  },
  "font": { "display": { "$value": "General Sans, ui-sans-serif, sans-serif", "$type": "fontFamily" } },
  "space": { "lg": { "$value": "24px", "$type": "dimension" } },
  "duration": { "short": { "$value": "220ms", "$type": "duration" } }
}
```

## shadcn/ui

shadcn keeps full colour values in its own variables and maps them in `@theme inline`. Point its variables at Hallmark's tokens:

```css
:root {
  --background: var(--color-paper); --foreground: var(--color-ink);
  --card: var(--color-paper-2); --card-foreground: var(--color-ink);
  --popover: var(--color-paper-2); --popover-foreground: var(--color-ink);
  --primary: var(--color-accent); --primary-foreground: var(--color-accent-ink);
  --secondary: var(--color-paper-3); --secondary-foreground: var(--color-ink-2);
  --muted: var(--color-paper-2); --muted-foreground: var(--color-muted);
  --accent: var(--color-paper-3); --accent-foreground: var(--color-ink);
  --destructive: var(--color-error);
  --border: var(--color-rule); --input: var(--color-rule); --ring: var(--color-focus);
  --radius: var(--radius-card);
}
```

shadcn's `accent` is a hover surface and its `muted` a quiet background, so its `@theme inline` block defines `--color-accent` and `--color-muted` with meanings that collide with Hallmark's. In a shadcn project, keep Hallmark's two tokens out of `@theme` and let the page CSS reach them through `var()`, or rename them there (`--color-signal`, `--color-ink-3`) and say so in the handoff.
