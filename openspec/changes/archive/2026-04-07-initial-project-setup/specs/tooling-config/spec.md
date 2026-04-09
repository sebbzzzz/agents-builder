## ADDED Requirements

### Requirement: Prettier configured per AGENTS.md formatting rules
The project SHALL have a `.prettierrc` file that enforces: 2-space indentation, double quotes, no semicolons, 100-character max line length, trailing commas in multi-line expressions, and Tailwind class sorting via `prettier-plugin-tailwindcss`.

#### Scenario: Format check passes on conforming code
- **WHEN** developer runs `yarn format` on correctly formatted code
- **THEN** Prettier exits with code 0 (no formatting issues found)

#### Scenario: Format write fixes violations
- **WHEN** developer runs `yarn format:write` on code with formatting violations
- **THEN** Prettier rewrites the files to match the configured rules

#### Scenario: Tailwind classes are sorted
- **WHEN** developer runs `yarn format:write` on a file with unsorted Tailwind classes
- **THEN** classes are reordered to match the Tailwind CSS property order

### Requirement: ESLint configured with Next.js and Prettier rules
The project SHALL have ESLint configured using Next.js core web vitals rules plus `eslint-config-prettier` so that ESLint does not conflict with Prettier formatting decisions.

#### Scenario: Lint passes on clean code
- **WHEN** developer runs `yarn lint` on code with no violations
- **THEN** ESLint exits with code 0

#### Scenario: Lint fix resolves auto-fixable violations
- **WHEN** developer runs `yarn lint:fix` on code with auto-fixable ESLint violations
- **THEN** violations are resolved and the file is saved

### Requirement: yarn scripts match AGENTS.md workflow commands
The `package.json` SHALL define all scripts specified in AGENTS.md: `dev`, `build`, `lint`, `lint:fix`, `format`, `format:write`, `typecheck`.

#### Scenario: All scripts are defined
- **WHEN** developer runs `yarn <script>` for any script in AGENTS.md
- **THEN** the command executes without "command not found" or "missing script" errors

#### Scenario: typecheck runs tsc
- **WHEN** developer runs `yarn typecheck`
- **THEN** TypeScript compiler checks all project files and reports type errors without emitting output files
