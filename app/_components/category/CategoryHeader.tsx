import { LogoMark } from "@/common/components/LogoMark"

export function CategoryHeader() {
  return (
    <header className="border-border bg-surface flex items-center justify-between gap-2 border-b px-4 py-3">
      <div className="flex items-center gap-4">
        <LogoMark size={14} />
        <div className="flex items-center gap-2">
          <span className="text-foreground text-sm font-semibold tracking-tight">groundwork</span>
          <span className="text-muted-foreground hidden md:block">·</span>
          <span className="text-muted-foreground hidden font-mono text-xs md:block">
            Create your solid Agents.md file with all details, no more, no less.
          </span>
        </div>
      </div>

      <div className="text-muted-foreground font-mono text-xs">
        By:{" "}
        <a href="https://seb.bz/" className="text-primary hover:underline" target="_blank">
          seb.bz
        </a>
      </div>
    </header>
  )
}
