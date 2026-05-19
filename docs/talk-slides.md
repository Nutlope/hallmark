# Stop letting your agents ship ugly UIs.

How to build well-designed UIs with AI agents.

Hassan El Mghari · Together AI · AI Engineer World's Fair · 2026

---

> **About this deck** — this is a general playbook for any AI engineer, not a product pitch. Hallmark is mentioned once, on slide 15, as one open-source example our team built. The seven fixes apply to v0, Lovable, Bolt, Cursor, Claude Code, or any agent you're building yourself.
>
> **Visual style** — dark slate `#0b1117`, off-white ink `#e6edf3`, GitHub-cool-blue accent `#58a6ff`. Inter for type, Roboto Mono for code. Every slide chrome-free: no eyebrow labels, no decorative hairlines. Footer is the Together AI logo bottom-left and a page number bottom-right.
>
> **Cadence** — 17 slides, 18 minutes. ~60 seconds per slide. Section opener (S05) is a 10-second beat. S08 (wireframes), S11 (eight states), S13 (system prompt) want a moment.

---

## 01 · Cover

# Stop letting your agents ship ugly UIs.

*How to build well-designed UIs with AI agents.*

— Hassan El Mghari · Together AI · AI Engineer World's Fair · 2026

*Speaker: I'm Hassan, I lead DX at Together AI. Most of you have built an AI app this year and watched it ship a UI you'd never put on your portfolio. This talk is about why that happens, and seven concrete things that fix it — for any agent you use.*

---

## 02 · The problem

# Here's what your agent ships today.

*(Visual: the real DevForge screenshot — a generated developer-conference landing page. Purple-cyan gradient on the headline, centered hero, four-column stat row, Inter on Inter.)*

> Vanilla prompt. Same shape every time.

*Speaker: I gave the same prompt to a dozen agents — "build me a landing page for a developer conference, dark theme, in Brooklyn." This is roughly what every one of them returned. Different models, different stacks, same page.*

---

## 03 · The promise

# It could ship this instead.

*(Visual: the Hyperlane screenshot — same brief, rebuilt. Big sans-serif headline with an italic-serif accent, asymmetric layout, single warm accent, monospace meta.)*

> Same brief. One missing layer added.

*Speaker: Same brief. Same agent. The difference is the layer between the prompt and the output. We'll spend the rest of the talk on that layer.*

---

## 04 · Why

# Models ship the mean of their training set.

*Every SaaS site since 2019 trained on the same shape. Without external steering, the agent regresses to it.*

> Every part of this is fixable with prompting and a small amount of structure.

*Speaker: This isn't a model failure. Claude can render anything you describe. It's that "make me a landing page" maps to a region of the manifold where every SaaS site since 2019 lives. The good news: every fix from here is something you can do today, with any agent.*

---

## 05 · Section opener

# Seven things that fix it.

*Tool-agnostic. Works with v0, Lovable, Bolt, Cursor, Claude Code, or your own agent.*

*Speaker: Each one of these closes a class of slop. Each one works today.*

---

## 06 · Fix 01 — Use a real component library

# Use a real component library.

shadcn/ui is the lingua franca of generated UI.
Every major AI tool is trained on it. Linear, Vercel and Stripe ship it.
Adopt it and your agent's output gets 80% better on day one.

```bash
$  npx shadcn@latest add button card dialog input table
```

→ *drop the components in. Now every AI generation composes from a real system, not from invented primitives.*

*Speaker: This is the cheapest, highest-leverage move. Most AI engineers know about shadcn/ui. Fewer actually adopt it. v0 ships it natively. Cursor reads it. Claude Code reads it. The model has seen millions of examples of these components — it knows how to compose them.*

---

## 07 · Fix 02 — Pin a design system

# Pin a design system.

A single file at the root the agent reads on every render.
One palette, one type pairing, one scale. No mid-render improvisation.

```css
/* DESIGN.md  or  app/globals.css  —  Tailwind v4  @theme block */

@theme {
   --color-paper:    oklch(0.13 0.01 250);   /* one surface, not five */
   --color-ink:      oklch(0.93 0.01 250);   /* one ink */
   --color-accent:   oklch(0.65 0.18 250);   /* one accent, under 5% */
   --font-display:   "Inter Tight", sans-serif;
   --font-body:      "Inter", sans-serif;
   --space-1:        0.25rem;                /* 4-pt scale */
   --ease-out:       cubic-bezier(.2,0,0,1);
}
```

*Speaker: Tailwind v4 made this easier than it used to be. One `@theme` block, OKLCH for color, semantic names. Drop a `DESIGN.md` next to it that describes the brand in plain English — what the brand sounds like, what it isn't. The agent reads both on every run.*

---

## 08 · Fix 03 — Ask for a shape

# Ask for a shape, not a list of features.

*Stop saying "hero with three features." Say marquee. bento. long-document. stat-led.*

*(Visual: four abstract wireframes drawn in Figma showing each shape.)*

- **MARQUEE** · one editorial idea, biased left
- **LONG DOCUMENT** · reads like a letter, no marketing chrome
- **BENTO** · many entries, irregular grid
- **STAT-LED** · product is the headline; numbers carry it

*Speaker: This is the move that breaks the "every page looks like a SaaS landing" attractor. Don't enumerate features. Pick a category of page. The same way Linear's home and Stripe's home don't share a shape — they share a category.*

---

## 09 · Fix 04 — Show a reference

# Paste a screenshot. Don't describe it.

AI sees more than it reads.
A reference image carries more taste than a paragraph of adjectives.

```
→  pick a real site you admire.
→  ask the agent to extract the structure, not copy the pixels.
→  name the role of the type ("italic editorial serif"), not the font.
```

*(Visual right: a real screenshot of calendly.com — the reference you'd actually paste.)*

> example · pasted calendly.com to the agent

*Speaker: Designers have always done this — "make it feel like this." Until recently your agent had no equivalent. Now it does. Don't describe taste. Show it. And ask the model to extract structure, not pixels — what you want is the rhythm, not a knock-off.*

---

## 10 · Fix 05 — Ban the tells

# Tell it what you DON'T want.

*Constraints beat instructions. Put these in your system prompt:*

- ✕  Purple → blue gradient hero
- ✕  Inter / Roboto as display AND body
- ✕  Three equal columns with icon-above-heading
- ✕  `min-height: 100vh`, everything centered
- ✕  Cards inside cards (no semantic reason)
- ✕  `background-clip` text gradients on headlines
- ✕  Pure `#000` or pure `#fff` as a surface
- ✕  Invented metrics, testimonials, or logos

*Speaker: Counterintuitive but true: telling the model what NOT to do is stronger than describing what you want. These eight tells are the fingerprints of AI-generated UI. Ban them and the model has to reach somewhere else.*

---

## 11 · Fix 06 — Eight states

# Every interactive element ships eight states.

*If the agent emits two, your UI ships broken.*

*(Visual: eight actual buttons in a 4-by-2 grid, each visibly in a different state — default, hover, focus-visible, active, disabled, loading, error, success.)*

| state | what makes it different |
| --- | --- |
| `default` | the resting style |
| `hover` | one shade lighter |
| `:focus-visible` | a 2px accent ring, instant (no fade-in) |
| `:active` | inverted ink, accent fill |
| `disabled` | 50% opacity, no pointer |
| `loading` | `· · · working` |
| `error` | red border, ⚠ retry |
| `success` | green border, ✓ saved |

*Speaker: This is the single fastest "real or vibes" test you can run on AI output. Tab into the page. Disable a field. Make something load. If three of the eight states are unstyled, the agent shipped a screenshot, not a component.*

---

## 12 · Fix 07 — Critique before emit

# Make the agent grade its own work — first.

*One line in the system prompt forces a critical pass before output. Two passes is normal.*

- **DISTINCTIVENESS** · does this look like THIS brief — or any brief
- **HIERARCHY** · can a reader tell first / second / third in 2 seconds
- **EXECUTION** · are the details right (rules, spacing, focus rings)
- **RESTRAINT** · cut what doesn't earn its place

Score each 1–5. Anything below 3 → revision pass.

*Speaker: The trick isn't the rubric — it's forcing the model to look at its own output critically before it returns. Two passes is normal. Three passes means the brief is too vague.*

---

## 13 · The whole playbook

# You can fit the whole playbook in one paragraph.

```md
# system_prompt.md

You are a designer, not a templater. Before you write code:

  1. use shadcn/ui — never re-invent a primitive that already exists.
  2. read  DESIGN.md  for tokens. Use only those.
  3. pick ONE page shape (marquee, long-document, bento, stat-led, manifesto, catalogue).
  4. ban: purple-cyan gradients, Inter on Inter, 3-col icon grids, 100vh centered hero,
     card-in-card, background-clip text, pure #000 / #fff, invented metrics.
  5. ship 8 states for every interactive element.
  6. score  Distinctiveness · Hierarchy · Execution · Restraint  on 1–5.
     anything <3 triggers a revision pass.
```

*Speaker: That's it. Seven lines. Drop this in any agent's system prompt — Cursor `.mdc`, Claude Code skill, v0 project instructions. Feel the difference on the next render.*

---

## 14 · Tools

# Pick your weapon.

*Same seven fixes. Different surfaces.*

| | | |
| --- | --- | --- |
| **v0** | shadcn / Tailwind playground | best UI quality out of the box |
| **Lovable** | full-stack chat-and-build | edit visually, ship live |
| **Bolt** | fast prototyping in StackBlitz | speed |
| **Cursor** | in-IDE assistant | lives in your editor |
| **Claude Code** | agent loop · file-aware · skills | longest-context coder |

*Speaker: All of these can do beautiful work if you put the seven fixes in. Pick the one that matches your stack.*

---

## 15 · Hallmark — one example our team open-sourced

# Hallmark.

*One example our team open-sourced.*

A Claude Code skill that bakes all seven fixes in.

→ `github.com/nutlope/hallmark`

*(Visual: the Hallmark OG image — "The best landing pages built with AI" with three real example pages baked in.)*

*Speaker: We packaged the seven fixes into a Claude Code skill for ourselves at Together AI, then open-sourced it. It's one approach — there are others (Anthropic's frontend-design skill, Taste, Impeccable, others). The principle is the same: stop letting the agent invent the rules. Hand it a system.*

---

## 16 · The big idea

# Design taste is a layer in the agent stack.

```
MODELS
TOOLS
MEMORY
RAG
EVALS
TASTE   ← here
ORCHESTRATION
```

*If you don't put it in the stack, the model picks the mean.*

*Speaker: We treat eval as a first-class layer because we know models will optimize for the wrong thing without it. Taste is the same — not a polish step you add at the end. A layer. Same stack you already build with. New row.*

---

## 17 · Thanks

# Thanks.

```
github.com/nutlope/hallmark
together.ai
```

`@nutlope`   `@YoussefXLM`

*(Visual right: a real QR code linking to the Hallmark repo.)*

> scan to install

*Speaker: Thanks. The skill is open today. I'd love to see what you build with it — and what fixes you'd add to your own agent's stack.*

---

# Designer / production notes

**Chrome — kept minimal on purpose**

- No eyebrow labels at the top of slides.
- No decorative hairlines, dividers, or accent rules.
- Footer is two elements only: the Together AI logo bottom-left (32×32), and the slide number bottom-right.
- Functional rectangles (code-block surfaces, button shapes on S11, axis cards on S12) are kept — they carry content.

**Palette — locked**

- BG `#0b1117` (deep slate)
- Surface `#161b22` (code blocks, cards)
- Ink primary `#e6edf3`
- Ink secondary `#7d8590`
- Accent `#58a6ff` (GitHub cool blue — links, key labels, accent fills)
- Alert `#f85149` (only on Fix 05 ban list and Fix 06 error button)
- Success `#3fb950` (only on Fix 06 success button)

**Type**

- Display: Inter (Black / Bold weights at huge sizes)
- Body: Inter Regular / Light
- Code & mono labels: Roboto Mono

**Pacing**

17 slides for an 18-minute slot ≈ 60 seconds per slide. The section opener (S05) is a 10-second beat. The system-prompt slide (S13) wants a moment for Hassan to read it out loud. The Hallmark slide (S15) is intentionally quiet — read the label, don't dwell.

**If running long**

In order: S04 (Why — can fold into S02 narration), S16 (the stack diagram — can be one sentence after S15). Never drop S05, S08, S09, S11.

**If running short**

Add a live demo after S09. Paste a screenshot of a designed site, run the agent, show the output. 90 seconds max.

**The markdown deliverable**

This file (`docs/talk-slides.md`) is the canonical copy. If the Figma file gets reorganized, this stays authoritative.

---

# Sources

- ["shadcn/ui March 2026 Update: CLI v4, AI Agent Skills and Design System Presets"](https://medium.com/@nakranirakesh/shadcn-ui-march-2026-update-cli-v4-ai-agent-skills-and-design-system-presets-d30cf200b0e9)
- ["AI-First UIs: Why shadcn/ui's Model is Leading the Pack" — Refine](https://refine.dev/blog/shadcn-blog/)
- ["Design Systems for the Vibe-Coding Era" — Anna Arteeva, Design Systems Collective](https://www.designsystemscollective.com/design-systems-for-the-vibe-coding-era-42282e1affef)
- [Anthropic — "Improving frontend design through Skills"](https://claude.com/blog/improving-frontend-design-through-skills)
- ["v0 by Vercel — Complete Guide 2026"](https://www.nxcode.io/resources/news/v0-by-vercel-complete-guide-2026)
- ["The Vibe-Coder's Prompting Guide" — Anna Arteeva, Medium](https://annaarteeva.medium.com/the-vibe-coders-prompting-guide-e04ba0295a18)
- ["Choosing your AI prototyping stack: Lovable, v0, Bolt, Replit, Cursor, Magic Patterns" — Anna Arteeva, Medium](https://annaarteeva.medium.com/choosing-your-ai-prototyping-stack-lovable-v0-bolt-replit-cursor-magic-patterns-compared-9a5194f163e9)
- [AI Engineer World's Fair 2026 — Jun 29 – Jul 2](https://www.ai.engineer/worldsfair)
- [Hassan El Mghari · DX at Together AI](https://www.nutlope.com/)
