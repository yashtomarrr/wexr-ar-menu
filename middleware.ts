import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SESSION_COOKIE, verifyToken } from '@/lib/auth';

/**
 * Route guard for the restaurant panel. Any request to /dashboard or /admin
 * must carry a valid session cookie; otherwise it's redirected to /login
 * (preserving the intended destination in ?from=). The customer-facing menu
 * (/, /menu, /ar/...) stays public.
 */
export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (await verifyToken(token)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('from', req.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
