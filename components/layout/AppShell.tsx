"use client"

import { useEffect } from "react"

import { CategoryHeader } from "@/components/category/CategoryHeader"
import { CategoryList } from "@/components/category/CategoryList"
import { ChecklistArea } from "@/components/category/ChecklistArea"
import { PreviewPanel } from "@/components/preview/PreviewPanel"
import { buildAgentsFile } from "@/lib/buildAgentsFile"
import { useAppStore } from "@/store/useAppStore"

export function AppShell() {
  const selections = useAppStore((s) => s.selections)
  const setMarkdownOutput = useAppStore((s) => s.setMarkdownOutput)

  useEffect(() => {
    setMarkdownOutput(buildAgentsFile(selections))
  }, [selections, setMarkdownOutput])

  return (
    <div className="flex h-dvh overflow-hidden">
      {/* Left column — 30% */}
      <aside className="border-border bg-surface flex h-full w-[30%] flex-col border-r">
        <CategoryHeader />
        <CategoryList />
        <ChecklistArea />
      </aside>

      {/* Right column — 70% */}
      <main className="bg-background flex h-full w-[70%] flex-col">
        <PreviewPanel />
      </main>
    </div>
  )
}
