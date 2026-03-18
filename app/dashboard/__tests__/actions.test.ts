import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock next/cache before importing actions
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

// Mock Clerk auth
const mockAuth = vi.fn();
vi.mock('@clerk/nextjs/server', () => ({
  auth: () => mockAuth(),
}));

// Mock data helpers
const mockCreateLink = vi.fn();
const mockUpdateLink = vi.fn();
const mockDeleteLink = vi.fn();
vi.mock('@/data/links', () => ({
  createLink: (...args: unknown[]) => mockCreateLink(...args),
  updateLink: (...args: unknown[]) => mockUpdateLink(...args),
  deleteLink: (...args: unknown[]) => mockDeleteLink(...args),
}));

import {
  createLinkAction,
  updateLinkAction,
  deleteLinkAction,
} from '@/app/dashboard/actions';
import { revalidatePath } from 'next/cache';

beforeEach(() => {
  vi.clearAllMocks();
  mockAuth.mockResolvedValue({ userId: 'user-1' });
});

// ─── createLinkAction ────────────────────────────────────────────

describe('createLinkAction', () => {
  it('returns error when user is not authenticated', async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });

    const result = await createLinkAction({ url: 'https://example.com' });

    expect(result).toEqual({ error: 'Unauthorized' });
    expect(mockCreateLink).not.toHaveBeenCalled();
  });

  it('returns validation error for an invalid URL', async () => {
    const result = await createLinkAction({ url: 'not-a-url' });

    expect(result).toHaveProperty('error');
    expect(mockCreateLink).not.toHaveBeenCalled();
  });

  it('returns validation error for empty URL string', async () => {
    const result = await createLinkAction({ url: '' });

    expect(result).toHaveProperty('error');
    expect(mockCreateLink).not.toHaveBeenCalled();
  });

  it('returns validation error for slug with uppercase letters', async () => {
    const result = await createLinkAction({
      url: 'https://example.com',
      slug: 'MySlug',
    });

    expect(result).toHaveProperty('error');
    expect((result as { error: string }).error).toContain('lowercase');
  });

  it('returns validation error for slug with spaces', async () => {
    const result = await createLinkAction({
      url: 'https://example.com',
      slug: 'my slug',
    });

    expect(result).toHaveProperty('error');
  });

  it('returns validation error for slug with special characters', async () => {
    const result = await createLinkAction({
      url: 'https://example.com',
      slug: 'my_slug!',
    });

    expect(result).toHaveProperty('error');
  });

  it('returns validation error for slug exceeding 50 characters', async () => {
    const longSlug = 'a'.repeat(51);
    const result = await createLinkAction({
      url: 'https://example.com',
      slug: longSlug,
    });

    expect(result).toHaveProperty('error');
  });

  it('creates a link with a custom slug', async () => {
    const link = {
      id: '1',
      slug: 'my-link',
      originalUrl: 'https://example.com',
      userId: 'user-1',
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCreateLink.mockResolvedValueOnce(link);

    const result = await createLinkAction({
      url: 'https://example.com',
      slug: 'my-link',
    });

    expect(result).toEqual({ link });
    expect(mockCreateLink).toHaveBeenCalledWith({
      originalUrl: 'https://example.com',
      slug: 'my-link',
      userId: 'user-1',
    });
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it('generates a random slug when none is provided', async () => {
    const link = {
      id: '1',
      slug: 'abc123',
      originalUrl: 'https://example.com',
      userId: 'user-1',
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCreateLink.mockResolvedValueOnce(link);

    const result = await createLinkAction({ url: 'https://example.com' });

    expect(result).toHaveProperty('link');
    expect(mockCreateLink).toHaveBeenCalledWith(
      expect.objectContaining({
        originalUrl: 'https://example.com',
        userId: 'user-1',
      }),
    );
    // slug should be auto-generated (non-empty)
    const call = mockCreateLink.mock.calls[0][0];
    expect(call.slug).toBeTruthy();
    expect(call.slug.length).toBeGreaterThan(0);
  });

  it('returns validation error when slug is an empty string (fails min length)', async () => {
    const result = await createLinkAction({
      url: 'https://example.com',
      slug: '',
    });

    expect(result).toHaveProperty('error');
    expect(mockCreateLink).not.toHaveBeenCalled();
  });

  it('returns error when slug is already taken (unique constraint)', async () => {
    mockCreateLink.mockRejectedValueOnce(
      new Error('unique constraint violation'),
    );

    const result = await createLinkAction({
      url: 'https://example.com',
      slug: 'taken',
    });

    expect(result).toEqual({
      error: 'That slug is already taken. Try a different one.',
    });
  });

  it('returns generic error for unexpected database failures', async () => {
    mockCreateLink.mockRejectedValueOnce(new Error('connection timeout'));

    const result = await createLinkAction({
      url: 'https://example.com',
      slug: 'ok-slug',
    });

    expect(result).toEqual({
      error: 'Failed to create link. Please try again.',
    });
  });

  it('accepts valid slugs with hyphens and numbers', async () => {
    const link = {
      id: '1',
      slug: 'my-link-2',
      originalUrl: 'https://example.com',
      userId: 'user-1',
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCreateLink.mockResolvedValueOnce(link);

    const result = await createLinkAction({
      url: 'https://example.com',
      slug: 'my-link-2',
    });

    expect(result).toEqual({ link });
  });

  it('accepts URL with query params and fragments', async () => {
    const link = {
      id: '1',
      slug: 'q',
      originalUrl: 'https://example.com/path?key=val#section',
      userId: 'user-1',
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCreateLink.mockResolvedValueOnce(link);

    const result = await createLinkAction({
      url: 'https://example.com/path?key=val#section',
      slug: 'q',
    });

    expect(result).toEqual({ link });
  });
});

// ─── updateLinkAction ────────────────────────────────────────────

describe('updateLinkAction', () => {
  it('returns error when user is not authenticated', async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });

    const result = await updateLinkAction({
      id: 'link-1',
      url: 'https://updated.com',
      slug: 'updated',
    });

    expect(result).toEqual({ error: 'Unauthorized' });
    expect(mockUpdateLink).not.toHaveBeenCalled();
  });

  it('returns validation error for an invalid URL', async () => {
    const result = await updateLinkAction({
      id: 'link-1',
      url: 'bad',
      slug: 'ok',
    });

    expect(result).toHaveProperty('error');
    expect(mockUpdateLink).not.toHaveBeenCalled();
  });

  it('returns validation error for an empty slug', async () => {
    const result = await updateLinkAction({
      id: 'link-1',
      url: 'https://example.com',
      slug: '',
    });

    expect(result).toHaveProperty('error');
  });

  it('returns validation error for slug with invalid characters', async () => {
    const result = await updateLinkAction({
      id: 'link-1',
      url: 'https://example.com',
      slug: 'BAD_slug!',
    });

    expect(result).toHaveProperty('error');
  });

  it('updates a link successfully', async () => {
    const link = {
      id: 'link-1',
      slug: 'new-slug',
      originalUrl: 'https://updated.com',
      userId: 'user-1',
      clicks: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockUpdateLink.mockResolvedValueOnce(link);

    const result = await updateLinkAction({
      id: 'link-1',
      url: 'https://updated.com',
      slug: 'new-slug',
    });

    expect(result).toEqual({ link });
    expect(mockUpdateLink).toHaveBeenCalledWith('link-1', 'user-1', {
      originalUrl: 'https://updated.com',
      slug: 'new-slug',
    });
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it('returns error when link is not found', async () => {
    mockUpdateLink.mockResolvedValueOnce(undefined);

    const result = await updateLinkAction({
      id: 'nonexistent',
      url: 'https://example.com',
      slug: 'valid',
    });

    expect(result).toEqual({ error: 'Link not found.' });
  });

  it('returns error when slug is already taken (unique constraint)', async () => {
    mockUpdateLink.mockRejectedValueOnce(
      new Error('unique constraint violation'),
    );

    const result = await updateLinkAction({
      id: 'link-1',
      url: 'https://example.com',
      slug: 'taken',
    });

    expect(result).toEqual({
      error: 'That slug is already taken. Try a different one.',
    });
  });

  it('returns generic error for unexpected database failures', async () => {
    mockUpdateLink.mockRejectedValueOnce(new Error('timeout'));

    const result = await updateLinkAction({
      id: 'link-1',
      url: 'https://example.com',
      slug: 'fine',
    });

    expect(result).toEqual({
      error: 'Failed to update link. Please try again.',
    });
  });
});

// ─── deleteLinkAction ────────────────────────────────────────────

describe('deleteLinkAction', () => {
  it('returns error when user is not authenticated', async () => {
    mockAuth.mockResolvedValueOnce({ userId: null });

    const result = await deleteLinkAction({ id: 'link-1' });

    expect(result).toEqual({ error: 'Unauthorized' });
    expect(mockDeleteLink).not.toHaveBeenCalled();
  });

  it('deletes a link and revalidates the dashboard', async () => {
    mockDeleteLink.mockResolvedValueOnce(undefined);

    const result = await deleteLinkAction({ id: 'link-1' });

    expect(result).toEqual({ success: true });
    expect(mockDeleteLink).toHaveBeenCalledWith('link-1', 'user-1');
    expect(revalidatePath).toHaveBeenCalledWith('/dashboard');
  });

  it('succeeds even when the link does not exist', async () => {
    mockDeleteLink.mockResolvedValueOnce(undefined);

    const result = await deleteLinkAction({ id: 'ghost' });

    expect(result).toEqual({ success: true });
  });
});
