## Why

The onboarding tour popover is visually generic — 300px wide with plain title/description text — and doesn't reflect the design system's visual language defined in the Modal Style Reference. Applying the style guide produces a polished, on-brand experience with a three-zone card layout, progress tick bars, and a shimmer CTA.

## What Changes

- Replace the entire `.gw-popover` CSS block in `styles/globals.css` with a comprehensive tour card stylesheet that mirrors the style reference, using only existing design tokens and fonts (no new colors or typefaces)
- Add `@keyframes tour-btn-shimmer` for the animated gradient Next button
- Add `STEP_META` array to `OnboardingOrchestrator.tsx` with per-step eyebrow labels, breadcrumb paths, and step count strings
- Add `onPopoverRender` callback to driver.js config that injects brand mark, breadcrumb, eyebrow, h2 title, and progress tick bars into driver.js's generated DOM
- Add `showProgress: true` to driver config so the progress element renders
- Welcome step (index 0) gets a `gw-popover--welcome` class for the wider 460px centered variant

## Capabilities

### New Capabilities

None — this is a pure visual reskin of an existing feature.

### Modified Capabilities

- `onboarding-tour`: Visual requirements change — card dimensions, header chrome anatomy (brand mark + breadcrumb + count pill), body layout (eyebrow + h2 title + description), footer layout (tick bars + ghost Back + shimmer Next), and mobile constraints (max-width responsive).

## Impact

- `styles/globals.css` — lines 165-269 fully replaced; one new keyframe added
- `app/_components/onboarding/OnboardingOrchestrator.tsx` — STEP_META constant added, driver config extended with `showProgress` and `onPopoverRender`
- No new dependencies; no API, route, or store changes
- Fonts unchanged (Inter + JetBrains Mono only); Newsreader from style reference is not used
