## MODIFIED Requirements

### Requirement: Editor view renders a CodeMirror 6 markdown editor
The system SHALL display a CodeMirror 6 editor instance when `activeView === "editor"`. The editor SHALL be initialised with the current `useDocumentStore` content and remain uncontrolled (not re-initialised on every render). `CodeEditorView` MUST NOT accept an `editorViewRef` prop — it SHALL call `useEditorContext().mount(container, content)` in its mount effect and `useEditorContext().destroy()` in its cleanup. `PreviewPanel` MUST NOT accept or forward an `editorViewRef` prop.

#### Scenario: Editor surface is displayed in Editor view
- **WHEN** the active view is "editor"
- **THEN** a CodeMirror editor is rendered and accepts user input

#### Scenario: Editor is initialised from the document store
- **WHEN** the EditorView mounts
- **THEN** the initial editor content equals the current `useDocumentStore` content value

#### Scenario: Editor displays empty state when no content exists
- **WHEN** `activeView === "editor"` and the document store content is empty
- **THEN** a placeholder message is displayed ("Select options from the left to start your AGENTS.md")

#### Scenario: Editor cleans up via context on unmount
- **WHEN** `CodeEditorView` unmounts
- **THEN** `useEditorContext().destroy()` is called, tearing down the CodeMirror instance
