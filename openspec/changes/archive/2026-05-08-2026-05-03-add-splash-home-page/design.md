## Decisions

### Route name: `/agents-builder`
The builder is specifically for AGENTS.md files today; the product may expand to DESIGN.md or other structured files later. Using `/agents-builder` over `/editor` signals what you're building, not just the UI chrome.

### Reuse `<CategoryHeader>` on the splash page
The Splash.html topbar and CategoryHeader share the same 44px shell. Rather than a new component with slightly different content, the same header is reused on both routes. The subtitle text ("Create your solid Agents.md file...") and the "By: seb.bz" link are visible on the splash too — consistent brand presence, zero duplication.

### Splash is a server component (no `"use client"`)
The page is fully static — no interactivity, no store reads. Staggered entrance animations are CSS-only (`animation-delay`), so no client JS is needed. This keeps the initial page weight minimal.

### Ghost code content stays as static decorative fiction
The background AGENTS.md preview uses made-up project details. It's atmosphere, not live data. Pulling from a real document would add complexity with no user-facing benefit on the home page.

### Token mapping — no new CSS variables
Splash.html introduced its own `--bg`, `--rule`, `--ink-N` vars. These are 1:1 aliases of the existing design system. Rather than adding them to `:root`, all usages are translated to the Tailwind utilities that already map to the correct values. This keeps the token surface small and avoids two names for the same thing.

### `@keyframes` in `globals.css`, not inline
`reveal` and `blink` are small and reusable. Adding them to `globals.css` makes them available app-wide via `animate-*` if needed elsewhere (e.g. future modals, tooltips). They are not Tailwind plugin extensions — just raw `@keyframes` in the base layer.

### Feature pills: count-only update
Pills reflect real features. The count updates from 11 → 14 to match the actual category data. The labels ("live markdown preview", "skills.sh integration", "export to .md", "no backend · no auth") remain accurate and unchanged.
