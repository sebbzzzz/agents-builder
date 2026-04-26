## Why

The preview mode renders markdown as plain, unstyled text — the `prose` classes in `RenderedView.tsx` have no effect because `@tailwindcss/typography` is not installed. Users cannot evaluate the visual quality of their AGENTS.md output because headings, code blocks, lists, and tables all look identical.

## What Changes

- Add a `.markdown-body` CSS class to `globals.css` that replicates GitHub's dark markdown rendering style (headings hierarchy, code blocks, blockquotes, tables, lists, links, horizontal rules).
- Replace the non-functional `prose prose-invert prose-sm max-w-none` Tailwind classes in `RenderedView.tsx` with the new `.markdown-body` class.
- No new runtime dependencies — the styling is pure CSS in the existing globals file.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `preview-panel`: Add a requirement that the Preview view renders markdown with GitHub-style visual hierarchy — styled headings, code blocks with background, blockquotes with left border, tables with borders, and styled links.

## Impact

- `components/preview/RenderedView.tsx` — replace class names
- `styles/globals.css` — add `.markdown-body` component styles
