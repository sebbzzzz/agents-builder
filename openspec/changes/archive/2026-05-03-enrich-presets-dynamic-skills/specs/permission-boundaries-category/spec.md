## ADDED Requirements

### Requirement: Permission Boundaries category appears in the sidebar
The system SHALL include a "Permission Boundaries" category in `CATEGORIES` with `id: "permission-boundaries"` and icon `ShieldCheck`, containing three sub-categories: "Always Allowed" (`type: "multi"`), "Ask First" (`type: "multi"`), and "Never" (`type: "multi"`).

#### Scenario: Category is visible in the sidebar
- **WHEN** the app loads
- **THEN** "Permission Boundaries" appears as a selectable entry in the category list

#### Scenario: All three sub-categories render when panel opens
- **WHEN** the user opens the Permission Boundaries panel
- **THEN** three sub-category sections are visible: "✅ Always Allowed", "⚠️ Ask First", and "🚫 Never"

### Requirement: Permission options produce tiered output with emoji prefixes
Each option in the Permission Boundaries category SHALL have a `prompt` that starts with the corresponding tier prefix: `✅ **Always:**`, `⚠️ **Ask first:**`, or `🚫 **Never:**`.

#### Scenario: Always Allowed option injects ✅-prefixed line
- **WHEN** the user selects "Create new files" and clicks "Add to document"
- **THEN** the injected content starts with `✅ **Always:**`

#### Scenario: Ask First option injects ⚠️-prefixed line
- **WHEN** the user selects "Modify database schema" and clicks "Add to document"
- **THEN** the injected content starts with `⚠️ **Ask first:**`

#### Scenario: Never option injects 🚫-prefixed line
- **WHEN** the user selects "Commit secrets or .env files" and clicks "Add to document"
- **THEN** the injected content starts with `🚫 **Never:**`

#### Scenario: Mixed tier selections produce correctly prefixed output
- **WHEN** the user selects one option from each tier and clicks "Add to document"
- **THEN** the `## Permission Boundaries` section contains three lines, each with the correct tier prefix
