## Context

`groundwork` is a single-page Next.js 15 / React 19 client tool deployed on Vercel. The only real route is `/` (`/agents-builder` already redirects there). Today there is no analytics of any kind, the metadata has `og:title`/`og:description`/`og:type` but no image, no `metadataBase`, and no Twitter card, and the product name is inconsistent across surfaces. The stack is intentionally minimal — AGENTS.md requires asking before adding dependencies — so each decision below favors the lightest option that meets the requirement.

## Goals / Non-Goals

**Goals:**
- Measure launch traffic and its acquisition source (UTM), distinguishing Product Hunt from social from direct.
- Measure whether visitors actually use the tool (copy / export / add-to-document).
- Make shared links render a rich preview card on every major platform.
- Make the app indexable and consistently branded as "groundwork".
- Add branded not-found / error states.

**Non-Goals:**
- Full product-analytics suite (funnels, session replay, cohorts) — deferred; the event set is intentionally small.
- A/B testing or experimentation.
- Redesigning the OG artwork or logo (existing brand mark is reused).
- Changing the `/agents-builder` redirect (already correct).
- Cookie-based or identity-level tracking.

## Decisions

### Analytics: Vercel Web Analytics over GA4 / PostHog / Plausible
`@vercel/analytics` is one package, native to the Vercel target, cookieless (no consent banner), and automatically captures UTM params and referrer for acquisition attribution. It also supports custom events via `track(name, props)`, which covers the "key actions" need without a second tool.
- *Alternatives:* GA4 — most campaign tooling but needs EU consent + heavier; PostHog — best for funnels but heavier and overkill for a 3-event launch; Plausible/Umami — good and host-agnostic but adds a paid/self-hosted dependency we don't need on Vercel. Chosen Vercel for least weight + zero consent overhead.

### Events: a fixed, named set instrumented at existing handlers
Three events — `copy_document`, `export_document`, `add_to_document` — fired from the existing copy/export handlers (preview header) and the "Add to document" handler (category panel). Event names are constants, not magic strings (per AGENTS.md). No PII in props; at most coarse metadata (e.g. category id for add events) if useful.
- *Rationale:* maps exactly to the acquisition-vs-behavior split in the proposal; keeps instrumentation to a few call sites.

### OG image: dynamic `app/opengraph-image.tsx` via `next/og`
Next's `ImageResponse` ships with Next.js (no new dependency), renders at the edge, and lets the card reuse brand tokens/typography. A static 1200×630 PNG in `public/` is the fallback if a designed asset is preferred.
- *Trade-off:* dynamic gives consistency with zero new deps but is code-as-design; static gives pixel-perfect art but is a manual export. Default to dynamic; swap to static if design wants bespoke artwork.

### Metadata: extend root `metadata` in `app/layout.tsx`
Add `metadataBase: new URL(PRODUCTION_ORIGIN)`, `openGraph.images` + `url` + `siteName`, `twitter: { card: "summary_large_image", ... }`, and `alternates.canonical`. `metadataBase` is mandatory — without it relative OG/canonical URLs don't resolve and scrapers drop them.

### robots / sitemap: App Router file conventions
`app/robots.ts` and `app/sitemap.ts` (typed `MetadataRoute`) over static files in `public/`, so the production origin is sourced from one shared constant and stays in sync with `metadataBase`.

### Brand consolidation: one source of truth for the name
The `<title>` becomes `groundwork — Build your AGENTS.md` (brand-first, keyword subtitle). `WELCOME_CONTENT` and the footer credit in `app/_utils/constants.ts` are updated to "groundwork". README is updated for repo consistency (non-spec).

### Error pages: `app/not-found.tsx` + `app/error.tsx`
Minimal branded components; `error.tsx` is a client component with a `reset()` action and shows no raw stack traces.

## Risks / Trade-offs

- **Missing production origin at build** → `metadataBase`, canonical, robots, and sitemap all need the real domain. Mitigation: source it from one constant / env var; this is a hard prerequisite captured in tasks before the metadata work.
- **`SKILLS_API_KEY` unset in Vercel prod** → app silently serves the static fallback skill list (degrades gracefully, but stale). Mitigation: set the env var as a launch checklist item; not a code change.
- **Dynamic OG render cost / failure** → if `ImageResponse` errors, the card loses its image. Mitigation: keep the route simple (system fonts or one bundled font, no external fetches); static PNG is the fallback path.
- **Bundle weight on first paint** → `mermaid` + `codemirror` + `react-markdown` are heavy; analytics adds little but launch traffic will expose existing weight. Mitigation: run one Lighthouse pass pre-launch (checklist item), out of scope to optimize here.
- **Dev traffic polluting metrics** → mitigated by Vercel Analytics only reporting in production by default.

## Open Questions

- Production origin/domain to hard-set `metadataBase`, canonical, and sitemap — needed before the metadata tasks.
- OG image: dynamic (`next/og`) or a designer-provided static PNG? Default is dynamic unless bespoke artwork is wanted.
- Should `add_to_document` carry the category id as a property (richer funnels) or stay anonymous? Default: include category id, no PII.
