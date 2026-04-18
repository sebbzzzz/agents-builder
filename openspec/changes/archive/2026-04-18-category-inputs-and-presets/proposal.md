## Why

`data/categories.ts` now defines a rich category model with typed sub-categories (`select`, `multi`, `input`, `skills`, `triggers`) and embedded option prompts, but the current `ChecklistArea` only renders flat checkboxes from a separate `OPTIONS` map — ignoring all type, sub-category, and prompt data entirely. This change wires the existing data to the UI so selections drive the live preview.

## What Changes

- **Update types** — audit and extend TypeScript interfaces in `data/categories.ts` to cover all field variations already in the data (e.g. `visibleWhen`, `tags`, `placeholder`), and add any missing derived types.
- **Replace the flat checklist with typed input renderers** — `ChecklistArea` (or a new `SubCategoryInputs` component) dispatches on `SubCategory.type` to render the correct control:
  - `select` → radio group or segmented control (single choice)
  - `multi` → checkbox list (multiple choices)
  - `input` → free-text field using `placeholder`
  - `skills` → skill card list with install-command chips
  - `triggers` → read-only derived section, shows when skills are selected
- **Integrate prompts into the preview** — when the user selects an option, its `prompt` string is injected into the generated AGENTS.md output via the app state.
- **Respect `visibleWhen`** — sub-categories tagged with `visibleWhen` only render when at least one of the listed option IDs is currently selected.

## Capabilities

### New Capabilities

- `typed-option-inputs`: Renders the correct input control per `SubCategory.type` and surfaces each option's `prompt` for preview generation.
- `selection-to-prompt`: Maps user selections (option IDs) to their `prompt` strings and assembles them into the AGENTS.md output.

### Modified Capabilities

- `category-panel`: The checklist area gains full sub-category and typed-input support; the current flat `OPTIONS` data source is replaced by the embedded `subCategories` in `CATEGORIES`.

## Impact

- `components/category/ChecklistArea.tsx` — heavily modified or replaced by `SubCategoryInputs`
- `data/categories.ts` — types updated; `OPTIONS` import in `ChecklistArea` removed
- `data/options.ts` — likely deprecated / deleted once `subCategories` drives rendering
- `store/useAppStore.ts` — selections model may need to change from `Record<categoryId, string[]>` to `Record<subCategoryId, string | string[]>` to support `select` (single value) vs `multi`
- `lib/buildAgentsFile.ts` (or equivalent) — must read `prompt` from selected options rather than static text
- No new dependencies required
