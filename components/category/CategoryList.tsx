"use client"

import {
  BookOpen,
  Briefcase,
  CheckCircle,
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
import { Switch } from "@/components/ui/switch"
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
  const enabledCategories = useAppStore((s) => s.enabledCategories)
  const setActiveCategory = useAppStore((s) => s.setActiveCategory)
  const clearActiveCategory = useAppStore((s) => s.clearActiveCategory)
  const toggleCategory = useAppStore((s) => s.toggleCategory)

  return (
    <nav className="flex-1 overflow-y-auto py-2">
      <ul className="flex flex-col">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id
          const isEnabled = enabledCategories.includes(category.id)
          const Icon = ICON_MAP[category.icon]

          return (
            <li key={category.id}>
              <div
                className={cn(
                  "flex items-center gap-2.5 border-l-2 px-3 transition-colors",
                  isActive ? "border-accent bg-surface" : "hover:bg-surface border-transparent",
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

                {/* Label button */}
                <button
                  onClick={() =>
                    isActive ? clearActiveCategory() : setActiveCategory(category.id)
                  }
                  className={cn(
                    "flex-1 py-2.5 text-left text-sm transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {category.label}
                </button>

                {/* Enable switch — right side */}
                <Switch
                  checked={isEnabled}
                  onCheckedChange={() => toggleCategory(category.id)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Enable ${category.label}`}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
