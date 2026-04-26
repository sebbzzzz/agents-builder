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
    <>
      <CategoryHeader />

      <div className="flex h-dvh overflow-hidden">
        <aside
          ref={columnRef}
          className="border-border relative flex h-full max-w-70 flex-col border-r md:w-[30%]"
        >
          <CategoryList />
          <FloatingOptionsPanel columnRef={columnRef} />
        </aside>

        <main className="bg-background flex h-full flex-1 flex-col">
          <PreviewPanel />
        </main>
      </div>
    </>
  )
}
