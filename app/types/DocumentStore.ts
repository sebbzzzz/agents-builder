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
