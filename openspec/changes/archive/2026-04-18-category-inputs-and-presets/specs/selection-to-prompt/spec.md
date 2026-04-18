## ADDED Requirements

### Requirement: Selecting an option adds its prompt to the markdown output
The system SHALL include each selected option's `prompt` string in the `markdownOutput` state whenever the user's selections change.

#### Scenario: Prompt appears after option is selected
- **WHEN** the user selects an option that has a `prompt` field
- **THEN** the option's `prompt` text appears in the generated AGENTS.md preview

#### Scenario: Prompt is removed after option is deselected
- **WHEN** the user deselects an option
- **THEN** that option's `prompt` text no longer appears in the generated AGENTS.md preview

### Requirement: Prompts are grouped by category in output order
The system SHALL group prompts under their parent category heading in the AGENTS.md output, in the same order as `CATEGORIES` is defined.

#### Scenario: Category heading precedes its prompts
- **WHEN** the user has selections in the "Tech Stack" category
- **THEN** all "Tech Stack" prompts appear under a `## Tech Stack` heading in the output

#### Scenario: Categories with no selections are omitted
- **WHEN** a category has no selected options
- **THEN** no heading or content for that category appears in the output

### Requirement: `input` type value is used verbatim in the output
The system SHALL emit the raw text the user typed into an `input` sub-category field as part of the markdown output, prefixed by the option's `prompt` if one is defined.

#### Scenario: Typed value appears in output
- **WHEN** the user types a value into an `input` field
- **THEN** that exact text appears in the relevant section of the generated AGENTS.md

#### Scenario: Empty input field produces no output
- **WHEN** the user has not typed anything into an `input` field
- **THEN** no content for that field appears in the output

### Requirement: `buildAgentsFile` is a pure function
The system SHALL expose a pure function `buildAgentsFile(selections)` in `lib/` that takes the current selections map and returns a markdown string, with no side effects.

#### Scenario: Same input always produces same output
- **WHEN** `buildAgentsFile` is called twice with identical selections
- **THEN** it returns the same string both times

#### Scenario: Empty selections produces an empty or header-only string
- **WHEN** `buildAgentsFile` is called with an empty selections object
- **THEN** it returns an empty string or a minimal header with no category sections
