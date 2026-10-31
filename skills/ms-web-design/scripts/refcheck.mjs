#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, copyFileSync, rmSync, mkdirSync, writeFileSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, relative, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const AS_JSON = args.includes('--json');
const ONLY_ERRORS = args.includes('--errors');

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name === '.hallmark' || name.startsWith('.')) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) { if (name !== 'fixtures') walk(p, out); }
    else out.push(p);
  }
  return out;
}

const FILES = walk(ROOT);
const MD = FILES.filter((f) => f.endsWith('.md'));
const TEXT = FILES.filter((f) => /\.(md|mjs|json|yaml|css|html)$/.test(f));
const BY_BASE = new Map();
for (const f of FILES) { const b = basename(f); if (!BY_BASE.has(b)) BY_BASE.set(b, []); BY_BASE.get(b).push(f); }
const read = (f) => readFileSync(f, 'utf8');
const findings = [];
const add = (level, file, line, rule, msg) => findings.push({ level, file: relative(ROOT, file), line, rule, msg });
const lineAt = (src, i) => src.slice(0, i).split('\n').length;

const SKILL = join(ROOT, 'SKILL.md');
const VERSION = (/^version:\s*([\d.]+)/m.exec(read(SKILL)) || [])[1];

const gatesSrc = read(join(ROOT, 'references', 'gates.md'));
const GATES = new Map();
for (const m of gatesSrc.matchAll(/^\|\s*(\d{1,2}(?:[a-d]|i{1,3})?)\s*\|\s*(Floor|Reflex|Ledger)\s*\|/gm)) GATES.set(m[1], m[2].toLowerCase());
const FCHECKS = new Set([...gatesSrc.matchAll(/\b(F\d{1,2})\s/g)].map((m) => m[1]));
const retiredLine = (/Retired numbers stay retired:\*\*\s*([\d, and]+) are never reused/.exec(gatesSrc) || [])[1] || '';
if (!retiredLine) findings.push({ level: 'error', file: 'references/gates.md', line: 1, rule: 'gate', msg: 'the retired-numbers sentence is missing or reworded; refcheck reads it' });
const RETIRED = new Set((retiredLine.match(/\d+/g) || []));
const NUMBERS = new Set([...GATES.keys()].map((k) => k.match(/^\d+/)[0]));

function gateProblem(id) {
  if (/^F\d+$/.test(id)) return FCHECKS.has(id) ? null : `F-check ${id} does not exist`;
  const num = id.match(/^\d+/)[0];
  if (RETIRED.has(num)) return `gate ${num} is retired`;
  if (GATES.has(id)) return null;
  if (id === num && NUMBERS.has(num)) return null;
  if (!NUMBERS.has(num)) return `gate ${num} does not exist`;
  return `gate ${num} has no clause ${id.slice(num.length)}`;
}

const ID = String.raw`(?:F\d{1,2}|\d{1,2}(?:[a-d]|i{1,3})?)`;
const GATE_LIST = new RegExp(String.raw`\b(?:gates?|waive|answered)\s+(${ID}(?:(?:\s*,\s*|\s+and\s+|\s+to\s+|\s+or\s+)${ID})*)`, 'gi');
const PAREN_LIST = new RegExp(String.raw`\((${ID}(?:,\s*${ID})*)\)`, 'g');

for (const f of MD) {
  const src = read(f);
  const isGates = f.endsWith(join('references', 'gates.md'));
  const seen = new Set();
  const check = (list, at) => {
    for (const id of list.split(/\s*,\s*|\s+and\s+|\s+to\s+|\s+or\s+/)) {
      const key = `${id}@${at}`;
      if (!id || seen.has(key)) continue;
      seen.add(key);
      const p = gateProblem(id);
      if (p) add('error', f, lineAt(src, at), 'gate', p);
    }
  };
  for (const m of src.matchAll(GATE_LIST)) {
    if (isGates && /were merged|stay retired|Retired numbers/.test(src.slice(Math.max(0, m.index - 200), m.index + 200))) continue;
    check(m[1], m.index);
  }
  for (const m of src.matchAll(PAREN_LIST)) {
    if (/[\w-]/.test(src[m.index - 1] || '')) continue;
    if (/^\d+$/.test(m[1]) && Number(m[1]) > 99) continue;
    check(m[1], m.index);
  }
}

const PROJECT_FILES = new Set(['design.md', 'DESIGN.md', 'brand-spec.md', 'AGENTS.md', 'CLAUDE.md', 'brief.md', 'README.md', 'prompts.md', 'notes.md']);
const CODE_EXT = /\.(md|mjs)$/;
for (const f of MD) {
  const src = read(f);
  for (const m of src.matchAll(/\]\(([^)\s]+)\)/g)) {
    const raw = m[1];
    if (/^(https?:|mailto:|#)/.test(raw)) continue;
    const target = raw.split('#')[0];
    if (!target) continue;
    const p = resolve(dirname(f), target);
    if (!existsSync(p)) add('error', f, lineAt(src, m.index), 'link', `dead link ${raw}`);
  }
  for (const m of src.matchAll(/`([\w./-]+\.(?:md|mjs))`/g)) {
    const name = m[1];
    if (name.includes('<') || name.includes('*')) continue;
    const b = basename(name);
    if (PROJECT_FILES.has(b) && !name.includes('references/')) continue;
    if (!CODE_EXT.test(b)) continue;
    const found = BY_BASE.has(b) || existsSync(resolve(dirname(f), name)) || existsSync(join(ROOT, name));
    if (!found) add('error', f, lineAt(src, m.index), 'mention', `names ${name}, which does not exist`);
  }
}

const headingsOf = new Map();
function headings(file) {
  if (!headingsOf.has(file)) {
    const src = read(file);
    const hs = [...src.matchAll(/^(#{1,4})\s+(.+)$/gm)].map((m) => m[2].replace(/[*`]/g, '').trim());
    const bold = [...src.matchAll(/^\s*(?:[-*]\s+|\d+\.\s+)?\*\*([^*]+)\*\*/gm)].map((m) => m[1].trim());
    headingsOf.set(file, { hs, bold });
  }
  return headingsOf.get(file);
}
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
for (const f of MD) {
  const src = read(f);
  for (const m of src.matchAll(/§\s*([^\n§]{1,60})/g)) {
    const lineStart = src.lastIndexOf('\n', m.index) + 1;
    const back = src.slice(lineStart, m.index);
    const mentions = [...back.matchAll(/([\w-]+(?:\/[\w-]+)*\.md)/g)];
    const fm = mentions.length ? mentions[mentions.length - 1] : null;
    let target = f;
    if (fm) {
      const cands = BY_BASE.get(basename(fm[1])) || [];
      if (!cands.length) continue;
      target = cands.find((c) => c.endsWith(fm[1])) || cands[0];
    }
    const rest = m[1].trim();
    const { hs, bold } = headings(target);
    const num = /^(\d+)\b/.exec(rest);
    if (num) {
      if (!hs.some((h) => new RegExp(`^${num[1]}[.\\s]`).test(h))) add('error', f, lineAt(src, m.index), 'section', `${relative(ROOT, target)} has no § ${num[1]}`);
      continue;
    }
    const words = norm(rest.split(/[,.;:()]|\s(?:and|to|or|for|on|in|when|is|binds|says|owns)\s/)[0]).split(' ').slice(0, 3).join(' ');
    if (!words || words.length < 3) continue;
    const pool = [...hs, ...bold].map(norm);
    const first = words.split(' ')[0];
    if (!pool.some((h) => h.includes(words) || h.startsWith(first) || h.includes(` ${first}`))) add('warn', f, lineAt(src, m.index), 'section', `${relative(ROOT, target)} has no section like "§ ${rest.split(/[,.;:)]/)[0].trim()}"`);
  }
  for (const m of src.matchAll(/\bStep (\d+(?:\.\d+)?)\b/g)) {
    const n = m[1];
    if (n.includes('.') || Number(n) > 7) add('error', f, lineAt(src, m.index), 'step', `SKILL.md has no Step ${n} (steps run 0 to 7)`);
  }
}

const theme = read(join(ROOT, 'scripts', 'theme.mjs'));
const tokenNames = (s) => new Set([...s.matchAll(/(--[a-z][\w-]*)\s*:/g)].map((m) => m[1]));
const CANON = new Set();
for (const block of ['SCALE', 'CUSTOM_TOKENS']) {
  const m = new RegExp(`const ${block} = \`([\\s\\S]*?)\`;`).exec(theme);
  if (m) for (const t of tokenNames(m[1])) CANON.add(t);
}
const THEME_DIR = join(ROOT, 'references', 'themes');
const themeFiles = MD.filter((f) => dirname(f) === THEME_DIR && basename(f) !== 'README.md');
const themeCount = new Map();
for (const f of themeFiles) for (const t of tokenNames(read(f))) themeCount.set(t, (themeCount.get(t) || 0) + 1);
for (const [t, n] of themeCount) if (n >= Math.ceil(themeFiles.length * 0.9)) CANON.add(t);
for (const t of ['--banner-height', '--i', '--texture-opacity', '--logo-count']) CANON.add(t);
const PHANTOM = new Map(Object.entries({
  '--page-gutter': '--gutter', '--page-max': '--container', '--ease-standard': '--ease-out', '--dur-mid': '--dur-long',
  '--dur-fast': '--dur-micro', '--dur-base': '--dur-short', '--dur-slow': '--dur-long', '--banner-h': '--banner-height',
  '--bar-h': 'a min-height', '--font-mono': '--font-outlier', '--font-label': '--font-body', '--font-wordmark': '--font-outlier',
  '--tracking-label': 'nothing (labels are untracked, gate 67)', '--display': '--font-display', '--rule-fine': '--rule-bar',
}));
const codeOf = (src) => [...src.matchAll(/```[a-z]*\n([\s\S]*?)```/g)].map((m) => ({ text: m[1], at: m.index + m[0].indexOf(m[1]) })).concat([...src.matchAll(/`([^`\n]+)`/g)].map((m) => ({ text: m[1], at: m.index })));
for (const f of MD) {
  const src = read(f);
  const isTheme = dirname(f) === THEME_DIR;
  const local = tokenNames(src);
  for (const { text, at } of codeOf(src)) {
    for (const m of text.matchAll(/var\(\s*(--[a-z][\w-]*)\s*(,)?/g)) {
      const t = m[1];
      const line = lineAt(src, at + m.index);
      if (PHANTOM.has(t) && !local.has(t)) add('error', f, line, 'token', `${t} does not exist; use ${PHANTOM.get(t)}`);
      else if (!m[2] && !CANON.has(t) && !local.has(t) && !isTheme) {
        const n = themeCount.get(t) || 0;
        add('warn', f, line, 'token', n ? `${t} exists only in ${n} theme(s); a shared file cannot rely on it` : `${t} is not in the token vocabulary (export-formats.md § The token set)`);
      }
    }
  }
}

const stampRe = /Hallmark · (macrostructure|studied):/g;
for (const f of TEXT) {
  const src = read(f);
  if (/[\u2014\u2013]/.test(src)) for (const m of src.matchAll(/[\u2014\u2013]/g)) add('error', f, lineAt(src, m.index), 'dash', 'em or en dash');
  for (const m of src.matchAll(stampRe)) add('error', f, lineAt(src, m.index), 'stamp', `old stamp field "${m[1]}:"; the stamp opens with shape, genre, theme`);
  for (const m of src.matchAll(/(?:Hallmark[^\n]{0,200}|\*\/[^\n]{0,0})\bv(\d+\.\d+\.\d+)\b/g)) {
    if (VERSION && m[1] !== VERSION && !/v0\.|v1\./.test(`v${m[1]}`)) add('error', f, lineAt(src, m.index), 'version', `v${m[1]} where the skill is v${VERSION}`);
  }
}
const themeVersion = (/const VERSION = '([\d.]+)'/.exec(theme) || [])[1];
if (themeVersion !== VERSION) add('error', join(ROOT, 'scripts', 'theme.mjs'), 1, 'version', `theme.mjs VERSION ${themeVersion} where SKILL.md says ${VERSION}`);

for (const f of MD) {
  const src = read(f);
  for (const m of src.matchAll(/```html\n([\s\S]*?)```/g)) {
    const html = m[1].replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style)[\s\S]*?<\/\1>/g, '');
    for (const t of html.matchAll(/>([^<>]*)</g)) {
      const text = t[1];
      const line = lineAt(src, m.index + m[0].indexOf(m[1]) + t.index);
      if (/[←→↗↘↩]|-->|->/.test(text)) add('error', f, line, '63', `arrow in sample copy: "${text.trim().slice(0, 50)}"`);
      if (/\S\s·\s\S/.test(text) && !/marquee|ticker/i.test(html)) add('warn', f, line, '63', `middle-dot string in sample copy: "${text.trim().slice(0, 50)}"`);
    }
  }
  for (const m of src.matchAll(/```css\n([\s\S]*?)```/g)) {
    for (const r of m[1].matchAll(/([^{}]+)\{([^}]*)\}/g)) {
      const sel = r[1].trim(); const body = r[2];
      const ls = /letter-spacing:\s*(-?[\d.]+)em/.exec(body);
      if (/uppercase/.test(body) && ls && Number(ls[1]) > 0.04 && /label|caption|meta|tag|chip|eyebrow|kicker|th\b|nav|link|small|note/i.test(sel) && !/wordmark|logo|brand/i.test(sel)) add('error', f, lineAt(src, m.index + m[0].indexOf(m[1]) + r.index + r[0].length - r[0].trimStart().length), '67', `${sel} sets tracked capitals (${ls[1]}em)`);
      if (/small-caps|smcp/.test(body)) add('error', f, lineAt(src, m.index + m[0].indexOf(m[1]) + r.index + r[0].length - r[0].trimStart().length), '67', `${sel} sets small caps`);
    }
  }
}

const sloplint = read(join(ROOT, 'scripts', 'sloplint.mjs'));
const tiersBlock = (/const TIERS = new Map\(Object\.entries\(\{([\s\S]*?)\}\)\)/.exec(sloplint) || [])[1] || '';
const TIERS = new Map([...tiersBlock.matchAll(/'([\w]+)':\s*'(\w+)'/g)].map((m) => [m[1], m[2]]));
for (const [id, tier] of GATES) {
  const t = TIERS.get(id);
  if (t && t !== tier) add('error', join(ROOT, 'scripts', 'sloplint.mjs'), 1, 'tier', `sloplint tiers ${id} as ${t}; gates.md says ${tier}`);
}

const index = JSON.parse(read(join(THEME_DIR, 'index.json')));
const indexed = new Set(index.themes.map((t) => t.slug));
for (const f of themeFiles) if (!indexed.has(basename(f, '.md'))) add('error', f, 1, 'index', 'theme missing from index.json (run theme.mjs index)');
for (const t of index.themes) if (!existsSync(join(ROOT, t.file))) add('error', join(THEME_DIR, 'index.json'), 1, 'index', `index lists ${t.file}, which does not exist`);

const fontsSrc = read(join(ROOT, 'references', 'fonts.md'));
const unusedTable = fontsSrc.slice(fontsSrc.indexOf('## Display faces the catalog does not use'), fontsSrc.indexOf('## Body faces'));
const pairTable = fontsSrc.includes('## Pairings by tone') ? fontsSrc.slice(fontsSrc.indexOf('## Pairings by tone'), fontsSrc.indexOf('## The wordmark')) : '';
const catalogFaces = index.themes.map((t) => ({ name: t.name, face: t.display.face.toLowerCase().replace(/ italic$/, '') }));
for (const [label, table] of [['the faces-the-catalog-does-not-use table', unusedTable], ['the display column of the pairings table', pairTable.split('\n').map((l) => l.split('|')[2] || '').join('\n')]]) {
  for (const { name, face } of catalogFaces) {
    if (new RegExp(`(^|[\\s,|])${face.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?=[\\s,|(]|$)`, 'im').test(table.toLowerCase())) add('error', join(ROOT, 'references', 'fonts.md'), lineAt(fontsSrc, fontsSrc.toLowerCase().indexOf(face)), 'fonts', `${label} offers ${face}, which ${name} already sets as its display face`);
  }
}

const reach = new Set([SKILL]);
const queue = [SKILL];
while (queue.length) {
  const f = queue.shift();
  const src = read(f);
  const names = new Set([...src.matchAll(/([\w-]+\.(?:md|mjs|json))/g)].map((m) => m[1]));
  for (const n of names) for (const c of BY_BASE.get(n) || []) if (!reach.has(c)) { reach.add(c); if (c.endsWith('.md')) queue.push(c); }
}
for (const f of themeFiles) reach.add(f);
for (const f of [...reach]) {
  if (!f.endsWith('.md')) continue;
  for (const m of read(f).matchAll(/([\w-]+)\/<[\w-]+>\.md/g)) for (const c of MD) if (basename(dirname(c)) === m[1]) reach.add(c);
}
for (const f of MD) if (!reach.has(f) && basename(f) !== 'README.md') add('warn', f, 1, 'orphan', 'no file reachable from SKILL.md names this file');

const skillBytes = Buffer.byteLength(read(SKILL));
const front = /^---\n([\s\S]*?)\n---\n/.exec(readFileSync(SKILL, 'utf8'));
const fm = front ? Object.fromEntries(front[1].split('\n').map((l) => /^([a-z-]+):\s*(.*)$/.exec(l)).filter(Boolean).map((m) => [m[1], m[2]])) : {};
if (!fm.name || !fm.description) add('error', SKILL, 1, 'frontmatter', 'SKILL.md needs name and description in its frontmatter, or installers find no skill');
else if (!/^"(?:[^"\\]|\\.)*"$/.test(fm.description) || fm.description.length > 1026) add('error', SKILL, 2, 'frontmatter', 'the description must be one double-quoted line of 1,024 characters or fewer; an unquoted colon breaks strict YAML parsers');
if (skillBytes > 19000) add('error', SKILL, 1, 'size', `SKILL.md is ${skillBytes} bytes; keep it at 19,000 or under so the 5,000 tokens a harness re-attaches after compaction still hold Step 7`);

for (const f of themeFiles) {
  const src = read(f);
  const hint = /## Build hint[\s\S]*?```css\n([\s\S]*?)```/.exec(src);
  if (!hint) continue;
  const at = src.indexOf(hint[1]);
  for (const m of hint[1].matchAll(/(?:^|[{;])\s*(?!--)([a-z-]+)\s*:([^;{}]*)/g)) {
    if (/oklch\(|#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/.test(m[2])) add('error', f, lineAt(src, at + m.index), 'literal', `build hint sets ${m[1]} with a colour literal; route it through a token (48)`);
  }
}

const exemplarDir = join(ROOT, 'scripts', 'fixtures', 'exemplars');
const clean = [...(existsSync(exemplarDir) ? readdirSync(exemplarDir).filter((n) => n.endsWith('.html')).map((n) => join(exemplarDir, n)) : []),
  ...['eyebrow-pass', 'tailwind-pass'].map((n) => join(ROOT, 'scripts', 'fixtures', n)).filter(existsSync)];
for (const target of clean) {
  const run = spawnSync(process.execPath, [join(ROOT, 'scripts', 'sloplint.mjs'), target, '--json'], { encoding: 'utf8' });
  let s = null;
  try { s = JSON.parse(run.stdout).summary; } catch {}
  if (!s) add('error', target, 1, 'lint', 'sloplint did not run on this file');
  else if (s.fails || s.reflex || s.warns) add('error', target, 1, 'lint', `must lint clean, has ${s.fails} FAIL, ${s.reflex} REFLEX, ${s.warns} WARN`);
}

const FIX = join(ROOT, 'scripts', 'fixtures');
{
  const tmp = mkdtempSync(join(tmpdir(), 'hallmark-links-'));
  try {
    const project = join(tmp, 'project');
    const shared = join(tmp, 'shared');
    mkdirSync(project);
    mkdirSync(shared);
    writeFileSync(join(shared, 'style.css'), 'p { color: var(--color-text); }');
    symlinkSync(shared, join(project, 'a-shared'), process.platform === 'win32' ? 'junction' : 'dir');
    symlinkSync(shared, join(project, 'b-shared'), process.platform === 'win32' ? 'junction' : 'dir');
    symlinkSync(project, join(project, 'parent'), process.platform === 'win32' ? 'junction' : 'dir');
    const run = spawnSync(process.execPath, [join(ROOT, 'scripts', 'sloplint.mjs'), project, '--scope', 'component', '--json'], { encoding: 'utf8', timeout: 5000 });
    let report = null;
    try { report = JSON.parse(run.stdout); } catch {}
    if (!report || report.summary.files !== 1) add('error', SKILL, 1, 'fixture', 'directory symlink cycles must terminate and each real file must be linted once');
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}
const lintJson = (t) => { const r = spawnSync(process.execPath, [join(ROOT, 'scripts', 'sloplint.mjs'), t, '--json'], { encoding: 'utf8' }); try { return JSON.parse(r.stdout); } catch { return null; } };
const gatesOf = (j) => new Set(j.findings.map((x) => String(x.gate)));
const expectations = [
  ['eyebrow-fail', (j) => j.findings.filter((x) => x.gate === '54' && x.grade === 'FAIL').length === 6, 'gate 54 must FAIL six times'],
  ['eyebrow-pass', (j) => !j.findings.some((x) => x.gate === '54'), 'gate 54 must not fire'],
  ['waiver', (j) => ['fails:0', 'reflex:0', 'waived:5', 'rejected:2', 'answered:1', 'notes:1'].every((kv) => { const [k, v] = kv.split(':'); return j.summary[k] === Number(v); }), 'must report fails 0, reflex 0, waived 5, rejected 2, answered 1, notes 1'],
  ['slopped.html', (j) => ['1', '2a', '4', '7b', '10a', '15', '19', '20', '22', '46a', '48', '54'].every((g) => gatesOf(j).has(g)), 'must fire 1, 2a, 4, 7b, 10a, 15, 19, 20, 22, 46a, 48 and 54'],
  ['tailwind-fail', (j) => ['67', '54', '64', '10a', '12', '11', '2a', '2b', '29', '6a', '34', '48', '74', '3'].every((g) => gatesOf(j).has(g)), 'must fire 67, 54, 64, 10a, 12, 11, 2a, 2b, 29, 6a, 34, 48, 74 and 3'],
];
for (const [name, ok, msg] of existsSync(FIX) ? expectations : []) {
  const target = join(FIX, name);
  if (!existsSync(target)) { add('error', target, 1, 'fixture', 'missing'); continue; }
  const j = lintJson(target);
  if (!j) add('error', target, 1, 'fixture', 'sloplint did not run on this fixture');
  else if (!ok(j)) add('error', target, 1, 'fixture', msg);
}

const keptDir = join(FIX, 'kept');
if (existsSync(keptDir)) {
  const tmp = mkdtempSync(join(tmpdir(), 'hallmark-kept-'));
  try {
    const run = (flag) => spawnSync(process.execPath, [join(ROOT, 'scripts', 'sloplint.mjs'), 'index.html', flag, '--json'], { encoding: 'utf8', cwd: tmp });
    copyFileSync(join(keptDir, 'before.html'), join(tmp, 'index.html'));
    run('--before');
    copyFileSync(join(keptDir, 'after.html'), join(tmp, 'index.html'));
    let j = null;
    try { j = JSON.parse(run('--kept').stdout); } catch {}
    const kept = j ? j.findings.filter((x) => x.gate === 'kept') : [];
    const fails = kept.filter((x) => x.grade === 'FAIL').map((x) => x.evidence).join(' | ');
    const warns = kept.filter((x) => x.grade === 'WARN').map((x) => x.evidence).join(' | ');
    const want = [[fails, 'rooms.html'], [fails, 'nights'], [fails, "track('book')"], [fails, 'book-button'], [fails, '#nav-toggle'], [warns, 'nav-toggle']];
    if (!j) add('error', keptDir, 1, 'fixture', 'sloplint --kept did not run on the kept fixture');
    else if (!want.every(([hay, needle]) => hay.includes(needle))) add('error', keptDir, 1, 'fixture', 'the kept check must fail the lost link, field, handler, test hook and script hook, and warn on the lost id');
    else if (fails.includes('mailto:')) add('error', keptDir, 1, 'fixture', 'a link recorded as dropped in the stamp must not fail');
  } finally { rmSync(tmp, { recursive: true, force: true }); }
}

const REPO = resolve(ROOT, '..', '..');
const pkgFile = join(REPO, 'package.json');
if (existsSync(pkgFile)) {
  let pkg = null;
  try { pkg = JSON.parse(read(pkgFile)); } catch {}
  if (pkg && pkg.name === 'hallmark') {
    if (pkg.version !== VERSION) add('error', pkgFile, 1, 'version', `package.json says ${pkg.version} where SKILL.md says ${VERSION}`);
    const docs = ['README.md', 'ROADMAP.md', ...(existsSync(join(REPO, 'docs')) ? readdirSync(join(REPO, 'docs')).filter((n) => n.endsWith('.md')).map((n) => join('docs', n)) : [])].map((n) => join(REPO, n)).filter(existsSync);
    for (const f of docs) {
      const src = read(f);
      for (const m of src.matchAll(/\]\(([^)\s]+)\)/g)) {
        const t = m[1].split('#')[0].split('?')[0];
        if (!t || /^(https?:|mailto:|data:)/.test(m[1])) continue;
        if (!existsSync(resolve(dirname(f), t))) add('error', f, lineAt(src, m.index), 'link', `${m[1]} does not resolve`);
      }
    }
  }
}

const shown = ONLY_ERRORS ? findings.filter((x) => x.level === 'error') : findings;
const errors = findings.filter((x) => x.level === 'error').length;
const warns = findings.length - errors;
if (AS_JSON) console.log(JSON.stringify({ errors, warns, findings: shown }, null, 1));
else {
  shown.sort((a, b) => (a.level === b.level ? a.file.localeCompare(b.file) || a.line - b.line : a.level === 'error' ? -1 : 1));
  for (const x of shown) console.log(`${x.level === 'error' ? 'ERROR' : 'warn '}  ${x.file}:${x.line}  [${x.rule}] ${x.msg}`);
  console.log(errors || warns ? `refcheck: ${errors} error(s), ${warns} warning(s) across ${MD.length} reference files` : `refcheck: clean across ${MD.length} reference files`);
}
process.exit(errors ? 1 : 0);
