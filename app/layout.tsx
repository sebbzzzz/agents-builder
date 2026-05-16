import "@/styles/globals.css"

import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import { cn } from "@/common/utils/cn"
import { TooltipProvider } from "@/common/components/UI/Tooltip"

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
  icons: {
    icon: [
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("h-full font-sans", inter.variable, jetbrainsMono.variable)}>
      <body className="bg-background text-foreground flex h-dvh flex-col antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
