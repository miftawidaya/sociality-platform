'use client';

import { useCallback } from 'react';
import { clearSession } from '../api/session';
import { ROUTES } from '@/config/routes';

/**
 * Returns a logout function that instantly clears the session
 * and hard-redirects to login. No async overhead.
 */
export function useLogout() {
  return useCallback(() => {
    clearSession();
    window.location.replace(ROUTES.LOGIN);
  }, []);
}
