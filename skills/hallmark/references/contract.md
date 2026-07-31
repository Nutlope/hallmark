# Output contract & scope

Loaded once per build, at handoff time.

## Output contract

When producing new work:

- Put design tokens in one place at the top of the stylesheet (`:root` custom properties) or in a `tokens.css` / `tokens.ts` file if the project uses one.
- Name tokens by semantic role, not value. `--color-ink`, not `--color-black`.
- If the project uses Tailwind, extend the theme; do not inline arbitrary values across components.
- If the project uses a framework, match the framework's file conventions — don't reinvent them.
- **An existing global stylesheet is append-only.** If the project already ships one (`app/globals.css`, `src/index.css`, `src/styles/global.css`), add to it instead of replacing it: keep every `@tailwind` / `@import "tailwindcss"` directive exactly where it is, put Hallmark's `:root` tokens and base rules *below* them, and keep any new `@import` (e.g. `tokens.css`) at the very top of the file, above all other rules. Reuse the project's own token names (`--background`, `--foreground`, a Tailwind `@theme`) where they exist rather than shadowing them with a parallel set. Do a full rewrite only when the user explicitly asks for one: silently dropping a framework's CSS entry directives un-styles the entire app.
- Include the stamp block at the top of the stylesheet: the macrostructure stamp line (genre, tone, anchor hue, structural fingerprint, gate records) first, the pre-emit critique line under it, and, on custom builds, the direction contract under that. Beyond that block, no comments are needed.

## Scope and limits

Hallmark is a *taste* skill. It will not:

- Invent product copy. If the user hasn't given you the words, ask.
- Pick a brand identity. It will follow one you give it.
- Enforce a specific style (dark mode, glassmorphism, brutalism). It will execute whichever genre + tone the user committed to.
- Build logic — state management, data fetching, business rules. It is a visual / interaction layer only.

If a request falls outside taste — "build the auth flow", "wire up Stripe" — do the work, but apply Hallmark to the rendered surface.
