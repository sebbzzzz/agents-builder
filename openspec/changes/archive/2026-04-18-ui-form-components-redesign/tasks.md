## 1. Add shadcn Components

- [x] 1.1 Run `npx shadcn add checkbox` to generate `components/ui/checkbox.tsx`
- [x] 1.2 Run `npx shadcn add radio-group` to generate `components/ui/radio-group.tsx`
- [x] 1.3 Run `npx shadcn add select` to generate `components/ui/select.tsx`
- [x] 1.4 Run `npx shadcn add switch` to generate `components/ui/switch.tsx`
- [x] 1.5 Run `npx shadcn add input` to generate `components/ui/input.tsx`

## 2. Extend Zustand Store

- [x] 2.1 Add `enabledSubCategories: Record<string, boolean>` to the store state in `hooks/useSelections.ts` (or the relevant store file)
- [x] 2.2 Add `setSubCategoryEnabled(subCategoryId: string, enabled: boolean)` action
- [x] 2.3 Update the selections-to-output logic to exclude sub-categories where `enabledSubCategories[id] === false`
- [x] 2.4 Add `SELECT_THRESHOLD = 5` constant to `lib/constants.ts`

## 3. Build FloatingOptionsPanel Component

- [x] 3.1 Create `components/category/FloatingOptionsPanel.tsx` — positioned `absolute left-full top-0 z-10`, renders when `activeCategory` is set
- [x] 3.2 Implement close-on-Escape keyboard handler inside `FloatingOptionsPanel`
- [x] 3.3 Implement close-on-outside-click using a `useEffect` with a `mousedown` document listener
- [x] 3.4 Add `role="region"` and `aria-label={activeCategory.name}` to the panel container
- [x] 3.5 Move focus to first interactive element inside the panel when it opens

## 4. Update SubCategoryInputs Component

- [x] 4.1 Replace raw `<input type="checkbox">` with shadcn `<Checkbox>` in `components/category/SubCategoryInputs.tsx`
- [x] 4.2 Replace raw `<input type="radio">` / radio groups with shadcn `<RadioGroup>` + `<RadioGroupItem>` for `select` type with < `SELECT_THRESHOLD` options
- [x] 4.3 Add shadcn `<Select>` rendering path for `select` type with ≥ `SELECT_THRESHOLD` options
- [x] 4.4 Replace raw `<input type="text">` with shadcn `<Input>` for `input` type
- [x] 4.5 Add shadcn `<Switch>` at the top of each sub-category block, wired to `setSubCategoryEnabled`
- [x] 4.6 Conditionally hide option controls when the sub-category's Switch is off

## 5. Update Category Panel Layout

- [x] 5.1 Wrap the left column in a `relative` container so the floating panel can anchor to it
- [x] 5.2 Update `components/category/CategoryList.tsx` — clicking a category calls `setActiveCategory`; clicking the already-active category calls `clearActiveCategory` (to close the panel)
- [x] 5.3 Render `<FloatingOptionsPanel>` inside the left column wrapper, visible when `activeCategory` is set
- [x] 5.4 Remove `<ChecklistArea>` from the layout entirely and delete `components/category/ChecklistArea.tsx`

## 6. Quality Gates

- [x] 6.1 Run `yarn typecheck` — no errors
- [x] 6.2 Run `yarn lint:fix` — no warnings
- [x] 6.3 Run `yarn format:write` — code formatted
- [ ] 6.4 Manually verify: opening the panel, switching categories, toggling Switches, selecting options, pressing Escape to close
- [ ] 6.5 Manually verify the preview panel still updates correctly when options are toggled on/off via Switches
