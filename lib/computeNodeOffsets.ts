import type { DocumentNode } from "@/types/store"

export interface NodeOffset {
  id: string
  from: number
  to: number
}

const SEPARATOR_LENGTH = 2 // '\n\n' between nodes

/**
 * Computes the character offset of each node in the assembled document.
 * Returns an array of { id, from, to } in the same order as the input nodes.
 */
export function computeNodeOffsets(nodes: DocumentNode[]): NodeOffset[] {
  const offsets: NodeOffset[] = []
  let cursor = 0

  for (const node of nodes) {
    const from = cursor
    const to = from + node.content.length
    offsets.push({ id: node.id, from, to })
    cursor = to + SEPARATOR_LENGTH
  }

  return offsets
}
