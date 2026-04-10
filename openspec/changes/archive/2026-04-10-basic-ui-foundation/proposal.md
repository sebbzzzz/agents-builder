## Why

The project has a working scaffold and tooling but no UI — users cannot interact with the decision guide at all. This change lays the foundational interface so that all future category and preview features have a stable, scalable shell to build into.

## What Changes

- Install and configure **shadcn/ui** as the component primitive library (Radix UI + Tailwind, no runtime lock-in)
- Establish a **design system** — CSS custom properties for a sober black/white/orange palette, wired into Tailwind 4
- Build the **two-column app shell**: fixed viewport (no page scroll), left panel (30%) + right panel (70%), each independently scrollable
- Create the **category panel** (left): static category list nav + placeholder checklist area
- Create the **preview panel** (right): togglable Code (raw markdown) view and Rendered (HTML) view, with Copy and Export buttons in the header
- Create a **Zustand store** as the single source of truth for all app state (selections, markdown content, active category, active view)
- Wire the layout into `app/page.tsx` so it is immediately visible on `yarn dev`

## Capabilities

### New Capabilities

- `design-system`: CSS custom property palette (black, white, orange) + Tailwind 4 theme extension; all color tokens defined once and consumed everywhere
- `app-shell`: Fixed full-viewport two-column layout, no page scroll, only column scroll; root layout wired to this shell
- `category-panel`: Left column — scrollable category list + checklist placeholder; active category state drives the checklist
- `preview-panel`: Right column — header with view toggle (Code / Preview) + Copy + Export; scrollable content area renders either raw markdown or formatted HTML
- `app-state`: Zustand store with slices for selections, markdown output, active category, and active preview view; designed for future category → markdown and editor → markdown flows

### Modified Capabilities

- `project-scaffold`: `app/page.tsx` changes from a minimal placeholder to the entry point that renders the app shell

## Impact

- **New dependencies**: `zustand`, `shadcn/ui` (via CLI, copies component source), `@radix-ui/*` primitives (installed by shadcn), `react-markdown` (for rendered preview)
- **Modified files**: `app/page.tsx`, `app/layout.tsx`, `styles/globals.css`
- **New directories**: `components/layout/`, `components/preview/`, `components/category/`, `store/`
- No backend changes; entirely client-side
- No breaking changes to existing specs — `project-scaffold` minimal shell is replaced by a functional shell, not removed
