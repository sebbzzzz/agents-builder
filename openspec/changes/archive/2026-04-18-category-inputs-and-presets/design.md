## Context

`data/categories.ts` was recently populated with a full category/sub-category/option tree. Each `SubCategory` has a `type` field (`select | multi | input | skills | triggers`) and options carry `prompt` strings. However the UI still reads from `data/options.ts` — a stub that generates fake options — and the store models selections as `Record<categoryId, string[]>`. No prompt is ever injected into the preview.

The three things that must change in concert: types, selections model, and rendering.

## Goals / Non-Goals

**Goals:**
- Replace the stub `OPTIONS` map with the real `subCategories` data from `CATEGORIES`
- Render the correct input control for each `SubCategory.type`
- Respect `visibleWhen` visibility rules
- Map selected option IDs → `prompt` strings and inject them into `markdownOutput`

**Non-Goals:**
- The `skills` and `triggers` type renderers (complex card UI) — implement as minimal placeholders in this change; a dedicated change can flesh them out
- Editing the preview markdown directly (that is the editor's job)
- Any persistence / localStorage

## Decisions

### 1 — Key selections by `subCategoryId`, not `categoryId`

**Current:** `selections: Record<categoryId, string[]>` — one array per category.

**Problem:** A category contains multiple sub-categories, each with a different type. Keying by category conflates them and makes it impossible to know which sub-category a value belongs to.

**Decision:** Change key to `subCategoryId`. A `select` sub-category stores a single-element array (enforced in the toggle action); `multi` stores multiple; `input` stores a single free-text string wrapped in an array.

Alternative considered: nested `Record<categoryId, Record<subCategoryId, string[]>>` — rejected as over-engineered; a flat map with compound keys or sub-category IDs is simpler and sufficient since sub-category IDs are globally unique in the data.

### 2 — `setSelection` replaces `toggleSelection` for `select` and `input`

`toggleSelection` always appends/removes from an array, which is wrong for single-value sub-categories. Add a `setSelection(subCategoryId, value)` action alongside the existing `toggleSelection` for `multi`. Components pick the right action based on `SubCategory.type`.

### 3 — New `SubCategoryInputs` component; `ChecklistArea` becomes a thin wrapper

`ChecklistArea` currently owns both layout and rendering logic. Split:
- `ChecklistArea` — reads active category, maps over its `subCategories`, passes each to `SubCategoryInputs`
- `SubCategoryInputs` — receives a `SubCategory` and the current selection value; dispatches on `type` to render the right control

### 4 — `buildAgentsFile` lib function assembles prompts from selections

A pure function `buildAgentsFile(selections: Selections): string` iterates all sub-categories, finds each selected option's `prompt`, and returns a formatted markdown string. Called reactively whenever `selections` changes (via a `useEffect` in the app or a Zustand subscriber) and stored in `markdownOutput`.

### 5 — `visibleWhen` evaluated against all selected option IDs (flattened)

`visibleWhen: string[]` on a sub-category means "render only if at least one of these IDs is in the current selections". Flatten `Object.values(selections)` into one set of IDs and check intersection. This is a pure function, no extra store state needed.

## Risks / Trade-offs

- **selections key migration** → existing `selections` store shape changes. The store initial state is `{}` so there is no stored data to migrate; risk is low.
- **`input` type stored as `string[]`** → slightly awkward but keeps the type uniform. Alternative is a union type in the store; deferred since it adds complexity without immediate need.
- **`skills` / `triggers` renderers are stubs** → the generated AGENTS.md won't include skill install commands yet. Acceptable for this change.

## Open Questions

- Should `buildAgentsFile` group prompts by category section, or emit them in selection order? → Propose: group by category in CATEGORIES order, each sub-category's prompts under a `## <Category.label>` heading.
- Should `input` type values be included verbatim in the output, or wrapped in a template? → Propose: verbatim, with the option's `prompt` used as a template prefix if present.
