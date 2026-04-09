import "@/styles/globals.css"

import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "AGENTS.md Generator",
  description: "A decision guide that helps developers build AGENTS.md files",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
