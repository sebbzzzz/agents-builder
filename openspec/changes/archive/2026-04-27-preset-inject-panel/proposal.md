## Why

The previous category system used bidirectional sync between the store and the editor — enabling/disabling categories would inject or wipe content, and the editor would reverse-sync back to the store. This created unnecessary complexity (hidden markers, CodeMirror StateFields, programmatic edit annotations, incremental patch helpers) and unexpected behavior for users: disabling a category deleted any custom text they had written inside that section.

The new model treats categories purely as a **preset launcher**: the panel is a palette of insertable snippets, not a sync controller.

## What Changes

- **BREAKING** — Remove category enable/disable toggle. The left sidebar no longer has switches; clicking a category just opens its option panel.
- **BREAKING** — Remove `enabledCategories`, `selections`, `toggleCategory`, `toggleSelection`, `setSelection`, `syncEnabledFromHeadings` from the store.
- Remove `useFragmentSync` hook entirely.
- Remove all CodeMirror sync infrastructure: `hideOptMarkers`, `programmaticEdit`, `composeOptionBlock`, `docPatches`.
- Remove the reverse-sync `updateListener` from `CodeEditorView`.
- Add a simple `injectOption` utility: find (or create) the `## Category` section in the editor, append the option's prompt at the end of that section.
- Redesign `FloatingOptionsPanel` as an inject-only palette: each option has an insert button; clicking it calls `injectOption` directly. No "selected" state tracked in the store.
- Simplify `stripMarkers` — remove opt-marker stripping since no markers are written.

## Capabilities

### New Capabilities
- `preset-injection`: User can inject option presets into the editor from the category panel. Each option targets its parent category's `## Heading` section; the section is created if absent.

### Modified Capabilities
- none

## Impact

- `store/useAppStore.ts` — fields and actions removed; store shrinks to `activeCategory`, `activeView`, and their setters
- `app/types/AppStore.ts` — same removals
- `app/_hooks/useFragmentSync.ts` — deleted
- `app/_utils/docPatches.ts` — deleted
- `app/_utils/composeOptionBlock.ts` — deleted
- `app/_utils/codemirror/hideOptMarkers.ts` — deleted
- `app/_utils/codemirror/programmaticEdit.ts` — deleted
- `app/_utils/parseHeadings.ts` — kept, used by `injectOption` to locate section boundaries
- `app/_utils/stripMarkers.ts` — simplified
- `app/_components/preview/CodeEditorView.tsx` — reverse-sync listener removed
- `app/_components/category/CategoryList.tsx` — toggle UI removed
- `app/_components/category/FloatingOptionsPanel.tsx` — rewritten as inject palette
- `app/_components/category/SubCategoryInputs.tsx` — removed or replaced with simpler option row
