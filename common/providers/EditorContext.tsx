"use client"

import { createContext, useCallback, useContext, useMemo, useRef } from "react"

import { EditorView, basicSetup } from "codemirror"
import { EditorState } from "@codemirror/state"
import type { EditorView as CMEditorView } from "@codemirror/view"
import { markdown } from "@codemirror/lang-markdown"
import { oneDark } from "@codemirror/theme-one-dark"

import { useAutoSave } from "@/app/_hooks/useAutoSave"
import { parseHeadings } from "@/app/_utils/parseHeadings"
import { useDocumentStore } from "@/store/useDocumentStore"

interface EditorContextValue {
  mount: (container: HTMLElement, content: string) => void
  destroy: () => void
  injectOption: (categoryLabel: string, prompt: string) => void
  replaceContent: (text: string, markAsWelcome?: boolean) => void
  getIsWelcome: () => boolean
}

const EditorContext = createContext<EditorContextValue | null>(null)

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const viewRef = useRef<CMEditorView | null>(null)
  const isWelcomeRef = useRef(true)
  const isTypewritingRef = useRef(false)

  const setIsDirty = useDocumentStore((s) => s.setIsDirty)
  const scheduleAutoSave = useAutoSave()

  const clearWelcome = useCallback((view: CMEditorView) => {
    if (!isWelcomeRef.current) return
    isWelcomeRef.current = false
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: "# AGENTS.md" } })
  }, [])

  const mount = useCallback(
    (container: HTMLElement, content: string) => {
      if (!container) return

      isWelcomeRef.current = true

      viewRef.current = new EditorView({
        state: EditorState.create({
          doc: content,
          extensions: [
            basicSetup,
            markdown(),
            oneDark,
            EditorView.lineWrapping,
            EditorView.updateListener.of((update) => {
              if (!update.docChanged) return
              if (isTypewritingRef.current) return
              if (isWelcomeRef.current) {
                isWelcomeRef.current = false
                const view = update.view
                Promise.resolve().then(() => {
                  view.dispatch({
                    changes: { from: 0, to: view.state.doc.length, insert: "# AGENTS.md" },
                  })
                })
                return
              }
              setIsDirty(true)
              scheduleAutoSave(update.state.doc.toString())
            }),
            EditorView.domEventHandlers({
              keydown: (_e, view) => {
                clearWelcome(view)
                return false
              },
            }),
            EditorView.theme({
              "&": { height: "100%", fontSize: "13px" },
              ".cm-scroller": { overflow: "auto", fontFamily: "var(--font-mono, monospace)" },
              ".cm-content": { padding: "16px" },
            }),
          ],
        }),
        parent: container,
      })
    },
    [setIsDirty, scheduleAutoSave, clearWelcome],
  )

  const destroy = useCallback(() => {
    viewRef.current?.destroy()
    viewRef.current = null
  }, [])

  const replaceContent = useCallback((text: string, markAsWelcome = false) => {
    const view = viewRef.current
    if (!view) return
    isTypewritingRef.current = true
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } })
    isTypewritingRef.current = false
    if (markAsWelcome) isWelcomeRef.current = true
  }, [])

  const getIsWelcome = useCallback(() => isWelcomeRef.current, [])

  const injectOption = useCallback(
    (categoryLabel: string, prompt: string) => {
      const view = viewRef.current
      if (!view) return

      clearWelcome(view)

      const doc = view.state.doc
      const { h2 } = parseHeadings(doc)
      const sectionIndex = h2.findIndex((h) => h.label === categoryLabel)

      let insertPos: number
      let insertText: string

      if (sectionIndex !== -1) {
        const nextH2 = h2[sectionIndex + 1]
        if (nextH2) {
          insertPos = nextH2.from
          insertText = `${prompt}\n\n`
        } else {
          insertPos = doc.length
          insertText = `\n\n${prompt}`
        }
      } else {
        insertPos = doc.length
        insertText = `\n\n## ${categoryLabel}\n\n${prompt}`
      }

      view.dispatch({ changes: { from: insertPos, insert: insertText } })
    },
    [clearWelcome],
  )

  const value = useMemo(
    () => ({ mount, destroy, injectOption, replaceContent, getIsWelcome }),
    [mount, destroy, injectOption, replaceContent, getIsWelcome],
  )

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

export function useEditorContext(): EditorContextValue {
  const ctx = useContext(EditorContext)
  if (!ctx) throw new Error("useEditorContext must be used within an EditorProvider")
  return ctx
}
