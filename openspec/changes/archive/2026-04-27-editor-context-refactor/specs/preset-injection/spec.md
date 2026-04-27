## MODIFIED Requirements

### Requirement: option-inject
Users SHALL be able to inject an option's preset text into the editor by selecting options in the floating panel and clicking "Add to document". The inject operation SHALL be triggered via `useEditorContext().injectOption(...)` — `FloatingOptionsPanel` MUST NOT receive an `editorViewRef` prop.

#### Scenario: Inject appends to existing section
- **WHEN** the category section `## Tech Stack` exists in the editor and the user clicks "Add to document" with TypeScript selected
- **THEN** the TypeScript prompt is appended at the end of the `## Tech Stack` section, before the next `##` heading or EOF

#### Scenario: Inject creates missing section
- **WHEN** the category section `## Tech Stack` does not exist and the user clicks "Add to document"
- **THEN** `## Tech Stack` is created at the end of the document and the option prompt is appended immediately after

#### Scenario: Inject appends after existing custom content
- **WHEN** the user has already injected TypeScript and added custom text after it, and then injects JavaScript
- **THEN** JavaScript is appended after all existing content in the section
