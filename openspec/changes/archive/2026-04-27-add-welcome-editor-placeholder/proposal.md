## Why

The editor currently opens empty with a small overlay hint, giving new users no context about what the tool does or how to start. A rich welcome message shown as real editor content sets expectations, communicates the tool's value, and makes the blank-canvas problem disappear.

## What Changes

- The document store initializes with `WELCOME_CONTENT` (a markdown string) instead of an empty string
- The welcome text is rendered as real CodeMirror editor content — not an overlay
- The welcome content clears automatically on first interaction: mousedown on the editor, or first "Add to document" action from the sidebar
- The existing visual overlay placeholder in `CodeEditorView` is removed
- A `WELCOME_CONTENT` constant is added to the shared constants file

## Capabilities

### New Capabilities

- `editor-welcome-content`: Displays a rich markdown welcome message as real editor content on first load; clears on first user interaction (mousedown or preset injection)

### Modified Capabilities

<!-- No existing spec-level requirements are changing -->

## Impact

- `app/_utils/constants.ts`: new `WELCOME_CONTENT` export
- `store/useDocumentStore.ts`: initial `content` changes from `""` to `WELCOME_CONTENT`
- `common/providers/EditorContext.tsx`: new `isWelcomeRef`, `clearWelcome()` helper, `mousedown` dom event handler, `updateListener` guard, `injectOption` updated to clear welcome before injecting
- `app/_components/preview/CodeEditorView.tsx`: visual overlay removed
