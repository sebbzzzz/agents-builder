"use client"

import { useRef } from "react"

import { CategoryHeader } from "@/app/_components/category/CategoryHeader"
import { CategoryList } from "@/app/_components/category/CategoryList"
import { FloatingOptionsPanel } from "@/app/_components/category/FloatingOptionsPanel"
import { PreviewPanel } from "@/app/_components/preview/PreviewPanel"
import { EditorProvider } from "@/common/providers/EditorContext"
import { useAppStore } from "@/store/useAppStore"

export default function AgentsBuilder() {
  const columnRef = useRef<HTMLElement>(null)
  const activeCategory = useAppStore((s) => s.activeCategory)

  return (
    <EditorProvider>
      <CategoryHeader />

      <div className="flex flex-1 overflow-hidden">
        <aside
          ref={columnRef}
          className="border-border relative flex h-full max-w-70 flex-col border-r md:w-[30%]"
        >
          <CategoryList />
          {activeCategory && <FloatingOptionsPanel columnRef={columnRef} />}
        </aside>

        <main className="bg-background flex h-full flex-1 flex-col">
          <PreviewPanel />
        </main>
      </div>
    </EditorProvider>
  )
}
