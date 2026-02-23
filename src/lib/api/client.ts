import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

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

    if (process.env.NODE_ENV === 'development') {
      console.error(
        `[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url}:`,
        {
          status,
          message,
          data: error.response?.data,
        }
      );
    }

    /**
     * Session Revocation Handling (401 Unauthorized):
     * 1. Purge local auth credentials.
     * 2. Trigger redirect to login unless target is already an auth-related view
     *    to prevent redirection loops.
     */
    if (status === 401) {
      Cookies.remove('token');

      const authPages = ['/login', '/register', '/forgot-password'];
      const isAuthPage = authPages.some((page) => currentPath.startsWith(page));

      if (typeof window !== 'undefined' && !isAuthPage) {
        window.location.replace(
          `/login?callbackUrl=${encodeURIComponent(currentPath)}`
        );
      }
    }

    /**
     * Server Fault Handling (500+):
     * Reserved for global monitoring or toast notification triggers.
     */
    if (status && status >= 500) {
      console.warn('Integrated server-side fault detected.');
    }

    return Promise.reject(error);
  }
);

export default api;
