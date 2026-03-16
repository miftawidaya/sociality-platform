import api from '@/lib/api/client';
import type { ProfileResponse } from '../types/profile.types';
import type { FeedResponse } from '@/features/post/types';

export const profileApi = {
  getMyProfile: async (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<{ data: ProfileResponse }>('/api/me', config);
    return response.data.data;
  },

  getUserProfile: async (username: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<{ data: ProfileResponse }>(`/api/users/${username}`, config);
    return response.data.data;
  },

  getUserPosts: async (username: string, page = 1, limit = 10, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<FeedResponse>(`/api/users/${username}/posts`, {
      ...config,
      params: { page, limit },
    });
    // In our architecture, the `getExplorePosts` returns `data.data` from Axios structure if FeedResponse matches the full payload format
    return response.data.data;
  },

  getUserLikes: async (username: string, page = 1, limit = 10, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<FeedResponse>(`/api/users/${username}/likes`, {
      ...config,
      params: { page, limit },
    });
    return response.data.data;
  },

  // Added getSavedPosts to feature/profile or we can use the one from postApi.
  // Actually, postApi already has getSavedPosts. Let's just use it when needed, or redefine it here if clean separation is preferred. 
  // We'll import `postApi` directly inside `profile.queries.ts`.
};
