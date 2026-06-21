"use client"

import { create } from "zustand"

const STORAGE_KEY = "onboarding_complete"

interface OnboardingStore {
  isActive: boolean
  init: () => void
  restart: () => void
  complete: () => void
  skip: () => void
}

export const useOnboardingStore = create<OnboardingStore>((set) => ({
  isActive: false,
  init: () => {
    if (typeof window === "undefined") return
    if (!localStorage.getItem(STORAGE_KEY)) {
      set({ isActive: true })
    }
  },
  // User-initiated replay: unlike init(), this ignores the completion flag —
  // it clears it and re-activates so the full tour runs again on demand.
  restart: () => {
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY)
    set({ isActive: true })
  },
  complete: () => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "1")
    set({ isActive: false })
  },
  skip: () => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, "1")
    set({ isActive: false })
  },
}))
