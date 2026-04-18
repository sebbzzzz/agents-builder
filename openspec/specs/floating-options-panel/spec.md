# floating-options-panel Specification

## Purpose
TBD - created by archiving change ui-form-components-redesign. Update Purpose after archive.
## Requirements
### Requirement: Floating panel opens when a category is clicked
The system SHALL render a floating options panel to the right of the category list when the user clicks a category, displaying all sub-categories for that category.

#### Scenario: Panel appears on category click
- **WHEN** the user clicks a category in the left column
- **THEN** the floating options panel becomes visible, positioned to the right of the left column, containing the sub-categories for that category

#### Scenario: Panel shows the active category name as its header
- **WHEN** the floating panel is open
- **THEN** the panel header displays the name of the currently active category

### Requirement: Floating panel closes on dismiss actions
The system SHALL close the floating options panel when the user clicks the same category again, clicks outside the panel, or presses the Escape key.

#### Scenario: Clicking the active category closes the panel
- **WHEN** the floating panel is open for category A and the user clicks category A again
- **THEN** the floating panel closes

#### Scenario: Pressing Escape closes the panel
- **WHEN** the floating panel is open and the user presses the Escape key
- **THEN** the floating panel closes and focus returns to the active category button

#### Scenario: Clicking outside the panel closes it
- **WHEN** the floating panel is open and the user clicks anywhere outside the panel and the category list
- **THEN** the floating panel closes

### Requirement: Clicking a different category swaps the panel content
The system SHALL update the floating panel content immediately when the user clicks a different category while the panel is already open.

#### Scenario: Panel content updates without closing
- **WHEN** the floating panel is open for category A and the user clicks category B
- **THEN** the panel remains visible but its header and sub-categories update to reflect category B

### Requirement: Floating panel is positioned without clipping
The system SHALL render the floating panel as an absolute-positioned overlay anchored to the right edge of the left column, with `z-index` high enough to appear above the main content area.

#### Scenario: Panel does not push layout content
- **WHEN** the floating panel is open
- **THEN** the left column and main content area do not shift or resize

#### Scenario: Panel is fully visible on screen
- **WHEN** the floating panel is open on typical viewport widths
- **THEN** the panel is not clipped by any scroll container or overflow boundary

### Requirement: Floating panel is accessible
The system SHALL give the floating panel appropriate ARIA attributes and manage keyboard focus when the panel opens and closes.

#### Scenario: Panel has an accessible region label
- **WHEN** the floating panel is rendered
- **THEN** it has `role="region"` and an `aria-label` matching the active category name

#### Scenario: Focus moves into the panel on open
- **WHEN** the user opens the floating panel via keyboard (Enter/Space on a category)
- **THEN** focus moves to the first interactive element inside the panel

