## Tier F · Library illustrations + Lottie (last resort)

When budget and timeline force a shortcut. The catalogue is in [`assets.md`](../assets.md) — Storyset, Humaaans, unDraw, IRA Design, LottieFiles. Even at this tier:

- **Customise.** Colour-swap to brand anchor hue. Crop or recompose. Don't ship the unmodified library look.
- **Avoid the giveaway poses.** Every team has seen "guy on laptop with floating speech bubble" a hundred times. Anything that screams "stock illustration" loses.

### Lottie specifically — last resort

**Use Lottie only when:**
- The motion is character-articulated (a five-frame mascot wave, a multi-joint walking cycle) and CSS / SVG can't reasonably express it
- You have a custom-commissioned Lottie that matches your brand
- File is < 2 MB
- Pause / resume support is wired
- `prefers-reduced-motion` fallback is a static keyframe

**Don't use Lottie for:**
- Spinning logo loops — use CSS `@keyframes rotate`
- Checkmark-draw confirmations — use SVG `stroke-dasharray`
- Loading spinners — use CSS conic-gradient + rotate
- Hover micro-interactions — use CSS transitions
- Hero centerpieces that could be hand-built — use Tier A or B

The Lottie Tell, version 2026: a generic LottieFiles pull where pure CSS would have built it stronger and lighter. The audit verb catches this.
