## REMOVED Requirements

### Requirement: Enabling a preset inserts its anchor block if not already present
**Reason:** No anchor block format remains. Categories are inserted as plain `## ${label}` headings.
**Migration:** Replace `enablePreset(categoryId, defaultContent, regions, doc)` calls with `insertCategorySection(doc, category)` from `app/_utils/docPatches.ts`. The new helper writes only the heading and trailing blank line; option content is added separately via `insertOptionBlock`.

### Requirement: Disabling a preset removes its entire anchor block including all nested fragments
**Reason:** No anchor block format remains. Sections are bounded by heading lines, not anchors.
**Migration:** Replace `disablePreset(categoryId, regions, doc)` calls with `removeCategorySection(doc, category)`, which deletes from the `## ${label}` line through the line before the next `##` heading (or to end-of-doc).

### Requirement: Enabling a fragment inserts it inside its parent preset in schema order
**Reason:** Options are no longer ordered by a schema index inside an anchor block. Each option block is appended at the end of its sub-category section in the order the user selects them.
**Migration:** Replace `enableFragment(optionId, parentId, prompt, schemaOrder, regions, doc)` calls with `insertOptionBlock(doc, category, subCategory, option)`. The new helper appends the marker-wrapped block at the end of the sub-category's section.

### Requirement: Disabling a fragment removes only its anchor block, leaving siblings untouched
**Reason:** No fragment anchors remain. Option blocks are bounded by `<!--opt:${id}-->` and `<!--/opt-->` marker lines.
**Migration:** Replace `disableFragment(optionId, regions, doc)` calls with `removeOptionBlock(doc, optionId)`. The new helper finds the marker pair by exact id match and removes the inclusive range, also removing the enclosing `### Sub-category` heading if no opt markers remain in that sub-section.

### Requirement: All edits are dispatched as targeted CodeMirror transactions
**Reason:** This requirement is preserved by the new patch helpers and by the `heading-identity-sync` capability. It is removed here only because the surrounding spec is being retired.
**Migration:** See the equivalent requirement under `heading-identity-sync` ("Forward sync uses targeted CodeMirror ChangeSpec patches").

### Requirement: Broken or missing anchors are repaired on next toggle
**Reason:** Replaced by the `heading-identity-sync` requirement "Patch helpers cleanly handle missing structure", which covers the same self-healing semantics for headings and markers.
**Migration:** See the equivalent requirement under `heading-identity-sync`.
