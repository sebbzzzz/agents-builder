## ADDED Requirements

### Requirement: All AGENTS.md skills are installed
The project SHALL have all eight skills listed in AGENTS.md installed under `.claude/skills/` via `npx skills add`: `find-skills`, `vercel-react-best-practices`, `tailwind-4-docs`, `typescript-advanced-types`, `openspec-propose`, `openspec-apply-change`, `openspec-explore`, `openspec-archive-change`.

#### Scenario: Skills directory contains all required skills
- **WHEN** the skills install step completes
- **THEN** `.claude/skills/` contains a subdirectory for each of the eight skills listed in AGENTS.md

#### Scenario: Skills are invocable in Claude Code
- **WHEN** a developer opens Claude Code in this project
- **THEN** all eight skills are available for use (visible in `/skills` or triggerable by name)

### Requirement: Skills auto-invoke rules are documented in AGENTS.md
AGENTS.md SHALL contain an Auto-invoke Skills table that maps each recurring action to its corresponding skill, matching the entries defined in the file.

#### Scenario: Auto-invoke table is complete
- **WHEN** AGENTS.md is read
- **THEN** it contains an auto-invoke rule for each of the eight installed skills, specifying the action that triggers it
