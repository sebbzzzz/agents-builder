"use client"

import { CATEGORIES } from "@/data/categories"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/useAppStore"

export function CategoryList() {
  const activeCategory = useAppStore((s) => s.activeCategory)
  const setActiveCategory = useAppStore((s) => s.setActiveCategory)

  return (
    <nav className="flex-1 overflow-y-auto py-2">
      <ul className="flex flex-col">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id
          return (
            <li key={category.id}>
              <button
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  "w-full px-4 py-2.5 text-left text-sm transition-colors",
                  isActive
                    ? "border-accent bg-surface text-foreground border-l-2 pl-[14px]"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground border-l-2 border-transparent",
                )}
              >
                {category.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
