import { CATEGORIES } from "@/data/categories"

/**
 * Assembles an AGENTS.md string from the current selections.
 *
 * Selections is a flat map keyed by subCategoryId:
 *  - "select" / "multi" → array of selected option IDs
 *  - "input"            → single-element array containing the raw text value
 *  - "skills"           → array of selected skill IDs (install commands emitted)
 *  - "triggers"         → not yet implemented; skipped
 */
export function buildAgentsFile(selections: Record<string, string[]>): string {
  const sections: string[] = []

  for (const category of CATEGORIES) {
    const categoryLines: string[] = []

    for (const sub of category.subCategories) {
      const selected = selections[sub.id]
      if (!selected || selected.length === 0) continue

      if (sub.type === "input") {
        const value = selected[0]?.trim()
        if (value) {
          // Use the first option's prompt as a prefix template if available
          const prefixOption = sub.options[0]
          if (prefixOption?.prompt) {
            categoryLines.push(`${prefixOption.prompt} ${value}`)
          } else {
            categoryLines.push(value)
          }
        }
        continue
      }

      if (sub.type === "skills") {
        const installs = sub.options
          .filter((opt) => selected.includes(opt.id))
          .map((opt) => opt.prompt)
        if (installs.length > 0) {
          categoryLines.push(...installs)
        }
        continue
      }

      if (sub.type === "triggers") {
        // Not yet implemented
        continue
      }

      // "select" and "multi"
      for (const optionId of selected) {
        const option = sub.options.find((o) => o.id === optionId)
        if (option?.prompt) {
          categoryLines.push(option.prompt)
        }
      }
    }

    if (categoryLines.length > 0) {
      sections.push(`## ${category.label}\n\n${categoryLines.join("\n\n")}`)
    }
  }

  return sections.join("\n\n---\n\n")
}
