'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { registerRequest } from '../api/register';
import { setCredentials } from '@/store/slices/authSlice';
import { ROUTES } from '@/config/routes';
import type { RegisterInput, AuthResponse } from '../types';

/**
 * TanStack Query mutation hook for user registration.
 * Handles: server request, session persistence, Redux sync, and redirect.
 */
export function useRegisterMutation() {
  const router = useRouter();
  const dispatch = useDispatch();

  return useMutation<AuthResponse, Error, RegisterInput>({
    mutationFn: registerRequest,
    onSuccess: ({ user }) => {
      dispatch(setCredentials(user));
      router.push(ROUTES.FEED);
      router.refresh();
    },
  });
}
