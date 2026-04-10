export interface AppStore {
  // ── State slices ──────────────────────────────────────────────────────────
  activeCategory: string | null
  selections: Record<string, string[]>
  markdownOutput: string
  activeView: "code" | "preview"
  isDirty: boolean

  // ── Actions ───────────────────────────────────────────────────────────────
  setActiveCategory: (id: string | null) => void
  setSelections: (selections: Record<string, string[]>) => void
  toggleSelection: (categoryId: string, optionId: string) => void
  setMarkdownOutput: (markdown: string) => void
  setActiveView: (view: "code" | "preview") => void
  setIsDirty: (dirty: boolean) => void
}
