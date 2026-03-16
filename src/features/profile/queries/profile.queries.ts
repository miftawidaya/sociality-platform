import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import { PROFILE_KEYS } from './profile.keys';
import { postApi } from '@/features/post/api/post-api';

export function useMyProfile(isAuthenticated: boolean) {
  return useQuery({
    queryKey: PROFILE_KEYS.me(),
    queryFn: () => profileApi.getMyProfile(),
    enabled: isAuthenticated,
  });
}

export function useUserProfile(username: string) {
  return useQuery({
    queryKey: PROFILE_KEYS.user(username),
    queryFn: () => profileApi.getUserProfile(username),
    enabled: !!username,
  });
}

export function useUserPosts(username: string, limit = 9) {
  return useInfiniteQuery({
    queryKey: [...PROFILE_KEYS.userPosts(username), { limit }],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await profileApi.getUserPosts(username, pageParam, limit);
      // Fallback format for our feed structure
      const posts = (data as any).posts || (data as any).items || [];
      const pagination = data.pagination || {
        page: pageParam,
        totalPages: 1,
        total: posts.length,
      };

      return { posts, pagination };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.pagination.page;
      return currentPage < lastPage.pagination.totalPages
        ? currentPage + 1
        : undefined;
    },
    enabled: !!username,
  });
}

export function useSavedPosts(isAuthenticated: boolean, limit = 9) {
  return useInfiniteQuery({
    queryKey: ['saved', { limit }],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await postApi.getSavedPosts(pageParam, limit);
      const posts = (data as any).posts || (data as any).items || [];
      const pagination = data.pagination || {
        page: pageParam,
        totalPages: 1,
        total: posts.length,
      };
      return { posts, pagination };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.pagination.page;
      return currentPage < lastPage.pagination.totalPages
        ? currentPage + 1
        : undefined;
    },
    enabled: isAuthenticated,
  });
}

export function useUserLikes(username: string, isEnabled: boolean, limit = 9) {
  return useInfiniteQuery({
    queryKey: [...PROFILE_KEYS.userLikes(username), { limit }],
    queryFn: async ({ pageParam = 1 }) => {
      const data = await profileApi.getUserLikes(username, pageParam, limit);
      // Fallback format for our feed structure
      const posts = (data as any).posts || (data as any).items || [];
      const pagination = data.pagination || {
        page: pageParam,
        totalPages: 1,
        total: posts.length,
      };

      return { posts, pagination };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.pagination.page;
      return currentPage < lastPage.pagination.totalPages
        ? currentPage + 1
        : undefined;
    },
    enabled: isEnabled && !!username,
  });
}
