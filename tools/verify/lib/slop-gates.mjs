/**
 * The mechanically checkable subset of the slop test.
 *
 * The other ~46 gates need judgment ("does this hero read as templated?") and
 * stay with the model. These twelve are pattern-matching over emitted CSS, so
 * they can fail a build instead of being self-scored.
 *
 * Two tiers, and the distinction is deliberate:
 *   hard      — the violation is unambiguous in the text. Fails the run.
 *   advisory  — real signal, but static analysis can't fully settle it (needs a
 *               DOM, or the gate has a documented genre exemption). Reported and
 *               counted, does not fail. An advisory tier that silently grows is
 *               how a linter becomes decorative, so the runner prints the total.
 */

import { oklchChroma } from './css.mjs';

// Kept close to gate 38a's own enumeration: h1–h6, *__title, hero display,
// wordmark, footer statement. Deliberately NOT "anything masthead-ish" — a
// `.masthead-meta` line is body meta, and flagging it teaches people to ignore
// the gate.
const HEADING_SELECTOR = /(^|[\s,>+~(])h[1-6]\b|[_-](title|display|headline|heading|wordmark)\b|\bhero(__|\b)|footer__statement/i;
const COLOUR_LITERAL = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/i;
const SPACING_PROP = /^(padding|margin|gap|row-gap|column-gap)(-(top|right|bottom|left|inline|block)(-(start|end))?)?$/;

/** Resolve one level of var() against the custom properties seen in the file. */
function resolveVar(value, customProps) {
  const m = value.match(/^var\(\s*(--[\w-]+)\s*(?:,\s*([^)]*))?\)$/);
  if (!m) return value;
  return customProps.get(m[1]) ?? m[2]?.trim() ?? value;
}

function numeric(value) {
  const m = String(value).match(/^-?[\d.]+/);
  return m ? Number(m[0]) : null;
}

const isTokenBlock = (rule) =>
  rule.selectors.some((s) => s === ':root' || s.includes('[data-theme') || s === 'html' || s.startsWith(':where(:root'));

const inReducedMotion = (rule) => rule.at.some((a) => a.includes('prefers-reduced-motion'));

export const GATES = [
  {
    id: '10',
    tier: 'hard',
    name: 'transition: all',
    why: 'animates every property including ones that trigger layout; name the properties',
    check({ rules, classNames }) {
      const found = [];
      for (const rule of rules) {
        for (const d of rule.decls) {
          const firstComponent = d.value.split(',')[0];
          if (d.prop === 'transition' && /(^|\s)all(\s|$)/i.test(firstComponent)) {
            found.push({ line: d.line, detail: `${rule.selectors[0]} { transition: ${d.value} }` });
          }
          if (d.prop === 'transition-property' && /\ball\b/i.test(d.value)) {
            found.push({ line: d.line, detail: `${rule.selectors[0]} { transition-property: ${d.value} }` });
          }
        }
      }
      if (classNames.has('transition-all')) found.push({ line: null, detail: 'class="transition-all" in markup' });
      return found;
    },
  },

  {
    id: '11',
    tier: 'advisory',
    name: 'uniform hover-scale across unrelated elements',
    why: 'one scale value applied everywhere reads as a default, not a decision',
    check({ rules, classNames }) {
      const scaled = new Set();
      for (const rule of rules) {
        if (!rule.selectors.some((s) => s.includes(':hover'))) continue;
        if (rule.decls.some((d) => d.prop === 'transform' && /\bscale\(/i.test(d.value))) {
          for (const s of rule.selectors) if (s.includes(':hover')) scaled.add(s.trim());
        }
      }
      const tw = [...classNames].filter((c) => /^hover:scale-\d+$/.test(c));
      const found = [];
      if (scaled.size >= 3) {
        found.push({ line: null, detail: `${scaled.size} distinct :hover scale rules — ${[...scaled].slice(0, 4).join(', ')}${scaled.size > 4 ? ', …' : ''}` });
      }
      if (tw.length) found.push({ line: null, detail: `Tailwind hover-scale classes in markup: ${tw.join(', ')}` });
      return found;
    },
  },

  {
    id: '22',
    tier: 'hard',
    name: 'zero-chroma neutral',
    why: 'pure greys read flat; tint neutrals toward the anchor hue (min 0.005 chroma)',
    skipWhen: ({ genre }) => genre === 'modern-minimal', // documented genre exemption
    check({ rules }) {
      const found = [];
      for (const rule of rules) {
        for (const d of rule.decls) {
          // The gate binds on *palette* neutrals — surfaces and text. A black
          // shadow, scrim or mask matte is compositing (absence of light), not
          // a neutral, and is painted at zero chroma everywhere for good reason.
          if (/shadow|filter|mask|scrim|overlay|matte|glow/i.test(d.prop)) continue;
          const value = d.value;
          const m = value.match(/oklch\(\s*[\d.]+%?\s+([\d.]+)\s+[\d.]+\s*(\/)?/i);
          if (!m) continue;
          const c = Number(m[1]);
          const hasAlpha = value.includes('/');
          if (c < 0.005 && !hasAlpha) {
            found.push({ line: d.line, detail: `${d.prop}: ${value.slice(0, 70)}  (chroma ${c})` });
          }
        }
      }
      return found;
    },
  },

  {
    id: '24',
    tier: 'advisory',
    name: 'off-scale spacing value',
    why: 'arbitrary padding is a tell; spacing should sit on the 4pt scale',
    check({ rules }) {
      const found = [];
      for (const rule of rules) {
        for (const d of rule.decls) {
          if (!SPACING_PROP.test(d.prop)) continue;
          for (const m of d.value.matchAll(/(-?[\d.]+)px\b/g)) {
            const px = Number(m[1]);
            if (px !== 0 && px % 4 !== 0) {
              found.push({ line: d.line, detail: `${rule.selectors[0]} { ${d.prop}: ${d.value} }  (${px}px off the 4pt scale)` });
            }
          }
        }
      }
      return found;
    },
  },

  {
    id: '25',
    tier: 'advisory',
    name: 'prose measure outside 45–75ch',
    why: 'under 45ch reads choppy, over 75ch loses the eye',
    // Advisory, not hard: the gate binds on *prose containers*, and prose-ness
    // needs judgment. A 13ch display headline or a 22ch pull-quote is a
    // deliberate short measure, not a violation — so headings and display
    // selectors are excluded here, and what remains is still only a signal.
    check({ rules, customProps }) {
      const found = [];
      for (const rule of rules) {
        if (rule.selectors.some((s) => HEADING_SELECTOR.test(s))) continue;
        for (const d of rule.decls) {
          if (d.prop !== 'max-width' && d.prop !== 'inline-size') continue;
          const resolved = resolveVar(d.value, customProps);
          if (!/ch\b/.test(resolved)) continue;
          const n = numeric(resolved);
          if (n !== null && (n < 45 || n > 75)) {
            found.push({ line: d.line, detail: `${rule.selectors[0]} { ${d.prop}: ${d.value} }  (${n}ch)` });
          }
        }
      }
      return found;
    },
  },

  {
    id: '27',
    tier: 'hard',
    name: 'motion without a reduced-motion fallback',
    why: 'every animation needs a prefers-reduced-motion alternative',
    check({ rules, rawCss }) {
      const animates = rules.some(
        (r) =>
          !inReducedMotion(r) &&
          r.decls.some((d) => (d.prop === 'animation' || d.prop === 'animation-name') && !/\bnone\b/i.test(d.value))
      );
      const hasKeyframes = /@keyframes\b/i.test(rawCss);
      if (!animates && !hasKeyframes) return [];
      if (/prefers-reduced-motion/i.test(rawCss)) return [];
      return [{ line: null, detail: 'file declares @keyframes/animation but never mentions prefers-reduced-motion' }];
    },
  },

  {
    id: '34',
    tier: 'hard',
    name: 'root overflow-x: hidden',
    why: 'hidden creates a scroll container and breaks position: sticky; use clip',
    check({ rules }) {
      const found = [];
      for (const rule of rules) {
        const isRoot = rule.selectors.some((s) => /^(html|body|html\s*,\s*body|:root)$/i.test(s.trim()));
        if (!isRoot) continue;
        for (const d of rule.decls) {
          if ((d.prop === 'overflow-x' || d.prop === 'overflow') && /\bhidden\b/i.test(d.value)) {
            found.push({ line: d.line, detail: `${rule.selectors.join(', ')} { ${d.prop}: ${d.value} }  — should be clip` });
          }
        }
      }
      return found;
    },
  },

  {
    id: '38a',
    tier: 'hard',
    name: 'italic heading or display type',
    why: 'italic headers are a top AI tell; carry emphasis with weight or accent',
    check({ rules, htmlText }) {
      const found = [];
      for (const rule of rules) {
        if (!rule.selectors.some((s) => HEADING_SELECTOR.test(s))) continue;
        for (const d of rule.decls) {
          if (d.prop === 'font-style' && /\bitalic|oblique\b/i.test(d.value)) {
            found.push({ line: d.line, detail: `${rule.selectors[0]} { font-style: ${d.value} }` });
          }
        }
      }
      for (const m of htmlText.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
        if (/<(em|i)\b/i.test(m[2])) {
          found.push({ line: null, detail: `<h${m[1]}> contains <em>/<i>: ${m[2].replace(/\s+/g, ' ').trim().slice(0, 60)}` });
        }
      }
      return found;
    },
  },

  {
    id: '48',
    tier: 'advisory',
    name: 'colour literal outside the token block',
    why: 'mid-render improvisation; lift the value into a named token first',
    check({ rules }) {
      const found = [];
      for (const rule of rules) {
        if (isTokenBlock(rule)) continue;
        for (const d of rule.decls) {
          if (d.prop.startsWith('--')) continue; // a custom prop is a token by definition
          if (/url\(/i.test(d.value)) continue;
          if (!COLOUR_LITERAL.test(d.value)) continue;
          found.push({ line: d.line, detail: `${rule.selectors[0]} { ${d.prop}: ${d.value.slice(0, 60)} }` });
        }
      }
      return found;
    },
  },

  {
    id: '50',
    tier: 'advisory',
    name: 'bare 1fr on an image-bearing grid track',
    why: 'plain 1fr resolves to minmax(auto, 1fr) and a wide image pushes past the viewport',
    check({ rules, htmlText }) {
      if (!/<img\b|<picture\b/i.test(htmlText)) return [];
      const found = [];
      for (const rule of rules) {
        for (const d of rule.decls) {
          if (!/^grid-template-(columns|rows)$/.test(d.prop)) continue;
          // Strip minmax(...) groups, then look for a surviving bare 1fr.
          const withoutMinmax = d.value.replace(/minmax\([^)]*\)/gi, 'M');
          if (/(^|\s)1fr(\s|$)/.test(withoutMinmax)) {
            found.push({ line: d.line, detail: `${rule.selectors[0]} { ${d.prop}: ${d.value} }` });
          }
        }
      }
      return found;
    },
  },

  {
    id: '55',
    tier: 'hard',
    name: 'all-caps display with line-height < 1.0',
    why: 'cap-tops of the next line collide with the previous line when the title wraps',
    check({ rules, customProps }) {
      const found = [];
      for (const rule of rules) {
        const upper = rule.decls.find((d) => d.prop === 'text-transform' && /\buppercase\b/i.test(d.value));
        const lh = rule.decls.find((d) => d.prop === 'line-height');
        if (!upper || !lh) continue;
        const resolved = resolveVar(lh.value, customProps);
        const n = numeric(resolved);
        if (n !== null && n > 0 && n < 1.0 && !/%$/.test(resolved.trim())) {
          found.push({ line: lh.line, detail: `${rule.selectors[0]} { text-transform: uppercase; line-height: ${lh.value}${resolved !== lh.value ? ` → ${resolved}` : ''} }` });
        }
      }
      return found;
    },
  },

  {
    id: '56',
    tier: 'hard',
    name: 'two sticky elements at top: 0',
    why: 'both dock to the viewport top and overlap; offset the secondary one',
    check({ rules }) {
      const stuck = new Map();
      for (const rule of rules) {
        const sticky = rule.decls.some((d) => d.prop === 'position' && /\bsticky\b/i.test(d.value));
        const atTop = rule.decls.find((d) => d.prop === 'top' && /^0(px|rem|em|%)?$/.test(d.value.trim()));
        if (sticky && atTop) for (const s of rule.selectors) stuck.set(s.trim(), atTop.line);
      }
      if (stuck.size < 2) return [];
      return [{ line: [...stuck.values()][1], detail: `${stuck.size} selectors are sticky at top: 0 — ${[...stuck.keys()].join(', ')}` }];
    },
  },
];

export const HARD = GATES.filter((g) => g.tier === 'hard').map((g) => g.id);
export const ADVISORY = GATES.filter((g) => g.tier === 'advisory').map((g) => g.id);
