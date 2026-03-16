'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

import { setCredentials } from '@/store/slices/authSlice';
import { getMeRequest } from '../api/auth.api';
import { AUTH_ONLY_ROUTES } from '@/config/routes';
import { isValidJwtStructure, isJwtExpired } from '@/lib/utils/jwt';
import type { RootState } from '@/store';

/**
 * Rehydrates Redux auth state from the server on mount.
 * Checks if a token cookie exists but Redux has no user data
 * (happens after page reload), then fetches /api/me to restore
 * the session.
 */
export function useSessionRehydration() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = Cookies.get('token');
    const isAuthPage = AUTH_ONLY_ROUTES.has(pathname);

    if (!token || isAuthenticated || isAuthPage) return;

    if (!isValidJwtStructure(token) || isJwtExpired(token)) {
      Cookies.remove('token');
      return;
    }

    let cancelled = false;

    async function rehydrate() {
      try {
        const { profile } = await getMeRequest();

        if (cancelled === false) {
          dispatch(
            setCredentials({
              id: profile.id,
              name: profile.name,
              username: profile.username,
              email: profile.email,
              avatarUrl: profile.avatarUrl,
              phone: profile.phone,
            })
          );
        }
      } catch {
        Cookies.remove('token');
      }
    }

    rehydrate();

    return () => {
      cancelled = true;
    };
  }, [dispatch, isAuthenticated, pathname]);
}
