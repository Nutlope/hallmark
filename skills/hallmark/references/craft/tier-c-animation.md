## Tier C · Declarative animation (CSS-first, JS-when-needed)

The 2026 declarative animation canon. Use the platform first; reach for JS only when the platform can't express the orchestration.

### CSS keyframes + `@property`

`@property` (Baseline 2024, ~88 % support by 2026) lets you define typed custom properties — `<color>`, `<length>`, `<angle>`, `<number>`, `<percentage>` — that the browser knows how to interpolate smoothly. Without `@property`, animating a custom property steps from start to end with no in-between values.

```css
@property --hue {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

@keyframes spin-hue { to { --hue: 360deg; } }

.gradient-loop {
  background: conic-gradient(from var(--hue),
    oklch(70% 0.2 var(--hue)),
    oklch(70% 0.2 calc(var(--hue) + 120deg)),
    oklch(70% 0.2 calc(var(--hue) + 240deg)));
  animation: spin-hue 8s linear infinite;
}
```

That's a smoothly hue-rotating conic gradient. No JS, no library, GPU-composited.

### Scroll-driven animations

`animation-timeline: scroll()` and `view()` reached **Baseline October 2025** — production-ready in Chromium, Edge, Safari Tech Preview, Firefox behind a flag. The rule: progressive enhancement.

```css
@supports (animation-timeline: view()) {
  .reveal {
    animation: fade-up linear both;
    animation-timeline: view();
    animation-range: entry 0% cover 30%;
  }
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

If the browser supports it, the element animates as it enters the viewport. If not, the element is just there — no JavaScript, no library, no IntersectionObserver. The CSS Scroll-Driven Animations community is the canonical reference: [scroll-driven-animations.style](https://scroll-driven-animations.style/).

### View Transitions API

Production-ready in 2026 (Baseline October 2025 for same-document; Chromium 126+, Safari 18.2+ for cross-document). The Hallmark landing page already uses it for theme transitions:

```js
function applyTheme(theme) {
  const apply = () => { /* mutate the DOM */ };
  if (!reduced && document.startViewTransition) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
}
```

The browser handles the cross-fade. No animation libraries needed for state changes.

### Motion / GSAP / friends — when each earns its bundle

| Library | When | Bundle | Verdict |
| --- | --- | --- | --- |
| **[Motion](https://motion.dev)** (`motion/react`, `motion`) | Orchestrated multi-element entrances in React (variants, `AnimatePresence`, viewport hooks). The default for React heroes in 2026. | 4 KB base + 2 KB React = 6 KB. Web Animations API–backed. | First reach for React. |
| **[GSAP](https://gsap.com)** (free since the Webflow partnership) | Ambitious timelines, scrub-on-scroll, SVG path-morphing across mismatched anchors. Hero sequences with 20+ elements, multi-step narratives. | ~50 KB core; 100 KB+ with plugins (ScrollTrigger, Draggable). | Worth it when timelines are core. Overkill for a fade-in. |
| **AutoAnimate** | Trivial layout transitions in React (a list reflows, an element appears). | 2 KB. | Fine for what it does. |
| **Anime.js v4** | Lightweight stagger, simple animations, vanilla JS. | ~15 KB. | Acceptable; less common than Motion in 2026. |
| **Theatre.js** | Visual editor + code API for ambitious orchestration. Niche but powerful. | Heavy (~80 KB+). | Single-page interactive art only. |

**The decision rule:**

```
Single element, simple motion           → CSS keyframes / @property
Multiple elements, orchestrated entrance → Motion (React) or GSAP (vanilla / complex)
Scroll-progress-linked                   → ONE pattern from scroll-choreography.md (animation-timeline CSS); GSAP ScrollTrigger only when that pattern genuinely needs JS
State change between two layouts         → View Transitions API
A list reflows in React                  → AutoAnimate
A complex hero narrative with scrubbing   → GSAP timeline + ScrollTrigger
```

Reaching for Motion for a single fade-in (4 KB for nothing) is the bundle-bloat tell. Reaching for GSAP for a list reflow (50 KB for nothing) is the same tell, louder.

### Anti-patterns of declarative animation

- **Animating `width`, `height`, `top`, `left`, `margin`, or `padding`** (causes layout thrash). Animate `transform` and `opacity` only — they composite on the GPU.
- **Linear easing on UI** (no subtlety; reads as "demo from a tutorial").
- **Bouncy elastic on hero entrances** (`cubic-bezier(0.34, 1.56, …)` and friends) — reserved for genuine physical interactions like drag-release.
- **Importing Motion or GSAP for one fade-in.** 50 KB for what `transition: opacity 400ms var(--ease-out)` does in zero bytes.
- **Scroll-fade-everything.** Every section fading in on scroll. The page never settles. Pick one orchestrated entrance on first load and let the rest *be there*.
- **Reveal animations with no `prefers-reduced-motion` fallback.** Every transform / animation must be guarded.
