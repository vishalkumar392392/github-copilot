import { randomUUID } from 'crypto';
import { db } from '@/db';
import { links } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export async function getLinksByUserId(userId: string) {
  return db
    .select()
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.updatedAt));
}

export async function createLink(input: {
  slug: string;
  originalUrl: string;
  userId: string;
}) {
  const [link] = await db
    .insert(links)
    .values({ id: randomUUID(), ...input })
    .returning();
  return link;
}

export async function updateLink(
  id: string,
  userId: string,
  input: { slug: string; originalUrl: string },
) {
  const [link] = await db
    .update(links)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(links.id, id), eq(links.userId, userId)))
    .returning();
  return link;
}

export async function deleteLink(id: string, userId: string) {
  await db.delete(links).where(and(eq(links.id, id), eq(links.userId, userId)));
}
