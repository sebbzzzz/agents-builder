"use client"

import { useEffect, useRef } from "react"

import { useEditorContext } from "@/common/providers/EditorContext"
import { useDocumentStore } from "@/store/useDocumentStore"

export function CodeEditorView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const content = useDocumentStore((s) => s.content)
  const { mount, destroy } = useEditorContext()

  useEffect(() => {
    if (!containerRef.current) return
    mount(containerRef.current, content)
    return destroy
  }, []) // intentionally empty — editor is uncontrolled after mount

  return <div ref={containerRef} className="h-full overflow-hidden" />
}
