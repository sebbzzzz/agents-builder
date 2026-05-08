import Link from "next/link"

import { FeaturePills } from "./FeaturePills"

export function Hero() {
  return (
    <div className="relative z-10 flex w-full max-w-[680px] flex-col px-6 text-center md:px-8">
      {/* title */}
      <h1
        className="text-foreground mb-6 font-sans text-[clamp(32px,5.5vw,64px)] leading-[1.06] font-bold tracking-[-0.03em]"
        style={{ animation: "reveal 0.4s ease 0.15s both" }}
      >
        Write your{" "}
        <span
          style={{
            background: "linear-gradient(135deg, #ffb067, #ff781d, #ffc07d, #ff781d)",
            backgroundSize: "300% 300%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "gradient-flow 4s ease infinite, reveal 0.4s ease 0.15s both",
          }}
        >
          AGENTS.md
        </span>
        <br />
        before any code.
        <span
          className="bg-accent ml-0.5 inline-block w-0.5 align-text-bottom"
          style={{
            height: "1.1em",
            animation: "blink 1.1s step-end infinite",
          }}
        />
      </h1>

      {/* description */}
      <p
        className="text-foreground-2 mb-9 text-base leading-[1.65]"
        style={{ animation: "reveal 0.4s ease 0.28s both" }}
      >
        Browse architectural decisions, discover tradeoffs, and watch your{" "}
        <code className="border-accent-ghost bg-accent-faint text-accent-2 rounded-[3px] border px-1.5 py-px font-mono text-[13.5px]">
          AGENTS.md
        </code>{" "}
        build itself — one choice at a time. No blank page. No guessing.
      </p>

      {/* CTA row */}
      <div
        className="flex flex-wrap items-center justify-center gap-3"
        style={{ animation: "reveal 0.4s ease 0.40s both" }}
      >
        <Link
          href="/agents-builder"
          className="btn-primary inline-flex items-center gap-[9px] rounded-[4px] px-7 py-[14px] text-[15px] tracking-[-0.01em] transition-all duration-[140ms] hover:-translate-y-px hover:shadow-[0_8px_24px_-8px_rgba(255,120,29,0.5)] active:translate-y-0"
        >
          Open the builder
          <span className="text-[17px] leading-none">→</span>
        </Link>

        <a
          href="https://github.com/sebbzzzz/agents-builder"
          target="_blank"
          rel="noreferrer"
          className="border-border-strong text-foreground-2 hover:border-muted-foreground hover:text-foreground inline-flex items-center gap-[7px] rounded-[4px] border bg-transparent px-[18px] py-[13px] font-mono text-xs tracking-[0.02em] transition-all duration-[140ms]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          view source
        </a>
      </div>

      <FeaturePills />
    </div>
  )
}
