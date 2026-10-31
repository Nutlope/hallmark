#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync, renameSync } from 'node:fs';
import { join, dirname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash, randomBytes } from 'node:crypto';

const HERE = dirname(fileURLToPath(import.meta.url));
const THEMES = join(HERE, '..', 'references', 'themes');
const INDEX = join(THEMES, 'index.json');
const VERSION = '2.0.0';
const PHOTOS = join(HERE, 'photos.json');
const args = process.argv.slice(2);
const cmd = args[0];
const flag = (k, d = null) => { const i = args.indexOf('--' + k); const v = i >= 0 ? args[i + 1] : undefined; return v !== undefined && !String(v).startsWith('--') ? v : d; };
const has = (k) => args.includes('--' + k);
const VALUED = new Set(['genre', 'prompt', 'brief', 'log', 'n', 'reroll', 'dealt', 'dir', 'axes', 'face', 'hue', 'entry', 'redesign', 'theme', 'orient', 'save', 'avoid', 'material', 'seed', 'job']);
const positional = () => { const out = []; for (let i = 1; i < args.length; i++) { const a = args[i]; if (a.startsWith('--')) { if (VALUED.has(a.slice(2))) i++; continue; } out.push(a); } return out; };
const GENRES = ['editorial', 'modern-minimal', 'atmospheric', 'playful'];
// A theme slug names a file in references/themes, so it is a plain name, never a path.
const isSlug = (s) => /^[a-z0-9][a-z0-9-]*$/.test(s);

function usage() {
  console.error(`usage:
  node theme.mjs deal --genre <g> --prompt "<prompt>" [--log .hallmark/log.json] [--n 3] [--reroll 0] [--json]
  node theme.mjs scaffold <slug> [--dealt "<n>/3, seed <seed>"] [--redesign polish|restyle|full] [--scope app] [--dir <beside the stylesheet>] [--force]
  node theme.mjs scaffold --custom | --brand [--redesign polish|restyle|full] [--scope app] [--dir <beside the stylesheet>] [--force]
  node theme.mjs check [--axes "<paper>/<display>/<accent>"] [--face "<display face>"] [--hue <accent hue>] [--log .hallmark/log.json]
      paper: light | mid | dark · accent: warm | cool | neutral | chromatic-<hue name>
      display: roman-serif | high-contrast-serif | slab-serif | grotesk-sans | grotesk-heavy | geometric-sans | rounded-sans | display-condensed | display-heavy | mono | pixel | handwritten | blackletter
  node theme.mjs draw --material photo|product|words --job <subscribe|book|visit|attend|buy|try|sign up|hire|join|listen> [--theme <slug>] [--log .hallmark/log.json] [--seed <hex>]
  node theme.mjs photos "<subject>" ["<subject>" ...] [--theme <slug>] [--n 3] [--orient landscape|portrait|square] [--log .hallmark/log.json] [--avoid <file naming photos>] [--save <dir>] [--json]
  node theme.mjs log --entry '<one JSON object>' [--log .hallmark/log.json]
  node theme.mjs index
  node theme.mjs list
  node theme.mjs validate <files...>`);
}

function parseHeader(src, file) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(src);
  if (!m) throw new Error(`${file}: no header block`);
  const h = {};
  for (const line of m[1].split('\n')) {
    const mm = /^([a-z]+):\s*(.*)$/.exec(line.trim());
    if (mm) h[mm[1]] = mm[2].trim();
  }
  const need = ['name', 'slug', 'genre', 'paper', 'display', 'accent', 'posture', 'keywords', 'material'];
  for (const k of need) if (!h[k]) throw new Error(`${file}: header is missing "${k}"`);
  const [pband, pL, phue] = h.paper.split(/\s+/);
  const [dclass, ...dface] = h.display.split(/\s+/);
  const [aband, ahue] = h.accent.split(/\s+/);
  return {
    name: h.name, slug: h.slug, genre: h.genre, posture: h.posture,
    paper: { band: pband, L: Number(pL), hue: Number(phue) },
    display: { class: dclass, face: dface.join(' ') },
    accent: { band: aband, hue: Number(ahue) },
    keywords: h.keywords.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
    material: h.material, file: `references/themes/${basename(file)}`,
    ...(h.photo ? { photo: h.photo } : {}),
    ...(h.pictured ? { pictured: h.pictured } : {}),
    ...(existsSync(join(THEMES, basename(file).replace(/\.md$/, '.jpg'))) ? { picture: `references/themes/${basename(file).replace(/\.md$/, '.jpg')}` } : {}),
  };
}

function buildIndex() {
  const files = readdirSync(THEMES).filter((f) => f.endsWith('.md') && f !== 'README.md').sort();
  const entries = files.map((f) => parseHeader(readFileSync(join(THEMES, f), 'utf8'), f));
  const slugs = new Set();
  for (const e of entries) {
    if (slugs.has(e.slug)) throw new Error(`duplicate slug ${e.slug}`);
    slugs.add(e.slug);
  }
  writeFileSync(INDEX, JSON.stringify({ themes: entries }, null, 1) + '\n');
  return entries;
}

function loadIndex() {
  if (!existsSync(INDEX)) return buildIndex();
  return JSON.parse(readFileSync(INDEX, 'utf8')).themes;
}

function addLog() {
  const file = resolve(flag('log', '.hallmark/log.json'));
  let entry;
  try { entry = JSON.parse(flag('entry', '')); } catch { entry = null; }
  if (!entry || Array.isArray(entry) || typeof entry !== 'object') { console.error('--entry takes one JSON object, the build\'s log entry'); process.exit(2); }
  if (!entry.date) entry.date = new Date().toISOString().slice(0, 10);
  if (!entry.mode) entry.mode = 'build';
  if (!['build', 'redesign'].includes(entry.mode)) { console.error('mode is build or redesign'); process.exit(2); }
  if (entry.mode === 'redesign' && !['polish', 'restyle', 'full'].includes(entry.depth)) { console.error('a redesign entry names its depth: polish, restyle or full'); process.exit(2); }
  const composed = entry.scope !== 'app' && (entry.mode === 'build' || entry.depth === 'full');
  if (!entry.imagery && entry.enrichment) entry.imagery = entry.enrichment;
  if (!entry.prompt && entry.brief) { entry.prompt = entry.brief; delete entry.brief; }
  const missing = [...(composed ? ['shape', 'axes', 'hero', 'nav', 'footer', 'imagery', 'entry', 'fingerprint', 'sections', 'signature'] : []), ...(entry.depth === 'polish' ? [] : ['theme']), 'prompt'].filter((k) => !entry[k]);
  if (entry.photos && !Array.isArray(entry.photos)) { console.error('photos is the list of photo ids the page used'); process.exit(2); }
  if (existsSync(file)) { try { JSON.parse(readFileSync(file, 'utf8')); } catch { console.error(`${file} is not valid JSON; fix it or move it aside, nothing was written`); process.exit(1); } }
  const next = [entry, ...readLog(file)].slice(0, 20);
  mkdirSync(dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(next, null, 1) + '\n');
  renameSync(tmp, file);
  console.log(`logged ${entry.mode === 'redesign' ? `a ${entry.depth} redesign` : entry.shape || '?'} in ${entry.theme || '?'} at the top of ${file} (${next.length} of 20)${missing.length ? `; missing ${missing.join(', ')}, which Rotation reads, so log them` : ''}`);
}

function readLog(p) {
  if (!p || !existsSync(p)) return [];
  try { const j = JSON.parse(readFileSync(p, 'utf8')); return Array.isArray(j) ? j : (j.runs || []); } catch { return []; }
}

function contrastOf(f, b) {
  const rgb = ([L, C, H]) => { const h = H * Math.PI / 180, x = C * Math.cos(h), y = C * Math.sin(h); const l = (L + 0.3963377774 * x + 0.2158037573 * y) ** 3, m = (L - 0.1055613458 * x - 0.0638541728 * y) ** 3, s2 = (L - 0.0894841775 * x - 1.2914855480 * y) ** 3; return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s2, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s2, -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s2].map((c) => Math.min(1, Math.max(0, c))); };
  const Y = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const a = Y(rgb(f)), c = Y(rgb(b));
  return (Math.max(a, c) + 0.05) / (Math.min(a, c) + 0.05);
}

const triple = (t) => `${t.paper.band}/${t.display.class}/${t.accent.band}`;
const words = (s) => (s || '').toLowerCase().replace(/[^a-z0-9\s-]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
const ASK = new Set(['build', 'make', 'create', 'design', 'need', 'want', 'please', 'page', 'site', 'website', 'landing', 'called', 'for', 'and', 'the', 'with', 'that', 'this', 'our', 'your']);
const promptWords = (s) => words(s).filter((w) => !ASK.has(w));
const stem = (w) => { let x = w.replace(/(?:ing|ed)$/, ''); if (x.length < 3) x = w; return x.endsWith('ss') ? x : x.replace(/s$/, ''); };
const hueGap = (a, b) => { const d = Math.abs(((a - b) % 360 + 360) % 360); return Math.min(d, 360 - d); };

function seededRand(key) {
  let h = createHash('sha256').update(key).digest();
  let i = 0;
  return () => { if (i >= h.length - 4) { h = createHash('sha256').update(h).digest(); i = 0; } const v = h.readUInt32BE(i); i += 4; return v / 0xffffffff; };
}

function pickFrom(pool, n, exclude) {
  const avail = pool.filter((s) => !exclude.has(s.t.slug));
  const picked = [];
  const tripleOf = (s) => triple(s.t);
  if (!avail.length) return picked;
  picked.push(avail[0]);
  const rest = () => avail.filter((s) => !picked.includes(s));
  if (n >= 2 && rest().length) {
    const best = rest()[0];
    const other = rest().find((s) => s.t.paper.band !== picked[0].t.paper.band && s.fit >= best.fit - 2 && tripleOf(s) !== tripleOf(picked[0]));
    picked.push(other || rest().find((s) => tripleOf(s) !== tripleOf(picked[0])) || best);
  }
  while (picked.length < n && rest().length) {
    const cand = rest().find((s) => picked.every((p) => tripleOf(p) !== tripleOf(s))) || rest()[0];
    picked.push(cand);
  }
  return picked;
}

// A project's own salt, so two projects dealing the same prompt on the same day get different hands;
// one project still gets the same deal back (reroll moves it on).
function projectSalt() {
  const f = resolve(dirname(resolve(flag('log', '.hallmark/log.json'))), 'salt');
  try { if (existsSync(f)) return readFileSync(f, 'utf8').trim(); mkdirSync(dirname(f), { recursive: true }); const salt = randomBytes(4).toString('hex'); writeFileSync(f, salt + '\n'); return salt; } catch { return 'nosalt'; }
}

// The draw: the structural decisions a model converges on when left alone, dealt fresh for every build
// against the log and the theme's own picture, so two builds of one prompt in one theme come out as
// different pages. The model takes it unless the prompt's material refuses a pick, and says so.
const DRAW = {
  shapes: {
    photo: ['Photographic', 'Marquee Hero', 'Split Studio', 'Catalogue', 'Narrative Workflow', 'Bento Grid', 'Conversational FAQ', 'Letter', 'Feature Stack'],
    product: ['Workbench', 'Feature Stack', 'Bento Grid', 'Narrative Workflow', 'Marquee Hero', 'Split Studio', 'Conversational FAQ', 'Map / Diagram', 'Stat-Led'],
    words: ['Long Document', 'Manifesto', 'Letter', 'Index-First', 'Conversational FAQ', 'Marquee Hero', 'Narrative Workflow'],
  },
  heroes: { photo: ['Poster', 'Stage', 'Ledge', 'Settled', 'Poster', 'Stage'], product: ['Stage', 'Settled', 'Banner', 'Corridor', 'Stage'], words: ['Corridor', 'Ledge', 'Banner', 'Settled'] },
  navs: ['edge-aligned', 'floating pill', 'masthead', 'slab', 'search-led bar', 'banner over a retracting bar'],
  footers: ['mast', 'statement', 'colophon block', 'newsletter-first', 'letter close', 'index columns'],
  openers: ['Split', 'Showcase', 'Grid', 'Bento', 'Rows', 'Table', 'Steps', 'Statement', 'Rail', 'Pinned', 'Switcher', 'Index', 'Schedule', 'Offer'],
  jobs: {
    subscribe: { sections: ['an example issue set as it arrives (a sample)', 'the archive as an Index of past issues (sample titles)', 'who writes it, with a picture slot', 'the contents of one issue, as rows'], close: ['a second subscribe field under the archive', 'the archive itself, ending on the latest issue'], open: ['Index', 'Rail', 'Statement', 'Split'], heroes: ['Counter', 'Corridor', 'Index', 'Banner'], action: ['the subscribe field in the hero, beside the latest issue', 'the subscribe field in the hero and once more under the issues'] },
    book: { sections: ['the menu as a Switcher by lunch and dinner (sample dishes, no prices unless given)', 'the room as a full-bleed photograph with no head', 'hours and the address as a section of their own', 'the next free times as buttons'], close: ['hours, the address and the booking again', 'the booking beside one last photograph'], open: ['Switcher', 'Index', 'Schedule', 'Split', 'Showcase'], heroes: ['Counter', 'Poster', 'Stage', 'Index'], action: ['a sticky booking bar', 'the booking times in the hero', 'the booking beside the menu or the rooms'] },
    visit: { sections: ['what is on now as the lead picture', 'what is coming as dated rows', 'the shelves or the rooms as a Rail', 'getting there, with the hours'], close: ['visit information and the address', 'what is on next'], open: ['Showcase', 'Schedule', 'Rail', 'Split'], heroes: ['Poster', 'Ledge', 'Stage'], action: ['hours and the address in the hero', 'hours, the map and the way in at the close', 'a sticky bar with today\'s hours'] },
    attend: { sections: ['the days as a Schedule', 'the lineup as an Index, set large', 'ticket tiers as rows', 'the place and how to get there', 'questions as rows'], close: ['tickets again', 'the questions', 'the mailing list for the next edition'], open: ['Schedule', 'Index', 'Rail', 'Showcase'], heroes: ['Index', 'Poster', 'Counter', 'Ledge'], action: ['tickets in the hero', 'tickets beside the lineup', 'a sticky ticket bar'] },
    buy: { sections: ['the range as an Offer or a Rail (sample names; no prices unless given)', 'the thing in use, close and large', 'how it is made, as a Pinned run', 'delivery and care as plain facts'], close: ['the offer again', 'delivery and the guarantee as plain facts'], open: ['Offer', 'Rail', 'Showcase', 'Switcher'], heroes: ['Counter', 'Stage', 'Poster'], action: ['the offer as the hero', 'a sticky buy bar', 'the offer after the product close up'] },
    try: { sections: ['features as named moments in screens (Pinned or Switcher)', 'a before and after', 'the platforms and what it needs'], close: ['the download beside one last screen'], open: ['Pinned', 'Switcher', 'Showcase', 'Rail'], heroes: ['Counter', 'Stage', 'Settled'], action: ['the download beside the screen in the hero', 'the download in the hero and at the close'] },
    'sign up': { sections: ['the product at work as a Pinned run', 'a code sample or the integration', 'pricing as a table with its period switch', 'questions as rows'], close: ['the hero\'s action in a short band', 'the code sample'], open: ['Pinned', 'Switcher', 'Showcase', 'Bento', 'Table'], heroes: ['Stage', 'Settled', 'Banner', 'Counter'], action: ['sign up in the hero', 'sign up in the hero and beside the price'] },
    hire: { sections: ['the work as an Index of projects with pictures', 'one project opened as a case', 'what the studio does, as a short list', 'where it is'], close: ['contact details per office', 'a plain email and phone'], open: ['Index', 'Rail', 'Showcase', 'Statement'], heroes: ['Index', 'Poster', 'Corridor', 'Ledge'], action: ['the enquiry after the work', 'a contact line in the nav and at the close'] },
    join: { sections: ['what a session is like, shown', 'when and where as a Schedule', 'membership options as rows', 'first-visit guidance'], close: ['the first visit', 'the membership options'], open: ['Schedule', 'Grid', 'Split', 'Showcase'], heroes: ['Counter', 'Poster', 'Corridor'], action: ['join in the hero', 'join beside the schedule'] },
    listen: { sections: ['the record with its tracks as an Index (sample titles unless given)', 'dates as rows with ticket links', 'earlier work as covers in a Rail', 'a live photograph or the video'], close: ['the dates', 'more of the catalogue', 'the mailing list'], open: ['Index', 'Rail', 'Showcase', 'Schedule'], heroes: ['Poster', 'Index', 'Counter', 'Ledge'], action: ['the player or the record in the hero', 'listen in the hero and the dates beside it'] },
  },
  leads: { photo: ['the place', 'the thing itself, close', 'the making', 'the offer and its price', 'the season or the date', 'the people at work'], product: ['the job it does', 'the screen at work', 'the speed or the limit', 'the material it handles', 'the price', 'the before and after'], words: ['the claim', 'the question', 'the first line of the argument', 'the date and the place', 'the list itself'] },
};
function draw() {
  const material = flag('material', 'photo');
  if (!DRAW.shapes[material]) { console.error('--material is photo, product or words'); process.exit(2); }
  const seed = flag('seed', '') || randomBytes(3).toString('hex');
  const rand = seededRand(`draw·${seed}`);
  const log = readLog(flag('log', '.hallmark/log.json'));
  const low = (x) => String(x || '').toLowerCase();
  let pictured = [];
  const slug = flag('theme', '');
  if (slug && isSlug(slug) && existsSync(join(THEMES, `${slug}.md`))) pictured = low(parseHeader(readFileSync(join(THEMES, `${slug}.md`), 'utf8'), slug).pictured).split(/,\s*/).map((x) => x.replace(/ hero$/, ''));
  const recent = (k, n) => log.slice(0, n).map((r) => low(r[k]));
  const near = (opts, n, k, extra = []) => { const bad = new Set([...recent(k, n), ...extra]); const ok = opts.filter((o) => ![...bad].some((b) => b && b.includes(low(o)))); return ok.length ? ok : opts; };
  const take = (opts, m = 1) => { const pool = [...new Set(opts)]; const out = []; while (out.length < m && pool.length) out.push(pool.splice(Math.floor(rand() * pool.length), 1)[0]); return out; };
  const shapes = take(near(DRAW.shapes[material], 3, 'shape', pictured), 1);
  const jobName = low(flag('job', '')).replace(/download|app/, 'try').replace(/software|saas/, 'sign up').replace(/newsletter|waitlist/, 'subscribe').replace(/watch|read/, 'listen');
  const job = DRAW.jobs[jobName] || null;
  const [hero] = take(near(job ? [...job.heroes, ...job.heroes, ...DRAW.heroes[material].filter((h) => !/settled|stage/i.test(h) || job.heroes.includes(h))] : DRAW.heroes[material], 1, 'hero', pictured));
  const [nav] = take(near(DRAW.navs, 3, 'nav'));
  const [footer] = take(near(DRAW.footers.filter((f) => f !== 'newsletter-first' || /subscribe/.test(jobName)), 3, 'footer'));
  const [action] = job ? take(job.action) : [null];
  const native = job ? take(job.sections, 3) : [];
  const [close] = job ? take(job.close) : [null];
  const lastOpen = low((log[0] && (Array.isArray(log[0].sections) ? log[0].sections[0] : String(log[0].sections || '').split(/[,>·]/)[0])) || '');
  const [opener] = take((job ? job.open : DRAW.openers).filter((o) => !lastOpen.includes(low(o))));
  const skip = take(['Split', 'Grid', 'Band', 'Statement', 'Steps', 'Figures'].filter((o) => o !== opener), 2);
  const [lead] = take(DRAW.leads[material]);
  if (has('json')) { console.log(JSON.stringify({ seed, material, job: jobName || null, shapes, hero, nav, footer, opener, skip, lead, action, native, close })); return; }
  console.log(`draw ${seed} (fresh each build; --seed ${seed} repeats it)${pictured.length ? ` · clear of the theme picture's ${pictured.join(' and ')}` : ''}`);
  console.log(`shape: ${shapes[0]} · hero: ${hero} · nav: ${nav} · footer: ${footer}`);
  console.log(`${job ? '' : `first section after the hero: ${opener} · `}leave out this time: ${skip.join(' and ')} · the hero leads with ${lead}, if the prompt has it`);
  console.log(job ? `job: ${jobName} · the action: ${action}\nbuild these, in the order the shape suits (the first right after the hero): ${native.join('; ')} · close on: ${close} (anatomy.md § ${jobName})` : 'no --job given: name the page\'s job (subscribe, book, visit, attend, buy, try, sign up, hire, join, listen) and draw again with --job');
  console.log(`photos: pass --seed ${seed} to every theme.mjs photos call, so this build's picks are its own, and take its first fitting pick for the hero rather than hunting for the library's single best frame`);
  console.log('take the draw unless the prompt\'s material refuses a pick; name any swap in the Picks block, and stamp draw: ' + seed);
}

function deal() {
  const genre = flag('genre', 'editorial');
  if (!GENRES.includes(genre)) { console.error(`unknown genre "${genre}" (valid: ${GENRES.join(', ')})`); process.exit(2); }
  const prompt = flag('prompt', flag('brief', '')); // --brief is the older name
  const n = Number(flag('n', 3));
  const reroll = Number(flag('reroll', 0));
  const log = readLog(flag('log', '.hallmark/log.json'));
  const themes = loadIndex();
  const recent = log.slice(0, 3);
  const recentNames = new Set(recent.map((r) => String(r.theme || '').toLowerCase()));
  const lastAxes = recent[0] && recent[0].axes ? String(recent[0].axes) : null;
  const occupiedAxes = new Set(recent.map((r) => r.axes).filter(Boolean));
  const bw = new Set(promptWords(prompt).map(stem));
  const slug = `${promptWords(prompt).slice(0, 4).join('-') || 'prompt'}-${createHash('sha1').update(prompt.trim().toLowerCase()).digest('hex').slice(0, 4)}`;
  const seedBase = `${slug}·${projectSalt()}·${new Date().toISOString().slice(0, 10)}`;
  const seedKey = `${seedBase}·r${reroll}`;
  const rand = seededRand(seedBase);

  const df = new Map();
  for (const t of themes) for (const k of new Set(t.keywords.map((k) => k.toLowerCase()))) df.set(k, (df.get(k) || 0) + 1);
  const scored = themes.map((t) => {
    let fit = 0; const hits = [];
    for (const k of t.keywords) { const kw = k.toLowerCase().split(/\s+/).map(stem); if (kw.every((w) => bw.has(w))) { const d = df.get(k.toLowerCase()); fit += d <= 2 ? 3 : d <= 4 ? 2 : 1; hits.push(k); } }
    if (t.genre === genre) fit += 2; else fit -= 1;
    const blocked = recentNames.has(t.name.toLowerCase()) || (lastAxes && lastAxes === triple(t));
    const sibling = occupiedAxes.has(triple(t));
    if (sibling && !blocked) fit -= 1;
    return { t, fit, hits, blocked, sibling, r: rand() };
  });
  const pool = scored.filter((s) => !s.blocked).sort((a, b) => b.fit - a.fit || a.r - b.r);
  const previously = new Set();
  for (let r = 0; r < reroll; r++) for (const p of pickFrom(pool, n, previously)) previously.add(p.t.slug);
  const picked = pickFrom(pool, n, previously);
  if (!picked.length) { console.error(`nothing left to deal at reroll ${reroll}; use a lower --reroll`); process.exit(1); }

  if (has('json')) { console.log(JSON.stringify({ seed: seedKey, genre, deal: picked.map((s) => ({ ...s.t, fit: s.fit, hits: s.hits })), avoided: [...recentNames] })); return; }
  console.log(`deal: ${seedKey} · genre ${genre}${reroll ? ` · reroll ${reroll}` : ''}`);
  picked.forEach((s, i) => {
    const why = s.hits.length ? `fits: ${s.hits.slice(0, 4).join(', ')}` : (s.t.genre === genre ? 'genre fit' : 'adjacent genre');
    console.log(`${i + 1}. ${s.t.name} (${s.t.slug}) · ${triple(s.t)} · ${s.t.material} · ${why}${s.t.picture ? ` · ${s.t.picture}` : ''}${s.t.pictured ? `, pictured as ${s.t.pictured}` : ''}`);
  });
  if (recent.length) console.log(`avoid: ${recent.map((r) => `${r.theme || '?'} (${r.axes || 'no axes'})`).join(' · ')}`);
  console.log(`next: look at the pictures, pick the material this prompt wants, read references/themes/<slug>.md, then theme.mjs scaffold <slug> --dealt "<n>/${picked.length}, seed ${seedKey}"`);
}

const PAPER_BANDS = new Set(['light', 'mid', 'dark']);
const DISPLAY_CLASSES = new Set(['roman-serif', 'high-contrast-serif', 'slab-serif', 'grotesk-sans', 'grotesk-heavy', 'geometric-sans', 'rounded-sans', 'display-condensed', 'display-heavy', 'mono', 'pixel', 'handwritten', 'blackletter']);
const ACCENT_BAND = /^(warm|cool|neutral|chromatic-[a-z-]+)$/;
const listOf = (set) => [...set].join(', ');

function check() {
  const axes = flag('axes');
  if (!axes && !flag('face') && flag('hue') == null) { usage(); process.exit(2); }
  const [pb, dc, ab] = (axes || '//').split('/').map((s) => s.trim());
  const unknown = !axes ? null : !PAPER_BANDS.has(pb) ? `paper band "${pb}" (valid: ${listOf(PAPER_BANDS)})`
    : !DISPLAY_CLASSES.has(dc) ? `display class "${dc}" (valid: ${listOf(DISPLAY_CLASSES)})`
    : !ACCENT_BAND.test(ab || '') ? `accent band "${ab}" (valid: warm, cool, neutral, chromatic-<hue name>)` : null;
  if (unknown) { console.error(`unknown ${unknown}`); process.exit(2); }
  const face = (flag('face', '') || '').toLowerCase().trim();
  const hue = flag('hue') != null ? Number(flag('hue')) : null;
  const themes = loadIndex();
  const log = readLog(flag('log', '.hallmark/log.json'));
  let bad = 0, near = 0;
  const named = new Set();
  const look = (t) => `look at references/themes/${t.slug}.jpg beside your plan and move an axis only if the two would read alike`;
  if (axes) for (const t of themes) {
    if (t.paper.band === pb && t.display.class === dc && t.accent.band === ab) { near++; named.add(t.slug); console.log(`near: ${t.name} sits on ${triple(t)} · ${look(t)}`); }
  }
  const toks = (x) => x.split(/[\s-]+/).filter(Boolean);
  const sameFamily = (a, b) => { const A = toks(a), B = toks(b), n = Math.min(A.length, B.length); return n > 0 && A.slice(0, n).join(' ') === B.slice(0, n).join(' '); };
  if (face) for (const t of themes) {
    const tf = t.display.face.toLowerCase();
    if (sameFamily(tf, face)) { bad++; console.log(`collision: ${t.name} already sets its display in ${t.display.face} · pick a face no theme uses (fonts.md)`); }
  }
  if (hue != null) for (const t of themes) {
    // with axes: themes on the same paper and display class within 20 degrees; hue alone: any theme within 10
    if (named.has(t.slug)) continue;
    if (axes ? t.paper.band === pb && t.display.class === dc && hueGap(t.accent.hue, hue) <= 20 : hueGap(t.accent.hue, hue) <= 10) { near++; console.log(`near: ${t.name} is ${triple(t)} at hue ${t.accent.hue} · ${look(t)}`); }
  }
  const recent = axes ? log.slice(0, 3).filter((r) => r.axes === axes) : [];
  for (const r of recent) { near++; console.log(`recent: ${r.theme || 'a build'} on ${r.date || '?'} used ${axes} · vary another decision (the shape, the pictures, the type scale)`); }
  if (!bad && !near) { console.log(axes ? `clear: ${axes}${face ? ` in ${face}` : ''}${hue != null ? ` at hue ${hue}` : ''} lands on no catalog theme and no recent build` : [face && `clear: no catalog theme sets its display in ${flag('face')}`, hue != null && `clear: no catalog theme's accent sits within 10 degrees of hue ${hue}`].filter(Boolean).join('\n')); return; }
  if (bad) process.exitCode = 1;
}

function list() {
  for (const t of loadIndex()) console.log(`${t.name.padEnd(12)} ${triple(t).padEnd(38)} ${t.genre.padEnd(15)} ${t.material}`);
}

const TREATMENTS = { natural: {}, warm: { sepia: 0.28, saturate: 0.94 }, muted: { saturate: 0.65, contrast: 0.97 }, mono: { grayscale: 1, contrast: 1.18 } };
const ADJUST = { con: ['contrast', (n) => 1 + n / 100], sat: ['saturate', (n) => Math.max(0, 1 + n / 100)], vib: ['saturate', (n) => 1 + n / 200], exp: ['brightness', (n) => 1 + n / 100], high: ['brightness', (n) => 1 + n / 300], shad: ['brightness', (n) => 1 + n / 400], sepia: ['sepia', (n) => n / 100], blur: ['blur', (n) => n / 20] };
const r2 = (n) => Math.round(n * 100) / 100;

// A theme's photo: line as CSS on every picture in a slot: filter functions, and for duotone or tint a
// multiply plate under the photo and a lighten plate over it, both in the theme's own tokens.
function treatmentOf(spec, tokens) {
  const parts = String(spec || 'natural').trim().split(/\s+/);
  const f = new Map(), bad = [];
  let duo = null;
  const tok = (n) => { if (!tokens[`--color-${n}`]) bad.push(`no --color-${n} token`); return `var(--color-${n})`; };
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p in TREATMENTS) for (const [k, v] of Object.entries(TREATMENTS[p])) f.set(k, v);
    else if (p === 'duotone') { duo = [tok(parts[++i]), tok(parts[++i])]; f.set('grayscale', 1); if (!f.has('contrast')) f.set('contrast', 1.08); }
    else if (p === 'tint') { const t = tok(parts[++i]); const dark = (tokens['--color-paper'] || [1])[0] < 0.4; duo = dark ? ['var(--color-paper)', t] : [`color-mix(in oklab, ${t}, black 55%)`, `color-mix(in oklab, ${t}, white 82%)`]; f.set('grayscale', 1); }
    else if (/^[a-z]+=-?\d+$/.test(p) && p.split('=')[0] in ADJUST) { const [k, n] = p.split('='); const [fn, v] = ADJUST[k]; f.set(fn, k === 'vib' && f.has(fn) ? f.get(fn) * v(Number(n)) : v(Number(n))); }
    else bad.push(`"${p}" is not a treatment (natural, warm, muted, mono, duotone <dark> <light>, tint <token>, or con|sat|vib|exp|high|shad|sepia|blur=<n>)`);
  }
  const filter = [...f].map(([k, v]) => `${k}(${k === 'blur' ? `${r2(v)}px` : r2(v)})`).join(' ');
  const css = !filter && !duo ? '' : duo
    ? `[data-slot]:has(> img) { isolation: isolate; background: ${duo[1]}; outline: 1px solid color-mix(in oklab, var(--color-ink) 8%, transparent); outline-offset: -1px; }\n[data-slot] > img { z-index: 0; filter: ${filter}; mix-blend-mode: multiply; }\n[data-slot]:has(> img)::before { content: ""; position: absolute; inset: 0; z-index: 1; background: ${duo[0]}; mix-blend-mode: lighten; pointer-events: none; }`
    : `[data-slot] > img { filter: ${filter}; }`;
  return { css, bad };
}

function tokensOf(src, file) {
  const tok = {};
  for (const m of tokenBlockOf(src, file).matchAll(/(--color-[\w-]+):\s*oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)/g)) tok[m[1]] = [Number(m[2]) / 100, Number(m[3]), Number(m[4])];
  return tok;
}

const SYNONYMS = { cafe: ['coffee'], coffee: ['cafe', 'espresso'], restaurant: ['dining', 'dish'], bakery: ['bread', 'pastry'], bread: ['bakery', 'loaf'], wine: ['vineyard', 'grape'], cider: ['apple', 'orchard'], gin: ['botanical', 'spirit', 'distillery'], beer: ['brewery'], ski: ['snow', 'slope'], snow: ['winter'], sea: ['coast', 'ocean'], beach: ['coast', 'sea'], hotel: ['room', 'lobby'], office: ['desk', 'workspace'], studio: ['workshop'], workshop: ['studio', 'craft'], pottery: ['ceramic', 'clay'], ceramic: ['pottery', 'clay'], weaving: ['loom', 'textile'], textile: ['fabric'], fabric: ['textile'], tailor: ['sewing', 'fabric'], fashion: ['clothing'], garden: ['plant', 'flower'], farm: ['field', 'farmland'], city: ['street', 'urban'], train: ['railway', 'station'], concert: ['music', 'stage'], music: ['concert', 'record'], book: ['library', 'reading'], print: ['printing', 'press'], skate: ['skateboard', 'skatepark'], running: ['runner', 'marathon'], gym: ['fitness'], yoga: ['wellness'], lab: ['science', 'laboratory'], doctor: ['clinic', 'medical'], kid: ['child', 'children'], dog: ['pet'], cat: ['pet'] };

async function photos() {
  if (!existsSync(PHOTOS)) { console.error(`no photo library at ${PHOTOS}`); process.exit(1); }
  const lib = JSON.parse(readFileSync(PHOTOS, 'utf8')).photos;
  const subjects = positional();
  if (!subjects.length) { usage(); process.exit(2); }
  const n = Math.max(1, Number(flag('n', 3)) || 3);
  const orient = flag('orient', '');
  const slug = flag('theme', '');
  let header = null, treat = { css: '', bad: [] };
  if (slug) {
    const file = join(THEMES, `${slug}.md`);
    if (!isSlug(slug) || !existsSync(file)) { console.error(`no theme at ${file}`); process.exit(1); }
    const src = readFileSync(file, 'utf8');
    header = parseHeader(src, file);
    treat = treatmentOf(header.photo, tokensOf(src, file));
    if (treat.bad.length) console.error(`${slug}'s photo: line: ${treat.bad.join('; ')}`);
  }
  const recent = new Set(readLog(flag('log', '.hallmark/log.json')).slice(0, 5).flatMap((r) => Array.isArray(r.photos) ? r.photos : []));
  const avoidText = flag('avoid', '') && existsSync(flag('avoid', '')) ? readFileSync(flag('avoid', ''), 'utf8') : '';
  const avoid = { has: (id) => !!avoidText && (avoidText.includes(id) || avoidText.includes(id.replace(/ /g, '_'))) };
  const shape = (p) => { const r = p.w / p.h; return r > 1.18 ? 'landscape' : r < 0.85 ? 'portrait' : 'square'; };
  const PHOTO_STOP = new Set(['seen', 'from', 'with', 'into', 'onto', 'over', 'under', 'behind', 'above', 'below', 'beside', 'near', 'close', 'view', 'shot', 'photo', 'image', 'picture', 'some', 'very', 'one', 'two', 'three', 'each', 'every', 'its', 'their', 'his', 'her', 'who', 'where', 'while', 'up', 'down', 'out']);
  const docs = lib.map((p) => { const t = new Set(); for (const x of p.tags) for (const w of words(x)) t.add(stem(w)); for (const w of words(p.subject)) t.add(stem(w)); t.add(stem(p.cat)); return t; });
  const df = new Map(); for (const d of docs) for (const w of d) df.set(w, (df.get(w) || 0) + 1);
  const idf = (w) => Math.log((lib.length + 1) / ((df.get(w) || 0) + 1)) + 0.3;
  // Close scores rotate from build to build, so two pages on one subject rarely share their photographs; --seed repeats a pick.
  const jitter = seededRand(`photos·${flag('seed', '') || randomBytes(3).toString('hex')}`);
  const used = new Set();
  const result = [];
  for (const subject of subjects) {
    const q = [...new Set(promptWords(subject).map(stem))].filter((w) => !PHOTO_STOP.has(w));
    const total = q.reduce((a, w) => a + idf(w), 0) || 1;
    const wantFace = /\b(portrait|face|person|people)\b/i.test(subject);
    const scored = lib.map((p, i) => {
      if (used.has(p.id) || avoid.has(p.id) || (orient && shape(p) !== orient)) return null;
      const d = docs[i]; let got = 0; const missing = [];
      for (const w of q) {
        if (d.has(w)) got += idf(w);
        else if ((SYNONYMS[w] || []).some((x) => d.has(stem(x)))) got += 0.7 * idf(w);
        else if ([...d].some((x) => { let k = 0; while (k < x.length && k < w.length && x[k] === w[k]) k++; return k >= 5 || (k >= 4 && Math.max(x.length, w.length) <= 6 && k >= 0.8 * Math.min(x.length, w.length)); })) got += 0.8 * idf(w);
        else missing.push(w);
      }
      const cov = got / total;
      if (cov < 0.45) return null;
      let s = cov * 10;
      for (const t of p.tags) if (t.includes(' ') && subject.toLowerCase().includes(t)) s += 1;
      if (p.q === 3) s += 0.8;
      if (p.tags.includes('overused')) s -= 0.8;
      if (p.people === 'face' && !wantFace) s -= 3;
      if (recent.has(p.id)) s -= 4;
      s += jitter() * (flag('seed', '') ? 4 : 2.5);
      if (header) { if (header.paper.band === 'dark' && p.tone !== 'light') s += 0.3; if (header.paper.band === 'light' && p.tone !== 'dark') s += 0.15; if ((header.accent.band === 'warm') === (p.temp === 'warm')) s += 0.2; }
      return { p, s, cov, missing };
    }).filter(Boolean).sort((a, b) => b.s - a.s).slice(0, n);
    for (const { p } of scored) used.add(p.id);
    result.push({ subject, picks: scored.map(({ p, s, cov, missing }) => ({ ...p, orient: shape(p), score: Math.round(s * 10) / 10, match: cov >= 0.75 ? 'close' : 'partial', ...(missing.length ? { missing } : {}), sizes: widthsOf(p), credit: creditOf(p) })) });
  }
  const saveDir = flag('save', '');
  if (saveDir) {
    mkdirSync(resolve(saveDir), { recursive: true });
    for (const r of result) for (const p of r.picks) {
      const w = p.sizes[p.sizes.length - 1];
      const file = join(resolve(saveDir), `${savedName(p.id)}-${w}.jpg`);
      try {
        const url = thumbOf(p, w);
        if (!url.startsWith('https://upload.wikimedia.org/')) throw new Error('not a Wikimedia Commons file');
        let res;
        for (let t = 0; t < 4; t++) { res = await fetch(url, { headers: { 'User-Agent': 'Hallmark/2.0 (https://github.com/Nutlope/hallmark; theme.mjs photos --save)' }, signal: AbortSignal.timeout(60000) }); if (res.status !== 429) break; await new Promise((ok) => setTimeout(ok, 10000 * (t + 1))); }
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        if (!/^image\//.test(res.headers.get('content-type') || '')) throw new Error(`not an image (${res.headers.get('content-type') || 'no content-type'})`);
        writeFileSync(file, Buffer.from(await res.arrayBuffer())); p.saved = file;
      } catch (e) { p.saved = null; p.error = String(e.message || e); }
    }
  }
  if (has('json')) { console.log(JSON.stringify({ theme: slug || null, treatment: header ? header.photo || 'natural' : null, subjects: result })); return; }
  if (header) console.log(`treatment: ${header.photo || 'natural'} (${slug})${treat.css ? '. It is CSS on every picture in a slot, written into base.css by the scaffold; a page built without it adds:\n' + treat.css : ', no filter'}`);
  for (const r of result) {
    console.log(`\n"${r.subject}"${r.picks.length ? '' : ': nothing in the library fits; try other words (the place, the material, the action), or leave a slot for the user\'s photo'}`);
    for (const p of r.picks) {
      const src = p.saved || thumbOf(p, p.sizes.includes(1280) ? 1280 : p.sizes[p.sizes.length - 1]);
      const set = p.saved ? '' : ` srcset="${p.sizes.map((w) => `${thumbOf(p, w)} ${w}w`).join(', ')}"`;
      const pos = p.fp ? ` style="object-position: ${Math.round(p.fp[0] * 100)}% ${Math.round(p.fp[1] * 100)}%"` : '';
      console.log(`  ${p.subject} · ${p.w}x${p.h} ${p.orient} · ${p.tone}, ${p.temp}${p.people !== 'none' ? `, ${p.people}` : ''}${p.match === 'partial' ? ` · partial match, no ${p.missing.join(', ')}` : ''}${p.error ? ` · not saved: ${p.error}` : ''}`);
      const [iw, ih] = p.saved ? [p.sizes[p.sizes.length - 1], Math.round(p.h * p.sizes[p.sizes.length - 1] / p.w)] : [p.w, p.h];
      console.log(`    <img src="${src}"${set}${p.saved ? '' : ' sizes="100vw"'} width="${iw}" height="${ih}" alt="${p.subject}"${pos}>`);
      console.log(`    credit: ${p.credit}`);
    }
  }
  console.log('\nset sizes to the layout (50vw for a half, 100vw full-bleed) and crop with the frame (aspect-ratio and object-fit: cover; object-position keeps the subject). Every photo carries its credit on the page: one line in the footer, "Photographs: <credit>, <credit>", each linked to its page (imagery.md § 2). Log the ids in the entry\'s photos list.');
}

const WIDTHS = [960, 1280, 1920];
// The file name --save writes, which sloplint maps back to the library entry for its credit.
function savedName(id) { return id.replace(/\.[a-z]+$/i, '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || `photo-${createHash('sha1').update(id).digest('hex').slice(0, 10)}`; }
// Commons serves thumbnails at standard widths only, and none at or past the original's width.
function widthsOf(p) { const w = WIDTHS.filter((x) => x < p.w); return w.length ? w : [WIDTHS[0]]; }
function thumbOf(p, w) {
  const name = p.file.split('/').pop();
  return `${p.file.replace('/wikipedia/commons/', '/wikipedia/commons/thumb/')}/${w}px-${p.thumbName || name}`;
}
function creditOf(p) { return `<a href="${p.page}">${p.author}</a> (${p.license}, Wikimedia Commons)`; }

function tokenBlockOf(src, file) {
  const m = /```css\s*\n:root\s*\{([\s\S]*?)\n\}\s*\n```/.exec(src);
  if (!m) throw new Error(`${file}: no :root block in a css fence`);
  return m[1].replace(/\/\*[\s\S]*?\*\//g, '').split('\n').map((l) => l.replace(/\s+$/, '')).filter((l) => l.trim()).join('\n');
}

const SCALE = `  --space-3xs: 2px; --space-2xs: 4px; --space-xs: 8px; --space-sm: 12px; --space-md: 16px; --space-lg: 24px; --space-xl: 40px; --space-2xl: 64px; --space-3xl: 96px; --space-4xl: 144px;
  --text-xs: 0.8125rem; --text-sm: 0.875rem; --text-md: 1rem; --text-lg: 1.25rem; --text-xl: 1.5625rem; --text-2xl: 1.953rem; --text-3xl: 2.441rem;
  --text-display-s: clamp(2.25rem, 4vw + 0.5rem, 3.75rem); --text-display: clamp(2.75rem, 5vw + 1rem, 5.25rem);
  --text-section: clamp(2rem, 2.5vw + 1rem, 3.5rem); --text-title: clamp(1.25rem, 0.75vw + 0.875rem, 1.625rem); --text-lead: clamp(1.125rem, 0.35vw + 1rem, 1.375rem);
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1); --ease-in: cubic-bezier(0.7, 0, 0.84, 0); --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --dur-micro: 120ms; --dur-short: 220ms; --dur-long: 420ms;
  --color-error: oklch(52% 0.19 27); --color-success: oklch(50% 0.12 150);
  --container: 1440px; --gutter: 64px; --gap-columns: 32px; --section-gap-s: 120px; --section-gap: 144px; --section-gap-l: 176px;
  --z-base: 1; --z-raised: 10; --z-dropdown: 100; --z-sticky: 200; --z-sticky-nav: 300; --z-modal: 400; --z-toast: 500; --z-tooltip: 600;`;

const CUSTOM_TOKENS = `  --color-paper: FILL ME; --color-paper-2: FILL ME; --color-paper-3: FILL ME;
  --color-ink: FILL ME; --color-ink-2: FILL ME; --color-muted: FILL ME;
  --color-rule: FILL ME;
  --color-accent: FILL ME; --color-accent-ink: FILL ME; --color-focus: FILL ME;
  --font-display: "FILL ME", ui-serif, serif; --font-body: "FILL ME", ui-sans-serif, system-ui, sans-serif; --font-outlier: var(--font-body);
  --radius-card: 4px; --radius-pill: 999px; --rule-hair: 1px; --shadow-card: none;
  --tracking-display: -0.02em;`;

const BASE = `*, *::before, *::after { box-sizing: border-box; }
html, body { overflow-x: clip; }
html { scrollbar-color: var(--color-muted) var(--color-paper); scroll-padding-top: var(--space-3xl); }
body { margin: 0; background: var(--color-paper); color: var(--color-ink); font-family: var(--font-body); font-size: var(--text-md); line-height: 1.55; -webkit-font-smoothing: antialiased; caret-color: var(--color-accent); }
::selection { background: color-mix(in oklab, var(--color-accent) 22%, transparent); color: var(--color-ink); }
:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
a { color: inherit; text-decoration-thickness: 1px; text-underline-offset: 0.16em; }
h1, h2, h3 { margin: 0; font-family: var(--font-display); font-weight: var(--display-weight, 700); font-synthesis: none; letter-spacing: var(--tracking-display); line-height: 1.05; overflow-wrap: break-word; min-width: 0; text-wrap: balance; }
h1 { max-width: 20ch; font-size: var(--text-display); } h2 { max-width: 30ch; font-size: var(--text-section); } h3 { max-width: 40ch; font-size: var(--text-title); line-height: 1.2; }
.lead { font-size: var(--text-lead); line-height: 1.45; max-width: 52ch; }
p { margin: 0; text-wrap: pretty; }
p:not([class]) { max-width: 65ch; }
img, video { max-width: 100%; height: auto; display: block; }
svg { display: block; }
[hidden] { display: none !important; }
button, input, select, textarea { font: inherit; }
.container { width: 100%; max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); box-sizing: border-box; }
.num, .figure, td.num { font-variant-numeric: tabular-nums; }
.visually-hidden { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
[data-slot] { position: relative; overflow: hidden; background: linear-gradient(160deg, var(--color-paper-2, var(--color-paper)), var(--color-paper-3, var(--color-paper))); }
[data-slot] > img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; }
[data-slot]:has(> img) > :not(img):not([data-keep]) { display: none !important; }
@media (max-width: 60rem) { :root { --gutter: 24px; --section-gap-s: 80px; --section-gap: 96px; --section-gap-l: 120px; } }
@media (max-width: 40rem) { :root { --gutter: 16px; --section-gap-s: 56px; --section-gap: 72px; --section-gap-l: 96px; --gap-columns: 16px; } }
@media (prefers-reduced-motion: reduce) { *:not(.keep-motion), *:not(.keep-motion)::before, *:not(.keep-motion)::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }`;

// A custom run sets its own type: its base keeps the Floor's rules and drops the heading sizes, weight, leading and measure.
const BASE_CUSTOM = BASE.replace(/^h1, h2, h3 \{[^}]*\}$/m, 'h1, h2, h3 { margin: 0; font-family: var(--font-display); font-synthesis: none; overflow-wrap: break-word; min-width: 0; text-wrap: balance; }').replace(/^h1 \{ max-width[^\n]*\n/m, '').replace(/^\.lead \{[^\n]*\n/m, '');

const SLOTS_JS = `window.hallmarkSlots = (m) => { for (const [k, v] of Object.entries(m)) { const s = document.querySelector(\`[data-slot="\${k}"]\`); if (!s) continue; const im = new Image(); im.src = typeof v === 'string' ? v : v.src; im.alt = (typeof v === 'object' && v.alt) || s.dataset.alt || ''; s.querySelectorAll(':scope > img').forEach((o) => o.remove()); s.prepend(im); } };\ndocument.querySelectorAll('[data-slot] img').forEach((i) => { if (i.complete && !i.naturalWidth) i.remove(); else i.addEventListener('error', () => i.remove(), { once: true }); });`;

function scaffold() {
  const brand = has('brand');
  const custom = has('custom') || brand;
  const depth = flag('redesign', '');
  if (depth && !['polish', 'restyle', 'full'].includes(depth)) { console.error('--redesign takes polish, restyle or full'); process.exit(2); }
  const tail = depth ? ` · redesign: ${depth}` : '';
  const slug = custom ? null : positional()[0];
  if (!custom && !slug) { usage(); process.exit(2); }
  const app = flag('scope', '') === 'app';
  const sheet = ['src/index.css', 'src/app/globals.css', 'app/globals.css', 'src/styles/globals.css', 'styles/globals.css', 'src/styles/global.css', 'src/main.css', 'src/styles.css', 'src/global.css', 'src/app.css', 'src/App.css', 'app/app.css'].find((f) => existsSync(f));
  const dir = resolve(flag('dir', sheet ? dirname(sheet) : '.'));
  let name = 'custom world';
  let tokens = CUSTOM_TOKENS;
  let header = null;
  if (!custom) {
    const file = join(THEMES, `${slug}.md`);
    if (!isSlug(slug) || !existsSync(file)) { console.error(`no theme at ${file}; run \`theme.mjs list\` for the slugs`); process.exit(1); }
    const src = readFileSync(file, 'utf8');
    header = parseHeader(src, file);
    name = header.name;
    tokens = tokenBlockOf(src, file);
  }
  const out = join(dir, 'tokens.css');
  const baseOut = join(dir, 'base.css');
  for (const f of [out, baseOut]) if (existsSync(f) && !has('force')) { console.error(`${f} exists; pass --force to overwrite it`); process.exit(1); }
  mkdirSync(dir, { recursive: true });
  const dark = header && header.paper.band === 'dark';
  const sized = app ? SCALE.replace(/  --text-xs:[^\n]*\n  --text-display-s:[^\n]*\n  --text-section:[^\n]*\n/, '  --text-xs: 0.75rem; --text-sm: 0.875rem; --text-md: 1rem; --text-lg: 1.2rem; --text-xl: 1.44rem; --text-2xl: 1.728rem; --text-3xl: 2.074rem;\n  --text-display-s: 1.44rem; --text-display: 1.728rem; --text-section: 1.2rem; --text-title: 1rem; --text-lead: 1rem;\n') : SCALE;
  const scale = dark ? sized.replace('--color-error: oklch(52% 0.19 27); --color-success: oklch(50% 0.12 150);', '--color-error: oklch(72% 0.15 27); --color-success: oklch(76% 0.13 150);') : sized;
  const sheetSrc = sheet ? readFileSync(sheet, 'utf8') : '';
  const tw = /@import\s+["']tailwindcss/.test(sheetSrc);
  const tw3 = !tw && /@tailwind\s+(?:base|utilities)\b/.test(sheetSrc);
  const scheme = header ? `  color-scheme: ${dark ? 'dark' : 'light'};\n` : '';
  const decls = `${scale}\n${tokens}`.split(/;(?![^()]*\))(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((d) => d.trim()).filter(Boolean);
  const themed = decls.filter((d) => /^--(color|font|text|tracking|radius|shadow|ease)-/.test(d));
  const css = tw
    ? `@theme static {\n${themed.map((d) => `  ${d};`).join('\n')}\n}\n:root {\n${scheme}${decls.filter((d) => !themed.includes(d)).map((d) => `  ${d};`).join('\n')}\n}\n`
    : `:root {\n${scheme}${scale}\n${tokens}\n}\n`;
  writeFileSync(out, css);
  const own = !custom && /## Build hint[\s\S]*?(::selection\s*\{[^}]*\})/.exec(readFileSync(join(THEMES, `${slug}.md`), 'utf8'));
  const base = own ? BASE.replace(/::selection \{[^}]*\}/, own[1].replace(/\s+/g, ' ')) : custom && !brand ? BASE_CUSTOM : BASE;
  const steps = base.split('\n').filter((l) => /^@media[^{]*\{\s*:root/.test(l));
  const photo = custom ? '' : treatmentOf(header.photo, tokensOf(readFileSync(join(THEMES, `${slug}.md`), 'utf8'), slug)).css;
  writeFileSync(baseOut, (tw ? base.split('\n').filter((l) => !steps.includes(l)).join('\n') : base) + (photo ? `\n/* photographs: ${header.photo} */\n${photo}` : '') + '\n');
  if (tw) writeFileSync(out, readFileSync(out, 'utf8') + steps.join('\n') + '\n');
  const src = custom ? '' : readFileSync(join(THEMES, `${slug}.md`), 'utf8');
  const dial = /stated in the stamp \(`([a-z0-9-]+):/.exec(src);
  const theme = brand ? 'brand' : custom ? 'custom' : `${name} (${flag('dealt', '') ? `deal ${flag('dealt', '')}` : 'by request'})`;
  const made = custom ? `\n * paper: oklch(<>) · accent: oklch(<>) · display: <face> · body: <face>` : '';
  const axes = custom ? '<paper>/<display>/<accent> · posture: <posture>' : `${triple(header)} · posture: ${header.posture}`;
  const kept = depth ? ', or kept' : '';
  const stamp = app
    ? `/* Hallmark · shape: app screen · genre: ${header ? header.genre : '<genre>'} · theme: ${theme}${tail}${made}\n * nav: <the shell${kept}> · signature: <the one object${kept}> · states: <the ones the screens have>${dial ? ` · ${dial[1]}: <the dials>` : ''}\n * axes: ${axes} · contrast: pass · v${VERSION} */`
    : brand
    ? `/* Hallmark · shape: <shape, or kept> · genre: <genre> · theme: brand${tail}${made} · hero: <posture, or kept> · nav: <shape, or kept> · footer: <shape, or kept> · signature: <the one move, or kept>\n * axes: ${axes} · contrast: pass · fold: pass · v${VERSION} */`
    : custom
    ? `/* Hallmark · shape: <your name for the structure> · genre: <genre> · theme: custom${tail} · job: <subscribe|book|visit|attend|buy|try|sign up|hire|join|listen> · idea: "<one sentence>" · vibe: "<4 to 8 words>"${made} · hero: <in your own words> · nav: <shape> · footer: <shape> · imagery: <photographs, the product, or none> · signature: <the one thing a visitor remembers>\n * axes: ${axes} · contrast: pass · fold: pass · v${VERSION} */`
    : `/* Hallmark · shape: <shape${kept}> · genre: ${header.genre} · theme: ${theme}${tail}${depth ? '' : ' · job: <subscribe|book|visit|attend|buy|try|sign up|hire|join|listen> · draw: <seed>'}\n * hero: <posture${kept}> · nav: <shape${kept}> · footer: <shape${kept}> · imagery: <photographs, the product, or none> · signature: <the one move>${dial ? ` · ${dial[1]}: <the dials>` : ''}\n * axes: ${axes} · contrast: pass · fold: pass · v${VERSION} */`;
  console.log(`wrote ${out} (${brand ? 'the shared scale; fill every --color-* and --font-* from the palette and faces the pre-flight found' : custom ? 'a starting scale, yours to rewrite; fill every --color-* and --font-* before building' : `${name} tokens plus the shared scale`}) and ${baseOut} (the base rules the Floor already decided)${sheet && !flag('dir', '') ? `, beside ${sheet}` : ''}`);
  if (!custom && !flag('dealt', '')) {
    const pic = join(THEMES, `${slug}.jpg`);
    if (existsSync(pic)) console.log(`look at ${pic}: the material at full size${header.pictured ? `, from a page built as ${header.pictured}` : ''}. Take its palette balance, type voice and surfaces, never its layout; the room and the sections are layout.md.`);
  }
  console.log('');
  console.log('start the page\'s stylesheet with these lines, then write only the page:');
  console.log(stamp);
  console.log('/* Hallmark · pre-emit critique: P_ H_ E_ S_ R_ V_ · weakest: _, <what you did about it> */');
  console.log(tw || tw3 ? '@import "./tokens.css";' : '@import url("./tokens.css");');
  console.log(tw || tw3 ? '@import "./base.css" layer(base);' : '@import url("./base.css");');
  if (tw3) console.log('Tailwind 3: the stamp and both imports go above the @tailwind directives; an @import below them is dropped without an error.');
  if (tw) console.log('Tailwind 4: both imports go below @import "tailwindcss". tokens.css is written as an @theme block, so every colour, face, size, radius, shadow and ease is a utility (bg-paper, font-display, rounded-card); export-formats.md § Tailwind v4 has the names it shares with Tailwind.');
  if (app) return;
  console.log('');
  console.log('and, only if the page has data-slot containers, once before </body>:');
  console.log(`<script>${SLOTS_JS}</script>`);
  console.log('');
  console.log(`pictures (imagery.md): node ${join(HERE, 'theme.mjs')} photos "<subject>" ["<subject>" ...]${slug ? ` --theme ${slug}` : ''}`);
}

function validate(files) {
  let bad = 0;
  for (const f of files) {
    try {
      const src = readFileSync(f, 'utf8');
      const e = parseHeader(src, f);
      const problems = [];
      if (!PAPER_BANDS.has(e.paper.band)) problems.push(`paper band ${e.paper.band}`);
      if (!DISPLAY_CLASSES.has(e.display.class)) problems.push(`display class ${e.display.class}`);
      if (!ACCENT_BAND.test(e.accent.band)) problems.push(`accent band ${e.accent.band}`);
      if (!['editorial', 'modern-minimal', 'atmospheric', 'playful'].includes(e.genre)) problems.push(`genre ${e.genre}`);
      if (!['restrained', 'committed', 'full-palette', 'drenched'].includes(e.posture)) problems.push(`posture ${e.posture}`);
      if (e.keywords.length < 8) problems.push(`only ${e.keywords.length} keywords`);
      if (/[\u2014\u2013]/.test(src)) problems.push('contains an em or en dash');
      if (Buffer.byteLength(src) > 8000) problems.push(`${Buffer.byteLength(src)} bytes, over 8,000`);
      for (const sec of ['Tokens', 'Type', 'Surfaces', 'Range', 'Controls', 'Motion', 'Voice', 'Do-nots', 'Build hint']) if (!new RegExp(`^## ${sec}\\b`, 'm').test(src)) problems.push(`missing the ${sec} section`);
      if (!/^photo:/m.test(src)) problems.push('no photo: line in the header (natural, warm, muted, mono, duotone <dark> <light> or tint <token>, imagery.md § 5)');
      else { const t = treatmentOf(/^photo:\s*(.*)$/m.exec(src)[1], tokensOf(src, f)); if (t.bad.length) problems.push(`photo: ${t.bad.join('; ')}`); }
      if (/\b(?:hand-built|hand-drawn|drawn) (?:svg|illustration|object|figure)|\bsvg (?:illustration|drawing|figure)/i.test(src)) problems.push('prescribes a drawn illustration (imagery.md § 7, gate 80)');
      for (const m of src.matchAll(/https:\/\/api\.fontshare\.com\/v2\/css\?[^"'\s>]*/g)) if ((m[0].match(/f\[\]=/g) || []).length > 1) problems.push('a Fontshare link loading more than one family (Fontshare may drop all but the first; use one link per family)');
      if (/^signature:/m.test(src)) problems.push('a signature: line in the header (a theme is a material; the page finds its signature in the prompt)');
      if (/object family|the one object|signature object|signature move/i.test(src)) problems.push('names an object or a signature move (a theme carries no components)');
      if (/\b(?:generous|plenty of) (?:air|whitespace|white space)|(?:air|whitespace|white space|space) (?:carr(?:y|ies)|doing|does) (?:the|every)/i.test(src)) problems.push('a rule about space (layout.md owns room and density)');
      if (/--tracking-label/.test(src)) problems.push('declares --tracking-label (labels are untracked, gate 67)');
      if (/font-variant(-caps)?:\s*[a-z-]*small-caps|small caps|small capitals|small-caps/i.test(src)) problems.push('prescribes small caps (gate 67)');
      if (/eyebrow|kicker|overline/i.test(src)) problems.push('names an eyebrow (gate 54)');
      if (/→|Learn more/.test(src)) problems.push('arrow or Learn-more copy (gate 63)');
      for (const m of src.matchAll(/^[^\n]*text-transform:\s*uppercase[^\n]*$/gm)) {
        const line = m[0];
        const ls = /letter-spacing:\s*(-?[\d.]+)em/.exec(line);
        const isDisplay = /\.display|h1|h2|\.marquee|wordmark/.test(line);
        if (ls && parseFloat(ls[1]) > 0.045) problems.push(`uppercase tracked ${ls[1]}em in the build hint (gate 67)`);
        else if (!isDisplay && /label|caption|meta|\bth\b|small|tag|chip|badge|nav|count/.test(line)) problems.push(`uppercase label rule in the build hint: ${line.trim().slice(0, 60)} (gate 67)`);
      }
      const hint = (/## Build hint[\s\S]*?```css\n([\s\S]*?)```/.exec(src) || [])[1] || '';
      for (const m of hint.matchAll(/(?:transition|animation)[^;{}]*?\b(\d{2,3})ms\b/g)) problems.push(`raw duration ${m[1]}ms in the build hint (use --dur-micro, --dur-short or --dur-long)`);
      if (/(?:transition|animation)[^;{}]*(?<![-\w])ease(?:-in-out|-in|-out)?\b/.test(hint)) problems.push('bare ease keyword in the build hint (use --ease-out, --ease-in or --ease-in-out)');
      for (const m of hint.matchAll(/(?<![-\w])(black|white)\b(?!-)/g)) problems.push(`named colour ${m[1]} in the build hint (route it through a token)`);
      for (const m of hint.matchAll(/\b(?:padding|margin|gap|row-gap|column-gap)(?:-[a-z-]+)?\s*:\s*([^;{}]+)/g)) {
        const raw = m[1].replace(/var\([^)]*\)/g, ' ').replace(/calc\([^)]*\)/g, ' ');
        for (const px of raw.match(/(?<![\w.-])(\d+)px\b/g) || []) if ([2, 4, 8, 12, 16, 24, 40, 64, 96, 144].includes(parseInt(px, 10))) problems.push(`raw ${px} spacing in the build hint where a --space-* token exists (24a)`);
      }
      const fence = tokenBlockOf(src, f);
      if (/\/\*/.test(fence)) problems.push('comment inside the token block');
      if (!existsSync(f.replace(/\.md$/, '.jpg'))) console.log(`${f}: note, no picture yet (scripts/picture.mjs)`);
      if (!/waive 22/.test(src)) for (const m of fence.matchAll(/(--color-(?:paper|paper-2|paper-3|ink|ink-2|muted|rule|rule-2)):\s*oklch\(\s*[\d.]+%\s+([\d.]+)/g)) if (Number(m[2]) < 0.005) problems.push(`${m[1]} chroma ${m[2]} is under the 0.005 floor (gate 22), or the file names waive 22`);
      for (const k of ['--color-paper', '--color-ink', '--color-muted', '--color-rule', '--color-accent', '--color-accent-ink', '--color-focus', '--font-display', '--font-body', '--radius-card', '--tracking-display', '--display-weight']) if (!fence.includes(k + ':')) problems.push(`token block lacks ${k}`);
      const tok = {};
      for (const m of fence.matchAll(/(--color-[\w-]+):\s*oklch\(\s*([\d.]+)%\s+([\d.]+)\s+([\d.]+)\s*\)/g)) tok[m[1]] = [Number(m[2]) / 100, Number(m[3]), Number(m[4])];
      const pairs = [['--color-ink-2', '--color-paper'], ['--color-muted', '--color-paper'], ['--color-muted', '--color-paper-2'], ['--color-accent-ink', '--color-accent']];
      for (const [fg, bg] of pairs) if (tok[fg] && tok[bg]) { const r = contrastOf(tok[fg], tok[bg]); if (r < 4.5) problems.push(`${fg} on ${bg} is ${r.toFixed(2)}:1, under 4.5 (gate 40)`); }
      if (problems.length) { bad++; console.log(`${f}: ${problems.join('; ')}`); } else console.log(`${f}: ok (${e.name}, ${triple(e)}, ${src.length} bytes)`);
    } catch (err) { bad++; console.log(`${f}: ${err.message}`); }
  }
  process.exitCode = bad ? 1 : 0;
}

try {
  if (cmd === 'deal') deal();
  else if (cmd === 'draw') draw();
  else if (cmd === 'check') check();
  else if (cmd === 'scaffold') scaffold();
  else if (cmd === 'log') addLog();
  else if (cmd === 'photos') await photos();
  else if (cmd === 'index') { const e = buildIndex(); console.log(`indexed ${e.length} themes into ${INDEX}`); }
  else if (cmd === 'list') list();
  else if (cmd === 'validate') {
    const files = args.slice(1).filter((a) => !a.startsWith('--') && basename(a) !== 'README.md');
    if (!files.length) { usage(); process.exit(2); }
    validate(files);
  }
  else { usage(); process.exit(2); }
} catch (e) {
  console.error(String(e.message || e)); process.exit(1);
}
