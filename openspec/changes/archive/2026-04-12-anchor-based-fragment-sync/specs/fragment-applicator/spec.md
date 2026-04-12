## ADDED Requirements

### Requirement: Enabling a preset inserts its anchor block if not already present
The system SHALL insert `<!-- preset:start {id} -->\n{defaultContent}\n<!-- preset:end {id} -->` at the end of the document when a preset is enabled and no anchor region with that id exists. If the region already exists, the system SHALL do nothing.

#### Scenario: Preset is inserted at end of document on first enable
- **WHEN** a preset with id `"patterns"` is enabled and no `"patterns"` anchor exists
- **THEN** the preset block is appended to the end of the document

#### Scenario: Enable is a no-op when anchor already exists
- **WHEN** a preset with id `"patterns"` is enabled and a `"patterns"` anchor already exists
- **THEN** no change is dispatched to the editor

### Requirement: Disabling a preset removes its entire anchor block including all nested fragments
The system SHALL remove from `region.from` to `region.to` (inclusive of both anchor lines and all content between them) when a preset is disabled. If no region exists, the system SHALL do nothing.

#### Scenario: Preset block is fully removed on disable
- **WHEN** a preset with id `"patterns"` is disabled and its anchor region exists
- **THEN** the entire block from start-anchor to end-anchor (inclusive) is deleted from the document

#### Scenario: Disable is a no-op when anchor does not exist
- **WHEN** a preset with id `"patterns"` is disabled but no anchor region exists
- **THEN** no change is dispatched

### Requirement: Enabling a fragment inserts it inside its parent preset in schema order
The system SHALL insert a fragment anchor block inside the parent preset region, positioned after the last already-present sibling whose schema index is lower, or at `contentFrom` of the parent if no such sibling exists.

#### Scenario: Fragment is inserted after lower-indexed sibling
- **WHEN** fragment `"pattern.mvp"` (index 0) exists and `"pattern.server-components"` (index 1) is enabled
- **THEN** `"pattern.server-components"` block is inserted after `<!-- preset:end pattern.mvp -->`

#### Scenario: Fragment is inserted at start of parent when no preceding sibling exists
- **WHEN** no other fragments are present and `"pattern.mvp"` is enabled
- **THEN** `"pattern.mvp"` block is inserted immediately after `<!-- preset:start pattern -->`

#### Scenario: Fragment enable auto-enables missing parent preset
- **WHEN** `"pattern.mvp"` is enabled but no `"pattern"` anchor exists
- **THEN** the parent `"pattern"` preset block is created first, then `"pattern.mvp"` is inserted inside it

### Requirement: Disabling a fragment removes only its anchor block, leaving siblings untouched
The system SHALL remove from the fragment region's `from` to `to` only. Sibling fragments within the same parent SHALL remain unchanged.

#### Scenario: Only the targeted fragment is removed
- **WHEN** `"pattern.mvp"` is disabled and `"pattern.server-components"` also exists inside `"pattern"`
- **THEN** only the `"pattern.mvp"` block is deleted; `"pattern.server-components"` is unchanged

### Requirement: All edits are dispatched as targeted CodeMirror transactions
The system SHALL apply all changes via `view.dispatch({ changes: { from, to, insert } })`. The system SHALL NOT replace the entire document string.

#### Scenario: Transaction targets only the changed range
- **WHEN** a fragment is inserted
- **THEN** the dispatch changes object specifies a `from` and `to` within the document, not `from: 0, to: doc.length`

### Requirement: Broken or missing anchors are repaired on next toggle
The system SHALL, when a toggle is triggered for an id whose anchor is missing (e.g. user deleted it), recreate the anchor block at the fallback position without duplicating existing content.

#### Scenario: Missing parent anchor is recreated when child is toggled
- **WHEN** the user deleted `<!-- preset:start pattern -->` but `"pattern.mvp"` anchor still exists
- **THEN** enabling `"pattern"` recreates the parent block wrapping the existing `"pattern.mvp"` block

#### Scenario: Missing fragment anchor is recreated at correct position
- **WHEN** `"pattern.mvp"` anchor was deleted but its checkbox is still enabled
- **THEN** the next toggle of any sibling recreates `"pattern.mvp"` in schema order
