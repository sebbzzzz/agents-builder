## Context

The existing design uses Geist, neutral near-blacks, and a generic app title. shadcn components (base-ui under the hood) are wired but visually default. The skills/triggers sub-category types render "Coming soon". This change unifies the visual layer and completes the skills/triggers feature without touching the data model or routing.

## Goals / Non-Goals

**Goals:**
- Replace color tokens with warm near-black palette + structured orange accent system
- Swap fonts to Inter + JetBrains Mono via `next/font/google`
- Apply flat orange active states to shadcn Checkbox, RadioGroup, Switch
- Restyle shadcn Input and Select to match the editorial feel (flat borders, minimal radius)
- Implement SkillRow and TriggerCard render paths in SubCategoryInputs
- Rebrand all user-visible text to "groundwork"
- Add logo mark SVG inline in CategoryHeader

**Non-Goals:**
- Replacing shadcn components with raw HTML inputs
- Adding animation beyond existing Tailwind transitions
- Light mode support
- Changing category data, option IDs, or anchor-based fragment sync

## Decisions

### 1. Token mapping: new semantic names → existing Tailwind aliases

Rather than rename every Tailwind utility across all components, map the new semantic tokens (`--bg`, `--panel`, `--panel-2`, `--rule`, `--rule-2`, `--ink` through `--ink-4`, accent variants) onto the existing CSS variable names that the `@theme inline` block already exposes (`--background`, `--surface`, `--border`, etc.). This means zero component-level class changes just for the color swap.

Mapping:
```
--bg        → --background
--panel     → --surface  (also --card, --popover)
--panel-2   → --secondary / --muted
--rule      → --border  (also --input)
--rule-2    → new --border-strong (added to @theme)
--ink       → --foreground
--ink-2     → new --foreground-2 (Tailwind: text-foreground-2)
--ink-3     → --muted-foreground
--ink-4     → new --foreground-4
--accent    → --accent / --primary / --ring
--accent-2  → new --accent-hover
--accent-ghost → new --accent-ghost
--accent-faint → new --accent-faint
--accent-grad  → new CSS custom property (not a Tailwind color)
```

### 2. shadcn component restyling via Tailwind class replacement

The shadcn components in `components/ui/` use hardcoded Tailwind classes. We update those classes directly — no wrapping, no `@apply` overrides. Key changes:
- `Checkbox`: `data-checked:bg-primary data-checked:border-primary` → keep, but `border-radius: 2px` (override `rounded` class). Remove any `bg-white` or `bg-input`.
- `RadioGroup` items: same pattern, `border-radius: 50%`.
- `Switch`: thumb `bg-foreground` on off, `bg-background` on checked (to contrast against orange track). Track uses `data-checked:bg-primary`.
- `Input`: flat border, `rounded-[2px]`, no white fill — `bg-transparent` or `bg-surface`.

### 3. Fonts via `next/font/google` — no CDN

Import `Inter` and `JetBrains_Mono` from `next/font/google` in `app/layout.tsx`. Expose them as CSS variables `--font-sans` and `--font-mono`. The `@theme inline` block already maps `--font-sans`; add `--font-mono` to Tailwind theme.

### 4. Logo mark as inline SVG component

A `<LogoMark />` component in `components/common/LogoMark.tsx` renders the 14×14px box SVG. It accepts no props. Used only in `CategoryHeader`. Doubles as the favicon via `app/icon.tsx` (Next.js static icon route).

### 5. Skills/Triggers implementation — same store slice as selections

`skillTriggers: Record<string, string>` is added to `AppStore` (keyed by skill option ID → trigger phrase). When a skill is unchecked via `toggleSelection`, its trigger is cleared via `setSkillTrigger(id, "")`. `buildAgentsFile` reads both `selections` (for the skills install block) and `skillTriggers` (for the auto-invoke block).

### 6. Gradient reserved for primary CTAs only

`--accent-grad` is defined as a CSS custom property (not a Tailwind color token) so it cannot accidentally be used via utility classes. Applied only inline or via a dedicated `.btn-primary` class in `globals.css`.

## Risks / Trade-offs

- **Token rename collision** → Some components may reference Tailwind colors not in the alias map (e.g. `bg-slate-*`). Mitigation: grep for non-token hardcoded colors and replace.
- **JetBrains Mono load time** → Adds a second Google Fonts request. Mitigation: use `display: swap` (default in next/font) and subset to `latin`.
- **Checkbox/Radio radius override** → base-ui components apply `rounded-[4px]` inline via the className. Overriding requires using a higher-specificity class or a direct value in the className prop. We update the `className` string inside `components/ui/checkbox.tsx`.
- **TriggerCard empty state** → When no skills are selected, the triggers sub-category must show an explicit empty state tile rather than nothing. Handled in `SubCategoryInputs`.
