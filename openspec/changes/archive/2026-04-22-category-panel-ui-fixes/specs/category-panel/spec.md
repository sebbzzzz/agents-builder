## MODIFIED Requirements

### Requirement: Clicking a category sets it as active
The system SHALL open the floating options panel to the right of the left column when the user clicks a category, SHALL highlight the active category row with a distinct background color, and SHALL close the panel only when the user clicks outside of both the floating panel and the left column. Clicking the active category again SHALL close the panel.

#### Scenario: Clicking a category opens the floating panel
- **WHEN** the user clicks a category
- **THEN** the floating options panel appears to the right of the left column with that category's sub-options

#### Scenario: Only one category is active at a time
- **WHEN** the user clicks a second category
- **THEN** the first category loses its active style, the second gains it, and the panel content updates to the second category

#### Scenario: Active category is highlighted with background
- **WHEN** the user clicks on a category
- **THEN** that category item receives a distinct background color (active state)

#### Scenario: Panel does not close on select dropdown interaction
- **WHEN** the user opens a select input inside the floating panel
- **THEN** the floating panel remains open

#### Scenario: Panel does not close on tooltip interaction
- **WHEN** the user hovers or clicks a tooltip trigger inside the floating panel
- **THEN** the floating panel remains open

#### Scenario: Panel closes on outside click
- **WHEN** the user clicks outside of both the floating panel and the left column
- **THEN** the floating panel closes

### Requirement: Category row uses chevron icon
The system SHALL display a `ChevronRight` icon on each category row instead of a checkbox. The icon SHALL indicate that clicking the row opens a detail panel.

#### Scenario: ChevronRight icon is visible on each row
- **WHEN** the category list is rendered
- **THEN** each category row shows a `ChevronRight` icon, not a checkbox

### Requirement: Category enable/disable control is inside the floating panel
The system SHALL render the enable/disable toggle for a category inside the floating options panel (not on the category row). The toggle SHALL be visible when the panel is open for that category.

#### Scenario: Enable toggle appears in the floating panel
- **WHEN** the user clicks a category and the floating panel opens
- **THEN** an enable/disable checkbox or toggle for that category is visible inside the panel

### Requirement: Sub-options are disabled by default
The system SHALL render all sub-options in the disabled (unchecked/off) state when a category panel is first opened.

#### Scenario: Sub-options start disabled
- **WHEN** the floating panel opens for any category
- **THEN** all sub-options are in the disabled state

## MODIFIED Requirements

### Requirement: Left panel has a constrained width
The system SHALL render the left column with a maximum width of 280 pixels.

#### Scenario: Left column does not exceed 280px
- **WHEN** the app is rendered at any viewport width
- **THEN** the left column width does not exceed 280 pixels
