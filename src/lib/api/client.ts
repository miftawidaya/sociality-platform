import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { ROUTES, AUTH_ONLY_ROUTES } from '@/config/routes';

/**
 * Extended AxiosError to include standardized error messages
 * used throughout the application's notification system.
 */
export interface ApiError extends AxiosError {
  message: string;
}

/**
 * Core API Client instance.
 * Configuration includes:
 * - Base URL from environment variables.
 * - 10s timeout for fail-fast behavior.
 * - Standard JSON headers.
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor
 * Injects Authorization header using Bearer token strategy.
 * Token is sourced from Cookies to maintain synchronization between
 * Client Components and middleware/server-side fetches.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get('token');

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Orchestrates global error handling, session lifecycle management,
 * and data normalization.
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const currentPath =
      typeof window !== 'undefined' ? window.location.pathname : '';

    /**
     * Error Normalization:
     * Extract specific error messages from API payload or fallback to
     * generic Axios error state.
     */
    const message =
      (error.response?.data as any)?.message ||
      error.message ||
      'An unexpected error occurred';
    (error as ApiError).message = message;

    /**
     * Session Revocation Handling (401 Unauthorized):
     * Purge local auth credentials and redirect to login unless:
     * - Already on an auth page (prevents loops)
     * - The request itself was to an auth endpoint (login/register)
     */
    if (status === 401) {
      const requestUrl = error.config?.url ?? '';
      const isAuthRequest = requestUrl.includes('/auth/');

      if (isAuthRequest === false) {
        Cookies.remove('token');

        const isAuthPage = AUTH_ONLY_ROUTES.has(currentPath);

        if (typeof window !== 'undefined' && isAuthPage === false) {
          window.location.replace(
            `${ROUTES.LOGIN}?callbackUrl=${encodeURIComponent(currentPath)}`
          );
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
