## ADDED Requirements

### Requirement: About modal describes the app
The About modal SHALL display a short description of what groundwork does so a user who opens Help understands the app's purpose.

#### Scenario: Modal shows description copy
- **WHEN** the About modal is open
- **THEN** it SHALL display a heading and a short description of the app

### Requirement: About modal offers Start onboarding and Contact actions
The About modal SHALL render two buttons at the bottom of its content: "Start onboarding" and "Contact".

#### Scenario: Start onboarding restarts the tour
- **WHEN** the user clicks "Start onboarding" in the About modal
- **THEN** the About modal closes
- **AND** the onboarding tour restarts from the first step regardless of whether it was completed before

#### Scenario: Contact opens the portfolio
- **WHEN** the user clicks "Contact" in the About modal
- **THEN** the browser opens `https://seb.bz/` in a new tab with `rel="noopener noreferrer"`

### Requirement: About modal can be dismissed
The About modal SHALL be dismissible without taking either footer action.

#### Scenario: Close via close control
- **WHEN** the user clicks the modal's close control
- **THEN** the modal closes and the underlying app state is unchanged

#### Scenario: Close via overlay or Escape
- **WHEN** the user clicks the backdrop overlay or presses Escape
- **THEN** the modal closes and the underlying app state is unchanged

### Requirement: Modal is built on a reusable primitive
The About modal SHALL be composed from a reusable modal primitive (under `common/components/Modal/`) so dialog behavior — overlay, focus containment, Escape-to-close, portal rendering — is not duplicated per modal.

#### Scenario: Primitive renders arbitrary content
- **WHEN** a caller renders the modal primitive with `isOpen` true and child content
- **THEN** the primitive SHALL render the content in an overlay with a close affordance and Escape-to-close behavior
