## Context

The onboarding tour (`app/_components/onboarding/OnboardingOrchestrator.tsx` + `onboarding.css`) runs on driver.js. driver.js renders its own popover DOM, so the component rebuilds that DOM imperatively in `onPopoverRender` (~60 lines: clear `innerHTML`, `createElement` ×6, relocate the close button, insert eyebrow/`h2`/tick bars), and `onboarding.css` reimplements driver.css's structural rules (overlay, arrow geometry, pointer-events, fade) just to override them (lines 1–52). The visual theme we actually care about is `.gw-popover` (lines 54–324).

The app already depends on `@base-ui/react` (Floating-UI-based positioning, used by Tooltip/Select/RadioGroup/FloatingOptionsPanel). During exploration we considered a zero-dependency custom tour on Base UI, but two constraints settled the choice: the user confirmed **lightweight is not a hard requirement** and **the tour must work on all devices**. All-device spotlight-rect sync (scroll/resize/orientation) is the expensive long tail of a custom mask — exactly what a mature library provides — and there is only one tour, so there is no second consumer to amortize a custom abstraction against. AGENTS.md requires sign-off before adding libraries; that sign-off is part of this change.

## Goals / Non-Goals

**Goals:**
- Replace driver.js with `@reactour/tour` as the spotlight/positioning engine.
- Author the tour card as a React component (JSX), eliminating `onPopoverRender` DOM surgery.
- Delete the structural CSS that only existed to override driver.css; keep the `.gw-popover` theme, retargeted onto our JSX.
- Preserve every observable behavior in the `onboarding-tour` spec (5 steps, first-visit trigger, completion flag, disabling overlay, auto-driven demo, responsive sizing, card anatomy, shimmer/ghost buttons).

**Non-Goals:**
- Changing tour copy, step count, ordering, or the visual design language.
- Touching the onboarding state (`useOnboardingStore`), `EditorContext`, app/document stores, or the `data-onboarding="*"` target attributes.
- Building a reusable multi-tour framework (only one tour exists).

## Decisions

### Decision: Use `@reactour/tour` over custom-on-Base-UI or onborda
`@reactour/tour` provides a mature `@reactour/mask` (handles spotlight cutout + scroll/resize sync across devices) and `@reactour/popover` positioning, while letting each step's content be arbitrary JSX via `ContentComponent`. 
- **vs custom-on-Base-UI**: custom wins only on bundle size, which is no longer a constraint; it would make us own the all-device mask sync, which is now required.
- **vs onborda**: onborda is the most "render your own card" option but is younger, less proven on mobile, and pulls `framer-motion` — a heavy add against an "intentionally minimal" stack for a single tour.

### Decision: Render the card via reactour's `ContentComponent`
Pass a single `ContentComponent` that receives the current step + props and renders the three-zone card (`<TourCard>`) as JSX: header (mark, breadcrumb, count pill, close), body (eyebrow, `h2`, description), footer (tick bars, Back, Next/Finish). `STEP_META` stays the data source for per-step header/eyebrow/count. This is the direct replacement for `onPopoverRender`.

### Decision: Drive app-state choreography from a controlled step index
Use `<TourProvider>` with controlled `currentStep`/`setCurrentStep` (via `useTour`). The Next/Back handlers inside `<TourCard>` run the same side effects currently in driver's `onNextClick` before advancing:
- 2→3: `setActiveCategory("project-context")` + set sidebar `overflow: visible`, then advance after the panel mounts.
- 3→4: `injectOption("Project Context", PROJECT_CONTEXT_PROMPT)` + `clearActiveCategory()` + restore sidebar overflow, then advance.
- Finish: `resetEditor()` + `complete()` + close.
- Close/ESC/skip: `clearActiveCategory()` + `resetEditor()` + `skip()` (guarded by `handledRef` as today).
Reactour step `action`/`actionAfter` hooks are an option, but routing through the card's nav buttons keeps the ordering (side effect → mount delay → advance) explicit and matches the existing `setTimeout` sequencing.

### Decision: Split `onboarding.css` — delete structural, keep theme
Remove lines 1–52 (driver.css reimplementation). Keep the `.gw-popover` theme rules; rename/retarget selectors that referenced driver classes (`.driver-popover-title`, `.driver-popover-description`, `.driver-popover-footer`, button classes) onto the `<TourCard>`'s own class names. Mask/overlay color and radius move to reactour's `styles`/props (e.g. `maskClassName`, `styles.maskWrapper`).

## Risks / Trade-offs

- **Mask vs CodeMirror editor (step 4) and sidebar overflow dance (steps 2→3, 3→4)** → Spike reactour against the real editor + floating panel before full migration; confirm the mask cutout tracks the panel after it mounts and that pointer-events on the editor behave. This is the one interaction driver.js currently handles via the manual `overflow` toggling.
- **Reactour still renders its own mask/popover wrapper** → We style those outer layers through reactour's `styles` prop API rather than owning the DOM; less pure than a custom build, but it is a styling API, not innerHTML surgery. Accepted trade.
- **Welcome step has no target element** → Reactour supports stepless/centered positioning; verify the centered welcome card (step 0, wider variant) renders without a highlighted element, matching current behavior.
- **Net bundle increase** (driver.js ~5kb → reactour + mask + popover + utils) → Accepted; lightweight is no longer a constraint.

## Migration Plan

1. Get sign-off to add `@reactour/tour` / remove `driver.js` (AGENTS.md dependency rule).
2. Spike: mount reactour over the live app, validate mask + positioning against sidebar, floating panel, and editor on desktop and a 375px viewport.
3. Build `<TourCard>` + rewrite `OnboardingOrchestrator` around `<TourProvider>`/`useTour`; port `STEP_META` and side-effect choreography.
4. Trim `onboarding.css` to the theme and retarget selectors.
5. Remove `driver.js`; verify against the `onboarding-tour` spec scenarios.
- **Rollback**: revert the change; driver.js implementation is self-contained to the onboarding folder + `package.json`.

## Open Questions

- None blocking. The editor/mask interaction is a spike-to-confirm, not an unknown that changes the approach.
