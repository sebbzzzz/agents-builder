## 1. Dependencies & shadcn/ui Setup

- [x] 1.1 Install Zustand: `yarn add zustand`
- [x] 1.2 Install react-markdown: `yarn add react-markdown`
- [x] 1.3 Run `npx shadcn@latest init` — choose CSS variables mode, confirm no `tailwind.config.js` is created
- [x] 1.4 Install required shadcn components: `npx shadcn@latest add button tabs scroll-area tooltip separator`
- [x] 1.5 Run `yarn typecheck` and `yarn lint` — confirm no errors introduced by installs

## 2. Design System Tokens

- [x] 2.1 Add CSS custom properties to `styles/globals.css` inside a `:root` block: `--color-background`, `--color-surface`, `--color-border`, `--color-text-primary`, `--color-text-muted`, `--color-accent` (#f97316), `--color-accent-hover`
- [x] 2.2 Extend Tailwind 4's `@theme` block in `globals.css` to map those custom properties to Tailwind utility names (`bg-background`, `bg-surface`, `border-border`, `text-primary`, `text-muted`, `bg-accent`, etc.)
- [x] 2.3 Apply `bg-background text-primary` to the root `<body>` in `app/layout.tsx`
- [x] 2.4 Verify accent color renders on a test `<button>` in the dev server before removing the test

## 3. Zustand Store

- [x] 3.1 Create `store/useAppStore.ts` with the five slices: `activeCategory`, `selections`, `markdownOutput`, `activeView`, `isDirty` — with their correct initial values and setter actions
- [x] 3.2 Export the store as a named hook: `export const useAppStore = create<AppStore>()(...)`
- [x] 3.3 Define the `AppStore` TypeScript interface in `types/store.ts` and import it in the store file
- [x] 3.4 Run `yarn typecheck` — confirm the store types are correct

## 4. App Shell Layout

- [x] 4.1 Create `components/layout/AppShell.tsx` — `"use client"` component that renders a full `h-dvh overflow-hidden` root container with two side-by-side columns
- [x] 4.2 Left column: `w-[30%] h-full flex flex-col border-r border-border`
- [x] 4.3 Right column: `w-[70%] h-full flex flex-col`
- [x] 4.4 Update `app/layout.tsx` — set `<html>` and `<body>` to `h-full` to support dvh layout
- [x] 4.5 Update `app/page.tsx` to import and render `<AppShell />` with no other content

## 5. Category Panel (Left Column)

- [x] 5.1 Create `data/categories.ts` — export an array of `{ id: string; label: string }` objects for all 11 categories, Tech Stack first
- [x] 5.2 Create `types/category.ts` — export the `Category` interface
- [x] 5.3 Create `components/category/CategoryHeader.tsx` — sticky header with app name "AGENTS.md" and a subtle tagline
- [x] 5.4 Create `components/category/CategoryList.tsx` — scrollable list that maps over `categories`, renders each as a clickable item; calls `setActiveCategory` on click; applies orange accent style to the active item using `useAppStore`
- [x] 5.5 Create `components/category/ChecklistArea.tsx` — renders the active category name as a heading and a placeholder "Options coming soon" message; reads `activeCategory` from the store
- [x] 5.6 Compose the left column in `AppShell.tsx`: `<CategoryHeader />` (sticky) + `<CategoryList />` (scrollable) + `<ChecklistArea />` (scrollable)

## 6. Preview Panel (Right Column)

- [x] 6.1 Create `components/preview/PreviewHeader.tsx` — sticky header with a Code/Preview toggle (shadcn Tabs or two Buttons), Copy button, and Export button; reads and sets `activeView` from the store
- [x] 6.2 Create `components/preview/CodeView.tsx` — renders `markdownOutput` from the store in a `<pre>` with monospace font and `overflow-y-auto`; shows placeholder text when `markdownOutput` is empty
- [x] 6.3 Create `components/preview/RenderedView.tsx` — lazy-loads `react-markdown` and renders `markdownOutput`; shows same placeholder text when empty
- [x] 6.4 Create `components/preview/PreviewPanel.tsx` — composes `<PreviewHeader />` + conditional render of `<CodeView />` or `<RenderedView />` based on `activeView` from the store
- [x] 6.5 Wire Copy button in `PreviewHeader`: on click, call `navigator.clipboard.writeText(markdownOutput)` and show a 2-second "Copied!" label
- [x] 6.6 Wire Export button in `PreviewHeader`: on click, create a Blob from `markdownOutput` and trigger download as `AGENTS.md`
- [x] 6.7 Compose the right column in `AppShell.tsx`: `<PreviewPanel />`

## 7. QA & Cleanup

- [x] 7.1 Verify no page scroll occurs — body scrollbar is absent, only column content scrolls
- [x] 7.2 Verify category click updates active style and checklist heading
- [x] 7.3 Verify Code / Preview toggle switches views correctly
- [x] 7.4 Verify Copy button writes to clipboard (check with DevTools)
- [x] 7.5 Verify Export button downloads a file named `AGENTS.md`
- [x] 7.6 Run `yarn typecheck`, `yarn lint:fix`, `yarn format:write` — all must pass with zero errors
- [x] 7.7 Remove any `console.log` or debug code introduced during development
