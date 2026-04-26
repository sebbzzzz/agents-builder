## MODIFIED Requirements

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
