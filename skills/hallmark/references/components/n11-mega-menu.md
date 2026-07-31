### N11 · Mega-menu panel
A standard top bar whose triggers open a **full-width multi-column panel** — icon · title · description per item, grouped under column headers, often with a promoted feature card on one side. The page dims behind a scrim. Vercel "Products", Figma "Products", Notion "Resources".
*Use when:* the brand has many destinations that need grouping + explanation (a platform with 6+ products, or docs/resources hubs). The payload is the design problem, not the bar.
*Don't confuse with:* N1b (small single-column dropdowns); N1a (no dropdowns at all).

```html
<header class="nav">
  <div class="nav__inner">
    <a class="nav__brand">Northwind</a>
    <nav class="nav__center">
      <div class="mega" data-mega="products"><button class="nav__link" aria-controls="mega-products" aria-expanded="false">Products <span class="nav__caret"></span></button></div>
    </nav>
    <div class="nav__right"><a class="btn btn--accent">Get started</a></div>
  </div>
  <div class="mega-panel" id="mega-products" data-panel="products">
    <div class="mega-panel__inner">
      <div class="mega-col"><p class="mega-col__head">Move money</p><a class="mega-link"><span class="mega-link__ico"></span><span><b>Payments</b><i>cards, ACH, wires</i></span></a></div>
      <a class="mega-feature"><p class="mega-feature__title">Vault</p><p class="mega-feature__desc">stablecoin settlement</p></a>
    </div>
  </div>
</header>
<div class="nav-scrim" id="scrim"></div>
```
```css
.mega-panel { position: absolute; top: 100%; left: 0; right: 0; opacity: 0; visibility: hidden; transform: translateY(-10px);
  background: color-mix(in oklch, var(--color-paper) 96%, transparent); backdrop-filter: blur(20px) saturate(160%);
  border-bottom: 1px solid var(--color-rule); box-shadow: 0 30px 60px -28px oklch(0% 0 0 / 0.35);
  transition: opacity 240ms, transform 280ms var(--ease-spring), visibility 240ms; }
.mega-panel.is-open { opacity: 1; visibility: visible; transform: none; }
.mega-panel__inner { max-width: var(--page-max); margin: 0 auto; padding: 2rem var(--page-gutter);
  display: grid; grid-template-columns: repeat(3, 1fr) 1.1fr; gap: 2rem; }
.nav-scrim { position: fixed; inset: 0; z-index: 400; background: oklch(18% 0.01 250 / 0.28); backdrop-filter: blur(2px);
  opacity: 0; visibility: hidden; transition: opacity 260ms, visibility 260ms; }
.nav-scrim.is-active { opacity: 1; visibility: visible; }
```
*JS:* hover opens (with a ~140ms close-grace timer so the pointer can travel into the panel), click toggles, Esc closes, only one panel open at a time, scrim + `aria-expanded` follow state.

**Knobs** — *Columns:* 2 · 3 · 4 · *Feature cell:* none · promo card · code sample · *Scrim:* dim+blur (default) · dim only · none · *Open on:* hover+click (default) · click only.
*Anti-pattern:* never more than ~4 columns; never a panel taller than ~60vh; never open on hover with no close-grace timer (the menu flickers when the pointer crosses the gap). Items must carry a one-line description — a bare link grid is just N1b in disguise.
*Mobile:* collapse the whole thing to a drawer; the columns stack as accordion groups.

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Columns: 2 · 3 · 4
- Feature cell: none · promo card · code sample
- Scrim: dim+blur · dim only · none

## Mobile collapse

- **Below 60rem:** mega panels become full-width sheets under the bar
- **Below 40rem:** panels become accordions inside the hamburger sheet
