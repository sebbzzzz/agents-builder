# onboarding-tour Specification

## Purpose
TBD - created by archiving change onboarding-and-route-collapse. Update Purpose after archive.
## Requirements
### Requirement: First-visit tour triggers automatically
The system SHALL check `localStorage` for the key `onboarding_complete` on every app load. If the key is absent, the onboarding tour SHALL start after a 1500ms delay.

#### Scenario: First visit — no flag
- **WHEN** the user loads the app and `localStorage.getItem("onboarding_complete")` returns `null`
- **THEN** the onboarding tour starts after 1500ms

#### Scenario: Returning visit — flag present
- **WHEN** the user loads the app and `localStorage.getItem("onboarding_complete")` returns `"1"`
- **THEN** no tour is shown and the app behaves normally

---

### Requirement: Tour has exactly 5 steps
The tour SHALL consist of 5 sequential steps delivered as spotlight modals via the `@reactour/tour` engine.

#### Scenario: Step 1 — Welcome modal
- **WHEN** the tour starts
- **THEN** a centered modal appears with a welcome message and a "Start tour →" button, with no spotlight element highlighted

#### Scenario: Step 2 — Sidebar spotlight
- **WHEN** the user clicks "Next" on step 1
- **THEN** the sidebar (`[data-onboarding="sidebar"]`) is spotlighted with a tooltip explaining the 14 categories

#### Scenario: Step 3 — Floating panel spotlight
- **WHEN** the user clicks "Next" on step 2
- **THEN** the Project Context category is opened automatically, the floating panel (`[data-onboarding="floating-panel"]`) is spotlighted, and a tooltip explains the options panel

#### Scenario: Step 4 — Editor spotlight
- **WHEN** the user clicks "Next" on step 3
- **THEN** `injectOption("Project Context", clientProductionPrompt)` is called, the panel is closed, and the editor (`[data-onboarding="editor"]`) is spotlighted showing the injected content

#### Scenario: Step 5 — Export buttons spotlight
- **WHEN** the user clicks "Next" on step 4
- **THEN** the export/copy buttons (`[data-onboarding="export-buttons"]`) are spotlighted with a "Finish" button

---

### Requirement: App is disabled during tour
The system SHALL disable all user interaction outside the spotlighted element while the tour is active.

#### Scenario: Overlay blocks interaction
- **WHEN** the onboarding tour is active on any step
- **THEN** a semi-transparent overlay covers all non-spotlighted areas and pointer events are disabled on them

---

### Requirement: Tour completion sets the localStorage flag
The system SHALL set `localStorage["onboarding_complete"] = "1"` when the user completes or skips the tour.

#### Scenario: User finishes the tour
- **WHEN** the user clicks "Finish" on step 5
- **THEN** `localStorage.setItem("onboarding_complete", "1")` is called and the tour is dismissed

#### Scenario: User dismisses via close button or ESC
- **WHEN** the user clicks the close (×) button on any step or presses ESC
- **THEN** `localStorage.setItem("onboarding_complete", "1")` is called and the tour is dismissed

---

### Requirement: Tour auto-drives the Project Context demo
The system SHALL automatically open the Project Context category and inject a demo selection without requiring user interaction.

#### Scenario: Auto-open on step 2→3 transition
- **WHEN** the user advances from step 2 to step 3
- **THEN** `setActiveCategory("project-context")` is called and the floating panel mounts before the tour positions its spotlight and popover on it

#### Scenario: Auto-inject on step 3→4 transition
- **WHEN** the user advances from step 3 to step 4
- **THEN** `injectOption("Project Context", clientProductionPrompt)` is called and `clearActiveCategory()` is called

---

### Requirement: Tour card displays three-zone chrome layout
The tour popover SHALL render a header zone, body zone, and footer zone matching the style reference card anatomy. The card SHALL be authored as a React component whose JSX renders these zones directly; the system SHALL NOT inject supplementary DOM elements into a library-generated popover after render.

#### Scenario: Header zone is populated on every step
- **WHEN** any tour step renders
- **THEN** the popover header SHALL contain a brand mark square (12×12px accent border with 25% filled inset), a breadcrumb path in monospace, a step count pill with accent-faint background, and the close button — all in a flex row

#### Scenario: Body zone has eyebrow and titled heading
- **WHEN** any tour step renders
- **THEN** the popover body SHALL display an eyebrow label (monospace uppercase with 18px accent rule prefix) above an `h2` title, followed by the step description

#### Scenario: Footer zone shows tick-bar progress
- **WHEN** any tour step renders
- **THEN** the footer SHALL display horizontal tick bars (one per step) instead of the default "N of M" text — the active tick SHALL be 22px wide and accent-colored; completed ticks SHALL be accent-colored at 14px; future ticks SHALL be border-strong colored at 14px

---

### Requirement: Tour card dimensions are responsive
The tour card SHALL be 360px wide on desktop and SHALL shrink to fit on small screens without horizontal overflow.

#### Scenario: Card fits on 375px mobile viewport
- **WHEN** the viewport width is 375px or narrower
- **THEN** the tour card SHALL have `max-width: calc(100vw - 32px)` and SHALL not overflow the viewport

#### Scenario: Welcome step card is wider on desktop
- **WHEN** the tour is on step 0 (the welcome/centered step)
- **THEN** the card SHALL be 460px wide on viewports wider than 492px, and SHALL collapse to `calc(100vw - 32px)` on smaller viewports

---

### Requirement: Next button renders a shimmer gradient animation
The Next/Finish button SHALL display a looping shimmer animation using the project's existing accent gradient colors.

#### Scenario: Shimmer animation plays continuously
- **WHEN** the tour card is visible
- **THEN** the Next button background SHALL animate between accent highlight colors using `tour-btn-shimmer` at 3.4s ease-in-out infinite

#### Scenario: Next button lifts on hover
- **WHEN** the user hovers over the Next button
- **THEN** the button SHALL translate up by 1px and increase its box-shadow intensity

---

### Requirement: Back button uses ghost style
The Back/Previous button SHALL render as a ghost button with a monospace uppercase label and no filled background.

#### Scenario: Back button appears on steps 1 through 4
- **WHEN** the tour is on any step other than step 0
- **THEN** a Back button SHALL be visible with transparent background, `--border-strong` border, and monospace uppercase text

#### Scenario: Back button has no filled background on hover
- **WHEN** the user hovers over the Back button
- **THEN** the button border SHALL shift to `--muted-foreground` and text SHALL shift to `--foreground`; background remains transparent

---

### Requirement: Per-step metadata drives header content
Each tour step SHALL have a unique eyebrow label, breadcrumb path, and step count string defined in a `STEP_META` array in the orchestrator component.

#### Scenario: Step 0 shows INTRO count and welcome breadcrumb
- **WHEN** the tour is on step 0
- **THEN** the count pill SHALL display "INTRO", the eyebrow SHALL display "Welcome", and the breadcrumb SHALL show "groundwork / onboarding / tour"

#### Scenario: Steps 1-4 show sequential counts
- **WHEN** the tour is on steps 1 through 4
- **THEN** the count pill SHALL display "01 / 04" through "04 / 04" respectively, with step-specific eyebrow and breadcrumb strings

---

### Requirement: Tour can be restarted on demand
The system SHALL expose a restart action that re-runs the onboarding tour from the first step even after the `onboarding_complete` flag has been set. Restarting SHALL clear the completion flag and re-activate the tour, so a returning user who triggers it sees the full tour again.

#### Scenario: Restart after completion
- **WHEN** `localStorage.getItem("onboarding_complete")` returns `"1"` and the restart action is invoked
- **THEN** the `onboarding_complete` flag is cleared and the tour re-activates from step 0

#### Scenario: Restart from the About modal
- **WHEN** the user clicks "Start onboarding" in the About modal
- **THEN** the restart action is invoked and the tour begins at step 0

#### Scenario: Completing a restarted tour re-sets the flag
- **WHEN** the user completes or dismisses a restarted tour
- **THEN** `localStorage.setItem("onboarding_complete", "1")` is called, matching the first-visit completion behavior

