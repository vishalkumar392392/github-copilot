# Linkshortner Agent Instructions

These instructions apply to all LLM work in this repository. Keep changes minimal, production-oriented, and consistent with the current stack.

## Project Snapshot

- Stack: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui with the `radix-nova` style, Clerk auth, Drizzle ORM, Neon Postgres.
- Status: early-stage product scaffold. Some files still contain generated starter code and some backend files are intentionally empty.
- Goal: build real product behavior for a link shortener without drifting into template-only code or broad speculative refactors.

## Core Rules

- Prefer server components, server-side data loading, and server actions or route handlers unless client interactivity is required.
- Keep TypeScript strict. Do not bypass types with `any`, broad casts, or non-null assertions unless there is no practical alternative.
- Reuse the existing alias and utility patterns: `@/...` imports and the `cn` helper from `lib/utils.ts`.
- Favor existing shadcn/ui primitives before adding custom low-level UI elements.
- Do not add new dependencies unless the feature clearly needs them and the built-in stack cannot cover the requirement.
- Keep comments sparse and only add them when they clarify non-obvious intent.
- Preserve user changes. Do not rewrite unrelated generated files just because they are scaffolded.

## Required Reference Docs — CRITICAL

**You MUST read the relevant `docs/*.md` file(s) BEFORE generating ANY code.** This is non-negotiable and applies to every task, no matter how small. Do not rely on memory or assumptions — open and read the file first. Skipping this step leads to incorrect patterns, wasted effort, and rework.

- `docs/llm-auth.md` — Clerk auth rules, route protection, modal sign-in/sign-up. Read before any auth, middleware, or route-guard work.
- `docs/llm-ui.md` — shadcn/ui component rules, no custom UI elements. Read before any UI or component work.

## Minimum Validation

- Run `npm run lint` after code changes when the task touches TypeScript, React, or config files.
- If the change affects schema or data access, verify the Drizzle and env assumptions described in `docs/llm-data-auth.md`.
- If you cannot run validation, state that explicitly in your final response.
