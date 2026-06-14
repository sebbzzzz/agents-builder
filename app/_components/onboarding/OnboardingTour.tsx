"use client"

import { useEffect, useRef } from "react"
import { TourProvider, useTour } from "@reactour/tour"
import "./onboarding.css"

import { WELCOME_CONTENT } from "@/app/_utils/constants"
import { useEditorContext } from "@/common/providers/EditorContext"
import { useAppStore } from "@/store/useAppStore"
import { useDocumentStore } from "@/store/useDocumentStore"
import { useOnboardingStore } from "@/store/useOnboardingStore"

import { TourCard } from "./TourCard"
import { SIDEBAR_SELECTOR, TOUR_STEPS } from "./onboarding.steps"

/**
 * Drives the tour lifecycle from inside the provider: opens it when the
 * onboarding store activates, and runs teardown once on close. Every close path
 * (Finish, ×, ESC, mask) funnels through the same `isOpen` transition, so a
 * single effect resets the editor and sets the completion flag.
 */
function TourStarter() {
  const { isOpen, setIsOpen } = useTour()
  const isActive = useOnboardingStore((s) => s.isActive)
  const complete = useOnboardingStore((s) => s.complete)
  const clearActiveCategory = useAppStore((s) => s.clearActiveCategory)
  const { replaceContent } = useEditorContext()
  const setContent = useDocumentStore((s) => s.setContent)
  const wasOpen = useRef(false)

  useEffect(() => {
    if (isActive) setIsOpen(true)
  }, [isActive, setIsOpen])

  useEffect(() => {
    if (wasOpen.current && !isOpen) {
      clearActiveCategory()
      replaceContent(WELCOME_CONTENT, true)
      setContent(WELCOME_CONTENT)
      const aside = document.querySelector(SIDEBAR_SELECTOR) as HTMLElement | null
      aside?.style.removeProperty("overflow")
      complete()
    }
    wasOpen.current = isOpen
  }, [isOpen, clearActiveCategory, replaceContent, setContent, complete])

  return null
}

export function OnboardingTour() {
  const init = useOnboardingStore((s) => s.init)

  useEffect(() => {
    const t = setTimeout(() => init(), 300)
    return () => clearTimeout(t)
  }, [init])

  return (
    <TourProvider
      steps={TOUR_STEPS}
      ContentComponent={TourCard}
      disableInteraction
      disableKeyboardNavigation={["left", "right"]}
      showBadge={false}
      showCloseButton={false}
      showNavigation={false}
      showDots={false}
      padding={{ mask: 8, popover: 8 }}
      styles={{
        maskWrapper: (base) => ({ ...base, color: "#000", opacity: 0.65 }),
        maskArea: (base) => ({ ...base, rx: 4 }),
        popover: (base) => ({
          ...base,
          padding: 0,
          background: "transparent",
          boxShadow: "none",
          borderRadius: 0,
        }),
      }}
    >
      <TourStarter />
    </TourProvider>
  )
}
