## ADDED Requirements

### Requirement: Option prompts use structured markdown
All option `prompt` fields in `data/categories.ts` SHALL use structured markdown: bullet lists for rule sets, inline code for filenames and commands, **bold** for mandatory requirements, and code-fenced blocks where code examples or directory trees add clarity.

#### Scenario: Language option produces bullet-formatted output
- **WHEN** the user selects the TypeScript language option and clicks "Add to document"
- **THEN** the injected content includes a bullet list of rules (e.g. enable strict mode, avoid `any`, `.ts`/`.tsx` file extensions) rather than a single sentence

#### Scenario: Framework option produces bold header with bullet rules
- **WHEN** the user selects the Next.js framework option and clicks "Add to document"
- **THEN** the injected content starts with a `**Framework:** Next.js (App Router)` heading followed by a bullet list of rules

#### Scenario: Architecture codebase-structure option includes an annotated directory tree
- **WHEN** the user selects the "Feature-based" codebase structure option and clicks "Add to document"
- **THEN** the injected content includes a fenced code block containing an annotated directory tree showing the expected folder layout

### Requirement: Project Context includes project name and description input fields
`data/categories.ts` SHALL include a `project-info` sub-category of `type: "input"` inside the Project Context category, with options for project name and project description.

#### Scenario: Project name input injects a top-level heading
- **WHEN** the user types a project name in the "Name" field and clicks "Add to document"
- **THEN** the injected content is `# {name}` where `{name}` is the typed value

#### Scenario: Project description input injects plain text
- **WHEN** the user types a description and clicks "Add to document"
- **THEN** the typed text is injected as a plain paragraph under the Project Context section

#### Scenario: Empty input fields are skipped
- **WHEN** the user leaves an input field blank and clicks "Add to document"
- **THEN** no content is injected for that field

### Requirement: Pattern and Anti-pattern options include code block examples
Options in the Patterns and Anti-patterns categories SHALL include a fenced code block (with language tag) showing a concrete usage example, interface shape, or skeleton implementation — not just a prose description.

#### Scenario: Repository Pattern option includes a TypeScript interface example
- **WHEN** the user selects the Repository Pattern option and clicks "Add to document"
- **THEN** the injected content includes a fenced `typescript` code block showing the repository interface shape (e.g. `findById`, `save` method signatures)

#### Scenario: Anti-pattern option includes a before/after or "never do this" example
- **WHEN** the user selects an anti-pattern option (e.g. "any type in TypeScript") and clicks "Add to document"
- **THEN** the injected content includes an inline code or fenced block illustrating what to avoid and the preferred alternative

### Requirement: Workflows test commands distinguish fast feedback from full suite
The Workflows category SHALL include a `test-tiers` sub-category of `type: "multi"` that lets users describe the difference between fast per-file tests and the full CI suite, so agents know which command to use in each context.

#### Scenario: Fast-feedback option injects a per-file test command pattern
- **WHEN** the user selects the "Fast feedback — single file" option and clicks "Add to document"
- **THEN** the injected content describes a quick single-file test invocation and notes its expected runtime

#### Scenario: Full suite option injects a CI-equivalent test command
- **WHEN** the user selects the "Full suite (before PR)" option and clicks "Add to document"
- **THEN** the injected content describes the full test run and when to use it (pre-push, pre-merge)
