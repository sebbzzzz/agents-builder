import { CATEGORIES } from "@/data/categories"

/**
 * Assembles an AGENTS.md string from the current selections.
 *
 * Selections is a flat map keyed by subCategoryId:
 *  - "select" / "multi" → array of selected option IDs
 *  - "input"            → single-element array containing the raw text value
 *  - "skills"           → array of selected skill IDs (install commands emitted)
 *  - "triggers"         → keyed by skill ID in skillTriggers; emits auto-invoke lines
 */
export function buildAgentsFile(
  selections: Record<string, string[]>,
  enabledSubCategories: Record<string, boolean> = {},
  skillTriggers: Record<string, string> = {},
): string {
  const sections: string[] = []
  const skillInstalls: string[] = []
  const triggerLines: string[] = []

  for (const category of CATEGORIES) {
    const categoryLines: string[] = []

    for (const sub of category.subCategories) {
      if (enabledSubCategories[sub.id] === false) continue

      const selected = selections[sub.id]

      if (sub.type === "skills") {
        if (!selected || selected.length === 0) continue
        const installs = sub.options
          .filter((opt) => selected.includes(opt.id))
          .map((opt) => opt.prompt)
        skillInstalls.push(...installs)
        continue
      }

      if (sub.type === "triggers") {
        // Collect non-empty trigger phrases
        for (const [skillId, phrase] of Object.entries(skillTriggers)) {
          if (phrase.trim()) {
            triggerLines.push(`- Use \`${skillId}\` ${phrase.trim()}`)
          }
        }
        continue
      }

      if (!selected || selected.length === 0) continue

      if (sub.type === "input") {
        const value = selected[0]?.trim()
        if (value) {
          const prefixOption = sub.options[0]
          if (prefixOption?.prompt) {
            categoryLines.push(`${prefixOption.prompt} ${value}`)
          } else {
            categoryLines.push(value)
          }
        }
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

  // Skills block
  if (skillInstalls.length > 0) {
    sections.push(`## Available Skills\n\n\`\`\`bash\n${skillInstalls.join("\n")}\n\`\`\``)
  }

  // Auto-invoke block — deduplicate trigger lines (triggers may be iterated per sub-category)
  const uniqueTriggerLines = [...new Set(triggerLines)]
  if (uniqueTriggerLines.length > 0) {
    sections.push(`## Auto-invoke Skills\n\n${uniqueTriggerLines.join("\n")}`)
  }

  return sections.join("\n\n---\n\n")
}
