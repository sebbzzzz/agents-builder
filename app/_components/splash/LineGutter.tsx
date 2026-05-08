const HIGHLIGHTED = new Set([9, 10, 11, 12, 13])

interface LineGutterProps {
  count?: number
  className?: string
}

export function LineGutter({ count = 30, className = "" }: LineGutterProps) {
  return (
    <div
      className={`border-border bg-surface flex w-[52px] flex-shrink-0 flex-col items-end border-r px-[10px] pt-7 font-mono text-xs leading-[22px] ${className}`}
    >
      {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
        <span
          key={n}
          className={`min-w-[20px] select-none text-right ${HIGHLIGHTED.has(n) ? "text-accent-2" : "text-foreground-4"}`}
        >
          {n}
        </span>
      ))}
    </div>
  )
}
