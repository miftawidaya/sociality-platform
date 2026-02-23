import { QueryClient } from '@tanstack/react-query';

/**
 * Global TanStack Query Client Configuration
 * Optimized for Sociality with reasonable stale times and retry logic.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1, // Retry once for failed requests
      refetchOnWindowFocus: false, // Avoid refetching when switching tabs
    },
    mutations: {
      retry: 0, // Don't retry mutations (like POST/PUT) by default
    },
  },
});
