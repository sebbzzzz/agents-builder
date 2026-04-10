"use client"

import { useAppStore } from "@/store/useAppStore"

const PLACEHOLDER = "Select options from the left to build your AGENTS.md"

export function CodeView() {
  const markdownOutput = useAppStore((s) => s.markdownOutput)

  if (!markdownOutput) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-sm">{PLACEHOLDER}</p>
      </div>
    )
  }

  return (
    <pre className="text-foreground h-full overflow-y-auto p-4 font-mono text-sm leading-relaxed">
      {markdownOutput}
    </pre>
  )
}
