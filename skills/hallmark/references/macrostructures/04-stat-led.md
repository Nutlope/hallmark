## 04 · Stat-Led

The hero is a giant number — a metric, a count, a percentage. Everything that follows supports or qualifies it. Data is the narrative.

- **Heading:** a large numeric display (8–12 rem, tabular figures) **paired with a worded headline** — the figure is the biggest element, but it is *never the hero's only words*. State what the number means right beside or beneath it as a real headline, not a tiny label. Read the figure and its words together (*"4 seconds. From the alert link to the slow span."*).
- **Body:** sections each anchored by a supporting stat or chart.
- **Divider:** hairline rules between stat blocks; tabular-nums everywhere.
- **Button:** outlined chip aligned beneath the qualifier.
- **Image:** charts and small data-viz per [`data-viz.md`](../data-viz.md) (form heuristic + mark specs); no photography.
- **Reveal:** number-tick on the hero figure — counter from 0 to target over ~500 ms.

Reach for it when the brief is "we have proof in numbers" — enterprise/B2B, fundraising platforms, climate or impact pages.

Avoid for products without a defensible single metric. A fake big number is worse than no number.

**The hero header always contains words.** The lead figure never stands alone as the headline — pair it with a worded line that completes it. A bare number as the dominant hero text fails slop-test gate 46.

Reference: Ahrefs, Stripe Sessions stat blocks, climate-impact dashboards, venture firm portfolio pages.

**Sample opening lines** (imitate the *specificity*, not the wording — the number does the work):
> *"+47% · faster · decide late."* — italicised number, three-word qualifier
> *"4 seconds. From the alert link to the slow span."* — pairs the number with what it bought
> *"434 total posts. New CSS you feel like you could use today."* — adam argyle, nerdy.dev — the count grounds the page in real volume

```html
<section class="stat-hero">
  <div class="figure tnum">99.97<span class="unit">%</span></div>
  <p class="qualifier">uptime across 2026, measured externally.</p>
  <a class="cta-outline">Read the report →</a>
</section>
<section class="supporting-stats">…</section>
```

---
