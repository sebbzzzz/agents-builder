import type { SubCategory } from "@/data/categories"

/**
 * Returns only the sub-categories that should be rendered given the current
 * selections.
 *
 * A sub-category is visible when:
 *  - it has no `visibleWhen` array (always visible), OR
 *  - at least one ID in its `visibleWhen` array appears anywhere in the
 *    flattened selections values.
 */
export function resolveVisibleSubCategories(
  subCategories: SubCategory[],
  selections: Record<string, string[]>,
): SubCategory[] {
  const allSelectedIds = new Set(Object.values(selections).flat())

  return subCategories.filter((sub) => {
    if (!sub.visibleWhen || sub.visibleWhen.length === 0) return true
    return sub.visibleWhen.some((id) => allSelectedIds.has(id))
  })
}
