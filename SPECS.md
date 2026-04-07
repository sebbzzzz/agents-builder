# Project Spec — AGENTS.md Decision Guide

## What this is

A web tool that helps developers make architectural decisions for new projects
and outputs a ready-to-use `AGENTS.md` file. It is NOT a form filler — it is
a decision guide. The user browses categories, discovers options with context,
selects what applies, and the file builds itself in real time.

The core insight: most tools assume you know what to write. This tool helps
you figure out what you should decide before you write any code.

---

## Target user

Developers starting a new project from zero who use AI coding tools (Claude
Code, Cursor, Codex, Gemini CLI, Windsurf, etc.) and feel friction when
writing their `AGENTS.md` from scratch. Includes solo devs, developers new
to SDD, and developers who don't have architectural patterns top-of-mind.

---

## Differentiator vs competitors

| Tool | Approach | Gap |
|------|----------|-----|
| DevTk.AI | Form fields you fill in | Assumes you already know what to type |
| Apify generator | AI analyzes existing codebase | Requires code to already exist |
| ChatGPT / Claude prompt | Free text generation | Generic output, no discovery |
| **This tool** | Browsable decisions with tradeoff context | Education + discovery + blank slate |

---

## Layout

Two-column interface. No steps, no next buttons, no form submission.

```
┌─────────────────────────┬────────────────────────────┐
│     LEFT PANEL          │      RIGHT PANEL            │
│                         │                             │
│  Category list          │  Live .md file preview      │
│  (scrollable)           │                             │
│  ──────────────         │  Updates in real time.      │
│  Active category        │  Sections only appear when  │
│  checklist              │  at least one item is       │
│                         │  checked.                   │
│  Each option has a      │                             │
│  hover tooltip with     │  Any line is editable       │
│  tradeoff explanation   │  inline.                    │
│                         │                             │
│                         │  [ Copy ]  [ Export .md ]   │
└─────────────────────────┴────────────────────────────┘
```

### Core interaction

- Click a category in the list → its checklist loads below
- Check an option → it appears instantly in the file preview
- Uncheck → it disappears from the file
- Hover any option → tooltip shows one-line tradeoff explanation
- Click any line in the preview → edit inline
- Export button → downloads the `.md` file
- Copy button → copies raw markdown to clipboard

---

## Category structure

Tech Stack is the first and primary category. Selections made here filter
and adapt the options shown in Architecture, Styles, and other categories.

---

### 1. Tech Stack *(primary — unlocks/filters other categories)*

**Project type**
| Option | Tooltip |
|--------|---------|
| Web app | Frontend + optional backend |
| API / backend service | No UI, pure server |
| CLI tool | Terminal-based, no server |
| Full-stack app | Frontend and backend in one repo |
| Library / package | Reusable code, not an app |
| Mobile app | React Native / Expo |

**Language**
| Option | Tooltip |
|--------|---------|
| TypeScript | Type-safe JS, recommended for teams |
| JavaScript | No types, faster to prototype |
| Python | Backend, scripts, AI/ML workloads |
| Go | High performance, low latency |
| Rust | Systems programming, memory safe |

**Frontend framework** *(shown if project type includes frontend)*
| Option | Tooltip |
|--------|---------|
| Next.js | React + SSR/SSG, full-stack ready |
| React + Vite | Client-side only, fast dev setup |
| SvelteKit | Lightweight, file-based routing |
| Vue + Nuxt | Progressive, good for migrations |

**Backend** *(shown if project type includes backend)*
| Option | Tooltip |
|--------|---------|
| Next.js API routes | Colocated with frontend |
| Node + Express | Flexible, minimal, widely used |
| Node + Fastify | Faster than Express, schema-first |
| Python + FastAPI | Async, auto-docs, great for AI |
| Python + Django | Batteries included, admin-heavy apps |
| Go (stdlib or Gin) | Fast, statically typed |

**Database**
| Option | Tooltip |
|--------|---------|
| PostgreSQL | Relational, battle-tested, default choice |
| MySQL | Relational, good for read-heavy apps |
| SQLite | Embedded, great for local or small apps |
| MongoDB | Document store, flexible schema |
| Redis | In-memory, caching and queues |
| None | No database |

**ORM / Query layer**
| Option | Tooltip |
|--------|---------|
| Prisma | Type-safe, great DX, migrations included |
| Drizzle | Lightweight, SQL-first, fast |
| TypeORM | Mature, decorator-based |
| SQLAlchemy | Python standard, powerful |
| Raw SQL | Full control, no abstraction |

---

### 2. Project Context

Sets the tone and strictness of the output file.

| Option | Tooltip |
|--------|---------|
| Solo project | Lean file, no team conventions needed |
| Small team (2–5) | Include naming and PR conventions |
| Open source | Include contribution and commit guidelines |
| Client / production | Strict conventions, full constraint set |
| Prototype / throwaway | Minimal file, skip long-term rules |

---

### 3. Available Skills

Skills are reusable capabilities for AI agents, sourced from
[skills.sh](https://skills.sh). The user browses a curated list of the most
popular skills and checks the ones relevant to their project.

**Implementation note:**
skills.sh has no public API. For MVP, use a static snapshot of the top ~30
skills from the leaderboard, updated manually. Show skill name, owner, and
install count as context. Each checked skill adds its install command to the
output file. Skills are filtered/highlighted by relevance to the selected
Tech Stack.

**Top skills static snapshot (from leaderboard as of April 2026):**

| Skill | Owner | Installs | Category |
|-------|-------|----------|----------|
| find-skills | vercel-labs | 774.9K | Meta |
| vercel-react-best-practices | vercel-labs | 261.1K | Frontend |
| frontend-design | anthropics | 218.5K | Frontend |
| web-design-guidelines | vercel-labs | 210.6K | Frontend |
| remotion-best-practices | remotion-dev | 187.3K | Frontend |
| shadcn | shadcn | 51.3K | UI |
| next-best-practices | vercel-labs | 47.8K | Frontend |
| supabase-postgres-best-practices | supabase | 56.8K | Database |
| better-auth-best-practices | better-auth | 29.9K | Auth |
| playwright-best-practices | currents-dev | 17.7K | Testing |
| systematic-debugging | obra | 44.2K | Workflow |
| test-driven-development | obra | 37.1K | Workflow |
| requesting-code-review | obra | 35.5K | Workflow |
| typescript-advanced-types | wshobson | 19.0K | Language |
| api-design-principles | wshobson | 13.2K | Backend |
| nodejs-backend-patterns | wshobson | 13.1K | Backend |
| python-performance-optimization | wshobson | 13.1K | Backend |
| tailwind-design-system | wshobson | 25.7K | Frontend |
| turborepo | vercel | 14.0K | Tooling |
| ai-sdk | vercel | 14.5K | AI |
| vue-best-practices | hyf0 | 13.7K | Frontend |
| security-best-practices | supercent-io | 14.1K | Security |
| web-accessibility | supercent-io | 12.7K | Accessibility |
| mcp-builder | anthropics | 29.3K | AI |
| skill-creator | anthropics | 115.6K | Meta |
| webapp-testing | anthropics | 35.8K | Testing |

**Output format for this section:**
```md
## Skills

npx skills add vercel-labs/agent-skills/vercel-react-best-practices
npx skills add shadcn/ui/shadcn
npx skills add currents-dev/playwright-best-practices-skill/playwright-best-practices
```

---

### 4. Auto-invoke Skills

Populated from the skills selected in the previous category. For each
selected skill, the user defines trigger instructions that tell the AI agent
when to use that skill automatically.

**Interaction:**
- Each selected skill appears as a labeled item
- Below it: a text input for trigger phrases
- User types their own or picks from suggested templates
- Multiple triggers per skill are supported

**Suggested trigger templates:**
- "When creating a new [component / API route / test]"
- "When the user asks to refactor"
- "When starting a new feature"
- "When writing documentation"
- "When reviewing a PR"
- "Before committing"
- "When debugging an error"

**Output format for this section:**
```md
## Auto-invoke Skills

- Use `vercel-react-best-practices` when creating a new React component
- Use `playwright-best-practices` when writing or updating tests
- Use `systematic-debugging` when the user reports a bug
```

---

### 5. Architecture

Options adapt based on the Tech Stack selection.

**Codebase structure**
| Option | Tooltip |
|--------|---------|
| Feature-based | Group by domain: `/auth`, `/dashboard`, `/billing` |
| Layer-based | Group by role: `/components`, `/services`, `/hooks` |
| Monorepo | Multiple packages in one repo, shared tooling |
| Domain-driven | Bounded contexts, ideal for large teams |

**Layer Responsibilities** *(presets, multi-select)*
| Option | Tooltip |
|--------|---------|
| UI layer renders only | No business logic in components |
| Services handle business logic | All domain logic lives in service files |
| Repositories handle data access | DB queries isolated from business logic |
| Hooks encapsulate state logic | Custom hooks own all stateful behavior |
| Controllers handle routing only | Thin controllers, fat services |
| Middleware handles cross-cutting concerns | Auth, logging, validation at middleware level |

**Folder-to-Layer Mapping** *(presets, multi-select)*
| Option | Tooltip |
|--------|---------|
| `/components` → UI only | No data fetching or logic here |
| `/services` → Business logic | Pure functions, no framework dependencies |
| `/repositories` → Data access | All DB/API calls isolated here |
| `/hooks` → State and side effects | Custom hooks for all stateful logic |
| `/lib` → Shared utilities | Helpers, formatters, constants |
| `/types` → TypeScript interfaces | All shared types centralized |
| `/app` or `/pages` → Routing only | Route handlers delegate immediately |

**Scope Rules** *(presets, multi-select)*
| Option | Tooltip |
|--------|---------|
| Never fetch data in UI components | Use hooks or server components instead |
| Never import across feature boundaries | Features are isolated, use shared/ for common code |
| No business logic in route handlers | Delegate to services immediately |
| No direct DB calls outside repositories | Always go through the data layer |
| No shared mutable state | Avoid global variables and singletons |

**UI Pattern** *(shown for frontend projects)*
| Option | Tooltip |
|--------|---------|
| Container / Presenter | Smart components fetch, dumb components render |
| Hooks-based | Logic in custom hooks, components stay thin |
| Server Components | Next.js: data fetching at render, minimal client JS |
| Atomic Design | Atoms → Molecules → Organisms → Pages |

**State management** *(shown for frontend projects)*
| Option | Tooltip |
|--------|---------|
| React Context | Built-in, good for simple global state |
| Zustand | Lightweight, minimal boilerplate |
| Redux Toolkit | Powerful, best for complex multi-actor state |
| Jotai | Atomic state, fine-grained reactivity |
| Server state only (React Query / SWR) | No client state library needed |

---

### 6. Styles

Options adapt based on the Tech Stack language selection.

**Formatting Rules** *(JS/TS projects)*
| Option | Tooltip |
|--------|---------|
| Prettier with default config | Opinionated, no debates |
| Prettier with single quotes | `'string'` not `"string"` |
| Prettier with 2-space indent | Standard for JS/TS |
| Prettier with 4-space indent | Common in some teams |
| ESLint + Prettier combined | Linting and formatting together |
| Tailwind class sorting (prettier-plugin-tailwindcss) | Auto-sort Tailwind classes |

**Formatting Rules** *(Python projects)*
| Option | Tooltip |
|--------|---------|
| Black (opinionated formatter) | Zero config, consistent output |
| Ruff (fast linter + formatter) | Replaces flake8, isort, and more |
| isort for import sorting | Alphabetically sorted imports |
| 88-char line length (Black default) | Standard with Black |
| 79-char line length (PEP 8) | Classic Python standard |

**Import Ordering**
| Option | Tooltip |
|--------|---------|
| Built-ins → external → internal | Standard JS/TS convention |
| Alphabetical within groups | Consistent, easy to scan |
| No relative imports from root | Always use path aliases |
| Path aliases required (`@/`) | `@/components/Button` not `../../components/Button` |

**Quotes in Practice** *(JS/TS)*
| Option | Tooltip |
|--------|---------|
| Single quotes for JS/TS | `'string'` |
| Double quotes for JS/TS | `"string"` |
| Backticks for template literals only | No unnecessary template strings |
| Double quotes for JSX attributes | `className="foo"` (React convention) |

---

### 7. Conventions

**File & Folder Naming**
| Option | Tooltip |
|--------|---------|
| PascalCase for components | `Button.tsx`, `UserCard.tsx` |
| kebab-case for pages and routes | `user-profile.tsx` |
| camelCase for utility files | `formatDate.ts`, `useAuth.ts` |
| snake_case for Python modules | `user_service.py` |
| Index files for folder exports | `components/Button/index.ts` re-exports |
| No index files | Import directly from the file |

**Variable & Function Naming**
| Option | Tooltip |
|--------|---------|
| camelCase for variables and functions | `getUserById`, `isLoading` |
| PascalCase for classes and components | `UserService`, `ButtonGroup` |
| SCREAMING_SNAKE_CASE for constants | `MAX_RETRY_COUNT`, `API_BASE_URL` |
| Prefix booleans with is/has/can | `isVisible`, `hasPermission`, `canEdit` |
| Prefix event handlers with handle | `handleClick`, `handleSubmit` |
| Prefix hooks with use | `useAuth`, `useDebounce` |
| snake_case for Python | `get_user_by_id`, `is_authenticated` |

**Commit Messages**
| Option | Tooltip |
|--------|---------|
| Conventional commits | `feat:`, `fix:`, `chore:`, `docs:` prefixes |
| Imperative mood | "Add feature" not "Added feature" |
| Max 72 characters in subject line | Fits in git log without truncation |
| Reference issue number | `fix: resolve login bug (#123)` |
| No period at end of subject | Convention in most style guides |

---

### 8. Patterns

What architectural and code patterns the agent should actively use.

| Option | Tooltip |
|--------|---------|
| MVC | Model, View, Controller — classic, team-friendly |
| Container / Presenter | Smart + dumb component split |
| Repository pattern | Data access abstracted behind interfaces |
| Service layer | Business logic isolated from controllers |
| Factory pattern | Object creation abstracted from usage |
| Observer / Event emitter | Decoupled communication between modules |
| Strategy pattern | Swap algorithms at runtime |
| Singleton | One instance globally — use sparingly |
| Composition over inheritance | Prefer composing small pieces |
| Feature flags | Toggle functionality without deploys |
| Optimistic UI updates | Update UI before server confirms |
| Error boundaries | Catch render errors gracefully (React) |

---

### 9. Anti-patterns

What the agent must actively avoid. Independent checklist from Patterns.

| Option | Tooltip |
|--------|---------|
| God objects | One class/module doing everything |
| Prop drilling | Passing props 3+ levels deep without context |
| Business logic in UI components | Keep components dumb |
| Direct DB calls in controllers | Always go through a service/repository |
| Magic numbers and strings | Use named constants instead |
| Silent error swallowing | Never `catch {}` without handling |
| Premature optimization | Don't optimize before profiling |
| Deep nesting | Max 3 levels of indentation |
| Mutable global state | Avoid shared mutable variables |
| Circular dependencies | Module A imports B imports A |
| `any` type in TypeScript | Defeats the purpose of TypeScript |
| Monolithic functions | Functions over 50 lines need splitting |

---

### 10. Workflows

**Development Commands**
Free-text inputs pre-populated based on Tech Stack selection.
User can edit values or add new commands.

| Field | Default (Next.js + pnpm) |
|-------|--------------------------|
| Install | `pnpm install` |
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Test | `pnpm test` |
| Lint | `pnpm lint` |
| Type check | `pnpm typecheck` |
| Format | `pnpm format` |

**Branching Strategy**
| Option | Tooltip |
|--------|---------|
| Feature branches + PRs | Standard team workflow |
| Trunk-based development | Short-lived branches, merge daily |
| Gitflow | Long-lived develop and release branches |
| Direct commits to main | Solo projects only |

**PR Process**
| Option | Tooltip |
|--------|---------|
| Require PR review before merge | At least one approval required |
| Squash and merge | Clean history, one commit per PR |
| Rebase and merge | Linear history, preserve individual commits |
| No force push to main | Protected branch |
| Link issue in PR description | Required for traceability |
| Draft PRs for WIP | Use draft status, not WIP prefix |

**QA Checklist Before Commit**
| Option | Tooltip |
|--------|---------|
| Run tests locally | Must pass before pushing |
| Run lint | No lint errors before committing |
| Run type check | No TypeScript errors |
| Run formatter | Code must be formatted |
| Self-review the diff | Read your own changes before pushing |
| No debug code | Remove `console.log`, `debugger`, leftover TODOs |
| Update tests for changed code | New behavior needs new tests |

---

### 11. Testing

| Option | Tooltip |
|--------|---------|
| Unit tests required | Every function/module needs a test |
| Integration tests | Test boundaries between modules |
| E2E tests (Playwright) | Test critical user flows in the browser |
| E2E tests (Cypress) | Alternative E2E framework |
| TDD — tests first | Write tests before implementation |
| Colocate tests with source | `Component.test.tsx` next to `Component.tsx` |
| Separate `/tests` directory | All tests in one place |
| Minimum coverage threshold | Fail CI below a defined percentage |
| Mock external services | Never hit real APIs in unit tests |
| No snapshot tests | Fragile, avoid unless necessary |

---

## Output format

Sections only appear if the user selected at least one item. Skipped
decisions add a `> TODO:` line. Every line is editable inline before export.

```md
# AGENTS.md
> Generated with [tool name] — [date]

## Project Context
Solo long-term web app. Treat as production code.
Be conservative with refactors. Ask before adding dependencies.

## Tech Stack
### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS

### Database
- PostgreSQL (Prisma ORM)

## Skills

npx skills add vercel-labs/agent-skills/vercel-react-best-practices
npx skills add shadcn/ui/shadcn

## Auto-invoke Skills

- Use `vercel-react-best-practices` when creating a new React component
- Use `systematic-debugging` when the user reports a bug

## Architecture

### Structure
Feature-based: group files by domain, not by type.

### Layer Responsibilities
- UI components render only — no business logic or data fetching
- Services handle business logic
- Repositories handle data access

### Folder-to-Layer Mapping
- `/components` → UI only
- `/services` → Business logic
- `/lib` → Shared utilities
- `/types` → TypeScript interfaces

### Scope Rules
- Never fetch data directly in UI components
- No business logic in route handlers

## Styles
- Prettier with single quotes, 2-space indent
- Path aliases required — use `@/` not relative imports
- Import order: built-ins → external → internal

## Conventions

### Naming
- PascalCase for components, camelCase for functions and variables
- Prefix booleans: `isVisible`, `hasPermission`
- Prefix event handlers: `handleClick`
- Prefix hooks: `useAuth`

### Commits
- Conventional commits: `feat:`, `fix:`, `chore:`, `docs:`
- Imperative mood, max 72 chars, no trailing period

## Patterns
- Container / Presenter for UI
- Repository pattern for data access
- Composition over inheritance

## Anti-patterns
- No God objects
- No prop drilling beyond 2 levels
- No `any` type in TypeScript
- No silent error swallowing

## Workflows

### Commands
- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Test: `pnpm test`
- Lint: `pnpm lint`
- Type check: `pnpm typecheck`

### Branching
Feature branches + PRs. No direct commits to main.

### PR Process
- Squash and merge
- Require one approval before merge
- No force push to main

### QA Before Commit
- Run tests, lint, and type check locally
- Self-review the diff
- No debug code or leftover TODOs

## Testing
- Unit tests colocated with source files
- E2E tests with Playwright for critical flows
- Mock all external services in unit tests
```

---

## MVP scope

**In scope for v1:**
- Two-column layout (category panel + live file preview)
- All 11 categories with options and tooltips
- Tech Stack as primary category that filters other categories
- Real-time file preview that updates on checkbox toggle
- Inline editing on the preview panel
- Static skills snapshot from skills.sh top 30
- Export as `.md` + copy to clipboard
- No backend, no auth, no database
- Client-side only, hosted at `[chosen domain].md`

**Out of scope for v1:**
- Live fetch from skills.sh (no public API exists yet)
- AI-assisted generation
- GitHub / CLI integrations
- Saving / loading sessions
- User accounts
- Monorepo multi-file export
- Custom sections

---

## Tech stack for building this

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS
- **State:** React `useState` / `useReducer` — no external library needed
- **Export:** Blob API for `.md` download, Clipboard API for copy
- **Hosting:** Vercel

---

## Open questions before building

1. **Name / domain** — top candidates: `dossier.md`, `grimoire.md`,
   `directive.md`, `handler.md`, `groundwork.md`
2. **Tech Stack filtering** — does selecting Next.js *hide* irrelevant
   options or just *highlight* relevant ones while keeping all visible?
3. **Default state** — start with empty file or a pre-filled example?
4. **Skills list cadence** — manual update for MVP, automate later
5. **Mobile layout** — single column with tab toggle, or desktop-only for MVP?
