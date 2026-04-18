## Why

The current design uses neutral near-black tones with no personality. The app deserves a deliberate identity — warm backgrounds, a tighter editorial feel, and a clear brand name. "groundwork" positions the tool as the foundational step before any AI agent workflow. The rename and design system update happen together to avoid a half-branded state.

## What Changes

- **Brand rename**: all references to "AGENTS.md Generator" → "groundwork" (lowercase). Title, meta, og: tags, header wordmark, and favicon updated.
- **Logo mark**: 14×14px box, 1.5px orange stroke, subtly-filled inner square (inset 2px, 25% accent opacity). Used in header left of wordmark and as favicon.
- **Color tokens**: Replace existing `:root` variables with warm near-black backgrounds (`--bg`, `--panel`, `--panel-2`, `--rule`, `--rule-2`), 4-step ink scale, and orange accent system with ghost/faint variants and a gradient reserved for primary CTAs.
- **Typography**: Swap Geist for Inter (UI chrome + headings) and add JetBrains Mono (file paths, tooltips, tags, eyebrow labels, trigger inputs). Remove any serif imports.
- **shadcn component restyling**: Restyle existing `Checkbox`, `RadioGroup`, `Switch`, `Input`, and `Select` to use flat orange fill on active state, no white fill, square/minimal radius. Don't replace components — update their Tailwind class layers and CSS variables.
- **Skills + Triggers UI**: Implement the previously stubbed `skills` and `triggers` sub-category types using the existing data shape. Skills = multi-select checklist rows. Triggers = one card per selected skill with a text input + template chips.
- **Output format**: `buildAgentsFile` produces `## Available Skills` and `## Auto-invoke Skills` blocks from the existing `skills`/`triggers` sub-category data.

## Capabilities

### New Capabilities

- `brand-identity`: groundwork wordmark + logo mark component used in header and as favicon.
- `skills-ui`: Rendered checklist rows for `type: "skills"` sub-categories — name, owner·installs secondary line, optional tradeoff on hover/check.
- `triggers-ui`: Rendered trigger cards for `type: "triggers"` sub-categories — one card per selected skill, text input, template chips, empty state when no skills selected.

### Modified Capabilities

- `design-system`: Color tokens, typography, and shadcn component visual layer change across the whole app.
- `typed-option-inputs`: `skills` and `triggers` types graduate from "Coming soon" to full implementations.

## Impact

- `styles/globals.css` — full token replacement + font imports
- `app/layout.tsx` — font swap (Inter + JetBrains Mono), metadata rebrand, favicon
- `components/category/CategoryHeader.tsx` — logo mark + wordmark
- `components/ui/checkbox.tsx`, `radio-group.tsx`, `switch.tsx`, `input.tsx`, `select.tsx` — class layer updates
- `components/category/SubCategoryInputs.tsx` — add `SkillRow` and `TriggerCard` render paths
- `lib/buildAgentsFile.ts` — skills/triggers output blocks
- `store/useAppStore.ts` + `types/store.ts` — `skillTriggers: Record<string, string>` slice + `setSkillTrigger` action
- No new npm dependencies
