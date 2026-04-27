## ADDED Requirements

### Requirement: option-inject
Users SHALL be able to inject an option's preset text into the editor by clicking an insert button next to that option in the category panel.

**Scenarios:**
- Given the category section `## Tech Stack` exists in the editor, when the user clicks `[+]` on the TypeScript option, then the TypeScript prompt is appended at the end of the `## Tech Stack` section, before the next `##` heading or EOF.
- Given the category section `## Tech Stack` does not exist, when the user clicks `[+]` on any option in that category, then `## Tech Stack\n\n` is created at the end of the document and the option prompt is appended immediately after.
- Given the user has already injected TypeScript and added custom text after it, when they inject JavaScript, then JavaScript is appended after all existing content in the section (including custom text).

### Requirement: panel-as-launcher
The category panel SHALL operate as a one-way preset launcher. It MUST NOT track which options have been injected, and MUST NOT attempt to remove or modify previously injected content.

**Scenarios:**
- Given the user clicks `[+]` on the same option twice, then the prompt appears twice in the editor. The panel does not prevent or warn about duplicate injection.
- Given the user has injected content and manually edited it in the editor, the panel has no knowledge of or effect on that content.

### Requirement: sidebar-opens-panel
Clicking a category in the left sidebar SHALL open that category's option panel. There MUST NOT be an enable/disable toggle on category items.

**Scenarios:**
- Given the user clicks "Tech Stack" in the sidebar, then the Tech Stack panel opens.
- Given the panel is open and the user clicks a different category, then the panel switches to that category.
