"use client"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

interface OptionRowProps {
  label: string
  tooltip?: string
  checked: boolean
  /** The control (Checkbox or RadioGroupItem) rendered to the left of the label */
  control: React.ReactNode
  onClick?: () => void
  className?: string
}

/**
 * Reusable row for any selectable option — wraps a control + label + optional
 * tooltip in a consistent layout. Used by multi (checkbox) and select (radio)
 * sub-category types.
 */
export function OptionRow({
  label,
  tooltip,
  checked,
  control,
  onClick,
  className,
}: OptionRowProps) {
  const inner = (
    <label
      className={cn("flex w-full cursor-pointer items-center gap-2 transition-colors", className)}
      onClick={onClick}
    >
      {control}
      <span
        className={cn(
          "text-xs transition-colors",
          checked ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </span>
    </label>
  )

  if (!tooltip) return <>{inner}</>

  return (
    <Tooltip>
      <TooltipTrigger>{inner}</TooltipTrigger>
      <TooltipContent>{tooltip}</TooltipContent>
    </Tooltip>
  )
}
