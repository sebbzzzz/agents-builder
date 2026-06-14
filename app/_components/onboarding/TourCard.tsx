"use client"

import type { PopoverContentProps } from "@reactour/tour"

import { cn } from "@/common/utils/cn"
import { useEditorContext } from "@/common/providers/EditorContext"
import { useAppStore } from "@/store/useAppStore"

import {
  PROJECT_CONTEXT_PROMPT,
  SIDEBAR_SELECTOR,
  STEP_META,
  TOTAL_STEPS,
} from "./onboarding.steps"

const PANEL_STEP = 2 // index of the floating-panel step

function setSidebarOverflow(visible: boolean) {
  const aside = document.querySelector(SIDEBAR_SELECTOR) as HTMLElement | null
  if (!aside) return
  if (visible) aside.style.setProperty("overflow", "visible", "important")
  else aside.style.removeProperty("overflow")
}

/**
 * The onboarding popover, rendered as React JSX in place of reactour's default
 * chrome. Owns the three-zone card layout and the per-step app-state
 * choreography that the tour drives automatically.
 */
export function TourCard({ currentStep, setCurrentStep, setIsOpen }: PopoverContentProps) {
  const setActiveCategory = useAppStore((s) => s.setActiveCategory)
  const clearActiveCategory = useAppStore((s) => s.clearActiveCategory)
  const { injectOption } = useEditorContext()

  const meta = STEP_META[currentStep] ?? STEP_META[0]

  // Establish the app state a given step depends on. Called on both forward and
  // backward navigation so steps remain consistent regardless of direction.
  // Returns the delay (ms) reactour should wait before switching to the step,
  // so a step whose target mounts on demand (the panel) is in the DOM and
  // measurable before reactour positions on it.
  function enterStep(index: number): number {
    if (index === PANEL_STEP) {
      setActiveCategory("project-context")
      setSidebarOverflow(true)
      return 250
    }
    clearActiveCategory()
    setSidebarOverflow(false)
    return 0
  }

  function goTo(index: number) {
    const delay = enterStep(index)
    if (delay) window.setTimeout(() => setCurrentStep(index), delay)
    else setCurrentStep(index)
  }

  function next() {
    // Leaving the options panel: inject the demo selection before advancing.
    if (currentStep === PANEL_STEP) {
      setSidebarOverflow(false)
      injectOption("Project Context", PROJECT_CONTEXT_PROMPT)
    }
    if (currentStep >= TOTAL_STEPS - 1) {
      // Finish — teardown (reset editor + flag) runs in the close-detection effect.
      setIsOpen(false)
      return
    }
    goTo(currentStep + 1)
  }

  function back() {
    if (currentStep === 0) return
    goTo(currentStep - 1)
  }

  return (
    <div className={cn("gw-popover", meta.isWelcome && "gw-popover--welcome")}>
      <div className="gw-header">
        <span className="gw-mark" aria-hidden />
        <span className="gw-crumb">
          {meta.crumb.map((part, i) => (
            <span key={part}>
              {i > 0 && <span className="sep">/</span>}
              {part}
            </span>
          ))}
        </span>
        <span className="gw-count">{meta.count}</span>
        <button
          type="button"
          className="gw-close"
          aria-label="Close tour"
          onClick={() => setIsOpen(false)}
        >
          ×
        </button>
      </div>

      <span className="gw-eyebrow">{meta.eyebrow}</span>
      <h2 className="gw-title">{meta.title}</h2>
      {/* Copy is static, authored in onboarding.steps — safe to render as HTML. */}
      <p className="gw-desc" dangerouslySetInnerHTML={{ __html: meta.description }} />

      <div className="gw-footer">
        <span className="gw-ticks" aria-hidden>
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <span
              key={i}
              className={cn(
                "gw-tick",
                i < currentStep && "is-done",
                i === currentStep && "is-now",
              )}
            />
          ))}
        </span>
        <div className="gw-nav">
          {currentStep > 0 && (
            <button type="button" className="gw-back" onClick={back}>
              Back
            </button>
          )}
          <button type="button" className="gw-next" onClick={next}>
            {meta.nextLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
