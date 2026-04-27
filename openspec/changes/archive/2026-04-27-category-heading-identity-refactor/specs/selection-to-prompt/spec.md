## MODIFIED Requirements

### Requirement: Selecting an option adds its prompt to the document
The system SHALL insert each selected option's `prompt` string into the editor document, wrapped in `<!--opt:${optionId}-->` and `<!--/opt-->` marker lines, when the user's selections change. The system SHALL remove the marker-wrapped block when the option is deselected.

#### Scenario: Prompt appears in the document after option is selected
- **WHEN** the user selects an option that has a `prompt` field
- **THEN** the option's `prompt` text appears in the editor document, sandwiched between its opt-marker comment lines, inside the appropriate `## Category` / `### Sub-category` section

#### Scenario: Prompt is removed after option is deselected
- **WHEN** the user deselects an option
- **THEN** the marker-wrapped block (markers + prompt body, or markers + user-edited body) is removed from the document

### Requirement: Prompts are grouped by category and sub-category in the document
The system SHALL emit prompts under their parent category's `## ${label}` heading, sub-grouped under their sub-category's `### ${label}` heading. Categories with no enabled state are absent from the document. Sub-categories with no selections are absent from their parent section.

#### Scenario: Category heading precedes its prompts
- **WHEN** the user has selections in the "Tech Stack" category
- **THEN** all "Tech Stack" prompts appear under the `## Tech Stack` heading in the document

#### Scenario: Sub-category headings group related prompts
- **WHEN** the user has selected one option in the "Language" sub-category and one in the "Frontend Framework" sub-category, both under "Tech Stack"
- **THEN** the document contains `### Language` followed by the language option block, then `### Frontend Framework` followed by the framework option block, all under the same `## Tech Stack` parent

#### Scenario: Empty sub-category heading is suppressed
- **WHEN** a sub-category has no selections
- **THEN** no `### ${label}` line for that sub-category appears in the document

### Requirement: `input` type value is used verbatim in the document
The system SHALL emit the raw text the user typed into an `input` sub-category field as the body of a marker-wrapped block, replacing the `{value}` placeholder in the option's `prompt` template.

#### Scenario: Typed value appears in document
- **WHEN** the user types `pnpm dev` into the "Dev server" input field
- **THEN** the document contains `<!--opt:cmd-dev-->`, `Start the development server: \`pnpm dev\``, `<!--/opt-->` in the appropriate section

#### Scenario: Empty input field produces no output
- **WHEN** the user has not typed anything into an `input` field
- **THEN** no marker-wrapped block for that field appears in the document

## REMOVED Requirements

### Requirement: `buildAgentsFile` is a pure function
**Reason:** There is no longer a single function that composes the entire markdown output from a selections object. The document is built incrementally by the forward-sync hook applying CodeMirror transactions, which preserves user edits. Replacing this with a single regenerator would defeat the edit-preservation requirement.
**Migration:** Rely on `useDocumentStore.content` as the canonical document source. If a side-channel needs a serialized markdown string (e.g., a hypothetical export-as-pure-markdown feature), pipe `useDocumentStore.content` through `stripMarkers` rather than re-deriving from selections.
