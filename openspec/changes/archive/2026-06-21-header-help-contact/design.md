## Context

The header (`app/_components/category/CategoryHeader.tsx`) is a static server-friendly component: a logo + "groundwork" on the left, and a "By: seb.bz" mono text link on the right. There is no modal infrastructure in the app yet — `common/components/Modal/` exists but is empty, and a codebase search finds no `role="dialog"`, `createPortal`, or dialog primitive anywhere. Onboarding is driven by `store/useOnboardingStore.ts` (Zustand) which only auto-starts on first visit: `init()` sets `isActive: true` when `localStorage["onboarding_complete"]` is absent, and `complete()`/`skip()` set the flag. `OnboardingTour.tsx` opens the reactour provider whenever `isActive` flips true. `lucide-react` is already a dependency and is the icon source used across the app.

## Goals / Non-Goals

**Goals:**
- Replace the attribution text with two accessible icon buttons (Help, Contact).
- Provide an About modal with app copy and two CTAs (Start onboarding, Contact).
- Let users replay onboarding on demand, after completion.
- Land a small reusable modal primitive so this isn't a throwaway one-off.

**Non-Goals:**
- No routing, no new page — the modal is in-app overlay only.
- No analytics/event wiring for the new buttons (can come later).
- No redesign of the onboarding tour content itself.
- No general design-system Dialog with every variant — just enough primitive for this modal.

## Decisions

**Restart via a new store action, not by re-calling `init()`.**
`init()` intentionally no-ops when the flag is present, so reusing it would either require weakening that guard or duplicating logic. Add an explicit `restart()` to `useOnboardingStore`: it removes the `onboarding_complete` key and sets `isActive: true`. This keeps first-visit auto-start and user-initiated replay as two clearly separate paths, and the existing `complete()`/`skip()` teardown still re-sets the flag when the replayed tour ends. _Alternative considered:_ a `force` arg on `init()` — rejected as it muddies the first-visit contract the spec documents.

**Build a minimal `Modal` primitive in `common/components/Modal/`.**
The folder is already scaffolded and empty, signalling intent. Implement a client component using `createPortal` to `document.body`, an overlay that closes on backdrop click, Escape-to-close, and a close button — accepting `isOpen`, `onClose`, and children. The About modal composes it. _Alternative considered:_ pulling in a headless dialog dependency (Radix) — rejected per AGENTS.md's "ask before adding dependencies / stack is intentionally minimal"; a focused primitive is cheaper than a new dep here.

**Icons: `HelpCircle` and `Mail` from `lucide-react`.**
Already the app's icon library, so zero new surface. Buttons are icon-only with `aria-label`s for accessibility.

**Contact is a plain external link target, reused in two places.**
Both the header Contact icon and the modal Contact button point at `https://seb.bz/` with `target="_blank" rel="noopener noreferrer"`. The URL is a single constant so the two stay in sync.

**Keep the header component placement; extract the right-side actions.**
The icon buttons + modal open state are interactive, so the right-side actions move into a small `"use client"` component (e.g. `HeaderActions`) that owns the modal open state, while `CategoryHeader` stays as the layout shell.

## Risks / Trade-offs

- **Icon-only buttons hurt discoverability / a11y** → provide `aria-label`s and native `title` tooltips so both pointer and assistive-tech users get the label.
- **Restarting mid-session while editor has content** → the existing tour teardown already calls `replaceContent(WELCOME_CONTENT)` on close; restarting from the modal inherits that same teardown, so no new data-loss path is introduced beyond what completing the tour already does. Worth confirming during apply that replaying doesn't surprise a user with unsaved edits.
- **Hand-rolled modal misses focus-trap edge cases** → scope the primitive to Escape + overlay-close + initial focus; note full focus-trap as a follow-up if the modal grows.

## Open Questions

- Exact About copy — reuse/trim the existing `WELCOME_CONTENT`, or author fresh short blurb? (Defaulting to a fresh 1–2 sentence blurb during apply.)
- Should "Start onboarding" warn before discarding current editor content? (Defaulting to no warning, matching current tour-close behavior.)
