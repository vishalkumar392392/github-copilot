/** Simple in-memory sliding-window rate limiter keyed by user ID. */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

/**
 * Check whether `userId` has exceeded `maxRequests` within the
 * sliding `windowMs` period. Expired timestamps are pruned on each call.
 */
export function checkRateLimit(
  userId: string,
  { maxRequests = 10, windowMs = 60_000 } = {},
): { limited: boolean } {
  const now = Date.now();
  const entry = store.get(userId) ?? { timestamps: [] };

  // Remove timestamps outside the current window
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= maxRequests) {
    store.set(userId, entry);
    return { limited: true };
  }

  entry.timestamps.push(now);
  store.set(userId, entry);
  return { limited: false };
}
