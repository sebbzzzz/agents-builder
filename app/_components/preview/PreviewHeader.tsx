"use client"

import { useState } from "react"

import { cn } from "@/common/utils/cn"
import { useEditorContext } from "@/common/providers/EditorContext"
import { AnalyticsEvent, trackEvent } from "@/app/_utils/analytics"
import { stripMarkers } from "@/app/_utils/stripMarkers"
import { useAppStore } from "@/store/useAppStore"
import { useDocumentStore } from "@/store/useDocumentStore"

export function PreviewHeader() {
  const activeView = useAppStore((s) => s.activeView)
  const setActiveView = useAppStore((s) => s.setActiveView)
  const content = useDocumentStore((s) => s.content)
  const { save } = useEditorContext()

  const [copied, setCopied] = useState(false)

  const hasContent = content.length > 0

  function handleCopy() {
    save()
    navigator.clipboard.writeText(stripMarkers(useDocumentStore.getState().content))
    trackEvent(AnalyticsEvent.CopyDocument)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleExport() {
    save()
    trackEvent(AnalyticsEvent.ExportDocument)
    const blob = new Blob([stripMarkers(useDocumentStore.getState().content)], {
      type: "text/markdown",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "AGENTS.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="border-border flex items-center justify-between border-b">
      {/* View toggle */}
      <div className="flex">
        <button
          onClick={() => setActiveView("editor")}
          className={cn(
            "px-5 py-3 text-xs font-medium transition-colors",
            activeView === "editor"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Editor
        </button>
        <button
          onClick={() => {
            save()
            setActiveView("preview")
          }}
          className={cn(
            "px-5 py-3 text-xs font-medium transition-colors",
            activeView === "preview"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground border-r",
          )}
        >
          Preview
        </button>
      </div>

      {/* Action buttons */}
      <div data-onboarding="export-buttons" className="flex items-center">
        <button
          disabled={!hasContent}
          onClick={handleCopy}
          className="text-muted-foreground hover:text-accent border-x px-5 py-3 text-xs transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          disabled={!hasContent}
          onClick={handleExport}
          className="bg-accent text-accent-foreground px-5 py-3 text-xs font-medium transition-opacity hover:opacity-90"
        >
          Export.md
        </button>
      </div>
    </div>
  )
}
