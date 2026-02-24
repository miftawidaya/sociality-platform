export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FEED: '/feed',
  PROFILE: '/me',
} as const;

export const AUTH_ONLY_ROUTES: Set<string> = new Set([
  ROUTES.LOGIN,
  ROUTES.REGISTER,
]);

export const PROTECTED_ROUTES: Set<string> = new Set([
  ROUTES.HOME,
  ROUTES.FEED,
  ROUTES.PROFILE,
]);

export const PROTECTED_PREFIXES: readonly string[] = ['/me/'];
