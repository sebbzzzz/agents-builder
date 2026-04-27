import type { Text } from "@codemirror/state"

import type { AnchorRegion } from "@/app/types/DocumentStore"

// Matches: <!-- preset:start <id or json> -->
// Tolerates extra whitespace around the id
const START_RE = /<!--\s*preset:start\s+(.+?)\s*-->/
const END_RE = /<!--\s*preset:end\s+(.+?)\s*-->/

/**
 * Extracts the string ID from either a plain ID ("pattern") or
 * a JSON object ({"id":"pattern","version":1}).
 */
function extractId(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as Record<string, unknown>
      if (typeof parsed.id === "string") return parsed.id
    } catch {
      // fall through to plain treatment
    }
  }
  return trimmed
}

interface PendingStart {
  id: string
  lineFrom: number // char offset of start of the start-anchor line
  contentFrom: number // char offset of start of the line after the start-anchor
}

/**
 * Scans a CodeMirror Text object for preset anchor pairs.
 * Returns one AnchorRegion per matched pair, in document order.
 * Unpaired start anchors are silently ignored.
 */
export function parseAnchors(doc: Text): AnchorRegion[] {
  const pending = new Map<string, PendingStart>()
  const regions: AnchorRegion[] = []

  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i)
    const text = line.text
    const lineFrom = line.from
    const lineTo = line.to
    // Offset after this line including the newline character (if not last line)
    const afterLine = i < doc.lines ? lineTo + 1 : lineTo

    const startMatch = START_RE.exec(text)
    if (startMatch) {
      const id = extractId(startMatch[1])
      pending.set(id, {
        id,
        lineFrom,
        contentFrom: afterLine,
      })
      continue
    }

    const endMatch = END_RE.exec(text)
    if (endMatch) {
      const id = extractId(endMatch[1])
      const start = pending.get(id)
      if (start) {
        pending.delete(id)
        regions.push({
          id,
          from: start.lineFrom,
          to: lineTo,
          contentFrom: start.contentFrom,
          contentTo: lineFrom,
        })
      }
      // Unpaired end anchor — ignore
    }
  }

  // Unpaired start anchors are silently discarded (pending is not empty)
  return regions
}
