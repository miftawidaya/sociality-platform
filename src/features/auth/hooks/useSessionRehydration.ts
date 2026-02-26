'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';

import { setCredentials } from '@/store/slices/authSlice';
import { getMeRequest } from '../api/get-me';
import type { RootState } from '@/store';

/**
 * Rehydrates Redux auth state from the server on mount.
 * Checks if a token cookie exists but Redux has no user data
 * (happens after page reload), then fetches /api/me to restore
 * the session.
 */
export function useSessionRehydration() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const token = Cookies.get('token');
    const shouldRehydrate = token && isAuthenticated === false;

    if (shouldRehydrate === false) return;

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
        // Token is invalid or expired; cookie will be cleared by
        // the 401 interceptor automatically.
      }
    }

    rehydrate();

    return () => {
      cancelled = true;
    };
  }, [dispatch, isAuthenticated]);
}
