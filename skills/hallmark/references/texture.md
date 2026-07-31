# Texture and print artifacts - a budgeted vocabulary

Loaded only when the picked theme earns texture (affinity table below) or a custom draw's lineage is print. Texture is a TREATMENT with a budget, never ambience: one artifact family per page, tokened opacity, never animated, never under body text at more than a whisper. Grain smeared everywhere is the tic the harness adapters refuse; grain from this file, on a theme that earns it, is craft.

## The budget (binds on every artifact)

- **One artifact family per page.** Grain OR halftone OR misregistration OR scanline OR deckle; combinations are mud.
- **Tokened opacity, declared in the token block:** `--texture-opacity` <= 0.08 page-wide, <= 0.15 scoped to a card or plate. Under running body text, <= 0.05 or nothing.
- **Never animated.** No drifting grain, no pulsing dots; the one exception is E7's slow-drift knob on its abstract background, which is E7's budget, not this file's.
- **`pointer-events: none` and `aria-hidden="true"`** on every overlay; texture never intercepts input (the gate-47 carve-out language for Arcade's scanlines is the model).
- **Perf:** pure CSS or a data-URI SVG filter; no image requests for texture (the imagery-kit texture tiles are the only sanctioned files, and they are optional).

## 1 · Grain (paper)

The feTurbulence data-URI from assets.md, tokenized:

```css
:root { --texture-opacity: 0.06; }
.grained::after {
  content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
  opacity: var(--texture-opacity); mix-blend-mode: multiply;
}
```

Hero or one accent card; page-wide only on Riso at <= 0.08. On dark papers multiply goes invisible: swap to `mix-blend-mode: overlay` at half the opacity.

## 2 · Halftone (dot field)

Carnival's recipe, generalized with a size token:

```css
:root { --halftone-size: 12px; --halftone-dot: 1.5px; }
.halftone { background-image: radial-gradient(var(--color-ink) var(--halftone-dot), transparent var(--halftone-dot));
  background-size: var(--halftone-size) var(--halftone-size); }
```

Placeholder image regions, plate fills, section bands. Never under or overlapping typography (Carnival's own pitfall rule). Dot in ink or one spot colour, never the accent at full field strength.

## 3 · Misregistration (chromatic echo)

Riso's signature, portable to any print-lineage custom:

```css
.misreg { position: relative; }
.misreg::before, .misreg::after {
  content: attr(data-text); position: absolute; inset: 0;
  mix-blend-mode: multiply; pointer-events: none;
}
.misreg::before { color: var(--color-accent);   transform: translate(-2px, -2px); }
.misreg::after  { color: var(--color-accent-2); transform: translate(2px, 2px); }
```

**1-2 focal words per page, never every heading.** The echo colours are the theme's declared spot inks; the offset stays 1-3px (more reads broken, not printed). May settle once on load (<= 400ms, reduced-motion static); never loops.

## 4 · Scanline (CRT)

Arcade's recipe; the gate-47 carve-out applies verbatim (the retro signal is atmosphere, never a fake monitor bezel):

```css
body::after { content: ""; position: fixed; inset: 0; z-index: var(--z-raised);
  pointer-events: none;
  background: repeating-linear-gradient(transparent 0 2px, var(--scanline) 2px 3px); }
```

`--scanline` is a page-local decorative token at low alpha. Arcade and arcade-adjacent customs only.

## 5 · Deckle (paper edge)

For plates, tickets, and stubs on print-lineage pages:

```css
.deckled { box-shadow: inset 0 0 0 1px var(--color-rule);
  mask-image: radial-gradient(6px at 0 50%, transparent 97%, black) ;
  mask-size: 12px 24px; mask-repeat: repeat-y; mask-position: left; }
```

One edge, one element class per page (a ticket edge, a stamp perforation). Never on cards generally; it is an artifact, not a border style.

## Affinity - who earns texture

| Earns it | The artifact |
| --- | --- |
| Riso | grain (page <= 0.08) + misregistration (its signature) |
| Carnival | halftone plates + hard-offset kit (its own, see spec) |
| Arcade | scanline + starfield (gate-47 carve-out) |
| Newsprint | the faintest fibre grain, card-scoped, off by default |
| Custom draws with print lineage | pick ONE artifact that the drawn direction historically used |

**Banned regardless:** Specimen, Atelier, Cobalt, and the modern-minimal cluster (their specs ban texture explicitly); atmospheric's canvas is blooms, not grain. When a theme spec and this file disagree, the spec wins.

## Reduced motion and accessibility

The settle-once misregistration and nothing else moves; everything here ships identical under `prefers-reduced-motion: reduce` because nothing animates. Texture never lowers text contrast below the gate-40/41 thresholds: measure contrast on the textured result, not the flat token.
