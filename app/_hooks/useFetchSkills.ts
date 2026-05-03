"use client"

import { useEffect, useState } from "react"

import type { Option } from "@/data/categories"
import { STATIC_SKILLS } from "@/data/skills-fallback"

export function useFetchSkills(): { skills: Option[]; isLoading: boolean } {
  const [skills, setSkills] = useState<Option[]>(STATIC_SKILLS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    fetch("/api/skills")
      .then((res) => {
        if (!res.ok) throw new Error("fetch failed")
        return res.json() as Promise<Option[]>
      })
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setSkills(data)
        }
      })
      .catch(() => {
        // keep static fallback already in state
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { skills, isLoading }
}
