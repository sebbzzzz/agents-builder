# Spec: typed-option-inputs

## Purpose

TBD — defines how each sub-category type (`multi`, `select`, `input`, `visibleWhen`) is rendered as a distinct input control within the checklist area, and how tooltips are displayed for individual options.

## Requirements

### Requirement: `multi` sub-category renders a checkbox list
The system SHALL render a labeled checkbox for each option in a `SubCategory` whose `type` is `"multi"`, allowing the user to select zero or more options simultaneously.

#### Scenario: Multiple options can be checked at once
- **WHEN** the user checks two options in a `multi` sub-category
- **THEN** both options appear checked and both IDs are present in the sub-category's selection

#### Scenario: Unchecking removes the option
- **WHEN** the user unchecks a previously checked option
- **THEN** that option's ID is removed from the selection

### Requirement: `select` sub-category renders a single-choice control
The system SHALL render a radio group or equivalent single-choice control for a `SubCategory` whose `type` is `"select"`, allowing at most one option to be active at a time.

#### Scenario: Selecting a new option deselects the previous one
- **WHEN** the user selects option B in a `select` sub-category that already has option A selected
- **THEN** option A is no longer selected and only option B is active

#### Scenario: Sub-category starts with no selection
- **WHEN** the user opens a category for the first time
- **THEN** no option in any `select` sub-category is pre-selected

### Requirement: `input` sub-category renders a text field
The system SHALL render a single-line text input for a `SubCategory` whose `type` is `"input"`, using the option's `placeholder` as the input placeholder text.

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
- **WHEN** the user hovers over an option label that has no `tooltip`
- **THEN** no tooltip is shown
