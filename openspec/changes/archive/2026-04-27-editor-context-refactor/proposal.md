## Why

The CodeMirror editor instance is currently managed via a `useRef` created in `page.tsx` and threaded as a prop through `PreviewPanel` and `FloatingOptionsPanel` — two branches of the tree that have no other relationship. This prop drilling couples unrelated components and will break down when a second editor is introduced on a different page.

## What Changes

- **New**: `EditorProvider` React context component that owns the CodeMirror instance privately and exposes editor operations as context values
- **New**: `useEditorContext()` hook for consumers to access editor operations without touching the raw ref
- **Remove**: `editorViewRef` prop from `FloatingOptionsPanel` and `PreviewPanel`
- **Remove**: `useRef<EditorView>` from `page.tsx`
- **Move**: `injectOption` logic from `app/_utils/injectOption.ts` into the context as a stable callback
- **Modify**: `CodeEditorView` mounts and destroys the editor by calling context methods internally, no longer receiving a ref prop

## Capabilities

### New Capabilities

- `editor-context`: React context that owns the CodeMirror instance lifecycle and exposes editor operations (mount, destroy, injectOption) to any descendant without prop drilling

### Modified Capabilities

- `preset-injection`: The inject trigger path changes — `FloatingOptionsPanel` will call `useEditorContext().injectOption(...)` instead of receiving `editorViewRef` and calling the standalone utility directly
- `preview-panel`: `PreviewPanel` drops its `editorViewRef` prop; `CodeEditorView` integrates with the context internally

## Impact

- `app/page.tsx` — removes `useRef<EditorView>` and both prop passes
- `app/_components/preview/EditorView.tsx` — drops `editorViewRef` prop, calls context on mount/destroy
- `app/_components/preview/PreviewPanel.tsx` — drops `editorViewRef` prop
- `app/_components/category/FloatingOptionsPanel.tsx` — drops `editorViewRef` prop, uses context hook
- `app/_utils/injectOption.ts` — logic absorbed into context; file may be removed or kept as a pure helper called internally
- New file: `app/_contexts/EditorContext.tsx`
