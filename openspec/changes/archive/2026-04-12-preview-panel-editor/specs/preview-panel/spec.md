## MODIFIED Requirements

### Requirement: Preview panel header view toggle shows "Editor" and "Preview" options
The system SHALL render a sticky header with a toggle containing two options: "Editor" and "Preview" (replacing the previous "Code" and "Preview" options).

#### Scenario: Toggle shows Editor and Preview options
- **WHEN** the preview panel header renders
- **THEN** two toggle options are visible: "Editor" and "Preview"

#### Scenario: Editor is the default active view
- **WHEN** the app first loads
- **THEN** the "Editor" option is active and the editor surface is displayed

### Requirement: Editor view renders a CodeMirror 6 markdown editor
The system SHALL display a CodeMirror 6 editor instance when `activeView === "editor"`. The editor SHALL be initialised with the assembled content of `useDocumentStore.nodes` and remain uncontrolled (not re-initialised on every render).

#### Scenario: Editor surface is displayed in Editor view
- **WHEN** the active view is "editor"
- **THEN** a CodeMirror editor is rendered and accepts user input

#### Scenario: Editor is initialised from the document node array
- **WHEN** the EditorView mounts
- **THEN** the initial editor content equals `nodes.map(n => n.content).join('\n\n')`

#### Scenario: Editor displays empty state when no nodes exist
- **WHEN** `activeView === "editor"` and the node array is empty
- **THEN** a placeholder message is displayed (e.g., "Select options from the left to start your AGENTS.md")

### Requirement: Preview view renders the assembled markdown as formatted HTML
The system SHALL render the assembled `nodes.map(n => n.content).join('\n\n')` using `react-markdown` when `activeView === "preview"`.

#### Scenario: Assembled markdown is rendered in Preview view
- **WHEN** the active view is "preview" and nodes are non-empty
- **THEN** the assembled markdown is rendered as formatted HTML

#### Scenario: Preview view shows an empty state when nodes are empty
- **WHEN** the active view is "preview" and the node array is empty
- **THEN** the placeholder message is displayed

## REMOVED Requirements

### Requirement: Code view renders raw markdown in a monospace editor-style area
**Reason**: The "Code" view is replaced by the "Editor" view backed by CodeMirror 6. A read-only `<pre>` display is no longer needed — the editor itself shows raw markdown and is fully editable.
**Migration**: Replace `CodeView` component with `EditorView`. Update all `activeView === "code"` comparisons to `activeView === "editor"`. The `activeView` type changes from `"code" | "preview"` to `"editor" | "preview"`.
