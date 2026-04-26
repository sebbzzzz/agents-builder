"use client"

import { type RefObject, useEffect, useRef } from "react"
import { X } from "lucide-react"

import { CATEGORIES } from "@/data/categories"
import { resolveVisibleSubCategories } from "@/lib/resolveVisibleSubCategories"
import { useAppStore } from "@/store/useAppStore"
import { Switch } from "@/components/ui/switch"
import { SubCategoryInputs } from "@/components/category/SubCategoryInputs"

interface FloatingOptionsPanelProps {
  columnRef: RefObject<HTMLElement | null>
}

export function FloatingOptionsPanel({ columnRef }: FloatingOptionsPanelProps) {
  const activeCategory = useAppStore((s) => s.activeCategory)
  const clearActiveCategory = useAppStore((s) => s.clearActiveCategory)
  const enabledCategories = useAppStore((s) => s.enabledCategories)
  const toggleCategory = useAppStore((s) => s.toggleCategory)
  const selections = useAppStore((s) => s.selections)
  const enabledSubCategories = useAppStore((s) => s.enabledSubCategories)
  const skillTriggers = useAppStore((s) => s.skillTriggers)
  const setSubCategoryEnabled = useAppStore((s) => s.setSubCategoryEnabled)
  const setSkillTrigger = useAppStore((s) => s.setSkillTrigger)
  const toggleSelection = useAppStore((s) => s.toggleSelection)
  const setSelection = useAppStore((s) => s.setSelection)

  const panelRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLElement | null>(null)

  const category = CATEGORIES.find((c) => c.id === activeCategory)
  const isCategoryEnabled = activeCategory ? enabledCategories.includes(activeCategory) : false

  // Close on Escape
  useEffect(() => {
    if (!activeCategory) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearActiveCategory()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [activeCategory, clearActiveCategory])

  // Close on outside click — excludes the left column, the panel itself,
  // and any Radix portals (selects, tooltips, etc.)
  useEffect(() => {
    if (!activeCategory) return

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Element

      // Ignore clicks inside Base UI portals (select dropdowns, tooltips, etc.)
      if (target.closest("[data-base-ui-portal]")) return

      const isInsidePanel = panelRef.current?.contains(target)
      const isInsideColumn = columnRef.current?.contains(target)

      if (!isInsidePanel && !isInsideColumn) {
        clearActiveCategory()
      }
    }

    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [activeCategory, clearActiveCategory, columnRef])

  // Focus first interactive element on open
  useEffect(() => {
    if (!activeCategory || !panelRef.current) return

    const focusable = panelRef.current.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusable) {
      firstFocusableRef.current = focusable
      focusable.focus()
    }
  }, [activeCategory])

  if (!activeCategory || !category) return null

  const visibleSubCategories = resolveVisibleSubCategories(category.subCategories, selections)

  // Collect selected skill IDs across all skills sub-categories in this category
  const selectedSkillIds = category.subCategories
    .filter((s) => s.type === "skills")
    .flatMap((s) => selections[s.id] ?? [])

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label={category.label}
      className="border-border bg-surface absolute top-0 left-full z-10 flex h-full w-72 flex-col overflow-hidden border-r shadow-lg"
    >
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <Switch
            checked={isCategoryEnabled}
            onCheckedChange={() => toggleCategory(activeCategory!)}
            aria-label={`Enable ${category.label}`}
          />
          <p className="text-foreground text-sm font-semibold">{category.label}</p>
        </div>
        <button
          onClick={clearActiveCategory}
          aria-label="Close options panel"
          className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Sub-category list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {visibleSubCategories.length === 0 ? (
          <p className="text-muted-foreground text-xs">Options coming soon</p>
        ) : (
          visibleSubCategories.map((sub) => (
            <SubCategoryInputs
              key={sub.id}
              subCategory={sub}
              selected={selections[sub.id] ?? []}
              isEnabled={enabledSubCategories[sub.id] === true}
              onEnabledChange={(enabled) => setSubCategoryEnabled(sub.id, enabled)}
              onToggle={(optionId) => toggleSelection(sub.id, optionId)}
              onSelect={(value) => setSelection(sub.id, value)}
              selectedSkillIds={selectedSkillIds}
              skillTriggers={skillTriggers}
              onTriggerChange={setSkillTrigger}
            />
          ))
        )}
      </div>
    </div>
  )
}
