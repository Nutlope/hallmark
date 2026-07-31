## Tier D · Three.js / WebGL / shaders

**When justified.** The 3D *is* the hero value — a rotating product the user can interact with, an interactive 3D playground, a generative art piece. Examples: Apple's product pages with interactive bottles / iPhones, Bruno Simon's portfolio, Vercel's WebGL hero galleries.

**When not.** A static spinning thing the user can't interact with. A bloom-overdosed shader background that "looks premium". A 5-MB model loaded eagerly on a marketing page.

**Performance budget.**
- < 100 draw calls
- < 2 MB JS + assets total
- < 6 s load time
- 60 fps target on mid-range mobile

**Stack.**
- React Three Fiber (R3F) for React projects — ergonomic, ~30 KB on top of Three.js
- Vanilla [Three.js](https://threejs.org) otherwise (~100–300 KB depending on features)
- Models: glTF 2.0 with Draco compression (20–50 % size reduction)
- Textures: KTX2 / Basis (much smaller than PNG/JPEG)

**Always include a non-WebGL fallback.** If the canvas fails to initialise (no WebGL2, GPU blacklisted, low-power mode), show a static poster image so the page still renders.

### Anti-patterns of Three.js / WebGL

- **Three.js for a stationary product.** No interaction = no justification. Use SVG or a still photograph.
- **Bloom + glow overdose.** Three or four post-processing passes that just make everything blurry. Pick one effect, dial it down to "barely visible".
- **5-MB models loaded eagerly.** Always lazy-load the geometry, show a poster while it streams in.
- **No fallback.** WebGL fails on ~5 % of devices; if the page is unusable for them, you've failed accessibility.
- **Generic procedural-noise shaders.** Looks like every other Three.js demo on the internet. Custom shaders earn their place; off-the-shelf Perlin noise rarely does.
