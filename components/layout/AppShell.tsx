"use client"

import { useEffect, useRef } from "react"

import { CategoryHeader } from "@/components/category/CategoryHeader"
import { CategoryList } from "@/components/category/CategoryList"
import { FloatingOptionsPanel } from "@/components/category/FloatingOptionsPanel"
import { PreviewPanel } from "@/components/preview/PreviewPanel"
import { buildAgentsFile } from "@/lib/buildAgentsFile"
import { useAppStore } from "@/store/useAppStore"

export function AppShell() {
  const columnRef = useRef<HTMLElement>(null)
  const selections = useAppStore((s) => s.selections)
  const enabledSubCategories = useAppStore((s) => s.enabledSubCategories)
  const skillTriggers = useAppStore((s) => s.skillTriggers)
  const setMarkdownOutput = useAppStore((s) => s.setMarkdownOutput)

  useEffect(() => {
    setMarkdownOutput(buildAgentsFile(selections, enabledSubCategories, skillTriggers))
  }, [selections, enabledSubCategories, skillTriggers, setMarkdownOutput])

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Left column — 30% */}
      <aside ref={columnRef} className="border-border bg-surface relative flex h-full w-[30%] max-w-[280px] flex-col border-r">
        <CategoryHeader />
        <CategoryList />
        <FloatingOptionsPanel columnRef={columnRef} />
      </aside>

      {/* Right column — 70% */}
      <main className="bg-background flex h-full flex-1 flex-col">
        <PreviewPanel />
      </main>
    </div>
  )
}
