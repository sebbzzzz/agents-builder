## ADDED Requirements

### Requirement: Color tokens use the warm near-black palette
The system SHALL define the complete token set in `styles/globals.css` using the specified warm oklch values, replacing the previous neutral tokens.

#### Scenario: Background is warm near-black
- **WHEN** the tokens are applied
- **THEN** `--background` resolves to `oklch(0.16 0.008 60)` (warm, not neutral)

#### Scenario: Accent ghost and faint variants exist
- **WHEN** a component needs a translucent accent tint
- **THEN** `--accent-ghost` (`rgb(255 120 29 / 0.14)`) and `--accent-faint` (`rgb(255 120 29 / 0.06)`) are available as CSS custom properties

### Requirement: Typography uses Inter and JetBrains Mono exclusively
The system SHALL load Inter via `next/font/google` as `--font-sans` and JetBrains Mono as `--font-mono`. No other font families SHALL be imported.

#### Scenario: Body text uses Inter
- **WHEN** the app renders
- **THEN** all prose and UI chrome text is rendered in Inter

#### Scenario: Monospace elements use JetBrains Mono
- **WHEN** a component applies `font-mono`
- **THEN** it renders in JetBrains Mono (tooltips, eyebrow labels, tag pills, trigger inputs)

### Requirement: Gradient is available but restricted to primary CTAs
The system SHALL define `--accent-grad` as a CSS custom property, and SHALL only apply it to elements with the `.btn-primary` class. No utility class SHALL expose the gradient as a background color.

#### Scenario: Primary CTA button renders the gradient
- **WHEN** an element has class `btn-primary`
- **THEN** its background is `linear-gradient(135deg, #FFB067 0%, #FF781D 100%)`

#### Scenario: No other element uses the gradient
- **WHEN** inspecting all rendered elements
- **THEN** only `.btn-primary` elements carry the gradient background

### Requirement: shadcn inputs use flat orange active state, no white fill
The system SHALL restyle `Checkbox`, `RadioGroup`, and `Switch` so that the checked/active state shows a flat `--accent` fill with no white or light background in the unchecked state.

#### Scenario: Unchecked checkbox has a transparent/dark background
- **WHEN** a checkbox is unchecked
- **THEN** its background is transparent or matches the panel background, not white

#### Scenario: Checked checkbox shows flat orange fill
- **WHEN** a checkbox is checked
- **THEN** its background is `--accent` (flat, not gradient) and its border matches

#### Scenario: Checkbox corners are minimal (2px radius), not pill-shaped
- **WHEN** a checkbox renders
- **THEN** its border-radius is 2px, not the default shadcn value
