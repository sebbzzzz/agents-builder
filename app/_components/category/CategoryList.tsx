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
import { useWindowWidth } from "@/common/hooks/useWindowWidth"
import { cn } from "@/common/utils/cn"
import { useAppStore } from "@/store/useAppStore"
import { MOBILE_BREAKPOINT_PX } from "@/app/_utils/constants"

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

  const width = useWindowWidth()
  const isMobile = width < MOBILE_BREAKPOINT_PX

  return (
    <nav className="flex-1 overflow-y-auto">
      <ul className="flex flex-col">
        {CATEGORIES.map((category) => {
          const isActive = activeCategory === category.id
          const Icon = ICON_MAP[category.icon]

          return (
            <li key={category.id}>
              <button
                onClick={() => (isActive ? clearActiveCategory() : setActiveCategory(category.id))}
                className={cn(
                  "flex w-full items-center gap-2.5 border-l-2 p-3 transition-colors md:py-0",
                  isActive
                    ? "border-accent bg-surface text-foreground"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground border-transparent",
                )}
              >
                {/* Category icon */}
                {Icon && (
                  <Icon
                    size={isMobile ? 21 : 13}
                    className={cn(
                      "shrink-0 transition-colors",
                      isActive ? "text-accent" : "text-muted-foreground",
                    )}
                  />
                )}

                {/* Label */}
                <span className="hidden flex-1 py-2.5 text-left text-sm md:block">
                  {category.label}
                </span>

                {/* Chevron — right side */}
                <ChevronRight
                  size={13}
                  className={cn(
                    "hidden shrink-0 transition-colors md:block",
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
