## ADDED Requirements

### Requirement: Skills panel loads live data from the API
The system SHALL call `useFetchSkills()` when the Available Skills category panel is active, and render the live skills list when the fetch resolves. A loading indicator SHALL be shown while the fetch is in progress.

#### Scenario: Loading indicator shown while fetching
- **WHEN** the skills panel opens and the fetch has not yet resolved
- **THEN** a loading state (spinner or skeleton) is visible in the panel

#### Scenario: Live skills replace static list on success
- **WHEN** the fetch resolves successfully
- **THEN** the skills list updates to reflect live data from skills.sh

#### Scenario: Static fallback rendered on fetch failure
- **WHEN** the fetch fails
- **THEN** the skills list renders the static snapshot from `data/skills-fallback.ts` with no error message shown to the user

### Requirement: Selected skill expands to show trigger template checkboxes
The system SHALL render a set of trigger template checkboxes directly beneath a skill row when that skill is checked. The trigger checkboxes SHALL use the `TRIGGER_TEMPLATES` constant from `app/_utils/constants.ts`.

#### Scenario: Trigger checkboxes appear when skill is checked
- **WHEN** the user checks a skill row
- **THEN** a list of trigger template checkboxes expands inline beneath that skill row

#### Scenario: Trigger checkboxes are hidden when skill is unchecked
- **WHEN** the user unchecks a previously checked skill
- **THEN** the trigger checkboxes for that skill collapse and disappear

#### Scenario: Multiple triggers can be selected per skill
- **WHEN** the user checks two trigger templates for a single skill
- **THEN** both trigger IDs are stored in `skillTriggers[skillId]`

## MODIFIED Requirements

### Requirement: Skills output block uses install-command format
The system SHALL include a `## Skills` section in the generated markdown with a bash code block containing one `npx skills add` command per selected skill, using the option's `prompt` field. Additionally, if any trigger templates are selected for a skill, the system SHALL inject corresponding lines into a `## Auto-invoke Skills` section in the format: `Use \`{skillLabel}\` {triggerPrompt}`.

#### Scenario: Selected skills appear in the output
- **WHEN** the user selects two skills and clicks "Add to document"
- **THEN** the generated markdown contains `## Skills` followed by a `bash` code block with two `npx skills add …` lines

#### Scenario: Trigger selections produce auto-invoke output
- **WHEN** the user selects a skill and checks two trigger templates
- **THEN** two lines appear under `## Auto-invoke Skills` in the format `Use \`skill-name\` when {trigger}`

#### Scenario: Skills with no triggers selected produce no auto-invoke output
- **WHEN** the user selects a skill but checks no trigger templates
- **THEN** no line is added to `## Auto-invoke Skills` for that skill

#### Scenario: No section rendered when no skills selected
- **WHEN** no skills are selected
- **THEN** the `## Skills` section does not appear in the output
