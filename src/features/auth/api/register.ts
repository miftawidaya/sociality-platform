import api from '@/lib/api/client';
import type { RegisterInput, AuthResponse } from '../types';
import { setSession } from './session';

const REGISTER_ENDPOINT = '/api/auth/register';

interface ApiEnvelope {
  readonly success: boolean;
  readonly message: string;
  readonly data: {
    readonly token: string;
    readonly user: AuthResponse['user'];
  };
}

/**
 * Sends registration data to the server and stores the session token.
 * Returns the authenticated user and token on success.
 */
export async function registerRequest(
  data: RegisterInput
): Promise<AuthResponse> {
  const response = await api.post<ApiEnvelope>(REGISTER_ENDPOINT, data);

  const { user, token } = response.data.data;

  setSession(token);

  return { user, token };
}
