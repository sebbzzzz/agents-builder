"use client"

import { CATEGORIES } from "@/data/categories"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/useAppStore"

export function CategoryList() {
  const activeCategory = useAppStore((s) => s.activeCategory)
  const enabledCategories = useAppStore((s) => s.enabledCategories)
  const setActiveCategory = useAppStore((s) => s.setActiveCategory)
  const toggleCategory = useAppStore((s) => s.toggleCategory)

  return (
    <nav className="flex-1 overflow-y-auto py-2">
      <ul className="flex flex-col">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id
          const isEnabled = enabledCategories.includes(category.id)
          return (
            <li key={category.id}>
              <div
                className={cn(
                  "flex items-center border-l-2 transition-colors",
                  isActive ? "border-accent bg-surface" : "hover:bg-surface border-transparent",
                )}
              >
                <input
                  type="checkbox"
                  checked={isEnabled}
                  onChange={() => toggleCategory(category.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="accent-accent ml-3 h-3.5 w-3.5 flex-shrink-0 cursor-pointer"
                />
                <button
                  onClick={() => setActiveCategory(category.id)}
                  className={cn(
                    "flex-1 px-3 py-2.5 text-left text-sm transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {category.label}
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
