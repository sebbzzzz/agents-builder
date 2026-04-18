"use client"

import type { SubCategory } from "@/data/categories"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SubCategoryInputsProps {
  subCategory: SubCategory
  selected: string[]
  onToggle: (optionId: string) => void
  onSelect: (value: string) => void
}

export function SubCategoryInputs({
  subCategory,
  selected,
  onToggle,
  onSelect,
}: SubCategoryInputsProps) {
  const { type, options, label } = subCategory

  return (
    <TooltipProvider>
      <div className="mb-5">
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
          {label}
        </p>

        {type === "multi" && (
          <ul className="space-y-1.5">
            {options.map((opt) => {
              const checked = selected.includes(opt.id)
              return (
                <li key={opt.id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => onToggle(opt.id)}
                          className="accent-accent h-3.5 w-3.5 flex-shrink-0 cursor-pointer rounded"
                        />
                        <span
                          className={cn(
                            "text-xs transition-colors",
                            checked ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {opt.label}
                        </span>
                      </label>
                    </TooltipTrigger>
                    {opt.tooltip && <TooltipContent>{opt.tooltip}</TooltipContent>}
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        )}

        {type === "select" && (
          <ul className="space-y-1.5">
            {options.map((opt) => {
              const isSelected = selected.includes(opt.id)
              return (
                <li key={opt.id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="radio"
                          name={subCategory.id}
                          checked={isSelected}
                          onChange={() => onSelect(opt.id)}
                          className="accent-accent h-3.5 w-3.5 flex-shrink-0 cursor-pointer"
                        />
                        <span
                          className={cn(
                            "text-xs transition-colors",
                            isSelected ? "text-foreground" : "text-muted-foreground",
                          )}
                        >
                          {opt.label}
                        </span>
                      </label>
                    </TooltipTrigger>
                    {opt.tooltip && <TooltipContent>{opt.tooltip}</TooltipContent>}
                  </Tooltip>
                </li>
              )
            })}
          </ul>
        )}

        {type === "input" && options[0] && (
          <input
            type="text"
            value={selected[0] ?? ""}
            onChange={(e) => onSelect(e.target.value)}
            placeholder={options[0].placeholder ?? options[0].label}
            className="border-border bg-surface text-foreground placeholder:text-muted-foreground w-full rounded-md border px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-current"
          />
        )}

        {(type === "skills" || type === "triggers") && (
          <p className="text-muted-foreground text-xs italic">Coming soon</p>
        )}
      </div>
    </TooltipProvider>
  )
}
