"use client"

import { useEffect, useState } from "react"

const CONTENT = `# groundwork — 2026-05-03
> Solo long-term project. Treat as production code.

## Project Context
**Context:** Production project (serving real users)

- Apply the full constraint set: strict typing, test coverage, lint checks before commit
- No debug code (console.log, debugger) in merged PRs
- Mandatory PR reviews — at least one approval before merge
- Treat every change as potentially user-facing

## Tech Stack
**Project type:** Full-stack application

- Frontend and backend colocated in the same repository
- Clear boundary between client and server code
- Shared types live in common/

## Styles
**UI pattern:** Server Components (Next.js App Router)

- Prefer React Server Components for data fetching
- Add 'use client' only for browser APIs, event listeners, or local state
- Keep client-side JS minimal — treat 'use client' as a performance decision

**State:** Zustand

- Define one store per domain (useAuthStore, useCartStore)
- Use selectors to subscribe to slices — never subscribe to the whole store
- Keep store actions inside the store definition, not in components`

const CHAR_DELAY = 10
const RESTART_PAUSE = 2000

export function GhostCode() {
  const [visible, setVisible] = useState("")

  useEffect(() => {
    let pos = 0
    let timeoutId: ReturnType<typeof setTimeout>

    function step() {
      if (pos <= CONTENT.length) {
        setVisible(CONTENT.slice(0, pos))
        pos++
        timeoutId = setTimeout(step, CHAR_DELAY)
      } else {
        timeoutId = setTimeout(() => {
          pos = 0
          step()
        }, RESTART_PAUSE)
      }
    }

    step()
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="text-accent-2 pointer-events-none absolute inset-0 overflow-hidden p-8 font-mono text-[15px] leading-[28px] whitespace-pre opacity-[0.18]"
    >
      {visible}
    </div>
  )
}
