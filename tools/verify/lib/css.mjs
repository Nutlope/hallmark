/**
 * A minimal CSS reader — enough structure for the gate checks, no dependencies.
 *
 * Regex over raw CSS gets the easy cases and lies about the rest: it can't tell
 * a declaration inside `@media (prefers-reduced-motion)` from one outside it,
 * and that distinction is the whole point of several gates. So we parse into
 * rules carrying their at-rule context.
 */

/** Blank out comments while preserving newlines, so line numbers stay honest. */
export function stripComments(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
}

/** Byte offset → 1-indexed line, precomputed so lookups stay O(log n). */
function lineIndexer(src) {
  const starts = [0];
  for (let i = 0; i < src.length; i++) if (src[i] === '\n') starts.push(i + 1);
  return (pos) => {
    let lo = 0;
    let hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= pos) lo = mid;
      else hi = mid - 1;
    }
    return lo + 1;
  };
}

/** Split on a separator that appears at paren-depth zero. */
function splitTopLevel(text, sep) {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    else if (c === sep && depth === 0) {
      out.push([start, text.slice(start, i)]);
      start = i + 1;
    }
  }
  if (start < text.length) out.push([start, text.slice(start)]);
  return out;
}

function parseDecls(body, bodyStart, lineOf) {
  const decls = [];
  for (const [offset, chunk] of splitTopLevel(body, ';')) {
    const colon = chunk.indexOf(':');
    if (colon === -1) continue;
    const prop = chunk.slice(0, colon).trim().toLowerCase();
    const value = chunk.slice(colon + 1).trim();
    if (!prop || prop.startsWith('@') || !value) continue;
    decls.push({ prop, value, line: lineOf(bodyStart + offset + chunk.indexOf(chunk.trimStart())) });
  }
  return decls;
}

/**
 * @returns {Array<{selectors: string[], decls: Array<{prop,value,line}>, at: string[], line: number}>}
 *   `at` is the stack of enclosing at-rule preludes, outermost first.
 */
export function parseCss(css) {
  const src = stripComments(css.replace(/\r\n/g, '\n'));
  const lineOf = lineIndexer(src);
  const rules = [];
  const atStack = [];
  let buf = '';
  let bufStart = 0;
  let i = 0;

  while (i < src.length) {
    const ch = src[i];

    if (ch === '{') {
      const prelude = buf.trim();
      if (prelude.startsWith('@')) {
        // Conditional group rule (@media, @supports, @layer): descend into it.
        atStack.push(prelude.replace(/\s+/g, ' '));
        buf = '';
        bufStart = i + 1;
        i++;
        continue;
      }
      // Ordinary rule: consume to its matching close brace.
      let depth = 1;
      let j = i + 1;
      while (j < src.length && depth > 0) {
        if (src[j] === '{') depth++;
        else if (src[j] === '}') depth--;
        j++;
      }
      const body = src.slice(i + 1, j - 1);
      rules.push({
        selectors: splitTopLevel(prelude, ',').map(([, s]) => s.trim()).filter(Boolean),
        decls: parseDecls(body, i + 1, lineOf),
        at: [...atStack],
        line: lineOf(i),
      });
      buf = '';
      bufStart = j;
      i = j;
      continue;
    }

    if (ch === '}') {
      atStack.pop();
      buf = '';
      bufStart = i + 1;
      i++;
      continue;
    }

    if (buf === '') bufStart = i;
    buf += ch;
    i++;
  }

  return rules;
}

/** Pull `<style>` bodies out of an HTML document, with their line offsets. */
export function extractStyleBlocks(html) {
  const src = html.replace(/\r\n/g, '\n');
  const lineOf = lineIndexer(src);
  const blocks = [];
  for (const m of src.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)) {
    blocks.push({ css: m[1], startLine: lineOf(m.index) });
  }
  return blocks;
}

/** Parse an OKLCH / hex / rgb colour far enough to read its chroma. */
export function oklchChroma(value) {
  const m = value.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)/i);
  return m ? Number(m[2]) : null;
}
