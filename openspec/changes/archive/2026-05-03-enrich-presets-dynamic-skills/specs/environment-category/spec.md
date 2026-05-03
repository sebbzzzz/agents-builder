## ADDED Requirements

### Requirement: Environment category appears in the sidebar
The system SHALL include an "Environment" category in `CATEGORIES` with `id: "environment"` and icon `Settings2`, containing a prerequisites sub-category of `type: "input"` and a setup steps sub-category of `type: "multi"`.

#### Scenario: Category is visible in the sidebar
- **WHEN** the app loads
- **THEN** "Environment" appears as a selectable entry in the category list

#### Scenario: Prerequisites and setup sub-categories render
- **WHEN** the user opens the Environment panel
- **THEN** two sub-category sections are visible: "Prerequisites" with text input fields and "Setup" with checkboxes

### Requirement: Prerequisites inputs produce formatted prerequisite lines
The prerequisites sub-category SHALL include input fields for Node version, package manager, and other tools. Each non-empty field SHALL inject a formatted line with the tool name and version in inline code.

#### Scenario: Node version input injects formatted line
- **WHEN** the user types "22.x" in the Node version field and clicks "Add to document"
- **THEN** the injected content includes `**Node.js:** \`22.x\``

#### Scenario: Empty prerequisite fields are skipped
- **WHEN** the user leaves the Node version field blank and fills only the package manager field
- **THEN** only the package manager line is injected

### Requirement: Setup step options produce actionable instructions
Each option in the setup steps sub-category SHALL have a prompt that gives the agent a clear, actionable instruction.

#### Scenario: Copy env option injects setup instruction
- **WHEN** the user selects "Copy .env.example to .env.local" and clicks "Add to document"
- **THEN** the injected content instructs the agent to copy `.env.example` to `.env.local` and fill in required values before running any commands
