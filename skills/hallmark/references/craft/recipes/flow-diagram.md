### Recipe 1 · Workflow / process diagram

Three labelled boxes connected by curved arrows. Slight asymmetric rotation (-1° on box one, +0.5° on box three) for hand-drawn feel. One arrow has an animated `stroke-dashoffset` flow suggesting data movement. Use case: feature page showing data flow, decision tree, or user journey steps.

```html
<svg class="flow" viewBox="0 0 720 200" role="img" aria-label="Data flow: input, process, output">
  <defs>
    <marker id="flow-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L8,3 L0,6" fill="currentColor" />
    </marker>
  </defs>

  <g class="flow__step flow__step--a">
    <rect class="flow__box" x="20"  y="55" width="160" height="90" rx="0" />
    <text class="flow__label" x="100" y="105" text-anchor="middle">Input</text>
  </g>

  <path class="flow__arrow flow__arrow--live" d="M 180 100 Q 220 80 260 100" marker-end="url(#flow-arrow)" />

  <g class="flow__step">
    <rect class="flow__box" x="260" y="55" width="200" height="90" rx="0" />
    <text class="flow__label" x="360" y="100" text-anchor="middle">Parse + Filter</text>
    <text class="flow__sub"   x="360" y="118" text-anchor="middle">small predicate language</text>
  </g>

  <path class="flow__arrow" d="M 460 100 Q 500 120 540 100" marker-end="url(#flow-arrow)" />

  <g class="flow__step flow__step--c">
    <rect class="flow__box" x="540" y="55" width="160" height="90" rx="0" />
    <text class="flow__label" x="620" y="105" text-anchor="middle">Output</text>
  </g>
</svg>
```

```css
@property --flow-dash {
  syntax: "<length>";
  initial-value: 0px;
  inherits: false;
}

.flow { width: 100%; max-width: 48rem; height: auto; display: block; margin: 0 auto; color: var(--color-ink); }
.flow__box   { fill: none; stroke: currentColor; stroke-width: 1.5; }
.flow__label { font-family: var(--font-display); font-size: 16px; fill: var(--color-ink); }
.flow__sub   { font-family: var(--font-mono); font-size: 11px; fill: var(--color-muted); }
.flow__step--a { transform: rotate(-1deg); transform-origin: 100px 100px; }
.flow__step--c { transform: rotate(0.5deg); transform-origin: 620px 100px; }
.flow__arrow { fill: none; stroke: var(--color-muted); stroke-width: 1.5; stroke-linecap: round; }
.flow__arrow--live {
  stroke: var(--color-accent);
  stroke-dasharray: 6 6;
  animation: flow 2.4s linear infinite;
}
@keyframes flow { to { stroke-dashoffset: -24; } }

@media (prefers-reduced-motion: reduce) {
  .flow__arrow--live { animation: none; stroke-dasharray: 0; }
}
```

**Use when** the brief is "show the user how data flows" — feature page, docs landing, technical-narrative section. **Avoid when** the diagram has more than five nodes (use Mermaid or a real graph layout) or when relationships are non-linear (this recipe assumes left-to-right flow).

*Inspiration:* Lynn Fisher's `lynnandtonic.com` `<rect>`-rotation experiments; Rauno Freiberg's `stroke-dashoffset` flows on rauno.me.
