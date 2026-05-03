## ADDED Requirements

### Requirement: Skills data is loaded from skills.sh via a Next.js Route Handler
The system SHALL provide a Next.js Route Handler at `GET /api/skills` that fetches the `skills.sh/api/v1/skills/curated` endpoint first, falling back to `skills.sh/api/v1/skills?per_page=100&view=all-time` if curated returns fewer than 15 results. The Route Handler SHALL return a normalized array of skill objects and cache the response for 1 hour using `next: { revalidate: 3600 }`.

#### Scenario: Route Handler returns curated skills by default
- **WHEN** `GET /api/skills` is called and skills.sh curated endpoint returns 15 or more skills
- **THEN** the response is a normalized JSON array of curated skills with `id`, `label`, `owner`, `installs`, and `prompt` fields

#### Scenario: Route Handler falls back to leaderboard when curated list is small
- **WHEN** `GET /api/skills` is called and the curated endpoint returns fewer than 15 skills
- **THEN** the Route Handler fetches the all-time leaderboard and returns that instead

#### Scenario: Route Handler caches the response
- **WHEN** `GET /api/skills` is called twice within one hour
- **THEN** the second call returns the cached response without hitting the skills.sh API

#### Scenario: Route Handler returns 500 if skills.sh is unavailable
- **WHEN** skills.sh returns a non-2xx response on both endpoints
- **THEN** the Route Handler returns an HTTP 500 response

### Requirement: Client hook loads live skills with static fallback
The system SHALL provide a `useFetchSkills` hook that fetches `/api/skills` on mount and returns the result. If the fetch fails, it SHALL fall back to the static snapshot from `data/skills-fallback.ts`.

#### Scenario: Live skills replace static data on successful fetch
- **WHEN** the skills panel opens and the fetch succeeds
- **THEN** the skills list reflects live data from skills.sh (sorted by install count)

#### Scenario: Static fallback is shown on fetch failure
- **WHEN** the skills panel opens and the fetch fails (network error or 500)
- **THEN** the skills list shows the static snapshot from `data/skills-fallback.ts`

#### Scenario: Loading state is indicated while fetch is in progress
- **WHEN** the skills panel opens and the fetch has not yet resolved
- **THEN** the hook returns `isLoading: true` and the panel can use this to render a loading indicator

### Requirement: Static fallback is maintained as a separate file
The system SHALL store the static skills snapshot in `data/skills-fallback.ts` as a named export `STATIC_SKILLS: Option[]`, independent of `categories.ts`.

#### Scenario: Static fallback is importable independently
- **WHEN** `data/skills-fallback.ts` is imported
- **THEN** the `STATIC_SKILLS` export is available as an `Option[]` array with at least 20 entries
