## 1. Bootstrap Next.js Project

- [x] 1.1 Run `npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"` in the project root
- [x] 1.2 Delete `create-next-app` boilerplate: sample SVGs in `public/`, default content in `app/page.tsx`, and default styles in `app/globals.css`
- [x] 1.3 Verify `yarn dev` starts without errors and the home page renders at `http://localhost:3000`

## 2. Reshape Folder Structure

- [x] 2.1 Create `components/common/` directory (for reusable primitives)
- [x] 2.2 Create `hooks/`, `lib/`, `types/`, `data/` directories at the project root
- [x] 2.3 Move global styles to `styles/globals.css` and update the import in `app/layout.tsx`
- [x] 2.4 Add a `.gitkeep` to each empty directory so they are tracked by git

## 3. Configure Tailwind 4

- [x] 3.1 Confirm `styles/globals.css` uses `@import "tailwindcss"` (Tailwind 4 CSS-first config — no `tailwind.config.ts` needed)
- [x] 3.2 Verify Tailwind utility classes work in `app/page.tsx` after running `yarn dev`

## 4. Configure Prettier

- [x] 4.1 Install dev dependencies: `prettier`, `prettier-plugin-tailwindcss`
- [x] 4.2 Create `.prettierrc` with: `printWidth: 100`, `tabWidth: 2`, `useTabs: false`, `singleQuote: false`, `semi: false`, `trailingComma: "all"`, `plugins: ["prettier-plugin-tailwindcss"]`
- [x] 4.3 Create `.prettierignore` excluding `.next/`, `node_modules/`, and `openspec/`
- [x] 4.4 Run `yarn format:write` and confirm it runs without errors

## 5. Configure ESLint

- [x] 5.1 Install dev dependency: `eslint-config-prettier`
- [x] 5.2 Update `eslint.config.mjs` to extend Next.js core web vitals config and add `eslint-config-prettier` last to disable formatting rules
- [x] 5.3 Run `yarn lint` and confirm it passes with no errors

## 6. Configure yarn Scripts

- [x] 6.1 Add `"lint:fix": "eslint . --fix"` to `package.json` scripts
- [x] 6.2 Add `"format": "prettier --check ."` to `package.json` scripts
- [x] 6.3 Add `"format:write": "prettier --write ."` to `package.json` scripts
- [x] 6.4 Add `"typecheck": "tsc --noEmit"` to `package.json` scripts
- [x] 6.5 Verify all seven scripts run without errors: `dev`, `build`, `lint`, `lint:fix`, `format`, `format:write`, `typecheck`

## 7. Verify Path Aliases

- [x] 7.1 Confirm `tsconfig.json` contains `"paths": { "@/*": ["./*"] }`
- [x] 7.2 Add a trivial utility `lib/utils.ts` that exports `cn` (using `clsx` or template literals) and import it with `@/lib/utils` in `app/page.tsx`
- [x] 7.3 Run `yarn typecheck` — confirm no import resolution errors

## 8. Install Claude Code Skills

- [x] 8.1 Install `find-skills`: `npx skills add vercel-labs/skills@find-skills`
- [x] 8.2 Install `vercel-react-best-practices`: `npx skills add vercel-labs/agent-skills/skills/react-best-practices`
- [x] 8.3 Install `tailwind-4-docs`: `npx skills add lombiq/tailwind-agent-skills@tailwind-4-docs`
- [x] 8.4 Install `typescript-advanced-types`: `npx skills add wshobson/agents@typescript-advanced-types`
- [x] 8.5 Install `openspec-propose`: already installed
- [x] 8.6 Install `openspec-apply-change`: already installed
- [x] 8.7 Install `openspec-explore`: already installed
- [x] 8.8 Install `openspec-archive-change`: already installed
- [x] 8.9 Verify `.claude/skills/` contains a folder for each of the eight installed skills

## 9. Final QA

- [x] 9.1 Run `yarn typecheck` — zero errors
- [x] 9.2 Run `yarn lint` — zero errors
- [x] 9.3 Run `yarn format` — zero formatting violations
- [x] 9.4 Run `yarn build` — production build succeeds
- [x] 9.5 Confirm folder structure matches AGENTS.md: `app/`, `components/common/`, `hooks/`, `lib/`, `types/`, `data/`, `styles/`
