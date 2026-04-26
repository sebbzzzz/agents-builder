## ADDED Requirements

### Requirement: Preview panel header is sticky with view toggle and action buttons
The system SHALL render a sticky header at the top of the right column containing a Code / Preview toggle and Copy and Export buttons.

#### Scenario: Header is always visible
- **WHEN** the user scrolls the preview content
- **THEN** the header with toggle and buttons remains pinned at the top of the right column

#### Scenario: Toggle shows two options
- **WHEN** the preview panel header renders
- **THEN** two toggle options are visible: "Code" and "Preview"

### Requirement: Code view renders raw markdown in a monospace editor-style area
The system SHALL display the current `markdownOutput` string from the Zustand store as plain text in a `<pre>` or code-editor-styled container when the active view is "code".

#### Scenario: Raw markdown is visible in Code view
- **WHEN** the active view is "code" and `markdownOutput` is non-empty
- **THEN** the raw markdown text is displayed verbatim in a monospace font

#### Scenario: Code view shows empty state when markdown is empty
- **WHEN** the active view is "code" and `markdownOutput` is an empty string
- **THEN** the panel displays a placeholder message (e.g., "Select options from the left to build your AGENTS.md")

### Requirement: Preview view renders markdown as formatted HTML
The system SHALL render `markdownOutput` as formatted HTML using `react-markdown` when the active view is "preview".

#### Scenario: Headings render as HTML heading elements
- **WHEN** the active view is "preview" and the markdown contains `## Section`
- **THEN** that text renders as an `<h2>` element with appropriate styling

#### Scenario: Preview view shows empty state when markdown is empty
- **WHEN** the active view is "preview" and `markdownOutput` is an empty string
- **THEN** the panel displays the same placeholder message as the code view

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
The system SHALL maintain independent scroll positions for the Code and Preview views so switching between them does not reset the user's reading position.

#### Scenario: Scroll position is preserved on view switch
- **WHEN** the user scrolls down in Code view and then switches to Preview view and back
- **THEN** the Code view restores to the same scroll position it was at before switching
