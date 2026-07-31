# Colour

Most AI-generated UI fails on colour. It picks blue. It uses pure black. It draws a gradient from purple to cyan. It leaves accents on 30% of the page. Fix all of this.

## Principles

- **OKLCH only.** Perceptually uniform; predictable lightness; consistent hue across tints. `hsl()` and `rgb()` lie about brightness.
- **One accent.** Maximum two. Everything else is neutral. The accent should occupy **5% or less** of any given viewport (the one number; gate 23 measures it).
- **No pure extremes.** No `#000`, no `#fff`. Always tint with a trace of chroma toward the palette's anchor hue.
- **Tint the greys.** If your anchor hue is orange, your neutrals lean warm. If it's blue, they lean cool. A page with a warm accent and cool grey body copy looks wrong and most people can't name why.

## Palette construction

A complete Hallmark palette has four layers.

1. **Paper** — the base surface. `oklch(96–98% 0.005–0.015 <anchor hue>)` for light mode, `oklch(12–18% 0.008–0.015 <anchor hue>)` for dark.
2. **Ink** — the primary text. `oklch(16–22% 0.005–0.015 <anchor hue>)` for light mode, `oklch(92–96% 0.005–0.01 <anchor hue>)` for dark.
3. **Neutrals** — 5 to 9 steps between Paper and Ink, each with the anchor's chroma tint at low values (0.005–0.015).
4. **Accent** — one saturated colour with meaningful chroma (0.12–0.22). Used for links, active states, highlights, focus rings. Never as a background fill that covers more than a few percent of the surface.

Example (warm-oat anchor, hue 80):

```css
:root {
  --color-paper:    oklch(96%  0.012 80);
  --color-paper-2:  oklch(93%  0.014 80);
  --color-rule:     oklch(82%  0.010 80);
  --color-neutral:  oklch(56%  0.008 80);
  --color-muted:    oklch(40%  0.008 70);
  --color-ink:      oklch(18%  0.010 60);
  --color-accent:   #FC4C02;                   /* signal orange */
  --color-focus:    oklch(55%  0.19  55);
}
```

Example (midnight anchor, hue 40):

```css
:root {
  --color-paper:    oklch(14%  0.008 40);
  --color-paper-2:  oklch(18%  0.010 40);
  --color-rule:     oklch(30%  0.008 40);
  --color-neutral:  oklch(58%  0.008 40);
  --color-muted:    oklch(72%  0.006 40);
  --color-ink:      oklch(94%  0.006 80);
  --color-accent:   #FC4C02;
  --color-focus:    oklch(70%  0.19  55);
}
```

## Contrast

Use the APCA contrast check when you can; otherwise WCAG 2.1 ratios.

| Content | Minimum | Target |
| --- | --- | --- |
| Body text | 4.5:1 | 7:1 |
| Large text (≥ 18.66px bold or 24px) | 3:1 | 4.5:1 |
| UI component boundaries | 3:1 | 4.5:1 |
| Placeholder / helper text | 4.5:1 | 4.5:1 |

Verify with the browser devtools vision-deficiency emulator before shipping. When you cannot render, use the numeric alternative: verify the two colours differ by >= 15% OKLCH lightness in addition to hue, so the pair survives every common colour-vision deficiency.

## Dark mode recipe

Paper 12-18% (never `#000`) · ink 92-96% (never `#fff`) · elevation is LIGHTER (+~3% L per level) · accent chroma down 0.02-0.04 with L up 5-10% · hue never moves. The full per-token derivation table, dual-mode emission blocks, and dark discipline (shadows, cards, images, charts) live in [`dark-mode.md`](dark-mode.md); load it whenever the user asks for both modes.

## Bans

- **Pure `#000000`** anywhere. Use `oklch(16% 0.01 <hue>)` or similar.
- **Pure `#ffffff`** as a base surface. Use a tinted paper.
- **Flat grey** (`oklch(L 0 H)` with zero chroma). Add at least 0.005.
- **Purple-to-cyan gradients, purple-to-blue gradients, orange-to-pink gradients.** Every LLM picks these. Don't.
- **Accent as background fill** covering more than ~5% of any view.
- **Grey text on coloured background.** Always reads washed out.
- **Red–green pairing as the only signal.** Add an icon or pattern.
- **Alpha transparency as the definition of a colour.** If it's a named token, it's opaque. Transparency is a *modifier* for overlays and shadows, not a palette.
- **Three-colour gradients.** Two-stop gradients only. The third stop is vanity.

## Use of the accent

The accent is a highlighter, not a colour block. Reach for it to:

- Mark an active nav item.
- Draw a focus ring.
- Underline a link on hover.
- Indicate a primary CTA's border or text.
- Place a small square beside a heading as a visual anchor.

Do not fill giant buttons with it. Do not set whole sections on it. Do not use it for decorative gradients. If you feel the urge to use more, that's the slop defaulting. Use less.

## Colour postures

The rules above describe the catalog's default posture, **Restrained**. A custom build (and only a custom build) may declare a different posture during the ritual in [`custom-theme.md`](custom-theme.md) § The ritual; the posture is stated in the stamp and the log, never improvised mid-render.

| Posture | Where the colour lives | The rule that still binds |
| --- | --- | --- |
| **Restrained** | accent <= 5% of any viewport | everything above, unchanged |
| **Committed** | one colour carries 30-60% of the surface through `--color-field` / the paper family | the accent token proper stays <= 5%; contrast gates 40-41 bind on the coloured surface |
| **Full palette** | 3-4 named roles (field, signal, seal, ink), each with a stated job | every role is a token; no role exceeds its stated footprint |
| **Drenched** | the surface IS the colour; ink and rules derive from it | ink contrast per § Contrast; the accent slot may be retired entirely |

A declared surface colour under a stated posture is not accent footprint (gate 23 reads the posture). Undeclared accent sprawl still fails. Dark themes are the existing precedent: Midnight's near-black paper never counted against the accent budget; a Committed field colour works the same way.
