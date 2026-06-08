import Link from "next/link"

import { LogoMark } from "@/common/components/LogoMark"

export default function NotFound() {
  return (
    <main className="bg-background text-foreground flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex items-center gap-2">
        <LogoMark size={20} />
        <span className="text-lg font-semibold tracking-tight">groundwork</span>
      </div>
      <div className="space-y-2">
        <p className="text-foreground text-2xl font-semibold">Page not found</p>
        <p className="text-muted-foreground text-sm">
          The page you’re looking for doesn’t exist or has moved.
        </p>
      </div>
      <Link
        href="/"
        className="bg-accent text-accent-foreground rounded px-4 py-2 text-xs font-medium transition-opacity hover:opacity-90"
      >
        Back to the builder
      </Link>
    </main>
  )
}
