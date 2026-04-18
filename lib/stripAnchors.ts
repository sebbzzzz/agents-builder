const ANCHOR_LINE_RE = /^<!--\s*preset:(start|end)\s+.+?-->\s*$/

/**
 * Removes all preset anchor comment lines from a markdown string
 * so they do not appear in rendered output or clipboard exports.
 */
export function stripAnchors(text: string): string {
  return text
    .split("\n")
    .filter((line) => !ANCHOR_LINE_RE.test(line))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n") // collapse extra blank lines left by removed anchors
    .trim()
}
