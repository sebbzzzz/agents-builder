import "@/styles/globals.css"

import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import { cn } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "groundwork",
  description: "A decision guide that helps developers build AGENTS.md files for their projects.",
  openGraph: {
    title: "groundwork",
    description: "A decision guide that helps developers build AGENTS.md files for their projects.",
    type: "website",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("h-full font-sans", inter.variable, jetbrainsMono.variable)}>
      <body className="bg-background text-foreground h-full overflow-hidden antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
