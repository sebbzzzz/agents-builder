## MODIFIED Requirements

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
