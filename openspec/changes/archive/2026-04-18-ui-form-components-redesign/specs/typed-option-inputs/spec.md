## MODIFIED Requirements

### Requirement: `multi` sub-category renders a checkbox list
The system SHALL render a shadcn `Checkbox` component (from `@/components/ui/checkbox`) for each option in a `SubCategory` whose `type` is `"multi"`, via the reusable `OptionRow` component.

#### Scenario: Multiple options can be checked at once
- **WHEN** the user checks two options in a `multi` sub-category
- **THEN** both options appear checked and both IDs are present in the sub-category's selection

#### Scenario: Unchecking removes the option
- **WHEN** the user unchecks a previously checked option
- **THEN** that option's ID is removed from the selection

### Requirement: `select` sub-category renders a single-choice control
The system SHALL render a shadcn `RadioGroup` for a `SubCategory` of type `"select"` with fewer than 5 options, and a shadcn `Select` dropdown when the option count is 5 or more, via the reusable `OptionRow` component.

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

### Requirement: `input` sub-category renders a text field
The system SHALL render a shadcn `Input` component for a `SubCategory` whose `type` is `"input"`, using the option's `placeholder` as the input placeholder text.

#### Scenario: Placeholder is shown when field is empty
- **WHEN** the user has not typed anything in an `input` sub-category
- **THEN** the placeholder text from the option definition is visible in the field

#### Scenario: Typed value is stored in selections
- **WHEN** the user types a value into an `input` field and moves focus away
- **THEN** the value is saved in the selections state under that sub-category's ID

### Requirement: `visibleWhen` sub-categories are conditionally rendered
The system SHALL hide a `SubCategory` that has a `visibleWhen` array unless at least one of the listed option IDs is currently selected anywhere in the app.

#### Scenario: Sub-category is hidden when no matching option is selected
- **WHEN** a sub-category has `visibleWhen: ["web-app", "fullstack-app"]` and neither is selected
- **THEN** that sub-category is not rendered

#### Scenario: Sub-category appears when a matching option is selected
- **WHEN** the user selects `"web-app"` and a sub-category has `visibleWhen: ["web-app"]`
- **THEN** that sub-category becomes visible in the checklist area

### Requirement: Options show tooltips on hover
The system SHALL display the option's `tooltip` text in a tooltip when the user hovers over or focuses the option label, for any option that has a `tooltip` defined.

#### Scenario: Tooltip appears on hover
- **WHEN** the user hovers over an option label that has a tooltip
- **THEN** the tooltip text is displayed near the label

#### Scenario: No tooltip shown for options without tooltip field
- **WHEN** an option has no `tooltip` property
- **THEN** no tooltip UI element is rendered for that option

## ADDED Requirements

### Requirement: Each sub-category has a Switch to enable or disable it
The system SHALL render a shadcn `Switch` at the top of each sub-category block. When off, the sub-category's options are hidden and excluded from output.

#### Scenario: Switch is on by default
- **WHEN** the floating panel renders a sub-category for the first time
- **THEN** the sub-category's Switch is in the on (enabled) state and its options are visible

#### Scenario: Turning the Switch off hides the options
- **WHEN** the user toggles a sub-category's Switch to off
- **THEN** the option controls for that sub-category are hidden

#### Scenario: Turning the Switch back on restores the options
- **WHEN** the user toggles a sub-category's Switch back to on after it was off
- **THEN** the option controls reappear with their previously selected values intact

#### Scenario: Disabled sub-category selections are excluded from output
- **WHEN** a sub-category's Switch is off
- **THEN** none of that sub-category's options appear in the generated AGENTS.md preview

### Requirement: `skills` sub-category renders a checklist of skill rows
The system SHALL render a `SkillRow` for each option in a `SubCategory` of type `"skills"`, replacing the previous "Coming soon" placeholder.

#### Scenario: Skills type no longer shows "Coming soon"
- **WHEN** a sub-category of type `"skills"` is rendered
- **THEN** a structured row per option is displayed, not a placeholder message

#### Scenario: Multiple skills can be selected
- **WHEN** the user checks multiple skill rows
- **THEN** all selected IDs appear in the sub-category's selection array

### Requirement: `triggers` sub-category renders trigger cards for selected skills
The system SHALL render a `TriggerCard` for each skill currently selected, replacing the previous "Coming soon" placeholder.

#### Scenario: Triggers type no longer shows "Coming soon"
- **WHEN** a sub-category of type `"triggers"` is rendered
- **THEN** trigger cards (or an empty-state tile) are displayed, not a placeholder message
