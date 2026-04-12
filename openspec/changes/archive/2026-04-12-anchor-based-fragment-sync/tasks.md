## 1. Types

- [x] 1.1 Add `AnchorRegion` interface to `types/store.ts` — `{ id, from, to, contentFrom, contentTo }`

## 2. Anchor Parser

- [x] 2.1 Create `lib/anchorParser.ts` — single-pass line scan of `Text` (CodeMirror doc), returns `AnchorRegion[]`
- [x] 2.2 Support plain id format: `<!-- preset:start pattern -->`
- [x] 2.3 Support JSON id format: `<!-- preset:start {"id":"pattern"} -->` — extract `id` field
- [x] 2.4 Tolerate extra whitespace inside anchor comment
- [x] 2.5 Ignore unpaired start anchors (no matching end anchor)

## 3. Fragment Applicator

- [x] 3.1 Create `lib/fragmentApplicator.ts` with exported pure functions
- [x] 3.2 `enablePreset(id, defaultContent, regions, docLength)` — insert block at end; no-op if region exists
- [x] 3.3 `disablePreset(id, regions)` — remove full region from `from` to `to`; no-op if not found
- [x] 3.4 `enableFragment(id, parentId, defaultContent, schemaOrder, regions)` — insert inside parent in schema order; auto-enable parent if missing
- [x] 3.5 `disableFragment(id, regions)` — remove only the fragment region; leave siblings untouched
- [x] 3.6 `repairAnchor(id, regions, docLength)` — recreate missing anchor at fallback position; return `null` if no repair needed
- [x] 3.7 Ensure all returned `ChangeSpec` objects target specific `from`/`to`, never `from: 0, to: docLength`

## 4. Fragment Sync Hook

- [x] 4.1 Create `hooks/useFragmentSync.ts` — same signature as `useSectionInjector`: `(editorViewRef: React.RefObject<EditorView | null>) => void`
- [x] 4.2 Subscribe to `useAppStore.selections`; diff vs `prevSelectionsRef` to find changed categories
- [x] 4.3 On each change: call `parseAnchors(view.state.doc)`, then call the relevant applicator function, then `view.dispatch`
- [x] 4.4 Do NOT call any `useDocumentStore` actions from this hook

## 5. Wire & Cleanup

- [x] 5.1 Update `components/preview/EditorView.tsx` — replace `useSectionInjector` import with `useFragmentSync`
- [x] 5.2 Delete `hooks/useSectionInjector.ts`
- [x] 5.3 Delete `lib/computeNodeOffsets.ts`

## 6. QA

- [x] 6.1 Run `yarn typecheck` — no errors
- [x] 6.2 Run `yarn lint:fix` — no errors
- [x] 6.3 Run `yarn format:write` — no formatting changes
- [ ] 6.4 Manual: enable a category → anchor block inserted at end of document
- [ ] 6.5 Manual: disable a category → full anchor block removed
- [ ] 6.6 Manual: edit text above a section, then toggle another category → correct anchor offsets used
- [ ] 6.7 Manual: delete an anchor manually, then re-toggle its category → anchor is recreated
- [ ] 6.8 Manual: Cmd+Z after a toggle → reverts only the toggled change
