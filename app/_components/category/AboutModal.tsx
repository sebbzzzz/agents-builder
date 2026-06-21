"use client"

import { Modal } from "@/common/components/Modal"
import { LogoMark } from "@/common/components/LogoMark"
import { ShimmerButton } from "@/common/components/UI/ShimmerButton"
import { useOnboardingStore } from "@/store/useOnboardingStore"

import { PORTFOLIO_URL } from "@/app/_utils/site"

import "./AboutModal.css"

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
    <Modal isOpen={isOpen} onClose={onClose} label="About groundwork" bare>
      <div className="am-card">
        <div className="am-header">
          <LogoMark size={14} />
          <span className="am-crumb">
            <span>groundwork</span>
            <span className="sep">/</span>
            <span>about</span>
          </span>
          <span className="am-count">INFO</span>
          <button type="button" className="am-close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="am-body">
          <span className="am-eyebrow">About</span>
          <h2 className="am-title">Build AGENTS.md the way you work</h2>

          <div className="am-section">
            <h3>About this tool</h3>
            <p>
              <strong>groundwork</strong> is a decision guide for writing your{" "}
              <code>AGENTS.md</code>. Instead of staring at a blank file, you browse categories,
              weigh the tradeoffs of each option, and the document assembles itself in real time —
              ready to drop into the root of your repo.
            </p>
          </div>

          <div className="am-section">
            <h3>Principles</h3>
            <p>
              Opinionated but never a black box. Every option shows its tradeoff so you stay in
              control, the output is plain editable markdown you own, and nothing leaves your
              browser. Simple beats clever.
            </p>
          </div>

          <div className="am-section">
            <h3>Inspiration</h3>
            <p>
              Born from the friction of hand-writing context files for AI agents on every new
              project — the same stack notes, the same conventions, retyped each time. groundwork
              turns that repetitive setup into a few guided clicks.
            </p>
          </div>

          <div className="am-section">
            <h3>AI, AGENTS.md &amp; agentic development today</h3>
            <p>
              Coding agents are only as good as the context they&apos;re given. <code>AGENTS.md</code>{" "}
              has become the shared convention for telling an agent your stack, your rules, and your
              patterns — the difference between an agent that guesses and one that works the way your
              team actually does.
            </p>
          </div>

          <div className="am-section">
            <h3>Quick how to use</h3>
            <p>
              Pick a category on the left, choose the options that fit your project, and hit{" "}
              <strong>Add to document</strong>. Edit the result freely, then export as{" "}
              <code>AGENTS.md</code> or copy it to your clipboard. New here? Replay the guided tour
              below.
            </p>
          </div>
        </div>

        <div className="am-footer">
          <a
            href={PORTFOLIO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="am-contact"
          >
            Contact
          </a>
          <ShimmerButton onClick={handleStartOnboarding}>Start onboarding →</ShimmerButton>
        </div>
      </div>
    </Modal>
  )
}
