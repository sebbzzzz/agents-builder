"use client"

import {
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronRight,
  GitBranch,
  Grid,
  type LucideProps,
  Layers,
  Paintbrush,
  PlayCircle,
  ShieldOff,
  Terminal,
  Zap,
} from "lucide-react"

import { CATEGORIES } from "@/data/categories"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/useAppStore"

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Layers,
  Briefcase,
  Zap,
  PlayCircle,
  GitBranch,
  Paintbrush,
  BookOpen,
  Grid,
  ShieldOff,
  Terminal,
  CheckCircle,
}

export function CategoryList() {
  const activeCategory = useAppStore((s) => s.activeCategory)
  const setActiveCategory = useAppStore((s) => s.setActiveCategory)
  const clearActiveCategory = useAppStore((s) => s.clearActiveCategory)

  return (
    <nav className="flex-1 overflow-y-auto py-2">
      <ul className="flex flex-col">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id
          const Icon = ICON_MAP[category.icon]

          return (
            <li key={category.id}>
              <button
                onClick={() =>
                  isActive ? clearActiveCategory() : setActiveCategory(category.id)
                }
                className={cn(
                  "flex w-full items-center gap-2.5 border-l-2 px-3 transition-colors",
                  isActive
                    ? "border-accent bg-accent/10 text-foreground"
                    : "border-transparent text-muted-foreground hover:bg-surface hover:text-foreground",
                )}
              >
                {/* Category icon */}
                {Icon && (
                  <Icon
                    size={13}
                    className={cn(
                      "flex-shrink-0 transition-colors",
                      isActive ? "text-accent" : "text-muted-foreground",
                    )}
                  />
                )}

                {/* Label */}
                <span className="flex-1 py-2.5 text-left text-sm">{category.label}</span>

                {/* Chevron — right side */}
                <ChevronRight
                  size={13}
                  className={cn(
                    "flex-shrink-0 transition-colors",
                    isActive ? "text-accent" : "text-muted-foreground",
                  )}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
