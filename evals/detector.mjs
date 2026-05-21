// Hallmark slop detector — deterministic anti-slop checks for self-contained HTML.
//
// Grounds the eval in two external standards:
//   1. Impeccable's "37 patterns that mark an interface as AI-generated"
//      across 8 dimensions (impeccable.style/slop).
//   2. Hallmark's own slop-test gates (references/slop-test.md).
//
// Only the deterministic (CLI-checkable) subset lives here. Taste dimensions
// (philosophy, hierarchy, specificity, restraint, variety, honesty) are scored
// by an LLM judge and merged by run.mjs.
//
// Usage: node detector.mjs <file.html> [--json]

import fs from 'node:fs';

const FONT_OVERUSED = [
  'inter', 'roboto', 'open sans', 'poppins', 'lato', 'montserrat',
  'plus jakarta sans', 'space grotesk', 'geist', 'nunito', 'raleway',
];
const GENERIC_FAMILIES = new Set([
  'sans-serif', 'serif', 'monospace', 'system-ui', 'ui-monospace',
  'ui-serif', 'ui-sans-serif', 'cursive', 'fantasy', 'emoji', 'math',
  '-apple-system', 'blinkmacsystemfont', 'segoe ui', 'inherit', 'initial',
]);

// ---------------------------------------------------------------- doc loading
function loadDoc(path) {
  const html = fs.readFileSync(path, 'utf8');
  const styleCss = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map((m) => m[1]).join('\n');
  const inlineCss = [...html.matchAll(/\sstyle="([^"]*)"/gi)]
    .map((m) => `__inline__{${m[1]}}`).join('\n');
  const css = `${styleCss}\n${inlineCss}`;
  const stamp = (css.match(/\/\*\s*Hallmark[\s\S]*?\*\//) || [''])[0];
  const genre =
    (stamp.match(/genre:\s*([a-z-]+)/i) || [])[1] ||
    (html.match(/data-genre="([^"]+)"/) || [])[1] || '';
  return { path, html, css, styleCss, stamp, genre };
}

// crude flat-rule splitter; @media wrappers drop out but inner rules survive.
function cssRules(css) {
  const out = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    out.push({ sel: m[1].trim().toLowerCase(), body: m[2].trim() });
  }
  return out;
}

function tokenMap(css) {
  const map = {};
  for (const r of cssRules(css)) {
    if (!/:root|\[data-theme/.test(r.sel)) continue;
    for (const m of r.body.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+)/gi)) {
      map[m[1].trim()] = m[2].trim();
    }
  }
  return map;
}

function resolveVar(value, map, depth = 0) {
  if (depth > 8 || !value) return value;
  return value.replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,([^)]*))?\)/gi, (_, name, fb) => {
    const v = map[name.trim()];
    if (v != null) return resolveVar(v, map, depth + 1);
    return fb != null ? resolveVar(fb.trim(), map, depth + 1) : '';
  });
}

// oklch lightness 0..1 (handles "oklch(.3 ...)" and "oklch(32% ...)")
function oklchL(value) {
  const m = String(value).match(/oklch\(\s*([0-9.]+%?)/i);
  if (!m) return null;
  const raw = m[1];
  return raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw);
}
function oklchC(value) {
  const m = String(value).match(/oklch\(\s*[0-9.]+%?\s+([0-9.]+)/i);
  return m ? parseFloat(m[1]) : null;
}
function oklchH(value) {
  const m = String(value).match(/oklch\(\s*[0-9.]+%?\s+[0-9.]+\s+([0-9.]+)/i);
  return m ? parseFloat(m[1]) : null;
}

const COLOR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\brgba?\([^)]*\)|\bhsla?\([^)]*\)|\boklch\([^)]*\)|\blab\([^)]*\)/gi;

function fontFamilies(css, map) {
  const fams = new Set();
  for (const m of css.matchAll(/font-family\s*:\s*([^;}]+)/gi)) {
    const resolved = resolveVar(m[1], map);
    const first = resolved.split(',')[0].trim().replace(/['"]/g, '').toLowerCase();
    if (first && !GENERIC_FAMILIES.has(first) && !first.startsWith('var(')) fams.add(first);
  }
  for (const [k, v] of Object.entries(map)) {
    if (!/--font/.test(k)) continue;
    const first = String(v).split(',')[0].trim().replace(/['"]/g, '').toLowerCase();
    if (first && !GENERIC_FAMILIES.has(first) && !first.startsWith('var(')) fams.add(first);
  }
  return [...fams];
}

function headingLevels(html) {
  return [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => +m[1]);
}

// Balanced extraction of @media (...max-width...) block bodies. Regex alone
// trips over nested rule braces and indented closers, so count braces.
function maxWidthMediaBodies(css) {
  const bodies = [];
  const re = /@media[^{]*max-width[^{]*\{/gi;
  let m;
  while ((m = re.exec(css))) {
    let depth = 1;
    let i = m.index + m[0].length;
    const start = i;
    for (; i < css.length && depth > 0; i++) {
      if (css[i] === '{') depth++;
      else if (css[i] === '}') depth--;
    }
    bodies.push(css.slice(start, i - 1));
  }
  return bodies;
}

// ---------------------------------------------------------------- rule set v1
// Each rule: { id, dim, label, fn(ctx) -> {pass:boolean, note:string} }
const RULES = [
  // ---- TYPOGRAPHY -------------------------------------------------------
  {
    id: 'type-overused-font', dim: 'typography',
    label: 'Display/body face is an overused AI default (Inter, Roboto, Geist…)',
    fn: ({ fams }) => {
      const hit = fams.filter((f) => FONT_OVERUSED.includes(f));
      return { pass: hit.length === 0, note: hit.length ? `uses ${hit.join(', ')}` : 'distinctive faces' };
    },
  },
  {
    id: 'type-single-font', dim: 'typography',
    label: 'Single font family across the whole page',
    fn: ({ fams }) => ({ pass: fams.length !== 1, note: `${fams.length} distinct families` }),
  },
  {
    id: 'type-too-many-fonts', dim: 'typography',
    label: 'More than three distinct font families (gate 39)',
    fn: ({ fams }) => ({ pass: fams.length <= 3, note: `${fams.length} families: ${fams.join(', ') || 'none'}` }),
  },
  {
    id: 'type-allcaps-body', dim: 'typography',
    label: 'All-caps applied to body/paragraph text',
    fn: ({ rules }) => {
      const bad = rules.find((r) => /(^|[\s,])(body|p|li|article)\b/.test(r.sel) && /text-transform\s*:\s*uppercase/.test(r.body));
      return { pass: !bad, note: bad ? `on ${bad.sel}` : 'body is mixed-case' };
    },
  },
  {
    id: 'type-tight-leading', dim: 'typography',
    label: 'Body line-height below 1.3',
    fn: ({ rules, map }) => {
      for (const r of rules) {
        if (!/(^|[\s,])(body|p|li|article|html)\b/.test(r.sel)) continue;
        const m = r.body.match(/line-height\s*:\s*([0-9.]+)\b/);
        if (m && parseFloat(m[1]) < 1.3 && parseFloat(m[1]) > 0) return { pass: false, note: `line-height ${m[1]} on ${r.sel}` };
      }
      return { pass: true, note: 'comfortable leading' };
    },
  },
  {
    id: 'type-wide-tracking-body', dim: 'typography',
    label: 'Letter-spacing above 0.05em on body text',
    fn: ({ rules }) => {
      for (const r of rules) {
        if (!/(^|[\s,])(body|p|li)\b/.test(r.sel)) continue;
        const m = r.body.match(/letter-spacing\s*:\s*([0-9.]+)em/);
        if (m && parseFloat(m[1]) > 0.05) return { pass: false, note: `${m[1]}em on ${r.sel}` };
      }
      return { pass: true, note: 'tracking in range' };
    },
  },
  {
    id: 'type-tiny-body', dim: 'typography',
    label: 'Body text below 12px',
    fn: ({ rules }) => {
      for (const r of rules) {
        if (!/(^|[\s,])(body|p|li)\b/.test(r.sel)) continue;
        const m = r.body.match(/font-size\s*:\s*([0-9.]+)px/);
        if (m && parseFloat(m[1]) < 12) return { pass: false, note: `${m[1]}px on ${r.sel}` };
      }
      return { pass: true, note: 'legible body size' };
    },
  },

  // ---- COLOR & CONTRAST -------------------------------------------------
  {
    id: 'color-gradient-text', dim: 'color',
    label: 'Gradient clipped to text (background-clip: text)',
    fn: ({ css }) => {
      const bad = /background-clip\s*:\s*text|-webkit-background-clip\s*:\s*text/i.test(css) && /gradient/i.test(css);
      return { pass: !bad, note: bad ? 'gradient text headline' : 'solid headline fill' };
    },
  },
  {
    id: 'color-ai-palette', dim: 'color',
    label: 'AI purple/violet→cyan gradient',
    fn: ({ css }) => {
      const grads = [...css.matchAll(/(linear|radial|conic)-gradient\([^;}]*\)/gi)].map((m) => m[0]);
      for (const g of grads) {
        const kw = /purple|violet|indigo|fuchsia|magenta|#8b5cf6|#6366f1|#7c3aed|#a855f7/i.test(g);
        const cyan = /cyan|teal|#06b6d4|#22d3ee/i.test(g);
        const hues = [...g.matchAll(/oklch\([^)]*\)/gi)].map((x) => oklchH(x[0])).filter((h) => h != null);
        const aiHue = hues.some((h) => h >= 270 && h <= 330);
        if ((kw && cyan) || kw || aiHue) return { pass: false, note: `tell in ${g.slice(0, 40)}…` };
      }
      return { pass: true, note: 'no AI-palette gradient' };
    },
  },
  {
    id: 'color-pure-black-bg', dim: 'color',
    label: 'Pure #000 / oklch(0) used as a base background',
    fn: ({ rules, map }) => {
      for (const r of rules) {
        const m = r.body.match(/background(?:-color)?\s*:\s*([^;]+)/i);
        if (!m) continue;
        const v = resolveVar(m[1], map).toLowerCase();
        if (/#000(\b|000\b)|\boklch\(\s*0\s+0\b|\brgb\(\s*0\s*,\s*0\s*,\s*0\s*\)|\bblack\b/.test(v)) return { pass: false, note: `pure black bg on ${r.sel}` };
      }
      return { pass: true, note: 'no pure-black base' };
    },
  },
  {
    id: 'color-zero-chroma', dim: 'color',
    label: 'Zero-chroma flat-grey neutrals (gate 24)',
    fn: ({ map, genre }) => {
      if (genre === 'modern-minimal') return { pass: true, note: 'modern-minimal allows zero-chroma' };
      for (const [k, v] of Object.entries(map)) {
        if (!/--color|--paper|--ink|--surface|--muted|--neutral|--bg/.test(k)) continue;
        const c = oklchC(resolveVar(v, map));
        if (c === 0) return { pass: false, note: `${k} has 0 chroma` };
      }
      return { pass: true, note: 'neutrals tinted toward anchor' };
    },
  },
  {
    id: 'color-token-discipline', dim: 'color',
    label: 'Colour literal outside the token block (gate 58)',
    fn: ({ rules }) => {
      const offenders = [];
      for (const r of rules) {
        if (/:root|\[data-theme/.test(r.sel)) continue;
        const lits = (r.body.match(COLOR_LITERAL) || []).filter((c) => !/transparent|currentcolor|inherit|none/i.test(c));
        if (lits.length) offenders.push(`${r.sel}: ${lits[0]}`);
      }
      return { pass: offenders.length === 0, note: offenders.length ? `${offenders.length} literal(s), e.g. ${offenders[0]}` : 'all colours via tokens' };
    },
  },
  {
    id: 'color-ink-on-ink', dim: 'color',
    label: 'Text lightness too close to its background (ink-on-ink, gates 46–50)',
    fn: ({ rules, map }) => {
      for (const r of rules) {
        if (/:root|\[data-theme/.test(r.sel)) continue;
        const cM = r.body.match(/(?<!-)\bcolor\s*:\s*([^;]+)/i);
        const bM = r.body.match(/background(?:-color)?\s*:\s*([^;]+)/i);
        if (!cM || !bM) continue;
        const lc = oklchL(resolveVar(cM[1], map));
        const lb = oklchL(resolveVar(bM[1], map));
        if (lc != null && lb != null && Math.abs(lc - lb) < 0.4) return { pass: false, note: `ΔL ${Math.abs(lc - lb).toFixed(2)} on ${r.sel}` };
      }
      return { pass: true, note: 'text/bg lightness separated' };
    },
  },

  // ---- VISUAL DETAILS ---------------------------------------------------
  {
    id: 'visual-side-tab', dim: 'visual',
    label: 'Thick coloured side-stripe border on a card (the strongest tell)',
    fn: ({ rules, map }) => {
      for (const r of rules) {
        // a left rule on a blockquote/figure is a typographic convention, not the card tell
        if (/\b(blockquote|figure|aside|q|cite)\b/.test(r.sel)) continue;
        const m = r.body.match(/border-(left|right)\s*:\s*([0-9.]+)px\s+\w+\s+([^;]+)/i);
        if (!m) continue;
        const w = parseFloat(m[2]);
        const col = resolveVar(m[3], map).toLowerCase();
        if (w >= 4 && !/transparent/.test(col)) return { pass: false, note: `${m[2]}px ${m[1]} stripe on ${r.sel}` };
      }
      return { pass: true, note: 'no side-tab stripe' };
    },
  },
  {
    id: 'visual-glassmorphism', dim: 'visual',
    label: 'Glassmorphism (backdrop blur on translucent panels)',
    fn: ({ css }) => {
      const bad = /backdrop-filter\s*:\s*[^;]*blur/i.test(css) && /rgba?\([^)]*0?\.\d+\s*\)|\/\s*0?\.\d+\s*\)/.test(css);
      return { pass: !bad, note: bad ? 'translucent blur panel' : 'no glass panels' };
    },
  },
  {
    id: 'visual-sparkline-decoration', dim: 'visual',
    label: 'Sparkline / chart used as pure decoration',
    fn: ({ html }) => {
      const bad = /class="[^"]*\b(sparkline|spark-line|decor[a-z-]*chart|fake-chart)\b/i.test(html);
      return { pass: !bad, note: bad ? 'decorative sparkline present' : 'no decorative charts' };
    },
  },

  // ---- LAYOUT & SPACE ---------------------------------------------------
  {
    id: 'layout-center-everything', dim: 'layout',
    label: 'Everything centre-aligned (≥4 text-align:center)',
    fn: ({ css }) => {
      const n = (css.match(/text-align\s*:\s*center/gi) || []).length;
      return { pass: n < 4, note: `${n} centred blocks` };
    },
  },
  {
    id: 'layout-justified', dim: 'layout',
    label: 'Justified body text (word-spacing rivers)',
    fn: ({ css }) => {
      const bad = /text-align\s*:\s*justify/i.test(css);
      return { pass: !bad, note: bad ? 'justified text present' : 'ragged-right text' };
    },
  },
  {
    id: 'layout-three-col-cards', dim: 'layout',
    label: 'Three equal-column card grid (icon-tile template)',
    fn: ({ css }) => {
      const bad = /grid-template-columns\s*:\s*repeat\(\s*3\s*,\s*(?:minmax\(0,\s*)?1fr/i.test(css) || /grid-template-columns\s*:\s*1fr\s+1fr\s+1fr\b/i.test(css);
      return { pass: !bad, note: bad ? 'repeat(3, 1fr) grid' : 'no rote 3-col grid' };
    },
  },
  {
    id: 'layout-long-measure', dim: 'layout',
    label: 'Prose measure beyond 75ch (gate 27)',
    fn: ({ css }) => {
      for (const m of css.matchAll(/max-width\s*:\s*([0-9.]+)ch/gi)) {
        if (parseFloat(m[1]) > 75) return { pass: false, note: `${m[1]}ch measure` };
      }
      return { pass: true, note: 'measure ≤ 75ch' };
    },
  },
  {
    id: 'layout-arbitrary-spacing', dim: 'layout',
    label: 'Spacing off the 4px scale (gate 26)',
    fn: ({ rules, map }) => {
      for (const r of rules) {
        if (/:root|\[data-theme/.test(r.sel)) continue;
        for (const m of r.body.matchAll(/\b(?:padding|margin|gap|row-gap|column-gap)(?:-\w+)?\s*:\s*([^;]+)/gi)) {
          const resolved = resolveVar(m[1], map);
          for (const px of resolved.matchAll(/(-?[0-9.]+)px/g)) {
            const v = Math.abs(parseFloat(px[1]));
            if (v > 0 && v % 4 !== 0) return { pass: false, note: `${px[1]}px on ${r.sel}` };
          }
        }
      }
      return { pass: true, note: 'spacing on 4px scale' };
    },
  },
  {
    id: 'layout-skipped-heading', dim: 'layout',
    label: 'Skipped heading level (h1→h3 with no h2)',
    fn: ({ html }) => {
      const lv = headingLevels(html);
      for (let i = 1; i < lv.length; i++) {
        if (lv[i] - lv[i - 1] > 1) return { pass: false, note: `h${lv[i - 1]}→h${lv[i]}` };
      }
      return { pass: true, note: 'heading levels contiguous' };
    },
  },

  // ---- MOTION -----------------------------------------------------------
  {
    id: 'motion-transition-all', dim: 'motion',
    label: 'transition: all (gate 11)',
    fn: ({ css }) => {
      const bad = /transition\s*:\s*all\b/i.test(css);
      return { pass: !bad, note: bad ? 'transition: all present' : 'transitions are scoped' };
    },
  },
  {
    id: 'motion-hover-scale', dim: 'motion',
    label: 'Uniform hover-scale (gate 12)',
    fn: ({ css }) => {
      const bad = /:hover[^{}]*\{[^{}]*transform\s*:\s*scale\(\s*1\.0[1-9]/i.test(css) || /hover:scale-10[0-9]/i.test(css);
      return { pass: !bad, note: bad ? 'hover scale present' : 'no rote hover-scale' };
    },
  },
  {
    id: 'motion-bouncy-easing', dim: 'motion',
    label: 'Bouncy/overshoot easing on UI state (gate 13)',
    fn: ({ css }) => {
      for (const m of css.matchAll(/cubic-bezier\(\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*,\s*([0-9.-]+)\s*\)/gi)) {
        const y1 = parseFloat(m[2]); const y2 = parseFloat(m[4]);
        if (y1 > 1 || y2 > 1 || y1 < 0 || y2 < 0) return { pass: false, note: `overshoot ${m[0]}` };
      }
      return { pass: true, note: 'no overshoot easing' };
    },
  },
  {
    id: 'motion-layout-animation', dim: 'motion',
    label: 'Animating layout properties (gate 15)',
    fn: ({ css }) => {
      const bad = /transition\s*:[^;}]*\b(width|height|top|left|right|bottom|margin|padding)\b/i.test(css);
      return { pass: !bad, note: bad ? 'layout prop in transition' : 'animates transform/opacity only' };
    },
  },
  {
    id: 'motion-no-reduced-motion', dim: 'motion',
    label: 'Animation without prefers-reduced-motion fallback (gate 29)',
    fn: ({ css }) => {
      const hasMotion = /@keyframes|animation\s*:|transition\s*:/i.test(css);
      const hasGuard = /prefers-reduced-motion/i.test(css);
      return { pass: !hasMotion || hasGuard, note: hasMotion ? (hasGuard ? 'guarded' : 'no reduced-motion guard') : 'no motion' };
    },
  },

  // ---- INTERACTION ------------------------------------------------------
  {
    id: 'interaction-emoji-icon', dim: 'interaction',
    label: 'Emoji used as a feature/step icon (gate 60)',
    fn: ({ html }) => {
      const body = html.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<svg[\s\S]*?<\/svg>/gi, '');
      const bad = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/u.test(body);
      return { pass: !bad, note: bad ? 'emoji glyph in markup' : 'no emoji icons' };
    },
  },
  {
    id: 'interaction-all-primary', dim: 'interaction',
    label: 'Every button styled as primary (no secondary register)',
    fn: ({ html, css }) => {
      const btns = (html.match(/<(?:button|a)[^>]*class="[^"]*\b(?:btn|button|cta)\b/gi) || []).length;
      const hasVariant = /\b(btn|button)[-_]{1,2}(secondary|ghost|outline|tertiary|quiet|text)\b|data-variant|\bbtn--/i.test(html + css);
      return { pass: btns < 3 || hasVariant, note: btns >= 3 && !hasVariant ? `${btns} buttons, one register` : 'button hierarchy present' };
    },
  },
  {
    id: 'interaction-placeholder-names', dim: 'interaction',
    label: 'Placeholder names / startup clichés (gate 20)',
    fn: ({ html }) => {
      const bad = /jane doe|john smith|john doe|lorem ipsum|\bacme\b|\bnexus\b|seamless|unleash|\bwidget(?:co|inc)\b/i.test(html);
      return { pass: !bad, note: bad ? 'placeholder/cliché copy' : 'specific copy' };
    },
  },
  {
    id: 'interaction-modal-reflex', dim: 'interaction',
    label: 'Reaching for a modal/dialog reflexively',
    fn: ({ html }) => {
      const bad = /<dialog\b|class="[^"]*\bmodal\b|role="dialog"/i.test(html);
      return { pass: !bad, note: bad ? 'modal present' : 'no reflexive modal' };
    },
  },

  // ---- RESPONSIVE -------------------------------------------------------
  {
    id: 'responsive-overflow-clip', dim: 'responsive',
    label: 'Root missing overflow-x: clip (gates 36/62)',
    fn: ({ css }) => {
      const bad = !/(html|body)[^{}]*\{[^{}]*overflow-x\s*:\s*clip/i.test(css) && !/(html|body)\s*,\s*(html|body)[^{}]*\{[^{}]*overflow-x\s*:\s*clip/i.test(css);
      return { pass: !bad, note: bad ? 'no overflow-x: clip' : 'overflow-x clipped' };
    },
  },
  {
    id: 'responsive-img-grid-minmax', dim: 'responsive',
    label: 'Image-bearing 1fr grid track without minmax(0,1fr) (gate 61)',
    fn: ({ css, html }) => {
      const hasImg = /<img|<picture/i.test(html);
      const bareFr = /grid-template-columns\s*:\s*[^;}]*(?<!minmax\(0,\s*)\b1fr/i.test(css) && /repeat\(\s*\d+\s*,\s*1fr/i.test(css) === false ? /grid-template-columns\s*:\s*1fr\b/i.test(css) : true;
      const usesMinmax = /minmax\(\s*0\s*,\s*1fr/i.test(css);
      const bad = hasImg && bareFr && !usesMinmax;
      return { pass: !bad, note: bad ? 'bare 1fr track with images' : 'minmax-guarded or no images' };
    },
  },
  {
    id: 'responsive-feature-amputation', dim: 'responsive',
    label: 'Content (not nav) hidden on mobile (feature amputation)',
    fn: ({ css }) => {
      const media = maxWidthMediaBodies(css).join('\n');
      const offenders = [...media.matchAll(/([^{}]+)\{[^{}]*display\s*:\s*none/gi)]
        .map((m) => m[1].trim())
        .filter((s) => !/nav|menu|toggle|hamburger|burger|skip|drawer|sheet|backdrop|overlay|sr-only|visually-hidden|__bar|mobile|desktop-only|show-/i.test(s));
      return { pass: offenders.length === 0, note: offenders.length ? `hides ${offenders[0]}` : 'no content amputation' };
    },
  },

  // ---- GENERAL QUALITY --------------------------------------------------
  {
    id: 'general-focus-visible', dim: 'general',
    label: 'Interactive elements without :focus-visible (gate 28)',
    fn: ({ html, css }) => {
      const interactive = /<(button|a\s|input|select|textarea|summary)/i.test(html);
      const hasFocus = /:focus-visible/i.test(css);
      return { pass: !interactive || hasFocus, note: interactive ? (hasFocus ? 'focus-visible present' : 'no focus-visible styles') : 'no interactive els' };
    },
  },
  {
    id: 'general-stamp', dim: 'general',
    label: 'Missing Hallmark macrostructure stamp (gate 21)',
    fn: ({ stamp }) => ({ pass: /macrostructure/i.test(stamp), note: stamp ? 'stamp present' : 'no stamp comment' }),
  },
  {
    id: 'general-state-coverage', dim: 'general',
    label: 'Interactive elements missing :hover/:active/:disabled coverage',
    fn: ({ html, css }) => {
      const interactive = /<(button|a\s|input)/i.test(html);
      if (!interactive) return { pass: true, note: 'no interactive els' };
      const states = ['\\:hover', '\\:active', '\\:disabled|\\[disabled\\]|\\[aria-disabled'];
      const missing = states.filter((s) => !new RegExp(s, 'i').test(css));
      return { pass: missing.length === 0, note: missing.length ? `${missing.length} state(s) missing` : 'states covered' };
    },
  },
];

// ---------------------------------------------------------------- v2 helpers
function pxOf(value, map) {
  const r = resolveVar(String(value).trim(), map);
  if (/^0$/.test(r)) return 0;
  const m = r.match(/(-?[0-9.]+)px/);
  return m ? parseFloat(m[1]) : null;
}
// hero/lede container padding -> {top, bottom} in px, or null
function heroPadding(rules, map) {
  const cand = rules.find((r) => /(^|[\s,])[.#]?(hero|lede|masthead)\b\s*$/.test(r.sel) || /(^|[\s,])(header\.hero|\.hero|\.lede|\.masthead)\s*$/.test(r.sel));
  if (!cand) return null;
  const blk = cand.body.match(/padding-block\s*:\s*([^;]+)/i);
  if (blk) {
    const parts = blk[1].trim().split(/\s+/);
    return { top: pxOf(parts[0], map), bottom: pxOf(parts[1] ?? parts[0], map), sel: cand.sel };
  }
  const ps = cand.body.match(/padding-block-start\s*:\s*([^;]+)/i);
  const pe = cand.body.match(/padding-block-end\s*:\s*([^;]+)/i);
  if (ps && pe) return { top: pxOf(ps[1], map), bottom: pxOf(pe[1], map), sel: cand.sel };
  const pad = cand.body.match(/(?<!-)\bpadding\s*:\s*([^;]+)/i);
  if (!pad) return null;
  const p = pad[1].trim().split(/\s+(?![^(]*\))/);
  let top, bottom;
  if (p.length === 1) { top = bottom = pxOf(p[0], map); }
  else if (p.length === 2) { top = bottom = pxOf(p[0], map); }
  else if (p.length === 3) { top = pxOf(p[0], map); bottom = pxOf(p[2], map); }
  else { top = pxOf(p[0], map); bottom = pxOf(p[2], map); }
  return { top, bottom, sel: cand.sel };
}
function isMonoFamily(value, map) {
  const fam = resolveVar(String(value), map).split(',')[0].toLowerCase();
  return /mono/.test(fam) || /\bmonospace\b/.test(resolveVar(String(value), map).toLowerCase());
}

// ---------------------------------------------------------------- rule set v2
// Added per "Your Evals Will Break": each probes a failure mode v1 cannot see.
const EXTRA_V2 = [
  {
    id: 'v2-hero-float', dim: 'layout',
    label: 'Hero pads symmetrically / top-heavy — floats off the page (gate 54)',
    fn: ({ rules, map }) => {
      const hp = heroPadding(rules, map);
      if (!hp || hp.top == null || hp.bottom == null) return { pass: true, note: 'no measurable hero padding' };
      const ok = hp.bottom >= 1.3 * hp.top || hp.top === 0;
      return { pass: ok, note: ok ? 'hero sits into the page' : `top ${hp.top} / bottom ${hp.bottom} (need ≥1.3×)` };
    },
  },
  {
    id: 'v2-dark-mode-reflex', dim: 'color',
    label: 'Defaulting to dark mode reflexively',
    fn: ({ rules, map, genre, css }) => {
      const exempt = /atmospheric|midnight|noir|terminal|cinema/i.test(genre) || /theme:\s*(midnight|terminal|noir)/i.test(css);
      const body = rules.find((r) => /(^|[\s,])body\b/.test(r.sel));
      const bm = body?.body.match(/background(?:-color)?\s*:\s*([^;]+)/i);
      const L = bm ? oklchL(resolveVar(bm[1], map)) : null;
      const dark = (L != null && L < 0.30) || /color-scheme\s*:\s*dark\b(?!\s*light)/i.test(css);
      return { pass: !dark || exempt, note: dark ? (exempt ? 'dark but justified' : `dark base (L ${L?.toFixed(2)})`) : 'light base' };
    },
  },
  {
    id: 'v2-hero-metric-stat', dim: 'layout',
    label: 'Hero metric layout (big number + supporting stats)',
    fn: ({ rules, map }) => {
      const bad = rules.find((r) => /(stat|metric|kpi|figure-n|big-?num)/.test(r.sel) && (() => { const m = r.body.match(/font-size\s*:\s*([^;]+)/i); const px = m ? pxOf(m[1], map) : null; return px != null && px >= 36; })());
      return { pass: !bad, note: bad ? `metric cluster ${bad.sel}` : 'no hero-metric tell' };
    },
  },
  {
    id: 'v2-icon-tile-above-heading', dim: 'typography',
    label: 'Icon tile stacked directly above a heading',
    fn: ({ html }) => {
      const heads = [...html.matchAll(/<h[2-4][\s>]/gi)];
      for (const h of heads) {
        const before = html.slice(Math.max(0, h.index - 110), h.index);
        if (/<svg\b/i.test(before) || /class="[^"]*\b(icon|ico|tile|i-tile|feature-icon)\b/i.test(before)) return { pass: false, note: 'icon/svg tile precedes a heading' };
      }
      return { pass: true, note: 'no icon-above-heading tiles' };
    },
  },
  {
    id: 'v2-mono-as-shorthand', dim: 'typography',
    label: 'Monospace used as "technical" shorthand across the UI',
    fn: ({ rules, map }) => {
      const sels = new Set();
      for (const r of rules) {
        if (/:root|\[data-theme/.test(r.sel)) continue;
        if (/\b(pre|code|kbd|samp)\b/.test(r.sel)) continue;
        const m = r.body.match(/font-family\s*:\s*([^;]+)/i);
        if (m && isMonoFamily(m[1], map)) sels.add(r.sel);
      }
      return { pass: sels.size < 3, note: sels.size >= 3 ? `mono on ${sels.size} non-code selectors` : 'mono kept to code/labels' };
    },
  },
  {
    id: 'v2-everything-in-cards', dim: 'layout',
    label: 'Wrapping all content in cards',
    fn: ({ html }) => {
      const n = (html.match(/class="[^"]*\b(card|panel|tile|box)\b/gi) || []).length;
      return { pass: n <= 6, note: n > 6 ? `${n} card-like wrappers` : `${n} card-like wrappers` };
    },
  },
];

// ---------------------------------------------------------------- scoring
function analyze(path, version = 'v1') {
  const doc = loadDoc(path);
  const map = tokenMap(doc.css);
  const ctx = { ...doc, map, rules: cssRules(doc.css), fams: fontFamilies(doc.css, map) };
  const ruleset = version === 'v2' ? RULES.concat(EXTRA_V2) : RULES;

  const byDim = {};
  for (const rule of ruleset) {
    const res = rule.fn(ctx);
    (byDim[rule.dim] ||= []).push({ id: rule.id, label: rule.label, pass: !!res.pass, note: res.note });
  }
  const dims = {};
  for (const [dim, list] of Object.entries(byDim)) {
    const passed = list.filter((r) => r.pass).length;
    dims[dim] = { score: +((passed / list.length) * 5).toFixed(3), passed, total: list.length, rules: list };
  }
  const dimScores = Object.values(dims).map((d) => d.score);
  const overall = +(dimScores.reduce((a, b) => a + b, 0) / dimScores.length).toFixed(3);
  return { file: path, genre: doc.genre || 'n/a', dims, overall, ruleCount: ruleset.length };
}

// ---------------------------------------------------------------- cli
import { pathToFileURL } from 'node:url';
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const args = process.argv.slice(2);
  const file = args.find((a) => !a.startsWith('--'));
  if (!file) { console.error('usage: node detector.mjs <file.html> [--json] [--eval v1|v2]'); process.exit(1); }
  const vi = args.indexOf('--eval');
  const version = vi >= 0 ? args[vi + 1] : 'v1';
  const result = analyze(file, version);
  if (args.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(`\n${result.file}  (genre: ${result.genre})  overall ${result.overall.toFixed(2)}/5`);
    for (const [dim, d] of Object.entries(result.dims)) {
      console.log(`  ${dim.padEnd(12)} ${d.score.toFixed(2)}  (${d.passed}/${d.total})`);
      for (const r of d.rules.filter((x) => !x.pass)) console.log(`     ✗ ${r.id} — ${r.note}`);
    }
  }
}

export { analyze, RULES, EXTRA_V2 };
