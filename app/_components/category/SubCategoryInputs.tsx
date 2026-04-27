"use client"

import type { SubCategory } from "@/data/categories"
import { SELECT_THRESHOLD } from "@/app/_utils/constants"
import { Checkbox } from "@/common/components/UI/Checkbox"
import { RadioGroup, RadioGroupItem } from "@/common/components/UI/RadioGroup"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/UI/Select"
import { TooltipProvider } from "@/common/components/UI/Tooltip"
import { OptionRow } from "@/common/components/OptionRow"

interface SubCategoryInputsProps {
  subCategory: SubCategory
  selected: string[]
  onToggle: (optionId: string) => void
  onSelect: (optionId: string | null) => void
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
        <div className="mb-2 flex items-center gap-2">
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            {label}
          </p>
        </div>

        {/* ── select (radio — few options) ──────────────────── */}
        {type === "select" && options.length < SELECT_THRESHOLD && (
          <RadioGroup
            value={selected[0] ?? ""}
            onValueChange={(value) => onSelect(value || null)}
            className="space-y-1.5"
          >
            {options.map((opt) => (
              <OptionRow
                key={opt.id}
                label={opt.label}
                tooltip={opt.tooltip}
                checked={selected.includes(opt.id)}
                control={<RadioGroupItem value={opt.id} />}
              />
            ))}
          </RadioGroup>
        )}

        {/* ── select (dropdown — many options) ─────────────── */}
        {type === "select" && options.length >= SELECT_THRESHOLD && (
          <Select value={selected[0] ?? ""} onValueChange={(value) => onSelect(value || null)}>
            <SelectTrigger className="w-full text-xs">
              <SelectValue placeholder="Select an option…" />
            </SelectTrigger>
            <SelectContent>
              {options.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* ── multi / skills / triggers / input — checkbox list */}
        {type !== "select" && (
          <ul className="space-y-1.5">
            {options.map((opt) => (
              <li key={opt.id}>
                <OptionRow
                  label={opt.label}
                  tooltip={opt.tooltip}
                  checked={selected.includes(opt.id)}
                  control={
                    <Checkbox
                      checked={selected.includes(opt.id)}
                      onCheckedChange={() => onToggle(opt.id)}
                    />
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </TooltipProvider>
  )
}
