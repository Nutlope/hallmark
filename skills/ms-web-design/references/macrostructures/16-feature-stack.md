## 16 · Feature Stack

Sticky left pane holding the heading, scroll-synced right pane cycling through related captures. Paced like film.

- **Heading:** held inside the sticky pane; persists while content cycles beside it.
- **Body:** two columns, left sticky, right scrolling; the right pane plays through 3 to 6 detail captures per section.
- **Divider:** section bands; the sticky pane re-anchors per section, at `top: var(--banner-height)` under a sticky nav (56).
- **Button:** in the sticky pane, shown once the section's last capture is reached; with scripting off it is simply there (62).
- **Image:** the scrolling column is real captures, or the product built in slots until they arrive (`imagery.md` § 4); never a run of empty frames (68).
- **Reveal:** none of the fade kind; the sticky scroll is the motion. Choreograph it with [`../scroll-choreography.md`](../scroll-choreography.md) § 4 Sticky diptych with the pane kept on the left, or § 1 Pinned chapter: one pattern per page.

Reach for it for premium products, complex feature stories, anywhere the pacing should be controlled as the visitor scrolls.

Avoid for mobile-first audiences without a strong fallback. Sticky scroll-sync is rough on small screens.

Compositions: a pinned Split (`layout.md` § 5), the pin per `scroll-choreography.md` § 4.

Mobile: under 60rem the sticky pane becomes a heading above its captures, stacked in flow.

**Sample opening lines** (pin one statement, then walk the visitor through):
> *"Plan, build, ship."* Three verbs, three sticky panes.
> *"Read anything that emits lines."* Names what is possible, then walks through it (Streampipe).
> *"From stdin, through the pipe, into your dashboard."* Names the data path, then explains each step.
