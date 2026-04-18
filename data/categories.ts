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
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIES: Category[] = [
  // ── 1. TECH STACK ──────────────────────────────────────────────────────────
  {
    id: "tech-stack",
    label: "Tech Stack",
    description:
      "Define the languages, frameworks, and services used. Selections here filter options in other categories.",
    isPrimary: true,
    icon: "Layers",
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
              "This is a web application. The project includes a frontend UI and may include backend services.",
          },
          {
            id: "api-backend",
            label: "API / Backend Service",
            tooltip: "No UI, pure server",
            prompt:
              "This is a backend API service with no frontend UI. Focus on API design, data handling, and service reliability.",
          },
          {
            id: "cli-tool",
            label: "CLI Tool",
            tooltip: "Terminal-based, no server",
            prompt:
              "This is a CLI tool. There is no UI or server. Focus on terminal UX, argument parsing, and clear output formatting.",
          },
          {
            id: "fullstack-app",
            label: "Full-stack App",
            tooltip: "Frontend and backend in one repo",
            prompt:
              "This is a full-stack application with frontend and backend colocated in the same repository. Respect the boundary between client and server code.",
          },
          {
            id: "library-package",
            label: "Library / Package",
            tooltip: "Reusable code, not an app",
            prompt:
              "This is a reusable library or package. Prioritize a clean public API, minimal dependencies, and thorough documentation of exports.",
          },
          {
            id: "mobile-app",
            label: "Mobile App",
            tooltip: "React Native / Expo",
            prompt:
              "This is a mobile application built with React Native / Expo. Consider platform differences (iOS vs Android), native APIs, and performance on low-end devices.",
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
              "The project uses TypeScript. Enable strict mode in tsconfig. Never use `any` — use `unknown` and narrow types properly. All new files must be `.ts` or `.tsx`.",
          },
          {
            id: "javascript",
            label: "JavaScript",
            tooltip: "No types, faster to prototype",
            tags: ["frontend", "backend"],
            prompt:
              "The project uses JavaScript (no TypeScript). Use JSDoc comments where types would add clarity. Avoid patterns that obscure data shapes.",
          },
          {
            id: "python",
            label: "Python",
            tooltip: "Backend, scripts, AI/ML workloads",
            tags: ["backend", "ai"],
            prompt:
              "The project uses Python 3.10+. Use type hints on all function signatures. Follow PEP 8. Prefer dataclasses or Pydantic models over plain dicts for structured data.",
          },
          {
            id: "go",
            label: "Go",
            tooltip: "High performance, low latency",
            tags: ["backend"],
            prompt:
              "The project uses Go. Follow standard Go project layout. Always handle errors explicitly — never ignore returned errors. Use `context.Context` for cancellation propagation.",
          },
          {
            id: "rust",
            label: "Rust",
            tooltip: "Systems programming, memory safe",
            tags: ["backend", "cli"],
            prompt:
              "The project uses Rust. Use the ownership model correctly — avoid unnecessary cloning. Prefer `Result` and `Option` over panics. Run `clippy` and address all warnings.",
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
              "The frontend uses Next.js (App Router). Prefer Server Components by default — only use `'use client'` when interactivity is required. Use `next/image` for all images and `next/font` for fonts.",
          },
          {
            id: "react-vite",
            label: "React + Vite",
            tooltip: "Client-side only, fast dev setup",
            tags: ["frontend"],
            prompt:
              "The frontend uses React with Vite. This is a client-side only setup — there is no server-side rendering. Use React Router for navigation. Keep the Vite config minimal.",
          },
          {
            id: "sveltekit",
            label: "SvelteKit",
            tooltip: "Lightweight, file-based routing",
            tags: ["frontend"],
            prompt:
              "The frontend uses SvelteKit. Use file-based routing. Prefer Svelte stores over external state libraries. Use `+page.server.ts` for server-side data loading.",
          },
          {
            id: "vue-nuxt",
            label: "Vue + Nuxt",
            tooltip: "Progressive, good for migrations",
            tags: ["frontend"],
            prompt:
              "The frontend uses Vue 3 with Nuxt. Use the Composition API with `<script setup>`. Prefer Pinia for state management. Use auto-imported components and composables.",
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
              "Backend logic lives in Next.js Route Handlers (`app/api/`). Keep route handlers thin — delegate business logic to service files immediately.",
          },
          {
            id: "node-express",
            label: "Node + Express",
            tooltip: "Flexible, minimal, widely used",
            tags: ["backend"],
            prompt:
              "The backend uses Node.js with Express. Organize routes by resource. Use middleware for auth, validation, and error handling. Always use `async/await` with proper error boundaries.",
          },
          {
            id: "node-fastify",
            label: "Node + Fastify",
            tooltip: "Faster than Express, schema-first",
            tags: ["backend"],
            prompt:
              "The backend uses Node.js with Fastify. Define JSON schemas for all routes using Fastify's built-in schema validation. Use plugins to encapsulate domain logic.",
          },
          {
            id: "python-fastapi",
            label: "Python + FastAPI",
            tooltip: "Async, auto-docs, great for AI",
            tags: ["backend", "ai"],
            prompt:
              "The backend uses FastAPI. Define Pydantic models for all request and response bodies. Use async route handlers. Leverage dependency injection for shared resources like DB connections.",
          },
          {
            id: "python-django",
            label: "Python + Django",
            tooltip: "Batteries included, admin-heavy apps",
            tags: ["backend"],
            prompt:
              "The backend uses Django. Follow Django's MVT pattern. Use Django ORM — do not mix in raw SQL unless profiling justifies it. Use Django REST Framework for API endpoints.",
          },
          {
            id: "go-stdlib",
            label: "Go (stdlib or Gin)",
            tooltip: "Fast, statically typed",
            tags: ["backend"],
            prompt:
              "The backend uses Go. Keep handlers thin and delegate to service structs. Use `context.Context` for request-scoped values. Prefer the standard library before reaching for third-party packages.",
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
              "The database is PostgreSQL. Use migrations for all schema changes — never alter the schema manually. Prefer explicit column names over `SELECT *`.",
          },
          {
            id: "mysql",
            label: "MySQL",
            tooltip: "Relational, good for read-heavy apps",
            tags: ["database"],
            prompt:
              "The database is MySQL. Use migrations for all schema changes. Be mindful of MySQL-specific behaviors (e.g. case-insensitive collations, ENUM limitations).",
          },
          {
            id: "sqlite",
            label: "SQLite",
            tooltip: "Embedded, great for local or small apps",
            tags: ["database"],
            prompt:
              "The database is SQLite. Use WAL mode for better concurrent reads. Keep the schema simple. Do not use SQLite features unsupported by the target runtime.",
          },
          {
            id: "mongodb",
            label: "MongoDB",
            tooltip: "Document store, flexible schema",
            tags: ["database"],
            prompt:
              "The database is MongoDB. Define explicit schemas with Mongoose or Zod. Avoid deeply nested documents. Prefer references over embedding for frequently updated data.",
          },
          {
            id: "redis",
            label: "Redis",
            tooltip: "In-memory, caching and queues",
            tags: ["database"],
            prompt:
              "Redis is used for caching and/or queuing. Always set TTL on cached keys. Use namespaced key patterns (e.g. `user:123:session`). Never store primary business data exclusively in Redis.",
          },
          {
            id: "no-database",
            label: "None",
            tooltip: "No database",
            prompt:
              "This project does not use a database. All data is handled in-memory or via external APIs.",
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
              "The project uses Prisma as the ORM. All schema changes must go through `prisma migrate`. Never call `prisma.$executeRaw` for queries that can be expressed with the Prisma client API.",
          },
          {
            id: "drizzle",
            label: "Drizzle",
            tooltip: "Lightweight, SQL-first, fast",
            tags: ["database"],
            prompt:
              "The project uses Drizzle ORM. Prefer Drizzle's query builder over raw SQL. Keep schema definitions in a dedicated `/db/schema.ts` file.",
          },
          {
            id: "typeorm",
            label: "TypeORM",
            tooltip: "Mature, decorator-based",
            tags: ["database"],
            prompt:
              "The project uses TypeORM. Use the DataSource and repository pattern. Do not use `synchronize: true` in production — always use migrations.",
          },
          {
            id: "sqlalchemy",
            label: "SQLAlchemy",
            tooltip: "Python standard, powerful",
            tags: ["database", "python"],
            prompt:
              "The project uses SQLAlchemy. Use Alembic for migrations. Prefer the ORM query style over raw SQL. Define models in a dedicated `models/` module.",
          },
          {
            id: "raw-sql",
            label: "Raw SQL",
            tooltip: "Full control, no abstraction",
            tags: ["database"],
            prompt:
              "The project uses raw SQL queries. Parameterize all user inputs — never use string interpolation in SQL queries. Keep queries in dedicated repository files, not inline in business logic.",
          },
        ],
      },
    ],
  },

  // ── 2. PROJECT CONTEXT ─────────────────────────────────────────────────────
  {
    id: "project-context",
    label: "Project Context",
    description: "Sets the tone and level of strictness of the generated file.",
    icon: "Briefcase",
    subCategories: [
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
              "This is a solo project. Keep conventions pragmatic and lean. Prioritize speed of iteration over strict team processes.",
          },
          {
            id: "small-team",
            label: "Small Team (2–5)",
            tooltip: "Include naming and PR conventions",
            prompt:
              "This project is maintained by a small team. Follow shared naming conventions and require PR reviews before merging. Document non-obvious decisions in comments or ADRs.",
          },
          {
            id: "open-source",
            label: "Open Source",
            tooltip: "Include contribution and commit guidelines",
            prompt:
              "This is an open source project. All contributions must follow conventional commits. Include clear commit messages that explain the *why*, not just the *what*. Be welcoming to first-time contributors — avoid unnecessary complexity.",
          },
          {
            id: "client-production",
            label: "Client / Production",
            tooltip: "Strict conventions, full constraint set",
            prompt:
              "This is a production project serving real users. Apply the full constraint set: strict typing, test coverage, lint checks before commit, no debug code in merged PRs, and mandatory PR reviews.",
          },
          {
            id: "prototype",
            label: "Prototype / Throwaway",
            tooltip: "Minimal file, skip long-term rules",
            prompt:
              "This is a prototype or throwaway project. Skip long-term conventions. Focus on exploring the solution quickly. Mark any hacks with `// PROTOTYPE:` comments so they are easy to find if the codebase is ever promoted.",
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
    subCategories: [
      {
        id: "skills-list",
        label: "Skills",
        type: "skills",
        options: [
          {
            id: "find-skills",
            label: "find-skills",
            tooltip: "Helps agents discover other skills",
            tags: ["meta"],
            prompt: "npx skills add vercel-labs/agent-skills/find-skills",
          },
          {
            id: "vercel-react-best-practices",
            label: "vercel-react-best-practices",
            tooltip: "React patterns from Vercel",
            tags: ["frontend", "react"],
            prompt: "npx skills add vercel-labs/agent-skills/vercel-react-best-practices",
          },
          {
            id: "frontend-design",
            label: "frontend-design",
            tooltip: "Production-grade UI design guidelines",
            tags: ["frontend"],
            prompt: "npx skills add anthropics/skills/frontend-design",
          },
          {
            id: "web-design-guidelines",
            label: "web-design-guidelines",
            tooltip: "Web design principles from Vercel",
            tags: ["frontend"],
            prompt: "npx skills add vercel-labs/agent-skills/web-design-guidelines",
          },
          {
            id: "remotion-best-practices",
            label: "remotion-best-practices",
            tooltip: "Video rendering with Remotion",
            tags: ["frontend"],
            prompt: "npx skills add remotion-dev/remotion-skills/remotion-best-practices",
          },
          {
            id: "shadcn",
            label: "shadcn",
            tooltip: "shadcn/ui component patterns",
            tags: ["ui", "frontend"],
            prompt: "npx skills add shadcn/ui/shadcn",
          },
          {
            id: "next-best-practices",
            label: "next-best-practices",
            tooltip: "Next.js patterns from Vercel",
            tags: ["frontend", "nextjs"],
            prompt: "npx skills add vercel-labs/agent-skills/next-best-practices",
          },
          {
            id: "supabase-postgres-best-practices",
            label: "supabase-postgres-best-practices",
            tooltip: "Supabase + Postgres patterns",
            tags: ["database"],
            prompt: "npx skills add supabase/skills/supabase-postgres-best-practices",
          },
          {
            id: "better-auth-best-practices",
            label: "better-auth-best-practices",
            tooltip: "Auth patterns with better-auth",
            tags: ["auth"],
            prompt: "npx skills add better-auth/skills/better-auth-best-practices",
          },
          {
            id: "playwright-best-practices",
            label: "playwright-best-practices",
            tooltip: "E2E testing with Playwright",
            tags: ["testing"],
            prompt:
              "npx skills add currents-dev/playwright-best-practices-skill/playwright-best-practices",
          },
          {
            id: "systematic-debugging",
            label: "systematic-debugging",
            tooltip: "Structured approach to debugging",
            tags: ["workflow"],
            prompt: "npx skills add obra/skills/systematic-debugging",
          },
          {
            id: "test-driven-development",
            label: "test-driven-development",
            tooltip: "TDD workflow and patterns",
            tags: ["testing", "workflow"],
            prompt: "npx skills add obra/skills/test-driven-development",
          },
          {
            id: "requesting-code-review",
            label: "requesting-code-review",
            tooltip: "How to prepare and request PR reviews",
            tags: ["workflow"],
            prompt: "npx skills add obra/skills/requesting-code-review",
          },
          {
            id: "typescript-advanced-types",
            label: "typescript-advanced-types",
            tooltip: "Advanced TypeScript type patterns",
            tags: ["language", "typescript"],
            prompt: "npx skills add wshobson/skills/typescript-advanced-types",
          },
          {
            id: "api-design-principles",
            label: "api-design-principles",
            tooltip: "REST API design guidelines",
            tags: ["backend"],
            prompt: "npx skills add wshobson/skills/api-design-principles",
          },
          {
            id: "nodejs-backend-patterns",
            label: "nodejs-backend-patterns",
            tooltip: "Node.js backend architecture patterns",
            tags: ["backend"],
            prompt: "npx skills add wshobson/skills/nodejs-backend-patterns",
          },
          {
            id: "python-performance-optimization",
            label: "python-performance-optimization",
            tooltip: "Python performance tips",
            tags: ["backend", "python"],
            prompt: "npx skills add wshobson/skills/python-performance-optimization",
          },
          {
            id: "tailwind-design-system",
            label: "tailwind-design-system",
            tooltip: "Tailwind CSS design system guidelines",
            tags: ["frontend", "css"],
            prompt: "npx skills add wshobson/skills/tailwind-design-system",
          },
          {
            id: "turborepo",
            label: "turborepo",
            tooltip: "Monorepo management with Turborepo",
            tags: ["tooling", "monorepo"],
            prompt: "npx skills add vercel/skills/turborepo",
          },
          {
            id: "ai-sdk",
            label: "ai-sdk",
            tooltip: "Vercel AI SDK patterns",
            tags: ["ai", "frontend"],
            prompt: "npx skills add vercel/skills/ai-sdk",
          },
          {
            id: "vue-best-practices",
            label: "vue-best-practices",
            tooltip: "Vue 3 patterns and conventions",
            tags: ["frontend", "vue"],
            prompt: "npx skills add hyf0/skills/vue-best-practices",
          },
          {
            id: "security-best-practices",
            label: "security-best-practices",
            tooltip: "Security guidelines for web apps",
            tags: ["security"],
            prompt: "npx skills add supercent-io/skills/security-best-practices",
          },
          {
            id: "web-accessibility",
            label: "web-accessibility",
            tooltip: "WCAG and accessibility patterns",
            tags: ["accessibility", "frontend"],
            prompt: "npx skills add supercent-io/skills/web-accessibility",
          },
          {
            id: "mcp-builder",
            label: "mcp-builder",
            tooltip: "Build MCP servers and tools",
            tags: ["ai", "meta"],
            prompt: "npx skills add anthropics/skills/mcp-builder",
          },
          {
            id: "skill-creator",
            label: "skill-creator",
            tooltip: "Create and publish new skills",
            tags: ["meta"],
            prompt: "npx skills add anthropics/skills/skill-creator",
          },
          {
            id: "webapp-testing",
            label: "webapp-testing",
            tooltip: "Web app testing strategies",
            tags: ["testing"],
            prompt: "npx skills add anthropics/skills/webapp-testing",
          },
        ],
      },
    ],
  },

  // ── 4. AUTO-INVOKE SKILLS ──────────────────────────────────────────────────
  {
    id: "auto-invoke-skills",
    label: "Auto-invoke Skills",
    description: "Define when each selected skill should be triggered automatically by the agent.",
    icon: "PlayCircle",
    subCategories: [
      {
        id: "trigger-templates",
        label: "Trigger Templates",
        type: "triggers",
        options: [
          {
            id: "trigger-new-component",
            label: "When creating a new component",
            prompt: "Use `{skill}` when creating a new React component.",
          },
          {
            id: "trigger-new-api-route",
            label: "When creating a new API route",
            prompt: "Use `{skill}` when creating a new API route.",
          },
          {
            id: "trigger-new-test",
            label: "When writing a test",
            prompt: "Use `{skill}` when writing or updating any test file.",
          },
          {
            id: "trigger-refactor",
            label: "When asked to refactor",
            prompt: "Use `{skill}` when the user asks to refactor existing code.",
          },
          {
            id: "trigger-new-feature",
            label: "When starting a new feature",
            prompt: "Use `{skill}` when starting implementation of a new feature.",
          },
          {
            id: "trigger-documentation",
            label: "When writing documentation",
            prompt: "Use `{skill}` when writing or updating documentation.",
          },
          {
            id: "trigger-pr-review",
            label: "When reviewing a PR",
            prompt: "Use `{skill}` when reviewing a pull request.",
          },
          {
            id: "trigger-before-commit",
            label: "Before committing",
            prompt: "Use `{skill}` before every commit to validate code quality.",
          },
          {
            id: "trigger-debug",
            label: "When debugging an error",
            prompt: "Use `{skill}` when the user reports a bug or unexpected behavior.",
          },
        ],
      },
    ],
  },

  // ── 5. ARCHITECTURE ────────────────────────────────────────────────────────
  {
    id: "architecture",
    label: "Architecture",
    description: "Define how the codebase is organized and what each layer is responsible for.",
    icon: "GitBranch",
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
              "Organize the codebase by feature/domain. Each feature folder (e.g. `/auth`, `/dashboard`) contains its own components, hooks, services, and types. Shared utilities live in `/shared` or `/lib`.",
          },
          {
            id: "layer-based",
            label: "Layer-based",
            tooltip: "Group by role: /components, /services, /hooks",
            prompt:
              "Organize the codebase by technical layer: `/components` for UI, `/services` for business logic, `/hooks` for stateful logic, `/lib` for utilities. Each layer has a single, well-defined responsibility.",
          },
          {
            id: "monorepo",
            label: "Monorepo",
            tooltip: "Multiple packages in one repo, shared tooling",
            prompt:
              "The project is a monorepo. Each package lives under `/packages` or `/apps`. Shared code lives in a dedicated package (e.g. `@repo/ui`, `@repo/utils`). Do not import across package boundaries without declaring a dependency.",
          },
          {
            id: "domain-driven",
            label: "Domain-driven",
            tooltip: "Bounded contexts, ideal for large teams",
            prompt:
              "The codebase follows Domain-Driven Design. Each domain has a bounded context with its own models, services, and repositories. Do not share domain internals — communicate between domains via public interfaces only.",
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
              "UI components must only render markup and handle user events. No business logic, no data fetching, and no complex calculations belong in a component.",
          },
          {
            id: "services-business-logic",
            label: "Services handle business logic",
            tooltip: "All domain logic lives in service files",
            prompt:
              "All business logic lives in service files (e.g. `/services/userService.ts`). Services are pure functions or classes with no framework dependencies.",
          },
          {
            id: "repositories-data-access",
            label: "Repositories handle data access",
            tooltip: "DB queries isolated from business logic",
            prompt:
              "All database queries and external API calls are encapsulated in repository files. Services call repositories — they never call the database directly.",
          },
          {
            id: "hooks-state-logic",
            label: "Hooks encapsulate state logic",
            tooltip: "Custom hooks own all stateful behavior",
            prompt:
              "All stateful behavior lives in custom hooks (e.g. `useAuth`, `useCart`). Components call hooks — they do not manage their own complex state directly.",
          },
          {
            id: "controllers-routing-only",
            label: "Controllers handle routing only",
            tooltip: "Thin controllers, fat services",
            prompt:
              "Route controllers/handlers must be thin. They validate input, call the appropriate service, and return the response. No business logic should live in a controller.",
          },
          {
            id: "middleware-cross-cutting",
            label: "Middleware handles cross-cutting concerns",
            tooltip: "Auth, logging, validation at middleware level",
            prompt:
              "Cross-cutting concerns — authentication, logging, request validation, rate limiting — are implemented as middleware, not inside individual route handlers.",
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
              "Files under `/components` must contain only UI markup and styling. No data fetching, no business logic.",
          },
          {
            id: "services-business",
            label: "`/services` → Business logic",
            tooltip: "Pure functions, no framework dependencies",
            prompt:
              "Files under `/services` contain pure business logic. They must not import React, Express, or any framework-specific module.",
          },
          {
            id: "repositories-data",
            label: "`/repositories` → Data access",
            tooltip: "All DB/API calls isolated here",
            prompt:
              "Files under `/repositories` are the only place where database queries and external API calls are made.",
          },
          {
            id: "hooks-state",
            label: "`/hooks` → State and side effects",
            tooltip: "Custom hooks for all stateful logic",
            prompt:
              "Files under `/hooks` manage state and side effects. All hooks must follow the `use` prefix convention.",
          },
          {
            id: "lib-utilities",
            label: "`/lib` → Shared utilities",
            tooltip: "Helpers, formatters, constants",
            prompt:
              "Files under `/lib` contain stateless helper functions, formatters, and constants. Nothing in `/lib` should have side effects or import application-specific code.",
          },
          {
            id: "types-interfaces",
            label: "`/types` → TypeScript interfaces",
            tooltip: "All shared types centralized",
            prompt:
              "All shared TypeScript types, interfaces, and enums live under `/types`. Do not define shared types inline in component or service files.",
          },
          {
            id: "app-routing-only",
            label: "`/app` or `/pages` → Routing only",
            tooltip: "Route handlers delegate immediately",
            prompt:
              "Files under `/app` or `/pages` handle only routing. They delegate data fetching to hooks or server loaders and delegate rendering to components.",
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
              "UI components must never call APIs or query databases directly. Use custom hooks, server components, or loaders for data fetching.",
          },
          {
            id: "no-cross-feature-imports",
            label: "Never import across feature boundaries",
            tooltip: "Features are isolated",
            prompt:
              "Features must not import directly from each other. Shared code must be extracted to a `/shared` module first.",
          },
          {
            id: "no-logic-in-route-handlers",
            label: "No business logic in route handlers",
            tooltip: "Delegate to services immediately",
            prompt:
              "Route handlers must delegate to a service on the first line of logic. No conditionals, no DB calls, no calculations inside a route handler.",
          },
          {
            id: "no-direct-db-outside-repos",
            label: "No direct DB calls outside repositories",
            tooltip: "Always go through the data layer",
            prompt:
              "Database clients (Prisma, Drizzle, SQLAlchemy, etc.) must only be imported inside repository files. All other modules must go through the repository interface.",
          },
          {
            id: "no-shared-mutable-state",
            label: "No shared mutable state",
            tooltip: "Avoid global variables and singletons",
            prompt:
              "Avoid global mutable variables and singletons. Pass dependencies explicitly or use a dependency injection pattern.",
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
              "Use the Container/Presenter pattern. Container components are responsible for data fetching, state, and logic. Presenter components receive props only and must not contain any logic.",
          },
          {
            id: "hooks-based",
            label: "Hooks-based",
            tooltip: "Logic in custom hooks, components stay thin",
            prompt:
              "Logic is extracted into custom hooks. Components call hooks and render the results. Components must not contain state logic or side effects directly.",
          },
          {
            id: "server-components",
            label: "Server Components",
            tooltip: "Next.js: data fetching at render",
            prompt:
              "Prefer React Server Components for data fetching. Use `'use client'` only when the component needs browser APIs, event listeners, or local state. Keep client-side JS minimal.",
          },
          {
            id: "atomic-design",
            label: "Atomic Design",
            tooltip: "Atoms → Molecules → Organisms → Pages",
            prompt:
              "Follow Atomic Design: Atoms are base elements (Button, Input). Molecules combine atoms (SearchBar). Organisms are complex UI sections (Navbar, ProductCard). Pages assemble organisms into full layouts.",
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
              "Use React Context for global state. Avoid putting frequently-updated values in context (causes excessive re-renders). Split contexts by domain.",
          },
          {
            id: "zustand",
            label: "Zustand",
            tooltip: "Lightweight, minimal boilerplate",
            prompt:
              "Use Zustand for global state. Define one store per domain. Keep store actions inside the store definition. Do not mutate state directly — use Zustand's set API.",
          },
          {
            id: "redux-toolkit",
            label: "Redux Toolkit",
            tooltip: "Powerful, best for complex multi-actor state",
            prompt:
              "Use Redux Toolkit. Define slices per domain. Use `createAsyncThunk` for async actions. Never put non-serializable values in the Redux store.",
          },
          {
            id: "jotai",
            label: "Jotai",
            tooltip: "Atomic state, fine-grained reactivity",
            prompt:
              "Use Jotai for fine-grained reactive state. Define atoms in dedicated files. Prefer derived atoms (`atom(get => ...)`) over duplicating state.",
          },
          {
            id: "server-state-only",
            label: "Server state only (React Query / SWR)",
            tooltip: "No client state library needed",
            prompt:
              "All remote data is managed by React Query (TanStack Query) or SWR. There is no client-side global state library. Local UI state is managed with `useState` inside components.",
          },
        ],
      },
    ],
  },

  // ── 6. STYLES ──────────────────────────────────────────────────────────────
  {
    id: "styles",
    label: "Styles",
    description: "Formatting rules, import ordering, and code style preferences.",
    icon: "Paintbrush",
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
              "Use Prettier with its default configuration for all JS/TS/JSX/TSX files. Do not override Prettier's decisions manually.",
          },
          {
            id: "prettier-single-quotes",
            label: "Prettier — single quotes",
            tooltip: "'string' not \"string\"",
            prompt:
              "Configure Prettier with `singleQuote: true`. Always use single quotes in JS/TS code.",
          },
          {
            id: "prettier-2-spaces",
            label: "Prettier — 2-space indent",
            tooltip: "Standard for JS/TS",
            prompt:
              "Configure Prettier with `tabWidth: 2`. Use 2-space indentation throughout the project.",
          },
          {
            id: "prettier-4-spaces",
            label: "Prettier — 4-space indent",
            prompt:
              "Configure Prettier with `tabWidth: 4`. Use 4-space indentation throughout the project.",
          },
          {
            id: "eslint-prettier",
            label: "ESLint + Prettier combined",
            tooltip: "Linting and formatting together",
            prompt:
              "Use ESLint for linting and Prettier for formatting together. Use `eslint-config-prettier` to disable conflicting ESLint formatting rules. Both must pass before a commit is valid.",
          },
          {
            id: "tailwind-class-sorting",
            label: "Tailwind class sorting",
            tooltip: "Auto-sort Tailwind classes",
            prompt:
              "Use `prettier-plugin-tailwindcss` to auto-sort Tailwind class names. Class order must always follow the plugin's output — do not reorder manually.",
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
              "Use Black for Python code formatting. Do not override Black's decisions. Run `black .` before every commit.",
          },
          {
            id: "ruff",
            label: "Ruff",
            tooltip: "Replaces flake8, isort, and more",
            prompt:
              "Use Ruff as the Python linter and formatter. It replaces flake8 and isort. Run `ruff check .` and `ruff format .` before every commit.",
          },
          {
            id: "isort",
            label: "isort",
            tooltip: "Alphabetically sorted imports",
            prompt:
              "Use isort to sort Python imports. Configure isort with `profile = black` if Black is also in use.",
          },
          {
            id: "line-length-88",
            label: "88-char line length",
            tooltip: "Black default",
            prompt:
              "Maximum line length is 88 characters (Black default). Configure all tools accordingly.",
          },
          {
            id: "line-length-79",
            label: "79-char line length",
            tooltip: "PEP 8 classic",
            prompt:
              "Maximum line length is 79 characters (PEP 8 standard). Configure all tools accordingly.",
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
              "Order imports in three groups separated by a blank line: 1) Node built-ins, 2) external packages, 3) internal project modules.",
          },
          {
            id: "imports-alphabetical",
            label: "Alphabetical within groups",
            prompt: "Within each import group, sort imports alphabetically.",
          },
          {
            id: "no-relative-from-root",
            label: "No relative imports from root",
            tooltip: "Always use path aliases",
            prompt:
              "Never use deep relative paths (e.g. `../../components`). Use configured path aliases instead (e.g. `@/components/Button`).",
          },
          {
            id: "path-aliases-required",
            label: "Path aliases required (`@/`)",
            tooltip: "@/components/Button not ../../components/Button",
            prompt:
              "Always use the `@/` path alias for internal imports. Configure `@/` to map to the project `/src` root in `tsconfig.json` and the bundler config.",
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
            prompt: "Use single quotes for all JS/TS string literals: `'value'`.",
          },
          {
            id: "double-quotes-js",
            label: "Double quotes",
            prompt: 'Use double quotes for all JS/TS string literals: `"value"`.',
          },
          {
            id: "backticks-template-only",
            label: "Backticks for template literals only",
            prompt:
              "Use backticks only when string interpolation is required. Do not use template literals for plain strings.",
          },
          {
            id: "double-quotes-jsx",
            label: "Double quotes for JSX attributes",
            tooltip: 'className="foo" — React convention',
            prompt:
              'Use double quotes for JSX attribute values: `className="foo"`. Single quotes in JSX attributes are non-standard.',
          },
        ],
      },
    ],
  },

  // ── 7. CONVENTIONS ─────────────────────────────────────────────────────────
  {
    id: "conventions",
    label: "Conventions",
    description: "Naming rules for files, variables, functions, and commits.",
    icon: "BookOpen",
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
              "Name all React component files in PascalCase: `Button.tsx`, `UserCard.tsx`, `ParticleSystem.tsx`.",
          },
          {
            id: "kebab-pages",
            label: "kebab-case for pages and routes",
            tooltip: "user-profile.tsx",
            prompt:
              "Name all page and route files in kebab-case: `user-profile.tsx`, `order-history.tsx`.",
          },
          {
            id: "camel-utilities",
            label: "camelCase for utility files",
            tooltip: "formatDate.ts, useAuth.ts",
            prompt:
              "Name utility files and custom hooks in camelCase: `formatDate.ts`, `useAuth.ts`, `debounce.ts`.",
          },
          {
            id: "snake-python",
            label: "snake_case for Python modules",
            tooltip: "user_service.py",
            prompt:
              "Name all Python modules and files in snake_case: `user_service.py`, `auth_middleware.py`.",
          },
          {
            id: "index-exports",
            label: "Index files for folder exports",
            tooltip: "components/Button/index.ts re-exports",
            prompt:
              "Each component folder must have an `index.ts` that re-exports the public API of that folder. Consumers import from the folder, not from internal files.",
          },
          {
            id: "no-index-files",
            label: "No index files",
            prompt:
              "Do not create barrel `index.ts` files. Import directly from the source file to keep the module graph explicit.",
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
              "Name all variables and functions in camelCase: `getUserById`, `isLoading`, `fetchUserData`.",
          },
          {
            id: "pascal-classes-components",
            label: "PascalCase for classes and components",
            tooltip: "UserService, ButtonGroup",
            prompt:
              "Name all classes and React components in PascalCase: `UserService`, `ButtonGroup`, `ApiClient`.",
          },
          {
            id: "screaming-snake-constants",
            label: "SCREAMING_SNAKE_CASE for constants",
            tooltip: "MAX_RETRY_COUNT, API_BASE_URL",
            prompt:
              "Name all module-level constants in SCREAMING_SNAKE_CASE: `MAX_RETRY_COUNT`, `API_BASE_URL`, `DEFAULT_TIMEOUT_MS`.",
          },
          {
            id: "boolean-prefix-is-has-can",
            label: "Prefix booleans with is/has/can",
            tooltip: "isVisible, hasPermission, canEdit",
            prompt:
              "Prefix all boolean variables and props with `is`, `has`, or `can`: `isVisible`, `hasPermission`, `canEdit`, `isLoading`.",
          },
          {
            id: "handler-prefix",
            label: "Prefix event handlers with handle",
            tooltip: "handleClick, handleSubmit",
            prompt:
              "Prefix all event handler functions with `handle`: `handleClick`, `handleSubmit`, `handleChange`.",
          },
          {
            id: "hook-prefix",
            label: "Prefix hooks with use",
            tooltip: "useAuth, useDebounce",
            prompt:
              "All custom React hooks must start with `use`: `useAuth`, `useDebounce`, `useParticles`.",
          },
          {
            id: "snake-python-naming",
            label: "snake_case for Python",
            tooltip: "get_user_by_id, is_authenticated",
            prompt:
              "In Python, use snake_case for all variables, functions, and module names: `get_user_by_id`, `is_authenticated`, `max_retry_count`.",
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
              "All commit messages must follow Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`. Example: `feat: add hover animation to particle system`.",
          },
          {
            id: "imperative-mood",
            label: "Imperative mood",
            tooltip: '"Add feature" not "Added feature"',
            prompt:
              'Write commit subject lines in the imperative mood: "Add feature" not "Added feature", "Fix bug" not "Fixed bug".',
          },
          {
            id: "max-72-chars",
            label: "Max 72 characters in subject",
            tooltip: "Fits in git log without truncation",
            prompt:
              "Keep commit subject lines to 72 characters or fewer. Use the body for additional context.",
          },
          {
            id: "reference-issue",
            label: "Reference issue number",
            tooltip: "fix: resolve login bug (#123)",
            prompt:
              "Reference the related issue number at the end of the commit subject: `fix: resolve login redirect bug (#123)`.",
          },
          {
            id: "no-period-end",
            label: "No period at end of subject",
            prompt: "Do not end commit subject lines with a period.",
          },
        ],
      },
    ],
  },

  // ── 8. PATTERNS ────────────────────────────────────────────────────────────
  {
    id: "patterns",
    label: "Patterns",
    description: "Architectural and code patterns the agent should actively apply.",
    icon: "Grid",
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
              "Follow the MVC pattern: Models handle data shape and DB interaction, Views handle rendering, Controllers handle request routing and orchestration.",
          },
          {
            id: "container-presenter-pattern",
            label: "Container / Presenter",
            tooltip: "Smart + dumb component split",
            prompt:
              "Split components into Containers (data, state, logic) and Presenters (pure rendering from props). Presenters must be stateless and side-effect free.",
          },
          {
            id: "repository-pattern",
            label: "Repository Pattern",
            tooltip: "Data access abstracted behind interfaces",
            prompt:
              "Implement the Repository pattern: define a repository interface, implement it with the concrete data source, and inject it into services. This makes data access swappable and testable.",
          },
          {
            id: "service-layer",
            label: "Service Layer",
            tooltip: "Business logic isolated from controllers",
            prompt:
              "All business logic lives in a dedicated service layer. Services are pure, framework-agnostic, and independently testable.",
          },
          {
            id: "factory-pattern",
            label: "Factory Pattern",
            tooltip: "Object creation abstracted from usage",
            prompt:
              "Use factory functions or classes to create complex objects. Consumers call the factory — they do not use `new` directly.",
          },
          {
            id: "observer-event-emitter",
            label: "Observer / Event Emitter",
            tooltip: "Decoupled communication between modules",
            prompt:
              "Use an event emitter or observable pattern for communication between decoupled modules. Emitters must not know about their listeners.",
          },
          {
            id: "strategy-pattern",
            label: "Strategy Pattern",
            tooltip: "Swap algorithms at runtime",
            prompt:
              "Use the Strategy pattern when behavior needs to be swappable at runtime. Define a strategy interface and pass the concrete strategy as a dependency.",
          },
          {
            id: "singleton",
            label: "Singleton",
            tooltip: "One instance globally — use sparingly",
            prompt:
              "Use the Singleton pattern sparingly and only for genuinely shared resources (e.g. database connection, logger). Never use Singleton for business logic.",
          },
          {
            id: "composition-over-inheritance",
            label: "Composition over inheritance",
            prompt:
              "Prefer composing small, focused pieces over deep inheritance hierarchies. Build complex behavior by combining simple functions or components.",
          },
          {
            id: "feature-flags",
            label: "Feature Flags",
            tooltip: "Toggle functionality without deploys",
            prompt:
              "Use feature flags to toggle new functionality without a deploy. Flag checks must be at the entry point of a feature, not scattered throughout the code.",
          },
          {
            id: "optimistic-ui",
            label: "Optimistic UI Updates",
            tooltip: "Update UI before server confirms",
            prompt:
              "For mutations, update the UI optimistically before the server responds. Always implement a rollback in case the server returns an error.",
          },
          {
            id: "error-boundaries",
            label: "Error Boundaries",
            tooltip: "Catch render errors gracefully (React)",
            prompt:
              "Wrap major UI sections in React Error Boundaries. Provide meaningful fallback UIs. Never let a single component crash the entire page.",
          },
        ],
      },
    ],
  },

  // ── 9. ANTI-PATTERNS ───────────────────────────────────────────────────────
  {
    id: "anti-patterns",
    label: "Anti-patterns",
    description: "Patterns the agent must actively avoid.",
    icon: "ShieldOff",
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
              "Do not create god objects or god modules — classes or files that handle too many unrelated responsibilities. Split them by single responsibility.",
          },
          {
            id: "no-prop-drilling",
            label: "Prop drilling",
            tooltip: "Passing props 3+ levels deep",
            prompt:
              "Do not pass props more than 2 levels deep. Use React Context, a state management library, or component composition instead.",
          },
          {
            id: "no-logic-in-ui",
            label: "Business logic in UI components",
            prompt:
              "Never put business logic directly in UI components. Extract it into services, hooks, or utility functions.",
          },
          {
            id: "no-db-in-controllers",
            label: "Direct DB calls in controllers",
            tooltip: "Always go through a service/repository",
            prompt:
              "Controllers must never call the database directly. All data access must go through a service or repository.",
          },
          {
            id: "no-magic-numbers",
            label: "Magic numbers and strings",
            tooltip: "Use named constants instead",
            prompt:
              "Never use unexplained numeric or string literals in logic. Extract them into named constants with clear intent: `const MAX_RETRIES = 3` instead of `if (count > 3)`.",
          },
          {
            id: "no-silent-errors",
            label: "Silent error swallowing",
            tooltip: "Never catch {} without handling",
            prompt:
              "Never swallow errors silently. Every `catch` block must either handle the error, log it, or re-throw it. An empty `catch {}` is never acceptable.",
          },
          {
            id: "no-premature-optimization",
            label: "Premature optimization",
            prompt:
              "Do not optimize code before profiling confirms a bottleneck. Write clear, correct code first. Optimize only when evidence demands it.",
          },
          {
            id: "no-deep-nesting",
            label: "Deep nesting",
            tooltip: "Max 3 levels of indentation",
            prompt:
              "Keep code to a maximum of 3 levels of indentation. Use early returns, guard clauses, and extracted functions to flatten deeply nested logic.",
          },
          {
            id: "no-mutable-global-state",
            label: "Mutable global state",
            prompt:
              "Do not use mutable global variables. Pass state explicitly or use a controlled state management solution.",
          },
          {
            id: "no-circular-deps",
            label: "Circular dependencies",
            tooltip: "Module A imports B imports A",
            prompt:
              "Circular module dependencies are not allowed. If Module A imports Module B, then Module B must not import Module A. Resolve cycles by extracting shared code to a third module.",
          },
          {
            id: "no-any-typescript",
            label: "`any` type in TypeScript",
            tooltip: "Defeats the purpose of TypeScript",
            prompt:
              "Never use the `any` type. Use `unknown` for truly unknown types and narrow them explicitly. Use generics for reusable type-safe abstractions.",
          },
          {
            id: "no-monolithic-functions",
            label: "Monolithic functions",
            tooltip: "Functions over 50 lines need splitting",
            prompt:
              "Functions longer than 50 lines must be split into smaller, focused sub-functions. Each function should do one thing and do it well.",
          },
        ],
      },
    ],
  },

  // ── 10. WORKFLOWS ──────────────────────────────────────────────────────────
  {
    id: "workflows",
    label: "Workflows",
    description: "Development commands, branching strategy, PR process, and pre-commit checklist.",
    icon: "Terminal",
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
            prompt: "Install dependencies: `{value}`",
          },
          {
            id: "cmd-dev",
            label: "Dev server",
            placeholder: "pnpm dev",
            prompt: "Start the development server: `{value}`",
          },
          {
            id: "cmd-build",
            label: "Build",
            placeholder: "pnpm build",
            prompt: "Build for production: `{value}`",
          },
          {
            id: "cmd-test",
            label: "Test",
            placeholder: "pnpm test",
            prompt: "Run tests: `{value}`",
          },
          {
            id: "cmd-lint",
            label: "Lint",
            placeholder: "pnpm lint",
            prompt: "Run linter: `{value}`",
          },
          {
            id: "cmd-typecheck",
            label: "Type check",
            placeholder: "pnpm typecheck",
            prompt: "Run type check: `{value}`",
          },
          {
            id: "cmd-format",
            label: "Format",
            placeholder: "pnpm format",
            prompt: "Run formatter: `{value}`",
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
              "Use feature branches for all work. Branch from `main`, name branches `feature/description` or `fix/description`. All changes require a pull request before merging.",
          },
          {
            id: "trunk-based",
            label: "Trunk-based development",
            tooltip: "Short-lived branches, merge daily",
            prompt:
              "Use trunk-based development. Branches must be short-lived (under 2 days). Merge to `main` frequently. Use feature flags to ship incomplete features safely.",
          },
          {
            id: "gitflow",
            label: "Gitflow",
            tooltip: "Long-lived develop and release branches",
            prompt:
              "Use Gitflow: feature branches merge into `develop`, releases branch off `develop`, hotfixes branch off `main`. Follow the standard Gitflow lifecycle.",
          },
          {
            id: "direct-commits",
            label: "Direct commits to main",
            tooltip: "Solo projects only",
            prompt:
              "Commit directly to `main`. This is a solo project — branches and PRs are optional.",
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
              "All pull requests require at least one approval before merging. Do not merge your own PRs without review.",
          },
          {
            id: "squash-and-merge",
            label: "Squash and merge",
            prompt:
              "Use squash-and-merge for all PRs to keep the main branch history clean. One PR = one commit.",
          },
          {
            id: "rebase-and-merge",
            label: "Rebase and merge",
            prompt:
              "Use rebase-and-merge to preserve individual commit history while keeping a linear main branch.",
          },
          {
            id: "no-force-push",
            label: "No force push to main",
            tooltip: "Protected branch",
            prompt: "Never force push to `main`. The main branch is protected.",
          },
          {
            id: "link-issue-in-pr",
            label: "Link issue in PR description",
            prompt:
              "Every PR description must reference the related issue with `Closes #123` or `Fixes #123`.",
          },
          {
            id: "draft-prs-for-wip",
            label: "Draft PRs for WIP",
            tooltip: "Use draft status, not WIP prefix",
            prompt:
              "Use GitHub Draft PRs for work-in-progress. Do not add `WIP:` prefixes to PR titles.",
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
            prompt: "All tests must pass locally before pushing. Do not push broken tests.",
          },
          {
            id: "qa-run-lint",
            label: "Run lint",
            prompt:
              "Run the linter and resolve all errors before committing. Warnings should be addressed when possible.",
          },
          {
            id: "qa-run-typecheck",
            label: "Run type check",
            prompt:
              "Run the TypeScript type checker. Zero type errors are required before committing.",
          },
          {
            id: "qa-run-formatter",
            label: "Run formatter",
            prompt:
              "Run the code formatter before committing. Unformatted code must not be merged.",
          },
          {
            id: "qa-self-review",
            label: "Self-review the diff",
            prompt:
              "Read your own diff before pushing. Check for typos, accidental changes, and logic errors.",
          },
          {
            id: "qa-no-debug-code",
            label: "No debug code",
            tooltip: "Remove console.log, debugger, leftover TODOs",
            prompt:
              "Remove all `console.log`, `debugger`, and temporary `TODO` comments before committing to a shared branch.",
          },
          {
            id: "qa-update-tests",
            label: "Update tests for changed code",
            prompt:
              "Any changed behavior must be covered by updated or new tests. Do not leave tests that no longer reflect the code.",
          },
        ],
      },
    ],
  },

  // ── 11. TESTING ────────────────────────────────────────────────────────────
  {
    id: "testing",
    label: "Testing",
    description: "Testing requirements, frameworks, file organization, and coverage rules.",
    icon: "CheckCircle",
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
              "Every non-trivial function and module must have unit tests. Untested code must not be merged to main.",
          },
          {
            id: "integration-tests",
            label: "Integration tests",
            tooltip: "Test boundaries between modules",
            prompt:
              "Write integration tests for boundaries between modules — service ↔ repository, API ↔ service. These tests use real dependencies or realistic stubs.",
          },
          {
            id: "e2e-playwright",
            label: "E2E tests (Playwright)",
            tooltip: "Test critical user flows",
            prompt:
              "Use Playwright for end-to-end tests. Cover all critical user flows (e.g. login, checkout, key feature paths). E2E tests run in CI on every PR.",
          },
          {
            id: "e2e-cypress",
            label: "E2E tests (Cypress)",
            tooltip: "Alternative E2E framework",
            prompt:
              "Use Cypress for end-to-end tests. Cover all critical user flows. Tests run in CI on every PR.",
          },
          {
            id: "tdd",
            label: "TDD — tests first",
            tooltip: "Write tests before implementation",
            prompt:
              "Follow Test-Driven Development: write a failing test first, implement the minimum code to make it pass, then refactor. Never write production code without a failing test to motivate it.",
          },
          {
            id: "colocate-tests",
            label: "Colocate tests with source",
            tooltip: "Component.test.tsx next to Component.tsx",
            prompt:
              "Place test files next to the source files they test: `Button.test.tsx` lives in the same folder as `Button.tsx`.",
          },
          {
            id: "separate-tests-dir",
            label: "Separate `/tests` directory",
            prompt:
              "All test files live under a top-level `/tests` directory, mirroring the source structure.",
          },
          {
            id: "coverage-threshold",
            label: "Minimum coverage threshold",
            tooltip: "Fail CI below a defined percentage",
            prompt:
              "CI must fail if test coverage drops below the configured threshold. Configure the threshold in the test runner config (e.g. `coverage.threshold` in Vitest).",
          },
          {
            id: "mock-external-services",
            label: "Mock external services",
            tooltip: "Never hit real APIs in unit tests",
            prompt:
              "Unit and integration tests must never make real network requests. Mock all external services (APIs, email providers, payment gateways) using the test framework's mocking utilities.",
          },
          {
            id: "no-snapshot-tests",
            label: "No snapshot tests",
            tooltip: "Fragile, avoid unless necessary",
            prompt:
              "Do not use snapshot tests. They are fragile and often updated without review. Test behavior and output explicitly instead.",
          },
        ],
      },
    ],
  },
]
