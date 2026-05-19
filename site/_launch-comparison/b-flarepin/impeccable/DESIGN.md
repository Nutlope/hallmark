# Flarepin — Design

## Theme

Dark. Scene sentence: an on-call backend engineer at 11pm, alone in a home office lit only by a glowing keyboard, scrolling a stack trace and deciding whether to wake the team. The page sits in the same visual register as the terminal it lives next to.

## Color strategy

Committed. One saturated ember/amber carries the brand — the color of a pager LED at 3am, not the color of a Stripe button. Tinted neutrals lean amber, not blue. Reject the observability-default of blue-on-near-black; reject neon-on-black crypto lane.

### Tokens (OKLCH)

| Role | Value | Notes |
|---|---|---|
| `--bg` | `oklch(14% 0.008 50)` | base surface; warm-tinted near-black |
| `--bg-1` | `oklch(17% 0.010 50)` | one elevation up |
| `--bg-2` | `oklch(21% 0.012 50)` | two up; for code blocks |
| `--ink` | `oklch(94% 0.010 70)` | primary text; warm off-white |
| `--ink-mute` | `oklch(70% 0.014 60)` | secondary text |
| `--ink-dim` | `oklch(52% 0.012 55)` | tertiary / labels |
| `--rule` | `oklch(28% 0.010 55)` | hairlines |
| `--ember` | `oklch(72% 0.18 50)` | the brand color; pager LED amber |
| `--ember-deep` | `oklch(58% 0.20 45)` | hover / pressed |
| `--ember-glow` | `oklch(78% 0.16 55)` | focus rings |
| `--good` | `oklch(72% 0.15 145)` | success / pass states |
| `--bad` | `oklch(64% 0.20 25)` | error frames |

### Strategy in practice

- Ember carries the headline word ("ship"), the primary CTA, the live latency reading, the highlighted stack frame, the focus ring. ~10% of pixels, but ~80% of attention.
- Body and chrome live in warm-tinted neutrals. No competing accent color.

## Typography

Single committed pairing.

- **`system-ui`** for prose and headings. The brand lives next to the user's OS; we use the user's OS type. No webfont round-trip, no FOUT on a slow tower.
- **`JetBrains Mono`** for code, stack frames, latency readings, the headline display word, table column headers. The brand voice IS terminal-adjacent; mono is not costume here, it is register.

Scale: clamp-based, ratio 1.333.

| Step | clamp |
|---|---|
| display | `clamp(3rem, 7vw, 6.5rem)` |
| h1 | `clamp(2rem, 4vw, 3.25rem)` |
| h2 | `clamp(1.5rem, 2.4vw, 2.25rem)` |
| body | `1rem` (16px) |
| small | `0.875rem` |
| micro | `0.75rem` (uppercase labels only) |

Light type on dark: body line-height 1.65 (added 0.05 over standard).

## Layout

Strict 12-column grid with a visible gutter rule on desktop. The grid IS the voice (tech-spec / terminal-native). Asymmetric placement within the grid — text rarely centered, never centered as default.

Spacing scale (4pt base): 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.

No cards in the hero, "why it matters", "supports", or pricing sections. Cards would soften the terminal feel. Pricing is a comparison **table** with the differentiating rows pulled forward.

## Imagery

Tech-brand imagery: live stack trace SVG in the hero, an SVG latency histogram, a `docker compose` config snippet, code samples for each supported language. Zero stock photos. Zero CSS-panel placeholders.

## Motion

One first-load reveal: the stack trace types itself once (then static), the latency reading counts up from 0 to 18ms once (then static). No scroll choreography. No hover-scale on tiles. Focus rings are instant.

`prefers-reduced-motion`: skip the type-on and the count-up; render final state.

## Bans observed

- No side-stripe borders on alerts.
- No gradient text on the headline (ember is a flat solid).
- No glassmorphism.
- No identical 3-card grid for "features".
- No hero-metric template (the 18ms is in context, with the histogram, not floating).
- No em dashes in copy.
