## 1. Dependencies & Types

- [x] 1.1 Install CodeMirror 6 packages: `codemirror`, `@codemirror/lang-markdown`, `@codemirror/commands`, `@codemirror/theme-one-dark`
- [x] 1.2 Add `DocumentNode` interface to `types/store.ts`
- [x] 1.3 Add `DocumentStore` interface to `types/store.ts`
- [x] 1.4 Update `AppStore.activeView` type in `types/store.ts` from `"code" | "preview"` to `"editor" | "preview"`

## 2. Document Store

- [x] 2.1 Create `store/useDocumentStore.ts` with `nodes`, `isDirty`, `updateNode`, `setNodes`, `setIsDirty` using Zustand
- [x] 2.2 Update `store/useAppStore.ts` initial `activeView` value from `"code"` to `"editor"`

## 3. Pure Utilities

- [x] 3.1 Create `lib/parseDocumentNodes.ts` — heading-based re-parse: splits editor text on `## ` lines, maps headings to known category IDs, assigns `"free-{n}"` to unmatched blocks
- [x] 3.2 Create `lib/assembleDocument.ts` — joins `DocumentNode[]` into a single markdown string with `'\n\n'` separators
- [x] 3.3 Create `lib/computeNodeOffsets.ts` — returns `{ id, from, to }[]` by summing node content lengths and separators

## 4. Hooks

- [x] 4.1 Create `hooks/useAutoSave.ts` — accepts `editorViewRef`, registers a CodeMirror `updateListener`, debounces 5 000 ms, calls `parseDocumentNodes` + `setNodes` + `setIsDirty(false)` on fire, cleans up timer on unmount
- [x] 4.2 Create `hooks/useSectionInjector.ts` — subscribes to `useAppStore.selections`, derives new markdown per changed category, reconciles nodes if `isDirty`, computes offset via `computeNodeOffsets`, dispatches a CodeMirror transaction, calls `updateNode` or appends a new node

## 5. Editor Component

- [x] 5.1 Create `components/preview/EditorView.tsx` — instantiates `EditorView` in `useEffect` with `history()`, `markdown()`, `keymap.of(defaultKeymap)`, initialises content from `assembleDocument(nodes)`, registers the `updateListener` that sets `isDirty: true`
- [x] 5.2 Wire `useAutoSave` and `useSectionInjector` inside `EditorView.tsx`
- [x] 5.3 Add empty-state placeholder when node array is empty

## 6. Preview Panel Integration

- [x] 6.1 Update `components/preview/PreviewPanel.tsx` — replace `activeView === "code" ? <CodeView />` with `activeView === "editor" ? <EditorView />`
- [x] 6.2 Update `components/preview/PreviewHeader.tsx` — change toggle labels from "Code"/"Preview" to "Editor"/"Preview" and update all `activeView === "code"` comparisons to `activeView === "editor"`
- [x] 6.3 Update `components/preview/RenderedView.tsx` — read assembled content from `assembleDocument(useDocumentStore(s => s.nodes))` instead of `useAppStore.markdownOutput`
- [x] 6.4 Delete `components/preview/CodeView.tsx`

## 7. QA

- [x] 7.1 Run `yarn typecheck` — no errors
- [x] 7.2 Run `yarn lint:fix` — no errors
- [x] 7.3 Run `yarn format:write` — no formatting changes
- [ ] 7.4 Manual check: type in editor → 5 s later `isDirty` resets and `nodes` updates in store
- [ ] 7.5 Manual check: toggle a category option → section appears/updates in editor without disturbing other sections
- [ ] 7.6 Manual check: undo (Cmd+Z) after a category injection reverts the injected content
- [ ] 7.7 Manual check: switch Editor ↔ Preview — Preview renders the assembled markdown
