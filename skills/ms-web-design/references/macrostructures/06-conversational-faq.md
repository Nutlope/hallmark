## 06 · Conversational FAQ

Bold questions, prompt answers. The page reads like an honest interview with the product. Each pair may be a disclosure.

- **Heading:** each section is a question: a short direct phrase ending in `?`.
- **Body:** the answer in one or two short paragraphs directly under the question.
- **Divider:** a hairline between pairs, or no rule and a change of paper.
- **Button:** a typographic link inside an answer, carrying a verb ("Read the policy"); one outlined CTA at the foot.
- **Image:** sparse; at most one diagram per long answer.
- **Reveal:** none on load; a disclosure opens over `--dur-long` with `--ease-out` on `grid-template-rows` from `0fr` to `1fr`.

Reach for it near pricing, for products that meet scepticism, for regulated or educational fields.

As the primary page it opens with a hero that asks the first question; otherwise it pairs with another shape that opens the page.

```html
<section class="faq">
  <details>
    <summary><h2>How long does setup take?</h2></summary>
    <div class="answer"><p>…</p></div>
  </details>
</section>
```

**Sample opening lines** (questions are real questions; answers are short and concrete):
> *"What is this for? A single-binary CLI for parsing log streams from stdin."* Names the form factor and the input (Streampipe).
> *"How is it different? It runs where the logs are, so nothing leaves the box."* Answers with a fact, not a comparison.
> *"Who built this? Three of us, in Lisbon, since 2014."* Date, place and count; no marketing.
