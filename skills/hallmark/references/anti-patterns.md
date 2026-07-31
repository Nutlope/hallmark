# Anti-patterns - the named tells

Read this list before emitting anything: these are the named tells of AI-generated UI, and you do not reach for them.
Enforcement details, genre overrides, and full fixes live in [slop-test.md](slop-test.md); "(gate N)" cites its gates.
`hallmark audit` reports findings by these exact names, graded Critical / Major / Micro by how reliably the tell reads as AI.
## Critical
### The purple-gradient hero
Purple-to-blue or purple-to-pink hero background. Fix: one anchor hue, no gradient hero backgrounds. (gate 2)
### Inter-everywhere
Inter, Roboto, or Open Sans as both display and body. Fix: pair a display face with a body face (typography.md). (gate 1)
### The 3-column feature grid
Three equal icon-above-heading columns. Fix: vary widths and heights, or drop the cards. (gate 3)
### Card-in-card
Cards nested inside bordered containers. Fix: keep one containment layer. (gate 4)
### The gradient headline
`background-clip: text` gradient fill on a headline. Fix: solid ink; use weight or a display face. (gate 2)
### The side-stripe card
Thick coloured border on one card edge. Fix: hairline all round, none, or an accent square. (gate 5)
### Full-viewport centred hero
`min-height: 100vh`, everything centred, one sentence, one CTA. Fix: content-height hero, biased alignment. (gate 6)
### Pure black, pure white
`#000` or `#fff` as a base colour. Fix: tint neutrals toward the anchor hue (color.md). (gate 7)
### Default-attractor sameness
Same macrostructure as the previous Hallmark output in the project. Fix: check the CSS stamp; pick differently (macrostructures.md). (gate 8)
### Specimen fall-through
Specimen macrostructure emitted without an editorial brief. Fix: pick from the first ten in macrostructures.md. (gate 21)
### The AI nav
Wordmark-left, inline links, CTA-right, sticky, hairline border-bottom. Fix: route via component-cookbook.md § Navigation. (gate 42)
### The AI footer
Four link columns, social-icon row, copyright tail. Fix: route via component-cookbook.md § Footers. (gate 43)
### Aurora-blob background
Purple-pink-cyan mesh blobs behind hero text. Fix: solid surface, or subtle gradient plus grain. (gate 29)
### Floating-orb decoration
Blurred spheres drifting behind the hero "for depth". Fix: cut them; anchor the hero typographically. (gate 45)
### Sound-on autoplay
A hero video shipped without `muted`. Fix: `<video autoplay muted loop playsinline>`, always all four. (gate 28)
### Lazy-loaded LCP
`loading="lazy"` on the hero image or video. Fix: `fetchpriority="high"`; lazy-load below the fold only. (gate 28)
## Major
### Bounce and elastic easing
Buttons bounce in, icons wobble on hover. Fix: exponential ease-out (motion.md). (gate 12)
### Centred everything
Section after section of centred columns. Fix: bias the layout; break symmetry once. (gate 6)
### Italic headers
An italic emphasis word, or an all-italic display face, in headings. Fix: roman headers; emphasis via weight or accent. (gate 38a)
### Eyebrow on every section
Mono-cap eyebrow labels above (or beside) every heading; default OFF. Fix: zero eyebrows unless genuinely ordinal; never tag-left/header-right. (gate 54)
### Shadow-glow on dark
Soft coloured halo box-shadow on a dark surface. Fix: elevate via lightness, not shadow.
### Icon-tile feature card
Icon in a coloured square, heading, two lines, "Learn more". Fix: asymmetric sizes, inline icons, or none. (gate 3)
### Glassmorphism without purpose
Frosted-glass panels as decoration. Fix: glass only when it communicates overlay depth.
### Hover-only affordances
Menus, buttons, or tooltips reachable only by hover. Fix: focus states plus tap access everywhere.
### Tabular data without tabular-nums
Columns of figures misaligned by proportional numerals. Fix: `font-variant-numeric: tabular-nums`.
### Animate-on-scroll on everything
Every section fades in, every list staggers. Fix: one orchestrated entrance only.
### Mismatched icon sets
Two or more icon libraries mixed on one page. Fix: one library per project (assets.md). (gate 30)
### AI-illustration look
Mesh-blob characters, corporate-doodle humans, raw generated art. Fix: hand-build in CSS or SVG (hero-enrichment.md).
### Invented metrics
Numbers the user never supplied filling stats and proof bars. Fix: labelled placeholder, ask, or drop the slot. (gate 46)
### Generic emoji as feature icon
Sparkle or rocket emoji standing in for icons. Fix: one icon library, custom SVG, or typography. (gate 30)
### Re-drawn UI chrome
Fake browser bars, phone frames, window-chrome code blocks. Fix: real screenshots in `<figure>`; typographic code frames. (gate 47) Arcade carve-out: pixel type, scanlines, starfield, and a cursor are fine (they re-draw no UI); fake OS windows / title bars / traffic-light dots stay banned even there.
### Mid-render token improvisation
Inline colours or fonts outside the locked token block. Fix: every value through `var(--token)`; extend tokens first. (gate 48)
### Wrap-to-two-lines clickable text
Button, nav, or CTA labels wrapping at narrow widths. Fix: shorten the label; `white-space: nowrap`. (gate 49)
### Lottie shortcut
A community Lottie for jobs CSS or SVG does lighter. Fix: build it custom; Lottie is last resort. (gate 31)
### Three.js for a still object
WebGL for a non-interactive spinning thing. Fix: still photograph or hand-built SVG.
## Micro
### `transition-all`
Every property animating, including instant ones. Fix: list the transitioned properties. (gate 10)
### Universal `hover:scale-105`
Every card lifts identically on hover. Fix: one signal per element. (gate 11)
### Bouncy overshoot easings on UI
Overshoot cubic-beziers on buttons, modals, tooltips. Fix: reserve overshoot for physical interactions. (gate 12)
### Animated hover gradients
Background gradient slides through colour space on hover. Fix: cut, or one instant colour shift.
### Cursor follower dots
A trailing dot lagging the pointer. Fix: cut.
### Auto-rotating carousels with no pause
WCAG 2.2.2 failure. Fix: manual advance, or pause on hover and focus. (gate 18)
### Celebratory success toasts
"Done!" for an effect the user already sees. Fix: silent success; toasts for failures only. (gate 16)
### Confirmation dialogs for reversible actions
"Are you sure?" before a one-row delete. Fix: optimistic action plus Undo toast.
### Tooltips with the same delay on hover and focus
Both delayed 800ms. Fix: hover 800-1000ms, focus 0ms. (gate 17)
### Focus rings that animate in
The ring fades in; keyboard users wait. Fix: focus rings appear instantly. (gate 15)
### Toasts that shift layout
A new toast pushes content down. Fix: fixed stack at a viewport corner.
### Universal scroll-triggered fade-up
Every section fades in on intersection. Fix: one entrance on first load.
### Spinners that flash
A spinner visible 50ms on a fast action. Fix: delay-show 150ms, or minimum 300ms visible.
### Straight quotes
Straight `"` and `'` in rendered text. Fix: curly quotes and apostrophes.
### Double-hyphen dashes
`--` in body copy where a dash belongs. Fix: a true em dash (U+2014).
### Three periods instead of ellipsis
`...` in body copy. Fix: the ellipsis character (U+2026).
### Placeholder names
"Jane Doe", "John Smith", "Example User". Fix: plausible audience-fitting names, or a seeded faker. (gate 19)
### Startup-cliché product names
"Acme", "Nexus", "Pulse", "Unleash". Fix: concrete, domain-specific names. (gate 19)
### `z-index: 9999`
Arbitrary large z-values. Fix: the six-level named scale (layout-and-space.md).
### Every section padded the same
Identical padding on every section. Fix: vary; tighten one, expand another. (gate 9)
### 100vw widths
`width: 100vw` breaks on scrollbar-visible desktops. Fix: `width: 100%` with container padding. (gate 34)
