## Context

The project has a complete spec (SPECS.md) and conventions (AGENTS.md) but zero code. This design covers bootstrapping a Next.js 15 + TypeScript + Tailwind 4 application from scratch, including dependency installation, tooling configuration, folder structure, and skills installation.

There is no existing codebase to migrate. All decisions are greenfield.

## Goals / Non-Goals

**Goals:**
- Working `yarn dev` server with the correct tech stack (Next.js 15, React 19, Tailwind 4)
- Folder structure matching AGENTS.md (`app/`, `components/common/`, `hooks/`, `lib/`, `types/`, `data/`, `styles/`)
- All AGENTS.md yarn scripts operational (`lint`, `lint:fix`, `format`, `format:write`, `typecheck`, `build`)
- Prettier + ESLint configured per AGENTS.md formatting rules
- Path aliases (`@/`) working in both TypeScript and Next.js
- All skills listed in AGENTS.md installed under `.claude/skills/`
- Minimal `app/page.tsx` shell to confirm the app renders

**Non-Goals:**
- Any product UI or features (categories, preview panel, etc.)
- Tests or CI configuration (out of scope per AGENTS.md)
- Deployment setup (Vercel config) — can be done later
- Custom domain setup

## Decisions

### Use `create-next-app` as bootstrap baseline
`create-next-app` generates a valid Next.js 15 + App Router + TypeScript + Tailwind project in one command. We strip its boilerplate (default styles, sample components) and reshape the folder structure to match AGENTS.md conventions.

**Alternative considered:** Manual file creation. Rejected — `create-next-app` handles dependency resolution and ensures compatible versions.

### Tailwind 4 via CSS import (not `tailwind.config.js`)
Tailwind 4 uses a CSS-first config model. Configuration goes in `styles/globals.css` via `@import "tailwindcss"` and `@theme`. No `tailwind.config.ts` file is needed.

**Alternative considered:** Keep `tailwind.config.ts`. Rejected — it's the Tailwind 3 approach; Tailwind 4 deprecates it.

### Yarn as package manager
AGENTS.md defines all scripts as `yarn` commands. Use yarn consistently; do not mix with npm or pnpm.

### ESLint flat config (`eslint.config.mjs`)
Next.js 15 ships with ESLint 9 which uses flat config by default. Use `@eslint/eslintrc` compatibility layer to integrate `eslint-config-prettier`.

### Skills installed via `npx skills add`
Each skill listed in AGENTS.md is installed with `npx skills add <owner>/<repo>/<skill>`. Skills land in `.claude/skills/`.

## Risks / Trade-offs

- **Tailwind 4 is new** — fewer community examples, some plugins (e.g., `prettier-plugin-tailwindcss`) may need a recent version. → Pin `prettier-plugin-tailwindcss@^0.6` which supports Tailwind 4.
- **`create-next-app` boilerplate** — generates files we don't need (`public/` SVGs, `app/globals.css` defaults). → Delete or replace immediately after generation.
- **Skills CLI availability** — `npx skills add` requires the `skills` npm package to be available. → Document the install step; skills install is a one-time dev setup.

## Migration Plan

1. Run `npx create-next-app@latest` with flags: `--typescript --tailwind --app --no-src-dir --import-alias "@/*"`
2. Strip boilerplate and reshape folders to match AGENTS.md structure
3. Install additional dev dependencies: `prettier`, `eslint-config-prettier`, `prettier-plugin-tailwindcss`
4. Write `.prettierrc`, update `eslint.config.mjs`
5. Add yarn scripts to `package.json`
6. Install skills via `npx skills add` for each skill in AGENTS.md
7. Verify: `yarn dev`, `yarn typecheck`, `yarn lint`, `yarn format`

No rollback needed — greenfield setup.

## Open Questions

- None. All decisions are covered by AGENTS.md and SPECS.md.
