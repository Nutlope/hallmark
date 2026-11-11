# Security policy

## Supported versions

Hallmark has no release branches. `npx skills add nutlope/hallmark` installs the latest `main`, so fixes land on `main` and only `main` is supported. Run the install again to update.

## Reporting a vulnerability

Report it privately on the [Security tab](https://github.com/Nutlope/hallmark/security/advisories/new) with **Report a vulnerability**. Please don't put any details in a public issue, pull request or comment.

Include what is affected, the steps or a proof of concept, the impact, and the commit you tested. A maintainer will reply on the advisory and work on the fix with you there. When the advisory is published, it credits you unless you ask to stay anonymous.

If the button is missing, open an "Idea or question" issue titled "Security report" with no details at all, and a maintainer will set up a private advisory with you.

## What counts

Hallmark runs inside coding agents, which follow its instructions and run its scripts on the user's machine. These are in scope:

- A script that runs a command, writes or deletes a file outside what it says it does. The installer (`install.mjs`), the hook installer (`install-hook.mjs`, which edits agent settings) and the edit-time hook (`lint-hook.mjs`) matter most.
- A script that leaks a secret, such as `TOGETHER_API_KEY` from `imagegen.mjs`, into logs, generated files, or requests to another host.
- A page or URL that `sloplint.mjs --render`, `capture.mjs` or `picture.mjs` loads and that can reach the user's shell or files.
- Text in `SKILL.md`, a reference or a theme that steers an agent toward harm, such as running unrelated commands, sending data off the machine, or skipping its own safety checks.
- The website at [usehallmark.com](https://www.usehallmark.com/).

These are out of scope:

- Pages Hallmark builds for you. Review them like any other code your agent writes.
- Bugs in Chrome, puppeteer-core, Node or the agent itself. Please report those upstream.
- Linter false alarms and misses, and photo credits. Open an ordinary issue for those.
