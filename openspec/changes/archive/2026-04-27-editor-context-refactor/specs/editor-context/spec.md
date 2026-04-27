## ADDED Requirements

### Requirement: EditorProvider owns the CodeMirror instance
The system SHALL provide an `EditorProvider` React component that privately holds the CodeMirror `EditorView` instance and exposes editor operations to descendant components via React Context. The raw editor reference MUST NOT be exposed on the context value.

#### Scenario: Provider mounts with no editor yet
- **WHEN** `EditorProvider` renders before any child calls mount
- **THEN** the internal viewRef is null and no CodeMirror instance exists

#### Scenario: Provider is scoped per page tree
- **WHEN** a page wraps its content in `<EditorProvider>`
- **THEN** the editor instance is isolated to that tree and destroyed when the Provider unmounts

### Requirement: useEditorContext hook provides access to editor operations
The system SHALL export a `useEditorContext()` hook that returns the context value. It MUST throw a descriptive error if called outside an `EditorProvider`.

#### Scenario: Hook is called inside a Provider
- **WHEN** a component inside `EditorProvider` calls `useEditorContext()`
- **THEN** it receives the context value with stable operation callbacks

#### Scenario: Hook is called outside a Provider
- **WHEN** a component outside any `EditorProvider` calls `useEditorContext()`
- **THEN** an error is thrown: "useEditorContext must be used within an EditorProvider"

### Requirement: mount operation initialises the CodeMirror editor
The context SHALL expose a `mount(container: HTMLElement, content: string): void` callback. Calling it SHALL create a new CodeMirror `EditorView` attached to the given container with the provided initial content.

#### Scenario: mount creates the editor instance
- **WHEN** a component calls `mount(containerEl, initialContent)`
- **THEN** a CodeMirror editor is created inside `containerEl` and the internal viewRef is set

#### Scenario: mount is a no-op if container is null
- **WHEN** `mount` is called with a null or undefined container
- **THEN** no editor is created and no error is thrown

### Requirement: destroy operation tears down the CodeMirror editor
The context SHALL expose a `destroy(): void` callback. Calling it SHALL destroy the active `EditorView` and clear the internal viewRef.

#### Scenario: destroy cleans up the editor
- **WHEN** a component calls `destroy()`
- **THEN** the CodeMirror instance is destroyed and the internal viewRef becomes null

### Requirement: injectOption operation inserts preset content into the editor
The context SHALL expose an `injectOption(categoryLabel: string, prompt: string): void` callback. Its behavior SHALL match the existing inject logic: append to an existing `## <categoryLabel>` section or create the section at end of document if absent.

#### Scenario: injectOption appends to an existing section
- **WHEN** `injectOption("Tech Stack", "Use TypeScript.")` is called and `## Tech Stack` exists in the document
- **THEN** "Use TypeScript." is appended within the Tech Stack section, before the next `##` heading or EOF

#### Scenario: injectOption creates a new section
- **WHEN** `injectOption("Tech Stack", "Use TypeScript.")` is called and `## Tech Stack` does not exist
- **THEN** `\n\n## Tech Stack\n\nUse TypeScript.` is appended at end of document

#### Scenario: injectOption is a no-op when no editor is mounted
- **WHEN** `injectOption` is called before any editor has been mounted
- **THEN** no error is thrown and no document change occurs
