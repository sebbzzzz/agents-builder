## MODIFIED Requirements

### Requirement: Minimal app shell renders
The system SHALL render the full two-column app shell at `http://localhost:3000`, replacing the previous minimal placeholder. `app/page.tsx` SHALL import and render the `AppShell` component from `components/layout/AppShell.tsx` with no additional logic.

#### Scenario: Home page renders the app shell
- **WHEN** developer navigates to `http://localhost:3000`
- **THEN** the two-column layout renders with the category panel on the left and the preview panel on the right, with no console errors

#### Scenario: app/page.tsx contains no business logic
- **WHEN** `app/page.tsx` is inspected
- **THEN** it contains only the import and render of `AppShell`; no state, no data fetching, no conditional rendering
