### Recipe 3 · Three-tier architectural diagram

Browser → API → Database, drawn at ~16/9 with three labelled boxes and animated `stroke-dasharray` flow lines using `@property --flow-offset`. The data-flow lines pulse to suggest live traffic. Use case: a developer-tool landing page showing where the product fits in the stack.

```html
<svg class="arch" viewBox="0 0 320 180" role="img" aria-label="Three-tier architecture: browser, API, database">
  <g class="arch__tier">
    <rect x="14"  y="50" width="76" height="80" />
    <text x="52"  y="86" text-anchor="middle" class="arch__name">Browser</text>
    <text x="52"  y="104" text-anchor="middle" class="arch__sub">React / Next</text>
  </g>

  <line class="arch__flow" x1="90"  y1="90" x2="120" y2="90" />
  <text class="arch__hop"  x="105"  y="80" text-anchor="middle">HTTPS · OTLP</text>

  <g class="arch__tier arch__tier--mid">
    <rect x="120" y="50" width="80" height="80" />
    <text x="160" y="86" text-anchor="middle" class="arch__name">API</text>
    <text x="160" y="104" text-anchor="middle" class="arch__sub">Edge runtime</text>
  </g>

  <line class="arch__flow arch__flow--reverse" x1="200" y1="90" x2="230" y2="90" />
  <text class="arch__hop"  x="215"  y="80" text-anchor="middle">SQL · gRPC</text>

  <g class="arch__tier">
    <rect x="230" y="50" width="76" height="80" />
    <text x="268" y="86" text-anchor="middle" class="arch__name">Database</text>
    <text x="268" y="104" text-anchor="middle" class="arch__sub">Postgres + vec</text>
  </g>
</svg>
```

```css
@property --flow-offset {
  syntax: "<number>";
  initial-value: 0;
  inherits: false;
}

.arch { width: 100%; max-width: 48rem; height: auto; color: var(--color-ink); display: block; margin: 0 auto; }

.arch__tier rect {
  fill: var(--color-paper-2);
  stroke: var(--color-ink);
  stroke-width: 1.5;
}
.arch__tier--mid rect {
  fill: color-mix(in oklch, var(--color-paper-2) 100%, var(--color-accent) 8%);
  stroke: color-mix(in oklch, var(--color-accent) 60%, var(--color-ink));
}

.arch__name { font-family: var(--font-display); font-size: 11px; font-weight: 500; fill: var(--color-ink); }
.arch__sub  { font-family: var(--font-mono);    font-size: 8px;  fill: var(--color-muted); }
.arch__hop  { font-family: var(--font-mono);    font-size: 7px;  fill: var(--color-muted); letter-spacing: 0.04em; }

.arch__flow {
  stroke: var(--color-accent);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-dasharray: 4 4;
  animation: arch-flow 1.6s linear infinite;
}
.arch__flow--reverse { animation-direction: reverse; }
@keyframes arch-flow { to { stroke-dashoffset: -8; } }

@media (prefers-reduced-motion: reduce) {
  .arch__flow { animation: none; stroke-dasharray: 0; }
}
```

**Use when** the brief is a developer-facing product that needs to show its position in a stack — observability tools, edge functions, ORMs, ingestion services. **Avoid when** the architecture has more than five tiers or non-linear topology (this recipe is for the "three-box flow" model only; for graph-like topologies, use a real diagram tool and embed an SVG export).

*Inspiration:* Vercel's network/edge diagrams; Diana Smith's structural precision in placing geometry.
