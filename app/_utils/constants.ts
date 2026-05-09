export const WELCOME_CONTENT = `# AGENTS.md Builder

Your AI coding agent is only as good as the context you give it.
\`AGENTS.md\` is how you do that — it's the file that tells your agent
your stack, your rules, your patterns, and how your team works.

Stop writing it by hand. Pick a category on the left, choose what fits
your project, and hit **Add to document**. Build it piece by piece,
exactly the way you work.

Drop the result in the root of your repo and your agent finally
knows what it's doing.

---

*Built by Seb · github.com/sebbzzzz/agents-builder*`

export const SELECT_THRESHOLD = 5
export const MOBILE_BREAKPOINT_PX = 768

export const TRIGGER_TEMPLATES: Array<{ id: string; label: string; prompt: string }> = [
  {
    id: "trigger-new-component",
    label: "When creating a new component",
    prompt: "Use `{skill}` when creating a new React component.",
  },
  {
    id: "trigger-new-test",
    label: "When writing a test",
    prompt: "Use `{skill}` when writing or updating any test file.",
  },
  {
    id: "trigger-new-api",
    label: "When adding an API route",
    prompt: "Use `{skill}` when creating a new API route or endpoint.",
  },
  {
    id: "trigger-refactor",
    label: "When asked to refactor",
    prompt: "Use `{skill}` when the user asks to refactor existing code.",
  },
  {
    id: "trigger-new-feature",
    label: "When starting a new feature",
    prompt: "Use `{skill}` when starting implementation of a new feature.",
  },
  {
    id: "trigger-pr-review",
    label: "When reviewing a PR",
    prompt: "Use `{skill}` when reviewing a pull request.",
  },
  {
    id: "trigger-debug",
    label: "When debugging an error",
    prompt: "Use `{skill}` when the user reports a bug or unexpected behavior.",
  },
  {
    id: "trigger-before-commit",
    label: "Before committing",
    prompt: "Use `{skill}` before every commit to validate code quality.",
  },
]

export const TRIGGER_TEMPLATE_MAP = new Map(TRIGGER_TEMPLATES.map((t) => [t.id, t]))
