## Context

The app is a Next.js 15 / TypeScript / Zustand / CodeMirror 6 project that helps users build AGENTS.md files. The previous architecture maintained bidirectional sync between a Zustand store (which tracked enabled categories and selected options) and the CodeMirror editor document. This required hidden HTML comment markers, CodeMirror decorations to hide those markers, a programmatic-edit annotation to prevent sync loops, and incremental patch helpers to find and remove specific option blocks.

The user's actual need is simpler: the panel is a **preset launcher**, not a configuration controller. Users draft their document in the editor; the panel just offers reusable snippets to insert.

## Goals / Non-Goals

**Goals:**
- Clicking an option's insert button appends that option's `prompt` into the correct `## Category` section of the editor document
- If the `## Category` heading does not yet exist, it is created before the content is inserted
- The editor document is the single source of truth after injection — no sync back to the store
- The store is minimal: only tracks which panel is open and the active view

**Non-Goals:**
- Tracking which options have already been injected (no "selected" state)
- Removing or replacing previously injected content via the panel
- Reverse-syncing editor headings back to store state
- Preventing duplicate injection (user responsibility)

## Decisions

### 1. Inject into `## Category` section, not at end of document

**Why:** If the user injects TypeScript under Tech Stack, then adds some Patterns content, then comes back and injects JavaScript, both language presets should land inside `## Tech Stack` — not scattered around the document.

**How:** `injectOption(view, categoryLabel, optionPrompt)`:
1. Scan the document for a line that is exactly `## ${categoryLabel}`
2. If found: find the end of that section (next `##` heading line or EOF), insert `\n${optionPrompt}` just before that boundary
3. If not found: append `\n\n## ${categoryLabel}\n\n${optionPrompt}` at end of document

This reuses `parseHeadings.ts` (already exists) to locate section boundaries.

### 2. No selected state in the store or panel

**Why:** Tracking selection state in the store was the root cause of the sync complexity. In the new model, the panel is stateless — there is nothing to "deselect." Each click is an imperative insert action, not a state toggle.

**Trade-off:** Users cannot see which options they've already injected from the panel UI. They can see it in the editor. Acceptable for a preset-launcher UX.

### 3. `[+]` insert button per option row

**Why:** Makes the insert action explicit and reversible (user knows exactly what gets added). Avoids confusion between "selecting" and "inserting."

**Alternative considered:** Checkboxes + single "Add all" button — rejected because it implies a selection state that the panel doesn't actually track.

### 4. Delete `useFragmentSync`, `docPatches`, marker utilities

**Why:** They exist solely to support the bidirectional sync model. With inject-only, none of this infrastructure is needed. Deleting reduces the codebase surface significantly.

### 5. Keep `parseHeadings.ts`

**Why:** The section-boundary logic in `injectOption` needs to know where a `## Heading` section ends. `parseHeadings` already does this correctly (skips fenced code blocks, returns `from`/`to` per heading). Reusing it avoids duplicating that logic.

## Risks / Trade-offs

- **Duplicate injection** — User can click `[+]` twice and get duplicate content. No mitigation in the panel. Users manage it in the editor. Acceptable given the "preset launcher" framing.
- **Section ordering** — Injecting into an existing section appends at the section's end. If the user has written text after the last injected option, new inserts appear after that text too. This is correct behavior — the section is theirs to manage after injection.
- **`## Category` heading label matching** — The inject logic matches the heading text exactly against `category.label`. If the user renames the heading in the editor, subsequent injections will create a new section. No mitigation — this is a known limitation of heading-based identity without markers.

## Migration Plan

1. Delete the utility files no longer needed
2. Shrink the store
3. Rewrite `FloatingOptionsPanel` as inject palette
4. Remove sync infrastructure from `CodeEditorView`
5. Update `CategoryList` to remove toggles
6. Run `yarn typecheck` and `yarn lint` to verify
7. Manual smoke test in dev server
