import { CATEGORIES } from "./categories"

export interface Option {
  id: string
  label: string
}

/** Stub options — three per category for testing the fragment sync. */
export const OPTIONS: Record<string, Option[]> = Object.fromEntries(
  CATEGORIES.map((c) => [
    c.id,
    [
      { id: `${c.id}-option-1`, label: `${c.label} option 1` },
      { id: `${c.id}-option-2`, label: `${c.label} option 2` },
      { id: `${c.id}-option-3`, label: `${c.label} option 3` },
    ],
  ]),
)
