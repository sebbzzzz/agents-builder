# usage-analytics Specification

## Purpose
TBD - created by syncing change launch-readiness. Update Purpose after archive.

## Requirements
### Requirement: Pageviews are tracked with acquisition source
The system SHALL record a pageview for every visit and capture the visit's acquisition source, including UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`) and referrer, using Vercel Web Analytics. The integration SHALL be cookieless and require no consent banner.

#### Scenario: A visit is counted
- **WHEN** a user loads any route of the app in production
- **THEN** a pageview is recorded in Vercel Web Analytics

#### Scenario: UTM-tagged visit is attributed to its source
- **WHEN** a user arrives via a link carrying `?utm_source=producthunt`
- **THEN** the pageview is attributed to the `producthunt` source and is distinguishable from organic or social traffic

#### Scenario: No consent banner is shown
- **WHEN** a user loads the app
- **THEN** no cookie-consent UI is displayed and no tracking cookies are set

### Requirement: Key in-app actions emit custom events
The system SHALL emit a named custom analytics event when the user performs a launch-relevant action, so usage (not just traffic) can be measured. The tracked actions SHALL be: copying the AGENTS.md document, exporting the AGENTS.md document, and adding an option to the document.

#### Scenario: Export emits an event
- **WHEN** the user exports the generated AGENTS.md file
- **THEN** an `export_document` event is sent to analytics

#### Scenario: Copy emits an event
- **WHEN** the user copies the generated AGENTS.md content
- **THEN** a `copy_document` event is sent to analytics

#### Scenario: Adding an option emits an event
- **WHEN** the user adds a selected option to the document via "Add to document"
- **THEN** an `add_to_document` event is sent to analytics

### Requirement: Analytics runs only in production
The system SHALL NOT send analytics events to the production dataset during local development, so development activity does not pollute launch metrics.

#### Scenario: Local development is not counted
- **WHEN** the app runs via `yarn dev` on localhost
- **THEN** no production pageviews or events are recorded
