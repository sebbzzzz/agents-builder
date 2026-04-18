## MODIFIED Requirements

### Requirement: `skills` sub-category renders a checklist of skill rows
The system SHALL render a `SkillRow` for each option in a `SubCategory` of `type: "skills"`, replacing the previous "Coming soon" placeholder. Each row shows the skill name and secondary metadata (owner · installs).

#### Scenario: Skills type no longer shows "Coming soon"
- **WHEN** a sub-category of type `"skills"` is rendered
- **THEN** a structured row per option is displayed, not a placeholder message

#### Scenario: Multiple skills can be selected simultaneously
- **WHEN** the user checks multiple skill rows
- **THEN** all selected IDs appear in the sub-category's selection array

### Requirement: `select` sub-category renders a single-choice control
The system SHALL render a shadcn `RadioGroup` for a `SubCategory` of type `"select"` with fewer than 5 options, and a shadcn `Select` dropdown when the option count is 5 or more. All options use the shared `OptionRow` component for consistent layout.

#### Scenario: Selecting a new option deselects the previous one
- **WHEN** the user selects option B in a `select` sub-category that already has option A selected
- **THEN** option A is no longer selected and only option B is active

#### Scenario: Sub-category with fewer than 5 options uses RadioGroup
- **WHEN** a `select` sub-category has 4 or fewer options
- **THEN** it renders as a `RadioGroup` with one radio item per option

#### Scenario: Sub-category with 5 or more options uses Select dropdown
- **WHEN** a `select` sub-category has 5 or more options
- **THEN** it renders as a `Select` dropdown component

#### Scenario: Sub-category starts with no selection
- **WHEN** the user opens a category for the first time
- **THEN** no option in any `select` sub-category is pre-selected
