# brand-identity Specification

## Purpose
TBD - created by archiving change groundwork-design-system. Update Purpose after archive.
## Requirements
### Requirement: App is branded as "groundwork" everywhere
The system SHALL display "groundwork" (lowercase) as the product name in all user-visible surfaces: page title, browser tab, meta description, og: tags, and the header wordmark.

#### Scenario: Browser tab shows the new name
- **WHEN** the user opens the app
- **THEN** the browser tab reads "groundwork"

#### Scenario: og:title reflects the rebrand
- **WHEN** a link to the app is shared
- **THEN** the og:title is "groundwork" and the og:description describes the tool accurately

### Requirement: Header renders the logo mark paired with the wordmark
The system SHALL render a 14×14px SVG logo mark (orange-stroked square with a faint inner square) immediately to the left of the "groundwork" wordmark with an 8px gap, inside the existing `CategoryHeader` component.

#### Scenario: Logo mark is visible in the header
- **WHEN** the app loads
- **THEN** the header shows the SVG mark to the left of "groundwork"

#### Scenario: Logo mark uses the accent color for its stroke
- **WHEN** the design tokens are applied
- **THEN** the outer square stroke matches `--accent` and the inner fill is `rgb(255 120 29 / 0.14)`

### Requirement: Favicon uses the logo mark
The system SHALL serve the logo mark as the browser favicon via Next.js's `app/icon.tsx` or a static file so the tab icon matches the header mark.

#### Scenario: Favicon matches the logo mark
- **WHEN** the user views the browser tab
- **THEN** the favicon is the square mark (orange stroke, transparent/dark background)

