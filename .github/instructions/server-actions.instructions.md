---
description: Apply these rules when creating or modifying server actions for data mutations in this project.
applyTo: '**/actions.ts'
---

# Server Actions

- All data mutations must use server actions. Server actions must be called from client components only.
- Server action files must be named `actions.ts` and colocated in the same directory as the client component that calls them.
- Do not use the `FormData` TypeScript type. All data passed to server actions must have explicit TypeScript types.
- Validate all incoming data with Zod before any logic runs.
- Always verify a logged-in user exists (via Clerk) before performing any database operation. Return an error early if no session is found.
- Never use Drizzle queries directly inside server actions. All database operations must go through helper functions located in the `/data` directory.

## Example structure

```ts
'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { createLink } from '@/data/links';

const schema = z.object({
  url: z.string().url(),
  slug: z.string().min(1),
});

export async function createLinkAction(input: { url: string; slug: string }) {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = schema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.flatten() };

  return await createLink({ ...parsed.data, userId });
}
```
