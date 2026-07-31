### N1b · Canonical SaaS three-section
Wordmark hard-left · a centred cluster of 4–6 links (some opening hover dropdowns) · a sign-in text link + filled CTA hard-right. The dominant marketing-nav of 2024–26 (Stripe, Linear, Vercel, Figma, Notion, PostHog). The structural opposite of N1's *minimal* two-link variant — this one is dense and balanced.
*Use when:* a SaaS / product / dev-tool page with several real destinations and a clear primary action. The default reach for modern-minimal and (Hum-styled) playful product pages.
*Don't confuse with:* N1a (wordmark + 2 links, no centre cluster); N5 (detached pill); N11 (mega-menu panels, not small dropdowns).

```html
<header class="nav"><div class="nav__inner">
  <a class="nav__brand">Conduit</a>
  <nav class="nav__center">
    <div class="nav__item nav__item--menu">
      <button class="nav__link" aria-expanded="false">Product <span class="nav__caret"></span></button>
      <div class="nav__dropdown"><a class="nav__dropitem"><b>Gateway</b><i>one endpoint</i></a></div>
    </div>
    <a class="nav__link">Docs</a><a class="nav__link">Pricing</a>
  </nav>
  <div class="nav__right"><a class="btn btn--text">Sign in</a><a class="btn btn--accent">Start</a></div>
</div></header>
```
```css
.nav { position: fixed; inset: 0 0 auto; z-index: 500; background: transparent; border-bottom: 1px solid transparent;
  transition: background 240ms, border-color 240ms, box-shadow 240ms; }
.nav.is-scrolled { background: color-mix(in oklch, var(--color-paper) 72%, transparent);
  backdrop-filter: blur(18px) saturate(160%); border-bottom-color: var(--color-rule); box-shadow: 0 8px 28px -18px oklch(0% 0 0 / 0.4); }
.nav__inner { max-width: var(--page-max); margin: 0 auto; padding-inline: var(--page-gutter); height: 64px;
  display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; }
.nav__brand { justify-self: start; } .nav__center { justify-self: center; display: flex; gap: 0.35rem; } .nav__right { justify-self: end; }
.nav__dropdown { position: absolute; opacity: 0; visibility: hidden; transform: translateY(-6px) scale(0.98);
  transition: opacity 200ms, transform 220ms var(--ease-spring), visibility 200ms; }
.nav__item--menu:hover .nav__dropdown, .nav__item--menu:focus-within .nav__dropdown { opacity: 1; visibility: visible; transform: none; }
```

**Knobs** — *Centre links:* 3 · 4 · 5–6 · *Dropdowns:* none · 1 · 2 · *Scroll state:* frost-on-scroll (default) · always-solid · transparent-fixed · *CTA pair:* sign-in + fill · fill only.
*Scroll behaviour (default):* transparent at rest over the hero, frosts (blur backdrop + hairline border + soft shadow) past ~24px, and tightens height ~8px. Always rAF-throttle the scroll handler.
*Anti-pattern:* don't let the centre cluster collide with brand/CTA — if it can't sit centred with breathing room, drop to 3 links or route to N1a. Never ship a dropdown that opens on click only with no hover/focus affordance.
*Mobile:* hide `.nav__center` below ~900px; brand + CTA (or hamburger) remain.

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Centre links: 3 · 4 · 5–6
- Dropdowns: none · 1 · 2
- Scroll: frost-on-scroll · always-solid · transparent-fixed

## Mobile collapse

- **Below 60rem:** centre link cluster collapses behind a menu disclosure; sign-in + CTA stay inline
- **Below 40rem:** hamburger only: wordmark left, menu + CTA right, 44px hit targets
