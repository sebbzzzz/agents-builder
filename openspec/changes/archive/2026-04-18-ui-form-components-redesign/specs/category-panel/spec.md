## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Checklist area renders sub-categories from CATEGORIES data
**Reason**: Replaced by the floating options panel. Sub-categories are now rendered inside the floating panel component, not inline in the left column below the category list.
**Migration**: Remove `ChecklistArea.tsx` and its import/usage from the layout. Sub-category rendering moves to `FloatingOptionsPanel.tsx`.
