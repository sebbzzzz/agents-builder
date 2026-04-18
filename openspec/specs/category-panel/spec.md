# Spec: category-panel

## Purpose

TBD — defines the left-column panel that lists all categories, handles selection, and shows a placeholder checklist area.
## Requirements
### Requirement: Category list renders all 11 categories
The system SHALL render a scrollable vertical list of all 11 categories defined in `data/categories.ts` in the left column, in the order specified by the spec (Tech Stack first).

#### Scenario: All categories are visible
- **WHEN** the user opens the app
- **THEN** all 11 category names appear in the left panel list

#### Scenario: Tech Stack is the first item
- **WHEN** the category list is rendered
- **THEN** "Tech Stack" appears at the top of the list

### Requirement: Clicking a category sets it as active
The system SHALL open the floating options panel (rather than updating inline content) when the user clicks a category in the left column, and SHALL highlight the selected category in the list. Clicking the active category again SHALL close the panel.

#### Scenario: Clicking a category opens the floating panel
- **WHEN** the user clicks a category
- **THEN** the floating options panel appears to the right of the left column with that category's sub-categories

#### Scenario: Only one category is active at a time
- **WHEN** the user clicks a second category
- **THEN** the first category loses its active style, the second gains it, and the panel content updates to the second category

#### Scenario: Active category is highlighted
- **WHEN** the user clicks on a category
- **THEN** that category item receives the active visual style (orange accent indicator or background)

### Requirement: Left panel has a branding header
The system SHALL render a header at the top of the left column containing the app name or logo, pinned to the top of the column.

#### Scenario: App name is visible
- **WHEN** the app loads
- **THEN** the left column header shows the app name (e.g., "AGENTS.md")

#### Scenario: Header does not scroll away
- **WHEN** the user scrolls the category list
- **THEN** the branding header remains pinned at the top of the left column

