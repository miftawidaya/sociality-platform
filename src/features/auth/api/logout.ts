import { clearSession } from './session';

/**
 * Clears the local session (cookie).
 * No server-side invalidation is needed; the JWT expires on its own.
 * If a server logout endpoint is added later, add the API call here.
 */
export async function logoutRequest(): Promise<void> {
  clearSession();
}
