## ADDED Requirements

### Requirement: Editor welcome message types in on page load
The system SHALL animate the editor's initial `WELCOME_CONTENT` with a character-by-character typewriter effect on every page load. The title line SHALL type at ~120ms per character; after the title is complete, the remaining content SHALL appear instantly.

#### Scenario: Title types, rest snaps
- **WHEN** the page loads and CodeMirror mounts
- **THEN** `"# AGENTS.md Builder"` (20 chars) types in at 120ms/char (~2.4s total), followed by the full `WELCOME_CONTENT` appearing immediately

#### Scenario: Animation starts after brief mount delay
- **WHEN** `CodeEditorView` mounts
- **THEN** the typewriter starts after a 150ms delay to ensure CodeMirror is ready

#### Scenario: Animation runs once per page load
- **WHEN** the typewriter animation completes
- **THEN** it does not loop or restart

---

### Requirement: Typewriter does not trigger isDirty or autoSave
The system SHALL bypass the `updateListener` during typewriter dispatches so that `isDirty` and `scheduleAutoSave` are not called.

#### Scenario: No dirty flag during animation
- **WHEN** `replaceContent()` is called during typewriter steps
- **THEN** `isDirty` remains `false` and `scheduleAutoSave` is not called

---

### Requirement: Typewriter stops if user types during animation
The system SHALL stop the typewriter animation if the user types before it completes, leaving the editor in the `clearWelcome` state (`"# AGENTS.md"`).

#### Scenario: User types mid-animation
- **WHEN** the user presses a key while the typewriter is still running
- **THEN** `clearWelcome` fires, `isWelcomeRef` becomes `false`, and the typewriter detects this via `getIsWelcome()` and stops on its next step

---

### Requirement: DocumentStore is synced after animation completes
The system SHALL call `setContent(WELCOME_CONTENT)` after the typewriter finishes so that `PreviewPanel` and `PreviewHeader` reflect the correct content.

#### Scenario: Preview and export enabled after animation
- **WHEN** the typewriter completes and `setContent(WELCOME_CONTENT)` is called
- **THEN** the copy and export buttons in `PreviewHeader` become enabled
