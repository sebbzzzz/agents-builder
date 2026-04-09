## Why

The project repository exists with specs and conventions defined but has no working codebase yet. We need to bootstrap the Next.js application with all dependencies, tooling, and configuration so development can begin.

## What Changes

- Initialize a Next.js 15 project with TypeScript, Tailwind CSS 4, and App Router
- Install and configure Prettier + ESLint (with `prettier-plugin-tailwindcss`)
- Set up path aliases (`@/`) in `tsconfig.json`
- Install Claude Code skills required by AGENTS.md (`find-skills`, `vercel-react-best-practices`, `tailwind-4-docs`, `typescript-advanced-types`, `openspec-propose`, `openspec-apply-change`, `openspec-explore`, `openspec-archive-change`)
- Configure `yarn` scripts matching the workflow commands in AGENTS.md
- Create the folder structure: `app/`, `components/common/`, `hooks/`, `lib/`, `types/`, `data/`, `styles/`
- Add a minimal `app/page.tsx` shell (two-column layout placeholder)

## Capabilities

### New Capabilities

- `project-scaffold`: Initialize the Next.js 15 + TypeScript + Tailwind 4 project with correct folder structure, path aliases, and a working dev server
- `tooling-config`: Configure Prettier, ESLint, and `yarn` scripts to match the conventions and workflows defined in AGENTS.md
- `skills-install`: Install all Claude Code skills listed in AGENTS.md so they are available in the project

### Modified Capabilities

<!-- None — this is a greenfield setup, no existing specs to modify -->

## Impact

- Creates the entire project codebase from scratch
- No existing code affected (none exists yet)
- Establishes the foundation all future features build on
- Skills installation affects `.claude/skills/` directory
