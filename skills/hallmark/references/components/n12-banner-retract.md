### N12 · Announcement banner + retracting nav
A coloured promo **banner** stacked above one real nav. On scroll-down the banner slides up and retracts, leaving a single clean nav docked to the top; on scroll-up it slides back. A dismiss × removes the banner for good (its height zeroes so no gap is left). Apple-style coupled bars, but the top tier is a *banner*, not a second nav — the colour contrast is what stops it reading as "two navs".
*Use when:* there's a genuine, time-bound announcement (a launch, a sale, free shipping) worth a persistent strip, over a product/marketing page. Great for stat-led or commerce pages.
*Don't confuse with:* a static announcement bar that never moves (fine, but not N12); N1b (single bar, no banner).

```html
<header class="nav" id="nav">
  <div class="nav__banner" id="banner">
    <p class="nav__banner-text"><span class="nav__banner-spark"></span> New — <b>shared habits</b>. <a class="nav__banner-link">Try it →</a></p>
    <button class="nav__banner-x" id="banner-x" aria-label="Dismiss"><span></span></button>
  </div>
  <div class="nav__bar"><div class="nav__bar-inner">
    <a class="nav__brand">Tally</a>
    <nav class="nav__links">…</nav>
    <a class="btn btn--accent">Start</a>
  </div></div>
</header>
```
```css
:root { --banner-h: 42px; --bar-h: 64px; }
.nav { position: fixed; inset: 0 0 auto; z-index: 500; transform: translateY(0); transition: transform 320ms var(--ease-out); }
.nav.is-compact   { transform: translateY(calc(var(--banner-h) * -1)); }  /* banner hides, bar docks to top */
.nav.is-dismissed { transform: none; }
.nav.is-dismissed .nav__banner { display: none; }
.nav__banner { height: var(--banner-h); display: flex; align-items: center; justify-content: center;
  background: linear-gradient(100deg, var(--color-accent), var(--color-accent-deep)); color: var(--color-paper); }
/* content clears both at rest; zero --banner-h on dismiss so calc() reflows with no gap */
.demo-hero { padding-top: calc(var(--banner-h) + var(--bar-h) + 4rem); }
```
*JS:* track scroll direction — past ~48px going down → `.is-compact`; going up → remove it; near top → always show. Dismiss × sets `--banner-h: 0px` (via `documentElement.style`) and adds `.is-dismissed`.

**Knobs** — *Banner fill:* solid accent · gradient (default) · tint+ink · *Dismiss:* yes (default) · none · *Bar scroll:* sticky (default) · also-frosts · *Banner content:* promo · status · countdown.
*Anti-pattern:* never make the top tier a second set of nav links — that's the "two nav bars" smell the banner exists to avoid. Keep the banner one line, one link, one dismiss. Don't animate banner height directly (janky); translate the whole `.nav` and zero the height only on dismiss.
*Mobile:* banner text truncates / drops the leading glyph; nav links collapse; the Buy/primary CTA stays.

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Banner fill: solid · gradient · tint+ink
- Dismiss: yes · none
- Bar scroll: sticky · also-frosts

## Mobile collapse

- **Below 60rem:** banner stays dismissible; retract behaviour kept
- **Below 40rem:** banner text truncates to one line; nav row collapses to hamburger
