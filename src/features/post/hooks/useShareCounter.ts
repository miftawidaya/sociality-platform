'use client';

import * as React from 'react';

/**
 * Hook to manage share counts for a specific post using localStorage.
 * This is used because the backend doesn't support share counts yet.
 */
export function useShareCounter(postId: number) {
  const getKey = React.useCallback((id: number) => `post_shares_${id}`, []);

  const [count, setCount] = React.useState<number>(0);

  // Initialize count from localStorage
  React.useEffect(() => {
    const saved = localStorage.getItem(getKey(postId));
    if (saved) {
      const parsed = Number.parseInt(saved, 10);
      if (!Number.isNaN(parsed)) {
        setCount(parsed);
      }
    }
  }, [postId, getKey]);

  const increment = React.useCallback(() => {
    setCount((prev) => {
      const next = prev + 1;
      localStorage.setItem(getKey(postId), next.toString());
      return next;
    });
  }, [postId, getKey]);

  return {
    count,
    increment,
  };
}
