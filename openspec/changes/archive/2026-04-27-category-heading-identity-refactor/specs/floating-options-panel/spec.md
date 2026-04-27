## ADDED Requirements

### Requirement: Sub-categories render as labeled groups without an enable switch
The floating options panel SHALL render each sub-category as a static label (the sub-category's `label`) followed by its option controls. The panel SHALL NOT render a switch, checkbox, or any other affordance that toggles a sub-category as a whole.

#### Scenario: Tech Stack panel shows three labeled groups
- **WHEN** the user opens the floating panel for "Tech Stack"
- **THEN** the panel renders sub-category labels "Project Type", "Language", "Frontend Framework" (subject to `visibleWhen` filters), each followed by their options, with no per-sub-category switch

#### Scenario: Selecting an option does not require enabling the sub-category first
- **WHEN** the user clicks an option control inside a sub-category group
- **THEN** the option becomes selected immediately via `toggleSelection` or `setSelection`, with no intermediate enable step

### Requirement: Option controls are bound to the new selection actions
Each option control SHALL be wired to the appropriate store action based on its sub-category type:
- `multi` sub-categories use `toggleSelection(categoryId, optionId)` on click
- `select` sub-categories use `setSelection(categoryId, subCategoryId, optionId)` on click
- `input` sub-categories continue to use whatever input handler is already established (out of scope for this change beyond preserving working behavior)

#### Scenario: Multi-option click toggles selection
- **WHEN** the user clicks the "TypeScript" checkbox in the "Language" sub-category
- **THEN** `toggleSelection("tech-stack", "typescript")` is dispatched

#### Scenario: Select-option click replaces selection
- **WHEN** the user clicks "API / Backend Service" in the "Project Type" sub-category while "Web App" is selected
- **THEN** `setSelection("tech-stack", "project-type", "api-backend")` is dispatched and "Web App" is no longer selected

### Requirement: Selected state is derived from selections[categoryId]
Each option control SHALL render its checked / selected visual state based on whether `optionId` is included in `useAppStore.selections[categoryId]`. The panel SHALL NOT maintain local selection state.

#### Scenario: Reverse-sync deselection updates the panel
- **WHEN** the user manually deletes the `## Tech Stack` heading from the editor (which clears `selections["tech-stack"]` via reverse sync)
- **THEN** all option controls in the Tech Stack panel render as unselected on the next render

## REMOVED Requirements

### Requirement: Sub-category enable switch
**Reason:** Sub-categories are no longer independently enabled. They appear in the document only as a side effect of having selected options under them. This removes a state slice (`enabledSubCategories`) that the user found unnecessary, and simplifies the panel UI.
**Migration:** Remove the `Switch` component and `onEnabledChange` prop from sub-category rows. Drive selection visuals from `selections[categoryId]` directly. Update any consumers of the deleted `enabledSubCategories` map to either drop the dependency or compute "is this sub-category active" from `selections[categoryId]?.some(id => subCategory.options.find(o => o.id === id))`.
