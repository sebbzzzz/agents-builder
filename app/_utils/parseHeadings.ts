import type { Text } from "@codemirror/state"

export interface HeadingEntry {
  label: string
  from: number
  to: number
}

export interface SubHeadingEntry extends HeadingEntry {
  parentH2Index: number
}

export interface ParsedHeadings {
  h2: HeadingEntry[]
  h3: SubHeadingEntry[]
}

const H2_RE = /^##\s+(.+?)\s*$/
const H3_RE = /^###\s+(.+?)\s*$/
const FENCE_RE = /^```/

export function parseHeadings(doc: Text): ParsedHeadings {
  const h2: HeadingEntry[] = []
  const h3: SubHeadingEntry[] = []
  let inFence = false
  let parentH2Index = -1

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
      parentH2Index = h2.length - 1
      continue
    }

    const h3Match = H3_RE.exec(text)
    if (h3Match) {
      h3.push({
        label: h3Match[1],
        from: line.from,
        to: line.to,
        parentH2Index,
      })
    }
  }

  return { h2, h3 }
}
