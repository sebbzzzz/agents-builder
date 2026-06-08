## Why

The app is feature-complete but not launch-ready. Before a public release (Product Hunt + social), we have no way to measure traffic or where it comes from, shared links render as bare text with no preview card, and the product name is inconsistent across user-visible surfaces. These gaps directly cap launch-day reach and our ability to learn from it.

## What Changes

- **Usage analytics**: Add Vercel Web Analytics for pageview + UTM acquisition tracking (so we can tell Product Hunt from social from direct), plus a small set of custom events for the actions that signal real usage: copy/export of the AGENTS.md document, and add-option-to-document.
- **Social & discovery metadata**: Add the missing OG image (1200×630), `metadataBase`, Twitter `summary_large_image` card, `og:url` / `og:site_name`, canonical URL, `robots.txt`, and `sitemap.xml`. Without `metadataBase`, OG image URLs won't resolve to absolute and scrapers will ignore them — so it ships together with the image.
- **Brand consolidation**: Make "groundwork" the consistent public name across all user-visible surfaces (currently the editor welcome content says "AGENTS.md Builder" and the footer links to "agents-builder"), and give the page `<title>` a keyword subtitle (`groundwork — Build your AGENTS.md`) so the tool is discoverable by search, not just by brand.
- **Pre-release polish**: Add `not-found` and `error` pages so stray URLs and runtime errors render branded states instead of Next.js defaults.
- **Deployment readiness** (non-spec): ensure `SKILLS_API_KEY` is set in the Vercel production environment so the skills list isn't silently served from the static fallback.

Not in scope: the `/agents-builder` → `/` redirect is already specified as intentional (avoid broken legacy links) and needs no change.

## Capabilities

### New Capabilities
- `usage-analytics`: Pageview + UTM acquisition tracking and a defined set of custom in-app events, via Vercel Web Analytics.
- `social-discovery`: OG image, Twitter card, `metadataBase`, canonical/`og:url`/`og:site_name`, `robots.txt`, and `sitemap.xml` for link previews and search indexing.
- `error-pages`: Branded `not-found` and runtime `error` pages.

### Modified Capabilities
- `brand-identity`: Extend the title requirement to include a keyword subtitle, and require the editor welcome content and footer to use the "groundwork" name consistently.

## Impact

- **Code**: `app/layout.tsx` (metadata, Analytics component), new `app/robots.ts`, `app/sitemap.ts`, `app/opengraph-image.tsx` (or static asset in `public/`), `app/not-found.tsx`, `app/error.tsx`, `app/_utils/constants.ts` (welcome/footer copy), and `track()` calls at the export/copy and add-to-document handlers.
- **Dependencies**: adds `@vercel/analytics` (one package; aligned with the Vercel deployment target). No other new libraries.
- **Config / ops**: requires the production domain to set `metadataBase`/canonical; requires `SKILLS_API_KEY` in Vercel prod env.
- **Privacy**: Vercel Web Analytics is cookieless — no consent banner required.
