"use client"

import { create } from "zustand"

import { WELCOME_CONTENT } from "@/app/_utils/constants"
import type { DocumentStore } from "@/app/types/DocumentStore"

export const useDocumentStore = create<DocumentStore>()((set) => ({
  content: WELCOME_CONTENT,
  isDirty: false,

  setContent: (content) => set({ content }),

  setIsDirty: (dirty) => set({ isDirty: dirty }),
}))
