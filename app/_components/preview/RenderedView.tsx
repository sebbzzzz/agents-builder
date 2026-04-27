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

import { stripMarkers } from "@/app/_utils/stripMarkers"
import { useDocumentStore } from "@/store/useDocumentStore"

import { MermaidBlock } from "./MermaidBlock"
import "./markdown-preview.scss"

const ReactMarkdown = lazy(() => import("react-markdown"))

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
  const content = useDocumentStore((s) => s.content)
  const cleaned = content ? stripMarkers(content) : ""

  return (
    <div className="h-full overflow-y-auto p-4">
      <Suspense fallback={<p className="text-muted-foreground text-sm">Loading…</p>}>
        <article className="markdown-body">
          <ReactMarkdown
            remarkPlugins={REMARK_PLUGINS}
            rehypePlugins={REHYPE_PLUGINS}
            components={MD_COMPONENTS}
          >
            {cleaned}
          </ReactMarkdown>
        </article>
      </Suspense>
    </div>
  )
}
