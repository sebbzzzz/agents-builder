import type { StepType } from "@reactour/tour"

export const PROJECT_CONTEXT_PROMPT =
  "**Context:** Production project (serving real users)\n\n" +
  "- Apply the full constraint set: strict typing, test coverage, lint checks before commit\n" +
  "- No debug code (`console.log`, `debugger`) in merged PRs\n" +
  "- Mandatory PR reviews — at least one approval before merge\n" +
  "- Treat every change as potentially user-facing: consider error states, loading states, and edge cases"

/** Selector for the floating options panel — mounted only while a category is active. */
export const PANEL_SELECTOR = '[data-onboarding="floating-panel"]'
/** Selector for the sidebar whose overflow we toggle so the floating panel can escape it. */
export const SIDEBAR_SELECTOR = '[data-onboarding="sidebar"]'

/** Per-step header/body copy. Index aligns with {@link TOUR_STEPS}. */
export const STEP_META = [
  {
    eyebrow: "Welcome",
    crumb: ["onboarding", "tour"],
    count: "INTRO",
    isWelcome: true,
    title: "Welcome to groundwork",
    description:
      "Build your <strong>AGENTS.md</strong> in a few clicks — not hours.<br/><br/>This quick tour shows you how. Takes about 30 seconds.",
    nextLabel: "Start tour →",
  },
  {
    eyebrow: "categories",
    crumb: ["sidebar"],
    count: "01 / 04",
    isWelcome: false,
    title: "Your categories",
    description:
      "14 categories cover every decision your agent needs — project context, tech stack, testing patterns, and more.",
    nextLabel: "Next",
  },
  {
    eyebrow: "options",
    crumb: ["options panel"],
    count: "02 / 04",
    isWelcome: false,
    title: "Pick your options",
    description:
      "Each category opens a panel like this one. Select what fits your project, then hit <strong>Add to document</strong> — we'll do it now.",
    nextLabel: "Next",
  },
  {
    eyebrow: "editor",
    crumb: ["editor"],
    count: "03 / 04",
    isWelcome: false,
    title: "Your document",
    description:
      "Your selections land here as structured markdown. Edit freely — add your own notes, reorder sections, or delete what you don't need.",
    nextLabel: "Next",
  },
  {
    eyebrow: "export",
    crumb: ["export"],
    count: "04 / 04",
    isWelcome: false,
    title: "Get your file",
    description:
      "Export as <strong>AGENTS.md</strong> or copy to clipboard. Drop it in the root of your repo — your agent finally knows what it's doing.",
    nextLabel: "Finish",
  },
] as const

export const TOTAL_STEPS = STEP_META.length

/**
 * reactour step geometry. Content is rendered by the shared `TourCard`
 * `ContentComponent`, so `content` is intentionally empty — all visible copy
 * lives in {@link STEP_META}, and all side-effect choreography lives in TourCard.
 */
export const TOUR_STEPS: StepType[] = [
  {
    // Welcome — centered, no element highlighted.
    selector: "body",
    content: "",
    position: "center",
    styles: {
      maskArea: (base) => ({ ...base, display: "none" }),
      highlightedArea: (base) => ({ ...base, display: "none" }),
    },
  },
  {
    selector: SIDEBAR_SELECTOR,
    content: "",
    position: "right",
  },
  {
    selector: PANEL_SELECTOR,
    content: "",
    position: "right",
    // The panel mounts only after the category opens; observe so reactour
    // positions once it appears.
    mutationObservables: [PANEL_SELECTOR],
    resizeObservables: [PANEL_SELECTOR],
  },
  {
    selector: '[data-onboarding="editor"]',
    content: "",
    position: "left",
  },
  {
    selector: '[data-onboarding="export-buttons"]',
    content: "",
    position: "bottom",
  },
]
