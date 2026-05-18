"use client"

import { useEffect, useRef } from "react"
import { driver } from "driver.js"
import "./onboarding.css"

import { WELCOME_CONTENT } from "@/app/_utils/constants"
import { useEditorContext } from "@/common/providers/EditorContext"
import { useAppStore } from "@/store/useAppStore"
import { useDocumentStore } from "@/store/useDocumentStore"
import { useOnboardingStore } from "@/store/useOnboardingStore"

const STEP_META = [
  {
    eyebrow: "Welcome",
    crumb: ["groundwork", "onboarding", "tour"],
    count: "INTRO",
    isWelcome: true,
  },
  {
    eyebrow: "Step · categories",
    crumb: ["groundwork", "sidebar"],
    count: "01 / 04",
    isWelcome: false,
  },
  {
    eyebrow: "Step · options",
    crumb: ["groundwork", "options panel"],
    count: "02 / 04",
    isWelcome: false,
  },
  { eyebrow: "Step · editor", crumb: ["groundwork", "editor"], count: "03 / 04", isWelcome: false },
  { eyebrow: "Step · export", crumb: ["groundwork", "export"], count: "04 / 04", isWelcome: false },
] as const

const PROJECT_CONTEXT_PROMPT =
  "**Context:** Production project (serving real users)\n\n" +
  "- Apply the full constraint set: strict typing, test coverage, lint checks before commit\n" +
  "- No debug code (`console.log`, `debugger`) in merged PRs\n" +
  "- Mandatory PR reviews — at least one approval before merge\n" +
  "- Treat every change as potentially user-facing: consider error states, loading states, and edge cases"

export function OnboardingOrchestrator() {
  const { isActive, init, complete, skip } = useOnboardingStore()
  const setActiveCategory = useAppStore((s) => s.setActiveCategory)
  const clearActiveCategory = useAppStore((s) => s.clearActiveCategory)
  const { injectOption, replaceContent } = useEditorContext()
  const setContent = useDocumentStore((s) => s.setContent)

  const driverRef = useRef<ReturnType<typeof driver> | null>(null)
  const handledRef = useRef(false)

  useEffect(() => {
    const t = setTimeout(() => init(), 300)
    return () => clearTimeout(t)
  }, [init])

  function resetEditor() {
    replaceContent(WELCOME_CONTENT, true)
    setContent(WELCOME_CONTENT)
  }

  useEffect(() => {
    if (!isActive) return

    handledRef.current = false

    const d = driver({
      animate: true,
      smoothScroll: false,
      overlayColor: "rgba(0,0,0,0.65)",
      popoverClass: "gw-popover",
      allowClose: true,
      stageRadius: 4,
      showProgress: true,
      onPopoverRender: (popover, { state }) => {
        const stepIndex = (state.activeIndex ?? 0) as number
        const meta = STEP_META[stepIndex] ?? STEP_META[0]
        const totalSteps = STEP_META.length

        // Welcome step gets wider centered variant
        if (meta.isWelcome) {
          popover.wrapper.classList.add("gw-popover--welcome")
        }

        // Capture title text before we mutate the header element
        const originalTitle = popover.title.innerText.trim()

        // ── Header: clear and repopulate as flex row ──────────────────────
        popover.title.innerHTML = ""

        const mark = document.createElement("span")
        mark.className = "gw-mark"
        popover.title.appendChild(mark)

        const crumb = document.createElement("span")
        crumb.className = "gw-crumb"
        crumb.innerHTML = meta.crumb
          .map((part, i) => (i === 0 ? part : `<span class="sep">/</span>${part}`))
          .join("")
        popover.title.appendChild(crumb)

        const countPill = document.createElement("span")
        countPill.className = "gw-count"
        countPill.textContent = meta.count
        popover.title.appendChild(countPill)

        // Move close button into header flex row (was absolutely positioned on wrapper)
        popover.title.appendChild(popover.closeButton)
        popover.title.style.display = "flex"

        // ── Body: inject eyebrow + h2 before description ──────────────────
        const eyebrow = document.createElement("span")
        eyebrow.className = "gw-eyebrow"
        eyebrow.textContent = meta.eyebrow
        popover.description.parentElement!.insertBefore(eyebrow, popover.description)

        const h2 = document.createElement("h2")
        h2.className = "gw-title"
        h2.textContent = originalTitle
        popover.description.parentElement!.insertBefore(h2, popover.description)

        // ── Footer: replace progress text with tick bars ──────────────────
        const ticks = document.createElement("span")
        ticks.className = "gw-ticks"
        for (let i = 0; i < totalSteps; i++) {
          const tick = document.createElement("span")
          tick.className =
            i < stepIndex ? "gw-tick is-done" : i === stepIndex ? "gw-tick is-now" : "gw-tick"
          ticks.appendChild(tick)
        }
        popover.progress.innerHTML = ""
        popover.progress.appendChild(ticks)
      },
      onDestroyed: () => {
        const aside = document.querySelector("[data-onboarding='sidebar']") as HTMLElement | null
        if (aside) aside.style.removeProperty("overflow")
        if (!handledRef.current) {
          handledRef.current = true
          clearActiveCategory()
          resetEditor()
          skip()
        }
      },
      steps: [
        {
          popover: {
            title: "Welcome to groundwork",
            description:
              "Build your <strong>AGENTS.md</strong> in a few clicks — not hours.<br/><br/>This quick tour shows you how. Takes about 30 seconds.",
            side: "over",
            align: "center",
            showButtons: ["next", "close"],
            nextBtnText: "Start tour →",
            onNextClick: () => d.moveNext(),
          },
        },
        {
          element: "[data-onboarding='sidebar']",
          popover: {
            title: "Your categories",
            description:
              "14 categories cover every decision your agent needs — project context, tech stack, testing patterns, and more.",
            side: "right",
            align: "start",
            onNextClick: () => {
              setActiveCategory("project-context")
              const aside = document.querySelector(
                "[data-onboarding='sidebar']",
              ) as HTMLElement | null
              if (aside) aside.style.setProperty("overflow", "visible", "important")
              setTimeout(() => d.moveNext(), 150)
            },
          },
        },
        {
          element: "[data-onboarding='floating-panel']",
          popover: {
            title: "Pick your options",
            description:
              "Each category opens a panel like this one. Select what fits your project, then hit <strong>Add to document</strong> — we'll do it now.",
            side: "right",
            align: "start",
            onNextClick: () => {
              const aside = document.querySelector(
                "[data-onboarding='sidebar']",
              ) as HTMLElement | null
              if (aside) aside.style.removeProperty("overflow")
              injectOption("Project Context", PROJECT_CONTEXT_PROMPT)
              clearActiveCategory()
              setTimeout(() => d.moveNext(), 100)
            },
          },
        },
        {
          element: "[data-onboarding='editor']",
          popover: {
            title: "Your document",
            description:
              "Your selections land here as structured markdown. Edit freely — add your own notes, reorder sections, or delete what you don't need.",
            side: "left",
            align: "start",
            onNextClick: () => d.moveNext(),
          },
        },
        {
          element: "[data-onboarding='export-buttons']",
          popover: {
            title: "Get your file",
            description:
              "Export as <strong>AGENTS.md</strong> or copy to clipboard. Drop it in the root of your repo — your agent finally knows what it's doing.",
            side: "bottom",
            align: "end",
            nextBtnText: "Finish",
            onNextClick: () => {
              handledRef.current = true
              resetEditor()
              complete()
              d.destroy()
            },
          },
        },
      ],
    })

    driverRef.current = d
    d.drive()

    return () => {
      d.destroy()
      driverRef.current = null
    }
  }, [isActive]) // deps intentionally limited — driver is created once per activation

  return null
}
