## ADDED Requirements

### Requirement: Document state is stored as an ordered array of nodes
The system SHALL maintain the document as a `DocumentNode[]` where each node has an `id: string` and `content: string`. The assembled markdown is produced by joining all node contents with `'\n\n'`.

#### Scenario: Category section node is retrievable by ID
- **WHEN** a category node with id `"patterns"` exists in the store
- **THEN** `nodes.find(n => n.id === "patterns")` returns that node without scanning the full file text

#### Scenario: Free-text node is assigned a stable ID
- **WHEN** the user types content that is not preceded by a recognised category heading
- **THEN** that content is stored as a node with id `"free-{n}"` where `n` is an incrementing index

### Requirement: Document store is isolated from the app store
The system SHALL use a separate Zustand store (`useDocumentStore`) for document state so that components subscribed only to `useAppStore` (e.g. the category panel) do not re-render when document content changes.

#### Scenario: Category panel does not re-render on keystroke
- **WHEN** the user types a character in the editor
- **THEN** components subscribed only to `useAppStore.selections` are not re-rendered

### Requirement: Document store exposes granular update actions
The system SHALL expose `updateNode(id, content)` to replace a single node's content, `setNodes(nodes)` to replace the entire array (used by auto-save re-parse), and `setIsDirty(dirty)` to track unsaved state.

#### Scenario: Single node update does not replace the full array
- **WHEN** `updateNode("patterns", newContent)` is called
- **THEN** only the node with id `"patterns"` is replaced; all other nodes are unchanged

### Requirement: isDirty flag tracks unsaved changes
The system SHALL set `isDirty: true` on every CodeMirror document change and `isDirty: false` after auto-save completes.

#### Scenario: isDirty becomes true after a keystroke
- **WHEN** the user types any character in the editor
- **THEN** `isDirty` is `true`

#### Scenario: isDirty resets after auto-save
- **WHEN** the auto-save timer fires and `setNodes` is called with the parsed result
- **THEN** `isDirty` is `false`
