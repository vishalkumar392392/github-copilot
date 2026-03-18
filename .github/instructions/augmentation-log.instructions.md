---
description: This file defines the rules for logging all interactions with LLM agents in this repository. It specifies what information to capture, how to format log entries, and where to store them.
---

# Augmentation Log — Agent Rules

## Purpose

This file defines how every LLM prompt interaction and its chat window context must be recorded. The log acts as a persistent audit trail for all agent-assisted work in this repository.

## What to Log

Every prompt interaction must capture:

- **Timestamp** — date and time the prompt was issued (ISO 8601, UTC).
- **Prompt** — the exact user request or instruction sent to the agent.
- **Context** — any editor context, file attachments, selected code, or referenced docs that were active at the time.
- **Response summary** — a concise (1–3 sentence) summary of what the agent did or produced.
- **Files changed** — list of files created, edited, or deleted as a result.

## Log Location

Store all log entries in `logs/augmentation-log.json` — one JSON object per line (JSONL format). Do not use a plain `.md` file for entries; structured JSONL allows reliable querying and diffing.

## Entry Schema

```jsonschema
{
  "timestamp": "2026-03-16T10:00:00Z",  // ISO 8601 UTC
  "prompt": "string — full user prompt text",
  "context": {
    "activeFile": "string | null",
    "attachments": ["array of filenames or IDs"],
    "referencedDocs": ["logs/*.md files read"]
  },
  "responseSummary": "string — brief description of agent output",
  "filesChanged": ["relative/path/to/file"]
}
```

## Rules

- Append a new entry after **every** agent turn that produces a code change, file creation, or configuration edit.
- Do not retroactively edit past entries. Corrections should be new entries referencing the original timestamp.
- Keep `responseSummary` factual and brief — do not include opinions or speculative notes.
- If no files were changed (e.g., a read-only explanation), `filesChanged` may be an empty array but the entry must still be written.
- The log file (`logs/augmentation-log.jsonl`) must be committed alongside any code changes it describes.
