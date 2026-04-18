## Context

The app is a single-page Next.js 15 / React 19 / Tailwind 4 tool. The current layout has two static columns: a left panel listing categories and a right column rendering all sub-category inputs inline below the category list. All form controls use raw HTML elements with custom Tailwind styling. `components.json` already configures shadcn (`style: "base-nova"`, `aliases.ui: "@/components/ui"`), so adding components is a `npx shadcn add` command away — no dependency changes needed.

The key layout concern is that the current inline checklist area grows indefinitely and is visually detached from the category that triggered it. The floating panel concept scopes options to one category at a time, reducing cognitive load.

## Goals / Non-Goals

**Goals:**
- Replace raw HTML form controls with shadcn `Checkbox`, `RadioGroup`, `Select`, `Input`, and `Switch`
- Introduce a floating options panel that opens to the right of the category list when a category is clicked
- Add a per-sub-category `Switch` to enable/disable its options
- Collapse `select`-type sub-categories with ≥5 options into a shadcn `Select` dropdown
- Keep all existing state management (Zustand) and data contracts intact

**Non-Goals:**
- Redesigning the preview panel or markdown output
- Adding animations beyond Tailwind transitions
- Changing category data structure or option IDs
- Adding new testing infrastructure (out of scope for v1)

## Decisions

### 1. Floating panel as a positioned overlay, not a modal

The options panel is absolutely positioned relative to the left column container (`position: absolute`, `left: 100%`) rather than a true modal dialog. This keeps it visually anchored to the category list and avoids z-index stacking complexity with the preview panel.

**Alternative considered**: A slide-in drawer (shadcn `Sheet`) — rejected because `Sheet` slides from the screen edge and loses the spatial relationship with the category list.

### 2. shadcn components added via CLI, not manual copy

Run `npx shadcn add checkbox radio-group select switch input` to generate components into `components/ui/`. This ensures they match the existing `base-nova` style and `neutral` base color from `components.json`.

**Alternative considered**: Hand-rolling styled components — rejected because shadcn components carry accessibility (ARIA) and keyboard behavior out of the box.

### 3. Switch tracks enabled state in Zustand, separate from selections

A new field `enabledSubCategories: Set<string>` (or `Record<string, boolean>`) is added to the Zustand store. When a sub-category's Switch is off, its options are visually hidden and its selections are excluded from the output. The existing `selections` map is not modified — this avoids clearing user choices when they toggle a switch back on.

**Alternative considered**: Clearing selections when the Switch is turned off — rejected because it destroys user work unexpectedly.

### 4. Select dropdown threshold: ≥5 options

Sub-categories of type `select` with fewer than 5 options render as a `RadioGroup` (better scanability). Those with 5 or more render as a shadcn `Select` (saves vertical space). The threshold is defined as a constant `SELECT_THRESHOLD = 5` in `lib/constants.ts`.

**Alternative considered**: Always use `Select` — rejected because radio groups provide faster scanning for small option sets.

### 5. Floating panel triggered by category click (replaces inline checklist)

`ChecklistArea.tsx` is removed. The left column gains a `FloatingOptionsPanel` component that renders when `activeCategory` is set. The panel is positioned using `absolute + z-10` relative to the left-column wrapper. Clicking a different category swaps the content; clicking the same category or pressing Escape closes it.

## Risks / Trade-offs

- **Floating panel clipping** → The left column wrapper must have `position: relative; overflow: visible` — needs care not to conflict with the scroll area. Mitigation: wrap only the panel trigger row, not the scroll container.
- **Switch state not persisted** → If the user refreshes, all switches reset to enabled. Acceptable for v1; can add localStorage persistence later.
- **RadioGroup → Select change mid-session** → If the data for a sub-category changes option count across builds, the rendered control type could change. Mitigation: threshold is data-driven and consistent within a session.
- **Accessibility of floating panel** → Must manage focus trap and `aria-expanded` on the category button. Shadcn's components handle ARIA internally; the panel container needs `role="region"` and an accessible label.
