# Spec: anchor-parser

## Purpose

TBD — scans the live CodeMirror document for HTML comment anchor markers and returns structured region descriptors used by the fragment applicator to locate and target section boundaries.

## Requirements

### Requirement: Parser scans the live CodeMirror document and returns all anchor regions
The system SHALL scan `view.state.doc` line-by-line and return an `AnchorRegion[]` describing every `<!-- preset:start {id} -->` / `<!-- preset:end {id} -->` pair found. Each region SHALL include the id, the character offsets of the start/end anchor lines, and the character offsets of the editable content between them.

#### Scenario: Well-formed anchor pair is detected
- **WHEN** the document contains `<!-- preset:start pattern -->` and `<!-- preset:end pattern -->`
- **THEN** `parseAnchors` returns a region with `id: "pattern"`, correct `from`/`to` and `contentFrom`/`contentTo` offsets

#### Scenario: Nested anchor pair is detected independently
- **WHEN** the document contains `<!-- preset:start pattern.mvp -->` inside a `pattern` region
- **THEN** `parseAnchors` returns both `"pattern"` and `"pattern.mvp"` as separate regions

#### Scenario: Unpaired start anchor is ignored
- **WHEN** the document contains `<!-- preset:start pattern -->` with no matching end anchor
- **THEN** no region is returned for `"pattern"`

### Requirement: Parser accepts both plain and JSON anchor id formats
The system SHALL parse anchor IDs in both plain format (`<!-- preset:start pattern -->`) and JSON format (`<!-- preset:start {"id":"pattern","version":1} -->`), extracting only the `id` field from JSON.

#### Scenario: Plain id is parsed correctly
- **WHEN** the start anchor is `<!-- preset:start pattern.mvp -->`
- **THEN** the region id is `"pattern.mvp"`

#### Scenario: JSON id is parsed correctly
- **WHEN** the start anchor is `<!-- preset:start {"id":"pattern","version":1} -->`
- **THEN** the region id is `"pattern"`

### Requirement: Parser is tolerant of extra whitespace in anchor comments
The system SHALL match anchors that have leading or trailing whitespace inside the comment, e.g. `<!--  preset:start pattern  -->`.

#### Scenario: Extra whitespace does not break parsing
- **WHEN** an anchor line contains extra spaces around the id
- **THEN** the region is still detected with the correct id

### Requirement: Parser is called on the live document, never on a cached string
The system SHALL call `parseAnchors(view.state.doc)` at the start of each enable/disable operation to ensure offsets reflect the current editor state.

#### Scenario: Anchors are re-scanned after a user edit
- **WHEN** the user types content above a preset region, shifting all offsets down
- **THEN** the next `parseAnchors` call returns updated `from`/`to` values reflecting the shift
