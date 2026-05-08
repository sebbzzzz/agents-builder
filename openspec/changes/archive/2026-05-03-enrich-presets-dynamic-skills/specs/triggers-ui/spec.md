## REMOVED Requirements

### Requirement: Triggers sub-category renders one card per selected skill
**Reason:** The separate "Auto-invoke Skills" sidebar category is removed. Trigger selection is now inline within the skills panel — trigger checkboxes expand beneath each selected skill row.
**Migration:** Trigger selection and output are now handled by the `skills-ui` spec. The `## Auto-invoke Skills` output section is preserved; it is now driven by `skillTriggers` state in `FloatingOptionsPanel` rather than a separate triggers sub-category.

### Requirement: Each trigger card contains a text input and template chips
**Reason:** Replaced by inline multi-select trigger checkboxes per skill. Free-text input per skill added friction and produced inconsistent output format.
**Migration:** Users select trigger templates via checkboxes in the skills panel. The `TRIGGER_TEMPLATES` constant in `app/_utils/constants.ts` provides the available templates as structured `{ id, label, prompt }` objects.

### Requirement: Typed value is stored per skill in the store
**Reason:** Trigger state is no longer a free-text value stored in the Zustand store. It is now a `skillTriggers: Record<string, string[]>` local state in `FloatingOptionsPanel`, consistent with how `selections` works.
**Migration:** No Zustand store change needed. `skillTriggers` is reset when the panel closes or "Add to document" is clicked.

## MODIFIED Requirements

### Requirement: Triggers output block lists auto-invoke instructions
The system SHALL include a `## Auto-invoke Skills` section in the generated markdown with one bullet per selected trigger template, in the format: `Use \`{skillLabel}\` {triggerPhrase}`. The section SHALL only appear when at least one trigger is selected across any skill.

#### Scenario: Only skills with triggers appear in output
- **WHEN** two skills are selected but only one has trigger templates checked
- **THEN** only the skill with checked triggers appears in `## Auto-invoke Skills`

#### Scenario: No section rendered when no triggers are checked
- **WHEN** skills are selected but no trigger checkboxes are checked for any skill
- **THEN** the `## Auto-invoke Skills` section does not appear in the output
