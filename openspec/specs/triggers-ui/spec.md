# triggers-ui Specification

## Purpose
TBD - created by archiving change groundwork-design-system. Update Purpose after archive.
## Requirements
### Requirement: Triggers sub-category renders one card per selected skill
The system SHALL render a trigger card for each skill option ID that is currently selected in the `skills` sub-category, within a `SubCategory` of `type: "triggers"`.

#### Scenario: Card appears for each checked skill
- **WHEN** the user has selected two skills
- **THEN** the triggers sub-category shows two trigger cards, one per skill

#### Scenario: Empty state shown when no skills are selected
- **WHEN** no skills are selected in the skills sub-category
- **THEN** the triggers sub-category renders a dashed empty-state tile with the text "Pick skills in the Skills section first."

### Requirement: Each trigger card contains a text input and template chips
The system SHALL render each trigger card with the skill ID as a heading, a text input for the trigger phrase, and a row of predefined template chips the user can click to populate the input.

#### Scenario: Clicking a template chip fills the input
- **WHEN** the user clicks a template chip on a trigger card
- **THEN** the text input for that card is filled with the chip's phrase text

#### Scenario: Typed value is stored per skill in the store
- **WHEN** the user types a phrase into a trigger input
- **THEN** the value is saved in `skillTriggers[skillId]` in the Zustand store

### Requirement: Unchecking a skill clears its trigger phrase
The system SHALL remove the trigger phrase for a skill when that skill is unchecked in the skills sub-category.

#### Scenario: Trigger is cleared on skill uncheck
- **WHEN** the user unchecks a previously-selected skill
- **THEN** `skillTriggers[skillId]` is removed or set to empty string

### Requirement: Triggers output block lists auto-invoke instructions
The system SHALL include a `## Auto-invoke Skills` section in the generated markdown with one bullet per skill that has a non-empty trigger phrase, in the format: `Use \`{skillId}\` when {phrase}`.

#### Scenario: Only skills with phrases appear in output
- **WHEN** two skills are selected but only one has a trigger phrase
- **THEN** only the skill with a phrase appears in `## Auto-invoke Skills`

#### Scenario: No section rendered when no trigger phrases exist
- **WHEN** no trigger phrases are set
- **THEN** the `## Auto-invoke Skills` section does not appear in the output

