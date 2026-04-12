## Context

The PreviewPanel currently renders `markdownOutput` from `useAppStore` as read-only text. The product requires inline editing and category selections to inject content into named sections of the file. There is no editor surface, no mutable document model, and no way to target a specific section for update.

Existing state lives in a single `useAppStore` (Zustand). Syncing every keystroke to that store would trigger re-renders across every subscriber, including the CategoryPanel.

## Goals / Non-Goals

**Goals:**
- Provide a real markdown editor (CodeMirror 6) for the "Editor" view
- Store the document as an array of typed nodes — no full-text search on every interaction
- Let category selections inject or update a named section in O(n-nodes), not O(file-size)
- Auto-save the node array to the document store once, 5 s after the user's last keystroke
- Support undo/redo within the editor (CodeMirror built-in)
- Isolate document state in a separate Zustand store so category-panel components never re-render on keystrokes

**Non-Goals:**
- Persistence to `localStorage` or any server (auto-save targets in-memory Zustand store only)
- Conflict resolution when a user manually renames a section heading
- Syntax highlighting beyond basic markdown

## Decisions

### D1 — Document model: node array as source of truth

```ts
interface DocumentNode {
  id: string      // category ID ("patterns") or "free-{n}" for user-typed blocks
  content: string // raw markdown for this node including its heading line
}
```

The assembled markdown is `nodes.map(n => n.content).join('\n\n')`.

**Why nodes over a flat string:**
- Category injection is O(n-nodes) — `nodes.find(n => n.id === categoryId)` where n ≤ ~20
- No string-scan of the entire file per interaction
- First-class objects are harder to accidentally corrupt than in-band text markers

**Node lifecycle:**
- Initial nodes: one per category that has at least one selection, plus one "free" node for any user text not preceded by a known heading
- On selection change: `updateNode(id, newContent)` → node is replaced in array, editor range is patched
- On auto-save: editor text is re-parsed into nodes (heading-based split), updating the array once

### D2 — Editor: CodeMirror 6, uncontrolled after init

The `EditorView` is instantiated once in `useEffect`, initialised from the assembled node content, and then treated as uncontrolled — React does not drive it on every render.

**Why uncontrolled:** Driving CodeMirror from React state on every keystroke adds a React render cycle per character, kills cursor stability, and defeats CodeMirror's internal optimisations.

**Undo/redo** is handled entirely by CodeMirror's built-in `history()` extension — no custom history stack is needed.

**Programmatic edits (injection)** use `editorView.dispatch(transaction)` directly, which inserts them into CodeMirror's own history so they are undoable.

### D3 — Section injection: compute node offset → dispatch transaction

When a category selection changes and the document needs to be updated:

```
1. Reconcile: if isDirty, re-parse current editor text into nodes first (cheap heading scan)
2. Find: nodes.find(n => n.id === categoryId)
3. Compute start offset = sum of (preceding nodes' content.length + 2) for '\n\n' separator
4. Compute end offset = start + node.content.length
5. Dispatch: editorView.dispatch({ changes: { from, to, insert: newContent } })
6. Update: nodes[i].content = newContent in useDocumentStore
```

If the node does not exist, append both to `nodes` and to the end of the editor.

The re-parse in step 1 only runs when there are unsaved edits AND a selection change fires — infrequent enough to be acceptable.

**Node position re-parse (heading scan):**  
Split editor text into sections by lines starting with `## `. Match each heading to a known category label. Unmatched content between headings becomes a `free-{n}` node. This is O(file-lines) but only runs on auto-save or on injection when `isDirty`.

### D4 — Separate Zustand store: `useDocumentStore`

```ts
interface DocumentStore {
  nodes: DocumentNode[]
  isDirty: boolean
  updateNode: (id: string, content: string) => void
  setNodes: (nodes: DocumentNode[]) => void
  setIsDirty: (dirty: boolean) => void
}
```

Kept separate from `useAppStore` so category-panel components (which subscribe to `selections`) never re-render when the document is saved.

`isDirty` flips `true` on every CodeMirror change event and `false` after auto-save completes.

### D5 — Auto-save: single-fire debounce via `useRef`

`useAutoSave(editorViewRef)` registers a CodeMirror `updateListener`. On each document change:
- Clear the previous `setTimeout` ref, set a new 5 000 ms timer
- When the timer fires: read `editorView.state.doc.toString()`, re-parse into nodes, call `setNodes(parsedNodes)` + `setIsDirty(false)`
- The timer does **not** reset after firing — it only resets on the next user edit

No `localStorage` is involved. Auto-save is purely in-memory.

### D6 — `activeView` rename: `"code"` → `"editor"`

The `AppStore.activeView` type changes from `"code" | "preview"` to `"editor" | "preview"`. This is an in-memory-only change (no persistence to migrate). All references to `"code"` are updated in the same PR.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| CodeMirror SSR incompatibility (Next.js App Router) | Instantiate `EditorView` inside `useEffect`; dynamically import codemirror modules so the server never executes them |
| Node positions stale after user edit and before auto-save | Injection path includes a fast heading re-parse step before computing offsets |
| User renames a section heading manually | That section's ID is lost; next injection appends a duplicate section. Acceptable for v1 — document in UX copy |
| CodeMirror bundle size (~250 KB) | Dynamic `import()` inside `EditorView`; only loaded when `activeView === "editor"` |
