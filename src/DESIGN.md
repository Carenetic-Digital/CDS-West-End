# West End Dental Centre — Design System

Crestwood’s section and component system, rethemed for West End Dental Centre. Live brand teal is `#54add3`; UI tokens use AA-safe `#1d6f8c`. Tokens live in `src/styles/global.css`.

## Brand Voice (visual)

- **Warm, dignified, professional.** Not corporate-clinical, not folksy.
- **Family-dentistry warmth** comes from Barlow Condensed display type, teal brand colour, and softened curves on cards/CTAs.
- **Modern** comes from generous whitespace, a restrained teal-and-neutral palette, and a single accent used for eyebrows and links.

## Color tokens

All defined as CSS variables in `:root` via Tailwind v4 `@theme`.

| Token | Hex | Use |
|---|---|---|
| `--color-brand-primary` | `#1d6f8c` | Header/footer bg, primary text, dark bands (AA on `#f0f0f1`) |
| `--color-brand-primary-deep` | `#15566d` | Hover state on dark fills |
| `--color-brand-heading` | `#0d3d4d` | Body headings (h1–h6) |
| `--color-brand-accent` | `#1d6f8c` | Links, eyebrows, focus |
| `--color-brand-accent-hover` | `#15566d` | Hover/pressed states |
| `--color-brand-accent-btn` | `#1d6f8c` | Primary buttons |
| `--color-brand-accent-soft` | `#54add3` | Live teal accent, decorative only |
| `--color-brand-secondary` | `#b7d9e8` | Soft teal tints |
| `--color-surface` | `#ffffff` | Default canvas |
| `--color-surface-alt` | `#f0f0f1` | Soft grey — alternating section bg |
| `--color-surface-cool` | `#f4f4f5` | Cool grey alternate |
| `--color-surface-dark` | `#1d6f8c` | Dark teal band sections |
| `--color-text` | `#1f1f1f` | Body copy on white |
| `--color-text-muted` | `#4d4d4d` | Secondary text — meets AA on white |
| `--color-text-on-dark` | `#ffffff` | White on teal |
| `--color-text-on-dark-muted` | `#ffffff` | Secondary text on teal (solid for AA) |

**Multi-clinic theming:** override `--color-brand-*` and `--color-surface-alt` at `:root` on a sister-clinic build to retheme the entire system.

## Typography

| Family | Use | Weights |
|---|---|---|
| **Barlow Condensed** (display) | h1–h3, hero numbers, large display text | 500, 600, 700 |
| **Roboto** (body) | Body copy, UI, nav, captions, labels | 400, 500, 600 |

Loaded together via Google Fonts in `BaseLayout.astro` with `display=swap`.

### Scale (fluid)

| Token | Mobile | Desktop |
|---|---|---|
| `--text-6xl` | 44px | 68px |
| `--text-5xl` | 36px | 52px |
| `--text-4xl` | 30px | 40px |
| `--text-3xl` | 26px | 32px |
| `--text-2xl` | 22px | 26px |
| `--text-xl` | 20px | 20px |
| `--text-lg` | 18px | 18px |
| `--text-base` | 16px | 16px |

All sizes use `clamp()` to scale fluidly between mobile and desktop.

### Hierarchy

- **h1** — Barlow Condensed 600, `--text-6xl`. One per page.
- **h2** — Barlow Condensed 600, `--text-5xl`. Section headings.
- **h3** — Barlow Condensed 600, `--text-xl` / `--text-2xl`. Card and subsection headings.
- **eyebrow** — Roboto 600, 13px, teal, uppercase, +0.12em tracking. Marks every major section above the h2.
- **body** — Roboto 400, 17–18px, line-height ~1.65.

## Spacing

- `--spacing-section` — `clamp(3.5rem, 2.5rem + 3vw, 6rem)`. Used as vertical padding on `.section-y` blocks. Scales 56px mobile → 96px desktop.
- Container widths: `--container-narrow` 56rem · `--container-base` 72rem · `--container-wide` 80rem.

## Radius + Shadow

| Token | Value | Where |
|---|---|---|
| `--radius-md` | 0.5rem | Buttons |
| `--radius-lg` | 0.75rem | Cards |
| `--radius-xl` | 1rem | Hero panel, medallions |
| `--shadow-sm` | soft 1px | Buttons at rest |
| `--shadow-md` | soft 14px | Cards on hover |
| `--shadow-lg` | tall 32px | Hero panel, raised cards |

Shadows use navy with low alpha — never default black — so they read warm against the cream surface.

## Component patterns

### Buttons (`.btn`)
- `.btn-primary` — solid gold, white text. Primary action.
- `.btn-secondary` — solid navy, white text. Inverse primary.
- `.btn-outline` — transparent w/ navy border. Secondary action.
- `.btn-ghost` — no chrome, navy text. Tertiary / inline.
- `.btn-lg` — larger padding for hero CTAs.

All buttons have 180ms transitions and visible `:focus-visible` ring (gold).

### Cards (`.card`)
- White bg, soft border, generous padding (1.75rem).
- Hover: `--shadow-lg` + `--color-brand-secondary` border. Lifts subtly without translate.

### Eyebrow (`.eyebrow`)
- Pre-heading label. Always gold, uppercase, +0.12em tracking, 13px.

### Heading rule (`.heading-rule`)
- Adds a 3rem-wide gold underline below an h2. Use `.heading-rule.center` to center the underline.

## Layout patterns

- **Section rhythm:** alternate `--color-surface` (white) and `--color-surface-alt` (cream). Use `--color-brand-primary` for the final pre-footer CTA band.
- **Eyebrow → h2 → supporting paragraph → grid/list → CTA.** Every section follows this rhythm.
- **Decorative gradients:** soft blurred radial circles (gold or navy at low alpha) bleed off the edges of hero/CTA sections.

## Accessibility commitments

- WCAG 2.1 AA target throughout.
- Skip-to-content link visible on focus.
- `:focus-visible` ring on every interactive element (2px gold, 2px offset).
- Color contrast: body text is `#1f2937` on white; muted text is `#5b6573` on white (~5.6:1).
- Reduced-motion media query honored — all scroll/hover animations collapse to 0.01ms.
- Persistent mobile bottom bar with Call + Book is keyboard-reachable and labeled.
- Mega-menu opens on hover, click, and `Escape` closes it.

## CDSS compliance enforced visually

- No testimonials, "as seen on" badges, star ratings, or social-proof carousels anywhere in the system.
- The credentials three-box (CDSS, CDA, SDA) is the only "trust" component; placed in the footer surround.
- "Commitment to Clean" shield is in the footer band.
- No promotional offer language anywhere in copy — verified at content time.

## Mobile patterns

- Header collapses to logo + Book CTA + hamburger at <1024px.
- Mega-menu becomes a `<details>` accordion in the mobile drawer.
- Persistent bottom bar (Call + Book) appears at <768px, with a matching 64px body bottom-padding spacer.

## Tech notes

- **Tailwind v4** — `@theme` block in `global.css`, no `tailwind.config.js`.
- **CSS variables** referenced via Tailwind arbitrary values: `bg-[var(--color-brand-primary)]`, `text-[var(--color-text)]`.
- **Astro** — components in `src/components/`, layouts in `src/layouts/`.
- **No client JS framework** — small `<script>` blocks in component files handle menu interaction. Mega-menu uses native focus/keyboard handling.
