import api from '@/lib/api/client';
import type { AuthUser } from '../types';

const ME_ENDPOINT = '/api/me';

interface MeResponse {
  readonly profile: AuthUser;
  readonly stats: {
    readonly posts: number;
    readonly followers: number;
    readonly following: number;
    readonly likes: number;
  };
}

/**
 * Fetches the currently authenticated user's profile and stats.
 * Used to rehydrate the session after a page refresh.
 */
export async function getMeRequest(): Promise<MeResponse> {
  const response = await api.get<MeResponse>(ME_ENDPOINT);
  return response.data;
}
