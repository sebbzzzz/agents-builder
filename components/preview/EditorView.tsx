"use client"

import { useEffect, useRef } from "react"

import type { Text } from "@codemirror/state"
import type { EditorView as CMEditorView, ViewUpdate } from "@codemirror/view"

import { useAutoSave } from "@/hooks/useAutoSave"
import { useFragmentSync } from "@/hooks/useFragmentSync"
import { parseAnchors } from "@/lib/anchorParser"
import { useAppStore } from "@/store/useAppStore"
import { useDocumentStore } from "@/store/useDocumentStore"

const PLACEHOLDER = "Select options from the left to start your AGENTS.md"

export function EditorView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorViewRef = useRef<CMEditorView | null>(null)

  const content = useDocumentStore((s) => s.content)
  const setIsDirty = useDocumentStore((s) => s.setIsDirty)
  const setEnabledCategories = useAppStore((s) => s.setEnabledCategories)
  const setSelections = useAppStore((s) => s.setSelections)

  const scheduleAutoSave = useAutoSave()

  useFragmentSync(editorViewRef)

  // Stable ref so the updateListener always calls the latest reconcile logic
  // without needing to reconfigure the CodeMirror extensions.
  const reconcileRef = useRef<(doc: Text) => void>(() => {})
  reconcileRef.current = (doc: Text) => {
    const anchorIds = new Set(parseAnchors(doc).map((r) => r.id))
    const { enabledCategories, selections } = useAppStore.getState()

    // ── Categories: uncheck any whose preset anchor was deleted ───────────────
    const removedCategories = new Set(enabledCategories.filter((id) => !anchorIds.has(id)))
    const nextEnabled = enabledCategories.filter((id) => !removedCategories.has(id))

    // ── Items: uncheck any whose fragment anchor was deleted ──────────────────
    const nextSelections = { ...selections }
    let selectionsChanged = removedCategories.size > 0

    for (const catId of enabledCategories) {
      if (removedCategories.has(catId)) {
        // Whole category removed — clear its selections
        delete nextSelections[catId]
        continue
      }
      const selectedItems = selections[catId] ?? []
      const remaining = selectedItems.filter((itemId) => anchorIds.has(itemId))
      if (remaining.length !== selectedItems.length) {
        nextSelections[catId] = remaining
        selectionsChanged = true
      }
    }

    if (removedCategories.size > 0) setEnabledCategories(nextEnabled)
    if (selectionsChanged) setSelections(nextSelections)
  }

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
          doc: content,
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
                reconcileRef.current(update.state.doc)
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
      {!content && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">{PLACEHOLDER}</p>
        </div>
      )}
      <div ref={containerRef} className="h-full overflow-hidden" />
    </div>
  )
}
