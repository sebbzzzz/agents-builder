## Why

The current category panel has visual inconsistencies and interaction bugs that degrade the user experience: categories use checkboxes instead of the intended navigation affordance, sub-options are pre-enabled when they should start disabled, the floating panel closes unexpectedly on select/tooltip interactions, and the left column is wider than needed.

## What Changes

- Replace the checkbox on each category row with a `ChevronRight` icon; move the enable/disable checkbox into the floating options panel that opens on click
- Apply a distinct background color to the active category row (instead of or in addition to the accent indicator)
- Disable all sub-options by default (user must explicitly enable them)
- Fix the floating panel close behavior: the panel should only close when the user clicks outside of both the panel and the left column
- Cap the left column width at `max-width: 280px`

## Capabilities

### New Capabilities

<!-- none — all changes are to an existing capability -->

### Modified Capabilities

- `category-panel`: Navigation affordance changes (chevron instead of checkbox), active state styling, sub-option default state, panel close behavior, and left column max-width constraint

## Impact

- `components/` — `CategoryPanel`, `CategoryItem`, and the floating options panel component
- `hooks/` — hook managing panel open/close state and outside-click detection
- `data/` — no changes; option enable/disable default state is UI-only
- No API or data model changes
