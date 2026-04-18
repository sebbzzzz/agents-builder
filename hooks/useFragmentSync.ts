"use client"

import { useEffect, useRef } from "react"

import type { EditorView } from "@codemirror/view"

import { CATEGORIES } from "@/data/categories"
import { parseAnchors } from "@/lib/anchorParser"
import {
  disableFragment,
  disablePreset,
  enableFragment,
  enablePreset,
} from "@/lib/fragmentApplicator"
import { useAppStore } from "@/store/useAppStore"

/**
 * Watches enabledCategories + selections and synchronises preset/fragment
 * anchor blocks in the CodeMirror editor.
 *
 * Each category gets a preset block containing only the `## Heading`.
 * Each selected option gets its own fragment block inside the preset.
 * Deselected options have their fragment blocks removed.
 *
 * Options are sourced from CATEGORIES[].subCategories[].options — the
 * flat OPTIONS stub has been removed.
 */
export function useFragmentSync(editorViewRef: React.RefObject<EditorView | null>) {
  const selections = useAppStore((s) => s.selections)
  const enabledCategories = useAppStore((s) => s.enabledCategories)

  const prevRef = useRef<{ selections: Record<string, string[]>; enabledCategories: string[] }>({
    selections: {},
    enabledCategories: [],
  })

  useEffect(() => {
    const view = editorViewRef.current
    if (!view) return

    const prev = prevRef.current
    prevRef.current = { selections, enabledCategories }

    const enabledSet = new Set(enabledCategories)
    const prevEnabledSet = new Set(prev.enabledCategories)

    // Collect changed category IDs
    const changedIds = new Set<string>()
    for (const c of CATEGORIES) {
      const wasEnabled = prevEnabledSet.has(c.id)
      const isEnabled = enabledSet.has(c.id)

      // Compare all sub-category selections for this category
      const prevSel = JSON.stringify(c.subCategories.map((sub) => prev.selections[sub.id] ?? []))
      const nextSel = JSON.stringify(c.subCategories.map((sub) => selections[sub.id] ?? []))
      if (wasEnabled !== isEnabled || prevSel !== nextSel) changedIds.add(c.id)
    }
    // Repair pass: re-evaluate all enabled categories for missing anchors
    for (const id of enabledCategories) changedIds.add(id)

    if (changedIds.size === 0) return

    for (const categoryId of changedIds) {
      const category = CATEGORIES.find((c) => c.id === categoryId)
      if (!category) continue

      const isEnabled = enabledSet.has(categoryId)

      if (isEnabled) {
        // Flatten all options across sub-categories for this category
        const allOptions = category.subCategories.flatMap((sub) => sub.options)
        const headingId = `${categoryId}-heading`
        const schemaOrder = [headingId, ...allOptions.map((o) => o.id)]

        // Collect all selected option IDs across this category's sub-categories
        const selectedOptionIds = new Set(
          category.subCategories.flatMap((sub) => selections[sub.id] ?? []),
        )

        // ── Step 1: ensure category preset anchor exists ──────────────────────
        {
          const doc = view.state.doc
          const regions = parseAnchors(doc)
          if (!regions.some((r) => r.id === categoryId)) {
            const change = enablePreset(categoryId, "", regions, doc)
            if (change) view.dispatch({ changes: change })
          }
        }

        // ── Step 2: ensure heading fragment exists as first child ─────────────
        {
          const doc = view.state.doc
          const regions = parseAnchors(doc)
          if (!regions.some((r) => r.id === headingId)) {
            const change = enableFragment(
              headingId,
              categoryId,
              `## ${category.label}`,
              schemaOrder,
              regions,
              doc,
            )
            if (change) view.dispatch({ changes: change })
          }
        }

        // ── Step 3: sync option fragment anchors ──────────────────────────────
        for (const opt of allOptions) {
          const doc = view.state.doc
          const regions = parseAnchors(doc)

          if (selectedOptionIds.has(opt.id)) {
            if (!regions.some((r) => r.id === opt.id)) {
              const change = enableFragment(
                opt.id,
                categoryId,
                opt.prompt,
                schemaOrder,
                regions,
                doc,
              )
              if (change) view.dispatch({ changes: change })
            }
          } else {
            const change = disableFragment(opt.id, regions, doc)
            if (change) view.dispatch({ changes: change })
          }
        }
      } else {
        // ── Category disabled: remove the whole preset block ──────────────────
        const doc = view.state.doc
        const regions = parseAnchors(doc)
        const change = disablePreset(categoryId, regions, doc)
        if (change) view.dispatch({ changes: change })
      }
    }
  }, [selections, enabledCategories, editorViewRef])
}
