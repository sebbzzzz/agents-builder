## ADDED Requirements

### Requirement: Security category appears in the sidebar
The system SHALL include a "Security" category in `CATEGORIES` with `id: "security"` and icon `Lock`, containing sub-categories for secrets hygiene and input validation, both of `type: "multi"`.

#### Scenario: Category is visible in the sidebar
- **WHEN** the app loads
- **THEN** "Security" appears as a selectable entry in the category list

#### Scenario: Secrets and input validation sub-categories render
- **WHEN** the user opens the Security panel
- **THEN** two sub-category sections are visible: one for secrets handling and one for input validation

### Requirement: Security options produce structured markdown output
Security option prompts SHALL use bold headers, bullet lists, and inline code to produce output that clearly communicates rules to AI agents.

#### Scenario: Secrets hygiene option produces structured rules block
- **WHEN** the user selects the "Load secrets from environment only" option and clicks "Add to document"
- **THEN** the injected content includes a **Secrets:** header, bullets listing where to store secrets, and inline code examples (e.g. `process.env.VAR_NAME`)

#### Scenario: Input validation option produces parameterization rule
- **WHEN** the user selects "Parameterize all SQL queries" and clicks "Add to document"
- **THEN** the injected content explicitly states that string-interpolated SQL is a critical vulnerability and must not be used
