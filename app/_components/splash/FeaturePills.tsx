const PILLS = [
  "14 decision categories",
  "live markdown preview",
  "skills.sh integration",
  "export to .md",
  "no backend · no auth",
]

export function FeaturePills() {
  return (
    <div className="mt-10 flex flex-wrap justify-center gap-2">
      {PILLS.map((label) => (
        <span
          key={label}
          className="border-border bg-surface text-muted-foreground flex items-center gap-1.5 rounded-[3px] border px-[11px] py-[5px] font-mono text-[10.5px] tracking-[0.04em]"
        >
          <span className="bg-accent h-[5px] w-[5px] flex-shrink-0 rounded-full opacity-70" />
          {label}
        </span>
      ))}
    </div>
  )
}
