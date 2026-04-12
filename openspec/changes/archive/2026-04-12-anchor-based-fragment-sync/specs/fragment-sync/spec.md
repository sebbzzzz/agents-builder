## ADDED Requirements

### Requirement: useFragmentSync watches selections and dispatches one transaction per changed item
The system SHALL subscribe to `useAppStore.selections`, diff current vs previous selections on each change, and for each added or removed option call the appropriate `fragmentApplicator` function and dispatch the resulting transaction to the CodeMirror editor.

#### Scenario: Enabling a category option triggers a preset insert
- **WHEN** the user checks the first option in the "Patterns" category
- **THEN** `useFragmentSync` calls `enablePreset("patterns", ...)` and dispatches the transaction

#### Scenario: Disabling all options in a category triggers a preset remove
- **WHEN** the user unchecks the last option in the "Patterns" category
- **THEN** `useFragmentSync` calls `disablePreset("patterns", ...)` and dispatches the transaction

#### Scenario: Changes to multiple categories in one render are all applied
- **WHEN** selections for two categories change simultaneously
- **THEN** a transaction is dispatched for each changed category independently

### Requirement: useFragmentSync replaces useSectionInjector with no change to EditorView's public API
The system SHALL export `useFragmentSync` with the same call signature as `useSectionInjector` (`editorViewRef: React.RefObject<EditorView | null>`), so `EditorView.tsx` requires only an import swap.

#### Scenario: EditorView wires the hook identically to before
- **WHEN** `EditorView.tsx` calls `useFragmentSync(editorViewRef)`
- **THEN** the hook subscribes to selections and the editor receives fragment transactions

### Requirement: useFragmentSync does not modify useDocumentStore
The system SHALL NOT call `setNodes`, `updateNode`, or `setIsDirty` from within `useFragmentSync`. Document store updates remain the sole responsibility of `useAutoSave`.

#### Scenario: Fragment insert does not trigger a store write
- **WHEN** `useFragmentSync` dispatches a fragment insertion transaction
- **THEN** `useDocumentStore.setNodes` is not called
