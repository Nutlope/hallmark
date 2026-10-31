# design.md: the locked system

Loaded when the user asks to lock the current build's system into a portable file, or when a redesign reaches more than one page (`redesign.md`), after the scaffold has run: the file is written from `tokens.css`, never from the theme file. A single build never writes `design.md` on its own; `tokens.css` already makes every build portable, and the Picks block offers the lock in one line.

## Triggers

*lock the system*, *lock the design system*, *give me a design.md*, *export this as a design.md*, *extract the tokens*, *make this portable*, *I want to use this in another project*. Anything else, including more iteration on the same prompt, skips this file.

- **Page builds and redesigns of more than one page.** A single component is too small to be a system.
- **Never overwrite.** If `design.md` or `DESIGN.md` exists at the root, refresh its `## Exports` and say so in one line: *design.md found; Exports refreshed, system unchanged.*

## Format

At the project root, in the project's case convention, about 45 lines: enough to seed another page, short enough to maintain. State the picks aloud first (*Genre: editorial. Shape: Long Document. Theme: Newsprint. Locking this as the project's system.*), then write:

````markdown
# Design: <project name>

The locked system. Every Hallmark run reads this first and pages share it. Change it on purpose; the file is the rule.

## System
- Genre: <editorial | modern-minimal | atmospheric | playful>
- Shape of the first page: <macrostructure, or app screen>
- Theme: <catalog name, or custom (vibe: "<4 to 8 words>")>
- Axes: <paper band>/<display class>/<accent band> · posture: <posture>

## Tokens
`tokens.css` is the source of truth. The roles:
```css
:root {
  --color-paper: oklch(<L> <C> <H>);  --color-paper-2: oklch(…);  --color-paper-3: oklch(…);
  --color-ink: oklch(…);  --color-ink-2: oklch(…);  --color-muted: oklch(…);  --color-rule: oklch(…);
  --color-accent: oklch(…);  --color-accent-ink: oklch(…);  --color-focus: oklch(…);
  --font-display: "<face>", <fallbacks>;  --font-body: "<face>", <fallbacks>;  --font-outlier: <…>;
  --radius-card: <px>;  --radius-pill: <px>;  --rule-hair: <px>;  --shadow-card: <value or none>;
}
```
The spacing scale, the type scale, the easings and the durations are the scaffold's and live in `tokens.css`.

## Controls
- Primary: <fill> · <radius> · <height>
- Secondary: <outline or text> · same radius and height

## Motion
- Character: <still | severe | brisk | calm>; one reveal at most; under reduced motion everything ends at once.

## Exports
`tokens.css` in this project. Tailwind, DTCG or shadcn blocks are added here on request, per `export-formats.md`.
````

## After the file exists

The pre-flight finds it on every later run (SKILL.md Step 0). From then on every pick defers to it, the variety rule inverts (pages share the system rather than differ), and a page that genuinely needs something else amends `design.md` with a `## Variants` section instead of overriding it locally.
