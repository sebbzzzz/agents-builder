"use client"

import type { ButtonHTMLAttributes } from "react"

import { cn } from "@/common/utils/cn"

type ShimmerButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function ShimmerButton({ className, children, type = "button", ...props }: ShimmerButtonProps) {
  return (
    <button type={type} className={cn("shimmer-btn", className)} {...props}>
      {children}
    </button>
  )
}
