"use client"

import { useState } from "react"
import { HelpCircle, Mail } from "lucide-react"

import { PORTFOLIO_URL } from "@/app/_utils/site"

import { AboutModal } from "./AboutModal"

export function HeaderActions() {
  const [isAboutOpen, setIsAboutOpen] = useState(false)

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label="Help"
        title="Help"
        onClick={() => setIsAboutOpen(true)}
        className="text-muted-foreground hover:text-foreground rounded p-1.5 transition-colors"
      >
        <HelpCircle size={16} />
      </button>
      <a
        href={PORTFOLIO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact"
        title="Contact"
        className="text-muted-foreground hover:text-foreground rounded p-1.5 transition-colors"
      >
        <Mail size={16} />
      </a>

      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  )
}
