import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getLinksByUserId,
  createLink,
  updateLink,
  deleteLink,
} from '@/data/links';

// Mock the db module
vi.mock('@/db', () => {
  const returningFn = vi.fn();
  const whereFn = vi.fn(() => ({ returning: returningFn }));
  const setFn = vi.fn(() => ({ where: whereFn }));
  const valuesFn = vi.fn(() => ({ returning: returningFn }));
  const orderByFn = vi.fn();
  const fromWhereFn = vi.fn(() => ({ orderBy: orderByFn }));
  const fromFn = vi.fn(() => ({ where: fromWhereFn }));
  const selectFn = vi.fn(() => ({ from: fromFn }));
  const insertFn = vi.fn(() => ({ values: valuesFn }));
  const updateFnInner = vi.fn(() => ({ set: setFn }));
  const deleteFnInner = vi.fn(() => ({ where: whereFn }));

  return {
    db: {
      select: selectFn,
      insert: insertFn,
      update: updateFnInner,
      delete: deleteFnInner,
      _mocks: {
        selectFn,
        fromFn,
        fromWhereFn,
        orderByFn,
        insertFn,
        valuesFn,
        returningFn,
        updateFnInner,
        setFn,
        whereFn,
        deleteFnInner,
      },
    },
  };
});

// Mock crypto.randomUUID
vi.mock('crypto', () => ({
  randomUUID: () => 'test-uuid-1234',
}));

// Access the mocked db
import { db } from '@/db';
const mocks = (
  db as unknown as { _mocks: Record<string, ReturnType<typeof vi.fn>> }
)._mocks;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getLinksByUserId', () => {
  it('queries links filtered by userId and ordered by updatedAt desc', async () => {
    const mockLinks = [
      {
        id: '1',
        slug: 'abc',
        originalUrl: 'https://example.com',
        userId: 'u1',
        clicks: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    mocks.orderByFn.mockResolvedValueOnce(mockLinks);

    const result = await getLinksByUserId('u1');

    expect(mocks.selectFn).toHaveBeenCalled();
    expect(result).toEqual(mockLinks);
  });

  it('returns an empty array when user has no links', async () => {
    mocks.orderByFn.mockResolvedValueOnce([]);

    const result = await getLinksByUserId('no-links-user');

    expect(result).toEqual([]);
  });
});

describe('createLink', () => {
  it('inserts a link with a generated UUID and returns it', async () => {
    const newLink = {
      id: 'test-uuid-1234',
      slug: 'my-slug',
      originalUrl: 'https://example.com',
      userId: 'u1',
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mocks.returningFn.mockResolvedValueOnce([newLink]);

    const result = await createLink({
      slug: 'my-slug',
      originalUrl: 'https://example.com',
      userId: 'u1',
    });

    expect(mocks.valuesFn).toHaveBeenCalledWith({
      id: 'test-uuid-1234',
      slug: 'my-slug',
      originalUrl: 'https://example.com',
      userId: 'u1',
    });
    expect(result).toEqual(newLink);
  });

  it('propagates database errors (e.g. unique constraint)', async () => {
    mocks.returningFn.mockRejectedValueOnce(
      new Error('unique constraint violation'),
    );

    await expect(
      createLink({ slug: 'dup', originalUrl: 'https://a.com', userId: 'u1' }),
    ).rejects.toThrow('unique constraint violation');
  });
});

describe('updateLink', () => {
  it('updates a link matching both id and userId', async () => {
    const updatedLink = {
      id: 'link-1',
      slug: 'new-slug',
      originalUrl: 'https://new.com',
      userId: 'u1',
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mocks.returningFn.mockResolvedValueOnce([updatedLink]);

    const result = await updateLink('link-1', 'u1', {
      slug: 'new-slug',
      originalUrl: 'https://new.com',
    });

    expect(result).toEqual(updatedLink);
  });

  it('returns undefined when no matching link exists', async () => {
    mocks.returningFn.mockResolvedValueOnce([]);

    const result = await updateLink('nonexistent', 'u1', {
      slug: 'x',
      originalUrl: 'https://x.com',
    });

    expect(result).toBeUndefined();
  });

  it('propagates database errors on update', async () => {
    mocks.returningFn.mockRejectedValueOnce(
      new Error('unique constraint violation'),
    );

    await expect(
      updateLink('link-1', 'u1', {
        slug: 'taken',
        originalUrl: 'https://a.com',
      }),
    ).rejects.toThrow('unique constraint violation');
  });
});

describe('deleteLink', () => {
  it('deletes a link matching both id and userId', async () => {
    mocks.whereFn.mockResolvedValueOnce(undefined);

    await expect(deleteLink('link-1', 'u1')).resolves.toBeUndefined();
    expect(mocks.deleteFnInner).toHaveBeenCalled();
  });

  it('does not throw when deleting a non-existent link', async () => {
    mocks.whereFn.mockResolvedValueOnce(undefined);

    await expect(deleteLink('ghost', 'u1')).resolves.toBeUndefined();
  });
});
