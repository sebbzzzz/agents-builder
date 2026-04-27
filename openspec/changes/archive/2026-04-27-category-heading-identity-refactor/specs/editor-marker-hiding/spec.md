## ADDED Requirements

### Requirement: A CodeMirror StateField hides opt-marker lines from the editor view
The system SHALL register a CodeMirror extension that scans the document on every state change and applies `Decoration.replace({ block: true })` to every line whose content is exactly `<!--opt:${id}-->` or `<!--/opt-->`. The decoration SHALL collapse the line to zero height in the rendered editor.

#### Scenario: Inserted markers do not appear visually in the editor
- **WHEN** the forward-sync hook dispatches a transaction inserting an option block surrounded by marker comments
- **THEN** the user sees the option's prompt text, but does not see the marker comment lines, and the cursor does not stop on them when navigating with arrow keys past the block

#### Scenario: Markers added by the user are also hidden
- **WHEN** the user manually pastes a `<!--opt:typescript-->` line into the editor
- **THEN** the line is also collapsed by the same decoration (the rule is text-based, not annotation-based)

### Requirement: The decoration extension is registered in the initial editor configuration
The system SHALL include the marker-hiding extension in the array passed to the initial `EditorState.create` call, NOT applied later via `view.dispatch({ effects: StateEffect.appendConfig.of(...) })`.

#### Scenario: First paint hides markers
- **WHEN** the editor mounts with a document that already contains marker comment lines
- **THEN** the very first render frame already has those lines collapsed, with no flicker of visible markers

### Requirement: Strip pass removes opt markers and legacy preset/fragment anchors from any exported text
The system SHALL expose a pure function `stripMarkers(text: string): string` that removes:
- every line matching `^<!--opt:[^>]*-->\s*$`
- every line matching `^<!--/opt-->\s*$`
- every line matching `^<!--\s*(preset|fragment):(start|end)\s+[^>]*-->\s*$` (legacy anchors)

The function SHALL preserve all other content including whitespace between paragraphs.

#### Scenario: Copy / export contains no markers
- **WHEN** the user clicks Copy in `PreviewHeader` on a document containing opt markers
- **THEN** the clipboard payload contains zero `<!--opt:` substrings and zero `<!--preset:` or `<!--fragment:` substrings

#### Scenario: Rendered preview contains no markers
- **WHEN** `RenderedView` renders the document via `react-markdown`
- **THEN** the rendered HTML contains no comment markers

#### Scenario: Legacy anchors from prior sessions are removed
- **WHEN** the document text contains both new opt markers AND legacy `<!--preset:start tech-stack-->` anchors from a previous version
- **THEN** `stripMarkers` removes all of them in a single pass
