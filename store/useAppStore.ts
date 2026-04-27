"use client"

import { create } from "zustand"

import type { AppStore } from "@/app/types/AppStore"

export const useAppStore = create<AppStore>()((set) => ({
  // ── Initial state ─────────────────────────────────────────────────────────
  activeCategory: null,
  activeView: "editor",

  // ── Actions ───────────────────────────────────────────────────────────────
  setActiveCategory: (id) => set({ activeCategory: id }),
  clearActiveCategory: () => set({ activeCategory: null }),
  setActiveView: (view) => set({ activeView: view }),
}))
