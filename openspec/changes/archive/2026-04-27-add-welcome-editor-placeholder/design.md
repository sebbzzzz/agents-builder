## Context

The editor is powered by CodeMirror and is intentionally uncontrolled after mount — state is not synced back to the store on every keystroke; only auto-save (3s debounce) writes to the store. The document store initializes with an empty string. A visual overlay in `CodeEditorView` compensated for this by showing a hint when content was empty.

The welcome content must live inside CodeMirror (real doc text), not as a React overlay, so it feels like a real document the user can read before editing.

## Goals / Non-Goals

**Goals:**
- Show a rich markdown welcome message as real editor content on first load
- Clear the welcome content on first user interaction (mousedown or sidebar inject)
- Prevent the welcome content from being treated as a real user edit (no dirty flag, no auto-save)

**Non-Goals:**
- Persisting whether the user has seen the welcome (no localStorage flag)
- Animating the transition
- Showing the welcome again after a page reload if the user has already edited

## Decisions

### `isWelcomeRef` in EditorContext, not a store field

**Decision**: Track welcome state as a `useRef` inside `EditorProvider`, not as `isWelcome: boolean` in `useDocumentStore`.

**Rationale**: Nothing outside the editor needs to react to this flag. A ref avoids store pollution, causes zero re-renders, and sidesteps stale closure issues in CodeMirror callbacks. The store's `content` field already encodes the state implicitly (equals `WELCOME_CONTENT` on load, becomes `""` after first interaction).

**Alternative considered**: Store flag — would require adding `isWelcome` + `setIsWelcome` to `DocumentStore` and threading it through `EditorContext`. Over-engineered for a purely editor-internal concern.

### `mousedown` as the clear trigger (not `focus` or `keydown`)

**Decision**: Use `EditorView.domEventHandlers({ mousedown })` to clear the welcome.

**Rationale**: `mousedown` fires before the cursor is placed, giving an immediate visual response. `focus` would also fire when the user tabs into the editor without intent to edit. `keydown` (first real edit) would require handling the race condition between the dispatch and the character being typed.

**Alternative considered**: `docChanged` as the sole trigger — would insert the typed character into the welcome text before clearing, requiring extracting and re-inserting the typed content. Messy.

### `updateListener` guard swallows the clear dispatch

**Decision**: In the `updateListener`, if `isWelcomeRef.current` is true when `docChanged` fires, set it to false and return early (skip `setIsDirty` and `scheduleAutoSave`).

**Rationale**: The `mousedown` clear dispatches a doc change that would otherwise mark the document dirty and schedule an auto-save of `""`. The guard prevents this, keeping the cleared-empty state clean.

### `injectOption` calls `clearWelcome` before parsing headings

**Decision**: `injectOption` calls `clearWelcome(view)` as its first action.

**Rationale**: The welcome text contains an `h1` heading (`# AGENTS.md Builder`) and a thematic break (`---`). If `parseHeadings` runs against the welcome text, the heading structure would confuse section injection. Clearing first ensures inject always operates on a clean (empty) document.

## Risks / Trade-offs

- **Hard reload restores welcome**: If the user reloads the page without having auto-saved real content, `useDocumentStore` reinitializes with `WELCOME_CONTENT`. This is intentional — no persistence layer exists yet.
- **`mousedown` clears on accidental click**: A user who clicks the editor to read, not edit, will lose the welcome text. Accepted trade-off; the welcome text is decorative, not critical content.

## Migration Plan

No migration needed. The change is additive: `WELCOME_CONTENT` replaces `""` as the initial store value. The visual overlay is removed in the same PR.
