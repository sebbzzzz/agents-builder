"use client"

import { useRef } from "react"

import { CategoryHeader } from "@/app/_components/category/CategoryHeader"
import { CategoryList } from "@/app/_components/category/CategoryList"
import { FloatingOptionsPanel } from "@/app/_components/category/FloatingOptionsPanel"
import { OnboardingTour } from "@/app/_components/onboarding/OnboardingTour"
import { PreviewPanel } from "@/app/_components/preview/PreviewPanel"
import { EditorProvider } from "@/common/providers/EditorContext"
import { useAppStore } from "@/store/useAppStore"

export default function Home() {
  const columnRef = useRef<HTMLElement>(null)
  const activeCategory = useAppStore((s) => s.activeCategory)

  return (
    <EditorProvider>
      <OnboardingTour />
      <CategoryHeader />

      <div className="flex flex-1 overflow-hidden">
        <aside
          ref={columnRef}
          data-onboarding="sidebar"
          className="border-border relative flex h-full max-w-70 flex-col border-r md:w-[30%]"
        >
          <CategoryList />
          {activeCategory && <FloatingOptionsPanel columnRef={columnRef} />}
        </aside>

        <main data-onboarding="editor" className="bg-background flex h-full flex-1 flex-col">
          <PreviewPanel />
        </main>
      </div>
    </EditorProvider>
  )
}
