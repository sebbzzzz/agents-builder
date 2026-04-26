## Context

The left column renders a list of categories. Currently each row includes a checkbox for enabling the category, and a floating options panel opens on click. Several issues exist: the icon/affordance choice (checkbox instead of chevron), the default enabled state of sub-options, an event-propagation bug that closes the panel when interacting with select dropdowns or tooltips inside it, and an oversized left column.

## Goals / Non-Goals

**Goals:**
- Replace category row checkbox with a `ChevronRight` icon; highlight active row with a distinct background
- Move the enable/disable toggle into the floating panel (not the category list row)
- Ensure all sub-options start disabled by default
- Fix panel close logic: only close on outside-click relative to left column + panel combined area
- Constrain left column to `max-width: 280px`

**Non-Goals:**
- Changing the floating panel layout beyond adding the enable/disable toggle
- Changing category order or data structure
- Animating the chevron or panel transitions

## Decisions

**1. Outside-click detection boundary**
Use a `useClickOutside` hook (or equivalent `mousedown` listener) that receives refs for both the left column and the floating panel. The panel closes only when the click target is outside both. This avoids the current issue where clicks inside select dropdowns or tooltip portals (which render outside the DOM subtree but are logically "inside") bubble up and trigger close.

*Alternative considered*: `stopPropagation` on panel clicks — rejected because it breaks other event listeners and is fragile.

**2. ChevronRight icon source**
Use `lucide-react` which is already in the project (consistent with existing icon usage). Import `ChevronRight`.

**3. Sub-option default state**
Sub-options default to `enabled: false`. The enable/disable checkbox now lives inside the floating panel, shown at the top of the panel for the active category. This is a UI-only change; no data model change needed.

**4. Left column width**
Apply `max-w-[280px]` (Tailwind 4) directly on the left column container. No layout restructuring needed.

## Risks / Trade-offs

- [Portal-rendered tooltips/selects] Some UI libraries render tooltips into `document.body` portals, so `contains()` checks will always return false → Mitigation: check `event.target` against a data attribute or ref on the panel/column wrapper, and also check if the click target is inside any known portal root (e.g., `[data-radix-popper-content-wrapper]`).
- [Enable/disable checkbox moved] Users who relied on the checkbox in the category row will need to open the panel to toggle — a small discoverability trade-off accepted in favor of cleaner navigation UI.
