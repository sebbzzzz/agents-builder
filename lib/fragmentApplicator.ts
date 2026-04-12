import type { ChangeSpec, Text } from "@codemirror/state"

import type { AnchorRegion } from "@/types/store"

// ── Helpers ───────────────────────────────────────────────────────────────────

function makeAnchorBlock(id: string, content: string): string {
  return `<!-- preset:start ${id} -->\n${content}\n<!-- preset:end ${id} -->`
}

/** Returns the regions that are direct children of a parent region. */
function childRegions(parentId: string, regions: AnchorRegion[]): AnchorRegion[] {
  const parent = regions.find((r) => r.id === parentId)
  if (!parent) return []
  return regions.filter((r) => r.id !== parentId && r.from >= parent.from && r.to <= parent.to)
}

/** Returns the preceding two chars so callers can strip a `\n\n` separator. */
function precedingChars(pos: number, doc: Text): string {
  if (pos < 2) return ""
  return doc.sliceString(pos - 2, pos)
}

// ── Preset operations ─────────────────────────────────────────────────────────

/**
 * Replaces the content inside an existing preset anchor block.
 * No-op if the region is not found.
 */
export function updatePreset(
  id: string,
  newContent: string,
  regions: AnchorRegion[],
): ChangeSpec | null {
  const region = regions.find((r) => r.id === id)
  if (!region) return null
  return { from: region.contentFrom, to: region.contentTo, insert: `${newContent}\n` }
}

/**
 * Inserts a preset anchor block at the end of the document.
 * No-op if the region already exists.
 * Never replaces the full document string.
 */
export function enablePreset(
  id: string,
  defaultContent: string,
  regions: AnchorRegion[],
  doc: Text,
): ChangeSpec | null {
  if (regions.find((r) => r.id === id)) return null

  const block = makeAnchorBlock(id, defaultContent)
  const docLen = doc.length
  const prefix = docLen > 0 ? "\n\n" : ""
  return { from: docLen, to: docLen, insert: `${prefix}${block}` }
}

/**
 * Removes a preset anchor block including all nested content.
 * No-op if the region is not found.
 */
export function disablePreset(id: string, regions: AnchorRegion[], doc: Text): ChangeSpec | null {
  const region = regions.find((r) => r.id === id)
  if (!region) return null

  const hasSeparator = precedingChars(region.from, doc) === "\n\n"
  return {
    from: hasSeparator ? region.from - 2 : region.from,
    to: region.to,
    insert: "",
  }
}

// ── Fragment operations ───────────────────────────────────────────────────────

/**
 * Inserts a fragment anchor block inside its parent preset region,
 * positioned according to schemaOrder.
 *
 * If the parent preset anchor does not exist, the parent block is created
 * with the fragment already inside — as a single atomic transaction.
 *
 * schemaOrder: ordered array of all possible sibling fragment IDs for this parent.
 */
export function enableFragment(
  id: string,
  parentId: string,
  defaultContent: string,
  schemaOrder: string[],
  regions: AnchorRegion[],
  doc: Text,
): ChangeSpec | null {
  // Already present — no-op
  if (regions.find((r) => r.id === id)) return null

  const fragmentBlock = makeAnchorBlock(id, defaultContent)

  // Parent missing — create parent with fragment already inside
  const parent = regions.find((r) => r.id === parentId)
  if (!parent) {
    const docLen = doc.length
    const prefix = docLen > 0 ? "\n\n" : ""
    return {
      from: docLen,
      to: docLen,
      insert: `${prefix}${makeAnchorBlock(parentId, fragmentBlock)}`,
    }
  }

  // Find the schema index of the new fragment
  const myIndex = schemaOrder.indexOf(id)

  // Find the last existing sibling whose schema index < myIndex
  const siblings = childRegions(parentId, regions)
  let insertAfterRegion: AnchorRegion | null = null
  for (const sib of siblings) {
    const sibIndex = schemaOrder.indexOf(sib.id)
    if (sibIndex < myIndex) {
      if (!insertAfterRegion || schemaOrder.indexOf(insertAfterRegion.id) < sibIndex) {
        insertAfterRegion = sib
      }
    }
  }

  if (insertAfterRegion) {
    // Insert after the sibling's end-anchor line (to + 1 to include the \n)
    const pos = Math.min(insertAfterRegion.to + 1, doc.length)
    return { from: pos, to: pos, insert: `${fragmentBlock}\n` }
  }

  // No preceding sibling — insert at start of parent content
  return { from: parent.contentFrom, to: parent.contentFrom, insert: `${fragmentBlock}\n` }
}

/**
 * Removes a fragment anchor block, leaving sibling fragments untouched.
 * No-op if the region is not found.
 */
export function disableFragment(id: string, regions: AnchorRegion[], doc: Text): ChangeSpec | null {
  const region = regions.find((r) => r.id === id)
  if (!region) return null

  // Remove a preceding newline if present to avoid leaving a blank line
  const hasPrecedingNewline =
    region.from >= 1 && doc.sliceString(region.from - 1, region.from) === "\n"
  return {
    from: hasPrecedingNewline ? region.from - 1 : region.from,
    to: region.to,
    insert: "",
  }
}

// ── Repair ────────────────────────────────────────────────────────────────────

/**
 * Recreates a missing anchor at the fallback position (end of document).
 * Returns null if the anchor already exists (no repair needed).
 * Used for top-level presets only; fragments are recovered via enableFragment.
 */
export function repairAnchor(
  id: string,
  defaultContent: string,
  regions: AnchorRegion[],
  doc: Text,
): ChangeSpec | null {
  if (regions.find((r) => r.id === id)) return null
  return enablePreset(id, defaultContent, regions, doc)
}
