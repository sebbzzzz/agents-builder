# Spec: section-tracking

## Purpose

Defines how category section injections are located and applied in the editor using HTML comment anchors, ensuring targeted in-place updates via CodeMirror transactions.

## Requirements

### Requirement: Section injection is dispatched as a single undoable CodeMirror transaction
All inject/remove operations SHALL be dispatched via `view.dispatch({ changes })` targeting only the affected anchor region. The system SHALL NOT replace the full document string. Each transaction SHALL be recorded in CodeMirror's history.

#### Scenario: Injected fragment can be undone
- **WHEN** a fragment insertion transaction is dispatched
- **THEN** pressing Cmd+Z / Ctrl+Z reverts only the inserted fragment block

#### Scenario: Removing a preset block can be undone
- **WHEN** a preset disable transaction is dispatched
- **THEN** pressing Cmd+Z / Ctrl+Z restores the full preset block including nested fragments

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
