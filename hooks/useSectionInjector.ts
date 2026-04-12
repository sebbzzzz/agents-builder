"use client"

import { useEffect, useRef } from "react"

import type { EditorView } from "@codemirror/view"

import { CATEGORIES } from "@/data/categories"
import { assembleDocument } from "@/lib/assembleDocument"
import { computeNodeOffsets } from "@/lib/computeNodeOffsets"
import { parseDocumentNodes } from "@/lib/parseDocumentNodes"
import { useAppStore } from "@/store/useAppStore"
import { useDocumentStore } from "@/store/useDocumentStore"
import type { DocumentNode } from "@/types/store"

function generateSectionMarkdown(categoryId: string, optionIds: string[]): string {
  const category = CATEGORIES.find((c) => c.id === categoryId)
  if (!category || optionIds.length === 0) return ""
  const items = optionIds.map((id) => `- ${id}`).join("\n")
  return `## ${category.label}\n${items}`
}

/**
 * Watches useAppStore.selections for changes. When a category's selections
 * change, injects or updates the corresponding section in the CodeMirror editor.
 * All mutations are dispatched as undoable transactions.
 */
export function useSectionInjector(editorViewRef: React.RefObject<EditorView | null>) {
  const selections = useAppStore((s) => s.selections)
  const prevSelectionsRef = useRef<Record<string, string[]>>({})

  const nodes = useDocumentStore((s) => s.nodes)
  const isDirty = useDocumentStore((s) => s.isDirty)
  const setNodes = useDocumentStore((s) => s.setNodes)

  // Track latest nodes/isDirty without causing effect re-runs
  const nodesRef = useRef<DocumentNode[]>(nodes)
  const isDirtyRef = useRef(isDirty)

  useEffect(() => {
    nodesRef.current = nodes
  }, [nodes])

  useEffect(() => {
    isDirtyRef.current = isDirty
  }, [isDirty])

  useEffect(() => {
    const view = editorViewRef.current
    if (!view) return

    const changedCategoryIds = CATEGORIES.map((c) => c.id).filter((id) => {
      const prev = prevSelectionsRef.current[id] ?? []
      const next = selections[id] ?? []
      return JSON.stringify(prev) !== JSON.stringify(next)
    })

    prevSelectionsRef.current = { ...selections }

    if (changedCategoryIds.length === 0) return

    // Reconcile: re-parse editor text if there are unsaved edits
    let currentNodes: DocumentNode[] = nodesRef.current
    if (isDirtyRef.current) {
      currentNodes = parseDocumentNodes(view.state.doc.toString())
    }

    // Process each changed category — recalculate offsets per iteration
    for (const categoryId of changedCategoryIds) {
      const optionIds = selections[categoryId] ?? []
      const newContent = generateSectionMarkdown(categoryId, optionIds)
      const existingIndex = currentNodes.findIndex((n) => n.id === categoryId)

      if (optionIds.length === 0) {
        // Remove section
        if (existingIndex === -1) continue
        const offsets = computeNodeOffsets(currentNodes)
        const target = offsets[existingIndex]
        const isFirst = existingIndex === 0
        const isLast = existingIndex === currentNodes.length - 1
        // Remove the node's content and its adjacent separator
        const from = isFirst ? target.from : target.from - 2
        const to = isLast ? target.to : target.to + (isFirst ? 2 : 0)
        view.dispatch({ changes: { from: Math.max(0, from), to, insert: "" } })
        currentNodes = currentNodes.filter((_, i) => i !== existingIndex)
      } else if (existingIndex !== -1) {
        // Update existing section in-place
        const offsets = computeNodeOffsets(currentNodes)
        const target = offsets[existingIndex]
        view.dispatch({ changes: { from: target.from, to: target.to, insert: newContent } })
        currentNodes = currentNodes.map((n, i) =>
          i === existingIndex ? { ...n, content: newContent } : n,
        )
      } else {
        // Append new section
        const docLen = view.state.doc.length
        const hasContent = assembleDocument(currentNodes).length > 0
        const prefix = hasContent ? "\n\n" : ""
        view.dispatch({ changes: { from: docLen, to: docLen, insert: `${prefix}${newContent}` } })
        currentNodes = [...currentNodes, { id: categoryId, content: newContent }]
      }
    }

    setNodes(currentNodes)
  }, [selections, editorViewRef, setNodes])
}
