## MODIFIED Requirements

### Requirement: App is branded as "groundwork" everywhere
The system SHALL display "groundwork" (lowercase) as the product name in all user-visible surfaces: the browser tab, meta description, og: tags, the header wordmark, the editor welcome content, and the footer credit. The browser `<title>` SHALL pair the brand with a keyword subtitle (e.g. `groundwork — Build your AGENTS.md`) so the tool is discoverable by search, while still leading with the brand name.

#### Scenario: Browser tab shows the brand with subtitle
- **WHEN** the user opens the app
- **THEN** the browser tab reads "groundwork" followed by a keyword subtitle describing the tool

#### Scenario: og:title reflects the rebrand
- **WHEN** a link to the app is shared
- **THEN** the og:title leads with "groundwork" and the og:description describes the tool accurately

#### Scenario: Editor welcome content uses the brand name
- **WHEN** the editor renders its default welcome content
- **THEN** the heading and copy refer to the product as "groundwork", not "AGENTS.md Builder"

#### Scenario: Footer credit is consistent with the brand
- **WHEN** the user reads the footer credit
- **THEN** the product is referred to consistently with the "groundwork" brand
