// ─────────────────────────────────────────────────────────────────────────────
// AGENTS.md Builder — Category & Prompt Data
//
// STRUCTURE OVERVIEW
// ──────────────────
// Category          → top-level section (e.g. "Tech Stack", "Patterns")
//   SubCategory     → optional group inside a category (e.g. "Language", "Database")
//     Option        → a selectable item; its `prompt` is injected into AGENTS.md
//
// SPECIAL CATEGORY TYPES
// ──────────────────────
// "select"   → user picks one option  (e.g. Project type)
// "multi"    → user picks many        (e.g. Anti-patterns checklist)
// "input"    → free-text field        (e.g. dev server command)
// "skills"   → rendered as skill card list with install commands
// "triggers" → derived from skills selection; adds auto-invoke instructions
// ─────────────────────────────────────────────────────────────────────────────

export type OptionType = "select" | "multi" | "input" | "skills" | "triggers"

export interface Option {
  id: string
  label: string
  tooltip?: string
  /** Text injected verbatim into the AGENTS.md output */
  prompt: string
  /** Used by "input" type options as placeholder */
  placeholder?: string
  /** Tags used to match skills to the active tech stack */
  tags?: string[]
  /** Skill author/owner — used for skills sub-category rows */
  owner?: string
  /** Formatted install count string e.g. "261.1K" — used for skills sub-category rows */
  installs?: string
}

export interface SubCategory {
  id: string
  label: string
  type: OptionType
  /** If set, this sub-category only renders when the given option IDs are active */
  visibleWhen?: string[]
  options: Option[]
}

export interface Category {
  id: string
  label: string
  description: string
  /** Whether selections here filter options in other categories */
  isPrimary?: boolean
  icon: string
  subCategories: SubCategory[]
  disabled: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

import { STATIC_SKILLS } from "@/data/skills-fallback"

export const CATEGORIES: Category[] = [
  // ── 1. PROJECT CONTEXT ─────────────────────────────────────────────────────
  {
    id: "project-context",
    label: "Project Context",
    description: "Sets the tone and level of strictness of the generated file.",
    icon: "Briefcase",
    disabled: false,
    subCategories: [
      {
        id: "project-info",
        label: "Project Info",
        type: "input",
        options: [
          {
            id: "project-name",
            label: "Name",
            placeholder: "my-app",
            prompt: "# {value}",
          },
          {
            id: "project-description",
            label: "Description",
            placeholder: "A short summary of what this project does and who it's for",
            prompt: "{value}",
          },
        ],
      },
      {
        id: "context-type",
        label: "Context Type",
        type: "select",
        options: [
          {
            id: "solo",
            label: "Solo Project",
            tooltip: "Lean file, no team conventions needed",
            prompt:
              "**Context:** Solo project\n\n- Keep conventions pragmatic and lean\n- Prioritize speed of iteration over strict team processes\n- No PR review requirement — direct commits to main are acceptable",
          },
          {
            id: "small-team",
            label: "Small Team (2–5)",
            tooltip: "Include naming and PR conventions",
            prompt:
              "**Context:** Small team (2–5 developers)\n\n- Follow shared naming conventions consistently\n- All changes require a PR — no direct commits to `main`\n- Document non-obvious decisions in comments or short ADRs\n- Prefer explicit over clever — optimize for readability by teammates",
          },
          {
            id: "open-source",
            label: "Open Source",
            tooltip: "Include contribution and commit guidelines",
            prompt:
              "**Context:** Open source project\n\n- All contributions must follow Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`)\n- Commit messages must explain the *why*, not just the *what*\n- Be welcoming to first-time contributors — avoid unnecessary complexity in setup and contribution flow\n- Public API changes require a CHANGELOG entry",
          },
          {
            id: "client-production",
            label: "Client / Production",
            tooltip: "Strict conventions, full constraint set",
            prompt:
              "**Context:** Production project (serving real users)\n\n- Apply the full constraint set: strict typing, test coverage, lint checks before commit\n- No debug code (`console.log`, `debugger`) in merged PRs\n- Mandatory PR reviews — at least one approval before merge\n- Treat every change as potentially user-facing: consider error states, loading states, and edge cases",
          },
          {
            id: "prototype",
            label: "Prototype / Throwaway",
            tooltip: "Minimal file, skip long-term rules",
            prompt:
              "**Context:** Prototype / throwaway project\n\n- Skip long-term conventions — focus on exploring the solution quickly\n- Mark any hacks or shortcuts with `// PROTOTYPE:` comments so they are easy to find if the codebase is ever promoted\n- Do not add test infrastructure unless explicitly requested",
          },
        ],
      },
    ],
  },

  // ── 2. TECH STACK ──────────────────────────────────────────────────────────
  {
    id: "tech-stack",
    label: "Tech Stack",
    description:
      "Define the languages, frameworks, and services used. Selections here filter options in other categories.",
    isPrimary: true,
    icon: "Layers",
    disabled: false,
    subCategories: [
      {
        id: "project-type",
        label: "Project Type",
        type: "select",
        options: [
          {
            id: "web-app",
            label: "Web App",
            tooltip: "Frontend + optional backend",
            prompt:
              "**Project type:** Web application\n\n- Includes a frontend UI; may include backend services\n- Respect the client/server boundary — do not expose server secrets to the client\n- Optimize for web performance: bundle size, LCP, CLS",
          },
          {
            id: "api-backend",
            label: "API / Backend Service",
            tooltip: "No UI, pure server",
            prompt:
              "**Project type:** Backend API service\n\n- No frontend UI — this is a pure server-side service\n- Focus on API design, data integrity, and reliability\n- Every endpoint must validate input, handle errors explicitly, and return consistent response shapes",
          },
          {
            id: "cli-tool",
            label: "CLI Tool",
            tooltip: "Terminal-based, no server",
            prompt:
              "**Project type:** CLI tool\n\n- No UI or server — terminal only\n- Use clear argument parsing; prefer a well-known CLI library (e.g. `commander`, `click`, `clap`)\n- Output must be human-readable by default; support `--json` for scripting\n- Exit with non-zero status on error",
          },
          {
            id: "fullstack-app",
            label: "Full-stack App",
            tooltip: "Frontend and backend in one repo",
            prompt:
              "**Project type:** Full-stack application\n\n- Frontend and backend are colocated in the same repository\n- Maintain a clear boundary between client and server code — never import server modules in client bundles\n- Shared types live in a dedicated `shared/` or `common/` package",
          },
          {
            id: "library-package",
            label: "Library / Package",
            tooltip: "Reusable code, not an app",
            prompt:
              "**Project type:** Reusable library / package\n\n- Prioritize a clean, stable public API — breaking changes require a major version bump\n- Minimize dependencies; every transitive dep is a burden on consumers\n- Export only what is intentional; keep internals unexported\n- Document all public exports with JSDoc or docstrings",
          },
          {
            id: "mobile-app",
            label: "Mobile App",
            tooltip: "React Native / Expo",
            prompt:
              "**Project type:** Mobile application (React Native / Expo)\n\n- Consider platform differences between iOS and Android at every step\n- Test on both simulators; do not assume parity\n- Prefer Expo APIs over bare React Native APIs where available\n- Optimize for performance on low-end devices: avoid unnecessary re-renders, large images, and heavy JS bundles",
          },
        ],
      },

      {
        id: "language",
        label: "Language",
        type: "multi",
        options: [
          {
            id: "typescript",
            label: "TypeScript",
            tooltip: "Type-safe JS, recommended for teams",
            tags: ["frontend", "backend"],
            prompt:
              "**Language:** TypeScript\n\n- Enable `strict: true` in `tsconfig.json` — no exceptions\n- Never use `any`; use `unknown` and narrow with type guards\n- All new files must be `.ts` or `.tsx`\n- Prefer `interface` over `type` for object shapes\n- Use `as const` + derived types instead of duplicating string unions",
          },
          {
            id: "javascript",
            label: "JavaScript",
            tooltip: "No types, faster to prototype",
            tags: ["frontend", "backend"],
            prompt:
              "**Language:** JavaScript (no TypeScript)\n\n- Use JSDoc comments on all exported functions to document parameter and return types\n- Avoid patterns that obscure data shapes (e.g. dynamic key generation, `Object.assign` soup)\n- Use ES modules (`import`/`export`), not CommonJS `require`",
          },
          {
            id: "python",
            label: "Python",
            tooltip: "Backend, scripts, AI/ML workloads",
            tags: ["backend", "ai"],
            prompt:
              "**Language:** Python 3.10+\n\n- Add type hints to all function signatures\n- Follow PEP 8; enforce with `ruff` or `flake8`\n- Use `dataclasses` or Pydantic models for structured data — avoid plain dicts at boundaries\n- Prefer `pathlib.Path` over `os.path` string manipulation",
          },
          {
            id: "go",
            label: "Go",
            tooltip: "High performance, low latency",
            tags: ["backend"],
            prompt:
              "**Language:** Go\n\n- Follow standard Go project layout (`cmd/`, `internal/`, `pkg/`)\n- Always handle errors explicitly — never ignore a returned `error`\n- Use `context.Context` for cancellation and request-scoped values throughout the call chain\n- Run `go vet` and `staticcheck` before committing",
          },
          {
            id: "rust",
            label: "Rust",
            tooltip: "Systems programming, memory safe",
            tags: ["backend", "cli"],
            prompt:
              "**Language:** Rust\n\n- Use the ownership model correctly — avoid unnecessary `.clone()`\n- Prefer `Result` and `Option` over panics in library code\n- Run `cargo clippy -- -D warnings` and resolve all warnings before committing\n- Use `thiserror` for library errors, `anyhow` for application errors",
          },
        ],
      },

      {
        id: "frontend-framework",
        label: "Frontend Framework",
        type: "select",
        visibleWhen: ["web-app", "fullstack-app", "mobile-app"],
        options: [
          {
            id: "nextjs",
            label: "Next.js",
            tooltip: "React + SSR/SSG, full-stack ready",
            tags: ["frontend"],
            prompt:
              "**Framework:** Next.js (App Router)\n\n- Default to Server Components — only add `'use client'` when interactivity, browser APIs, or local state are required\n- Use `next/image` for all images and `next/font` for fonts\n- Data fetching lives in Server Components or Route Handlers — not in client components\n- Keep `'use client'` boundaries as deep in the tree as possible to maximize server rendering",
          },
          {
            id: "react-vite",
            label: "React + Vite",
            tooltip: "Client-side only, fast dev setup",
            tags: ["frontend"],
            prompt:
              "**Framework:** React + Vite (client-side only)\n\n- No server-side rendering — all rendering happens in the browser\n- Use React Router for navigation\n- Keep the `vite.config.ts` minimal; avoid over-configuring\n- Code-split by route using `React.lazy` and `Suspense`",
          },
          {
            id: "sveltekit",
            label: "SvelteKit",
            tooltip: "Lightweight, file-based routing",
            tags: ["frontend"],
            prompt:
              "**Framework:** SvelteKit\n\n- Use file-based routing — route files live under `src/routes/`\n- Prefer Svelte stores over external state libraries\n- Use `+page.server.ts` for server-side data loading; use `+page.ts` for universal loading\n- Avoid client-side fetching in components — use `load` functions instead",
          },
          {
            id: "vue-nuxt",
            label: "Vue + Nuxt",
            tooltip: "Progressive, good for migrations",
            tags: ["frontend"],
            prompt:
              "**Framework:** Vue 3 + Nuxt\n\n- Use the Composition API with `<script setup>` — not the Options API\n- Use Pinia for state management\n- Leverage Nuxt's auto-import for components and composables\n- Use `useAsyncData` or `useFetch` for data loading — not `onMounted` + `fetch`",
          },
        ],
      },

      {
        id: "backend",
        label: "Backend",
        type: "select",
        visibleWhen: ["api-backend", "fullstack-app"],
        options: [
          {
            id: "nextjs-api",
            label: "Next.js API Routes",
            tooltip: "Colocated with frontend",
            tags: ["backend"],
            prompt:
              "**Backend:** Next.js Route Handlers (`app/api/`)\n\n- Keep route handlers thin — validate input, call a service, return a response\n- Delegate all business logic to service files immediately\n- Use `NextRequest` and `NextResponse` for type safety\n- Authenticate at the route handler level before calling any service",
          },
          {
            id: "node-express",
            label: "Node + Express",
            tooltip: "Flexible, minimal, widely used",
            tags: ["backend"],
            prompt:
              "**Backend:** Node.js + Express\n\n- Organize routes by resource (e.g. `/users`, `/orders`)\n- Use middleware for auth, validation, and error handling — not inline in route handlers\n- Always use `async/await` with a top-level error boundary (`express-async-errors` or similar)\n- Never return stack traces in production error responses",
          },
          {
            id: "node-fastify",
            label: "Node + Fastify",
            tooltip: "Faster than Express, schema-first",
            tags: ["backend"],
            prompt:
              "**Backend:** Node.js + Fastify\n\n- Define JSON Schema for all routes using Fastify's built-in schema validation\n- Use plugins to encapsulate domain logic — each plugin owns its routes, hooks, and decorators\n- Use `fastify-plugin` to share decorators across scopes\n- Rely on Fastify's serialization — do not `JSON.stringify` manually",
          },
          {
            id: "python-fastapi",
            label: "Python + FastAPI",
            tooltip: "Async, auto-docs, great for AI",
            tags: ["backend", "ai"],
            prompt:
              "**Backend:** FastAPI\n\n- Define Pydantic models for all request bodies, response bodies, and query params\n- Use async route handlers throughout\n- Leverage dependency injection (`Depends`) for shared resources: DB sessions, auth, settings\n- Use `HTTPException` for client errors; let unhandled exceptions bubble to a global handler",
          },
          {
            id: "python-django",
            label: "Python + Django",
            tooltip: "Batteries included, admin-heavy apps",
            tags: ["backend"],
            prompt:
              "**Backend:** Django\n\n- Follow Django's MVT pattern — Models, Views, Templates (or serializers for DRF)\n- Use the Django ORM exclusively — avoid raw SQL unless profiling confirms a bottleneck\n- Use Django REST Framework for API endpoints\n- Keep business logic in service functions or model methods, not in views",
          },
          {
            id: "go-stdlib",
            label: "Go (stdlib or Gin)",
            tooltip: "Fast, statically typed",
            tags: ["backend"],
            prompt:
              '**Backend:** Go (stdlib or Gin)\n\n- Keep handlers thin — validate input, delegate to a service struct, return the response\n- Use `context.Context` for all request-scoped values and cancellation\n- Prefer the standard library before reaching for third-party packages\n- Define explicit error types; wrap errors with `fmt.Errorf("%w", err)` for unwrapping',
          },
        ],
      },

      {
        id: "database",
        label: "Database",
        type: "multi",
        options: [
          {
            id: "postgresql",
            label: "PostgreSQL",
            tooltip: "Relational, battle-tested, default choice",
            tags: ["database"],
            prompt:
              "**Database:** PostgreSQL\n\n- All schema changes go through migrations — never alter the schema directly in production\n- Use explicit column names in `SELECT` — never `SELECT *` in application queries\n- Add indexes for all foreign keys and frequently filtered columns\n- Use transactions for multi-step writes",
          },
          {
            id: "mysql",
            label: "MySQL",
            tooltip: "Relational, good for read-heavy apps",
            tags: ["database"],
            prompt:
              "**Database:** MySQL\n\n- All schema changes go through migrations\n- Be aware of MySQL-specific behaviors: case-insensitive collations by default, `ENUM` type limitations, `ONLY_FULL_GROUP_BY` mode\n- Use `InnoDB` engine; avoid `MyISAM`\n- Explicit column names in all queries — no `SELECT *`",
          },
          {
            id: "sqlite",
            label: "SQLite",
            tooltip: "Embedded, great for local or small apps",
            tags: ["database"],
            prompt:
              "**Database:** SQLite\n\n- Enable WAL mode (`PRAGMA journal_mode=WAL`) for better concurrent reads\n- Keep the schema simple — SQLite has limited `ALTER TABLE` support\n- Use parameterized queries; never interpolate user input into SQL strings\n- Do not use SQLite features unsupported by the target runtime (e.g. Cloudflare D1 has restrictions)",
          },
          {
            id: "mongodb",
            label: "MongoDB",
            tooltip: "Document store, flexible schema",
            tags: ["database"],
            prompt:
              "**Database:** MongoDB\n\n- Define explicit schemas with Mongoose or Zod — do not rely on implicit shape\n- Avoid deeply nested documents; flatten where possible\n- Prefer references (`ObjectId`) over embedding for frequently updated sub-documents\n- Add indexes for all fields used in `find()` filters or sorts",
          },
          {
            id: "redis",
            label: "Redis",
            tooltip: "In-memory, caching and queues",
            tags: ["database"],
            prompt:
              "**Database:** Redis (caching / queuing)\n\n- Always set a TTL on cached keys — never cache indefinitely\n- Use namespaced key patterns: `{entity}:{id}:{field}` (e.g. `user:123:session`)\n- Never store primary business data exclusively in Redis — it is not a source of truth\n- Use Redis Streams or a dedicated queue library (BullMQ) for job queues; do not use LPUSH/BRPOP directly",
          },
          {
            id: "no-database",
            label: "None",
            tooltip: "No database",
            prompt:
              "**Database:** None\n\n- This project does not use a persistent database\n- All data is handled in-memory or via external APIs\n- Document any external data dependencies clearly",
          },
        ],
      },

      {
        id: "orm",
        label: "ORM / Query Layer",
        type: "select",
        visibleWhen: ["postgresql", "mysql", "sqlite", "mongodb"],
        options: [
          {
            id: "prisma",
            label: "Prisma",
            tooltip: "Type-safe, great DX, migrations included",
            tags: ["database"],
            prompt:
              "**ORM:** Prisma\n\n- All schema changes go through `prisma migrate dev` — never edit the DB directly\n- Never use `prisma.$executeRaw` for queries expressible with the Prisma Client API\n- Import the Prisma client as a singleton — do not instantiate `new PrismaClient()` in every file\n- Use `select` or `include` explicitly — avoid over-fetching with unconstrained relations",
          },
          {
            id: "drizzle",
            label: "Drizzle",
            tooltip: "Lightweight, SQL-first, fast",
            tags: ["database"],
            prompt:
              "**ORM:** Drizzle\n\n- Prefer Drizzle's query builder over raw SQL\n- Keep all schema definitions in a dedicated `db/schema.ts` (or `src/db/schema.ts`) file\n- Use Drizzle Kit for migrations — never alter tables manually\n- Colocate database logic in repository files; do not import `db` directly in business logic",
          },
          {
            id: "typeorm",
            label: "TypeORM",
            tooltip: "Mature, decorator-based",
            tags: ["database"],
            prompt:
              "**ORM:** TypeORM\n\n- Use the `DataSource` and repository pattern\n- Set `synchronize: false` in all environments — use migrations exclusively\n- Define entity relationships explicitly with decorators; do not rely on auto-detection\n- Use `QueryRunner` for multi-step transactional operations",
          },
          {
            id: "sqlalchemy",
            label: "SQLAlchemy",
            tooltip: "Python standard, powerful",
            tags: ["database", "python"],
            prompt:
              "**ORM:** SQLAlchemy\n\n- Use Alembic for all migrations\n- Prefer the ORM query style; use `text()` for raw SQL only when necessary\n- Define all models in a dedicated `models/` module\n- Use `Session` as a context manager; never leave sessions open",
          },
          {
            id: "raw-sql",
            label: "Raw SQL",
            tooltip: "Full control, no abstraction",
            tags: ["database"],
            prompt:
              "**Query layer:** Raw SQL\n\n- Parameterize all user inputs — never use string interpolation in SQL\n- Keep queries in dedicated repository files — not inline in business logic\n- Use a migration tool (Flyway, `golang-migrate`, `dbmate`) for schema changes\n- Document complex queries with inline comments explaining the intent",
          },
        ],
      },
    ],
  },

  // ── 3. AVAILABLE SKILLS ────────────────────────────────────────────────────
  {
    id: "available-skills",
    label: "Available Skills",
    description: "Select reusable AI agent skills from skills.sh to include in the project.",
    icon: "Zap",
    disabled: true,
    subCategories: [
      {
        id: "skills-list",
        label: "Skills",
        type: "skills",
        options: STATIC_SKILLS,
      },
    ],
  },

  // ── 4. ARCHITECTURE ────────────────────────────────────────────────────────
  {
    id: "architecture",
    label: "Architecture",
    description: "Define how the codebase is organized and what each layer is responsible for.",
    icon: "GitBranch",
    disabled: false,
    subCategories: [
      {
        id: "codebase-structure",
        label: "Codebase Structure",
        type: "select",
        options: [
          {
            id: "feature-based",
            label: "Feature-based",
            tooltip: "Group by domain: /auth, /dashboard, /billing",
            prompt:
              "**Structure:** Feature-based — code grouped by domain, not by technical layer.\n\n```\nsrc/\n  features/\n    auth/           # Login, sessions, permissions\n      components/\n      hooks/\n      services/\n      types/\n    dashboard/      # Main application views\n      components/\n      hooks/\n    shared/         # Code used by 2+ features\n  lib/              # Pure stateless utilities\n  types/            # Global TypeScript types\n```\n\n- Each feature owns its components, hooks, services, and types\n- Features must not import directly from each other — use `shared/` for cross-feature code\n- If code is used by only one feature, it lives inside that feature folder",
          },
          {
            id: "layer-based",
            label: "Layer-based",
            tooltip: "Group by role: /components, /services, /hooks",
            prompt:
              "**Structure:** Layer-based — code grouped by technical responsibility.\n\n```\nsrc/\n  components/     # All UI components\n  services/       # Business logic (framework-agnostic)\n  hooks/          # Custom React hooks (stateful behavior)\n  repositories/   # Data access (DB queries, API calls)\n  lib/            # Pure utilities, formatters, constants\n  types/          # TypeScript interfaces and enums\n```\n\n- Each layer has a single, well-defined responsibility\n- Dependencies flow downward: components → hooks → services → repositories\n- Never skip layers (e.g. components must not call repositories directly)",
          },
          {
            id: "monorepo",
            label: "Monorepo",
            tooltip: "Multiple packages in one repo, shared tooling",
            prompt:
              "**Structure:** Monorepo — multiple packages in one repository.\n\n```\napps/\n  web/            # Main web application\n  api/            # Backend API service\npackages/\n  ui/             # Shared UI component library\n  utils/          # Shared utilities\n  types/          # Shared TypeScript types\n  config/         # Shared tooling config (eslint, tsconfig)\n```\n\n- Each package is independently versioned and testable\n- Do not import across package boundaries without declaring a dependency in `package.json`\n- Shared code lives in a dedicated package, not copy-pasted between apps",
          },
          {
            id: "domain-driven",
            label: "Domain-driven",
            tooltip: "Bounded contexts, ideal for large teams",
            prompt:
              "**Structure:** Domain-Driven Design — bounded contexts with clear ownership.\n\n```\nsrc/\n  domains/\n    user/           # User bounded context\n      models/\n      services/\n      repositories/\n      api/\n    order/          # Order bounded context\n      models/\n      services/\n      repositories/\n      api/\n  infrastructure/ # Shared infrastructure (DB, messaging, auth)\n  shared/         # Cross-domain value objects and utilities\n```\n\n- Each domain is a bounded context with its own models, services, and repositories\n- Domains communicate via public interfaces only — never access another domain's internals\n- Shared infrastructure lives outside domain boundaries",
          },
        ],
      },

      {
        id: "layer-responsibilities",
        label: "Layer Responsibilities",
        type: "multi",
        options: [
          {
            id: "ui-renders-only",
            label: "UI layer renders only",
            tooltip: "No business logic in components",
            prompt:
              "**Rule:** UI components render only — no business logic or data fetching.\n\n- Components receive data via props or hooks and render markup\n- No API calls, no database access, no complex calculations inside a component\n- If a component needs data, it calls a hook — the hook owns the fetching logic",
          },
          {
            id: "services-business-logic",
            label: "Services handle business logic",
            tooltip: "All domain logic lives in service files",
            prompt:
              "**Rule:** All business logic lives in service files.\n\n- Services are pure functions or classes with no framework dependencies (no React, no Express)\n- Services are independently testable without mounting a component or starting a server\n- Services call repositories for data — they never touch the database directly",
          },
          {
            id: "repositories-data-access",
            label: "Repositories handle data access",
            tooltip: "DB queries isolated from business logic",
            prompt:
              "**Rule:** All database queries and external API calls live in repository files.\n\n- Services call repositories — they never call the database directly\n- Repositories accept plain data and return plain data — no framework types\n- Each repository owns exactly one data source (one DB table or one external API)",
          },
          {
            id: "hooks-state-logic",
            label: "Hooks encapsulate state logic",
            tooltip: "Custom hooks own all stateful behavior",
            prompt:
              "**Rule:** All stateful behavior lives in custom hooks.\n\n- Components call hooks and render the result — they do not manage their own complex state\n- Hooks follow the `use` prefix convention: `useAuth`, `useCart`, `useDebounce`\n- Keep hooks focused — a hook that does more than one thing should be split",
          },
          {
            id: "controllers-routing-only",
            label: "Controllers handle routing only",
            tooltip: "Thin controllers, fat services",
            prompt:
              "**Rule:** Route controllers are thin — validate input, call a service, return the response.\n\n- No business logic inside a controller or route handler\n- Controllers delegate to a service on the first line of logic\n- Authentication and validation happen in middleware, not in the controller body",
          },
          {
            id: "middleware-cross-cutting",
            label: "Middleware handles cross-cutting concerns",
            tooltip: "Auth, logging, validation at middleware level",
            prompt:
              "**Rule:** Cross-cutting concerns are implemented as middleware.\n\n- Authentication, logging, request validation, and rate limiting live in middleware\n- Individual route handlers must not re-implement these concerns\n- Middleware is applied at the router level, not duplicated per route",
          },
        ],
      },

      {
        id: "folder-to-layer",
        label: "Folder-to-Layer Mapping",
        type: "multi",
        options: [
          {
            id: "components-ui-only",
            label: "`/components` → UI only",
            tooltip: "No data fetching or logic here",
            prompt:
              "**`/components`** → UI markup and styling only.\n\n- No data fetching, no API calls, no business logic\n- Receives data via props; emits events via callbacks\n- A component that needs to fetch data should delegate to a hook",
          },
          {
            id: "services-business",
            label: "`/services` → Business logic",
            tooltip: "Pure functions, no framework dependencies",
            prompt:
              "**`/services`** → Pure business logic.\n\n- Must not import React, Express, or any framework-specific module\n- Must be independently testable with plain function calls\n- Calls repositories for data access — never imports a DB client directly",
          },
          {
            id: "repositories-data",
            label: "`/repositories` → Data access",
            tooltip: "All DB/API calls isolated here",
            prompt:
              "**`/repositories`** → All database queries and external API calls.\n\n- The only place where DB clients (Prisma, Drizzle, etc.) are imported\n- All other modules go through the repository interface — never bypass it\n- Repository functions accept and return plain typed objects",
          },
          {
            id: "hooks-state",
            label: "`/hooks` → State and side effects",
            tooltip: "Custom hooks for all stateful logic",
            prompt:
              "**`/hooks`** → State management and side effects.\n\n- All hooks follow the `use` prefix convention\n- Hooks may call services or other hooks — not repositories directly\n- Keep hooks focused on a single concern",
          },
          {
            id: "lib-utilities",
            label: "`/lib` → Shared utilities",
            tooltip: "Helpers, formatters, constants",
            prompt:
              "**`/lib`** → Stateless helper functions, formatters, and constants.\n\n- Nothing in `/lib` has side effects or imports application-specific code\n- Functions are pure: same input always produces the same output\n- Named exports only — no default exports in utility files",
          },
          {
            id: "types-interfaces",
            label: "`/types` → TypeScript interfaces",
            tooltip: "All shared types centralized",
            prompt:
              "**`/types`** → All shared TypeScript types, interfaces, and enums.\n\n- Do not define shared types inline in component or service files\n- One type/interface per file; file name matches the type name\n- Types exported from here are considered part of the public contract",
          },
          {
            id: "app-routing-only",
            label: "`/app` or `/pages` → Routing only",
            tooltip: "Route handlers delegate immediately",
            prompt:
              "**`/app` or `/pages`** → Routing only.\n\n- Route files delegate data fetching to hooks or server loaders\n- Route files delegate rendering to components\n- No business logic or data fetching inline in page files",
          },
        ],
      },

      {
        id: "scope-rules",
        label: "Scope Rules",
        type: "multi",
        options: [
          {
            id: "no-fetch-in-ui",
            label: "Never fetch data in UI components",
            tooltip: "Use hooks or server components instead",
            prompt:
              "**Scope rule:** UI components must never call APIs or query databases directly.\n\n- Use custom hooks, server components, or loaders for data fetching\n- If a component needs remote data, the data comes in as a prop or via a hook",
          },
          {
            id: "no-cross-feature-imports",
            label: "Never import across feature boundaries",
            tooltip: "Features are isolated",
            prompt:
              "**Scope rule:** Features must not import directly from each other.\n\n- Extract shared code to a `shared/` or `common/` module first\n- If the same code is needed by 3+ features, it belongs in `shared/`\n- Circular feature dependencies are a sign of missing abstraction",
          },
          {
            id: "no-logic-in-route-handlers",
            label: "No business logic in route handlers",
            tooltip: "Delegate to services immediately",
            prompt:
              "**Scope rule:** Route handlers must delegate to a service immediately.\n\n- No conditionals, no DB calls, no calculations inside a route handler\n- The handler validates input, calls `service.doThing(args)`, and returns the result\n- Error handling is centralized in middleware — not duplicated per handler",
          },
          {
            id: "no-direct-db-outside-repos",
            label: "No direct DB calls outside repositories",
            tooltip: "Always go through the data layer",
            prompt:
              "**Scope rule:** Database clients must only be imported inside repository files.\n\n- `prisma`, `db`, `pool`, `mongoose`, etc. are imported only in `repositories/`\n- All other modules call the repository interface — never the DB client directly\n- This makes the data layer swappable and independently testable",
          },
          {
            id: "no-shared-mutable-state",
            label: "No shared mutable state",
            tooltip: "Avoid global variables and singletons",
            prompt:
              "**Scope rule:** Avoid global mutable variables and singletons.\n\n- Pass dependencies explicitly as function arguments or via dependency injection\n- Module-level `let` variables that change at runtime are a code smell\n- Use a controlled state management solution (Zustand, Redux) if global state is genuinely required",
          },
        ],
      },

      {
        id: "ui-pattern",
        label: "UI Pattern",
        type: "select",
        visibleWhen: ["web-app", "fullstack-app", "mobile-app"],
        options: [
          {
            id: "container-presenter",
            label: "Container / Presenter",
            tooltip: "Smart components fetch, dumb components render",
            prompt:
              "**UI pattern:** Container / Presenter\n\n- **Containers** handle data fetching, state, and logic — they pass data down as props\n- **Presenters** receive props only; they are stateless and side-effect free\n- Presenters are easily testable with plain prop values\n- Name containers with the feature (e.g. `UserProfileContainer`); presenters with what they render (e.g. `UserCard`)",
          },
          {
            id: "hooks-based",
            label: "Hooks-based",
            tooltip: "Logic in custom hooks, components stay thin",
            prompt:
              "**UI pattern:** Hooks-based\n\n- All state logic, side effects, and data fetching live in custom hooks\n- Components call hooks and render the returned values\n- Components must not contain `useState`/`useEffect` for anything beyond trivial local UI state\n- Hooks are named `use{Domain}` (e.g. `useAuth`, `useCart`, `useProductList`)",
          },
          {
            id: "server-components",
            label: "Server Components",
            tooltip: "Next.js: data fetching at render",
            prompt:
              "**UI pattern:** Server Components (Next.js App Router)\n\n- Prefer React Server Components for data fetching — no client JS required\n- Add `'use client'` only when the component needs browser APIs, event listeners, or local state\n- Keep client-side JS minimal — treat `'use client'` boundaries as deliberate performance decisions\n- Pass server-fetched data as props into client components rather than re-fetching client-side",
          },
          {
            id: "atomic-design",
            label: "Atomic Design",
            tooltip: "Atoms → Molecules → Organisms → Pages",
            prompt:
              "**UI pattern:** Atomic Design\n\n- **Atoms:** Base elements with no dependencies — `Button`, `Input`, `Icon`\n- **Molecules:** Combinations of atoms — `SearchBar` (Input + Button), `FormField` (Label + Input)\n- **Organisms:** Complex UI sections — `Navbar`, `ProductCard`, `CheckoutForm`\n- **Pages:** Assemble organisms into full layouts; own data fetching\n- Only import from the same or lower level — organisms can use molecules, never the reverse",
          },
        ],
      },

      {
        id: "state-management",
        label: "State Management",
        type: "select",
        visibleWhen: ["web-app", "fullstack-app", "mobile-app"],
        options: [
          {
            id: "react-context",
            label: "React Context",
            tooltip: "Built-in, good for simple global state",
            prompt:
              "**State:** React Context\n\n- Use Context for low-frequency global state (theme, auth, locale) — not high-frequency updates\n- Avoid putting frequently-updated values in a single context (causes excessive re-renders)\n- Split contexts by domain: `AuthContext`, `ThemeContext` — never one god `AppContext`\n- Memoize context values with `useMemo` to prevent unnecessary re-renders",
          },
          {
            id: "zustand",
            label: "Zustand",
            tooltip: "Lightweight, minimal boilerplate",
            prompt:
              "**State:** Zustand\n\n- Define one store per domain (e.g. `useAuthStore`, `useCartStore`)\n- Keep store actions inside the store definition — not in components\n- Use selectors to subscribe to slices: `useAuthStore((s) => s.user)` — never subscribe to the whole store\n- Do not mutate state directly — use Zustand's `set` API",
          },
          {
            id: "redux-toolkit",
            label: "Redux Toolkit",
            tooltip: "Powerful, best for complex multi-actor state",
            prompt:
              "**State:** Redux Toolkit\n\n- Define one slice per domain using `createSlice`\n- Use `createAsyncThunk` for async operations — not manual dispatch chains\n- Never put non-serializable values in the Redux store (functions, class instances, Promises)\n- Use `createSelector` for derived state — never compute derived values in components",
          },
          {
            id: "jotai",
            label: "Jotai",
            tooltip: "Atomic state, fine-grained reactivity",
            prompt:
              "**State:** Jotai\n\n- Define atoms in dedicated files grouped by domain\n- Prefer derived atoms (`atom(get => ...)`) over duplicating state\n- Use `atomWithStorage` for persistent state — not manual `localStorage` calls\n- Keep atoms small and focused — large atoms that hold many values defeat fine-grained reactivity",
          },
          {
            id: "server-state-only",
            label: "Server state only (React Query / SWR)",
            tooltip: "No client state library needed",
            prompt:
              "**State:** Server state only (TanStack Query / SWR)\n\n- All remote data is managed by React Query or SWR — not local state\n- There is no client-side global state library in this project\n- Local UI state (open/closed, active tab) is managed with `useState` inside components\n- Use query keys consistently and document their structure",
          },
        ],
      },
    ],
  },

  // ── 5. STYLES ──────────────────────────────────────────────────────────────
  {
    id: "styles",
    label: "Styles",
    description: "Formatting rules, import ordering, and code style preferences.",
    icon: "Paintbrush",
    disabled: false,
    subCategories: [
      {
        id: "formatting-js-ts",
        label: "Formatting (JS/TS)",
        type: "multi",
        visibleWhen: ["typescript", "javascript"],
        options: [
          {
            id: "prettier-default",
            label: "Prettier (default config)",
            tooltip: "Opinionated, no debates",
            prompt:
              "**Formatter:** Prettier (default config)\n\n- Use Prettier with its default configuration for all JS/TS/JSX/TSX files\n- Do not override Prettier's decisions manually in code\n- Run `prettier --write .` before committing",
          },
          {
            id: "prettier-single-quotes",
            label: "Prettier — single quotes",
            tooltip: "'string' not \"string\"",
            prompt:
              "**Formatter:** Prettier with `singleQuote: true`\n\n- Always use single quotes in JS/TS string literals: `'value'`\n- Double quotes are reserved for JSX attributes: `className=\"foo\"`",
          },
          {
            id: "prettier-2-spaces",
            label: "Prettier — 2-space indent",
            tooltip: "Standard for JS/TS",
            prompt:
              "**Indent:** 2 spaces (`tabWidth: 2` in Prettier config)\n\n- Use 2-space indentation throughout the project\n- No tabs — configure your editor to insert spaces on Tab key",
          },
          {
            id: "prettier-4-spaces",
            label: "Prettier — 4-space indent",
            prompt:
              "**Indent:** 4 spaces (`tabWidth: 4` in Prettier config)\n\n- Use 4-space indentation throughout the project\n- No tabs",
          },
          {
            id: "eslint-prettier",
            label: "ESLint + Prettier combined",
            tooltip: "Linting and formatting together",
            prompt:
              "**Linting + formatting:** ESLint + Prettier\n\n- ESLint handles code quality; Prettier handles formatting\n- Use `eslint-config-prettier` to disable conflicting ESLint formatting rules\n- Both must pass (`eslint` and `prettier --check`) before a commit is valid\n- Run `eslint --fix` and `prettier --write` in CI to catch issues early",
          },
          {
            id: "tailwind-class-sorting",
            label: "Tailwind class sorting",
            tooltip: "Auto-sort Tailwind classes",
            prompt:
              "**Tailwind:** Sort classes with `prettier-plugin-tailwindcss`\n\n- Class order always follows the plugin's output — do not reorder manually\n- Run Prettier before committing to ensure sorted output\n- Unsorted classes in a PR should be treated as a lint error",
          },
        ],
      },

      {
        id: "formatting-python",
        label: "Formatting (Python)",
        type: "multi",
        visibleWhen: ["python"],
        options: [
          {
            id: "black",
            label: "Black",
            tooltip: "Zero config, consistent output",
            prompt:
              "**Formatter:** Black\n\n- Use Black for all Python formatting — zero configuration\n- Do not override Black's decisions\n- Run `black .` before every commit",
          },
          {
            id: "ruff",
            label: "Ruff",
            tooltip: "Replaces flake8, isort, and more",
            prompt:
              "**Linter + formatter:** Ruff\n\n- Ruff replaces `flake8`, `isort`, and several other tools\n- Run `ruff check .` and `ruff format .` before every commit\n- Configure in `pyproject.toml` under `[tool.ruff]`",
          },
          {
            id: "isort",
            label: "isort",
            tooltip: "Alphabetically sorted imports",
            prompt:
              '**Import sorting:** isort\n\n- Use isort to sort Python imports alphabetically within groups\n- Configure `profile = "black"` in `pyproject.toml` if Black is also in use\n- Run `isort .` before committing',
          },
          {
            id: "line-length-88",
            label: "88-char line length",
            tooltip: "Black default",
            prompt:
              "**Line length:** 88 characters (Black default)\n\n- Maximum line length is 88 characters\n- Configure all tools (`black`, `ruff`, `flake8`) to use 88",
          },
          {
            id: "line-length-79",
            label: "79-char line length",
            tooltip: "PEP 8 classic",
            prompt:
              "**Line length:** 79 characters (PEP 8 standard)\n\n- Maximum line length is 79 characters\n- Configure all tools to use 79",
          },
        ],
      },

      {
        id: "import-ordering",
        label: "Import Ordering",
        type: "multi",
        options: [
          {
            id: "imports-builtin-external-internal",
            label: "Built-ins → External → Internal",
            tooltip: "Standard JS/TS convention",
            prompt:
              '**Import order:** Built-ins → External packages → Internal modules\n\n```typescript\n// 1. Node built-ins\nimport { readFile } from "fs/promises"\n\n// 2. External packages\nimport { useState } from "react"\nimport { z } from "zod"\n\n// 3. Internal aliases\nimport { cn } from "@/lib/cn"\nimport { UserCard } from "@/components/UserCard"\n```\n\nSeparate each group with a blank line.',
          },
          {
            id: "imports-alphabetical",
            label: "Alphabetical within groups",
            prompt:
              "**Import order:** Alphabetical within each import group.\n\n- Sort imports A–Z within each group (built-ins, external, internal)\n- Use `eslint-plugin-import` or `perfectionist` to enforce automatically",
          },
          {
            id: "no-relative-from-root",
            label: "No relative imports from root",
            tooltip: "Always use path aliases",
            prompt:
              '**Imports:** Never use deep relative paths.\n\n- ❌ `import { Button } from "../../../components/Button"`\n- ✅ `import { Button } from "@/components/Button"`\n- Configure path aliases in `tsconfig.json` and the bundler config',
          },
          {
            id: "path-aliases-required",
            label: "Path aliases required (`@/`)",
            tooltip: "@/components/Button not ../../components/Button",
            prompt:
              '**Imports:** Always use the `@/` path alias for internal imports.\n\n- Configure `@/` → `./src` (or project root) in `tsconfig.json` and bundler config\n- ❌ `import { useAuth } from "../../hooks/useAuth"`\n- ✅ `import { useAuth } from "@/hooks/useAuth"`',
          },
        ],
      },

      {
        id: "quotes",
        label: "Quotes (JS/TS)",
        type: "select",
        visibleWhen: ["typescript", "javascript"],
        options: [
          {
            id: "single-quotes-js",
            label: "Single quotes",
            prompt:
              "**Quotes:** Single quotes for all JS/TS string literals.\n\n- ✅ `const name = 'Alice'`\n- ❌ `const name = \"Alice\"`\n- Use template literals only when interpolating: `` `Hello, ${name}` ``",
          },
          {
            id: "double-quotes-js",
            label: "Double quotes",
            prompt:
              "**Quotes:** Double quotes for all JS/TS string literals.\n\n- ✅ `const name = \"Alice\"`\n- ❌ `const name = 'Alice'`\n- Use template literals only when interpolating: `` `Hello, ${name}` ``",
          },
          {
            id: "backticks-template-only",
            label: "Backticks for template literals only",
            prompt:
              "**Quotes:** Use backticks only for string interpolation.\n\n- ✅ `` const greeting = `Hello, ${name}` ``\n- ❌ `` const label = `Submit` `` — use `'Submit'` instead\n- Plain strings use single or double quotes (match the project's primary quote style)",
          },
          {
            id: "double-quotes-jsx",
            label: "Double quotes for JSX attributes",
            tooltip: 'className="foo" — React convention',
            prompt:
              '**JSX quotes:** Double quotes for JSX attribute values.\n\n- ✅ `<Button className="primary" type="submit" />`\n- ❌ `<Button className=\'primary\' />`\n- Consistent with HTML convention and React community standard',
          },
        ],
      },
    ],
  },

  // ── 6. CONVENTIONS ─────────────────────────────────────────────────────────
  {
    id: "conventions",
    label: "Conventions",
    description: "Naming rules for files, variables, functions, and commits.",
    icon: "BookOpen",
    disabled: false,
    subCategories: [
      {
        id: "file-folder-naming",
        label: "File & Folder Naming",
        type: "multi",
        options: [
          {
            id: "pascal-components",
            label: "PascalCase for components",
            tooltip: "Button.tsx, UserCard.tsx",
            prompt:
              "**Naming:** PascalCase for React component files.\n\n- ✅ `Button.tsx`, `UserCard.tsx`, `ParticleSystem.tsx`\n- ❌ `button.tsx`, `user-card.tsx`\n- The file name must match the exported component name",
          },
          {
            id: "kebab-pages",
            label: "kebab-case for pages and routes",
            tooltip: "user-profile.tsx",
            prompt:
              "**Naming:** kebab-case for page and route files.\n\n- ✅ `user-profile.tsx`, `order-history.tsx`, `api/send-email.ts`\n- ❌ `UserProfile.tsx`, `orderHistory.tsx`",
          },
          {
            id: "camel-utilities",
            label: "camelCase for utility files",
            tooltip: "formatDate.ts, useAuth.ts",
            prompt:
              "**Naming:** camelCase for utility and hook files.\n\n- ✅ `formatDate.ts`, `useAuth.ts`, `debounce.ts`\n- ❌ `format-date.ts`, `UseAuth.ts`",
          },
          {
            id: "snake-python",
            label: "snake_case for Python modules",
            tooltip: "user_service.py",
            prompt:
              "**Naming:** snake_case for all Python module and file names.\n\n- ✅ `user_service.py`, `auth_middleware.py`, `send_email.py`\n- ❌ `userService.py`, `AuthMiddleware.py`",
          },
          {
            id: "index-exports",
            label: "Index files for folder exports",
            tooltip: "components/Button/index.ts re-exports",
            prompt:
              "**Barrel exports:** Each component folder has an `index.ts` re-exporting its public API.\n\n- `components/Button/index.ts` exports `Button`, `ButtonProps`\n- Consumers import from the folder: `import { Button } from '@/components/Button'`\n- Internal implementation files are not importable from outside the folder",
          },
          {
            id: "no-index-files",
            label: "No index files",
            prompt:
              "**No barrel exports:** Import directly from the source file.\n\n- ✅ `import { Button } from '@/components/Button/Button'`\n- ❌ `import { Button } from '@/components/Button'` (barrel)\n- Keeps the module graph explicit and avoids circular dependency risks",
          },
        ],
      },

      {
        id: "variable-function-naming",
        label: "Variable & Function Naming",
        type: "multi",
        options: [
          {
            id: "camel-vars-functions",
            label: "camelCase for variables and functions",
            tooltip: "getUserById, isLoading",
            prompt:
              "**Naming:** camelCase for all variables and functions.\n\n- ✅ `getUserById`, `isLoading`, `fetchUserData`, `totalPrice`\n- ❌ `GetUserById`, `get_user_by_id`",
          },
          {
            id: "pascal-classes-components",
            label: "PascalCase for classes and components",
            tooltip: "UserService, ButtonGroup",
            prompt:
              "**Naming:** PascalCase for classes and React components.\n\n- ✅ `UserService`, `ButtonGroup`, `ApiClient`, `OrderRepository`\n- ❌ `userService`, `button_group`",
          },
          {
            id: "screaming-snake-constants",
            label: "SCREAMING_SNAKE_CASE for constants",
            tooltip: "MAX_RETRY_COUNT, API_BASE_URL",
            prompt:
              "**Naming:** SCREAMING_SNAKE_CASE for module-level constants.\n\n- ✅ `MAX_RETRY_COUNT`, `API_BASE_URL`, `DEFAULT_TIMEOUT_MS`\n- ❌ `maxRetryCount`, `apiBaseUrl`\n- Applies to values that are fixed at module load time and never reassigned",
          },
          {
            id: "boolean-prefix-is-has-can",
            label: "Prefix booleans with is/has/can",
            tooltip: "isVisible, hasPermission, canEdit",
            prompt:
              "**Naming:** Prefix boolean variables and props with `is`, `has`, or `can`.\n\n- ✅ `isVisible`, `hasPermission`, `canEdit`, `isLoading`, `hasError`\n- ❌ `visible`, `permission`, `loading`\n- Makes intent immediately clear when reading conditional logic",
          },
          {
            id: "handler-prefix",
            label: "Prefix event handlers with handle",
            tooltip: "handleClick, handleSubmit",
            prompt:
              "**Naming:** Prefix event handler functions with `handle`.\n\n- ✅ `handleClick`, `handleSubmit`, `handleChange`, `handleKeyDown`\n- ❌ `onClick`, `submit`, `onChange` (as function names, not prop names)\n- Distinguishes event handlers from regular functions at a glance",
          },
          {
            id: "hook-prefix",
            label: "Prefix hooks with use",
            tooltip: "useAuth, useDebounce",
            prompt:
              "**Naming:** All custom React hooks must start with `use`.\n\n- ✅ `useAuth`, `useDebounce`, `useParticles`, `useLocalStorage`\n- ❌ `authHook`, `getDebounced`\n- Required by React's rules of hooks linter",
          },
          {
            id: "snake-python-naming",
            label: "snake_case for Python",
            tooltip: "get_user_by_id, is_authenticated",
            prompt:
              "**Naming (Python):** snake_case for all variables, functions, and module names.\n\n- ✅ `get_user_by_id`, `is_authenticated`, `max_retry_count`\n- ❌ `getUserById`, `isAuthenticated`\n- Follow PEP 8 naming conventions throughout",
          },
        ],
      },

      {
        id: "commit-messages",
        label: "Commit Messages",
        type: "multi",
        options: [
          {
            id: "conventional-commits",
            label: "Conventional Commits",
            tooltip: "feat:, fix:, chore:, docs: prefixes",
            prompt:
              "**Commits:** Conventional Commits format.\n\n- Prefix all commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`\n- ✅ `feat: add hover animation to particle system`\n- ✅ `fix: resolve login redirect loop on token expiry`\n- ❌ `updated stuff`, `WIP`, `misc fixes`",
          },
          {
            id: "imperative-mood",
            label: "Imperative mood",
            tooltip: '"Add feature" not "Added feature"',
            prompt:
              '**Commits:** Write subject lines in the imperative mood.\n\n- ✅ `Add feature`, `Fix bug`, `Remove deprecated endpoint`\n- ❌ `Added feature`, `Fixing bug`, `Removes deprecated endpoint`\n- Reads as a command: "If applied, this commit will **{subject}**"',
          },
          {
            id: "max-72-chars",
            label: "Max 72 characters in subject",
            tooltip: "Fits in git log without truncation",
            prompt:
              "**Commits:** Subject lines must be 72 characters or fewer.\n\n- Longer context goes in the commit body (after a blank line)\n- Use `git log --oneline` to verify the subject fits",
          },
          {
            id: "reference-issue",
            label: "Reference issue number",
            tooltip: "fix: resolve login bug (#123)",
            prompt:
              "**Commits:** Reference the related issue at the end of the subject.\n\n- ✅ `fix: resolve login redirect bug (#123)`\n- ✅ `feat: add export to CSV (#87)`\n- Enables automatic issue linking in GitHub/GitLab",
          },
          {
            id: "no-period-end",
            label: "No period at end of subject",
            prompt:
              "**Commits:** Do not end commit subject lines with a period.\n\n- ✅ `feat: add user profile page`\n- ❌ `feat: add user profile page.`",
          },
        ],
      },
    ],
  },

  // ── 7. PATTERNS ────────────────────────────────────────────────────────────
  {
    id: "patterns",
    label: "Patterns",
    description: "Architectural and code patterns the agent should actively apply.",
    icon: "Grid",
    disabled: false,
    subCategories: [
      {
        id: "patterns-list",
        label: "Patterns",
        type: "multi",
        options: [
          {
            id: "mvc",
            label: "MVC",
            tooltip: "Model, View, Controller — classic",
            prompt:
              "**Pattern:** MVC (Model / View / Controller)\n\n- **Models** handle data shape and DB interaction\n- **Views** handle rendering only — no logic\n- **Controllers** handle routing and orchestration — delegate to models immediately\n\n```typescript\n// Controller — thin\nexport async function getUser(req: Request, res: Response) {\n  const user = await UserModel.findById(req.params.id)\n  res.json(user)\n}\n\n// Model — owns data logic\nclass UserModel {\n  static findById(id: string): Promise<User> { ... }\n}\n```",
          },
          {
            id: "container-presenter-pattern",
            label: "Container / Presenter",
            tooltip: "Smart + dumb component split",
            prompt:
              "**Pattern:** Container / Presenter\n\n- **Containers** own data fetching, state, and logic\n- **Presenters** receive props only — stateless and side-effect free\n\n```typescript\n// Container\nfunction UserProfileContainer({ id }: { id: string }) {\n  const { user, isLoading } = useUser(id)\n  return <UserCard user={user} isLoading={isLoading} />\n}\n\n// Presenter — pure rendering\nfunction UserCard({ user, isLoading }: UserCardProps) {\n  if (isLoading) return <Skeleton />\n  return <div>{user.name}</div>\n}\n```",
          },
          {
            id: "repository-pattern",
            label: "Repository Pattern",
            tooltip: "Data access abstracted behind interfaces",
            prompt:
              "**Pattern:** Repository Pattern\n\n- Define a repository interface; implement it with the concrete data source\n- Services depend on the interface — not the implementation\n\n```typescript\ninterface UserRepository {\n  findById(id: string): Promise<User | null>\n  save(user: User): Promise<void>\n  delete(id: string): Promise<void>\n}\n\n// Implementation\nclass PrismaUserRepository implements UserRepository {\n  findById(id: string) { return prisma.user.findUnique({ where: { id } }) }\n  save(user: User) { return prisma.user.upsert({ ... }) }\n  delete(id: string) { return prisma.user.delete({ where: { id } }) }\n}\n```",
          },
          {
            id: "service-layer",
            label: "Service Layer",
            tooltip: "Business logic isolated from controllers",
            prompt:
              "**Pattern:** Service Layer\n\n- All business logic lives in service files — framework-agnostic and independently testable\n- Controllers call services; services call repositories\n\n```typescript\n// userService.ts — no Express, no Prisma imports\nexport class UserService {\n  constructor(private repo: UserRepository) {}\n\n  async registerUser(email: string, password: string): Promise<User> {\n    const existing = await this.repo.findByEmail(email)\n    if (existing) throw new ConflictError('Email already registered')\n    const hashed = await hashPassword(password)\n    return this.repo.save({ email, password: hashed })\n  }\n}\n```",
          },
          {
            id: "factory-pattern",
            label: "Factory Pattern",
            tooltip: "Object creation abstracted from usage",
            prompt:
              "**Pattern:** Factory Pattern\n\n- Use factory functions or classes to create complex objects\n- Consumers call the factory — they do not use `new` directly\n\n```typescript\n// Factory function\nfunction createEmailService(config: EmailConfig): EmailService {\n  if (config.provider === 'sendgrid') return new SendGridService(config)\n  if (config.provider === 'ses') return new SesService(config)\n  throw new Error(`Unknown provider: ${config.provider}`)\n}\n\n// Usage — caller never knows the concrete class\nconst email = createEmailService(appConfig.email)\n```",
          },
          {
            id: "observer-event-emitter",
            label: "Observer / Event Emitter",
            tooltip: "Decoupled communication between modules",
            prompt:
              "**Pattern:** Observer / Event Emitter\n\n- Use an event emitter for communication between decoupled modules\n- Emitters must not know about their listeners\n\n```typescript\n// EventBus (Node EventEmitter or mitt)\nconst bus = mitt<{ 'user:registered': User; 'order:placed': Order }>()\n\n// Publisher — knows nothing about subscribers\nbus.emit('user:registered', newUser)\n\n// Subscriber — knows nothing about the publisher\nbus.on('user:registered', (user) => sendWelcomeEmail(user))\n```",
          },
          {
            id: "strategy-pattern",
            label: "Strategy Pattern",
            tooltip: "Swap algorithms at runtime",
            prompt:
              "**Pattern:** Strategy Pattern\n\n- Define a strategy interface; pass the concrete strategy as a dependency\n- The calling code works with any strategy that satisfies the interface\n\n```typescript\ninterface SortStrategy<T> {\n  sort(items: T[]): T[]\n}\n\nclass DataProcessor<T> {\n  constructor(private sorter: SortStrategy<T>) {}\n\n  process(items: T[]) {\n    return this.sorter.sort(items)\n  }\n}\n\n// Swap strategies at runtime:\nconst processor = new DataProcessor(new QuickSort())\nconst altProcessor = new DataProcessor(new MergeSort())\n```",
          },
          {
            id: "singleton",
            label: "Singleton",
            tooltip: "One instance globally — use sparingly",
            prompt:
              "**Pattern:** Singleton (use sparingly)\n\n- Use only for genuinely shared resources: DB connection pool, logger, config\n- Never use Singleton for business logic — it makes testing hard\n\n```typescript\n// Module-level singleton (preferred over class-based)\nimport { PrismaClient } from '@prisma/client'\n\ndeclare global { var prisma: PrismaClient | undefined }\n\nexport const db = globalThis.prisma ?? new PrismaClient()\nif (process.env.NODE_ENV !== 'production') globalThis.prisma = db\n```",
          },
          {
            id: "composition-over-inheritance",
            label: "Composition over inheritance",
            prompt:
              "**Pattern:** Composition over inheritance\n\n- Build complex behavior by combining small, focused functions or components\n- Avoid deep class inheritance hierarchies — they are rigid and hard to test\n\n```typescript\n// ❌ Inheritance — fragile\nclass AdminUser extends AuthenticatedUser extends BaseUser { ... }\n\n// ✅ Composition — flexible\nconst withAuth = (handler: Handler) => async (req, res) => {\n  if (!req.user) return res.status(401).end()\n  return handler(req, res)\n}\nconst withAdmin = (handler: Handler) => withAuth(async (req, res) => {\n  if (!req.user.isAdmin) return res.status(403).end()\n  return handler(req, res)\n})\n```",
          },
          {
            id: "feature-flags",
            label: "Feature Flags",
            tooltip: "Toggle functionality without deploys",
            prompt:
              "**Pattern:** Feature Flags\n\n- Toggle new functionality without a deploy\n- Flag checks must be at the entry point of a feature, not scattered throughout the code\n\n```typescript\n// flags.ts — single source of truth\nexport const FLAGS = {\n  newCheckout: process.env.NEXT_PUBLIC_FLAG_NEW_CHECKOUT === 'true',\n  aiSuggestions: process.env.NEXT_PUBLIC_FLAG_AI_SUGGESTIONS === 'true',\n} as const\n\n// Usage — check once at the top level\nif (FLAGS.newCheckout) return <NewCheckout />\nreturn <LegacyCheckout />\n```",
          },
          {
            id: "optimistic-ui",
            label: "Optimistic UI Updates",
            tooltip: "Update UI before server confirms",
            prompt:
              "**Pattern:** Optimistic UI Updates\n\n- Update the UI immediately before the server responds\n- Always implement a rollback if the server returns an error\n\n```typescript\n// With TanStack Query\nuseMutation({\n  mutationFn: (id) => api.deleteItem(id),\n  onMutate: async (id) => {\n    await queryClient.cancelQueries({ queryKey: ['items'] })\n    const previous = queryClient.getQueryData(['items'])\n    queryClient.setQueryData(['items'], (old) => old.filter((i) => i.id !== id))\n    return { previous }  // snapshot for rollback\n  },\n  onError: (_err, _id, ctx) => {\n    queryClient.setQueryData(['items'], ctx?.previous)  // rollback\n  },\n})\n```",
          },
          {
            id: "error-boundaries",
            label: "Error Boundaries",
            tooltip: "Catch render errors gracefully (React)",
            prompt:
              "**Pattern:** Error Boundaries (React)\n\n- Wrap major UI sections in Error Boundaries to catch render errors\n- Provide meaningful fallback UIs — never let a single component crash the whole page\n\n```typescript\n// With react-error-boundary\nimport { ErrorBoundary } from 'react-error-boundary'\n\nfunction ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {\n  return (\n    <div role=\"alert\">\n      <p>Something went wrong:</p>\n      <pre>{error.message}</pre>\n      <button onClick={resetErrorBoundary}>Try again</button>\n    </div>\n  )\n}\n\n// Wrap feature sections, not individual components\n<ErrorBoundary FallbackComponent={ErrorFallback}>\n  <CheckoutFlow />\n</ErrorBoundary>\n```",
          },
        ],
      },
    ],
  },

  // ── 8. ANTI-PATTERNS ───────────────────────────────────────────────────────
  {
    id: "anti-patterns",
    label: "Anti-patterns",
    description: "Patterns the agent must actively avoid.",
    icon: "ShieldOff",
    disabled: false,
    subCategories: [
      {
        id: "anti-patterns-list",
        label: "Anti-patterns to avoid",
        type: "multi",
        options: [
          {
            id: "no-god-objects",
            label: "God objects",
            tooltip: "One class/module doing everything",
            prompt:
              "**Avoid:** God objects and god modules.\n\n- Do not create classes or files that handle many unrelated responsibilities\n- Split by single responsibility — if a file is hard to name, it's doing too much\n\n```typescript\n// ❌ God service\nclass AppService {\n  sendEmail() { ... }\n  processPayment() { ... }\n  generateReport() { ... }\n  authenticateUser() { ... }\n}\n\n// ✅ Focused services\nclass EmailService { sendEmail() { ... } }\nclass PaymentService { processPayment() { ... } }\n```",
          },
          {
            id: "no-prop-drilling",
            label: "Prop drilling",
            tooltip: "Passing props 3+ levels deep",
            prompt:
              "**Avoid:** Prop drilling — passing props more than 2 levels deep.\n\n- Use React Context, a state management library, or component composition instead\n\n```typescript\n// ❌ Drilling through intermediaries that don't use the prop\n<Page user={user}>\n  <Layout user={user}>\n    <Header user={user}>\n      <Avatar user={user} />  // only Avatar needs this\n    </Header>\n  </Layout>\n</Page>\n\n// ✅ Context or composition\nconst { user } = useAuth()  // Avatar reads from context directly\n```",
          },
          {
            id: "no-logic-in-ui",
            label: "Business logic in UI components",
            prompt:
              "**Avoid:** Business logic directly in UI components.\n\n- Extract to services, hooks, or utility functions\n\n```typescript\n// ❌ Logic in a component\nfunction OrderCard({ order }) {\n  const discount = order.total > 100 ? order.total * 0.1 : 0\n  const tax = (order.total - discount) * 0.08\n  const final = order.total - discount + tax\n  return <div>{formatCurrency(final)}</div>\n}\n\n// ✅ Logic in a utility\nfunction OrderCard({ order }) {\n  const { finalPrice } = calculateOrderTotal(order)\n  return <div>{formatCurrency(finalPrice)}</div>\n}\n```",
          },
          {
            id: "no-db-in-controllers",
            label: "Direct DB calls in controllers",
            tooltip: "Always go through a service/repository",
            prompt:
              "**Avoid:** Database calls directly in controllers or route handlers.\n\n```typescript\n// ❌ Direct DB call in a controller\napp.get('/users/:id', async (req, res) => {\n  const user = await prisma.user.findUnique({ where: { id: req.params.id } })\n  res.json(user)\n})\n\n// ✅ Delegate to a service/repository\napp.get('/users/:id', async (req, res) => {\n  const user = await userService.getById(req.params.id)\n  res.json(user)\n})\n```",
          },
          {
            id: "no-magic-numbers",
            label: "Magic numbers and strings",
            tooltip: "Use named constants instead",
            prompt:
              "**Avoid:** Magic numbers and unexplained string literals.\n\n```typescript\n// ❌ Magic numbers\nif (retries > 3) throw new Error('Too many retries')\nsetTimeout(fn, 86400000)\n\n// ✅ Named constants\nconst MAX_RETRIES = 3\nconst ONE_DAY_MS = 24 * 60 * 60 * 1000\n\nif (retries > MAX_RETRIES) throw new Error('Too many retries')\nsetTimeout(fn, ONE_DAY_MS)\n```",
          },
          {
            id: "no-silent-errors",
            label: "Silent error swallowing",
            tooltip: "Never catch {} without handling",
            prompt:
              "**Avoid:** Silent error swallowing.\n\n```typescript\n// ❌ Swallowing — the error disappears completely\ntry {\n  await riskyOperation()\n} catch (e) {}\n\n// ✅ Handle, log, or re-throw\ntry {\n  await riskyOperation()\n} catch (e) {\n  logger.error('riskyOperation failed', { error: e })\n  throw e  // or handle gracefully\n}\n```",
          },
          {
            id: "no-premature-optimization",
            label: "Premature optimization",
            prompt:
              "**Avoid:** Premature optimization.\n\n- Write clear, correct code first\n- Optimize only when profiling confirms a bottleneck\n\n```typescript\n// ❌ Premature — complex caching before measuring\nconst memoizedCalculation = useMemo(() => heavyCalc(data), [data])\n// (added before any evidence this is slow)\n\n// ✅ Measure first, then optimize if needed\nconst result = heavyCalc(data)  // start simple; profile if it feels slow\n```",
          },
          {
            id: "no-deep-nesting",
            label: "Deep nesting",
            tooltip: "Max 3 levels of indentation",
            prompt:
              "**Avoid:** Deep nesting — maximum 3 levels of indentation.\n\nUse early returns and guard clauses to flatten logic:\n\n```typescript\n// ❌ Deep nesting\nfunction processOrder(order) {\n  if (order) {\n    if (order.items.length > 0) {\n      if (order.isPaid) {\n        // actual logic here at level 4\n      }\n    }\n  }\n}\n\n// ✅ Early returns\nfunction processOrder(order) {\n  if (!order) return\n  if (order.items.length === 0) return\n  if (!order.isPaid) return\n  // actual logic at level 1\n}\n```",
          },
          {
            id: "no-mutable-global-state",
            label: "Mutable global state",
            prompt:
              "**Avoid:** Mutable global variables.\n\n```typescript\n// ❌ Global mutable state\nlet currentUser: User | null = null\nexport function setUser(u: User) { currentUser = u }\nexport function getUser() { return currentUser }\n\n// ✅ Controlled state (Zustand, Context, or explicit params)\nconst useAuthStore = create<AuthStore>((set) => ({\n  user: null,\n  setUser: (user) => set({ user }),\n}))\n```",
          },
          {
            id: "no-circular-deps",
            label: "Circular dependencies",
            tooltip: "Module A imports B imports A",
            prompt:
              "**Avoid:** Circular module dependencies.\n\n- If Module A imports Module B, then Module B must not import Module A\n- Resolve cycles by extracting the shared dependency to a third module\n\n```typescript\n// ❌ Circular\n// userService.ts imports orderService\n// orderService.ts imports userService  ← cycle\n\n// ✅ Extract shared logic\n// shared/pricing.ts — imported by both, imports neither\nexport function calculateDiscount(user: User, order: Order) { ... }\n```",
          },
          {
            id: "no-any-typescript",
            label: "`any` type in TypeScript",
            tooltip: "Defeats the purpose of TypeScript",
            prompt:
              "**Avoid:** The `any` type in TypeScript.\n\n```typescript\n// ❌ any defeats TypeScript\nfunction process(data: any) {\n  return data.value.nested.thing  // no error even if wrong\n}\n\n// ✅ Use unknown and narrow\nfunction process(data: unknown) {\n  if (typeof data !== 'object' || data === null) throw new Error('Invalid data')\n  if (!('value' in data)) throw new Error('Missing value')\n  // now TypeScript knows data has .value\n}\n\n// ✅ Or define a proper type\ninterface ProcessInput { value: { nested: { thing: string } } }\nfunction process(data: ProcessInput) { return data.value.nested.thing }\n```",
          },
          {
            id: "no-monolithic-functions",
            label: "Monolithic functions",
            tooltip: "Functions over 50 lines need splitting",
            prompt:
              "**Avoid:** Functions longer than ~50 lines.\n\n- Split into smaller, focused sub-functions — each does one thing\n- Long functions are hard to test, name, and reason about\n\n```typescript\n// ❌ One 80-line function doing everything\nasync function handleCheckout(cart, user, paymentMethod) {\n  // validate cart... (20 lines)\n  // calculate totals... (15 lines)\n  // process payment... (20 lines)\n  // send confirmation... (15 lines)\n}\n\n// ✅ Composed from focused functions\nasync function handleCheckout(cart: Cart, user: User, payment: PaymentMethod) {\n  const validated = validateCart(cart)\n  const totals = calculateTotals(validated)\n  const receipt = await processPayment(totals, payment)\n  await sendConfirmation(user, receipt)\n}\n```",
          },
        ],
      },
    ],
  },

  // ── 9. WORKFLOWS ──────────────────────────────────────────────────────────
  {
    id: "workflows",
    label: "Workflows",
    description: "Development commands, branching strategy, PR process, and pre-commit checklist.",
    icon: "Terminal",
    disabled: false,
    subCategories: [
      {
        id: "dev-commands",
        label: "Development Commands",
        type: "input",
        options: [
          {
            id: "cmd-install",
            label: "Install",
            placeholder: "pnpm install",
            prompt: "- **Install dependencies:** `{value}`",
          },
          {
            id: "cmd-dev",
            label: "Dev server",
            placeholder: "pnpm dev",
            prompt: "- **Start dev server:** `{value}`",
          },
          {
            id: "cmd-build",
            label: "Build",
            placeholder: "pnpm build",
            prompt: "- **Build for production:** `{value}`",
          },
          {
            id: "cmd-test",
            label: "Test",
            placeholder: "pnpm test",
            prompt: "- **Run tests:** `{value}`",
          },
          {
            id: "cmd-lint",
            label: "Lint",
            placeholder: "pnpm lint",
            prompt: "- **Run linter:** `{value}`",
          },
          {
            id: "cmd-typecheck",
            label: "Type check",
            placeholder: "pnpm typecheck",
            prompt: "- **Run type check:** `{value}`",
          },
          {
            id: "cmd-format",
            label: "Format",
            placeholder: "pnpm format",
            prompt: "- **Run formatter:** `{value}`",
          },
        ],
      },

      {
        id: "test-tiers",
        label: "Test Tiers",
        type: "multi",
        options: [
          {
            id: "test-fast-feedback",
            label: "Fast feedback — single file",
            tooltip: "Run one test file in ~2-3s",
            prompt:
              "**Fast feedback (single file, ~2-3s):** Run only the test file for the module you're editing.\n\n- Use when iterating on a specific function or component\n- Example: `pnpm test src/services/userService.test.ts`\n- Do not run the full suite on every save — use fast feedback loops while developing",
          },
          {
            id: "test-full-suite",
            label: "Full suite before PR",
            tooltip: "Run all tests before pushing",
            prompt:
              "**Full suite (pre-push / pre-merge):** Run the complete test suite before opening a PR.\n\n- Catches cross-module regressions that single-file tests miss\n- Expected runtime: note it in the README so developers know what to expect\n- CI runs the full suite on every PR — a locally green full suite means no surprises",
          },
          {
            id: "test-pre-commit",
            label: "Pre-commit checks",
            tooltip: "Lint + typecheck + fast tests before every commit",
            prompt:
              "**Pre-commit checks:** Run lint, type check, and fast tests before every commit.\n\n- Use a git hook (husky + lint-staged) or run manually:\n  1. `lint` — zero errors required\n  2. `typecheck` — zero type errors required\n  3. Fast test for changed files\n- Do not commit if any check fails — fix the issue first",
          },
        ],
      },

      {
        id: "branching-strategy",
        label: "Branching Strategy",
        type: "select",
        options: [
          {
            id: "feature-branches-prs",
            label: "Feature branches + PRs",
            tooltip: "Standard team workflow",
            prompt:
              "**Branching:** Feature branches + PRs.\n\n- Branch from `main` for all work\n- Name branches: `feature/short-description` or `fix/short-description`\n- All changes require a pull request — no direct commits to `main`\n- Keep branches short-lived (under a week) to minimize merge conflicts",
          },
          {
            id: "trunk-based",
            label: "Trunk-based development",
            tooltip: "Short-lived branches, merge daily",
            prompt:
              "**Branching:** Trunk-based development.\n\n- Branches are short-lived — merge to `main` within 1-2 days\n- Use feature flags to ship incomplete features safely\n- Small, frequent commits are preferred over large batched PRs\n- `main` must always be deployable",
          },
          {
            id: "gitflow",
            label: "Gitflow",
            tooltip: "Long-lived develop and release branches",
            prompt:
              "**Branching:** Gitflow.\n\n- Feature branches merge into `develop`\n- Releases branch off `develop` as `release/x.y.z`\n- Hotfixes branch off `main` and merge back to both `main` and `develop`\n- Follow the standard Gitflow lifecycle — do not shortcut steps",
          },
          {
            id: "direct-commits",
            label: "Direct commits to main",
            tooltip: "Solo projects only",
            prompt:
              "**Branching:** Direct commits to `main` (solo project).\n\n- Branches and PRs are optional for this project\n- Use descriptive commit messages — the history is the only record of decisions",
          },
        ],
      },

      {
        id: "pr-process",
        label: "PR Process",
        type: "multi",
        options: [
          {
            id: "require-pr-review",
            label: "Require PR review before merge",
            prompt:
              "**PR rule:** All pull requests require at least one approval before merging.\n\n- Do not merge your own PRs without review\n- The reviewer is responsible for understanding the change, not just approving it",
          },
          {
            id: "squash-and-merge",
            label: "Squash and merge",
            prompt:
              "**Merge strategy:** Squash and merge.\n\n- One PR = one commit on `main`\n- The squashed commit message should summarize the PR, not list every WIP commit\n- Clean up the commit message before merging",
          },
          {
            id: "rebase-and-merge",
            label: "Rebase and merge",
            prompt:
              "**Merge strategy:** Rebase and merge.\n\n- Preserves individual commit history with a linear `main` branch\n- All commits in the PR should be clean before merging — squash WIP commits first\n- Never merge with a merge commit (`--no-ff`) on `main`",
          },
          {
            id: "no-force-push",
            label: "No force push to main",
            tooltip: "Protected branch",
            prompt:
              "**Branch protection:** Never force push to `main`.\n\n- `main` is a protected branch — history is permanent\n- If a bad commit lands on `main`, revert it — do not force push\n- Use `--force-with-lease` on feature branches if needed (not `--force`)",
          },
          {
            id: "link-issue-in-pr",
            label: "Link issue in PR description",
            prompt:
              "**PR rule:** Every PR must reference its related issue.\n\n- Use `Closes #123` or `Fixes #123` in the PR description to auto-close on merge\n- If no issue exists, create one before opening the PR",
          },
          {
            id: "draft-prs-for-wip",
            label: "Draft PRs for WIP",
            tooltip: "Use draft status, not WIP prefix",
            prompt:
              "**PR rule:** Use GitHub Draft PRs for work-in-progress.\n\n- Do not add `WIP:` or `[WIP]` prefixes to PR titles\n- Convert Draft → Ready for Review only when the PR is complete and self-reviewed\n- CI should still run on draft PRs",
          },
        ],
      },

      {
        id: "qa-checklist",
        label: "QA Checklist Before Commit",
        type: "multi",
        options: [
          {
            id: "qa-run-tests",
            label: "Run tests locally",
            prompt:
              "**QA:** All tests must pass locally before pushing.\n\n- Run the relevant test file at minimum; run the full suite before opening a PR\n- Do not push with known failing tests — fix them first",
          },
          {
            id: "qa-run-lint",
            label: "Run lint",
            prompt:
              "**QA:** Run the linter and resolve all errors before committing.\n\n- Zero lint errors required\n- Warnings should be addressed when possible — do not accumulate warning debt",
          },
          {
            id: "qa-run-typecheck",
            label: "Run type check",
            prompt:
              "**QA:** Run the TypeScript type checker — zero errors required before committing.\n\n- `// @ts-ignore` and `// @ts-expect-error` suppressions require a comment explaining why",
          },
          {
            id: "qa-run-formatter",
            label: "Run formatter",
            prompt:
              "**QA:** Run the code formatter before committing.\n\n- Unformatted code must not be merged — use a pre-commit hook or CI check",
          },
          {
            id: "qa-self-review",
            label: "Self-review the diff",
            prompt:
              "**QA:** Read your own diff before pushing.\n\n- Check for: typos, accidental changes, debug code, logic errors visible in the diff\n- `git diff --staged` shows exactly what will be committed",
          },
          {
            id: "qa-no-debug-code",
            label: "No debug code",
            tooltip: "Remove console.log, debugger, leftover TODOs",
            prompt:
              "**QA:** Remove all debug code before committing to a shared branch.\n\n- No `console.log`, `console.error`, `debugger` statements\n- No temporary `TODO:` or `FIXME:` comments added during this session\n- No commented-out code blocks",
          },
          {
            id: "qa-update-tests",
            label: "Update tests for changed code",
            prompt:
              "**QA:** Any changed behavior must be covered by updated or new tests.\n\n- Do not leave tests that no longer reflect the actual code behavior\n- New public functions require at least one test",
          },
        ],
      },
    ],
  },

  // ── 10. TESTING ────────────────────────────────────────────────────────────
  {
    id: "testing",
    label: "Testing",
    description: "Testing requirements, frameworks, file organization, and coverage rules.",
    icon: "CheckCircle",
    disabled: false,
    subCategories: [
      {
        id: "testing-rules",
        label: "Testing Rules",
        type: "multi",
        options: [
          {
            id: "unit-tests-required",
            label: "Unit tests required",
            tooltip: "Every function/module needs a test",
            prompt:
              "**Testing:** Unit tests required for all non-trivial functions and modules.\n\n- Untested code must not be merged to `main`\n- A function is testable if it's pure or has injected dependencies — refactor if it's not\n- Test the behavior (inputs → outputs), not the implementation",
          },
          {
            id: "integration-tests",
            label: "Integration tests",
            tooltip: "Test boundaries between modules",
            prompt:
              "**Testing:** Integration tests for module boundaries.\n\n- Write integration tests for: service ↔ repository, API ↔ service, component ↔ hook\n- These tests use real dependencies or realistic stubs — not deep mocks\n- Integration tests catch mismatches that unit tests with mocks miss",
          },
          {
            id: "e2e-playwright",
            label: "E2E tests (Playwright)",
            tooltip: "Test critical user flows",
            prompt:
              "**Testing:** E2E tests with Playwright.\n\n- Cover all critical user flows: login, key feature paths, checkout, etc.\n- E2E tests run in CI on every PR\n- Keep E2E tests stable — flaky tests are disabled, investigated, and fixed (not ignored)\n- Use `page.getByRole` and `page.getByLabel` — not CSS selectors or test IDs as a default",
          },
          {
            id: "e2e-cypress",
            label: "E2E tests (Cypress)",
            tooltip: "Alternative E2E framework",
            prompt:
              "**Testing:** E2E tests with Cypress.\n\n- Cover all critical user flows\n- Tests run in CI on every PR\n- Use `cy.findByRole` (Testing Library) — not `cy.get('.selector')` as a default",
          },
          {
            id: "tdd",
            label: "TDD — tests first",
            tooltip: "Write tests before implementation",
            prompt:
              "**Testing:** Test-Driven Development (TDD).\n\n1. Write a failing test that describes the expected behavior\n2. Write the minimum code to make the test pass\n3. Refactor — improve the code without breaking the test\n\nNever write production code without a failing test to motivate it.",
          },
          {
            id: "colocate-tests",
            label: "Colocate tests with source",
            tooltip: "Component.test.tsx next to Component.tsx",
            prompt:
              "**Testing:** Colocate test files with their source files.\n\n- `Button.test.tsx` lives in the same folder as `Button.tsx`\n- `userService.test.ts` lives next to `userService.ts`\n- Makes it obvious when a file has no tests",
          },
          {
            id: "separate-tests-dir",
            label: "Separate `/tests` directory",
            prompt:
              "**Testing:** All test files live under a top-level `/tests` directory.\n\n- Mirror the source structure: `tests/services/userService.test.ts` mirrors `src/services/userService.ts`\n- Keep test utilities and fixtures under `tests/__helpers__` or `tests/__fixtures__`",
          },
          {
            id: "coverage-threshold",
            label: "Minimum coverage threshold",
            tooltip: "Fail CI below a defined percentage",
            prompt:
              "**Testing:** CI fails if test coverage drops below the configured threshold.\n\n- Configure in the test runner (e.g. `coverage.threshold` in Vitest config or `--coverageThreshold` in Jest)\n- Coverage threshold is a floor, not a goal — 100% coverage with bad tests is worthless",
          },
          {
            id: "mock-external-services",
            label: "Mock external services",
            tooltip: "Never hit real APIs in unit tests",
            prompt:
              "**Testing:** Unit and integration tests must never make real network requests.\n\n- Mock all external services: APIs, email providers, payment gateways, S3\n- Use the test framework's mocking utilities (`vi.mock`, `jest.mock`, `unittest.mock`)\n- Real network calls belong in E2E tests only",
          },
          {
            id: "no-snapshot-tests",
            label: "No snapshot tests",
            tooltip: "Fragile, avoid unless necessary",
            prompt:
              "**Testing:** Do not use snapshot tests.\n\n- Snapshots are updated automatically and reviewed carelessly — they do not catch real regressions\n- Test behavior and output explicitly instead:\n  - ❌ `expect(component).toMatchSnapshot()`\n  - ✅ `expect(screen.getByRole('button')).toHaveTextContent('Submit')`",
          },
        ],
      },
    ],
  },

  // ── 11. PERMISSION BOUNDARIES ──────────────────────────────────────────────
  {
    id: "permission-boundaries",
    label: "Permission Boundaries",
    description: "Define what the agent can always do, should ask before, and must never do.",
    icon: "ShieldCheck",
    disabled: false,
    subCategories: [
      {
        id: "always-allowed",
        label: "✅ Always Allowed",
        type: "multi",
        options: [
          {
            id: "perm-create-files",
            label: "Create new files",
            prompt: "✅ **Always:** Create new files within the project directory without asking.",
          },
          {
            id: "perm-update-deps",
            label: "Add / update dependencies",
            prompt:
              "✅ **Always:** Add or update `package.json` dependencies as needed for the task.",
          },
          {
            id: "perm-write-tests",
            label: "Write and update tests",
            prompt: "✅ **Always:** Write, update, or delete test files.",
          },
          {
            id: "perm-fix-lint",
            label: "Fix lint and type errors",
            prompt:
              "✅ **Always:** Fix lint warnings, type errors, and formatting issues without asking.",
          },
          {
            id: "perm-refactor-local",
            label: "Refactor within a file",
            prompt:
              "✅ **Always:** Refactor code within a single file without asking — as long as behavior is preserved.",
          },
          {
            id: "perm-delete-dead-code",
            label: "Delete dead code",
            prompt:
              "✅ **Always:** Delete unreachable code, unused imports, and clearly dead functions without asking.",
          },
        ],
      },
      {
        id: "ask-first",
        label: "⚠️ Ask First",
        type: "multi",
        options: [
          {
            id: "perm-ask-schema",
            label: "Modify database schema",
            prompt:
              "⚠️ **Ask first:** Do not modify the database schema or write migrations without explicit approval.",
          },
          {
            id: "perm-ask-public-api",
            label: "Change public API contracts",
            prompt:
              "⚠️ **Ask first:** Do not change public API interfaces, response shapes, or remove endpoints without approval.",
          },
          {
            id: "perm-ask-env",
            label: "Add environment variables",
            prompt:
              "⚠️ **Ask first:** Do not add new environment variables without documenting them in `.env.example` and asking.",
          },
          {
            id: "perm-ask-deps-major",
            label: "Major version upgrades",
            prompt:
              "⚠️ **Ask first:** Do not upgrade packages across major versions without review — breaking changes may be involved.",
          },
          {
            id: "perm-ask-ci",
            label: "Modify CI/CD config",
            prompt:
              "⚠️ **Ask first:** Do not modify CI/CD configuration files (`.github/workflows/`, `Dockerfile`, `vercel.json`, etc.) without approval.",
          },
          {
            id: "perm-ask-cross-module",
            label: "Refactor across multiple modules",
            prompt:
              "⚠️ **Ask first:** Large refactors that touch many files or change shared interfaces require alignment before starting.",
          },
        ],
      },
      {
        id: "never-do",
        label: "🚫 Never",
        type: "multi",
        options: [
          {
            id: "perm-never-secrets",
            label: "Commit secrets or .env files",
            prompt:
              "🚫 **Never:** Commit `.env` files, API keys, passwords, tokens, or any secrets to the repository.",
          },
          {
            id: "perm-never-force-push",
            label: "Force push to main",
            prompt:
              "🚫 **Never:** Force push to `main` or any protected branch. Revert bad commits — do not rewrite history.",
          },
          {
            id: "perm-never-drop-db",
            label: "Drop or truncate database tables",
            prompt:
              "🚫 **Never:** Drop or truncate database tables, or run destructive migrations without an explicit instruction to do so.",
          },
          {
            id: "perm-never-delete-tests",
            label: "Delete tests to make CI pass",
            prompt:
              "🚫 **Never:** Delete, skip, or comment out tests to make CI pass. Fix the underlying issue instead.",
          },
          {
            id: "perm-never-console-prod",
            label: "Leave debug code in commits",
            prompt:
              "🚫 **Never:** Commit `console.log`, `debugger`, temporary debug comments, or commented-out code to shared branches.",
          },
          {
            id: "perm-never-ignore-errors",
            label: "Swallow errors silently",
            prompt:
              "🚫 **Never:** Use empty `catch {}` blocks. Every error must be handled, logged, or re-thrown.",
          },
        ],
      },
    ],
  },

  // ── 12. SECURITY ───────────────────────────────────────────────────────────
  {
    id: "security",
    label: "Security",
    description: "Secrets handling, input validation, and vulnerability prevention.",
    icon: "Lock",
    disabled: false,
    subCategories: [
      {
        id: "secrets-hygiene",
        label: "Secrets & Credentials",
        type: "multi",
        options: [
          {
            id: "sec-env-vars",
            label: "Load secrets from environment only",
            prompt:
              "**Secrets:** All credentials and API keys are loaded from environment variables — never hard-coded.\n\n- Use `.env.local` for local development (add to `.gitignore`, never commit)\n- Document required variables in `.env.example` with placeholder values\n- ✅ `process.env.DATABASE_URL`\n- ❌ `const DB_URL = 'postgres://user:pass@host/db'`",
          },
          {
            id: "sec-no-logging-secrets",
            label: "Never log sensitive data",
            prompt:
              "**Secrets:** Never log passwords, tokens, API keys, or PII.\n\n- Sanitize error messages before surfacing them to the client\n- Strip sensitive fields before logging request/response bodies\n- ❌ `logger.info('User login', { password, token })`\n- ✅ `logger.info('User login', { userId: user.id })`",
          },
          {
            id: "sec-gitignore",
            label: "Verify .gitignore covers secrets",
            prompt:
              "**Secrets:** Verify `.gitignore` covers all secret file patterns before committing.\n\n- Must include: `.env`, `.env.local`, `.env.*.local`, `*.pem`, `*.key`\n- Run `git status` before committing — if any env file appears, stop and add it to `.gitignore`",
          },
          {
            id: "sec-rotate-exposed",
            label: "Rotate immediately if exposed",
            prompt:
              "**Secrets:** If a secret is accidentally committed or logged, treat it as compromised immediately.\n\n- Revoke and rotate the credential — do not just delete the commit\n- Rewriting git history does not remove the secret from clones or CI logs",
          },
        ],
      },
      {
        id: "input-validation",
        label: "Input Validation",
        type: "multi",
        options: [
          {
            id: "sec-validate-all-input",
            label: "Validate all external input",
            prompt:
              "**Validation:** Validate and sanitize all data at system boundaries.\n\n- HTTP request bodies, query params, headers, cookies, file uploads, webhook payloads\n- Use a schema validation library: Zod, Joi, Yup, Pydantic\n- Never trust client-provided IDs, roles, or permission claims without server verification\n\n```typescript\n// Always validate at the boundary\nconst body = CreateUserSchema.parse(req.body)  // throws on invalid input\n```",
          },
          {
            id: "sec-parameterize-sql",
            label: "Parameterize all SQL queries",
            prompt:
              "**SQL safety:** Never interpolate user input into SQL strings.\n\n```typescript\n// ❌ SQL injection vulnerability\nconst query = `SELECT * FROM users WHERE email = '${email}'`\n\n// ✅ Parameterized query\nconst user = await db.query('SELECT * FROM users WHERE email = $1', [email])\n\n// ✅ ORM (Prisma, Drizzle) — safe by default\nconst user = await prisma.user.findUnique({ where: { email } })\n```\n\nString-concatenated SQL is a critical vulnerability — no exceptions.",
          },
          {
            id: "sec-no-xss",
            label: "Prevent XSS",
            prompt:
              "**XSS prevention:** Never render unsanitized user content as HTML.\n\n- ❌ `dangerouslySetInnerHTML={{ __html: userContent }}`\n- ✅ Use a sanitization library (DOMPurify) if HTML rendering is required\n- Validate and encode URL parameters before use in `href` or `src` attributes\n- Set a Content Security Policy header to limit script sources",
          },
          {
            id: "sec-auth-check",
            label: "Authenticate and authorize every endpoint",
            prompt:
              "**Auth:** Every API endpoint must verify authentication and authorization.\n\n- Authentication: is this a valid, non-expired session?\n- Authorization: does this user have permission to perform this action on this resource?\n- Both checks happen server-side — client-side hiding is not a security control\n- Fail closed: if the auth check is ambiguous, deny access",
          },
        ],
      },
    ],
  },

  // ── 13. ENVIRONMENT ────────────────────────────────────────────────────────
  {
    id: "environment",
    label: "Environment",
    description: "Prerequisites, tool versions, and setup instructions.",
    icon: "Settings2",
    disabled: false,
    subCategories: [
      {
        id: "prerequisites",
        label: "Prerequisites",
        type: "input",
        options: [
          {
            id: "env-node-version",
            label: "Node version",
            placeholder: "22.x (see .nvmrc)",
            prompt:
              "**Node.js:** `{value}` — pin with `.nvmrc` or the `engines` field in `package.json`.",
          },
          {
            id: "env-package-manager",
            label: "Package manager",
            placeholder: "pnpm 9.x",
            prompt:
              "**Package manager:** `{value}` — do not use a different package manager in this repo; lockfile conflicts will result.",
          },
          {
            id: "env-other-tools",
            label: "Other required tools",
            placeholder: "Docker 24+, AWS CLI v2, Terraform 1.8+",
            prompt: "**Required tools:** `{value}`",
          },
        ],
      },
      {
        id: "env-setup-steps",
        label: "Setup",
        type: "multi",
        options: [
          {
            id: "env-copy-env",
            label: "Copy .env.example → .env.local",
            prompt:
              "**Setup:** Copy `.env.example` to `.env.local` and fill in all required values before running any commands. The app will not start without required env vars.",
          },
          {
            id: "env-install-first",
            label: "Always install after pulling",
            prompt:
              "**Setup:** Run the install command after pulling changes or switching branches — the lockfile may have changed and the node_modules will be out of sync.",
          },
          {
            id: "env-docker-required",
            label: "Docker required for local services",
            prompt:
              "**Setup:** Local database and dependent services run in Docker. Start them with `docker compose up -d` before running the dev server. Without Docker, the app will fail to connect.",
          },
          {
            id: "env-seed-db",
            label: "Seed the database after setup",
            prompt:
              "**Setup:** After running migrations, seed the database with development fixtures before testing features that require data.",
          },
        ],
      },
    ],
  },

  // ── 14. DEPLOYMENT ─────────────────────────────────────────────────────────
  {
    id: "deployment",
    label: "Deployment",
    description: "Deployment environments, CI/CD pipeline, and release procedures.",
    icon: "Rocket",
    disabled: false,
    subCategories: [
      {
        id: "deployment-environments",
        label: "Environments",
        type: "multi",
        options: [
          {
            id: "env-staging-prod",
            label: "Staging → Production",
            prompt:
              "**Environments:** Staging and Production.\n\n- **Staging** is the pre-production environment — all changes are verified here before going to production\n- **Production** deploys only from `main` via CI — never manually\n- Staging mirrors production config; use production-equivalent data volumes for realistic testing",
          },
          {
            id: "env-preview-deployments",
            label: "Preview deployments (per PR)",
            prompt:
              "**Environments:** Preview deployments for every pull request.\n\n- Each PR gets an automatic preview URL (e.g. Vercel Preview, Netlify Deploy Preview)\n- Use preview URLs for QA and stakeholder review before merging\n- Preview environments are ephemeral — they are destroyed when the PR is closed",
          },
          {
            id: "env-feature-environments",
            label: "Feature / dev environments",
            prompt:
              "**Environments:** Shared feature / developer environments for longer-running work.\n\n- Used for integration testing and stakeholder demos before staging\n- Environment configurations are stored in the repo (not manually applied)\n- Treat feature environments as disposable — they can be torn down and recreated",
          },
          {
            id: "env-single-prod",
            label: "Production only",
            prompt:
              "**Environments:** Production only — no staging environment.\n\n- All changes are tested locally and in CI before deploying to production\n- Use feature flags to limit exposure of new features in production\n- Monitor closely after each deploy — have a rollback plan ready",
          },
        ],
      },
      {
        id: "cicd-rules",
        label: "CI/CD Rules",
        type: "multi",
        options: [
          {
            id: "ci-never-manual-deploy",
            label: "Never deploy manually to production",
            prompt:
              "🚫 **Never deploy manually to production.** All production deployments happen exclusively through the CI pipeline.\n\n- Manual deployments bypass test gates, audit logs, and rollback procedures\n- If CI is broken, fix it — do not work around it with manual deploys",
          },
          {
            id: "ci-no-modify-without-review",
            label: "Do not modify CI config without review",
            prompt:
              "⚠️ **Ask first before modifying CI/CD configuration.**\n\n- Files: `.github/workflows/`, `Dockerfile`, `docker-compose.yml`, `vercel.json`, `netlify.toml`, deploy scripts\n- CI config changes affect the entire team's workflow and deployment safety\n- Changes must be reviewed and tested on a branch before merging",
          },
          {
            id: "ci-gated-on-checks",
            label: "Deployments gated on passing checks",
            prompt:
              "**CI rule:** Deployments are blocked until all required checks pass.\n\n- Required checks: tests, lint, type check, security scan\n- A failing check on `main` is a P0 — fix it before starting new work\n- Do not bypass branch protection rules to merge with failing checks",
          },
          {
            id: "ci-rollback-plan",
            label: "Maintain a rollback plan",
            prompt:
              "**Deployment:** Every release must have a rollback plan.\n\n- Know the rollback command or procedure before deploying\n- Database migrations must be backward-compatible with the previous release (so rollback doesn't break data)\n- Keep the previous release's Docker image or build artifact available for at least 24 hours",
          },
          {
            id: "ci-env-parity",
            label: "Keep environments in parity",
            prompt:
              '**Deployment:** Keep environment configurations in parity.\n\n- Differences between staging and production are known, documented, and intentional\n- "Works in staging, broken in production" is usually caused by undocumented environment differences\n- Infrastructure is defined as code (Terraform, Pulumi, CDK) — no manual cloud console changes',
          },
        ],
      },
    ],
  },
]
