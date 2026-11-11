# AGENTS.md

These notes are for coding agents changing Hallmark itself. If you were asked to build or design a page with Hallmark, follow `skills/hallmark/SKILL.md` instead. People should read [CONTRIBUTING.md](CONTRIBUTING.md); this file sums up the same rules.

## Layout

- `skills/hallmark/SKILL.md` is the skill's entry point. It loads files from `skills/hallmark/references/`.
- `skills/hallmark/references/gates.md` lists every gate and its tier. `sloplint.mjs` keeps a copy of the tiers in its `TIERS` map, and `refcheck.mjs` fails when the two disagree.
- `skills/hallmark/references/themes/` holds one Markdown file per theme plus the generated `index.json`.
- `skills/hallmark/scripts/` holds the Node tools (`sloplint.mjs`, `sloplint-render.mjs`, `theme.mjs`, `capture.mjs`, `picture.mjs`, `imagegen.mjs`, `install.mjs`, `install-hook.mjs`, `lint-hook.mjs`, `refcheck.mjs`) and their `*.test.mjs` files.
- `site/` is the public website, deployed as it is.

Everything in `skills/hallmark/` is copied to every user's machine and read by their agent.

## Commands

There is no install or build step. These are the checks CI runs, and all of them must pass:

```bash
node skills/hallmark/scripts/refcheck.mjs
node skills/hallmark/scripts/theme.mjs validate skills/hallmark/references/themes/*.md
node skills/hallmark/scripts/theme.mjs index && git diff --exit-code -- skills/hallmark/references/themes/index.json
node --test skills/hallmark/scripts/*.test.mjs skills/hallmark/scripts/fixtures/*/*.test.mjs
```

Browser tests skip without Chrome and puppeteer-core, and they always skip on CI. CONTRIBUTING.md lists the four variables that turn them on; set them whenever you change `capture.mjs`, `picture.mjs` or `sloplint-render.mjs`.

## Rules

- Reproduce the bug on `main` with the real command before you change code, and keep the command and output for the pull request.
- Add a test that fails on `main` and passes with the fix. Put script tests in the `<script>.test.mjs` file beside the script (`imagegen.mjs` keeps its tests in `fixtures/imagegen/`). For a static sloplint gate, add a page under `skills/hallmark/scripts/fixtures/<name>/` and its expected result to the `expectations` list in `refcheck.mjs`. For a render gate, add a case to `sloplint-render.test.mjs`.
- Make one change per pull request, with no unrelated refactors, renames or reformatting.
- Add no dependencies, and leave `package.json` and lockfiles alone.
- Leave `.github/workflows/verify.yml` alone. CI runs every `*.test.mjs` in `skills/hallmark/scripts/` and one folder below `fixtures/`, so new tests there run on their own.
- Write no em dashes or en dashes in any file, comment, commit message or pull request text.
- Keep notes, plans and reports out of the repository, and add files to `skills/hallmark/` only when the change needs them there.
- When you change sloplint, run `node skills/hallmark/scripts/sloplint.mjs site --json` on `main` and on your branch and diff the two. `main` already has a few findings, so report only what changed and leave the rest alone. If `--render` does more work, time it on two `site/made/` folders on both branches.
- A new gate needs one row in `gates.md` and a matching entry in `TIERS` in `sloplint.mjs`. Keep implementation notes out of `gates.md`.
- Add photos to `photos.json` and the themes only from Wikimedia Commons.
- Leave version numbers, the README and the roadmap alone unless the task is about them.
- Build paths with `node:path` so they work on Windows, and print forward slashes in anything meant for HTML.

## Pull requests

Title the pull request with the area and what now works, for example `fix(sloplint): lint a dot folder named on the command line`.

`gh pr create --body` skips the template, so write the body with these headings:

```markdown
## What was wrong
## How to reproduce it on main
## What changed
## Checks run
```

End it with `Fixes #<issue>` when there is an issue.
