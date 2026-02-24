'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { loginRequest } from '../api/login';
import { setCredentials } from '@/store/slices/authSlice';
import { ROUTES } from '@/config/routes';
import type { LoginInput, AuthResponse } from '../types';

interface UseLoginOptions {
  /** URL to redirect to after successful login. Defaults to ROUTES.FEED. */
  readonly callbackUrl?: string;
}

/**
 * TanStack Query mutation hook for user login.
 * Handles: server request, session persistence, Redux sync, and redirect.
 */
export function useLoginMutation(options?: UseLoginOptions) {
  const router = useRouter();
  const dispatch = useDispatch();
  const redirectTo = options?.callbackUrl ?? ROUTES.FEED;

  return useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: loginRequest,
    onSuccess: ({ user }) => {
      dispatch(setCredentials(user));
      router.push(redirectTo);
      router.refresh();
    },
  });
}
