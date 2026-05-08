## Why

The current category presets produce thin one-liner markdown that AI agents can't use effectively — real-world AGENTS.md files use code fences, tables, bold requirements, and annotated directory trees. The skills snapshot also drifts from reality as skills.sh updates, since it's updated manually, and the two-panel skills workflow (pick skills → configure triggers separately) creates unnecessary friction.

## What Changes

- **Enrich all existing prompt content** with structured markdown: bullet lists, code blocks with annotated directory trees, bold requirements, and inline code references across all 11 categories
- **Add project name + description input fields** to Project Context so the generated file starts with a meaningful header
- **Add three new categories**: Permission Boundaries (Always/Ask/Never tiers), Security (secrets hygiene + input validation), and Environment Setup (prerequisites + setup steps)
- **Live skills data** fetched from skills.sh API via a Next.js Route Handler — no more manual snapshot updates; static fallback used on error
- **Merge skills + triggers into one panel**: when a skill is checked, trigger template checkboxes appear inline beneath it; the "Auto-invoke Skills" sidebar entry is removed
- **Fix `input` type rendering** in `SubCategoryInputs` — currently falls through to checkbox list; needs a real text field with placeholder and `{value}` interpolation in `handleAdd`

## Capabilities

### New Capabilities

- `rich-preset-content`: All option prompt strings rewritten with structured markdown (bullets, code fences, tables, bold). Architecture options include annotated directory trees. **Pattern and Anti-pattern options include real code block examples** (TypeScript/Python interface or usage skeleton) so the AI agent has a concrete shape to follow, not just a prose description. Project Context adds name/description input fields.
- `dynamic-skills-fetch`: Next.js Route Handler tries `skills.sh/api/v1/skills/curated` first (official first-party skills), falls back to the all-time leaderboard. Normalizes to `Option` shape and caches for 1 hour. Client hook loads live data with static fallback on error.
- `permission-boundaries-category`: New top-level category with three sub-categories (Always Allowed, Ask First, Never) and preset options for each tier, producing ✅/⚠️/🚫 formatted output.
- `security-category`: New top-level category covering secrets hygiene and input validation, producing structured security rules in the output.
- `environment-category`: New top-level category with input fields for tool versions and multi-select setup steps.
- `deployment-category`: New top-level category covering deployment environments, CI/CD pipeline notes, and deployment procedures — a recurring section in quality AGENTS.md files that tells the agent what the release process looks like.

### Modified Capabilities

- `skills-ui`: Add requirement that the skills sub-category loads live data from the API (with static fallback), shows a loading indicator while fetching, and displays each skill's `owner` and `installs` metadata in the row.
- `triggers-ui`: Replace the separate sidebar category and per-skill text input with inline trigger checkboxes rendered beneath each selected skill in the skills panel. The "Auto-invoke Skills" category is removed from the sidebar; trigger output is still injected under `## Auto-invoke Skills` in the document.

## Impact

- `data/categories.ts` — all prompt content rewritten; three new categories added; auto-invoke-skills category removed
- `data/skills-fallback.ts` — new file: static snapshot extracted from categories.ts
- `app/_utils/constants.ts` — `TRIGGER_TEMPLATES` upgraded from string array to structured `{ id, label, prompt }` objects
- `app/api/skills/route.ts` — new Next.js Route Handler
- `app/_hooks/useFetchSkills.ts` — new client hook
- `app/_components/category/SubCategoryInputs.tsx` — new rendering branches for `input` and `skills` types; new props
- `app/_components/category/FloatingOptionsPanel.tsx` — new `inputValues` and `skillTriggers` state; updated `handleAdd`; live skills wiring
