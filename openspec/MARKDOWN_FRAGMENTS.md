# Preset Markdown Fragment Synchronization Specification

You are implementing logic that synchronizes preset checkbox selections with a Markdown document being edited inside CodeMirror 6 (React version).

The user edits raw Markdown manually on the right panel.

The left panel contains the preset checkboxes that insert or remove structured Markdown fragments inside the document.

Your task is to modify the Markdown document reliably when presets are toggled, even if the user edits other parts of the document.

Right now, the core of the markdown file is built with a nodes system, but we are going to move towards a more flexible system where the markdown file is just text with special anchors that define where fragments can be inserted.

---

# Context

The Markdown document is always user-editable.

Preset fragments must be inserted using invisible anchors inside the Markdown:

Example:

<!-- preset:start pattern -->
## Pattern

<!-- preset:start pattern.mvp -->
MVP explanation text
<!-- preset:end pattern.mvp -->

<!-- preset:end pattern -->

These anchors define stable editable regions.

Preset logic must operate only using these anchors.

---

# Goals

The system must support:

1. enabling a preset
2. disabling a preset
3. enabling nested preset fragments
4. disabling nested preset fragments
5. inserting fragments in correct schema order
6. modifying document safely even after user edits elsewhere
7. preserving cursor position
8. preserving undo history
9. preventing duplicate insertions
10. recovering if anchors were manually deleted

All edits must be applied through CodeMirror transactions.

---

# Definitions

## Preset

A top-level toggleable document section.

Example:

pattern

## Fragment

A nested section belonging to a preset.

Example:

pattern.mvp  
pattern.server-components

## Anchor

A marker defining editable fragment boundaries:

<!-- preset:start {id} -->
<!-- preset:end {id} -->

Example:

<!-- preset:start pattern.mvp -->
content
<!-- preset:end pattern.mvp -->

Anchors must be treated as authoritative insertion boundaries.

---

# Expected Behaviors

## Enable preset

When enabling:

pattern = ON

Insert:

<!-- preset:start pattern -->
## Pattern

<!-- preset:end pattern -->

If anchor already exists:

- do nothing

If anchor partially exists but is broken:

- repair anchor

If fragment children exist but parent anchor missing:

- recreate parent anchor wrapper

Fallback insertion location:

end of document

---

## Disable preset

When disabling:

pattern = OFF

Remove:

<!-- preset:start pattern -->
...
<!-- preset:end pattern -->

Including all nested fragments.

---

## Enable fragment

When enabling:

pattern.mvp = ON

Insert fragment inside:

<!-- preset:start pattern -->
...
INSERT HERE
...
<!-- preset:end pattern -->

Result:

<!-- preset:start pattern.mvp -->
MVP explanation text
<!-- preset:end pattern.mvp -->

Fragment must be inserted:

- before parent end anchor
- after previous enabled sibling fragment (if exists)

---

## Disable fragment

When disabling:

pattern.mvp = OFF

Remove only:

<!-- preset:start pattern.mvp -->
...
<!-- preset:end pattern.mvp -->

Leave siblings untouched.

---

# Ordering Rules

Fragments must follow schema-defined order.

Example schema order:

pattern
 ├ mvp
 └ server-components

If MVP exists and server-components is enabled:

Insert server-components AFTER MVP

Never append arbitrarily.

---

# Recovery Rules

If user deletes anchors manually:

and checkbox still enabled:

System must recreate missing anchors automatically.

Fallback insertion location priority:

1. end of parent preset anchor
2. end of document if parent missing

Never duplicate anchors.

---

# Anchor Format

Anchors always follow:

<!-- preset:start {id} -->
<!-- preset:end {id} -->

Example IDs:

pattern  
pattern.mvp  
pattern.server-components

System must also support JSON anchors:

<!-- preset:start {"id":"pattern","version":1} -->

Parser must accept both formats.

---

# CodeMirror Constraints

All edits must use:

view.dispatch({
  changes
})

Never replace the entire document string.

Never reset cursor position.

Never break undo history.

Support multiple fragment toggles in sequence.

---

# Edge Cases To Handle

User edits document above preset section

User edits document inside preset section

User deletes preset anchor manually

User deletes fragment anchor manually

User enables fragment before enabling parent preset

User enables fragments out of schema order

User toggles fragments repeatedly on/off

Document already contains anchors

Document partially contains anchors

Broken anchors must be repaired automatically when detected.

---

# Output Requirements

Implement logic that:

- detects anchors
- inserts fragments
- removes fragments
- preserves ordering
- recovers missing anchors
- prevents duplicates
- repairs broken anchors
- applies CodeMirror-safe edits

Do not redesign architecture.

Do not introduce AST parsing.

Operate only on Markdown text + anchors.
