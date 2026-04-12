## Why

The PreviewPanel currently renders the assembled markdown as read-only text. The product spec requires every line to be editable inline, and category selections to inject content into named sections of the file — neither is possible without a true editor model with section tracking and persistent document state.

## What Changes

- The "Code" view in the PreviewPanel is replaced by an "Editor" view — a real markdown editor (CodeMirror 6) where users can type freely
- The `activeView` union type is extended from `"code" | "preview"` to `"editor" | "preview"` (renaming "code" → "editor")
- A dedicated document store (`useDocumentStore`) manages the editor content, undo/redo history, dirty state, and per-section metadata — separate from `useAppStore` to avoid unrelated re-renders
- Sections in the document are delimited by HTML comment markers (`<!-- section-start:<id> -->` / `<!-- section-end:<id> -->`). When category selections change, only the relevant section is replaced in-place
- Auto-save fires once, 5 seconds after the user's last keystroke, writing to `localStorage`

## Capabilities

### New Capabilities

- `document-store`: Zustand store for document content, undo/redo history stack, dirty flag, and section-boundary metadata
- `section-tracking`: Section marker protocol (`<!-- section-start/end:<categoryId> -->`) that allows targeted in-place replacement when selections change
- `auto-save`: Debounced save to `localStorage` triggered 5 s after the last edit; fires only once per idle period

### Modified Capabilities

- `preview-panel`: The "Code" tab becomes an "Editor" tab backed by CodeMirror 6; the view-toggle in `PreviewHeader` is updated accordingly; the `activeView` type changes from `"code" | "preview"` to `"editor" | "preview"`

## Impact

- `types/store.ts` — `activeView` type changes; new `DocumentStore` interface added
- `store/useAppStore.ts` — rename `"code"` → `"editor"` in initial state and `setActiveView` signature
- `store/useDocumentStore.ts` — new file
- `components/preview/PreviewPanel.tsx` — renders `EditorView` instead of `CodeView` when `activeView === "editor"`
- `components/preview/PreviewHeader.tsx` — toggle label "Code" → "Editor"; updated `activeView` comparisons
- `components/preview/CodeView.tsx` — replaced by `components/preview/EditorView.tsx`
- `hooks/useAutoSave.ts` — new file
- `hooks/useSectionInjector.ts` — new file
- **New dependency**: `@codemirror/codemirror6` bundle (CodeMirror 6) for the editor surface
