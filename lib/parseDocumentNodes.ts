import { CATEGORIES } from "@/data/categories"
import type { DocumentNode } from "@/types/store"

const HEADING_PREFIX = "## "

// Build a lookup map from lowercase heading label → category id
const LABEL_TO_ID: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.label.toLowerCase(), c.id]),
)

/**
 * Re-parses a flat markdown string into a DocumentNode array.
 * Sections are delimited by `## Heading` lines. Each heading is matched
 * against known category labels to assign the category id; unmatched blocks
 * get a `free-{n}` id.
 */
export function parseDocumentNodes(text: string): DocumentNode[] {
  if (!text.trim()) return []

  const lines = text.split("\n")
  const nodes: DocumentNode[] = []
  let freeIndex = 0

  let currentLines: string[] = []
  let currentId: string | null = null

  function flushNode() {
    const content = currentLines.join("\n").trimEnd()
    if (!content) return
    const id = currentId ?? `free-${freeIndex++}`
    nodes.push({ id, content })
    currentLines = []
    currentId = null
  }

  for (const line of lines) {
    if (line.startsWith(HEADING_PREFIX)) {
      flushNode()
      const label = line.slice(HEADING_PREFIX.length).trim().toLowerCase()
      currentId = LABEL_TO_ID[label] ?? null
      currentLines = [line]
    } else {
      currentLines.push(line)
    }
  }

  flushNode()

  return nodes
}
