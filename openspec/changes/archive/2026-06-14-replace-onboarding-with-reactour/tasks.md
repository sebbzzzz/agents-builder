## 1. Dependency & spike

- [x] 1.1 Get sign-off to add `@reactour/tour` and remove `driver.js` (AGENTS.md dependency rule) — user authorized via `/opsx:apply`
- [x] 1.2 Add `@reactour/tour` to `package.json`; install (v3.8.0, React 19 peer)
- [ ] 1.3 Spike: mount a minimal reactour tour over the live app and verify the mask cutout + popover positioning track the sidebar, floating panel, and editor on desktop and a 375px viewport — confirm the editor/overflow interaction before committing to the full rewrite — **NEEDS BROWSER VERIFICATION** (folded into the full implementation; build/SSR pass, visual tracking unverified)

## 2. Tour card component

- [x] 2.1 Create `<TourCard>` React component rendering the three zones as JSX: header (brand mark, monospace breadcrumb, count pill, close button), body (eyebrow + accent rule, `h2` title, description), footer (per-step tick bars, ghost Back button, shimmer Next/Finish button)
- [x] 2.2 Port `STEP_META` as the data source for header eyebrow/breadcrumb/count; render the wider centered variant for the welcome step (step 0)
- [x] 2.3 Wire Back/Next/Finish/close handlers (TourCard owns them via reactour `setCurrentStep`/`setIsOpen` props)

## 3. Orchestrator rewrite

- [x] 3.1 Replace driver.js setup with `<TourProvider>` + `useTour`, passing `<TourCard>` as `ContentComponent` and the 5 steps with `data-onboarding` selectors
- [x] 3.2 Trigger on first visit after the existing 300ms delay and read/write the `onboarding_complete` flag via `useOnboardingStore` — note: step index is reactour-managed (read from props), not provider-controlled; substance (first-visit open + flag) delivered
- [x] 3.3 Port per-step side-effect choreography: 1→2 `setActiveCategory` + overflow visible (panel observed via `mutationObservables`); 2→3 `injectOption(...)` + `clearActiveCategory()` + restore overflow; Finish `setIsOpen(false)`; close/ESC/mask → single teardown effect (`clearActiveCategory` + reset editor + `complete()`) — `handledRef` unnecessary since `complete`/`skip` are identical
- [x] 3.4 Configure mask/overlay color (`#000` @ 0.65), stage radius (`rx:4`), and `disableInteraction` via reactour props/`styles`
- [x] 3.5 Render the centered welcome step (step 0, `position:'center'`) with the highlight cutout hidden — **VISUAL VERIFICATION recommended** (mask `display:none` trick is the main runtime risk)

## 4. CSS cleanup

- [x] 4.1 Delete the structural driver.css reimplementation from `onboarding.css` (overlay, arrow geometry, pointer-events, fade keyframes)
- [x] 4.2 Retarget the kept `.gw-popover` theme selectors (`.driver-popover-*` → `.gw-header`/`.gw-close`/`.gw-desc`/`.gw-footer`/`.gw-nav`/`.gw-back`/`.gw-next`); shimmer Next + ghost Back retained
- [ ] 4.3 Verify responsive sizing: 360px default / 460px welcome on desktop, `calc(100vw - 32px)` on ≤375px without overflow — **NEEDS BROWSER VERIFICATION** (CSS in place; not visually confirmed)

## 5. Remove driver.js & verify

- [x] 5.1 Remove the `driver.js` dependency and all `import { driver } from "driver.js"` references (also updated the `.driver-popover` click-guard in `FloatingOptionsPanel` → `.gw-popover`)
- [ ] 5.2 Walk every `onboarding-tour` spec scenario manually (5 steps, auto-demo, completion via Finish, dismissal via close/ESC, tick bars, shimmer/ghost buttons) on desktop and mobile — **NEEDS BROWSER VERIFICATION**
- [x] 5.3 Run lint + typecheck + build; confirm no driver.js references remain (typecheck clean, onboarding files lint clean, build prerenders `/` successfully, zero driver refs)
