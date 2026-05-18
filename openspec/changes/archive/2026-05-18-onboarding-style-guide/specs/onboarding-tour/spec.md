## ADDED Requirements

### Requirement: Tour card displays three-zone chrome layout
The tour popover SHALL render a header zone, body zone, and footer zone matching the style reference card anatomy. The `onPopoverRender` callback SHALL inject supplementary DOM elements into driver.js's generated popover after each step renders.

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
