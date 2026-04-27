"use client"

import { useCallback, useEffect, useRef } from "react"

import { useDocumentStore } from "@/store/useDocumentStore"

const AUTO_SAVE_DELAY = 3000

/**
 * Returns a stable `scheduleAutoSave(text)` callback.
 * Call it from the CodeMirror updateListener whenever docChanged is true.
 * - Each call resets a 3 s timer.
 * - When the timer fires, it writes the raw text to the store.
 * - The timer does not restart after firing — only resets on the next call.
 * - The pending timer is cleared on unmount.
 */
export function useAutoSave(): (text: string) => void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const setContent = useDocumentStore((s) => s.setContent)
  const setIsDirty = useDocumentStore((s) => s.setIsDirty)

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return useCallback(
    (text: string) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }

      timerRef.current = setTimeout(() => {
        setContent(text)
        setIsDirty(false)
        timerRef.current = null
      }, AUTO_SAVE_DELAY)
    },
    [setContent, setIsDirty],
  )
}
