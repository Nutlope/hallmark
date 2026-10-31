## 02 · Long Document

Reads like a memo, a letter or a journal entry. No marketing structure. Continuous prose with inline section heads. The page is literature about the product.

- **Heading:** inline with the body; section heads emerge from the paragraph flow as short bold phrases.
- **Body:** single column, line-height 1.65 or more, measure 60 to 65ch.
- **Divider:** negative space; the gap is the divider; at most one centred ornament for emphasis.
- **Button:** a typographic link inside a paragraph, carrying a verb, never a separate block. It is the fold's one visible action (44b).
- **Image:** inline, sized to the measure; never full-bleed.
- **Reveal:** none. The page is simply there.

Reach for it for case studies, founder posts, mission pages, products whose sale is philosophical. The prompt says "tell a story", not "list features".

Avoid when there is one decisive action to take. Long Document hides its actions inside sentences, which is wrong for a transactional page.

Heading: the inline lead-in of [`../craft.md`](../craft.md) § 7, item 3.

```html
<article class="prose">
  <p class="lede">…</p>
  <h2 class="inline">A small heading.</h2>
  <p>… <a href="#prices">See the prices</a> …</p>
</article>
```

```css
.prose { max-width: 65ch; }
.prose h2.inline { display: inline; font: inherit; font-weight: 700; letter-spacing: normal; }
.prose h2.inline + p { display: inline; }
```

**Sample opening lines** (imitate the specificity, not the wording):
> *"Saturday, 6:14 a.m. The dough went in at midnight."* Opens on a time-stamp; the brand introduces itself as a moment in the day (Maple Street Bread).
> *"A monthly publication for people who still read to the end."* Names the cadence and the reader.
> *"We build one thing, and we have built it for nine years."* A verb, a count, no claim.
