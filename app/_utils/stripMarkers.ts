const LEGACY_ANCHOR_LINE_RE = /^<!--\s*(preset|fragment):(start|end)\s+.+?-->\s*$/

export function stripMarkers(text: string): string {
  return text
    .split("\n")
    .filter((line) => !LEGACY_ANCHOR_LINE_RE.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}
