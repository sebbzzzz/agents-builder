## Context

The CodeMirror editor instance is created inside `CodeEditorView` and exposed upward through a `useRef<EditorView>` allocated in `page.tsx`. That ref is threaded down two separate branches: one to `PreviewPanel → CodeEditorView` (which writes the ref on mount) and one to `FloatingOptionsPanel` (which reads the ref to inject content). The two consumers are siblings with no direct relationship, so the ref has to travel all the way to their common ancestor. Adding a second editor on a different page would repeat this entire pattern.

## Goals / Non-Goals

**Goals:**
- Replace ref prop-drilling with a React Context that owns the editor instance privately
- Expose editor operations (mount, destroy, injectOption) as stable callbacks on the context value
- Make `FloatingOptionsPanel` and `CodeEditorView` independent of each other — neither needs to know about the other
- Support future pages each mounting their own isolated editor by wrapping with their own `<EditorProvider>`

**Non-Goals:**
- Exposing the raw `EditorView` reference outside the Provider — consumers call operations, not the view directly
- Merging into the existing Zustand stores — the editor handle is imperative and not serializable state
- Supporting multiple editors on the same page simultaneously

## Decisions

### 1. React Context over module singleton

**Decision**: Use `React.createContext` + a Provider component.

**Rationale**: A module-level singleton lives for the lifetime of the JS module, shared across all pages. With client-side navigation in Next.js, navigating away from a page doesn't unload modules — the singleton persists. Two pages would fight over one `_view` variable. React Context is scoped to the component tree: the Provider mounts and unmounts with the page, and React's lifecycle guarantees the cleanup order is correct.

**Alternative considered**: Module singleton with explicit `init`/`destroy` calls. Rejected because cleanup ordering is manual and error-prone; a race between destroy and the next page's init could corrupt state.

### 2. viewRef stays private to the Provider

**Decision**: The context value exposes named operation callbacks (`mount`, `destroy`, `injectOption`), not the raw `EditorView` reference.

**Rationale**: Consumers should express *intent* (inject this content) rather than reaching for the imperative handle directly. This keeps the abstraction boundary clean and makes future changes to the underlying editor library transparent to consumers.

### 3. injectOption logic moves into the Provider

**Decision**: The logic from `app/_utils/injectOption.ts` is absorbed into the Provider as a `useCallback`. `parseHeadings` stays as a pure utility.

**Rationale**: `injectOption` only makes sense in the context of an active editor view. Keeping it as a standalone utility that accepts a `view` argument just pushes the responsibility of obtaining the view to the caller. Inside the Provider, it closes over `viewRef` naturally.

### 4. Provider placement at page level

**Decision**: `<EditorProvider>` wraps the content area in `page.tsx` — inside the layout flex container, wrapping both the aside and main columns.

**Rationale**: Both `FloatingOptionsPanel` (in aside) and `CodeEditorView` (in main) need access. The Provider must be an ancestor of both. `page.tsx` is the lowest common ancestor, so it's the right place.

## Risks / Trade-offs

- **Context value re-renders**: If the context value object is recreated on every render, all consumers re-render. Mitigation: wrap all callbacks in `useCallback` with stable deps; wrap the value object in `useMemo`.
- **Mount timing**: `CodeEditorView` must call `mount(container)` inside a `useEffect` (after DOM paint). If for any reason the container ref isn't ready, mount will receive null. Mitigation: guard with `if (!container) return` inside mount.
- **SSR**: The Provider uses `useRef` and `useCallback` — all client-only. It must be a `"use client"` file. Since it's only imported from `"use client"` components this is fine, but worth documenting.
