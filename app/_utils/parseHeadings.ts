import type { Text } from "@codemirror/state"

export interface HeadingEntry {
  label: string
  from: number
  to: number
}

export interface ParsedHeadings {
  h2: HeadingEntry[]
}

const H2_RE = /^##\s+(.+?)\s*$/
const FENCE_RE = /^```/

export function parseHeadings(doc: Text): ParsedHeadings {
  const h2: HeadingEntry[] = []
  let inFence = false

  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i)
    const text = line.text

    if (FENCE_RE.test(text)) {
      inFence = !inFence
      continue
    }
    if (inFence) continue

    const h2Match = H2_RE.exec(text)
    if (h2Match) {
      h2.push({ label: h2Match[1], from: line.from, to: line.to })
    }
  }

  return { h2 }
}
