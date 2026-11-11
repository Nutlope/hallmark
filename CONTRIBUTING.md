# Contributing to Hallmark

Thanks for helping. Hallmark is a design skill: Markdown that a coding agent reads, plus zero-dependency Node scripts that check the pages it builds. Small, tested fixes are the easiest to merge.

## Before you start

- Search the open issues and pull requests first, since someone may already be on it.
- For a small bug fix, open a pull request directly. Issues labelled [good first issue](https://github.com/Nutlope/hallmark/labels/good%20first%20issue) are a good place to begin.
- For a new gate, theme, flag, or anything that changes how a build runs, open an issue first so we can agree on the shape before you write it.
- Keep each pull request to one change. Unrelated cleanups slow the review down and can get the whole pull request closed.

We usually close pull requests that translate or restyle the README, add banners or badges, add documents outside the skill, or only reformat code.

## What ships where

| Path | Who gets it |
| --- | --- |
| `skills/hallmark/` | Every user. `npx skills add nutlope/hallmark` copies this folder, so anything you add here lands on every user's machine and in front of their agent. |
| `site/` | Deploys as it is to [usehallmark.com](https://www.usehallmark.com/). Keep tests and notes out of it. Preview it with `npm run serve`. |
| `README.md`, `ROADMAP.md`, `docs/` | Readers on GitHub. |
| `.github/` | CI and these templates. |

## Set up

You need Node 18 or later. There is nothing to install, because the scripts use only Node's standard library.

The browser checks (`sloplint.mjs --render`, `capture.mjs`, `picture.mjs` and their tests) also need Chrome and puppeteer-core:

```bash
npm i -g puppeteer-core
```

The browser tests skip unless these four variables are set. Point `CHROME_PATH` at your own Chrome:

```bash
export CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
export HALLMARK_PUPPETEER="$(npm root -g)/.."
export HALLMARK_TEST_CHROME="$CHROME_PATH"
export HALLMARK_TEST_PUPPETEER="$(node -p "require.resolve('puppeteer-core', { paths: [process.argv[1]] })" "$(npm root -g)")"
```

## Run the checks

These are the checks CI runs. Run all of them from the repository root before you open a pull request:

```bash
node skills/hallmark/scripts/refcheck.mjs
node skills/hallmark/scripts/theme.mjs validate skills/hallmark/references/themes/*.md
node skills/hallmark/scripts/theme.mjs index && git diff --exit-code -- skills/hallmark/references/themes/index.json
node --test skills/hallmark/scripts/*.test.mjs skills/hallmark/scripts/fixtures/*/*.test.mjs
```

To run one test file, name it: `node --test skills/hallmark/scripts/theme.test.mjs`.

CI runs every `*.test.mjs` file in `skills/hallmark/scripts/` and in the folders one level below `skills/hallmark/scripts/fixtures/`, so a new test there runs without a new step. CI has no browser, so the browser tests always skip there. If you change `capture.mjs`, `picture.mjs` or `sloplint-render.mjs`, run their tests locally with the variables above.

## Fixing a bug

1. Reproduce it on the current `main` with the real command and a small input you wrote yourself. Put the command and its output in the pull request.
2. Add a test that fails on `main` and passes with your fix. A test that already passes on `main` proves nothing.
   - For a script, add a case to the `<script>.test.mjs` file beside it, using `node:test`, or start that file if there is none. The one exception is `imagegen.mjs`, whose tests live in `fixtures/imagegen/`.
   - For a static sloplint gate, add a small page in a new folder under `skills/hallmark/scripts/fixtures/` and add what it must report to the `expectations` list in `refcheck.mjs`.
   - For a render gate, add a case to `sloplint-render.test.mjs`.
3. Show that nothing else moved, as the next section explains for sloplint.

## Changing the linter

sloplint runs on every page Hallmark builds, so a false alarm costs users more than a miss does.

- Compare the output on our own pages before and after your change. Run this from the root on `main` and on your branch, and diff the two files:

  ```bash
  node skills/hallmark/scripts/sloplint.mjs site --json > /tmp/sloplint-main.json
  ```

  `main` already has a few findings there, so report only what your change adds or removes. A new finding is either a real bug, which you should point out, or a false positive that the gate needs to stop raising.
- Keep `--render` fast. If your change adds browser work, give its timing on `main` and on your branch for two folders, for example `site/made/kiln-pottery-school` and `site/made/cobalt-database-client`.
- A new gate needs one row in `skills/hallmark/references/gates.md` and a matching entry in the `TIERS` map in `sloplint.mjs`. `refcheck.mjs` fails when the two disagree, and a gate missing from `TIERS` is treated as Floor. Agents read `gates.md` on every build, so keep implementation notes in code comments.
- Floor gates can never be waived. A new Floor gate needs a pattern that no good page breaks on purpose.

## Themes

Each theme is one Markdown file in `skills/hallmark/references/themes/`. After you add or change one, run `theme.mjs validate` on it, run `theme.mjs index`, and commit the updated `index.json`. Photos in `photos.json` and the themes come only from Wikimedia Commons, because the terms of stock sites such as Unsplash, Pexels and Pixabay bar AI tools from picking their images.

## House style

- Add no dependencies. The browser tier loads puppeteer-core only when the user already has it.
- Match the code around you: short functions, plain names, and no new abstraction for a single call site.
- Use no em dashes or en dashes in any file, comment or commit message. A hyphen, comma, colon or parentheses will do.
- Write docs and messages in plain, complete sentences.
- Leave `.github/workflows/verify.yml` alone.
- Make paths work on Windows, macOS and Linux. Build them with `node:path`, and print forward slashes in anything meant for HTML.

## Opening the pull request

Title it the way the history does, with the area and what now works, for example `fix(sloplint): lint a dot folder named on the command line`.

Fill in the template. If you open the pull request from the command line with your own body, cover the same points: what was wrong, how you reproduced it, what you changed, and which checks you ran. Link the issue with `Fixes #123`.

## Working with a coding agent

Pull requests written with an agent are welcome, and you are still their author. Read the whole diff, run the checks yourself, and make sure the description matches what the code does. Point your agent at [AGENTS.md](AGENTS.md).

## Conduct and security

Everyone taking part follows the [code of conduct](.github/CODE_OF_CONDUCT.md). Report security problems privately as [SECURITY.md](.github/SECURITY.md) describes, and never in a public issue.
