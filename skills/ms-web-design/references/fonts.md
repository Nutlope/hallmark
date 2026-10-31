# Fonts

Loaded on a custom run. A catalog theme has already named its faces; do not read this to second-guess it.

**Needs before reading:** the page's idea and what it shows. **Gives:** a display face, a body face, an optional outlier, and the load rules.

## The rule

One display face and one body face, or one family for both; an optional outlier carries exactly one role (a wordmark, a headline figure, code). A custom run picks a display face no catalog theme sets: `node <skill-dir>/scripts/theme.mjs check --face "<face>"` refuses the ones in use, so run it before writing the token. The lists below already leave those faces out. Choose the class the idea calls for, then two or three faces from it, and decide on the real headline set in each, by shape and colour on the page; a face's name, its reputation or a subject association is not a reason. Free faces only unless the user has confirmed a licence; variable fonts preferred.

## Banned as a default

Every model reaches for these first, so they read as unchosen: Inter, Roboto, Open Sans, Lato, Poppins, Source Sans, Nunito, Montserrat, Raleway, Work Sans, DM Sans, Plus Jakarta Sans, system-ui, Arial and Helvetica as a display or body face; Merriweather, Lora and Georgia as the body serif; Courier New or the system mono. A page may still use one of them when the user asks for it or the pre-flight found it in the project; then the stamp says so.

**Saturated** (fine faces, but the first answer, so they want an argument in the Picks block): Playfair Display, Cormorant Garamond, DM Serif Display, Fraunces, Instrument Serif, Recoleta, Space Grotesk, Hubot Sans, Bebas Neue and Unbounded as display; Geist, Instrument Sans and Mona Sans as the body or the whole page.

## Sources

- **Google Fonts.** Free, served from a CDN, works everywhere. The default source.
- **Fontshare** (Indian Type Foundry). Free for commercial use, foundry grade. One line: `<link href="https://api.fontshare.com/v2/css?f[]=<family>@<weights>&display=swap" rel="stylesheet">`.
- **A foundry** (Klim, Pangram Pangram, Production Type, Lineto, Colophon) only when the user has confirmed the licence; then ask which and pick from it directly.

## Display faces the catalog does not use

| Class | Faces (source) |
| --- | --- |
| Roman serif | EB Garamond, Cardo, Castoro, Piazzolla, Alegreya, Marcellus (Google); Gambetta, Recia (Fontshare) |
| High-contrast serif | Gloock, Libre Bodoni, Abril Fatface, Rozha One, Besley (Google); Erode, Melodrama (Fontshare) |
| Slab serif | Arvo, Hepta Slab, Domine, Alfa Slab One, Solway (Google); Bespoke Slab (Fontshare; old-style figures that ignore `lining-nums`, so figures go in the body face) |
| Grotesk sans | Rethink Sans, Reddit Sans, Albert Sans (Google); Clash Grotesk, Supreme (Fontshare) |
| Geometric sans | Lexend, League Spartan, Afacad (Google); Satoshi, Technor, Excon (Fontshare) |
| Rounded sans | Inclusive Sans, Nunito Sans at 700 only with an argument, Varela Round (Google); Chubbo, Comico (Fontshare) |
| Condensed and heavy | Teko, Tektur, Michroma, Antonio (Google); Clash Display, Panchang, Khand, Telma, Stardom, Array (Fontshare) |
| Mono as display | Space Mono, Fragment Mono, Red Hat Mono, Spline Sans Mono, Sometype Mono (Google) |
| Pixel | Press Start 2P, VT323, Pixelify Sans, Tiny5, DotGothic16, Workbench (Google) |
| Handwritten | Shantell Sans, Caveat, Gochi Hand, Reenie Beanie (Google); Sharpie (Fontshare) |

## Body faces

A body face may be one the catalog uses; bodies are not a theme's signature. Sans: Hanken Grotesk, IBM Plex Sans, Figtree, Onest, Sofia Sans, Golos Text, Karla, Chivo, Albert Sans, Public Sans, Archivo, Manrope (Google); Switzer, General Sans, Satoshi (Fontshare). Serif: Newsreader, Source Serif 4, Literata, Spectral, Crimson Pro, EB Garamond, Piazzolla (Google); Sentient (Fontshare). Mono for code, figures and measurements: Geist Mono, JetBrains Mono, IBM Plex Mono, DM Mono, Fira Code, Azeret Mono, Chivo Mono, Overpass Mono (Google).

## The wordmark

The wordmark in the nav and footer may take a different face from the body, and on tone-rich pages it should: collapsing it into the body family flattens the hierarchy and the page reads as un-branded. It is the outlier's one role when the page has no other:

```css
:root { --font-body: "Switzer", ui-sans-serif, system-ui, sans-serif; --font-outlier: "Gambetta", ui-serif, serif; }
.wordmark { font-family: var(--font-outlier); font-weight: 600; letter-spacing: -0.015em; }
```

Collapse to one family only when the body voice is the brand (a letter, a manifesto, a long document); then the wordmark takes the family's display cut or its heaviest weight. A product page whose wordmark is the body face at 600 is the un-designed default.

## Loading

- Load only the weights the page uses, as one `<link>` per source, with `display=swap`; `<link rel="preconnect">` to the host first.
- `@font-face` for a self-hosted face carries `font-display: swap` and a metric-matched fallback (`size-adjust`, `ascent-override`, `descent-override`, `line-gap-override`) so the swap does not reflow the fold.
- Never synthesise bold or italic: `font-synthesis: none`, and load the italic if a head uses it.
- A variable font loads once and gives every weight; prefer it where the family ships one.
