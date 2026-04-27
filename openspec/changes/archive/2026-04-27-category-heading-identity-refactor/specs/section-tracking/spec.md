## MODIFIED Requirements

### Requirement: Section injection is dispatched as a single undoable CodeMirror transaction
All inject/remove operations SHALL be dispatched via `view.dispatch({ changes, annotations: [programmaticEdit.of(true)] })` targeting only the affected range. The system SHALL NOT replace the full document string. Each transaction SHALL be recorded in CodeMirror's history so that Cmd+Z / Ctrl+Z can revert it.

#### Scenario: Inserted option block can be undone
- **WHEN** a forward-sync transaction inserts an option block (with its hidden markers) and optionally a `### Sub-category` heading
- **THEN** pressing Cmd+Z / Ctrl+Z reverts the entire insertion in one step

#### Scenario: Removing a category section can be undone
- **WHEN** a forward-sync transaction removes a `## Heading` and its section
- **THEN** pressing Cmd+Z / Ctrl+Z restores the full section including all option blocks it contained

## REMOVED Requirements

### Requirement: Sections are identified by HTML comment anchors, not by heading text
**Reason:** Inverted by this change. Categories are now identified by their `## ${label}` heading text, not by anchor comments. The original requirement deliberately ignored heading renames; this change deliberately treats heading renames as a category-disable signal, per user requirement.
**Migration:** Use `parseHeadings(doc)` to locate sections by heading label. Renaming a heading is a deliberate disable signal handled by `useAppStore.syncEnabledFromHeadings`.

### Requirement: Nested fragment regions are supported within a preset region
**Reason:** No nested anchor regions remain. Sub-categories are represented by `### ${label}` heading lines that delimit option groups within a parent `## Heading` section. Option blocks are independently identifiable by `<!--opt:${id}-->` markers and do not require nested anchor parsing.
**Migration:** Use the heading parser to walk h2 → h3 → option markers. The `parentH2Index` field on each h3 entry from `parseHeadings` provides the equivalent nesting information.
