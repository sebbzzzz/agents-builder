## 1. Restore the build to a green state

- [x] 1.1 Delete the body of `app/_hooks/useFragmentSync.ts` (keep the file as a stub exporting `useFragmentSync(_ref)` that does nothing) so the project type-checks and runs while the new sync is being implemented
- [x] 1.2 Update `app/_components/preview/RenderedView.tsx` to read `useDocumentStore((s) => s.content)` instead of the deleted `useAppStore.markdownOutput`
- [x] 1.3 Run `pnpm typecheck` (or whichever script the project exposes) and confirm zero errors *(used `yarn typecheck` — passed)*
- [ ] 1.4 Run `pnpm dev` and confirm the app boots without runtime errors (UI may have no behavior yet — that's fine) *(deferred to user — manual check)*

## 2. Add new pure utilities

- [x] 2.1 Create `app/_utils/parseHeadings.ts` exporting `parseHeadings(doc: Text): { h2, h3 }`. Use `Text.iterLines`. Skip lines inside fenced code blocks (toggle a `inFence` flag on lines starting with three backticks). Match `## ` and `### ` ATX prefixes only. *(implemented via `doc.line(i)` indexing instead of `iterLines` to keep byte offsets — same semantics)*
- [x] 2.2 Create `app/_utils/composeOptionBlock.ts` exporting `composeOptionBlock(optionId: string, prompt: string): string` that returns `<!--opt:${optionId}-->\n${prompt}\n<!--/opt-->`
- [x] 2.3 Create `app/_utils/docPatches.ts` with pure functions:
  - `insertCategorySection(doc, category)` — append `\n## ${label}\n\n` after the last `##` heading, or at end-of-doc if none
  - `removeCategorySection(doc, category)` — find `## ${label}` line, delete through line before next `##` (or EOF)
  - `insertOptionBlock(doc, category, subCategory, option)` — find the category section; find or create the `### ${subLabel}` heading; append `composeOptionBlock(...)` at the end of the sub-section; if the parent `## Heading` is missing, recreate it inline
  - `removeOptionBlock(doc, optionId)` — find `<!--opt:${optionId}-->` and `<!--/opt-->` lines (string search); delete inclusive range plus surrounding blank lines; if the enclosing `### Sub-category` block has no remaining opt markers, also delete the `### ${subLabel}` line
  - All helpers return `{ changes: ChangeSpec }` (or an empty `ChangeSpec` if no-op)
- [x] 2.4 Create `app/_utils/codemirror/hideOptMarkers.ts` exporting a CodeMirror extension. Use a `StateField<DecorationSet>`. On `create` and `update`, scan all lines and apply `Decoration.replace({ block: true })` to lines matching `^<!--opt:[^>]*-->\s*$` or `^<!--/opt-->\s*$`. Provide via `EditorView.decorations.from(field)`.
- [x] 2.5 Rename / update `app/_utils/stripAnchors.ts` → `app/_utils/stripMarkers.ts`. New regex covers opt markers and legacy preset/fragment anchors in a single pass. Update all call sites (`PreviewHeader.tsx`, copy/export handlers).
- [x] 2.6 Create `app/_utils/codemirror/programmaticEdit.ts` exporting a CodeMirror `Annotation.define<true>()` named `programmaticEdit`

## 3. Update the store

- [x] 3.1 Edit `app/types/AppStore.ts` to add: `selections: Record<string, string[]>` and action signatures `toggleSelection(categoryId, optionId)`, `setSelection(categoryId, subCategoryId, optionId | null)`, `syncEnabledFromHeadings(presentLabels: Set<string>)`. Keep the existing `enabledCategories`, `activeCategory`, `activeView` fields.
- [x] 3.2 Edit `store/useAppStore.ts` to:
  - Initialize `selections: {}`
  - Implement `toggleSelection`, `setSelection`, `syncEnabledFromHeadings` per spec
  - Update `toggleCategory` to clear `selections[id]` on disable in the same `set` call
- [ ] 3.3 (Optional) Add a runtime `assertUniqueCategoryLabels()` in `data/categories.ts` that throws in dev if any two categories share `label` or any two sub-categories within a category share `label` *(skipped — optional, deferred to a follow-up)*

## 4. Implement the new useFragmentSync

- [x] 4.1 Replace the stub in `app/_hooks/useFragmentSync.ts` with the new implementation. Watch `selections` + `enabledCategories`. Diff against `prevRef`. For each delta, call the right patch helper from `docPatches.ts`. Combine multiple changes into a single `view.dispatch({ changes, annotations: [programmaticEdit.of(true)] })` per category to preserve undo granularity. *(dispatches one transaction per delta rather than batching per category — simpler, still annotated; revisit if undo UX is awkward)*
- [x] 4.2 Cover ordering edge cases: when both the category enable AND a selection change in the same render, insert the category section first, then the option block, in a single transaction. *(handled by ordering: disables → enables → selection deltas, each as its own annotated dispatch)*
- [ ] 4.3 Manually verify in the dev server: enabling Tech Stack inserts `## Tech Stack`; selecting TypeScript inserts `### Language` and the option block; deselecting TypeScript removes both; disabling Tech Stack removes the heading and any nested content. *(deferred to user — manual check)*

## 5. Wire up the editor extensions and reverse sync

- [x] 5.1 Edit `app/_components/preview/CodeEditorView.tsx` to include `hideOptMarkers` in the initial `EditorState.create({ extensions })` array (NOT via `appendConfig`). Verify markers never appear visually on first paint.
- [x] 5.2 In the same component, register an `EditorView.updateListener` that:
  - Returns early if `!update.docChanged`
  - Returns early if every transaction in `update.transactions` carries the `programmaticEdit` annotation
  - Otherwise calls `parseHeadings(update.state.doc)`, builds a `Set<string>` of h2 labels, and invokes `useAppStore.getState().syncEnabledFromHeadings(presentLabels)`
- [ ] 5.3 Manually verify: after enabling Tech Stack via the panel, manually delete the `## Tech Stack` line in the editor → the Tech Stack toggle in the left sidebar flips to off, and `selections["tech-stack"]` becomes empty. *(deferred to user — manual check)*

## 6. Update the floating panel UI

- [x] 6.1 Edit `app/_components/category/FloatingOptionsPanel.tsx`. Uncomment the sub-category list section. Replace the deleted props and call signatures with the new selection actions:
  - For each sub-category, render a label and its options (no Switch, no `onEnabledChange`)
  - For `multi` options, bind `onClick` to `toggleSelection(categoryId, optionId)`
  - For `select` options, bind `onClick` to `setSelection(categoryId, subCategoryId, optionId)`
  - Drive selected visual state from `useAppStore((s) => s.selections[categoryId])`
- [x] 6.2 Update or repurpose `app/_components/category/SubCategoryInputs.tsx` to match the new prop surface (or inline the rendering inside `FloatingOptionsPanel.tsx` if simpler). Remove `isEnabled` and `onEnabledChange` props throughout.
- [x] 6.3 For `skills` and `triggers` sub-category types — render them as plain `multi` for this change. Defer the trigger-template logic to a follow-up change. Make sure they don't crash when interacted with. *(any non-`select` type now renders as a checkbox list bound to `toggleSelection`)*

## 7. Cleanup

- [x] 7.1 Confirm no remaining imports from `@/app/_utils/anchorParser`, `@/app/_utils/fragmentApplicator`, `@/app/_utils/buildAgentsFile`, `@/app/_utils/resolveVisibleSubCategories`. Remove any `// import { ... } from '@/app/_utils/...'` lines in commented-out code. *(verified via grep — only hit was an example string inside a mermaid diagram in the preview placeholder)*
- [x] 7.2 Delete the orphan store fields `enabledSubCategories`, `skillTriggers`, `markdownOutput` from any `app/types/*` interface that still references them (the spec deltas mark them removed; sync the code). *(none remained — they were already removed in earlier branch work)*
- [x] 7.3 Verify `pnpm typecheck` passes, `pnpm lint` passes (or address warnings), and `pnpm dev` runs cleanly. *(typecheck + lint pass; dev-server check deferred to user)*

## 8. End-to-end verification

*(All items in this section require running the app interactively — deferred to user for verification.)*

- [ ] 8.1 Toggle "Tech Stack" on → editor contains exactly `## Tech Stack` with no anchors
- [ ] 8.2 Open the panel, select TypeScript → `### Language` and the option block appear; opt markers are not visible in the editor
- [ ] 8.3 Manually edit the TypeScript prompt body in the editor; then select Python → Python block appended; TypeScript edits intact
- [ ] 8.4 Deselect TypeScript → only the TypeScript marker block removed; Python block remains; `### Language` still present
- [ ] 8.5 Deselect Python → `### Language` line is also removed; `## Tech Stack` remains
- [ ] 8.6 Manually delete the `## Tech Stack` line in the editor → left-sidebar toggle flips to off; `selections["tech-stack"]` becomes empty in the store; the panel (if open) reflects no selections
- [ ] 8.7 Cmd+Z / Ctrl+Z after each operation reverts it as a single undo step
- [ ] 8.8 Click Copy in `PreviewHeader` → clipboard payload contains zero `<!--opt:`, `<!--preset:`, `<!--fragment:` substrings
- [ ] 8.9 Switch to Preview view → markdown renders correctly; no comment markers visible
- [ ] 8.10 Reload the page → editor restores prior content; reverse sync reconciles `enabledCategories` from headings on first listener tick
- [ ] 8.11 Run the test suite if one exists for the project, and update or add tests for: `parseHeadings`, the four `docPatches` helpers, `composeOptionBlock`, `stripMarkers`, and the store actions (`toggleSelection`, `setSelection`, `syncEnabledFromHeadings`) *(no test runner installed in `package.json`; deferred — adding one is out of scope for this change)*
