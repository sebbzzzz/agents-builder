## MODIFIED Requirements

### Requirement: Store contains the required state slices
The Zustand store SHALL define the following slices with their initial values and setter actions:
- `activeCategory: string | null` (initial: `null`) — the currently selected category id
- `enabledCategories: string[]` (initial: `[]`) — categories whose `## Heading` is currently in the document
- `selections: Record<string, string[]>` (initial: `{}`) — selected option ids keyed by **category id** (not sub-category id)
- `activeView: 'editor' | 'preview'` (initial: `'editor'`) — which view the right panel shows

`markdownOutput`, `enabledSubCategories`, and `skillTriggers` SHALL NOT be present in the store. Document content lives exclusively in `useDocumentStore.content`.

#### Scenario: Initial state is correct on first load
- **WHEN** the app loads for the first time
- **THEN** `activeCategory` is `null`, `enabledCategories` is `[]`, `selections` is `{}`, and `activeView` is `'editor'`

#### Scenario: setActiveCategory updates the store
- **WHEN** `setActiveCategory("tech-stack")` is called
- **THEN** subsequent reads of `activeCategory` return `"tech-stack"`

#### Scenario: Selections are keyed by category, not sub-category
- **WHEN** the user selects two options from different sub-categories of the same category
- **THEN** both option ids appear in the same array at `selections[categoryId]`

## ADDED Requirements

### Requirement: toggleCategory clears selections when disabling
The `toggleCategory(categoryId)` action SHALL, when transitioning the category from enabled to disabled, also delete `selections[categoryId]` from the store in the same `set` call.

#### Scenario: Disabling Tech Stack drops Tech Stack selections
- **WHEN** the user toggles Tech Stack off while `selections["tech-stack"]` contains `["typescript", "nextjs"]`
- **THEN** after the action, `enabledCategories` does not include `"tech-stack"` and `selections["tech-stack"]` is undefined

### Requirement: toggleSelection adds or removes a single option id within a category
The `toggleSelection(categoryId, optionId)` action SHALL append `optionId` to `selections[categoryId]` if absent, or remove it if present, returning a new selections record (immutable update).

#### Scenario: Toggling an unselected option selects it
- **WHEN** `toggleSelection("tech-stack", "typescript")` is called and `"typescript"` is not in `selections["tech-stack"]`
- **THEN** after the action, `selections["tech-stack"]` contains `"typescript"`

#### Scenario: Toggling a selected option deselects it
- **WHEN** `toggleSelection("tech-stack", "typescript")` is called and `"typescript"` is already in `selections["tech-stack"]`
- **THEN** after the action, `selections["tech-stack"]` does not contain `"typescript"`

### Requirement: setSelection replaces the selection for a single-select sub-category
The `setSelection(categoryId, subCategoryId, optionId | null)` action SHALL, for sub-categories declared with `type: "select"`, replace any currently selected option in that sub-category with the new one (or clear it when `optionId` is `null`), without affecting selections from other sub-categories under the same category.

#### Scenario: Choosing a new project type replaces the previous one
- **WHEN** the user has selected `"web-app"` under sub-category `"project-type"` and then selects `"api-backend"`
- **THEN** `selections["tech-stack"]` no longer contains `"web-app"` but contains `"api-backend"`; selections from other sub-categories of "tech-stack" are unchanged

#### Scenario: Setting null clears a single-select sub-category
- **WHEN** `setSelection("tech-stack", "project-type", null)` is called
- **THEN** `selections["tech-stack"]` no longer contains any option that belongs to the `"project-type"` sub-category

### Requirement: syncEnabledFromHeadings reverse-syncs enabled categories from a label set
The `syncEnabledFromHeadings(presentLabels: Set<string>)` action SHALL remove from `enabledCategories` every category whose `label` is not in `presentLabels`, and clear `selections[id]` for each removed category. The action SHALL NOT add categories whose label is in `presentLabels` but were not previously enabled (additions are user actions, not derivations).

#### Scenario: Missing heading disables a category
- **WHEN** `enabledCategories` is `["tech-stack", "project-context"]` and `syncEnabledFromHeadings(new Set(["Project Context"]))` is called
- **THEN** `enabledCategories` is `["project-context"]` and `selections["tech-stack"]` is undefined

#### Scenario: Sync does not auto-enable on heading appearance
- **WHEN** `enabledCategories` is `[]` and `syncEnabledFromHeadings(new Set(["Tech Stack"]))` is called
- **THEN** `enabledCategories` remains `[]`

## REMOVED Requirements

### Requirement: Store contains markdownOutput and isDirty slices
**Reason:** Document content is now stored in `useDocumentStore.content`, not `useAppStore`. `isDirty` is a property of the document store. This requirement was already removed from the implementation; this delta updates the spec.
**Migration:** Read document content from `useDocumentStore((s) => s.content)`. Read dirty state from `useDocumentStore((s) => s.isDirty)`.
