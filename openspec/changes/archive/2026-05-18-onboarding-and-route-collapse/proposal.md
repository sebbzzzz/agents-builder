## Why

The app is too small to justify a separate splash page — it adds friction before users reach the actual tool. New users also arrive with no guidance on how the category/panel/editor flow works, resulting in confusion and drop-off.

## What Changes

- **Route collapse**: `/` renders the builder directly. The splash page (`Hero`, `GhostCode`) is disabled but components are kept. `/agents-builder` redirects to `/`.
- **Welcome typewriter**: The editor's initial `WELCOME_CONTENT` types in with a character-by-character animation — title first (~2.4s), then the rest snaps in. Runs once per page load, no loop.
- **Onboarding tour**: A 5-step guided tour using `driver.js` that teaches users the core flow on first visit. Triggered by a `localStorage` flag. Auto-drives the demo (opens Project Context category, injects a selection, shows result in editor). App is disabled (pointer-events overlay) during the tour.

## Capabilities

### New Capabilities
- `onboarding-tour`: First-visit 5-step guided tour with spotlight overlay, localStorage persistence, and auto-drive demo injection
- `welcome-typewriter`: Animated character-by-character reveal of the editor's welcome message on page load

### Modified Capabilities
- `route-structure`: Root route `/` now renders the builder; splash is retired from routing (components preserved)

## Impact

- **New dependency**: `driver.js` ^1.4.0
- **New files**: `store/useOnboardingStore.ts`, `app/_hooks/useWelcomeTypewriter.ts`, `app/_components/onboarding/OnboardingOrchestrator.tsx`
- **Modified**: `common/providers/EditorContext.tsx` (add `replaceContent`, `getIsWelcome`), `store/useDocumentStore.ts` (initial content `""`), `app/page.tsx` (builder content), `app/agents-builder/page.tsx` (redirect), `FloatingOptionsPanel.tsx` (guard against driver.js click-outside conflict), `PreviewHeader.tsx` (`data-onboarding` attr), `styles/globals.css` (driver.js theme overrides)
- **localStorage**: Adds key `onboarding_complete` — once set, tour never shows again
