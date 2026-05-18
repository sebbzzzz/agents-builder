"use client"

import { cn } from "@/common/utils/cn"

interface OptionRowProps {
  label: string
  tooltip?: string
  checked: boolean
  /** The control (Checkbox or RadioGroupItem) rendered to the left of the label */
  control: React.ReactNode
  onClick?: () => void
  className?: string
}

export function OptionRow({
  label,
  tooltip,
  checked,
  control,
  onClick,
  className,
}: OptionRowProps) {
  return (
    <label
      className={cn("flex w-full cursor-pointer items-start gap-2 transition-colors", className)}
      onClick={onClick}
    >
      <span className="shrink-0">{control}</span>
      <span className="flex flex-col">
        <span className="text-foreground text-xs">{label}</span>
        {tooltip && (
          <span className="text-muted-foreground mt-0.5 text-[10px] leading-tight">{tooltip}</span>
        )}
      </span>
    </label>
  )
}
