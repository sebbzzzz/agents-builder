export interface DocumentStore {
  content: string
  isDirty: boolean
  setContent: (content: string) => void
  setIsDirty: (dirty: boolean) => void
}
