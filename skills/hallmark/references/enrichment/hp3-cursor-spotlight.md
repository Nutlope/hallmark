### HP3 · Cursor-spotlight

A radial-gradient background that tracks `mousemove`, scoped to the hero only. Reads as atmospheric · modern-minimal SaaS — Linear, Tailwind Labs, Raycast.

*Use when:* the page is atmospheric / dark-paper / SaaS marketing, the hero has empty surface to play under, and the brand voice can carry "tactile, alive".
*Avoid when:* the cursor would track over content (text, buttons) — pulls focus from reading. Scope the spotlight to a backdrop layer beneath text, never over it.

```html
<header class="hero hero--spotlight">
  <div class="hero__spotlight" aria-hidden="true"></div>
  <div class="hero__body">
    <h1 class="hero__display">Distributed tracing that explains itself.</h1>
    <p class="hero__lede">Open one trace. See the whole story.</p>
  </div>
</header>
```
```css
.hero--spotlight { position: relative; isolation: isolate; padding: var(--space-2xl) var(--page-gutter); overflow: hidden; }
.hero__spotlight { position: absolute; inset: 0; z-index: -1; background: radial-gradient(600px circle at var(--mx, 50%) var(--my, 30%), color-mix(in oklch, var(--color-accent) 22%, transparent), transparent 60%); transition: background 200ms var(--ease-out); }
@media (prefers-reduced-motion: reduce) { .hero__spotlight { transition: none; --mx: 50%; --my: 30%; } }
```
```js
// Scope to hero only — never page-wide.
const hero = document.querySelector('.hero--spotlight');
hero?.addEventListener('pointermove', (e) => {
  const r = hero.getBoundingClientRect();
  hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
  hero.style.setProperty('--my', `${e.clientY - r.top}px`);
});
```

*Anti-pattern:* tracking the cursor across the *whole page* — nausea-inducing, focus-stealing. Scope to hero only. The reduced-motion fallback must pin the gradient to a sensible static position (50% / 30%), not just disable the effect (which would leave a flat surface).
