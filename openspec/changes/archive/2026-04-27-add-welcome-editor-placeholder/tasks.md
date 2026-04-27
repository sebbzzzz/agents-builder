## 1. Constants

- [x] 1.1 Add `WELCOME_CONTENT` markdown string to `app/_utils/constants.ts`

## 2. Store

- [x] 2.1 Update `useDocumentStore` initial `content` from `""` to `WELCOME_CONTENT`

## 3. Editor Context

- [x] 3.1 Add `isWelcomeRef` to `EditorProvider` and set it in `mount()` by comparing content to `WELCOME_CONTENT`
- [x] 3.2 Add `clearWelcome(view)` helper that dispatches a full-doc delete and sets `isWelcomeRef.current = false`
- [x] 3.3 Add `mousedown` handler via `EditorView.domEventHandlers` that calls `clearWelcome`
- [x] 3.4 Guard `updateListener` to return early (skip dirty + auto-save) when `isWelcomeRef.current` is true
- [x] 3.5 Call `clearWelcome(view)` at the top of `injectOption` before parsing headings

## 4. CodeEditorView

- [x] 4.1 Remove the visual overlay div (pointer-events-none placeholder) from `CodeEditorView`
- [x] 4.2 Remove unused `PLACEHOLDER` constant and `useDocumentStore` content subscription from `CodeEditorView`
