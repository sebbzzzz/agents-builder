## MODIFIED Requirements

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

### Requirement: Tour auto-drives the Project Context demo
The system SHALL automatically open the Project Context category and inject a demo selection without requiring user interaction.

#### Scenario: Auto-open on step 2→3 transition
- **WHEN** the user advances from step 2 to step 3
- **THEN** `setActiveCategory("project-context")` is called and the floating panel mounts before the tour positions its spotlight and popover on it

#### Scenario: Auto-inject on step 3→4 transition
- **WHEN** the user advances from step 3 to step 4
- **THEN** `injectOption("Project Context", clientProductionPrompt)` is called and `clearActiveCategory()` is called
