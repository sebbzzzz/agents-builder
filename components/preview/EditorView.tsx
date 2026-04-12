"use client"

import { useEffect, useRef } from "react"

import type { EditorView as CMEditorView, ViewUpdate } from "@codemirror/view"

import { useAutoSave } from "@/hooks/useAutoSave"
import { useSectionInjector } from "@/hooks/useSectionInjector"
import { assembleDocument } from "@/lib/assembleDocument"
import { useDocumentStore } from "@/store/useDocumentStore"

export function EditorView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<CMEditorView | null>(null)

  const nodes = useDocumentStore((s) => s.nodes)
  const setIsDirty = useDocumentStore((s) => s.setIsDirty)

  const scheduleAutoSave = useAutoSave()

  // Watches selections and dispatches section injection transactions
  useSectionInjector(editorViewRef)

  useEffect(() => {
    if (!containerRef.current) return

    let view: CMEditorView

    async function init() {
      const { EditorView, keymap } = await import("@codemirror/view")
      const { EditorState } = await import("@codemirror/state")
      const { history, defaultKeymap, historyKeymap } = await import("@codemirror/commands")
      const { markdown } = await import("@codemirror/lang-markdown")
      const { oneDark } = await import("@codemirror/theme-one-dark")

      view = new EditorView({
        state: EditorState.create({
          doc: assembleDocument(nodes),
          extensions: [
            history(),
            markdown(),
            oneDark,
            keymap.of([...defaultKeymap, ...historyKeymap]),
            EditorView.lineWrapping,
            EditorView.updateListener.of((update: ViewUpdate) => {
              if (update.docChanged) {
                setIsDirty(true)
                scheduleAutoSave(update.state.doc.toString())
              }
            }),
            EditorView.theme({
              "&": { height: "100%", fontSize: "13px" },
              ".cm-scroller": { overflow: "auto", fontFamily: "var(--font-mono, monospace)" },
              ".cm-content": { padding: "16px" },
            }),
          ],
        }),
        parent: containerRef.current!,
      })

      editorViewRef.current = view
    }

    init()

    return () => {
      view?.destroy()
      editorViewRef.current = null
    }
  }, []) // intentionally empty — editor is uncontrolled after mount

  return (
    <div className="relative h-full">
      <div ref={containerRef} className="h-full overflow-hidden" />
    </div>
  )
}
