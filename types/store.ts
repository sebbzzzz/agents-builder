export interface AnchorRegion {
  id: string
  from: number
  to: number
  contentFrom: number
  contentTo: number
}

export interface DocumentStore {
  content: string
  isDirty: boolean
  setContent: (content: string) => void
  setIsDirty: (dirty: boolean) => void
}

export interface AppStore {
  // ── State slices ──────────────────────────────────────────────────────────
  activeCategory: string | null
  enabledCategories: string[]
  selections: Record<string, string[]>
  markdownOutput: string
  activeView: "editor" | "preview"
  isDirty: boolean

  // ── Actions ───────────────────────────────────────────────────────────────
  setActiveCategory: (id: string | null) => void
  toggleCategory: (categoryId: string) => void
  setEnabledCategories: (ids: string[]) => void
  setSelections: (selections: Record<string, string[]>) => void
  toggleSelection: (subCategoryId: string, optionId: string) => void
  setSelection: (subCategoryId: string, value: string) => void
  setMarkdownOutput: (markdown: string) => void
  setActiveView: (view: "editor" | "preview") => void
  setIsDirty: (dirty: boolean) => void
}
