import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifyCredentials, expectedToken } from '@/lib/auth';

/**
 * POST /api/login  { id, password }
 * Validates the handed-over credentials server-side and sets an httpOnly,
 * signed session cookie. The password never reaches the client bundle.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    password?: string;
  };

  if (!body.id || !body.password || !verifyCredentials(body.id, body.password)) {
    return NextResponse.json({ error: 'Invalid ID or password' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await expectedToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12, // 12 hours
  });
  return res;
}
