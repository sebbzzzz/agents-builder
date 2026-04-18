## Context

The current `useSectionInjector` tracks section boundaries by computing character offsets from a `DocumentNode[]` array. This breaks whenever the user edits between auto-saves because the node array becomes stale. It also has no concept of nesting — a category section cannot contain independent sub-fragments.

The anchor-based approach treats the document as plain text with embedded invisible markers. The markers are the only source of truth for where a region is; they travel with the text as the user edits around them. Every operation reads the live CodeMirror document to locate anchors, makes a targeted change, and returns — no separate state needs to stay in sync.

## Goals / Non-Goals

**Goals:**
- Locate any preset/fragment region in O(doc-lines) using a single anchor scan of the live document
- Support nested fragments (`pattern.mvp` inside `pattern`) with schema-defined insertion order
- Recover automatically when a user deletes an anchor (recreate on next toggle)
- Prevent duplicate anchor insertion
- Preserve cursor position and undo history — never replace the full document string
- Support both plain (`pattern`) and JSON (`{"id":"pattern"}`) anchor id formats

**Non-Goals:**
- AST parsing of the Markdown content
- Diff-based merging of manual edits with selection-driven content
- Multi-cursor or multi-selection support

## Decisions

### D1 — Anchor format: HTML comments

```
<!-- preset:start pattern -->
...content...
<!-- preset:end pattern -->
```

**Why:** Invisible in rendered Markdown. Survive copy/paste. Regex-parseable without a full Markdown parser. The spec requires this format explicitly.

**JSON variant** (`<!-- preset:start {"id":"pattern","version":1} -->`) is also parsed for forward compatibility; the parser extracts `id` from either form.

### D2 — `anchorParser`: single-pass scan, returns `AnchorRegion[]`

```ts
interface AnchorRegion {
  id: string
  startLine: number  // line index of <!-- preset:start -->
  endLine: number    // line index of <!-- preset:end -->
  from: number       // char offset of start of start-anchor line
  to: number         // char offset of end of end-anchor line (incl. \n)
  contentFrom: number // char offset after start-anchor line
  contentTo: number   // char offset before end-anchor line
}
```

Scans line by line. O(doc-lines). Called at the start of every enable/disable operation — never cached between renders. Because it reads `view.state.doc` directly, it is always accurate regardless of whether auto-save has run.

### D3 — `fragmentApplicator`: pure functions, accept `EditorView` + `AnchorRegion[]`

All mutation logic is pure functions that receive the current anchor map and return a `ChangeSpec`. `useFragmentSync` calls `anchorParser` then passes the result to the appropriate applicator function, then dispatches.

Operations:
- `enablePreset(id, defaultContent, regions, docLength)` → `ChangeSpec`
- `disablePreset(id, regions)` → `ChangeSpec`
- `enableFragment(id, parentId, defaultContent, schemaOrder, regions)` → `ChangeSpec`
- `disableFragment(id, regions)` → `ChangeSpec`
- `repairAnchor(id, regions, docLength)` → `ChangeSpec | null`

**Why pure functions over a class:** Easier to test, no hidden state, composable for batching multiple changes.

### D4 — Insertion ordering: schema-index comparison

Each preset's fragments have a defined schema order (array index in `CATEGORIES` / options list). When inserting a new fragment:

1. Scan existing sibling fragments inside the parent region (from `AnchorRegion[]`)
2. Find the last sibling whose schema index < new fragment's schema index
3. Insert after that sibling's end-anchor, or at `contentFrom` of the parent if no preceding sibling exists

This guarantees schema order without sorting the full document.

### D5 — Recovery: recreate missing anchors on next toggle

If `anchorParser` finds no region for an ID that is still enabled in `selections`, the applicator falls back to inserting a fresh anchor block. The fallback location priority:

1. Inside the parent preset's `contentTo` position (for fragments)
2. End of document (for top-level presets)

Recovery is triggered lazily (on next toggle), not proactively on every render, to avoid unnecessary transactions.

### D6 — `useFragmentSync`: replace `useSectionInjector`

Same interface contract — receives `editorViewRef`, subscribes to `useAppStore.selections`. Diffs current vs previous selections per category/option, calls the relevant applicator, dispatches one transaction per changed item.

`useDocumentStore` is not modified. `useAutoSave` continues to re-parse the document using `parseDocumentNodes` for persistence — it operates on the assembled text independently of anchor logic.

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| User manually deletes an anchor | Recovery recreates it on next toggle; document text between old markers is lost (by definition — user deleted the boundary) |
| Anchor comment text is edited (e.g. extra space) | Parser uses a lenient regex that trims whitespace; minor edits to the comment text will still match |
| Two fragments with the same ID inserted by a race condition | `enablePreset`/`enableFragment` check for existing anchor before inserting; no-op if found |
| Schema order array changes after a document is saved | Fragments already in the document keep their position; next toggle of any sibling will re-insert in correct order relative to current siblings |
