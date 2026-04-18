"use client"

import { CATEGORIES } from "@/data/categories"
import { resolveVisibleSubCategories } from "@/lib/resolveVisibleSubCategories"
import { useAppStore } from "@/store/useAppStore"
import { SubCategoryInputs } from "@/components/category/SubCategoryInputs"

export function ChecklistArea() {
  const activeCategory = useAppStore((s) => s.activeCategory)
  const selections = useAppStore((s) => s.selections)
  const toggleSelection = useAppStore((s) => s.toggleSelection)
  const setSelection = useAppStore((s) => s.setSelection)

  const category = CATEGORIES.find((c) => c.id === activeCategory)

  if (!activeCategory || !category) {
    return (
      <div className="border-border border-t px-4 py-6">
        <p className="text-muted-foreground text-xs">Select a category to explore its options</p>
      </div>
    )
  }

  const visibleSubCategories = resolveVisibleSubCategories(category.subCategories, selections)

  return (
    <div className="border-border flex-1 overflow-y-auto border-t px-4 py-4">
      <p className="text-muted-foreground mb-4 text-xs font-medium tracking-wider uppercase">
        {category.label}
      </p>
      {visibleSubCategories.length === 0 ? (
        <p className="text-muted-foreground text-xs">Options coming soon</p>
      ) : (
        visibleSubCategories.map((sub) => (
          <SubCategoryInputs
            key={sub.id}
            subCategory={sub}
            selected={selections[sub.id] ?? []}
            onToggle={(optionId) => toggleSelection(sub.id, optionId)}
            onSelect={(value) => setSelection(sub.id, value)}
          />
        ))
      )}
    </div>
  )
}
