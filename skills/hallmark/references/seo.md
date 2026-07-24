# Discoverability

Most AI-generated pages are invisible. They ship a flawless hero and forget the `<title>`. They stack six `<div>`s where a `<main>` belonged. They size a line at 6rem and call it an `h1` because it *looks* like one. They lazy-load the hero image — the one thing that should load first. None of this shows up in a screenshot, which is exactly why it survives.

Discoverability is not a marketing bolt-on. Every rule below is a decision Hallmark already makes while it builds; this file just makes it make them correctly.

## Principles

- **Structure carries meaning, size carries emphasis.** Heading *level* describes the document's shape. Type *scale* describes how loud a line is. They are independent. A `--text-display` line is not automatically an `h1`, and an `h2` is free to be small.
- **One `h1`, no skipped levels.** Exactly one per page. `h2` follows `h1`; `h3` follows `h2`. Never jump a level to reach a size you liked.
- **Landmarks before divs.** `header` · `nav` · `main` · `footer` are not optional semantics. Exactly one `main` per page, wrapping the page's actual content — not the whole body.
- **Mark up only what is on the page.** Structured data describes visible content. If the rating isn't rendered, it isn't marked up. This is the same rule as [`anti-patterns.md` § Invented metrics](anti-patterns.md), enforced one layer deeper — invented structured data is a fabricated metric that only machines read.

## The head

Every emitted page carries these. No exceptions, no placeholders left as `TODO`.

```html
<html lang="en">                                    <!-- match the copy's language -->
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Cold-brew kits for small kitchens · Ratio</title>
  <meta name="description" content="Ratio builds slow-drip brewers for counters under 40 cm. Ships flat, assembles in a minute, no filters to buy.">
  <link rel="canonical" href="https://example.com/kits">

  <meta property="og:type" content="website">
  <meta property="og:title" content="Cold-brew kits for small kitchens">
  <meta property="og:description" content="Slow-drip brewers for counters under 40 cm.">
  <meta property="og:image" content="https://example.com/og.png">   <!-- 1200×630 -->
  <meta property="og:url" content="https://example.com/kits">
  <meta name="twitter:card" content="summary_large_image">
</head>
```

| Field | Length | Rule |
| --- | --- | --- |
| `<title>` | 50–60 chars | Page subject first, brand last, separated by ` · ` or ` — `. Unique per page. |
| `description` | 140–160 chars | A sentence a human would read. Not a keyword list. |
| `og:image` | 1200×630 | Real image or omit the tag. Never point at a missing file. |
| `lang` | — | Matches the copy actually on the page, not the developer's locale. |

A `<title>` that is only the brand name is a wasted line — it's the largest text a search result will ever show for the page.

## Semantic skeleton

```html
<body>
  <header>            <!-- masthead; site-level, not the hero -->
    <nav aria-label="Primary">…</nav>
  </header>

  <main>              <!-- exactly one, no id required -->
    <h1>…</h1>
    <section aria-labelledby="kits">
      <h2 id="kits">…</h2>
    </section>
  </main>

  <footer>…</footer>
</body>
```

- A `section` with no accessible name is a `div` with extra steps. Give it `aria-labelledby` pointing at its own heading, or use `div`.
- Multiple `nav` elements need distinguishing labels (`aria-label="Primary"`, `aria-label="Footer"`).
- Decorative wrappers stay `div`. Reaching for `section` or `article` to look tidy is noise.

## Images

- **`alt` describes function, not appearance.** What would you say to someone who can't see it and needs to keep reading? *"Brewer disassembled into six parts"* — not *"image of a coffee product on a white background"*.
- **Decorative images take `alt=""`.** Empty, not missing. Missing `alt` makes a screen reader read the filename.
- **Always set `width` and `height`.** They reserve the box and stop the page from jumping as images arrive. CSS still controls the rendered size.
- **The hero image loads eagerly.** It is almost always the largest element on screen; lazy-loading it delays the one paint the visitor is waiting for.

```html
<!-- hero: the visitor is waiting for this one -->
<img src="/brewer.avif" width="1600" height="900" alt="Brewer disassembled into six parts"
     loading="eager" fetchpriority="high" decoding="async">

<!-- below the fold -->
<img src="/kitchen.avif" width="1200" height="800" alt="" loading="lazy" decoding="async">
```

## Structured data

Emit one JSON-LD block in the head, only for what the page genuinely is, and only describing content a visitor can see. One `@type` per page is normal; two is the ceiling.

| Page | `@type` |
| --- | --- |
| Company / product site | `Organization`, or `LocalBusiness` when there's a real address |
| Single product | `Product` |
| Written piece | `Article` (`author` and `datePublished` required) |
| Q&A block already on the page | `FAQPage` |
| Any page below the root | `BreadcrumbList` |

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Ratio",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}
</script>
```

Ratings are the trap. `aggregateRating` is only legal when the reviews it summarises are rendered on that page, with real counts. If the brief didn't supply reviews, the page has no rating — the same way it has no *"+47 % conversion"*. Marking up a rating that nobody wrote is not an optimisation; it's a manual action waiting to happen.

## Bans

- **No missing `<title>` or `description`.** Shipping either as `TODO`, `Untitled`, or the brand name alone.
- **More than one `h1`**, or a heading level skipped to reach a size.
- **Headings chosen by size.** `h3` for a small caption is a structural lie; use a `p` with a label class.
- **`div` where a landmark belonged.** No `main`, or several.
- **`alt="image of…"`, `alt="photo"`, or keyword-stuffed alt.** Also: missing `alt` on a decorative image — use `alt=""`.
- **Lazy-loading the hero image.** Delays the largest paint on purpose.
- **`<img>` without `width`/`height`.** Guarantees layout shift.
- **Structured data for content that isn't on the page** — reviews, ratings, FAQs, breadcrumbs to routes that don't exist. Machine-readable fabrication is still fabrication.
- **Keyword-stuffed copy.** Copy is written for the reader. See [`copy.md`](copy.md).
- **`og:image` pointing at a file that was never generated.**
