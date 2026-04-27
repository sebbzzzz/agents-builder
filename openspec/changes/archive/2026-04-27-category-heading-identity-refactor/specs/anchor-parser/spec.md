## REMOVED Requirements

### Requirement: Parser scans the live CodeMirror document and returns all anchor regions
**Reason:** Anchor-comment identity for categories and options is replaced by `## ${label}` heading identity (categories) and `<!--opt:${id}-->` markers (options). No part of the system needs to parse `<!-- preset:start -->` / `<!-- preset:end -->` anchors anymore.
**Migration:** Use `parseHeadings(doc)` from `app/_utils/parseHeadings.ts` to recover category boundaries from `## Heading` lines. Use a direct string search for `<!--opt:${id}-->` and `<!--/opt-->` markers when targeting an option block (handled inside `app/_utils/docPatches.ts`).

### Requirement: Parser accepts both plain and JSON anchor id formats
**Reason:** No anchor format remains.
**Migration:** Drop any caller that extracted ids from anchor comment payloads. Option ids now travel inside `<!--opt:${id}-->` markers and are extracted with the regex `^<!--opt:([^>]+)-->$`.

### Requirement: Parser is tolerant of extra whitespace in anchor comments
**Reason:** No anchor format remains.
**Migration:** None — there is no parser to be tolerant of.

### Requirement: Parser is called on the live document, never on a cached string
**Reason:** No parser remains. Patch helpers in `app/_utils/docPatches.ts` operate on a passed-in `Text` argument supplied by the caller from `view.state.doc` immediately before dispatch — preserving the "always work on the live document" property without a dedicated parser.
**Migration:** Continue the pattern of reading `view.state.doc` at the start of each forward-sync pass and passing it to the patch helpers.
