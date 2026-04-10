"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { useAppStore } from "@/store/useAppStore"

const PLACEHOLDER = "# AGENTS.md\n\nSelect options from the left to build your AGENTS.md"

export function PreviewHeader() {
  const activeView = useAppStore((s) => s.activeView)
  const markdownOutput = useAppStore((s) => s.markdownOutput)
  const setActiveView = useAppStore((s) => s.setActiveView)

  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(markdownOutput || PLACEHOLDER)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleExport() {
    const content = markdownOutput || PLACEHOLDER
    const blob = new Blob([content], { type: "text/markdown" })
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
          onClick={() => setActiveView("code")}
          className={cn(
            "rounded px-3 py-1 text-xs font-medium transition-colors",
            activeView === "code"
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          Code
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
          onClick={handleCopy}
          className="border-border text-muted-foreground hover:border-accent hover:text-accent rounded border px-3 py-1 text-xs transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={handleExport}
          className="bg-accent text-accent-foreground rounded px-3 py-1 text-xs font-medium transition-opacity hover:opacity-90"
        >
          Export .md
        </button>
      </div>
    </div>
  )
}
