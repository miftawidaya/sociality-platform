export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FEED: '/feed',
  PROFILE: '/me',
  DEV: '/dev',
} as const;

export const AUTH_ONLY_ROUTES: Set<string> = new Set([
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
]);

export const PROTECTED_ROUTES: Set<string> = new Set([
  ROUTES.FEED,
  ROUTES.PROFILE,
]);

export const PROTECTED_PREFIXES: readonly string[] = ['/me/'];
