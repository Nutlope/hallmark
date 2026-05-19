# Flarepin — no-skills build notes

- **Mode:** no-skills
- **Brief:** Landing page for Flarepin, an error-tracking SaaS for backend devs (Node/Python/Go), self-hosted or managed, $0/$29/$99 per project, beta with ~120 teams, 18ms median ingestion.

## Questions I WOULD have asked (but didn't)

- Do you have a logo / wordmark / brand colour we should honour, or pick freely?
- Is the audience more "indie backend dev" or "platform team at 200-person company"? Tone shifts.
- Should the code snippet show Node, Python, AND Go, or just one to keep the hero focused?
- Self-hosted vs managed — should one be the default narrative, or pitched equally?
- Any social proof we can name (logos, quotes from the 120 beta teams)?

## Assumptions made

- Single page, no JS framework, plain HTML + CSS.
- Generic SaaS blue primary (#2563eb) since no brand color was specified.
- System font stack for performance and neutrality.
- Use only the two real metrics (18ms, 120 teams) — no invented stats.
- Node snippet only in the install section (most common backend audience).
- Free tier shown first, Team plan featured as the recommended middle tier.

## Sections shipped (DOM order)

1. Header / nav (logo, 4 links, CTA)
2. Hero (eyebrow, h1, subhead, two CTAs)
3. Features grid (6 cards)
4. Code snippet section (Node install)
5. Pricing (3 plans)
6. Footer (tagline + 3 link columns + copyright)

## Hero headline (verbatim)

> Error tracking built for backend developers.

Character count: 47

## Font stack

`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`
Mono: `"SF Mono", Menlo, Consolas, Monaco, monospace`

## Color palette

- `#ffffff` background
- `#1a1a1a` text / code block bg
- `#666666` muted text
- `#2563eb` primary (blue-600)
- `#e5e7eb` border
- `#f9fafb` surface (alt section bg)

## File sizes (`wc -c`)

- `index.html` — 5905 bytes
- `style.css` — 5672 bytes
- `notes.md` — see file on disk

## Overall feel

Generic SaaS landing page: centered hero, blue primary, three-tier pricing, grey alternating section backgrounds — competent and forgettable, exactly the baseline a vanilla coding assistant would output.
