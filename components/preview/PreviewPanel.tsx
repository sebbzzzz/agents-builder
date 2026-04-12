"use client"

import { useAppStore } from "@/store/useAppStore"

import { EditorView } from "./EditorView"
import { PreviewHeader } from "./PreviewHeader"
import { RenderedView } from "./RenderedView"

export function PreviewPanel() {
  const activeView = useAppStore((s) => s.activeView)

  return (
    <>
      <PreviewHeader />
      <div className="min-h-0 flex-1">
        {/* Both views stay mounted so the CodeMirror instance is never destroyed */}
        <div className={activeView === "editor" ? "h-full" : "hidden"}>
          <EditorView />
        </div>
        <div className={activeView === "preview" ? "h-full" : "hidden"}>
          <RenderedView />
        </div>
      </div>
    </>
  )
}
