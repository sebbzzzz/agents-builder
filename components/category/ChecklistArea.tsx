"use client"

import { CATEGORIES } from "@/data/categories"
import { OPTIONS } from "@/data/options"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/useAppStore"

export function ChecklistArea() {
  const activeCategory = useAppStore((s) => s.activeCategory)
  const selections = useAppStore((s) => s.selections)
  const toggleSelection = useAppStore((s) => s.toggleSelection)

  const category = CATEGORIES.find((c) => c.id === activeCategory)
  const options = activeCategory ? (OPTIONS[activeCategory] ?? []) : []

  if (!activeCategory) {
    return (
      <div className="border-border border-t px-4 py-6">
        <p className="text-muted-foreground text-xs">Select a category to explore its options</p>
      </div>
    )
  }

  const selected = selections[activeCategory] ?? []

  return (
    <div className="border-border flex-1 overflow-y-auto border-t px-4 py-4">
      <p className="text-muted-foreground mb-3 text-xs font-medium tracking-wider uppercase">
        {category?.label}
      </p>
      <ul className="space-y-2">
        {options.map((opt) => {
          const checked = selected.includes(opt.id)
          return (
            <li key={opt.id}>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleSelection(activeCategory, opt.id)}
                  className={cn("accent-accent h-3.5 w-3.5 cursor-pointer rounded")}
                />
                <span className="text-foreground text-xs">{opt.label}</span>
              </label>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
