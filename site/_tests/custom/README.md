# Custom worked examples

Three landing pages produced by the **custom** theme route — the new opt-in branch added to Hallmark in v0.6.x. Custom is the route for one-off custom palettes + font pairings tuned to a single brand. **Catalog** (the 16 named themes) is the default; custom fires only when the brief signals creative or unique intent.

These three pages are the worked examples written into [`references/custom-theme.md`](../../../references/custom-theme.md) § G — rendered as actual HTML so the palette + pairing can be inspected visually.

| # | Brand | Vibe | Anchor | Macrostructure | Axes |
| --- | --- | --- | --- | --- | --- |
| 01 | **Coffeebox** — small-batch coffee subscription | "archival warmth, hand-set, no varnish" | terracotta | Long Document | light / italic-serif / chromatic-terracotta |
| 02 | **Loop** — payment-rail observability for fintechs | "industrial precision, cool, technical" | sea-blue | Workbench | dark / mono / cool |
| 03 | **Mossroot** — herbal apothecary in Porto | "moss, lichen, soft pink, herbal" | (skipped — derived) | Catalogue | light / roman-serif / chromatic-other (dusty-pink) |

Each folder holds:

- **`index.html`** — the rendered page
- **`style.css`** — custom palette + pairing as inline `:root` tokens, with the custom stamp at the top

## What custom unlocks

The 16 named themes can't carry every brand. Coffeebox is closest to **Atelier** but warmer + more terracotta-led; Loop is closest to **Midnight** but mono-everywhere and sea-blue not phosphor-cyan; Mossroot has no catalog match (moss-tinted paper with dusty-pink accent isn't in the catalogue). Without custom, all three pages would compromise on the brand voice. With custom, the palette + pairing are tuned to the specific vibe — and every existing rule (OKLCH bands, accent footprint, font ban list, slop test) carries forward unchanged. The freedom is the combination, not the rules.

## What guards prevent over-invention

1. **The opt-in is opt-in.** Custom fires only when the user signals creative/unique intent in their prompt (named brand colour, multi-attribute aesthetic that doesn't match a catalog theme name, explicit "make it custom"). Default route is catalog — no behavioural change for vanilla briefs.
2. **One question only.** The skill asks vibe (4–8 words) + optional anchor colour. Anything more is over-asking.
3. **Every existing rule applies.** color.md OKLCH bands, typography.md pairing catalogue, anti-patterns.md ban list, the 38 slop-test gates — same gates fire as on catalog themes.
4. **The Step 5 preview surfaces the palette + pairing.** Before any code is emitted, the user sees the OKLCH values and the chosen fonts in plain text. They can redirect early.
5. **Diversification is theme-route-blind.** Each custom run records its three axis values (paper-band / display-style / accent-hue) in `.hallmark/log.json`. The next run rotates against them the same way it does against catalog themes.

See [`references/custom-theme.md`](../../../references/custom-theme.md) for the full protocol.
