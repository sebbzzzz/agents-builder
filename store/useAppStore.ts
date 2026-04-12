"use client"

import { create } from "zustand"

import type { AppStore } from "@/types/store"

export const useAppStore = create<AppStore>()((set) => ({
  // ── Initial state ─────────────────────────────────────────────────────────
  activeCategory: null,
  selections: {},
  markdownOutput: "",
  activeView: "editor",
  isDirty: false,

  // ── Actions ───────────────────────────────────────────────────────────────
  setActiveCategory: (id) => set({ activeCategory: id }),

  setSelections: (selections) => set({ selections }),

  toggleSelection: (categoryId, optionId) =>
    set((state) => {
      const current = state.selections[categoryId] ?? []
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId]
      return { selections: { ...state.selections, [categoryId]: next } }
    }),

  setMarkdownOutput: (markdown) => set({ markdownOutput: markdown }),

  setActiveView: (view) => set({ activeView: view }),

  setIsDirty: (dirty) => set({ isDirty: dirty }),
}))
