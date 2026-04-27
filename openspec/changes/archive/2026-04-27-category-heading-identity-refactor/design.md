## Context

The app generates an `AGENTS.md` file by letting users toggle categories and options defined in `data/categories.ts`. The CodeMirror editor in `CodeEditorView.tsx` is the canonical surface where users see and edit the document. Today, identity between store state and editor text is established through nested HTML comment anchors:

```
<!-- preset:start tech-stack -->
## Tech Stack
<!-- preset:start tech-stack-heading -->
<!-- preset:start typescript -->
The project uses TypeScript...
<!-- preset:end typescript -->
<!-- preset:end tech-stack-heading -->
<!-- preset:end tech-stack -->
```

`useFragmentSync` watches `selections` + `enabledCategories`, parses these anchors via `anchorParser.ts`, and dispatches CodeMirror transactions through `fragmentApplicator.ts`. The user has staged `anchorParser.ts`, `fragmentApplicator.ts`, `buildAgentsFile.ts`, and `resolveVisibleSubCategories.ts` for deletion, and removed the corresponding store fields, but `useFragmentSync.ts` and `RenderedView.tsx` still reference the deleted symbols. The build is broken.

Two stores exist today: `useAppStore` (UI/selection state) and `useDocumentStore` (raw editor text). `useAutoSave` is the only writer to `useDocumentStore.content`. That separation is correct and is preserved by this design.

User constraints (from product discussion):
- Categories must be identifiable purely from the markdown's structure (`## Heading`).
- Sub-categories no longer have an enable switch.
- Editor source should look as clean as possible. Hidden-but-present markers are acceptable if invisible in the editor and stripped from copy/export.
- A user editing prompt text inside the editor must not lose those edits when toggling other options.

## Goals / Non-Goals

**Goals:**
- Categories are added/removed by writing/deleting their `## ${label}` line and surrounding section.
- Reverse sync: deleting or altering a `## ${label}` heading disables the corresponding category in the store.
- Sub-categories appear as `### ${label}` only when they have at least one selected option, and disappear when empty.
- Option toggles produce minimum-diff edits; user edits inside an option block survive subsequent toggles in the same category.
- Generated copy/export and the rendered preview contain zero `<!--opt:` markers and no anchor comments.
- The editor pane never visually shows the `<!--opt:*-->` / `<!--/opt-->` lines.
- Restore the broken intermediate branch state to a building, type-checking app.

**Non-Goals:**
- Reverse-syncing option-level state from doc edits (only `## Heading` deletion triggers reverse sync). Editing or deleting an option's prompt body in the editor is treated as a freely-edited region; the store does not auto-deselect.
- Migrating documents that still contain legacy `<!-- preset:* -->` / `<!-- fragment:* -->` anchors. The strip pass removes them on read; selections are not recovered.
- Persistence/reload beyond what `useDocumentStore` already does.
- Any changes to the skills/triggers data flow (still depends on already-removed store fields; treated as plain `multi` for now and tracked as a follow-up).

## Decisions

### D1. Category identity = the `## ${category.label}` line itself

**Decision:** Categories are identified by their heading text. To enable: write `## Tech Stack`. To disable: remove the heading and its section. To detect a user-driven disable: scan `##` lines in the doc and compare to `enabledCategories`.

**Rationale:** Zero contamination. Headings are part of the markdown the user wants anyway. The user's mental model already treats them as the section delimiter.

**Alternatives considered:**
- *CodeMirror line decorations / state-only IDs.* Rejected: decorations don't survive serialization, so reload and copy/export lose identity, putting us back to text-based detection.
- *Frontmatter / YAML metadata block.* Rejected: leaks store state into a region the user is likely to edit; introduces a parser dependency for marginal benefit.
- *Hidden HTML comment anchors (status quo).* Rejected: that's exactly the contamination the user wants gone for category-level identity.

**Consequence:** If two categories ever share a label, this breaks. `data/categories.ts` labels are currently unique; we lock in a runtime assertion (`assertUniqueCategoryLabels()`) at module import time to prevent regressions.

### D2. Sub-category identity = `### ${subCategory.label}`, only present when non-empty

**Decision:** A sub-category heading appears in the document when at least one of its options is selected, and is removed when the last option is deselected. The store never tracks sub-category enable state — selections are the only signal.

**Rationale:** Matches the user's "no sub-cat switches" requirement. Keeps the empty-state output clean (no orphan `### Language\n\n` blocks).

**Consequence:** Within a sub-category, label uniqueness within a parent category is required. Same runtime assertion catches it.

### D3. Option identity = hidden `<!--opt:${optionId}-->` … `<!--/opt-->` markers

**Decision:** Every option block is wrapped in single-line HTML comments with the option id. The CodeMirror `hideOptMarkers` extension applies `Decoration.replace({ block: true })` to those lines, collapsing them to zero height. The export/copy strip pass deletes them.

**Rationale:** Edit-preservation requires durable identity. Without markers, deselecting an option whose body the user has edited is a fuzzy text-match problem with no correct answer. Hidden markers cost one comment per block, which is invisible in the editor and stripped from every external surface.

**Alternatives considered:**
- *Pure heading-based + full section regeneration.* Rejected: overwrites user edits on every toggle.
- *Content fingerprinting* (hash the canonical prompt, search for it on remove). Rejected: fails as soon as the user edits a single character.
- *Visible markers (e.g., `> opt:typescript`).* Rejected: pollutes the rendered preview, defeats the point.

**Trade-off accepted:** The raw markdown source contains `<!--opt:*-->` lines. They're invisible in the editor and absent from copy/export, but a user inspecting the source via "view raw" or pasting outside the app will see them. Given the user's explicit "hidden comments are OK if invisible to the user," this is acceptable.

### D4. Forward sync = incremental patches, not full regeneration

**Decision:** Each store action (`toggleCategory`, `toggleSelection`, `setSelection`) maps to a minimum CodeMirror `ChangeSpec` produced by a pure function in `app/_utils/docPatches.ts`. The hook computes only the affected ranges and dispatches a single transaction.

**Rationale:** Full regeneration would erase user edits inside option blocks (D3). Incremental patches preserve any text not explicitly removed.

**Implementation contract:** patch helpers take `(doc: Text, ...args) => { changes: ChangeSpec }` so they're trivially testable as pure functions.

### D5. Reverse sync = single update listener, programmatic-write-aware

**Decision:** `CodeEditorView` registers an `EditorView.updateListener` that runs on every transaction. When `update.docChanged` is true and **none** of the transactions in `update.transactions` carry the `programmaticEdit` annotation, the listener runs `parseHeadings(doc)` and calls `useAppStore.getState().syncEnabledFromHeadings(presentLabels)`. The forward-sync hook always tags its dispatches with `programmaticEdit`, preventing infinite loops.

**Rationale:** Single source of reverse-sync truth. CodeMirror `Annotation`s are the idiomatic way to label transactions. Avoids the more brittle alternative of comparing doc state before/after.

```ts
export const programmaticEdit = Annotation.define<true>()
// Forward sync:
view.dispatch({ changes, annotations: [programmaticEdit.of(true)] })
// Reverse sync listener:
if (update.transactions.some(tr => tr.annotation(programmaticEdit))) return
```

### D6. Heading parser = single linear scan over `Text.iterLines`

**Decision:** `parseHeadings` walks lines via CodeMirror's `Text.iterLines` (zero-copy iteration over the rope) and emits `{ h2: { label, from, to }[]; h3: { label, from, to, parentH2Index }[] }`. No external markdown parser.

**Rationale:** O(n) time, no dependency cost, exact byte ranges (needed by the patch helpers). A regex against the doc string would also work but loses range info and forces a full string materialization.

**Edge cases handled:**
- Setext-style headings (`Title\n=====`) are ignored — only ATX (`## `) is considered. The forward sync only writes ATX.
- Indented `##` lines (within fenced code blocks) are skipped via a simple "are we inside ``` ?" toggle in the same scan.

### D7. Strip pass for legacy anchors

**Decision:** On `useDocumentStore` initial hydration (and as a one-shot in `RenderedView` / `PreviewHeader`), the existing `stripAnchors.ts` regex is replaced by a combined regex that matches both legacy `<!-- (preset|fragment):(start|end) ... -->` lines AND the new `<!--opt:*-->` / `<!--/opt-->` lines. Renamed to `stripMarkers.ts`.

**Rationale:** Without this, anyone with cached document state from before the refactor sees legacy anchors in the rendered preview.

**Trade-off:** Legacy documents lose their original selection state on first load. Acceptable per non-goal NG-2.

### D8. Insert order for new categories

**Decision:** When forward sync inserts a category that wasn't previously present, it appends after the last `##` heading in the document. If no `##` exists yet, it appends at end of doc. Within a category, sub-categories are appended in `data/categories.ts` declaration order; options within a sub-category are appended in declaration order.

**Rationale:** Stable, predictable output. Avoids fighting user-driven heading reordering — if the user moves headings around, our patches still target the right section by label, not by index.

## Risks / Trade-offs

- **Risk:** User renames `## Tech Stack` → `## My Tech Stack`. Reverse sync sees the label is missing and disables Tech Stack. The user's selections are dropped.
  **Mitigation:** This is the documented contract per the user's spec ("if the user delete or alterate the '## Tech stack' we will desactivate the option"). UI should communicate disabled state clearly. No automatic recovery.

- **Risk:** Two CodeMirror transactions race — a user keystroke followed immediately by a forward-sync dispatch — and the reverse-sync listener sees a transient state where the heading hasn't been written yet, briefly disabling the category.
  **Mitigation:** The forward-sync hook reads `enabledCategories` from the store, not from the doc, so it's immune. The reverse-sync listener only fires on user transactions; programmatic transactions carry the annotation. The race is bounded to within a single React render cycle and self-heals on the next listener pass.

- **Risk:** A user types `## Tech Stack` manually inside their content (e.g., quoting the heading in a paragraph).
  **Mitigation:** `parseHeadings` only matches lines that are themselves `^## ${label}$` (after trimming). A heading inside a code fence or blockquote is excluded. False positives require the user to literally write the line at the start of a line outside any fence — a corner case we accept.

- **Risk:** Hidden marker decoration fails to apply on first paint (race between extension setup and initial doc), briefly showing `<!--opt:typescript-->` to the user.
  **Mitigation:** Register the extension in the initial `EditorState` config, not via `reconfigure`. The decoration is computed synchronously in the `StateField`'s `create` step.

- **Risk:** `data/categories.ts` adds two categories with duplicate labels in the future, breaking D1.
  **Mitigation:** Runtime assertion in `data/categories.ts` (or a co-located `assertUniqueCategoryLabels()` invoked at module load) throws in dev. Followed up by an ESLint rule or build-time check is a possible follow-up but not required by this change.

- **Trade-off accepted:** Raw markdown source contains `<!--opt:*-->` lines. Pasting the source elsewhere shows them. The user explicitly approved hidden markers as the cost for edit preservation.

- **Trade-off accepted:** Legacy documents lose selection state on first load (NG-2). The app is pre-release.

## Migration Plan

This is an internal refactor with no external API or stored data migration. Steps applied in tasks.md order:
1. Restore the building/typing state of the broken branch by deleting the dead imports first.
2. Add the new utilities (pure functions, no UI dependencies) — testable in isolation.
3. Rewrite the store and hook on top of the new utilities.
4. Update UI components last, once the underlying APIs are stable.
5. Run the verification matrix from the plan file end-to-end before merging.

No rollback plan beyond `git revert` of the merge commit. The branch lives in `refactor/architectural-global-store-improvements` and is not yet deployed.
