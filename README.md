# Linkshortner

A link shortener built with Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Clerk auth, Drizzle ORM, and Neon Postgres.

## AI Coding Tool Instructions

This Branch of the project uses a **tool-agnostic AI instruction approach** that works across all major AI code generation tools — not specific to any single one.

### Structure

- **[`AGENTS.md`](AGENTS.md)** (root level) — Top-level agent instructions covering stack overview, core coding rules, required reference docs, and validation steps. Consumed by any AI coding tool that reads an `AGENTS.md` at the project root.
- **[`docs/`](docs/)** — Domain-specific instruction files for the AI agent:
  - [`docs/llm-auth.md`](docs/llm-auth.md) — Clerk auth rules, route protection, modal sign-in/sign-up patterns.
  - [`docs/llm-ui.md`](docs/llm-ui.md) — shadcn/ui component rules and UI conventions.
  - [`docs/llm-augmentation-log.md`](docs/llm-augmentation-log.md) — Prompt and context logging rules for agent turns.

### Why this approach?

Placing instructions in `AGENTS.md` and `docs/*.md` is a **universal pattern** supported by all major AI coding tools:

| Tool                                 | How it picks up the instructions                                                               |
| ------------------------------------ | ---------------------------------------------------------------------------------------------- |
| **GitHub Copilot**                   | Reads `AGENTS.md` and `.github/copilot-instructions.md`; docs files can be attached as context |
| **Cursor**                           | Reads `AGENTS.md` and `.cursor/rules`; docs files referenced as context rules                  |
| **Claude (claude.ai / claude-code)** | Reads `AGENTS.md` natively as agent instructions                                               |
| **Codex / OpenAI**                   | Reads `AGENTS.md` as the agent system prompt                                                   |
| **Any LLM agent**                    | Can be handed `AGENTS.md` + relevant `docs/*.md` as system-level context                       |

The result is a single source of truth for coding conventions that any AI tool can consume without per-tool configuration duplication.

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
