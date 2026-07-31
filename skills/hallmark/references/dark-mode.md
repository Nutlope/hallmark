# Dark mode - parity, never inversion

Loaded only when the user asks for both modes ("dark mode too", "light and dark") or the pre-flight finds an existing mode system to respect. A dark THEME (Midnight, Ledger, Aurora) is not a dual-mode page; this file is for pages that ship BOTH modes from one token system. Never emit dual-mode unprompted.

## The stance

Dark mode is a second, equally designed rendering of the same system - not `filter: invert()`, not "flip the greys". Every token is re-derived by recipe; every contrast target holds identically in both modes; the anchor hue never moves. If a token would fail its contrast pairing after re-derivation, fix the derivation, never the requirement.

## Token re-derivation (per token, from the light value)

| Token | Dark derivation |
| --- | --- |
| `--color-paper` | L 12-18%, anchor-tinted (chroma 0.008-0.015). Never `#000`. |
| `--color-paper-2/3` | ELEVATION IS LIGHTER: +3% L per level above paper (light mode steps darker; dark mode steps lighter). |
| `--color-ink` | L 92-96%, anchor-tinted. Never `#fff`. |
| `--color-ink-2` / muted / neutral | re-space the L steps between the new paper and ink so the typographic depth reads even; keep every chroma tint. |
| `--color-rule` | L ~26-34%; hairlines must survive on the dark ground (check against paper-2, not just paper). |
| `--color-accent` | chroma -0.02 to -0.04, L +5-10% (saturated light-mode accents glare on dark). |
| `--color-accent-ink` | re-verify: >= 4.5:1 body / 3:1 large on the new accent fill. |
| `--color-focus` | follows the accent derivation; ring contrast >= 3:1 against BOTH papers. |
| hue | NEVER moves between modes, on any token. |

Plus one non-token move: reduce body `font-weight` by 50 units (400 to 350) in dark; light-on-dark text reads optically heavier.

## Emission

`tokens.css` carries the light block as-is, then exactly two additions:

```css
[data-mode="dark"] { /* only the tokens that move, re-derived per the table */ }

@media (prefers-color-scheme: dark) {
  :root:not([data-mode]) { /* the same overrides, for OS-preference auto mode */ }
}
```

The `[data-mode]` attribute wins over the media query by construction (the media block only applies when no explicit mode is set). Toggle: one button setting `document.documentElement.dataset.mode`, persisted to `localStorage`, read before first paint in a 4-line inline script so the page never flashes the wrong mode. `color-scheme: light dark` on `:root` so form controls and scrollbars follow.

## Dark discipline (the rules that change)

- **Shadows off.** Elevation is lightness (the +3% ladder) or an inset hairline ring (`box-shadow: inset 0 0 0 1px var(--color-rule)`). A drop shadow on dark reads as glow; glow is legal only under the atmospheric genre carve-out (atmospheric.md § glow-lift), which is a THEME behaviour, not a mode behaviour.
- **Cards lighter than canvas.** `paper-2` on `paper`, always; a card darker than its ground reads as a hole.
- **One heading colour.** Headings all run `--color-ink`; per-heading colour variety that worked on light fragments on dark.
- **Images.** Never CSS `invert`/`brightness` on raster images. Ship `-dark` asset variants (the imagery kit or tier-e generation), or wrap the image in a `paper-2` well so the light image reads as intentional plate. Kit brush/blob multiply assets skip dark mode entirely (multiply dies on dark grounds; texture.md notes the overlay swap for grain).
- **Charts.** Marks re-derive like accents (chroma down, L up); gridlines from the dark `--color-rule`; see data-viz.md § Dark.

## Verification

Both modes run the full gate sweep: contrast gates 40-41 on every pairing in BOTH modes (the render tier only sees the default mode; check the dark pairings numerically), gate 7 (no pure black/white) binds on the dark block too, and the stamp records `modes: light+dark` so the log knows.
