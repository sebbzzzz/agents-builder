"use client"

import type { SubCategory } from "@/data/categories"
import { TRIGGER_TEMPLATES, SELECT_THRESHOLD } from "@/app/_utils/constants"
import { Checkbox } from "@/common/components/UI/Checkbox"
import { RadioGroup, RadioGroupItem } from "@/common/components/UI/RadioGroup"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/UI/Select"
import { OptionRow } from "@/common/components/OptionRow"

interface SubCategoryInputsProps {
  subCategory: SubCategory
  selected: string[]
  onToggle: (optionId: string) => void
  onSelect: (optionId: string | null) => void
  inputValues?: Record<string, string>
  onInputChange?: (optionId: string, value: string) => void
  skillTriggers?: Record<string, string[]>
  onSkillTriggerToggle?: (skillId: string, triggerId: string) => void
}

export function SubCategoryInputs({
  subCategory,
  selected,
  onToggle,
  onSelect,
  inputValues,
  onInputChange,
  skillTriggers,
  onSkillTriggerToggle,
}: SubCategoryInputsProps) {
  const { type, options, label } = subCategory

  return (
    <div className="mb-5">
        <p className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
          {label}
        </p>

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

        {type === "input" && (
          <ul className="space-y-2">
            {options.map((opt) => (
              <li key={opt.id} className="flex items-center gap-2">
                <span className="text-muted-foreground w-24 shrink-0 text-xs">{opt.label}</span>
                <input
                  type="text"
                  placeholder={opt.placeholder ?? ""}
                  value={inputValues?.[opt.id] ?? ""}
                  onChange={(e) => onInputChange?.(opt.id, e.target.value)}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground flex-1 rounded border px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-current"
                />
              </li>
            ))}
          </ul>
        )}

        {type === "skills" && (
          <ul className="space-y-2">
            {options.map((opt) => {
              const isChecked = selected.includes(opt.id)
              const triggers = skillTriggers?.[opt.id] ?? []
              return (
                <li key={opt.id}>
                  <label className="flex w-full cursor-pointer items-start gap-2">
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => onToggle(opt.id)}
                      className="shrink-0"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="text-foreground text-xs">{opt.label}</span>
                      {opt.owner && (
                        <span className="text-muted-foreground mt-0.5 font-mono text-[10px] leading-tight">
                          {opt.owner}
                          {opt.installs ? ` · ${opt.installs}` : ""}
                        </span>
                      )}
                    </div>
                  </label>

                  {isChecked && (
                    <ul className="mt-1.5 ml-5 space-y-1">
                      {TRIGGER_TEMPLATES.map((tpl) => (
                        <li key={tpl.id}>
                          <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs">
                            <Checkbox
                              checked={triggers.includes(tpl.id)}
                              onCheckedChange={() => onSkillTriggerToggle?.(opt.id, tpl.id)}
                              className="shrink-0"
                            />
                            {tpl.label}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {(type === "multi" || type === "triggers") && (
          <ul className="space-y-1.5">
            {options.map((opt) => {
              const isChecked = selected.includes(opt.id)
              return (
                <li key={opt.id}>
                  <OptionRow
                    label={opt.label}
                    tooltip={opt.tooltip}
                    checked={isChecked}
                    control={
                      <Checkbox checked={isChecked} onCheckedChange={() => onToggle(opt.id)} />
                    }
                  />
                </li>
              )
            })}
          </ul>
        )}
      </div>
  )
}
