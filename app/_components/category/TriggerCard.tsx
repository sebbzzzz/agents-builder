"use client"

import { cn } from "@/common/utils/cn"
import { Input } from "@/common/components/UI/Input"
import { TRIGGER_TEMPLATES } from "@/app/_utils/constants"

interface TriggerCardProps {
  skillId: string
  phrase: string
  onPhraseChange: (value: string) => void
}

export function TriggerCard({ skillId, phrase, onPhraseChange }: TriggerCardProps) {
  return (
    <div className="border-border bg-background mb-2 rounded-md border p-3">
      {/* Card header */}
      <div className="mb-2 flex items-center justify-between">
        <span
          className="text-accent font-mono tracking-wider uppercase"
          style={{ fontSize: "var(--text-label)" }}
        >
          {skillId}
        </span>
        <span
          className="border-border text-foreground-4 rounded-sm border px-1.5 py-0.5 font-mono tracking-wider uppercase"
          style={{ fontSize: "var(--text-meta)" }}
        >
          TRIGGER
        </span>
      </div>

      {/* Phrase input */}
      <Input
        value={phrase}
        onChange={(e) => onPhraseChange(e.target.value)}
        placeholder="when doing something…"
        className="bg-surface font-mono"
        style={{ fontSize: "var(--text-trigger)" }}
      />

      {/* Template chips */}
      <div className="mt-2 flex flex-wrap gap-1">
        {TRIGGER_TEMPLATES.map((template) => (
          <button
            key={template}
            type="button"
            onClick={() => onPhraseChange(template)}
            className={cn(
              "border-border text-foreground-4 hover:border-accent hover:text-accent rounded-md border px-2 py-0.5 font-mono transition-colors",
              phrase === template && "border-accent text-accent",
            )}
            style={{ fontSize: "var(--text-label)" }}
          >
            {template}
          </button>
        ))}
      </div>
    </div>
  )
}
