"use client"

import { Suspense, lazy } from "react"
import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import remarkEmoji from "remark-emoji"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import type { PluggableList } from "unified"
import "katex/dist/katex.min.css"

import { useAppStore } from "@/store/useAppStore"

import { MermaidBlock } from "./MermaidBlock"
import "./markdown-preview.scss"

const ReactMarkdown = lazy(() => import("react-markdown"))

const PREVIEW_PLACEHOLDER = `# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

---

## Inline formatting

**Bold**, *italic*, ~~strikethrough~~, \`inline code\`, [link](https://github.com), and emoji :rocket: :tada: :white_check_mark:

Keyboard shortcut: press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>

---

## Blockquote

> This is a blockquote.
> It can span multiple lines.
>
> And multiple paragraphs.

---

## GitHub Alerts

> [!NOTE]
> Highlights information that users should take into account.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention.

> [!CAUTION]
> Negative potential consequences of an action.

---

## Code

Inline: \`const x = 42\`

\`\`\`typescript
// TypeScript
interface User {
  id: number
  name: string
  role: "admin" | "viewer"
}

function greet(user: User): string {
  return \`Hello, \${user.name}!\`
}
\`\`\`

\`\`\`bash
# Bash
yarn add remark-gfm rehype-raw
echo "Done"
\`\`\`

\`\`\`python
# Python
def fibonacci(n: int) -> list[int]:
    a, b = 0, 1
    return [a := a + b, b := a][0] if n else []
\`\`\`

---

## Math

Inline math: $E = mc^2$

Block math:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

$$
\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\cdot \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} ax+by \\\\ cx+dy \\end{pmatrix}
$$

---

## Lists

**Unordered:**

- Item one
- Item two
  - Nested item
  - Another nested
    - Deeply nested
- Item three

**Ordered:**

1. First item
2. Second item
   1. Nested ordered
   2. Another nested
3. Third item

**Task list:**

- [x] Completed task
- [x] Another done task
- [ ] Pending task
- [ ] Not done yet

---

## Table

| Name         | Type      | Default   | Description              |
| ------------ | --------- | --------- | ------------------------ |
| \`fontSize\`   | \`number\`  | \`16\`      | Base font size in pixels |
| \`lineHeight\` | \`number\`  | \`1.5\`     | Line height ratio        |
| \`fontFamily\` | \`string\`  | \`system\`  | Font family stack        |

---

## Sequence Diagram

\`\`\`mermaid
sequenceDiagram
  actor User
  participant App
  participant Store
  participant Builder

  User->>App: Select option
  App->>Store: dispatch(toggleOption)
  Store->>Builder: buildMarkdown(selections)
  Builder-->>Store: markdownOutput
  Store-->>App: re-render
  App-->>User: Preview updated
\`\`\`

---

## Footnotes

Here is a sentence with a footnote.[^1]

Another sentence with a second footnote.[^2]

[^1]: This is the first footnote.
[^2]: This is the second footnote with more detail.

---

## Details / Summary

<details>
<summary>Click to expand</summary>

Hidden content inside a collapsible section.

\`\`\`bash
echo "hidden code block"
\`\`\`

</details>

---

## Horizontal rules

Above

---

Below
`

const REMARK_PLUGINS: PluggableList = [remarkGfm, remarkMath, [remarkEmoji, { emoticon: false }]]
const REHYPE_PLUGINS: PluggableList = [rehypeRaw, rehypeKatex, rehypeHighlight]

const MD_COMPONENTS = {
  code({ className, children, ...props }: React.ComponentPropsWithoutRef<"code">) {
    const language = /language-(\w+)/.exec(className ?? "")?.[1]

    if (language === "mermaid") {
      return <MermaidBlock code={String(children).trim()} />
    }

    return (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}

export function RenderedView() {
  const content = useAppStore((s) => s.markdownOutput)

  return (
    <div className="h-full overflow-y-auto p-4">
      <Suspense fallback={<p className="text-muted-foreground text-sm">Loading…</p>}>
        <article className="markdown-body">
          <ReactMarkdown
            remarkPlugins={REMARK_PLUGINS}
            rehypePlugins={REHYPE_PLUGINS}
            components={MD_COMPONENTS}
          >
            {content || PREVIEW_PLACEHOLDER}
          </ReactMarkdown>
        </article>
      </Suspense>
    </div>
  )
}
