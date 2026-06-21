## Why

The header currently ends in a plain "By: seb.bz" text link — it advertises the author but gives users no way to re-watch the onboarding or learn what the app does after first visit. Replacing it with two recognizable icon actions (Help, Contact) turns dead attribution text into a discoverable entry point for help and author contact.

## What Changes

- Replace the "By: seb.bz" text block on the right side of the header with two icon buttons: **Help** (question-mark icon) and **Contact** (mail icon), using `lucide-react` (already a dependency).
- **Help** opens an About modal: a short description of what groundwork does, plus two buttons at the bottom — "Start onboarding" (re-runs the tour from the beginning) and "Contact" (opens the author's portfolio).
- **Contact** (both the header icon and the modal button) opens `https://seb.bz/` in a new tab.
- Add a restart path to the onboarding store so the modal can re-trigger the tour even after the `onboarding_complete` flag is set. (The current `init()` no-ops on return visits by design.)
- Introduce a reusable modal primitive (the `common/components/Modal/` folder exists but is empty) so the About modal isn't a one-off.

## Capabilities

### New Capabilities
- `header-action-icons`: The right-side header actions — Help and Contact icon buttons that replace the attribution text, their icons, labels/tooltips, and click behavior.
- `about-modal`: The Help/About dialog — app description copy, the two footer CTAs (Start onboarding, Contact), open/close behavior, and the reusable modal primitive it is built on.

### Modified Capabilities
- `onboarding-tour`: Add a user-initiated restart path. The tour can now be re-triggered on demand (clearing the `onboarding_complete` flag and re-activating), in addition to the existing first-visit auto-start.

## Impact

- **Code**: `app/_components/category/CategoryHeader.tsx` (replace attribution with icons), `store/useOnboardingStore.ts` (add `restart`), new `common/components/Modal/` primitive, new About modal component, new header-icons component.
- **Dependencies**: none new — `lucide-react` already present.
- **Behavior**: returning users gain a way to replay onboarding; the author link moves from text to a mail icon + modal button.
