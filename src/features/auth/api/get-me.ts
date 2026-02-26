import api from '@/lib/api/client';
import type { AuthUser } from '../types';

const ME_ENDPOINT = '/api/me';

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
 * Fetches the currently authenticated user's profile and stats.
 * Unwraps the API envelope before returning.
 */
export async function getMeRequest(): Promise<MeResponse> {
  const response = await api.get<MeApiEnvelope>(ME_ENDPOINT);
  return response.data.data;
}
