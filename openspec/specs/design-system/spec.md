# Spec: design-system

## Purpose

TBD — defines the color token palette, design constraints, and shadcn/ui integration for the application's visual foundation.

## Requirements

### Requirement: Color tokens defined as CSS custom properties
The system SHALL define a complete color palette as CSS custom properties in `styles/globals.css` using Tailwind 4's `@theme` block, covering background, surface, border, text, and accent colors.

#### Scenario: Tokens are available as Tailwind utilities
- **WHEN** a component uses a class like `bg-background` or `text-accent`
- **THEN** the browser applies the correct custom property value and `yarn typecheck` passes

#### Scenario: Orange accent applied to interactive elements
- **WHEN** a button or action element uses the accent color
- **THEN** it renders with `--color-accent` (#f97316) and `--color-accent-hover` on hover

### Requirement: Design token palette is sober — black, white, orange only
The system SHALL restrict the palette to near-black backgrounds, near-white text, neutral gray for borders and muted text, and orange-500 for all interactive/action elements. No blue, green, purple, or other hues SHALL appear in the base design system.

#### Scenario: Default background is near-black
- **WHEN** the page renders with no user interaction
- **THEN** the root background uses `--color-background` which resolves to `#0a0a0a` or equivalent near-black

#### Scenario: Primary actions use orange
- **WHEN** a button with the `accent` variant is rendered
- **THEN** its background or border resolves to the orange accent token

### Requirement: shadcn/ui installed and configured with CSS variable mode
The system SHALL have shadcn/ui initialized via `npx shadcn@latest init` with the CSS variables style option, integrating cleanly with Tailwind 4's `@theme` block.

#### Scenario: shadcn components render correctly
- **WHEN** a shadcn component (e.g., Button) is imported and rendered
- **THEN** it displays with correct styles and no console errors

#### Scenario: No tailwind.config.js introduced
- **WHEN** the project files are inspected after shadcn init
- **THEN** Tailwind configuration remains in CSS using `@theme` blocks, not in a `tailwind.config.js` file
