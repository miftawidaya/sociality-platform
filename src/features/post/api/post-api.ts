import api from '@/lib/api/client';
import type { FeedResponse } from '../types';

export const postApi = {
  getFeed: async (page = 1, limit = 10, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<any>('/api/feed', {
      ...config,
      params: { page, limit },
    });
    return {
      posts: response.data.data.items || [],
      pagination: response.data.data.pagination,
    };
  },

  getExplorePosts: async (page = 1, limit = 10, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<FeedResponse>('/api/posts', {
      ...config,
      params: { page, limit },
    });
    return response.data.data;
  },

  likePost: async (postId: number) => {
    const response = await api.post(`/api/posts/${postId}/like`);
    return response.data;
  },

  unlikePost: async (postId: number) => {
    const response = await api.delete(`/api/posts/${postId}/like`);
    return response.data;
  },

  savePost: async (postId: number) => {
    const response = await api.post(`/api/posts/${postId}/save`);
    return response.data;
  },

  unsavePost: async (postId: number) => {
    const response = await api.delete(`/api/posts/${postId}/save`);
    return response.data;
  },

  getSavedPosts: async (page = 1, limit = 100, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<any>('/api/me/saved', {
      ...config,
      params: { page, limit },
    });
    return response.data.data;
  },

  checkSavedStatus: async (postId: number, token?: string) => {
    // Some backends return 200 with { saved: true }, others 404 for false.
    // So we wrap in try catch to handle 404 cleanly.
    try {
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
      const response = await api.get<{ data: { saved: boolean } }>(`/api/posts/${postId}/save`, config);
      return response.data.data.saved;
    } catch {
      return false;
    }
  },

  getPostById: async (
    postId: number,
    signal?: AbortSignal,
    token?: string
  ) => {
    const config: Record<string, unknown> = {};
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    if (signal) config.signal = signal;
    const response = await api.get(`/api/posts/${postId}`, config);
    return response.data;
  },

  getComments: async (
    postId: number,
    page = 1,
    limit = 10,
    signal?: AbortSignal,
    token?: string
  ) => {
    const config: Record<string, unknown> = { params: { page, limit } };
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    if (signal) config.signal = signal;
    const response = await api.get(
      `/api/posts/${postId}/comments`,
      config
    );
    return response.data;
  },

  createComment: async (postId: number, content: string) => {
    const response = await api.post(`/api/posts/${postId}/comments`, {
      text: content,
    });
    return response.data;
  },

  deleteComment: async (commentId: number) => {
    const response = await api.delete(`/api/comments/${commentId}`);
    return response.data;
  },
};
