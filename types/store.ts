export interface DocumentNode {
  id: string
  content: string
}

export interface DocumentStore {
  nodes: DocumentNode[]
  isDirty: boolean
  updateNode: (id: string, content: string) => void
  setNodes: (nodes: DocumentNode[]) => void
  setIsDirty: (dirty: boolean) => void
}

export interface AppStore {
  // ── State slices ──────────────────────────────────────────────────────────
  activeCategory: string | null
  selections: Record<string, string[]>
  markdownOutput: string
  activeView: "editor" | "preview"
  isDirty: boolean

  // ── Actions ───────────────────────────────────────────────────────────────
  setActiveCategory: (id: string | null) => void
  setSelections: (selections: Record<string, string[]>) => void
  toggleSelection: (categoryId: string, optionId: string) => void
  setMarkdownOutput: (markdown: string) => void
  setActiveView: (view: "editor" | "preview") => void
  setIsDirty: (dirty: boolean) => void
}
