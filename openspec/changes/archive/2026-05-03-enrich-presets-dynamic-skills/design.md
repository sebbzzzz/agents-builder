## Context

The app generates AGENTS.md files from a static set of categories in `data/categories.ts`. Each option has a `prompt` string that gets appended verbatim under the matching `## Section` heading when the user clicks "Add to document". Currently all prompts are single-line sentences — the output works but lacks the structure (code blocks, tables, bullet lists) that AI agents parse most reliably.

Two other pain points exist alongside the data quality issue: the skills snapshot requires manual updates as skills.sh evolves, and the two-panel skills workflow (pick skills in one panel, configure triggers in a separate panel) creates unnecessary friction. Additionally, the `input` subcategory type is specced but unimplemented — it falls through to a checkbox list in `SubCategoryInputs`.

## Goals / Non-Goals

**Goals:**
- All option prompts produce structured, semantically-rich markdown output
- Pattern/Anti-pattern options include real code block examples, not just prose descriptions
- Skills data is live from skills.sh API with no manual maintenance; curated first-party skills shown by default
- Skills and trigger selection happen in a single panel interaction
- `input` type renders real text fields with `{value}` interpolation
- Five new categories cover high-value AGENTS.md sections absent from the current tool (Permission Boundaries, Security, Environment, Deployment, and enriched Workflows test tiers)

**Non-Goals:**
- AI-assisted prompt generation
- Saving or restoring sessions
- Authentication or user accounts
- Any backend beyond the single Next.js Route Handler for skills proxying

## Decisions

### 1. Proxy skills.sh via Next.js Route Handler; prefer curated endpoint

**Decision:** `app/api/skills/route.ts` fetches `skills.sh/api/v1/skills/curated` first (official first-party skills from tech makers). If the curated list returns fewer than 15 skills, fall back to `skills.sh/api/v1/skills?per_page=100&view=all-time`. Response cached with `next: { revalidate: 3600 }`.

**Alternative considered:** Direct client-side fetch; always use leaderboard endpoint.

**Rationale:** CORS behavior on skills.sh is undocumented — server proxying guarantees no issues. ISR caching means one request per hour per edge region rather than one per user. The curated endpoint is preferred because it returns higher-signal, verified skills from known owners (Vercel, Anthropic, Supabase, etc.) rather than a raw popularity ranking. The fallback to the leaderboard ensures the list is never empty if the curated set is small.

The normalized response shape matches the existing `Option` interface: `{ id, label, owner, installs, prompt }`.

### 2. Static fallback in `data/skills-fallback.ts`

**Decision:** Extract the current static skills list from `categories.ts` into `data/skills-fallback.ts` and import it as the fallback in `useFetchSkills`.

**Alternative considered:** Keep the static list inline in categories.ts and use it as-is.

**Rationale:** Clean separation between data sources. The fallback file can be updated independently of category structure. `categories.ts` stays focused on category definitions rather than doubling as a data snapshot.

### 3. Inline trigger checkboxes replace separate triggers panel

**Decision:** When a skill is checked, a set of trigger template checkboxes expand inline beneath it. The "Auto-invoke Skills" sidebar category is removed. The output still produces a `## Auto-invoke Skills` section.

**Alternative considered:** Keep the separate triggers panel but pre-populate it from the skills selection.

**Rationale:** The separate panel required users to visit two places to complete a single workflow. Inline checkboxes are faster, more discoverable, and consistent with the rest of the panel's checkbox interaction model. The output format is unchanged — triggers still appear under `## Auto-invoke Skills` — so existing AGENTS.md files remain valid.

### 4. `TRIGGER_TEMPLATES` promoted to structured objects in `constants.ts`

**Decision:** Upgrade `TRIGGER_TEMPLATES` from `readonly string[]` to `Array<{ id: string; label: string; prompt: string }>`.

**Alternative considered:** Define trigger templates as options inside a sub-category in `categories.ts`.

**Rationale:** Trigger templates are UI configuration, not category data. They're consumed by `SubCategoryInputs` (rendering) and `FloatingOptionsPanel` (injection) independently. `constants.ts` is the right home for shared app-level config that doesn't belong in the data layer.

### 5. Separate `inputValues` state alongside `selections`

**Decision:** Add `inputValues: Record<string, string>` as a second state field in `FloatingOptionsPanel`, distinct from `selections: Record<string, string[]>`.

**Alternative considered:** Store input values inside `selections` alongside option IDs.

**Rationale:** `selections` has a typed contract of `string[]` (option IDs). Mixing text values would require either a union type change or a type cast, affecting the `handleToggle`/`handleSelect` paths. A dedicated `inputValues` map keeps types clean and the two concerns separated.

### 6. `skillTriggers` state as `Record<skillId, triggerId[]>`

**Decision:** Add `skillTriggers: Record<string, string[]>` to `FloatingOptionsPanel` to track which trigger templates are checked per skill.

**Rationale:** Mirrors the structure of `selections` for consistency. The `handleAdd` loop checks both `selections` (which skills are selected) and `skillTriggers` (which triggers per skill) to produce the complete output.

## Risks / Trade-offs

**API response shape unknown until live call** → The `source` and `slug` field format from `skills.sh/api/v1/skills` needs to be verified against the live API before writing the normalization function. The install command is expected to be `npx skills add ${source}/${slug}` based on existing data patterns — confirm before shipping.

**Narrow panel width (w-72) for inline trigger checkboxes** → Trigger checkboxes expand beneath each selected skill. On a skill-heavy selection this could make the panel tall. Acceptable for MVP since the panel is scrollable; evaluate if user feedback suggests layout issues.

**Duplicate injection** → The panel-as-launcher model allows the same option to be injected multiple times. Richer multi-line prompts make duplicates more visually obvious in the output. No change to the existing behavior — this is by design per the `preset-injection` spec.

**Rich prompts in existing document content** → Users who have already injected single-line prompts into their AGENTS.md will not see the enriched versions unless they re-inject. No migration; the editor is always user-editable.

## Open Questions

- Confirm the exact `source`/`slug` format from the live `skills.sh/api/v1/skills` response to validate the `npx skills add ${source}/${slug}` install command pattern.
- Decide if the skills panel should show a search input (leveraging `skills.sh/api/v1/skills/search`) — left for a follow-up change.
