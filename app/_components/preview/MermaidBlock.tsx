"use client"

import { useEffect, useId, useRef } from "react"

interface MermaidBlockProps {
  code: string
}

export function MermaidBlock({ code }: MermaidBlockProps) {
  const id = useId()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false

    async function render() {
      const mermaid = (await import("mermaid")).default
      mermaid.initialize({ startOnLoad: false, theme: "dark" })

      if (cancelled || !ref.current) return

      try {
        const { svg } = await mermaid.render(`mermaid-${id.replace(/:/g, "")}`, code)
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
        }
      } catch {
        if (!cancelled && ref.current) {
          ref.current.textContent = code
        }
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [code, id])

  return <div ref={ref} className="my-4 overflow-x-auto" />
}
