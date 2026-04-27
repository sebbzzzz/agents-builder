"use client"

import { create } from "zustand"

import type { DocumentStore } from "@/app/types/DocumentStore"

export const useDocumentStore = create<DocumentStore>()((set) => ({
  content: "",
  isDirty: false,

  setContent: (content) => set({ content }),

  setIsDirty: (dirty) => set({ isDirty: dirty }),
}))
