# route-structure Specification

## Purpose
TBD - created by archiving change onboarding-and-route-collapse. Update Purpose after archive.
## Requirements
### Requirement: Root route renders the builder
The system SHALL render the builder (category sidebar + editor/preview panel) at the `/` route. The splash page (Hero, GhostCode) SHALL NOT be rendered at any route.

#### Scenario: Navigating to `/`
- **WHEN** the user navigates to `/`
- **THEN** the builder UI is rendered (sidebar with categories, editor panel)

#### Scenario: Splash components are preserved but unused
- **WHEN** `app/_components/splash/Hero.tsx` and `app/_components/splash/GhostCode.tsx` exist in the codebase
- **THEN** they are not imported or rendered by any active route

---

### Requirement: `/agents-builder` redirects to `/`
The system SHALL redirect any request to `/agents-builder` to `/` to avoid broken links.

#### Scenario: Legacy route redirect
- **WHEN** the user navigates to `/agents-builder`
- **THEN** they are redirected to `/` via Next.js `redirect()`

