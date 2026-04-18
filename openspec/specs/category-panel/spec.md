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
The system SHALL update the active category in the Zustand store when the user clicks a category, and highlight the selected category in the list.

#### Scenario: Active category is highlighted
- **WHEN** the user clicks on a category
- **THEN** that category item receives the active visual style (orange accent indicator or background)

#### Scenario: Only one category is active at a time
- **WHEN** the user clicks a second category
- **THEN** the first category loses its active style and the second gains it

### Requirement: Checklist area renders sub-categories from CATEGORIES data
The system SHALL render the active category's `subCategories` array from the `CATEGORIES` data structure, dispatching on each sub-category's `type` to render the correct input control — replacing the previous flat checkbox list sourced from the stub `OPTIONS` map.

#### Scenario: Sub-categories are visible under the active category
- **WHEN** the user clicks a category that has sub-categories
- **THEN** each sub-category label and its corresponding input controls are rendered in the checklist area

#### Scenario: Empty state is shown when no options exist
- **WHEN** the active category has no sub-categories
- **THEN** the checklist area displays a non-empty placeholder (e.g., "Options coming soon")

#### Scenario: Active category name appears in checklist area
- **WHEN** the user clicks a category
- **THEN** the checklist area header updates to show that category's name

### Requirement: Left panel has a branding header
The system SHALL render a header at the top of the left column containing the app name or logo, pinned to the top of the column.

#### Scenario: App name is visible
- **WHEN** the app loads
- **THEN** the left column header shows the app name (e.g., "AGENTS.md")

#### Scenario: Header does not scroll away
- **WHEN** the user scrolls the category list
- **THEN** the branding header remains pinned at the top of the left column
