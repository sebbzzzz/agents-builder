"use client"

import type { SubCategory } from "@/data/categories"
import { SELECT_THRESHOLD } from "@/app/_utils/constants"
import { Checkbox } from "@/common/components/UI/Checkbox"
import { Input } from "@/common/components/UI/Input"
import { RadioGroup, RadioGroupItem } from "@/common/components/UI/RadioGroup"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/UI/Select"
import { Switch } from "@/common/components/UI/Switch"
import { TooltipProvider } from "@/common/components/UI/Tooltip"
import { OptionRow } from "@/common/components/OptionRow"
import { SkillRow } from "@/app/_components/category/SkillRow"
import { TriggerCard } from "@/app/_components/category/TriggerCard"

interface SubCategoryInputsProps {
  subCategory: SubCategory
  selected: string[]
  isEnabled: boolean
  onEnabledChange: (enabled: boolean) => void
  onToggle: (optionId: string) => void
  onSelect: (value: string) => void
  selectedSkillIds?: string[]
  skillTriggers?: Record<string, string>
  onTriggerChange?: (skillId: string, phrase: string) => void
}

export function SubCategoryInputs({
  subCategory,
  selected,
  isEnabled,
  onEnabledChange,
  onToggle,
  onSelect,
  selectedSkillIds = [],
  skillTriggers = {},
  onTriggerChange,
}: SubCategoryInputsProps) {
  const { type, options, label } = subCategory

  return (
    <TooltipProvider>
      <div className="mb-5">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            {label}
          </p>
          <Switch
            checked={isEnabled}
            onCheckedChange={onEnabledChange}
            aria-label={`Enable ${label}`}
          />
        </div>

        {isEnabled && (
          <>
            {/* ── multi ─────────────────────────────────────────── */}
            {type === "multi" && (
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

            {/* ── select (radio — few options) ──────────────────── */}
            {type === "select" && options.length < SELECT_THRESHOLD && (
              <RadioGroup
                value={selected[0] ?? ""}
                onValueChange={onSelect}
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
              <Select
                value={selected[0] ?? ""}
                onValueChange={(value) => {
                  if (value !== null) onSelect(value)
                }}
              >
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

            {/* ── input ─────────────────────────────────────────── */}
            {type === "input" && options[0] && (
              <Input
                value={selected[0] ?? ""}
                onChange={(e) => onSelect(e.target.value)}
                placeholder={options[0].placeholder ?? options[0].label}
                className="h-8 text-xs"
              />
            )}

            {/* ── skills ────────────────────────────────────────── */}
            {type === "skills" && (
              <ul className="space-y-0.5">
                {options.map((opt) => (
                  <li key={opt.id}>
                    <SkillRow
                      option={opt}
                      checked={selected.includes(opt.id)}
                      onToggle={() => onToggle(opt.id)}
                    />
                  </li>
                ))}
              </ul>
            )}

            {/* ── triggers ──────────────────────────────────────── */}
            {type === "triggers" && (
              <>
                {selectedSkillIds.length === 0 ? (
                  <div className="border-border rounded-md border border-dashed px-3 py-4 text-center">
                    <p className="text-muted-foreground text-xs">
                      Pick skills in the Skills section first.
                    </p>
                  </div>
                ) : (
                  selectedSkillIds.map((skillId) => (
                    <TriggerCard
                      key={skillId}
                      skillId={skillId}
                      phrase={skillTriggers[skillId] ?? ""}
                      onPhraseChange={(phrase) => onTriggerChange?.(skillId, phrase)}
                    />
                  ))
                )}
              </>
            )}
          </>
        )}
      </div>
    </TooltipProvider>
  )
}
