## 1. Color Tokens + Typography

- [x] 1.1 Replace `:root` token block in `styles/globals.css` with the warm near-black palette (`--background` ← `oklch(0.16 0.008 60)`, `--surface`/`--panel` ← `oklch(0.19 0.008 60)`, etc.) plus the full accent variant set (`--accent-ghost`, `--accent-faint`, `--accent-grad`, `--accent-grad-hover`, `--accent-2`, `--border-strong`)
- [x] 1.2 Add `--font-mono` to `@theme inline` in `globals.css` mapped to `var(--font-mono)`
- [x] 1.3 In `app/layout.tsx`: replace `Geist` import with `Inter` and `JetBrains_Mono` from `next/font/google`; expose `--font-sans` and `--font-mono` variables; update metadata title/description for "groundwork" rebrand; add `og:title` and `og:description` meta
- [x] 1.4 Add `.btn-primary` rule in `globals.css` (gradient background, dark text, font-weight 600); apply hover gradient variant

## 2. Brand Identity

- [x] 2.1 Create `components/common/LogoMark.tsx` — inline SVG 14×14px, outer rect 1.5px stroke `currentColor` (inherit accent color from parent), inner rect inset 2px with `fill="rgb(255 120 29 / 0.14)"`
- [x] 2.2 Create `app/icon.tsx` (Next.js `ImageResponse`) returning the logo mark SVG as favicon
- [x] 2.3 Update `components/category/CategoryHeader.tsx` to render `<LogoMark />` + "groundwork" wordmark side-by-side with 8px gap; update tagline

## 3. shadcn Component Restyling

- [x] 3.1 Update `components/ui/checkbox.tsx`: change `rounded-[4px]` → `rounded-[2px]`, remove any `bg-white`/light fill, ensure `data-checked:bg-accent data-checked:border-accent` stays; set unchecked bg to `transparent`
- [x] 3.2 Update `components/ui/radio-group.tsx` (`RadioGroupItem`): ensure `rounded-full` stays (circles), unchecked bg `transparent`, checked uses `data-checked:bg-accent`; indicator dot uses `bg-background` (dark) for contrast
- [x] 3.3 Update `components/ui/switch.tsx`: track checked state uses `data-checked:bg-accent`; thumb unchecked `bg-foreground-2`, thumb checked `bg-background`; no white fills
- [x] 3.4 Update `components/ui/input.tsx`: `rounded-[2px]`, `bg-transparent`, border `border-border`; ensure no white/light fills
- [x] 3.5 Update `components/ui/select.tsx` trigger: `rounded-[2px]`, `bg-transparent`, same flat style

## 4. Data Model Extension

- [x] 4.1 Add `owner?: string` and `installs?: string` optional fields to the `Option` interface in `data/categories.ts`
- [x] 4.2 Populate `owner` and `installs` on existing skills options in `data/categories.ts`
- [x] 4.3 Add `skillTriggers: Record<string, string>` to `AppStore` state + `types/store.ts`
- [x] 4.4 Add `setSkillTrigger(skillId: string, phrase: string)` action to `store/useAppStore.ts`
- [x] 4.5 Wire `setSkillTrigger(id, "")` inside `toggleSelection` when a skill is unchecked

## 5. SkillRow + TriggerCard Components

- [x] 5.1 Create `components/category/SkillRow.tsx`
- [x] 5.2 Create `components/category/TriggerCard.tsx`
- [x] 5.3 Add `TRIGGER_TEMPLATES` array to `lib/constants.ts`
- [x] 5.4 Update `components/category/SubCategoryInputs.tsx`: replace "Coming soon" for skills and triggers with full implementations

## 6. buildAgentsFile Output

- [x] 6.1 Handle `type === "skills"` — emit `## Available Skills` bash block
- [x] 6.2 Handle `type === "triggers"` — emit `## Auto-invoke Skills` bullets; update function signature
- [x] 6.3 Update `AppShell.tsx` to pass `skillTriggers` to `buildAgentsFile`

## 7. Quality Gates

- [x] 7.1 Run `yarn typecheck` — no errors
- [x] 7.2 Run `yarn lint:fix` — clean
- [x] 7.3 Run `yarn format:write` — clean
- [ ] 7.4 Manually verify: color tokens visible (warm dark bg, orange accents), Inter font loads, JetBrains Mono on mono elements, logo mark in header, favicon in tab
- [ ] 7.5 Manually verify: skills checklist rows render with name + metadata; selecting skills causes trigger cards to appear; trigger input stores phrase; output preview shows both blocks
