## ADDED Requirements

### Requirement: Categories are identified by their `## ${label}` heading text
The system SHALL treat the presence of a line matching `^## ${category.label}$` (after trimming) at the top level of the document (not inside a fenced code block) as the authoritative signal that the category is enabled. The system SHALL NOT use HTML comment anchors for category identity.

#### Scenario: Heading presence enables a category in the store
- **WHEN** the document contains a line `## Tech Stack` and `useAppStore.syncEnabledFromHeadings` is invoked with the parsed heading set
- **THEN** `enabledCategories` includes `"tech-stack"` after the call

#### Scenario: Heading inside a fenced code block is ignored
- **WHEN** the document contains a line `## Tech Stack` inside a triple-backtick code fence
- **THEN** `parseHeadings` does NOT include it and the category is not considered enabled

#### Scenario: Renaming the heading disables the category
- **WHEN** the user manually changes `## Tech Stack` to `## My Stack` in the editor
- **THEN** the next reverse-sync pass calls `syncEnabledFromHeadings` with `"Tech Stack"` absent from the set, and `enabledCategories` no longer includes `"tech-stack"`

### Requirement: Sub-categories are identified by their `### ${label}` heading and only present when non-empty
The system SHALL emit a `### ${subCategory.label}` line as the first content of a sub-category section only when at least one option in that sub-category is selected. The system SHALL remove the `### ${subCategory.label}` line when the last option in that sub-category is deselected.

#### Scenario: Sub-category heading appears with first selection
- **WHEN** no options in the "Language" sub-category are selected and the user selects "TypeScript"
- **THEN** the editor contains `### Language` immediately followed by the TypeScript option block, inside the parent `## Tech Stack` section

#### Scenario: Sub-category heading is removed with last deselection
- **WHEN** "TypeScript" is the only selected option under "Language" and the user deselects it
- **THEN** the `### Language` line is removed along with the option block

### Requirement: Option blocks are wrapped in hidden marker comments
The system SHALL wrap each inserted option's `prompt` text with `<!--opt:${optionId}-->` on the line above and `<!--/opt-->` on the line below. The option's `prompt` text SHALL appear verbatim between the markers.

#### Scenario: Option insertion produces marker-wrapped block
- **WHEN** the user selects an option with id `"typescript"` and prompt `"The project uses TypeScript..."`
- **THEN** the editor contains the lines `<!--opt:typescript-->`, `The project uses TypeScript...`, `<!--/opt-->` in that order

#### Scenario: Option removal targets the marker pair
- **WHEN** the user deselects an option with id `"typescript"` whose body has been edited by the user in the editor
- **THEN** the system removes the range from `<!--opt:typescript-->` through `<!--/opt-->` inclusive, regardless of the body content

### Requirement: Forward sync uses targeted CodeMirror ChangeSpec patches
The system SHALL implement each store action (toggling a category, toggling an option, setting a single-select option) as a pure function returning a CodeMirror `ChangeSpec` describing only the changed range. The system SHALL NOT replace the full document string.

#### Scenario: Toggling a single option dispatches one focused change
- **WHEN** the user selects "Python" while "TypeScript" is already inserted
- **THEN** the dispatched transaction's `changes` covers only the insertion point of the new option block, not the existing TypeScript block or the heading

#### Scenario: Patch helpers are pure
- **WHEN** any patch helper from `app/_utils/docPatches.ts` is invoked twice with identical inputs
- **THEN** it returns equivalent `ChangeSpec` values both times with no observable side effects

### Requirement: Programmatic dispatches are tagged so reverse sync ignores them
The system SHALL define a CodeMirror `Annotation` named `programmaticEdit` and tag every transaction produced by the forward-sync hook with it. The reverse-sync update listener SHALL skip any update where every transaction carries `programmaticEdit`.

#### Scenario: Forward sync does not retrigger reverse sync
- **WHEN** the user enables a category from the left sidebar
- **THEN** the resulting forward-sync transaction is annotated with `programmaticEdit` and the reverse-sync listener returns early without re-parsing or dispatching

#### Scenario: User typing still triggers reverse sync
- **WHEN** the user types into the editor
- **THEN** the resulting transaction is not annotated with `programmaticEdit` and the reverse-sync listener calls `syncEnabledFromHeadings`

### Requirement: parseHeadings returns top-level ATX heading metadata in a single linear scan
The system SHALL expose `parseHeadings(doc: Text): { h2: { label: string; from: number; to: number }[]; h3: { label: string; from: number; to: number; parentH2Index: number }[] }`. The function SHALL skip lines inside fenced code blocks (delimited by triple backticks at the start of a line) and SHALL only consider ATX headings (`## ` and `### ` prefix), not setext-style headings.

#### Scenario: Headings inside code fences are skipped
- **WHEN** the document contains a code fence containing `## Tech Stack`
- **THEN** that line is not present in the returned `h2` array

#### Scenario: Each heading entry includes accurate byte offsets
- **WHEN** `parseHeadings` returns `{ from, to }` for a heading line
- **THEN** `doc.sliceString(from, to)` exactly equals the heading line text (excluding any trailing newline)

### Requirement: Patch helpers cleanly handle missing structure
The system SHALL handle the case where the expected anchor (heading line, sub-category heading, or marker pair) is missing without throwing or corrupting unrelated content. Removal of a missing block SHALL be a no-op. Insertion when the parent heading is missing SHALL recreate the parent in declaration order.

#### Scenario: Removing an option whose markers were already deleted is a no-op
- **WHEN** the user manually deletes both `<!--opt:typescript-->` and `<!--/opt-->` from the editor and then deselects "TypeScript" in the panel
- **THEN** `removeOptionBlock` returns an empty `ChangeSpec` and no transaction is dispatched

#### Scenario: Inserting an option recreates a missing category heading
- **WHEN** "Tech Stack" is enabled in the store but the `## Tech Stack` line was manually deleted, and the user selects a new option
- **THEN** the patch helper inserts both the missing `## Tech Stack` heading and the new option block in a single transaction
