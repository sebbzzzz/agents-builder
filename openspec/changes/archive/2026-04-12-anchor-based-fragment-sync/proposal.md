## Why

The current node-based system (`DocumentNode[]`) couples section identity to heading text, making it fragile when users rename headings and unable to handle nested sub-fragments within a section. Moving to HTML comment anchors (`<!-- preset:start id -->` / `<!-- preset:end id -->`) gives every region a stable, invisible boundary that survives arbitrary user edits and supports hierarchical nesting (e.g. `pattern.mvp` inside `pattern`).

## What Changes

- **BREAKING** — `useSectionInjector.ts` is replaced by `useFragmentSync.ts`, which operates on anchors instead of computed node offsets
- **BREAKING** — `parseDocumentNodes.ts` / `computeNodeOffsets.ts` are replaced by `lib/anchorParser.ts`, which scans for `<!-- preset:start/end {id} -->` markers
- `useDocumentStore` retains `nodes[]` for auto-save re-parse but the injector no longer drives it; nodes become a snapshot for persistence only
- A new `lib/fragmentApplicator.ts` handles all CodeMirror transaction logic: insert, remove, re-order, repair
- The anchor format supports both plain IDs (`pattern`) and JSON IDs (`{"id":"pattern","version":1}`)
- All edits go through `view.dispatch({ changes })` — the full document string is never replaced

## Capabilities

### New Capabilities

- `anchor-parser`: Detects `<!-- preset:start/end {id} -->` markers in a CodeMirror doc, returns `{ id, from, to, contentFrom, contentTo }[]` for both plain and JSON anchor formats
- `fragment-applicator`: Applies enable/disable/repair operations as targeted CodeMirror transactions; handles nested fragments, schema ordering, duplicate prevention, and broken-anchor recovery
- `fragment-sync`: React hook (`useFragmentSync`) that watches `useAppStore.selections`, diffs against previous selections, and delegates each change to `fragmentApplicator`

### Modified Capabilities

- `section-tracking`: Requirements change from offset-based node lookup to anchor-based lookup; re-parse and `computeNodeOffsets` are removed; anchor recovery and nested fragment ordering are added

## Impact

- `hooks/useSectionInjector.ts` — deleted, replaced by `hooks/useFragmentSync.ts`
- `lib/parseDocumentNodes.ts` — injector no longer calls it for position lookup (still used by `useAutoSave` for persistence snapshot)
- `lib/computeNodeOffsets.ts` — deleted (offsets are derived from live anchor scan)
- `lib/anchorParser.ts` — new file
- `lib/fragmentApplicator.ts` — new file
- `hooks/useFragmentSync.ts` — new file
- `components/preview/EditorView.tsx` — swap `useSectionInjector` for `useFragmentSync`
- No changes to `useDocumentStore`, `useAutoSave`, `EditorView` editor setup, or `RenderedView`
