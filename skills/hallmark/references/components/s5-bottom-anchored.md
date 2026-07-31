### S5 · Bottom-anchored
The label or heading sits *below* the section's content. Inverts hierarchy.
*Use when:* the content is the primary act and the label is a footer to it.
*Don't confuse with:* S1 Left-margin (which leads with the label).

```html
<section>
  <div class="content">…</div>
  <p class="num-label">— end of 02</p>
</section>
```

---

## Knobs

Vary at least one knob vs the last logged use of this archetype (gate 32):

- Label form: `— end of 02` · rule + label · label only
- Alignment: left · right-flush

## Mobile collapse

- **Below 60rem:** unchanged; long labels wrap
- **Below 40rem:** label font-size steps down
