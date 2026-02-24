import Cookies from 'js-cookie';

const TOKEN_KEY = 'token';
const TOKEN_EXPIRY_DAYS = 7;

/**
 * Persists the authentication token in a secure, same-site cookie.
 * Centralized here to avoid duplicating cookie config across API functions.
 */
export function setSession(token: string): void {
  Cookies.set(TOKEN_KEY, token, {
    expires: TOKEN_EXPIRY_DAYS,
    secure: true,
    sameSite: 'strict',
  });
}

/**
 * Removes the authentication token cookie, ending the session.
 */
export function clearSession(): void {
  Cookies.remove(TOKEN_KEY);
}
