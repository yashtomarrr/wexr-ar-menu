/**
 * Lightweight credential auth for the restaurant panel.
 *
 * Model: WeXR hands each restaurant ONE id + password. We validate it on the
 * server and set an httpOnly, HMAC-signed session cookie. Middleware verifies
 * that cookie before allowing /dashboard or /admin. The password is never sent
 * to the client and the cookie value is unguessable without AUTH_SECRET.
 *
 * Uses Web Crypto (crypto.subtle) so it runs in BOTH the Edge middleware and
 * the Node API routes. To upgrade to multi-account auth later, swap this for
 * Supabase Auth — only this file + middleware change.
 *
 * Configure via env (see .env.example). Safe demo defaults let it run instantly.
 */
export const SESSION_COOKIE = 'wexr_session';

const enc = new TextEncoder();

function getCreds() {
  return {
    id: process.env.ADMIN_ID || 'admin',
    password: process.env.ADMIN_PASSWORD || 'wexr1234',
    secret: process.env.AUTH_SECRET || 'wexr-dev-secret-change-me',
  };
}

async function hmacHex(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Deterministic session token derived from the configured credentials. */
export async function expectedToken(): Promise<string> {
  const { id, password, secret } = getCreds();
  return hmacHex(`${id}:${password}`, secret);
}

/** Check a submitted id/password against the configured credentials. */
export function verifyCredentials(id: string, password: string): boolean {
  const c = getCreds();
  return id === c.id && password === c.password;
}

/** Validate a session cookie value. */
export async function verifyToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  return token === (await expectedToken());
}
