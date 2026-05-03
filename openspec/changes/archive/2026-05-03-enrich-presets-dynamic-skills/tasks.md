## 1. Constants & Fallback Data

- [x] 1.1 Upgrade `TRIGGER_TEMPLATES` in `app/_utils/constants.ts` from `readonly string[]` to `Array<{ id: string; label: string; prompt: string }>` with all 8 trigger entries including `prompt` fields using `{skill}` placeholder
- [x] 1.2 Create `data/skills-fallback.ts` — extract the current static skills `options` array from the `skills-list` sub-category in `categories.ts` into a named export `STATIC_SKILLS: Option[]`

## 2. Skills API Route

- [x] 2.1 Create `app/api/skills/route.ts` — `GET` handler that fetches `https://skills.sh/api/v1/skills/curated` first; if it returns fewer than 15 skills, fall back to `https://skills.sh/api/v1/skills?per_page=100&view=all-time`; cache with `next: { revalidate: 3600 }`; normalize each skill to `{ id, label, owner, installs, prompt }` shape
- [x] 2.2 Verify the live API response shape: confirm `source` and `slug` field names and reconstruct the install command as `npx skills add ${source}/${slug}`; adjust normalization if needed
- [x] 2.3 Create `app/_hooks/useFetchSkills.ts` — hook that fetches `/api/skills`, returns `{ skills: Option[], isLoading: boolean }`, and falls back to `STATIC_SKILLS` on error

## 3. SubCategoryInputs UI

- [x] 3.1 Add `input` type rendering branch in `SubCategoryInputs.tsx`: render a text `<input>` per option using `opt.placeholder` as placeholder and `opt.label` as a label; add `inputValues?: Record<string, string>` and `onInputChange?: (optionId: string, value: string) => void` props
- [x] 3.2 Add `skills` type rendering branch in `SubCategoryInputs.tsx`: render a skill row per option (skill label + `owner · installs` metadata line) with a `Checkbox`; when checked, render the `TRIGGER_TEMPLATES` array as nested checkboxes below the skill row; add `skillTriggers?: Record<string, string[]>` and `onSkillTriggerToggle?: (skillId: string, triggerId: string) => void` props

## 4. FloatingOptionsPanel Wiring

- [x] 4.1 Add `inputValues: Record<string, string>` state to `FloatingOptionsPanel`; reset it in the `activeCategory` change `useEffect`; pass `inputValues` and `onInputChange` to `SubCategoryInputs`
- [x] 4.2 Add `skillTriggers: Record<string, string[]>` state; reset it in the `activeCategory` change `useEffect`; pass `skillTriggers` and `onSkillTriggerToggle` to `SubCategoryInputs`
- [x] 4.3 Call `useFetchSkills()` in the panel; when `activeCategory === "available-skills"`, use live skills to override the static `skills-list` options for rendering (fall back to static if `isLoading` or error); show a loading indicator when `isLoading: true`
- [x] 4.4 Update `handleAdd()` to handle `input` type: for each option with a non-empty `inputValues[opt.id]`, inject `opt.prompt.replace("{value}", value)` under the category heading
- [x] 4.5 Update `handleAdd()` to handle `skills` type: for each selected skill, inject the install command under `"Skills"`; for each checked trigger in `skillTriggers[skillId]`, inject the resolved trigger prompt (with `{skill}` replaced by `opt.label`) under `"Auto-invoke Skills"`

## 5. Categories Data — Prompt Enrichment

- [x] 5.1 Rewrite all **Tech Stack** option prompts (language, framework, backend, database, ORM) to use bold `**Name:**` header + bullet list format with inline code
- [x] 5.2 Rewrite all **Architecture** codebase-structure option prompts to include a fenced code block with an annotated directory tree
- [x] 5.3 Rewrite all **Architecture** layer-responsibilities, folder-to-layer, scope-rules, UI-pattern, and state-management option prompts to use bullet lists with inline code
- [x] 5.4 Rewrite all **Styles**, **Conventions**, and **Testing** option prompts to use bullets and inline code
- [x] 5.5a Rewrite all **Patterns** option prompts to include a fenced code block (language-tagged) with a concrete interface shape or usage skeleton — e.g. Repository Pattern shows a TypeScript `interface` with `findById`/`save` signatures; Factory Pattern shows a factory function call vs `new`; each pattern should leave the agent with a copy-pasteable shape to follow
- [x] 5.5b Rewrite all **Anti-patterns** option prompts to include an inline code or fenced block showing what to avoid and the correct alternative — e.g. `` `any` type `` shows `unknown` + type guard; deep nesting shows early-return flattening
- [x] 5.5c Add a `test-tiers` sub-category to **Workflows** with `type: "multi"` and options for: "Fast feedback — single file" (run one test file, ~2-3s), "Full suite before PR" (run all tests, notes expected runtime), and "Pre-commit checks" (lint + typecheck + fast tests)
- [x] 5.5 Rewrite all **Project Context** option prompts to use bold requirements and bullet lists

## 6. Categories Data — Structural Changes

- [x] 6.1 Add `project-info` sub-category to Project Context (before `context-type`) with `type: "input"` and options for project name (`prompt: "# {value}"`) and project description (`prompt: "{value}"`)
- [x] 6.2 Remove the `auto-invoke-skills` entry from `CATEGORIES` (the sidebar category; output headings are preserved via `handleAdd`)
- [x] 6.3 Update the `skills-list` sub-category in `available-skills`: import `STATIC_SKILLS` from `data/skills-fallback.ts` and set `options: STATIC_SKILLS` (live data will override at runtime)

## 7. New Categories

- [x] 7.1 Add `permission-boundaries` category to `CATEGORIES` with three `multi` sub-categories (Always Allowed, Ask First, Never) and at least 4 options each using ✅/⚠️/🚫 prefixed prompts
- [x] 7.2 Add `security` category to `CATEGORIES` with `secrets-hygiene` and `input-validation` multi sub-categories and at least 3 options each using structured markdown prompts
- [x] 7.3 Add `environment` category to `CATEGORIES` with a `prerequisites` input sub-category (Node version, package manager, other tools) and a `env-setup-steps` multi sub-category with at least 3 options
- [x] 7.4 Add `deployment` category to `CATEGORIES` with a `deployment-environments` multi sub-category (at least 3 options: staging→prod, preview deployments, feature environments) and a `cicd-rules` multi sub-category (at least 3 options: never deploy manually, do not modify CI config without review, deployments are gated on passing checks)

## 8. Verification

- [x] 8.1 Run `yarn typecheck` — zero type errors
- [x] 8.2 Run `yarn lint` — zero lint errors
- [ ] 8.3 Open the app: verify Workflows → Development Commands renders text inputs (not checkboxes)
- [ ] 8.4 Open the app: verify Available Skills panel shows loading state then live data with owner/installs visible per row
- [ ] 8.5 Check a skill: verify trigger checkboxes expand inline; click "Add to document" with triggers selected; verify `## Skills` has install command and `## Auto-invoke Skills` has trigger lines
- [ ] 8.6 Verify "Auto-invoke Skills" no longer appears in the sidebar
- [ ] 8.7 Open Permission Boundaries: select one option from each tier; verify output has ✅/⚠️/🚫 prefixed lines
- [ ] 8.8 Open Project Context: type a project name; verify output starts with `# ProjectName`; leave description blank; verify it is skipped
- [ ] 8.9 Select "Feature-based" architecture: verify output includes a fenced directory tree
- [ ] 8.10 Select TypeScript: verify output is a bullet list, not a single sentence
- [ ] 8.11 Select "Repository Pattern": verify output includes a fenced `typescript` code block with an interface shape
- [ ] 8.12 Select a Workflows test-tier option: verify output distinguishes fast single-file run from full suite
- [ ] 8.13 Open Deployment category: select one environment and one CI rule; verify output appears under `## Deployment`
- [ ] 8.14 Call `GET /api/skills` directly and verify response shape — confirm curated endpoint is used and install commands match `npx skills add ${source}/${slug}` pattern
