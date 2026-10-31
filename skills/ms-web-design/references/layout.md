# Layout

The canvas, the sizes, the sections and the hero for every theme build; a custom run designs its own (`direction.md`). A page looks made when every screen holds one idea at the right size. Numbers are at 1440 x 900 unless a line says otherwise.

## 1. The canvas

- **One container, centred and capped:** `.container` from the scaffold, `--container` 1440px with `--gutter` 64px, so content is 1312px wide at 1440 and stays 1312px at 1920 while the gutters grow (44d).
- **Twelve columns inside it**, `--gap-columns` 32px apart: one column is 80px, four 416px, six 640px, eight 864px. Every section places its parts on these columns, so left edges line up from the nav to the footer.
- **Every section:** the outer element owns the background and the block padding, the inner `.container` the width and only `padding-inline` (a `padding` shorthand there silently zeroes the rhythm). A full-bleed band changes the background and keeps the container.

## 2. Sizes

The scaffold writes these tokens and `base.css` sets them on the elements. A theme changes faces, weights, tracking and case; the steps hold, except where a theme sets its display a step larger.

| Role | Token | At 1440 | Element |
| --- | --- | --- | --- |
| Hero head | `--text-display` | 84px | `h1` |
| Long hero head, statement | `--text-display-s` | 60px | `.display-s` |
| Section head | `--text-section` | 52px | `h2` |
| Item title | `--text-title` | 25px | `h3` |
| Lead (the one line under a head) | `--text-lead` | 21px | `.lead` |
| Body | `--text-md` | 16px | `p` |
| Label, caption, meta | `--text-sm` | 14px | `small`, `figcaption`, `th` |

- A section head under 40px at 1440 is the most common reason a page looks unfinished (78). The hero head is about one and a half times the section head, the section head about twice the item title.
- A head and its line sit 16 to 24px apart (`--space-md` to `--space-lg`); the head block and the section's content 48 to 64px (`--space-2xl`), 40px in a tight composition.
- Grid items sit `--gap-columns` apart across and 48 to 64px apart down; a card or well takes 32 to 40px of padding.

## 3. Rhythm between sections

- Sections part by the three scaffold steps, `--section-gap-s` 120px, `--section-gap` 144px and `--section-gap-l` 176px, mixed (59). A band (a change of paper) takes `--section-gap-s` of padding top and bottom.
- Space is earned by mass: a 144px gap frames a 700px section and is a hole under a 200px one. An empty-looking page wants a bigger head, a bigger visual or a fuller section, not a smaller gap.
- Six to nine sections, hero and footer included; five on a thin prompt, never fewer. Height follows content (often 5,000 to 8,000px with pictures and a full prompt, 3,000 to 4,000px on a thin one); never pad toward a height.

## 4. A section

A section is one piece of the page's content shown at its best: the menu, the lineup, the latest issue, the product at work, the room, the price. Decide the content first, then the composition that shows it best. Most sections carry a **head block** above or beside a **body** from § 5; a section whose content names itself (a menu, a timetable, a track list, a list of issues, the product's own screen) may go without one, or carry its head inside the content (the menu's own title, the date over the lineup). Never more than two neighbours with the same skeleton: a page of head-then-block, head-then-block reads as a template however good each block is. What real sites in each category are built around is in `anatomy.md`.

- **The head block:** an `h2` of six words or fewer at `--text-section` (a staged shape may head each stage with its one-word name), at most one line at `--text-lead` beneath it, on columns 1 to 6 or 1 to 7, or split (head on 1 to 5, the line on 7 to 12, baselines aligned). Centred only over a symmetric body, and never more centred head blocks than left-aligned ones.
- **The body fills the width:** its widest row reaches ten of the twelve columns (77). A narrow text block with the right half empty is the sparse page's signature; pair it with a visual, split it, or set it as a statement.
- **The body has mass:** a visual 360px tall or more; a set of three or four items across the width; a list or table of three or more rows across ten columns; a working control on the prompt's own facts; or a statement at `--text-section` or larger. A head and a paragraph are a head block, never a section.
- **A split balances:** text and visual centre on each other within 60px, and neither column leaves more than a fifth of the row empty.
- **Content sets the height:** usually 520 to 900px; under 360px only for a band (a call to action, a logo row, a statement), at most twice a page.

## 5. Compositions

Layouts, not components: build each in the theme's material and the prompt's content. A page uses three to six different ones and never the same one twice in a row, except in a one-composition shape (Split Studio, Feature Stack, Catalogue), where neighbours change ratio and, where the shape allows, side.

1. **Split.** A text block (head, line, two to four short facts or one action) beside a visual on columns 6 to 12 or 7 to 12, 440px tall or more at 4:3 to 4:5 (portrait for a product photograph). Swap the side at most once a page; change the ratio (5 and 7, 4 and 8, 6 and 6) between two splits.
2. **Showcase.** The head block, then one visual across all twelve columns at 16:9 to 21:9, 560px tall or more; beneath it at most two smaller visuals at 8 and 4 or 7 and 5, never three equal frames.
3. **Grid.** Three or four items across (or two by two): plans, products, places, rooms, dishes, each with its photograph, a large figure or a title big enough to carry the cell, then one line; equal heights, aligned tops, 240px or taller. Never empty frames (68), stock faces for people (F9) or icon tiles over headings (3).
4. **Bento.** Four to six tiles on six or twelve columns in mixed spans (8 and 4 over 4, 4 and 4; or 7 and 5 over 5 and 7), rows 280 to 360px, two tiles at least with a visual, one clearly the lead.
5. **Rows.** Three to five full-width rows parted by hairlines, 72 to 120px each: a title at `--text-title` on columns 1 to 5, its line or figure on 6 to 12. A head block may sit on 1 to 4 beside rows on 5 to 12 (an FAQ, an index, a timeline, a price list).
6. **Table.** Full width, four or five rows of 56 to 72px, numerals tabular, the column that names the row one step heavier.
7. **Figures.** Three or four real numbers at `--text-display-s`, labels beneath, across the twelve columns, parted by vertical hairlines. Only figures the user gave (46a).
8. **Steps.** Three or four stages across, each a numeral (a real `<ol>`, never a `01` label over a head, 54), a title and a line, with a visual beneath or beside where the material has one; or a vertical run with a visual per stage on a fixed side.
9. **Statement.** One sentence filling eight to ten columns in two or three lines, from `--text-section` up to `--text-display` (a condensed or light face takes the larger step), with its attribution or one action; once a page.
10. **Band.** A change of paper (`--color-paper-2`, the ink, or a field of the accent where the posture allows) edge to edge, the container inside, holding whatever the page's job wants there: the next free table times, the buy box, the store buttons beside a screen, the next date and the address. Never an email field by default (85).
11. **Form.** The fields on six or seven columns beside the head block and two to four facts, inputs 48 to 56px tall, one primary action.
12. **Rail.** A horizontal run past the container's edge (dates, issues, products, rooms, episodes), five or more items with the next one cut by the edge, scrollable by touch and keyboard, snap points, no arrows needed past two.
13. **Pinned.** One visual held sticky on six or seven columns while three or four short panels scroll past it on the other side, each changing what the visual shows (a state, a crop, a step); static under 60rem.
14. **Switcher.** One area with two to five states behind a segmented control: the menu by lunch and dinner, the plans by month and year, the app on phone and watch, the schedule by day. Every state real; the first visible without script.
15. **Index.** A dense, scannable list of the prompt's own items with their facts in columns (issues with dates and topics, projects with year and client, episodes with length, lots with estimates), optionally filtered; 6 to 20 rows, the lead row larger.
16. **Schedule.** Time against place or day: a two-day festival as two columns of acts and times, a week of classes, opening hours as a strip; the current or next slot marked. Only for times the visitor picks or plans around, never a process, a workday or a delivery told as clock times.
17. **Offer.** The thing for sale with what a buyer needs at the moment of buying: the photograph or screen, the options (size, scent, plan), the price, the action and one line of delivery or terms. On a buy page it is often the hero.

Under 60rem every composition stacks in reading order: the head block, then the body; a split's visual after its text; a grid two across, then one under 40rem; a bento's lead tile first; a rail stays a rail; a pinned pair unpins; a schedule turns into one column per day. Visuals keep their aspect ratio and lose their minimum height; nothing scrolls sideways except a rail or a table that says so (`responsive.md`).

## 6. The hero

The first screen at 1440 x 900 and 1920 x 1080, and only the first screen (44c). Pick a posture at Step 2 from the job (`anatomy.md`), stamp it, and vary it run to run; text beside a picture (Settled, Stage) is the most common generated hero, so take it only when the picture is the strongest thing the prompt has.

| Posture | Height | Content |
| --- | --- | --- |
| **Settled** | fills the screen under the nav | centred in the screen; the text on six columns, the visual on the other six |
| **Stage** | fills the screen under the nav | the text on five columns, a visual on seven at 60 to 75% of the screen tall (reversed when a poster-size head needs the width); it may bleed off the outer edge |
| **Banner** | 50 to 60% of the screen | the first section shows above the fold; for references, docs, utilities |
| **Ledge** | fills the screen | a tall field above, the head resting at the base; at 1920 the head grows to its cap first |
| **Corridor** | fills the screen | one centred column of 44ch or less, the head larger than usual |
| **Poster** | 92 to 100dvh | a full-bleed photograph or canvas, the content on its calmest part with room around it, low and left or centred, never squeezed into a corner |
| **Counter** | fills the screen under the nav | the action is the visual: the subscribe field with the latest issue, the booking times, the buy box with its options, the download with the screen, set large beside or under a shorter head |
| **Index** | fills the screen under the nav | the content is the visual: the lineup, the menu, the list of issues or projects, set as the page's lead with the head small above it; for pages whose list is the reason to come |

- **Centred in its screen.** For Settled, Stage, Banner and Corridor the space under the content is 1.0 to 1.5 times the space above it (44a), and the lowest content sits within 160px of the fold (79). Spend spare height on a larger visual or larger type, never on copy.
- **The visual is big:** six or seven columns wide and 60% of the screen tall or more (520px at 1440 x 900), or a portrait object (a cover, a phone, a bottle) at 75% tall on four or five columns; its centre within 60px of the text block's. The hero grid is two tracks (`6fr 5fr`, `5fr 7fr`) with its own gap of `--space-2xl` to `--space-3xl`, so text and visual stand 48 to 120px apart; spans on the twelve columns leave an empty column between them. Under 60rem the gap becomes a row gap of `--space-xl`. What it shows is `imagery.md` § 1; a working form is a section or a close, not the default hero.
- **No visual:** the head grows to `--text-display` at its cap across eight to twelve columns, or the posture is Banner and the first section starts by 640px.
- **The text:** the head (seven words or fewer), one sentence at `--text-lead`, one or two actions (58). Under 60rem every posture collapses to its content's height (Poster may stay full-bleed).

## 7. The page

- **The job decides the anatomy** (`anatomy.md`): where the action lives (in the hero, sticky, repeated beside the content, at the close), and which category-native sections the page is built around. A newsletter puts the subscribe field in the hero and shows the issues; a restaurant shows the menu and the booking; a band shows the record and the dates. The theme dresses that anatomy; it never replaces it.
- **Order follows the argument the shape makes** (`macrostructures.md`), never hero, three features, a call to action and a footer (8). Lead with the strongest real thing after the hero; put each fact where it does work.
- **Not every page has steps, figures or a schedule.** Steps only for a process the visitor really goes through (booking, joining, getting a festival ticket); a figure row only for three numbers the prompt states outright, never one derived from it (365 mornings from "every day"). Together they appear on most generated pages; on a made page they are a choice.
- **Variety:** never the same composition in neighbouring sections (a one-composition shape aside); mirror a split once at most, never a zigzag; one full-width visual at least on a product page; one or two bands. Read the log's `sections`: a Statement, Steps, Figures and a closing Band are the easiest reaches, so when the last build used one, make that beat another way.
- **Balance:** photographs take a quarter to a third of the page below the hero (83), and never lead two sections in a row; the sections between are built from the theme's material (its Range: type, figures, rules, the product, a table, a form). `imagery.md` § 5 has the counts.
- **Pace:** a dense section (a grid, a table, a bento, an index) is followed by a quiet one (a statement, a showcase); the page ends on a real close.
- **The close is the job, not a form.** End on what the visitor came to do, in the form the job takes (the next times to book, the buy box, the store buttons, the next date and the address, the latest issue), or simply on the last strong section and the footer. An email field closes a page only when the job is one where a mailing list is native (subscribe, join, attend, listen, visit) and the anatomy calls for it, or the user asked for one (85); a page whose action already sits in the hero or a sticky bar need not repeat it at the foot.
- **The footer closes the page:** 200 to 400px: the wordmark or one closing line, the page's real links, the legal line. A single line under a hairline is a colophon, right for a letter, a document or a manifesto.
- **The nav is one line, 56 to 80px tall**, sized to the page's real destinations. Vary it against the log: edge-aligned (wordmark and one or two links or an action at opposite edges), a floating pill, a masthead (a large centred wordmark over a rule), a slab (a heavy full-width bar), a search-led bar with a visible command pill, a banner over a bar that retracts on scroll, a three-part bar only for four or more real destinations (42). A side rail only where a sticky object earns it.
- **Footers:** a mast (the wordmark large over the links), a statement (one closing sentence large, the links beneath), a colophon block (credits and address as one paragraph), newsletter-first (the form leads; only for a subscribe page), a letter close (a sign-off and a date), index columns only for a hub with a real sitemap.

## 8. Before shipping

Scroll the page at 1440 x 900 one screen at a time: is something on each screen big enough to be its reason? A screen holding only a heading and a line wants a bigger visual, the line set as a statement, or two sections merged. Then squint: with the words blurred, each section still has a shape and the page a rhythm of heavy and light. The render tier measures width (77), head scale (78), the hero's foot (79) and the photo share (83); the eye judges the rest.
