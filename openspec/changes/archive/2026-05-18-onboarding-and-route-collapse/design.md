## Context

The app currently has two routes: `/` (splash with Hero + GhostCode) and `/agents-builder` (the builder). All user value is in the builder. The splash adds a navigation step with no benefit. Users arrive with no orientation to the category → panel → editor flow.

The editor starts with `WELCOME_CONTENT` pre-populated in CodeMirror via `useDocumentStore`. `EditorContext` owns CodeMirror lifecycle and content injection. The onboarding needs to drive state (open a category panel, inject content) without bypassing existing abstractions.

## Goals / Non-Goals

**Goals:**
- Single route at `/`, builder is the landing page
- Typewriter animation on the editor welcome message (title types, rest snaps)
- 5-step `driver.js` tour on first visit, auto-drives all interactions
- `localStorage` flag prevents re-showing the tour
- App disabled via driver.js overlay during tour
- Project Context category used for the demo injection

**Non-Goals:**
- Persisting editor content across sessions
- A way to replay the tour (once dismissed, it's gone)
- Changing the editor's core CodeMirror architecture
- Server-side rendering of onboarding state

## Decisions

### D1 — driver.js over react-joyride

**Decision**: Use `driver.js` v1.4 (vanilla JS).

**Rationale**: The app uses React 19. `react-joyride` v2 depends on `react-floater` which has React peer dep issues with v19. `driver.js` is framework-agnostic — it queries the DOM and renders its own overlay, no React peer dep issues.

**Alternative considered**: Build a custom spotlight component. Rejected — handling clip-path positioning, resize events, focus trapping, and scroll management from scratch is ~3 days of work for no unique benefit.

---

### D2 — `replaceContent` + `isTypewritingRef` on EditorContext

**Decision**: Add `replaceContent(text, markAsWelcome?)` and `getIsWelcome()` to `EditorContext`. Add `isTypewritingRef` to gate the `updateListener`.

**Rationale**: The typewriter needs to update CodeMirror content without triggering `isDirty` or `scheduleAutoSave`. The existing `updateListener` in CodeMirror fires on every dispatch. Gating with a ref is the minimal, synchronous solution — CodeMirror dispatch is synchronous, so `isTypewritingRef = true → dispatch → isTypewritingRef = false` works atomically within the call stack.

**Alternative considered**: An overlay div that mimics the editor appearance while the real editor sits behind it. Rejected — requires matching CodeMirror's font, colors, and line height exactly; fragile on theme changes.

---

### D3 — DocumentStore initial content `""`

**Decision**: Change `useDocumentStore` initial `content` from `WELCOME_CONTENT` to `""`.

**Rationale**: CodeMirror initializes with `content` from DocumentStore (passed via `mount(container, content)`). If content starts as `WELCOME_CONTENT`, it renders immediately before the typewriter can take over — causing a visible flash. Starting empty lets the typewriter be the only source of initial content.

**Side effect**: `PreviewHeader` copy/export buttons are disabled until typewriter completes (~2.5s). Acceptable.

---

### D4 — `useOnboardingStore` with `init()` called on mount with 1500ms delay

**Decision**: The onboarding store starts `isActive: false`. A `useEffect` in `OnboardingOrchestrator` calls `init()` after 1500ms.

**Rationale**: 1500ms gives the typewriter time to type the title (20 chars × 120ms = 2.4s) before the modal appears. The modal overlaps with the final snap of the welcome content — the editor is active in the background, and by the time users reach step 4, the content is real.

**Alternative considered**: Tie onboarding start to typewriter completion. Rejected — adds coupling between two independent features.

---

### D5 — Auto-drive via `injectOption` directly, not FloatingOptionsPanel state

**Decision**: In the step 3→4 transition, call `injectOption("Project Context", prompt)` from `OnboardingOrchestrator` directly. The panel is visually open (spotlighted) but its local state is bypassed.

**Rationale**: `handleAdd()` in `FloatingOptionsPanel` depends on local state (`selections`, `inputValues`). Driving that state from outside the component would require lifting state or exposing refs — added complexity for a demo interaction. `injectOption` is already the EditorContext API for adding content; it's the right abstraction.

---

### D6 — FloatingOptionsPanel click-outside guard for driver.js

**Decision**: Add a check in `FloatingOptionsPanel`'s `mousedown` listener to skip if the click target is inside `.driver-popover`.

**Rationale**: The driver.js tooltip is rendered outside the panel/column DOM tree. Without this guard, clicking "Next" in the driver.js tooltip fires the click-outside handler, closing the panel mid-tour at step 3.

## Risks / Trade-offs

- **Step 3 timing** — `setActiveCategory("project-context")` is called, then `d.moveNext()` fires after 200ms. If React re-renders slower than 200ms (unlikely in practice), driver.js won't find the `[data-onboarding="floating-panel"]` target. Mitigation: 200ms is conservative; if needed, raise to 300ms.

- **driver.js CSS specificity** — driver.js ships default styles with `all: unset` on `.driver-popover`. Custom theme overrides via `.gw-popover` need to be specific enough to win. Mitigation: Use `!important` on color/background overrides in `globals.css`.

- **Mobile step positioning** — driver.js auto-repositions tooltips that would overflow the viewport. Steps 2-3 (sidebar and panel) may flip placement on narrow screens. This is driver.js default behavior and is acceptable.

- **Typewriter + user interaction race** — If a user starts typing before the typewriter completes, `clearWelcome` fires, `isWelcomeRef` goes to `false`, and `getIsWelcome()` check in the typewriter hook stops it. The editor is left in whatever state `clearWelcome` set (content: `"# AGENTS.md"`). This is the correct behavior — user intent wins.

## Migration Plan

No migration needed. `localStorage` key `onboarding_complete` is additive — existing users who load the app will see the tour once, then it's gone. No existing data is affected.

Rollback: revert the branch. The `localStorage` key persists but is harmless if the code reading it is removed.
