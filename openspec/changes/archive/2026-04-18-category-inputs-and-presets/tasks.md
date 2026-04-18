## 1. Types & Store

- [x] 1.1 Update `AppStore` in `types/store.ts` — change `selections` to `Record<string, string[]>` keyed by `subCategoryId` (same shape, updated key semantics) and add `setSelection(subCategoryId: string, value: string): void` action
- [x] 1.2 Add `setSelection` action to `store/useAppStore.ts` — replaces the current value for a sub-category (used by `select` and `input` types)
- [x] 1.3 Delete `data/options.ts` — it is a stub and will no longer be used

## 2. Selections → Prompts

- [x] 2.1 Create `lib/buildAgentsFile.ts` — pure function `buildAgentsFile(selections: Record<string, string[]>): string` that iterates `CATEGORIES` in order, groups selected option prompts under `## <Category.label>` headings, and returns the assembled markdown
- [x] 2.2 Handle `input` type in `buildAgentsFile` — emit the stored free-text value (if non-empty) as the prompt content for that sub-category

## 3. visibleWhen Helper

- [x] 3.1 Create `lib/resolveVisibleSubCategories.ts` — pure function `resolveVisibleSubCategories(subCategories: SubCategory[], selections: Record<string, string[]>): SubCategory[]` that filters sub-categories using `visibleWhen` logic (show if no `visibleWhen`, or if any listed ID appears in the flattened selections values)

## 4. Input Renderers

- [x] 4.1 Create `components/category/SubCategoryInputs.tsx` — receives a `SubCategory` and current selections; renders a labeled section per sub-category and dispatches on `type` to the correct control
- [x] 4.2 Implement `multi` renderer in `SubCategoryInputs` — checkbox list, calls `toggleSelection` per option; shows option tooltip via the existing `Tooltip` component if `tooltip` is defined
- [x] 4.3 Implement `select` renderer in `SubCategoryInputs` — radio group (or styled button group), calls `setSelection` to replace current value; shows tooltips
- [x] 4.4 Implement `input` renderer in `SubCategoryInputs` — single `<input type="text">` styled with existing UI primitives, calls `setSelection` on `onChange`; uses option `placeholder`
- [x] 4.5 Implement `skills` and `triggers` renderers as minimal stubs in `SubCategoryInputs` — render a "Coming soon" placeholder so the component doesn't crash on these types

## 5. ChecklistArea Integration

- [x] 5.1 Update `components/category/ChecklistArea.tsx` — remove `OPTIONS` import, replace flat option loop with a loop over `category.subCategories`, filter via `resolveVisibleSubCategories`, pass each sub-category to `<SubCategoryInputs>`

## 6. Preview Wiring

- [x] 6.1 Add a `useEffect` (or Zustand subscriber) in the appropriate client component that calls `buildAgentsFile(selections)` whenever `selections` changes and writes the result to `markdownOutput` via `setMarkdownOutput`

## 7. QA

- [x] 7.1 Run `yarn typecheck` — no errors
- [x] 7.2 Run `yarn lint:fix` — no lint errors
- [x] 7.3 Run `yarn format:write` — all files formatted
- [x] 7.4 Manual smoke test: select options across Tech Stack and Project Context, verify prompts appear in the preview panel
- [x] 7.5 Manual smoke test: verify `visibleWhen` sub-categories (e.g. "Frontend Framework") appear only after selecting "Web App" or "Full-stack App"
