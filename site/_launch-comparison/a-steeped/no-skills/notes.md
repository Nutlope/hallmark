# Steeped — no-skills baseline

- **Mode:** no-skills
- **Brief:** Landing page for Steeped, a tiny indie Vermont tea brand shipping 8 single-origin loose-leaf teas monthly to ~600 subscribers.

## Questions I would have asked (but didn't)

- Is there an existing logo, wordmark, or brand colour reference I should match?
- What's the actual monthly price and shipping model?
- Do you have real photography of the teas/growers/Vermont workshop I can use?
- Should the primary CTA be "subscribe now" or "join waitlist" given the small scale?
- Are there real grower names or origin stories you'd want featured by name?

## Assumptions made

- Price is $28/month with free US shipping, pause/cancel anytime.
- Subscription is the only product; no one-off purchases yet.
- No photography available — text-only layout, no image placeholders.
- "Warm, slow, sensory" voice translated to short paragraphs and gentle adjectives.
- Earthy green + warm cream palette is the obvious safe pick for tea.
- Real subscriber count (~600) used only in the about section; no fabricated metrics.

## Sections shipped (DOM order)

1. Sticky header / nav (logo, 3 links, Subscribe CTA)
2. Hero (headline + subtitle + 2 CTAs)
3. How it works (3 numbered steps)
4. This month's box (8 tea cards in a grid)
5. Our story (text + pull-quote)
6. Subscribe CTA section (email form)
7. Footer (4-column with copyright)

## Hero headline

> "Eight teas. One slow ritual. Every month."

Character count: 41

## Font stack used

System UI stack:
`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, sans-serif`

(No custom web font loaded.)

## Color palette

- `#faf7f2` — warm cream background
- `#f3ede1` — alt-section sand
- `#3a5a40` — forest green accent / brand
- `#2d2a26` — body / dark text
- `#5a544a` — muted secondary text

## File sizes (`wc -c`)

- `index.html` — 8184 bytes
- `style.css` — 7312 bytes
- `notes.md` — (this file)

## Overall feel

Looks AI-generated because: it's the exact template every assistant ships — sticky nav, centered hero with two buttons, 3-step "How it works", card grid, testimonial quote in a left-bordered blockquote, dark green CTA band, 4-column footer. Cream + forest green is the most predictable tea palette possible. No custom typography, no visual quirk, no real photography, no structural risk. Competent and forgettable — exactly the baseline this comparison is designed to capture.
