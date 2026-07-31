### E6 · Animated Loop — pure CSS / SVG / Motion

A small custom-built loop — an orbiting dot, a breathing rectangle, an animated gradient stop, a type-mask reveal. The point is *small*, custom, and looped *only when reduced-motion is off*.

*Use when:* the page is otherwise still and one small animated element gives it life.
*Avoid when:* the page already has movement — adding more reads as anxious.

**Knobs:**
- Medium (CSS keyframes · SVG SMIL/CSS · Motion)
- Placement (margin · inline-with-headline · corner-accent)
- Loop duration (≤ 4s — anything longer drags)

**Example.** A collaborative whiteboard app. A 2-second pure-CSS loop next to the headline: a single dot orbiting a slow ellipse, suggesting "real-time collaboration" without a Lottie. Built with `@property --angle` interpolating 0deg → 360deg on a `transform: rotate()`. Margin-placed, ~64 × 64 px, accent colour at low chroma. **Not a Lottie** — pure CSS keeps the bundle at zero bytes and respects reduced-motion gracefully (animation: none on the media query).
