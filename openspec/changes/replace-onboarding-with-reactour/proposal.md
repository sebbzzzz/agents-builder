## Why

The onboarding tour is built on driver.js, which renders its own popover DOM that we then style and rewrite imperatively. This forces two ongoing costs: `onboarding.css` reimplements driver.js's structural CSS just to override it, and `OnboardingOrchestrator.onPopoverRender` performs ~60 lines of imperative DOM surgery (clearing `innerHTML`, `createElement`, moving the close button, inserting the eyebrow/heading/tick-bar) on every step render. We want the popover card authored as React JSX, with the spotlight/positioning handled by a library mature enough to be robust across all devices.

## What Changes

- Replace `driver.js` with `@reactour/tour` as the onboarding tour engine.
- Render the tour card (header chrome, eyebrow + heading, description, tick-bar footer, shimmer Next button, ghost Back button) as a React component instead of building it imperatively in `onPopoverRender`.
- Delete the structural half of `onboarding.css` (the driver.css reimplementation — overlay, arrow geometry, pointer-events, fade keyframes); keep the `.gw-popover` visual theme, retargeted onto our own JSX elements.
- Move per-step app-state choreography (`setActiveCategory`, `injectOption`, `clearActiveCategory`, sidebar overflow toggling) from driver.js `onNextClick` handlers into reactour step `action`/`actionAfter` hooks (or a custom navigation handler).
- Preserve all existing tour behavior: 5 steps, first-visit trigger, `localStorage` completion flag, app-disabled overlay, auto-driven Project Context demo, responsive card sizing, and the visual card anatomy.
- Remove the `driver.js` dependency; add `@reactour/tour`. **BREAKING** (dependency): requires sign-off per AGENTS.md's "ask before adding libraries" rule — lightweight is no longer a hard constraint, all-device robustness is.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `onboarding-tour`: Requirements that hard-code driver.js as the mechanism are re-specified to be engine-neutral / reactour-based. Specifically: the 5-step requirement no longer says "via driver.js spotlight modals"; the three-zone chrome requirement drops the `onPopoverRender` DOM-injection clause in favor of "the tour card is rendered as a React component"; the auto-drive requirement drops "before driver.js targets it". Observable behavior (steps, chrome layout, tick bars, shimmer, responsive sizing, auto-demo, completion flag) is unchanged.

## Impact

- **Dependencies**: remove `driver.js`; add `@reactour/tour` (pulls `@reactour/mask`, `@reactour/popover`, `@reactour/utils`).
- **Code**: `app/_components/onboarding/OnboardingOrchestrator.tsx` (rewritten around reactour), new tour-card React component, `app/_components/onboarding/onboarding.css` (structural rules deleted, theme retained/retargeted).
- **Unaffected**: `useOnboardingStore`, `EditorContext` (`injectOption`/`replaceContent`), `useAppStore`, `useDocumentStore`, the `data-onboarding="*"` target attributes, and `WELCOME_CONTENT`/`PROJECT_CONTEXT_PROMPT` constants.
- **Risk to verify**: reactour's mask interaction with the CodeMirror editor and the sidebar `overflow`/scroll dance used between steps 2→3 and 3→4.
