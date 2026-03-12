'use client';

/**
 * Query key factory for auth-related queries.
 * Follows the pattern: all > me (current user profile).
 */
export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
} as const;
