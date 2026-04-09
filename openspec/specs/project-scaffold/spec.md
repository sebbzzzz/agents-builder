# Spec: project-scaffold

## Purpose

Defines the foundational Next.js project structure, including framework setup, folder layout, path aliases, and a minimal working app shell.

## Requirements

### Requirement: Next.js project initialized
The system SHALL have a working Next.js 15 (App Router) project with TypeScript and Tailwind CSS 4 installed and configured, bootstrapped via `create-next-app`.

#### Scenario: Dev server starts
- **WHEN** developer runs `yarn dev`
- **THEN** a local development server starts without errors on port 3000

#### Scenario: Build succeeds
- **WHEN** developer runs `yarn build`
- **THEN** the project compiles to production output without TypeScript or build errors

### Requirement: Folder structure matches AGENTS.md
The repository SHALL contain the following top-level directories, each serving only its defined layer responsibility: `app/`, `components/common/`, `hooks/`, `lib/`, `types/`, `data/`, `styles/`.

#### Scenario: Required folders exist
- **WHEN** the project is cloned and dependencies are installed
- **THEN** all seven directories (`app/`, `components/common/`, `hooks/`, `lib/`, `types/`, `data/`, `styles/`) exist at the project root

#### Scenario: No business logic in app/
- **WHEN** any file inside `app/` is inspected
- **THEN** it contains only route handlers and page components that delegate to `components/`

### Requirement: Path alias @/ resolves to project root
The TypeScript compiler and Next.js bundler SHALL resolve `@/` imports to the project root so that `@/lib/utils` maps to `<root>/lib/utils.ts`.

#### Scenario: @/ alias works in TypeScript
- **WHEN** a file imports `import { cn } from "@/lib/utils"`
- **THEN** `yarn typecheck` passes without module-not-found errors

#### Scenario: @/ alias works at runtime
- **WHEN** the dev server or build processes a file with `@/` imports
- **THEN** the bundler resolves the path correctly and the page renders without import errors

### Requirement: Minimal app shell renders
The project SHALL include a minimal `app/page.tsx` that renders without errors, confirming the stack is wired up correctly.

#### Scenario: Home page renders
- **WHEN** developer navigates to `http://localhost:3000`
- **THEN** a page renders in the browser with no console errors
