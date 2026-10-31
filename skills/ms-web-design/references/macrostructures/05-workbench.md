## 05 · Workbench

Real product captures are the primary content. The page is a guided tour of the app in use, with short captions in place of marketing copy.

- **Heading:** plain and functional at the section size; the captures do the talking.
- **Body:** a sequence of capture blocks, each a `<figure>` with a `<figcaption>` that states a fact and one inline annotation.
- **Divider:** the figure is the divider; sections separate by gap and figure.
- **Button:** the hero's one action (44b), then, where the theme allows a sticky element, a bottom bar carrying it after the third capture, labelled with the verb ("Start a project").
- **Image:** the real capture, unframed, in a `<figure>`; until the user supplies it, the product built in a `data-slot` (`imagery.md` § 4). No browser or device chrome (47a, 47b).
- **Reveal:** one type-unmask, on the first caption; the captures load instantly and the rest is simply there.

Reach for it for SaaS, developer tools, editor extensions, anywhere seeing the product in use is the sale.

Avoid when the product is conceptual or services-led. Workbench needs a UI to show.

Compositions: Showcase and Split for the captures, a Band for the close (`layout.md` § 5); the optional bar is a sticky bottom bar with one action at `--z-sticky`.

**Sample opening lines** (imitate the specificity; the page walks the visitor through):
> *"$ streampipe parse access.log --filter status=5xx | jq"* Opens on a real command, not a claim.
> *"Read anything that emits lines: files, pipes, sockets, kubectl logs."* Names the inputs, refuses abstraction.
> *"Open the trace, find the span, fix the regression."* Three concrete verbs.
