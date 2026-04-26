## 1. Add `.markdown-body` styles to globals.css

- [x] 1.1 Add `.markdown-body` block inside `@layer components` in `styles/globals.css` with base typography (font size, line height, color using `--foreground` token)
- [x] 1.2 Add heading styles (h1–h6) with distinct sizes, weights, bottom borders on h1/h2, and bottom margins
- [x] 1.3 Add paragraph styles with bottom margin
- [x] 1.4 Add inline code styles (`code`) with background using `--surface` token, border, border-radius, and padding
- [x] 1.5 Add fenced code block styles (`pre`, `pre > code`) with background, padding, border-radius, horizontal scroll, and reset of inline code styles inside pre
- [x] 1.6 Add blockquote styles with left border using `--accent` token, left padding, and muted text color
- [x] 1.7 Add table styles with collapsed borders, cell padding, and header row background
- [x] 1.8 Add list styles (ul, ol) with left padding, list-style-type, and item bottom margin
- [x] 1.9 Add link styles using `--accent` token with hover underline
- [x] 1.10 Add horizontal rule styles with border color using `--border` token

## 2. Update RenderedView component

- [x] 2.1 In `components/preview/RenderedView.tsx`, replace `className="prose prose-invert prose-sm max-w-none"` on the `<article>` element with `className="markdown-body"`
- [x] 2.2 Verify the outer scroll container (`h-full overflow-y-auto p-4`) is unchanged

## 3. QA

- [x] 3.1 Run `yarn lint` — no errors
- [x] 3.2 Run `yarn typecheck` — no errors
- [ ] 3.3 Visually verify headings h1–h6 render with distinct sizes in preview mode
- [ ] 3.4 Visually verify inline code and code blocks have background styling
- [ ] 3.5 Visually verify blockquotes show accent-colored left border
- [ ] 3.6 Visually verify tables render with visible borders
- [ ] 3.7 Visually verify links are accent-colored
