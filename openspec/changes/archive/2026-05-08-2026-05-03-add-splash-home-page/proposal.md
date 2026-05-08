## Why

The app currently drops users directly into the editor with no context — there's no landing page explaining what groundwork is or what problem it solves. `Splash.html` was designed as that entry point but never wired into the Next.js app. This change brings it in as the proper home page, moves the editor to a dedicated route, and ensures all visual tokens are expressed through the existing design system rather than ad-hoc CSS.

## What Changes

- **New home page at `/`** built from `Splash.html` — editor-chrome aesthetic, ghost code background, hero copy, CTA row, and feature pills — as a static React server component
- **Editor moves to `/agents-builder`** — current `app/page.tsx` content becomes `app/agents-builder/page.tsx`; the CTA button on the home page links there
- **Reuse existing `<CategoryHeader>`** as the topbar on both the home page and the editor — no new topbar component
- **Token-first styling** — all Splash.html CSS vars translated to existing Tailwind utilities (`bg-background`, `text-muted-foreground`, `font-mono`, etc.); two missing `@keyframes` (`reveal`, `blink`) added to `globals.css`; no new CSS variables introduced
- **Updated feature pills** — count corrected from 11 to 14 decision categories; other pills unchanged

## Capabilities

### New Capabilities

- `splash-home-page`: Full-viewport home page at `/` — topbar (reused `CategoryHeader`), line-number gutter with highlighted rows, ghost code decorative background (aria-hidden, static markdown content), and a hero section with eyebrow label, headline with gradient accent word, description, primary CTA linking to `/agents-builder`, GitHub ghost button, and feature pills. Staggered fade-in + slide-up reveal animation on mount.

### Modified Capabilities

- `editor-route`: Editor is now served at `/agents-builder` instead of `/`. Route is a plain Next.js page with no redirect — users land on splash, click CTA to enter the editor.
- `global-animations`: `globals.css` gains two `@keyframes` — `reveal` (opacity 0→1, translateY 10→0, used for staggered hero entrance) and `blink` (step-end opacity toggle, used for the cursor in the headline).

## Impact

- `app/page.tsx` — replaced with the new splash home page (server component)
- `app/agents-builder/page.tsx` — new file: current editor content moved here
- `app/_components/splash/` — new folder with self-contained splash components: `GhostCode.tsx`, `Hero.tsx`, `FeaturePills.tsx`, `LineGutter.tsx`
- `styles/globals.css` — two new `@keyframes` blocks (`reveal`, `blink`)
