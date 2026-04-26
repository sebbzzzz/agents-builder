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
The system SHALL render the assembled `nodes.map(n => n.content).join('\n\n')` using `react-markdown` when `activeView === "preview"`. The rendered output SHALL be wrapped in a container with the `.markdown-body` class that applies GitHub-flavored visual hierarchy: sized headings (h1–h6), styled inline code, fenced code blocks with a distinct background, blockquotes with a left border, bordered tables, indented lists, styled horizontal rules, and colored links. All styles SHALL use the app's existing CSS custom property tokens to stay consistent with the dark theme.

#### Scenario: Assembled markdown is rendered in Preview view
- **WHEN** the active view is "preview" and nodes are non-empty
- **THEN** the assembled markdown is rendered as formatted HTML inside a `.markdown-body` container

#### Scenario: Headings have distinct sizes and weights
- **WHEN** the markdown contains h1 through h6 headings
- **THEN** each heading level renders with a visually distinct font size and font weight, with h1 largest and h6 smallest

#### Scenario: Inline code has a background highlight
- **WHEN** the markdown contains backtick-wrapped inline code
- **THEN** the code renders with a visible background color distinct from the surrounding text

#### Scenario: Fenced code blocks have a background and monospace font
- **WHEN** the markdown contains a fenced code block (triple backticks)
- **THEN** the block renders with a monospace font, a distinct background, horizontal scrolling for long lines, and padding

#### Scenario: Blockquotes have a left border accent
- **WHEN** the markdown contains a blockquote (> prefix)
- **THEN** the blockquote renders with a colored left border and muted text color

#### Scenario: Tables render with visible borders
- **WHEN** the markdown contains a GFM table
- **THEN** the table renders with borders on all cells and alternating or distinct header styling

#### Scenario: Links are colored and distinguishable
- **WHEN** the markdown contains hyperlinks
- **THEN** links render in the app's accent color and are visually distinct from surrounding text

#### Scenario: Preview view shows an empty state when nodes are empty
- **WHEN** the active view is "preview" and the node array is empty
- **THEN** the placeholder message is displayed

#### Scenario: Horizontal rules render visibly
- **WHEN** the markdown contains a horizontal rule (--- or ***)
- **THEN** it renders as a visible dividing line spanning the content width

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
