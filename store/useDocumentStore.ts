"use client"

import { create } from "zustand"

import type { DocumentStore } from "@/types/store"

export const useDocumentStore = create<DocumentStore>()((set) => ({
  // TODO: initialize the document with a comment node that has instructions and examples for the user
  nodes: [],
  isDirty: false,

  updateNode: (id, content) =>
    set((state) => ({
      nodes: state.nodes.map((node) => (node.id === id ? { ...node, content } : node)),
    })),

  setNodes: (nodes) => set({ nodes }),

  setIsDirty: (dirty) => set({ isDirty: dirty }),
}))
