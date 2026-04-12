import type { DocumentNode } from "@/types/store"

/**
 * Joins an array of DocumentNodes into a single markdown string,
 * separated by a blank line between each node.
 */
export function assembleDocument(nodes: DocumentNode[]): string {
  return nodes.map((n) => n.content).join("\n\n")
}
