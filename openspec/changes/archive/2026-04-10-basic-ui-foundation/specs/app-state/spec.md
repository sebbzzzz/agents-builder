## ADDED Requirements

### Requirement: Zustand store is the single source of truth for all app state
The system SHALL have a single Zustand store defined in `store/useAppStore.ts` that holds all shared application state. No component SHALL use local `useState` for state that is shared between the left and right panels.

#### Scenario: Store is accessible from any component
- **WHEN** any component in the tree imports `useAppStore`
- **THEN** it receives the correct current state without prop drilling

#### Scenario: Store update in one panel reflects in the other
- **WHEN** the active category is changed via the left panel
- **THEN** the right panel (or any subscriber) receives the updated value on the next render

### Requirement: Store contains the required state slices
The Zustand store SHALL define the following slices with their initial values and setter actions:
- `activeCategory: string | null` (initial: `null`) — the currently selected category id
- `selections: Record<string, string[]>` (initial: `{}`) — checked option ids per category
- `markdownOutput: string` (initial: `""`) — the assembled markdown file content
- `activeView: 'code' | 'preview'` (initial: `'code'`) — which view the right panel shows
- `isDirty: boolean` (initial: `false`) — whether the user has manually edited the markdown

#### Scenario: Initial state is correct on first load
- **WHEN** the app loads for the first time
- **THEN** `activeCategory` is `null`, `selections` is `{}`, `markdownOutput` is `""`, `activeView` is `"code"`, and `isDirty` is `false`

#### Scenario: setActiveCategory updates the store
- **WHEN** `setActiveCategory("tech-stack")` is called
- **THEN** subsequent reads of `activeCategory` return `"tech-stack"`

### Requirement: Store actions are co-located in the store file
The system SHALL define all action functions (setters and updaters) inside the Zustand `create` call in `store/useAppStore.ts`. No action logic SHALL be defined outside the store file.

#### Scenario: Actions are available on the store object
- **WHEN** a component calls `useAppStore(s => s.setActiveCategory)`
- **THEN** it receives a callable function

### Requirement: Components subscribe only to the slices they need
Each component using the store SHALL use a selector function to subscribe to only the state it reads, to prevent unnecessary re-renders.

#### Scenario: CategoryPanel does not re-render on markdownOutput change
- **WHEN** `markdownOutput` is updated in the store
- **THEN** the `CategoryPanel` component (which only subscribes to `activeCategory` and `selections`) does NOT re-render
