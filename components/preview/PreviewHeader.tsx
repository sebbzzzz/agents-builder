"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { stripAnchors } from "@/lib/stripAnchors"
import { useAppStore } from "@/store/useAppStore"
import { useDocumentStore } from "@/store/useDocumentStore"

export function PreviewHeader() {
  const activeView = useAppStore((s) => s.activeView)
  const setActiveView = useAppStore((s) => s.setActiveView)
  const content = useDocumentStore((s) => s.content)

  const [copied, setCopied] = useState(false)

  const hasContent = content.length > 0
  const exportContent = stripAnchors(content)

  function handleCopy() {
    navigator.clipboard.writeText(exportContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleExport() {
    const blob = new Blob([exportContent], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "AGENTS.md"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="border-border flex items-center justify-between border-b px-4 py-3">
      {/* View toggle */}
      <div className="border-border flex rounded-md border p-0.5">
        <button
          onClick={() => setActiveView("editor")}
          className={cn(
            "rounded px-3 py-1 text-xs font-medium transition-colors",
            activeView === "editor"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Editor
        </button>
        <button
          onClick={() => setActiveView("preview")}
          className={cn(
            "rounded px-3 py-1 text-xs font-medium transition-colors",
            activeView === "preview"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Preview
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <button
          disabled={!hasContent}
          onClick={handleCopy}
          className="border-border text-muted-foreground hover:border-accent hover:text-accent rounded border px-3 py-1 text-xs transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          disabled={!hasContent}
          onClick={handleExport}
          className="bg-accent text-accent-foreground rounded px-3 py-1 text-xs font-medium transition-opacity hover:opacity-90"
        >
          Export .md
        </button>
      </div>
    </div>
  )
}
