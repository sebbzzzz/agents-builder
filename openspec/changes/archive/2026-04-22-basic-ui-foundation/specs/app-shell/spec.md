## ADDED Requirements

### Requirement: App fills the full viewport with no page scroll
The system SHALL render the app shell at exactly 100dvh height with `overflow: hidden` on the root, so the page itself never scrolls regardless of panel content length.

#### Scenario: No scrollbar appears on the page body
- **WHEN** the user loads the app with any amount of content in either panel
- **THEN** no vertical scrollbar appears on the page body or `<html>` element

#### Scenario: Page does not scroll with keyboard
- **WHEN** the user presses Page Down or End on the keyboard while focused on the page body
- **THEN** the page does not scroll; only the focused panel scrolls if it has overflow

### Requirement: Two-column layout with fixed proportions
The system SHALL render a left column at 30% width and a right column at 70% width, side by side, filling the full viewport height.

#### Scenario: Columns render side by side
- **WHEN** the app is viewed at 1280px or wider viewport
- **THEN** the left panel occupies 30% of the viewport width and the right panel occupies 70%

#### Scenario: Each column scrolls independently
- **WHEN** the user scrolls inside the left column
- **THEN** the right column does not scroll, and vice versa

### Requirement: Column headers are sticky within their column
The system SHALL render a fixed header bar at the top of each column that remains visible when the column content is scrolled.

#### Scenario: Left column header stays visible on scroll
- **WHEN** the user scrolls down in the category list
- **THEN** the left column header (app name/logo area) remains pinned at the top of the left column

#### Scenario: Right column header stays visible on scroll
- **WHEN** the user scrolls down in the preview content
- **THEN** the right column header (view toggle, Copy, Export buttons) remains pinned at the top of the right column
