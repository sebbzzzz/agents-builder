## ADDED Requirements

### Requirement: Deployment category appears in the sidebar
The system SHALL include a "Deployment" category in `CATEGORIES` with `id: "deployment"` and icon `Rocket`, containing sub-categories for deployment environments (`type: "multi"`) and CI/CD pipeline rules (`type: "multi"`).

#### Scenario: Category is visible in the sidebar
- **WHEN** the app loads
- **THEN** "Deployment" appears as a selectable entry in the category list

#### Scenario: Environments and CI sub-categories render
- **WHEN** the user opens the Deployment panel
- **THEN** at least two sub-category sections are visible: one for environments and one for CI/CD pipeline rules

### Requirement: Deployment environment options describe the release path
Deployment environment options SHALL produce output that tells the AI agent what environments exist and how code moves between them, so it doesn't inadvertently suggest changes that bypass the release process.

#### Scenario: Staging + production environment option injects environment description
- **WHEN** the user selects the "Staging → Production" option and clicks "Add to document"
- **THEN** the injected content describes that staging is the pre-production environment and production deploys only from the main branch via CI

#### Scenario: Preview deployments option describes branch-based previews
- **WHEN** the user selects the "Preview deployments (per PR)" option and clicks "Add to document"
- **THEN** the injected content describes that each pull request gets an automatic preview URL

### Requirement: CI/CD pipeline options produce rules about what agents must not touch
CI/CD options SHALL produce output with explicit rules about pipeline files and production deployment constraints.

#### Scenario: "Never deploy manually" option injects a hard rule
- **WHEN** the user selects the "Never deploy manually to production" option and clicks "Add to document"
- **THEN** the injected content contains a clear prohibition on manual production deployments and states that deployments happen exclusively through the CI pipeline

#### Scenario: "Do not modify CI config without review" option injects an ask-first rule
- **WHEN** the user selects "Do not modify CI config without review" and clicks "Add to document"
- **THEN** the injected content instructs the agent to ask before editing any CI configuration files (`.github/workflows/`, `Dockerfile`, `vercel.json`, etc.)
