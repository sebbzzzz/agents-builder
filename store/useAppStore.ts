"use client"

import { create } from "zustand"

import type { AppStore } from "@/types/store"

export const useAppStore = create<AppStore>()((set) => ({
  // ── Initial state ─────────────────────────────────────────────────────────
  activeCategory: null,
  enabledCategories: [],
  selections: {},
  markdownOutput: "",
  activeView: "editor",
  isDirty: false,

  // ── Actions ───────────────────────────────────────────────────────────────
  setActiveCategory: (id) => set({ activeCategory: id }),

  toggleCategory: (categoryId) =>
    set((state) => {
      const enabled = state.enabledCategories.includes(categoryId)
      return {
        enabledCategories: enabled
          ? state.enabledCategories.filter((id) => id !== categoryId)
          : [...state.enabledCategories, categoryId],
      }
    }),

  setEnabledCategories: (ids) => set({ enabledCategories: ids }),

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
