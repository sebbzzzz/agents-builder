# skills-ui Specification

## Purpose
TBD - created by archiving change groundwork-design-system. Update Purpose after archive.
## Requirements
### Requirement: Skills sub-category renders a checklist of skill rows
The system SHALL render each option in a `SubCategory` of `type: "skills"` as a structured row with the skill name on the primary line and `{owner} · {installs}` on a secondary line in monospace.

#### Scenario: Skill row shows name and metadata
- **WHEN** the skills sub-category is rendered
- **THEN** each row displays the skill label in sans 12.5px and `{owner} · {installs}` in mono 10px below it

#### Scenario: Multiple skills can be selected simultaneously
- **WHEN** the user checks two skill rows
- **THEN** both appear checked and both IDs are in the sub-category selection

#### Scenario: Tooltip text appears on hover or when checked
- **WHEN** the user hovers over or checks a skill row that has a tooltip
- **THEN** the tooltip/tradeoff text is visible below the label in italic muted style

### Requirement: Skills output block uses install-command format
The system SHALL include a `## Available Skills` section in the generated markdown with a bash code block containing one `npx skills add` command per selected skill, using the option's `prompt` field.

#### Scenario: Selected skills appear in the output
- **WHEN** the user selects two skills
- **THEN** the generated markdown contains `## Available Skills` followed by a `bash` code block with two `npx skills add …` lines

#### Scenario: No section rendered when no skills selected
- **WHEN** no skills are selected
- **THEN** the `## Available Skills` section does not appear in the output

