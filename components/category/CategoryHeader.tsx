import { LogoMark } from "@/components/common/LogoMark"

export function CategoryHeader() {
  return (
    <div className="border-border flex items-center gap-2 border-b px-4 py-4">
      <LogoMark size={14} />
      <div className="flex flex-col gap-0.5">
        <span className="text-foreground text-sm font-semibold tracking-tight">groundwork</span>
        <span
          className="text-muted-foreground font-mono"
          style={{ fontSize: "var(--text-label)" }}
        >
          Decision guide
        </span>
      </div>
    </div>
  )
}
