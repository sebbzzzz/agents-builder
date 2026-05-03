# Spec: editor-welcome-content

## Purpose

Defines behaviour for the welcome placeholder content shown in the editor on first load — what it displays, when it clears, and how clearing interacts with dirty-state tracking and preset injection.

## Requirements

### Requirement: Welcome content shown on first load
On initial load, the editor SHALL display a rich markdown welcome message as real CodeMirror document content. The welcome text SHALL explain the tool's purpose and include a credit line. It SHALL NOT be rendered as a visual overlay.

#### Scenario: Fresh load shows welcome text
- **WHEN** the application loads with no previously saved content
- **THEN** the editor displays the `WELCOME_CONTENT` markdown string as editable text

#### Scenario: No visual overlay when welcome is shown
- **WHEN** the welcome content is active
- **THEN** there is no pointer-events-none overlay div rendered on top of the editor

### Requirement: Welcome content clears on mousedown
The editor SHALL clear the welcome content when the user presses the mouse button inside the editor area.

#### Scenario: Click clears welcome immediately
- **WHEN** the user presses the mouse button anywhere in the editor
- **THEN** the editor content becomes empty instantly, before the cursor is placed

#### Scenario: Second mousedown does nothing
- **WHEN** the welcome has already been cleared and the user clicks again
- **THEN** the editor content is not affected

### Requirement: Welcome content clears before preset injection
The editor SHALL clear the welcome content before injecting any preset from the sidebar.

#### Scenario: Inject on welcome state clears first
- **WHEN** the welcome content is active and the user clicks "Add to document"
- **THEN** the editor content is cleared before the preset text is injected

#### Scenario: Inject on empty editor works normally
- **WHEN** the welcome has already been cleared and the user clicks "Add to document"
- **THEN** the preset is injected without any clearing step

### Requirement: Welcome clear does not dirty the document
Clearing the welcome content SHALL NOT set `isDirty` to true or schedule an auto-save.

#### Scenario: mousedown clear does not trigger auto-save
- **WHEN** the user clicks the editor and the welcome is cleared
- **THEN** `isDirty` remains false and no auto-save timer is started

#### Scenario: First real edit after clear triggers dirty
- **WHEN** the user types a character after the welcome has been cleared
- **THEN** `isDirty` becomes true and auto-save is scheduled
