## MODIFIED Requirements

### Requirement: useFragmentSync watches selections and dispatches one transaction per changed item
The system SHALL subscribe to `useAppStore.selections` and `useAppStore.enabledCategories`, diff current vs previous values on each change, and for each delta dispatch a CodeMirror transaction whose `changes` come from the heading-identity-sync patch helpers (`insertCategorySection`, `removeCategorySection`, `insertOptionBlock`, `removeOptionBlock`). Each dispatched transaction SHALL be tagged with the `programmaticEdit` `Annotation`.

#### Scenario: Enabling a category dispatches a section-insert transaction
- **WHEN** the user toggles "Tech Stack" on
- **THEN** `useFragmentSync` calls `insertCategorySection(doc, techStackCategory)` and dispatches the resulting `ChangeSpec` annotated with `programmaticEdit`

#### Scenario: Selecting the first option in a sub-category creates the sub-heading and the option block
- **WHEN** no options are selected under "Language" and the user selects "TypeScript"
- **THEN** the dispatched transaction inserts both `### Language` and the `<!--opt:typescript-->...<!--/opt-->` block in a single change

#### Scenario: Deselecting the last option under a sub-category removes the sub-heading too
- **WHEN** the only selected option under "Language" is "TypeScript" and the user deselects it
- **THEN** the dispatched transaction removes the option block AND the now-empty `### Language` line

#### Scenario: Changes to multiple categories in one render are all applied
- **WHEN** selections for two categories change simultaneously
- **THEN** a transaction is dispatched for each changed category independently, all annotated with `programmaticEdit`

### Requirement: useFragmentSync replaces useSectionInjector with no change to EditorView's public API
The system SHALL export `useFragmentSync` with the call signature `(editorViewRef: React.RefObject<EditorView | null>) => void` so that `CodeEditorView.tsx` requires only an import to wire it up.

#### Scenario: CodeEditorView wires the hook identically to before
- **WHEN** `CodeEditorView.tsx` calls `useFragmentSync(editorViewRef)`
- **THEN** the hook subscribes to selections + enabledCategories and the editor receives forward-sync transactions

### Requirement: useFragmentSync does not modify useDocumentStore
The system SHALL NOT call `setContent` or `setIsDirty` on `useDocumentStore` from within `useFragmentSync`. Document store updates remain the sole responsibility of `useAutoSave`.

#### Scenario: Forward-sync insert does not trigger a store write
- **WHEN** `useFragmentSync` dispatches a section insertion transaction
- **THEN** `useDocumentStore.setContent` is not called as a direct effect of the hook

## ADDED Requirements

### Requirement: useFragmentSync no longer imports anchor-parser or fragment-applicator symbols
The hook SHALL NOT import `parseAnchors`, `enablePreset`, `disablePreset`, `enableFragment`, or `disableFragment`. Those symbols and the modules that exported them are removed in this change.

#### Scenario: Type check passes after removal
- **WHEN** the project is type-checked after this change
- **THEN** no import resolution errors arise from `useFragmentSync` or its consumers
