## 1. Left Column Layout

- [x] 1.1 Add `max-w-[280px]` constraint to the left column container

## 2. Category Row — Icon & Active State

- [x] 2.1 Replace the checkbox on each category row with a `ChevronRight` icon (from `lucide-react`)
- [x] 2.2 Apply a distinct background color class to the active category row

## 3. Sub-options Default State

- [x] 3.1 Ensure all sub-options initialize with `enabled: false` (disabled by default)

## 4. Enable/Disable Toggle in Floating Panel

- [x] 4.1 Remove the enable/disable checkbox from the category row
- [x] 4.2 Add an enable/disable checkbox/toggle at the top of the floating options panel for the active category

## 5. Panel Close Behavior Fix

- [x] 5.1 Create or update `useClickOutside` hook to accept refs for both the left column and the floating panel
- [x] 5.2 Update close logic so the panel only closes when the click target is outside both the left column and the floating panel (including portal-rendered children like Radix selects and tooltips)
- [x] 5.3 Verify: clicking a select option inside the panel does not close it
- [x] 5.4 Verify: clicking a tooltip inside the panel does not close it
- [x] 5.5 Verify: clicking outside both column and panel closes it
