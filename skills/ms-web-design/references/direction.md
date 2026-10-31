# Custom: a page of its own

The opt-in path, taken only when the user asks for it (**custom**, "bespoke", "no theme", "a world of its own", "derive it"); silence deals a theme. The catalog takes it back when the user names a theme ("custom, something like Newsprint" is that theme with a mood note), when a `design.md` or a real brand already exists (inherit it), in component scope, and under `--fast` (say so).

## Yours, all of it

On a custom run nothing is dealt and nothing is prescribed: no theme, no shape, no section list, no component, no palette recipe, no draw. What the page is, how it is built and how it looks are your decisions, made for this one client. Hallmark keeps three things: the floor, the gates against machine-made pages, and the sweep. SKILL.md calls you a capable designer; here it means it in full.

So aim higher than a good page. Make the one a design lead would bring to a client who has already turned down every template: something you have never made before, that no other prompt could have produced, that a designer would stop to look at twice. Be ambitious in the idea and exact in the execution.

- **Unique is specific.** Every large decision belongs to this client: its subject, its place, its materials, its numbers, the way its people talk. Put the nearest competitor's name on the page; if it still works, keep going.
- **Clean is exact, not empty.** A system you can see (a few type sizes far apart, one spacing rhythm, edges that line up), nothing on the page that is not doing a job, and on every screen one thing strong enough to be its reason.
- **Full is the floor.** A custom page is a whole site, not a hero and a sampler: everything the client has to say and show, from the first screen to the footer, usually six to nine sections, each built around something worth looking at (the product working, a photograph, real facts set large, something to try). Less to look at is not cleaner, only thinner; a section that is a head and a paragraph is unfinished.
- **Free is free.** Dark or light, one colour or four, type as the picture or photographs edge to edge, a structure no template has, something the visitor can try: every road is open when the idea asks for it.

## Before the first line of code

1. **Learn the subject.** What only this client has: the name and what it means, the place and how it looks, what it does in one verb, its real numbers, its hours and rituals, what its world makes, prints or wears, the words its customers use, and whatever the prompt supplies.
2. **Set aside the page you would make anyway.** Picture the page this prompt gets without trying, and its obvious twist; neither ships. Yours is usually a split hero with the head on the left and a picture on the right, three numbered steps, rows of label and value between hairlines, a closing band with a form, a dark footer under a huge wordmark, small grey labels, and a pale ground with one careful accent. Two of those in one plan means the plan is the template: start again from the idea.
3. **Go wide, then choose.** Sketch three directions as far apart as you can make them, two lines each: the idea, how the page is built, how it looks. Build the one a design lead would fight for, never the safest; borrow from the other two only what makes it stronger.
4. **Let the idea run the page.** One thought the whole page grows from, true of this client and no other. It can live in the type, the colour, the structure, the motion, the way the product is shown, or something the visitor does. Let it decide the rest, top to bottom: an idea that stops at the hero is a template with a good hero.
5. **Let the content build the structure.** Decide what a visitor must see, understand and do, and in what order, then give each part the form that shows it best. What the sections are, their order, the nav and the footer are yours; the stamp names what you made.

## Spent

What every model ships, refused on sight:

- cream, off-white or beige paper with a high-contrast serif and a clay accent (65); near-black with one neon accent; a pale ground with one timid accent; purple into blue (2a); a hue picked for the category, such as blue for software or green for health;
- the faces you reach for first (`fonts.md`, its banned and saturated lists) and any face a catalog theme sets;
- a centred head over three cards, or the run of hero, features, call to action and footer (3, 8); a stock second action;
- a subject painted on instead of known: paper or grain as a surface, a stamp, a dial or a knob as ornament, bevels, an engraving, a drawing of the thing (47c, 80);
- an eyebrow, tracked capitals, mono labels, one coloured word in a head, middle-dot strings (54, 67, 64, 38iii, 63).

## Pictures

Only when the subject has something to show. A place, food, people at work, an object, a craft: photographs, few and large, the user's or the library's (`imagery.md` § 2), credited, never a wall of them (83). Software: the product itself, built and working (`imagery.md` § 4). A service, an idea or a body of words: type and colour can carry the whole page, and often should. Every picture passes the deletion test: take it away and the page loses a fact. A picture for mood alone goes.

## Words

The copy is half the design, and the first place a generated page gives itself away. `craft.md` § 6 binds in full: the owner's own nouns, a fact in every head, no line a competitor could use unchanged, about 80 words a screen. Give the headline a shape of its own: two clipped fragments in a row is the one every model reaches for. Then read the headings alone: they should tell this client's story and no one else's.

## What still binds

The Floor, every gate in `gates.md` (44a and 44c leave a custom hero free), `craft.md` wherever it states a rule (its sizes and its Restrained default are a theme's starting point, not yours), the facts rule (46a), licensed pictures, the stamp, the log, the sweep and both reviews. Not `layout.md`, the genre file, the shape catalog or the draw. `patterns.md` shows how states, slots and forms work, never how they look.

## Mechanics

- **Scaffold:** `theme.mjs scaffold --custom`. Fill every `--color-*` and `--font-*`; the scale it writes is a start, not a style, so set the sizes, spacing, widths and gaps the design needs and keep the names.
- **Faces:** one family or two, three with an outlier that carries one role; free faces unless the user confirms a licence; the display face is one no catalog theme sets (`node <skill-dir>/scripts/theme.mjs check --face "<face>"`). `fonts.md` lists faces no theme uses: a start, not a menu.
- **Colour:** OKLCH, any posture (`craft.md` § 2), declared in the stamp with its reason (23); contrast and focus unchanged (40, 41, 26a). Check the accent against the catalog with `theme.mjs check --hue <h>`, or with `--axes` once you know them.
- **Picks block:** Shape and Theme become **Idea** (one sentence) and **Look** (ground, ink, accent and faces, each with where it came from); every other row says what you decided.
- **Stamp and log:** `theme: custom · idea: "<one sentence>" · vibe: "<4 to 8 words>"`, the paper, accent and faces, `hero:` in your own words, and `posture` and `axes` as on any build: `<paper>/<display>/<accent>`, the values `theme.mjs check` prints (paper light, mid or dark; display a class such as roman-serif or grotesk-heavy; accent warm, cool, neutral or chromatic-<hue name>). The finish reviewer reads the idea where a theme build has its theme (`review-finish.md`).
