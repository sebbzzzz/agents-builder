export interface AppStore {
  // ── State slices ──────────────────────────────────────────────────────────
  activeCategory: string | null
  activeView: "editor" | "preview"

  // ── Actions ───────────────────────────────────────────────────────────────
  setActiveCategory: (id: string | null) => void
  clearActiveCategory: () => void
  setActiveView: (view: "editor" | "preview") => void
}
