import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
  ROUTES,
  AUTH_ONLY_ROUTES,
  PROTECTED_ROUTES,
  PROTECTED_PREFIXES,
} from '@/config/routes';

function isValidJwtStructure(token: string): boolean {
  return /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/.test(token);
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const rawToken = request.cookies.get('token')?.value;
  const hasValidToken = rawToken && isValidJwtStructure(rawToken);

  const isProtectedPath =
    PROTECTED_ROUTES.has(pathname) ||
    PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  const isAuthOnlyPath = AUTH_ONLY_ROUTES.has(pathname);

  if (isProtectedPath && !hasValidToken) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthOnlyPath && hasValidToken) {
    return NextResponse.redirect(new URL(ROUTES.FEED, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
