## Why

The current category panel stacks all options in a single scrollable column below the category list, making the UI dense and hard to scan. Form controls (checkboxes, radio buttons, inputs) are plain HTML elements with no visual consistency. Upgrading to shadcn components and introducing a floating options panel will reduce visual noise, improve discoverability, and align the app with modern design standards — without adding new dependencies (shadcn is already configured in `components.json`).

## What Changes

- **shadcn form components** replace raw HTML controls: `Checkbox` for `multi`, `RadioGroup` for `select` (or `Select` dropdown when there are many options), `Input` for text fields, and `Switch` as a top-level enable/disable toggle per sub-category.
- **Floating options panel**: clicking a category in the left column opens a floating panel anchored to the right of the left column instead of expanding content inline. The panel appears as an overlay/flyout and can be dismissed.
- **Switch per sub-category**: each sub-category in the floating panel has a shadcn `Switch` at the top — when off, its options are hidden/disabled. This replaces the always-visible option list.
- **Adaptive select control**: `select`-type sub-categories with ≥5 options render as a shadcn `Select` dropdown instead of a radio group, reducing vertical space.

## Capabilities

### New Capabilities

- `floating-options-panel`: A flyout panel that appears to the right of the category list when a category is clicked. Contains all sub-categories for the active category. Can be closed. Replaces the inline checklist area in the main layout.

### Modified Capabilities

- `typed-option-inputs`: Requirements change — `multi` uses shadcn `Checkbox`, `select` uses shadcn `RadioGroup` (or `Select` when ≥5 options), `input` uses shadcn `Input`. Each sub-category gains a `Switch` enable/disable control. These are spec-level behavioral changes (the Switch changes what renders and what is submitted).
- `category-panel`: Requirements change — clicking a category triggers the floating panel instead of updating inline content. The checklist area is removed from the left column. A button/indicator shows that a panel is openable.

## Impact

- `components/category/ChecklistArea.tsx` — replaced by floating panel component
- `components/category/SubCategoryInputs.tsx` — updated to use shadcn form primitives + Switch
- `components/ui/` — new shadcn components added: `checkbox`, `radio-group`, `switch`, `select` (via `npx shadcn add`)
- `hooks/useSelections.ts` — may need to track per-sub-category enabled state (Switch)
- `app/page.tsx` or layout — floating panel positioning changes the layout structure
- No new npm dependencies; shadcn components are code-generated
