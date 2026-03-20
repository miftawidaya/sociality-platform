import api from '@/lib/api/client';
import type { ProfileResponse } from '../types/profile.types';
import type { FeedResponse } from '@/features/post/types';

const mapProfileResponse = (rawData: any): ProfileResponse => ({
  profile: {
    id: rawData.id || rawData.profile?.id,
    name: rawData.name || rawData.profile?.name,
    username: rawData.username || rawData.profile?.username,
    email: rawData.email || rawData.profile?.email,
    phone: rawData.phone || rawData.profile?.phone,
    bio: rawData.bio || rawData.profile?.bio,
    avatarUrl: rawData.avatarUrl || rawData.profile?.avatarUrl,
    isFollowedByMe: rawData.isFollowing ?? rawData.profile?.isFollowedByMe,
  },
  stats: {
    posts: rawData.counts?.post ?? rawData.stats?.posts ?? 0,
    followers: rawData.counts?.followers ?? rawData.stats?.followers ?? 0,
    following: rawData.counts?.following ?? rawData.stats?.following ?? 0,
    likes: rawData.counts?.likes ?? rawData.stats?.likes ?? 0,
  },
});

export const profileApi = {
  getMyProfile: async (token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<{ data: any }>('/api/me', config);
    return mapProfileResponse(response.data.data);
  },

  getUserProfile: async (username: string, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<{ data: any }>(`/api/users/${username}`, config);
    return mapProfileResponse(response.data.data);
  },

  getUserPosts: async (username: string, page = 1, limit = 10, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<FeedResponse>(`/api/users/${username}/posts`, {
      ...config,
      params: { page, limit },
    });
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

  updateProfile: async (data: any, token?: string) => {
    const formData = new FormData();
    
    // Map fields from data securely
    if (data.name) formData.append('name', data.name);
    if (data.username) formData.append('username', data.username);
    
    // Strict validators will reject empty strings for email/phone, so we ONLY append if they have length.
    if (data.email && data.email.trim() !== '') formData.append('email', data.email);
    if (data.phone && data.phone.trim() !== '') formData.append('phone', data.phone);
    
    // Allow bio to be explicitly empty if the user wants to clear it
    if (data.bio !== undefined && data.bio !== null) formData.append('bio', data.bio);
    
    // Handle File upload securely (works for File objects)
    if (data.avatar && typeof data.avatar === 'object' && 'name' in data.avatar) {
      formData.append('avatar', data.avatar);
    }
    
    // Always include avatarUrl as per curl example
    formData.append('avatarUrl', data.avatarUrl || 'string');

    // DO NOT set 'Content-Type': 'multipart/form-data' manually here!
    const response = await api.patch<{ data: any }>('/api/me', formData, {
      headers: {
        'Accept': '*/*',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return mapProfileResponse(response.data.data);
  },

  getFollowers: async (username: string, page = 1, limit = 20, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<{ data: { items: any[], pagination: any } }>(`/api/users/${username}/followers`, {
      ...config,
      params: { page, limit },
    });
    return response.data.data;
  },

  getFollowing: async (username: string, page = 1, limit = 20, token?: string) => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await api.get<{ data: { items: any[], pagination: any } }>(`/api/users/${username}/following`, {
      ...config,
      params: { page, limit },
    });
    return response.data.data;
  },

  followUser: async (username: string) => {
    const response = await api.post(`/api/follow/${username}`);
    return response.data;
  },

  unfollowUser: async (username: string) => {
    const response = await api.delete(`/api/follow/${username}`);
    return response.data;
  },
};
