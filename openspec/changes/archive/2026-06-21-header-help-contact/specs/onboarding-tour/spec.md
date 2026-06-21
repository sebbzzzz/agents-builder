## ADDED Requirements

### Requirement: Tour can be restarted on demand
The system SHALL expose a restart action that re-runs the onboarding tour from the first step even after the `onboarding_complete` flag has been set. Restarting SHALL clear the completion flag and re-activate the tour, so a returning user who triggers it sees the full tour again.

#### Scenario: Restart after completion
- **WHEN** `localStorage.getItem("onboarding_complete")` returns `"1"` and the restart action is invoked
- **THEN** the `onboarding_complete` flag is cleared and the tour re-activates from step 0

#### Scenario: Restart from the About modal
- **WHEN** the user clicks "Start onboarding" in the About modal
- **THEN** the restart action is invoked and the tour begins at step 0

#### Scenario: Completing a restarted tour re-sets the flag
- **WHEN** the user completes or dismisses a restarted tour
- **THEN** `localStorage.setItem("onboarding_complete", "1")` is called, matching the first-visit completion behavior
