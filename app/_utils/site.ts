const FALLBACK_ORIGIN = "http://localhost:3000"

export const SITE_NAME = "groundwork"

export const SITE_DESCRIPTION =
  "A decision guide that helps developers build AGENTS.md files for their projects."

// Production origin, set via NEXT_PUBLIC_SITE_URL in the Vercel environment.
// Falls back to localhost for local development.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? FALLBACK_ORIGIN

// Author's portfolio — linked from the header Contact icon and the About modal.
export const PORTFOLIO_URL = "https://seb.bz/"
