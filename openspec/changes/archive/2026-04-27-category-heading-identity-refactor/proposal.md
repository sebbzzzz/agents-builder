## Why

The current document-as-state design wraps every category and option block in HTML anchor comments (`<!-- preset:start ... -->`, `<!-- fragment:start ... -->`). This contaminates the generated `AGENTS.md` source and forces a complex parse/apply pipeline (`anchorParser`, `fragmentApplicator`, `useFragmentSync`) just to keep store state in sync with editor text. The user has already begun deleting that pipeline on the current branch, leaving the app in a broken intermediate state. We need a cleaner identity model that derives category state from the markdown's natural structure (headings) and keeps option-level identity invisible to the user.

## What Changes

- Switch category identity from `<!-- preset:start {id} -->` anchors to the natural `## ${category.label}` heading. Insertion and removal of a category writes/deletes only the heading and its section content.
- Remove sub-category enable switches. Sub-categories are organizational only; they appear as `### ${subCategory.label}` headings and only render when at least one option in them is selected.
- Replace option-block anchors with hidden `<!--opt:${optionId}-->` … `<!--/opt-->` markers. A new CodeMirror `StateField` collapses these lines to zero height in the editor, and existing copy/export paths strip them.
- Add a reverse-sync path: when the user deletes or alters a `## ${label}` heading in the editor, the corresponding category is disabled in the store and its selections are cleared.
- **BREAKING (internal):** `useFragmentSync` is rewritten; `parseAnchors`, `enablePreset`, `disablePreset`, `enableFragment`, `disableFragment` are deleted. Any consumer relying on `<!-- preset:* -->` / `<!-- fragment:* -->` markers must migrate.
- Repair the broken intermediate state on this branch: `RenderedView` reading the deleted `useAppStore.markdownOutput` field, `useFragmentSync` reading the deleted `state.selections` field, and orphaned `SubCategoryInputs.tsx` consumers.

## Capabilities

### New Capabilities

- `heading-identity-sync`: heading-text-based forward and reverse sync between the store's `enabledCategories` / `selections` and the CodeMirror document; replaces the anchor-comment pipeline. Owns the patch helpers (`insertCategorySection`, `removeCategorySection`, `insertOptionBlock`, `removeOptionBlock`) and the heading parser.
- `editor-marker-hiding`: CodeMirror `StateField` + `Decoration.replace({ block: true })` extension that visually collapses lines matching `<!--opt:*-->` and `<!--/opt-->`. The same regex powers the export-time stripper.

### Modified Capabilities

- `app-state`: re-introduce `selections: Record<categoryId, optionId[]>`; add `toggleSelection`, `setSelection`, and `syncEnabledFromHeadings` actions; `toggleCategory` clears selections on disable. Remove `markdownOutput` (already gone in code; spec catches up). Remove `enabledSubCategories` and `skillTriggers` from spec (already gone in code).
- `floating-options-panel`: drop the sub-category enable switch. Render each sub-category as a label + its options grouped visually. Bind options to the new `toggleSelection` / `setSelection` actions.
- `fragment-sync`: rewritten entirely. No longer uses anchor parsers; computes patches from `selections` + `enabledCategories` deltas using the new `heading-identity-sync` patch helpers. Tags dispatches with a CodeMirror `Annotation` so the reverse-sync listener ignores its own writes.
- `anchor-parser`: capability removed — `parseAnchors` and the `<!-- preset:* -->` / `<!-- fragment:* -->` anchor format are deleted.
- `fragment-applicator`: capability removed — `enablePreset`, `disablePreset`, `enableFragment`, `disableFragment` are deleted.
- `selection-to-prompt`: simplified — option prompts are emitted verbatim inside `<!--opt:ID-->` markers; no anchor wrapping. (Confirm during specs phase whether this capability still needs a delta.)
- `section-tracking`: superseded — heading scans replace section tracking. Mark requirements removed.

## Impact

- **Affected files (modify):** `store/useAppStore.ts`, `app/types/AppStore.ts`, `app/_hooks/useFragmentSync.ts`, `app/_components/category/FloatingOptionsPanel.tsx`, `app/_components/category/SubCategoryInputs.tsx`, `app/_components/preview/CodeEditorView.tsx`, `app/_components/preview/RenderedView.tsx`, `app/_utils/stripAnchors.ts`.
- **Affected files (create):** `app/_utils/parseHeadings.ts`, `app/_utils/composeOptionBlock.ts`, `app/_utils/docPatches.ts`, `app/_utils/codemirror/hideOptMarkers.ts`.
- **Affected files (already deleted, confirm no remaining imports):** `app/_utils/anchorParser.ts`, `app/_utils/fragmentApplicator.ts`, `app/_utils/buildAgentsFile.ts`, `app/_utils/resolveVisibleSubCategories.ts`.
- **Dependencies:** no new packages. CodeMirror 6, `@codemirror/view`, `@codemirror/state` already installed.
- **Document format change:** existing saved `AGENTS.md` content from prior sessions (with `<!-- preset:* -->` / `<!-- fragment:* -->` anchors) is no longer recognized. Plan: on first load post-refactor, the strip pass removes any legacy anchors so the document continues to render cleanly; selections will not be reverse-derived from legacy anchors. This is acceptable — the app is pre-release.
- **No external API or persistence boundary affected.**
