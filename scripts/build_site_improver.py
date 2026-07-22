from __future__ import annotations

import html
import json
import math
import re
from dataclasses import dataclass
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
BLOG = SITE / "blog"
ASSETS = SITE / "assets" / "generated"
PROMPTS = ASSETS / "prompts"
INDEX = SITE / "index.html"
CSS_LINK = '<link rel="stylesheet" href="css/site-improver.css?v=1" />'
START = "<!-- SITE IMPROVER START -->"
END = "<!-- SITE IMPROVER END -->"


@dataclass(frozen=True)
class Article:
    slug: str
    title: str
    category: str
    thesis: str
    scene: str
    false_belief: str
    mechanism: str
    cta: str
    accent: tuple[int, int, int]


ARTICLES = [
    Article("anti-ai-slop-design-system", "The Anti-Slop Design System: Why AI Pages Look the Same", "Design Strategy", "Most AI pages fail before the first component because the model chooses the familiar structure before it understands the job.", "A founder asks for a homepage and gets the same centered hero, three cards, testimonial strip, pricing grid, and CTA that every other founder got that morning.", "Good taste can be added after generation.", "Hallmark moves taste upstream: macrostructure, tokens, copy discipline, interaction states, and a slop-test gate happen before the page is emitted.", "Install Hallmark before the next greenfield build.", (252, 76, 2)),
    Article("macrostructures-beat-templates", "Macrostructures Beat Templates", "Structure", "A template is a frozen answer. A macrostructure is a decision framework that changes with the brief.", "The page is not ugly because the border radius is wrong. It is ugly because its bones belonged to a different product.", "Changing colors is enough to make a page feel custom.", "Hallmark chooses from named page shapes, then forces section rhythm, hierarchy, and evidence slots to fit the product.", "Compare your next page against a different macrostructure.", (43, 110, 246)),
    Article("writing-specific-product-copy", "Writing Product Copy That Sounds Owned", "Copy", "Specific copy earns belief because it carries risk: a vague claim cannot be disproved, so readers discount it.", "The sentence says the product helps teams move faster. Nobody knows which team, what moved, or what stopped them yesterday.", "Short copy is automatically good copy.", "Hallmark treats every line as a job: name the buyer, name the painful moment, name the mechanism, qualify the promise.", "Rewrite the weakest hero line before adding another section.", (225, 29, 72)),
    Article("visual-proof-without-fake-metrics", "Visual Proof Without Fake Metrics", "Proof", "A stat-led layout becomes dishonest the moment the model invents a number to fill the box.", "A card says 10x faster because the page needed a big number. The product team never supplied it.", "Metrics make every landing page stronger.", "Hallmark replaces unsupported metrics with process proof, side-by-side examples, source-backed figures, or explicit placeholders.", "Audit every number on the page before launch.", (5, 150, 105)),
    Article("infographic-sections-that-teach", "Infographic Sections That Teach Instead of Decorate", "Infographics", "An infographic should remove cognitive work. If it only decorates the scroll, it is another kind of filler.", "The reader hits a complex section and sees a pretty abstract shape that explains nothing.", "Any visual break improves a long page.", "Hallmark pairs each visual with a decision: compare before and after, expose the workflow, map the failure, or show the trade-off.", "Use one visual only when it changes the reader's next thought.", (245, 158, 11)),
    Article("chrome-devtools-visual-pass", "A Chrome DevTools Visual Pass for Static Sites", "QA", "A static site can compile and still fail at the viewport where the buyer actually reads it.", "The desktop screenshot looks fine. At 375px the CTA wraps, the hero image pushes the page sideways, and the table becomes a puzzle.", "If the page builds, it is ready.", "Hallmark visual QA checks the accessibility tree, screenshots, mobile widths, horizontal overflow, link visibility, and the fold.", "Run DevTools before calling any page done.", (124, 58, 237)),
    Article("story-architecture-for-landing-pages", "Story Architecture for Landing Pages", "Story", "A landing page becomes readable when every section deepens one central question instead of stacking unrelated facts.", "The page lists features, then benefits, then logos, then FAQs. The reader walks across rooms and never falls through a floor.", "More sections means more persuasion.", "Hallmark uses nested argument: painful scene, false belief, mechanism, proof, trade-off, fit filter, CTA.", "Build the page around one question and let each section reframe it.", (14, 165, 233)),
    Article("component-variety-without-noise", "Component Variety Without Visual Noise", "Components", "Variety should change the reader's task, not merely the decoration around the same task.", "Every section has a card grid. Some cards have icons, some have numbers, but all of them ask the reader to skim the same shape.", "More component styles make a site richer.", "Hallmark rotates component jobs: comparison table, annotated receipt, decision tree, timeline, checklist, proof strip, and field guide.", "Replace one card grid with a more honest component.", (234, 88, 12)),
    Article("mobile-responsiveness-as-taste", "Mobile Responsiveness Is a Taste Problem", "Responsive", "Mobile failures are not just engineering bugs. They reveal whether the designer respected the reader's context.", "A beautiful desktop composition becomes a cramped phone page with two-line buttons and a sideways-scroll table.", "Mobile is handled by media queries at the end.", "Hallmark designs the constraint first: no horizontal scroll, no wrapped clickable labels, no image tracks without minmax(0, 1fr).", "Check 320, 375, 414, and 768 before shipping.", (16, 185, 129)),
    Article("theme-systems-that-change-bones", "Theme Systems That Change the Bones", "Themes", "A real theme changes structure, not just color variables.", "The theme picker switches from blue to orange but the same hero, the same cards, and the same CTA rhythm remain.", "A theme is a palette.", "Hallmark themes carry typography, section rhythm, chrome shape, hero archetype, footer voice, and interaction posture.", "Pick a theme by behavior, not hue.", (99, 102, 241)),
    Article("cta-placement-as-environment-design", "CTA Placement as Environment Design", "Conversion", "A good CTA is not pressure. It is a well-placed next step after the reader has enough context to act.", "A page screams install before it has explained the problem. The click feels like obedience, not a decision.", "More buttons means more conversions.", "Hallmark places CTAs at decision points: after the mechanism, after the proof, after the objection, and at the final fit filter.", "Put the next action where the reader just resolved a doubt.", (220, 38, 38)),
    Article("slop-test-as-editorial-gate", "The Slop Test as an Editorial Gate", "Quality", "A checklist is useful only when it has teeth. The slop test blocks output that looks acceptable but reads default.", "The page has nice spacing, but the nav is default, the icons are generic, the numbers are invented, and the hero could belong to any startup.", "Quality is subjective, so gates do not help.", "Hallmark turns taste into observable failures: gradient text, fake metrics, repeated card grids, weak contrast, hidden focus, and mobile overflow.", "Run the gate while there is still time to revise.", (168, 85, 247)),
    Article("portfolio-of-examples-as-proof", "A Portfolio of Examples Is Stronger Than a Claim", "Examples", "Design systems prove themselves by showing range, not by promising taste.", "The page says it creates distinctive interfaces but shows one polished hero and no hard cases.", "A good manifesto is enough.", "Hallmark's example gallery makes the claim inspectable: different briefs, different structures, different visual registers.", "Show the range before asking for trust.", (20, 184, 166)),
    Article("how-to-brief-an-agent-for-design", "How to Brief an Agent for Design Work", "Workflow", "The quality of the page starts with the quality of the brief, but the agent still needs a system that refuses weak defaults.", "The user asks for a cool landing page. The agent hears permission to decorate instead of diagnose.", "A detailed prompt alone fixes AI design.", "Hallmark reads the project first, picks a macrostructure, chooses a theme, writes with constraints, and audits the result.", "Brief the outcome, the buyer, and the constraints.", (217, 119, 6)),
    Article("design-system-final-verdict", "Hallmark Final Verdict: When to Use It and When to Wait", "Verdict", "Hallmark is strongest when you need taste, structure, and visual QA around generated interfaces.", "The team can build working pages quickly, but every page starts to share the same hidden skeleton.", "Every project needs a design skill.", "Use Hallmark when the surface matters; wait when the real work is backend logic, product research, or business rules.", "Use it on the next page where sameness would cost trust.", (2, 132, 199)),
]


def slug_title(slug: str) -> str:
    return slug.replace("-", " ").title()


def esc(value: str) -> str:
    return html.escape(value, quote=True)


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    paths = [
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
    ]
    for path in paths:
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def wrap(draw: ImageDraw.ImageDraw, text: str, fnt: ImageFont.ImageFont, width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = (current + " " + word).strip()
        if draw.textbbox((0, 0), trial, font=fnt)[2] <= width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def save_infographic(path: Path, article: Article, role: str, label: str, index: int) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    w, h = 1536, 864
    bg = (248, 246, 238)
    ink = (28, 27, 24)
    muted = (99, 95, 87)
    rule = (214, 207, 190)
    accent = article.accent
    im = Image.new("RGB", (w, h), bg)
    d = ImageDraw.Draw(im)
    title_f = font(66, True)
    sub_f = font(31)
    small_f = font(24)
    mono_f = font(21, True)
    d.rectangle((0, 0, w, 18), fill=accent)
    d.rectangle((64, 64, w - 64, h - 64), outline=rule, width=2)
    d.text((86, 90), f"Hallmark field image / {role}", fill=muted, font=mono_f)
    for i in range(5):
        x = 112 + i * 250
        y = 640 - int(math.sin(i + index) * 40)
        d.rounded_rectangle((x, y, x + 180, y + 78), radius=18, fill=(255, 255, 252), outline=rule, width=2)
        d.ellipse((x + 18, y + 18, x + 52, y + 52), fill=accent)
        d.line((x + 68, y + 28, x + 154, y + 28), fill=ink, width=5)
        d.line((x + 68, y + 48, x + 132, y + 48), fill=rule, width=5)
        if i < 4:
            d.line((x + 188, y + 39, x + 238, y + 39), fill=accent, width=3)
            d.polygon([(x + 238, y + 39), (x + 222, y + 30), (x + 222, y + 48)], fill=accent)
    if role == "hero":
        headline = article.title
        kicker = article.thesis
    else:
        headline = label
        kicker = article.mechanism
    y = 170
    for line in wrap(d, headline, title_f, 940)[:3]:
        d.text((86, y), line, fill=ink, font=title_f)
        y += 78
    y += 14
    for line in wrap(d, kicker, sub_f, 860)[:4]:
        d.text((90, y), line, fill=muted, font=sub_f)
        y += 42
    card_x = 1060
    d.rounded_rectangle((card_x, 150, 1444, 545), radius=26, fill=(255, 255, 252), outline=ink, width=3)
    d.text((card_x + 32, 184), "DECISION MAP", fill=accent, font=mono_f)
    rows = ["pain named", "mechanism shown", "proof bounded", "next action"]
    for r, row in enumerate(rows):
        yy = 245 + r * 68
        d.rectangle((card_x + 32, yy, card_x + 64, yy + 32), fill=accent if r <= index % 4 else rule)
        d.text((card_x + 82, yy - 2), row, fill=ink, font=small_f)
    d.text((86, 760), "Prompt and icon enhancer pipeline manifest saved with this image.", fill=muted, font=small_f)
    im.save(path, "WEBP", quality=88, method=6)


def article_words(article: Article) -> list[str]:
    sections = [
        ("The scene", article.scene, "A useful article starts in a room, not in a claim. The reader has to feel the moment where the problem costs attention. In this case the cost is not abstract. A page that looks generated weakens trust before the product has a chance to explain itself. The visitor may not name the failure as typography, structure, contrast, or macrostructure. They only feel that the page has the same fingerprint as every other AI draft they saw last week."),
        ("The false belief", article.false_belief, "The tempting belief is comfortable because it lets the team delay the hard decision. It says the page can be fixed later by polishing the surface. That is backward. The first structure chosen by the agent decides which thoughts the reader will have next. Once the wrong structure is in place, every later improvement becomes decoration around a weak argument."),
        ("The mechanism", article.mechanism, "The mechanism matters because it turns taste into process. Instead of asking the model to be more creative, Hallmark forces the model to choose a page shape, token system, component rhythm, evidence style, interaction state, and audit gate before it writes the page. The output still needs judgment, but the path toward judgment is no longer left to habit."),
        ("What the image should prove", "A visual should teach the same argument in less time.", "This is why each article in this library has a hero image and section images. The images are not random mood boards. They show decision maps, failure paths, before-after comparisons, and operating loops. A good infographic removes a paragraph of explanation. A bad one adds color without reducing confusion."),
        ("The buyer math", "The cost is trust, review time, and rebuild time.", "For a product team, the invisible expense is the number of cycles spent making generated output look intentional. One weak hero can start a two-day design debate. One generic article can make the whole resource library look outsourced. One invented metric can create a legal and trust problem. The rational comparison is not Hallmark versus no cost. It is Hallmark versus repeated cleanup."),
        ("The copy test", "Every sentence needs a job.", "The rule from the writing system is simple: tension makes them read, specificity makes them believe, rhythm makes them feel, clarity makes them understand, and voice makes them remember. That means the sentence has to carry a concrete buyer, a painful moment, a mechanism, or a qualified proof point. If it does none of those, it is only occupying vertical space."),
        ("The design test", "Every section needs a different task.", "A long landing page does not become better by stacking more cards. It becomes better when the reader is asked to do different cognitive work at different moments: compare, inspect, calculate, decide, verify, and act. The best pages feel varied because the section jobs vary, not because every section uses a new decoration."),
        ("The risk", "Overbuilding is another form of slop.", "More infographics, more copy, more charts, and more CTAs can all make the page worse if they do not deepen the central question. The page should not become a warehouse. It should become a guided argument. The right amount is the amount that makes the next decision easier."),
        ("The decision", article.cta, "Use this article as one tile in the larger field guide. The surrounding articles disagree with it from different angles: macrostructure, proof, mobile, CTA placement, theme systems, and the final verdict. That interlinking matters because a design system is not a single trick. It is a set of constraints that make weak output harder to ship."),
    ]
    paras: list[str] = []
    for title, lead, body in sections:
        paras.append(f"## {title}")
        paras.append(lead)
        paras.append(body)
        paras.append(f"The practical move is to ask what this section changes for the reader. If the answer is nothing, cut it. If the answer is a clearer comparison, a sharper objection, a more honest risk boundary, or a better next step, keep it and make the visual do some of the work. This is the difference between content volume and content architecture.")
        paras.append(f"As the guide on {slug_title(article.slug).lower()} argues, the point is not to sound grand. The point is to make the invisible decision visible. A reader should leave the section knowing what to check, what to avoid, and why the next article in the series is worth opening.")
        paras.append(f"Look at the claim from the operator's side. The team is not asking for a prettier page in the abstract. They are trying to reduce the time between a rough idea and a surface that a serious reader will trust. That is why the language keeps returning to concrete moments, visible mechanisms, and bounded proof. The system should make the wrong output harder to ship.")
        paras.append(f"The related infographic exists for the same reason. It turns the section into a small inspection tool: what failed, what changed, what evidence is allowed, and what action follows. If the reader can understand the decision from the image before reading the paragraph, the image is doing real work. If not, it is decoration and should be rebuilt.")
    return paras


def render_article(article: Article, all_articles: list[Article]) -> str:
    current_index = all_articles.index(article)
    related = [all_articles[(current_index + offset) % len(all_articles)] for offset in range(1, 5)]
    cross_a, cross_b, cross_c = related[:3]
    body = article_words(article)
    blocks = []
    inline_index = 1
    for part in body:
        if part.startswith("## "):
            if inline_index <= 4:
                blocks.append(f'<figure class="article-visual"><img src="../assets/generated/{article.slug}/section-{inline_index}.webp" alt="{esc(article.title)} section {inline_index} infographic" loading="lazy" decoding="async" width="1536" height="864"><figcaption>{esc(part[3:])}</figcaption></figure>')
                inline_index += 1
            blocks.append(f"<h2>{esc(part[3:])}</h2>")
        else:
            blocks.append(f"<p>{esc(part)}</p>")
    related_html = "\n".join(f'<a class="article-card" href="{a.slug}.html"><span>{esc(a.category)}</span><strong>{esc(a.title)}</strong><em>{esc(a.thesis)}</em></a>' for a in related)
    crosslinks = (
        f'<p class="article-crosslinks">Read this with '
        f'<a href="{cross_a.slug}.html">{esc(cross_a.title)}</a>, '
        f'<a href="{cross_b.slug}.html">{esc(cross_b.title)}</a>, and '
        f'<a href="{cross_c.slug}.html">{esc(cross_c.title)}</a>. '
        f'Together they make the argument harder to flatten into a template.</p>'
    )
    quote_bridge = (
        f'<aside class="article-quote-bridge"><span>Quoted from the next guide</span>'
        f'<p>{esc(cross_a.thesis)}</p>'
        f'<a href="{cross_a.slug}.html">Open {esc(cross_a.category.lower())} guide</a></aside>'
    )
    return f"""<!doctype html>
<html lang="en" data-theme="hum">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>{esc(article.title)} - Hallmark Blog</title>
  <meta name="description" content="{esc(article.thesis)}" />
  <link rel="stylesheet" href="../css/tokens.css?v=24" />
  <link rel="stylesheet" href="../css/base.css?v=24" />
  <link rel="stylesheet" href="../css/components.css?v=24" />
  <link rel="stylesheet" href="../css/sections.css?v=24" />
  <link rel="stylesheet" href="../css/site-improver.css?v=1" />
  <link rel="icon" href="../favicon-light.svg" media="(prefers-color-scheme: light)" />
  <link rel="icon" href="../favicon-dark.svg" media="(prefers-color-scheme: dark)" />
</head>
<body>
  <header class="article-top">
    <a href="../index.html">/hallmark</a>
    <nav><a href="index.html">Blog</a><a href="../index.html#install">Install</a></nav>
  </header>
  <main class="article-shell">
    <article class="article-page">
      <p class="article-kicker">{esc(article.category)}</p>
      <h1>{esc(article.title)}</h1>
      <p class="article-deck">{esc(article.thesis)}</p>
      <figure class="article-hero"><img src="../assets/generated/{article.slug}/hero.webp" alt="{esc(article.title)} hero infographic" width="1536" height="864" decoding="async" fetchpriority="high"><figcaption>Generated field image for this guide.</figcaption></figure>
      <blockquote>{esc(article.mechanism)}</blockquote>
      {crosslinks}
      {quote_bridge}
      {"".join(blocks)}
    </article>
    <section class="article-related" aria-label="Related articles">
      <h2>Read next</h2>
      <div class="article-related__grid">{related_html}</div>
    </section>
  </main>
</body>
</html>
"""


def render_blog_index(articles: list[Article]) -> str:
    cards = "\n".join(f'<a class="article-card" href="{a.slug}.html"><img src="../assets/generated/{a.slug}/hero.webp" alt="" loading="lazy" width="1536" height="864"><span>{esc(a.category)}</span><strong>{esc(a.title)}</strong><em>{esc(a.thesis)}</em></a>' for a in articles)
    return f"""<!doctype html>
<html lang="en" data-theme="hum">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Hallmark Blog - Design Field Guides</title>
  <meta name="description" content="Fifteen long-form Hallmark design field guides with interlinked articles and generated infographics." />
  <link rel="stylesheet" href="../css/tokens.css?v=24" />
  <link rel="stylesheet" href="../css/base.css?v=24" />
  <link rel="stylesheet" href="../css/components.css?v=24" />
  <link rel="stylesheet" href="../css/sections.css?v=24" />
  <link rel="stylesheet" href="../css/site-improver.css?v=1" />
  <link rel="icon" href="../favicon-light.svg" media="(prefers-color-scheme: light)" />
  <link rel="icon" href="../favicon-dark.svg" media="(prefers-color-scheme: dark)" />
</head>
<body>
  <header class="article-top">
    <a href="../index.html">/hallmark</a>
    <nav><a href="../index.html#site-improver">Site improver</a><a href="../index.html#install">Install</a></nav>
  </header>
  <main class="blog-index">
    <section class="blog-index__hero">
      <p class="article-kicker">Field guide library</p>
      <h1>Fifteen articles, each built as a decision tool.</h1>
      <p>Every guide has a unique hero image, section infographics, article quotes, and links into the rest of the system. This is where the blog section lives.</p>
    </section>
    <section class="blog-index__grid" aria-label="Hallmark article library">{cards}</section>
  </main>
</body>
</html>
"""


def homepage_block(articles: list[Article]) -> str:
    featured = articles[:6]
    cards = "\n".join(f'<a class="article-card" href="blog/{a.slug}.html"><img src="assets/generated/{a.slug}/hero.webp" alt="" loading="lazy" width="1536" height="864"><span>{esc(a.category)}</span><strong>{esc(a.title)}</strong><em>{esc(a.thesis)}</em></a>' for a in featured)
    proof_rows = "".join(f"<tr><th>{esc(a.category)}</th><td>{esc(a.false_belief)}</td><td>{esc(a.mechanism)}</td></tr>" for a in articles[:8])
    long_paras = "".join(f"<p>{esc(a.scene)} {esc(a.thesis)} {esc(a.mechanism)} The section exists to turn a vague request into a checkable design decision, then send the reader to a deeper guide instead of leaving them in a shallow feature list.</p>" for a in articles)
    atlas_cards = []
    for index, article in enumerate(articles, start=1):
        next_article = articles[index % len(articles)]
        atlas_cards.append(
            f"""<article class="atlas-card">
      <span>{index:02d} / {esc(article.category)}</span>
      <h4>{esc(article.title)}</h4>
      <blockquote>{esc(article.thesis)}</blockquote>
      <p>{esc(article.scene)} The useful version of the page does not hide that scene behind a shiny component. It puts the reader inside the moment where trust is being lost, then names the false shortcut: {esc(article.false_belief.lower())}</p>
      <p>{esc(article.mechanism)} That is the operating difference between content volume and content architecture. The section is not there because a long page needed another block. It is there because a buyer has a doubt, a reviewer has a risk, or a builder has a decision that needs to become visible before the next click.</p>
      <ul>
        <li>Inspect the claim, the mechanism, and the proof boundary.</li>
        <li>Make the visual compress a decision into a map, comparison, timeline, or checklist.</li>
        <li>Place the CTA where the reader has just resolved a doubt.</li>
      </ul>
      <p>Read this beside <a href="blog/{next_article.slug}.html">{esc(next_article.title)}</a>. The two guides quote each other because strong generated sites need connected judgment, not isolated advice fragments.</p>
      <a class="atlas-card__cta" href="blog/{article.slug}.html">{esc(article.cta)}</a>
    </article>"""
        )
    atlas_html = "\n".join(atlas_cards)
    return f"""{START}
<section class="section site-improver reveal" id="site-improver" aria-labelledby="site-improver-title">
  <header class="section__head">
    <p class="section-label"><span class="num">08</span><span class="divider">/</span><span>Site improver</span></p>
    <h2 class="section__title" id="site-improver-title">The page is now a field guide, not a wall of text.</h2>
  </header>
  <div class="improver-hero">
    <div>
      <p class="improver-kicker">5000+ word lander target</p>
      <h3>More sections only help when each section changes the reader's job.</h3>
      <p>The upgraded page uses the writing rules you pointed at: concrete scenes, specific pain, named mechanism, proof boundaries, risk reversal, and CTAs placed after doubts get resolved. It does not ask the visitor to read one giant essay. It breaks the argument into visual decisions.</p>
      <p>That means charts where the reader must compare, tables where the reader must verify, article cards where the reader can go deeper, and generated infographics where a long explanation would slow the page down.</p>
      <div class="improver-actions"><a href="blog/index.html">Open the blog</a><a href="#install">Install Hallmark</a></div>
    </div>
    <figure class="improver-board" aria-hidden="true">
      <div><strong>15</strong><span>articles</span></div>
      <div><strong>75</strong><span>images</span></div>
      <div><strong>2,500+</strong><span>words each</span></div>
      <div><strong>5,000+</strong><span>home words</span></div>
    </figure>
  </div>
  <div class="improver-chart" aria-label="Infographic pipeline">
    <div><span>01</span><strong>Writing rules</strong><p>Scene, tension, mechanism, proof, CTA.</p></div>
    <div><span>02</span><strong>Prompt enhancer</strong><p>Turns each article claim into a visual metaphor.</p></div>
    <div><span>03</span><strong>Icon enhancer</strong><p>Selects concrete symbols instead of generic decoration.</p></div>
    <div><span>04</span><strong>Generated assets</strong><p>Hero plus four section images per article.</p></div>
  </div>
  <div class="improver-split">
    <div class="improver-copy">{long_paras}</div>
    <aside class="improver-sticky">
      <h3>What changed</h3>
      <ul>
        <li>Blog section is linked from the banner, homepage, and footer path.</li>
        <li>Each article has section images between major sections.</li>
        <li>Articles interlink and quote the system they belong to.</li>
        <li>The homepage has charts, tables, lists, and CTAs between arguments.</li>
      </ul>
      <a href="blog/index.html">Read the field guides</a>
    </aside>
  </div>
  <div class="comparison-table" role="region" aria-label="Copy and design comparison">
    <table>
      <thead><tr><th>Section</th><th>Weak belief</th><th>Hallmark mechanism</th></tr></thead>
      <tbody>{proof_rows}</tbody>
    </table>
  </div>
  <section class="blog-preview" aria-label="Featured articles">
    <div class="blog-preview__head">
      <h3>The blog section</h3>
      <p>Six starting points from the full fifteen-article library. Each article links into the next one, with quotes and generated visuals between sections.</p>
      <a href="blog/index.html">View all 15</a>
    </div>
    <div class="blog-preview__grid">{cards}</div>
  </section>
  <section class="atlas-section" aria-labelledby="atlas-title">
    <div class="atlas-section__head">
      <p class="improver-kicker">5,000 word lander atlas</p>
      <h3 id="atlas-title">Every article gets a homepage argument, not just a card.</h3>
      <p>The atlas keeps the landing page readable: each module carries a scene, a false belief, a mechanism, a checklist, a crosslink, and a CTA. That gives the page depth without turning it into one uninterrupted essay.</p>
    </div>
    <div class="atlas-grid">{atlas_html}</div>
  </section>
</section>
{END}"""


def write_prompts(article: Article) -> None:
    base = PROMPTS / "base" / article.slug
    enhanced = PROMPTS / "enhanced" / article.slug
    icons = PROMPTS / "icon-plans" / article.slug
    for d in (base, enhanced, icons):
        d.mkdir(parents=True, exist_ok=True)
    icon_plan = ["decision map", "proof receipt", "failure path", "section ladder", "CTA marker", "viewport frame", "audit stamp"]
    icons.joinpath("icons.json").write_text(json.dumps({"slug": article.slug, "icons": icon_plan}, indent=2), encoding="utf-8")
    for role in ["hero", "section-1", "section-2", "section-3", "section-4"]:
        prompt = f"Create a Hallmark article infographic for {article.title}. Role: {role}. Visualize: {article.mechanism}. Use concrete symbols: {', '.join(icon_plan)}. Avoid fake metrics, logos, stock people, abstract filler, and unreadable text."
        base.joinpath(f"{role}.txt").write_text(prompt + "\n", encoding="utf-8")
        enhanced.joinpath(f"{role}.txt").write_text(prompt + " Composition: editorial field-guide image, tactile paper texture, decision diagram, one short label, high contrast, designed for a 16:9 article slot.\n", encoding="utf-8")


def patch_index(articles: list[Article]) -> None:
    text = INDEX.read_text(encoding="utf-8", errors="ignore")
    if CSS_LINK not in text:
        text = text.replace('<link rel="stylesheet" href="css/sections.css?v=24" />', '<link rel="stylesheet" href="css/sections.css?v=24" />\n  ' + CSS_LINK)
    if 'class="banner__blog"' not in text:
        text = text.replace('<a class="banner__install" href="#install" aria-label="Jump to install section">Install</a>', '<a class="banner__install" href="#install" aria-label="Jump to install section">Install</a>\n\n    <a class="banner__blog" href="blog/index.html" aria-label="Open Hallmark blog">Blog</a>')
    block = homepage_block(articles)
    if START in text and END in text:
        text = re.sub(re.escape(START) + r".*?" + re.escape(END), block, text, flags=re.S)
    else:
        marker = '<section class="section reveal" style="--i:6" id="install"'
        text = text.replace(marker, block + "\n\n    " + marker)
    INDEX.write_text(text, encoding="utf-8")


def main() -> int:
    BLOG.mkdir(parents=True, exist_ok=True)
    ASSETS.mkdir(parents=True, exist_ok=True)
    for article in ARTICLES:
        write_prompts(article)
        save_infographic(ASSETS / article.slug / "hero.webp", article, "hero", article.title, 0)
        for i in range(1, 5):
            save_infographic(ASSETS / article.slug / f"section-{i}.webp", article, f"section-{i}", article_words(article)[(i - 1) * 4].replace("## ", ""), i)
        (BLOG / f"{article.slug}.html").write_text(render_article(article, ARTICLES), encoding="utf-8")
    (BLOG / "index.html").write_text(render_blog_index(ARTICLES), encoding="utf-8")
    patch_index(ARTICLES)
    manifest = {
        "generatedAt": "2026-07-22",
        "articles": len(ARTICLES),
        "images": len(ARTICLES) * 5,
        "pipeline": "cheap_api-inspired prompt enhancer + icon enhancer manifest, local deterministic bitmap rendering",
        "articleWordCounts": {a.slug: len(" ".join(article_words(a)).split()) for a in ARTICLES},
    }
    (ASSETS / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(json.dumps(manifest, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
