## Context

The onboarding tour is driven by **driver.js v1.4** which generates its own popover DOM. The current theme is a thin CSS-only override targeting driver's internal class names with `!important`. The popover is 300px wide with a plain title and description — it doesn't match the three-zone card anatomy in the style reference.

The style reference defines a richer layout: a header chrome row (brand mark + breadcrumb + step count pill + close button), a body section (eyebrow + large title + description), and a footer (progress tick bars + Back + shimmer Next). Driver.js does not generate most of these elements, so CSS alone cannot achieve the design.

**Current state:** `styles/globals.css` lines 165-269 — minimal `.gw-popover` overrides. `OnboardingOrchestrator.tsx` — driver config with no render hook.

**Constraint:** Only Inter and JetBrains Mono are loaded (Newsreader from the style reference is absent). Only existing design tokens may be used.

## Goals / Non-Goals

**Goals:**
- Match the style reference card anatomy: header chrome, eyebrow, h2 title, tick-bar progress, shimmer Next button
- Use `onPopoverRender` to inject the supplementary DOM elements driver.js doesn't generate
- Make the card responsive (`max-width: calc(100vw - 32px)`) so it fits on 375px mobile viewports
- Welcome step gets a wider 460px variant via a per-step class

**Non-Goals:**
- Spotlight corner reticle ticks — driver.js renders a canvas overlay, not targetable via CSS
- Newsreader serif font — not loaded; Inter weight 600 substitutes
- Replacing driver.js with a custom tour library

## Decisions

### Decision 1: `onPopoverRender` DOM injection over full popover replacement

Driver.js v1 exposes `onPopoverRender(popover, { state })` which fires after each popover render. The alternative (replacing driver's entire popover template) is not supported in v1 — only v3+ has `popoverRender`. Using `onPopoverRender` for surgical DOM injection keeps the engine intact and limits the change surface.

The injected elements per step:
- `gw-mark` span (brand mark square) — prepended into the header element
- `gw-crumb` span (breadcrumb) — inserted after mark, before the count pill
- `gw-count` span (step count pill) — the header's existing text content is cleared and this replaces it; the original title text is captured first and moved to a new `h2.gw-title` in the body
- `gw-eyebrow` span — inserted before the description in the body
- `h2.gw-title` — inserted before the description (after eyebrow)
- `gw-ticks` span with `gw-tick` children — replaces `driver-popover-progress-text` content

### Decision 2: Close button moved into header flex row

Driver.js positions the close button via `position: absolute` on the wrapper. To include it as the last item in the header flex row (matching the design), `onPopoverRender` moves it into the header element via `popover.title.appendChild(popover.closeButton)`. The CSS then overrides `position: absolute → static !important` on `.driver-popover-close-btn`.

This is cleaner than trying to fake the layout with `z-index` and manual positioning.

### Decision 3: Repurpose `.driver-popover-title` as the header flex container

Driver.js's `popover.title` is a `<header>` element. Rather than adding a new wrapper, we clear its default text content and populate it with the new flex children (mark + crumb + count + close). The CSS targets `.driver-popover-title` and overrides it to `display: flex`. This avoids adding a new DOM layer.

### Decision 4: Per-step `STEP_META` array for eyebrow/crumb/count content

Each step needs distinct eyebrow text, breadcrumb path, and step count string. Storing these in a static array at the module level keeps the render hook stateless and the step content co-located with the component. This is preferable to embedding the metadata in the driver step config (which driver.js would ignore).

### Decision 5: Shimmer gradient using existing accent colors

The style reference uses an amber gradient (`oklch(0.78 0.14 50) → oklch(0.62 0.17 44)`). The project's accent is orange (`#ff781d`, `#ffb067`). To respect the "no new colors" constraint, the shimmer gradient uses: `linear-gradient(90deg, #ffb067, #ff781d, #ffb067)` — the existing `--accent` and its lighter variant already in `--accent-grad`. The visual effect (shifting warm gradient) is preserved while staying on-system.

## Risks / Trade-offs

**[Risk] Driver.js internal DOM structure changes in a patch update** → Mitigation: pin driver.js to `1.4.x` in package.json. The `onPopoverRender` API and `popover.title`/`popover.closeButton`/`popover.description`/`popover.progress` property names are stable in v1.x.

**[Risk] Close button relocation breaks driver's internal click handler** → Mitigation: driver.js uses event delegation on the wrapper element (`.closest(".driver-popover-close-btn")`), not a direct handler on the button. Moving the button into the header does not break the handler.

**[Risk] `popover.title.style.display` set to `none` by driver if title text is empty** → Mitigation: every step in the config has a `title` string, so driver sets `display: block`. Additionally, `onPopoverRender` forces `popover.title.style.display = "flex"` after injection to guarantee the header is visible.

**[Risk] `!important` collision with Tailwind utilities applied elsewhere** → Mitigation: `.gw-popover` classes are scoped to the driver popover overlay which is appended to `<body>` outside the Next.js app tree, so no Tailwind utility classes apply to it.

**Trade-off: No serif font** → Inter weight 600 at 20px reads clearly and fits the card at 360px width. The visual hierarchy (eyebrow → title → description) is preserved through size and weight contrast even without a distinct serif typeface.

## Migration Plan

1. Replace `.gw-popover` block in `globals.css` — purely additive/replacement, no migration needed
2. Add keyframe `tour-btn-shimmer` to `globals.css`
3. Add `STEP_META` and `onPopoverRender` to `OnboardingOrchestrator.tsx`
4. Test in incognito to force the tour to start; verify all 5 steps visually

**Rollback:** Revert the two files to their previous state. No localStorage, database, or API changes are involved.
