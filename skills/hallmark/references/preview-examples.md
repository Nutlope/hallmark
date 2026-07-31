# Preview-block worked examples

Four sample Step 5 preview blocks for the model to imitate, varied across macrostructure types. Load this file only when picking an unusual macrostructure or custom theme and the bullet-list spec in `SKILL.md § 5. Preview` doesn't give enough scaffolding on its own. Most builds don't need to read this file.

---

*Long Document (editorial, motion-cut):*
> **Hallmark · v1.2.0**
>
> - **Macrostructure** · Long Document
> - **Theme** · Newsprint (cool slate paper · steel-blue accent · geometric sans)
> - **Enrichment** · Tier-B hand-built SVG (a 60-line coffee bean with `@property --rise` 6 s breathing-loop)
> - **Sections** · Masthead · Letter · Three Notes · Visit · Colophon
> - **Motion** · breathing-loop on bean only (respects `prefers-reduced-motion`)
> - **Slop test** · 58 / 58 ✓ (run after Build)
> - **Diversification** · first run for this project

*Bento Grid (SaaS, motion-on):*
> **Hallmark · v1.2.0**
>
> - **Macrostructure** · Bento Grid
> - **Theme** · Newsprint (cool slate paper · steel-blue accent · geometric sans)
> - **Enrichment** · E1 Clipped-Edge Demo Video, Tier-A CSS-art trace waterfall
> - **Sections** · Hero · 6-tile Bento (stat · sparkline · quote · code · integrations · spotlight) · Index Footer
> - **Motion** · counter · pricing-lift · CSS marquee on integrations strip
> - **Slop test** · 58 / 58 ✓ (run after Build)
> - **Diversification** · differs from Coral on paper hue (light-cool vs pure-white) + accent (indigo vs ink-blue)

*Manifesto (declarative, no enrichment):*
> **Hallmark · v1.2.0**
>
> - **Macrostructure** · Manifesto
> - **Theme** · Manifesto (dark · Inter Tight 900 · single red bleed)
> - **Enrichment** · none (typography only - voice carries the brand)
> - **Sections** · Masthead · Title · Five Declarations · Bleed Band · What We Refuse · Working Rules · Practice · Reading · Colophon
> - **Motion** · none - typography only
> - **Slop test** · 58 / 58 ✓ (run after Build)
> - **Diversification** · differs from Newsprint on paper band (dark vs light) + display style (display-heavy vs geometric-sans)

*Custom (Coffeebox archival café):*
> **Hallmark · v1.2.0**
>
> - **Macrostructure** · Long Document
> - **Direction** · the postal frank (draw 6/7, wildcard no)
> - **Posture** · Full palette (kraft field · frank red · ink · airmail-blue seal)
> - **Theme** · custom (vibe: "archival warmth, hand-set, no varnish" · paper oklch(95% 0.015 80) · accent oklch(55% 0.17 30) frank-red · Bricolage Grotesque display + Source Serif 4 body, both roman)
> - **Enrichment** · pure-CSS frank mark (craft tier-a)
> - **Sections** · Masthead · Letter · Three Notes · Visit · Colophon
> - **Motion** · breathing-loop on bean (with reduced-motion fallback)
> - **Slop test** · 58 / 58 ✓ (run after Build)
> - **Diversification** · custom axes: light / geometric-sans / warm - differs from previous catalog Newsprint on display style
