"use client"

import { create } from "zustand"

import type { AppStore } from "@/types/store"

export const useAppStore = create<AppStore>()((set) => ({
  // ── Initial state ─────────────────────────────────────────────────────────
  activeCategory: null,
  enabledCategories: [],
  enabledSubCategories: {},
  skillTriggers: {},
  selections: {},
  markdownOutput: "",
  activeView: "editor",
  isDirty: false,

  // ── Actions ───────────────────────────────────────────────────────────────
  setActiveCategory: (id) => set({ activeCategory: id }),

  clearActiveCategory: () => set({ activeCategory: null }),

  setSubCategoryEnabled: (subCategoryId, enabled) =>
    set((state) => ({
      enabledSubCategories: { ...state.enabledSubCategories, [subCategoryId]: enabled },
    })),

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

  setSkillTrigger: (skillId, phrase) =>
    set((state) => ({
      skillTriggers: { ...state.skillTriggers, [skillId]: phrase },
    })),

  setSelections: (selections) => set({ selections }),

  toggleSelection: (subCategoryId, optionId) =>
    set((state) => {
      const current = state.selections[subCategoryId] ?? []
      const isRemoving = current.includes(optionId)
      const next = isRemoving ? current.filter((id) => id !== optionId) : [...current, optionId]
      // Clear trigger phrase when a skill is unchecked
      const skillTriggers = isRemoving
        ? { ...state.skillTriggers, [optionId]: "" }
        : state.skillTriggers
      return { selections: { ...state.selections, [subCategoryId]: next }, skillTriggers }
    }),

  setSelection: (subCategoryId, value) =>
    set((state) => ({
      selections: { ...state.selections, [subCategoryId]: [value] },
    })),

  setMarkdownOutput: (markdown) => set({ markdownOutput: markdown }),

  setActiveView: (view) => set({ activeView: view }),

  setIsDirty: (dirty) => set({ isDirty: dirty }),
}))
