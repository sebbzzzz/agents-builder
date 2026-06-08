## 1. Prerequisites & shared config

- [x] 1.1 Confirm the production domain/origin and the OG image approach (dynamic `next/og` vs static PNG) from Open Questions
- [x] 1.2 Add a single source-of-truth constant for the production origin (used by metadata, canonical, robots, sitemap)
- [ ] 1.3 Set `SKILLS_API_KEY` in the Vercel production environment (deployment checklist, no code change) — also set `NEXT_PUBLIC_SITE_URL` (documented in `.env.example`)

## 2. Usage analytics (`usage-analytics`)

- [x] 2.1 Add `@vercel/analytics` dependency
- [x] 2.2 Mount the `<Analytics />` component in `app/layout.tsx`
- [x] 2.3 Add named event constants (e.g. `copy_document`, `export_document`, `add_to_document`) in a constants module
- [x] 2.4 Fire `copy_document` and `export_document` from the preview header copy/export handlers
- [x] 2.5 Fire `add_to_document` from the "Add to document" handler (optionally with category id, no PII)
- [ ] 2.6 Verify pageviews + UTM attribution and the three events appear in the Vercel Analytics dashboard from a production/preview deploy; confirm localhost is not counted

## 3. Social & discovery metadata (`social-discovery`)

- [x] 3.1 Add `metadataBase` (production origin) to the root `metadata` in `app/layout.tsx`
- [x] 3.2 Create the OG image — placeholder static 1200×630 PNG in `public/og-image.png` (replace with designed artwork before launch)
- [x] 3.3 Add `openGraph.images`, `openGraph.url`, `openGraph.siteName`, and `alternates.canonical` to the metadata
- [x] 3.4 Add `twitter: { card: "summary_large_image", title, description, images }`
- [x] 3.5 Create `app/robots.ts` allowing crawl and referencing the sitemap
- [x] 3.6 Create `app/sitemap.ts` listing the canonical home route
- [ ] 3.7 Validate the card with a real deploy URL in a sharing-debug tool and confirm absolute `og:image` resolution

## 4. Brand consolidation (`brand-identity`)

- [x] 4.1 Set the `<title>` to `groundwork — Build your AGENTS.md` (brand-first keyword subtitle)
- [x] 4.2 Update `WELCOME_CONTENT` in `app/_utils/constants.ts` to use the "groundwork" name (replace "AGENTS.md Builder")
- [x] 4.3 Update the footer credit copy to be consistent with the "groundwork" brand
- [x] 4.4 Update README to use "groundwork" consistently (repo consistency, non-spec)

## 5. Error & not-found pages (`error-pages`)

- [x] 5.1 Create `app/not-found.tsx` — branded 404 with a link back to `/`
- [x] 5.2 Create `app/error.tsx` — client error boundary with a `reset()` retry and no raw stack traces

## 6. Pre-launch verification

- [x] 6.1 Run `yarn typecheck`, `yarn lint:fix`, `yarn format:write` — all clean (changed files lint clean; production build passes)
- [ ] 6.2 Run one Lighthouse pass on a production build and record the scores (no optimization required here) — note: `/` First Load JS is ~667 kB (mermaid/codemirror)
- [ ] 6.3 Manual smoke test: shared-link card renders, robots/sitemap resolve, 404 and error pages render branded, analytics receiving events
