## 1. CSS — Globals Cleanup and Keyframe

- [x] 1.1 Add `@keyframes tour-btn-shimmer` to `styles/globals.css` (after the existing `gradient-flow` keyframe)
- [x] 1.2 Delete the entire `.gw-popover` block from `styles/globals.css` (lines 165-269) — all rules from `/* ── driver.js onboarding theme */` through the last `.driver-popover-arrow-side-bottom` rule

## 2. CSS — Tour Card Shell

- [x] 2.1 Add `.gw-popover` card shell styles: `width: 360px`, `max-width: calc(100vw - 32px)`, `padding: 0`, `overflow: hidden`, `background: var(--surface)`, `border: 1px solid var(--border-strong)`, `border-radius: 5px`, multi-layer `box-shadow`
- [x] 2.2 Add `.gw-popover::before` grid texture overlay using `linear-gradient(var(--accent-faint) 1px, transparent 1px) 0 0 / 100% 22px` at `opacity: 0.55`
- [x] 2.3 Add `.gw-popover--welcome` with `width: 460px !important` for the centered welcome step

## 3. CSS — Header Zone

- [x] 3.1 Style `.gw-popover .driver-popover-title` as a flex row: `display: flex`, `align-items: center`, `gap: 10px`, `padding: 11px 14px 10px`, `border-bottom: 1px solid var(--border)`, `background: oklch(0.17 0.008 60 / 0.7)`, mono font 10.5px, `--muted-foreground` color
- [x] 3.2 Add `.gw-popover .gw-mark` styles: 12×12px, `border: 1.5px solid var(--accent)`, `flex-shrink: 0`, relative position; add `::after` pseudo-element with `inset: 2px`, `background: var(--accent)`, `opacity: 0.25`
- [x] 3.3 Add `.gw-popover .gw-crumb` styles: `color: var(--foreground-2)`, `flex: 1`, mono font, truncation; add `.sep` child style with `color: var(--border-strong)`, `margin: 0 3px`
- [x] 3.4 Add `.gw-popover .gw-count` styles: mono 10px, `color: var(--accent-2)`, `background: var(--accent-faint)`, `border: 1px solid var(--accent-ghost)`, `border-radius: 3px`, `padding: 2px 7px`, `flex-shrink: 0`
- [x] 3.5 Style `.gw-popover .driver-popover-close-btn`: override `position: static !important` (removes driver's absolute positioning), `width/height: 20px`, `display: inline-flex`, center aligned, mono 13px, `color: var(--foreground-4)`, hover to `var(--foreground)` with `var(--popover)` background

## 4. CSS — Body Zone

- [x] 4.1 Add `.gw-popover .gw-eyebrow` styles: `display: inline-flex`, `gap: 8px`, mono 10.5px, `color: var(--accent-2)`, uppercase, `letter-spacing: 0.16em`, `margin: 20px 22px 12px`; add `::before` pseudo-element with `width: 18px`, `height: 1px`, `background: var(--accent)`
- [x] 4.2 Add `.gw-popover .gw-title` styles: `font-family: var(--font-sans)`, `font-size: 20px`, `font-weight: 600`, `letter-spacing: -0.015em`, `line-height: 1.18`, `color: var(--foreground)`, `margin: 0 22px 10px`, `text-wrap: pretty`
- [x] 4.3 Style `.gw-popover .driver-popover-description`: `padding: 0 22px`, sans 13.5px, `line-height: 1.6`, `color: var(--foreground-2)`, `margin: 0`; add `strong` child style at `var(--foreground-2)`; add `code` child style with mono font, `var(--accent-faint)` bg, `var(--accent-ghost)` border, `var(--accent-2)` color

## 5. CSS — Footer Zone

- [x] 5.1 Style `.gw-popover .driver-popover-footer`: `display: flex`, `align-items: center`, `gap: 12px`, `padding: 14px 18px 16px`, `border-top: 1px dashed var(--border)`, `margin-top: 14px`; override driver's `text-align: right` with `text-align: unset`
- [x] 5.2 Style `.gw-popover .driver-popover-progress-text`: `display: flex`, `align-items: center`, `gap: 8px`, mono 10px, `color: var(--foreground-4)`, `letter-spacing: 0.06em`
- [x] 5.3 Add `.gw-popover .gw-ticks` styles: `display: flex`, `gap: 3px`, `align-items: center`
- [x] 5.4 Add `.gw-popover .gw-tick` styles: `width: 14px`, `height: 2px`, `background: var(--border-strong)`, `border-radius: 1px`; add `.is-done` with `background: var(--accent)`; add `.is-now` with `background: var(--accent)`, `width: 22px`
- [x] 5.5 Style `.gw-popover .driver-popover-navigation-btns`: `flex-grow: 1`, `display: flex`, `justify-content: flex-end`, `gap: 8px`
- [x] 5.6 Style `.gw-popover .driver-popover-prev-btn` (Back): mono 11px, uppercase, `letter-spacing: 0.05em`, `padding: 7px 13px`, `border-radius: 3px`, `border: 1px solid var(--border-strong)`, `color: var(--foreground-2)`, transparent bg; hover: border → `--muted-foreground`, color → `--foreground`
- [x] 5.7 Style `.gw-popover .driver-popover-next-btn` (Next): sans weight 600, 12px, no uppercase, `color: var(--primary-foreground)`, shimmer gradient bg `linear-gradient(90deg, #ffb067, #ff781d, #ffb067)`, `background-size: 200% 100%`, `padding: 7px 16px 7px 14px`, `border-radius: 3px`, box-shadow, `animation: tour-btn-shimmer 3.4s ease-in-out infinite`; hover: `transform: translateY(-1px)`, deeper shadow
- [x] 5.8 Re-add arrow styles for `.gw-popover .driver-popover-arrow-side-{left,right,top,bottom}` using `var(--surface)` as the arrow fill color

## 6. TypeScript — Step Metadata and Render Hook

- [x] 6.1 Add `STEP_META` constant array above the `OnboardingOrchestrator` function in `OnboardingOrchestrator.tsx` — 5 entries with `eyebrow`, `crumb` (string array), `count`, and `isWelcome` fields
- [x] 6.2 Add `showProgress: true` to the top-level `driver({...})` config object
- [x] 6.3 Add `onPopoverRender` callback to driver config: reads `state.activeIndex`, adds `gw-popover--welcome` class on step 0, captures original title text from `popover.title.innerText`
- [x] 6.4 In `onPopoverRender`: clear `popover.title.innerHTML`, append `gw-mark` span, append `gw-crumb` span with separator-joined path parts, append `gw-count` span with count text, append `popover.closeButton` (moves it into flex row), force `popover.title.style.display = "flex"`
- [x] 6.5 In `onPopoverRender`: prepend `gw-eyebrow` span before `popover.description`, prepend `h2.gw-title` with captured title text before `popover.description`
- [x] 6.6 In `onPopoverRender`: clear `popover.progress.innerHTML`, build and append `gw-ticks` span with one `gw-tick` span per step (classes: `is-done` for past, `is-now` for current, bare for future)

## 7. Verification

- [ ] 7.1 Open app in incognito tab — tour auto-starts; verify step 0 renders 460px centered card with "INTRO" pill, "Welcome" eyebrow, shimmer Next, no Back button
- [ ] 7.2 Advance through all 5 steps — verify header chrome (mark + crumb + count), tick-bar progress, ghost Back from step 1, correct eyebrow/count per step
- [ ] 7.3 Resize browser to 375px width — verify no horizontal overflow and card fits within viewport margins
- [x] 7.4 Run `yarn build` and confirm no TypeScript errors
