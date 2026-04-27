## 1. Delete obsolete files

- [x] 1.1 Delete `app/_hooks/useFragmentSync.ts`
- [x] 1.2 Delete `app/_utils/docPatches.ts`
- [x] 1.3 Delete `app/_utils/composeOptionBlock.ts`
- [x] 1.4 Delete `app/_utils/codemirror/hideOptMarkers.ts`
- [x] 1.5 Delete `app/_utils/codemirror/programmaticEdit.ts`

## 2. Add the inject utility

- [x] 2.1 Create `app/_utils/injectOption.ts` exporting `injectOption(view: EditorView, categoryLabel: string, prompt: string): void`. Logic: use `parseHeadings` to find the `## ${categoryLabel}` section; if found, insert `\n\n${prompt}` at the section's end (before next `##` or EOF); if not found, append `\n\n## ${categoryLabel}\n\n${prompt}` at end of document. Dispatch a single CodeMirror transaction with no annotation.

## 3. Shrink the store

- [x] 3.1 Edit `app/types/AppStore.ts`: remove `enabledCategories`, `selections` fields and `toggleCategory`, `setEnabledCategories`, `toggleSelection`, `setSelection`, `syncEnabledFromHeadings` action signatures. Keep `activeCategory`, `activeView`, and their setters.
- [x] 3.2 Edit `store/useAppStore.ts`: remove the deleted fields and actions. The store should only initialize `activeCategory: null` and `activeView: "editor"` with their setters (`setActiveCategory`, `clearActiveCategory`, `setActiveView`).

## 4. Simplify CodeEditorView

- [x] 4.1 Edit `app/_components/preview/CodeEditorView.tsx`: remove imports of `useFragmentSync`, `hideOptMarkers`, `programmaticEdit`, `parseHeadings`, `useAppStore`. Remove the `useFragmentSync(editorViewRef)` call. Remove the `editorViewRef` ref (no longer passed anywhere). Simplify the `updateListener` to only call `setIsDirty(true)` and `scheduleAutoSave(...)` — no reverse sync logic.

## 5. Rewrite FloatingOptionsPanel as inject palette

- [x] 5.1 Edit `app/_components/category/FloatingOptionsPanel.tsx`: remove `enabledCategories`, `toggleCategory`, `selections`, `toggleSelection`, `setSelection` from store subscriptions. Remove the category-level `Switch` from the header. Remove the "Enable this category" empty-state message. Import `injectOption` from `@/app/_utils/injectOption`. Accept an `editorViewRef: RefObject<EditorView | null>` prop and pass it through to `injectOption` calls.
- [x] 5.2 In the sub-category list, replace `SubCategoryInputs` with a simple inline render: for each option in each visible sub-category, show the option label and a small `[+]` button. Clicking the button calls `injectOption(editorViewRef.current, category.label, option.prompt)`. No selected state needed.
- [x] 5.3 Delete `app/_components/category/SubCategoryInputs.tsx` (no longer used).

## 6. Pass editorViewRef down from PreviewPanel

- [x] 6.1 `CodeEditorView` already holds `editorViewRef` internally. Lift this ref up to `PreviewPanel` (or wherever `CodeEditorView` and `FloatingOptionsPanel` share a common parent) so it can be passed to `FloatingOptionsPanel`. Check the component tree to find the right lift point.

## 7. Update CategoryList

- [x] 7.1 Edit `app/_components/category/CategoryList.tsx`: confirm no references to `enabledCategories` or `toggleCategory` remain. The component already only uses `activeCategory`, `setActiveCategory`, `clearActiveCategory` — verify and remove anything related to the old toggle logic if any crept in.

## 8. Simplify stripMarkers

- [x] 8.1 Edit `app/_utils/stripMarkers.ts`: remove the regex for `<!--opt:-->` / `<!--/opt-->` lines since no markers are written anymore. Keep (or remove) any legacy anchor stripping if still needed by other features.

## 9. Verify

- [x] 9.1 Run `yarn typecheck` — zero errors
- [x] 9.2 Run `yarn lint` — zero warnings or errors
- [x] 9.3 Manual smoke test: open dev server, click a category, click `[+]` on an option → content appears in editor under `## Category` heading. Click another option in a different category → content appears under its own heading. Both sections coexist in the document.
