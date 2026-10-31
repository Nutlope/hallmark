# Imagery

What a page shows, read on every page build. A page looks made when it shows the real thing (the place, the food, the object, the hands at work, the product running), and generated when it shows a gradient box, a drawing of a loaf, or a heading with nothing under it.

## 1. What fills a page

In order, the first that fits:

1. **The user's own images and recordings**, asked for at Step 1. They win every slot.
2. **Screenshots of the real product,** taken by the build itself whenever the product can be reached: a URL, a running dev server, a project in the folder that starts with one command, a desktop or phone app on this machine (§ 4). A real screen beats any picture of one.
3. **The product built,** only when there is no product to capture yet (§ 4).
4. **Photographs from the library**, picked by script and treated in the theme's way (§ 2, § 5).
5. **Generated stills**, only when `TOGETHER_API_KEY` is set and the user asked for them (§ 6).
6. **Type at full scale**, when the prompt is about words.

Which prompts want which:

- **A place, a material, food or drink, an object, a craft, the outdoors, an event, people at work** (a bakery, a ski school, a gin, a weaving studio, a venue, a tailor, a farm): photographs lead. The hero's photograph is the largest thing on the first screen (full-bleed behind the head, or beside it at 60 to 75% of the screen tall). After it, two to four more carry the page, one of them large, each on its subject (an off-subject picture is cut, never kept to fill a count), with sections of the material alone between them (a menu or price list as rows, the hours and the place as a table, a statement, a form), so pictures take a quarter to a third of the page (§ 5, 83).
- **Software** (SaaS, an app, a developer tool): the product leads, and the hero visual is its interface. One or two photographs may set the scene (where it is used, the material it handles, hands at the work it serves) when each passes the deletion test: take it away and the page loses a fact. A city at night, a laptop on a desk or an office building fails it.
- **Words** (docs, an API, a CLI, a type specimen, a manifesto or a letter about an idea): type and code carry it; one photograph as a full-bleed band at most. A manifesto or a letter about something physical (repair, a river, a street) shows it like any other page.

A photograph never stands in for a fact: numbers, names and claims stay in type, and a picture of a person never stands in for a customer, a teammate or a testimonial (F9).

## 2. The library

Hallmark carries 755 verified photographs from Wikimedia Commons, each CC0, public domain, CC BY or CC BY-SA, tagged by subject, tone and temperature. Ask for each subject the page needs, concretely:

```
node <skill-dir>/scripts/theme.mjs photos "apple orchard in autumn" "hands picking apples" --theme <slug> [--n 3] [--orient portrait|landscape|square] [--seed <draw seed>] [--log .hallmark/log.json]
```

It ranks the library for each subject, steers away from the photos the last five builds used, and prints for each pick what it shows, its size, a ready `<img>` with its `srcset`, and its credit. Keep only picks that fit the sentence the section makes; re-ask in other words (the place, the material, the action) before settling for a near miss.

- **Never write an image URL from memory or take one from a stock site** (Unsplash, Pexels and Pixabay bar AI-driven selection in their terms). Use only what the script printed or the user supplied (76).
- **Credit every library photo:** one line in the footer marked `data-credits` (the word budget skips it), *Photographs:* then each printed credit, in the footer's small style. CC BY and CC BY-SA require it (76).
- **Size and crop in CSS:** keep the printed `srcset`, set `sizes` to the layout (`50vw` for a half, `100vw` full-bleed), and crop with the frame: `aspect-ratio` on the slot, `object-fit: cover`, the printed `object-position` (or your own) to keep the subject in frame.
- **For production,** `--save <dir>` downloads the picks into the project and prints local paths; drafts may link the Commons thumbnails.
- **The hero photograph is the LCP:** `fetchpriority="high"`, never `loading="lazy"`; every other image is lazy. A full-bleed or hero frame takes a photo 2400px or more on its long side; a smaller one goes soft at 1920.
- **A stand-in stays swappable:** in its slot (§ 3), with `data-alt` naming what the user's own picture should show, listed in the handoff.
- **No Node:** say so in the Picks block and use slots with the user's material only; never guess a file.

## 3. Slots

A slot is any picture the user will replace: `data-slot="<name>"` (`hero`, `demo-2`, `photo-1`), a `data-alt` saying what belongs there, and a real size (an `aspect-ratio` or a fixed height). The scaffold's `base.css` holds the slot CSS, and the scaffold prints the `hallmarkSlots` script: paste it once before `</body>` (F18). It swaps in the user's files without touching the layout (`hallmarkSlots({ hero: 'shop.jpg' })`) and drops a stand-in that fails to load.

- **A slot always shows something:** the user's image, a library photograph, or the product built at full fidelity. Its wash (`--color-paper-2` to `--color-paper-3`) is only the colour behind a photo while it loads; a slot showing nothing but its wash is an empty picture (81).
- **No visible placeholder labels:** no "your screenshot here", ratio notes or "sample" chips; `data-alt` and the handoff carry that.
- A child that must stay once the user's image lands (a credit, a plate number) carries `data-keep`; text over a slotted photograph (a Poster hero's head and scrim) sits in a sibling layer above the slot (`z-index: 2` or more; the slot's image takes 1), never inside it.
- Never more than four slots in a row, and never a set of frames for things the page has no pictures of (a team, a list of venues): set those in type (68).

## 4. The product: captured first, built only when it cannot be

**Capture it.** When the product exists, the page shows it, not a mock of it. Find it at Step 0: a URL in the prompt, a dev server already running, a `package.json` with a `dev` or `start` script, a built app on the machine, or a path the user names. Start it if it needs starting (install, run, wait for the port), put it in the state that tells the page's story (sample data, a real project open, the one screen that does the job), then:

```
node <skill-dir>/scripts/capture.mjs http://localhost:3000 --routes /,/settings --sizes desktop,phone [--selector ".editor"] [--full] [--out images/screens]
```

It writes 2x PNGs at 1440 x 900 and 390 x 844 (or one element with `--selector`) and prints an `<img>` for each. A desktop app built on Electron, WebView2 or CEF is started with a DevTools port and captured through it (`capture.mjs --cdp 9222 --target "<window title>" [--selector ...]`, clean and at its own pixel density); any other desktop app with the OS (`screencapture -l <window id>` or `-R x,y,w,h` on macOS), a phone app with its simulator (`xcrun simctl io booted screenshot`), a terminal tool by running it and setting its real output in a code block. Look at every capture before it ships: nothing personal on screen (names, emails, tokens, file paths), no error states unless they are the point, no debug overlays. Use several: the main screen in the hero, a detail cropped large lower down, a second screen, the phone view. Stamp `imagery: screenshots <n> (capture.mjs)` and credit nothing; they are the user's own.

**Frame it in the theme.** A capture sits in a `data-slot` with the theme's radius and the inset outline (§ 5), never inside a drawn browser bar, device frame, traffic lights or notch (47a, 47b). Crop to the part that sells (`object-position`, or `--selector`), keep text in it legible at its displayed size (scale 2, never upscaled), and never retouch what the product shows. Captures are product pictures: mark their slots `data-kind="product"`, so they do not count toward the photo balance (83).

**Build it only when it cannot be captured** (an idea, a product not built yet, nothing reachable): the hero visual is the product's main screen built in HTML and CSS: real controls, at least eight elements, the prompt's nouns, the theme's surfaces and type, at the size `layout.md` § 6 gives the visual. Sample values read as samples (`example.com`, *Example Kitchen*, round plausible amounts), never a figure a visitor could take as a claim (46a). It sits in a `data-slot` so the real screenshot replaces it, and the handoff says which screens to capture once the product runs. Never build a mock of a product the build could have captured (84).

A working control (a calculator on the user's prices, a booking form) is a fine section and a fine close, once a page; it is not the default hero.

## 5. Placing and treating photographs

- **Big or not at all.** A photograph spans six of twelve columns and stands 440px tall or more, or runs full-bleed; at thumbnail size it reads as clip art (a set of four or more may run smaller, each with its fact). In the hero it stands 60 to 75% of the screen tall beside the text, or fills the screen behind the head (the Poster posture). Delete the picture in your head: if the screen still says the same thing, the picture is too weak or too small.
- **One subject a frame, cropped tight,** its weight leaning toward the text. Vary the ratio (4:5 beside text, 16:9 or 21:9 across, 1:1 in a pair) and the size (8 and 4 columns; three equal frames only for a true set: three dishes, three rooms).
- **Balance.** Below the hero, photographs take at most a third of the page at 1440 (pictures inside the built product, marked `data-kind="product"`, do not count), up to 45% on a Photographic or Portfolio Grid shape; past that the page reads as a stock gallery and the theme never speaks (83). Never two photograph-led sections in a row: follow a picture with a section the theme's type, rules, colour or the product carry alone (the theme file's Range). A software page alternates the product with type-led sections and takes one or two photographs; a word-led page takes one at most. When in doubt, cut the weakest picture and set its fact large.
- **Text over a photograph** sits on its calmest part over a scrim from the theme's ink (a gradient from the text's edge, 35 to 65%), behind the text's side only, at 4.5:1 or better against the image under it; never centred white type over a busy frame. A theme that refuses gradients uses a solid ink plate.
- **Facts on the pictures:** captions are facts from the prompt in the label style, beside or under the picture (the dish and its price, the room and its hours, the date, the place). Never a credit line there, and never a caption that claims a stand-in as the user's own person, place or product.
- **The theme's treatment, on every photo.** The theme's `photo:` header sets it and the scaffold writes it into `base.css` as CSS on every image in a slot, the user's own included: `natural`, `warm`, `muted`, `mono`, `duotone` in two of the theme's tokens, or `tint` in one, with adjustments (`con=`, `sat=`, `exp=`). A duotone or tint flattens a pale subject (snow, a white wall) into an empty field: choose frames with tonal range and look at each through the treatment. A duotone or tint takes the slot's `::before`, so draw a keyline or scrim with `::after` or a sibling. A photo inside a built product takes the treatment only if the page adds it.
- **The frame is the theme's:** its radius, an inset outline of ink at 6 to 10% (`outline: 1px solid ...; outline-offset: -1px`), its texture if it has one. Never a border and a wide shadow together (F24).

## 6. Generated stills

Only when `TOGETHER_API_KEY` is set and the user asked for generated images, or for a subject the library cannot reach: `comp.md` § Generated stills. Never auto-fire it.

## 7. Never

- **A drawn illustration** (80): an SVG or CSS figure of an object, plant, animal, person, product, building, landscape or scene past icon size. SVG is for icons from one set, the user's logo, charts and diagrams of real data or a real system with their labels, and plain geometry (a rule, a grid, a dot pattern as texture).
- **An empty picture** (81): a slot showing only its wash, or a gradient field where a picture should be.
- **A counting device** (82): a row or grid of identical marks standing for a quantity, one for each bottle or day. Set the number.
- **Illustration packs and characters:** unDraw, Humaaans, Storyset, Lottie mascots, 3D blobs, isometric scenes.
- Stock faces as proof (F9); a logo wall without the user's logos (46a); mesh blobs, orbs or aurora behind text (29); an image that zooms or rotates on hover (11); text baked into a picture; a photo of a screen showing someone else's interface.

## 8. Icons, logos, video, 3D

- **Icons:** one library a page (Lucide by default; Phosphor or Heroicons in a project that uses them), one stroke width and one style, at 16, 20, 24 or 32px on the set's grid (a 24 viewBox at 24px, never scaled to 19), `currentColor`, aligned to the first line of multi-line text, never in a coloured tile (3, F5), never an emoji (30a). A button with an icon pads the icon side by the vertical padding.
- **Logos:** the user's own, monochrome, one treatment a row, 32 to 48px tall (20 to 28px in a footer); Simple Icons (`https://cdn.simpleicons.org/<slug>/<hex>`) only for a platform or brand the page names. Never an invented wall (46a).
- **Video:** the user's recording or footage: `autoplay muted loop playsinline` with a `poster` (28a, 28b), AV1 or VP9 WebM then H.264 MP4, under 2 MB for ten seconds, a visible pause control on any loop past five seconds, captions when it speaks.
- **3D and WebGL** only when the product is 3D and the visitor handles it, with a still fallback.
- **Motion libraries:** CSS and `@property` first; Motion for orchestrated entrances in React; GSAP only when a timeline is the product.

## 9. Stamp, log and handoff

Stamp `imagery: photographs, library 5, mono · product sample in hero and demo-2` (or `imagery: none`); the log's `imagery` field carries the same words and `photos` the ids used, so the next build's picks rotate. The handoff lists every stand-in and built sample with its slot, its size and what the user's own picture should show.
