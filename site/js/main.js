// Hallmark — landing-page interactions.
// Sticky banner theme picker + per-theme component archetype swap.
// Dogfoods the patterns in references/microinteractions.md.

const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Reveal/scroll-in animations are disabled by design — every .reveal
   element renders in its final state on load so scrolling reads clean. */
document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));

/* — Hover-to-play videos —————————————————————————————————
   Videos with data-hover-play render as static first-frame on desktop
   (hover-capable devices) and only play while the pointer is over the
   card. On touch devices (no hover), they autoplay continuously so the
   page reads as a moving showcase on mobile. */
{
  const supportsHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const videos = document.querySelectorAll("video[data-hover-play]");

  if (supportsHover) {
    videos.forEach((video) => {
      // Pause + reset to first frame on load (desktop static preview).
      video.removeAttribute("autoplay");
      try { video.pause(); video.currentTime = 0; } catch (_) {}

      const card = video.closest(".ex-card, .diptych__half") || video.parentElement;
      if (!card) return;

      const onEnter = () => { video.play().catch(() => {}); };
      const onLeave = () => { video.pause(); try { video.currentTime = 0; } catch (_) {} };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      card.addEventListener("focusin",   onEnter);
      card.addEventListener("focusout",  onLeave);
    });
  }
  // On touch devices, the autoplay attribute already runs the loop.
}

/* — Theme registry ————————————————————————————————————— */
const THEMES = {
  hum: "Hum",
  specimen: "Specimen",
  midnight: "Midnight",
  brutal: "Brutal",
  garden: "Garden",
  atelier: "Atelier",
  newsprint: "Newsprint",
  terminal: "Terminal",
  manifesto: "Manifesto",
  almanac: "Almanac",
  sport: "Sport",
  studio: "Studio",
  riso: "Riso",
  bloom: "Bloom",
  coral: "Coral",
  aurora: "Aurora",
  editorial: "Editorial",
  carnival: "Carnival",
  lumen: "Lumen",
  cobalt: "Cobalt",
  grid: "Grid",
  field: "Field",
  ledger: "Ledger",
  arcade: "Arcade",
};
const STORAGE_KEY = "hallmark-theme";

/* — Theme → archetype tuple map ——————————————————————————
   Each theme picks one cookbook entry per slot. The point is structural
   variety: switching themes literally rebuilds the page, not just
   recolours it. See references/component-cookbook.md. */
const ARCHETYPES = {
  specimen: { hero: "marquee", footer: "colophon" },
  newsprint: { hero: "split", footer: "colophon" },
  atelier: { hero: "quote-led", footer: "colophon" },
  garden: { hero: "letter", footer: "colophon" },
  almanac: { hero: "stat-led", footer: "colophon" },
  midnight: { hero: "stat-led", footer: "colophon" },
  terminal: { hero: "marquee", footer: "colophon" },
  brutal: { hero: "marquee", footer: "colophon" },
  manifesto: { hero: "marquee", footer: "colophon" },
  sport: { hero: "stat-led", footer: "colophon" },
  studio: { hero: "letter", footer: "colophon" },
  riso: { hero: "quote-led", footer: "colophon" },
  bloom: { hero: "marquee", footer: "colophon" },
  coral: { hero: "split", footer: "colophon" },
  aurora: { hero: "marquee", footer: "colophon" },
  editorial: { hero: "split", footer: "colophon" },
  carnival: { hero: "marquee", footer: "colophon" },
  lumen: { hero: "marquee", footer: "colophon" },
  hum: { hero: "hum", footer: "colophon" },
  cobalt: { hero: "cobalt", footer: "colophon" },
  grid: { hero: "marquee", footer: "colophon" },
  field: { hero: "split", footer: "colophon" },
  ledger: { hero: "stat-led", footer: "colophon" },
  arcade: { hero: "marquee", footer: "colophon" },
};

/* — Theme → genre map ——————————————————————————————————
   Each theme belongs to one of four genres — a rule-set overlay that
   scopes which slop-test gates apply and which voice fixtures the
   skill picks from. See references/genres/. */
const THEME_GENRES = {
  // editorial — the canonical Hallmark voice
  specimen:  "editorial",
  newsprint: "editorial",
  atelier:   "editorial",
  garden:    "editorial",
  almanac:   "editorial",
  studio:    "editorial",
  riso:      "editorial",
  sport:     "editorial",
  brutal:    "editorial",
  manifesto: "editorial",
  // modern-minimal — Stripe / Linear / ElevenLabs school
  coral:     "modern-minimal",
  cobalt:    "modern-minimal",
  // atmospheric — Suno / Runway / dark-AI-tool school
  bloom:     "atmospheric",
  midnight:  "atmospheric",
  terminal:  "atmospheric",
  aurora:    "atmospheric",
  // editorial — premium magazine register
  editorial: "editorial",
  // new themes
  carnival:  "editorial",
  lumen:     "atmospheric",
  hum:       "playful",
  // v1.2 themes
  grid:      "editorial",       // the Swiss / grotesque exception in the editorial cluster
  ledger:    "modern-minimal",  // the cluster's one dark option, next to light Coral / Cobalt
  field:     "playful",
  arcade:    "playful",
};

/* — Locked hero title —————————————————————————————————
   The H1 string is the same across every theme. Only the visual
   treatment swaps — italic vs roman, serif vs sans, all-caps vs not.
   The page is the demo: one sentence, twenty distinct designs. */
const HERO_TITLE = "A design skill that refuses to look AI-generated.";

/* — Per-theme copy fixtures —————————————————————————————
   Distinct voice per theme so the page doesn't read like the same
   page in different fonts. The `title` is locked across themes;
   eyebrow, lede, quote, stat, salutation, etc. still vary. */
const COPY = {
  specimen: {
    eyebrow: "A design skill",
    title: HERO_TITLE,
    lede: "Hallmark is a skill for Claude Code, Cursor, and Codex. It encodes the anti-slop consensus — typography, colour, layout, motion, interaction — into one holistic ruleset your AI assistant will actually follow.",
    ctaLabel: "01 ⁄ Install",
    proofLabel: "Proof",
    proofA: "21 macrostructures · 50 archetypes",
    proofB: "14 navs · 8 footers · 4 hero polish",
    proofC: "58-gate slop test",
    cta: "Read the rules",
    stat: "21",
    qualifier: "macrostructures",
    quote: "Two pages from two briefs feel like different sites — not colour-swaps of one template.",
    attrib: "The rule Hallmark is built around",
    salutation: "Dear designer,",
    letterBody: "Every LLM has been trained on the same templates. Without a firm hand, they all emit the same page. Hallmark is the firm hand. It refuses the defaults, asks the questions that matter, and stamps the page so the next run produces something genuinely different.",
    signoff: "With care,",
    captionA: "Plate 01",
    captionB: "From the working archive",
  },
  newsprint: {
    eyebrow: "Volume I · Issue 02 · 28 April 2026",
    title: HERO_TITLE,
    lede: "Twenty-four themes. Twenty-one named page shapes. Fifty component archetypes — fourteen navs, eight footers, four hero polish patterns. A 58-gate slop test that gates every output before it ships. Hallmark is the rulebook the LLM never read.",
    ctaLabel: "Distribution",
    proofLabel: "From the rule sheet",
    proofA: "Multi-column body, justified",
    proofB: "Hairline rules, not boxes",
    proofC: "Outlined CTAs, never pills",
    cta: "Read in full",
    stat: "58",
    qualifier: "gates",
    quote: "We compose the page like a broadsheet. Hairlines, columns, restraint.",
    attrib: "From the Hallmark rule sheet",
    salutation: "Letter from the editor.",
    letterBody: "There was a time when a printed page implied that a hand had been on it. We have tried, in this skill, to put a hand on every screen.",
    signoff: "Yours,",
    captionA: "Issue 02",
    captionB: "Press run",
  },
  atelier: {
    eyebrow: "An atelier note",
    title: HERO_TITLE,
    lede: "A small, opinionated craftsmanship engine that argues with your AI assistant on your behalf — and wins.",
    ctaLabel: "By appointment",
    proofLabel: "Marks of the house",
    proofA: "OKLCH-anchored palettes",
    proofB: "Italic display, weighted rest",
    proofC: "Negative space as divider",
    cta: "Request the manual",
    stat: "20",
    qualifier: "themes",
    quote: "A workshop, not a template.",
    attrib: "Studio note",
    salutation: "A note from the studio.",
    letterBody: "We do not believe in defaults. The default is the average; we are looking for the specific. Every page Hallmark touches is a small refusal of the average, in favour of a page that knows what it is.",
    signoff: "— the studio",
    captionA: "Workbench",
    captionB: "12 April",
  },
  garden: {
    eyebrow: "A small dispatch",
    title: HERO_TITLE,
    lede: "Twenty-four themes that disagree with each other on purpose. Pick one and the whole page changes — not the colours, the bones.",
    ctaLabel: "Plant it",
    proofLabel: "What grows here",
    proofA: "Hairline rules · negative space",
    proofB: "Italic body · serif emphasis",
    proofC: "One accent, used sparingly",
    cta: "Begin",
    stat: "20",
    qualifier: "themes in the garden",
    quote: "A garden is not the absence of weeds. It is the presence of a plan.",
    attrib: "Hallmark, on design",
    salutation: "Grown, not generated.",
    letterBody: "This skill is small. It is opinionated about a few things and quiet about the rest. We have tended it like a garden: pulling out the loud, leaving the considered. We hope it produces, for you, pages that feel grown rather than generated.",
    signoff: "Yours,",
    captionA: "Plot 04",
    captionB: "Late spring",
  },
  almanac: {
    eyebrow: "Almanac · 2026 edition",
    title: HERO_TITLE,
    lede: "A reference book of structural choices, indexed and cross-referenced. Hallmark looks up the right page-shape for the brief and refuses to use the same one twice.",
    ctaLabel: "Open the index",
    proofLabel: "Catalogued",
    proofA: "21 macrostructures · 50 archetypes",
    proofB: "14 navs · 8 footers · 4 polish patterns",
    proofC: "58 slop-test gates",
    cta: "Open the index",
    stat: "420",
    qualifier: "theme × shape combinations",
    quote: "An almanac is a book that knows where to look.",
    attrib: "Almanac, frontispiece",
    salutation: "Reference note,",
    letterBody: "This page is a reference, not an argument. The numbers are the point: 21 macrostructures, 50 archetypes, 24 themes, 58 slop-test gates. Cross-referenced so the next page Hallmark builds is genuinely different from the last.",
    signoff: "— editor",
    captionA: "Vol. III",
    captionB: "Plate 12",
  },
  midnight: {
    eyebrow: "Built for the dark",
    title: HERO_TITLE,
    lede: "A dark theme that uses lightness for elevation, not shadow. Numbered display labels. Typewriter reveals. Indigo accent at low chroma.",
    ctaLabel: "Run it",
    proofLabel: "Console",
    proofA: "OKLCH dark palette · perceptual",
    proofB: "Lightness elevation, no shadow",
    proofC: "Numbered display headers",
    cta: "$ open",
    stat: "20",
    qualifier: "themes, dark-set first",
    quote: "On dark surfaces, elevation is lightness — never glow.",
    attrib: "Midnight rule",
    salutation: "01 — AFTER DARK.",
    letterBody: "This is a dark page that tries not to be a tinted-light page. The neutrals are mixed at low chroma in OKLCH so the steps feel even at the eye, not just at the value. Elevation is brighter surface, not heavier shadow.",
    signoff: "— Midnight",
    captionA: "Frame 03",
    captionB: "0240h",
  },
  terminal: {
    eyebrow: "$ hallmark",
    title: HERO_TITLE,
    lede: "Honest about its medium. Monospace top to bottom. No animations. The page is what it is.",
    ctaLabel: "Run",
    proofLabel: "Process",
    proofA: "Monospace, single column",
    proofB: "Underlined links · no hover scale",
    proofC: "No reveal animation",
    cta: "$ run",
    stat: "0",
    qualifier: "animations",
    quote: "$ tput sgr0",
    attrib: "End of file",
    salutation: "> no pretense",
    letterBody: "> a terminal page is not a page that pretends. it does not transition. it does not hover-scale. it is monospace because the work that made it was monospace. the rest of the page can read what it likes.",
    signoff: "> bye",
    captionA: "frame_07",
    captionB: "0241",
  },
  brutal: {
    eyebrow: "Brutal — uncompromised",
    title: HERO_TITLE,
    lede: "Heavy display. Hard edges. One accent that means it. The grid does not flex; the grid is the point.",
    ctaLabel: "Take it",
    proofLabel: "Stack",
    proofA: "Photographic full-bleed",
    proofB: "Bleed-colour dividers",
    proofC: "Oversized solid CTAs",
    cta: "GO",
    stat: "100",
    qualifier: "PERCENT.",
    quote: "A page that hedges is a page that fails.",
    attrib: "BRUTAL",
    salutation: "DEAR READER.",
    letterBody: "WE WILL NOT HEDGE. THE GRID DOES NOT FLEX. THE TYPE IS HEAVY. THE ACCENT IS RED. EVERY DECISION ON THIS PAGE IS A DECISION; NONE OF THEM ARE DEFAULTS. TAKE IT OR LEAVE IT.",
    signoff: "— BRUTAL",
    captionA: "BLOCK A",
    captionB: "PRINT 01",
  },
  manifesto: {
    eyebrow: "Manifesto",
    title: "The Design Skill.",
    lede: "The page is a statement. We don't soften it. The accent is a colour with a position. The headline is a belief.",
    ctaLabel: "Sign it",
    proofLabel: "Beliefs",
    proofA: "Bleed-colour dividers",
    proofB: "Oversized solid buttons",
    proofC: "Declarative large type",
    cta: "SIGN ON",
    stat: "20",
    qualifier: "themes, none default.",
    quote: "WE BELIEVE A LANDING PAGE IS NOT A TEMPLATE.",
    attrib: "MANIFESTO",
    salutation: "TO WHOM IT CONCERNS.",
    letterBody: "WE BELIEVE THE PAGE IS A POSITION. WE BELIEVE THE TEMPLATE IS THE ENEMY. WE BELIEVE THAT EVERY DECISION SHOULD BE VISIBLE FROM ACROSS THE ROOM. WE BELIEVE THE ACCENT COLOUR IS A POLITICS. WE BELIEVE — AND THE PAGE BELIEVES WITH US.",
    signoff: "— THE UNDERSIGNED",
    captionA: "PLATE I",
    captionB: "POSTER",
  },
  sport: {
    eyebrow: "Sport · 2026",
    title: HERO_TITLE,
    lede: "Italic display. Tabular nums. Numbered display headers. The page moves like a scoreboard — fast, decisive, in motion.",
    ctaLabel: "Kick off",
    proofLabel: "Stats",
    proofA: "Italic display, oversized",
    proofB: "Tabular numbers everywhere",
    proofC: "Horizontal-sweep reveals",
    cta: "GO",
    stat: "20",
    qualifier: "THEMES · FOUR GENRES DEEP.",
    quote: "A FAST PAGE IS A FAST DECISION.",
    attrib: "SPORT",
    salutation: "READY?",
    letterBody: "YOU ARE TWO MINUTES FROM SHIPPING. THE PAGE IS WAITING. EVERY DECISION ON IT IS NUMBERED, TABULATED, INDEXED. THE ACCENT IS A STARTING GUN. RUN IT.",
    signoff: "— SPORT",
    captionA: "RACE 03",
    captionB: "LAP 12",
  },
  studio: {
    eyebrow: "Studio · 2026",
    title: HERO_TITLE,
    lede: "We design and build distinctive products for ambitious teams. Hallmark is our typography opinion, codified — twenty-four themes, twenty-one shapes, no defaults.",
    ctaLabel: "Engage",
    proofLabel: "Selected work",
    proofA: "01 — A foundry rebrand",
    proofB: "02 — A reading app",
    proofC: "03 — A type specimen",
    cta: "See the work",
    stat: "21",
    qualifier: "named page shapes.",
    quote: "We don't believe in defaults. The default is the average; we are looking for the specific.",
    attrib: "Studio note · 2026",
    salutation: "We refuse the default.",
    letterBody: "We started this studio because we kept being asked to build the same page, twelve different ways. Hallmark is our argument: one brief, one shape — chosen, not defaulted to. Take a look.",
    signoff: "Yours,",
    captionA: "Studio · 2026",
    captionB: "Selected work",
  },
  riso: {
    eyebrow: "ed. 12 · printed today",
    title: HERO_TITLE,
    lede: "warm paper, off-register accents, one bold lowercase headline. a page that feels printed, not generated.",
    ctaLabel: "press →",
    proofLabel: "colophon",
    proofA: "public sans display, 900 weight",
    proofB: "newsreader italic body",
    proofC: "riso cyan + yellow accent pair",
    cta: "print one →",
    stat: "12",
    qualifier: "editions, hand-set.",
    quote: "design like print: warm, off-register, intentional.",
    attrib: "RISO · ed. 12",
    salutation: "from the press,",
    letterBody: "this is not a page that pretends to be paper. it is a page that remembers paper. the colors mis-register on purpose. the headline sits low. the body is a serif italic that wants to be read in a chair, not on a phone in a queue. take a seat.",
    signoff: "— the press",
    captionA: "ed. 12",
    captionB: "press · 04",
  },
  bloom: {
    eyebrow: "Warm minimal · 2026",
    title: HERO_TITLE,
    lede: "For the calm, considered product page. A warm-light canvas, one soft bloom, and a single restrained accent — clean type with room to breathe.",
    ctaLabel: "Try it now",
    proofLabel: "Atmosphere",
    proofA: "Warm-light canvas, one soft bloom",
    proofB: "Geist sans, one weight, plain English",
    proofC: "Single restrained accent — never gradient text",
    cta: "Try it now",
    stat: "1",
    qualifier: "warm canvas — many uses.",
    mockStat: "1",
    quote: "The page should feel like a place you could sit in.",
    attrib: "Bloom note",
    salutation: "Welcome,",
    letterBody: "A calm, warm-light theme for the considered product page — generous space, one soft bloom, plain confident type, a single restrained accent. Restraint of a different kind.",
    signoff: "— Bloom",
    captionA: "Bloom",
    captionB: "Warm light",
  },
  coral: {
    eyebrow: "Modern minimal · warm-grey",
    title: HERO_TITLE,
    lede: "For the polished SaaS that wants warmth without losing discipline. Warm-grey paper, General Sans throughout, a single coral accent kept under five percent of the view.",
    ctaLabel: "Get started",
    proofLabel: "Decisions",
    proofA: "Warm-grey paper, not pure white",
    proofB: "General Sans, one family, one weight",
    proofC: "Single coral accent · pill CTAs",
    cta: "Get started",
    stat: "1",
    qualifier: "warm minimal · pill CTAs.",
    mockStat: "1",
    quote: "Restraint with warmth is harder than restraint without it.",
    attrib: "Coral note",
    salutation: "Restraint, with warmth.",
    letterBody: "The polished-SaaS school of restraint, but warmer. Warm-grey paper instead of pure white; coral accent on focus rings and small marks. Pill CTAs, two-column heroes, generous space.",
    signoff: "Yours,",
    captionA: "Coral",
    captionB: "v1.2",
  },
  aurora: {
    eyebrow: "Atmospheric · cool",
    title: HERO_TITLE,
    lede: "For the after-dark dev tool. Cool blue-green canvas, two atmospheric blooms behind the content, single teal-green accent. Sentient body for warmth on the cool ground.",
    ctaLabel: "Open it",
    proofLabel: "Atmosphere",
    proofA: "Dark cool canvas · two cool blooms",
    proofB: "Sora display + Sentient body",
    proofC: "Teal-green accent, never gradient text",
    cta: "Open it",
    stat: "2",
    qualifier: "atmospheric blooms · cool canvas.",
    mockStat: "2",
    quote: "The page should feel like the moment after a deploy goes green.",
    attrib: "Aurora note",
    salutation: "Online,",
    letterBody: "A dark cool atmospheric theme — the dev-tool-after-dark register. Two cool blooms (cyan top-right, teal-green bottom-left). Sora display for confidence; Sentient body to keep the cool ground from feeling clinical.",
    signoff: "— Aurora",
    captionA: "Aurora",
    captionB: "Late-shift",
  },
  editorial: {
    eyebrow: "No XXIII · Editorial",
    title: HERO_TITLE,
    lede: "An editorial-premium voice — warm cream paper, coral accent, mixed sans + serif italic. Magazine-shaped, hairline rules, asymmetric grids.",
    ctaLabel: "I · Install",
    proofLabel: "From the rule sheet",
    proofA: "Inter Tight 800 + Playfair italic, mixed in display",
    proofB: "Hairlines, generous whitespace, Roman-numeral marginalia",
    proofC: "Coral accent · ≤ 5% of viewport",
    cta: "Read the issue",
    stat: "23",
    qualifier: "magazine-grade. hairline-set.",
    mockStat: "23",
    quote: "A magazine page knows how much to leave out.",
    attrib: "Editorial, frontispiece",
    salutation: "Dear reader,",
    letterBody: "An editorial premium that takes its cue from the print magazines that still feel right — warm cream paper, hairline rules, Roman-numeral marginalia, an italic display word slipped inside a sans-serif headline. Coral the only colour besides ink. Asymmetric without being clever about it.",
    signoff: "Yours,",
    captionA: "Issue 23",
    captionB: "Spring 2026",
  },
  carnival: {
    eyebrow: "NO TEMPLATES · NO DEFAULTS",
    title: HERO_TITLE,
    lede: "24 themes that refuse to blend in. Pick one and the whole page changes — the bones, not the paint.",
    ctaLabel: "Install",
    proofLabel: "ON THE BILL",
    proofA: "21 page-shapes, 50 archetypes",
    proofB: "Duo-tone drops, hard-offset shadows",
    proofC: "58-gate slop test, every build",
    cta: "See the lineup",
    stat: "20",
    qualifier: "THEMES. ZERO TEMPLATES.",
    quote: "A PAGE THAT HEDGES IS A PAGE THAT FAILS.",
    attrib: "CARNIVAL",
    salutation: "WE PRINT POSTERS, NOT TEMPLATES.",
    letterBody: "Every model was trained on the same page. Carnival refuses it — loud type, duo-tone ink, ornaments that mean it. 24 themes in the catalog, and not one of them whispers.",
    signoff: "— CARNIVAL",
    captionA: "BILL 01",
    captionB: "OUT NOW",
  },
  lumen: {
    eyebrow: "00 · DESIGN SKILL",
    title: HERO_TITLE,
    lede: "a design skill that refuses the defaults every model was trained on. twenty-four themes, twenty-one page-shapes, and one slop test that gates every build before it ships.",
    ctaLabel: "install",
    proofLabel: "00 · SPEC",
    proofA: "21 page-shapes · 50 archetypes",
    proofB: "lowercase serif · mono labels · no orb",
    proofC: "58-gate slop test, every emit",
    cta: "read the docs",
    stat: "20",
    qualifier: "themes, instrument-grade.",
    quote: "two briefs, two pages — not one template, recoloured.",
    attrib: "lumen",
    salutation: "built to refuse the default.",
    letterBody: "every model emits the same page. lumen is the part that refuses — lowercase classical serif, one accent verb, a hand-built apparatus where the orb used to be. twenty-four themes in the catalog, and the numbers hold under load.",
    signoff: "— lumen",
    captionA: "00 · spec",
    captionB: "night foundry",
  },
  hum: {
    eyebrow: "A design skill",
    title: "Make your AI agent a designer.",
    lede: "The anti-slop design skill for Claude Code, Cursor, and Codex. Twenty-four themes with real structural variety, and a 58-gate check before anything ships.",
    ctaLabel: "Install",
    proofLabel: "What's inside",
    proofA: "21 page-shapes · 50 archetypes",
    proofB: "9 heroes · 14 navs · 8 footers",
    proofC: "58-gate slop test, every build",
    cta: "See examples",
    stat: "20",
    qualifier: "themes, all alive.",
    quote: "Two briefs should feel like two studios, not one template.",
    attrib: "Hum",
    salutation: "Made, not generated.",
    letterBody: "Every model defaults to the same page. Hum is the warm end of the refusal — cream paper, three accents that take turns, one small mark that reacts when you click. Twenty-four themes in the catalog, each with its own bones.",
    signoff: "— Hum",
    captionA: "Today",
    captionB: "Kept warm",
  },
  cobalt: {
    eyebrow: "Modern minimal · dev-tool",
    title: HERO_TITLE,
    lede: "For the API, the docs, the dev tool. A cool engineered canvas, ruler-drawn hairlines, and one electric cobalt signal — the page reads like good infrastructure, not a template.",
    ctaLabel: "Start building",
    proofLabel: "Spec",
    proofA: "Cool engineered paper — never pure white",
    proofB: "Space Grotesk · Inter · JetBrains Mono",
    proofC: "One cobalt signal · hairline borders · ⌘K",
    cta: "Read the docs",
    stat: "1",
    qualifier: "signal accent, used sparingly.",
    mockStat: "1",
    quote: "A dev tool should read like good infrastructure: calm, precise, fast.",
    attrib: "Cobalt note",
    salutation: "Built to ship.",
    letterBody: "The dev-tool register, executed with restraint: a cool near-white canvas, hairlines doing the structural work, one electric cobalt accent reserved for the signal — a live request, a 200, a focused field. Space Grotesk for headings, Inter for prose, JetBrains Mono for the code.",
    signoff: "Ship it,",
    captionA: "Cobalt",
    captionB: "v1.2",
  },
  grid: {
    eyebrow: "Swiss international",
    title: HERO_TITLE,
    lede: "The grid, made visible. A near-white sheet, exposed twelve-column hairlines, one signal red, and a heavy neo-grotesque set flush-left. Rational, exact, built for institutions that plan in decades.",
    ctaLabel: "Method",
    proofLabel: "System",
    proofA: "Exposed 12-column hairline grid",
    proofB: "Archivo 800 · flush-left · tight tracking",
    proofC: "One red element per viewport",
    cta: "Read the method",
    stat: "12",
    qualifier: "columns, exposed.",
    mockStat: "12",
    quote: "Structure before surface. One grid, two weights, one red.",
    attrib: "Grid note",
    salutation: "Schedule, then ship.",
    letterBody: "Swiss International, executed straight: the grid is not scaffolding you hide, it is the design. Content snaps to twelve columns, asymmetric spans make the rhythm, and a single red mark does all the emotional work.",
    signoff: "Flush left,",
    captionA: "Grid",
    captionB: "v1.2",
  },
  field: {
    eyebrow: "Warm productivity",
    title: HERO_TITLE,
    lede: "The serious tool that feels hand-made. Cream paper, a Source Serif headline over humanist Public Sans, one marigold highlighter behind the phrase that matters, and hand-drawn ink where a diagram helps.",
    ctaLabel: "Start free",
    proofLabel: "Made, not generated",
    proofA: "Cream paper · Source Serif + Public Sans",
    proofB: "Marigold highlighter, one phrase",
    proofC: "Hand-drawn ink accents",
    cta: "See how it works",
    stat: "1",
    qualifier: "highlighter, on the phrase that matters.",
    mockStat: "1",
    quote: "Credible, warm, a little hand-made. Software that reads like a good notebook.",
    attrib: "Field note",
    salutation: "A plan, by the time you stand up.",
    letterBody: "Warm-productivity SaaS without the cute: a serif display for weight, a humanist sans for the work, one marigold band on the phrase that carries the promise, and ink doodles that behave like margin notes rather than decoration.",
    signoff: "Noted,",
    captionA: "Field",
    captionB: "v1.2",
  },
  ledger: {
    eyebrow: "Fintech terminal-lux",
    title: HERO_TITLE,
    lede: "The data is the marketing. A navy ground, a giant reconciled balance in tabular mono, a live transaction ledger, and one teal signal on the figures that moved. Dense, cool, precise, trustworthy.",
    ctaLabel: "Open account",
    proofLabel: "On the tape",
    proofA: "Dark navy · tabular IBM Plex Mono",
    proofB: "Teal only on positive figures + one CTA",
    proofC: "The ledger itself is the hero",
    cta: "See it reconcile",
    stat: "1",
    qualifier: "teal signal, on the numbers that moved.",
    mockStat: "1",
    quote: "Treasury for grown-ups. You wake up to a closed book, not a queue of exceptions.",
    attrib: "Ledger note",
    salutation: "Reconciled while you sleep.",
    letterBody: "Fintech done as an instrument, not a brochure: a navy terminal ground, every figure set in tabular mono, the reconciled balance carried at display scale, and teal reserved for the one thing the eye should trust: the number that changed.",
    signoff: "Balanced,",
    captionA: "Ledger",
    captionB: "v1.2",
  },
  arcade: {
    eyebrow: "Free play · event 07",
    title: HERO_TITLE,
    lede: "Retro-system nostalgia, kept tasteful. A violet-black ground, a pixel display over a readable humanist body, a magenta and cyan duo, scanlines and a starfield. The retro comes from type and light, never from fake window chrome.",
    ctaLabel: "Register",
    proofLabel: "High scores",
    proofA: "Violet-black · Silkscreen + Hanken Grotesk",
    proofB: "Magenta + cyan accent duo",
    proofC: "Scanlines + starfield, no fake OS chrome",
    cta: "Insert coin",
    stat: "2",
    qualifier: "accent colours, magenta and cyan.",
    mockStat: "2",
    quote: "Pixels and scanlines carry the nostalgia. No drawn cabinets, no fake title bars.",
    attrib: "Arcade note",
    salutation: "Now accepting players.",
    letterBody: "Retro without the costume: the signal is a pixel display, a low scanline wash, a faint starfield, and a magenta-plus-cyan duo on violet-black, with body copy in a readable sans so it stays legible. The re-drawn-chrome ban still holds.",
    signoff: "Game on,",
    captionA: "Arcade",
    captionB: "v1.2",
  },
};

/* — Slot population ———————————————————————————————————— */
const root = document.documentElement;
const banner = document.querySelector(".banner");
const currentLabel = document.querySelector("[data-theme-current]");
const dots = document.querySelectorAll("[data-theme-btn]");
const slotEls = {
  hero: document.querySelector('[data-slot="hero"]'),
  footer: document.querySelector('[data-slot="footer"]'),
};

function interpolate(node, copy) {
  // Walk text nodes and attribute values, replace {{key}} with copy[key].
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  let n; while ((n = walker.nextNode())) textNodes.push(n);
  for (const t of textNodes) {
    if (t.nodeValue.includes("{{")) {
      t.nodeValue = t.nodeValue.replace(/\{\{(\w+)\}\}/g, (_, k) => copy[k] ?? "");
    }
  }
  // Attributes
  const all = node.querySelectorAll("*");
  for (const el of all) {
    for (const attr of el.attributes) {
      if (attr.value.includes("{{")) {
        attr.value = attr.value.replace(/\{\{(\w+)\}\}/g, (_, k) => copy[k] ?? "");
      }
    }
  }
}

function swapArchetypes(theme) {
  const tuple = ARCHETYPES[theme] || ARCHETYPES.specimen;
  const copy = COPY[theme] || COPY.specimen; // resilience: themes without a bespoke COPY fixture fall back to specimen's (visual theme still applies)

  for (const slot of ["hero", "footer"]) {
    const region = slotEls[slot];
    if (!region) continue;
    const tplId = `${slot}-${tuple[slot]}`;
    const tpl = document.getElementById(tplId);
    if (!tpl) continue;

    const fragment = tpl.content.cloneNode(true);
    interpolate(fragment, copy);

    region.replaceChildren(fragment);
    region.dataset.archetype = tuple[slot];

    // Trigger a one-shot fade-in for the freshly-populated children.
    region.removeAttribute("data-populating");
    void region.offsetWidth; // restart animation
    region.setAttribute("data-populating", "");
  }

  // Re-attach copy buttons inside the new hero, since clone doesn't carry handlers.
  attachCopyButtons(slotEls.hero);
}

/* — Copy-to-clipboard (silent success, label swap pattern) —————
   Two click surfaces:
   - The Copy button (visible on desktop) — explicit affordance.
   - The whole pre[data-copy-source] — falls back to a tappable area
     on mobile where the button is hidden by CSS.
   Both call the same async copy + state-flash routine. We bind once
   per element via `data-copy-bound` so re-attached templates don't
   double-bind. */
async function copyFromSource(source) {
  if (!source) return;
  const textNode = source.querySelector("[data-copy-text]");
  const text = textNode ? textNode.textContent.trim() : "";
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) { }
    document.body.removeChild(ta);
  }

  // Flash both the source and any visible button so the right
  // surface (mobile pseudo-element vs desktop button label) animates.
  source.dataset.state = "copied";
  source.setAttribute("aria-live", "polite");
  const btn = source.querySelector("[data-copy-btn]");
  if (btn) btn.dataset.state = "copied";

  clearTimeout(source._copyTimer);
  source._copyTimer = setTimeout(() => {
    delete source.dataset.state;
    if (btn) delete btn.dataset.state;
  }, 2200);
}

function attachCopyButtons(scope = document) {
  // Bind the whole pre — works on mobile where the button is hidden.
  const sources = scope.querySelectorAll("[data-copy-source]:not([data-copy-bound])");
  sources.forEach((source) => {
    source.dataset.copyBound = "true";
    source.addEventListener("click", () => copyFromSource(source));
  });
  // Button click is also handled — stop propagation so the source
  // listener doesn't double-fire (single copy per click).
  const btns = scope.querySelectorAll("[data-copy-btn]:not([data-copy-btn-bound])");
  btns.forEach((btn) => {
    btn.dataset.copyBtnBound = "true";
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      copyFromSource(btn.closest("[data-copy-source]"));
    });
  });
}
attachCopyButtons();

/* — Release :hover / :focus on the sticky Install pill after click.
   The banner is position: sticky, so when smooth-scroll lands the
   page on #install the cursor is still over the pill and Safari /
   Chrome can keep the inverted hover stuck. Blur + a one-frame
   pointer-events nudge forces the browser to release both states.
   No layout side-effects; the pill is back to normal as soon as the
   pointer next moves. */
document.querySelectorAll('.banner__install').forEach((el) => {
  el.addEventListener('click', () => {
    requestAnimationFrame(() => {
      el.blur();
      el.style.pointerEvents = 'none';
      setTimeout(() => { el.style.pointerEvents = ''; }, 60);
    });
  });
});

/* — GitHub star count — cached in localStorage for 1h ——————————
   Hits the public GitHub API on first paint, caches the count keyed
   by REPO so renames auto-bust old caches. Stale-while-revalidate:
   shows a cached value (even if past TTL) instantly, then fetches a
   fresh count in the background and updates the DOM if it changed.
   Falls back to whatever's currently on screen if the request fails. */
(() => {
  const starEl = document.querySelector("[data-star-count]");
  if (!starEl) return;

  const REPO = "nutlope/hallmark";
  const CACHE_KEY = "hallmark-star-count:" + REPO;   // key by repo — renames auto-invalidate
  const TTL = 60 * 60 * 1000; // 1h

  const format = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + "k" : String(n));

  // Read cache first — show whatever's there instantly (even if stale).
  let cachedFresh = false;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const cached = JSON.parse(raw);
      if (cached && typeof cached.n === "number") {
        starEl.textContent = format(cached.n);
        cachedFresh = Date.now() - cached.t < TTL;
      }
    }
  } catch (e) { /* localStorage may throw on private mode */ }

  // Fresh cache → skip network. Stale or absent → fetch and update.
  if (cachedFresh) return;

  fetch(`https://api.github.com/repos/${REPO}`, { headers: { Accept: "application/vnd.github+json" } })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d || typeof d.stargazers_count !== "number") return;
      const n = d.stargazers_count;
      starEl.textContent = format(n);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ n, t: Date.now() })); } catch (e) { }
    })
    .catch(() => { /* leave the cached / placeholder value as-is */ });
})();

/* — Theme application ————————————————————————————————— */
/* Cached banner subnodes — populated once at startup. */
const themeLabelEl = document.querySelector(".banner__theme");
const themeGenreEl = document.querySelector("[data-theme-genre]");
const ordinalEl   = document.querySelector("[data-theme-ordinal]");
const themeKeys   = Object.keys(THEMES);
const totalThemes = themeKeys.length;

function setPressed(theme) {
  dots.forEach((btn) => {
    const active = btn.dataset.themeBtn === theme;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
  const themeName = THEMES[theme] || "Specimen";
  const genre = THEME_GENRES[theme] || "editorial";
  const idx = themeKeys.indexOf(theme);
  const ordinal = idx >= 0 ? String(idx + 1).padStart(2, "0") : "01";

  if (themeLabelEl) themeLabelEl.textContent = themeName;
  if (themeGenreEl) themeGenreEl.textContent = genre;
  if (ordinalEl)    ordinalEl.textContent = `${ordinal} / ${totalThemes}`;

  // Colophon footer — update the "Currently rendered in <theme>" line.
  const footThemeEl = document.querySelector("[data-theme-current-foot]");
  if (footThemeEl) footThemeEl.textContent = themeName;

  // Fallback for older callers — keep the public theme-current span up to date.
  if (currentLabel && !themeLabelEl) currentLabel.textContent = themeName;
}

function applyTheme(theme) {
  if (!THEMES[theme]) return;
  const apply = () => {
    root.dataset.theme = theme;
    swapArchetypes(theme);
    setPressed(theme);
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { }
  };
  if (!reduced && document.startViewTransition) {
    document.startViewTransition(apply);
  } else {
    apply();
  }
}

const queried = (() => {
  try { return new URL(window.location.href).searchParams.get("theme"); } catch (e) { return null; }
})();
const stored = (() => {
  try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
})();
const initial = THEMES[queried] ? queried
  : THEMES[stored] ? stored
    : (root.dataset.theme || "hum");

// First paint — populate slots without a transition (no flash).
// Run swapArchetypes BEFORE setPressed so the footer template is materialised
// before setPressed writes the current-theme name into it.
root.dataset.theme = initial;
swapArchetypes(initial);
setPressed(initial);
try { localStorage.setItem(STORAGE_KEY, initial); } catch (e) { }

dots.forEach((btn) => {
  btn.addEventListener("click", () => {
    applyTheme(btn.dataset.themeBtn);
    closeThemeDropdown();
  });
});

/* — Theme dropdown — open/close + outside-dismiss ————————————
   The indicator button toggles the panel. Outside clicks, Escape,
   and theme selection all close it. The dropdown is hidden via the
   `hidden` attribute (CSS handles `[hidden] { display: none }`). */
const themeTrigger  = document.querySelector("[data-theme-trigger]");
const themeDropdown = document.getElementById("theme-dropdown");
const themeWrap     = document.querySelector("[data-theme-wrap]");

function openThemeDropdown() {
  if (!themeDropdown || !themeTrigger) return;
  themeDropdown.hidden = false;
  themeTrigger.setAttribute("aria-expanded", "true");
}

function closeThemeDropdown() {
  if (!themeDropdown || !themeTrigger) return;
  themeDropdown.hidden = true;
  themeTrigger.setAttribute("aria-expanded", "false");
}

if (themeTrigger && themeDropdown) {
  themeTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    if (themeDropdown.hidden) openThemeDropdown(); else closeThemeDropdown();
  });

  // Click outside the wrap closes the dropdown.
  document.addEventListener("click", (e) => {
    if (themeDropdown.hidden) return;
    if (themeWrap && themeWrap.contains(e.target)) return;
    closeThemeDropdown();
  });

  // Escape closes too.
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !themeDropdown.hidden) {
      closeThemeDropdown();
      themeTrigger.focus();
    }
  });
}

/* — Shuffle button + R shortcut ——————————————————————————— */
const shuffleBtn = document.querySelector(".banner__shuffle, .banner__random");
function pickRandomTheme() {
  const keys = Object.keys(THEMES).filter((k) => k !== root.dataset.theme);
  return keys[Math.floor(Math.random() * keys.length)];
}
if (shuffleBtn) {
  shuffleBtn.addEventListener("click", () => applyTheme(pickRandomTheme()));
}

/* — T-key onboarding tooltip ————————————————————————————————
   First-time visitors don't know T cycles themes. After ~5s of no T
   presses (and only if they haven't seen the tooltip before), fade
   it in near the shuffle button. Dismisses on first T press, on
   click, or after 8s of being shown. localStorage flag is set on
   dismiss so it never returns. */
const T_TOOLTIP_KEY = "hallmark-t-tooltip-seen";
const T_TOOLTIP_DELAY_MS = 5000;
const T_TOOLTIP_AUTO_HIDE_MS = 8000;
const T_TOOLTIP_FADE_MS = 240;
const tTooltipEl = document.querySelector("[data-t-tooltip]");
let tTooltipShown = false;
let tTooltipTimer = null;
let tTooltipAutoHideTimer = null;

function tTooltipSeen() {
  try { return localStorage.getItem(T_TOOLTIP_KEY) === "1"; } catch (e) { return false; }
}

function markTTooltipSeen() {
  try { localStorage.setItem(T_TOOLTIP_KEY, "1"); } catch (e) { }
}

function showTTooltip() {
  if (!tTooltipEl || tTooltipShown || tTooltipSeen()) return;
  tTooltipShown = true;
  tTooltipEl.hidden = false;
  delete tTooltipEl.dataset.state;
  clearTimeout(tTooltipAutoHideTimer);
  tTooltipAutoHideTimer = setTimeout(hideTTooltip, T_TOOLTIP_AUTO_HIDE_MS);
}

function hideTTooltip() {
  if (!tTooltipEl || !tTooltipShown) return;
  clearTimeout(tTooltipAutoHideTimer);
  tTooltipEl.dataset.state = "closing";
  setTimeout(() => {
    tTooltipEl.hidden = true;
    delete tTooltipEl.dataset.state;
    tTooltipShown = false;
    markTTooltipSeen();
  }, T_TOOLTIP_FADE_MS);
}

if (tTooltipEl && !tTooltipSeen()) {
  tTooltipTimer = setTimeout(showTTooltip, T_TOOLTIP_DELAY_MS);
  tTooltipEl.addEventListener("click", hideTTooltip);
}

/* — Easter egg — "chill, designer." ————————————————————————
   Spam T fast enough and the page intervenes. We track timestamps in
   a rolling 3.2s window; if the user crosses the threshold (≈ a full
   catalog cycle inside the window), the overlay takes over. While
   it's visible, every keystroke is swallowed — no theme cycling, no
   shortcuts. After ~4s the overlay fades and the page returns. A 30s
   cooldown stops it from firing back-to-back. */
const easterEl = document.querySelector("[data-easter-egg]");
const EASTER_WINDOW_MS = 3200;
const EASTER_THRESHOLD = 12;       // ≈ 3.8 presses/sec
const EASTER_VISIBLE_MS = 3400;    // total time the overlay stays up
const EASTER_FADE_MS = 360;        // matches the fade-out animation
const EASTER_COOLDOWN_MS = 15000;
const EASTER_PUNCHLINES = [
  "theme connoisseur.",
  "easy on the keys.",
  "speed-run noted.",
  "calm down, designer.",
  "showing off, are we?",
  "you've seen them all.",
  "pick one. ship.",
  "one theme will do.",
];
const tStamps = [];
let easterLastFired = 0;
let easterOpen = false;
let easterDismissTimer = null;
let easterFadeTimer = null;

function showEasterEgg() {
  if (!easterEl || easterOpen) return;

  // Re-mount the lines so the staggered fade-in animation re-runs each
  // time. Populate the punchline after replacement so we don't write
  // into a detached node.
  const lines = easterEl.querySelector(".easter__lines");
  if (lines) {
    const fresh = lines.cloneNode(true);
    lines.parentNode.replaceChild(fresh, lines);
  }
  const lineEl = easterEl.querySelector("[data-easter-line]");
  if (lineEl) lineEl.textContent = EASTER_PUNCHLINES[Math.floor(Math.random() * EASTER_PUNCHLINES.length)];

  delete easterEl.dataset.state;
  easterEl.hidden = false;
  easterOpen = true;
  document.body.style.overflow = "hidden";
  // Toggle body class so the page-shrink + blur animation runs in sync
  // with the easter overlay's arrival. CSS handles the rest.
  document.body.classList.add("easter-open");

  clearTimeout(easterDismissTimer);
  clearTimeout(easterFadeTimer);
  easterDismissTimer = setTimeout(hideEasterEgg, EASTER_VISIBLE_MS);
}

function hideEasterEgg() {
  if (!easterEl || !easterOpen) return;
  clearTimeout(easterDismissTimer);
  clearTimeout(easterFadeTimer);
  easterEl.dataset.state = "closing";
  // Drop the body class first so the page un-blurs / scales back in
  // tandem with the overlay leaving.
  document.body.classList.remove("easter-open");
  easterFadeTimer = setTimeout(() => {
    easterEl.hidden = true;
    delete easterEl.dataset.state;
    easterOpen = false;
    document.body.style.overflow = "";
  }, EASTER_FADE_MS);
}

/* — Keyboard shortcuts ————————————————————————————————— */
// T cycles forward, Shift+T cycles back, R picks random.
document.addEventListener("keydown", (e) => {
  // While the easter egg is up, swallow every key — including T —
  // so the user can't trigger anything until it auto-dismisses.
  if (easterOpen) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }

  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea" || e.target.isContentEditable) return;
  if (e.metaKey || e.ctrlKey || e.altKey) return;

  if (e.key === "t" || e.key === "T") {
    e.preventDefault();
    // Dismiss the onboarding tooltip on first T press.
    clearTimeout(tTooltipTimer);
    if (tTooltipShown) hideTTooltip();
    else markTTooltipSeen();
    // Easter-egg counter — track press cadence in a rolling window.
    // Push BEFORE applying the theme so the trigger fires on this same
    // keystroke if we've crossed the threshold.
    const now = performance.now();
    while (tStamps.length && now - tStamps[0] > EASTER_WINDOW_MS) tStamps.shift();
    tStamps.push(now);
    if (tStamps.length >= EASTER_THRESHOLD && now - easterLastFired > EASTER_COOLDOWN_MS) {
      easterLastFired = now;
      tStamps.length = 0;
      showEasterEgg();
      return; // skip the theme swap on the trigger keystroke
    }

    const order = Object.keys(THEMES);
    const i = order.indexOf(root.dataset.theme);
    const dir = e.shiftKey ? -1 : 1;
    const next = order[(i + dir + order.length) % order.length];
    applyTheme(next);
  } else if (e.key === "r" || e.key === "R") {
    e.preventDefault();
    applyTheme(pickRandomTheme());
  }
});

/* — Hover preview on dots — reads theme name in the centre ————— */
let previewTimer = null;
let lastConfirmed = root.dataset.theme;
dots.forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    lastConfirmed = root.dataset.theme;
    clearTimeout(previewTimer);
    previewTimer = setTimeout(() => {
      if (currentLabel) currentLabel.textContent = THEMES[btn.dataset.themeBtn];
    }, 80);
  });
  btn.addEventListener("mouseleave", () => {
    clearTimeout(previewTimer);
    if (currentLabel && root.dataset.theme === lastConfirmed) {
      currentLabel.textContent = THEMES[lastConfirmed];
    }
  });
});

/* — Foundations · F/04 Motion demo —————————————————————
   Click "Play" to run the entrance once. The keyframe is in
   components.css; we just toggle the class so it can replay. */
const motionBtn = document.querySelector("[data-motion-demo]");
const motionBlock = document.querySelector("[data-motion-block]");
if (motionBtn && motionBlock) {
  motionBtn.addEventListener("click", () => {
    motionBlock.classList.remove("is-running");
    // force reflow so the class re-add triggers the animation again
    void motionBlock.offsetWidth;
    motionBlock.classList.add("is-running");
  });
}

/* — Foundations · F/05 States demo ———————————————————————
   Real button. The readout reflects whatever state the button is in:
   default, hover, focus, active, loading (for ~1s after click). */
const statesBtn = document.querySelector("[data-states-demo]");
const statesReadout = document.querySelector("[data-states-readout]");
if (statesBtn && statesReadout) {
  let loadingTimer = null;

  function setState(state) {
    statesReadout.textContent = state;
    if (state === "loading") {
      statesBtn.dataset.state = "loading";
    } else {
      delete statesBtn.dataset.state;
    }
  }

  statesBtn.addEventListener("mouseenter", () => {
    if (statesBtn.dataset.state !== "loading") setState("hover");
  });
  statesBtn.addEventListener("mouseleave", () => {
    if (statesBtn.dataset.state !== "loading" && document.activeElement !== statesBtn) {
      setState("default");
    }
  });
  statesBtn.addEventListener("focus", () => {
    if (statesBtn.dataset.state !== "loading") setState("focus");
  });
  statesBtn.addEventListener("blur", () => {
    if (statesBtn.dataset.state !== "loading") setState("default");
  });
  statesBtn.addEventListener("mousedown", () => {
    if (statesBtn.dataset.state !== "loading") setState("active");
  });
  statesBtn.addEventListener("click", () => {
    setState("loading");
    clearTimeout(loadingTimer);
    loadingTimer = setTimeout(() => {
      setState("success");
      setTimeout(() => setState("default"), 900);
    }, 900);
  });
}

/* — Tab-click scroll-jump fix —————————————————————————————
   The CSS-only radio tab pattern in Section 04 (Without/With) and
   Section 05 (Foundations) places the radio inputs at top:0 of their
   section. When the user clicks a label, the browser focuses the
   associated input — which scrolls the section's top into view, even
   if the user clicked from the middle of the page. The result is the
   page jumping upward on every tab click.

   Fix: intercept label clicks, prevent the default chain, manually
   toggle the radio's checked state, and focus with preventScroll so
   keyboard navigation still works without the unwanted scroll. */
const tabLabels = document.querySelectorAll(
  ".vs-toggle__btn, .found-nav__btn"
);
tabLabels.forEach((label) => {
  label.addEventListener("click", (e) => {
    const id = label.getAttribute("for");
    if (!id) return;
    const radio = document.getElementById(id);
    if (!radio) return;

    e.preventDefault();
    if (!radio.checked) {
      radio.checked = true;
      radio.dispatchEvent(new Event("change", { bubbles: true }));
    }
    // Keep keyboard nav working — focus the input but don't scroll.
    try {
      radio.focus({ preventScroll: true });
    } catch (_) {
      // Older browsers without preventScroll option — fall back to
      // saving and restoring scroll position.
      const x = window.scrollX;
      const y = window.scrollY;
      radio.focus();
      window.scrollTo(x, y);
    }
  });
});
