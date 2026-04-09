# AGENTS.md

## Table of Contents
- [Project Context](#project-context)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Conventions](#conventions)
- [Styles](#styles)
- [Workflows](#workflows)
- [Anti-patterns](#anti-patterns)
- [Testing](#testing)

## Project Context

This is a **decision guide** that helps developers build `AGENTS.md` files for their own projects. It is not a form filler. Users browse categories, discover options with tradeoff context, and the file preview builds itself in real time.

**Read `SPECS.md` first** before working on any feature, category content, option lists, tooltips, or output format. SPECS.md is the authoritative product specification — it defines what the app does, how categories work, what options exist, and what the output looks like. Do not invent or modify product behavior without consulting it.

Treat this as production code, not a prototype. Be conservative: ask before adding dependencies, ask before refactoring working code.

---

## Available Skills
Use these skills for detailed patterns on-demand:

> - [`typescript-advanced-types`](./.claude/skills/typescript-advanced-types) - Const types, flat interfaces
> - [`vercel-react-best-practices`](./.claude/skills/vercel-react-best-practices) - React 19, Next.js 15, App Router, Server Actions
> - [`tailwind-4-docs`](./.claude/skills/tailwind-4-docs) - cn() utility, Tailwind 4 patterns
> - [`find-skills`](./.claude/skills/find-skills) - Search for AI agent skills
> - [`openspec-propose`](./.claude/skills/openspec-propose) - Propose a new change
> - [`openspec-apply-change`](./.claude/skills/openspec-apply-change) - Implement tasks from a change
> - [`openspec-explore`](./.claude/skills/openspec-explore) - Explore ideas and clarify requirements
> - [`openspec-archive-change`](./.claude/skills/openspec-archive-change) - Archive a completed change


### Auto-invoke Skills

When performing these actions, ALWAYS invoke the corresponding skill FIRST:

| Action                                                    | Skill                         |
| --------------------------------------------------------- | ----------------------------- |
| App Router / Server Actions                               | `vercel-react-best-practices` |
| Working with Tailwind classes                             | `tailwind-4-docs`             |
| Writing React components                                  | `vercel-react-best-practices` |
| Writing TypeScript types/interfaces                       | `typescript-advanced-types`   |
| Searching for patterns or best practices for new features | `find-skills`                 |
| Proposing a new feature or change                         | `openspec-propose`            |
| Implementing tasks from a change                          | `openspec-apply-change`       |
| Exploring ideas or requirements                           | `openspec-explore`            |

### Skill Maintenance

- ALWAYS: When a new skill is installed or created, update both the **Available Skills** reference list and the **Auto-invoke Skills** table above (add an auto-invoke rule if the skill maps to a recurring action).
- ALWAYS: Keep skill paths up to date if files are moved or renamed.

---

## Tech Stack

Next.js 15.5.9 | React 19.2.2 | Tailwind 4.1.13

Do not introduce new libraries or frameworks without asking. The stack is intentionally minimal.

---

## Architecture

### Folder structure (feature-based)

```
app/                    # Next.js App Router — routing only
components/             # UI components — render only, no logic
  common/               # Reusable primitives (buttons, tooltips, etc.)
hooks/                  # Custom hooks — all stateful logic lives here
lib/                    # Pure utilities, formatters, constants
types/                  # TypeScript interfaces and types
data/                   # Static data: category definitions, skills snapshot
styles/                 # Global styles, Tailwind config, etc.
```

### Layer responsibilities

- **`app/`** — route handlers only; delegate immediately to components
- **`components/`** — render only; no data fetching, no business logic
- **`hooks/`** — own all stateful behavior (selected options, preview state, etc.)
- **`lib/`** — pure functions; no React, no side effects
- **`data/`** — static content; category definitions, tooltips, skills list

### Scope rules

- Never put business logic inside a component
- Never fetch data in a UI component — use hooks or server components
- Never use relative imports from the root — always use `@/` aliases
- Never import across feature boundaries — use `common/` for common code

---

## Conventions

### File & folder naming

| Type | Convention | Example |
|------|------------|---------|
| React components | PascalCase | `CategoryList.tsx`, `PreviewPanel.tsx` |
| Hooks | camelCase, `use` prefix | `useSelections.ts`, `usePreview.ts` |
| Utility files | camelCase | `formatMarkdown.ts`, `buildAgentsFile.ts` |
| Pages / routes | kebab-case | `app/about/page.tsx` |
| Data files | kebab-case | `categories.ts`, `skills-snapshot.ts` |

### Variable & function naming

- camelCase for variables and functions: `getUserSelections`, `isChecked`
- PascalCase for components and types: `CategoryOption`, `PreviewState`
- Prefix booleans: `isVisible`, `hasSelection`, `canExport`
- Prefix event handlers: `handleCheck`, `handleExport`, `handleCategoryClick`
- Prefix hooks: `useSelections`, `useMarkdownPreview`
- SCREAMING_SNAKE_CASE for constants: `MAX_SKILLS`, `DEFAULT_COMMANDS`

---

## Styles

Enforced by Prettier + ESLint. Run `yarn format:write` and `yarn lint:fix` to auto-fix.

### Formatting Rules

| Rule            | Value                |
| --------------- | -------------------- |
| Indentation     | 2 spaces (no tabs)   |
| Quotes          | Double quotes `"`    |
| Semicolons      | None (ASI)           |
| Max line length | 100 characters       |
| Trailing commas | Always in multi-line |
| Path aliases     | Always use `@/`      |
| Import order     | Built-ins → External → Internal (`@/`) — Alphabetical within groups |
| Tailwind classes | Sorted with `prettier-plugin-tailwindcss` |
| JSX attributes   | Double quotes (`className="foo"`) |

### Import Ordering

ALWAYS order imports in this sequence, each group separated by a blank line:

```typescript
// 1. External packages
import { useState } from "react"
import { NextRequest } from "next/server"

// 2. Internal aliases (@/)
import { cn } from "@/lib/utils"
import { UserCard } from "@/components/user/UserCard"

// 3. Relative paths
import { formatDate } from "./utils"
import type { UserProps } from "./types"
```

---

## Workflows

### Commands

```bash
yarn dev            # Start development server
yarn build          # Build for production
yarn lint           # Run ESLint
yarn lint:fix       # Fix ESLint issues
yarn format         # Check code formatting
yarn format:write   # Auto-format code
yarn typecheck      # Run TypeScript type checking
```

### Branching Strategy

- ALWAYS: branch from `main` using `<type>/<short-description>` (e.g., `feat/add-login-page`, `fix/broken-nav`)
- ALWAYS: `main` must be deployable at all times — broken builds MUST NOT be merged
- NEVER: commit directly to `main`

### Commits

- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- Imperative mood: "Add category filter" not "Added category filter"
- Max 72 characters in subject line
- No trailing period

### Before committing

- Run `yarn lint` and `yarn typecheck` — no errors
- Self-review the diff
- No `console.log`, `debugger`, or leftover TODOs

### QA Checklist Before Commit

- [ ] `yarn typecheck` passes
- [ ] `yarn lint:fix` passes
- [ ] `yarn format:write` passes
- [ ] All UI states handled (loading, error, empty)
- [ ] No secrets in code (use `.env.local`)
- [ ] Error messages sanitized
- [ ] Server-side validation present


---

## Patterns

### React Components

**Server Component (default — no directive needed):**

```typescript
export default async function Page() {
  const data = await fetchData()
  return <ClientComponent data={data} />
}
```

**Client Component (only when state/events/browser APIs needed):**

```typescript
"use client"

import { useState } from "react"

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**Data fetching flow — Server fetches, passes to Client:**

```typescript
// Server Component
export default async function UserProfile({ id }: { id: string }) {
  const user = await getUser(id)
  return <UserCard user={user} />  // UserCard is "use client"
}
```

### Server Action

```typescript
"use server"

export async function updateUser(formData: FormData) {
  const validated = schema.parse(Object.fromEntries(formData))
  await updateDB(validated)
  revalidatePath("/users")
}
```

### className Composition

```typescript
// Static — plain string
className="bg-slate-800 text-white"

// Dynamic — always use cn()
className={cn(BASE_STYLES, isActive && "ring-2 ring-blue-500")}

// Runtime value — style prop
style={{ width: `${progress}%` }}
```

### TypeScript Types

```typescript
// ALWAYS: const object + derived type
const Status = { Active: "active", Inactive: "inactive" } as const
type Status = (typeof Status)[keyof typeof Status]

// ALWAYS: flat interfaces, no inline nesting
interface UserProps {
  user: User
}
interface User {
  id: string
  address: Address
}
interface Address {
  street: string
  city: string
}
```

---

## Anti-patterns

Avoid these actively:

- **`any` type** — defeats TypeScript; use `unknown` and narrow, or define a proper type
- **Business logic in components** — components render; hooks and lib handle logic
- **Silent error swallowing** — never `catch {}` or `catch (e) {}` without handling or logging
- **Relative imports from root** — always `@/hooks/useSelections`, never `../../hooks/useSelections`
- **Prop drilling** — if passing props more than 2 levels deep, move state to a hook
- **Magic strings** — use named constants in `lib/` or `data/`
- **Monolithic functions** — if a function exceeds ~40 lines, it needs splitting

---

## Testing

Testing is **out of scope for v1 MVP**. Do not add test files or test infrastructure unless explicitly asked. Skip test suggestions.
