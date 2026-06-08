# groundwork

**groundwork** is a decision guide that helps developers build `AGENTS.md` files for their projects. Not a form filler — a discovery tool. Browse categories, explore options with tradeoff context, and watch your file build itself in real time.

## What it does

Most tools assume you already know what to write. This tool helps you figure out what you should decide _before_ you write any code.

- Browse architectural categories (tech stack, conventions, patterns, etc.)
- Each option includes a tooltip explaining the tradeoff
- Selections appear instantly in a live markdown preview
- Edit any line inline, then copy or export the final `.md` file

## Who it's for

Developers starting a new project from scratch who use AI coding tools (Claude Code, Cursor, Codex, Gemini CLI, Windsurf, etc.) and feel friction when writing their `AGENTS.md` file.

## Tech stack

Next.js 15 · React 19 · Tailwind CSS 4

## Getting started

```bash
yarn        # install dependencies
yarn dev    # start dev server at http://localhost:3000
```

## Other commands

```bash
yarn build          # production build
yarn lint           # run ESLint
yarn lint:fix       # auto-fix lint issues
yarn format:write   # auto-format code
yarn typecheck      # TypeScript type check
```
