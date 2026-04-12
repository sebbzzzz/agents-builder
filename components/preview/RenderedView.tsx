"use client"

import { Suspense, lazy } from "react"

import { assembleDocument } from "@/lib/assembleDocument"
import { useDocumentStore } from "@/store/useDocumentStore"

const ReactMarkdown = lazy(() => import("react-markdown"))

const PLACEHOLDER = "Select options from the left to build your AGENTS.md"

export function RenderedView() {
  const nodes = useDocumentStore((s) => s.nodes)
  const content = assembleDocument(nodes)

  if (!content) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground text-sm">{PLACEHOLDER}</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-4">
      <Suspense fallback={<p className="text-muted-foreground text-sm">Loading…</p>}>
        <article className="prose prose-invert prose-sm max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </Suspense>
    </div>
  )
}
