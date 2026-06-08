"use client"

import { useEffect } from "react"

import { LogoMark } from "@/common/components/LogoMark"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="bg-background text-foreground flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="flex items-center gap-2">
        <LogoMark size={20} />
        <span className="text-lg font-semibold tracking-tight">groundwork</span>
      </div>
      <div className="space-y-2">
        <p className="text-foreground text-2xl font-semibold">Something went wrong</p>
        <p className="text-muted-foreground text-sm">
          An unexpected error occurred. You can try again.
        </p>
      </div>
      <button
        onClick={reset}
        className="bg-accent text-accent-foreground rounded px-4 py-2 text-xs font-medium transition-opacity hover:opacity-90"
      >
        Try again
      </button>
    </main>
  )
}
