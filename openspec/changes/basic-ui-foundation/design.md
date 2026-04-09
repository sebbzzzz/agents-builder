## Context

The project scaffold exists (Next.js 15, React 19, Tailwind 4, TypeScript) but has no meaningful UI. The product is a two-column decision guide: a category browser on the left and a live markdown file preview on the right. Both panels need to be independently scrollable while the page itself never scrolls — a strict viewport-fill constraint. State must be centralized early because future work (category selections → markdown output, inline editing → state update) requires a single source of truth that both panels read and write.

## Goals / Non-Goals

**Goals:**
- Install shadcn/ui and wire it into the existing Tailwind 4 setup
- Define a design token system (black/white/orange) as CSS custom properties
- Build the fixed two-column shell (30% / 70%) that fills the viewport exactly
- Implement the category panel left column with a scrollable category list and placeholder checklist area
- Implement the preview panel right column with a Code / Preview toggle, Copy, and Export buttons, and a scrollable content area
- Create a Zustand store with slices for all state that both panels will eventually share
- Keep the component graph shallow and the store interface stable enough to absorb future categories without refactoring

**Non-Goals:**
- Connecting real category data to the checklist (next change)
- Generating real markdown output from selections (next change)
- Inline editing of the preview content (future change)
- Mobile / responsive layout (desktop-only for MVP per SPECS.md)
- Authentication, persistence, or any backend

## Decisions

### 1. shadcn/ui over a full component library (Mantine, Chakra)

shadcn copies component source into the project rather than importing from a package. This means zero runtime dependency lock-in, full Tailwind 4 compatibility, and complete freedom to restyle. The tradeoff is that components live in `components/ui/` and must be maintained manually when shadcn releases updates — acceptable for a small-team MVP.

**Alternatives considered:**
- **Radix UI headless only**: More work to style from scratch; shadcn already does this for us.
- **daisyUI**: Plugin-only, no Radix behavior primitives; tooltips, dropdowns, and popovers would need custom implementation.
- **Mantine**: Ships its own styling system that conflicts with Tailwind 4 custom property architecture.

### 2. CSS custom properties for design tokens, extended into Tailwind 4

Tailwind 4 uses `@theme` blocks in CSS to define tokens. We define the full palette as CSS custom properties in `globals.css` and reference them via Tailwind utility names. This gives us one authoritative token file and lets both Tailwind classes and arbitrary `style=` props read the same values.

Token set:
```
--color-background: #0a0a0a   (near-black)
--color-surface: #141414      (panel background)
--color-border: #262626       (subtle borders)
--color-text-primary: #fafafa
--color-text-muted: #737373
--color-accent: #f97316       (orange-500 — actions, active states, highlights)
--color-accent-hover: #ea6a0a
```

### 3. Zustand over React Context + useReducer

SPECS.md specifies `useState`/`useReducer` for state but the proposal explicitly upgrades to Zustand. Reason: the preview panel is an editor that will write back to the same state the category panel writes to. With Context this creates a deeply nested provider tree and potential re-render storms. Zustand's selector-based subscriptions let each panel subscribe to only the slice it needs.

Store slices:
- `activeCategory: string | null` — which category the left panel has selected
- `selections: Record<string, string[]>` — checked option IDs per category
- `markdownOutput: string` — the assembled markdown; initially empty string
- `activeView: 'code' | 'preview'` — which tab the right panel shows
- `isDirty: boolean` — whether the user has manually edited the markdown (blocks auto-regeneration)

Actions are co-located with their slice. No selectors library needed at this scale.

### 4. Fixed viewport layout via `h-dvh overflow-hidden` on the root, `overflow-y-auto` on each panel

The spec requires no page scroll. The cleanest CSS approach: `<html>` and `<body>` get `height: 100%`, the shell gets `height: 100dvh; overflow: hidden`, and each column gets `height: 100%; overflow-y: auto`. This avoids `position: fixed` hacks and works correctly on mobile browsers if we ever need them.

### 5. `components/layout/`, `components/category/`, `components/preview/` as feature folders inside components/

Per the AGENTS.md folder-to-layer mapping, `components/` is UI only. Feature subfolders keep category and preview concerns separate without a separate `features/` directory. `components/ui/` is reserved for shadcn-generated primitives.

### 6. `react-markdown` for the rendered preview view

The right panel needs to render the markdown string as HTML. `react-markdown` is the standard React library for this — it has no DOM dependency, works with React 19, and renders safely (no `dangerouslySetInnerHTML`). It stays in a lazy-loaded boundary so it doesn't add to the initial bundle.

## Risks / Trade-offs

- **shadcn/ui + Tailwind 4 compatibility** → shadcn's Tailwind 4 support was formalized in late 2024 using the `--css-variables` flag. Run `npx shadcn@latest init` with the `--css-variables` style option and verify the generated CSS uses `@theme` blocks, not `tailwind.config.js`.
- **Zustand store grows unbounded** → Keep slices flat. If a slice exceeds ~10 keys, split it into a separate store file. Document slice ownership in `store/README.md` if it gets complex.
- **`react-markdown` bundle size** → ~35 kB gzipped. Lazy-load the `PreviewContent` component so it only loads when the user switches to Preview view.
- **DVH units on older browsers** → `dvh` is supported in all modern browsers since 2023. If Safari 15 support is ever required, fall back to `vh` + JS-based resize. Not a concern for MVP.

## Open Questions

1. **Category list data source for this change** — static array in `data/categories.ts` with just the 11 category names, or full category objects? Recommendation: include full objects (id, label) so the panel can render accurately from day one; options/tooltips can be stubs.
2. **Orange shade** — `orange-500` (#f97316) or a custom hex? Recommendation: use Tailwind's `orange-500` mapped to `--color-accent` so it stays in the design token system.
3. **shadcn component set for this change** — only `Button`, `Tabs`, `ScrollArea`, `Tooltip`, and `Separator` are needed. Do not install the full component library.
