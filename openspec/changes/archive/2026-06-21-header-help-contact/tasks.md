## 1. Onboarding restart path

- [x] 1.1 Add a `restart()` action to `store/useOnboardingStore.ts` that removes the `onboarding_complete` localStorage key and sets `isActive: true`
- [x] 1.2 Verify `OnboardingTour.tsx` opens the tour when `isActive` flips true via `restart()` (added `setCurrentStep(0)` on activation so a replay starts from step 0 — reactour retains the prior step otherwise)

## 2. Reusable modal primitive

- [x] 2.1 Create `common/components/Modal/Modal.tsx` — a `"use client"` component using `createPortal` to `document.body`, accepting `isOpen`, `onClose`, and children
- [x] 2.2 Implement overlay backdrop click-to-close, Escape-to-close, a close button, and initial focus; style with design tokens (`--surface`, `--border`, etc.); added a `bare` mode for callers that supply their own card chrome
- [x] 2.3 Export the primitive from `common/components/Modal/`

## 3. Contact link constant

- [x] 3.1 Add a single shared constant for the portfolio URL `https://seb.bz/` (`PORTFOLIO_URL` in `app/_utils/site.ts`) used by both the header icon and the modal button

## 4. About modal

- [x] 4.1 Create the About modal component composing the Modal primitive: TourCard-style chrome (header crumb + close), centered title, and five sections (About this tool, Principles, Inspiration, AI/AGENTS.md/agentic dev, Quick how to use) — co-located `AboutModal.css`
- [x] 4.2 Add the footer actions — "Start onboarding" (animated `ShimmerButton`; calls `restart()` then closes) and "Contact" (opens `https://seb.bz/` in a new tab with `rel="noopener noreferrer"`)

## 5. Header action icons

- [x] 5.1 Extract a `"use client"` `HeaderActions` component that owns the About modal open state
- [x] 5.2 Render Help (`HelpCircle`) and Contact (`Mail`) icon buttons from `lucide-react` with `aria-label`s and `title` tooltips
- [x] 5.3 Wire Help to open the About modal; wire Contact to open the portfolio URL in a new tab
- [x] 5.4 Replace the "By: seb.bz" block in `CategoryHeader.tsx` with `<HeaderActions />`

## 6. Verification

- [x] 6.1 Run `yarn tsc --noEmit` (clean) and `yarn lint` (only pre-existing errors in untouched LogoMark/OptionRow remain)
- [ ] 6.2 Manually verify: Contact icon and modal Contact button open `https://seb.bz/`; Help opens the modal; "Start onboarding" replays the full tour after completion; modal closes via button, overlay, and Escape
