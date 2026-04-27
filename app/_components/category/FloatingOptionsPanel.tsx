"use client"

import { type RefObject, useEffect, useRef, useState } from "react"
import { X } from "lucide-react"

import { CATEGORIES, type SubCategory } from "@/data/categories"
import { useAppStore } from "@/store/useAppStore"
import { useEditorContext } from "@/app/_contexts/EditorContext"

import { SubCategoryInputs } from "./SubCategoryInputs"

interface FloatingOptionsPanelProps {
  columnRef: RefObject<HTMLElement | null>
}

function isSubCategoryVisible(sub: SubCategory, selectedIds: Set<string>): boolean {
  if (!sub.visibleWhen || sub.visibleWhen.length === 0) return true
  return sub.visibleWhen.some((id) => selectedIds.has(id))
}

export function FloatingOptionsPanel({ columnRef }: FloatingOptionsPanelProps) {
  const activeCategory = useAppStore((s) => s.activeCategory)
  const clearActiveCategory = useAppStore((s) => s.clearActiveCategory)

  const { injectOption } = useEditorContext()

  const panelRef = useRef<HTMLDivElement>(null)
  const [selections, setSelections] = useState<Record<string, string[]>>({})

  const category = CATEGORIES.find((c) => c.id === activeCategory)

  useEffect(() => {
    setSelections({})
  }, [activeCategory])

  useEffect(() => {
    if (!activeCategory) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearActiveCategory()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [activeCategory, clearActiveCategory])

  useEffect(() => {
    if (!activeCategory) return
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest("[data-base-ui-portal]")) return
      const isInsidePanel = panelRef.current?.contains(target)
      const isInsideColumn = columnRef.current?.contains(target)
      if (!isInsidePanel && !isInsideColumn) clearActiveCategory()
    }
    document.addEventListener("mousedown", handleMouseDown)
    return () => document.removeEventListener("mousedown", handleMouseDown)
  }, [activeCategory, clearActiveCategory, columnRef])

  if (!activeCategory || !category) return null

  const allSelectedIds = new Set(Object.values(selections).flat())
  const visibleSubCategories = category.subCategories.filter((sub) =>
    isSubCategoryVisible(sub, allSelectedIds),
  )

  function handleToggle(subId: string, optionId: string) {
    setSelections((prev) => {
      const current = prev[subId] ?? []
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
      return { ...prev, [subId]: next }
    })
  }

  function handleSelect(subId: string, optionId: string | null) {
    setSelections((prev) => ({ ...prev, [subId]: optionId ? [optionId] : [] }))
  }

  function handleAdd() {
    for (const sub of visibleSubCategories) {
      const subSelected = selections[sub.id] ?? []
      for (const opt of sub.options) {
        if (subSelected.includes(opt.id)) {
          injectOption(category!.label, opt.prompt)
        }
      }
    }
    setSelections({})
  }

  const hasSelections = allSelectedIds.size > 0

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label={category.label}
      className="border-border bg-surface absolute top-0 left-full z-10 flex h-full w-72 flex-col overflow-hidden border-r shadow-lg"
    >
      <div className="border-border flex items-center justify-between border-b px-4 py-2.5">
        <p className="text-foreground text-sm font-semibold">{category.label}</p>
        <button
          onClick={clearActiveCategory}
          aria-label="Close options panel"
          className="text-muted-foreground hover:text-foreground rounded p-0.5 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {visibleSubCategories.length === 0 ? (
          <p className="text-muted-foreground text-xs">No options available.</p>
        ) : (
          visibleSubCategories.map((sub) => {
            const subSelected = selections[sub.id] ?? []
            return (
              <SubCategoryInputs
                key={sub.id}
                subCategory={sub}
                selected={subSelected}
                onToggle={(optionId) => handleToggle(sub.id, optionId)}
                onSelect={(optionId) => handleSelect(sub.id, optionId)}
              />
            )
          })
        )}
      </div>

      <div className="border-border border-t px-4 py-3">
        <button
          onClick={handleAdd}
          disabled={!hasSelections}
          className="bg-accent text-accent-foreground hover:bg-accent/90 w-full rounded px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add to document
        </button>
      </div>
    </div>
  )
}
