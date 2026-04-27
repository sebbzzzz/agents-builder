"use client"

import { useEffect, useRef } from "react"

import { useEditorContext } from "@/app/_contexts/EditorContext"
import { useDocumentStore } from "@/store/useDocumentStore"

const PLACEHOLDER = "Select options from the left to start your AGENTS.md"

export function CodeEditorView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const content = useDocumentStore((s) => s.content)
  const { mount, destroy } = useEditorContext()

  useEffect(() => {
    if (!containerRef.current) return
    mount(containerRef.current, content)
    return destroy
  }, []) // intentionally empty — editor is uncontrolled after mount

  return (
    <div className="relative h-full">
      {!content && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">{PLACEHOLDER}</p>
        </div>
      )}
      <div ref={containerRef} className="h-full overflow-hidden" />
    </div>
  )
}
