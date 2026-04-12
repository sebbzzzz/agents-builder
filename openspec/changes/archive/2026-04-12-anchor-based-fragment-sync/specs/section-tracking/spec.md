## REMOVED Requirements

### Requirement: Category section injection updates the matching node in-place
**Reason**: Replaced by anchor-based injection. Node array lookup is no longer the mechanism for locating sections; `parseAnchors` on the live document is used instead.
**Migration**: `useSectionInjector` is deleted. `useFragmentSync` + `fragmentApplicator` provide equivalent behavior via anchor regions.

### Requirement: Node positions are computed from the node array, not by full-text search
**Reason**: Node offset computation is replaced by `parseAnchors` which scans the live document for anchor markers. This is more reliable because it is always accurate regardless of unsaved edits.
**Migration**: `computeNodeOffsets.ts` is deleted. Call `parseAnchors(view.state.doc)` to get current region offsets.

### Requirement: Stale node positions are reconciled before injection
**Reason**: The stale-state problem is eliminated by design — anchor offsets are always read from the live document, never from a cached node array.
**Migration**: The `isDirty` reconciliation path in `useSectionInjector` is removed. No equivalent is needed.

### Requirement: Heading-based re-parse maps sections to known category IDs
**Reason**: Heading-based section detection is no longer used for injection. `useAutoSave` still uses `parseDocumentNodes` for persistence snapshots, but it is no longer the injection mechanism.
**Migration**: `parseDocumentNodes` is retained for `useAutoSave` only. Injection uses `parseAnchors`.

## MODIFIED Requirements

### Requirement: Section injection is dispatched as a single undoable CodeMirror transaction
All inject/remove operations SHALL be dispatched via `view.dispatch({ changes })` targeting only the affected anchor region. The system SHALL NOT replace the full document string. Each transaction SHALL be recorded in CodeMirror's history.

#### Scenario: Injected fragment can be undone
- **WHEN** a fragment insertion transaction is dispatched
- **THEN** pressing Cmd+Z / Ctrl+Z reverts only the inserted fragment block

#### Scenario: Removing a preset block can be undone
- **WHEN** a preset disable transaction is dispatched
- **THEN** pressing Cmd+Z / Ctrl+Z restores the full preset block including nested fragments

## ADDED Requirements

### Requirement: Sections are identified by HTML comment anchors, not by heading text
The system SHALL use `<!-- preset:start {id} -->` / `<!-- preset:end {id} -->` markers as the authoritative boundaries of each section. The section id SHALL match the category id (e.g. `"patterns"`).

#### Scenario: Section is found by anchor id, not heading text
- **WHEN** the user renames `## Patterns` to `## My Patterns` inside the anchor block
- **THEN** the section is still found by `parseAnchors` using the anchor id `"patterns"`

### Requirement: Nested fragment regions are supported within a preset region
The system SHALL support fragment anchor pairs (`pattern.mvp`) nested inside a parent preset anchor pair (`pattern`). Both SHALL be independently addressable by `parseAnchors`.

#### Scenario: Fragment and parent are independently addressable
- **WHEN** the document contains both `<!-- preset:start pattern -->` and `<!-- preset:start pattern.mvp -->` inside it
- **THEN** `parseAnchors` returns separate regions for `"pattern"` and `"pattern.mvp"`
