export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  POSTS: {
    LIST: '/api/posts',
    CREATE: '/api/posts',
    DETAIL: (id: string | number) => `/api/posts/${id}`,
  },
  USER: {
    PROFILE: '/api/me',
  },
} as const;
