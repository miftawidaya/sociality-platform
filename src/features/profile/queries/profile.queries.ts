import { toast } from 'sonner';
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { profileApi } from '../api/profile.api';
import { PROFILE_KEYS } from './profile.keys';
import { postApi } from '@/features/post/api/post-api';
import { ProfileResponse } from '../types/profile.types';

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
      const posts = data.posts || data.items || [];
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

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      data: Partial<{
        name: string;
        username: string;
        bio: string;
        email: string;
        phone: string;
      }>
    ) => profileApi.updateProfile(data),
    onMutate: async (newData) => {
      // Get current username for the query key
      const currentProfile = queryClient.getQueryData<ProfileResponse>(
        PROFILE_KEYS.me()
      );
      const username = currentProfile?.profile.username;

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: PROFILE_KEYS.me() });
      if (username) {
        await queryClient.cancelQueries({
          queryKey: PROFILE_KEYS.user(username),
        });
      }

      // Snapshot the previous value
      const previousMe = queryClient.getQueryData<ProfileResponse>(
        PROFILE_KEYS.me()
      );
      const previousUser = username
        ? queryClient.getQueryData<ProfileResponse>(PROFILE_KEYS.user(username))
        : null;

      const optimisticProfileData = {
        ...newData,
        avatarUrl:
          (newData as any).avatarPreview || previousMe?.profile?.avatarUrl,
      };

      // Optimistically update to the new value
      if (previousMe) {
        queryClient.setQueryData<ProfileResponse>(PROFILE_KEYS.me(), {
          ...previousMe,
          profile: { ...previousMe.profile, ...optimisticProfileData },
        });
      }
      if (username && previousUser) {
        queryClient.setQueryData<ProfileResponse>(PROFILE_KEYS.user(username), {
          ...previousUser,
          profile: { ...previousUser.profile, ...optimisticProfileData },
        });
      }

      // Show toast immediately for instant feedback
      toast.success('Profile Success Update');

      return { previousMe, previousUser, username };
    },
    onError: (err, newData, context) => {
      // Rollback
      if (context?.previousMe) {
        queryClient.setQueryData(PROFILE_KEYS.me(), context.previousMe);
      }
      if (context?.username && context?.previousUser) {
        queryClient.setQueryData(
          PROFILE_KEYS.user(context.username),
          context.previousUser
        );
      }
      toast.error('Failed to update profile');
    },
    onSuccess: (data) => {
      // Success toast moved to onMutate for instant feedback
    },
    onSettled: (data, err, variables, context) => {
      // Invalidate both current profile and 'me' query
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.me() });
      if (context?.username) {
        queryClient.invalidateQueries({
          queryKey: PROFILE_KEYS.user(context.username),
        });
      }
    },
  });
}

export function useFollowers(username: string, isEnabled: boolean, limit = 20) {
  return useInfiniteQuery({
    queryKey: [...PROFILE_KEYS.user(username), 'followers', { limit }],
    queryFn: ({ pageParam = 1 }) =>
      profileApi.getFollowers(username, pageParam, limit),
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

export function useFollowing(username: string, isEnabled: boolean, limit = 20) {
  return useInfiniteQuery({
    queryKey: [...PROFILE_KEYS.user(username), 'following', { limit }],
    queryFn: ({ pageParam = 1 }) =>
      profileApi.getFollowing(username, pageParam, limit),
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

export function useFollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => profileApi.followUser(username),
    onMutate: async (username) => {
      await queryClient.cancelQueries({
        queryKey: PROFILE_KEYS.user(username),
      });
      const previousProfile = queryClient.getQueryData<ProfileResponse>(
        PROFILE_KEYS.user(username)
      );

      if (previousProfile) {
        queryClient.setQueryData<ProfileResponse>(PROFILE_KEYS.user(username), {
          ...previousProfile,
          profile: {
            ...previousProfile.profile,
            isFollowedByMe: true,
          },
          stats: {
            ...previousProfile.stats,
            followers: previousProfile.stats.followers + 1,
          },
        });
      }

      return { previousProfile };
    },
    onError: (err, username, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(
          PROFILE_KEYS.user(username),
          context.previousProfile
        );
      }
    },
    onSettled: (data, err, username) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.user(username) });
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.me() });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (username: string) => profileApi.unfollowUser(username),
    onMutate: async (username) => {
      await queryClient.cancelQueries({
        queryKey: PROFILE_KEYS.user(username),
      });
      const previousProfile = queryClient.getQueryData<ProfileResponse>(
        PROFILE_KEYS.user(username)
      );

      if (previousProfile) {
        queryClient.setQueryData<ProfileResponse>(PROFILE_KEYS.user(username), {
          ...previousProfile,
          profile: {
            ...previousProfile.profile,
            isFollowedByMe: false,
          },
          stats: {
            ...previousProfile.stats,
            followers: Math.max(0, previousProfile.stats.followers - 1),
          },
        });
      }

      return { previousProfile };
    },
    onError: (err, username, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(
          PROFILE_KEYS.user(username),
          context.previousProfile
        );
      }
    },
    onSettled: (data, err, username) => {
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.user(username) });
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.me() });
    },
  });
}
