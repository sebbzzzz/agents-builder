import "@/styles/globals.css"

import type { Metadata } from "next"
import { Geist } from "next/font/google"

import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "AGENTS.md Generator",
  description: "A decision guide that helps developers build AGENTS.md files",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("h-full font-sans", geist.variable)}>
      <body className="bg-background text-foreground h-full antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
