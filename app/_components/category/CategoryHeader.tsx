import { LogoMark } from "@/common/components/LogoMark"

import { HeaderActions } from "./HeaderActions"

export function CategoryHeader() {
  return (
    <header className="border-border bg-surface flex items-center justify-between gap-2 border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <LogoMark size={14} />
        <div className="flex items-center gap-2">
          <span className="text-foreground text-sm font-semibold tracking-tight">groundwork</span>
        </div>
      </div>

      <HeaderActions />
    </header>
  )
}
