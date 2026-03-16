export const PROFILE_KEYS = {
  all: ['profile'] as const,
  me: () => [...PROFILE_KEYS.all, 'me'] as const,
  user: (username: string) => [...PROFILE_KEYS.all, 'user', username] as const,
  userPosts: (username: string) => [...PROFILE_KEYS.all, 'posts', username] as const,
  userLikes: (username: string) => [...PROFILE_KEYS.all, 'likes', username] as const,
};
