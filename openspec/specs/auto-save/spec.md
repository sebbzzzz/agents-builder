# Spec: auto-save

## Purpose

TBD — defines the debounced auto-save behaviour that persists editor content to the in-memory document store after a period of user inactivity, without triggering React re-renders or writing to browser storage.

## Requirements

### Requirement: Auto-save fires once after 5 seconds of user inactivity
The system SHALL start a 5 000 ms timer on every CodeMirror document change. If no further change occurs before the timer fires, it saves the document to `useDocumentStore`. If another change occurs before the timer fires, the previous timer is cancelled and a new 5 000 ms timer starts.

#### Scenario: Save fires after 5 s of inactivity
- **WHEN** the user stops typing for 5 seconds
- **THEN** the current editor content is parsed into nodes and written to `useDocumentStore` via `setNodes`

#### Scenario: Save does not fire while the user is still typing
- **WHEN** the user types a character within 5 s of the previous character
- **THEN** the previous timer is cancelled and no save occurs until a new 5 s idle period completes

#### Scenario: Save fires at most once per idle period
- **WHEN** the auto-save timer fires and the document is written to the store
- **THEN** the timer is not restarted until the user makes the next edit

### Requirement: Auto-save persists to the in-memory document store only
The system SHALL write document state to `useDocumentStore.nodes` via `setNodes`. It SHALL NOT write to `localStorage`, `sessionStorage`, or any external service.

#### Scenario: Auto-save updates the Zustand store
- **WHEN** the auto-save timer fires
- **THEN** `useDocumentStore.setNodes` is called with the re-parsed node array

#### Scenario: No browser storage is written
- **WHEN** the auto-save timer fires
- **THEN** `localStorage.setItem` and `sessionStorage.setItem` are not called

### Requirement: Auto-save is implemented with a useRef timer to avoid React re-renders
The system SHALL track the debounce timer in a `useRef` (not `useState`) inside `useAutoSave`, so that resetting the timer does not trigger a component re-render.

#### Scenario: Timer reset does not cause a re-render
- **WHEN** the user types and the debounce timer is reset
- **THEN** no React component re-renders as a result of the timer state change

### Requirement: Auto-save timer is cleared on component unmount
The system SHALL call `clearTimeout` on the pending timer when the component that owns `useAutoSave` unmounts, to prevent saving to a disposed store.

#### Scenario: Pending timer is cleared on unmount
- **WHEN** the EditorView component is unmounted while a 5 s timer is pending
- **THEN** `clearTimeout` is called and `setNodes` is not invoked after unmount
