"use client"

import { CATEGORIES } from "@/data/categories"
import { useAppStore } from "@/store/useAppStore"

export function ChecklistArea() {
  const activeCategory = useAppStore((s) => s.activeCategory)

  const category = CATEGORIES.find((c) => c.id === activeCategory)

  if (!activeCategory) {
    return (
      <div className="border-border border-t px-4 py-6">
        <p className="text-muted-foreground text-xs">Select a category to explore its options</p>
      </div>
    )
  }

  return (
    <div className="border-border flex-1 overflow-y-auto border-t px-4 py-4">
      <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
        {category?.label}
      </p>
      <p className="text-muted-foreground text-xs">Options coming soon</p>
    </div>
  )
}
