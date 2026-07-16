# Hallmark

**A design skill for Claude Code, Cursor, and Codex that refuses to look AI-generated.**

[Live demo →](https://www.usehallmark.com) &nbsp;·&nbsp; twenty themes &nbsp;·&nbsp; four verbs &nbsp;·&nbsp; press `T` to cycle.

Made by Together AI.

<p align="center">
  <img src="site/OG-hallmark.png" alt="Hallmark, a design skill that refuses to look AI-generated" />
</p>

Hallmark picks a macrostructure for the brief, dresses it in one of twenty themes, runs fifty-seven slop-test gates plus a pre-emit self-critique, and refuses the on-distribution defaults every LLM was trained into. Two pages by Hallmark for two different briefs feel like different sites, not colour-swaps of the same template.

---

## Four verbs

| Verb | What it does |
| --- | --- |
| *(default)* | Build new UI. Picks a macrostructure, applies the rule-set, runs the slop test before handing back. |
| `hallmark audit <target>` | Score existing code against the anti-patterns. Punch list, no edits. |
| `hallmark redesign <target>` | Throw out the structure, keep copy + IA + brand, rebuild with a different fingerprint. |
| `hallmark study <screenshot \| URL>` | Extract the **DNA** from a design you admire: macrostructure, type-pairing, colour anchor. Refuses pixel-clones and paid templates. Optionally emits a portable `design.md` for handoff to other AI tools. |

---

## Different briefs, different shapes

Each generated from a different brief. The skill picks the theme, structure, and craft to fit each one, not from a template.

<table>
  <tr>
    <td width="25%"><a href="https://www.usehallmark.com/examples/hum-07/"><img src="docs/screenshots/hero-hum-07.jpg" alt="Bubble guided sourdough app hero" /></a></td>
    <td width="25%"><a href="https://www.usehallmark.com/examples/cobalt-01/"><img src="docs/screenshots/hero-cobalt-01.jpg" alt="Distil content-extraction API hero" /></a></td>
    <td width="25%"><a href="https://www.usehallmark.com/examples/carnival-01/"><img src="docs/screenshots/hero-carnival-01.jpg" alt="Cold Snap record-label EP hero" /></a></td>
    <td width="25%"><a href="https://www.usehallmark.com/examples/lumen-01/"><img src="docs/screenshots/hero-lumen-01.jpg" alt="Cinder AI reasoning tool hero" /></a></td>
  </tr>
  <tr>
    <td><b>Bubble</b><br/><sub>Sourdough app · Hum</sub></td>
    <td><b>Distil</b><br/><sub>Extraction API · Cobalt</sub></td>
    <td><b>Cold Snap</b><br/><sub>Record label · Carnival</sub></td>
    <td><b>Cinder</b><br/><sub>AI tool · Lumen</sub></td>
  </tr>
  <tr>
    <td><a href="https://www.usehallmark.com/examples/custom-03/"><img src="docs/screenshots/hero-custom-03.jpg" alt="Ferns and Fathom tea menu hero" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/garden-01/"><img src="docs/screenshots/hero-garden-01.jpg" alt="Hollowback Apiary honey farm hero" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/riso-01/"><img src="docs/screenshots/hero-riso-01.jpg" alt="Off-Register risograph print fair hero" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/press-01/"><img src="docs/screenshots/hero-press-01.jpg" alt="Press Quaternary type studio hero" /></a></td>
  </tr>
  <tr>
    <td><b>Ferns &amp; Fathom</b><br/><sub>Tea menu · Custom</sub></td>
    <td><b>Hollowback Apiary</b><br/><sub>Honey farm · Garden</sub></td>
    <td><b>Off-Register</b><br/><sub>Print fair · Riso</sub></td>
    <td><b>Press Quaternary</b><br/><sub>Type studio · Custom</sub></td>
  </tr>
  <tr>
    <td><a href="https://www.usehallmark.com/examples/tally/"><img src="docs/screenshots/hero-tally.jpg" alt="Tally SaaS product page hero" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/wayfare/"><img src="docs/screenshots/hero-wayfare.jpg" alt="Wayfare travel booking hero" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/najm/"><img src="docs/screenshots/hero-najm.jpg" alt="NAJM Moroccan fashion brand hero" /></a></td>
    <td><a href="https://www.usehallmark.com/examples/hyperlane/"><img src="docs/screenshots/hero-hyperlane.jpg" alt="Hyperlane developer infrastructure hero" /></a></td>
  </tr>
  <tr>
    <td><b>Tally</b><br/><sub>SaaS · modern-minimal</sub></td>
    <td><b>Wayfare</b><br/><sub>Travel · atmospheric</sub></td>
    <td><b>NAJM</b><br/><sub>Fashion brand</sub></td>
    <td><b>Hyperlane</b><br/><sub>Dev infrastructure</sub></td>
  </tr>
</table>

Each page is self-contained HTML + CSS, stamped with its macrostructure in the CSS comment. Browse the full set at [usehallmark.com](https://www.usehallmark.com) or under [`site/_tests/`](site/_tests/).

---

## Custom <sup>NEW</sup>

When a brief carries creative intent that no catalog theme fits, Hallmark switches to **Custom** and designs the page from scratch: a made-to-measure palette, type, and layout. Same 57 slop-test gates, no template underneath.

<table>
  <tr>
    <td width="50%"><a href="https://www.usehallmark.com/examples/custom-02/"><img src="docs/screenshots/hero-custom-02.jpg" alt="The Cascadia Nightjar sleeper-train ticket hero" /></a></td>
    <td width="50%"><a href="https://www.usehallmark.com/examples/custom-04/"><img src="docs/screenshots/hero-custom-04.jpg" alt="The Mend Assembly repair-café broadsheet hero" /></a></td>
  </tr>
  <tr>
    <td><b>The Cascadia Nightjar</b><br/><sub>Sleeper-train ticket · Custom</sub></td>
    <td><b>The Mend Assembly</b><br/><sub>Repair-café broadsheet · Custom</sub></td>
  </tr>
</table>

It stays a quiet branch; vanilla briefs never see it. The protocol lives in [`custom-theme.md`](skills/hallmark/references/custom-theme.md).

---

## Install

```
npx skills add nutlope/hallmark
```

Re-run any time to update. Or copy [`SKILL.md`](skills/hallmark/SKILL.md) + [`references/`](skills/hallmark/references/) into:

- **Claude Code**: `~/.claude/skills/hallmark/`
- **Cursor**: `.cursor/rules/hallmark.mdc` (body of `SKILL.md`, no frontmatter)
- **Codex**: `~/.codex/skills/hallmark/` (personal) or `.codex/skills/hallmark/` (project-scoped)

The rule-set lives in [`SKILL.md`](skills/hallmark/SKILL.md) and [`references/`](skills/hallmark/references/). Worked examples in [`docs/recipes.md`](docs/recipes.md) and [`docs/study-examples.md`](docs/study-examples.md).

---

## Licence

MIT. Use it, fork it, ship it.
