"use client"

import { Modal } from "@/common/components/Modal"
import { useOnboardingStore } from "@/store/useOnboardingStore"

import { PORTFOLIO_URL } from "@/app/_utils/site"

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const restart = useOnboardingStore((s) => s.restart)

  function handleStartOnboarding() {
    onClose()
    restart()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} label="About groundwork">
      <div className="p-6">
        <h2 className="text-foreground text-lg font-semibold tracking-tight">About groundwork</h2>
        <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
          groundwork is a decision guide for building your <code>AGENTS.md</code> — the file that
          tells your AI coding agent your stack, rules, and patterns. Browse categories, pick what
          fits your project, and the file builds itself. No more writing it by hand.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleStartOnboarding}
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded px-3 py-1.5 text-xs font-medium transition-colors"
          >
            Start onboarding
          </button>
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border-border text-foreground hover:bg-surface rounded border px-3 py-1.5 text-xs font-medium transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </Modal>
  )
}
