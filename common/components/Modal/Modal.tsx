"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  /** Accessible label for the dialog and its close button. */
  label?: string
  /**
   * Skip the default surface panel + close button and render children directly
   * in the overlay. Use when the caller supplies its own fully-styled card.
   */
  bare?: boolean
}

/**
 * Minimal reusable dialog primitive: portals to `document.body`, dims the page,
 * and closes on backdrop click or Escape. Callers own the panel's inner content.
 */
export function Modal({ isOpen, onClose, children, label = "Dialog", bare = false }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)
    // Move focus into the panel so keyboard users land inside the dialog.
    panelRef.current?.focus()
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || typeof document === "undefined") return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={
          bare
            ? "outline-none"
            : "border-border bg-surface relative w-full max-w-md rounded-md border shadow-xl outline-none"
        }
      >
        {!bare && (
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground absolute top-3 right-3 rounded p-1 transition-colors"
          >
            <X size={16} />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  )
}
