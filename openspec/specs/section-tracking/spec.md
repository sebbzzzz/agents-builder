# Spec: section-tracking

## Purpose

TBD — defines how category section injections are mapped to document nodes, ensuring in-place updates, efficient offset computation, and stale-state reconciliation before injection.

## Requirements

### Requirement: Category section injection updates the matching node in-place
The system SHALL, when a category's selections change, find the node whose `id` matches the category ID and replace its content using a CodeMirror transaction, without modifying any other node.

#### Scenario: Existing section is updated in-place
- **WHEN** the user toggles an option in the "Patterns" category and a node with id `"patterns"` already exists
- **THEN** only that node's content is replaced in the editor; all other sections remain unchanged

#### Scenario: New section is appended when no matching node exists
- **WHEN** the user checks the first option in the "Patterns" category and no node with id `"patterns"` exists
- **THEN** a new node `{ id: "patterns", content: "## Patterns\n..." }` is appended to the node array and its markdown is appended at the end of the editor

### Requirement: Node positions are computed from the node array, not by full-text search
The system SHALL compute the character offset of a target node by summing the lengths of all preceding nodes plus their separators — O(n-nodes), not O(file-size).

#### Scenario: Offset is computed without scanning file text
- **WHEN** a section injection targets the node at index 3 in a 5-node document
- **THEN** the from/to offsets are derived by iterating over the first 3 nodes only

### Requirement: Stale node positions are reconciled before injection
The system SHALL, if `isDirty` is `true` when an injection is triggered, re-parse the current editor text into nodes before computing offsets, ensuring the offset calculation reflects the user's latest edits.

#### Scenario: Re-parse runs before injection when editor has unsaved edits
- **WHEN** the user has typed content since the last auto-save and then changes a category selection
- **THEN** the system re-parses the editor text into nodes before computing the injection offset

### Requirement: Heading-based re-parse maps sections to known category IDs
The system SHALL re-parse the editor text by splitting on lines that begin with `## `, matching each heading to a known category label. Unmatched text blocks SHALL be assigned `"free-{n}"` IDs.

#### Scenario: Known heading is matched to a category ID
- **WHEN** the editor contains the line `## Patterns`
- **THEN** that section is mapped to the node id `"patterns"` after re-parse

#### Scenario: Unrecognised content becomes a free node
- **WHEN** the editor contains text not preceded by any `## CategoryLabel` heading
- **THEN** that block is stored as a node with id `"free-0"` (or the next available index)

### Requirement: Section injection is dispatched as a single undoable CodeMirror transaction
The system SHALL dispatch all injection changes via `editorView.dispatch()` so they are recorded in CodeMirror's history and can be undone with Ctrl+Z / Cmd+Z.

#### Scenario: Injected section can be undone
- **WHEN** a category injection updates a section
- **THEN** pressing the undo shortcut reverts the injection
