### N13 · Inline ⌘K search pill
A **visible** search pill sits inline in the bar — placeholder text plus a `⌘K` kbd hint — alongside (not replacing) the links. Click it, or press ⌘K / Ctrl K, to open a spotlight modal with grouped, keyboard-navigable results. The opposite of N4 (which *hides* nav behind the shortcut): here the affordance is on the surface for newcomers, with the shortcut for power users. Tailwind, Linear, Raycast, docs sites.
*Use when:* the product is search-heavy or docs-heavy and search is a primary action (dev tools, music/library apps, large content sites).
*Don't confuse with:* N4 (no visible nav, ⌘K only); a plain search icon that just focuses an input in place.

```html
<header class="nav" id="nav"><div class="nav__inner">
  <a class="nav__brand">Crank</a>
  <button class="searchpill" id="searchpill" aria-label="Search (⌘K)">
    <span class="searchpill__ico"></span><span class="searchpill__text">Search docs…</span>
    <span class="searchpill__kbd"><kbd>⌘</kbd><kbd>K</kbd></span>
  </button>
  <nav class="nav__right"><a class="nav__link">Docs</a><a class="btn btn--accent">Start</a></nav>
</div></header>
<div class="cmdk" id="cmdk" aria-hidden="true">
  <div class="cmdk__backdrop" data-close></div>
  <div class="cmdk__panel" role="dialog" aria-modal="true">
    <div class="cmdk__field"><span class="cmdk__field-ico"></span><input id="cmdk-input" placeholder="Search docs…"><kbd>esc</kbd></div>
    <div class="cmdk__results"><p class="cmdk__group">Suggested</p><button class="cmdk__item is-active">…</button></div>
    <div class="cmdk__foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>
  </div>
</div>
```
```css
.searchpill { display: flex; align-items: center; gap: 0.6rem; height: 40px; padding: 0 0.55rem 0 0.85rem;
  background: var(--color-paper-2); border: 1px solid var(--color-rule); border-radius: 999px; color: var(--color-muted);
  transition: border-color 200ms, box-shadow 200ms; }
.searchpill:hover { border-color: var(--color-rule-2); box-shadow: 0 4px 16px -10px oklch(0% 0 0 / 0.3); }
.cmdk { position: fixed; inset: 0; z-index: 700; opacity: 0; visibility: hidden; transition: opacity 200ms, visibility 200ms; }
.cmdk.is-open { opacity: 1; visibility: visible; }
.cmdk__panel { position: absolute; top: 14vh; left: 50%; transform: translateX(-50%) translateY(-8px) scale(0.98);
  width: min(560px, calc(100vw - 2rem)); transition: transform 240ms var(--ease-spring); }
.cmdk.is-open .cmdk__panel { transform: translateX(-50%) translateY(0) scale(1); }
```
*JS:* ⌘K / Ctrl K toggles, Esc closes, backdrop-click closes, ↑/↓ move the active item, Enter selects, focus the input on open and lock body scroll.

**Knobs** — *Pill placement:* centred (default) · right-of-brand · *Result groups:* flat · grouped (default) · *Footer hints:* shown (default) · hidden · *Open trigger:* pill+⌘K (default) · ⌘K only (→ that's N4, not N13).
*Anti-pattern:* don't fake the modal with a `<div>` that traps no focus and ignores Esc — if you ship the pill you ship the keyboard model. The pill must look like search (icon + placeholder), not a generic button.
*Mobile:* the pill collapses to a search icon; the modal goes full-height sheet.

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Pill placement: centred · right-of-brand
- Result groups: flat · grouped
- Footer hints: shown · hidden

## Mobile collapse

- **Below 60rem:** pill narrows; placeholder shortens; ⌘K hint hidden
- **Below 40rem:** pill becomes an icon-only search trigger opening a full-screen modal
