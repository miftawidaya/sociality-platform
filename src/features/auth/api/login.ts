import api from '@/lib/api/client';
import type { LoginInput, AuthResponse } from '../types';
import { setSession } from './session';

const LOGIN_ENDPOINT = '/api/auth/login';

interface ApiEnvelope {
  readonly success: boolean;
  readonly message: string;
  readonly data: {
    readonly token: string;
    readonly user: AuthResponse['user'];
  };
}

/**
 * Sends login credentials to the server and stores the session token.
 * Returns the authenticated user and token on success.
 */
export async function loginRequest(data: LoginInput): Promise<AuthResponse> {
  const response = await api.post<ApiEnvelope>(LOGIN_ENDPOINT, data);

  const { user, token } = response.data.data;

  setSession(token);

  return { user, token };
}
