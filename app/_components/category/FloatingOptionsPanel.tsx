"use client"

import { type RefObject, useEffect, useRef, useState } from "react"
import { Loader2, X } from "lucide-react"

import { CATEGORIES, type Option, type SubCategory } from "@/data/categories"
import { TRIGGER_TEMPLATE_MAP } from "@/app/_utils/constants"
import { useFetchSkills } from "@/app/_hooks/useFetchSkills"
import { useAppStore } from "@/store/useAppStore"
import { useEditorContext } from "@/common/providers/EditorContext"

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
  const { skills: liveSkills, isLoading: skillsLoading } = useFetchSkills()

  const panelRef = useRef<HTMLDivElement>(null)
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [inputValues, setInputValues] = useState<Record<string, string>>({})
  const [skillTriggers, setSkillTriggers] = useState<Record<string, string[]>>({})

  const category = CATEGORIES.find((c) => c.id === activeCategory)

  useEffect(() => {
    setSelections({})
    setInputValues({})
    setSkillTriggers({})
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
      if (target.closest(".driver-popover")) return
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

  // For the skills category, override static options with live data
  function getOptionsForSub(sub: SubCategory): Option[] {
    if (sub.type === "skills" && activeCategory === "available-skills") {
      return liveSkills
    }
    return sub.options
  }

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

  function handleInputChange(optionId: string, value: string) {
    setInputValues((prev) => ({ ...prev, [optionId]: value }))
  }

  function handleSkillTriggerToggle(skillId: string, triggerId: string) {
    setSkillTriggers((prev) => {
      const current = prev[skillId] ?? []
      const next = current.includes(triggerId)
        ? current.filter((id) => id !== triggerId)
        : [...current, triggerId]
      return { ...prev, [skillId]: next }
    })
  }

  function handleAdd() {
    for (const sub of visibleSubCategories) {
      if (sub.type === "input") {
        for (const opt of sub.options) {
          const val = inputValues[opt.id]?.trim()
          if (val) {
            injectOption(category!.label, opt.prompt.replace("{value}", val))
          }
        }
      } else if (sub.type === "skills") {
        const subSelectedSet = new Set(selections[sub.id] ?? [])
        const opts = getOptionsForSub(sub)
        for (const opt of opts) {
          if (subSelectedSet.has(opt.id)) {
            injectOption("Skills", opt.prompt)
            const triggers = skillTriggers[opt.id] ?? []
            for (const tplId of triggers) {
              const tpl = TRIGGER_TEMPLATE_MAP.get(tplId)
              if (tpl) {
                injectOption("Auto-invoke Skills", tpl.prompt.replace("{skill}", opt.label))
              }
            }
          }
        }
      } else {
        const subSelectedSet = new Set(selections[sub.id] ?? [])
        for (const opt of sub.options) {
          if (subSelectedSet.has(opt.id)) {
            injectOption(category!.label, opt.prompt)
          }
        }
      }
    }
    setSelections({})
    setInputValues({})
    setSkillTriggers({})
  }

  const hasSelections =
    allSelectedIds.size > 0 ||
    Object.values(inputValues).some((v) => v.trim().length > 0) ||
    Object.values(skillTriggers).some((t) => t.length > 0)

  return (
    <div
      ref={panelRef}
      role="region"
      aria-label={category.label}
      data-onboarding="floating-panel"
      className="border-border bg-surface absolute top-0 left-full z-10 flex h-full w-72 flex-col overflow-hidden border-r-2 shadow-lg md:w-80"
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
        {activeCategory === "available-skills" && skillsLoading && (
          <div className="text-muted-foreground mb-3 flex items-center gap-1.5 text-xs">
            <Loader2 size={10} className="animate-spin" />
            Loading live skills…
          </div>
        )}

        {visibleSubCategories.length === 0 ? (
          <p className="text-muted-foreground text-xs">No options available.</p>
        ) : (
          visibleSubCategories.map((sub) => {
            const subSelected = selections[sub.id] ?? []
            return (
              <SubCategoryInputs
                key={sub.id}
                subCategory={{ ...sub, options: getOptionsForSub(sub) }}
                selected={subSelected}
                onToggle={(optionId) => handleToggle(sub.id, optionId)}
                onSelect={(optionId) => handleSelect(sub.id, optionId)}
                inputValues={inputValues}
                onInputChange={handleInputChange}
                skillTriggers={skillTriggers}
                onSkillTriggerToggle={handleSkillTriggerToggle}
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
