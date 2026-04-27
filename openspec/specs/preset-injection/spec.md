# Spec: Preset Injection

## Purpose

Defines how preset option content is injected into the editor from the category panel, and how the category panel behaves as a one-way launcher without tracking injected state.

## Requirements

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

### Requirement: panel-as-launcher
The category panel SHALL operate as a one-way preset launcher. It MUST NOT track which options have been injected, and MUST NOT attempt to remove or modify previously injected content.

**Scenarios:**
- Given the user clicks `[+]` on the same option twice, then the prompt appears twice in the editor. The panel does not prevent or warn about duplicate injection.
- Given the user has injected content and manually edited it in the editor, the panel has no knowledge of or effect on that content.

### Requirement: sidebar-opens-panel
Clicking a category in the left sidebar SHALL open that category's option panel. There MUST NOT be an enable/disable toggle on category items.

**Scenarios:**
- Given the user clicks "Tech Stack" in the sidebar, then the Tech Stack panel opens.
- Given the panel is open and the user clicks a different category, then the panel switches to that category.
