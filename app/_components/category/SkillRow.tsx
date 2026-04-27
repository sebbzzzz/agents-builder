"use client"

import { cn } from "@/common/utils/cn"
import { Checkbox } from "@/common/components/UI/Checkbox"
import type { Option } from "@/data/categories"

interface SkillRowProps {
  option: Option
  checked: boolean
  onToggle: () => void
}

export function SkillRow({ option, checked, onToggle }: SkillRowProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-2.5 rounded-md px-1 py-1.5 transition-colors",
        "hover:bg-accent-faint",
        checked && "bg-accent-faint",
      )}
    >
      <Checkbox checked={checked} onCheckedChange={onToggle} className="mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <span
          className={cn(
            "block leading-snug transition-colors",
            checked ? "text-foreground" : "text-foreground-2",
          )}
          style={{ fontSize: "var(--text-option)" }}
        >
          {option.label}
        </span>
        {(option.owner || option.installs) && (
          <span className="text-foreground-4 font-mono" style={{ fontSize: "var(--text-label)" }}>
            {option.owner}
            {option.owner && option.installs && " · "}
            {option.installs}
          </span>
        )}
        {option.tooltip && checked && (
          <span
            className="text-muted-foreground mt-0.5 block italic"
            style={{ fontSize: "var(--text-caption)" }}
          >
            {option.tooltip}
          </span>
        )}
      </div>
    </label>
  )
}
