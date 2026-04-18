# Spec: preview-panel

## Purpose

TBD — defines the right-column panel that displays the assembled markdown output in editor or rendered preview modes, with copy and export actions.

## Requirements

### Requirement: Preview panel header is sticky with view toggle and action buttons
The system SHALL render a sticky header at the top of the right column containing an Editor / Preview toggle and Copy and Export buttons.

#### Scenario: Header is always visible
- **WHEN** the user scrolls the preview content
- **THEN** the header with toggle and buttons remains pinned at the top of the right column

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

### Requirement: Copy button copies markdown to clipboard
The system SHALL copy the current `markdownOutput` string to the system clipboard when the user clicks Copy.

#### Scenario: Copy succeeds
- **WHEN** the user clicks the Copy button
- **THEN** `markdownOutput` is written to the clipboard and the button shows a brief success indicator (e.g., label changes to "Copied!")

### Requirement: Export button downloads the markdown as a .md file
The system SHALL trigger a browser file download of `markdownOutput` as `AGENTS.md` when the user clicks Export.

#### Scenario: Export triggers file download
- **WHEN** the user clicks the Export button
- **THEN** the browser initiates a download of a file named `AGENTS.md` containing the current `markdownOutput`

### Requirement: Switching views preserves scroll position within each view
The system SHALL maintain independent scroll positions for the Editor and Preview views so switching between them does not reset the user's reading position.

#### Scenario: Scroll position is preserved on view switch
- **WHEN** the user scrolls down in Editor view and then switches to Preview view and back
- **THEN** the Editor view restores to the same scroll position it was at before switching
