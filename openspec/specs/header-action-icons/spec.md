# header-action-icons Specification

## Purpose
The right-side header actions — Help and Contact icon buttons that replace the author attribution text, including their icons, accessible labels, and click behavior.

## Requirements
### Requirement: Header right side shows Help and Contact icon actions
The header SHALL render two icon buttons on its right side — Help and Contact — in place of the previous "By: seb.bz" attribution text. The icons SHALL come from `lucide-react`.

#### Scenario: Icons replace the attribution text
- **WHEN** the app header renders
- **THEN** the right side SHALL show a Help icon button (a question-mark/`HelpCircle` icon) and a Contact icon button (a `Mail` icon)
- **AND** the "By: seb.bz" text link SHALL no longer be present

#### Scenario: Icon buttons are accessible
- **WHEN** the Help and Contact icon buttons render
- **THEN** each SHALL expose an accessible name (e.g. `aria-label` "Help" and "Contact") so the icon-only buttons are usable by assistive tech

### Requirement: Help icon opens the About modal
The Help icon button SHALL open the About modal when activated.

#### Scenario: Clicking Help opens the modal
- **WHEN** the user clicks the Help icon button
- **THEN** the About modal opens

### Requirement: Contact icon opens the author portfolio
The Contact icon button SHALL open `https://seb.bz/` in a new browser tab.

#### Scenario: Clicking Contact opens the portfolio
- **WHEN** the user clicks the Contact icon button
- **THEN** the browser opens `https://seb.bz/` in a new tab with `rel="noopener noreferrer"`
