'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { createLink, updateLink, deleteLink } from '@/data/links';
import { checkRateLimit } from '@/lib/rate-limit';

const createLinkSchema = z.object({
  url: z
    .string()
    .url('Please enter a valid URL.')
    .refine(
      (u) => u.startsWith('http://') || u.startsWith('https://'),
      'Only HTTP and HTTPS URLs are allowed.',
    ),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      'Slug may only contain lowercase letters, numbers, and hyphens.',
    )
    .optional(),
});

export async function createLinkAction(input: { url: string; slug?: string }) {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const { limited } = checkRateLimit(userId);
  if (limited) return { error: 'Too many requests. Please try again later.' };

  const parsed = createLinkSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors,
    ).flat()[0];
    return { error: firstError ?? 'Invalid input.' };
  }

  const slug = parsed.data.slug || Math.random().toString(36).slice(2, 8);

  try {
    const link = await createLink({
      originalUrl: parsed.data.url,
      slug,
      userId,
    });
    revalidatePath('/dashboard');
    return { link };
  } catch (e) {
    if (e instanceof Error && e.message.toLowerCase().includes('unique')) {
      return { error: 'That slug is already taken. Try a different one.' };
    }
    return { error: 'Failed to create link. Please try again.' };
  }
}

const updateLinkSchema = z.object({
  url: z
    .string()
    .url('Please enter a valid URL.')
    .refine(
      (u) => u.startsWith('http://') || u.startsWith('https://'),
      'Only HTTP and HTTPS URLs are allowed.',
    ),
  slug: z
    .string()
    .min(1)
    .max(50)
    .regex(
      /^[a-z0-9-]+$/,
      'Slug may only contain lowercase letters, numbers, and hyphens.',
    ),
});

export async function updateLinkAction(input: {
  id: string;
  url: string;
  slug: string;
}) {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  const parsed = updateLinkSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = Object.values(
      parsed.error.flatten().fieldErrors,
    ).flat()[0];
    return { error: firstError ?? 'Invalid input.' };
  }

  try {
    const link = await updateLink(input.id, userId, {
      originalUrl: parsed.data.url,
      slug: parsed.data.slug,
    });
    if (!link) return { error: 'Link not found.' };
    revalidatePath('/dashboard');
    return { link };
  } catch (e) {
    if (e instanceof Error && e.message.toLowerCase().includes('unique')) {
      return { error: 'That slug is already taken. Try a different one.' };
    }
    return { error: 'Failed to update link. Please try again.' };
  }
}

export async function deleteLinkAction(input: { id: string }) {
  const { userId } = await auth();
  if (!userId) return { error: 'Unauthorized' };

  await deleteLink(input.id, userId);
  revalidatePath('/dashboard');
  return { success: true };
}
