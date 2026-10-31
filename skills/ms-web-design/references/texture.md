# Texture and print artifacts: a budgeted vocabulary

Loaded only when the picked theme earns texture (affinity table below) or a custom draw's lineage is print. Texture is a treatment with a budget, never ambience: one artifact family per page, tokened opacity, never animated, never under body text at more than a whisper. Grain smeared everywhere is the tic `flow.md` § Harnesses refuses; grain from this file, on a theme that earns it, is craft.

## The budget (binds on every artifact)

- **One artifact family per page.** Grain, halftone, misregistration, scanline or deckle, never two. A risograph print is one family: its grain and its misregistration come from the same drum. A halftone that is a photograph's treatment belongs to the image, not the page, and does not count.
- **Tokened opacity, declared in the token block:** `--texture-opacity` <= 0.08 page-wide, <= 0.15 scoped to a card or plate. Under running body text, <= 0.05 or nothing. A low-frequency wash (a base frequency of 0.02 or lower: a fibre, a paper tone) tints rather than specks and may run to 0.12 page-wide, with contrast measured on the result.
- **Never animated.** No drifting grain, no pulsing dots.
- **`pointer-events: none` and `aria-hidden="true"`** on every overlay; texture never intercepts input, and the retro signal is atmosphere, never a drawn monitor bezel (47a).
- **Perf:** pure CSS or a data-URI SVG filter; no image requests for texture.

## 1 · Grain (paper)

A speck grain, tokenised:

```css
:root { --texture-opacity: 0.08; }
.grained { position: relative; isolation: isolate; }
.grained::after {
  content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 1;
  background-size: 200px 200px; opacity: var(--texture-opacity);
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 9 -4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
}
```

The colour matrix turns the noise into discrete specks (alpha is the noise times nine, minus four), so the grain reads at 1x inside the budget; untreated `feTurbulence` at these opacities is a haze nobody sees. On a dark ground the specks must be light: change the matrix's first three rows to `0 0 0 0 1` so each speck is white, keep the opacity. One plate, one accent card, or the page at 0.08 or less when the theme names grain.

## 2 · Halftone (dot field)

A dot screen with a size token:

```css
:root { --halftone-size: 12px; --halftone-dot: 1.5px; }
.halftone { background-image: radial-gradient(var(--color-ink) var(--halftone-dot), transparent var(--halftone-dot));
  background-size: var(--halftone-size) var(--halftone-size); }
```

Plate fills and section bands. Never under or overlapping type. Dot in ink or one spot colour, never the accent at full field strength.

## 3 · Misregistration (chromatic echo)

Riso's signature, portable to any print-lineage custom run:

```css
.misreg { position: relative; display: inline-block; isolation: isolate; }
.misreg::before, .misreg::after {
  content: attr(data-text); position: absolute; inset: 0; z-index: -1;
  white-space: nowrap; pointer-events: none;
}
.misreg::before { color: var(--color-accent);   transform: translate(-2px, -2px); }
.misreg::after  { color: var(--color-accent-2, var(--color-focus)); transform: translate(2px, 2px); }
```

**One focal word per page, in the hero, under the theme's `waive 38iii`; never every heading.** The span is an inline block so the copies sit on the glyphs whatever the head's line-height, and they print behind the ink so the word keeps its colour; only the fringes carry the echoes. The echo colours are the theme's declared spot inks (`--color-accent` and `--color-accent-2` here, or the theme's own echo tokens); the offset stays 1 to 3px (more reads broken, not printed). It may settle once on load over `--dur-long` at most, static under reduced motion; it never loops.

## 4 · Scanline (CRT)

Arcade's recipe; the retro signal is atmosphere, never a drawn monitor bezel (47a):

```css
:root { --scanline: oklch(from var(--color-ink) l c h / 0.06); }
body::after { content: ""; position: fixed; inset: 0; z-index: var(--z-raised);
  pointer-events: none;
  background: repeating-linear-gradient(transparent 0 2px, var(--scanline) 2px 3px); }
```

`--scanline` is a page-local decorative token at low alpha. Arcade and arcade-adjacent customs only.

## 5 · Deckle (paper edge)

For plates, tickets, and stubs on print-lineage pages:

```css
.deckled { box-shadow: inset 0 0 0 1px var(--color-rule);
  mask-image: radial-gradient(6px at 0 50%, transparent 97%, black);
  mask-size: 12px 24px; mask-repeat: repeat-y; mask-position: left; }
```

One edge, one element class per page (a ticket edge, a stamp perforation). Never on cards generally; it is an artifact, not a border style.

## Affinity: who earns texture

A theme earns texture when its Surfaces section names one; a custom draw earns it when its lineage is print (risograph, letterpress, ticket stock, line printer), and then it picks the one artifact that lineage used. The budget above binds every theme, whatever its file says: page-wide grain at 0.08 or less, 0.15 inside one plate, 0.05 or nothing under running text. Examples: Riso (grain and misregistration), Halftone (a dot screen), Paste-up (a fibre wash), Darkroom (film grain), Arcade (scanlines).

**Never:** a texture a theme does not name, grain on a modern-minimal page, two artifact families on one page, or a texture as ambience over everything because the page felt flat.

## Reduced motion and accessibility

The settle-once misregistration and nothing else moves; everything here ships identical under `prefers-reduced-motion: reduce` because nothing animates. Texture never lowers text contrast below the gate-40/41 thresholds: measure contrast on the textured result, not the flat token.
