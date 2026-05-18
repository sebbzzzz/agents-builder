## 1. Foundation

- [x] 1.1 Install `driver.js` ^1.4 via yarn
- [x] 1.2 Create `store/useOnboardingStore.ts` with `isActive`, `init()`, `complete()`, `skip()` — checks `localStorage["onboarding_complete"]` in `init()`
- [x] 1.3 Change `store/useDocumentStore.ts` initial `content` from `WELCOME_CONTENT` to `""`

## 2. EditorContext Extensions

- [x] 2.1 Add `isTypewritingRef = useRef(false)` to `EditorContext`
- [x] 2.2 Change `mount()` to always set `isWelcomeRef.current = true` (remove `content === WELCOME_CONTENT` conditional)
- [x] 2.3 Add early return `if (isTypewritingRef.current) return` in the CodeMirror `updateListener`
- [x] 2.4 Add `replaceContent(text: string, markAsWelcome?: boolean)` method to `EditorContext` and expose it in the context interface
- [x] 2.5 Add `getIsWelcome(): boolean` method to `EditorContext` and expose it in the context interface

## 3. Welcome Typewriter

- [x] 3.1 Create `app/_hooks/useWelcomeTypewriter.ts` — types `"# AGENTS.md Builder"` at 120ms/char, then snaps full `WELCOME_CONTENT`, calls `setContent(WELCOME_CONTENT)` on completion, stops if `getIsWelcome()` returns `false`

## 4. Route Collapse

- [x] 4.1 Rewrite `app/page.tsx` with `"use client"` to render the builder layout (copy structure from `agents-builder/page.tsx`), adding `data-onboarding="sidebar"` on `<aside>` and `data-onboarding="editor"` on `<main>`
- [x] 4.2 Render `<OnboardingOrchestrator />` inside `EditorProvider` in `app/page.tsx`
- [x] 4.3 Replace `app/agents-builder/page.tsx` with a Next.js `redirect("/")` server component

## 5. data-onboarding Attributes

- [x] 5.1 Add `data-onboarding="floating-panel"` to the root `<div>` in `FloatingOptionsPanel.tsx`
- [x] 5.2 Add `data-onboarding="export-buttons"` to the action buttons `<div>` in `PreviewHeader.tsx`

## 6. FloatingOptionsPanel Click-Outside Guard

- [x] 6.1 Add `if (target.closest(".driver-popover")) return` at the top of the `mousedown` handler in `FloatingOptionsPanel.tsx` to prevent the panel from closing when clicking driver.js tooltip buttons

## 7. OnboardingOrchestrator

- [x] 7.1 Create `app/_components/onboarding/OnboardingOrchestrator.tsx` — renders `null`, calls `useWelcomeTypewriter()`, starts onboarding via `init()` after 1500ms
- [x] 7.2 Implement driver.js instance with 5 steps: welcome (centered), sidebar, floating panel, editor, export buttons
- [x] 7.3 Step 2→3 transition: call `setActiveCategory("project-context")` then `d.moveNext()` after 200ms
- [x] 7.4 Step 3→4 transition: call `injectOption("Project Context", clientProductionPrompt)`, `clearActiveCategory()`, then `d.moveNext()`
- [x] 7.5 Import `driver.js/dist/driver.css` in the orchestrator
- [x] 7.6 Wire `onDestroyed` to call `skip()` if not already handled; last step "Finish" calls `complete()` then `d.destroy()`

## 8. Styling

- [x] 8.1 Add `.gw-popover` overrides to `styles/globals.css` — dark background (`var(--surface)`), `var(--foreground)` text, `var(--accent)` next button, `var(--border)` borders
- [x] 8.2 Override driver.js arrow colors to match `.gw-popover` background

## 9. Verification

- [x] 9.1 Typecheck passes (`yarn typecheck`)
- [x] 9.2 Lint passes (`yarn lint`) — 2 pre-existing errors in untouched files; zero new errors introduced
- [ ] 9.3 First visit: typewriter animates, tour appears after 1.5s, all 5 steps work, `localStorage` flag is set on finish
- [ ] 9.4 Return visit: no tour, editor animates normally, builder functions as before
- [x] 9.5 Navigating to `/agents-builder` redirects to `/` — verified (307 → http://localhost:3001/)
- [ ] 9.6 Mobile: tour steps are visible and usable on a 375px viewport
