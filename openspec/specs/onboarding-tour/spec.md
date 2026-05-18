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
The tour SHALL consist of 5 sequential steps delivered via driver.js spotlight modals.

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
- **THEN** `setActiveCategory("project-context")` is called and the floating panel mounts before driver.js targets it

#### Scenario: Auto-inject on step 3→4 transition
- **WHEN** the user advances from step 3 to step 4
- **THEN** `injectOption("Project Context", clientProductionPrompt)` is called and `clearActiveCategory()` is called

