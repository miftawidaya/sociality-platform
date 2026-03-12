import api from '@/lib/api/client';
import type {
  LoginInput,
  RegisterInput,
  AuthResponse,
  AuthUser,
} from '../types/auth.types';
import { setSession } from './session';

const LOGIN_ENDPOINT = '/api/auth/login';
const REGISTER_ENDPOINT = '/api/auth/register';
const ME_ENDPOINT = '/api/me';

interface AuthApiEnvelope {
  readonly success: boolean;
  readonly message: string;
  readonly data: {
    readonly token: string;
    readonly user: AuthResponse['user'];
  };
}

interface MeApiEnvelope {
  readonly success: boolean;
  readonly message: string;
  readonly data: {
    readonly profile: AuthUser;
    readonly stats: {
      readonly posts: number;
      readonly followers: number;
      readonly following: number;
      readonly likes: number;
    };
  };
}

interface MeResponse {
  readonly profile: AuthUser;
  readonly stats: MeApiEnvelope['data']['stats'];
}

/**
 * Sends login credentials to the server and stores the session token.
 * Returns the authenticated user and token on success.
 */
export async function loginRequest(data: LoginInput): Promise<AuthResponse> {
  const response = await api.post<AuthApiEnvelope>(LOGIN_ENDPOINT, data);

  const { user, token } = response.data.data;

  setSession(token);

  return { user, token };
}

/**
 * Sends registration data to the server and stores the session token.
 * Returns the authenticated user and token on success.
 */
export async function registerRequest(
  data: RegisterInput
): Promise<AuthResponse> {
  const response = await api.post<AuthApiEnvelope>(REGISTER_ENDPOINT, data);

  const { user, token } = response.data.data;

  setSession(token);

  return { user, token };
}

/**
 * Fetches the currently authenticated user's profile and stats.
 * Unwraps the API envelope before returning.
 */
export async function getMeRequest(): Promise<MeResponse> {
  const response = await api.get<MeApiEnvelope>(ME_ENDPOINT);
  return response.data.data;
}
